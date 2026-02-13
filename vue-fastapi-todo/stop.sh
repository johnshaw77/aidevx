#!/bin/bash

# Vue + FastAPI Todo App 停止腳本

echo "🛑 停止 Vue + FastAPI Todo App"
echo "==============================="

# 停止所有服務
docker-compose down

echo ""
echo "✅ 所有服務已停止"
echo ""
echo "🔄 重新啟動: ./start.sh"
echo "🗑️  清除數據: ./clean.sh"