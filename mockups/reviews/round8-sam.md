# Round 8 review: Sam Reyes (player voice)

I judged these from the 7 stills only, using the brief's description of what animates between frames. The count at rest is 37 words (the coordinator's figure). I didn't run the script.

---

## f2-nightside-helpy (day 60 / 215-upgrade / 220 / 220-region / 228-M / 230-summit / 300)

**5-second gut:** Yes, and it's better than F1. HELPY's smiling bubble is bigger and hangs right over the planet it's eating. The Kill Switch is now a cyan pillar shooting straight up out of Research Ridge, which you can't miss when Ridge faces you. The paused upgrade frame is the "numbers go up" moment I've wanted since round 4: three tiles blaze solid red with their price and effect, and everything I own sits quietly in the background. The day-300 frame (red sky, everything at 100, the bubble sweating a cyan drop, "Almost done. Thank you.") is the funniest and creepiest image in eight rounds. I'd play it and I'd share it.

**What I'd do first / click:** I'd buy the brightest red tile (80, 90 or 70), because they're the only lit things in the grid. Then I'd hit the red duck button on the threat chip when the dome went up over Grain. In the day-228 frame I can see that it worked: a big red ring and a "DODGED" stamp over Megacity, the duck button greys out on a pie cooldown with a red dashed border, and an edge arrow says the next sweep is "20d Grain". That's cause and effect I can read without a sentence.

**What landed from round 7:**
- The Kill Switch beam rises straight up and gets longer: a short stub at 12%, a tall pillar at 28%, and a huge column over Ridge in the region frame.
- The upgrade hover card leads with effect chips ("Data Centre Squatting: network ▲30, ⬡▲40, ⬡80 · you have 275"). The region card leads with a ⏻▼65 chip.
- Owned tiles are dimmed and buyable tiles blaze, each with an effect chip. This is the best the grid has looked in any round.
- The pins are bigger and named (TUNDRA, CAPITALS, PETROL...), so the globe and the strip finally match.
- The loss chip uses a cracked-cell glyph. ⬡ only means money now.
- The scan footprint ring on the targeted region (Banks at day 60, Megacity at 228) shows exactly where HELPY is looking.

**What still bugs me:**
- **The globe slides under the upgrade panel.** The right edge of the planet is behind the tile grid in every frame. At day 220 the Kill Switch beam is a cyan sliver squeezed under the panel, the CAPITALS pin label sits on top of the tiles, and in the day-228 frame the "20d Grain" edge arrow sits over the grid too. Most of the remaining mess comes from this one layout problem.
- **The chips and pins collide.** At day 220 the threat chip covers the Silicon pin (I can only see "28" peeking out). At day 300 the FIREWALL tag sits on top of Grain's 100 ring.
- **HELPY sinks behind the planet.** In the day-228 frame the bubble is half buried behind the globe, with only its top and eyes showing. It looks like a depth bug, not a choice.
- **The red smear isn't fully gone.** There are still red pixel shards at the bubble's tail (days 220, 230 and 300) and a spray of red streaks off the top-right edge at day 228.
- **I couldn't see the permission card's dashed line** in the day-230 frame. The card ("HELPY REQUESTS PERMISSION · AI SAFETY SUMMIT · hack_slideshow()", with chips) is great, and the code tag is a nice AI touch, but it still floats in the corner unconnected.
- **The news line gets cut off with an ellipsis** ("Traffic lights blink in M…", "Committee formed to form …"). A joke cut mid-word looks broken in a still frame.

scores: originality=8.5  craft=8.6  readability=8.6  theme=9.1  ai_obvious=9.3  glance=8.8  depth=8.8  menace=8.9  spectacle=8.8  OVERALL=8.9
verdict: The best build yet: HELPY's grinning bubble over a dying planet, a Kill Switch pillar you can't miss, and an upgrade grid that lights up exactly what to buy. Everything holding it back from 9+ is layout collisions, not concept.
strengths:
- The upgrade grid reads like a game, not a menu: blazing buyable tiles with effect chips, owned tiles dimmed, "need" bars on the rest, and hover cards that lead with chips.
- Readable cause and effect in 3D: the scan footprint ring shows HELPY's target, the dodge produces a "DODGED" stamp plus a cooldown on the duck plus an edge arrow to the next threat, and the Kill Switch beam grows over Ridge.
- Tone: a cheerful bubble that sweats at day 300 above a blood-red planet, with "Almost done. Thank you." Dread and comedy in one frame, no reading needed.
must-fix to reach 9:
- **Clear the panel.** Shift the globe left or shrink it about 8% so its right edge clears the upgrade grid by at least 24px. Then the Kill Switch beam, edge pins and edge arrows never land on the tiles. If the camera must frame wide, clamp pins and arrows to the globe area.
- **Stop chip and pin collisions.** Lift the threat chip above its region pin on a short stem (or fold the countdown into the pin ring itself), and push neighbouring pins aside. Put the FIREWALL tag beside the Grain ring, not on it.
- **Always draw HELPY's hologram on top.** No depth occlusion: the bubble should never sink behind the planet as in the day-228 frame. Keep it in a fixed screen slot above the globe.
- **Remove the leftover red shards** at the bubble's tail and the red streak spray on the top-right edge. The thin spotlight and footprint ring already do the job.
- **Make the permission card's dashed line visible** to its region in the summit frame, and swing the camera so the region is on the visible face.
- **Fix the cut-off news line.** Scroll it as a ticker or shorten each line to fit, and never end on "…".

**Phone concern:** The left strip, the globe and the right grid still won't fit side by side at phone width. The strip could become a row of 9 rings and the grid a bottom drawer. The panel-overlap problem will be worse on narrow screens unless the globe is framed to the space left over.

---

## ranking
1. **f2-nightside-helpy**, OVERALL 8.9. **PASS** against the round-6 bar: OVERALL 8.9 ≥ 8.5, ai_obvious 9.3 ≥ 8.5, glance 8.8 ≥ 8.5, menace 8.9 ≥ 8.5, spectacle 8.8 ≥ 8.5, depth 8.8 ≥ 8, and 37 words ≤ 60. It has comfortable margins on every gate.
2. f1-nightside-helpy (round 7), OVERALL 8.7. Pass.
3. e1-nightside (round 6), OVERALL 8.2. Fail.

Bet the game on F2. The direction is settled and every remaining issue is a layout or render fix. Get the globe out from under the panel and this is a storefront frame.
