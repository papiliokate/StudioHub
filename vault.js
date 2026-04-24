async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

let securityHashes = null;

async function loadHashes() {
    try {
        const res = await fetch('/security_hashes.json');
        securityHashes = await res.json();
    } catch(e) {
        console.error("Failed to load hashes", e);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Basic Security: Protect direct URL hopping without completing step 1
    if (localStorage.getItem('vault_unlocked') !== 'true') {
        window.location.href = '/';
        return;
    }

    await loadHashes();

    const vaultBoxes = document.querySelectorAll('.vault-box');
    const submitBtn = document.getElementById("vault-submit");
    const errorEl = document.getElementById("vault-error");

    vaultBoxes.forEach((box, index) => {
        const handler = () => {
            errorEl.style.display = "none";
            
            if(box.value.length === 1 && index < vaultBoxes.length - 1) {
                vaultBoxes[index + 1].focus();
            }
            if(Array.from(vaultBoxes).every(b => b.value.length === 1)) {
                submitBtn.style.display = "inline-block";
            } else {
                submitBtn.style.display = "none";
            }
        };
        box.addEventListener('input', handler);
        // Add keydown for backspace to move backwards easily
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && box.value === '' && index > 0) {
                vaultBoxes[index - 1].focus();
                vaultBoxes[index - 1].value = '';
            }
        });
    });

    submitBtn.addEventListener("click", async () => {
        const region = document.querySelector('input[name="region"]:checked').value;
        const guess = Array.from(vaultBoxes).map(b => b.value.toUpperCase()).join('');
        const guessHash = await sha256(guess);
        
        const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Kiritimati', year: 'numeric', month: '2-digit', day: '2-digit' });
        const dateStr = formatter.format(new Date());
        
        const dayHashes = securityHashes[dateStr];
        
        if (dayHashes && guessHash === dayHashes[region]) {
            celebrateVictory();
        } else {
            // Re-trigger CSS animation
            errorEl.style.display = 'block';
            errorEl.style.animation = 'none';
            void errorEl.offsetWidth; 
            errorEl.style.animation = 'shake 0.4s';
        }
    });

    function celebrateVictory() {
        document.getElementById('master-vault').style.display = 'none';
        document.getElementById('vault-reward').style.display = 'block';
        
        // Play Applause
        const applause = new Audio('/assets/applause.mp3');
        applause.volume = 0.8;
        applause.play().catch(e => console.warn("Audio play blocked", e));
        
        // Confetti Loop
        const duration = 5000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#00e676', '#e040fb', '#aa00ff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#00e676', '#e040fb', '#aa00ff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
        
        // Wipe flag so they must unlock it again tomorrow
        localStorage.removeItem('vault_unlocked');
    }

    document.getElementById("vault-share").addEventListener("click", () => {
        const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Kiritimati', year: 'numeric', month: '2-digit', day: '2-digit' });
        const dateStr = formatter.format(new Date());
        const p = String.fromCharCode(65, 89, 82, 70, 73);
        const text = `I am a Vault Master. 🗝️ The crypt has been breached.\n${dateStr}\nCan you decrypt the clues and unlock the secrets?\nhttps://oops-games-hub.web.app/\n\nProof: ${p}`;
        if (navigator.share) {
            navigator.share({ title: 'Master Vault Unlocked', text }).catch(e => {});
        } else {
            navigator.clipboard.writeText(text);
            alert("Cryptic message copied to your clipboard!");
        }
    });

});
