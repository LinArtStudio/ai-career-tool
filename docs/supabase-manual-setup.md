# Supabase数据库配置完整指南

**配置时间**：2026年6月24日  
**配置状态**：待用户手动执行

---

## 第一步：注册Supabase账号

### 1.1 访问Supabase官网

1. 打开浏览器，访问 https://supabase.com
2. 点击右上角 "Start your project" 按钮
3. 选择 "Continue with GitHub"（推荐）
4. 授权Supabase访问你的GitHub账号

### 1.2 创建新项目

1. 登录后，点击 "New Project"
2. 填写项目信息：
   - **Organization**: 选择或创建一个组织
   - **Project name**: `ai-career-tool`
   - **Database Password**: 设置一个强密码（请记住！）
   - **Region**: 选择 "Northeast Asia (Tokyo)" - 最接近中国
3. 点击 "Create new project"
4. 等待2-3分钟，项目创建完成

---

## 第二步：获取API信息

### 2.1 获取Project URL

1. 进入项目后，点击左侧菜单 "Settings" → "API"
2. 找到 "Project URL"，格式为：`https://xxx.supabase.co`
3. 复制这个URL

### 2.2 获取anon/public key

1. 在同一个页面，找到 "Project API keys"
2. 找到 "anon" "public" key
3. 复制这个key（以 `eyJ` 开头）

---

## 第三步：执行数据库Schema

### 3.1 打开SQL编辑器

1. 点击左侧菜单 "SQL Editor"
2. 点击 "New query"

### 3.2 执行Schema

将以下内容复制到SQL编辑器中，然后点击 "Run"：

```sql
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
  payment_method TEXT DEFAULT 'creem',
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
```

---

## 第四步：配置环境变量

### 4.1 在Vercel中配置

1. 访问 https://vercel.com/dashboard
2. 找到 `ai-career-tool` 项目
3. 点击 "Settings" → "Environment Variables"
4. 添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### 4.2 在阿里云服务器中配置

1. SSH登录服务器：`ssh root@114.55.110.19`
2. 编辑环境变量文件：`nano /opt/ai-career-tool/.env.local`
3. 添加以下内容：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

4. 保存并退出：`Ctrl + X` → `Y` → `Enter`

---

## 第五步：验证配置

### 5.1 测试数据库连接

1. 访问 https://ai-career-tool.vercel.app
2. 尝试注册一个新账号
3. 查看Supabase Dashboard → Table Editor → user_profiles
4. 确认用户数据已创建

### 5.2 测试数据持久化

1. 使用模拟面试功能
2. 查看Supabase Dashboard → Table Editor → interview_records
3. 确认面试记录已保存

---

## 常见问题

### Q: Supabase免费版够用吗？

A: 免费版提供：
- 500MB数据库存储
- 1GB文件存储
- 50,000月活用户
- 无限API请求

对于初期运营完全够用。

### Q: 数据库安全吗？

A: Supabase提供：
- 自动备份
- SSL加密
- Row Level Security (RLS)
- SOC2合规

### Q: 如何迁移到付费版？

A: 当用户量超过50,000时，升级到Pro版（$25/月）。

---

## 相关文件

- 数据库Schema: `supabase/schema.sql`
- 环境变量示例: `.env.example`
- Supabase客户端: `lib/supabase.ts`

---

**配置完成时间**：待执行  
**配置状态**：待用户手动执行  
**下一步**：执行完成后，继续优化Prompt设计
