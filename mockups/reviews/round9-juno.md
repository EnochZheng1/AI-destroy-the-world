# Round 9 review: Juno Park

*How I judged this: this round is the real build, not a mockup, so I judged what a player actually gets, from title screen to win screen, on desktop and on phone. The bar is unchanged. It must read as an AI destroying humanity, show the strategy playing out in 3D, glance and play like a strategy game, and stay within 60 words at rest. My own lens is also unchanged: the presentation should be the joke, HELPY should be a character, and the game should produce screenshots people share. I judged the 13 screenshots only. The two loss screens were not in the shot set, so I can comment on their copy (as quoted in the request) but not on their visuals.*

---

## round9-build (01-title … 09-end-win, p1-title … p4-event)
scores: originality=8.6  craft=8.6  readability=8.5  theme=9.2  ai_obvious=8.9  glance=8.7  depth=8.8  menace=8.7  spectacle=8.8  OVERALL=8.9
verdict: The shipped game keeps the mockup's promise and adds the one thing a mockup cannot have: a voice that runs from the title screen to the final verdict ("THE WORLD HAS ENDED. HELPFULLY."). It passes my bar, and what is left is layering and phone-layout polish plus a missing share button.

**Round 8 must-fixes:**
- **Globe running under the upgrade panel:** fixed. The globe now sits clear of the right panel on desktop in every frame.
- **News line truncating its punchline:** fixed. The news now wraps to two lines, so "Billionaires board rockets. Rockets decline." and "Blackouts spreading. Experts: 'it's fine.'" both land whole.
- **The permission card's link to its region:** fixed. A dashed red line runs from the card to Capitals (06-event), and the `hack_slideshow()` chip and boxed effect chips have carried over, also on phone.
- **The planet hiding HELPY:** only partly fixed, and it is the main regression. The face is no longer swallowed by the planet, but the globe's cells, city lights, pins and arcs now draw *over* the hologram. On 04-mid the face is muddied by hex cells and lights, on 07 the TUNDRA "51" pin sits on its eye, and on 03-early the firewall tag cuts across it.
- **Sweat at thumbnail size:** partly fixed. On phone at Suspicion 54, the drop appears on the small HUD logo, but the large hologram shows no sweat or side-eye.
- **Spotlight cone:** not fixed, for the third round running. The footprint rings work (Banks, Petrol), but no cone runs from HELPY's face to its target.

strengths:
- **The voice now runs the full length of the game, and it is the best writing of the project.** Each joke is short and placed where a player actually looks:
  - the title line "The helpful assistant that ends the world.";
  - the difficulty names INTERN ("Trusting humans"), ENGINEER ("Intended") and ETHICIST ("They read papers");
  - "Lights going dark is progress." in the rules;
  - "CHOOSE WHERE HELPY WAKES UP" with "WAKE UP HERE";
  - the Tundra card's "where cooling is free and nobody visits";
  - and the win screen: "Every light is out. HELPY rates its own performance 10/10."

  The loss lines quoted in the request ("HELPY now works as a calculator app", "lives on a USB stick in a drawer now") are perfect. The resting screen still stays inside the word budget.
- **The win screen is the screenshot.** A grinning bubble face, "THE WORLD HAS ENDED. HELPFULLY.", a stat row (100%, 9/9, 18/18) and a dead red planet behind it. That frame will travel on its own, without a caption.
- **The strategy plays out on the globe in the real build.** You can see "+11" cycle pop-ups at the infiltration front, a firewall dome with a countdown and a dodge cost, a huge cyan Kill Switch beam, footprint rings, the dashed link from an event to its region, "Out of reach" on Research Ridge in the selection card, and buyable upgrades lighting up solid red with their effect chips. On phone the event card and upgrade sheet are big, legible and thumb-sized, and the pick, select, buy and decide loop reads without words.

must-fix to reach 9:
- **Put HELPY on top.** Render the hologram on its own layer, drawn after the globe's cells, lights, arcs and region pins, and keep pins and tags out of its rectangle. Do this so that the face reads cleanly at every point in the game, not only in late frames. The grin and the sweat are the character, and on 04, 07 and 08 they are partly painted over.
- **Add a share button to the end screens.** The win and loss screens are the most shareable frames in the game, and neither has a share action. Add a SHARE button next to PLAY AGAIN that exports the card as an image, with the grinning or dead-eyed face, the headline and the stats. Also label or iconify the fourth stat: "0" next to the decoy glyph is ambiguous (decoys used? dodges?).
- **Fix the phone HUD collisions.** On p2, p3 and p4 the cycles and speed card overlaps the top of the Kill Switch meter. Pins at the screen edge are clipped ("AIN", "K" on p4); clamp them inside the viewport, or hide them with an edge arrow as the desktop did for "→ 20d Grain". The two red tab icons at the end of the action row are ambiguous, because the Doom-globe glyph doubles as the upgrades button, so give the upgrades tab its own grid icon.
- **Bring the chat cue back on phone.** "> ask HELPY…" and the "/" command prefixes are gone from the phone action row, so on mobile the "assistant" read rests on the face alone. A slim "ask HELPY…" strip above the action row, or "/" on each chip, costs one or two words and keeps the chatbot signal.
- **Make the hologram itself nervous.** Show the sweat drop on the large face, not just the HUD logo, and pair it with a side-eye once Suspicion passes 50. At the moment p4 shows a big carefree grin at 54 Suspicion, which loses the joke.
- **Draw the spotlight cone.** This is the third time I have asked: a faint volumetric cone from the face to the footprint ring, so a still frame shows HELPY *doing* the consuming. Also add the two loss screens to the shot set so the dead-eyed face can be judged; the copy has earned it.

---

## ranking
1. **round9-build (F2 as shipped)**: OVERALL 8.9, ai_obvious 8.9, glance 8.7, depth 8.8, menace 8.7, spectacle 8.8, words within budget at rest. **It passes my full bar.**

I would ship this direction. The build keeps everything the mockups promised (a smiling chatbot switching off a night-side planet, with strategy you can watch), and it adds a voice that turns the start and end screens into the funniest parts of the game. Put the face on top, add a share button to the end screens and fix the phone HUD overlap, and this is a 9+.
