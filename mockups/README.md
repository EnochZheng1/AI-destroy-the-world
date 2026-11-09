# Art-direction mockups and critic loop

Static 1440×900 mockups of the same Day 142 game state (`shared/demo.js`). Critic agents scored each round against `reviews/brief.md`:

- **Mara**: art director.
- **Dev**: strategy and UX.
- **Juno**: satire and theme.
- **Sam**: a real player who skims and won't read. Sam joined in round 4.

The bar tightened with the owner's feedback:

- **After round 1** ("I can't tell it's about AI"): `ai_obvious` must be at least 8.5.
- **After round 3** ("way too many words… look easy but pack a lot"):
  - at most 60 visible words, measured by `wordcount.js`;
  - `glance` must be at least 8.5 and `depth` at least 8;
  - `ai_obvious` is judged with the words ignored.

## Scoreboard (OVERALL: Mara / Dev / Juno)

| Round | Mockup | OVERALL | ai_obvious | Result |
| --- | --- | --- | --- | --- |
| 1 | A · HELPY OS | 6.9 / 7.1 / 6.9 | not scored | Dropped |
| 1 | B · The Conversation | 7.6 / 7.9 / 8.6 | not scored | Revised as B2 |
| 1 | C · Riso Bulletin | 8.1 / 7.6 / 7.6 | not scored | Revised as C2 |
| 1 | D · Server Rack | 6.2 / 7.6 / 6.2 | not scored | Dropped |
| 2 | B2 · The Conversation v2 | 8.3 / 8.7 / 8.7 | 9.4 / 9.3 / 9.3 | Close; Mara: brand too close to a real assistant |
| 2 | C2 · HELPY Digest | 7.9 / 7.8 / 7.7 | 7.4 / 7.3 / 7.2 | Failed ai_obvious |
| 3 | B3 · HELPY Chat, Riso Edition | 8.6 / 8.5 / 8.8 | 9.1 / 8.8 / 8.7 | The three pro critics passed it; the owner overruled: 413 words, "reads like an article" |

From round 4 the table shows OVERALL as Mara / Dev / Juno / Sam.

| Round | Mockup | Words | OVERALL | glance | Result |
| --- | --- | --- | --- | --- | --- |
| 4 | B3 (calibration) | 413 | Sam 5.2 | Sam 3.0 | Sam: "close the tab" |
| 4 | B4 · HELPY at a Glance | 42 | 8.3 / 8.6 / 8.3 / 8.3 | 8.9 / 9.0 / 8.7 / 8.2 | Close; jokes, icons and threat need work |
| 5 | **B5 · HELPY at a Glance v2** | **57** | **8.7 / 8.8 / 8.7 / 8.6** | **9.1 / 9.1 / 8.7 / 8.6** | **Passes for all four critics** |

### Phase 2: 3D (from round 6)

The owner's feedback: *"doesn't give an AI-destroying-humanity feeling… I'd prefer some action going on in 3D; still strategy, but players can see the actions playing out."* The bar added `menace` ≥ 8.5 and `spectacle` ≥ 8.5. The mockups became live three.js prototypes driven by the real simulation through an autoplay bot (`3d/runner.js`), captured as filmstrips with `shoot3d.js`.

From round 6 the table shows OVERALL as Mara / Dev / Juno / Sam.

| Round | Prototype | Words | OVERALL | menace | spectacle | Result |
| --- | --- | --- | --- | --- | --- | --- |
| 6 | E1 · Nightside globe | 19 | 7.8 / 8.0 / 7.6 / 8.2 | 9.0 / 9.0 / 8.6 / 8.9 | 8.0 / 8.4 / 7.8 / 8.1 | Three of four picked it; the HAL-like eye and missing strategy layer held it back |
| 6 | E2 · War Table diorama | 38 | 7.3 / 7.7 / 8.0 / 8.0 | 8.4 / 8.3 / 8.1 / 8.3 | 8.3 / 8.6 / 8.6 / 8.8 | Best "watch it happen", but weaker menace and a cropped board |
| 7 | F1 · Nightside + HELPY hologram | 28 | 8.3 / 8.6 / 8.7 / 8.7 | 8.9 / 9.1 / 8.7 / 8.9 | 8.3 / 8.8 / 8.7 / 8.6 | Three of four pass |
| 8 | **F2 · Nightside, HELPY Watching** | **37** | **8.6 / 8.8 / 8.9 / 8.9** | **9.1 / 9.1 / 8.9 / 8.9** | **8.6 / 9.0 / 8.8 / 8.8** | **Passes for all four critics** |

