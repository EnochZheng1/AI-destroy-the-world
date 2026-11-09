# Round 8: art-direction review, Mara Lindqvist

I looked at all seven F2 frames (days 60, 220 and 300, the day 230 Summit, the day 215 upgrade hover, the day 220 region hover and the day 228 far-side threat), zooming to 200% on the hologram, the beam, the pins at the globe's edge, the threat capsule, the permission card and the upgrade grid. I took the 37-word count as given and checked F2 against my six round 7 must-fixes.

Of the four fixes I said would put F1 on the bar, all four are in.
- **The hologram looms and grows.** It's about 280px by day 300 and sweats once Suspicion passes 50.
- **The scan slab is gone.** In its place is a clean spotlight with a footprint ring.
- **The Kill Switch beam fixes its own problem.** It rises vertically and lengthens with progress (a short sliver at 5, a tall shaft at 28).
- **Buyable tiles finally blaze.** The 70, 80 and 90 tiles on day 215 are the loudest thing on the right side.

What's left is a new class of problem: the bigger globe now collides with the HUD, and a few labels still fight.

---

## f2-nightside-helpy (day060 / day220 / day300 / day230-summit / day215-upgrade-190 / day220-region / day220-M)
scores: originality=8.3  craft=8.1  readability=8.3  theme=9.0  ai_obvious=9.3  glance=8.5  depth=8.7  menace=9.1  spectacle=8.6  OVERALL=8.6
verdict: This is the storefront shot. A giant, grinning, scan-lined chat bubble rises behind a planet going dark, sweating as humanity starts to notice, while a cyan Kill Switch shaft climbs from Research Ridge. It's ownable, ominous, funny and strategically legible, and the remaining flaws are collisions, not concept.
strengths:
- **The hero image works.** Depth-sorted behind the globe, the hologram reads as HELPY *rising over the horizon*. That's a better idea than the flat sticker of round 7, and it scales with Doom from a peeking face on day 60 to a face that fills the upper-left quadrant on day 300. The cyan sweat drop past 50 Suspicion is perfect: one glyph that tells you both "AI" and "it's getting nervous", with no words. Combined with the HUD tagline arc ("Optimizing humanity." to "Almost done. Thank you."), ai_obvious and menace are the strongest of the project.
- **Cause and effect are now legible in 3D.**
  - The Kill Switch beam is a true vertical column whose length tracks progress, and on day 215 and day 220 it rises right through the Research Ridge pin, so the threat and its source are one image.
  - The firewall dome sits on Grain with its capsule (days, cracked-cell loss ▼45%, duck price).
  - The far-side threat gets an edge tag ("→ 20d Grain"), and a dodged sweep leaves a red "DODGED" stamp on Megacity, with the Decoy chip going onto a 69d cooldown at the same moment. That's the action, its effect and its cost, all visible.
  - Pins now carry names (TUNDRA 64, CAPITALS 13, RIDGE 4), so the globe reads without the side strip.
- **The strategy HUD is tight and honest.** Buyable tiles are solid red and blazing, owned ones dimmed, locked ones grey with a lock, and the not-yet tiles carry "need" bars. ⬡ now means money only, and the cracked cell means loss. The permission card is in palette (cyan for good, red for bad, boxed chips), and the `hack_slideshow()` chip brings back the code-voice joke from B2 at zero word cost.
must-fix to reach 9:
- **Keep the globe out of the right-hand HUD.** The larger globe's right edge now runs under the upgrade panel.
  - On day 220, the Kill Switch beam, a lose condition, is *hidden behind the panel* at about x 1045, with only a cyan sliver and a glowing base visible.
  - The CAPITALS 26 pin sits on top of the panel's border and the first tile column.
  - On day 215 the FACTORY 9 pin and an unnamed pin are clipped by the panel and the hover card.
  - Fix: shift the globe's centre about 60px left (the left strip is slimmer now, so there's room) or shrink it about 6%. Clamp pins and beams to a safe area that excludes the HUD, and when a pin would land under a panel, dock it to the panel edge with an arrow, as the far-side tag already does.
- **The threat capsule still covers the Grain pin.** On day 300, "FIREWALL" sits directly on top of "100", which reads as "FIREWALL" over a half-hidden "100". On day 230 the "100" ghosts through behind the capsule. Same note as round 7. Put the capsule above the dome on a short leader, and the pin under the dome.
- **The hologram needs a minimum visible area.** In the day 220-M frame the camera has rotated, and the face is almost entirely behind the globe: a red box with one eye peeking. On day 60 the planet's limb slices through its right eye. Rising-behind-the-horizon is the right idea, but guarantee that the eyes and smile are always above the limb (offset the hologram up and outward as the camera turns), since it's the main AI signal.
- **The drone smear survives at high density.** Single drones read as dark angular X-silhouettes on days 60 and 215. But there's still a frayed red-pink particle clump under the hologram's mouth on days 220, 230 and 300, and a streaky red smear on the upper-right limb on day 228-M. If that's the swarm, cap it and spread it into a visible flock. If it's a spawn burst, fade it out after a second.
- **The ticker is truncated.** The one-line fix now cuts off every punchline ("Traffic lights blink in M…", "Blackouts spreading. Expe…", "Committee formed to form …"). That's the same mistake I flagged on B3's sidebar. Either scroll it (the brief allows ticker motion) or write headlines of about 28 characters or fewer. The HUD tagline now wraps to two lines ("Optimizing / humanity."). Widen the logo block by about 20px.
- **Polish.**
  - "AI SAFETY / SUMMIT" wraps in the permission card, with the code chip crammed next to "SUMMIT". Keep the title on one line and put the chip on its own line.
  - I can't find the promised dashed line from the card to its region in the Summit frame. Make it visible at this size.
  - On day 215 the buyable Robot Factory tile shows a "⓪▲" sub-chip whose glyph is unreadable at 9px.

---

## ranking
1. **f2-nightside-helpy**: OVERALL 8.6, ai_obvious 9.3, glance 8.5, depth 8.7, menace 9.1, spectacle 8.6, 37 words

**Bar check (OVERALL ≥ 8.5, ai_obvious ≥ 8.5, glance ≥ 8.5, menace ≥ 8.5, spectacle ≥ 8.5, depth ≥ 8, words ≤ 60):** on my scores, **F2 passes**, narrowly on glance (8.5) and spectacle (8.6). I recommend it. The globe-HUD collision that hides the Kill Switch beam on day 220 is the one item I'd treat as a ship blocker for production. Everything else is polish.

**Which direction I'd bet the game on:** F2. It's the frame I said I wanted in round 1: one that could only belong to this game. A cheerful chat bubble, sweating as it rises over a planet whose lights it is switching off, carries the satire, the dread and the strategy in a single shot.
