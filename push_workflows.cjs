const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const repos = [
    'BudBud', 'GoRabbit', 'LightningWords', 'Nimosekili', 
    'OGox', 'SheSellsSeaShells', 'SmackThatDonkey', 'SunnyDayMaze', 'StudioHub'
];

repos.forEach(repo => {
    const repoPath = path.resolve(__dirname, '..', repo);
    if (!fs.existsSync(repoPath)) return;
    
    console.log(`\n--- Pushing changes for ${repo} ---`);
    try {
        execSync(`git add .`, { cwd: repoPath, stdio: 'inherit' });
        
        // Only commit if there are changes
        const status = execSync(`git status --porcelain`, { cwd: repoPath }).toString();
        if (status.trim().length > 0) {
            execSync(`git commit -m "Centralize video generation to StudioHub dispatcher"`, { cwd: repoPath, stdio: 'inherit' });
            execSync(`git push`, { cwd: repoPath, stdio: 'inherit' });
        } else {
            console.log(`No changes to commit for ${repo}`);
        }
    } catch (e) {
        console.error(`Failed to push ${repo}:`, e.message);
    }
});
