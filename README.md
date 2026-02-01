# aidevx

John Hsiao 的專案入口站 — 快速原型、idea 發想、實驗性作品集。

🌐 **Live:** [http://152.42.160.234](http://152.42.160.234)

## 專案列表

| 專案 | 路徑 | 說明 | 日期 |
|------|------|------|------|
| 🏭 智慧工廠監控系統 | `/factory-monitor/` | Factory floor personnel monitoring dashboard | 2026-01-31 |
| 🥠 線上擲筊 | `/bwa-bwei/` | Virtual moon blocks divination | 2026-02-01 |
| 🌌 極光模擬器 | `/aurora-borealis/` | Interactive aurora borealis — move, click, breathe | 2026-02-01 |
| ⌨️ 打字速度測試 | `/typing-test/` | Typing speed test (EN / 中文 / Code) | 2026-02-01 |
| 📊 OEE 設備綜合效率儀表板 | `/oee-dashboard/` | Overall Equipment Effectiveness monitoring | 2026-02-01 |

## 架構

- **主機:** DigitalOcean Droplet (SGP1)
- **Web Server:** Nginx
- **部署:** 純靜態 HTML，push 後自動部署

## 開發

```bash
git clone https://github.com/johnshaw77/aidevx.git
cd aidevx

# 改完推上去
git add -A && git commit -m "update" && git push
```

新增專案只要：
1. 建一個新資料夾（如 `new-project/`）
2. 在 `index.html` 首頁加上連結
3. Push — 自動部署到伺服器
