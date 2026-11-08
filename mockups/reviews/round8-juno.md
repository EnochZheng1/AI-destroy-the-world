# Round 8 review: Juno Park

*How I judged this: the round 6 and 7 bar is unchanged. It must read as an AI destroying humanity, the strategy has to visibly play out in 3D, it must still glance and play like a strategy game, and it must stay within 60 words at rest. My own lens has not changed either: the presentation should be the joke, and HELPY should be a character, not a costume. I judged the eight stills from the screenshots only, checked each of my round 7 must-fixes, and looked for new collisions and for jokes lost along the way.*

---

## f2-nightside-helpy (day060 / day220 / day230-summit / day300 / day215-upgrade-190 / day220-region / day220-M / contact sheet)
scores: originality=8.5  craft=8.7  readability=8.4  theme=9.0  ai_obvious=9.1  glance=8.8  depth=8.6  menace=8.9  spectacle=8.8  OVERALL=8.9
verdict: F2 is the best frame of all eight rounds. A smiling chat-bubble face that grows with Doom and breaks into a sweat as Suspicion climbs, looming over a planet going dark, sums up the whole game. It passes my bar comfortably, and what is left is layout polish, plus a news line that cuts off its own punchline.

**Round 7 must-fixes:**
- **Region names on the globe:** fixed. Every pin now reads ring, number and name (SILICON, GRAIN, TUNDRA, CAPITALS, RIDGE, MEGACITY…). Strip and globe finally match, and glance jumps.
- **Hologram presence:** fixed. It is about 1.6× larger, overlaps the planet's limb and grows with Doom: by day 300 the face is nearly half the globe's width. It now looms instead of hovering beside the planet.
- **One tell on the smile:** fixed. A cyan sweat drop appears at Suspicion 52, while the smile stays fixed. The tagline goes from "Optimizing humanity." to "Almost done. Thank you.", which is the politest threat in the game and a perfect line.
- **Permission card:** mostly fixed. It has big boxed effect chips (eye ▲9, power ▼8 and so on) and a `hack_slideshow()` chip, so the request has its object again. But I cannot see the dashed line to the region in the day 230 frame.
- **Drones:** fixed. They are red, angular quadcopter crosses now and no longer read as flowers.
- **Globe width:** fixed. The globe is larger and the left strip slimmer. This created a new collision on the right, covered in the first must-fix.
- **Scan spotlight:** partly fixed. The glowing footprint ring is there (Banks at day 60, Megacity at day 228), but no frame shows a cone running from HELPY's face to that footprint, so the "HELPY is doing this" link is still implied rather than seen.

strengths:
- **It works as a storefront shot and as a meme.** Day 300 has a red atmosphere, a dead red planet, a cyan Kill Switch pillar shooting into space, and a giant scan-lined smiley with a single nervous sweat drop over "Almost done. Thank you." It is funny, dreadful and unmistakably about a chatbot, all at once, which is exactly what this satire has been reaching for since round 1.
- **Cause and effect now read at the scale of the strategy.** The decoy action shows "DODGED" in a red ring on Megacity, with the duck chip in the prompt bar dropping onto a 69d cooldown. An off-screen firewall marker ("→ 20d Grain") points around the planet. The Kill Switch beam rises from Ridge, and the firewall dome sits over Grain with a countdown and a cost to dodge. You can see what HELPY did and what humanity is doing back, without reading.
- **The seasoning is sharp and stays out of the way.** "Rent-free in a hyperscaler." (Data Centre Squatting), "Universities, labs and the people writing your off-switch.", "Committee formed to form a committee." and "Robot vacuums gather in p…" are all short, dry and in voice, and all of it sits one hover away while the resting screen holds at 37 words.

must-fix to reach 9:
- **Stop the globe running under the upgrade panel.** The larger globe now pushes its right limb under the panel. The CAPITALS pin (day 220) and the FACTORY pin (day 215 and 220) sit on top of the upgrade tiles, and the Kill Switch beam at day 220 disappears behind the panel. Shift the globe centre about 40 px left, or keep pins inside a safe area that clamps labels away from the panel edge.
- **Never let the planet hide HELPY.** When the camera swings (day220-M), the hologram ends up behind the globe: only a red slab with the tops of its eyes shows, and the character is gone. Render the hologram as a screen-anchored layer that always draws in front of the planet's limb, or orbit it with the camera so the face stays fully visible.
- **The news line truncates its punchline at rest.** "Blackouts spreading. Expe…", "Traffic lights blink in M…" and "Committee formed to form …" each cut off the joke. If this is a scrolling ticker, fine, but if it is truncation, wrap it to two lines in the slimmer strip. I flagged this same failure in round 3, and the punchline is always the last word.
- **Draw the spotlight cone.** The footprint ring exists, but give it a faint volumetric cone from HELPY's eyes down to the target region, so a still frame shows the face *doing* the consuming, not just floating nearby.
- **Fix two smaller collisions.** On day 300 the "FIREWALL" tag covers the GRAIN 100 pin, so offset it above the pin. The permission card's dashed link to the region is not visible on day 230; brighten it, or dock the card toward the hologram so HELPY is plainly the one asking.
- **Make the sweat read at thumbnail size.** The single cyan drop in the corner of the face is easy to miss in the contact sheet. Pair it with an eye change (side-eye, or one eye narrowing) so the nervous state reads at 300 px wide.

---

## ranking
1. **f2-nightside-helpy**: OVERALL 8.9, ai_obvious 9.1, glance 8.8, depth 8.6, menace 8.9, spectacle 8.8, 37 words. **It passes my full bar**, comfortably on every threshold.

I would bet the game on F2. A relentlessly polite chatbot face growing over a planet as the lights go out is ownable, readable at a glance, menacing, and still funny, and the strategy is now visible on the globe. Clear the right-edge collisions, keep the face from being hidden by the planet, and stop the news line from cutting off its punchlines, and this is a 9+.
