from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Pydantic 模型用於 API 請求和響應

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TodoResponse(TodoBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TodoStats(BaseModel):
    total: int
    completed: int
    pending: int
    completion_rate: float