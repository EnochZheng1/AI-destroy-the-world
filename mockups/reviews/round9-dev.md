# Round 9: Dev Okafor (playable build)

This is the first round where the question is "can I play it?", not "does it promise a good game?" I went through the 13 shots as a first session:

- **Desktop:** title, then pick, then early, mid, the event, a region click, a buyable moment, late game and the win screen.
- **Phone:** title, then play, the upgrade sheet and the event.

I asked the coordinator's three questions:

1. Does a new player know what to click first?
2. Can the controls be discovered?
3. Does the phone layout support real decisions?

I can't run `wordcount.js` against the live build. By eye, the resting desktop HUD is about 35–40 words (strip names, meter labels, pin names, the news line), well under 60. Please confirm with the script.

How my round 8 must-fixes carried into the build:

| Round 8 must-fix | Status in the build |
|---|---|
| Globe overlapping the upgrade panel | **Fixed.** The globe now sits centred with a clear gutter. |
| Permission card pointing at its region | **Fixed.** A red dashed line runs from the card to the CAPITALS pin (06). |
| Tile chips with magnitudes | **Fixed.** Robot now shows "Ⓓ▲17". The chips are larger and readable on phone too. |
| News line truncation | **Fixed.** It wraps. |
| Kill Switch beam over the front of the globe | **Not fixed.** In 05, 06, p3 and p4 it rises straight through the CAPITALS pin and its cells. |
| Mascot drawn in screen space, off the globe | **Worse.** HELPY's hologram now sits on top of the globe's upper-left quarter in almost every frame (see must-fixes). |

---

## round9-build (01–09 desktop, p1–p4 phone)
scores: originality=8.4  craft=8.4  readability=8.5  theme=9.0  ai_obvious=9.1  glance=8.6  depth=8.9  menace=9.0  spectacle=8.9  OVERALL=8.7
verdict: It's a real game. The onboarding runs title (three rules) → "Choose where HELPY wakes up" → a region card with "WAKE UP HERE" → play at 1×, a strong first 30 seconds, and buying, dodging and deciding events all work as the mockups promised. What holds it back from 9: the game's core new verb, Infiltrate, isn't signposted on the globe; the mascot and the Kill Switch beam sit on top of the board; and the phone layout has three collisions.

**The coordinator's three questions:**
1. **Does a new player know what to click first?** At the start, yes. Title → difficulty → NEW WORLD → pick a pin → WAKE UP HERE is a clear path, and "Fill Doom / don't let Suspicion or Kill Switch reach 100" is the whole game in two lines. Once play starts, only partly. The loudest clickables are the red Dodge on the threat tag, the blazing upgrade tiles and the "⬡ +11" leak bubbles, and all of them work. But the main move, infiltrating a reachable region, is marked only by a small › in the strip ("SILICON ›", "CAPITALS ›", "PETROL ›" in 03). On the globe, reachable pins look exactly like unreachable grey rings, and no frame shows a reachable region's card with its Infiltrate button. The only card shown (07, Research Ridge) says "Out of reach", so a new player's first region click teaches "you can't".
2. **Can the controls be discovered?** Clicks, yes: pins, strip rows, tiles, Dodge, Allow/Deny, slash chips and speed buttons all look clickable. Drag and zoom are implied by a globe. Keyboard shortcuts are invisible: Space and 1/2/3 for speed, Y/N for the permission card. The leak bubbles look like floating "+11 income" text rather than loot to grab. The "–" on Sabotage and Dodge (03, 04, 05) doesn't say whether they're locked, on cooldown or lack a target.
3. **Does the phone support real decisions?** The decisions themselves work well. The event card (p4) has large, thumb-sized ALLOW ONCE / DENY buttons with boxed 👁/⏻ chips. The upgrade sheet (p3) shows blazing ⬡70/80/90 tiles with chips (Ⓓ▲17, ⬡▲40, 👁▼25) that are easier to read than on desktop. Pins are big tap targets. The surrounding layout collides in several places (see must-fixes).

