# V1.23 — Adam Learning Memory

## Purpose

Give Adam a small, purpose-built learning memory layer so his guidance can recognize where a learner has been and make the next interaction more relevant.

## Memory boundary

Adam memory is intentionally limited to local learning context. It does not replace or rewrite GEI Academy progress, streak, achievement, profile, or XP storage.

Storage key: `geiAdamLearningMemoryV1`

Recorded context:
- first and last visit timestamps
- local visit count
- last completed day
- last known next day
- last known completed-day count
- last known XP
- last completion timestamp

## Behavior

- New learner: Adam gives Day 1 guidance.
- Returning learner: Adam can recall the last recorded learning milestone and connect it to the current next step.
- After a completion: Adam records the completed day and next unlocked day.
- Progress or XP changes: memory synchronizes from the existing `GEI_PROGRESS` API.
- Resetting Academy progress does not require rewriting the memory engine; the memory remains a lightweight record of the learner's previous path.

## Integration

`adam-memory.js` loads after `progress.js` and exposes `window.GEI_ADAM_MEMORY`.

`mascot.js` consumes the memory API and refreshes the open Adam assistant when memory changes.

## Non-goals

- No full chatbot or external AI service.
- No new account system.
- No duplicate XP or progress engine.
- No splash changes.
- No changes to streak or achievement storage.

## Verification target

Verify the Vercel preview before merging. Test at mobile widths around 430px and 320px:

1. Fresh learner opens Adam → Day 1 guidance.
2. Complete a day → reopen Adam → Adam references the recorded milestone and next day.
3. Refresh the page → memory persists locally.
4. Existing progress, XP, navigation, and splash behavior remain intact.
5. Assistant remains readable and contained within the app frame.
