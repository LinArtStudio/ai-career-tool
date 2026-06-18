#!/bin/bash
# AI求职工具 · 一键部署脚本
# 在阿里云/腾讯云服务器上执行
set -e

echo "🚀 AI求职工具部署开始..."
echo ""

# 1. 安装 Node.js 20
echo "📦 [1/6] 安装 Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
apt-get install -y nodejs > /dev/null 2>&1
echo "  ✅ Node.js $(node -v)"

# 2. 安装 PM2 和 Nginx
echo "📦 [2/6] 安装 PM2 + Nginx..."
npm install -g pm2 > /dev/null 2>&1
apt-get install -y nginx > /dev/null 2>&1
echo "  ✅ PM2 + Nginx 已安装"

# 3. 安装项目依赖
echo "📦 [3/6] 安装项目依赖..."
cd /opt/ai-career-tool
npm install --production > /dev/null 2>&1
echo "  ✅ 依赖安装完成"

# 4. 配置环境变量
echo "⚙️  [4/6] 配置环境变量..."
cat > .env.local << 'ENVEOF'
LLM_API_URL=https://token-plan-cn.xiaomimimo.com/v1/chat/completions
LLM_API_KEY=tp-cytowdeu4z4w7ibcogb4mg9rr5ltu1era3tpk3fvk4l9yrrt
# 5. 构建并启动
echo "🔨 [5/6] 构建项目..."
npm run build > /dev/null 2>&1
echo "  ✅ 构建完成"

echo "🚀 [6/6] 启动服务..."
pm2 delete ai-career 2>/dev/null || true
pm2 start npm --name "ai-career" -- start
pm2 save > /dev/null 2>&1
pm2 startup > /dev/null 2>&1

# 6. 配置 Nginx
echo "🌐 配置 Nginx..."
cat > /etc/nginx/sites-available/ai-career << 'NGINX'
server {
    listen 80;
    server_name _;
    
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/ai-career /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t > /dev/null 2>&1
systemctl restart nginx

echo ""
echo "============================================"
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址: http://$(curl -s ifconfig.me 2>/dev/null || echo '你的公网IP')"
echo ""
echo "📋 常用命令:"
echo "  查看日志: pm2 logs ai-career"
echo "  重启服务: pm2 restart ai-career"
echo "  查看状态: pm2 status"
echo "============================================"
