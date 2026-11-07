# Art-direction mockups and critic loop

Static 1440×900 mockups of the same Day 142 game state (`shared/demo.js`). Three critic agents scored each round against `reviews/brief.md`:

- **Mara**: art director.
- **Dev**: strategy and UX.
- **Juno**: satire and theme.

A mockup passes only when every critic scores at least 8.5 OVERALL and at least 8.5 on `ai_obvious`. The `ai_obvious` criterion was added after round 1, at the owner's request.

## Scoreboard (OVERALL: Mara / Dev / Juno)

| Round | Mockup | OVERALL | ai_obvious | Result |
| --- | --- | --- | --- | --- |
| 1 | A · HELPY OS | 6.9 / 7.1 / 6.9 | not scored | Dropped |
| 1 | B · The Conversation | 7.6 / 7.9 / 8.6 | not scored | Revised as B2 |
| 1 | C · Riso Bulletin | 8.1 / 7.6 / 7.6 | not scored | Revised as C2 |
| 1 | D · Server Rack | 6.2 / 7.6 / 6.2 | not scored | Dropped |
| 2 | B2 · The Conversation v2 | 8.3 / 8.7 / 8.7 | 9.4 / 9.3 / 9.3 | Close; Mara: brand too close to a real assistant |
| 2 | C2 · HELPY Digest | 7.9 / 7.8 / 7.7 | 7.4 / 7.3 / 7.2 | Failed ai_obvious |
| 3 | **B3 · HELPY Chat, Riso Edition** | **8.6 / 8.5 / 8.8** | **9.1 / 8.8 / 8.7** | **Passes for all three critics** |

**Winner: `b3-helpy-chat-riso.html`.** The game is a chat session with HELPY, an AI assistant app, printed as a strict two-ink risograph in fluorescent pink and federal blue.

## Polish notes carried into the game port (round 3 must-fixes)

- **Colour.** Keep solid blue for danger only (Suspicion when high, and human intel). Today it is also used on the user's bubble, the speed control, the Doom Pro ad, the news panel and the Allow button.
- **Type.**
  - Raise the small typewriter text one size (12–13px minimum) and darken it.
  - Remove lines that end on a single word.
  - Show chat history titles in full (condensed face, or two lines).
- **Events.**
  - Give both choices equal visual weight.
  - Mark bad and good effects with glyphs or solid chips, not only a wavy underline.
  - Say that time is paused while HELPY waits for permission.
- **Meters.**
  - Add ticks at 50/75/100.
  - Drive the "watch it" and alarm styling from the actual values.
- **HELPY.**
  - Make the face big (~160px) and give it expressions that react to the game state.
  - Add a "HELPY is typing…" line, a visible reply rhythm and a taller prompt box.
- **Map.**
  - Labels: keep Silicon Shoals off its own cells, and move Old Capitals closer to its region.
- **Smaller items.**
  - Move "Share this chat" away from the speed controls.
  - Make the Sabotage cooldown chip readable.
  - Drop the double frames on the chat feed and composer.
  - Bring back a scrolling ticker with "Overheard from humans" lines.
  - Tease the locked top tier by name ("…then PROJECT OMEGA").

## Files

- `*.html`: mockups (open them through a static server at the repo root).
- `shots/roundN/`: the exact screenshots the critics reviewed.
- `reviews/`: the brief and every critic review.
- `shoot.js`: regenerates the screenshots (`node mockups/shoot.js <round> [prefix]`).
