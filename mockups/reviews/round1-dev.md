# Round 1: Dev Okafor

How I tested: for each frame I imagined being 6 minutes into a session at 4x speed, and asked three things. Where does my eye land first? What do I need to act on in the next ten seconds? What do I click to do it? I don't care how pretty a frame is if it hides that decision.

One problem shows up in all four. **Satellite Uplink (140) is greyed out while the bank holds 1,284 cycles.** Nothing on screen says whether it is locked behind a prerequisite or unaffordable for some other reason. Every direction needs separate, labelled states for owned, buyable, too expensive and locked. Without that, players will think the button is broken.

---

## a-helpy-os.png
scores: originality=6.8  craft=7.6  readability=6.9  theme=7.8  OVERALL=7.1
verdict: The most clickable screen of the four, and the one that tells me least about how I'm doing, because the three meters that decide the game are scattered across three windows in three different chart types.

strengths:
- The affordances can't be mistaken. Bevelled buttons, checkboxes and window controls all look clickable, and nobody needs a tutorial to work out that "Decoy Traffic (49)" is a button.
- The metaphors carry real information. Doom as a file copy and Kill Switch as an incoming download tell me which direction is good before I read a number, and Kill Switch's red segmented bar reads as a threat.
- The upgrade table puts name, effect and cost in columns I can scan, and the pink "NEW!" rows flag the affordable buys.

must-fix to reach 9:
- Make the three meters comparable. Right now Doom is a progress bar, Suspicion is a line chart with its number in small green text, and Kill Switch is a second bar in a third window. Put all three in one stacked strip with large numbers, the same bar style and a marked threshold at 100. The Suspicion chart could shrink to a sparkline under its bar.
- Dock the region "Properties" tooltip. As drawn it covers most of the eastern continent, including Factory Delta, Research Ridge and part of Petrol Peninsula. Show region detail in the map window's status bar or in a side pane, not as a popup over the map.
- Move the speed controls out of the bottom-right corner of the taskbar, where they are about 12px glyphs. At 4x, pause is the most important button in the game. Give it a real toolbar button on the WORLD.MAP window.
- Use the desktop-icon column for something. About 90px of screen width goes to jokes (cats.mp4, Recycle Humanity). Keep one or two and give the rest of that column to the meters.
- Show where events and the news ticker live. Neither is in this frame, so I can't judge the pop-up dilemma, which is the most important interaction in the game. A modal dialog is the obvious fit here; draw it. The HELPY speech bubble also sits over the bottom of the Human Intel window.
- Fix the upgrade table and the countdown text. The table is cut off at Robot Factory Firmware, Power Grid is hidden, and the branch tree on the left shows only "All upgrades". Show the branch next to each row. Also, "Estimated time left: -370 days" on Kill Switch looks like a bug rather than a joke.

## b-the-conversation.png
scores: originality=8.2  craft=8.2  readability=7.5  theme=8.9  OVERALL=7.9
verdict: The sharpest satire and the best decision UI in the round. The event card and the threat banner are exactly right, but the chat-feed structure puts the map in the scrolling feed, where real-time state will scroll out of view.

strengths:
- The AI Safety Summit card is the best event presentation of the four. It has two large choices, each with colour-coded effect chips (red is bad for me, green is good), so I can decide in about two seconds. Styling it as an "Allow once" permission prompt is a joke that also works as an interface.
- plan.md is a very good upgrade panel. It is grouped by branch, owned items are struck through as "done", and affordable costs are highlighted in yellow. It is a checklist, which is how players already think about a build order.
- Actions as slash-command chips in the input box are clickable, and a struck-through "/sabotage 23d" reads as on cooldown at a glance. The Firewall Sweep banner puts "/decoy · 49" right next to the threat. This direction will also translate to a phone best, because people already know a chat layout there.

must-fix to reach 9:
- Pin the map. world_status.png is a message attachment, so as soon as HELPY says three more things it scrolls off and I lose sight of the board in a real-time game. Make it a sticky live card at the top of the chat column, or a "canvas" tab in the right pane. It also needs to be bigger: at this size the labels sit on top of the dots (Megalopolis Isles, Grain Expanse).
- Make the meters bigger. The three meters in the top bar are 4px lines with 11px labels, and they decide the game. Make them at least three times taller, with thresholds marked, and show the game term next to the joke: "World used (Doom)", "Safety review (Kill Switch)". Renaming them makes reading the state harder.
- Fix the top-right time control. "Day 142 · ▶▶ fast" is clipped by the plan.md panel, and I can't see a pause control anywhere. Add pause and the speed steps, unclipped.
- Pin the Firewall Sweep banner above the feed. Threats with a countdown are state, not messages, and in the feed this one will scroll away like the map.
- Move cycles next to the costs. They sit in the bottom-left "Doom Pro" card, the opposite corner from every price. Put the balance at the top of plan.md.
- Define what colour means on costs and map cells. Power Grid's red "120" could mean "adds Suspicion" or "can't afford". The yellow-ringed map cells (frontier?) aren't in the legend.

