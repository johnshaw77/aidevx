// FPC 良率預測系統 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeParameters();
    initializeTrendChart();
    startMonitoring();
});

// 參數初始化
function initializeParameters() {
    const sliders = document.querySelectorAll('input[type="range"]');
    
    sliders.forEach(slider => {
        const valueSpan = slider.parentElement.querySelector('.value');
        
        // 設置初始值顯示
        updateValueDisplay(slider, valueSpan);
        
        // 綁定變化事件
        slider.addEventListener('input', function() {
            updateValueDisplay(this, valueSpan);
            calculatePrediction();
        });
    });
    
    // 初始計算
    calculatePrediction();
}

// 更新數值顯示
function updateValueDisplay(slider, valueSpan) {
    const value = parseFloat(slider.value);
    const id = slider.id;
    
    let displayValue;
    switch(id) {
        case 'etch-temp':
        case 'plate-temp':
            displayValue = `${value.toFixed(1)}°C`;
            break;
        case 'etch-time':
            displayValue = `${value}秒`;
            break;
        case 'etch-conc':
            displayValue = `${value.toFixed(1)}%`;
            break;
        case 'plate-current':
            displayValue = `${value.toFixed(1)} A/dm²`;
            break;
        case 'plate-time':
            displayValue = `${value.toFixed(1)}分鐘`;
            break;
        case 'humidity':
            displayValue = `${value}%`;
            break;
        case 'vibration':
            displayValue = `${value}`;
            break;
        default:
            displayValue = value.toString();
    }
    
    valueSpan.textContent = displayValue;
}

// AI 良率預測算法（模擬）
function calculatePrediction() {
    const parameters = {
        etchTemp: parseFloat(document.getElementById('etch-temp').value),
        etchTime: parseFloat(document.getElementById('etch-time').value),
        etchConc: parseFloat(document.getElementById('etch-conc').value),
        plateCurrent: parseFloat(document.getElementById('plate-current').value),
        plateTemp: parseFloat(document.getElementById('plate-temp').value),
        plateTime: parseFloat(document.getElementById('plate-time').value),
        humidity: parseFloat(document.getElementById('humidity').value),
        vibration: parseFloat(document.getElementById('vibration').value)
    };
    
    // 基礎良率（假設理想條件下為 95%）
    let baseYield = 95.0;
    let confidence = 90.0;
    
    // 蝕刻製程影響
    const etchTempOptimal = 50.0;
    const etchTimeOptimal = 150.0;
    const etchConcOptimal = 40.0;
    
    // 計算蝕刻影響（溫度過高或過低都會影響良率）
    const etchTempDiff = Math.abs(parameters.etchTemp - etchTempOptimal);
    const etchTempImpact = -0.2 * etchTempDiff;
    
    const etchTimeImpact = (parameters.etchTime - etchTimeOptimal) * 0.01;
    const etchConcImpact = (parameters.etchConc - etchConcOptimal) * 0.05;
    
    // 鍍金製程影響
    const plateCurrentOptimal = 1.2;
    const plateTempOptimal = 70.0;
    const plateTimeOptimal = 10.0;
    
    const plateCurrentImpact = -Math.abs(parameters.plateCurrent - plateCurrentOptimal) * 0.5;
    const plateTempImpact = -Math.abs(parameters.plateTemp - plateTempOptimal) * 0.1;
    const plateTimeImpact = (parameters.plateTime - plateTimeOptimal) * 0.1;
    
    // 環境影響
    const humidityOptimal = 50.0;
    const vibrationOptimal = 3.0;
    
    const humidityImpact = -Math.abs(parameters.humidity - humidityOptimal) * 0.05;
    const vibrationImpact = -Math.abs(parameters.vibration - vibrationOptimal) * 0.1;
    
    // 計算總影響
    const totalImpact = etchTempImpact + etchTimeImpact + etchConcImpact +
                       plateCurrentImpact + plateTempImpact + plateTimeImpact +
                       humidityImpact + vibrationImpact;
    
    // 最終良率預測
    let predictedYield = Math.max(85.0, Math.min(99.9, baseYield + totalImpact));
    
    // 信心度計算（參數偏離理想值越多，信心度越低）
    const totalDeviation = Math.abs(etchTempDiff) + Math.abs(etchTimeImpact * 100) +
                          Math.abs(etchConcImpact * 20) + Math.abs(plateCurrentImpact * 2) +
                          Math.abs(plateTempImpact * 10) + Math.abs(plateTimeImpact * 10) +
                          Math.abs(humidityImpact * 20) + Math.abs(vibrationImpact * 10);
    
    confidence = Math.max(60.0, Math.min(95.0, 90.0 - totalDeviation * 0.5));
    
    // 更新顯示
    updatePredictionDisplay(predictedYield, confidence);
    
    // 生成建議
    generateRecommendations(parameters, predictedYield);
    
    // 更新統計卡片
    updateStatCards(predictedYield, confidence);
}

