# 50,000 Foot View: Retaining & Attracting Mobile Users

Are we building "Go Rabbit" and "She Sells Sea Shells" the right way? 

**The Short Answer:** 
The core mechanics—daily puzzles, simple dragging/interaction, and clean UI—are exactly aligned with modern casual gaming trends (the "Wordle effect"). 

**The Gap:** 
Right now, they still feel like *websites* playing dress-up, rather than native *mobile apps*. If we want to capture and keep mobile users, we need to close the gap in "app feel" and build systems that make sharing effortless.

Here is the strategic roadmap for what we *should* be doing.

---

## 1. Upgrade to a Progressive Web App (PWA)
**The Problem:** Browser address bars eat up screen real estate, and users forget URLs.
**The Fix:** Make the games "installable."
- We add a `manifest.json` and a Service Worker.
- When users visit on Safari or Chrome, they get a prompt to **"Add to Home Screen"**.
- Now our game lives right next to Instagram and TikTok on their phone. When opened, it launches in full-screen (no browser URL bar), working perfectly offline.

## 2. Implement the "Wordle" Growth Engine (Viral Sharing)
**The Problem:** Relying entirely on our automated social media videos for traffic. Organic word-of-mouth is zero.
**The Fix:** Built-in clipboard sharing.
- At the end of every daily puzzle (win or lose), pop up a "Share" button.
- It copies a visual, emoji-based summary to their clipboard, not just text.
- *Example for She Sells:* `🏖️ She Sells: Day 42 | ⭐⭐⭐ (No hints!) Play at: [URL]`
- This is zero-cost user acquisition.

## 3. Local Storage Progression (Streaks & Stats)
**The Problem:** Right now, there is no consequence to missing a day. No psychological hook to return.
**The Fix:** Basic statistics modal.
- Track their "Current Streak", "Max Streak", and "Win Rate" using the browser's local storage.
- The fear of breaking a streak is the highest driver of daily retention in casual games.

## 4. Tactile "App-Like" Polish (Haptics & Touch)
**The Problem:** Web browsers have annoying defaults (text highlighting when you tap too fast, pull-to-refresh). 
**The Fix:**
- Add `navigator.vibrate([15])` to snap/drop mechanics. When a user drops a shell, the phone should give a tiny physical "tick." We have audio, now we need feel.
- Force `user-select: none` and `overscroll-behavior: none` globally to ensure swiping aggressively doesn't accidentally scroll the web page. *(Note: We've done some of this in She Sells, but it must be standardized across all projects).*

## 5. First 10 Seconds (Onboarding Friction)
**The Problem:** If a user doesn't understand the game instantly, they bounce.
**The Fix:** 
- *She Sells* has a tutorial button, which is great. But we should force an interactive, 1-move guided minimum-viable-tutorial on their *very first* visit ever. Dim the background, highlight the exact shell to move, and show them how to win. 

---

### What's Next?
These are high-impact, relatively quick implementations that don't change the game logic but drastically alter the *perception* and *retention* of the game.

> [!TIP]
> **Priority Recommendation:** I strongly suggest we attack the **PWA (Add to Home Screen)** and **Emoji Sharing** mechanics first. These will give us the biggest immediate boost to retention and organic growth. 
