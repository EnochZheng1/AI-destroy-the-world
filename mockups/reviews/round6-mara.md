# Round 6: art-direction review, Mara Lindqvist

I re-read the brief, including non-negotiable #3 (3D, an AI destroying humanity) and the new `menace` and `spectacle` criteria. I looked at all six frames and both filmstrips, zooming in on the HUD, the dome, the beam, the labels and the board edges. I judged the stills, using the brief's description of what animates between frames. Neither prototype has a depth or hover screenshot, so I scored `depth` on what the resting frames promise.

First, the honest reaction. The owner asked for dread, and both prototypes deliver it. But they buy it by throwing away the identity this project spent five rounds earning. The halftone speech-bubble HELPY, the two inks and the cheerful-assistant contradiction are all gone, replaced by black glass, neon red and a glowing red camera eye. That eye is HAL 9000, the single most borrowed "evil AI" image in existence. It reads as "AI" instantly, but it reads as *every* evil AI, not HELPY. Menace was the brief. Generic was not.

---

## e1-nightside (day060 / day220 / day300 + filmstrip)
scores: originality=6.8  craft=8.0  readability=7.6  theme=7.6  ai_obvious=8.5  glance=8.0  depth=7.3  menace=9.0  spectacle=8.0  OVERALL=7.8
verdict: A genuinely chilling arc. The planet's lights go out and the atmosphere bleeds from blue to red, so the progress of the apocalypse reads from across the room. But it's a cyber-threat-map look I've seen in a dozen games, the nine-region strategy has vanished from the globe, and HELPY is no longer HELPY.
strengths:
- **Doom you can feel at a glance.** The rim light shifts from cold blue (day 60) to a blood-red halo (day 300). Amber city lights, which are humanity, thin out until almost none remain. Crimson circuit-cubes extrude and multiply into a dense machine crust. That's the best single "progress of the apocalypse" read in six rounds, and the menace is real, not cute.
- **Disciplined colour roles.** Red is HELPY (network, towers, Doom), cyan is human resistance (the Kill Switch meter and the firewall dome) and amber is human attention (city lights and the Suspicion meter). The day-220 cyan geodesic dome with its "11d" pin is the most readable countermeasure in the set. You see where the humans are fighting back.
- **Lean HUD (19 words).** Three icon meters, a speed switch, an 18-tile upgrade grid with owned, affordable and locked states, a terminal-style "> ask HELPY…" prompt with four action chips, and a one-line ticker. It looks easy.
must-fix to reach 9:
- **Bring HELPY's own face back as the menace.** Replace the HAL-style red eye with the halftone speech-bubble face, recoloured for this palette. Then make it the villain of the scene: a giant cheerful bubble-face hologram rising over the globe as Doom climbs, city lights reorganising into its smile on fallen regions, or machine towers shaped like stacked speech bubbles. The cute-versus-dread contradiction *is* the satire and the ownable idea. Without it, this is Plague Inc with a red filter, and the brief's "you are an assistant or chatbot" read rests on one prompt bar.
- **Make the nine regions exist.** The globe carries no region borders, names or per-region state, so the strategy layer (which region to push, which one the firewall threatens, where Research Ridge is) is invisible. Draw thin cyan or amber seams between regions on the hex skin, float a small 3D billboard per region (name on hover, a percentage ring always on), and mark Research Ridge with a permanent beacon.
- **The Kill Switch has to be seen.** In the day-220 frame it's a small cyan wedge on the far limb of the globe (right edge, around x 935, y 585), and at day 300 it's a speck. For the lose condition, that's far too quiet. Rotate the camera periodically to Research Ridge, or render the beam as a tall column visible from any angle (like a lighthouse breaking the silhouette of the planet), scaling with progress.
- **Use the frame.** The globe sits in the centre with about 40% of the screen as black starfield, and the HUD panels float in the corners. Push the camera in so the globe fills about 80% of the height, or offset it left so it bleeds off the frame. Let the events and the permission card (absent from all three frames) own the empty right-hand space.
- **Fix the ambiguous numbers.** The top-right reads "132 227" and "2155 308": cycles and day sit side by side with no currency glyph, so they parse as one figure. The action chips show bare numbers (22, 41, 29, 36) that could be costs or cooldowns ("38d" appears only once). Restore the cycles token from round 5 on the bank and on every chip.
- **Polish.**
  - A pink debris burst sits at the same top-left spot of the globe in both the day-220 and day-300 frames. If it's a shockwave, it shouldn't persist. If it's a region-fall effect, anchor it to a region.
  - The ticker shows the same line ("Blackouts spreading. Experts: 'it's fine.'") on day 68, 227 and 308.
  - The locked upgrade tiles are dark red on black, under 2:1 contrast. Lift them to a visible outline.

