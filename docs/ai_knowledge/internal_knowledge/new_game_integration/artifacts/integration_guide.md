# New Game Integration Guide

An exhaustive review of the platform's requirements for seamlessly integrating a newly developed game into the Oops-Games ecosystem.

## 1. Studio Hub Integration
The game must be accessible from the centralized link-in-bio hub.
- **Action**: Add a new game link button in `StudioHub/index.html`.
- **Formatting**: Maintain the established glassmorphic design and provide elements for the game's icon, a title, subtitle, and an arrow indicator.
- **Target App**: Deploy to the specific Firebase Hosting endpoint for the game via GitHub Actions, and link that `.web.app` address in the Studio Hub.

## 2. Automated Video Content Generation
To maintain social media strategy, the game must self-play to generate content.
- **Auto-Play/Solver Mode**: The game logic must handle URL parameters like `?autoplay=standard`, `fail`, or `interactive`. The game engine must manually simulate interactions for the `-fail` and `-interactive` edge-cases to guarantee the recording finishes.
- **Completion Event**: Once the automated playthrough is complete (or after the simulated failure state), the application must set `window._VIDEO_RECORDING_DONE = true` so the external recorder knows when to stop and doesn't timeout.
- **Video Script**: Provide a `scripts/generate_video.js` script that uses `puppeteer-screen-recorder` and `xvfb` to capture the game.
- **Compositing**: The video generator must composite the raw recording with:
  - Background music (`public/bgm/*.mp3`).
  - Google TTS audio synthesized dynamically for formats like `standard`, `fail`, and `interactive`.
  - The final file must be saved into `public/daily_video.mp4`.

## 3. CI/CD & Social Media Pipeline (GitHub Actions)
Each game handles its deployment and social distribution via cron jobs.
- **Daily Puzzle Workflow**: Create `.github/workflows/daily_puzzle.yml` to routinely call puzzle generation scripts (`scripts/generate_puzzle.js`) and commit `public/daily_puzzle.json` to the repo.
- **Daily Video Workflow**: Create `.github/workflows/daily_video.yml` with the following pipeline:
  1. Installs Puppeteer dependencies (`libgbm-dev`, `xvfb`, `ffmpeg`).
  2. Runs `scripts/generate_video.js` within `xvfb-run` to capture video and composite audio.
  3. Executes `npm run build` using tools like Vite.
  4. Deploys to Firebase Hosting utilizing the standardized Multi-Site pattern: `npx firebase-tools deploy --only hosting:<slug> --project go-rabbit-4af82 --token ...`. Avoid setting up isolated projects.
  5. Fires a POST request to the assigned **Zapier Webhook** containing a URL stream to the `daily_video.mp4` with random captions/hashtags and YouTube titles.

> [!IMPORTANT]
> **Firebase Setup**: Before pushing, you must manually run `npx firebase-tools hosting:sites:create <slug> --project go-rabbit-4af82` to reserve the URL. If your desired slug is taken, you must use a different one (e.g., `bud-bud-game`) and ensure it matches perfectly across `firebase.json`, `.firebaserc`, and `.github/workflows/daily_video.yml`.
> 
> **GitHub Secrets**: The GitHub Action relies on the `FIREBASE_TOKEN` secret. The AI assistant will automatically extract the refresh token from the local Firebase config (`~/.config/configstore/firebase-tools.json` on Windows/Linux) and add it to the game's repository using the `gh secret set FIREBASE_TOKEN` command.

> [!WARNING]
> You must ensure that `fluent-ffmpeg`, `@ffmpeg-installer/ffmpeg`, `google-tts-api`, and `puppeteer` are explicitly registered in the target game's `package.json` (`devDependencies`), otherwise GitHub's CI/CD `npm ci` runner will crash during generation.

## 4. Standardized Win Screen Buttons
Once a player completes a map or puzzle, the Victory Modal must provide the standardized user conversion funnel.
- **Add to Device**: `📲 Add to Device` - Explicitly hook the JS logic to capture the browser's `beforeinstallprompt` event so the user can natively install the PWA. 
- **Share / Brag**: `📤 Brag and get free puzzles` - Triggers Web Share API or copies a high-score format to clipboard, ideally rewarding a binge token upon success.
- **Monetization**: `🎟️ Binge Puzzles ($0.99)` - Unlocks binge mode and routes to the presale page.
- **Cross-Promotion**: `🎮 Go to Games Hub` - Links back to `https://oops-games-hub.web.app` to retain bounce traffic. Ensure analytics are manually hooked here.

> [!IMPORTANT]
> When adding Infinite/Binge Mode Generation, ensure the fallback code correctly replicates all decoupled context dependencies (e.g., if a puzzle needs both a unique Trivia Target and a Question/Clue string, do not hardcode static clues in the fallback generation). Furthermore, be extremely careful of orphaned braces when abstracting logic into modular functions.

## 5. Firebase Analytics
Every new game must correctly map user progression to track conversion efficiency.
- **Initialization**: Incorporate Firebase SDK inside `main.js`.
- **Event Tracking**: Fire `logEvent` triggers at critical thresholds:
  - Game session start.
  - Completion of a daily map (`level_complete`).
  - External link clicks within the Win Screen (e.g., cross-promotion to the Games Hub).
  - Failed attempts or uses of hints to gauge difficulty.

