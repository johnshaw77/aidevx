#!/bin/bash

# Vue + FastAPI Todo App 清理腳本

echo "🗑️ 清理 Vue + FastAPI Todo App"
echo "==============================="

read -p "確定要清除所有數據和鏡像嗎？(y/N): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo ""
    echo "🛑 停止所有服務..."
    docker-compose down

    echo "🗑️ 清除容器和鏡像..."
    docker-compose down --rmi all --volumes --remove-orphans

    echo "📁 清除數據文件..."
    rm -rf data/*.db

    echo ""
    echo "✅ 清理完成！"
    echo "🚀 重新開始: ./start.sh"
else
    echo "❌ 已取消清理操作"
fi