// 股市開盤倒數器 - 支援自動時間觸發
let countdown = 10;
let isRunning = false;
let timer = null;
let audioContext = null;
let autoTimer = null;

// 激勵文字庫
const motivationalTexts = [
    {
        main: "🚀 衝刺時刻到了！股市即將開盤！",
        sub: "準備好迎接今日的財富機會！💰"
    },
    {
        main: "⚡ 電光火石！開盤衝刺！",
        sub: "今日必勝，漲停板等著我們！📈"
    },
    {
        main: "🔥 燃燒吧！股海戰士！",
        sub: "用熱血點燃今日的交易激情！💎"
    },
    {
        main: "💎 鑽石之手！準備出擊！",
        sub: "Hold 住信念，衝向財富巔峰！🏆"
    },
    {
        main: "🎯 狙擊手就位！鎖定標的！",
        sub: "精準出擊，收穫滿滿！🎯"
    },
    {
        main: "🌟 明星選手登場！開盤倒數！",
        sub: "今天就是你發光發熱的時刻！✨"
    },
    {
        main: "⚔️ 戰士們！準備戰鬥！",
        sub: "股市戰場等著我們征服！🛡️"
    },
    {
        main: "🚁 直升機視角！俯瞰全局！",
        sub: "掌控大盤，收穫豐厚！🌪️"
    }
];

// 獲取隨機激勵文字
function getRandomMotivationalText() {
    return motivationalTexts[Math.floor(Math.random() * motivationalTexts.length)];
}

// 初始化音效
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('音效不支援');
    }
}

// 播放音效
function playSound(freq = 800) {
    if (!audioContext) return;
    
    try {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('音效播放失敗');
    }
}

// 開始倒數
function startCountdown() {
    if (isRunning) return;
    
    console.log('開始倒數！');
    isRunning = true;
    countdown = 10;
    
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const countdownEl = document.getElementById('countdown');
    const rushMessage = document.getElementById('rushMessage');
    
    startBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    rushMessage.style.display = 'none';
    
    timer = setInterval(() => {
        console.log('倒數:', countdown);
        
        countdownEl.textContent = countdown;
        countdownEl.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            countdownEl.style.transform = 'scale(1)';
        }, 200);
        
        // 播放音效
        if (countdown <= 3) {
            playSound(1200);
            document.body.style.animation = 'shake 0.5s';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 500);
        } else {
            playSound(800);
        }
        
        if (countdown === 0) {
            finishCountdown();
            return;
        }
        
        countdown--;
    }, 1000);
}

// 倒數結束
function finishCountdown() {
    clearInterval(timer);
    isRunning = false;
    
    const countdownEl = document.getElementById('countdown');
    const rushMessage = document.getElementById('rushMessage');
    const messageText = document.querySelector('.message-text');
    const subMessage = document.querySelector('.sub-message');
    
    countdownEl.textContent = '開盤!';
    countdownEl.style.color = '#ffd700';
    countdownEl.style.transform = 'scale(2)';
    
    // 隨機激勵文字
    const motivationalText = getRandomMotivationalText();
    messageText.textContent = motivationalText.main;
    subMessage.textContent = motivationalText.sub;
    
    // 勝利音效
    playSound(1500);
    setTimeout(() => playSound(1800), 200);
    setTimeout(() => playSound(2000), 400);
    
    setTimeout(() => {
        rushMessage.style.display = 'block';
        createMoneyRain();
    }, 500);
}

// 重置倒數
function resetCountdown() {
    clearInterval(timer);
    isRunning = false;
    countdown = 10;
    
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const countdownEl = document.getElementById('countdown');
    const rushMessage = document.getElementById('rushMessage');
    
    countdownEl.textContent = '10';
    countdownEl.style.color = '#ff4757';
    countdownEl.style.transform = 'scale(1)';
    
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    rushMessage.style.display = 'none';
    
    // 清除金錢雨
    const moneyRain = document.getElementById('moneyRain');
    moneyRain.innerHTML = '';
}