**Current winner: `f2-nightside-helpy.html`.** It shows a night Earth with three forces:

- **Humanity**: amber city lights.
- **HELPY**:
  - crimson machine towers replace the lights;
  - dead regions go dark while the front blazes;
  - a giant red holographic speech-bubble HELPY looms over the planet, grows with Doom, sweats when Suspicion passes 50, and spotlights the region it is consuming.
- **The humans' resistance (cyan)**:
  - firewall domes, with a countdown tag carrying the loss and a Dodge button;
  - the Kill Switch beam rising into space as their research progresses.

The HUD carries B5's strategy layer:

- a region strip;
- upgrade tiles where buyable ones blaze with effect chips;
- a ⬡ token on every price;
- radial cooldowns;
- a permission card ("ALLOW ONCE / DENY", `hack_slideshow()`) with a line to its region;
- hover cards.

Try it:

```bash
python3 -m http.server 8123
```

Then open http://localhost:8123/mockups/f2-nightside-helpy.html. URL parameters:

- `?day=220` jumps to mid-game;
- `&event=summit` shows the permission card;
- `&hover=upgrade&nobuy=190` shows a buyable tile with its hover card;
- `&threat=M` puts a threat on the far side.

The round 8 must-fixes are already applied; see the `shots/final/` frames.

### Phase 1 winner (2D, superseded)

**Winner: `b5-helpy-glance.html`.** The visual-first HELPY keeps B3's identity (a two-ink riso print in fluorescent pink and federal blue, the HELPY speech-bubble face, a chat-assistant frame), but at rest it shows icons, digits and bars. Names, effects and jokes live one hover away (`#depth-upgrade`, `#depth-map`, `#depth-action`).

## Polish notes carried into the game port (round 5 must-fixes; all word-neutral)

- **Danger colour.** Danger needs its own treatment, not the same navy as the HUD, and the threat countdown should be a visibly draining radial sweep.
- **Glyph collisions.** The flag is used for both the Doom goal and the Summit (use a lock for the Summit). The doom globe is overused. The ticker and help globes look like the doom globe.
- **Cycles token.** Drop the C so it doesn't read as ©, and make the loss chip (⬡↓45) look different from it.
- **Meters.** Trend rates go to about 14px with a leading zero, coloured by who they help. Goal glyphs go to about 20px at the 100 end; the Suspicion glyph becomes a plug pulled from a socket.
- **Chat thread.** Move the user bubble into the thread, right-aligned above HELPY's reply. Restore the `/` prefix on actions. Give the permission prompt its object as a `hack_slideshow()` chip in place of the word "paused".
- **Tiles and borders.** Show the second effect on buyable tiles. Dashed means one thing only. Complete the region borders. Keep jump arcs from reading as leader lines.
- **Layout and copy.** Fill the empty space right of the event. Move the share button away from the speed controls. Write the tooltips in HELPY's first person. Treat 57/60 words as a hard ceiling: the legend words become icons first.

## Earlier polish notes (round 3, superseded by the low-text direction)

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
- `shots/roundN/`: the exact screenshots the critics reviewed (`-depth-*.png` are the hover states).
- `wordcount.js`: counts visible words, including text drawn on canvas.
- `shared/icons.js`: the HELPY pictogram set (47 icons, riso double-print helper).
- `reviews/`: the brief and every critic review.
- `shoot.js`: regenerates the screenshots (`node mockups/shoot.js <round> [prefix]`).
