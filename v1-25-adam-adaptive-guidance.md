# V1.25 — Adam Adaptive Guidance Engine

## Purpose

Move Adam from milestone reporting to actionable, state-aware recommendations. Adam now answers three questions: **Where am I? What should I do next? Why?**

## Guidance map

- 0/6 → Start Day 1 — establish the starting point.
- 1/6 → Continue Day 2 — build on the Day 1 foundation.
- 2/6 → Continue Day 3 — enter the central waters-and-land learning stage.
- 3/6 → Continue Day 4 — begin the second half and mill stage.
- 4/6 → Continue Day 5 — move toward activation.
- 5/6 → Complete Day 6 — finish the six-stage blueprint.
- 6/6 → Review Day 1 — revisit the full path from its starting point.

## Architecture

`adam-adaptive.js` is a companion layer. It reads `window.GEI_PROGRESS` and does not create a competing progress store. V1.23 memory and V1.24 milestone intelligence remain available.

The V1.24 milestone layer bootstraps the V1.25 module so the existing `index.html` script order remains unchanged. Splash behavior is untouched.

## UI behavior

When Adam is open, V1.25 adds an **ADAM RECOMMENDS** panel containing:
- recommended next action
- reason for the recommendation
- primary action button updated to the recommendation

The guidance refreshes when progress, XP, or Adam memory events occur.

## Verification gate

Do not merge until the Vercel preview is visually verified and explicitly approved.

Test mobile widths around 430px and 320px, including:
1. 0/6 fresh learner
2. 2/6 foundation state
3. 3/6 midpoint
4. 5/6 final stretch
5. 6/6 Blueprint Master
6. Existing navigation, progress, XP, memory, milestone display, and splash behavior
7. No overflow or clipped recommendation panel
