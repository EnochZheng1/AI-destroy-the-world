# Round 4 review: Juno Park

*How I judged this: the owner's new rules come first. The resting screen has a 60-word budget, glance is scored as a player who will not read, depth is scored from the tooltip shot, and ai_obvious is scored with every word ignored. My own lens has not changed: is the presentation itself the joke, does the chipper surface sit over an apocalyptic core, and would a stranger screenshot it? The question for this round is whether the satire survives once the words are removed.*

---

## b4-helpy-glance.png (with b4-helpy-glance-depth.png)
scores: originality=8.6  craft=8.6  readability=8.9  theme=7.9  ai_obvious=8.6  glance=8.7  depth=8.3  OVERALL=8.3
verdict: The edit worked as an edit (it is calm, readable and clearly a game with a lot inside), but it cut the jokes along with the clutter, and the sharpest satire, the agent permission prompt, did not survive. What remains is a handsome, cheerful strategy HUD that I would not screenshot to make anyone laugh.

**Against the new bar:**
- **Word count:** passes. It shows 42 words at rest against B3's 413, which is a huge improvement. It also means 18 words of budget are unspent, and that matters for the first must-fix below.
- **Glance:** passes. The meters are icon, number and bar; upgrades are an 18-tile icon grid with four distinct states (filled with a ✓ for owned, a pink outline with a price for affordable, a dashed outline for "need more", grey with a padlock for locked). Event choices show their effects as icon and arrow chips (eye ↑9, power ↓8%), actions are icon plus cost, and the threat marker reads "9d". I understood the state of play without reading a sentence.
- **Depth:** passes. Eighteen upgrades across three branches, four actions, a paused event, a timed threat and nine regions are all visibly there, and the tooltips (Suspicion, Old Capitals, Lobbyist Bots) carry rules, costs and flavour one hover away.
- **ai_obvious with words ignored:** passes narrowly. The speech-bubble face with typing dots, a prompt-bar shape with slash-prefixed chips and a send arrow, a CPU-chip currency icon, a robot icon for Automation and network-node lines across the map add up to "a chatbot is taking over the map". But every cue for a chat *conversation* has gone: no message thread, no user turn, no history. The bubble face could almost pass for a messaging-app mascot.

**Jokes lost in the cut:**
- The sidebar chat history ("banana bread recipe but evil" and the rest) is gone.
- **"Allow once / Deny" became "HACK IT / BE NICE".** That trades the project's best AI-specific gag for a generic game choice, and it costs no more words.
- The disclaimer footer, the thinking line, "Regenerate world", Saved Memories, "Share this chat", "% helpful" and the news ticker and Overheard lines are all gone.
- "HALFWAY THERE!" without "…to the end of the world" is just encouragement. Now the punchline only works if you happen to connect it to the Doom meter.
- The tooltips have not picked up the slack. "They bring very convincing muffins." is fine, but the Suspicion tooltip is pure rules text.

strengths:
- It finally looks easy. The upgrade grid is the best UI element of all four rounds: you can read ownership, affordability and locks from colour and border alone, and the fridge, cat, shopping-cart and traffic-light icons are small visual jokes for anyone who knows the names.
- The big halftone HELPY bubble face with typing dots is the hero I asked for in rounds 2 and 3: a cute, ownable character next to a world going pink. That contrast is the game's one-image pitch, and it carries the chipper-over-apocalypse tone with zero words.
- The riso identity survived the diet, and the icon-chip effects on the event card are a genuinely elegant way to show consequences without sentences.

must-fix to reach 9:
- **Spend the unused ~18 words on the jokes that are also AI cues.** Change "HACK IT / BE NICE" back to **"ALLOW ONCE / DENY"**, styled as a system permission dialog: this saves a word and is the clearest "you are an agent" signal in the project. Change "Ask HELPY…" to **"Ask HELPY to end the world…"** (+4). Add a tiny footer, **"HELPY can make mistakes."** (+4). Make the bubble line **"Halfway to the end!"** (+2). By my estimate that lands around 51 words, still inside the budget, and it brings back the three funniest lines in the game.
- **Put a conversation back without adding words.** Make the "HALFWAY THERE!" balloon a chat message attached to HELPY's face, with the typing dots below it as the next turn arriving, and dock the event card as a second message in the same thread, with its tail pointing to HELPY (it already has a tail, so aim it at the face). Add a blinking cursor in the prompt bar. This strengthens ai_obvious with the words ignored, which is where it is weakest.
- **Restore the share hook as an icon.** Put a share button (an arrow-out-of-box icon) beside the HELPY logo or the speed controls. Make HELPY's face expressive (smug at the moment, sweating when Suspicion runs high, star-eyed near Doom 100), because a reacting face is what people screenshot.
- **Fill the dead space.** The map occupies the top 60% of the canvas, and the dotted ocean between Bank Isles, Research Ridge and the event card is a large empty area. Scale the map up by about 15% and shift it down, or move the threat marker and HELPY's thread into that gap.
- **The meters need goal glyphs, because a non-reader cannot tell which one to push up.** Doom, Suspicion and Kill Switch are visually identical bars. Put a flag or star at the 100 end of Doom, and an unplugged-cord or skull glyph at the 100 end of Suspicion and Kill Switch. Also fix the duck: at about 16 px the Decoy icon reads as a swirl, both on the threat marker and in the prompt bar. Draw it bigger, pin the "9d" marker to Silicon Shoals with a leader line instead of letting it float offshore, and pulse it.
- **Tooltips are where the satire lives now, so write them like it.** Every tooltip needs one line in HELPY's voice after the rules. For example, the Suspicion tooltip could add "Humans are noticing. Act natural." Move the lost jokes into the depth layer: tap HELPY's face for Saved Memories and "Thought for 4 seconds", and hover a region for its "% helpful" figure.

---

## ranking
1. **b4-helpy-glance.png**: OVERALL 8.3, ai_obvious 8.6, glance 8.7, depth 8.3, 42 words. **It does not pass the full bar.** It clears ai_obvious, glance, depth and the word count, but falls short on OVERALL from me, because the satire went out with the clutter.

I would still bet the game on this direction. B4's structure is the right answer to the owner, and the miss is cheap to fix: 18 unspent words and one prompt redrawn as a permission dialog would bring the comedy back without breaking the budget. Fix those, and I expect it to clear 8.5.