## 6. Meta-Cipher (Secret Puzzle) Integration
All new games must participate in the overarching "Meta-Cipher" ARG ecosystem by displaying a secret code on their win screen.
- **Cypher Generation**: Include the standardized `getDailyCypher(gameIndex)` function inside the game's logic. This function utilizes an IDL Timezone (Kiritimati) date seed and a `mulberry32` PRNG to generate three 4-character codes daily.
- **Unique Distribution**: The logic shuffles the three codes and uses the `gameIndex` (e.g., 0, 1, or 2) to ensure that each of the 3 cyphers makes it to at least one of the games, distributing them randomly but uniquely across the ecosystem each day.
- **Win Screen Rendering**: The Victory Modal needs an HTML element (e.g., `<p id="vic-cypher"></p>`) to display the cypher text returned by `getDailyCypher(index)` upon a successful completion.

## File References
- **Video Logic**: `scripts/generate_video.js` (Reference *SheSellsSeaShells* implementation)
- **CI/CD Pipeline**: `.github/workflows/daily_video.yml`
- **Hub Repository**: `index.html` inside *StudioHub*

## 7. Games Carousel Integration
To ensure seamless cross-promotion across the ecosystem, every new game must implement the Games Carousel logic:
- **URL Parameter Detection**: Read the `?carousel=true` and `?played=...` query parameters on initialization.
- **Analytics Tracking**: If `carousel=true`, immediately log a `carousel_visit` event to Firebase Analytics, including a custom `game_id` dimension (e.g., `game_id: 'NG'` for New Game).
- **Victory Modal Adaptation**: When a user wins while in carousel mode, hide the standard victory buttons and display the Carousel-specific funnel:
  - `➡️ Play the next game`: Advances to the next unplayed game.
  - `📤 Share for another ride`: Available if all games are completed, resets the `played` array after sharing.
  - `🎟️ Binge this game`: Routes to the presale page but passes the `carousel` parameters so the user returns to the carousel flow after purchase.
- **Routing Logic**: Fetch `https://oops-games-hub.web.app/carousel_config.json`, filter out the IDs present in the `played` array, select a random remaining game, and navigate to its URL appending `?carousel=true&played=...`. If no games remain, route back to the Studio Hub.

## 8. Embed Mode Integration (Bait & Switch Strategy)
To support the distributed traffic strategy (converting external blog traffic to our platform), every game must support an iframe embed mode.
- **URL Parameter Detection**: Read the `?mode=embed` query parameter on initialization.
- **UI Suppression**: If `mode=embed`, the game MUST hide all standard win screen actions (e.g., Share, Next Puzzle, Binge, Cypher) when the player completes the level.
- **Hook Injection**: Instead of standard actions, display a large call-to-action (CTA) hook: *"You survived Level 1! Only 4% of players beat Level 2."* with a massive button: *"🚀 Play Full Game on Oops-Games"*.
- **Traffic Capture**: The hook button must trigger a `window.open('https://oops-games-hub.web.app/', '_blank')` to break the user out of the iframe and pull them to our central hub.
- **Publisher Portal**: Ensure the game's production URL and human-readable name are added to the dropdown menu in `StudioHub/public/publishers.html`.

## 9. Pre-Release Verification & Emulator Testing
To prevent regressions related to mobile UI clipping, "fat-finger" inaccuracies, and touch event failures, **all interactive mechanics must be tested in a simulated mobile environment before being merged or deployed to production.**
- **Emulator Requirement**: Utilize automated scripts (e.g., Puppeteer's `page.emulate()`) or the built-in browser subagent to execute drag, drop, and tap workflows in a simulated mobile viewport (e.g., Pixel 5, iPhone 12).
- **Touch Event Verification**: Explicitly verify that physics engines, hit-boxes, and geometric targeting are relying on `e.changedTouches` and robust `Math.hypot` distance checking rather than raw DOM `elementFromPoint()`, which frequently fails on Android Chrome.
- **Visual Evidence**: Generate a recording (`.webp` or `.mp4`) of the emulator run and provide it as verification that the touch flow works smoothly before confirming any fix.

## 10. Subdirectory Ecosystem Architecture
To maximize the SEO of `oops-games.com`, the platform utilizes a unified deployment architecture where all games are hosted as subdirectories of the main domain (e.g., `oops-games.com/new-game`).
When integrating a new game, you MUST update the central deployment pipeline:
1. **Update `deploy_ecosystem.js`**: Open `StudioHub/deploy_ecosystem.js` and add the new game's local repository folder name and its desired URL slug to the `games` array (e.g., `{ dir: 'NewGameRepo', path: 'new-game' }`).
2. **Update `firebase.json`**: Open `StudioHub/firebase.json` and add a new rewrite rule for the game **before** the catch-all rule: `{ "source": "/new-game/**", "destination": "/new-game/index.html" }`.
3. **Deploy the Ecosystem**: From the `StudioHub` directory, run `node deploy_ecosystem.js` to build all games with their relative `--base` paths, and then run `npx firebase-tools deploy --only hosting:hub` to push the entire unified platform to production.
4. **Standalone Deployments**: The individual game repositories (e.g., `.github/workflows/daily_video.yml`) will continue to deploy to their `.web.app` targets for social media video generation, but the main user-facing traffic will flow through the StudioHub's subdirectory deployment.

---
> [!NOTE]
> This guide is persistently stored as a Knowledge Item (`KI`) within the workspace. AI assistants will automatically read this whenever you discuss integrating a new game in future conversations!
