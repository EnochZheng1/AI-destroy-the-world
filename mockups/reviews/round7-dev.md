# Round 7: Dev Okafor

F1 is E1 Nightside with my round 6 must-fixes applied. I watched day 60 → 220 → 230 (summit) → 300, then the two hover frames, with the same questions as last round. Can I read state and threats at 4x? Do I know which regions are mine and where to act next? Does the far side hurt? Does the 3D explain cause and effect?

My round 6 must-fixes, checked against F1:

| Round 6 must-fix | Status in F1 |
|---|---|
| 1. 9-region strip | **Landed.** It has a ring pip, a short name and a %. Reachable regions get a ›, which is very useful on day 60, where Tundra, Silicon and Capitals show "› –". The threatened row (GRAIN) turns cyan with a firewall icon, linking the strip to the dome. |
| 2. Far-side arrows, camera on the front | **Partly verified.** The threatened region stays front and centre in every frame. The Kill Switch beam sticks out past the right limb, so Research Ridge's progress is readable even from the side. Region rings with % sit on the globe and at its edge. **But none of the 7 frames shows a far-side threat, so I haven't seen an edge arrow.** |
| 3. Threat tag | **Landed.** "◔ 🧱 12d ⬡45% [🦆 ⬡50]" sits on the dome, with Dodge in solid red as the action colour. Two problems: the loss glyph collides with the price token, and the loss disappears by day 300 ("2d [🦆 ⬡61]"). |
| 4. Upgrade hierarchy | **Mostly.** Owned tiles are a quiet dark red with a small check. Can't-afford tiles show "⬡120" with a red bar toward the price (116/120 on day 226 reads well). Locked tiles have a lock. Every price uses the token, and Overclock's cooldown is a radial sweep ("◑ 39d"). **But no frame ever shows a buyable tile,** because the bot spends cycles immediately. So the "loudest, with an effect chip" state is unverified. |
| 5. Permission card and depth frames | **Landed.** "HELPY REQUESTS PERMISSION · ⏸ · AI SAFETY SUMMIT" has equal-weight ALLOW ONCE / DENY with 👁/⏻ chips. The region hover card is excellent. The upgrade hover card has no effects at all (see must-fixes). |
| 6. Cheerful HELPY, real drones | **Landed.** The red, scanlined speech-bubble smiley floating beside the globe and casting a scan cone onto the region it's eating is the best character beat in seven rounds: cheerful and horrifying at once. The drones read as quadcopter crosses on day 60. The day-300 swarm is still more cloud than drones. |

---

## f1-nightside-helpy (day060 / day220 / day230-summit / day300 / day220-upgrade / day220-region + contact sheet)
scores: originality=8.3  craft=8.6  readability=8.4  theme=8.9  ai_obvious=9.1  glance=8.7  depth=8.2  menace=9.1  spectacle=8.8  OVERALL=8.6
verdict: Nightside is now a strategy game as well as a doom scene. The strip says who owns what, the dome and its tag say where the humans strike and what it costs to dodge, and the beam says how close the off-switch is. HELPY's grinning red hologram scanning the planet gives the dread a face. Two decision-critical details are still missing: upgrade effects in the hover card, and a loss glyph that doesn't look like a price.

strengths:
- **The game reads in one sweep at 4x, and colour carries meaning on all three layers.** Red is mine, cyan is the humans, amber is living cities. Reading top to bottom: meters with ▲ rates (Suspicion gets an amber outline at 52), then the strip's ring pips, then the cyan dome with its countdown ring, loss and red Dodge button, then the beam from Ridge. On day 226 I knew in about two seconds that Grain was about to be wiped in 12 days, that dodging cost 50 of my 116, and that Kill Switch was at 11 and rising. The Grain row in the strip, the dome and the tag all light up cyan together. That is the cause-and-effect link the 3D needed.
- **The spectacle explains the strategy instead of decorating it.** City lights go dark and red machine cubes extrude as regions fall. The atmosphere turns from blue to red as Doom goes 3 → 73. The dome grows over its region, and the cyan beam lengthens with Kill Switch progress. Data arcs show the jumps. Every big visual change maps to a number in the HUD, so a player learns the systems by watching.
- **The AI read and the satire are back, without words.** A speech-bubble logo, a giant scanlined chat-bubble face with a projector cone, a "> ask HELPY…" terminal prompt, slash-command actions and network arcs say "chatbot AI" at a glance. The red scanlines and the dying lights stop it from being cute. The region hover card ("RESEARCH RIDGE · 4% · Research · 🛡60 · ⬡2/day at 100%" plus "the people writing your off-switch") is depth done right.

must-fix to reach 9:
- **Put effects in the upgrade hover card, and show a buyable tile.** "QUANTUM OVERCLOCK · ⬡240 · you have 29" plus flavour tells me the price and the joke but not what the upgrade does. That is the one thing I need to choose between 120, 150, 240 and 230. Add the B5 effect chips to the card (and to the tile once it's affordable). Then capture one frame with the bot paused while a tile is buyable, so the "loudest tile with a chip" state can be checked. In seven frames it never appears.
- **Give the loss its own glyph and keep it on the tag.** "⬡45%" sits right next to "🦆 ⬡50" in the same hex shape and colour family, so at 4x the loss reads as a second price. Use a cracked or broken red cell with ↓ for "presence lost". The loss also drops off the tag by day 300 ("2d · 🦆 ⬡61"), just when the decision is most urgent. It should stay all the way to zero.
- **Connect the globe's rings to the strip.** The rings on the globe show bare numbers (82, 81, 24, 27, 100). Tundra 82% and Banks 81% are indistinguishable on the planet. Put two-letter initials inside each ring (TU, BK), and make hovering a strip row pulse its ring and turn the camera toward it. Hovering a ring should highlight its row the same way.
- **Show the far-side arrow.** The brief's biggest globe risk is a threat on the hidden hemisphere, and no frame contains one. Capture a frame where the firewall targets a region behind the globe, with its cyan edge arrow and countdown, plus the matching cyan row in the strip.
- **Make the permission card's chips readable at a glance.** "👁▲9 ⏻▼8 / 👁▼5 ⏻▲3" are about 11px glyphs, and good versus bad is carried only by tint. Use boxed chips at about 16px, solid for good for me and hatched or cyan for good for the humans, as B5 did. Point the card at the event's region with a leader line or a ring pulse on Old Capitals. On day 230 the card sits in the bottom-left corner with no link to the map.
- **Clean up two effects that read as bugs.** On days 220 and 230 HELPY's scan cone renders as a flat, opaque red slab across the top of the globe. It hides cells and looks like a clipping error. Make it a translucent scanline cone that fades before it reaches the surface. Late game, dark red machine tiles under a red atmosphere lose contrast (day 300). Brighten their edges as Doom rises so my territory stays readable at the climax.

---

## ranking
1. **f1-nightside-helpy**: OVERALL 8.6, ai_obvious 9.1, glance 8.7, depth 8.2, menace 9.1, spectacle 8.8, 28 words. **It passes the full bar from my seat.**

The pass is conditional on verification, not on redesign. Two of the claimed fixes, the buyable tile with its effect chip and the far-side edge arrow, never appear in the frames, and the upgrade hover card is missing its effects. I'd treat the first, second and fourth must-fixes as blockers before the next round's frames, because each one hides information a player needs to make a decision.

I'd bet the game on **F1**. It is the first build that meets both of the owner's demands at once. It feels like an AI ending humanity: red planet, dying lights, a grinning hologram doing the eating. And every frame of that spectacle maps to a number I can act on, which is what makes it a strategy game.
