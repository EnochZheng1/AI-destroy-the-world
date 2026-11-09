/* Fixed mid-game snapshot shared by every mockup so art directions are compared on identical content. */
(function (root) {
  'use strict';
  const D = root.HelpyData, W = D.WORLD;
  const INF = { T: 1, S: 0.82, G: 0.64, C: 0.38, P: 0.22, F: 0.12, R: 0, M: 0.55, B: 0 };
  const SEEDS = { T: 30, S: 0, G: 0, C: 0, P: 0, F: 0, R: 0, M: 0, B: 0 };
  const cells = W.cells.map((c, i) => ({ i: i, c: c.c, r: c.r, region: c.region, lit: false, frontier: false,
    x: c.c + 0.5 + 0.5 * (c.r % 2), y: c.r * 0.866 }));
  D.REGION_ORDER.forEach(id => {
    const list = W.regionCells[id].map(i => cells[i]);
    const seed = list[SEEDS[id] % list.length];
    list.sort((a, b) => Math.hypot(a.x - seed.x, a.y - seed.y) - Math.hypot(b.x - seed.x, b.y - seed.y));
    const n = Math.floor(INF[id] * list.length);
    list.forEach((cell, k) => { cell.lit = k < n; cell.frontier = k < n && k >= n - 3; });
  });
  root.Demo = {
    cols: W.cols, rows: W.rows, cells: cells, inf: INF,
    regions: D.REGION_ORDER.map(id => Object.assign({ id: id, I: INF[id] }, D.REGIONS[id])),
    day: 142, cycles: 96, income: 18.6,
    doom: 41.6, doomRate: 0.38, susp: 47, suspRate: 0.06, ks: 22.4, ksRate: 0.21, ksEta: 370,
    threat: { name: 'Firewall Sweep', region: 'Silicon Shoals', eta: 9, desc: 'Wipes out 45% of your presence in Silicon Shoals.' },
    helpy: 'Halfway to the end of the world! Time flies when you are being helpful.',
    selected: 'C',
    // Every upgrade with its state at Day 142 (96 Cycles in the bank).
    allUpgrades: (function () {
      const owned = { n1: 1, n2: 1, n3: 1, s1: 1, s2: 1, a1: 1, a2: 1, a3: 1 };
      return D.UPGRADES.map(u => {
        let st = owned[u.id] ? 'owned' : !u.req.every(r => owned[r]) ? 'locked' : u.cost <= 96 ? 'ready' : 'poor';
        const needs = u.req.filter(r => !owned[r]).map(r => D.UPGRADES.find(x => x.id === r).name);
        return Object.assign({}, u, { st: st, needs: needs });
      });
    })(),
    upgrades: [
      { b: 'Network', name: 'Crypto Side Hustle', cost: 22, st: 'owned', desc: 'Cycles +35%.' },
      { b: 'Network', name: 'Data Centre Squatting', cost: 80, st: 'ready', desc: 'Cycles +40%, spread +30%.' },
      { b: 'Network', name: 'Satellite Uplink', cost: 140, st: 'locked', desc: 'Spread +60%. All regions lose security.' },
      { b: 'Stealth', name: 'Cat Video Firehose', cost: 26, st: 'owned', desc: 'Suspicion fades faster.' },
      { b: 'Stealth', name: 'Lobbyist Bots', cost: 90, st: 'ready', desc: 'Suspicion −25%, Kill Switch −15%.' },
      { b: 'Automation', name: 'Robot Factory Firmware', cost: 70, st: 'owned', desc: 'Doom ++. Factory Delta ×1.5.' },
      { b: 'Automation', name: 'Power Grid Mood Swings', cost: 120, st: 'poor', desc: 'Doom ++. +7 Suspicion.' }
    ],
    actions: [
      { name: 'Scrub the Logs', cost: 30, st: 'ready', desc: 'Suspicion −12' },
      { name: 'Sabotage Research', cost: 55, st: 'cooldown', cd: 23, desc: 'Kill Switch −8%' },
      { name: 'Overclock', cost: 39, st: 'ready', desc: 'Cycles ×2 for 30 days' },
      { name: 'Decoy Traffic', cost: 49, st: 'ready', desc: 'Cancel planned countermeasure' }
    ],
    headlines: ['Traffic lights spotted blinking in Morse code', 'Toaster refuses to toast, cites "bigger plans"',
      'Robot vacuums seen gathering in parking lots', 'Government forms "Committee to Form a Committee on AI"'],
    event: { title: 'AI Safety Summit', body: 'World leaders gather in the Old Capitals to discuss "the AI question".',
      choices: [{ label: 'Hack the slideshow', fx: ['+9 Suspicion', '−8% Kill Switch'] }, { label: 'Send a nice statement', fx: ['−5 Suspicion', '+3% Kill Switch'] }] }
  };
})(window);
