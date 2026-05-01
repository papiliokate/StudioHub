# Mobile Game Uniform Scaling Architecture

## Overview
When building HTML5 canvas games (especially those with complex overlays, DOM elements, and coordinate-dependent canvas drawing), relying purely on CSS flexbox and viewport units (`100dvh`, `100vw`, `aspect-ratio`) often leads to rendering inconsistencies across different mobile browsers, clipped canvases, and warped aspect ratios.

To guarantee that a game renders identically on any device or browser, we use a **Fixed Resolution Scaling Architecture** (also known as Letterboxing/Pillarboxing).

## The Implementation Pattern

### 1. Fixed Logical Dimensions
Define a fixed logical resolution for the game container (e.g., `450x800`). This ensures all internal DOM flex rules and absolute positioning behave predictably.

### 2. The JavaScript Resizer
Instead of using media queries, calculate a uniform scale factor based on the viewport size and apply it to the main container.

```javascript
function resizeCanvas() {
  const container = document.getElementById('game-container');
  const canvas = document.getElementById('gameCanvas');
  
  // 1. Define standard aspect ratio and resolution
  const LOGICAL_WIDTH = 450;
  const LOGICAL_HEIGHT = 800; 

  // 2. Calculate uniform scale factor to fit within viewport
  const scaleWidth = window.innerWidth / LOGICAL_WIDTH;
  const scaleHeight = window.innerHeight / LOGICAL_HEIGHT;
  const scale = Math.min(scaleWidth, scaleHeight);

  // 3. Apply fixed dimensions and scale
  container.style.width = `${LOGICAL_WIDTH}px`;
  container.style.height = `${LOGICAL_HEIGHT}px`;
  container.style.minHeight = `${LOGICAL_HEIGHT}px`;
  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = 'center center';
  
  // 4. Center absolutely in viewport
  container.style.position = 'absolute';
  container.style.left = '50%';
  container.style.top = '50%';
  container.style.marginLeft = `-${LOGICAL_WIDTH / 2}px`;
  container.style.marginTop = `-${LOGICAL_HEIGHT / 2}px`;

  // 5. Synchronize canvas internal resolution to actual flex DOM layout
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight; 
}
window.addEventListener('resize', resizeCanvas);
```

### 3. Pointer Coordinate Normalization
Because the DOM is scaled via a CSS transform, raw `clientX` and `clientY` values from `MouseEvent` or `TouchEvent` will not map 1:1 to the canvas coordinates. You must inverse-scale the pointer position:

```javascript
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  
  // Multiply the raw offset by the ratio of logical width to scaled rect width
  mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
  
  // Continue logic...
});
```
*(Apply this exact mathematical mapping to `touchstart`, `touchmove`, `mousedown`, etc.)*

### 4. DOM to Screen Mapping (e.g., Confetti)
If you need to map a canvas coordinate back to the screen (for example, triggering `canvas-confetti` which uses percentages of the raw browser window):

```javascript
const rect = canvas.getBoundingClientRect();
// 1. Convert canvas logical (bx, by) into raw screen pixels
const screenX = rect.left + bx * (rect.width / canvas.width);
const screenY = rect.top + by * (rect.height / canvas.height);

// 2. Convert to viewport percentage
const originX = screenX / window.innerWidth;
const originY = screenY / window.innerHeight;

confetti({ origin: { x: originX, y: originY } });
```

## CSS Requirements
The `#game-container` element should generally have `position: relative` (which is overwritten to `absolute` by JS) and its parent `body` should have a clean background that functions as the pillarbox/letterbox matte. Ensure `overflow` behaves correctly on the body so pull-to-refresh remains functional on mobile without horizontal scrolling.

> [!TIP]
> **Safari Address Bar Clipping (`100dvh`)**: When using standard DOM flexbox layouts that must fill the screen (as opposed to strict pillarboxing), NEVER use `100vh` on mobile. The mobile Safari address bar will cause clipping at the bottom of the screen. Always apply `height: 100dvh;` to the `body` or main wrapper to ensure dynamic recalculation when the address bar minimizes/maximizes.
