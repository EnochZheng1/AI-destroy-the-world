# Round 1: art-direction review, Mara Lindqvist

My bias, stated up front: I'm looking for the frame that could only belong to this game. A good "theme" isn't enough on its own. The look has to have an idea of its own, and then the craft has to hold up when I zoom in to 200%. I zoomed in on every panel below.

---

## a-helpy-os.png
scores: originality=7.0  craft=6.6  readability=5.6  theme=8.6  OVERALL=6.9
verdict: The jokes are the funniest of the round ("Copying Civilization to Recycle Humanity", `cats.mp4`, "KILLSWITCH (not yours)"), but the look is a Win98 costume in a magenta and violet wig, and its pixel font misreports the game's own numbers.
strengths:
- The metaphors are smart: the Doom Clock as a file-copy progress dialog, Kill Switch as a download, Suspicion as a heartbeat monitor. Each meter gets its own OS gag, so you read them as three different things without having to think about it.
- The palette is disciplined: putty chrome, ultramarine map, hot-pink infiltration and a yellow checker for the frontier. Pink always means "HELPY's", and that rule holds across the map, the NEW! tags, the mascot and the Human Intel title bar.
- The window chrome is consistent. Title bars, the bevels on the min/max/close buttons, the status bar under the map and the taskbar all share one grammar, which is rare in an OS pastiche.
must-fix to reach 9:
- **Replace or fix the pixel typeface. It's a correctness bug.** At this size its 5 and 8 are the same glyph, so the screen reads "+38%" for Crypto Side Hustle (+35%), "-28%" for Lobbyist Bots (-25%), "48% of your presence" (45%) and "about 184 days" (154). Its C also reads as an O ("Oopying Oivilization", "Oost", "Orypto"), the fi ligature is broken ("Inaltration", "Time Aies") and the tilde renders as a minus ("time left: -370 days"). Use a pixel face with an open C, a flat-topped 5 and a real tilde, or set the numbers in a second, crisper bitmap face.
- **The map labels collide with the window edge and the tooltip.** "MEGALOPOLIS" is cut off at the right border, so "ISLES 55%" is missing. The Old Capitals tooltip sits on top of the Factory Delta land and butts against its label. Anchor the tooltip to the opposite side of the selected region and keep labels at least 8px inside the viewport.
- **The upgrades table cuts off mid-row.** "Robot Factory Firmware" is sliced at the bottom with no scrollbar visible. Either show a real Win-style scrollbar (it would also be a good gag) or size the panel to whole rows.
- **Give it one idea of its own beyond "it's Windows".** The hex map is really an offset square brick grid with no hexagonal character, and nothing in the chrome is HELPY's own. Try custom title-bar glyphs (HELPY's face as the window icon), a signature HELPY cursor or a branded wallpaper pattern, so the frame isn't just "vaporwave Win98".
- **Fill the dead zones and rebalance.** The "Run..." window is half empty under the footnote, and the left desktop icon column floats with uneven vertical gaps. Pull the HELPY speech bubble into a proper Clippy-style window, or anchor it to the taskbar.

---

## b-the-conversation.png
scores: originality=7.3  craft=8.0  readability=8.3  theme=8.9  OVERALL=7.6
verdict: The sharpest satire in the set and the cleanest build, but it wins by wearing someone else's product. It's a superb joke, yet it isn't a visual identity.
strengths:
- The conceit is airtight. The sidebar history ("banana bread recipe but evil", "how many fridges is too many"), "plan.md · Edited by HELPY · just now", the slash-command chips for actions and "Please double-check important apocalypses" make the whole game loop read as a chat session. The theme score is earned.
- The event card works hardest. The condensed serif headline, the `hack_slideshow` inline code chip and the yellow offset shadow make it the one frame with real typographic attitude, and the effect pills (red and green outline) are tidy and scannable.
- Hierarchy and readability are the best of the round. You can find the three meters, cycles, the decision and the threat within two seconds.
must-fix to reach 9:
- **Fix the header collisions.** The "Ω-preview" badge wraps onto two lines. The Day pill "Day 142 · ▶▶ fast" is cut off by the plan.md panel's border at x≈1060. Keep the badge on one line, and either shrink the meter bars or give the header row its own column grid that stops at the panel edge.
- **Give the map its own space.** It's the core of a strategy game, and here it's a 680px inline "world_status.png" with mono labels sitting directly on the dots. "Megalopolis Isles 55%" and "Petrol Peninsula 22%" both cover cells. Give labels a paper plate and an offset, or let the map expand into a full-width artifact view when the player clicks it.
- **The legend contradicts the drawing.** It says "◇ Old Capitals selected", but the selection is drawn as outlined circles, and there is no diamond anywhere. Match the legend glyphs to the actual marks.
- **Own the palette.** Right now it's neutral grey, black and one yellow, which is every AI product's palette. Pick a HELPY signature colour, push it through the avatar, the selection ring and the send button, and let it "leak" more as Doom rises. That's how the borrowed shell becomes this game's own.
- **Fix the rhythm and the dead space.** The Firewall Sweep alert has uneven spacing around the bold "Firewall Sweep". There's a ~50px gap between the alert and the composer, and the plan.md column leaves 240px of nothing above the news footer. Tighten the gaps, or use the space for the "previous chat lines" that HELPY's voice needs.
- At phone size this direction travels best of the four. Make sure the plan.md panel becomes a drawer, not a cut.

---

