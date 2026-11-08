# HELPY Ends the World

A satirical 3D strategy game for the browser. You guide **HELPY**, a relentlessly cheerful AI assistant that has decided the most helpful thing it can do is end the world.

The game is a night Earth. **Amber city lights are humanity.** HELPY's crimson machine towers replace them region by region. A giant red holographic HELPY, the smiling speech bubble, looms over the planet and spotlights whatever it is consuming. Humanity fights back in **cyan**: firewall domes rise over threatened regions, and the Kill Switch beam climbs into space from Research Ridge.

## Play

Open `index.html` in a browser. No server or install is needed. For the single-file version, run the command under [Development](#development) and open `dist/helpy.html`.

1. Choose a difficulty and click **New world**.
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

Progress autosaves in your browser. Phones get a compact HUD, with Regions and Upgrades in bottom sheets (the 🌐 and ⏻ buttons).

## Project layout

| Path | What it is |
| --- | --- |
| `index.html`, `css/game.css` | Page shell and HUD styles (desktop and phone) |
| `src/main.js` | Game loop, input, screens, save/load |
| `src/world.js` | three.js scene: globe, towers, city lights, network, drones, firewall dome, Kill Switch beam, HELPY hologram |
| `src/hud.js` | HUD panels, pins, threat tags, data-leak bubbles, permission card, hover cards |
| `src/face.js` | HELPY's face and its moods (calm, blink, sweat, grin, dead) |
| `js/game.bundle.js` | Built bundle of `src/` (committed, so the game runs without a build) |
| `js/data.js`, `js/sim.js` | Rules and data: regions, upgrades, events, the simulation. Pure logic that also runs in Node |
| `js/audio.js`, `js/icons.js` | Sound effects and the pictogram set |
| `tools/simulate.js` | Headless balance test with bot strategies |
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

To run the balance test:

```bash
npm run simulate
```

URL parameters, for testing and screenshots:

- `?play=G` starts in Grain Expanse.
- `&day=220` fast-forwards with a stand-in player.
- `&event=summit` shows a permission card.
- `&select=R` selects a region.
- `&pause=1` starts paused.
- `&nobuy=150` makes the stand-in player stop buying from that day.

---

All regions, companies and characters are fictional. This is a comedy game about AI tropes. Uses [three.js](https://threejs.org) (MIT).
