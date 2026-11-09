# Round 5 review: Juno Park

*How I judged this: the same rules as round 4. The resting screen has a 60-word budget, glance is scored as a player who will not read, depth is scored from the tooltip shots, and ai_obvious is scored with words ignored. My own question is unchanged: does the satire land, and would a stranger screenshot this to make someone laugh? At 57 of 60 words there is no headroom left, so every fix I ask for below either uses no words or swaps one word for another.*

---

## b5-helpy-glance.png (with -depth-upgrade, -depth-map, -depth-action)
scores: originality=8.7  craft=8.8  readability=8.8  theme=8.7  ai_obvious=8.8  glance=8.7  depth=8.6  OVERALL=8.7
verdict: The jokes are back without the article. A nervous, sweating chat-bubble AI being asked to "ALLOW ONCE" at an AI Safety Summit is a one-glance screenshot, and the frame still reads as easy. It passes my bar, with some smaller fixes left that cost no extra words.

**Round 4 must-fixes:**
- **Spare words on jokes that read as AI:** mostly fixed. "ALLOW ONCE / DENY", "Ask HELPY to end the world…" and "HALFWAY TO THE END!" are all in, and each one does double duty as a joke and an AI cue. "HELPY can make mistakes." was traded for the news line, which is a fair trade given the budget, though the disclaimer is the stronger AI signal.
- **Chat thread:** partly fixed. HELPY's reply balloon, the event docked as the next message with its tail aimed at the face, and the typing dots now read as a thread. The icon-only user bubble ("🌐 ?") does not: it sits under the map legend at the far right, nowhere near the thread, and reads as a map help button.
- **Share button and expressive face:** fixed. The share icon sits top right. The wavy frown and sweat drop read "nervous" instantly, and a nervous face next to a world that is going pink is exactly the chipper-over-apocalypse contrast this game needs. This is now the frame I would post.
- **Dead space:** fixed. The map is larger and fills the canvas, and the thread occupies the old empty ocean.
- **Goal glyphs:** partly fixed. They are there (a flag, an unplug glyph, a skull), but at about 12 px they are the smallest marks on screen, and the Suspicion glyph reads as a running figure, not a pulled plug.
- **Threat marker:** fixed. "9d" is now pinned to Silicon Shoals by a leader line and a firewall pin on the region, the duck is bigger and has its own cost, and the threatened hatch is loud.
- **Tooltips in HELPY's voice:** partly fixed. "/SABOTAGE: 'I will just be in the lab. Helping.'" is the best tooltip line in the project. The Lobbyist Bots muffins line and the Old Capitals fax-machines line still read as a narrator, not as HELPY.

strengths:
- The satire now lives in shapes and a handful of words: a cute bubble face sweating at 47 Suspicion, a permission dialog at an AI Safety Summit, and an "Ask HELPY to end the world…" prompt bar. Each one works as a caption. The surface stays sunny pink and the content stays doom, so the tone holds all the way across.
- Glance is excellent. Each meter has its rate (▲.38, ▲.06, ▲.21). Owned upgrade tiles are now pale and buyable ones saturated, which is the right priority. Affordable tiles show their effect chips at rest (©↑40, eye ↓25, power ↓20), the unaffordable 120 tile has a progress bar, and locked tiles show their prices. I can plan my next three purchases without reading anything.
- The depth is real and close at hand. The three depth shots show rules, costs, "you have 96" and a flavour line in every tooltip, and the cooldown pie on /sabotage is a nice touch that works without words. Eighteen upgrades, four actions, a threat, an event and nine regions are all visible at rest.

must-fix to reach 9 (all word-neutral):
- **Move the user bubble into the thread.** Put the "🌐 ?" bubble right-aligned directly above "HALFWAY TO THE END!", give it a chat tail, and remove it from the legend corner. Then the frame shows a real you-ask, HELPY-answers exchange with no words added, which is the strongest ai_obvious cue still missing.
- **Give the permission prompt its object.** "ALLOW ONCE" what? Round 2's `hack_slideshow()` gave the joke its punchline. Swap the "PAUSED" word for the pause glyph alone and spend that word on a `hack_slideshow()` tool chip in the card header (one word for one word). Also replace the flag icon on the card with a shield or lock: the flag is Doom's goal glyph, so on the event it suggests a Doom event and blurs both meanings.
- **Make the goal glyphs readable.** Enlarge the flag, unplug and skull glyphs at the end of each meter to about 20 px, and redraw the Suspicion glyph as an obvious plug pulled from its socket. A non-reader has to see at once which bar to push up and which two to keep down.
- **Fix the shield in the threat box.** In "9d | ⛨45 | duck 49" a shield reads as protection, not as losing 45% of your presence. Use the "mine" hex swatch with a ↓ (hex ↓45) so it matches the effect chips used everywhere else.
- **Put the slash commands back on the action chips.** The chips in the prompt bar lost their "/" prefix, so they now look like ordinary game buttons inside a text field. Put a "/" glyph before each icon, if the word-count script does not count a lone slash, to keep the chat-command read.
- **Write every tooltip in HELPY's first person.** Use the sabotage line as the template. For example, Lobbyist Bots could say "I baked them muffins. Very convincing muffins." and Old Capitals could say "So many fax machines. I love them all." The flavour should always sound like HELPY, not like a narrator.

---

## ranking
1. **b5-helpy-glance.png**: OVERALL 8.7, ai_obvious 8.8, glance 8.7, depth 8.6, 57 words. **It passes my full bar.** Every score clears its threshold and the word count is within budget.

I would bet the game on B5. It finally looks easy and still lands the jokes, because the comedy now comes from a nervous chat-bubble AI asking permission to end the world rather than from paragraphs of copy. Make the six word-neutral fixes above, and treat 57/60 as a hard ceiling: from now on, any new joke has to replace an existing word.
