#!/bin/bash

# Vue + FastAPI Todo App 啟動腳本

echo "🚀 啟動 Vue + FastAPI Todo App"
echo "================================"

# 檢查 Docker 是否安裝
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安裝，請先安裝 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安裝，請先安裝 Docker Compose"
    exit 1
fi

# 創建數據目錄
mkdir -p data

echo "📦 構建並啟動容器..."
docker-compose up --build -d

echo ""
echo "⏳ 等待服務啟動..."
sleep 10

echo ""
echo "✅ 服務已啟動！"
echo ""
echo "📱 前端訪問地址: http://localhost"
echo "🔧 後端 API: http://localhost:8000"  
echo "📖 API 文檔: http://localhost:8000/docs"
echo ""
echo "📊 查看日誌: docker-compose logs -f"
echo "🛑 停止服務: docker-compose down"
echo ""
echo "🎉 享受您的 Todo App！"