strengths:
- **The onboarding funnel works and is funny.** The difficulty options (INTERN "Trusting humans", ENGINEER "Intended", ETHICIST "They read papers"), a pick screen with an ellipse around the chosen region and a single red call to action, and a win screen ("THE WORLD HAS ENDED. HELPFULLY.") with four icon stats (Doom 100%, regions 9/9, upgrades 18/18, dodges 0) and PLAY AGAIN make a complete loop with a punchline at each end. Defaulting to 1× speed for new players is the right call.
- **Every system from the mockups is now real and keeps its visual language.** The region card (07) shows "⏻▼65 · 🛡75 · ⬡2" plus flavour and "🔒 Out of reach", with the strip row highlighted and an ellipse drawn on the globe. A click on any of the three surfaces (globe, pin, strip) points to the same thing. The hover card for buyable tiles (08) leads with effects. The threat tag carries the countdown, the effect and Dodge. Cooldowns are radial sweeps ("◑ 37d", "69d").
- **The phone version is a genuine port, not a squashed desktop.** It has a meter row, a big globe, a six-button bottom bar with two bottom sheets, and full-width cards. The upgrade sheet on phone is the clearest buy decision anywhere in the series.

must-fix to reach 9:
- **Make Infiltrate obvious on the globe.** Give reachable pins a red › badge and a slow pulsing dashed ring (word-free), so the globe itself says "you can go here". For the first session, have HELPY point once at a reachable pin, using an icon-only chat bubble with a › on it. Ship a frame of a reachable region's card with its "Infiltrate ⬡N" button: it's the one core interaction I haven't seen.
- **Get the mascot off the board.** On desktop (03–07) and phone (p2–p4) the hologram face covers the globe's upper-left quarter. In 07 the TUNDRA 51 pin sits on top of the face, and in p2 Silicon's cells are under it. That is exactly where HELPY is eating, so the spectacle hides itself. Anchor the mascot to the screen beside the globe (as in the F2 mockups), or fade it to about 30% whenever it overlaps tiles or the cursor.
- **Stop the Kill Switch beam crossing the board.** This is carried over from round 8. In 05/06 and on phone (p3/p4) the beam rises from Ridge straight up through CAPITALS' pin and cells and washes them out. Taper its core inside the globe's disk, or draw tiles and pins above it.
- **Show controls that are currently hidden.** On desktop, add small keycaps: "Space" on pause, "1/2/3" on the speeds, "Y"/"N" on ALLOW ONCE/DENY, revealed on hover or for the first session. Make the leak bubbles look grabbable with a pulse, a hover lift and a brief magnet animation into the cycles counter. Replace the bare "–" on action chips with a glyph that says why: no target, locked or cooling.
- **Fix the phone collisions.**
  - The cycles-and-speed panel overlaps the Kill Switch meter (p2, p3: the "20" is clipped at the top).
  - The upgrade sheet's last row (⬡240/230/320) is hidden under the action bar (p3). End the sheet above the bar, or let it scroll.
  - Edge pins are cut off ("…AIN", "…K" at the left edge in p4). Clamp pins to the screen edge with an arrow.
  - The two sheet buttons are both red round globe glyphs (Regions and Upgrades), so they look alike. Use a list icon for Regions and a grid icon for Upgrades, and highlight whichever sheet is open.
- **Fix the token clash on the pick card.** "⬡▲400 · 🛡30 · ⬡4" (02) uses the same ⬡ for two different things, a perk and an income. Write income as "⬡4/day", as the HUD does, and give the perk its branch icon.

---

## ranking
1. **round9-build (F2 as the shipping game)**: OVERALL 8.7, ai_obvious 9.1, glance 8.6, depth 8.9, menace 9.0, spectacle 8.9, about 35–40 words by eye (confirm with the script). **It passes the full bar from my seat.**

Depth went up now that the systems are real. Glance dipped slightly because the mascot and the beam now sit on the board, and leak bubbles and "–" chips add noise. The pass is solid, but this is the first round where my must-fixes affect a new player's first five minutes rather than polish. The first must-fix (signposting Infiltrate) and the fifth (phone collisions) should land before any public build.

I'd ship this direction. The look sells "an AI ending the world", and the controls sell "I'm the one doing it". Once the globe itself says where you can spread, a new player will never need the strip to find their next move.
