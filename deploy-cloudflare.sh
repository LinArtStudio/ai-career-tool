#!/bin/bash
echo "🚀 部署到 Cloudflare Pages..."
echo ""

# Step 1: Login
echo "Step 1: 登录 Cloudflare"
npx wrangler login

# Step 2: Create project and deploy
echo ""
echo "Step 2: 部署项目"
npx wrangler pages project create ai-career-tool --production-branch main 2>/dev/null

# Step 3: Set env vars
echo ""
echo "Step 3: 设置环境变量"
npx wrangler pages secret put LLM_API_URL --project-name ai-career-tool <<< "https://token-plan-cn.xiaomimimo.com/v1/chat/completions"
npx wrangler pages secret put LLM_API_KEY --project-name ai-career-tool <<< "$(grep LLM_API_KEY .env.local | cut -d'=' -f2-)"
npx wrangler pages secret put LLM_MODEL --project-name ai-career-tool <<< "mimo-v2.5-pro"

# Step 4: Build and deploy
echo ""
echo "Step 4: 构建并部署"
npm run build
npx wrangler pages deploy .vercel/output/static --project-name ai-career-tool

echo ""
echo "✅ 部署完成！"
