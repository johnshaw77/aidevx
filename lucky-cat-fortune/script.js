// 運勢數據庫
const fortuneData = {
    levels: [
        { name: '大吉', stars: '⭐⭐⭐⭐⭐', color: '#d32f2f' },
        { name: '中吉', stars: '⭐⭐⭐⭐', color: '#ff6b35' },
        { name: '小吉', stars: '⭐⭐⭐', color: '#ffa726' },
        { name: '平', stars: '⭐⭐', color: '#66bb6a' },
        { name: '小凶', stars: '⭐', color: '#888' }
    ],
    
    fortunes: [
        '今日財運亨通，投資理財有意外收穫！',
        '貴人相助，工作順利，升職加薪指日可待。',
        '桃花運佳，單身者有望遇見真愛。',
        '健康狀況良好，精神飽滿，活力充沛。',
        '學業進步，考試運佳，努力會有回報。',
        '家庭和睦，親情溫暖，享受天倫之樂。',
        '創意靈感不斷，藝術創作有新突破。',
        '人際關係和諧，朋友支持，社交活躍。',
        '旅行運佳，適合出門散心或商務出差。',
        '直覺敏銳，決策準確，把握機會成功。',
        '今日宜保守，穩紮穩打為上策。',
        '心情愉悅，正能量滿滿，感染身邊的人。',
        '意外驚喜將至，保持開放的心態。',
        '溝通順暢，談判協商容易達成共識。',
        '技能提升，專業能力獲得認可。'
    ],
    
    advice: [
        '穿戴金色飾品，增強財運氣場。',
        '多接觸綠色植物，有助於事業發展。',
        '東南方向是今日吉利方位。',
        '下午茶時間特別適合重要決定。',
        '與屬鼠、龍、猴的人合作運勢佳。',
        '今日宜早起，朝氣蓬勃迎接挑戰。',
        '紅色系服裝能為你帶來好人緣。',
        '聆聽輕音樂有助於靈感湧現。',
        '適量運動，保持身心健康平衡。',
        '分享快樂給他人，好運加倍返回。',
        '保持微笑，正面能量吸引好事。',
        '整理居家環境，清理負能量。',
        '寫下感謝日記，珍惜當下美好。',
        '嘗試新事物，突破舒適圈。',
        '多喝溫開水，淨化身心靈。'
    ]
};

// DOM 元素
const luckyCat = document.getElementById('luckyCat');
const fortuneBtn = document.getElementById('fortuneBtn');
const fortuneResult = document.getElementById('fortuneResult');
const shareBtn = document.getElementById('shareBtn');

// 狀態管理
let hasFortuneToday = false;
let currentFortune = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    checkTodaysFortune();
    setupEventListeners();
});

// 檢查今日是否已占卜
function checkTodaysFortune() {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('fortuneDate');
    const savedFortune = localStorage.getItem('todaysFortune');
    
    if (savedDate === today && savedFortune) {
        hasFortuneToday = true;
        currentFortune = JSON.parse(savedFortune);
        showSavedFortune();
    }
}

// 設置事件監聽器
function setupEventListeners() {
    fortuneBtn.addEventListener('click', getFortune);
    luckyCat.addEventListener('click', function() {
        if (!hasFortuneToday) {
            getFortune();
        } else {
            catAnimation();
        }
    });
    shareBtn.addEventListener('click', shareFortune);
}

// 獲取運勢
function getFortune() {
    if (hasFortuneToday) {
        showSavedFortune();
        return;
    }
    
    // 招財貓動畫
    catAnimation();
    
    // 延遲顯示結果，增加期待感
    setTimeout(() => {
        const fortune = generateFortune();
        displayFortune(fortune);
        saveTodaysFortune(fortune);
        hasFortuneToday = true;
        currentFortune = fortune;
        
        // 更新按鈕文字
        fortuneBtn.textContent = '查看今日運勢 ✨';
    }, 1500);
}

// 生成運勢
function generateFortune() {
    const level = fortuneData.levels[Math.floor(Math.random() * fortuneData.levels.length)];
    const fortuneText = fortuneData.fortunes[Math.floor(Math.random() * fortuneData.fortunes.length)];
    const advice = fortuneData.advice[Math.floor(Math.random() * fortuneData.advice.length)];
    
    // 生成 3-6 個幸運數字
    const luckyNumbers = generateLuckyNumbers();
    
    return {
        level,
        fortuneText,
        advice,
        luckyNumbers,
        date: new Date().toDateString()
    };
}

