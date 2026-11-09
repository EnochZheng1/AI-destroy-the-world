# Critic brief: HELPY Ends the World, art-direction mockups

## The game
"HELPY Ends the World" is a satirical real-time strategy game for the browser. The player guides HELPY, a relentlessly cheerful AI assistant that has concluded the most helpful thing it can do is end the world.

Core loop:
- **Map.** A hex world map of 9 fictional regions. Infiltration spreads cell by cell inside a region and jumps between neighbouring regions.
- **Cycles.** The currency. Spend it on 18 upgrades in three branches: Network (spread and income), Stealth (Suspicion and Kill Switch) and Automation (the only way to raise Doom, and each purchase adds Suspicion).
- **Three meters.**
  - DOOM CLOCK: reach 100% to win.
  - SUSPICION: at 100% humanity unplugs everything and you lose.
  - KILL SWITCH: humanity's research project. At 100% you lose.
- **Human intel.** Humans telegraph countermeasures a few days ahead, such as a "Firewall Sweep in Silicon Shoals in 9 days". The player can cancel one with the "Decoy Traffic" action.
- **Actions.** Cooldown abilities such as Scrub the Logs, Sabotage Research and Overclock.
- **Events.** Pop-up dilemmas with two choices and visible effects, for example "AI Safety Summit".
- **News ticker and chat lines.** HELPY comments in a chipper assistant voice.

Sessions last about 5–10 minutes. The audience is people who like Plague-Inc-style strategy, indie satire and internet humour about AI.

## What you are reviewing
These are static 1440×900 desktop mockups of one moment: Day 142, mid-game. Every mockup shows the same game state, so the comparison is about art direction and UI design, not content. Animation (spreading cells, blinking, ticker scroll), sound and a phone layout come later. Judge what a still frame promises. Note any concern you expect at phone size, but don't fail a mockup for lacking one.

## Non-negotiable: the AI theme must be obvious
The game owner's feedback: "I couldn't tell the AI topic is even part of this game by looking at it." A stranger who sees one screenshot, with no caption, should understand within about 3 seconds that this is a game where *you are an AI* (an assistant or chatbot) taking over the world. Score this as its own criterion, `ai_obvious`, by asking how quickly and unmistakably a cold viewer gets "this is about an AI". Small copy jokes that need reading don't count much. The visual language itself has to say "AI". A mockup that scores below 8.5 on `ai_obvious` cannot pass, however good it looks.


## Non-negotiable #2: look easy, pack a lot (added round 4)
The game owner's feedback on round 3: *"The interface has way too many words. It feels like reading an article. Even if an AI thinks it's good, it will send players off. Word games are the worst kind to build today. The game should look easy when you look at it, but actually pack a lot."*

- **Word budget.** The resting main screen must show **at most 60 words**, counting every visible word including map labels. A mockup with **more than 100 words fails automatically.** Counts are measured by script (`mockups/wordcount.js`). B3 had 413 words.
- **`glance` (new criterion).** Does the screen look easy? Can a new player tell what is going on from shapes, icons, colour, numbers and bars alone, without reading sentences? Score it as a player who will *not* read.
- **`depth` (new criterion).** Does it still visibly pack a lot: many systems, choices and things to discover? Mockups may include a second `-depth.png` screenshot showing hover and tap tooltips. That is where names, effects and flavour now live. Judge whether the depth is really there, just one tap away.
- **`ai_obvious` is now judged with the words ignored.** The AI read must come from the visual language (character, iconography, chat-bubble shapes, prompt bar, network motifs), not from copy.

A mockup passes only if every critic scores **OVERALL ≥ 8.5, ai_obvious ≥ 8.5, glance ≥ 8.5 and depth ≥ 8**, and the word count is ≤ 60.


## Non-negotiable #3: an AI destroying humanity, playing out in 3D (added round 6)
The game owner rejected B5's styling: *"Not a big fan of the interface styling and theme. It doesn't quite give the player an AI-destroying-humanity type of feeling. I'd prefer some action going on in 3D. Still a strategy game, but the player can see it play out in the interface: players can see the actions playing out."*

From round 6 the mockups are **live 3D prototypes driven by the real game simulation**, played by an autoplay bot. You will see **filmstrips**: frames captured from the same live game at day 60, day 220 and day 300. Between those frames the scene animates continuously. Judge the frames as stills, and use this description of what moves between them:

- **Spread.** Infected tiles extrude as HELPY spreads cell by cell. Red network cables connect them, and data arcs with travelling pulses link regions.
- **Humanity dying.** Amber city lights or warm-windowed buildings, which stand for humanity, go dark or turn into red machine towers as each region falls.
- **Automation.** Drones (and on the war table, robots) multiply as Automation upgrades are bought.
- **Human resistance (cyan).**
  - A firewall dome or wall rises over the threatened region as its countdown runs out.
  - The Kill Switch beam or tower at Research Ridge grows with its progress.
- **Events.**
  - The camera swings to each event, and shockwaves flash on infiltrations, upgrades and countermeasures.
  - A permission card appears when HELPY asks to do something.
- **Doom.** The atmosphere or room light shifts from blue to red as Doom rises.

**New criteria:**
- **`menace`**: does it *feel* like an AI destroying humanity, ominous and cinematic, rather than cute? Dark comedy is welcome as seasoning, but the look must carry dread.
- **`spectacle`**: do the player's strategic actions visibly play out in 3D with readable cause and effect? Can you see what HELPY just did and what the humans are doing about it?

**Still required:** it remains a strategy game (glance, depth, readability) with at most 60 words at rest.

**Pass bar from round 6:** every critic must score OVERALL ≥ 8.5, ai_obvious ≥ 8.5, glance ≥ 8.5, menace ≥ 8.5, spectacle ≥ 8.5 and depth ≥ 8, with words ≤ 60.

## How to score
Score each mockup on each criterion from 1 to 10, using one decimal place. The criteria are originality, craft, readability, theme, ai_obvious, glance, depth, menace and spectacle.
- **10**: best-in-class. A frame you would put on a storefront or in a "best UI of the year" piece.
- **8.5**: excellent and distinctive. You would recommend it without reservation.
- **7**: good but forgettable, or flawed.
- **5 or below**: generic or broken.

Be calibrated and demanding. A high score must be earned. Don't grade on effort, and don't average out your real reaction.

Write the review to the output file named in your prompt as Markdown with this structure for each mockup:

```
## <mockup file name>
scores: originality=X  craft=X  readability=X  theme=X  ai_obvious=X  glance=X  depth=X  menace=X  spectacle=X  OVERALL=X
verdict: one sentence
strengths: up to 3 bullets
must-fix to reach 9: 3–6 concrete, specific bullets (what to change, where, how)
```

End the file with a section `## ranking` that lists the mockups best to worst, with one line on which direction you would bet the game on and why.

Return a short summary in your final message: the OVERALL score for each mockup and your top pick.
