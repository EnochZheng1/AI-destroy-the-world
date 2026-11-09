# Round 4: art-direction review, Mara Lindqvist

I re-read the brief, including the new 60-word budget, the two new criteria (`glance` and `depth`), and the change that `ai_obvious` is now judged with the words ignored. I looked at both B4 frames at 200–300%. For `ai_obvious` I mentally blanked every word and asked what the shapes alone say. I also reviewed the icon set as an asset, as the coordinator asked.

The owner is right, and B4 proves it. B3 at rest was an article, and B4 is a game screen. My job now is to say whether the new frame is as good as it is easy.

---

## b4-helpy-glance.png (+ b4-helpy-glance-depth.png)
scores: originality=8.3  craft=8.0  readability=8.7  theme=8.3  ai_obvious=8.6  glance=8.9  depth=8.2  OVERALL=8.3
verdict: A real leap in glance-ability that keeps B3's inks and mascot, but the new icon set, the core asset of this direction, is a generic stock-style line set that ignores the riso identity, and the frame went from crowded to under-filled. It's close but not yet a pass.
strengths:
- **It reads in a second.** The three meters sit as icon + bar + big number. Suspicion is the inverted-blue danger block, Kill Switch uses rule-stripes and Doom is solid pink. Cycles are the chip glyph with a big 96, and speed is a four-cell switch. The 18-tile upgrade grid carries every state through form alone: solid pink with ✓ = owned, pink-tint with a pink cost = affordable, dashed with a blue cost = can't afford, pale with a lock = locked. It also reads as a tree, owned at the top and locked at the bottom. The event card's effect chips finally solve my round 3 note: solid pink = good for you, hatched = bad, each with an icon, an arrow and a number.
- **The mascot is now the hero, and the shapes say "AI" without words.** A giant halftone speech-bubble face with typing dots, a prompt bar with "/" command chips and a heavy send arrow, network node-and-edge lines across the infiltrated hexes, a chip icon for the currency and a robot for the Automation branch. Blank every word and you still get "a chatbot is spreading over the world". The duck icon for Decoy Traffic, a literal decoy duck, is the best visual pun in four rounds, and the fridge, cat, shopping-cart and traffic-light tiles keep some of the satire visible without text.
- **The depth is really one hover away.** The depth frame shows a meter tooltip (rate, lose condition and counterplay), a region card with a perk chip and flavour ("Parliaments, ministries and a lot of fax machines") and an upgrade card with effect chips, cost against your 96 and a muffin joke. Eighteen upgrades, four actions, an event, a threat and nine regions are all on screen as shapes, so the screen promises systems.
must-fix to reach 9:
- **Make the icon set match the art direction.** As an asset it's consistent (one stroke weight, rounded caps, a shared 24px grid), but it reads as an off-the-shelf SaaS line set: fridge, smiley, database, mic, server, briefcase, zap, atom, heart. It's the only element on the screen with no riso treatment, so it's the "default UI kit" note I've been fighting since round 1. Redraw the set to the house rules: chunkier 3px strokes with slightly irregular corners, a 1–2px pink/blue mis-registration offset, halftone fills for owned tiles, and give HELPY's face mark a cameo in two or three icons (Polite Tone Module, Everyone's Best Friend). Also fix the weak glyphs: the Undersea Cable squiggle (row 3, col 1) reads as a scribble, and the atom, heart and Ω tiles mean nothing until hovered. Give each at least a literal hint of its upgrade.
- **Remove the icon collisions.** The chip glyph means both Cycles (top bar) and the Network branch header. The robot is both the AUTO branch header and the Robot Factory Firmware tile. The mic is both the AI Safety Summit event and Deepfake Press Office (the 45 tile). In a no-words UI, one glyph must mean one thing. Give the branch headers their own outlined variant, and keep the chip exclusively for currency.
- **The jump routes now look like broken leader lines.** The pink dashed infection routes run straight under the GRAIN EXPANSE plate and end at a blue node sitting on top of TUNDRA SERVER FARMS. With the round 3 leader lines gone, the plates float in the sea ("OLD CAPITALS" sits about 40px west of its ringed cells, between continents). Without percentages there's also no visible border telling you which hexes are Grain Expanse versus Tundra. Route the dashes around the plates, dock each plate against its own region with a short tick, and draw region borders as a 2px blue seam between territories.
- **Fill the frame. It's under-filled now.** About 180px of empty dotted paper runs between the bottom of the map and the HELPY/event row, and about 130px sits under the upgrade grid. Scale the map up roughly 15% to use the panel, and move the mascot and event up into the freed band. The empty space reads as "unfinished", not "calm".
- **Make the threat loud again, and point things at the right target.** The Firewall Sweep, the one urgent decision on screen, has shrunk to a small "brick 9d | duck 49" tag in the corner. Its stem points at empty sea near Bank Isles, not at the hatched Silicon Shoals. Pin the tag directly on Silicon Shoals, and add a pulse ring or a solid-pink border while it's live. Also, the event card's speech-bubble tail points down at the prompt bar. It's HELPY asking, so flip the tail left toward the mascot.
- **Polish the depth layer and fix small render issues.**
  - The tooltips break on single words ("Security / 50.", "you have / 96"). The Lobbyist Bots card covers the RESEARCH RIDGE plate ("RESEARCH R"). The region card has no pointer to its region. Anchor every tooltip with a tail and set a minimum width so numbers never wrap.
  - The disabled /sabotage chip's border renders as a purple-to-blue gradient on its left half, which looks like a compositing artefact. Use a flat pale-blue border.
  - The tick marks at the same positions on all three meter bars are unexplained. Drop them or make them meaningful thresholds.
  - The effect chips mix units ("↑9" against "↓8%"). Pick one.
  - The news ticker (a core feature in the brief) is gone at rest and in the depth frame. Bring it back as a slow icon-and-headline strip, or as HELPY's bubble cycling headlines.

---

## ranking
1. **b4-helpy-glance.png**: OVERALL 8.3, ai_obvious 8.6, glance 8.9, depth 8.2

**Bar check (every critic: OVERALL ≥ 8.5, ai_obvious ≥ 8.5, glance ≥ 8.5, depth ≥ 8, and words ≤ 60):** on my scores, B4 does **not** pass. ai_obvious, glance, depth and the stated 42-word count all clear the bar. OVERALL misses at 8.3.

**Which direction I'd bet the game on:** this one. Look-easy, pack-a-lot is the right brief, and B4's structure is the right answer to it. What's holding it back is craft I can name: an icon set that needs to be drawn in HELPY's own riso hand, glyph collisions, map labels and routes that don't attach, and an under-filled frame. Fix those and it's a 9.
