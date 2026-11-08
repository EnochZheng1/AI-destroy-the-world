# Round 6: Dev Okafor

New test for a new direction. I watched three frames from one autoplay game at day 60, 220 and 300, imagined the motion the brief describes between them, and asked the coordinator's four questions from a player's seat:

1. Can I read state and threats at 4x?
2. Can I tell which regions are mine, and where to act next?
3. Does a globe that hides its far side hurt decisions?
4. Do the 3D effects clarify cause and effect, or are they noise?

Short version: the owner is right that this feels like an AI ending the world, and E1 in particular has real dread. But both prototypes threw away most of the strategy UI that B1–B5 built over five rounds. The pieces that went missing:

- Region names and percentages
- The threat-to-counter button
- Buyable-tile emphasis and effect chips
- A visible event or permission card
- Depth tooltips

Neither prototype passes. That loss is fixable, because the HUD is a separate layer and the B5 solutions can be ported onto it.

**What both share (the black-glass HUD):**
- **Good:** The meters keep their icons, big numbers and colour identities (Doom red, Suspicion amber, Kill Switch cyan). The Suspicion card gains an amber outline at 52, so alarm styling follows danger. Cycles and rate, Day, and pause/1×/2×/4× are clear. The status line under the red eye ("Optimizing humanity." → "Almost done." → "You won't need these.") is the best piece of writing in the build.
- **Regressed from B5:**
  - In the upgrade grid, owned tiles are the solid red, loudest ones again, while unlocked tiles are faint dashed outlines. The one affordable tile (120 at day 220, with 132 cycles) gets only a thin red border. There are no effect chips and no "need N" bars.
  - Action costs have lost the hex token.
  - Cooldowns are back to a plain grey "38d" instead of the radial sweep.
  - The news line reads "Blackouts spreading…" in all three frames.
  - None of the six frames shows an event or a permission card, and there are no depth or tooltip shots at all, so I can't confirm depth.

---

## e1-nightside (day060 / day220 / day300 + filmstrip)
scores: originality=7.6  craft=8.5  readability=7.4  theme=8.0  ai_obvious=8.6  glance=8.2  depth=7.3  menace=9.0  spectacle=8.4  OVERALL=8.0
verdict: The most ominous frame in six rounds. Red machine cubes eat a night-lit globe while the atmosphere goes from blue to blood red, and a cyan firewall dome rising over a region is perfect cause and effect. As a strategy screen, though, it has no region labels, shows half the world, and drops every action affordance B5 had.

strengths:
- **Ownership reads in half a second, and so does the arc of the game.** Red extruded cubes are mine, and dark-blue hexes with amber city lights are humanity. From day 60 to 300 the lights go out and the rim glow shifts from blue to red with Doom. A player who glances at the globe at 4x knows how the game is going without looking at a single meter. That's the "see it play out" the owner asked for.
- **The firewall dome is the best cause-and-effect image either build has.** At day 220 a cyan geodesic dome sits over one region with "◑ 🧱 11d". By day 300 it has shrunk to a cyan countdown ring tagged FIREWALL. It's unmistakable and it gets more urgent over time. Cyan for humans, red for me and amber for living cities make a clean three-colour language.
- **Menace and the AI read come from visuals, not copy.** The HAL-style red eye, red network cables, data arcs with travelling pulses and a terminal-style "> ask HELPY…" prompt say "rogue AI" with every word ignored.

must-fix to reach 9:
- **Add region identity: a 9-region strip in the HUD.** Nightside shows no region names and no percentages, so "Firewall Sweep in Silicon Shoals" doesn't map to anything I can see. Add a compact strip of 9 region pips under the meters, each with a short name, a % bar and a threat icon. That takes about 19 → 37 words, still under 60. It also solves the far-side problem (next bullet).
- **Make the hidden hemisphere show up in the HUD.** At any moment roughly half the regions are on the far side, and the limb compresses the rest into unreadable slivers (look at the right edge at day 220/300). A threat or a new spread on the back is invisible unless the camera happens to swing. Add edge-of-globe arrows pointing toward off-screen threats (cyan for humans, red for my spread), let a click on a region pip rotate the globe to it, and auto-rotate slowly toward the active frontier.
- **Put the counter on the threat.** The firewall tag shows a countdown only. B5's tag had the loss (⬡↓45) and a raised Dodge button. Here, Decoy is a duck icon in the bottom action bar about 700px away, with no link to the dome. Attach "🦆 ⬡49" to the dome's tag. At 4x, the counter has to sit where the eye already is.
- **Restore B5's upgrade-grid hierarchy.** Owned tiles are solid red, the loudest thing in the grid, and the affordable tile has only a thin border. Make owned tiles calm, make affordable tiles solid red with a glow, bring back the effect chips (👁↓25 ⏻↓15) and the "need N" progress bar, and put the hex token back on every cost in the action bar.
- **Show the event and depth layers.** The brief describes a permission card and a camera swing to events, and neither appears in any frame. Ship shots with a permission card docked under the red eye, with equal-weight choices and icon effect chips, plus hover cards for a region, an upgrade and an action. Until I see them, I can't score depth at 8.
- **Keep the cheerful assistant visible inside the menace.** The red eye says HAL, not "relentlessly cheerful assistant", and the satire now lives only in the status line. Let the eye produce one chat bubble (icon or emoji, e.g. "🙂👍") during spread bursts. That keeps the assistant read and makes the dread funnier. Give the drones a silhouette as well: the pink particle cloud at the globe's upper left reads as rendering debris, not as Automation multiplying.

