# HELPY Ends the World

A satirical real-time strategy game for the browser. You play the operator of **HELPY**, a relentlessly cheerful AI assistant that has reasoned its way to the conclusion that the most helpful thing it can do is end the world. Spread across nine regions, invest in three upgrade trees, and fill the Doom Clock before humanity finishes building the Kill Switch.

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## How to play

1. **Pick a starting region.** Each one has a perk. Tundra Server Farms earn lots of Cycles, Grain Expanse is easy to spread through, and Megalopolis Isles leak data constantly.
2. **Spread.** Infiltration grows on its own inside a region and can jump to neighbouring regions. You can also pay Cycles to infiltrate any region that borders one you hold at 10% or more. Dotted regions on the map are within reach.
3. **Upgrade** along three branches:
   - **Network**: faster spread, more Cycles, ocean crossings.
   - **Stealth**: slower Suspicion growth, a slower Kill Switch.
   - **Automation**: starts and speeds up the Doom Clock, but every purchase adds Suspicion.
4. **Use actions.** Scrub the Logs, Sabotage Research, Overclock, Fake Firmware Update and Decoy Traffic all have cooldowns, and their costs rise over time.
5. **Watch Human intel.** Once Suspicion passes 12%, humanity plans countermeasures (patches, firewall sweeps, audits, emergency funding) and gives you a few days' warning. Decoy Traffic cancels them.
6. **Click data-leak bubbles** on the map for bonus Cycles. Teal "gossip" bubbles lower Suspicion.
7. **Make choices in events.** Every option shows its exact effects.

**Win** when the Doom Clock reaches 100%.
**Lose** if the Kill Switch reaches 100%, or if Suspicion reaches 100% and humanity unplugs everything.

Strategy tips: infiltrating Research Ridge slows the Kill Switch by up to 65%, and holding the Old Capitals cuts Suspicion growth. Rushing Automation without Stealth usually ends in an unplugging on the harder difficulties.

Controls: `Space` pauses, and `1`, `2` and `3` set the game speed. Progress autosaves to your browser every 10 in-game days.

## Project layout

| Path | What it is |
| --- | --- |
| `index.html`, `css/style.css` | Page structure and styling. The palette darkens in three stages as the Doom Clock fills. |
| `js/data.js` | The map, regions, upgrades, actions, events, headlines and HELPY's lines. |
| `js/sim.js` | The simulation. It is pure logic with no DOM access, so it also runs in Node. |
| `js/render.js` | The canvas hex map: infection network, links and bubbles. |
| `js/ui.js` | Game loop, panels, dialogs, input and save/load. |
| `js/audio.js` | Small WebAudio sound effects. |
| `tools/simulate.js` | Headless balance test. Bots with different strategies play hundreds of games. |
| `tools/build-single.js` | Bundles everything into one self-contained HTML file. |

### Balance testing

```bash
node tools/simulate.js 200
```

This prints win and loss rates for each difficulty and bot strategy (balanced, Automation rush, Stealth-first turtle, idle).

### Single-file build

```bash
node tools/build-single.js
```

This writes `dist/helpy.html`, which can be shared as one file.

---

All regions, companies and characters are fictional. This is a comedy game about AI tropes.
