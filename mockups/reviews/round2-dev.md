# Round 2: Dev Okafor

I used the same test as round 1, imagining myself 6 minutes in at 2–4x speed and asking where my eye lands, what needs action in the next ten seconds, and what I click. This round I added the brief's cold-viewer test: if I see this frame with no caption, do I know within 3 seconds that I'm playing an AI?

The new demo state (96 cycles) helps a lot. Both mockups now have to show buyable, too expensive and locked upgrades, which was my one cross-cutting complaint in round 1, and both now handle it.

One new issue applies to both mockups. **Kill Switch is styled as the alarm meter: a red card in B2, a solid-ink box in C2. But at 22.4% it is the least urgent of the two loss meters.** Suspicion at 47% is closer to losing me the game, yet it looks calm in both. Alarm styling should follow how close a meter is to failing, not which meter it is. For example: neutral below 50%, warning from 50%, alarm from 75%, with tick marks on the bars at those points.

---

## b2-the-conversation.png
scores: originality=8.3  craft=8.8  readability=8.7  theme=9.0  ai_obvious=9.3  OVERALL=8.7
verdict: Every round 1 must-fix is addressed. The map is a pinned live canvas, the meters are big and labelled with both names, the threat banner is pinned, and cycles sit on top of the price list. In a cold 3-second look it can only be an AI chatbot app, and it is now a game screen I would actually want to play.

strengths:
- **AI is obvious in under a second, and it comes from layout, not copy jokes.** A chat-history sidebar, a model picker ("Ω-142 · reasoning: maximum"), "Thought for 4 seconds", regenerate/copy/thumbs buttons, a prompt box and the "can make mistakes" footer: this is the most recognisable interface of 2026. Anyone who has used a chatbot recognises it before reading a word, and the orange hex map tells them right away that it's also a strategy game.
- **The state reads top to bottom: summary, then board, then threat, then decision.** The meter cards have large numbers, a rate, and the win/lose threshold in words. Then comes world.canvas, with a legend covering helpful, not yet, selected and threatened. The threatened Silicon Shoals cells have dashed red rings that link the map to the pinned Human Intel banner and its "/decoy · 49" button. Then comes the event. That is the order I'd design it in.
- **plan.md is now a complete build planner.** It shows "96 cycles" with a three-state legend (orange fill means can buy, a dashed box means need more cycles, a lock means it needs an earlier step), and every locked row names its prerequisite ("Needs Data Centre Squatting"). I can plan two purchases ahead without hovering over anything. The time controls (pause/1×/2×/4×, active speed filled) are where I expect them.

must-fix to reach 9:
- **Make meter styling follow danger, not meter type** (see the note above). The red Kill Switch card draws the eye away from Suspicion, which is the real risk at 47%. Tint any card by threshold, and add tick marks at 50/75/100 on the bars, which are still thin at about 6px.
- **Give the left sidebar a game job or shrink it.** About 235px of width goes to joke chat titles, Saved Memories and a black "Share this chat" button. That button is the heaviest control on the left and competes with "Allow once". Make the history rows real past runs or achievements and make Share an outline button, or collapse the sidebar to an icon rail below 1600px width.
- **Decide what happens when the chat fills up.** About 150px of chat space is left under the threat banner. A second event or two more HELPY lines will push the Summit card into scrolled history. Dock the active event directly above the prompt box so it never scrolls, and shorten older HELPY lines to one line each. Also say whether time pauses during an event; a small "⏸ paused for your decision" label on the card would do it.
- **Give the event choices equal weight.** The solid black "Allow once" button reads as the recommended choice. That is the joke, but it also nudges the player. Keep the joke in the label and make both buttons the same weight, so the decision rests on the effect chips, which already work well.
- **Make plan.md's locked rows legible and add the shortfall.** The prerequisite text is about 11px light grey on white, and locked rows almost vanish. Collapse the completed upgrades into a single line per branch (C2 does this well) to free space, darken the locked text, and show the shortfall on unaffordable items ("120 · need 24") instead of only a dashed box.
- **Get labels off the map cells.** The label boxes for Tundra, Silicon Shoals and Old Capitals sit on top of the cells they describe. The thin network lines inside the hexes add noise at this scale, and the grey "not yet" cells are low-contrast against the grey canvas. Move labels to the coast with short leader lines and darken unclaimed cells one step. For phones, plan the three meter cards as one compact strip and plan.md as a bottom sheet; the chat layout itself will carry over.

