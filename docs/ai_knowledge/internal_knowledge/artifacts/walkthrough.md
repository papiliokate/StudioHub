# Walkthrough: "She Sells Sea Shells" Auto-Video Setup

The pipeline has been successfully built and the strategic adjustments have been applied to your current operations!

## 1. Marketing Shift: Go Rabbit Frequency Reduction
To ensure you aren't overloading TikTok feeds with the same puzzle types, I have effectively **reduced Go Rabbit's automated video pipeline to 1 instance per day**.
- **Action Taken:** The cron `schedule` triggers in `.github/workflows/daily_video_fail.yml` and `.github/workflows/daily_video_interactive.yml` were removed, leaving only `workflow_dispatch`. 
- **Result:** Only `daily_video_standard.yml` will automatically run and publish at `00:30 UTC`. The others are still fully functional if you choose to manually trigger them.

## 2. "She Sells Sea Shells" Auto-Video Setup 

### Autoplay Engine
To simulate organic gameplay, the game engine in `src/main.js` now features an `runAutoplay()` asynchronous script:
- Triggered exclusively when loading the URL with `?autoplay=true`.
- The bot programmatically identifies the matching pairs and dispatches click events asynchronously, revealing them with authentic delays and triggering all native sound effects (thocks, matches).
- Once all matches are routed to the resolution dock, the bot systematically detects misaligned letters and swaps them by iterating over expected target tiles. 
- Emits a global `window._GAME_WON = true` flag when the victory overlay appears for the screen recorder.

### Puppeteer Recording Script
Added `scripts/generate_video.js`:
- Headless instance dynamically launches and scales the Vite development server using `-window-size=720,1280` optimized for Shorts/TikTok.
- Utilizes Google's TTS engine to generate your intro voice line and pulls in the copied `tiktok_bgm.mp3`.
- Renders the final output dynamically via FFmpeg (`fluent-ffmpeg`) dropping the audio channels synchronously into the loop.

### GitHub Automation Pipeline
Added `.github/workflows/daily_video.yml`:
- Triggered on a manual dispatch, and automatically on a `cron` schedule of `0 21 * * *` (**5:00 PM EST / 2:00 PM PST**). This provides a separate window of engagement distinct from Go Rabbit.
- Boots up Ubuntu, handles the FFmpeg / Libgbm-dev dependency installs, and fires off Puppeteer.
- Includes your randomized, thematic Zapier payload hooks targeting `#Shells #DailyPuzzle #WordGame`.

> [!TIP]
> Everything is fully set up now! To test the video generation, you can run `npm run generate-video` from within your `SheSellsSeaShells` repository, or push the repo up to GitHub and hit the manual trigger in Actions.
