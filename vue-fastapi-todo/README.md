# Vue + FastAPI Todo App

一個現代化的全棧 Todo 應用，展示 Vue.js 前端 + FastAPI 後端 + Docker 容器化部署的完整技術棧。

## 🏗️ 技術架構

### 前端 (Frontend)
- **Vue.js 3** - 響應式前端框架
- **Vite** - 快速構建工具
- **Axios** - HTTP 客戶端
- **現代 CSS** - 漸層背景、玻璃質感、響應式設計

### 後端 (Backend)  
- **FastAPI** - 高性能 Python Web 框架
- **SQLAlchemy** - ORM 數據庫操作
- **SQLite** - 輕量級數據庫
- **Pydantic** - 數據驗證和序列化

### 部署 (Deployment)
- **Docker** - 容器化應用
- **Docker Compose** - 多容器編排
- **Nginx** - 反向代理和靜態文件服務

## ✨ 功能特色

### 核心功能
- ✅ **CRUD 操作** - 新增、查看、編輯、刪除待辦事項
- 🔄 **實時同步** - 前後端數據即時更新
- 🔍 **搜索過濾** - 按狀態和關鍵詞搜索
- 📊 **統計面板** - 總計、完成率、進度追蹤

### 進階功能
- ⚡ **批量操作** - 全部完成、清除已完成
- 📝 **內聯編輯** - 雙擊直接編輯
- 📱 **響應式** - 手機、平板完美適配
- 🎨 **現代 UI** - 玻璃質感、漸層背景

### API 功能
- 📋 **RESTful API** - 標準 REST 接口
- 📖 **自動文檔** - Swagger/OpenAPI 文檔
- 🔧 **分頁排序** - 大數據量支持
- ❤️ **健康檢查** - 服務狀態監控

## 🚀 快速開始

### 1. 克隆項目
\`\`\`bash
git clone <repository-url>
cd vue-fastapi-todo
\`\`\`

### 2. Docker Compose 部署（推薦）

#### 生產模式
\`\`\`bash
# 構建並啟動所有服務
docker-compose up --build -d

# 查看日誌
docker-compose logs -f

# 停止服務
docker-compose down
\`\`\`

#### 開發模式
\`\`\`bash
# 啟動開發環境（熱重載）
docker-compose --profile dev up --build

# 後端：http://localhost:8000
# 前端開發：http://localhost:3000
# 前端生產：http://localhost:80
\`\`\`

### 3. 手動開發部署

#### 後端啟動
\`\`\`bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

#### 前端啟動  
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 📡 API 接口

### 主要端點
- \`GET /\` - 服務狀態
- \`GET /docs\` - Swagger 文檔
- \`GET /todos\` - 獲取待辦列表
- \`POST /todos\` - 新增待辦事項
- \`PUT /todos/{id}\` - 更新待辦事項
- \`DELETE /todos/{id}\` - 刪除待辦事項
- \`GET /todos/stats\` - 獲取統計信息

### 批量操作
- \`POST /todos/mark-all-completed\` - 標記全部完成
- \`DELETE /todos/clear-completed\` - 清除已完成

### 查詢參數
- \`skip\` - 分頁偏移
- \`limit\` - 每頁數量  
- \`completed\` - 過濾完成狀態
- \`search\` - 搜索關鍵詞

## 🗂️ 項目結構

\`\`\`
vue-fastapi-todo/
├── frontend/              # Vue.js 前端
│   ├── src/
│   │   ├── App.vue       # 主應用組件
│   │   └── main.js       # 入口文件
│   ├── package.json      # NPM 依賴
│   └── vite.config.js    # Vite 配置
├── backend/               # FastAPI 後端
│   ├── main.py           # 主應用文件
│   ├── models.py         # Pydantic 模型
│   ├── database.py       # 數據庫配置
│   └── requirements.txt  # Python 依賴
├── docker-compose.yml     # 容器編排
├── Dockerfile.frontend    # 前端容器
├── Dockerfile.backend     # 後端容器
├── nginx.conf            # Nginx 配置
└── README.md             # 項目文檔
\`\`\`

## 🔧 環境變量

### 後端環境變量
\`\`\`env
SQLALCHEMY_DATABASE_URL=sqlite:///./data/todos.db
PYTHONPATH=/app
\`\`\`

### 前端環境變量  
\`\`\`env
NODE_ENV=production
VITE_API_URL=http://localhost:8000
\`\`\`

## 📦 部署到生產環境

### 1. 服務器部署
\`\`\`bash
# 在服務器上克隆項目
git clone <repository-url>
cd vue-fastapi-todo

# 創建數據目錄
mkdir -p data

# 啟動生產服務
docker-compose up -d --build

# 設置自動重啟
docker update --restart=unless-stopped todo-frontend todo-backend
\`\`\`

### 2. Nginx 反向代理（可選）
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\`\`\`

## 📊 性能監控

### Docker 資源監控
\`\`\`bash
# 查看容器資源使用
docker stats

# 查看容器日誌
docker-compose logs -f backend
docker-compose logs -f frontend
\`\`\`

### 健康檢查
- 後端：\`http://localhost:8000/\`
- 前端：\`http://localhost/\`
- API 文檔：\`http://localhost:8000/docs\`

## 🛠️ 開發指南

### 添加新功能
1. **後端**：在 \`main.py\` 添加新的 API 端點
2. **前端**：在 \`App.vue\` 添加對應的 UI 和邏輯
3. **測試**：使用 Swagger 文檔測試 API
4. **部署**：重新構建 Docker 鏡像

### 數據庫遷移
\`\`\`python
# 添加新字段到 database.py 的 Todo 模型
# 重啟後端服務，SQLAlchemy 會自動更新表結構
docker-compose restart backend
\`\`\`

## 🎯 下一步計劃

- [ ] 用戶認證和授權
- [ ] 實時通知（WebSocket）
- [ ] 數據導入/導出
- [ ] 定時任務提醒
- [ ] 團隊協作功能
- [ ] PostgreSQL 數據庫升級
- [ ] Redis 緩存層

## 🤝 貢獻指南

1. Fork 本項目
2. 創建功能分支
3. 提交更改
4. 推送到分支  
5. 創建 Pull Request

## 📄 許可證

MIT License - 可自由使用和修改

---

**技術架構展示** 🏗️  
Vue.js 3 + FastAPI + Docker + SQLite = 現代全棧開發

**特色亮點** ✨  
響應式設計 + RESTful API + 容器化部署 + 生產就緒