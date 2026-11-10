#!/usr/bin/env node
/* Headless balance test: plays many games with simple bot strategies and reports outcomes.
 * Usage: node tools/simulate.js [games=200] */
'use strict';
require('../js/data.js');
require('../js/sim.js');
const D = globalThis.HelpyData;
const Sim = globalThis.HelpySim;

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Bots differ in how they prioritise the three upgrade branches.
const BOTS = {
  balanced: ['s1', 'n1', 'n2', 'a1', 's2', 'n3', 's3', 'a2', 'n4', 's4', 'a3', 'n5', 's5', 'a4', 'n6', 'a5', 's6', 'a6'],
  rush: ['a1', 'n1', 'a2', 'n2', 'a3', 'a4', 'a5', 'a6', 'n3', 'n4', 's1', 's2', 's3', 's4', 's5', 's6', 'n5', 'n6'],
  turtle: ['s1', 's2', 's3', 'n1', 's4', 'n2', 's5', 'n3', 'n4', 's6', 'a1', 'a2', 'a3', 'n5', 'a4', 'a5', 'n6', 'a6'],
  idle: []
};

function play(diff, botName, seed, skill, model) {
  Sim.rand = mulberry32(seed);
  const start = ['T', 'G', 'S', 'M'][seed % 4];
  const s = Sim.newGame(diff, start, model);
  const order = BOTS[botName];
  while (!s.over && s.day < 3000) {
    if (s.event) Sim.resolveEvent(s, Sim.rand() < 0.5 ? 0 : 1);
    Sim.tick(s);
    s.out.length = 0;
    if (botName === 'idle') continue;
    // collect bubbles with some probability (player attention)
    s.bubbles.slice().forEach(b => { if (Sim.rand() < skill * 0.25) Sim.collectBubble(s, b.id); });
    // emergency actions
    if (s.suspicion > 55) Sim.doAction(s, 'scrub');
    if (s.killSwitch > 40) Sim.doAction(s, 'sabotage');
    if (s.threat && (s.threat.type === 'firewall' || s.threat.type === 'funding')) Sim.doAction(s, 'decoy');
    // expand: infiltrate the cheapest reachable region, but keep a reserve for upgrades
    const next = order.find(id => !s.owned[id]);
    const reachable = D.REGION_ORDER.filter(id => !s.regions[id].seeded && Sim.canReach(s, id))
      .sort((a, b) => Sim.infiltrateCost(s, a) - Sim.infiltrateCost(s, b));
    if (reachable.length && s.cycles >= Sim.infiltrateCost(s, reachable[0]) + 5 && s.suspicion < 60) Sim.infiltrate(s, reachable[0]);
    if (next && Sim.upgradeState(s, next) === 'ready') {
      // don't buy heat-generating automation when suspicion is critical
      const heat = (D.UPGRADES.find(u => u.id === next).fx.heat || 0);
      if (s.suspicion + heat < 85) Sim.buyUpgrade(s, next);
    }
    if (s.cycles > 60 && s.suspicion < 50) Sim.doAction(s, 'overclock');
    if (s.cycles > 80 && s.suspicion < 40) Sim.doAction(s, 'update');
  }
  return s;
}

module.exports = { play, BOTS };
if (require.main === module) main();
function main() {
const N = +process.argv[2] || 200;
for (const diff of ['easy', 'normal', 'hard']) {
  for (const bot of Object.keys(BOTS)) {
    const res = { win: 0, killswitch: 0, unplugged: 0, timeout: 0 };
    let days = 0, wins = 0;
    for (let i = 0; i < N; i++) {
      const s = play(diff, bot, i + 1, 1);
      res[s.over || 'timeout']++;
      if (s.over === 'win') { days += s.day; wins++; }
    }
    console.log(diff.padEnd(7), bot.padEnd(9),
      Object.entries(res).map(([k, v]) => `${k}:${(100 * v / N).toFixed(0)}%`).join('  '),
      wins ? ` avgWinDay:${Math.round(days / wins)}` : '');
  }
}
}
