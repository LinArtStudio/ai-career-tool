#!/bin/bash
# ============================================
# AI求职工具 · 阿里云一键部署脚本
# 服务器：Ubuntu 22.04, 2核2G
# ============================================

set -e  # 遇到错误立即停止

echo "=========================================="
echo "  AI求职工具 · 服务器部署脚本"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}请使用root用户运行此脚本${NC}"
  echo "运行: sudo bash deploy.sh"
  exit 1
fi

echo ""
echo -e "${YELLOW}[1/8] 更新系统...${NC}"
apt-get update -y > /dev/null 2>&1
apt-get upgrade -y > /dev/null 2>&1
echo -e "${GREEN}✅ 系统更新完成${NC}"

echo ""
echo -e "${YELLOW}[2/8] 安装Node.js 20...${NC}"
if command -v node &> /dev/null; then
  echo "  Node.js已安装: $(node -v)"
else
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
  apt-get install -y nodejs > /dev/null 2>&1
  echo -e "${GREEN}✅ Node.js $(node -v) 安装完成${NC}"
fi

echo ""
echo -e "${YELLOW}[3/8] 安装PM2和Nginx...${NC}"
npm install -g pm2 > /dev/null 2>&1
apt-get install -y nginx > /dev/null 2>&1
echo -e "${GREEN}✅ PM2 + Nginx 安装完成${NC}"

echo ""
echo -e "${YELLOW}[4/8] 创建项目目录...${NC}"
mkdir -p /opt/ai-career-tool
cd /opt/ai-career-tool
echo -e "${GREEN}✅ 项目目录: /opt/ai-career-tool${NC}"

echo ""
echo -e "${YELLOW}[5/8] 配置环境变量...${NC}"
cat > /opt/ai-career-tool/.env.local << 'ENVEOF'
LLM_API_URL=https://token-plan-cn.xiaomimimo.com/v1/chat/completions
LLM_API_KEY=your-api-key-here
NODE_ENV=production
PORT=3000
ENVEOF
echo -e "${GREEN}✅ 环境变量配置完成${NC}"
echo -e "${YELLOW}⚠️  请编辑 /opt/ai-career-tool/.env.local 填入正确的API Key${NC}"

echo ""
echo -e "${YELLOW}[6/8] 配置Nginx...${NC}"
cat > /etc/nginx/sites-available/ai-career << 'NGINX'
server {
    listen 80;
    server_name _;
    
    client_max_body_size 10M;
    
    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 静态资源缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # API路由
    location /api/ {
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
    
    # 其他路由
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
    }
}
NGINX

ln -sf /etc/nginx/sites-available/ai-career /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t > /dev/null 2>&1
systemctl restart nginx
systemctl enable nginx > /dev/null 2>&1
echo -e "${GREEN}✅ Nginx配置完成${NC}"

echo ""
echo -e "${YELLOW}[7/8] 配置防火墙...${NC}"
ufw allow 22/tcp > /dev/null 2>&1
ufw allow 80/tcp > /dev/null 2>&1
ufw allow 443/tcp > /dev/null 2>&1
ufw --force enable > /dev/null 2>&1
echo -e "${GREEN}✅ 防火墙配置完成${NC}"

echo ""
echo -e "${YELLOW}[8/8] 配置PM2开机自启...${NC}"
pm2 startup > /dev/null 2>&1
echo -e "${GREEN}✅ PM2开机自启配置完成${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}✅ 服务器环境配置完成！${NC}"
echo ""
echo "下一步："
echo "1. 上传代码到 /opt/ai-career-tool/"
echo "2. 运行 npm install"
echo "3. 运行 npm run build"
echo "4. 运行 pm2 start npm --name 'ai-career' -- start"
echo "5. 运行 pm2 save"
echo ""
echo "服务器IP: $(curl -s ifconfig.me 2>/dev/null || echo '请手动查看')"
echo "=========================================="
