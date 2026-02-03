class MarketCountdown {
    constructor() {
        this.countdownElement = document.getElementById('countdown');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.rushMessage = document.getElementById('rushMessage');
        this.moneyRain = document.getElementById('moneyRain');
        
        this.currentCount = 10;
        this.isRunning = false;
        this.intervalId = null;
        
        this.init();
    }
    
    init() {
        this.startBtn.addEventListener('click', () => this.startCountdown());
        this.resetBtn.addEventListener('click', () => this.resetCountdown());
        
        // 初始化音效上下文
        this.setupAudio();
    }
    
    setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    playBeep(frequency = 800, duration = 200) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }
    
    startCountdown() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.style.display = 'none';
        this.resetBtn.style.display = 'inline-block';
        this.rushMessage.style.display = 'none';
        
        // 清除金錢雨
        this.moneyRain.innerHTML = '';
        
        this.intervalId = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCountdown() {
        // 添加脈衝動畫
        this.countdownElement.classList.add('pulse');
        setTimeout(() => {
            this.countdownElement.classList.remove('pulse');
        }, 1000);
        
        // 播放音效
        if (this.currentCount <= 3) {
            this.playBeep(1200, 300); // 最後三秒高音
        } else {
            this.playBeep(800, 200); // 一般音效
        }
        
        // 更新顯示
        this.countdownElement.textContent = this.currentCount;
        
        // 最後三秒特殊效果
        if (this.currentCount <= 3) {
            this.countdownElement.classList.add('final');
            this.shakeScreen();
        }
        
        // 倒數結束
        if (this.currentCount === 0) {
            this.finishCountdown();
            return;
        }
        
        this.currentCount--;
    }
    
    shakeScreen() {
        document.body.style.animation = 'screenShake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
    
    finishCountdown() {
        clearInterval(this.intervalId);
        
        // 播放勝利音效
        this.playBeep(1500, 500);
        setTimeout(() => this.playBeep(1800, 500), 200);
        setTimeout(() => this.playBeep(2000, 800), 400);
        
        // 顯示衝刺訊息
        this.countdownElement.textContent = '開盤!';
        this.countdownElement.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
        this.countdownElement.style.webkitBackgroundClip = 'text';
        this.countdownElement.style.webkitTextFillColor = 'transparent';
        
        setTimeout(() => {
            this.rushMessage.style.display = 'block';
            this.startMoneyRain();
            this.flashScreen();
        }, 500);
        
        this.isRunning = false;
    }
    
    startMoneyRain() {
        const moneySymbols = ['💰', '💵', '💸', '🤑', '💲', '🏆', '📈', '🚀'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createMoneyDrop(moneySymbols[Math.floor(Math.random() * moneySymbols.length)]);
            }, i * 100);
        }
    }
    
    createMoneyDrop(symbol) {
        const money = document.createElement('div');
        money.className = 'money';
        money.textContent = symbol;
        money.style.left = Math.random() * 100 + '%';
        money.style.animationDuration = (Math.random() * 2 + 2) + 's';
        money.style.animationDelay = Math.random() * 0.5 + 's';
        
        this.moneyRain.appendChild(money);
        
        // 清理
        setTimeout(() => {
            if (money.parentNode) {
                money.parentNode.removeChild(money);
            }
        }, 5000);
    }
    
    flashScreen() {
        const flashOverlay = document.createElement('div');
        flashOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,215,0,0) 70%);
            z-index: 30;
            animation: flashFade 1s ease-out forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(flashOverlay);
        
        setTimeout(() => {
            if (flashOverlay.parentNode) {
                flashOverlay.parentNode.removeChild(flashOverlay);
            }
        }, 1000);
    }
    
    resetCountdown() {
        clearInterval(this.intervalId);
        
        this.currentCount = 10;
        this.isRunning = false;
        
        this.countdownElement.textContent = '10';
        this.countdownElement.classList.remove('final');
        this.countdownElement.style.background = 'linear-gradient(45deg, #ff4757, #ff3838)';
        this.countdownElement.style.webkitBackgroundClip = 'text';
        this.countdownElement.style.webkitTextFillColor = 'transparent';
        
        this.startBtn.style.display = 'inline-block';
        this.resetBtn.style.display = 'none';
        this.rushMessage.style.display = 'none';
        
        // 清除金錢雨
        this.moneyRain.innerHTML = '';
    }
}

// 添加螢幕震動動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    @keyframes flashFade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// 等待DOM載入完成
document.addEventListener('DOMContentLoaded', () => {
    new MarketCountdown();
});

// 點擊任何地方恢復音效上下文（某些瀏覽器需要）
document.addEventListener('click', () => {
    if (window.audioContext && window.audioContext.state === 'suspended') {
        window.audioContext.resume();
    }
}, { once: true });