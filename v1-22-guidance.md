# V1.22 — Adam Interaction & Guidance Intelligence

## Scope

Turn Adam from a static quick-help popout into a context-aware guide that uses the existing GEI progress engine without creating a new progress store.

## Behavior

- Reads `window.GEI_PROGRESS` when available.
- Detects completed days, XP, and the current unlocked day.
- Changes Adam's opening guidance based on learner state.
- Provides a primary next-step action for the learner.
- Provides live progress feedback.
- Opens the relevant Day page from the existing progress API.
- Opens the existing Academy navigation from Adam.
- Keeps the existing mascot, splash system, and progress storage architecture intact.
- Refreshes guidance when GEI progress or XP events change.

## Verification target

Visual verification should be performed in the Vercel preview before merging. Check the Home screen at approximately 430px and 320px widths, open Adam, test every guidance button, and confirm the six-day progress state remains intact.
