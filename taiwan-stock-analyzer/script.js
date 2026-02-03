// 台股分析大將 - 專業股市分析平台
class TaiwanStockAnalyzer {
    constructor() {
        this.currentStock = {
            code: '2330',
            name: '台積電',
            price: 585.00,
            change: 8.00,
            changePercent: 1.39,
            open: 578.00,
            high: 588.00,
            low: 575.00,
            volume: 25643,
            industry: '半導體業'
        };
        
        this.stockDatabase = this.initStockDatabase();
        this.marketData = this.initMarketData();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startRealTimeUpdate();
        this.generateHotStocks();
        this.generateNews();
        this.generateTradeDetail();
        this.drawStockChart();
        this.updateTechnicalIndicators();
        
        console.log('🎯 台股分析大將已啟動！');
    }
    
    // 初始化股票資料庫
    initStockDatabase() {
        return {
            '2330': { name: '台積電', industry: '半導體業', sector: '電子' },
            '2317': { name: '鴻海', industry: '電腦及週邊設備業', sector: '電子' },
            '2454': { name: '聯發科', industry: '半導體業', sector: '電子' },
            '2308': { name: '台達電', industry: '電源供應器業', sector: '電子' },
            '2382': { name: '廣達', industry: '電腦及週邊設備業', sector: '電子' },
            '2303': { name: '聯電', industry: '半導體業', sector: '電子' },
            '3008': { name: '大立光', industry: '光學器材業', sector: '電子' },
            '2881': { name: '富邦金', industry: '金融保險業', sector: '金融' },
            '2886': { name: '兆豐金', industry: '金融保險業', sector: '金融' },
            '2891': { name: '中信金', industry: '金融保險業', sector: '金融' },
            '2884': { name: '玉山金', industry: '金融保險業', sector: '金融' },
            '2002': { name: '中鋼', industry: '鋼鐵工業', sector: '傳產' },
            '1301': { name: '台塑', industry: '塑膠工業', sector: '傳產' },
            '1303': { name: '南亞', industry: '塑膠工業', sector: '傳產' },
            '2207': { name: '和泰車', industry: '汽車工業', sector: '傳產' },
            '2412': { name: '中華電', industry: '通信網路業', sector: '通信' },
            '3045': { name: '台灣大', industry: '通信網路業', sector: '通信' },
            '4904': { name: '遠傳', industry: '通信網路業', sector: '通信' },
            '2357': { name: '華碩', industry: '電腦及週邊設備業', sector: '電子' },
            '2409': { name: '友達', industry: '光電業', sector: '電子' }
        };
    }
    
    // 初始化市場數據
    initMarketData() {
        return {
            twii: { value: 17856, change: 156, changePercent: 0.88 },
            otc: { value: 182.45, change: -1.23, changePercent: -0.67 },
            electronic: { value: 892.34, change: 12.45, changePercent: 1.42 },
            finance: { value: 1234.56, change: 8.90, changePercent: 0.73 }
        };
    }
    
