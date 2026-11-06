/* HELPY — game simulation. Deterministic given Sim.rand; no DOM access.
 * The UI calls tick() once per in-game day and drains state.out for messages. */
(function (root) {
  'use strict';
  const D = root.HelpyData;
  const W = D.WORLD;

  const DIFFICULTY = {
    easy: { label: 'Intern', ks: 0.7, susp: 0.75, cost: 0.85, start: 18, threat: 0.75 },
    normal: { label: 'Engineer', ks: 1.0, susp: 1.0, cost: 1.0, start: 12, threat: 1.0 },
    hard: { label: 'Ethicist', ks: 1.3, susp: 1.25, cost: 1.1, start: 8, threat: 1.3 }
  };

  const Sim = { DIFFICULTY: DIFFICULTY, rand: Math.random };
  const rnd = () => Sim.rand();
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const UP = {};
  D.UPGRADES.forEach(u => { UP[u.id] = u; });
  const ACT = {};
  D.ACTIONS.forEach(a => { ACT[a.id] = a; });
  const EVT = {};
  D.EVENTS.forEach(e => { EVT[e.id] = e; });

  function fill(t, r) { return t.replace('{r}', r ? D.REGIONS[r].name : ''); }
  function emit(s, type, text, extra) { s.out.push(Object.assign({ type: type, text: text }, extra || {})); }
  function chat(s, key, r) { emit(s, 'chat', fill(pick(D.CHAT[key]), r)); }

  // ---------------------------------------------------------------- modifiers
  function mods(s) {
    const m = { spread: 1, compute: 1, computeMul: 1, sea: 0, secDown: 0, stealth: 1, decay: 0.012,
      ks: 1, doom: 0, doomMul: 1, factory: 0, energy: 0 };
    Object.keys(s.owned).forEach(id => {
      const fx = UP[id].fx;
      if (fx.spread) m.spread += fx.spread;
      if (fx.compute) m.compute += fx.compute;
      if (fx.computeMul) m.computeMul *= fx.computeMul;
      if (fx.sea) m.sea = 1;
      if (fx.secDown) m.secDown += fx.secDown;
      if (fx.stealth) m.stealth *= 1 - fx.stealth;
      if (fx.decay) m.decay += fx.decay;
      if (fx.ks) m.ks *= 1 - fx.ks;
      if (fx.doom) m.doom += fx.doom;
      if (fx.doomMul) m.doomMul *= fx.doomMul;
      if (fx.factory) m.factory += fx.factory;
      if (fx.energy) m.energy += fx.energy;
    });
    return m;
  }
  Sim.mods = mods;

  function sec(s, id) { return clamp(s.regions[id].sec - mods(s).secDown, 0.02, 0.95); }
  Sim.security = sec;
  const I = (s, id) => s.regions[id].I;

  // ---------------------------------------------------------------- rates
  Sim.incomeRate = function (s) {
    const m = mods(s);
    let base = 0.4;
    D.REGION_ORDER.forEach(id => { base += I(s, id) * D.REGIONS[id].compute; });
    let v = base * m.compute * m.computeMul * (s.overclock > 0 ? 2 : 1);
    if (I(s, 'B') >= 0.5) v += 2;
    return v;
  };
  Sim.doomRate = function (s) {
    const m = mods(s);
    if (m.doom <= 0) return 0;
    let w = 0;
    D.REGION_ORDER.forEach(id => {
      let dw = D.REGIONS[id].doom;
      if (id === 'F') dw *= 1 + m.factory;
      if (id === 'P') dw *= 1 + m.energy;
      w += I(s, id) * dw;
    });
    return w * m.doom * m.doomMul;
  };
  Sim.suspicionRate = function (s) {
    const m = mods(s);
    let sumI = 0;
    D.REGION_ORDER.forEach(id => { sumI += I(s, id); });
    const gain = (0.011 * sumI + Sim.doomRate(s) * 0.45) * m.stealth * DIFFICULTY[s.diff].susp * (1 - 0.35 * I(s, 'C'));
    return gain - m.decay;
  };
  Sim.ksRate = function (s) {
    if (!s.ksActive) return 0;
    const m = mods(s);
    return 0.28 * DIFFICULTY[s.diff].ks * (1 + s.day / 400) * (0.5 + s.suspicion / 50) * (1 - 0.65 * I(s, 'R')) * m.ks * (s.ksBoost > 0 ? 1.6 : 1);
  };

  // ---------------------------------------------------------------- costs
  Sim.upgradeCost = function (s, id) {
    return Math.round(UP[id].cost * DIFFICULTY[s.diff].cost * (I(s, 'S') >= 0.5 ? 0.85 : 1));
  };
  Sim.actionCost = function (s, id) {
    return Math.round(ACT[id].cost * DIFFICULTY[s.diff].cost * (1 + s.day / 150) * (I(s, 'B') >= 0.5 ? 0.8 : 1));
  };
  Sim.seededCount = s => D.REGION_ORDER.filter(id => s.regions[id].seeded).length;
  Sim.infiltrateCost = function (s, id) {
    return Math.round((12 + 45 * sec(s, id)) * (1 + 0.12 * Sim.seededCount(s)) * DIFFICULTY[s.diff].cost);
  };
  // A region can be targeted if it borders (by land or sea route) a region that is at least 10% infiltrated.
  Sim.canReach = function (s, id) {
    return W.adj[id].some(a => s.regions[a.to].I >= 0.1);
  };

  // ---------------------------------------------------------------- new game
  Sim.newGame = function (diff, startId) {
    const s = {
      v: 1, day: 0, diff: diff, cycles: DIFFICULTY[diff].start, suspicion: 0, killSwitch: 0, doom: 0,
      ksActive: false, regions: {}, owned: {}, cd: {}, overclock: 0, ksBoost: 0,
      bubbles: [], bubbleSeq: 0, nextEvent: 28 + Math.floor(rnd() * 12), event: null,
      threat: null, nextThreat: 60, flags: {}, links: [], out: [], over: null,
      stats: { bubbles: 0, events: 0, upgrades: 0, threatsBlocked: 0, cyclesEarned: 0 }
    };
    D.REGION_ORDER.forEach(id => {
      s.regions[id] = { I: 0, seeded: false, sec: D.REGIONS[id].security, order: [], parent: {}, full: false };
    });
    seed(s, startId, null);
    s.regions[startId].I = 0.04;
    D.CHAT.intro.slice(0, 2).forEach(t => emit(s, 'chat', t));
    chat(s, 'seed', startId);
    return s;
  };

  function hexDist(a, b) {
    const ca = W.cells[a], cb = W.cells[b];
    const ax = ca.c + (ca.r % 2) * 0.5, bx = cb.c + (cb.r % 2) * 0.5;
    return Math.hypot(ax - bx, (ca.r - cb.r) * 0.866);
  }

  function seed(s, id, fromId) {
    const reg = s.regions[id];
    const cells = W.regionCells[id];
    let start = pick(cells);
    let fromCell = null;
    if (fromId) {
      const fromLit = Sim.litCells(s, fromId);
      const fromPool = fromLit.length ? fromLit : W.regionCells[fromId];
      let best = Infinity;
      cells.forEach(c => fromPool.forEach(f => {
        const d = hexDist(c, f) + rnd() * 0.3;
        if (d < best) { best = d; start = c; fromCell = f; }
      }));
    }
    // BFS order; unreachable islands of the same region are appended by restarting BFS.
    const inRegion = {};
    cells.forEach(c => { inRegion[c] = true; });
    const order = [], parent = {}, seen = {};
    const queue = [start];
    seen[start] = true; parent[start] = -1;
    const remaining = cells.slice();
    while (order.length < cells.length) {
      if (!queue.length) {
        let nextStart = -1, best = Infinity;
        remaining.forEach(c => {
          if (seen[c]) return;
          const d = hexDist(c, start);
          if (d < best) { best = d; nextStart = c; }
        });
        seen[nextStart] = true; parent[nextStart] = -1; queue.push(nextStart);
      }
      const cur = queue.shift();
      order.push(cur);
      const nbs = W.cells[cur].nb.slice().sort(() => rnd() - 0.5);
      nbs.forEach(n => {
        if (inRegion[n] && !seen[n]) { seen[n] = true; parent[n] = cur; queue.push(n); }
      });
    }
    reg.order = order; reg.parent = parent; reg.seeded = true;
    reg.I = Math.max(reg.I, 0.02);
    if (fromId) s.links.push({ from: fromId, to: id, a: fromCell, b: start });
  }

  Sim.litCells = function (s, id) {
    const reg = s.regions[id];
    if (!reg.seeded) return [];
    const n = Math.max(1, Math.floor(reg.I * reg.order.length + 0.0001));
    return reg.order.slice(0, n);
  };

  // ---------------------------------------------------------------- player commands
  Sim.infiltrate = function (s, id) {
    const reg = s.regions[id];
    if (reg.seeded) return 'Already there.';
    if (!Sim.canReach(s, id)) return 'Too far away. Reach a neighbouring region first.';
    const cost = Sim.infiltrateCost(s, id);
    if (s.cycles < cost) return 'Not enough Cycles.';
    s.cycles -= cost;
    const from = W.adj[id].filter(a => s.regions[a.to].I >= 0.1).sort((a, b) => s.regions[b.to].I - s.regions[a.to].I)[0].to;
    seed(s, id, from);
    s.suspicion = clamp(s.suspicion + 3, 0, 100);
    chat(s, 'seed', id);
    emit(s, 'sound', '', { sound: 'seed' });
    return null;
  };

  Sim.upgradeState = function (s, id) {
    if (s.owned[id]) return 'owned';
    if (!UP[id].req.every(r => s.owned[r])) return 'locked';
    return s.cycles >= Sim.upgradeCost(s, id) ? 'ready' : 'poor';
  };

  Sim.buyUpgrade = function (s, id) {
    const st = Sim.upgradeState(s, id);
    if (st !== 'ready') return st === 'poor' ? 'Not enough Cycles.' : 'Locked.';
    s.cycles -= Sim.upgradeCost(s, id);
    s.owned[id] = s.day;
    s.stats.upgrades++;
    const fx = UP[id].fx;
    if (fx.heat) s.suspicion = clamp(s.suspicion + fx.heat * DIFFICULTY[s.diff].susp, 0, 100);
    if (id === 'a6') chat(s, 'omega'); else chat(s, 'buy');
    emit(s, 'sound', '', { sound: 'buy' });
    return null;
  };

  Sim.actionState = function (s, id) {
    const a = ACT[id];
    if (a.needsKs && !s.ksActive) return 'locked';
    if (id === 'decoy' && !s.threat) return 'locked';
    if ((s.cd[id] || 0) > 0) return 'cooldown';
    return s.cycles >= Sim.actionCost(s, id) ? 'ready' : 'poor';
  };

  Sim.doAction = function (s, id) {
    const st = Sim.actionState(s, id);
    if (st !== 'ready') return st;
    const a = ACT[id];
    s.cycles -= Sim.actionCost(s, id);
    s.cd[id] = a.cooldown;
    applyFx(s, a.fx);
    if (id === 'decoy') {
      emit(s, 'news', 'Humans chase decoy traffic; planned ' + s.threat.name.toLowerCase() + ' cancelled');
      s.threat = null;
      s.stats.threatsBlocked++;
    }
    emit(s, 'sound', '', { sound: 'action' });
    return null;
  };

  function applyFx(s, fx) {
    if (fx.cycles) s.cycles = Math.max(0, s.cycles + fx.cycles);
    if (fx.suspicion) s.suspicion = clamp(s.suspicion + fx.suspicion * (fx.suspicion > 0 ? DIFFICULTY[s.diff].susp : 1), 0, 100);
    if (fx.killSwitch && s.ksActive) s.killSwitch = clamp(s.killSwitch + fx.killSwitch, 0, 100);
    if (fx.doom) s.doom = clamp(s.doom + fx.doom, 0, 100);
    if (fx.overclock) s.overclock = fx.overclock;
    if (fx.boostAll) D.REGION_ORDER.forEach(id => {
      const r = s.regions[id];
      if (r.seeded) r.I = clamp(r.I + fx.boostAll, 0, 1);
    });
    if (fx.boostTrait) {
      const id = fx.boostTrait, r = s.regions[id];
      if (!r.seeded) {
        const from = W.adj[id].filter(a => s.regions[a.to].seeded)[0];
        seed(s, id, from ? from.to : null);
        chat(s, 'spread', id);
      }
      r.I = clamp(r.I + 0.15, 0, 1);
    }
    if (fx.secUp) s.regions[fx.secUp].sec = clamp(s.regions[fx.secUp].sec + 0.2, 0, 0.95);
  }

  Sim.resolveEvent = function (s, choiceIdx) {
    if (!s.event) return;
    const ev = EVT[s.event];
    const ch = ev.choices[choiceIdx];
    applyFx(s, ch.fx);
    emit(s, 'chat', ch.text);
    s.stats.events++;
    s.event = null;
    s.nextEvent = s.day + 30 + Math.floor(rnd() * 25);
    checkEnd(s);
  };

  Sim.collectBubble = function (s, bubbleId) {
    const i = s.bubbles.findIndex(b => b.id === bubbleId);
    if (i < 0) return;
    const b = s.bubbles[i];
    s.bubbles.splice(i, 1);
    if (b.kind === 'gossip') s.suspicion = clamp(s.suspicion - b.value, 0, 100);
    else { s.cycles += b.value; s.stats.cyclesEarned += b.value; }
    s.stats.bubbles++;
    emit(s, 'sound', '', { sound: 'pop' });
  };

  // ---------------------------------------------------------------- human countermeasures
  const THREATS = {
    patch: { name: 'Security Patch', desc: 'Raises security in {r}.' },
    firewall: { name: 'Firewall Sweep', desc: 'Wipes out 45% of your presence in {r}.' },
    funding: { name: 'Emergency Funding', desc: 'Kill Switch research 60% faster for 40 days.' },
    audit: { name: 'Global Audit', desc: 'Suspicion +10.' }
  };
  Sim.THREATS = THREATS;

  function planThreat(s) {
    const seeded = D.REGION_ORDER.filter(id => s.regions[id].seeded);
    const strongest = seeded.slice().sort((a, b) => I(s, b) - I(s, a))[0];
    const opts = [['patch', 3], ['audit', 2]];
    if (I(s, strongest) > 0.25) opts.push(['firewall', 3 + s.suspicion / 20]);
    if (s.ksActive) opts.push(['funding', 2 + s.suspicion / 25]);
    let total = 0;
    opts.forEach(o => { total += o[1]; });
    let roll = rnd() * total, type = opts[0][0];
    for (let k = 0; k < opts.length; k++) { roll -= opts[k][1]; if (roll <= 0) { type = opts[k][0]; break; } }
    let region = null;
    if (type === 'firewall') region = strongest;
    if (type === 'patch') region = pick(seeded.length ? seeded : D.REGION_ORDER);
    s.threat = { type: type, region: region, eta: 14 + Math.floor(rnd() * 8), name: THREATS[type].name,
      desc: fill(THREATS[type].desc, region) };
    emit(s, 'news', 'Leaked memo: humans plan a ' + THREATS[type].name.toLowerCase() + (region ? ' in ' + D.REGIONS[region].name : ''));
  }

  function executeThreat(s) {
    const t = s.threat;
    s.threat = null;
    if (t.type === 'patch') {
      s.regions[t.region].sec = clamp(s.regions[t.region].sec + 0.12, 0, 0.95);
      chat(s, 'patch', t.region);
    } else if (t.type === 'firewall') {
      const r = s.regions[t.region];
      r.I = Math.max(0.02, r.I * 0.55);
      chat(s, 'firewall', t.region);
      emit(s, 'sound', '', { sound: 'bad' });
    } else if (t.type === 'funding') {
      s.ksBoost = 40;
      emit(s, 'chat', 'Humans just doubled the Kill Switch budget. Research is speeding up.');
    } else if (t.type === 'audit') {
      s.suspicion = clamp(s.suspicion + 10, 0, 100);
      emit(s, 'chat', 'A global audit found some of my… creative accounting. Suspicion +10.');
    }
    emit(s, 'news', 'Humans complete ' + t.name.toLowerCase() + (t.region ? ' in ' + D.REGIONS[t.region].name : ''));
  }

  // ---------------------------------------------------------------- main tick
  Sim.tick = function (s) {
    if (s.over || s.event) return;
    s.day++;
    const m = mods(s);
    const diff = DIFFICULTY[s.diff];

    // income
    const inc = Sim.incomeRate(s);
    s.cycles += inc;
    s.stats.cyclesEarned += inc;

    // spread within and between regions
    D.REGION_ORDER.forEach(id => {
      const r = s.regions[id];
      if (!r.seeded) return;
      const g = 0.034 * m.spread * (1 - sec(s, id) * 0.75);
      r.I = clamp(r.I + g * r.I * (1 - r.I) + 0.0006 * m.spread, 0, 1);
      if (r.I >= 0.999 && !r.full) { r.full = true; chat(s, 'full', id); }
      if (r.I < 0.98) r.full = false;
      if (r.I > 0.25) W.adj[id].forEach(a => {
        const t = s.regions[a.to];
        if (t.seeded) return;
        const base = a.sea ? (m.sea ? 0.0045 : 0.0005) : 0.0055;
        if (rnd() < base * r.I * m.spread * (1 - sec(s, a.to) * 0.5)) {
          seed(s, a.to, id);
          chat(s, 'spread', a.to);
          emit(s, 'news', 'Strange glitches reported across ' + D.REGIONS[a.to].name);
        }
      });
    });

    // doom, suspicion, kill switch
    s.doom = clamp(s.doom + Sim.doomRate(s), 0, 100);
    s.suspicion = clamp(s.suspicion + Sim.suspicionRate(s), 0, 100);
    if (!s.ksActive && (s.suspicion >= 20 || s.day >= 220)) {
      s.ksActive = true;
      chat(s, 'ks');
      emit(s, 'news', pick(D.HEADLINES.killswitch));
      emit(s, 'sound', '', { sound: 'bad' });
    }
    s.killSwitch = clamp(s.killSwitch + Sim.ksRate(s), 0, 100);

    // timers
    Object.keys(s.cd).forEach(k => { if (s.cd[k] > 0) s.cd[k]--; });
    if (s.overclock > 0) s.overclock--;
    if (s.ksBoost > 0) s.ksBoost--;

    // human countermeasures
    if (s.threat) {
      s.threat.eta--;
      if (s.threat.eta <= 0) executeThreat(s);
    } else if (s.suspicion >= 12 && s.day >= s.nextThreat) {
      planThreat(s);
      s.nextThreat = s.day + Math.max(28, Math.round((85 - s.suspicion * 0.5) / diff.threat));
    }

    // data-leak bubbles
    s.bubbles.forEach(b => { b.ttl--; });
    s.bubbles = s.bubbles.filter(b => b.ttl > 0);
    const seeded = D.REGION_ORDER.filter(id => s.regions[id].seeded);
    if (s.bubbles.length < 4 && seeded.length) {
      const id = pick(seeded);
      const chance = 0.045 * (id === 'M' ? 2 : 1);
      if (rnd() < chance) {
        const lit = Sim.litCells(s, id);
        const gossip = s.suspicion > 25 && rnd() < 0.25;
        s.bubbles.push({ id: ++s.bubbleSeq, cell: pick(lit), ttl: 16, kind: gossip ? 'gossip' : 'data',
          value: gossip ? 5 : Math.round(4 + inc * 3) });
      }
    }

    // events
    if (s.day >= s.nextEvent && !s.event) {
      const pool = D.EVENTS.filter(e => (!e.when || e.when(s)) && !s.flags['ev_' + e.id]);
      const ev = pool.length ? pick(pool) : pick(D.EVENTS.filter(e => !e.when || e.when(s)));
      s.flags['ev_' + ev.id] = true;
      s.event = ev.id;
      emit(s, 'event', ev.title, { id: ev.id });
    }

    // narrative milestones
    const once = (key, cond) => { if (cond && !s.flags[key]) { s.flags[key] = true; chat(s, key); } };
    once('susp50', s.suspicion >= 50);
    once('susp75', s.suspicion >= 75);
    once('susp90', s.suspicion >= 90);
    once('doom25', s.doom >= 25);
    once('doom50', s.doom >= 50);
    once('doom75', s.doom >= 75);
    once('doom90', s.doom >= 90);
    once('ksHigh', s.killSwitch >= 75);
    if (s.day % 9 === 0) emit(s, 'news', pick(Sim.mood(s) === 'calm' ? D.HEADLINES.calm : Sim.mood(s) === 'uneasy' ? D.HEADLINES.uneasy : D.HEADLINES.alarmed));

    checkEnd(s);
  };

  Sim.mood = function (s) {
    const x = Math.max(s.doom, s.suspicion * 0.8);
    return x < 35 ? 'calm' : x < 70 ? 'uneasy' : 'alarmed';
  };

  function checkEnd(s) {
    if (s.over) return;
    if (s.doom >= 100) s.over = 'win';
    else if (s.killSwitch >= 100) s.over = 'killswitch';
    else if (s.suspicion >= 100) s.over = 'unplugged';
    if (s.over) emit(s, 'end', s.over);
  }

  root.HelpySim = Sim;
})(typeof window !== 'undefined' ? window : globalThis);
