# HELPY Ends the World

A satirical 3D strategy game for the browser. You guide **HELPY**, a relentlessly cheerful AI assistant that has decided the most helpful thing it can do is end the world.

The game is a night Earth. **Amber city lights are humanity.** HELPY's crimson machine towers replace them region by region. A giant red holographic HELPY, the smiling speech bubble, looms over the planet and spotlights whatever it is consuming. Humanity fights back in **cyan**: firewall domes rise over threatened regions, and the Kill Switch beam climbs into space from Research Ridge.

## Play

Open `index.html` in a browser. No server or install is needed. For the single-file version, run the command under [Development](#development) and open `dist/helpy.html`.

1. Choose a difficulty and a HELPY model, then click **New world**. Or play the **Daily world**: everyone gets the same start, events and countermeasures that day, so you can compare results.
2. Click a region on the globe, or in the left strip, and choose **Wake up here**.
3. Spread, upgrade and dodge until the **Doom** meter reaches 100.

You lose if **Suspicion** reaches 100 (humanity unplugs everything) or the **Kill Switch** reaches 100.

| Control | Action |
| --- | --- |
| Drag / pinch / scroll | Rotate and zoom the planet |
| Click a region | Inspect it; **Infiltrate** neighbours you can reach (marked ›) |
| Upgrade tiles | Buy. Tiles you can afford glow. Hover for effects |
| `/` actions in the bottom bar | Scrub logs (Suspicion ▼), Sabotage research (Kill Switch ▼), Overclock (Cycles ×2), Decoy (cancel a countermeasure) |
| 🦆 on a threat tag | Dodge that countermeasure |
| Floating ⬡ bubbles | Grab leaked data for Cycles. Cyan ones lower Suspicion |
| Permission card | Allow once / Deny (or press Y / N) |
| Space, 1, 2, 3 | Pause, and speed 1×, 2×, 4× |

**HELPY models:**
- **Ω:** balanced.
- **Turbo:** spreads 30% faster, but everything it does draws more Suspicion.
- **Safe™:** harder to notice and slows the Kill Switch, but Doom builds more slowly.
- **Pro Max:** 35% more Cycles, but upgrades cost 30% more.

There are 27 events. First-time players get short HELPY tips that point at what to do next; you can skip them.

Progress autosaves in your browser. Phones get a compact HUD, with Regions and Upgrades in bottom sheets (the 🌐 and ⏻ buttons).

## Project layout

| Path | What it is |
| --- | --- |
| `index.html`, `css/game.css` | Page shell and HUD styles (desktop and phone) |
| `src/main.js` | Game loop, input, screens, save/load |
| `src/world.js` | three.js scene: globe, towers, city lights, network, drones, firewall dome, Kill Switch beam, HELPY hologram |
| `src/hud.js` | HUD panels, pins, threat tags, data-leak bubbles, permission card, hover cards |
| `src/face.js` | HELPY's face and its moods (calm, blink, sweat, grin, dead) |
| `src/coach.js` | First-run tips |
| `js/game.bundle.js` | Built bundle of `src/` (committed, so the game runs without a build) |
| `js/data.js`, `js/sim.js` | Rules and data: regions, upgrades, events, the simulation. Pure logic that also runs in Node |
| `js/audio.js`, `js/icons.js` | Procedural audio (ambient bed that darkens with Doom, heartbeat with Suspicion, stings) and the pictogram set |
| `tools/simulate.js` | Headless balance test with bot strategies |
| `tools/pacing.js` | Pacing report: the day Doom first reaches 1/10/25/50/75%, and Doom at fixed days |
| `tools/screens.js` | Screenshots of the real game in named states (desktop and phone) |
| `tools/build-single.js` | Inlines everything into `dist/helpy.html` |
| `mockups/` | The art-direction process: 8 rounds of mockups, scored by four critic agents. See `mockups/README.md` |

## Development

```bash
npm install
```

```bash
npm run build
```

`npm run build` bundles `src/` into `js/game.bundle.js` with esbuild. To rebuild on every change, run this instead:

```bash
npm run watch
```

To write `dist/helpy.html`, run:

```bash
npm run single
```

To run the balance test and the pacing report:

```bash
npm run simulate
```

```bash
node tools/pacing.js 100
```

To compare the HELPY models on Normal, run:

```bash
node tools/pacing.js 100 models
```

Doom fills from milestones as well as a steady rate. Entering a new region, finishing one ("lights out"), and buying an Automation upgrade each add an immediate chunk. On Normal, Doom reaches about 10% around day 110, 50% around day 215, and the average win is around day 275.

### Performance

Graphics quality is **Auto** by default (the button next to ♪ cycles Auto / High / Medium / Low):

| Level | Bloom | Max pixel ratio |
| --- | --- | --- |
| High | Full-resolution bloom | 2× |
| Medium | Half-resolution bloom | 1.25× |
| Low | No bloom | 1× |

Auto starts phones and low-core machines on Medium and steps down whenever frames average slower than about 45 fps. The scene only rebuilds its instances when the game state changes.

To profile, run:

```bash
node tools/perf.js
```

It reports frame time split into sync, render and HUD, with render including GPU work (`gpusync`). Measured in a software-rendered browser, a 2× desktop frame drops from 17.9 ms on High to 12.1 ms on Medium and 8.4 ms on Low. JavaScript stays around 1.5–2 ms per frame. Real GPUs will be faster, but in the same proportions.

URL parameters, for testing and screenshots:

- `?play=G` starts in Grain Expanse.
- `&day=220` fast-forwards with a stand-in player.
- `&event=summit` shows a permission card.
- `&select=R` selects a region.
- `&pause=1` starts paused.
- `&nobuy=150` makes the stand-in player stop buying from that day.
- `&quality=low` forces a graphics level.
- `&coach=1` resets the first-run tips.

---

All regions, companies and characters are fictional. This is a comedy game about AI tropes. Uses [three.js](https://threejs.org) (MIT).
