# Video Strategy and Pipeline for "She Sells Sea Shells"

This plan outlines the strategic advice for managing your daily video outputs and the technical steps required to build an automated video generation pipeline for "She Sells Sea Shells," mirroring your existing work on "Go Rabbit".

## Strategic Advice

### Overloading the Market with Go Rabbit
Running 3 automated videos every single day for the *same game* on TikTok/YouTube Shorts can definitely risk audience fatigue and shadowbanning, as algorithms might flag repetitive content (especially puzzle sequences). I highly recommend reducing **Go Rabbit** to **1 video per day**. 

**Recommendation:**
Consolidate to a single daily workflow. You can cycle the formats organically (e.g., Standard on Monday, Fail on Tuesday, Interactive on Wednesday) by selecting the video type randomly in a single GitHub Action, or just stick to one high-performing format.

### Recommended Schedule for She Sells Sea Shells
If you align Go Rabbit to post once per day at an optimal US time (for example, **12:00 PM EST / 9:00 AM PST**), then you should post **She Sells Sea Shells** videos at a different peak time so they aren't cannibalizing each other's impressions. 

**Recommendation:**
Schedule the She Sells Sea Shells daily video for **5:00 PM EST / 2:00 PM PST** (`21 00 * * *` in cron). This gives each brand its own clear engagement window in the algorithm.

---

## Technical Implementation Plan

### User Review Required
> [!IMPORTANT]
> - Do you agree with reducing Go Rabbit to 1 workflow per day? If so, I will disable the redundant workflows or show you how to do it.
> - The autoplay script for "She Sells" will need to simulate crab drags and drops to look authentic on video. Is there a specific behavior you want to highlight, or should the bot simply find the matches linearly until the board is solved?

## Proposed Changes

### `SheSellsSeaShells` Setup & Dependencies

#### [MODIFY] [package.json](file:///c:/Users/papil/Documents/SheSellsSeaShells/package.json)
- Add dev dependencies: `puppeteer`, `puppeteer-screen-recorder`, `fluent-ffmpeg`, `@ffmpeg-installer/ffmpeg`, `google-tts-api`
- Add `"generate-video": "node scripts/generate_video.js"` to scripts.

### `SheSellsSeaShells` Source Code

#### [MODIFY] [main.js](file:///c:/Users/papil/Documents/SheSellsSeaShells/src/main.js)
- Inject a `?autoplay=true` query parameter detector on initialization.
- Implement an `async function runAutoplay()` that simulates gameplay:
  - Iterates through required pairs.
  - Artificially triggers `spawnCrabOnGrid` to reveal tiles.
  - Simulates the drag-and-drop of the letters into the `resolution-slot`s in Phase 2.
  - Exposes `window._GAME_WON = true` when finished so the Puppeteer script knows when to cut.

### `SheSellsSeaShells` Video Pipeline

#### [NEW] [generate_video.js](file:///c:/Users/papil/Documents/SheSellsSeaShells/scripts/generate_video.js)
- A Node.js script using Puppeteer to launch Vite locally, navigate to `http://127.0.0.1:5173/?autoplay=true&tiktok=true`.
- Records the viewport using `puppeteer-screen-recorder`.
- Generates an introductory TTS using `google-tts-api`.
- Composites the gameplay, BGM, and TTS using `ffmpeg`.

#### [NEW] [daily_video.yml](file:///c:/Users/papil/Documents/SheSellsSeaShells/.github/workflows/daily_video.yml)
- A GitHub Actions workflow identical to Go Rabbit's pipeline.
- Will automatically deploy the video to Firebase Hosting and ping the Zapier webhook.
- Cron schedule set to push daily based on the chosen optimal time.

## Open Questions
> [!WARNING]
> - Do we already have a specific TikTok BGM audio file in `SheSellsSeaShells/public/` (e.g., `tiktok_bgm.mp3`) as we did for Go Rabbit? I will need to ensure we use an audio file. If not, I can temporarily skip BGM or add a placeholder.
> - Should the Zapier POST target the exact same URL webhook as Go Rabbit (`https://hooks.zapier.com/hooks/catch/27231889/ujm5mjh/`), but just with differently themed captions and hashtags? 

## Verification Plan
1. Local: Run `npm run generate-video` on `SheSellsSeaShells` to ensure a well-formatted `.mp4` is captured correctly.
2. Ensure the `autoplay` mode correctly mimics an actual user playing (crabs moving, matching sounds playing).
3. Push to GitHub to verify that the Action workflow parses correctly.