// 金錢雨
function createMoneyRain() {
    const moneyRain = document.getElementById('moneyRain');
    const symbols = ['💰', '💵', '💸', '🤑', '💲', '🏆', '📈', '🚀'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const money = document.createElement('div');
            money.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            money.style.position = 'fixed';
            money.style.left = Math.random() * 100 + '%';
            money.style.top = '-50px';
            money.style.fontSize = '2rem';
            money.style.zIndex = '1000';
            money.style.pointerEvents = 'none';
            money.style.animation = 'fall 3s linear forwards';
            
            moneyRain.appendChild(money);
            
            setTimeout(() => {
                if (money.parentNode) {
                    money.parentNode.removeChild(money);
                }
            }, 3000);
        }, i * 100);
    }
}

// 加入 CSS 動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// 強制事件綁定函數
function forceBindEvents() {
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (startBtn) {
        console.log('找到開始按鈕，綁定事件');
        
        // 移除所有現有事件
        startBtn.replaceWith(startBtn.cloneNode(true));
        const newStartBtn = document.getElementById('startBtn');
        
        // 多種方式綁定事件
        newStartBtn.onclick = function() {
            console.log('開始按鈕被點擊！(onclick)');
            startCountdown();
        };
        
        newStartBtn.addEventListener('click', function() {
            console.log('開始按鈕被點擊！(addEventListener)');
            startCountdown();
        });
        
        newStartBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('開始按鈕被觸碰！(touch)');
            startCountdown();
        });
        
        console.log('按鈕事件綁定完成，onclick:', typeof newStartBtn.onclick);
    } else {
        console.error('找不到開始按鈕！');
    }
    
    if (resetBtn) {
        resetBtn.onclick = function() {
            console.log('重置按鈕被點擊！');
            resetCountdown();
        };
    }
}

// 等待頁面載入
document.addEventListener('DOMContentLoaded', function() {
    console.log('頁面載入完成');
    
    // 初始化音效
    initAudio();
    
    // 延遲綁定確保元素完全載入
    setTimeout(forceBindEvents, 100);
    
    // 啟動自動時間檢測
    setTimeout(startAutoCheck, 500);
    
    // 立即檢查一次當前時間狀態
    setTimeout(checkAutoCountdown, 1000);
    
    // 首次點擊啟動音效
    document.addEventListener('click', function() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }, { once: true });
});

// 備用：頁面完全載入後再綁定一次
window.addEventListener('load', function() {
    console.log('窗口完全載入');
    setTimeout(forceBindEvents, 200);
});

// 自動時間檢測
function checkAutoCountdown() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const targetTime = 8 * 60 + 50; // 8:50
    const openTime = 9 * 60; // 9:00
    
    console.log(`當前時間: ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    
    // 如果正好是 8:50 且還沒開始倒數
    if (currentTime === targetTime && !isRunning) {
        console.log('🚀 自動倒數觸發！8:50 開盤準備！');
        
        // 自動點擊開始按鈕的效果
        const startBtn = document.getElementById('startBtn');
        if (startBtn && startBtn.style.display !== 'none') {
            startCountdown();
            
            // 顯示自動觸發訊息
            setTimeout(() => {
                alert('🚀 股市開盤自動倒數開始！準備衝刺！');
            }, 500);
        }
    }
    
    // 如果已經超過 9:00 且不在倒數中，顯示錯過訊息
    if (currentTime >= openTime && currentTime < openTime + 5 && !isRunning) {
        const countdownEl = document.getElementById('countdown');
        countdownEl.textContent = '已開盤';
        countdownEl.style.color = '#10b981';
        
        // 顯示已開盤狀態
        updateMarketStatus('已開盤交易中 📈');
    }
}

// 更新市場狀態顯示
function updateMarketStatus(status) {
    // 檢查是否已有狀態顯示元素
    let statusElement = document.getElementById('marketStatus');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'marketStatus';
        statusElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #10b981;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: bold;
            z-index: 200;
        `;
        document.body.appendChild(statusElement);
    }
    statusElement.textContent = status;
}

// 啟動自動檢測
function startAutoCheck() {
    // 每秒檢查時間
    autoTimer = setInterval(checkAutoCountdown, 1000);
    console.log('⏰ 自動時間檢測已啟動 (8:50自動倒數)');
}

// 停止自動檢測
function stopAutoCheck() {
    if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
        console.log('⏰ 自動時間檢測已停止');
    }
}

console.log('腳本載入完成');