    // 綁定事件
    bindEvents() {
        // 搜尋功能
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchStock();
        });
        
        document.getElementById('stockSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchStock();
            }
        });
        
        // 快速股票選擇
        document.querySelectorAll('.quick-stock').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stockCode = e.target.dataset.code;
                this.selectStock(stockCode);
            });
        });
        
        // 圖表週期切換
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.drawStockChart(e.target.dataset.period);
            });
        });
    }
    
    // 搜尋股票
    searchStock() {
        const searchValue = document.getElementById('stockSearch').value.trim();
        
        if (!searchValue) return;
        
        // 查找股票代碼或名稱
        let foundStock = null;
        
        for (const [code, data] of Object.entries(this.stockDatabase)) {
            if (code === searchValue || data.name.includes(searchValue)) {
                foundStock = { code, ...data };
                break;
            }
        }
        
        if (foundStock) {
            this.selectStock(foundStock.code);
            document.getElementById('stockSearch').value = '';
        } else {
            this.showNotification('❌ 找不到該股票，請檢查代碼或名稱');
        }
    }
    
    // 選擇股票
    selectStock(stockCode) {
        if (!this.stockDatabase[stockCode]) return;
        
        const stockData = this.stockDatabase[stockCode];
        
        // 生成模擬股價數據
        const basePrice = this.generateRandomPrice(stockCode);
        const change = (Math.random() - 0.5) * 20;
        const changePercent = (change / basePrice) * 100;
        
        this.currentStock = {
            code: stockCode,
            name: stockData.name,
            price: basePrice,
            change: change,
            changePercent: changePercent,
            open: basePrice - (Math.random() - 0.5) * 10,
            high: basePrice + Math.random() * 15,
            low: basePrice - Math.random() * 15,
            volume: Math.floor(Math.random() * 100000) + 1000,
            industry: stockData.industry
        };
        
        this.updateStockDisplay();
        this.drawStockChart();
        this.updateTechnicalIndicators();
        this.generateTradeDetail();
        
        this.showNotification(`✅ 已切換至 ${stockData.name} (${stockCode})`);
    }
    
    // 生成隨機股價
    generateRandomPrice(stockCode) {
        const priceRanges = {
            '2330': [580, 620],   // 台積電
            '2317': [100, 120],   // 鴻海
            '2454': [800, 900],   // 聯發科
            '2308': [280, 320],   // 台達電
            'default': [50, 200]
        };
        
        const range = priceRanges[stockCode] || priceRanges.default;
        return Math.random() * (range[1] - range[0]) + range[0];
    }
    
    // 更新股票顯示
    updateStockDisplay() {
        const stock = this.currentStock;
        
        document.getElementById('stockName').textContent = stock.name;
        document.getElementById('stockCode').textContent = stock.code;
        document.getElementById('stockIndustry').textContent = stock.industry;
        document.getElementById('currentPrice').textContent = stock.price.toFixed(2);
        
        const changeEl = document.getElementById('priceChange');
        const changeClass = stock.change >= 0 ? 'positive' : 'negative';
        changeEl.className = `price-change ${changeClass}`;
        changeEl.textContent = `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`;
        
        document.getElementById('openPrice').textContent = stock.open.toFixed(2);
        document.getElementById('highPrice').textContent = stock.high.toFixed(2);
        document.getElementById('lowPrice').textContent = stock.low.toFixed(2);
        document.getElementById('volume').textContent = `${stock.volume.toLocaleString()} 張`;
    }
    
    // 繪製股票圖表
    drawStockChart(period = '1d') {
        const canvas = document.getElementById('stockChart');
        const ctx = canvas.getContext('2d');
        
        // 清除畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 生成模擬K線數據
        const klineData = this.generateKlineData(period);
        
        // 設置繪圖參數
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const barWidth = chartWidth / klineData.length;
        
        // 找出價格範圍
        const prices = klineData.flatMap(d => [d.high, d.low]);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const priceRange = maxPrice - minPrice;
        
        // 繪製網格
        this.drawGrid(ctx, canvas, padding, maxPrice, minPrice);
        
        // 繪製K線
        klineData.forEach((data, index) => {
            const x = padding + index * barWidth + barWidth / 2;
            const highY = padding + (maxPrice - data.high) / priceRange * chartHeight;
            const lowY = padding + (maxPrice - data.low) / priceRange * chartHeight;
            const openY = padding + (maxPrice - data.open) / priceRange * chartHeight;
            const closeY = padding + (maxPrice - data.close) / priceRange * chartHeight;
            
            // 判斷漲跌顏色
            const isUp = data.close >= data.open;
            ctx.strokeStyle = isUp ? '#10b981' : '#ef4444';
            ctx.fillStyle = isUp ? '#10b981' : '#ef4444';
            
            // 繪製影線
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, highY);
            ctx.lineTo(x, lowY);
            ctx.stroke();
            
            // 繪製實體
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);
            const bodyWidth = barWidth * 0.6;
            
            ctx.lineWidth = 1;
            ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
            ctx.strokeRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
        });
        
        // 繪製移動平均線
        this.drawMovingAverage(ctx, klineData, padding, chartWidth, chartHeight, maxPrice, minPrice, 5, '#f59e0b');
        this.drawMovingAverage(ctx, klineData, padding, chartWidth, chartHeight, maxPrice, minPrice, 20, '#3b82f6');
    }
    
    // 繪製網格
    drawGrid(ctx, canvas, padding, maxPrice, minPrice) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // 水平線
        for (let i = 0; i <= 5; i++) {
            const y = padding + (canvas.height - padding * 2) * i / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
            
            // 價格標籤
            const price = maxPrice - (maxPrice - minPrice) * i / 5;
            ctx.fillStyle = '#64748b';
            ctx.font = '12px monospace';
            ctx.fillText(price.toFixed(1), 5, y + 4);
        }
        
        // 垂直線
        for (let i = 0; i <= 10; i++) {
            const x = padding + (canvas.width - padding * 2) * i / 10;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, canvas.height - padding);
            ctx.stroke();
        }
    }
    
    // 繪製移動平均線
    drawMovingAverage(ctx, data, padding, chartWidth, chartHeight, maxPrice, minPrice, period, color) {
        const ma = this.calculateMA(data, period);
        const barWidth = chartWidth / data.length;
        const priceRange = maxPrice - minPrice;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        ma.forEach((value, index) => {
            if (value !== null) {
                const x = padding + index * barWidth + barWidth / 2;
                const y = padding + (maxPrice - value) / priceRange * chartHeight;
                
                if (index === ma.findIndex(v => v !== null)) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        });
        
        ctx.stroke();
    }
    
    // 生成K線數據
    generateKlineData(period) {
        const dataLength = period === '1d' ? 60 : (period === '1w' ? 50 : 30);
        const basePrice = this.currentStock.price;
        const data = [];
        let lastClose = basePrice;
        
        for (let i = 0; i < dataLength; i++) {
            const open = lastClose;
            const change = (Math.random() - 0.5) * basePrice * 0.05;
            const close = open + change;
            const high = Math.max(open, close) + Math.random() * basePrice * 0.02;
            const low = Math.min(open, close) - Math.random() * basePrice * 0.02;
            
            data.push({ open, high, low, close });
            lastClose = close;
        }
        
        return data;
    }
    
    // 計算移動平均
    calculateMA(data, period) {
        return data.map((_, index) => {
            if (index < period - 1) return null;
            
            const sum = data.slice(index - period + 1, index + 1)
                .reduce((acc, d) => acc + d.close, 0);
            return sum / period;
        });
    }
    
    // 更新技術指標
    updateTechnicalIndicators() {
        const klineData = this.generateKlineData('1d');
        
        // RSI
        const rsi = this.calculateRSI(klineData);
        document.getElementById('rsiValue').textContent = rsi.toFixed(1);
        
        // MACD
        const macd = this.calculateMACD(klineData);
        document.getElementById('macdValue').textContent = macd.toFixed(2);
        
        // KD
        const kd = this.calculateKD(klineData);
        document.getElementById('kdValue').textContent = `K:${kd.k.toFixed(0)} D:${kd.d.toFixed(0)}`;
        
        // 威廉指標
        const wr = this.calculateWR(klineData);
        document.getElementById('wrValue').textContent = wr.toFixed(1);
    }
    
    // 計算RSI
    calculateRSI(data, period = 14) {
        if (data.length < period + 1) return 50;
        
        let gains = 0;
        let losses = 0;
        
        for (let i = 1; i <= period; i++) {
            const change = data[data.length - i].close - data[data.length - i - 1].close;
            if (change > 0) {
                gains += change;
            } else {
                losses -= change;
            }
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        
        return rsi;
    }
    
    // 計算MACD
    calculateMACD(data) {
        const ema12 = this.calculateEMA(data, 12);
        const ema26 = this.calculateEMA(data, 26);
        return ema12 - ema26;
    }
    
    // 計算EMA
    calculateEMA(data, period) {
        if (data.length === 0) return 0;
        
        const multiplier = 2 / (period + 1);
        let ema = data[0].close;
        
        for (let i = 1; i < data.length; i++) {
            ema = (data[i].close * multiplier) + (ema * (1 - multiplier));
        }
        
        return ema;
    }
    
    // 計算KD
    calculateKD(data, period = 9) {
        if (data.length < period) return { k: 50, d: 50 };
        
        const recentData = data.slice(-period);
        const high = Math.max(...recentData.map(d => d.high));
        const low = Math.min(...recentData.map(d => d.low));
        const close = data[data.length - 1].close;
        
        const rsv = ((close - low) / (high - low)) * 100;
        const k = rsv * 0.1 + 50 * 0.9; // 簡化計算
        const d = k * 0.1 + 45 * 0.9;   // 簡化計算
        
        return { k, d };
    }
    
    // 計算威廉指標
    calculateWR(data, period = 14) {
        if (data.length < period) return -50;
        
        const recentData = data.slice(-period);
        const high = Math.max(...recentData.map(d => d.high));
        const low = Math.min(...recentData.map(d => d.low));
        const close = data[data.length - 1].close;
        
        return ((high - close) / (high - low)) * -100;
    }
    
    // 生成熱門股
    generateHotStocks() {
        const hotStocksContainer = document.getElementById('hotStocksList');
        const stockCodes = Object.keys(this.stockDatabase).slice(0, 8);
        
        hotStocksContainer.innerHTML = '';
        
        stockCodes.forEach(code => {
            const stock = this.stockDatabase[code];
            const price = this.generateRandomPrice(code);
            const change = (Math.random() - 0.5) * 20;
            const changePercent = (change / price) * 100;
            
            const hotStockDiv = document.createElement('div');
            hotStockDiv.className = 'hot-stock-item';
            hotStockDiv.onclick = () => this.selectStock(code);
            
            hotStockDiv.innerHTML = `
                <div class="hot-stock-info">
                    <div class="hot-stock-name">${stock.name}</div>
                    <div class="hot-stock-code">${code}</div>
                </div>
                <div class="hot-stock-price">
                    <div class="hot-stock-value">${price.toFixed(2)}</div>
                    <div class="hot-stock-change ${change >= 0 ? 'positive' : 'negative'}">
                        ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)
                    </div>
                </div>
            `;
            
            hotStocksContainer.appendChild(hotStockDiv);
        });
    }
    
    // 生成新聞
    generateNews() {
        const newsContainer = document.getElementById('newsList');
        const newsItems = [
            { title: '台積電Q4財報超預期，法人看好2024展望', time: '09:45' },
            { title: '聯發科新晶片發表，5G市場再添競爭力', time: '09:30' },
            { title: '外資持續買超，電子股成交活絡', time: '09:15' },
            { title: '央行利率政策不變，金融股反彈', time: '09:00' },
            { title: '美股收紅帶動，台股開盤漲勢明顯', time: '08:45' },
            { title: 'AI概念股持續發燒，相關供應鏈受惠', time: '08:30' }
        ];
        
        newsContainer.innerHTML = '';
        
        newsItems.forEach(news => {
            const newsDiv = document.createElement('div');
            newsDiv.className = 'news-item';
            newsDiv.innerHTML = `
                <div class="news-title">${news.title}</div>
                <div class="news-time">${news.time}</div>
            `;
            newsContainer.appendChild(newsDiv);
        });
    }
    
    // 生成成交明細
    generateTradeDetail() {
        const tradeContainer = document.getElementById('tradeDetail');
        const currentTime = new Date();
        
        tradeContainer.innerHTML = '';
        
        for (let i = 0; i < 20; i++) {
            const time = new Date(currentTime.getTime() - i * 30000);
            const price = this.currentStock.price + (Math.random() - 0.5) * 5;
            const volume = Math.floor(Math.random() * 100) + 1;
            
            const tradeRow = document.createElement('div');
            tradeRow.className = 'trade-row';
            tradeRow.innerHTML = `
                <span>${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}</span>
                <span class="${Math.random() > 0.5 ? 'positive' : 'negative'}">${price.toFixed(2)}</span>
                <span>${volume}</span>
            `;
            
            tradeContainer.appendChild(tradeRow);
        }
    }
    
    // 開始即時更新
    startRealTimeUpdate() {
        // 更新時間
        setInterval(() => {
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            document.getElementById('updateTime').textContent = timeString;
        }, 1000);
        
        // 模擬股價更新
        setInterval(() => {
            this.simulatePriceUpdate();
        }, 5000);
        
        // 更新成交明細
        setInterval(() => {
            this.generateTradeDetail();
        }, 10000);
    }
    
    // 模擬股價更新
    simulatePriceUpdate() {
        const change = (Math.random() - 0.5) * 2;
        this.currentStock.price += change;
        this.currentStock.change += change;
        this.currentStock.changePercent = (this.currentStock.change / (this.currentStock.price - this.currentStock.change)) * 100;
        
        // 更新顯示
        this.updateStockDisplay();
        
        // 模擬大盤指數變動
        const indices = ['twii', 'otc', 'electronic', 'finance'];
        indices.forEach(index => {
            const change = (Math.random() - 0.5) * 10;
            this.marketData[index].value += change;
            this.marketData[index].change += change;
            this.marketData[index].changePercent = (this.marketData[index].change / (this.marketData[index].value - this.marketData[index].change)) * 100;
        });
        
        this.updateMarketDisplay();
    }
    
    // 更新大盤顯示
    updateMarketDisplay() {
        const updates = {
            'twiiPrice': this.marketData.twii.value,
            'twiiChange': this.marketData.twii.change,
            'otcPrice': this.marketData.otc.value,
            'otcChange': this.marketData.otc.change,
            'elecPrice': this.marketData.electronic.value,
            'elecChange': this.marketData.electronic.change,
            'fincPrice': this.marketData.finance.value,
            'fincChange': this.marketData.finance.change
        };
        
        for (const [id, value] of Object.entries(updates)) {
            const element = document.getElementById(id);
            if (element) {
                if (id.includes('Price')) {
                    element.textContent = value.toFixed(2);
                } else {
                    const isPositive = value >= 0;
                    element.className = `index-change ${isPositive ? 'positive' : 'negative'}`;
                    const percent = (value / (updates[id.replace('Change', 'Price')] - value) * 100).toFixed(2);
                    element.textContent = `${isPositive ? '+' : ''}${value.toFixed(2)} (${isPositive ? '+' : ''}${percent}%)`;
                }
            }
        }
    }
    
    // 顯示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(59, 130, 246, 0.9);
            backdrop-filter: blur(10px);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(300px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(300px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 等待頁面載入完成
document.addEventListener('DOMContentLoaded', () => {
    const analyzer = new TaiwanStockAnalyzer();
    
    // 初始化提示
    setTimeout(() => {
        console.log('🎯 台股分析大將功能說明：');
        console.log('🔍 股票搜尋：輸入代碼或名稱');
        console.log('📊 技術分析：RSI、MACD、KD、威廉指標');
        console.log('📈 K線圖表：支援日線、週線、月線');
        console.log('💰 即時資訊：股價、成交量、法人進出');
        console.log('🔥 熱門追蹤：點擊快速切換個股');
    }, 1000);
});

console.log('🎯 台股分析大將系統載入中...');