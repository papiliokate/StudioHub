const fs = require('fs');
const crypto = require('crypto');

// Deterministic PRNG based on a seed
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function getSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function sha256(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

const FIRST_LETTERS = ["Z","O","T","T","F","F","S","S","E","N"];

// Generate sequence
const hashes = {};
const startDate = new Date("2024-01-01T00:00:00Z"); // Start from a known safe past to future

for (let i = 0; i < 2000; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // 1. Generate Cyphers
    let seed = getSeed(dateStr);
    let rand = mulberry32(seed);
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let cyphers = [];
    for(let k=0; k<3; k++) {
        let str = "";
        for(let j=0; j<4; j++) {
            str += chars.charAt(Math.floor(rand() * chars.length));
        }
        cyphers.push(str);
    }
    
    // Ordered sort - StudioHub will require the cyphers concatenated in alphabetical order so it doesn't matter what order player types them
    let sortedCyphers = [...cyphers].sort().join('');
    let cypherHash = sha256(sortedCyphers);

    // 2. Generate Date Answers
    const parts = dateStr.split('-');
    const YYYY = parts[0];
    const MM = parts[1];
    const DD = parts[2];
    
    // US: MM/DD/YYYY
    const usStr = MM + DD + YYYY;
    let usAns = "";
    for(let char of usStr) { usAns += FIRST_LETTERS[parseInt(char)]; }

    // EU: DD/MM/YYYY
    const euStr = DD + MM + YYYY;
    let euAns = "";
    for(let char of euStr) { euAns += FIRST_LETTERS[parseInt(char)]; }

    hashes[dateStr] = {
        c: cypherHash,
        us: sha256(usAns),
        eu: sha256(euAns)
    };
}

// Write to public directory so it gets deployed via Firebase Hosting
fs.writeFileSync('./public/security_hashes.json', JSON.stringify(hashes, null, 2));
console.log("Wrote " + Object.keys(hashes).length + " cryptographic hashes to ./public/security_hashes.json");
