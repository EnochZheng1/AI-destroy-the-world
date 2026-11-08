# Round 9 review: Sam Reyes (player voice)

This round is the playable build. I judged it from 9 desktop and 4 phone screenshots of real play. The resting play screen counts at roughly 35–40 words by my eye (HUD labels, region strip, pins, prompt and a one-line ticker), so it's under 60. I didn't run the script.

---

## First 30 seconds (title → pick → first frames)

**Title (01, p1):** I'd keep going. There's a dark globe, the red smiling chat bubble, "HELPY" and "The helpful assistant that ends the world." I got the whole game from one line and one picture. The difficulty buttons are jokes I actually read because they're two words each ("INTERN · Trusting humans", "ETHICIST · They read papers"). On desktop, the three rule bullets are the only "tutorial", and I read them because they're three lines: fill Doom, don't let Suspicion or the Kill Switch hit 100. Phone drops the bullets and is all big buttons. NEW WORLD is the obvious tap.

**Pick (02):** "CHOOSE WHERE HELPY WAKES UP" is a great first decision: one tap, it feels like a Plague Inc start-country pick, and the region card has a big red ▶ WAKE UP HERE. Do I know what to tap? Yes. Do I know which region is a good pick? No. The card shows ⬡▲400 and ⬡4 as two coin chips that mean different things, and only 5 of the 9 pins are on the visible side of the globe.

**First frames of play (03):** Within seconds something is happening: a cyan firewall dome is already going up over my home region, there's a threat tag with a countdown and a duck button, red cubes are spreading, and floating "⬡+11" chips are drifting around. That's exciting. But do I know what to tap? Only half. I have 1 cycle, so the duck (⬡37) and every tile are out of reach, yet the actions bar looks just as tappable as when I'm rich. The "⬡+11" coin pickups look like labels, not things to grab. I tapped the dome and the tiles before I realised the drifting red boxes were the money.

**Verdict on the first 30 seconds:** I'd keep playing. The hook (watch a cheerful chatbot eat the planet) lands immediately. The "what do I tap right now" answer is weaker than it should be at the very start.

---

## round9-build (desktop 01–09, phone p1–p4)

**What's great:**
- **Cause and effect in 3D actually plays now.** The dome over the threatened region, the Kill Switch beam rising straight up from Ridge (tall and readable in 05 and 06), red scan rings on the region HELPY is working, and the permission card drawing a dashed line to Capitals (06). I can see what HELPY did and what humans did back.
- **The upgrade grid is the hook.** Paused (08) or on phone (p3), the three buyable tiles blaze solid red with price and effect chips. Owned tiles go quiet and locked tiles show a padlock. The hover card leads with chips ("network ▲30 · ⬡▲40"). On phone the tiles are big and thumb-sized, and it's the most satisfying screen in the build.
- **The win screen (09) is shareable.** "THE WORLD HAS ENDED. HELPFULLY." "HELPY rates its own performance 10/10." Four icon stats (100% · 9/9 · 18/18 · 0) and PLAY AGAIN. I'd screenshot that and send it.
- **Round-8 fixes landed.** The globe clears the upgrade panel on desktop. The news line is complete, not cut off. The loss chip is not a coin. The permission card's line to its region is visible.
- **Phone works.** The permission card (p4) is huge and readable with chips. The bottom bar holds the four actions plus the Regions and Upgrades sheet buttons. The globe fills the screen in portrait.

