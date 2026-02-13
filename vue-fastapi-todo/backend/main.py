from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models
from database import get_db, create_tables, Todo

# 創建 FastAPI 應用
app = FastAPI(
    title="Todo API",
    description="一個簡單但功能完整的 Todo 管理 API",
    version="1.0.0"
)

# CORS 設置 (允許前端連接)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vue 開發服務器
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 啟動時創建數據庫表
@app.on_event("startup")
def startup_event():
    create_tables()

# 根路径
@app.get("/")
def read_root():
    return {
        "message": "Todo API 運行中 🚀", 
        "docs": "/docs",
        "version": "1.0.0"
    }

# 獲取所有 Todo
@app.get("/todos", response_model=List[models.TodoResponse])
def get_todos(
    skip: int = Query(0, ge=0, description="跳過的記錄數"),
    limit: int = Query(100, ge=1, le=1000, description="返回的記錄數"),
    completed: Optional[bool] = Query(None, description="過濾完成狀態"),
    search: Optional[str] = Query(None, description="搜索標題"),
    db: Session = Depends(get_db)
):
    query = db.query(Todo)
    
    # 過濾條件
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    
    if search:
        query = query.filter(Todo.title.contains(search))
    
    # 排序和分頁
    todos = query.order_by(Todo.created_at.desc()).offset(skip).limit(limit).all()
    return todos

# 創建 Todo
@app.post("/todos", response_model=models.TodoResponse)
def create_todo(todo: models.TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(title=todo.title, description=todo.description)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# 獲取單個 Todo
@app.get("/todos/{todo_id}", response_model=models.TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo 不存在")
    return todo

# 更新 Todo
@app.put("/todos/{todo_id}", response_model=models.TodoResponse)
def update_todo(todo_id: int, todo_update: models.TodoUpdate, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo 不存在")
    
    # 更新字段
    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(todo, field, value)
    
    db.commit()
    db.refresh(todo)
    return todo

# 刪除 Todo
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo 不存在")
    
    db.delete(todo)
    db.commit()
    return {"message": "Todo 已刪除"}

# 批量操作：標記所有為完成
@app.post("/todos/mark-all-completed")
def mark_all_completed(db: Session = Depends(get_db)):
    db.query(Todo).update({Todo.completed: True})
    db.commit()
    return {"message": "所有 Todo 已標記為完成"}

# 批量操作：清除已完成
@app.delete("/todos/clear-completed")
def clear_completed(db: Session = Depends(get_db)):
    count = db.query(Todo).filter(Todo.completed == True).count()
    db.query(Todo).filter(Todo.completed == True).delete()
    db.commit()
    return {"message": f"已清除 {count} 個已完成的 Todo"}

# 獲取統計信息
@app.get("/todos/stats", response_model=models.TodoStats)
def get_todos_stats(db: Session = Depends(get_db)):
    total = db.query(Todo).count()
    completed = db.query(Todo).filter(Todo.completed == True).count()
    pending = total - completed
    completion_rate = (completed / total * 100) if total > 0 else 0
    
    return models.TodoStats(
        total=total,
        completed=completed,
        pending=pending,
        completion_rate=round(completion_rate, 2)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)