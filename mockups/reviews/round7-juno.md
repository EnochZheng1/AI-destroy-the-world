# Round 7 review: Juno Park

*How I judged this: the round 6 bar is unchanged. It must feel like an AI destroying humanity, show the strategy playing out in 3D, still play as a readable strategy game, and stay within 60 words at rest. My own lens is also unchanged: is the presentation itself the point, and is HELPY a character rather than a borrowed costume? I judged seven stills (day 60, 220, 230 with the summit card, 300, the two day-220 hover states, and the contact sheet) using the brief's description of what moves between them.*

---

## f1-nightside-helpy (day060 / day220 / day230-summit / day300 / day220-upgrade / day220-region / contact sheet)
scores: originality=8.4  craft=8.6  readability=8.3  theme=8.9  ai_obvious=8.9  glance=8.6  depth=8.5  menace=8.7  spectacle=8.7  OVERALL=8.7
verdict: The fix that mattered landed. A giant, cheerful, scan-lined chat-bubble face smiling over a night planet whose lights are going out is the game's key image: menacing because it is still smiling. F1 passes my bar, with a set of smaller fixes left.

**Round 6 must-fixes (E1 and shared):**
- **HELPY's face:** fixed, and it is the best decision of the whole process. The HAL eye is gone. HELPY is its own speech-bubble smiley, rendered as a red scan-lined hologram, and the same face appears in the HUD and on the permission card. The chat-bubble silhouette says "assistant", the red scanlines say "something is wrong", and the smile is the joke. Next to "You won't need these.", that is exactly the chipper-surface, apocalyptic-core contrast I have asked for since round 1.
- **News line:** fixed. It rotates through "Traffic lights blink in Morse code.", "Blackouts spreading. Experts: 'it's fine.'" and "Committee formed to form a committee.", the last of which is a good addition.
- **Permission card:** fixed. "HELPY REQUESTS PERMISSION · AI SAFETY SUMMIT · ALLOW ONCE / DENY" survived the pivot, with the bubble icon on it.
- **The day 300 red mush:** fixed. Finished regions sink to dark, dead red while the front line glows, so the end state reads as a planet that has been used up, not as noise.
- **The Kill Switch:** fixed. A huge cyan beam lances into space from Research Ridge, and in the hover shot the Ridge glows cyan with its own vortex. You can always see where humanity's counterattack is coming from.
- **Labels:** partly fixed. The region strip on the left (ring progress, %, and a firewall icon on the threatened row) is a clean glance read, but the names are not on the globe. See the first must-fix below.
- **Breaking the Plague Inc read:** partly fixed. The hex spread is still a red infection on a globe, but the hologram changes the read from "a disease" to "something is doing this", which is what mattered.
- **Geography:** partly fixed. Regions now wrap toward the limb, but at day 220 there is still a broad dark patch in the middle-right of the globe.

strengths:
- **It is screenshot-ready.** The day 300 frame (red atmosphere, a dead planet, the last cyan firewall dome holding at 2d, the Kill Switch beam, and a smiling red chat-bubble hovering over all of it) is a storefront image and a meme at once, and it needs no caption. A smile over an apocalypse is the one-line pitch for the game.
- **The AI read survives with the words ignored.** A giant chat-bubble face, a "> ask HELPY…" prompt bar with "/" command chips (the slash is back), network arcs and a scan cone all add up to "a chatbot is eating the planet" within a couple of seconds, and the bubble shape makes it specifically an assistant, not a generic AI.
- **The comedy is now seasoning, as the owner asked, and it is good seasoning.** It sits in the deadpan tagline, the rotating news and in tooltips such as "Every qubit says yes and no to you." and "Universities, labs and the people writing your off-switch.", which are short, dark and in voice. Depth is one hover away and stays out of the way.

must-fix to reach 9:
- **Tie the region strip to the globe.** At rest, the globe's ring badges show only numbers (82, 24, 81…), so you find "RIDGE" by matching 6% to a badge. Put each region's short name on its globe badge (9 words, which takes you to about 37 of 60), or at least light the matching globe region and draw a leader line when a list row is hovered or selected.
- **Make the hologram loom.** At about 130 px it sits beside the globe rather than over it, at the same size on day 60 and day 300. Scale it up about 1.5–2× and place it behind and above the planet's limb so it overlaps the atmosphere. Make the scan cone a clear volumetric spotlight with a lit footprint on the region being consumed. On day 220 and 230 it reads as a flat red shard, and on day 300 it nearly vanishes.
- **Let the smile do one thing.** The fixed grin is the joke, so keep it, but give it one or two state changes: B5's nervous sweat or side-eye when Suspicion passes 50 (it is 52 at day 300 and HELPY looks calm), and a wider, glitching grin near Doom 100. A reacting face is what people clip.
- **Fix the permission card's sizing.** The ▲9 / ▼8 effect icons are about 12 px, much weaker than B5's chips, so make them twice as large. Give the request its object with a `hack_slideshow()` chip, as in round 5. Then dock the card to the hologram with a beam or tail so that HELPY is visibly the one asking.
- **Fix the drones at day 60.** The pink four-lobed drones read as cherry blossoms or flowers, which undercuts the menace in the opening minutes. Use angular quadcopter silhouettes in HELPY red with a small rotor blur.
- **Give the planet back some width.** The region list and the upgrade grid take about 45% of the screen, and the globe is only about 620 px across. Narrow the left strip (once the names are on the badges it can shrink to rings and %), and enlarge the globe by about 15%.

---

## ranking
1. **f1-nightside-helpy**: OVERALL 8.7, ai_obvious 8.9, glance 8.6, depth 8.5, menace 8.7, spectacle 8.7, 28 words. **It passes my full bar.** Every threshold is met, though glance and depth have little margin.

I would bet the game on F1. It finally merges what the owner wanted (dread, 3D, strategy you can watch) with what made the satire work from round 1: a relentlessly cheerful assistant smiling while it switches the planet off. Put the region names on the globe, make the hologram loom with a real spotlight, and give the smile one nervous tell, and this is a 9.