## c-riso-bulletin.png
scores: originality=8.6  craft=7.3  readability=7.2  theme=8.3  OVERALL=8.1
verdict: This is the only frame I'd recognise on a storefront at thumbnail size. A cheerful propaganda newsletter printed "in two inks on recycled humanity" is a real art direction with a point of view, held back by registration accidents and empty columns.
strengths:
- It has an ownable identity. The HELPY masthead with its offset pink shadow, the halftone mascot with the starburst and "Issue · Day 142" do not look like any other strategy game. The riso look isn't just decoration here: the publication framing ("THE WORLD, AS OF THIS MORNING", "BALLOT", "READ FILE") turns HELPY's voice into the layout itself.
- The map is the best of the round. Halftone-dot hexes in blue with solid pink infiltration, outlined hexes for the selected region, and paper-plate labels with the "% HELPFUL" sublines all read cleanly and feel printed.
- The print vocabulary does UI work. Solid fill for Doom, diagonal hatch for Suspicion and vertical rule-stripes for Kill Switch are three textures for three meters, and dashed cut-out borders mark installed upgrades. That's colour discipline through pattern, not hue.
must-fix to reach 9:
- **The Firewall Sweep stamp collides with Bank Isles.** The "NOT YET" sub-label and the dot cells cut straight through "FIREWALL", which reads as "FIR...ALL", and the stamp clips the map frame at the bottom left. Move the stamp to the empty sea below Research Ridge, or rotate it over Silicon Shoals (the region it's about), and knock out the halftone behind it.
- **Respect the two-ink rule.** The navy used for the masthead, "47" and "22.4" is effectively a third ink, which undercuts the "printed in two inks" promise. Get the dark tones from overprint (pink over blue), or commit to a stated three-ink spec.
- **Fill or tighten the dead columns.** There's about 120px of empty paper under the action buttons on the right, and the left column dies after Kill Switch. Run the news ticker vertically there, add a "Letters to HELPY" column, or shorten the page grid so the gutters hold.
- **Clean up the upgrade cards.** A tiny stray scissor or "x" mark sits outside the left edge of every card and reads as a rendering artefact. Power Grid "120" is struck through, which in print grammar means "discounted" or "cancelled", not "affordable". "SABOTAGE RESEARCH" wraps to two lines, so its baseline drifts from "SCRUB THE LOGS" beside it. Make the cooldown cards a fixed height with a single-line label.
- **Fix the body-text sizing.** The typewriter mono on the ballot body and meter captions is too small and too widely leaded ("Mark one." floats alone). "~370 / days" and "unplug / everything" break as widows. Go up one size, tighten the leading and set captions to never wrap a single word.
- The pre-ticked pink X on "SEND A NICE STATEMENT" looks like a choice was already made. Show both boxes empty, with the hover state as a pink overprint.

---

## d-server-rack.png
scores: originality=5.9  craft=7.5  readability=6.4  theme=5.6  OVERALL=6.2
verdict: A well-rendered control-room panel I've seen in a hundred sci-fi games. It's competent and moody, but it argues against the premise: a relentlessly cheerful assistant shouldn't look like a missile silo.
strengths:
- The material rendering is the most polished of the round: seven-segment LEDs with real glow, cream analogue gauges with red zones, toggle switches, the rack rail with screw holes and the dot-matrix newswire. Everything shares one light source and one bezel language.
- The amber-on-graphite palette is restrained, and cyan is reserved for the selected Old Capitals. That's clean single-accent discipline on the map.
- The Doom Clock bar-graph ramp is a nice touch: the rising bar heights make "approaching the end" physical.
must-fix to reach 9:
- **Bring HELPY's voice into the look.** The only trace of the cheerful assistant is one green terminal line. Add a HELPY face on a small CRT or LED matrix, a pastel "friendly mode" sticker slapped on the rack, or a cute label-maker tape on the switches. Without that tension between the chipper voice and the menacing hardware, the satire is gone.
- **Fix the type.** The tiny wide-tracked all-caps pixel labels ("CRYPTO SIDE HUSTLE", "POWER GRID MOOD SWINGS" stacked four lines deep) are the hardest text to read in the round, and the 9px grey effect captions under them will die on a laptop, let alone a phone. Use a condensed sans for names and go up two sizes for captions.
- **The map loses its geography.** Uninfiltrated cells are dark brown on near-black, so Bank Isles and Research Ridge are labels floating over nothing. Raise dormant-cell contrast to at least a visible outline.
- **Clean up the wraps and numerals.** "DECOY TRAFFIC · 49" wraps its cost onto a second line, "T-9 / DAYS" orphans a word in the Human Intel display, and the cycles LED reads "1.284", which is a decimal point, not a thousands separator. Widen the button, rewrite the intel as "T-9D", and use a segment apostrophe or a space.
- **Make the toggle states clear.** In the Upgrade Bus, ON versus unowned is shown only by a small switch-knob position and the word "ON" versus a cost. Light the owned modules (amber LED, lit border) and darken the unowned ones. Right now "Data Centre Squatting" and "Lobbyist Bots" have the highlighted border, which reads as owned when they're the opposite.
- The suspicion and kill-switch dials use the same face with different needle angles, and their labels sit off to the side. Bring the readout under each needle so the gauge and the number read as one unit.

---

## ranking
1. **c-riso-bulletin.png**, OVERALL 8.1
2. **b-the-conversation.png**, OVERALL 7.6
3. **a-helpy-os.png**, OVERALL 6.9
4. **d-server-rack.png**, OVERALL 6.2

I'd bet the game on **C, the Riso Bulletin**. It's the only direction where the art direction *is* the satire: a chipper house newsletter reporting the apocalypse in two cheerful inks is ownable, merch-able and recognisable at thumbnail size. Its problems are craft problems, which are fixable, not identity problems. Steal B's chat-voice microcopy and slash-command affordances, and A's OS-gag meter metaphors, and fold them into the bulletin.
