const fs = require('fs');
const path = require('path');

const ecosystemPath = path.resolve(__dirname, 'ecosystem.json');
const ecosystem = JSON.parse(fs.readFileSync(ecosystemPath, 'utf8'));
const games = ecosystem.map(g => g.dir);

games.forEach(game => {
    const wfPath = path.resolve(__dirname, '..', game, '.github', 'workflows', 'daily_video.yml');
    if (!fs.existsSync(wfPath)) return;
    
    let content = fs.readFileSync(wfPath, 'utf8');

    // Does it still have Decentralized Election?
    if (content.includes('- name: Decentralized Election')) {
        console.log(`Fixing ${game}...`);
        
        // Extract the FORMATS array from the election step if it exists
        const match = content.match(/FORMATS=\((.*?)\)/);
        
        let newFormatStep = '';
        if (match) {
            const formatsStr = match[1];
            const formatCount = formatsStr.match(/"/g).length / 2;
            newFormatStep = `      - name: Randomize Video Format\n        run: |\n          FORMATS=(${formatsStr})\n          SELECTED_FORMAT=\${FORMATS[$(( $RANDOM % ${formatCount} ))]}\n          echo "Selected Format: $SELECTED_FORMAT"\n          echo "FORMAT=$SELECTED_FORMAT" >> $GITHUB_ENV\n\n`;
        }

        // Replace everything from "- name: Decentralized Election" up to the next "- name:"
        // We can do this by matching `- name: Decentralized Election` until `      - name: `
        content = content.replace(/\s+- name: Decentralized Election[\s\S]*?(?=\s+- name: )/, '\n' + newFormatStep);
        
        fs.writeFileSync(wfPath, content, 'utf8');
    } else {
        console.log(`${game} is already clean.`);
    }
});
