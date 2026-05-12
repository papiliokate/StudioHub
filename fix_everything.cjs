const fs = require('fs');
const path = require('path');

const games = ['LightningWords', 'GoRabbit', 'SheSellsSeaShells', 'OGox'];

// 1. Fix conversion.html infinite loops
games.forEach(g => {
    const indexPath = path.join('..', g, 'index.html');
    const conversionPath = path.join('..', g, 'conversion.html');
    
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');
        
        // Remove the redirect script
        content = content.replace(/<script>\s*const params = new URLSearchParams[^<]*window\.location\.replace[^<]*<\/script>/gs, '');
        
        // Change main.js to conversion.js
        content = content.replace('src="/src/main.js"', 'src="/src/conversion.js"');
        content = content.replace('src="/main.js"', 'src="/conversion.js"');
        
        fs.writeFileSync(conversionPath, content);
        console.log(`Fixed ${conversionPath}`);
    }
});

// 2. Fix firebase.json rewrites
const firebasePath = path.join('firebase.json');
let firebaseConfig = JSON.parse(fs.readFileSync(firebasePath, 'utf8'));

// Inject conversion.html rewrites ABOVE the index.html rewrites
const newRewrites = [
    { "source": "/budbud/conversion", "destination": "/budbud/conversion.html" },
    { "source": "/go-rabbit/conversion", "destination": "/go-rabbit/conversion.html" },
    { "source": "/sunny-day-maze/conversion", "destination": "/sunny-day-maze/conversion.html" },
    { "source": "/lightning-words/conversion", "destination": "/lightning-words/conversion.html" },
    { "source": "/nomisekili/conversion", "destination": "/nomisekili/conversion.html" },
    { "source": "/o-gox/conversion", "destination": "/o-gox/conversion.html" },
    { "source": "/she-sells-sea-shells/conversion", "destination": "/she-sells-sea-shells/conversion.html" },
    { "source": "/smack-that-donkey/conversion", "destination": "/smack-that-donkey/conversion.html" }
];

// Remove existing conversion rewrites if they exist to avoid duplicates
firebaseConfig.hosting.rewrites = firebaseConfig.hosting.rewrites.filter(r => !r.source.endsWith('/conversion'));

// Prepend the new rewrites
firebaseConfig.hosting.rewrites = [...newRewrites, ...firebaseConfig.hosting.rewrites];

fs.writeFileSync(firebasePath, JSON.stringify(firebaseConfig, null, 2));
console.log('Fixed firebase.json');

// 3. Fix publishers.html
const pubPath = path.join('public', 'publishers.html');
let pubContent = fs.readFileSync(pubPath, 'utf8');

// Change Blog embed URL to target conversion directly
pubContent = pubContent.replace(
    'const embedUrl = `${baseUrl}?mode=embed&ref=conversion_business`;',
    'const embedUrl = `${baseUrl}conversion?mode=embed&ref=conversion_business`;'
);

// Change local preview frame to hit conversion
pubContent = pubContent.replace(
    'previewFrameBlog.src = `${oopsBaseUrl}${localPreviewPath}?mode=embed`;',
    'previewFrameBlog.src = `${oopsBaseUrl}${localPreviewPath}conversion?mode=embed`;'
);

// Change Captcha embed URL to target conversion directly
pubContent = pubContent.replace(
    '<iframe src="${gameUrl}?mode=captcha&clientId=${clientId}"',
    '<iframe src="${gameUrl}conversion?mode=captcha&clientId=${clientId}"'
);

// Change Captcha preview frame to target conversion directly
pubContent = pubContent.replace(
    'iframe.src = `http://localhost:5174/?mode=captcha&clientId=${clientId}&_t=${Date.now()}`;',
    'iframe.src = `http://localhost:5174/conversion?mode=captcha&clientId=${clientId}&_t=${Date.now()}`;'
);
pubContent = pubContent.replace(
    'iframe.src = `${oopsBaseUrl}${localPreviewPath}?mode=captcha&clientId=${clientId}&_t=${Date.now()}`;',
    'iframe.src = `${oopsBaseUrl}${localPreviewPath}conversion?mode=captcha&clientId=${clientId}&_t=${Date.now()}`;'
);

fs.writeFileSync(pubPath, pubContent);
console.log('Fixed publishers.html');
