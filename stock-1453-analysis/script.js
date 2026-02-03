// 1453 大將股票分析系統
class Stock1453Analyzer {
    constructor() {
        this.stockCode = '1453';
        this.stockName = '大將';
        this.currentPrice = 42.85;
        this.basePrice = 42.85;
        
        this.stockData = {
            currentPrice: 42.85,
            change: 1.25,
            changePercent: 3.01,
            open: 42.00,
            high: 43.20,
            low: 41.80,
            yesterday: 41.60,
            volume: 3258,
            turnover: 139.6
        };
        
        this.technicalIndicators = {
            rsi: 72.3,
            macd: 0.85,
            kd: { k: 78, d: 72 },
            wr: -18.5,
            ma5: 42.12,
            ma20: 40.85,
            ma60: 39.45
        };
        
        this.currentPeriod = 'day';
        this.klineData = [];
        
        this.init();
    }
    
    init() {
        console.log('🎯 1453 大將股票分析系統啟動');
        
        this.bindEvents();
        this.generateKlineData(this.currentPeriod);
        this.drawStockChart();
        this.startRealTimeUpdate();
        this.updateTechnicalIndicators();
        this.updateAllDisplays();
    }
    
    // 綁定事件
    bindEvents() {
        // 圖表週期切換
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const period = e.target.dataset.period;
                this.currentPeriod = period;
                this.generateKlineData(period);
                this.drawStockChart();
                
                console.log(`切換到${period}線圖`);
            });
        });
        
        // 新聞項目點擊
        document.querySelectorAll('.news-item').forEach(item => {
            item.addEventListener('click', () => {
                this.showNewsDetail(item);
            });
        });
    }
    
    // 生成K線數據
    generateKlineData(period) {
        const dataPoints = period === 'day' ? 60 : (period === 'week' ? 50 : 30);
        const basePrice = this.basePrice;
        const data = [];
        let lastClose = basePrice * 0.95; // 從較低價格開始，模擬上漲趨勢
        
        for (let i = 0; i < dataPoints; i++) {
            const volatility = period === 'day' ? 0.02 : (period === 'week' ? 0.04 : 0.06);
            
            // 模擬上漲趨勢（最後幾根K線）
            let trendFactor = 1;
            if (i > dataPoints - 10) {
                trendFactor = 1 + (i - (dataPoints - 10)) * 0.003;
            }
            
            const open = lastClose;
            const randomChange = (Math.random() - 0.45) * basePrice * volatility * trendFactor;
            const close = Math.max(open + randomChange, basePrice * 0.8);
            
            const high = Math.max(open, close) + Math.random() * basePrice * volatility * 0.3;
            const low = Math.min(open, close) - Math.random() * basePrice * volatility * 0.3;
            
            const volume = Math.floor(Math.random() * 5000) + 1000;
            
            data.push({
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
                volume: volume,
                timestamp: Date.now() - (dataPoints - i) * this.getPeriodMs(period)
            });
            
            lastClose = close;
        }
        
        // 確保最後一根K線接近當前價格
        const lastCandle = data[data.length - 1];
        lastCandle.close = this.currentPrice;
        lastCandle.high = Math.max(lastCandle.high, this.currentPrice);
        lastCandle.low = Math.min(lastCandle.low, this.currentPrice);
        
        this.klineData = data;
        this.calculateTechnicalIndicators();
    }
    
    // 獲取週期毫秒數
    getPeriodMs(period) {
        switch (period) {
            case 'day': return 60 * 1000; // 1分鐘
            case 'week': return 60 * 60 * 1000; // 1小時
            case 'month': return 24 * 60 * 60 * 1000; // 1天
            default: return 60 * 1000;
        }
    }
    
    // 繪製股票圖表
    drawStockChart() {
        const canvas = document.getElementById('stockChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // 設置canvas實際大小
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        const width = rect.width;
        const height = rect.height;
        const padding = 50;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // 清除畫布
        ctx.fillStyle = '#0a0f1c';
        ctx.fillRect(0, 0, width, height);
        
        if (this.klineData.length === 0) return;
        
        // 計算價格範圍
        const prices = this.klineData.flatMap(d => [d.high, d.low]);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const priceRange = maxPrice - minPrice;
        const priceBuffer = priceRange * 0.1;
        const adjustedMax = maxPrice + priceBuffer;
        const adjustedMin = minPrice - priceBuffer;
        const adjustedRange = adjustedMax - adjustedMin;
        
        // 繪製網格和標籤
        this.drawGrid(ctx, width, height, padding, adjustedMax, adjustedMin);
        
        // 計算K線寬度
        const candleWidth = Math.max(2, chartWidth / this.klineData.length * 0.8);
        const candleSpacing = chartWidth / this.klineData.length;
        
        // 繪製移動平均線
        this.drawMovingAverages(ctx, padding, chartWidth, chartHeight, adjustedMax, adjustedMin, adjustedRange);
        
        // 繪製K線
        this.klineData.forEach((candle, index) => {
            const x = padding + index * candleSpacing + candleSpacing / 2;
            
            // 計算Y座標
            const highY = padding + (adjustedMax - candle.high) / adjustedRange * chartHeight;
            const lowY = padding + (adjustedMax - candle.low) / adjustedRange * chartHeight;
            const openY = padding + (adjustedMax - candle.open) / adjustedRange * chartHeight;
            const closeY = padding + (adjustedMax - candle.close) / adjustedRange * chartHeight;
            
            // 判斷漲跌
            const isUp = candle.close >= candle.open;
            const color = isUp ? '#10b981' : '#ef4444';
            
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 1;
            
            // 繪製影線
            ctx.beginPath();
            ctx.moveTo(x, highY);
            ctx.lineTo(x, lowY);
            ctx.stroke();
            
            // 繪製實體
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);
            const bodyWidth = candleWidth;
            
            if (isUp) {
                if (bodyHeight < 1) {
                    // 十字線
                    ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, 1);
                } else {
                    // 空心陽線
                    ctx.strokeRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
                }
            } else {
                // 實心陰線
                ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, Math.max(bodyHeight, 1));
            }
        });
        
        // 繪製當前價格線
        const currentPriceY = padding + (adjustedMax - this.currentPrice) / adjustedRange * chartHeight;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, currentPriceY);
        ctx.lineTo(width - padding, currentPriceY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 價格標籤
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(width - padding, currentPriceY - 10, 60, 20);
        ctx.fillStyle = '#000';
        ctx.font = '12px monospace';
        ctx.fillText(this.currentPrice.toFixed(2), width - padding + 5, currentPriceY + 4);
    }
    
    // 繪製網格
    drawGrid(ctx, width, height, padding, maxPrice, minPrice) {
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.font = '11px monospace';
        
        // 水平網格線（價格）
        for (let i = 0; i <= 5; i++) {
            const y = padding + chartHeight * i / 5;
            const price = maxPrice - (maxPrice - minPrice) * i / 5;
            
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            
            // 價格標籤
            ctx.fillStyle = '#64748b';
            ctx.fillText(price.toFixed(1), 5, y + 4);
        }
        
        // 垂直網格線（時間）
        const timeSteps = 10;
        for (let i = 0; i <= timeSteps; i++) {
            const x = padding + chartWidth * i / timeSteps;
            
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
    }
    
    // 繪製移動平均線
    drawMovingAverages(ctx, padding, chartWidth, chartHeight, maxPrice, minPrice, priceRange) {
        const periods = [5, 20, 60];
        const colors = ['#f59e0b', '#3b82f6', '#8b5cf6'];
        const candleSpacing = chartWidth / this.klineData.length;
        
        periods.forEach((period, index) => {
            const ma = this.calculateMA(period);
            if (ma.length === 0) return;
            
            ctx.strokeStyle = colors[index];
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            let started = false;
            ma.forEach((value, i) => {
                if (value !== null) {
                    const x = padding + i * candleSpacing + candleSpacing / 2;
                    const y = padding + (maxPrice - value) / priceRange * chartHeight;
                    
                    if (!started) {
                        ctx.moveTo(x, y);
                        started = true;
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            });
            
            ctx.stroke();
        });
    }
    
    // 計算移動平均
    calculateMA(period) {
        return this.klineData.map((_, index) => {
            if (index < period - 1) return null;
            
            const sum = this.klineData.slice(index - period + 1, index + 1)
                .reduce((acc, candle) => acc + candle.close, 0);
            return sum / period;
        });
    }
    
    // 計算技術指標
    calculateTechnicalIndicators() {
        if (this.klineData.length < 20) return;
        
        // 更新移動平均
        const ma5Data = this.calculateMA(5);
        const ma20Data = this.calculateMA(20);
        const ma60Data = this.calculateMA(60);
        
        this.technicalIndicators.ma5 = ma5Data[ma5Data.length - 1] || this.technicalIndicators.ma5;
        this.technicalIndicators.ma20 = ma20Data[ma20Data.length - 1] || this.technicalIndicators.ma20;
        this.technicalIndicators.ma60 = ma60Data[ma60Data.length - 1] || this.technicalIndicators.ma60;
        
        // 計算RSI
        this.technicalIndicators.rsi = this.calculateRSI();
        
        // 計算MACD
        this.technicalIndicators.macd = this.calculateMACD();
        
        // 計算KD
        const kd = this.calculateKD();
        this.technicalIndicators.kd = kd;
        
        // 計算威廉指標
        this.technicalIndicators.wr = this.calculateWR();
    }
    
    // 計算RSI
    calculateRSI(period = 14) {
        if (this.klineData.length <= period) return this.technicalIndicators.rsi;
        
        const changes = [];
        for (let i = 1; i < this.klineData.length; i++) {
            changes.push(this.klineData[i].close - this.klineData[i - 1].close);
        }
        
        let avgGain = 0;
        let avgLoss = 0;
        
        // 計算初始平均漲跌
        for (let i = 0; i < period; i++) {
            if (changes[i] > 0) {
                avgGain += changes[i];
            } else {
                avgLoss -= changes[i];
            }
        }
        
        avgGain /= period;
        avgLoss /= period;
        
        // 計算最新RSI
        for (let i = period; i < changes.length; i++) {
            const gain = changes[i] > 0 ? changes[i] : 0;
            const loss = changes[i] < 0 ? -changes[i] : 0;
            
            avgGain = (avgGain * (period - 1) + gain) / period;
            avgLoss = (avgLoss * (period - 1) + loss) / period;
        }
        
        if (avgLoss === 0) return 100;
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }
    
    // 計算MACD
    calculateMACD() {
        const ema12 = this.calculateEMA(12);
        const ema26 = this.calculateEMA(26);
        
        if (ema12 === 0 || ema26 === 0) return this.technicalIndicators.macd;
        
        return ema12 - ema26;
    }
    
    // 計算EMA
    calculateEMA(period) {
        if (this.klineData.length === 0) return 0;
        
        const multiplier = 2 / (period + 1);
        let ema = this.klineData[0].close;
        
        for (let i = 1; i < this.klineData.length; i++) {
            ema = (this.klineData[i].close * multiplier) + (ema * (1 - multiplier));
        }
        
        return ema;
    }
    
    // 計算KD
    calculateKD(period = 9) {
        if (this.klineData.length < period) return this.technicalIndicators.kd;
        
        const recentData = this.klineData.slice(-period);
        const high = Math.max(...recentData.map(d => d.high));
        const low = Math.min(...recentData.map(d => d.low));
        const close = this.klineData[this.klineData.length - 1].close;
        
        const rsv = ((close - low) / (high - low)) * 100;
        
        // 簡化KD計算
        const k = rsv * 0.1 + this.technicalIndicators.kd.k * 0.9;
        const d = k * 0.1 + this.technicalIndicators.kd.d * 0.9;
        
        return { k: Math.round(k), d: Math.round(d) };
    }
    
    // 計算威廉指標
    calculateWR(period = 14) {
        if (this.klineData.length < period) return this.technicalIndicators.wr;
        
        const recentData = this.klineData.slice(-period);
        const high = Math.max(...recentData.map(d => d.high));
        const low = Math.min(...recentData.map(d => d.low));
        const close = this.klineData[this.klineData.length - 1].close;
        
        return ((high - close) / (high - low)) * -100;
    }
    
    // 更新所有顯示
    updateAllDisplays() {
        this.updatePriceDisplay();
        this.updateTechnicalDisplay();
        this.updateMADisplay();
    }
    
    // 更新股價顯示
    updatePriceDisplay() {
        const data = this.stockData;
        
        document.getElementById('currentPrice').textContent = data.currentPrice.toFixed(2);
        
        const changeEl = document.getElementById('priceChange');
        const changeClass = data.change >= 0 ? 'positive' : 'negative';
        changeEl.className = `price-change ${changeClass}`;
        changeEl.textContent = `${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)} (${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%)`;
        
        document.getElementById('openPrice').textContent = data.open.toFixed(2);
        document.getElementById('highPrice').textContent = data.high.toFixed(2);
        document.getElementById('lowPrice').textContent = data.low.toFixed(2);
        document.getElementById('yesterdayPrice').textContent = data.yesterday.toFixed(2);
        document.getElementById('volume').textContent = `${data.volume.toLocaleString()} 張`;
        document.getElementById('turnover').textContent = `${data.turnover.toFixed(1)} 萬`;
    }
    
    // 更新技術指標顯示
    updateTechnicalDisplay() {
        const indicators = this.technicalIndicators;
        
        document.getElementById('rsiValue').textContent = indicators.rsi.toFixed(1);
        document.getElementById('macdValue').textContent = indicators.macd.toFixed(2);
        document.getElementById('kdValue').textContent = `K:${indicators.kd.k} D:${indicators.kd.d}`;
        document.getElementById('wrValue').textContent = indicators.wr.toFixed(1);
    }
    
    // 更新移動平均顯示
    updateMADisplay() {
        const indicators = this.technicalIndicators;
        
        document.getElementById('ma5').textContent = indicators.ma5.toFixed(2);
        document.getElementById('ma20').textContent = indicators.ma20.toFixed(2);
        document.getElementById('ma60').textContent = indicators.ma60.toFixed(2);
    }
    
    // 開始即時更新
    startRealTimeUpdate() {
        // 更新時間
        setInterval(() => {
            const now = new Date();
            const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            document.getElementById('updateTime').textContent = timeString;
        }, 1000);
        
        // 模擬股價波動
        setInterval(() => {
            this.simulatePriceUpdate();
        }, 3000);
    }
    
    // 模擬股價更新
    simulatePriceUpdate() {
        // 小幅隨機波動
        const change = (Math.random() - 0.5) * 0.5;
        const newPrice = Math.max(this.currentPrice + change, this.basePrice * 0.9);
        
        // 更新股價數據
        this.currentPrice = parseFloat(newPrice.toFixed(2));
        this.stockData.currentPrice = this.currentPrice;
        this.stockData.change = this.currentPrice - this.stockData.yesterday;
        this.stockData.changePercent = (this.stockData.change / this.stockData.yesterday) * 100;
        
        // 更新最高最低價
        this.stockData.high = Math.max(this.stockData.high, this.currentPrice);
        this.stockData.low = Math.min(this.stockData.low, this.currentPrice);
        
        // 更新成交量（小幅變動）
        this.stockData.volume += Math.floor((Math.random() - 0.5) * 100);
        this.stockData.volume = Math.max(this.stockData.volume, 1000);
        
        // 更新顯示
        this.updatePriceDisplay();
        
        // 重新計算技術指標
        if (this.klineData.length > 0) {
            const lastCandle = this.klineData[this.klineData.length - 1];
            lastCandle.close = this.currentPrice;
            lastCandle.high = Math.max(lastCandle.high, this.currentPrice);
            lastCandle.low = Math.min(lastCandle.low, this.currentPrice);
            
            this.calculateTechnicalIndicators();
            this.updateTechnicalDisplay();
            this.updateMADisplay();
        }
        
        // 偶爾重繪圖表
        if (Math.random() < 0.3) {
            this.drawStockChart();
        }
    }
    
    // 顯示新聞詳情
    showNewsDetail(newsItem) {
        const title = newsItem.querySelector('.news-title').textContent;
        
        this.showNotification(`📰 ${title}`, 4000);
    }
    
    // 顯示通知
    showNotification(message, duration = 3000) {
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
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
}

// 添加動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 等待頁面載入完成
document.addEventListener('DOMContentLoaded', () => {
    const analyzer = new Stock1453Analyzer();
    
    // 調整canvas大小當視窗改變
    window.addEventListener('resize', () => {
        setTimeout(() => {
            analyzer.drawStockChart();
        }, 100);
    });
    
    // 初始化提示
    setTimeout(() => {
        console.log('📊 1453 大將股票分析功能：');
        console.log('📈 技術線圖：支援日/週/月線切換');
        console.log('📊 技術指標：RSI、MACD、KD、威廉指標');
        console.log('🎯 關鍵價位：支撐壓力分析');
        console.log('💰 財務概況：基本面指標');
        console.log('📰 相關新聞：點擊查看詳情');
        console.log('🔄 即時更新：每3秒模擬價格變動');
    }, 1000);
});

console.log('📊 1453 大將股票分析系統載入中...');