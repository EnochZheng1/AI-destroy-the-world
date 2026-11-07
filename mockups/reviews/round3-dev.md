# Round 3: Dev Okafor

Same test as before: 6 minutes in at 2–4x speed, plus the brief's cold 3-second look. I compared B3 directly with B2 (my round 2 pick) and with C2, which supplied the riso identity. I checked each of my round 2 must-fixes, and then looked for anything the merge broke.

Status of my round 2 must-fixes:

| Round 2 must-fix | Status in B3 |
|---|---|
| Meter styling follows danger | **Landed.** Suspicion is a solid card with a "WATCH IT" badge and the word "rising". Kill Switch is a calm outline. The ticks at 50/75 are still missing. |
| Shrink the sidebar, demote Share | **Partly.** Share is now a link, but it sits directly under the speed controls. The sidebar is about the same width, and it gained a solid "HELPY DOOM PRO" block. |
| Dock the event; show pause | **Partly.** The event is pinned above the composer. Nothing says whether time is paused. |
| Give the event choices equal weight | **Not done.** "ALLOW ONCE" is still a solid fill and "DENY" an outline. |
| plan.md: collapse completed, add "need N", make locked rows legible | **Landed.** Completed items are collapsed to one line per branch with a check, Power Grid shows "120 · need 24", and every locked row names its prerequisite. The locked text is still small. |
| Get labels off map cells | **Mostly.** Labels sit on the coast with leader lines, and the threatened cells have a hatched "under threat" fill that matches the banner. The Tundra and Silicon Shoals labels still cover their top cells. |

---

## b3-helpy-chat-riso.png
scores: originality=8.8  craft=8.4  readability=8.2  theme=9.1  ai_obvious=8.8  OVERALL=8.5
verdict: The strongest identity of the three rounds, a chatbot printed in two inks, and it keeps B2's summary-then-board-then-threat-then-decision flow. But the merge made solid blue mean six different things and flattened the hierarchy into a grid of equally loud boxes, so it reads slower than B2 did.

strengths:
- **The AI read survives the restyle.** The chat-history sidebar, the "MODEL Ω-142 · Reasoning: maximum" picker, the user bubble "ok what's next", "Thought for 4 seconds", Regenerate/Good response/Bad response, the "Ask HELPY to end the world…" composer and the speech-bubble mascot all still say "chatbot" before you read a word. The riso texture costs a little speed compared with B2's real-app look, but this no longer looks like an AI-themed copy of a real product. It looks like a game that belongs to HELPY.
- **The state reads at a glance.** DAY 142 is large again, next to pause/1×/2×/4×. Three meter cards with large numbers come next, and Suspicion is correctly the loudest because it is the one that can kill me soonest. Then the map, with a four-item legend, hatched "under threat" Silicon Shoals cells and a "FIREWALL IN 9 DAYS" sub-label. Then a full-width Firewall banner with "SEND DECOY · 49". Showing region detail as a tool call (`inspect(region="Old Capitals") → …`) is both readable and on-theme.
- **plan.md is now the best upgrade panel in the series.** "96 cycles to spend" is in large type, there's one collapsed line of completed upgrades per branch, the affordable cards have a pink outline, "120 · need 24" shows the exact shortfall, and "LOCKED: SEAT ON THE AI ETHICS BOARD · Needs Deepfake Press Office + Lobbyist Bots · +1 more after" lets me plan two purchases ahead.

must-fix to reach 9:
- **Limit solid blue to danger.** C2's rule was pink for me and solid blue for the humans. B3 uses solid blue for the Suspicion card, the Firewall banner, the "ALLOW ONCE" button, the user's chat bubble, the selected 2× speed, the "HELPY DOOM PRO" ad block and the whole news panel. A joke advert and a news ticker now carry the same weight as an incoming countermeasure, and my eye is pulled to the bottom-left and bottom-right corners for nothing. Keep solid blue for Suspicion at watch level and above and for active human intel. Switch the Doom Pro block, the news panel, the user bubble and the speed selection to outline, hatch or pink.
- **Give the event buttons equal weight and show the pause.** This is still open from round 2. "ALLOW ONCE" in solid blue reads as the recommended answer, and under the rule above it now also reads as the humans' option. Make both choices outline buttons of the same size and let the effect chips decide. Add "⏸ paused for your decision" to the "HELPY NEEDS YOUR PERMISSION" line, or state that time keeps running.
- **Move "SHARE THIS CHAT" away from the speed controls.** It sits about 8px below pause/1×/2×/4×. At 4x, a player reaching for pause in a hurry will hit Share instead. Put it at the bottom of the sidebar or in the chat's "…" menu.
- **Restore hierarchy and increase the small text.** Nearly every region now has a double-rule frame and a condensed all-caps header, so the meters, map, banner, event and composer all compete at the same volume. B2 separated them with white space. Remove the frames from the chat feed and composer, and keep heavy frames for the meters and the event. Also enlarge the roughly 10px monospace text: meter subtitles ("World used · win at 100"), the collapsed completed-upgrade lines, the locked prerequisites and the "% HELPFUL" sub-labels. Aim for 12–13px.
- **Fix the cooldown chip.** In "/sabotage limit · 23d" the hatch overlay runs through the text and makes it half unreadable. Show cooldown as plain light text with the days in bold and no overlay. "rate-limited" in B2 was the better joke and the clearer label.
- **Make the alarm styling depend on the value.** Add tick marks at 50/75/100 on all three meter bars, and make the "WATCH IT" styling move to whichever meter crosses 50, so Kill Switch can escalate too. The still frame can't show that it's dynamic, so the spec has to say so. A smaller point: cut the chat history to four or five titles shown in full. Truncated titles like "Banana bread recipe bu…" lose the joke and add clutter. For phones, the layout still collapses cleanly: meters as a strip, plan.md as a bottom sheet, event above the composer.

---

## ranking
1. **b3-helpy-chat-riso.png**: OVERALL 8.5, ai_obvious 8.8. **It meets my bar (8.5/8.5), narrowly.**

On the bar: yes, it meets it, but only just, and readability went backwards compared with B2 (8.2 against 8.7). The merge added identity, and B3 is the first direction that looks like its own game rather than a well-made parody of a real app. It also gave back some of the glance-readability that made B2 my pick. Every regression comes from styling, not structure (solid blue overuse, frame clutter, small monospace text, the Share link, the cooldown chip). None of them needs a redesign.

I'd bet the game on **B3**, as long as the solid-blue rule is enforced. That one change fixes most of the loss: a single danger ink means the eye goes to the threat first again, and the screen reads as quickly as B2 with an identity B2 never had.
