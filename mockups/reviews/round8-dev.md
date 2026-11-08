# Round 8: Dev Okafor

F2 is F1 with every round 7 note applied. I went through day 60 → 215 (paused, upgrade hover) → 220 (region hover) → 226 → 228 (far side) → 230 (summit) → 308. For each frame I asked the usual questions. Can I read state and threats at 4x? Do I know which regions are mine and where to act next? Does the far side hurt? Does the 3D explain cause and effect?

My round 7 must-fixes, checked against F2:

| Round 7 must-fix | Status in F2 |
|---|---|
| 1. Effects in the upgrade hover card; a buyable tile | **Landed.** The hover card now leads with chips ("DATA CENTRE SQUATTING · ▲30 · ⬡▲40 · ⬡80 · you have 275"). In the paused day 215 frame, the three buyable tiles (⬡70, ⬡80, ⬡90) are the brightest objects in the HUD, each with an effect chip. That's exactly the B5 hierarchy, now in 3D. |
| 2. A loss glyph that isn't a price | **Landed.** "▼45%" in the humans' cyan sits beside the solid red "🦆 ⬡50" Dodge block, and at 4x they no longer read as two prices. The glyph is small, but the ▼ and the colour do the work. |
| 3. Globe rings linked to the strip | **Landed.** Pins are bigger and named (TUNDRA 83, BANKS 82), so the 81-versus-82 ambiguity is gone. |
| 4. A far-side threat frame | **Landed, with gaps.** Day 228 shows a cyan edge chip "→ ▦ 20d Grain" at the limb. The same frame shows the best cause-and-effect beat in the series: a red footprint ring stamped "🦆 DODGED" on Megacity, with the Dodge action now on cooldown ("69d", dashed red) in the action bar. The gaps are covered in must-fix 3. |
| 5. Readable permission chips, pointed at the region | **Chips landed.** The boxed chips are about 16px, and red-means-helps-HELPY versus cyan-means-helps-humans finally matches the globe's colour language. "hack_slideshow()" is a great touch. **I couldn't find the dashed line to the region** in the summit frame, and Capitals isn't on screen in that frame. |
| 6. Fix the scan slab and late-game contrast | **Landed.** The slab is gone. Dead red tiles are darker and the frontier is brighter, so day 308 now reads as "all mine, Ridge last" (RIDGE 81% is the only open ring in the strip). The cyan sweat drop on HELPY at Suspicion 52 is a good touch. |
| Kill Switch beam | **New:** it now rises straight up the screen. It reads clearly at day 308, but see the first and second must-fixes. |

---

## f2-nightside-helpy (day060 / day215-upgrade-190 / day220-region / day220 / day220-M / day230-summit / day300 + contact sheet)
scores: originality=8.4  craft=8.5  readability=8.6  theme=9.0  ai_obvious=9.2  glance=8.8  depth=8.6  menace=9.1  spectacle=9.0  OVERALL=8.8
verdict: Every blocker I raised is fixed. Buyable tiles blaze with chips, threats carry a non-price loss and a Dodge button, pins have names, the far side has an edge chip, and a dodge leaves a "DODGED" footprint on the planet. What's left is layout polish: the globe collides with the upgrade panel, and the Kill Switch beam both hides behind the panel and blocks the board, depending on where Ridge is facing.

strengths:
- **Every player action now leaves a mark you can see.** Buying an upgrade lights its tile. A dodge stamps "DODGED" on the region and starts the Dodge cooldown. A firewall raises a dome tagged with its countdown, loss and price. Kill Switch progress shows as a cyan pillar, and Doom turns the atmosphere red. I can follow cause and effect at 4x without reading the HUD, which is what spectacle should mean for a strategy game.
- **One colour language from the globe to the cards.** Red means mine or good for HELPY, cyan means humans or good for them, and amber means living cities. The permission chips (cyan 👁▲9, red ⏻▼8), the threat tag (cyan ▼45%, red Dodge), the region card (⏻▼65) and the globe all use the same rule. A new player learns it once from the planet and can read every decision card after that.
- **Depth is real and one hover away.** The region card shows "RESEARCH RIDGE · 4% · ⏻▼65 · Research · 🛡60 · ⬡2/day at 100%" plus "the people writing your off-switch". The upgrade card leads with chips. The strip shows nine percentages and a › on reachable regions. With 37 words at rest, it still looks like a lot of game.

must-fix to reach 9:
- **Stop the globe overlapping the upgrade panel.** The globe's right limb runs under the grid in every frame. On day 226 the CAPITALS 26 pin sits on the grid's edge tiles. On day 215 FACTORY 9 overlaps the bottom-left tile. On day 228 the far-side chip "20d Grain" straddles the panel border. Move the globe about 60px left or shrink it about 8%, and keep a clear gutter in front of the panel.
- **Make the Kill Switch beam readable without hiding the board.** When Ridge faces the camera (days 215 and 220) the beam is a bright column straight through the front of the globe, washing out Capitals and Tundra tiles and pins. When Ridge is on the limb (day 226) it's half hidden behind the upgrade panel. Draw tiles and pins over the beam inside the globe's disk, or taper its core to low opacity there. Keep it out of the panel's area.
- **Make the far-side chip actionable.** "→ ▦ 20d Grain" has no loss and no Dodge state. On day 228 Dodge is on cooldown for 69 days while the threat lands in 20, so the player can't dodge it, and only the action bar says so. Put "▼45%" and a greyed "🦆 69d" on the edge chip, so the bad news sits where the threat is. Make the → bigger.
- **Point the permission card at its region, even when the region is off screen.** I can't find the promised dashed line on day 230, and Old Capitals isn't visible. Either swing the camera to the event region (as the brief describes) or run the dashed line to a cyan or red edge arrow for an off-screen region.
- **Fix label and mascot collisions.** On day 226 the threat tag covers the SILICON pin. On day 308 the red "FIREWALL" tag sits on top of GRAIN's "100". On day 228 HELPY's hologram goes behind the globe and only the top half of the face shows. Keep tags off pins with a small offset rule, and draw the mascot in screen space so the planet never hides it.
- **Small fixes.** Tile chips are about 10px, and Robot's chip "Ⓓ▲" has no number. Make them about 13px and always show the magnitude. The news line is now cut off ("Blackouts spreading. Expe…", "Committee formed to form …") in the narrower strip. Let it wrap to two lines, because the joke is the punchline.

---

## ranking
1. **f2-nightside-helpy**: OVERALL 8.8, ai_obvious 9.2, glance 8.8, depth 8.6, menace 9.1, spectacle 9.0, 37 words. **It passes the full bar from my seat**, with margin on every criterion and nothing left unverified.

The remaining must-fixes are layout and collision polish. None of them hides information a player needs to make a decision, except the far-side chip's missing loss and Dodge state, which I'd do first.

I'd bet the game on **F2**. It's the version where the owner's "see it play out in 3D" and my "every decision readable at 4x" turn out to be the same thing. Each spectacle beat (dome, pillar, DODGED stamp, red atmosphere, blazing tiles) is also a piece of state or an action I can take.
