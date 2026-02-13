import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

// 設置 axios 全局配置
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.headers.common['Content-Type'] = 'application/json'

const app = createApp(App)

// 將 axios 添加到全局屬性
app.config.globalProperties.$http = axios

app.mount('#app')