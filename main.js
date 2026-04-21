import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";

try {
  const firebaseConfig = {
    apiKey: "AIzaSyDgeMPAM9aKivOPLBuF_Fqm8uhedO5jeYc",
    authDomain: "go-rabbit-4af82.firebaseapp.com",
    projectId: "go-rabbit-4af82",
    storageBucket: "go-rabbit-4af82.firebasestorage.app",
    messagingSenderId: "746967187087",
    appId: "1:746967187087:web:d2413f9cb46efae41cbafa",
    measurementId: "G-BJLK9339LN"
  };
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
} catch (e) {
  console.warn("Analytics error:", e);
}

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
  console.log("Studio Hub initialized.");
  await loadHashes();
    
  const c1 = document.getElementById("cypher-1");
  const c2 = document.getElementById("cypher-2");
  const c3 = document.getElementById("cypher-3");
  
  let isUnlocking = false;
  setInterval(async () => {
      if (!securityHashes || isUnlocking) return;
      
      const v1 = c1.value.trim();
      const v2 = c2.value.trim();
      const v3 = c3.value.trim();
      
      if (v1.length === 4 && v2.length === 4 && v3.length === 4) {
          isUnlocking = true; // Lock briefly to check
          const arr = [v1.toUpperCase(), v2.toUpperCase(), v3.toUpperCase()].sort();
          const guess = arr.join('');
          const guessHash = await sha256(guess);
          
          const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Kiritimati', year: 'numeric', month: '2-digit', day: '2-digit' });
          const dateStr = formatter.format(new Date());
          
          const dayHashes = securityHashes[dateStr];
          if (dayHashes && guessHash === dayHashes.c) {
              // Valid! Play sound and transition
              const creak = new Audio('/assets/door_creak.mp3');
              creak.volume = 0.8;
              creak.play().catch(e => console.warn(e));
              
              document.body.style.transition = "opacity 1.5s ease";
              document.body.style.opacity = "0"; // Fade out
              
              localStorage.setItem('vault_unlocked', 'true');
              
              setTimeout(() => {
                  window.location.href = '/vault.html';
              }, 1500);
          } else {
              isUnlocking = false; // Release lock
          }
      }
  }, 250);

  // Still preserve the auto-focus UX for typing manually
  [c1, c2, c3].forEach((input, index, arr) => {
      input.addEventListener('input', () => {
          if (input.value.trim().length === 4 && index < 2) {
              arr[index + 1].focus();
          }
      });
  });



});
