# Round 5: Dev Okafor

Same test: 6 minutes in at 4x with the brief's cold look, plus the owner's player who won't read. I checked my six round 4 blockers against the at-rest frame, then went through the three depth states for anything the changes broke. The budget is now nearly full at 57 of 60 words, so **every fix below is word-neutral**: icons, digits, position and colour only.

My round 4 blockers, checked against B5:

| Round 4 blocker | Status in B5 |
|---|---|
| 1. Grid emphasis and effects at rest | **Landed.** The three tiles I can buy (⬡45 ⏻↓20, ⬡80 ⬡↑40, ⬡90 👁↓25) are solid pink with an offset shadow. Owned tiles are a calm tint with a check. The 120 tile shows a progress bar toward its price. My eye now lands on what I can buy, not on what I already own. Renaming the third column to DOOM helps too, because it says what that branch is for. |
| 2. Meter trends | **Landed, but too small.** ▲.38, ▲.06 and ▲.21 are there, but at about 10px. |
| 3. Threat chip | **Landed.** "9d · ⬡↓45 · [🦆 ⬡49]" has a raised Dodge button, a leader line to Silicon Shoals, and a firewall pin on the region itself. |
| 4. Anchored labels with % | **Landed.** Every region has a leader line and its percentage, and the selected Old Capitals has a bold border. |
| 5. Tooltips | **Landed.** All three depth states show one card with a pointer, placed beside its target. The Old Capitals card covers "FACTORY" from the Factory Delta label, not Old Capitals itself, which is acceptable. |
| 6. AI read | **Mostly.** The nervous face (sweat drop, wobbly mouth) reacting to Suspicion is exactly right: it's decodable, it carries state, and it justifies the mascot's size. The event docked to HELPY with a bubble tail and typing dots reads as a chat thread. The cycles token has its own shape, and the Network column icon is now a node graph, so the collision is gone. **But the "🌐 ?" user bubble does not read as a chat bubble** (see the first must-fix). |
| Cooldowns | **Landed.** "/sabotage ◔ 23d" uses a dashed outline and a radial sweep, clearly different from a price. |

---

## b5-helpy-glance.png (+ -depth-upgrade, -depth-map, -depth-action)
scores: originality=8.9  craft=8.7  readability=8.8  theme=8.8  ai_obvious=8.8  glance=9.1  depth=8.5  OVERALL=8.8
verdict: This is the first frame I would put on a storefront. At 4x I read the whole situation in about two seconds from shapes, colours and digits: a nervous HELPY, Suspicion in solid blue, a firewall threat 9 days out with its Dodge button, three solid tiles I can buy and a paused event. The two remaining flaws are small: the user's chat bubble reads as a map-help button, and the cycles token reads as a © sign at price size.

strengths:
- **The visual hierarchy is now right everywhere.** Solid fills mean "act on this": the three buyable tiles, the Dodge button, the Suspicion card and the send arrow. Tints and outlines mean "you own this or can't act on it yet". Hatched blue means humans or danger, and pink means me. A player who won't read still knows what to click.
- **Time and money have their own symbols.** The hex token appears on every price, the radial sweep marks every cooldown, and ▲ shows every trend. The eye and power symbols run unchanged through the meters, event chips, tile chips and tooltips. One vocabulary, learned once, decodes everything. That's how a 4x game gets to "looks easy, packs a lot".
- **The depth is real and one hover away.** The upgrade card shows "LOBBYIST BOTS · 👁↓25% ⏻↓15% · ⬡90 · you have 96" plus flavour. The region card shows "38% · 👁↓35% perk · 🛡 Security 50" plus flavour. The action card shows "⏻↓8 👁↑4 · ◔ Ready in 23 days" plus flavour. Add 18 tiles, three branches, a threat, an event, a legend and a news line, and the screen promises a lot of game while saying very little.

must-fix to reach 9:
- **Move the "🌐 ?" user bubble into the thread.** It sits under the map legend at the right edge of the map, solid blue, with no clear tail, and is about 800px from HELPY's reply. I read it as a "map help" button on first look, so it isn't doing its AI-read job. Right-align it directly above "HALFWAY TO THE END!", give it a tail pointing right (toward the player), and stack user bubble, HELPY reply, then event as one column. That turns the thread into an unmistakable chat exchange with no extra words. It is also the cheapest way to raise ai_obvious from 8.8 toward 9.5.
- **Change the cycles token so it doesn't read as ©.** At 96 in the top bar it's clearly a hex. At tile and chip size ("⬡45", "⬡49") the C inside a small hexagon reads as a copyright sign. Drop the letter: use a solid hex with a single notch or a chip pin, and make sure it still reads at 12px.
- **Make the trend markers readable at speed.** At about 10px, "▲.06" is a smudge at 4x. Increase it to about 14px, add a leading zero or use "▲0.06", and colour the arrow by who it helps: pink for Doom rising, hatched blue for Suspicion and Kill Switch rising. Then "rising and bad for me" reads before the number does.
- **Use one countdown symbol everywhere.** The threat shows "9d" as plain digits, while cooldowns use the radial sweep. Use the sweep on the threat chip too, and keep a small firewall glyph on the chip so it can be told apart once there are two threats on the map.
- **Move the export button away from 4×.** The upload icon sits about 25px to the right of the 4× button. At 4x, a player reaching for the fastest speed will sometimes hit export instead. Move it to the far left next to the HELPY logo, or into a menu.
- **Finish the tile chips.** Lobbyist Bots shows 👁↓25 at rest but hides ⏻↓15, and Data Centre shows ⬡↑40 but hides spread. Either show both chips (they fit at this tile width) or add a small "+1" dot so the player knows there's more. Also, the small Doom marker in the corner of the 120/190/320 tiles is unexplained and repeats the column header. Remove it or use it consistently.

**Budget note:** at 57/60, the next feature that needs a label will break the budget. Plan now which words can become icons. The three legend words (MINE / SPREADING / THREAT) are the obvious candidates, since the swatches already explain themselves after one look.

---

## ranking
1. **b5-helpy-glance.png**: OVERALL 8.8, ai_obvious 8.8, glance 9.1, depth 8.5, 57 words. **It passes the full bar from my seat** (OVERALL ≥ 8.5, ai_obvious ≥ 8.5, glance ≥ 8.5, depth ≥ 8, words ≤ 60), with clear margins on every criterion this time.

I'd bet the game on **B5**. It's the B-line chatbot structure with the riso identity, and it now reads like a game, not like a document. Every decision at 4x (buy, dodge, allow or deny, pause) is a coloured, clickable shape with its cost and effect on it. The remaining must-fixes are refinements, and none of them needs a word.