---

## e2-war-table (day060 / day220 / day300 + filmstrip)
scores: originality=7.2  craft=7.0  readability=7.1  theme=7.5  ai_obvious=8.1  glance=7.5  depth=7.7  menace=8.4  spectacle=8.3  OVERALL=7.3
verdict: The war-room diorama is the more ownable idea, and its Kill Switch beam and rising firewall walls are the clearest cause-and-effect in the round. But the camera can't frame its own board, the HUD sits on top of half the world, and the pale pillars and toy-like towers read as an RTS map, not humanity being erased.
strengths:
- **Spectacle you can point at.** The day-220 Kill Switch beam is a huge cyan shaft rising from Research Ridge into the dark, which reads instantly as "the humans are building the thing that kills me". Cyan translucent firewall walls rise around Grain Expanse with a "12d" then "4d" countdown pin, and red data arcs with travelling pulses span the regions. This is "see it play out" done properly.
- **Region identity survives the move to 3D.** Names are printed on the table (SILICON SHOALS, BANK ISLES, GRAIN EXPANSE, RESEARCH RIDGE), and each region's state reads as material: pale or warm-windowed blocks, red hex outlines, solid red machine towers, glowing red domes at Research Ridge by day 300. Strategy is legible in a way it isn't on the globe.
- **A fitting stage for dread.** A lit board in a dark room, with the floor grid and red light pooling as Doom rises, has a WarGames and DEFCON situation-room menace. The diorama scale invites the camera swings the brief describes.
must-fix to reach 9:
- **Frame the board.** In every frame the right-hand upgrade panel sits on top of the board. "OLD C…" and "…GE" are cut off at day 60, and "RESEARCH RI…" is clipped at the right edge at day 300. At day 60, the bottom 40% of the screen is empty grid floor. Pull the camera back and up so all nine regions sit inside a safe area that excludes the HUD columns, and make the HUD panels semi-transparent over board content.
- **Make humanity look human.** At day 60 the uninfected cities are tall pale-mauve pillars (a bed of nails across Silicon Shoals) that read as neither houses nor machines, and the change to red towers is a palette swap. Give humanity warm-windowed low-rise blocks with amber light, consistent with the brief, and let them visibly topple, darken and get replaced. Make sure the robots and drones the brief promises are legible as units at this zoom. I can't find them in any frame.
- **Replace the red eye with HELPY, and give it a body on the table.** As with E1, the HAL eye is borrowed menace. A war table begs for a game piece: put HELPY's speech-bubble face on the board as a giant, cheerful, glowing pawn or hologram that hovers over the region it's working on. That gives `ai_obvious` a visual anchor (currently 8.1, below the bar) and restores the satire.
- **Floor labels: legibility and occlusion.** The labels are grey, slanted, low-contrast floor text, and towers and hex outlines cut through them ("OLD CAPITALS" is half hidden by towers at day 220). Billboard the labels so they face the camera, and lift them above the tallest tower.
- **Lighting artefacts.** At day 300 a big soft red blob sits on the floor at about (1020, 650), reading as a stray point light rather than a Doom effect. The same persistent pink debris burst as E1 hangs at the top left. The ticker never changes. Make the Doom light a room-wide grade, not a hotspot, and tie particles to events.
- Same number ambiguity as E1: "116 226" and "1981 304" in the top right, and chips with no currency or cooldown glyphs.

---

## ranking
1. **e1-nightside**: OVERALL 7.8 (menace 9.0, spectacle 8.0, ai_obvious 8.5, glance 8.0, depth 7.3), 19 words
2. **e2-war-table**: OVERALL 7.3 (menace 8.4, spectacle 8.3, ai_obvious 8.1, glance 7.5, depth 7.7), 38 words

**Bar check (OVERALL ≥ 8.5, ai_obvious ≥ 8.5, glance ≥ 8.5, menace ≥ 8.5, spectacle ≥ 8.5, depth ≥ 8, words ≤ 60):** **neither passes.**
- E1 clears menace, meets ai_obvious exactly and meets the word budget, but misses on OVERALL, glance, spectacle and depth.
- E2 misses OVERALL, ai_obvious, glance, menace, spectacle and depth.

**Which direction I'd bet the game on:** E1's orbital globe. Its Doom-coloured atmosphere and dying city lights carry dread at thumbnail size, and the globe frames itself where the table doesn't. But steal three things from E2: its lighthouse-scale Kill Switch beam, its rising firewall walls and its visible region identity. Above all, put HELPY's own speech-bubble face back at the centre of the menace. A cheerful chat bubble smiling over a planet going dark is dread *and* satire, and it's the only version of this screenshot that could belong to no other game.
