#!/bin/bash

# Vue + FastAPI Todo App 自動部署腳本
# 適用於 DigitalOcean Ubuntu 服務器

set -e  # 遇到錯誤立即退出

echo "🚀 Vue + FastAPI Todo App 自動部署"
echo "=================================="
echo "服務器: $(hostname)"
echo "用戶: $(whoami)"
echo "時間: $(date)"
echo ""

# 1. 檢查並安裝 Docker
echo "🐳 步驟 1: 檢查 Docker 環境"
echo "------------------------"

if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安裝，正在安裝..."
    
    # 更新系統
    sudo apt update
    
    # 安裝 Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    
    # 啟動 Docker 服務
    sudo systemctl start docker
    sudo systemctl enable docker
    
    echo "✅ Docker 安裝完成"
else
    echo "✅ Docker 已安裝: $(docker --version)"
fi

# 檢查 Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
    echo "❌ Docker Compose 未安裝，正在安裝..."
    
    # 安裝 Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    echo "✅ Docker Compose 安裝完成"
else
    echo "✅ Docker Compose 已安裝"
fi

# 添加用戶到 docker 組
if ! groups $USER | grep -q docker; then
    echo "👤 添加用戶到 docker 組..."
    sudo usermod -aG docker $USER
    echo "⚠️  權限已設置，重新登錄後生效"
fi

echo ""

# 2. 下載項目
echo "📦 步驟 2: 下載項目"
echo "----------------"

if [ -d "aidevx" ]; then
    echo "📁 項目目錄已存在，更新中..."
    cd aidevx
    git pull origin main
    cd ..
else
    echo "📁 克隆項目..."
    git clone https://github.com/johnshaw77/aidevx.git
fi

cd aidevx/vue-fastapi-todo

echo ""

# 3. 環境準備
echo "⚙️  步驟 3: 環境準備"
echo "-----------------"

# 創建數據目錄
mkdir -p data

# 設置權限
chmod +x *.sh

echo ""

# 4. 啟動服務
echo "🚀 步驟 4: 啟動服務"
echo "----------------"

# 停止可能運行的舊服務
echo "🛑 停止舊服務..."
docker-compose down --remove-orphans 2>/dev/null || true

# 構建並啟動服務
echo "🏗️  構建並啟動新服務..."
docker-compose up --build -d

echo ""

# 5. 等待服務啟動
echo "⏳ 步驟 5: 等待服務啟動"
echo "-------------------"

echo "等待後端服務啟動..."
for i in {1..30}; do
    if curl -s http://localhost:8000 > /dev/null 2>&1; then
        echo "✅ 後端服務已啟動"
        break
    fi
    echo "⏳ 等待中... ($i/30)"
    sleep 2
done

echo "等待前端服務啟動..."
for i in {1..15}; do
    if curl -s http://localhost > /dev/null 2>&1; then
        echo "✅ 前端服務已啟動"
        break
    fi
    echo "⏳ 等待中... ($i/15)"
    sleep 2
done

echo ""

# 6. 獲取服務器 IP
echo "🌐 步驟 6: 獲取訪問地址"
echo "--------------------"

# 嘗試獲取公網 IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "your-server-ip")

echo ""
echo "🎉 部署完成！"
echo "============="
echo ""
echo "📱 前端訪問地址:"
echo "   http://$PUBLIC_IP"
echo ""
echo "🔧 後端 API 地址:"  
echo "   http://$PUBLIC_IP:8000"
echo ""
echo "📖 API 文檔地址:"
echo "   http://$PUBLIC_IP:8000/docs"
echo ""

# 7. 服務狀態檢查
echo "📊 服務狀態:"
echo "-----------"
docker-compose ps

echo ""
echo "📝 管理命令:"
echo "----------"
echo "查看日誌: docker-compose logs -f"
echo "停止服務: docker-compose down"
echo "重啟服務: docker-compose restart"
echo ""

# 防火牆提醒
echo "🔥 防火牆設置提醒:"
echo "---------------"
echo "如果無法訪問，請檢查防火牆設置："
echo "sudo ufw allow 80"
echo "sudo ufw allow 8000"
echo ""

echo "✨ 享受你的 Todo App！"