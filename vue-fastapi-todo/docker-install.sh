#!/bin/bash

# Docker 安裝腳本 - 適用於 Ubuntu/Debian

echo "🐳 開始安裝 Docker 和 Docker Compose"
echo "=================================="

# 檢查是否為 root 用戶
if [ "$EUID" -ne 0 ]; then 
    echo "❌ 請使用 sudo 權限執行此腳本"
    echo "使用方法: sudo bash docker-install.sh"
    exit 1
fi

# 更新軟件包
echo "📦 更新軟件包..."
apt update

# 安裝必要工具
echo "🔧 安裝必要工具..."
apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加 Docker 官方 GPG 密鑰
echo "🔑 添加 Docker GPG 密鑰..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加 Docker 倉庫
echo "📚 添加 Docker 倉庫..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# 更新軟件包索引
apt update

# 安裝 Docker Engine
echo "🐳 安裝 Docker Engine..."
apt install -y docker-ce docker-ce-cli containerd.io

# 啟動 Docker 服務
echo "🚀 啟動 Docker 服務..."
systemctl start docker
systemctl enable docker

# 安裝 Docker Compose V2
echo "📦 安裝 Docker Compose..."
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d'"' -f4)
curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 創建 docker 用戶組並添加當前用戶（如果不是通過 sudo 執行）
if [ "$SUDO_USER" ]; then
    echo "👥 添加用戶到 docker 組..."
    usermod -aG docker $SUDO_USER
    echo "⚠️  請重新登錄以使 docker 組權限生效"
fi

# 驗證安裝
echo ""
echo "✅ Docker 安裝完成！"
echo ""
echo "📋 版本信息:"
docker --version
docker-compose --version

echo ""
echo "🎯 測試 Docker："
docker run hello-world

echo ""
echo "🎉 安裝成功！現在可以運行 Vue + FastAPI Todo App"
echo ""
echo "📝 下一步:"
echo "1. 如果不是 root 用戶，請重新登錄"
echo "2. cd vue-fastapi-todo"
echo "3. ./start.sh"
echo ""