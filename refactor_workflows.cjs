const fs = require('fs');
const path = require('path');

const games = [
    'BudBud', 'GoRabbit', 'LightningWords', 'Nimosekili', 
    'OGox', 'SheSellsSeaShells', 'SmackThatDonkey', 'SunnyDayMaze'
];

games.forEach(game => {
    const wfPath = path.resolve(__dirname, '..', game, '.github', 'workflows', 'daily_video.yml');
    if (!fs.existsSync(wfPath)) {
        console.log(`Skipping ${game}: No daily_video.yml found`);
        return;
    }
    
    let content = fs.readFileSync(wfPath, 'utf8');

    // Replace schedule triggers
    content = content.replace(/on:\s+schedule:[\s\S]+?workflow_dispatch:/, `on:\n  repository_dispatch:\n    types: [generate-daily-video]\n  workflow_dispatch:`);

    // Extract the FORMATS array from the election step if it exists
    const match = content.match(/FORMATS=\((.*?)\)/);
    
    if (match) {
        const formatsStr = match[1];
        // How many formats?
        const formatCount = formatsStr.match(/"/g).length / 2;
        
        const newFormatStep = `      - name: Randomize Video Format
        run: |
          FORMATS=(${formatsStr})
          SELECTED_FORMAT=\${FORMATS[$(( $RANDOM % ${formatCount} ))]}
          echo "Selected Format: $SELECTED_FORMAT"
          echo "FORMAT=$SELECTED_FORMAT" >> $GITHUB_ENV

`;
        // Replace the Decentralized Election step completely with the new format step
        content = content.replace(/\s+- name: Decentralized Election[\s\S]+?(?=\s+- name: Install dependencies)/, '\n' + newFormatStep);
    } else {
        // SunnyDayMaze doesn't have it, just remove if any exists, but it doesn't
        content = content.replace(/\s+- name: Decentralized Election[\s\S]+?(?=\s+- name: Install dependencies)/, '\n');
    }
    
    // Remove if: steps.election.outputs.proceed == 'true' AND 'success() && steps.election.outputs.proceed == 'true'
    content = content.replace(/\s*if: steps\.election\.outputs\.proceed == 'true'/g, '');
    content = content.replace(/\s*if: success\(\) && steps\.election\.outputs\.proceed == 'true'/g, '\n        if: success()');

    fs.writeFileSync(wfPath, content, 'utf8');
    console.log(`Successfully refactored ${game}`);
});