// 生成幸運數字
function generateLuckyNumbers() {
    const numbers = [];
    const count = 3 + Math.floor(Math.random() * 4); // 3-6個數字
    
    while (numbers.length < count) {
        const num = Math.floor(Math.random() * 99) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    
    return numbers.sort((a, b) => a - b);
}

// 顯示運勢結果
function displayFortune(fortune) {
    // 更新運勢等級
    document.getElementById('fortuneStars').textContent = fortune.level.stars;
    document.getElementById('fortuneLevel').textContent = fortune.level.name;
    document.getElementById('fortuneLevel').style.color = fortune.level.color;
    
    // 更新運勢文字
    document.getElementById('fortuneText').textContent = fortune.fortuneText;
    
    // 更新幸運數字
    const numbersContainer = document.getElementById('luckyNumbers');
    numbersContainer.innerHTML = '';
    fortune.luckyNumbers.forEach((num, index) => {
        setTimeout(() => {
            const numberElement = document.createElement('div');
            numberElement.className = 'lucky-number';
            numberElement.textContent = num;
            numbersContainer.appendChild(numberElement);
        }, index * 200);
    });
    
    // 更新建議
    document.getElementById('adviceText').textContent = fortune.advice;
    
    // 顯示結果區域
    fortuneResult.classList.remove('hidden');
    
    // 滾動到結果區域
    fortuneResult.scrollIntoView({ behavior: 'smooth' });
}

// 招財貓動畫
function catAnimation() {
    luckyCat.style.transform = 'scale(1.2) rotate(5deg)';
    
    setTimeout(() => {
        luckyCat.style.transform = 'scale(1.1) rotate(-5deg)';
    }, 200);
    
    setTimeout(() => {
        luckyCat.style.transform = 'scale(1) rotate(0deg)';
    }, 400);
    
    // 貓咪眨眼動畫
    const eyes = document.querySelectorAll('.eye');
    eyes.forEach(eye => {
        eye.style.animation = 'none';
        setTimeout(() => {
            eye.style.animation = 'blink 0.3s ease-in-out';
        }, 100);
        setTimeout(() => {
            eye.style.animation = 'blink 4s ease-in-out infinite';
        }, 500);
    });
}

// 保存今日運勢
function saveTodaysFortune(fortune) {
    const today = new Date().toDateString();
    localStorage.setItem('fortuneDate', today);
    localStorage.setItem('todaysFortune', JSON.stringify(fortune));
}

// 顯示已保存的運勢
function showSavedFortune() {
    if (currentFortune) {
        displayFortune(currentFortune);
        fortuneBtn.textContent = '查看今日運勢 ✨';
    }
}

// 分享運勢
function shareFortune() {
    if (!currentFortune) return;
    
    const shareText = `🐱 招財貓運勢占卜 🐱\n\n` +
                      `今日運勢：${currentFortune.level.name} ${currentFortune.level.stars}\n` +
                      `運勢詳情：${currentFortune.fortuneText}\n` +
                      `幸運數字：${currentFortune.luckyNumbers.join(', ')}\n` +
                      `開運建議：${currentFortune.advice}\n\n` +
                      `來試試你的運勢吧！`;
    
    if (navigator.share) {
        navigator.share({
            title: '🐱 招財貓運勢占卜',
            text: shareText,
            url: window.location.href
        });
    } else {
        // 複製到剪貼板
        navigator.clipboard.writeText(shareText).then(() => {
            alert('運勢已複製到剪貼板！快去分享給朋友吧 🎉');
        }).catch(() => {
            // 降級方案
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('運勢已複製到剪貼板！快去分享給朋友吧 🎉');
        });
    }
}

// 添加一些額外的互動效果
document.addEventListener('mousemove', function(e) {
    const cat = luckyCat;
    const rect = cat.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < 100) {
        const angle = Math.atan2(deltaY, deltaX);
        const tiltX = Math.sin(angle) * 5;
        const tiltY = Math.cos(angle) * -5;
        
        cat.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
    } else {
        cat.style.transform = '';
    }
});

// 節日特效（過年期間）
function addFestivalEffects() {
    const now = new Date();
    const isNewYear = (now.getMonth() === 0 && now.getDate() <= 15) || // 農曆新年期間
                      (now.getMonth() === 1 && now.getDate() <= 28);
    
    if (isNewYear) {
        document.body.style.background = 'linear-gradient(135deg, #ff4444, #ffcccc, #fff8e1)';
        
        // 添加飄落的金幣效果
        createFallingCoins();
    }
}

// 飄落金幣動畫
function createFallingCoins() {
    setInterval(() => {
        const coin = document.createElement('div');
        coin.innerHTML = '🪙';
        coin.style.position = 'fixed';
        coin.style.top = '-50px';
        coin.style.left = Math.random() * window.innerWidth + 'px';
        coin.style.fontSize = '20px';
        coin.style.zIndex = '1000';
        coin.style.pointerEvents = 'none';
        coin.style.animation = 'fall 3s linear forwards';
        
        document.body.appendChild(coin);
        
        setTimeout(() => {
            coin.remove();
        }, 3000);
    }, 2000);
}

// 添加掉落動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 初始化節日效果
addFestivalEffects();