# aidevx

John Hsiao 的專案入口站 — 快速原型、idea 發想、實驗性作品集。

🌐 **Live:** [https://aidevx.pro](https://aidevx.pro)

## 專案列表

| 專案 | 路徑 | 說明 | 日期 |
|------|------|------|------|
| 📊 品質柏拉圖分析工具 | `/quality-pareto-analysis/` | 找出影響 80% 品質問題的關鍵因子，自動產生柏拉圖與累計分析表 | 2026-02-03 |
| 🤫 假裝工作中 | `/fake-working/` | 終極摸魚神器！四種工作模式 + 老闆鍵，讓你看起來超級專業忙碌 | 2026-02-03 |
| 🚀 股市開盤倒數器 | `/market-countdown/` | 超有衝勁的 10 秒倒數體驗，震撼音效 + 金錢雨 + 螢幕震動，準備衝刺股市！ | 2026-02-03 |
| 🎨 心情顏色產生器 | `/mood-color-generator/` | 描述你的心情，AI 為你創造專屬的情感色彩漸變，附色彩心理學解析 | 2026-02-03 |
| 🎰 台股搖搖樂 | `/stock-lottery/` | 台股專用老虎機選股遊戲，內建上市櫃精選，支援自訂股票池！ | 2026-02-02 |
| ✨ Emoji 翻譯神器 | `/emoji-translator/` | 雙向翻譯器！文字轉表情符號，表情符號轉文字，500+ 詞彙即時翻譯 | 2026-02-02 |
| 🔌 FPC 阻抗計算器 | `/fpc-impedance-calc/` | 精準計算軟板走線阻抗，支援單端與差分阻抗，多種介電材料參數 | 2026-02-02 |
| 🔬 FPC 良率預測系統 | `/fpc-yield-predictor/` | AI 驅動的軟性電路板良率預測，製程參數最佳化建議與即時監控 | 2026-02-02 |
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
