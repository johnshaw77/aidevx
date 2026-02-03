// 簡化版倒數器，移除複雜功能確保基本功能正常
let countdown = 10;
let isRunning = false;
let timer = null;
let audioContext = null;

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
    
    countdownEl.textContent = '開盤!';
    countdownEl.style.color = '#ffd700';
    countdownEl.style.transform = 'scale(2)';
    
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

console.log('腳本載入完成');