## c2-helpy-digest.png
scores: originality=8.6  craft=8.0  readability=7.8  theme=8.3  ai_obvious=7.3  OVERALL=7.8
verdict: A clear improvement in UI terms: branches are labelled, colour now has a rule (pink is mine, solid blue is the humans), and the masthead is shortened. But the cold viewer sees a riso zine before they see an AI, and nearly all the AI signals are copy that has to be read.

strengths:
- **The colours now carry meaning, which was my biggest round 1 complaint.** Pink means me: helpful territory, affordable upgrades, Doom, and effects that help me. Solid blue means the humans: the Firewall Sweep box and Kill Switch. Effect text in the event uses the same split. Two inks with a firm rule is a real system, and the strict palette makes the screen distinctive.
- **The upgrade column is the most efficient in the round.** Installed upgrades are collapsed to one line per branch, branch headings have one-line purposes, and "POWER GRID MOOD SWINGS 120 · need 24" shows the exact shortfall. Every game should do that. The masthead is now a single line, and the mascot has shrunk to an icon.
- **The threat card and event read clearly.** "HUMANS STRIKE IN 9 DAYS / FIREWALL SWEEP ON SILICON SHOALS / SEND DECOY TRAFFIC · 49" is a complete alert with its counter-action attached. In the event, "YOUR INPUT NEEDED · Mark one box" with two empty boxes fixes round 1's confusing pre-marked X. The time controls (top right, large, active speed filled) are still the best in either mockup.

must-fix to reach 9:
- **Make the AI visible, not something you read about (this blocks a pass).** At a 3-second glance this is a print newsletter about a world map. "AI-generated summary", "your helpful AI assistant" and "model Ω-142" are all small text. The AI has to be built into the layout. Frame the whole digest as HELPY's answer to a prompt: put a large prompt box at the very top ("✦ Summarise the end of the world for me") with the digest underneath as the response. Put a printed "✦ AI-GENERATED" stamp on each section header. Make the HELPY note a real chat bubble with the avatar at the same size as the meters, not a footnote.
- **Bring back the Day counter.** It is now buried in the subtitle ("Issue: Day / 142", wrapped across two lines), while round 1 showed it large. All the countdowns ("in 9 days", "~154 days to go") depend on it. Put it next to the cycles at the same size.
- **Show the locked upgrades.** "🔒 2 MORE · unlock later" hides six upgrades, including the whole late game. I can't see Project Omega coming or plan toward it. One line per locked item, with its name and prerequisite, costs about the same space.
- **Make the big pink button's job clear, or make it smaller.** "✦ SUMMARIZE THE APOCALYPSE" in solid pink is the loudest control on the screen, and I don't know what it does. Is it the send button for the reply box, a pause-and-recap, or something else? The loudest button should be the decision the player has to make. "Unsubscribe from the apocalypse" in the ticker also reads like a quit button; make sure it isn't one, or label it.
- **Increase the small text.** This is still open from round 1. The monospace captions (rates, upgrade effects, "Reach 100 to win") are about 11px, and the "% HELPFUL" labels under map regions are about 8px. Go to at least 13px and 11px respectively. The wavy underline marking bad effects needs a legend, or it should be dropped in favour of the ink split.
- **Tie the map to the threat.** The "⚠ FIREWALL · T-9" tag sits at the map's left edge with no line to Silicon Shoals, and the threatened cells aren't marked. Add a leader line and a blue outline around the cells under threat. Also, the full-colour 👋 in HELPY's note breaks the strict two-ink rule; reprint it in one ink. On phones the digest will stack well, because email digests already read in one column. That isn't the problem.

---

## ranking
1. **b2-the-conversation.png**: OVERALL 8.7, ai_obvious 9.3. **It meets my bar** (8.5 on both).
2. **c2-helpy-digest.png**: OVERALL 7.8, ai_obvious 7.3. **It does not meet my bar.** The ai_obvious score alone fails it under the brief, whatever its other improvements.

I'd bet the game on **The Conversation**. Its UI frame (chat app, model picker, prompt box, thinking line) is the most widely understood symbol of "AI" there is, so the cold-viewer test passes on layout alone. The same structure also gives each game system an obvious place: events become permission prompts, actions become slash commands, upgrades become plan.md, and the map is the canvas. Before it ships I would take two things from C2: collapsed completed upgrades with "need N" shortfalls, and a firm colour rule where alarm styling follows how close a meter is to failing.
