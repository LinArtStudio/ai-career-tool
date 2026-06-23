-- ============================================
-- AI求职工具数据库Schema
-- 数据库：Supabase (PostgreSQL)
-- ============================================

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. 用户资料表
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  nickname TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  total_interviews INTEGER DEFAULT 0,
  total_resumes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_premium ON user_profiles(is_premium);

-- ============================================
-- 2. 面试记录表
-- ============================================
CREATE TABLE IF NOT EXISTS interview_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  company TEXT,
  position TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  strengths TEXT[],
  weaknesses TEXT[],
  improved_answer TEXT,
  key_points TEXT[],
  interviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_interview_records_user_id ON interview_records(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_records_company ON interview_records(company);
CREATE INDEX IF NOT EXISTS idx_interview_records_position ON interview_records(position);
CREATE INDEX IF NOT EXISTS idx_interview_records_score ON interview_records(score);
CREATE INDEX IF NOT EXISTS idx_interview_records_created_at ON interview_records(created_at DESC);

-- ============================================
-- 3. 简历记录表
-- ============================================
CREATE TABLE IF NOT EXISTS resume_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  summary TEXT,
  dimensions JSONB NOT NULL,
  issues JSONB,
  optimized_lines JSONB,
  comparison TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_resume_records_user_id ON resume_records(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_records_score ON resume_records(score);
CREATE INDEX IF NOT EXISTS idx_resume_records_created_at ON resume_records(created_at DESC);

-- ============================================
-- 4. 使用限制表（记录每日使用次数）
-- ============================================
CREATE TABLE IF NOT EXISTS usage_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, feature, date)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_usage_limits_user_id ON usage_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_limits_feature ON usage_limits(feature);
CREATE INDEX IF NOT EXISTS idx_usage_limits_date ON usage_limits(date);

-- ============================================
-- 5. 付费记录表
-- ============================================
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'wechat',
  payment_screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_payment_records_user_id ON payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_status ON payment_records(status);

-- ============================================
-- 6. RLS策略（Row Level Security）
-- ============================================

-- 启用RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- 用户资料：用户只能读写自己的资料
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 面试记录：用户只能读写自己的记录
CREATE POLICY "Users can view own interviews" ON interview_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interviews" ON interview_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 简历记录：用户只能读写自己的记录
CREATE POLICY "Users can view own resumes" ON resume_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resume_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 使用限制：用户只能读写自己的记录
CREATE POLICY "Users can view own usage" ON usage_limits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON usage_limits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON usage_limits
  FOR UPDATE USING (auth.uid() = user_id);

-- 付费记录：用户只能读自己的记录
CREATE POLICY "Users can view own payments" ON payment_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON payment_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. 触发器：自动更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. 视图：用户统计
-- ============================================
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id as user_id,
  u.nickname,
  u.is_premium,
  COUNT(DISTINCT i.id) as total_interviews,
  COUNT(DISTINCT r.id) as total_resumes,
  COALESCE(AVG(i.score), 0) as avg_interview_score,
  COALESCE(AVG(r.score), 0) as avg_resume_score,
  COUNT(DISTINCT CASE WHEN i.created_at > NOW() - INTERVAL '7 days' THEN i.id END) as week_interviews,
  COUNT(DISTINCT CASE WHEN r.created_at > NOW() - INTERVAL '7 days' THEN r.id END) as week_resumes
FROM user_profiles u
LEFT JOIN interview_records i ON u.id = i.user_id
LEFT JOIN resume_records r ON u.id = r.user_id
GROUP BY u.id, u.nickname, u.is_premium;

-- ============================================
-- 9. 函数：检查使用限制
-- ============================================
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id UUID,
  p_feature TEXT,
  p_limit INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
  v_is_premium BOOLEAN;
BEGIN
  -- 检查是否为付费用户
  SELECT is_premium INTO v_is_premium
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- 付费用户无限制
  IF v_is_premium THEN
    RETURN TRUE;
  END IF;
  
  -- 获取今日使用次数
  SELECT count INTO v_count
  FROM usage_limits
  WHERE user_id = p_user_id
    AND feature = p_feature
    AND date = CURRENT_DATE;
  
  -- 检查是否超限
  IF v_count IS NULL OR v_count < p_limit THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. 函数：增加使用次数
-- ============================================
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_feature TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_limits (user_id, feature, date, count)
  VALUES (p_user_id, p_feature, CURRENT_DATE, 1)
  ON CONFLICT (user_id, feature, date)
  DO UPDATE SET count = usage_limits.count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 完成！
-- ============================================
