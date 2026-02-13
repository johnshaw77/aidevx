<template>
  <div class="app">
    <div class="container">
      <!-- 頭部 -->
      <header class="header">
        <h1 class="title">
          <span class="emoji">✅</span>
          Vue + FastAPI Todo
        </h1>
        <p class="subtitle">現代化全棧 Todo 應用</p>
      </header>

      <!-- 統計信息 -->
      <div class="stats" v-if="stats">
        <div class="stat-item">
          <span class="stat-number">{{ stats.total }}</span>
          <span class="stat-label">總計</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ stats.pending }}</span>
          <span class="stat-label">待完成</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ stats.completed }}</span>
          <span class="stat-label">已完成</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ stats.completion_rate }}%</span>
          <span class="stat-label">完成率</span>
        </div>
      </div>

      <!-- 新增 Todo -->
      <form @submit.prevent="createTodo" class="add-form">
        <input
          v-model="newTodo.title"
          placeholder="輸入新的待辦事項..."
          class="todo-input"
          required
        />
        <input
          v-model="newTodo.description"
          placeholder="描述 (可選)"
          class="todo-input description"
        />
        <button type="submit" class="add-btn" :disabled="!newTodo.title.trim()">
          ➕ 新增
        </button>
      </form>

      <!-- 過濾和操作 -->
      <div class="controls">
        <div class="filters">
          <button
            @click="filter = 'all'"
            :class="{ active: filter === 'all' }"
            class="filter-btn"
          >
            全部 ({{ stats?.total || 0 }})
          </button>
          <button
            @click="filter = 'pending'"
            :class="{ active: filter === 'pending' }"
            class="filter-btn"
          >
            待完成 ({{ stats?.pending || 0 }})
          </button>
          <button
            @click="filter = 'completed'"
            :class="{ active: filter === 'completed' }"
            class="filter-btn"
          >
            已完成 ({{ stats?.completed || 0 }})
          </button>
        </div>
        
        <div class="actions">
          <button @click="markAllCompleted" class="action-btn" v-if="stats?.pending > 0">
            全部完成
          </button>
          <button @click="clearCompleted" class="action-btn danger" v-if="stats?.completed > 0">
            清除已完成
          </button>
        </div>
      </div>

      <!-- 搜索 -->
      <div class="search">
        <input
          v-model="searchQuery"
          placeholder="🔍 搜索待辦事項..."
          class="search-input"
        />
      </div>

      <!-- Todo 列表 -->
      <div class="todo-list" v-if="filteredTodos.length > 0">
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="todo-item"
          :class="{ completed: todo.completed, editing: editingId === todo.id }"
        >
          <div class="todo-content" v-if="editingId !== todo.id">
            <label class="checkbox-container">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleTodo(todo.id, !todo.completed)"
              />
              <span class="checkmark"></span>
            </label>
            
            <div class="todo-text">
              <h3 class="todo-title">{{ todo.title }}</h3>
              <p class="todo-description" v-if="todo.description">{{ todo.description }}</p>
              <span class="todo-time">{{ formatTime(todo.created_at) }}</span>
            </div>
            
            <div class="todo-actions">
              <button @click="startEdit(todo)" class="action-btn small">
                ✏️
              </button>
              <button @click="deleteTodo(todo.id)" class="action-btn small danger">
                🗑️
              </button>
            </div>
          </div>

          <!-- 編輯模式 -->
          <form @submit.prevent="saveEdit" class="edit-form" v-if="editingId === todo.id">
            <input
              v-model="editingTodo.title"
              class="edit-input"
              required
            />
            <input
              v-model="editingTodo.description"
              class="edit-input"
              placeholder="描述"
            />
            <div class="edit-actions">
              <button type="submit" class="action-btn small">💾</button>
              <button @click="cancelEdit" type="button" class="action-btn small">❌</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 空狀態 -->
      <div class="empty-state" v-else>
        <div class="empty-icon">📝</div>
        <h3>{{ getEmptyMessage() }}</h3>
        <p>{{ getEmptyDescription() }}</p>
      </div>

      <!-- 載入狀態 -->
      <div class="loading" v-if="loading">
        <div class="spinner"></div>
        <span>載入中...</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TodoApp',
  data() {
    return {
      todos: [],
      stats: null,
      newTodo: {
        title: '',
        description: ''
      },
      editingId: null,
      editingTodo: {},
      filter: 'all',
      searchQuery: '',
      loading: false
    }
  },
  
  computed: {
    filteredTodos() {
      let filtered = this.todos

      // 按狀態過濾
      if (this.filter === 'pending') {
        filtered = filtered.filter(todo => !todo.completed)
      } else if (this.filter === 'completed') {
        filtered = filtered.filter(todo => todo.completed)
      }

      // 搜索過濾
      if (this.searchQuery.trim()) {
        filtered = filtered.filter(todo =>
          todo.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (todo.description && todo.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
        )
      }

      return filtered
    }
  },
  
  async mounted() {
    await this.fetchTodos()
    await this.fetchStats()
  },
  
  methods: {
    async fetchTodos() {
      try {
        this.loading = true
        const response = await axios.get('/todos')
        this.todos = response.data
      } catch (error) {
        console.error('載入待辦事項失敗:', error)
        alert('載入失敗，請檢查後端連接')
      } finally {
        this.loading = false
      }
    },
    
    async fetchStats() {
      try {
        const response = await axios.get('/todos/stats')
        this.stats = response.data
      } catch (error) {
        console.error('載入統計失敗:', error)
      }
    },
    
    async createTodo() {
      if (!this.newTodo.title.trim()) return

      try {
        const response = await axios.post('/todos', this.newTodo)
        this.todos.unshift(response.data)
        this.newTodo = { title: '', description: '' }
        await this.fetchStats()
      } catch (error) {
        console.error('新增待辦事項失敗:', error)
        alert('新增失敗')
      }
    },
    
    async toggleTodo(id, completed) {
      try {
        await axios.put(`/todos/${id}`, { completed })
        const todo = this.todos.find(t => t.id === id)
        if (todo) {
          todo.completed = completed
        }
        await this.fetchStats()
      } catch (error) {
        console.error('更新待辦事項失敗:', error)
      }
    },
    
    async deleteTodo(id) {
      if (!confirm('確定要刪除這個待辦事項嗎？')) return

      try {
        await axios.delete(`/todos/${id}`)
        this.todos = this.todos.filter(t => t.id !== id)
        await this.fetchStats()
      } catch (error) {
        console.error('刪除待辦事項失敗:', error)
      }
    },
    
    startEdit(todo) {
      this.editingId = todo.id
      this.editingTodo = { ...todo }
    },
    
    async saveEdit() {
      try {
        const response = await axios.put(`/todos/${this.editingId}`, {
          title: this.editingTodo.title,
          description: this.editingTodo.description
        })
        
        const index = this.todos.findIndex(t => t.id === this.editingId)
        if (index !== -1) {
          this.todos[index] = response.data
        }
        
        this.cancelEdit()
      } catch (error) {
        console.error('更新待辦事項失敗:', error)
        alert('更新失敗')
      }
    },
    
    cancelEdit() {
      this.editingId = null
      this.editingTodo = {}
    },
    
    async markAllCompleted() {
      if (!confirm('確定要標記所有待辦事項為已完成嗎？')) return

      try {
        await axios.post('/todos/mark-all-completed')
        await this.fetchTodos()
        await this.fetchStats()
      } catch (error) {
        console.error('批量完成失敗:', error)
      }
    },
    
    async clearCompleted() {
      if (!confirm('確定要清除所有已完成的待辦事項嗎？')) return

      try {
        await axios.delete('/todos/clear-completed')
        await this.fetchTodos()
        await this.fetchStats()
      } catch (error) {
        console.error('清除已完成項目失敗:', error)
      }
    },
    
    formatTime(timeString) {
      const date = new Date(timeString)
      const now = new Date()
      const diff = now - date

      if (diff < 60000) return '剛剛'
      if (diff < 3600000) return `${Math.floor(diff / 60000)} 分鐘前`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小時前`
      
      return date.toLocaleDateString('zh-TW', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    getEmptyMessage() {
      if (this.filter === 'pending') return '沒有待完成的事項'
      if (this.filter === 'completed') return '還沒有完成任何事項'
      if (this.searchQuery.trim()) return '沒有找到匹配的待辦事項'
      return '還沒有待辦事項'
    },
    
    getEmptyDescription() {
      if (this.filter === 'pending') return '太棒了！所有事情都完成了 🎉'
      if (this.filter === 'completed') return '完成一些任務來查看進度'
      if (this.searchQuery.trim()) return '試試其他關鍵詞'
      return '新增一個待辦事項開始管理任務'
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.emoji {
  font-size: 3rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.add-form {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  margin-bottom: 25px;
}

.todo-input {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

.todo-input:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
}

.add-btn {
  padding: 12px 20px;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 15px;
}

.filters {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.filter-btn:hover,
.filter-btn.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
}

.action-btn.small {
  padding: 4px 8px;
  font-size: 0.8rem;
}

.search {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.todo-item.completed {
  opacity: 0.7;
}

.todo-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.checkbox-container {
  position: relative;
  cursor: pointer;
}

.checkbox-container input {
  opacity: 0;
  position: absolute;
}

.checkmark {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  background: transparent;
  transition: all 0.3s;
}

.checkbox-container input:checked + .checkmark {
  background: #4CAF50;
  border-color: #4CAF50;
}

.checkbox-container input:checked + .checkmark:after {
  content: '✓';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.todo-text {
  flex: 1;
  color: white;
}

.todo-title {
  font-size: 1.1rem;
  margin-bottom: 5px;
  line-height: 1.4;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  opacity: 0.7;
}

.todo-description {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 8px;
  line-height: 1.4;
}

.todo-time {
  font-size: 0.75rem;
  opacity: 0.6;
}

.todo-actions {
  display: flex;
  gap: 5px;
}

.edit-form {
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  align-items: center;
}

.edit-input {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.edit-actions {
  display: flex;
  gap: 5px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: white;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  opacity: 0.8;
}

.empty-state p {
  opacity: 0.6;
  font-size: 1rem;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: white;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }

  .title {
    font-size: 2rem;
  }

  .emoji {
    font-size: 2.5rem;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .add-form {
    grid-template-columns: 1fr;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    justify-content: center;
  }

  .todo-content {
    padding: 12px;
  }

  .edit-form {
    grid-template-columns: 1fr;
  }
}
</style>