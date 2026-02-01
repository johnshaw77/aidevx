# aidevx

John Hsiao 的專案入口站 — 快速原型、idea 發想、實驗性作品集。

🌐 **Live:** [http://152.42.160.234](http://152.42.160.234)

## 專案列表

| 專案 | 路徑 | 說明 | 日期 |
|------|------|------|------|
| 🐱 招財貓運勢占卜 | `/lucky-cat-fortune/` | 每日運勢預測與幸運數字生成，純 CSS 招財貓動畫，支援分享功能 | 2026-02-02 |
| 🏭 智慧工廠監控系統 | `/factory-monitor/` | 工廠人員即時監控儀表板 | 2026-01-31 |
| 🥠 線上擲筊 | `/bwa-bwei/` | 線上虛擬擲筊求神問卜 | 2026-02-01 |
| 🌌 極光模擬器 | `/aurora-borealis/` | 互動式極光模擬 — 可移動、點擊、呼吸燈效果 | 2026-02-01 |
| ⌨️ 打字速度測試 | `/typing-test/` | 打字速度測試（支援英文／中文／程式碼） | 2026-02-01 |
| 📊 OEE 設備綜合效率儀表板 | `/oee-dashboard/` | 設備綜合效率即時監控儀表板 | 2026-02-01 |
| 🔮 FPC 數位孿生 | `/digital-twin-fpc/` | 軟板產線數位孿生 — 8 站製程模擬、感測器監控、What-If 情境分析 | 2026-02-01 |
| 📈 SPC 統計製程管制 | `/spc-dashboard/` | X̄-R 管制圖 + Cp/Cpk 製程能力分析 | 2026-02-01 |
| 🔬 FPC 軟板製程架構圖 | `/fpc-process-map/` | 15 站完整製程流程，點擊查看參數、設備與常見不良 | 2026-02-01 |

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