// 更新預測顯示
function updatePredictionDisplay(yield, confidence) {
    const yieldText = document.getElementById('yield-prediction');
    const yieldFill = document.getElementById('yield-fill');
    const confidenceFill = document.getElementById('confidence-fill');
    const confidenceText = document.getElementById('confidence-text');
    
    // 更新良率顯示
    yieldText.textContent = `${yield.toFixed(1)}%`;
    
    // 更新良率圓環（0-100% 對應 0-360度）
    const yieldDegree = (yield / 100) * 360;
    yieldFill.style.background = `conic-gradient(
        var(--success-color) 0deg,
        var(--success-color) ${yieldDegree}deg,
        transparent ${yieldDegree}deg
    )`;
    
    // 更新信心度條
    confidenceFill.style.width = `${confidence}%`;
    confidenceText.textContent = `${confidence.toFixed(0)}%`;
}

// 生成最佳化建議
function generateRecommendations(params, currentYield) {
    const recommendationsDiv = document.getElementById('recommendations');
    const recommendations = [];
    
    // 蝕刻溫度建議
    if (params.etchTemp > 52) {
        recommendations.push({
            icon: 'fas fa-thermometer-half',
            text: `建議降低蝕刻溫度至 50°C，可提升良率 ${((params.etchTemp - 50) * 0.2).toFixed(1)}%`
        });
    } else if (params.etchTemp < 48) {
        recommendations.push({
            icon: 'fas fa-thermometer-half',
            text: `建議提高蝕刻溫度至 50°C，可提升良率 ${((50 - params.etchTemp) * 0.2).toFixed(1)}%`
        });
    }
    
    // 鍍金時間建議
    if (params.plateTime < 9) {
        recommendations.push({
            icon: 'fas fa-clock',
            text: `延長鍍金時間至 10 分鐘，預期改善 ${((10 - params.plateTime) * 0.1).toFixed(1)}%`
        });
    }
    
    // 濕度建議
    if (Math.abs(params.humidity - 50) > 5) {
        recommendations.push({
            icon: 'fas fa-tint',
            text: `控制濕度在 45-55% 範圍，可穩定品質`
        });
    }
    
    // 振動建議
    if (params.vibration > 5) {
        recommendations.push({
            icon: 'fas fa-wave-square',
            text: `降低振動強度至 3 以下，可減少缺陷率`
        });
    }
    
    // 如果沒有特別建議
    if (recommendations.length === 0) {
        recommendations.push({
            icon: 'fas fa-check-circle',
            text: '當前參數設定良好，建議維持現狀'
        });
    }
    
    // 更新建議顯示
    recommendationsDiv.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <i class="${rec.icon}"></i>
            <span>${rec.text}</span>
        </div>
    `).join('');
}

// 更新統計卡片
function updateStatCards(predictedYield, confidence) {
    const currentYield = 94.2; // 模擬當前良率
    const improvement = predictedYield - currentYield;
    
    document.getElementById('predicted-yield').textContent = `${predictedYield.toFixed(1)}%`;
    document.getElementById('improvement').textContent = improvement >= 0 ? 
        `+${improvement.toFixed(1)}%` : `${improvement.toFixed(1)}%`;
    document.getElementById('confidence').textContent = `${confidence.toFixed(0)}%`;
    
    // 更新顏色
    const improvementElement = document.getElementById('improvement');
    improvementElement.style.color = improvement >= 0 ? 
        'var(--success-color)' : 'var(--accent-color)';
}

// 初始化趨勢圖表
function initializeTrendChart() {
    const canvas = document.getElementById('trendChart');
    const ctx = canvas.getContext('2d');
    
    // 設置畫布大小
    canvas.width = 800;
    canvas.height = 300;
    
    // 模擬歷史數據
    const historicalData = [
        92.5, 93.1, 94.2, 93.8, 95.1, 94.7, 96.2, 95.8, 96.5, 97.1,
        96.8, 97.3, 96.9, 97.5, 97.2, 97.8, 97.4, 98.1, 97.9, 98.3
    ];
    
    // 繪製圖表
    drawTrendChart(ctx, historicalData, canvas.width, canvas.height);
}

// 繪製趨勢圖表
function drawTrendChart(ctx, data, width, height) {
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // 清除畫布
    ctx.clearRect(0, 0, width, height);
    
    // 設置樣式
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
    
    // 計算數據點位置
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const valueRange = maxValue - minValue;
    
    const points = data.map((value, index) => ({
        x: padding + (index / (data.length - 1)) * chartWidth,
        y: padding + ((maxValue - value) / valueRange) * chartHeight
    }));
    
    // 繪製區域填充
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // 繪製線條
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.stroke();
    
    // 繪製數據點
    ctx.fillStyle = '#3498db';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // 繪製網格線和標籤
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    
    // 垂直網格線
    for (let i = 0; i <= 4; i++) {
        const x = padding + (i / 4) * chartWidth;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
        
        // X軸標籤
        ctx.fillText(`${i * 5}天前`, x - 20, height - padding + 20);
    }
    
    // 水平網格線
    for (let i = 0; i <= 4; i++) {
        const y = padding + (i / 4) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        // Y軸標籤
        const value = maxValue - (i / 4) * valueRange;
        ctx.fillText(`${value.toFixed(1)}%`, 5, y + 3);
    }
}

// 啟動即時監控
function startMonitoring() {
    setInterval(updateMonitorStatus, 5000); // 每5秒更新一次
}

// 更新監控狀態
function updateMonitorStatus() {
    const monitorCards = document.querySelectorAll('.monitor-card');
    
    monitorCards.forEach(card => {
        const yieldValue = card.querySelector('.yield-value');
        const currentYield = parseFloat(yieldValue.textContent);
        
        // 模擬小幅波動 (-0.5% 到 +0.5%)
        const variation = (Math.random() - 0.5) * 1.0;
        const newYield = Math.max(85, Math.min(99, currentYield + variation));
        
        yieldValue.textContent = `${newYield.toFixed(1)}%`;
        
        // 更新狀態
        const statusText = card.querySelector('.status-text');
        if (newYield >= 95) {
            card.className = 'monitor-card active';
            statusText.textContent = '正常運行';
        } else if (newYield >= 92) {
            card.className = 'monitor-card warning';
            statusText.textContent = '需要注意';
        } else {
            card.className = 'monitor-card error';
            statusText.textContent = '異常';
        }
    });
}

// 工具函數
function formatNumber(num, decimals = 1) {
    return num.toFixed(decimals);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// 平滑動畫效果
function animateValue(element, start, end, duration = 1000) {
    let startTime = null;
    
    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const currentValue = start + (end - start) * easeInOutCubic(progress);
        element.textContent = formatNumber(currentValue) + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// 響應式處理
window.addEventListener('resize', function() {
    const canvas = document.getElementById('trendChart');
    if (canvas) {
        // 重新繪製圖表以適應新尺寸
        initializeTrendChart();
    }
});

console.log('FPC 良率預測系統已初始化');