(function() {
    const TOTAL_GAMES_LIST = [
        'budbud', 
        'go-rabbit', 
        'sunny-day-maze', 
        'lightning-words', 
        'nomisekili', 
        'o-gox', 
        'she-sells-sea-shells', 
        'smack-that-donkey'
    ];

    const STORAGE_KEY = 'oops_player_data';

    // Parse current game from URL. e.g., oops-games.com/go-rabbit/ -> 'go-rabbit'
    const pathParts = window.location.pathname.split('/').filter(p => p.length > 0);
    const currentGame = pathParts.length > 0 ? pathParts[0] : 'hub';

    function getLocalToday() {
        // Return YYYY-MM-DD in local time
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function calculateDateDifference(dateString1, dateString2) {
        const d1 = new Date(dateString1 + 'T00:00:00');
        const d2 = new Date(dateString2 + 'T00:00:00');
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    }

    function loadData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse oops_player_data", e);
            }
        }
        return null; // First time playing
    }

    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function injectStyles() {
        if (document.getElementById('oops-streak-styles')) return;
        const style = document.createElement('style');
        style.id = 'oops-streak-styles';
        style.innerHTML = `
            :root {
                --streak-bg: rgba(15, 23, 42, 0.95);
                --streak-border: rgba(255, 255, 255, 0.1);
                --streak-text: #f8fafc;
                --streak-accent: #3b82f6;
            }
            #oops-streak-modal {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                font-family: system-ui, -apple-system, sans-serif;
            }
            #oops-streak-modal.show {
                opacity: 1;
                pointer-events: auto;
            }
            .streak-content {
                background: var(--streak-bg);
                border: 1px solid var(--streak-border);
                border-radius: 20px;
                padding: 30px;
                text-align: center;
                max-width: 90%;
                width: 350px;
                box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
                transform: translateY(20px);
                transition: transform 0.3s ease;
                color: var(--streak-text);
            }
            #oops-streak-modal.show .streak-content {
                transform: translateY(0);
            }
            .streak-badge-container {
                width: 150px;
                height: 150px;
                margin: 0 auto 20px auto;
                position: relative;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--streak-accent), #1e3a8a);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
            }
            .streak-number {
                font-size: 4rem;
                font-weight: 900;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .streak-title {
                font-size: 1.5rem;
                font-weight: 800;
                margin: 0 0 10px 0;
            }
            .streak-subtitle {
                font-size: 1rem;
                opacity: 0.8;
                margin: 0 0 25px 0;
            }
            .streak-buttons {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .streak-btn {
                padding: 12px;
                border-radius: 10px;
                border: none;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.1s;
            }
            .streak-btn:active {
                transform: scale(0.98);
            }
            .btn-brag {
                background: var(--streak-accent);
                color: white;
            }
            .btn-download {
                background: rgba(255,255,255,0.1);
                color: white;
            }
            .btn-play {
                background: transparent;
                color: white;
                opacity: 0.7;
                text-decoration: underline;
                margin-top: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    async function generateShareImage(numberText, subtitleText) {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        // Background
        const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // Badge Circle
        ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
        ctx.shadowBlur = 50;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 20;
        
        const circleGrad = ctx.createLinearGradient(340, 340, 740, 740);
        circleGrad.addColorStop(0, '#3b82f6'); // Base accent
        circleGrad.addColorStop(1, '#1e3a8a');

        ctx.beginPath();
        ctx.arc(540, 500, 250, 0, 2 * Math.PI);
        ctx.fillStyle = circleGrad;
        ctx.fill();

        // Number
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 200px sans-serif';
        ctx.fillText(numberText, 540, 500);

        // Text
        ctx.shadowBlur = 0;
        ctx.font = 'bold 80px sans-serif';
        ctx.fillText('Oops-Games', 540, 150);

        ctx.font = 'bold 60px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(subtitleText, 540, 900);

        return new Promise(resolve => {
            canvas.toBlob(blob => resolve(blob), 'image/png');
        });
    }

    function showModal(title, subtitle, numberText, type = 'streak') {
        let modal = document.getElementById('oops-streak-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'oops-streak-modal';
            modal.innerHTML = `
                <div class="streak-content">
                    <div class="streak-badge-container">
                        <div class="streak-number" id="oops-streak-num"></div>
                    </div>
                    <h2 class="streak-title" id="oops-streak-title"></h2>
                    <p class="streak-subtitle" id="oops-streak-sub"></p>
                    <div class="streak-buttons">
                        <button class="streak-btn btn-brag" id="oops-btn-brag">📤 Brag</button>
                        <button class="streak-btn btn-download" id="oops-btn-download">💾 Download Badge</button>
                        <button class="streak-btn btn-play" id="oops-btn-play">Let me play!</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        document.getElementById('oops-streak-title').innerText = title;
        document.getElementById('oops-streak-sub').innerText = subtitle;
        
        let displayNum = numberText;
        if (type === 'streak') displayNum = numberText;
        if (type === 'triple') displayNum = '3x';
        if (type === 'all') displayNum = '100%';
        document.getElementById('oops-streak-num').innerText = displayNum;

        const bragBtn = document.getElementById('oops-btn-brag');
        const dlBtn = document.getElementById('oops-btn-download');
        const playBtn = document.getElementById('oops-btn-play');

        // Cleanup old listeners
        const newBrag = bragBtn.cloneNode(true);
        bragBtn.replaceWith(newBrag);
        const newDl = dlBtn.cloneNode(true);
        dlBtn.replaceWith(newDl);

        newBrag.addEventListener('click', async () => {
            newBrag.innerText = "Generating...";
            const blob = await generateShareImage(displayNum, subtitle);
            const file = new File([blob], 'oops-badge.png', { type: 'image/png' });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Oops-Games',
                        text: 'Can you beat this? Play instantly at oops-games.com'
                    });
                } catch (e) {
                    console.log("Share failed", e);
                }
            } else {
                // Fallback copy to clipboard
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            [blob.type]: blob
                        })
                    ]);
                    alert("Image copied to clipboard!");
                } catch(e) {
                    alert("Sharing not supported on this browser.");
                }
            }
            newBrag.innerText = "📤 Brag";
        });

        newDl.addEventListener('click', async () => {
            const blob = await generateShareImage(displayNum, subtitle);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `oops-${type}-badge.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        playBtn.onclick = () => {
            modal.classList.remove('show');
        };

        // Show it
        // slight delay so transition works
        setTimeout(() => modal.classList.add('show'), 100);
    }

    function init() {
        // Do not track streaks or show popups if in carousel or publisher embed mode
        const params = new URLSearchParams(window.location.search);
        if (params.get('carousel') === 'true' || params.get('mode') === 'embed') {
            return;
        }

        const today = getLocalToday();
        let data = loadData();
        let isReturning = false;
        let showStreakPopup = false;
        let showTriplePopup = false;
        let showAllPopup = false;

        if (!data) {
            // First time ever
            data = {
                last_played_date: today,
                current_streak: 1,
                games_played: [currentGame],
                unlocked_badges: []
            };
            saveData(data);
            return; // No popup on very first visit
        }

        isReturning = true;

        // Process Streak
        if (data.last_played_date !== today) {
            const diff = calculateDateDifference(data.last_played_date, today);
            if (diff === 1) {
                // Consecutive day
                data.current_streak += 1;
            } else {
                // Streak broken
                data.current_streak = 1;
            }
            data.last_played_date = today;
            showStreakPopup = true;
        }

        // Process Game Played Array (only if it's a game, not the hub)
        if (currentGame !== 'hub' && currentGame !== '') {
            if (!data.games_played.includes(currentGame)) {
                data.games_played.push(currentGame);
            }
        }

        // Process Badges
        if (data.games_played.length >= 3 && !data.unlocked_badges.includes('triple_threat')) {
            data.unlocked_badges.push('triple_threat');
            showTriplePopup = true;
        }

        const playedAll = TOTAL_GAMES_LIST.every(game => data.games_played.includes(game));
        if (playedAll && !data.unlocked_badges.includes('completionist')) {
            data.unlocked_badges.push('completionist');
            showAllPopup = true;
        }

        saveData(data);

        // UI Flow
        if (showStreakPopup || showTriplePopup || showAllPopup) {
            injectStyles();
            
            // Queue popups
            const popups = [];
            if (showStreakPopup) {
                popups.push(() => showModal('Daily Streak!', `${data.current_streak} days in a row!`, data.current_streak.toString(), 'streak'));
            }
            if (showTriplePopup) {
                popups.push(() => showModal('Triple Threat!', 'Played 3 different games', '', 'triple'));
            }
            if (showAllPopup) {
                popups.push(() => showModal('The Completionist!', 'Played every single game!', '', 'all'));
            }

            // Show first popup
            if (popups.length > 0) {
                popups[0]();
                // If there are multiple, they currently will overwrite each other or user closes one. 
                // For simplicity, we just show the most impressive one if they happen at the exact same time,
                // or we could chain them. Let's chain them by hooking into playBtn, but that's complex.
                // Re-writing simple chain:
                if(popups.length > 1) {
                    let currentIndex = 0;
                    document.body.addEventListener('click', (e) => {
                        if(e.target && e.target.id === 'oops-btn-play') {
                            currentIndex++;
                            if (currentIndex < popups.length) {
                                setTimeout(popups[currentIndex], 400); // slight delay after close
                            }
                        }
                    });
                }
            }
        }
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
