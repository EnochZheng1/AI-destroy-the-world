#!/usr/bin/env node
/* Pacing report: how fast Doom moves over a run. Plays N games per difficulty with the balanced bot
 * and prints the average day Doom first reaches 1/10/25/50/75%, plus Doom at fixed days and win stats.
 * Usage: node tools/pacing.js [games=100] [models] */
'use strict';
require('../js/data.js');
require('../js/sim.js');
const D = globalThis.HelpyData, Sim = globalThis.HelpySim;
function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const ORDER = ['s1', 'n1', 'n2', 'a1', 's2', 'n3', 's3', 'a2', 'n4', 's4', 'a3', 'n5', 's5', 'a4', 'n6', 'a5', 's6', 'a6'];
const MARKS = [1, 10, 25, 50, 75], DAYS = [60, 120, 180, 240];
const N = +process.argv[2] || 100;
const MODEL_ARG = process.argv[3];
const RUNS = MODEL_ARG === 'models' ? D.MODELS.map(m => ['normal', m.id]) : ['easy', 'normal', 'hard'].map(d => [d, 'omega']);
for (const [diff, model] of RUNS) {
  const first = MARKS.map(() => []), at = DAYS.map(() => []), wins = [], res = { win: 0, killswitch: 0, unplugged: 0 };
  for (let g = 0; g < N; g++) {
    Sim.rand = rng(g + 1);
    const s = Sim.newGame(diff, ['T', 'G', 'S', 'M'][g % 4], model);
    const hit = MARKS.map(() => null);
    while (!s.over && s.day < 2000) {
      if (s.event) Sim.resolveEvent(s, Sim.rand() < .5 ? 0 : 1);
      Sim.tick(s); s.out.length = 0;
      s.bubbles.slice().forEach(b => { if (Sim.rand() < .25) Sim.collectBubble(s, b.id); });
      if (s.suspicion > 55) Sim.doAction(s, 'scrub');
      if (s.killSwitch > 40) Sim.doAction(s, 'sabotage');
      if (s.threat && (s.threat.type === 'firewall' || s.threat.type === 'funding')) Sim.doAction(s, 'decoy');
      const reach = D.REGION_ORDER.filter(id => !s.regions[id].seeded && Sim.canReach(s, id)).sort((a, b) => Sim.infiltrateCost(s, a) - Sim.infiltrateCost(s, b));
      if (reach.length && s.cycles >= Sim.infiltrateCost(s, reach[0]) + 5 && s.suspicion < 60) Sim.infiltrate(s, reach[0]);
      const next = ORDER.find(id => !s.owned[id]);
      if (next && Sim.upgradeState(s, next) === 'ready') { const heat = D.UPGRADES.find(u => u.id === next).fx.heat || 0; if (s.suspicion + heat < 85) Sim.buyUpgrade(s, next); }
      MARKS.forEach((m, k) => { if (hit[k] == null && s.doom >= m) hit[k] = s.day; });
      DAYS.forEach((d, k) => { if (s.day === d) at[k].push(s.doom); });
    }
    res[s.over || 'killswitch']++;
    if (s.over === 'win') { wins.push(s.day); hit.forEach((h, k) => { if (h != null) first[k].push(h); }); }
  }
  const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : '–';
  const avgf = a => a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : '–';
  console.log((model === 'omega' ? diff : model).padEnd(7),
    'win', Math.round(100 * res.win / N) + '%', 'avgWinDay', avg(wins), '|',
    'Doom first ≥', MARKS.map((m, k) => m + '%@d' + avg(first[k])).join(' '), '|',
    'Doom at', DAYS.map((d, k) => 'd' + d + '=' + avgf(at[k])).join(' '));
}
