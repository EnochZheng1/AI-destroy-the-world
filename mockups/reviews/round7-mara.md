# Round 7: art-direction review, Mara Lindqvist

I looked at all six F1 frames (days 60, 220 and 300, the day 230 Summit and the two day 220 hover cards), zooming to 200% on the hologram, scan cone, threat tag, dome, Kill Switch beam, drones, pins, permission card and upgrade grid. I took the 28-word count as given and checked F1 against my round 6 must-fixes for E1.

The headline: HELPY is back, and the frame finally has an owner. A cheerful red chat-bubble face hanging over a planet whose lights are going out is dread *and* satire in one image, which is exactly what I asked for. What keeps this from passing is execution. The hologram is too small to loom, the scan cone and drone swarm render as artefacts, and the Kill Switch beam fires sideways into a HUD panel.

---

## f1-nightside-helpy (day060 / day220 / day300 / day230-summit / day220-upgrade / day220-region)
scores: originality=7.9  craft=7.8  readability=8.0  theme=8.7  ai_obvious=9.1  glance=8.2  depth=8.5  menace=8.9  spectacle=8.3  OVERALL=8.3
verdict: The right idea at last: HELPY's own smiling speech bubble presiding over a dying night-side Earth, with the B5 strategy layer back underneath. But the face is a sticker in the corner rather than a presence, and three of the key 3D effects (scan cone, drone swarm, Kill Switch beam) read as rendering accidents in at least one frame. It's close, but it doesn't pass.
strengths:
- **The identity and AI read are restored.** The scan-lined red bubble face (with the same mark in the HUD and on the permission card) says "chatbot" faster than anything since B2, with every word blanked. Its fixed grin while Doom climbs from 0 to 73 is the joke and the menace in one. The HAL eye is gone, and the HUD tagline turning from "Optimizing humanity." to "You won't need these." is the best single line in seven rounds.
- **The apocalypse arc is still the best in the project.** On day 60 the planet is amber-lit with a cold blue rim, a few crimson cubes and pink quadcopters. By day 220 the network cables are whipping around the limb and a cyan geodesic firewall dome sits over Grain. By day 300 the regions are dead, their lights gone, under a blood-red atmosphere. Dead regions dim while the active front blazes, so you can read *where* the war is, not just *how far* it's gone.
- **The strategy layer is back, and depth is one hover away.**
  - The 9-region strip uses ring pips and percentages, and the threatened row (Grain) is highlighted with the firewall glyph.
  - The ⬡ token now sits on every price, the upgrade tiles carry "need N" bars, and Overclock has a radial cooldown pie.
  - The threat tag shows days, loss and the Dodge price as one capsule (12d · ⬡↓45% · duck ⬡50).
  - The region card ("Universities, labs and the people writing your off-switch") and the upgrade card ("Every qubit says yes and no to you") carry real flavour.
  - The permission card's ALLOW ONCE / DENY effect chips read at a glance.
must-fix to reach 9:
- **Make HELPY loom, not hover in a corner.** The hologram is about 140px wide and sits off the top-left of the globe, beside the planet rather than over it. On day 300 it's no bigger than on day 60. Scale it with Doom (from about 15% of the globe's width early to about 60% at day 300), move it behind and above the planet so the globe sits under its chin, and let its glow tint the atmosphere. When Doom is high, the face should dominate the frame. That's the shot for the storefront.
- **The scan cone renders as a stray plane.** On day 220 and the Summit frame, a flat dark-red sheet slices across the upper globe (around x 560–870, y 280–350, plus a second one near (900, 300) in the Summit frame). It reads as z-fighting geometry, not a beam of attention. Render the cone as an additive, scan-lined volume from the face's mouth to a bright footprint ring on the target region, depth-tested against the globe, with no opaque faces.
- **The Kill Switch beam fires sideways into the HUD.** It points horizontally out of the right limb like a lightsaber. On day 300 (Kill Switch at 28, more than double day 220) it's *shorter* on screen than on day 220 and disappears under the upgrade panel. On the day 220 hover frames it faces the camera and collapses into a glowing blob. Aim it along the globe's local "up" at Research Ridge but give it a fixed screen-space minimum length, add a matching cyan halo ring around the planet that fills with Kill Switch %, and keep it out of HUD safe areas.
- **The drone swarm turns into a pink smear.** On day 60 the quadcopters read beautifully as pink X-silhouettes. By day 220–300 the swarm is a static salmon clump fixed at the globe's top-left (around (520, 300)), with no readable units and the same position in every frame. Cap visible drones, spread them as orbiting flocks over the regions they serve, and keep the X silhouette at every density.
- **Fix the label collisions on the dome.** On day 300 the threat capsule sits on top of Grain's "100" pin, which is half hidden ("1|00" under the tag). On day 220 and the Summit frame the dome's pin is crammed against the tag's lower edge. Offset the capsule above the dome with a leader, and the pin below. The region pins (27, 24, 81) are also about 8px numerals, too small for a glance read. Go up to about 11px, or drop the numbers on the globe and keep the rings, since the strip already lists percentages.
- **Composition and HUD polish.**
  - About 380×330px of empty starfield sits under the upgrade panel, and about 320×200px under the region strip, while the globe is pinned to the centre. Push the camera in so the globe fills more of the frame, or let the permission card and hologram claim that space.
  - Owned upgrade tiles are the darkest, most "disabled-looking" state on the grid, and no frame shows a buyable tile at rest, so "buyable is loudest" is untested. Give owned tiles a lit red edge, and include a frame where something is affordable.
  - The ticker wraps to a widow ("it's / fine.""). Fit it to one line.
  - The permission card's green and red effect colours are the only green on screen. Use red for bad and cyan for good, so the card stays in the palette.

---

## ranking
1. **f1-nightside-helpy**: OVERALL 8.3, ai_obvious 9.1, glance 8.2, depth 8.5, menace 8.9, spectacle 8.3, 28 words

**Bar check (OVERALL ≥ 8.5, ai_obvious ≥ 8.5, glance ≥ 8.5, menace ≥ 8.5, spectacle ≥ 8.5, depth ≥ 8, words ≤ 60):** on my scores, **F1 does not pass.** ai_obvious, menace, depth and the word budget clear the bar. OVERALL (8.3), glance (8.2) and spectacle (8.3) miss.

**Which direction I'd bet the game on:** F1, without hesitation. It's the first 3D frame that could only belong to HELPY. Everything still missing is execution: a bigger hologram that grows with Doom, a clean scan cone, a properly aimed Kill Switch beam and a drone swarm that stays readable. Fix those four and this is the storefront shot.
