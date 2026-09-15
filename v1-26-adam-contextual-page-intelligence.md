# V1.26.1 — Adam Contextual Launcher Recovery

## Purpose

Restore reliable `ASK ADAM` rendering on non-Home screens while preserving the existing V1.26 architecture and the V1.25 Home Adam experience.

## Root cause addressed

The original contextual layer observed the entire application frame and scheduled a new render whenever it appended or removed its own launcher/panel. That could create a self-triggering refresh loop. Screen detection also depended too heavily on the `is-active` class.

## Recovery changes

- Prefer the actually visible `.app-screen` using `aria-hidden` plus computed display/visibility.
- Retain `is-active` as a fallback for compatibility.
- Add a render guard and screen-id cache so the contextual layer does not rebuild itself for its own DOM mutations.
- Debounce refresh requests.
- Re-render intentionally on navigation and progress/XP/Adam events.
- Establish `position: relative` on non-Home host screens so the launcher has a stable positioning context.
- Make the launcher visually obvious on mobile with a strong blue treatment and Adam mascot.
- Preserve the existing context panel and navigation behavior.

## Verification gate

1. Home keeps the existing V1.25 Adam experience.
2. Academy visibly shows `ASK ADAM`.
3. Portfolio, Video Lab, and Support each receive the contextual launcher.
4. Opening and closing the panel works.
5. Context action continues to reuse existing navigation/progress APIs.
6. Progress and XP remain read-only from `GEI_PROGRESS`.
7. The observer does not continuously rebuild the launcher.
8. Approximately 430px and 320px layouts remain bounded.
9. Splash and bottom navigation are untouched.

**Do not merge PR #75 until the Vercel preview confirms the launcher is visibly present and interactive.**
