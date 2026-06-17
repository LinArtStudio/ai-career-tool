-- AI求职工具 数据库Schema
-- 在 Supabase SQL Editor 中执行

-- 用户扩展信息
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  major TEXT,
  graduation_year INT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'paid_monthly', 'paid_quarterly')),
  plan_expires_at TIMESTAMPTZ,
  total_credits INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 使用记录
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL CHECK (feature IN ('resume', 'interview', 'career')),
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 简历诊断结果
CREATE TABLE IF NOT EXISTS resume_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text TEXT,
  score INT CHECK (score >= 0 AND score <= 100),
  dimensions JSONB,
  suggestions JSONB,
  optimized_lines JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 模拟面试会话
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT,
  questions JSONB,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  total_score INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 面试回答
CREATE TABLE IF NOT EXISTS interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_id TEXT,
  question_text TEXT,
  answer_text TEXT,
  score INT,
  evaluation JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 职业规划结果
CREATE TABLE IF NOT EXISTS career_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_data JSONB,
  plan_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 支付记录
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2),
  plan TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT,
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LLM缓存（节省API成本）
CREATE TABLE IF NOT EXISTS llm_cache (
  cache_key TEXT PRIMARY KEY,
  result TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分析事件
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_date ON usage_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_resume_results_user ON resume_results(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON interview_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_llm_cache_expires ON llm_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event, created_at);

-- RLS 策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view own usage" ON usage_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own resume results" ON resume_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own sessions" ON interview_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own answers" ON interview_answers FOR ALL USING (
  session_id IN (SELECT id FROM interview_sessions WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view own career plans" ON career_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payments" ON payments FOR ALL USING (auth.uid() = user_id);
-- llm_cache 和 analytics_events 使用服务端访问，不需要RLS

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 注册时自动创建 user_profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, nickname)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
