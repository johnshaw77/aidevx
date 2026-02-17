#!/bin/bash

# Docker 環境檢查腳本

echo "🐳 檢查 Docker 環境"
echo "==================="

# 檢查 Docker 是否安裝
echo "📦 1. 檢查 Docker 安裝狀態..."
if command -v docker &> /dev/null; then
    echo "✅ Docker 已安裝"
    docker --version
else
    echo "❌ Docker 未安裝"
    echo "需要安裝 Docker"
fi

echo ""

# 檢查 Docker Compose
echo "📦 2. 檢查 Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose 已安裝 (V1)"
    docker-compose --version
elif docker compose version &> /dev/null; then
    echo "✅ Docker Compose 已安裝 (V2 內建)"
    docker compose version
else
    echo "❌ Docker Compose 未安裝"
fi

echo ""

# 檢查 Docker 服務狀態
echo "🔧 3. 檢查 Docker 服務狀態..."
if systemctl is-active --quiet docker; then
    echo "✅ Docker 服務正在運行"
else
    echo "⚠️  Docker 服務未運行，嘗試啟動..."
    sudo systemctl start docker
    if systemctl is-active --quiet docker; then
        echo "✅ Docker 服務啟動成功"
    else
        echo "❌ Docker 服務啟動失敗"
    fi
fi

echo ""

# 檢查用戶權限
echo "👤 4. 檢查用戶權限..."
if groups $USER | grep -q docker; then
    echo "✅ 當前用戶已在 docker 組中"
else
    echo "⚠️  當前用戶不在 docker 組中"
    echo "運行: sudo usermod -aG docker $USER"
    echo "然後重新登錄"
fi

echo ""

# 測試 Docker 運行
echo "🧪 5. 測試 Docker 運行..."
if docker info &> /dev/null; then
    echo "✅ Docker 可以正常運行"
    echo "嘗試運行測試容器..."
    if docker run --rm hello-world &> /dev/null; then
        echo "✅ Docker 容器運行正常"
    else
        echo "⚠️  Docker 容器運行有問題"
    fi
else
    echo "❌ Docker 無法運行（可能是權限問題）"
fi

echo ""

# 系統資源檢查
echo "💾 6. 系統資源檢查..."
echo "內存使用情況:"
free -h

echo ""
echo "硬碟空間:"
df -h /

echo ""
echo "系統信息:"
lsb_release -a 2>/dev/null || cat /etc/os-release

echo ""
echo "🎯 總結"
echo "======="

# 判斷是否可以運行 Vue + FastAPI Todo
docker_ok=false
compose_ok=false

if command -v docker &> /dev/null && docker info &> /dev/null; then
    docker_ok=true
fi

if command -v docker-compose &> /dev/null || docker compose version &> /dev/null 2>&1; then
    compose_ok=true
fi

if [ "$docker_ok" = true ] && [ "$compose_ok" = true ]; then
    echo "🎉 環境完整！可以運行 Vue + FastAPI Todo App"
    echo ""
    echo "📝 下一步："
    echo "1. git clone your-repo"
    echo "2. cd vue-fastapi-todo"
    echo "3. ./start.sh"
    echo ""
    echo "🌐 服務將運行在："
    echo "- 前端: http://your-server-ip"
    echo "- 後端: http://your-server-ip:8000"
else
    echo "⚠️  環境不完整，需要安裝/配置："
    if [ "$docker_ok" = false ]; then
        echo "- Docker Engine"
    fi
    if [ "$compose_ok" = false ]; then
        echo "- Docker Compose"
    fi
fi