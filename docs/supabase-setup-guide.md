# Supabase配置指南

## 第一步：注册Supabase账号

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用GitHub账号登录（推荐）

## 第二步：创建项目

1. 点击 "New Project"
2. 填写项目信息：
   - **Organization**: 选择或创建组织
   - **Project name**: ai-career-tool
   - **Database Password**: 设置强密码（记住！）
   - **Region**: Northeast Asia (Tokyo) - 最接近中国
3. 点击 "Create new project"
4. 等待2-3分钟创建完成

## 第三步：获取API信息

1. 进入项目后，点击左侧 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: https://xxx.supabase.co
   - **anon/public key**: eyJxxx...

## 第四步：执行数据库Schema

1. 点击左侧 "SQL Editor"
2. 点击 "New query"
3. 复制 supabase/schema.sql 的内容
4. 点击 "Run" 执行

## 第五步：配置环境变量

在Vercel和阿里云服务器添加以下环境变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

## 第六步：验证配置

1. 访问 https://ai-career-tool.vercel.app
2. 测试登录功能
3. 测试数据保存功能

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

- 数据库Schema: supabase/schema.sql
- 环境变量示例: .env.example
- Supabase客户端: lib/supabase.ts