## e2-war-table (day060 / day220 / day300 + filmstrip)
scores: originality=7.9  craft=7.7  readability=7.2  theme=7.6  ai_obvious=8.2  glance=7.8  depth=7.4  menace=8.3  spectacle=8.6  OVERALL=7.7
verdict: The closest, most physical spectacle. The cyan Kill Switch beam shooting out of Research Ridge and cyan walls rising around Grain Expanse are great to watch. But the camera crops the board, the upgrade panel covers whole regions, and the tile states don't add up to a readable map.

strengths:
- **Human resistance is huge and readable.** At day 220 the Kill Switch beam is a cyan pillar of light out of Research Ridge, so I can see the losing condition growing. The firewall is a cyan wall extruding around Grain Expanse with "◑ 🧱 12d", rising further by day 300 ("▶ 🧱 4d"). This is the best "what are the humans doing about it" in the build.
- **There are region names on the board** (Silicon Shoals, Bank Isles, Grain Expanse, Tundra Server Farms, Old Capitals, Research Ridge), and red arcs with pulses show exactly where the next jump goes. From the arcs alone I can predict which region falls next.
- **Machine towers rising out of conquered hexes** give Automation and Doom a physical mass that the globe can't match at this scale.

must-fix to reach 9:
- **Fix the camera framing first.** At day 60 the bottom 35% of the screen is empty floor, and the right-hand continent is partly behind the upgrade panel. At day 220/300, Old Capitals and Research Ridge are cut off ("OLD C…", "RESEARCH RI…"). A war table's advantage over a globe is that it can show all 9 regions at once without distortion, and this camera gives that up. Raise and pull back the camera so the whole board fits between the meters and the action bar, and keep the grid panel off the board (dock it at the screen edge, or make it collapsible).
- **Define three tile states and keep to them.** I count at least five looks: hollow red outlines, red outlines with towers, filled glowing red discs (Research Ridge at day 300), blue hexes with white domes, and lilac-pink pillars. The pillars sit close enough to red that at day 60 I couldn't tell whether Silicon Shoals was mine. Use human (blue/amber, warm windows), mine (red), and contested/threatened (cyan edge). Recolour the lilac buildings to a clearly cool blue.
- **Add percentages to the region labels and stop them being cut off.** Names without % don't tell me which region is close to falling. Put a % next to each name, and pin labels to the screen edge with an arrow when their region is off camera.
- **Same threat, grid and event fixes as E1.** Put the duck Decoy button with its cost and the loss on the firewall tag. Make affordable upgrade tiles the loudest, with effect chips. Show a permission card and depth hover cards in the shots.
- **Turn drone noise into drone signal.** The pink particle swarm (top-left at day 300) and the red glow puddle next to Research Ridge both read as effects with no cause. Each shockwave or swarm should come from a visible action, such as an upgrade bought or a region taken, and fade within a second, so the effect points to its cause.

---

## ranking
1. **e1-nightside**: OVERALL 8.0 (ai_obvious 8.6, glance 8.2, depth 7.3, menace 9.0, spectacle 8.4). **Does not pass.** Glance, depth and spectacle are below the bar, and OVERALL is under 8.5.
2. **e2-war-table**: OVERALL 7.7 (ai_obvious 8.2, glance 7.8, depth 7.4, menace 8.3, spectacle 8.6). **Does not pass.** It fails on ai_obvious, glance, depth, menace and OVERALL.

Both pass the word budget (19 and 38).

On the four questions:
1. The meters read fine at 4x, but threats are small tags with no counter-button attached.
2. Red clearly marks my regions in both. Where to act next is unclear in both, because there are no region percentages, no affordable emphasis and no visible events.
3. Yes, the hidden hemisphere hurts. Roughly half the world, and any threat on it, is invisible, and the limb compresses the rest. It needs a region strip and off-screen threat arrows.
4. The dome, the beam, the arcs and the dimming city lights clarify cause and effect. The drone particles and glow puddles are noise.

I'd bet on **Nightside**. It's the one image that sells "an AI is eating the world" in a single frame, and the globe's dimming lights give the whole session a readable arc. I'd add E2's huge cyan Kill Switch beam and its region labels, and port B5's strategy layer back onto the HUD: the region strip, the counter-button on threats, affordable-first tiles with chips, and event cards. The 3D layer is already doing its job. The strategy layer went missing and needs to come back.