**What still bugs me:**
- **HELPY's hologram sits on the playfield.** It covers the top-left quarter of the globe on desktop and about a fifth of it on phone (p2, p3, p4). Pins land on top of it (TUNDRA in 07, SILICON in 04), and on a touch screen I'd be tapping the bubble when I want a region. The red shard and streak artifacts around it are still in the real build (04, 07, p2).
- **The ⬡ pickups don't look grabbable.** "⬡+11" and "⬡+49" are flat red-outlined rectangles, the same shape as UI tags. Plague Inc's popping bubbles work because they're round, bright and bouncy.
- **Actions don't show affordability.** At 1 cycle (03) the duck ⬡37 looks exactly as tappable as at 717. Some actions show a bare "–" (sabotage in 03, duck in 04 and 05) with no clue whether that means locked, no target or on cooldown.
- **The phone HUD overlaps.** The cycles and speed card covers the top of the Kill Switch card (p2, p3, p4). Pins are clipped at the screen edge ("0 AIN", "3 IK" in p4). The Upgrades sheet button uses the Doom globe icon, the same as the Doom meter, so I thought it was a Doom button. The "ask HELPY…" prompt and the "/" prefixes are gone on phone, which drops the chatbot cue there.
- **The region strip and pick card have small issues.** "MEGACITY ›" wraps onto two lines (07). The little › chevrons (reachable to infiltrate?) are never explained. "🔒 Out of reach" on Ridge is good, but nothing points at which regions *are* in reach.
- **The Doom bar barely moves for most of a run** in these frames (2 at day 220, 17 at day 300). The win meter sits nearly empty for two-thirds of the game, so "numbers go up" comes from the strip and the cycles, not the meter that matters. It could be pacing or just these captures, but players will notice.

scores: originality=8.6  craft=8.6  readability=8.6  theme=9.2  ai_obvious=9.3  glance=8.7  depth=9.0  menace=8.8  spectacle=8.8  OVERALL=8.9
verdict: It plays like the mockups promised: a grinning chat bubble eats a glowing planet while cyan domes and beams fight back. The remaining problems are touch-target and feedback polish, not direction.
strengths:
- A cold read in one second, from title to win screen: a chat-bubble AI, a planet going red, and "the helpful assistant that ends the world".
- Real strategic cause and effect in 3D: home pick, spread, scan rings, threat dome with a duck dodge, a Kill Switch beam that grows, and permission cards tied to their region by a line.
- The upgrade board and the win screen are the two "show a friend" moments, and both read without sentences.
must-fix to reach 9:
- **Get HELPY off the playfield.** Park the hologram in a fixed slot outside the globe's silhouette (top-left of the space, not over the land), or fade it to about 25% while the player drags or hovers a region under it. Never let it intercept taps. Delete the leftover red shard and streak particles around it.
- **Make ⬡ pickups look like pickups.** Use round, pulsing hex coins with a soft bounce and a pop-and-fly to the cycles counter when tapped, not rectangular tags. They're the main early-game tap, so they must be the most obviously tappable thing on screen.
- **Show action affordability and state.** Dim unaffordable actions with a thin "need" ring (the same style as the tiles). Replace the bare "–" with a padlock (locked) or a greyed target icon (no valid target).
- **Fix phone layout collisions.** Stop the cycles card overlapping the Kill Switch card. Keep pins inside the safe area. Give the Upgrades sheet button a grid or tile icon instead of the Doom globe. Add back a slim "ask HELPY…" line, or at least the "/" prefixes, so the chatbot read survives on phone.
- **Clarify the pick screen.** Show 2–3 chips that differ (income, security, and something like a difficulty star) instead of two coin chips. Add a spin hint or arrows so I know there are 4 more regions behind the globe.
- **Polish the region strip.** Fix the MEGACITY wrap. Replace the unexplained › with the same glow the globe uses for "tappable / in reach" so the strip and globe teach each other.

**Phone verdict:** Good. The bottom-sheet Regions and Upgrades split works, the sheets and event card are thumb-sized, and portrait suits the globe. The overlap and icon issues above are the only blockers.

---

## ranking
1. **round9-build (playable)**, OVERALL 8.9. **PASS** against the round-6 bar: OVERALL 8.9 ≥ 8.5, ai_obvious 9.3 ≥ 8.5, glance 8.7 ≥ 8.5, menace 8.8 ≥ 8.5, spectacle 8.8 ≥ 8.5, depth 9.0 ≥ 8, and words at rest about 35–40 ≤ 60 (my estimate, not script-verified).
2. f2-nightside-helpy (round 8), OVERALL 8.9. Pass. The build holds the mockup's score, adds real depth (pick, infiltrate, pickups, win screen) and loses a little to touch and polish issues.
3. f1-nightside-helpy (round 7), OVERALL 8.7. Pass.

Ship this direction. It's the game I'd download, play for 10 minutes and screenshot the win screen of. The next round should be about the first 30 seconds of taps (pickups, affordability, hologram out of the way), not more visuals.
