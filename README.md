# 🚀 AI求职工具

用AI帮你搞定求职全流程：简历诊断 · 模拟面试 · 职业规划

**技术栈**: Next.js 14 + Tailwind CSS + 小米MiMo API
**月成本**: ¥5~10（LLM API调用费）
**部署**: Vercel免费层

---

## 一键启动

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量（已配置小米API）
cp .env.local.example .env.local
# 编辑 .env.local 填入你的 API Key

# 3. 启动
npm run dev
# 访问 http://localhost:3000
```

## 部署到 Vercel（3步）

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录（会打开浏览器）
vercel login

# 3. 部署
cd ai-career-tool
vercel --prod

# 4. 设置环境变量
vercel env add LLM_API_URL
# 输入: https://token-plan-cn.xiaomimimo.com/v1/chat/completions

vercel env add LLM_API_KEY
# 输入: 你的小米API Key

vercel env add LLM_MODEL
# 输入: mimo-v2.5-pro

# 5. 重新部署（使环境变量生效）
vercel --prod
```

部署完成后会得到一个 `https://xxx.vercel.app` 的公网地址。

## 功能模块

| 功能 | 页面 | API | 说明 |
|------|------|-----|------|
| 落地页 | `/` | — | 产品介绍+CTA |
| 简历诊断 | `/resume` | `/api/demo/resume` | 上传PDF→5维度评分+优化建议 |
| 模拟面试 | `/interview` | `/api/demo/interview` | 输入岗位→生成题→AI评估回答 |
| 职业规划 | `/career` | `/api/demo/career` | 输入专业→3条职业路径+学习计划 |
| 定价 | `/pricing` | — | 免费版/月卡/季卡 |
| 用户中心 | `/dashboard` | `/api/auth/*` | 登录/注册 |

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `LLM_API_URL` | ✅ | 小米API地址 |
| `LLM_API_KEY` | ✅ | 小米API Key |
| `LLM_MODEL` | ✅ | 模型名 mimo-v2.5-pro |
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ | Supabase（可选） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ | Supabase（可选） |

## 项目结构

```
├── app/
│   ├── api/demo/          # Demo API（无需认证）
│   │   ├── resume/        # 简历分析
│   │   ├── interview/     # 面试生成+评估
│   │   └── career/        # 职业规划
│   ├── resume/            # 简历诊断页面
│   ├── interview/         # 模拟面试页面
│   ├── career/            # 职业规划页面
│   ├── pricing/           # 定价页面
│   └── dashboard/         # 用户中心
├── lib/
│   ├── llm/deepseek.ts    # LLM API封装（小米/DeepSeek）
│   ├── llm/prompts.ts     # Prompt模板
│   ├── resume/            # 简历解析+分析
│   ├── interview/         # 面试生成+评估
│   └── career/            # 职业规划
├── supabase/schema.sql    # 数据库Schema（可选）
├── vercel.json            # Vercel部署配置
└── .env.local             # 环境变量
```

## License

MIT
