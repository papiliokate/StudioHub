import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const games = [
    { dir: 'BudBud', repo: 'papiliokate/BudBud', path: 'budbud' },
    { dir: 'GoRabbit', repo: 'papiliokate/GoRabbit', path: 'go-rabbit' },
    { dir: 'SunnyDayMaze', repo: 'papiliokate/SunnyDayMaze', path: 'sunny-day-maze' },
    { dir: 'LightningWords', repo: 'papiliokate/LightningWords', path: 'lightning-words' },
    { dir: 'Nimosekili', repo: 'papiliokate/Nimosekili', path: 'nomisekili' },
    { dir: 'OGox', repo: 'papiliokate/O-Gox', path: 'o-gox' },
    { dir: 'SheSellsSeaShells', repo: 'papiliokate/SheSellsSeaShells', path: 'she-sells-sea-shells' },
    { dir: 'SmackThatDonkey', repo: 'papiliokate/SmackThatDonkey', path: 'smack-that-donkey' }
];

const workspaceRoot = path.resolve(__dirname, '..');
const hubDistDir = path.resolve(__dirname, 'dist');

// Make sure hub is built first
console.log('Building StudioHub...');
execSync('cmd /c "npm install && npm run build"', { cwd: __dirname, stdio: 'inherit' });

console.log('Building all games and migrating to subdirectories...');

for (const game of games) {
    const gameDir = path.resolve(workspaceRoot, game.dir);
    console.log(`\n--- Processing ${game.dir} ---`);
    
    // Build game with specific base path
    console.log(`Building with base: /${game.path}/`);
    try {
        execSync(`cmd /c "npm install && npm run build -- --base=/${game.path}/"`, { 
            cwd: gameDir, 
            stdio: 'inherit' 
        });
        
        // Copy to StudioHub dist
        const sourceDist = path.resolve(gameDir, 'dist');
        const targetDist = path.resolve(hubDistDir, game.path);
        
        // Remove existing if any
        if (fs.existsSync(targetDist)) {
            fs.rmSync(targetDist, { recursive: true, force: true });
        }
        
        // Copy recursive
        fs.cpSync(sourceDist, targetDist, { recursive: true });
        console.log(`Successfully copied ${game.dir} to /${game.path}`);
    } catch (e) {
        console.error(`Failed to process ${game.dir}:`, e.message);
    }
}

console.log('\n--- Build Complete ---');
console.log('You can now run: firebase deploy --only hosting:hub');
