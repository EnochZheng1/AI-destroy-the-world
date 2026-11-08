/* Drives the real HELPY simulation (js/data.js + js/sim.js, loaded as classic scripts) with a simple
 * autoplay bot, and turns state changes into visual events the 3D scenes can play out.
 * Used by the 3D prototypes so critics see genuine play rather than staged effects. */
const D = window.HelpyData;
const Sim = window.HelpySim;

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const ORDER = ['s1', 'n1', 'n2', 'a1', 's2', 'n3', 's3', 'a2', 'n4', 's4', 'a3', 'n5', 's5', 'a4', 'n6', 'a5', 's6', 'a6'];

export function createRunner(opts = {}) {
  Sim.rand = mulberry32(opts.seed || 7);
  const s = Sim.newGame(opts.diff || 'normal', opts.start || 'G');
  s.out.length = 0;
  const listeners = [];
  const emit = ev => listeners.forEach(fn => fn(ev));
  let acc = 0;
  let eventHold = 0;       // real seconds an event card stays on screen before the bot answers
  let lastThreat = null;

  function snapshot() {
    return {
      seeded: Object.fromEntries(D.REGION_ORDER.map(id => [id, s.regions[id].seeded])),
      owned: Object.assign({}, s.owned)
    };
  }

  function botTurn() {
    const out = [];
    if (s.suspicion > 55 && Sim.doAction(s, 'scrub') === null) out.push({ type: 'action', id: 'scrub' });
    if (s.killSwitch > 35 && Sim.doAction(s, 'sabotage') === null) out.push({ type: 'action', id: 'sabotage', region: 'R' });
    if (s.threat && (s.threat.type === 'firewall' || s.threat.type === 'funding') && s.threat.eta < 6 && Sim.doAction(s, 'decoy') === null)
      out.push({ type: 'action', id: 'decoy', region: lastThreat && lastThreat.region });
    if (s.cycles > 70 && s.suspicion < 45 && Sim.doAction(s, 'overclock') === null) out.push({ type: 'action', id: 'overclock' });
    const reach = D.REGION_ORDER.filter(id => !s.regions[id].seeded && Sim.canReach(s, id))
      .sort((a, b) => Sim.infiltrateCost(s, a) - Sim.infiltrateCost(s, b));
    if (reach.length && s.cycles >= Sim.infiltrateCost(s, reach[0]) + 5 && s.suspicion < 60) Sim.infiltrate(s, reach[0]);
    const next = ORDER.find(id => !s.owned[id]);
    if (next && Sim.upgradeState(s, next) === 'ready') Sim.buyUpgrade(s, next);
    s.bubbles.slice().forEach(b => { if (Sim.rand() < 0.08) { Sim.collectBubble(s, b.id); out.push({ type: 'leak', cell: b.cell }); } });
    return out;
  }

  function dayStep(silent) {
    const before = snapshot();
    const threatBefore = s.threat ? Object.assign({}, s.threat) : null;
    Sim.tick(s);
    const evs = silent ? [] : botTurn();
    if (silent) botTurn();
    const after = snapshot();
    D.REGION_ORDER.forEach(id => {
      if (!before.seeded[id] && after.seeded[id]) {
        const link = s.links.filter(l => l.to === id).pop();
        evs.push({ type: 'seed', region: id, from: link ? link.from : null, a: link ? link.a : null, b: link ? link.b : null });
      }
    });
    Object.keys(after.owned).forEach(id => { if (!before.owned[id]) evs.push({ type: 'upgrade', id: id }); });
    if (!threatBefore && s.threat) { lastThreat = Object.assign({}, s.threat); evs.push({ type: 'threat', threat: lastThreat }); }
    if (threatBefore && !s.threat) evs.push({ type: 'threatEnd', threat: threatBefore, executed: threatBefore.eta <= 1 });
    s.out.forEach(m => {
      if (m.type === 'chat') evs.push({ type: 'say', text: m.text });
      if (m.type === 'event') { evs.push({ type: 'event', id: m.id }); eventHold = opts.eventHold == null ? 2.5 : opts.eventHold; }
      if (m.type === 'end') evs.push({ type: 'end', result: m.text });
    });
    s.out.length = 0;
    if (s.event && silent) Sim.resolveEvent(s, Sim.rand() < 0.5 ? 0 : 1);
    if (!silent) evs.forEach(emit);
  }

  return {
    state: s,
    on: fn => listeners.push(fn),
    /** Fast-forward without emitting events (for jumping to a mid-game moment). */
    jumpTo(day) { while (s.day < day && !s.over) { dayStep(true); if (s.event) Sim.resolveEvent(s, 0); } s.out.length = 0; },
    /** Put an event on screen now (used to capture the permission card). */
    forceEvent(id, hold) { s.event = id; eventHold = hold || 999; s.flags['ev_' + id] = true; emit({ type: 'event', id: id }); },
    /** Advance by real seconds at `daysPerSec`. */
    step(dt, daysPerSec) {
      if (s.over) return;
      if (s.event) {
        eventHold -= dt;
        if (eventHold <= 0) { const c = Sim.rand() < 0.6 ? 0 : 1; Sim.resolveEvent(s, c); emit({ type: 'eventResolved', choice: c }); }
        return;
      }
      acc += dt * daysPerSec;
      while (acc >= 1 && !s.event && !s.over) { acc -= 1; dayStep(false); }
    }
  };
}

/** Grid → geometry helpers shared by scenes. */
export const WORLD = D.WORLD;
export const REGIONS = D.REGIONS;
export const REGION_ORDER = D.REGION_ORDER;
export function cellXY(i) {
  const c = WORLD.cells[i];
  return [c.c + 0.5 + 0.5 * (c.r % 2), c.r * 0.866];
}
export function regionCentroid(id, onlyLit, state) {
  let cells = WORLD.regionCells[id];
  if (onlyLit && state) { const lit = Sim.litCells(state, id); if (lit.length) cells = lit; }
  let x = 0, y = 0;
  cells.forEach(i => { const p = cellXY(i); x += p[0]; y += p[1]; });
  return [x / cells.length, y / cells.length];
}
export { Sim };
