# Creem支付集成指南

## 概述

Creem 是专为开发者设计的全球支付平台（Merchant of Record），处理支付、税务合规、退款等所有问题。

## 为什么选择 Creem？

| 优势 | 说明 |
|------|------|
| **费率低** | 3.9% + $0.40/笔，无月费 |
| **全球覆盖** | 190+ 国家/地区 |
| **税务合规** | 自动处理 VAT/GST/销售税 |
| **开发者友好** | TypeScript SDK、Next.js 适配器 |
| **AI原生** | 首个支持 AI Agent 接入的支付平台 |
| **中国大陆友好** | 支持支付宝收款（即将推出） |

## 快速开始

### 1. 注册账号

访问 [creem.io](https://creem.io) 注册免费账号（无需信用卡）。

### 2. 获取 API Key

登录后，在 Settings → API Keys 获取：
- 测试环境：`creem_test_...`
- 生产环境：`creem_...`

### 3. 配置环境变量

在 `.env.local` 中添加：

```bash
# Creem支付配置
CREEM_API_KEY=creem_test_your_api_key_here
CREEM_BASE_URL=https://api.creem.io/v1
CREEM_WEBHOOK_SECRET=your_webhook_secret_here

# 产品ID（在Creem Dashboard创建产品后获取）
CREEM_PRODUCT_RESUME_REWRITE=prod_xxx
CREEM_PRODUCT_RESUME_GENERATE=prod_xxx
CREEM_PRODUCT_INTERVIEW_FULL=prod_xxx
CREEM_PRODUCT_COVER_LETTER=prod_xxx
CREEM_PRODUCT_SPRINT_WEEKLY=prod_xxx
CREEM_PRODUCT_SPRINT_MONTHLY=prod_xxx
CREEM_PRODUCT_SPRINT_QUARTERLY=prod_xxx
CREEM_PRODUCT_LIFETIME=prod_xxx

# 应用URL
NEXT_PUBLIC_APP_URL=https://ai-career-tool.vercel.app
```

### 4. 创建产品

在 Creem Dashboard 或使用 CLI 创建产品：

```bash
# 安装 Creem CLI
brew tap armitage-labs/creem
brew install creem

# 登录
creem login --api-key creem_test_YOUR_KEY

# 创建产品
creem products create --name "AI改简历" --price 990 --currency USD --billing-type one-time
creem products create --name "冲刺卡-月卡" --price 3990 --currency USD --billing-type recurring --billing-period every-month
```

### 5. 配置 Webhook

在 Creem Dashboard → Webhooks 添加：

```
URL: https://your-domain.com/api/payment/webhook
Events: checkout.completed, payment.success, subscription.cancelled
```

## 支付流程

```
用户点击购买 → 调用API创建结账 → 跳转Creem支付页 → 用户完成支付 → Webhook回调 → 更新用户权限
```

## 代码结构

```
lib/payment/
├── creem.ts          # Creem SDK封装
└── ...

app/api/payment/
├── checkout/
│   └── route.ts      # 创建结账会话
└── webhook/
    └── route.ts      # Webhook处理

app/payment/
├── success/
│   └── page.tsx      # 支付成功页
└── cancel/
    └── page.tsx      # 支付取消页

app/pricing/
└── page.tsx          # 定价页面
```

## 支持的支付方式

| 支付方式 | 状态 |
|----------|------|
| Visa | ✅ 支持 |
| Mastercard | ✅ 支持 |
| American Express | ✅ 支持 |
| PayPal | ✅ 支持 |
| Apple Pay | ✅ 支持 |
| Google Pay | ✅ 支持 |
| 支付宝 | 🔜 即将支持 |
| 微信支付 | 🔜 即将支持 |

## 测试支付

使用 Creem 测试环境：

```bash
# 测试卡号
Card: 4242 4242 4242 4242
Exp: 任意未来日期
CVC: 任意3位数字
```

## 生产部署

1. 切换到生产环境 API Key
2. 更新产品 ID
3. 配置生产环境 Webhook
4. 测试完整支付流程

## 常见问题

### Q: 如何处理退款？

A: 在 Creem Dashboard → Orders 中找到订单，点击 Refund。

### Q: 如何查看收入？

A: 在 Creem Dashboard → Revenue 查看详细收入报表。

### Q: 支持哪些货币？

A: 支持 USD、EUR、GBP、CNY 等 130+ 种货币。

### Q: 如何处理税务？

A: Creem 作为 MoR 自动处理全球税务，你无需操心。

## 相关链接

- [Creem 官网](https://creem.io)
- [Creem 文档](https://docs.creem.io)
- [Creem Dashboard](https://dashboard.creem.io)
- [Creem GitHub](https://github.com/armitage-labs/creem)

## 技术支持

- Creem 官方：support@creem.io
- 项目客服：ai-career-tool（微信）
