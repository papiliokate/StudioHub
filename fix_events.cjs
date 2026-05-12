const fs = require('fs');
const path = require('path');

const dirs = ['BudBud', 'GoRabbit', 'LightningWords', 'Nimosekili', 'OGox', 'SheSellsSeaShells', 'SmackThatDonkey', 'SunnyDayMaze'];

dirs.forEach(d => {
    const file = path.join('..', d, 'conversion.js');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Add optional chaining to all DOM element event listeners to prevent runtime crashes when B2C UI is stripped
        content = content.replace(/startBtn\.addEventListener/g, 'startBtn?.addEventListener');
        content = content.replace(/tutorialBtn\.addEventListener/g, 'tutorialBtn?.addEventListener');
        content = content.replace(/btnCloseTutorial\.addEventListener/g, 'btnCloseTutorial?.addEventListener');
        content = content.replace(/btnBingePlay\.addEventListener/g, 'btnBingePlay?.addEventListener');
        content = content.replace(/btnShareFree\.addEventListener/g, 'btnShareFree?.addEventListener');
        content = content.replace(/btnBuyBinge\.addEventListener/g, 'btnBuyBinge?.addEventListener');
        content = content.replace(/btnRemindTomorrow\.addEventListener/g, 'btnRemindTomorrow?.addEventListener');
        
        fs.writeFileSync(file, content);
        console.log(`Fixed ${file}`);
    }
});