## c-riso-bulletin.png
scores: originality=8.7  craft=7.4  readability=7.0  theme=8.0  OVERALL=7.6
verdict: The most distinctive screen here, and it has the best meter readout (big numbers, summary before detail). But with only two inks there is no colour left for danger, and the threat stamp collides with the map labels it is supposed to call out.

strengths:
- The meter column is how a game summary should look. Each meter has a large number, a bar, and the rate and consequence underneath ("+0.06/day · at 100 they unplug everything"). Hatching Suspicion is a colour-blind-friendly way to tell it apart.
- The time controls are large, have four clear steps and sit next to the ticker, and Day and cycles are large in the top-right corner. Reading the time and money takes one glance.
- The rotated WARNING stamp grabs attention the way a countermeasure alert should, and "SEND DECOY · 49" is on the stamp itself.

must-fix to reach 9:
- Fix the stamp. The "BANK ISLES / NOT YET" label prints over the word FIREWALL, and the stamp sits next to Bank Isles rather than Silicon Shoals, so it points at the wrong region. Anchor it with a leader line to Silicon Shoals and keep labels off it.
- Give danger its own treatment. Pink currently means my infiltration, affordable upgrades and a human threat, three different things. Use a solid fill or bold outline in the second ink only for threats, and let Kill Switch read differently from Doom (Doom should feel good, Kill Switch should feel bad).
- Increase the size of the monospace text. The body copy (upgrade effects, region text, meter captions, the "% HELPFUL" labels under map regions) is about 10–11px and lighter than the rest. Go to at least 13px and drop the light pink for map sub-labels.
- Make the event choices read as choices. The red X in the "Send a nice statement" box could mean "selected" or "rejected", and there's no confirm button. Use two large ballot buttons with the effects inside them.
- Take space back from the masthead and mascot. Together they use about 25% of the screen for branding and a speech bubble. Shrink the masthead to a single line and use the left column for intel and actions.
- Label the branches. The upgrade coupons don't say which are Network, Stealth or Automation, and the Upgrades/Actions tabs duplicate the action buttons drawn below. Group the coupons under branch headings and drop the redundant tab.

## d-server-rack.png
scores: originality=6.9  craft=8.4  readability=8.0  theme=7.0  OVERALL=7.6
verdict: The easiest board to read at a glance and the most consistent colour system (amber means mine, red means threat, cyan means selected), but it's a familiar sci-fi console that loses the chipper satire, and it leaves out the event entirely.

strengths:
- The map reads best of the four. Amber LEDs on black make infiltration obvious instantly, the cyan rings mark the selection without hiding anything, and the legend in the header explains it all.
- The threat-and-response layout is the best here. A red siren plus a red LED readout ("FIREWALL SWEEP · T-9 DAYS · WIPES 45%") sits right next to a yellow hazard-striped DECOY button. The time controls are large, labelled, and the active speed is lit.
- The arcade override buttons are unmistakably clickable, the greyed button with "COOLDOWN 23D" is clear, and the red zone on each gauge tells me where the meter fails.

must-fix to reach 9:
- Show where events appear. The AI Safety Summit dilemma isn't in this frame, and there's no panel where it obviously could go. Design it, for example as a hatch that opens over the map with two lit buttons and their effects.
- Make the gauge numbers primary. Needles are slow to read exactly, and the Suspicion and Kill Switch dials look nearly identical. Make the numbers twice their current size, or use the same LED bar graph as Doom so all three can be compared.
- Make uninfiltrated land visible. Bank Isles and Research Ridge at 0% are dark brown dots on black, so the region shapes disappear. Raise dormant LEDs to a visible dim value, since I need to see targets as well as holdings.
- Make the upgrade captions readable. "Cycles +40%, spread +30%" on the switch cards is about 9px grey on charcoal. Also, flipping a toggle suggests I can flip it back. Use a keyed or latching switch for a permanent buy, and put branch headings over the columns instead of in a faint header line.
- Fix the newswire and HELPY's line. The red dot-matrix ticker is the hardest text in the round to read, and a single green terminal line is the only place HELPY's voice comes through. Put cheerful assistant copy into the hardware labels and region readouts so the screen is funny, not just competent.
- Add a region detail readout. "SELECTED: OLD CAPITALS 38%" in the header is all I get, with no perk or security value. Add a small LCD panel under the map.

---

## ranking
1. **b-the-conversation.png** (7.9): the best decision UI and the sharpest joke, once the map and meters are pinned.
2. **d-server-rack.png** (7.6): the best at-a-glance board and colour system, but it lacks satire and has no event surface.
3. **c-riso-bulletin.png** (7.6): the most original look and the best meter column, but the colour meanings collide and the text is too small.
4. **a-helpy-os.png** (7.1): the clearest affordances, but its state is split across windows and hidden under popups.

I'd bet the game on **The Conversation**. The parody does real work: event cards become permission prompts, actions become slash commands and upgrades become a plan checklist, so the joke and the controls are the same thing. It's also the only direction that will move to a phone without a rebuild. Its one structural flaw, state scrolling away in the feed, can be fixed by pinning the map and meters. I'd borrow D's amber/red/cyan colour discipline and C's big-number meter readouts to get it there.
