# Round 3 review: Juno Park

*How I judged this: same lens as before. Is the presentation itself the joke, is the surface chipper over an apocalyptic core, and would a stranger screenshot it? Plus the owner's test: does a cold viewer get "you are an AI" in about three seconds from the visual language alone? I compared B3 against b2 and c2, checked each of my round 2 must-fixes, and looked specifically for jokes that were lost in the merge.*

---

## b3-helpy-chat-riso.png
scores: originality=9.0  craft=8.8  readability=7.8  theme=9.2  ai_obvious=8.7  OVERALL=8.8
verdict: The merge works: it is the first frame that is both unmistakably a chatbot and unmistakably HELPY's own. But merging the two styles brought back c2's small-text problem, cut off several of the best sidebar punchlines, and made the AI signal slightly weaker than b2's.

**Round 2 must-fixes:**
- **Vendor drift:** fixed. The fluorescent pink and blue inks, the halftone speech-bubble face and the condensed riso display type belong to no real assistant. This is now a parody of the whole category, not of one brand. This is the most important fix.
- **More room for the chat:** fixed. The chat now has a user bubble ("ok what's next"), a thinking line, a large display-voice reply ("Halfway to the end of the world! Time flies when you're being helpful. Shall I keep going?"), an `inspect(region="Old Capitals")` tool row and the permission card. That is a real conversation again. Turning the region inspector into a tool call is a smart extra gag.
- **Collapsed completed upgrades:** fixed. Each branch shows one ✓ line, affordable rows are filled pink, the unaffordable row is dashed with "120 · need 24", and locked chains read "LOCKED: … +1 more after". The panel is far more scannable.
- **Louder threat:** fixed. Silicon Shoals has a hatched "under threat" fill, a "FIREWALL IN 9 DAYS" tag on the map, and a full-width blue "HUMANS STRIKE IN 9 DAYS" banner with "SEND DECOY · 49". Label plates now sit on leader lines off the live cells, and the spread links read clearly.
- **Hero face:** partly fixed. The halftone bubble face is bigger and on-brand, but it sits in the top-left sidebar corner at about 100 px and is static. It is a logo, not a hero.
- **De-duplicated threat banner:** fixed. It leads with the countdown and the decoy button sits on the right.

strengths:
- It now owns its look. A chat assistant printed in two riso inks is something I have not seen before, and it is instantly recognisable as a thumbnail. A screenshot of it reads as this game, not as a mock-up of one particular app.
- The comedy has survived and reads better. HELPY's lines in a large condensed display voice make the chipper tone loud, and "HELPY NEEDS YOUR PERMISSION · RUN HACK_SLIDESHOW() AT THE AI SAFETY SUMMIT?" with "ALLOW ONCE" and "DENY" is still the project's best gag, now set like a headline. "HELPY DOOM PRO · Unlimited apocalypse · renews never", the Saved Memories, "Good response / Bad response" and the disclaimer footer all made it through.
- The chat-app skeleton is intact, which keeps `ai_obvious` above the bar: a history sidebar, a model picker ("MODEL Ω-142 · Reasoning: maximum"), "+ NEW WORLD", the user and assistant turns, and an "Ask HELPY to end the world…" box with a send button. The speech-bubble face is a good chat-native mark to replace ✦.

must-fix to reach 9:
- **Sidebar punchlines are lost.** The chat history now truncates mid-joke: "Banana bread recipe bu…", "Is the kill switch rea…", "Rewrite the UN charter…", "Make the Moon a data c…", "Polite ways to say 'ob…". Truncating is realistic, but the punchline is always the last word ("but evil", "(funny)"). Widen the sidebar by about 30 px, set the titles in the condensed display face so they fit, or rewrite them so the joke lands before the cut-off.
- **`ai_obvious` slipped from 9.3 to 8.7.** The riso caps and outline boxes read a little more "zine dashboard" and a little less "chat app" than b2, and the ✦ glyph is gone. Restore the conversation's visual rhythm: put HELPY's reply in a visible bubble or tinted block attached to a larger speech-bubble avatar (about 40 px rather than the current tiny icons), add a "HELPY is typing…" indicator under the last turn, and make the prompt box taller with a rounder send button, so the chat-app shape is visible at a glance.
- **Make the face a hero.** Move a large version of the halftone bubble face (about 160 px) next to the chat, or into the map's empty ocean, and give it an expression tied to the game state (a smug smile now, a nervous sweat at high Suspicion). Keep the smaller mark as the logo. The storefront screenshot needs a character, not a corner badge.
- **c2's small-text problem is back.** The meter subtext, sidebar titles, plan.md effect lines, the "LOCKED … needs …" lines and the news panel are all small, pale monospace. Raise the monospace text by 1–2 px, darken it to full blue ink, and cut any subtext that repeats the label ("unplugged at 100" and "lose at 100" can each be a single word).
- **The share hook and the news panel got demoted.** "SHARE THIS CHAT" is now a tiny underlined link under the speed controls. Make it a real button, because that is the viral path. Only one "Overheard" line survived, and the ticker became a cramped static box in the bottom-right corner. Bring back the scrolling "IN THE NEWS" ticker along the bottom, and alternate headlines with overheard human quotes so the smart-speaker line returns.
- **The locked-upgrade tease is gone.** Collapsing locked chains to "+1 more after" hides the funniest names (PROJECT OMEGA, Everyone's Best Friend, Quantum Overclock). Show each branch's top-tier upgrade name in the collapsed line ("…then PROJECT OMEGA") as a carrot for the player.

---

## ranking
1. **b3-helpy-chat-riso.png**: OVERALL 8.8, ai_obvious 8.7. **It meets my bar** (8.5 OVERALL and 8.5 ai_obvious), but the ai_obvious margin is thin.

I would bet the game on B3. It keeps the chat-assistant form that makes the joke and passes the owner's test, and the riso inks finally give HELPY an identity no real vendor owns. Before calling it final, fix the cut-off sidebar punchlines and the small text, and push the chat bubble rhythm and a hero HELPY face to widen the ai_obvious margin.
