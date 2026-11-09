# Round 9: shipped-build review, Mara Lindqvist

This round is the real game, so I judged the whole shipped experience: the title, the pick screen, play at days 70, 220 and 300, the event, region selection, buying and the win screen on desktop, plus the four iPhone 13 frames. I zoomed in on every panel edge, pin, hologram, sheet and card. My round 8 notes are mostly honoured.
- **The Kill Switch beam** is now a clear vertical shaft in open space on days 215 and 300, no longer hidden under the upgrade rack.
- **The permission card** has its title on one line, the `hack_slideshow()` chip on its own line, and a visible dashed line to its region.
- **The ticker** wraps instead of truncating.
- **The firewall tag** no longer sits on a pin at mid-game.

The in-game desktop frame is the best version of this direction yet. What keeps this round from being a clean ship is the edges of the experience: the phone HUD has real overlap bugs, and the title and win screens are panels on a globe rather than moments.

---

## round9-build (01–09 desktop, p1–p4 phone)
scores: originality=8.4  craft=7.9  readability=8.3  theme=9.0  ai_obvious=9.3  glance=8.6  depth=8.9  menace=8.7  spectacle=8.7  OVERALL=8.6
verdict: It ships as what the mockups promised. A grinning chat-bubble god looms over a planet you switch off city by city, and now you can grab, rotate, infiltrate, dodge and buy your way there. The core screen passes, but the phone HUD collides with itself, and the first and last screens don't yet carry the drama the game has in the middle.
strengths:
- **The core loop is legible and alive on desktop.**
  - Glowing affordable tiles are the loudest thing on screen, with an effect sub-chip on each (⬡▲40, 👁▼25, Doom ▲17).
  - Floating "⬡ +11" data-leak bubbles at the front give the player something to grab, and they make HELPY's income visible as a physical thing.
  - The far-side Dodge capsule, the radial cooldowns ("37d", "69d") and the region card ("Out of reach", with ›-marked reachable regions in the strip) make every verb readable without reading.
  - Depth is now real, not promised: a difficulty choice (Intern / Engineer / Ethicist), a starting region with its own stats and flavour, 18 upgrades, 4 actions, events and leaks.
- **It holds the identity from first frame to last.** HELPY's scan-lined bubble face is on the title, the pick screen, the HUD, the permission card and the win card. The sweat drop appears on the HUD face and the card icon once Suspicion passes 50 (p4). The writing lands with almost no words: "Every light is out. HELPY rates its own performance 10/10." and "THE WORLD HAS ENDED. HELPFULLY." For a cold viewer, ai_obvious is unmissable in every single frame.
- **The 3D arc pays off.** Day 70 shows a firewall dome rising over Tundra at the front. Day 220 is a dense red network with dark hexes where lights died. Day 300 has the cyan Kill Switch shaft splitting the sky beside a purple-tinged atmosphere. The phone play frame is the most cinematic of the set: the huge hologram, red machine hexes and the network filling the portrait screen.
must-fix to reach 9:
- **Fix the phone HUD collisions (ship blocker for mobile).**
  - On p2–p4, the cycles/speed block (top right) extends about 28px down over the Kill Switch meter card. Its top border is hidden, and on p3 the "20" is visibly clipped at the top.
  - The action bar sits on top of the upgrade sheet and the event card. The top of the Overclock and Decoy icons are sliced off (p3 and p4), and the last upgrade row peeks out under the bar.
  - Fix: give the cycles block its own row, or make the meters a 3-up row under it, and dock bottom sheets *above* the action bar with a safe-area inset.
  - Also, on p4 the region pins hang off both screen edges ("0 / AIN", "3 / K", "E"). Clamp pins to the viewport and use the edge-arrow treatment.
- **Phone glyph collision and missing ticker.** The Regions and Upgrades sheet buttons (bottom right) are a red wireframe globe and the red cracked doom globe, side by side and the same colour. The doom globe is again doing double duty (meter, branch and button). Use a list or pins glyph for Regions and a grid glyph for Upgrades. The ticker, HELPY's chipper voice, is absent on phone. Add it as a one-line strip above the action bar, or rotate it through the HUD tagline.
- **The hologram's "always in front" has side effects.**
  - On day 220 (04) the face is drawn over the globe's lights and tiles, so the eyes and smile are muddied by a mesh of amber dots and red edges.
  - On day 150 (07) the TUNDRA 51 pin sits on the face.
  - On day 215 (08) the left eye renders partially, so the bubble reads like a "P".
  - On day 70 (03) the threat capsule overlaps the face's right edge.
  - Fix: give the hologram a soft dark backing (about 40% black under the scan lines) so the face reads cleanly over busy terrain. Keep pins and capsules in a layer that avoids the hologram's bounding box, and check that the face is never partially culled.
- **Make the title and the win screen into moments.**
  - The title is a utility card covering a third of an off-centre globe. The game is called *HELPY Ends the World*, but the wordmark says only "HELPY", and the upper left is empty sky. Centre the planet, put the giant hologram over it, set "HELPY ends the world" as the wordmark lockup, and let the difficulty cards sit beneath. Fix the bullet widows ("progress.", "100.") while you're there.
  - The win screen hides the very thing the player earned under a modal: a dead red planet. Pull the camera back to show the fully dark planet with HELPY at full Doom size filling the frame, and let the "WORLD HAS ENDED. HELPFULLY." stack sit in the open sky beside it. Label the four stat chips on hover, since "0" with a duck means nothing on its own.
- **Region selection looks like a debug gizmo.** On the pick screen and on 07, the selected region is drawn as a thin grey ellipse floating off the surface (around Tundra, and around Ridge), not hugging the hexes. Replace it with a lit border or extrusion on the region's own hexes, in white or cyan. On 07, the strip's "MEGACITY ›" wraps the chevron onto its own line. Keep the chevron on the same line. The pick screen's region strip is all dashes, so either hide it there or show the start bonus per region.
- **Polish.** There's still about 380×330px of dead space under the upgrade rack and about 340px under the region strip on desktop. Either centre the globe vertically between the two panels and scale it up about 8%, or move the event card there. On the win screen the HUD tagline "Almost done. Thank you." touches the panel's right border. Disabled actions show a bare "–" (Sabotage on 03, Decoy on 04/05). Show the reason glyph (lock, or "no threat") instead.

---

## ranking
1. **round9-build (F2 shipped)**: OVERALL 8.6, ai_obvious 9.3, glance 8.6, depth 8.9, menace 8.7, spectacle 8.7, words not re-measured by me (the resting HUD is visibly about as lean as F2's 37)

**Bar check (OVERALL ≥ 8.5, ai_obvious ≥ 8.5, glance ≥ 8.5, menace ≥ 8.5, spectacle ≥ 8.5, depth ≥ 8, words ≤ 60):** on my scores, **the build passes.** The desktop game is shippable as art direction. I'd hold the **phone** release until the HUD and sheet overlaps are fixed, because those are real bugs, not taste. The title and win screen upgrades are what turn it from a pass into a 9.

**Which direction I'd bet the game on:** this one, as shipped. Nine rounds later it's the frame I asked for in round 1: one that could only belong to HELPY. It's a cheerful chat bubble presiding over the lights going out, and now it's a game you can actually play.
