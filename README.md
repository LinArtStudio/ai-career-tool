# 🚀 AI时代求职训练平台

帮助所有求职者掌握AI时代必备技能，提升求职竞争力

**产品定位**：AI时代求职训练平台  
**目标用户**：AI相关岗位、AI+传统岗位、所有传统岗位求职者  
**技术栈**: Next.js 14 + Tailwind CSS + LLM API  
**月成本**: ¥5~10（LLM API调用费）  
**部署**: 阿里云ECS + Vercel

---

## 核心功能

### 🎯 AI职业竞争力测评（免费）
- 5分钟了解你的AI能力水平
- 5个维度：AI工具使用、AI思维认知、AI产品设计、AI技术理解、AI项目经验
- 个性化学习路径推荐

### 📝 AI简历生成器
- 针对JD定制简历
- ATS优化
- STAR法则描述
- 关键词优化

### 🎯 JD智能匹配诊断
- 多维度匹配评分（技能、经验、教育、软技能）
- 精准差距分析
- 面试问题预测（独家功能）
- 针对性简历优化建议

### 🎤 AI模拟面试
- 150+大厂真题
- AI评估 + 面试官视角反馈
- 面试问题预测
- 进度追踪

### 📊 学习仪表盘
- 每日签到 + 练习打卡
- 积分系统 + 成就系统
- 学习进度追踪

### 💎 定价方案
- 免费版：每天3次基础功能
- 单次付费：¥9.9-19.9/次
- 冲刺卡：¥19.9-99.9
- 终身会员：¥199

---

## 技术架构

```
前端：Next.js 14 + TypeScript + Tailwind CSS
后端：Next.js API Routes
数据库：Supabase (PostgreSQL)
AI模型：GLM-4-Flash (智谱AI)
部署：阿里云ECS + Vercel
```

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的配置

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

---

## 部署指南

### 阿里云ECS部署

```bash
# 1. SSH登录服务器
ssh root@your-server-ip

# 2. 克隆代码
cd /opt
git clone https://github.com/LinArtStudio/ai-career-tool.git
cd ai-career-tool

# 3. 安装依赖
npm install

# 4. 配置环境变量
nano .env.local
# 填入你的配置

# 5. 构建项目
npm run build

# 6. 启动服务
pm2 start npm --name "ai-career" -- start
pm2 save
pm2 startup
```

### Vercel部署

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署
vercel --prod
```

---

## 环境变量

```bash
# LLM API配置
LLM_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
LLM_API_KEY=your-api-key
LLM_MODEL=glm-4-flash

# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
PORT=3000
```

---

## 项目结构

```
ai-career-tool/
├── app/                    # Next.js App Router
│   ├── api/                # API路由
│   ├── quiz/               # 免费测评
│   ├── resume-generator/   # AI简历生成器
│   ├── jd-match-v2/        # JD智能诊断
│   ├── interview/          # 模拟面试
│   ├── dashboard/          # 学习仪表盘
│   ├── pricing/            # 定价页面
│   └── ...
├── lib/                    # 核心库
│   ├── llm/                # LLM调用
│   ├── supabase.ts         # Supabase配置
│   ├── auth.ts             # 用户认证
│   └── ...
├── components/             # React组件
├── public/                 # 静态资源
└── docs/                   # 文档
```

---

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 许可证

MIT License

---

## 联系我们

- **客服微信**：ai-career-tool
- **客服邮箱**：support@ai-career-tool.com
- **官网**：https://ai-career-tool.vercel.app

---

## 致谢

感谢所有为这个项目做出贡献的人！
