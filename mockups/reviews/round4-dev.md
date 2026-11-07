# Round 4: Dev Okafor

The owner's change of direction is right, and B4 shows why. B3 played well, but you had to read it. B4 plays nearly as well, and you mostly look at it. I asked three questions from my seat:

1. Can the icons be decoded without hovering?
2. Does the state read at 4x?
3. Did removing words cost any information the player needs to make a decision?

The answers are: mostly yes, yes, and a little. The losses are specific and can be fixed without adding words back.

My round 3 must-fixes, checked against B4:

| Round 3 must-fix | Status in B4 |
|---|---|
| Solid blue only for danger | **Landed.** Only the Suspicion card and the threat chip are solid blue. |
| Event: equal-weight buttons, show pause | **Landed.** HACK IT and BE NICE are identical outlines, and there's a "⏸ PAUSED" badge on the card. |
| Move Share away from the speed controls | **Landed.** It's gone. |
| Fewer frames, no tiny monospace text | **Landed.** The small text is simply gone. |
| Cooldown chip | **Landed.** "23d" is greyed with no hatch running through it. |
| Tick marks on meter bars | **Landed.** All three bars have them. |

---

## b4-helpy-glance.png (+ b4-helpy-glance-depth.png)
scores: originality=8.8  craft=8.5  readability=8.6  theme=8.6  ai_obvious=8.6  glance=9.0  depth=8.2  OVERALL=8.6
verdict: It looks easy and plays clearly at 4x. The best idea is a single icon vocabulary: the eye means Suspicion and the power symbol means Kill Switch, in the meters, the event chips and the tooltips alike. But the upgrade grid makes the owned tiles loudest and hides the effects of the tiles I can buy, and the AI read now depends on just two elements.

strengths:
- **One icon vocabulary across the whole screen, which is what makes it readable without words.** The eye and the power symbol in the top meters are the same glyphs as the event chips ("👁↑9 ⏻↓8%"), the Stealth column header and the tooltip chips. Colour has one rule too: pink means good for me, hatched blue means good for the humans. I can make the Summit decision in about a second without reading anything. That's the most important interaction in the game, and it is now the best part of the screen.
- **At 4x the state reads in one sweep along the top bar, then down.** The bar shows three icons with large numbers and ticked bars, cycles at "96 +18.6", DAY 142, and pause/1×/2×/4× with the active speed filled. Then attention goes, in order, to the solid-blue Suspicion card (the real risk), the solid-blue "🧱 9d | ↻49" chip on Silicon Shoals with its hatched cells, and the PAUSED event. Everything that needs me right now is coloured, and everything else is calm.
- **The upgrade grid shows real depth, and the tooltips deliver it.** The grid is 18 tiles: three branch columns, owned tiles ticked, buyable tiles with a cost, 120 dashed as too expensive, and locked tiles greyed with a lock. Column order implies the prerequisite chain without needing a line of text. The depth shot shows that names, effects as icon chips, "Cost 90 · you have 96" and the flavour line ("very convincing muffins") are one hover away. This is the "looks easy, packs a lot" the owner asked for.

must-fix to reach 9:
- **Flip the grid's emphasis, and show effects on the tiles I can buy.** Nine owned tiles in solid pink are the loudest thing in the right panel, yet they need nothing from me. The three tiles I can actually buy (45/80/90) are pale outlines. Make the owned tiles a pale fill with a check and make the buyable tiles solid. Then put the effect chips on the buyable and too-expensive tiles at rest ("👁↓25 ⏻↓15" on the 90 tile). With 96 cycles I can buy exactly one of these three, and right now that choice means hovering three times at 4x. Chips are icons and digits, so the word budget holds (check how `wordcount.js` counts digits).
- **Restore meter trends with no words.** The rates ("+0.06/day") and "~154 days to go" are gone, so a still frame can't tell me whether Suspicion is rising. Add a ▲/▼ glyph with a small rate ("▲0.06") next to each large number. For a real-time game the direction of a meter is information needed for decisions, not decoration.
- **Make the threat chip say how bad the threat is, and make the counter clickable.** "🧱 9d | ↻49" tells me when and what it costs to stop, but not what I lose (45% of Silicon Shoals). Without that I can't judge whether 49 of my 96 cycles is worth spending. Add a "⬡↓45%" segment. Style the "↻49" half as a button in the action colour (pink fill, like the send arrow), because a solid-blue box reads as information, not as a control.
- **Anchor the map labels and restore region percentages.** Tundra, Grain Expanse and Old Capitals float in the ocean between the two continents with no leader lines. "OLD CAPITALS" sits closer to the western coast than to its own ringed cells. The percentages became thin underline bars, too small to compare 22% with 38%. Add short leader lines and put the digits back ("38%"). Nine numbers would take the count from about 42 to about 51, still under budget. The pink dashed jump lines should pass behind the labels, not through them.
- **Never let a tooltip cover its own target.** In the depth shot the Old Capitals card sits on top of the Old Capitals cells, and three open cards hide half the eastern continent. Place tooltips beside the thing they describe and allow only one at a time. Plan for tap-to-pin on phones, because this layout otherwise moves well to small screens (meter strip on top, grid as a bottom sheet).
- **Strengthen the AI read without words, and fix one icon collision.** With the sidebar, model picker and thinking line gone, the chatbot read now rests on two things: the speech-bubble mascot with typing dots, and the prompt bar with "/" commands and a send arrow. That's enough, but only just. Show one exchange as bubbles: a right-aligned player bubble holding the last command icon, with HELPY's reply as a bubble from the mascot. Tie the mascot's expression to Suspicion, so its 170px block also carries state. Also, the cycles icon in the top bar and the NETWORK column icon look like the same chip glyph. Give one of them a different shape.

---

## ranking
1. **b4-helpy-glance.png**: OVERALL 8.6, ai_obvious 8.6, glance 9.0, depth 8.2, 42 words. **It passes the full bar from my seat** (OVERALL ≥ 8.5, ai_obvious ≥ 8.5, glance ≥ 8.5, depth ≥ 8, words ≤ 60).

The margin is thin on ai_obvious (0.1) and on depth, so I'd treat the first, second and sixth must-fixes as ship blockers rather than polish. I'd bet the game on **B4**. Its shared icon-and-colour system turns B3's paragraphs into decisions you can make in about a second, which is what a 4x real-time game needs. Everything it lost (upgrade effects, trends, threat size, region percentages) comes back as icons and digits, not sentences.
