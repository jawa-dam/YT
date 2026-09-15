# V1.26 — Adam Contextual Page Intelligence

## Purpose

Give Adam awareness of the active GEI Academy page so his guidance changes with the learner's current environment instead of treating every screen as Home.

## Contexts

- Academy — current blueprint step and next-day action
- Portfolio — learner record and research identity context
- Video Lab — visual-learning context
- Support — research-support context

## Behavior

Non-Home active screens receive a compact `ASK ADAM` launcher. Opening it shows:
- the active page context
- context-specific guidance
- current blueprint completion
- current XP
- one context-appropriate action

The Home Adam experience remains the existing V1.25 assistant.

## Architecture boundaries

- `GEI_PROGRESS` remains the source of truth.
- No new progress, XP, streak, achievement, or profile storage.
- V1.23 memory and V1.24/V1.25 intelligence remain intact.
- Navigation is reused rather than rewritten.
- Splash is untouched.
- Mobile-first at approximately 430px and 320px.

## Verification

1. Home still uses the existing Adam experience.
2. Academy shows an `ASK ADAM` contextual launcher and references the current learning step.
3. Portfolio, Video Lab, and Support each produce distinct contextual guidance.
4. Context panel opens/closes correctly.
5. Context action works.
6. Progress and XP values match the existing Academy state.
7. No clipping or overflow around 430px and 320px.
8. Existing navigation and splash behavior remain unchanged.
