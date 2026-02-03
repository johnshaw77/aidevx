// 假裝工作中 - 摸魚神器
class FakeWorking {
    constructor() {
        this.currentMode = 0;
        this.modes = ['excelMode', 'codeMode', 'emailMode', 'meetingMode'];
        this.isTyping = false;
        this.typingSpeed = 50;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generateExcelData();
        this.startBusyIndicator();
        this.startAutoTyping();
        
        console.log('🤫 摸魚神器已啟動！');
        console.log('快捷鍵: Space=切換模式 | B=老闆鍵 | H=隱藏提示');
    }
    
    // 綁定事件
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.switchMode();
                    break;
                case 'KeyB':
                    this.activateBossMode();
                    break;
                case 'KeyH':
                    this.toggleHelp();
                    break;
            }
        });
        
        // 滑鼠移動觸發活動
        document.addEventListener('mousemove', () => {
            this.simulateActivity();
        });
    }
    
    // 切換工作模式
    switchMode() {
        // 隱藏當前模式
        document.getElementById(this.modes[this.currentMode]).classList.remove('active');
        
        // 切換到下一個模式
        this.currentMode = (this.currentMode + 1) % this.modes.length;
        document.getElementById(this.modes[this.currentMode]).classList.add('active');
        
        // 更新標題
        this.updatePageTitle();
        
        // 重新開始打字動畫
        this.startAutoTyping();
        
        console.log(`切換到: ${this.modes[this.currentMode]}`);
    }
    
    // 老闆鍵 - 緊急切換到正經內容
    activateBossMode() {
        document.querySelectorAll('.work-mode').forEach(mode => {
            mode.classList.remove('active');
        });
        
        document.getElementById('bossMode').classList.add('active');
        document.title = '重要政策文件 - 公司內部資料';
        
        console.log('🚨 老闆鍵啟動！');
    }
    
    // 切換提示顯示
    toggleHelp() {
        const helpTip = document.getElementById('helpTip');
        helpTip.classList.toggle('hidden');
    }
    
    // 更新頁面標題
    updatePageTitle() {
        const titles = {
            'excelMode': 'Microsoft Excel - 資料分析報表.xlsx',
            'codeMode': 'Visual Studio Code - 專案開發',
            'emailMode': 'Outlook - 收件匣 (47)',
            'meetingMode': '會議記錄 - Teams 會議進行中'
        };
        
        document.title = titles[this.modes[this.currentMode]] || '工作中...';
    }
    
    // 生成 Excel 假數據
    generateExcelData() {
        const tbody = document.getElementById('excelData');
        const products = ['筆記型電腦', '桌上型電腦', '平板電腦', '智慧手機', '穿戴裝置', '印表機', '螢幕', '鍵盤', '滑鼠'];
        const regions = ['北區', '中區', '南區', '東區'];
        
        for (let i = 1; i <= 15; i++) {
            const row = document.createElement('tr');
            const product = products[Math.floor(Math.random() * products.length)];
            const region = regions[Math.floor(Math.random() * regions.length)];
            const sales = Math.floor(Math.random() * 10000) + 1000;
            const growth = (Math.random() * 20 - 10).toFixed(1);
            
            row.innerHTML = `
                <td>${i}</td>
                <td>${product}</td>
                <td>${region}</td>
                <td>$${sales.toLocaleString()}</td>
                <td>${growth}%</td>
                <td>=D${i}*1.1</td>
                <td>Q4</td>
                <td>${Math.floor(Math.random() * 100)}%</td>
            `;
            
            tbody.appendChild(row);
        }
    }
    
    // 開始自動打字動畫
    startAutoTyping() {
        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
        }
        
        const currentModeId = this.modes[this.currentMode];
        
        switch(currentModeId) {
            case 'codeMode':
                this.typeCode();
                break;
            case 'emailMode':
                this.typeEmail();
                break;
            case 'meetingMode':
                this.typeMeetingNotes();
                break;
        }
    }
    
    // 打字效果 - 程式碼
    typeCode() {
        const codeLines = [
            '        """分析銷售趨勢並生成報告"""',
            '        trend_data = self.df.groupby("month").sum()',
            '        # 計算同期比較',
            '        growth_rate = self.calculate_growth(trend_data)',
            '        ',
            '        # 生成視覺化圖表',
            '        plt.figure(figsize=(12, 6))',
            '        plt.plot(trend_data.index, trend_data.values)',
            '        plt.title("月度銷售趨勢分析")',
            '        plt.xlabel("月份")',
            '        plt.ylabel("銷售額")',
            '        ',
            '        return {',
            '            "trend": trend_data,',
            '            "growth": growth_rate,',
            '            "recommendation": self.get_recommendation()',
            '        }'
        ];
        
        this.typeText('codeEditor', codeLines, 'typingCursor');
    }
    
    // 打字效果 - 郵件
    typeEmail() {
        const emailContent = [
            '親愛的經理，',
            '',
            '感謝您對Q4專案進度的關注。根據最新的進度報告，目前專案執行狀況如下：',
            '',
            '✅ 已完成項目：',
            '• 需求分析階段 (100%)',
            '• 系統設計階段 (95%)',
            '• 前端開發 (80%)',
            '',
            '🔄 進行中項目：',
            '• 後端API開發 (預計本週完成)',
            '• 資料庫優化 (進度70%)',
            '• 測試環境建置',
            '',
            '📅 預計時程：',
            '我們預計在下週完成所有核心功能開發，並開始進行整合測試。',
            '整體專案仍在預定時程內，預計2月底可以進入正式測試階段。',
            '',
            '如有任何問題，請隨時與我討論。',
            '',
            '最好的祝福，',
            '[您的姓名]'
        ];
        
        this.typeText('emailContent', emailContent, 'emailCursor', true);
    }
    
    // 打字效果 - 會議記錄
    typeMeetingNotes() {
        const meetingContent = [
            '📅 會議時間：2024年2月3日 14:00-15:30',
            '👥 與會人員：專案團隊、部門主管',
            '',
            '📋 會議議程：',
            '1. Q4專案進度檢討',
            '2. 下階段工作規劃',
            '3. 資源配置討論',
            '',
            '💼 討論要點：',
            '',
            '• 專案目前進度達80%，符合預期時程',
            '• 技術團隊反映API整合需要額外時間',
            '• 測試環境預計下週完成部署',
            '• 使用者介面設計獲得好評',
            '',
            '📝 決議事項：',
            '1. 延長API開發時程1週',
            '2. 增派1名前端工程師支援',
            '3. 提前準備使用者測試計畫',
            '',
            '⚡ 行動項目：',
            '• [@技術部] 完成API文件更新',
            '• [@設計部] 準備使用者測試原型',
            '• [@專案經理] 更新甘特圖時程',
            '',
            '📞 下次會議：2024年2月10日 14:00'
        ];
        
        this.typeText('meetingNotes', meetingContent, 'meetingCursor', true);
    }
    
    // 通用打字動畫
    typeText(elementId, lines, cursorId, preserveNewlines = false) {
        const element = document.getElementById(elementId);
        const cursor = document.getElementById(cursorId);
        
        element.innerHTML = '';
        if (cursor) cursor.style.display = 'inline';
        
        let lineIndex = 0;
        let charIndex = 0;
        
        const type = () => {
            if (lineIndex >= lines.length) {
                if (cursor) cursor.style.display = 'none';
                return;
            }
            
            const currentLine = lines[lineIndex];
            
            if (charIndex < currentLine.length) {
                element.innerHTML += currentLine.charAt(charIndex);
                charIndex++;
                this.typingTimer = setTimeout(type, this.typingSpeed + Math.random() * 30);
            } else {
                // 換行
                if (preserveNewlines) {
                    element.innerHTML += '<br>';
                }
                lineIndex++;
                charIndex = 0;
                this.typingTimer = setTimeout(type, 200);
            }
        };
        
        type();
    }
    
    // 忙碌指示器
    startBusyIndicator() {
        const busyTexts = [
            '編譯程式碼...',
            '分析資料中...',
            '同步檔案...',
            '處理請求...',
            '計算結果...',
            '更新狀態...',
            '載入模組...',
            '執行查詢...',
            '產生報告...',
            '備份資料...'
        ];
        
        const busyText = document.getElementById('busyText');
        
        setInterval(() => {
            const randomText = busyTexts[Math.floor(Math.random() * busyTexts.length)];
            busyText.textContent = randomText;
        }, 3000);
    }
    
    // 模擬工作活動
    simulateActivity() {
        // 隨機更新 Excel 進度
        if (Math.random() < 0.1) {
            const progress = Math.floor(Math.random() * 100);
            const progressEl = document.getElementById('excelProgress');
            if (progressEl) {
                progressEl.textContent = `正在計算公式... ${progress}%`;
            }
        }
    }
    
    // 隨機工作事件
    startRandomEvents() {
        setInterval(() => {
            const events = [
                () => this.showNotification('📧 新郵件：專案進度更新'),
                () => this.showNotification('💾 自動儲存完成'),
                () => this.showNotification('🔄 同步中...'),
                () => this.updateProgress(),
            ];
            
            if (Math.random() < 0.3) {
                const randomEvent = events[Math.floor(Math.random() * events.length)];
                randomEvent();
            }
        }, 5000);
    }
    
    // 顯示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: #0078d4;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 13px;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 更新進度
    updateProgress() {
        const progress = Math.floor(Math.random() * 100);
        const busyText = document.getElementById('busyText');
        busyText.textContent = `處理中 ${progress}%...`;
    }
}

// 添加動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(-300px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-300px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 等待頁面載入完成
document.addEventListener('DOMContentLoaded', () => {
    const fakeWorking = new FakeWorking();
    fakeWorking.startRandomEvents();
    
    // 初始化提示
    setTimeout(() => {
        console.log('🎯 摸魚神器使用說明：');
        console.log('🔄 按 Space 鍵切換工作模式');
        console.log('🚨 按 B 鍵使用老闆鍵');
        console.log('👁️ 按 H 鍵隱藏/顯示幫助');
        console.log('🖱️ 移動滑鼠模擬工作活動');
    }, 1000);
});

// 防止意外關閉
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '確定要關閉工作程式嗎？';
});

console.log('🤫 假裝工作系統載入中...');