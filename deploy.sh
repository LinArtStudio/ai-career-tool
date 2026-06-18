#!/bin/bash
# AI求职工具 · 一键部署脚本
# 在腾讯云服务器上执行

set -e

echo "🚀 AI求职工具部署开始..."
echo ""

# 1. 安装 Node.js 20
echo "📦 安装 Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
echo "✅ Node.js $(node -v) installed"

# 2. 安装 PM2
echo "📦 安装 PM2..."
sudo npm install -g pm2
echo "✅ PM2 installed"

# 3. 克隆项目（替换为你的GitHub仓库地址）
echo "📥 克隆项目..."
cd /home/ubuntu
# git clone https://github.com/YOUR_USERNAME/ai-career-tool.git
# cd ai-career-tool

# 或者直接上传项目文件到 /home/ubuntu/ai-career-tool/

# 4. 安装依赖
echo "📦 安装依赖..."
npm install

# 5. 配置环境变量
echo "⚙️ 配置环境变量..."
cat > .env.local << 'ENVEOF'
LLM_API_URL=https://token-plan-cn.xiaomimimo.com/v1/chat/completions
LLM_API_KEY=YOUR_API_KEY_HERE
LLM_MODEL=mimo-v2.5-pro
NEXT_PUBLIC_APP_URL=http://YOUR_SERVER_IP
ENVEOF

# 6. 构建
echo "🔨 构建项目..."
npm run build

# 7. 启动
echo "🚀 启动服务..."
pm2 delete ai-career 2>/dev/null || true
pm2 start npm --name "ai-career" -- start
pm2 save
pm2 startup

# 8. 安装 Nginx
echo "🌐 配置 Nginx..."
sudo apt install -y nginx

sudo tee /etc/nginx/sites-available/ai-career > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/ai-career /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo ""
echo "============================================"
echo "✅ 部署完成！"
echo ""
echo "访问地址: http://YOUR_SERVER_IP"
echo ""
echo "查看日志: pm2 logs ai-career"
echo "重启服务: pm2 restart ai-career"
echo "============================================"
