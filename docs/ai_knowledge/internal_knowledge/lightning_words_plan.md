# Lightning Words

A new daily puzzle game where players form words from a hidden 6x6 grid of letters. Players use limited "Call the Lightning" flashes to memorize letter positions, pull them into a tray, and reveal them to validate words. Features a Greek/Zeus visual aesthetic.

## User Review Required

Please review the open questions below to clarify the game's mechanics and setup before we begin development.

> [!IMPORTANT]
> **Open Questions**
> 1. **Project Location:** Should I initialize this new project in a new folder like `C:\Users\papil\Documents\LightningWords` using Vite (Vanilla JS)?
> 2. **Tile Interaction:** When a player drags a hidden letter to the tray, does it appear as a blank/stone tile so they can visually see they've placed *something* there? Can they drag it back to the board if they change their mind before hitting "Reveal"?
> 3. **Lightning Flash:** When the lightning flashes, does it reveal the letters currently sitting in the player's tray as well, or *only* the letters still on the main 6x6 board?
> 4. **Word Dictionary:** To validate words, should I include a local JSON dictionary of valid English words, or fetch from a public dictionary API? (Local JSON is usually faster and more reliable for offline/PWA gameplay).
> 5. **Daily Puzzle Generation:** Since this is a daily puzzle game (based on the integration guide), should everyone get the exact same 6x6 board every day, or is it completely random per session?
> 6. **Spelling:** Just to confirm, do you want to keep the spelling "Lightening Words" or standard "Lightning Words"?

## Proposed Changes

### 1. Game Architecture & Initialization
- Create a new project structure using Vite (HTML, CSS, JS).
- Implement the **Fixed Resolution Scaling Architecture** (450x800 logical dimensions) as per the platform standard to ensure cross-device mobile consistency.
- Implement Pointer Coordinate Normalization for all drag-and-drop mechanics to ensure touch screens work flawlessly.

### 2. Core Gameplay Logic
- **Board Generation:** Generate a 6x6 grid of 36 letters seeded by standard English letter frequencies (e.g., higher weights for E, T, A, O, I, N, S).
- **Hidden State:** Tiles will be rendered as stone tablets/blocks with the letter hidden.
- **Lightning Mechanic:** A `Flash Lightning` button (max 5 uses). Triggers a CSS/Canvas whiteout animation, plays a thunder audio file, and temporarily reveals all tile letters for a brief duration (e.g., 1.5 seconds) before hiding them again.
- **Drag & Drop System:** Players can drag tiles from the 6x6 grid into a bottom tray. 
- **Reveal & Validation:** A `Reveal` button checks the word in the tray against a dictionary.
  - *Valid Word:* Apply scoring logic. Animate tiles disappearing (e.g., lightning strike).
  - *Invalid Word:* Tiles animate back to their original positions on the board.
- **Score Me:** Ends the game immediately, tallies the final score, and presents the standard Victory/Game Over modal.

### 3. Scoring System
- 2-3 letter word: 1 pt
- 4+ letter word: 1 pt per letter + 1 extra pt for every letter over 4 (e.g., 5 letters = 5 + 1 = 6 pts; 6 letters = 6 + 2 = 8 pts).
- Board clear bonus: +50 pts.

### 4. Visual Aesthetic & Style (Greek/Zeus)
- **Theme:** Mount Olympus, dark storm clouds, marble textures.
- **UI:** Gold/bronze accents. The lightning button will be a glowing Zeus thunderbolt.
- **Animations:** Screen flashes, dramatic thunder rumbles, and lightning strikes hitting valid words.
- **Layout:**
  - Header: Score, Lightning Uses left.
  - Center: 6x6 grid of tiles.
  - Bottom: Scrabble-style tray, Reveal button, Score Me button, and Call the Lightning button.

### 5. Ecosystem Integration (Post-Game)
- Implement `Studio Hub` routing logic.
- Add `Firebase Analytics` tracking for session events and difficulty.
- Incorporate `Games Carousel` logic (`?carousel=true`).
- Implement the `Meta-Cipher` daily generation script.
- Setup `puppeteer` automated video generation pipeline (`scripts/generate_video.js`) for TikTok/social media.
- Standardized Win Screen modal with PWA install, Share/Brag, Binge Mode monetization, and Cross-Promotion.

## Verification Plan

### Automated Tests
- Emulator Testing: Utilize the browser subagent to emulate a Pixel 5/iPhone 12 to verify the drag-and-drop touch coordinate normalization.
- Word Validation: Run scripts to test various board generations to ensure valid words are always mathematically possible based on the frequency generation.

### Manual Verification
- Review the aesthetic and lightning animations locally using `npm run dev -- --open`.
- Ensure the thunder sound syncs correctly with the visual pulses.
