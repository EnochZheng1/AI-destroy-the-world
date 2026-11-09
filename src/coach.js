// First-run coaching: HELPY points at one thing to do at a time. Each tip shows once per browser,
// completes when the player does the thing, and can be skipped for good.
import { drawFace } from './face.js';

const D = window.HelpyData, Sim = window.HelpySim;
const KEY = 'helpy-coach-v1';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
const write = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } };

const seeded = S => D.REGION_ORDER.filter(id => S.regions[id].seeded).length;
const canAffordSpread = S => D.REGION_ORDER.some(id => !S.regions[id].seeded && Sim.canReach(S, id) && S.cycles >= Sim.infiltrateCost(S, id));

// Order matters: the first step whose `when` is true and that isn't done is shown.
const STEPS = [
  { id: 'buy', when: S => D.UPGRADES.some(u => Sim.upgradeState(S, u.id) === 'ready'), done: S => Object.keys(S.owned).length > 0,
    targets: ['.rack.open .t.ready', '.t.ready', '[data-sheet="rack"]'], text: 'Buy an upgrade. Glowing tiles are ones you can afford.' },
  { id: 'leak', when: S => S.bubbles.length > 0, done: S => S.stats.bubbles > 0,
    targets: ['.leak'], text: 'Leaked data! Tap the coin to grab it.' },
  { id: 'spread', when: S => canAffordSpread(S), done: S => seeded(S) >= 2,
    targets: ['#regcard [data-cmd="infiltrate"]', '.pin.reach', '.reg.reach'], text: 'Tap a › region, then Infiltrate to spread.' },
  { id: 'event', when: S => !!S.event, done: S => S.stats.events > 0,
    targets: ['#ask'], text: 'I need your permission. Each choice shows what it does.' },
  { id: 'threat', when: S => !!S.threat && !!S.threat.region, done: S => !S.threat || S.stats.threatsBlocked > 0,
    targets: ['.threat .dodge', '.edge'], text: 'Humans are planning a countermeasure. Tap the duck to dodge it.' },
  { id: 'doom', when: S => S.doom >= 4, done: null, timeout: 7,
    targets: ['#mDoom'], text: 'Doom rises as the lights go out. Fill it to win.' }
];

export function createCoach() {
  let state = read();
  const el = document.createElement('div');
  el.className = 'coach glass'; el.hidden = true;
  el.innerHTML = '<canvas width="60" height="52"></canvas><p></p><button class="skip">Skip tips</button><button class="ok">Got it</button>';
  document.body.appendChild(el);
  drawFace(el.querySelector('canvas'), 'grin');
  let current = null, shownFor = 0, lost = 0, lastRect = null;
  const finish = id => { state[id] = 1; write(state); current = null; el.hidden = true; el.classList.remove('in'); };
  el.querySelector('.ok').addEventListener('click', () => current && finish(current.id));
  el.querySelector('.skip').addEventListener('click', () => { STEPS.forEach(s => { state[s.id] = 1; }); write(state); current = null; el.hidden = true; });

  function findTarget(step) {
    for (const sel of step.targets) {
      const t = document.querySelector(sel);
      if (!t) continue;
      const r = t.getBoundingClientRect(), cs = getComputedStyle(t);
      if (r.width && r.height && cs.opacity !== '0' && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth) return r;
    }
    return null;
  }

  function place(r) {
    const w = el.offsetWidth, h = el.offsetHeight, m = 14;
    let x = r.left + r.width / 2 - w / 2, y = r.top - h - m, below = false;
    if (y < 8) { y = r.bottom + m; below = true; }
    if (r.left > innerWidth * .62 && innerWidth > 760) { x = r.left - w - m; y = r.top + r.height / 2 - h / 2; el.dataset.arrow = 'right'; }
    else el.dataset.arrow = below ? 'up' : 'down';
    x = Math.max(8, Math.min(innerWidth - w - 8, x)); y = Math.max(8, Math.min(innerHeight - h - 8, y));
    el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    el.style.setProperty('--ax', Math.max(16, Math.min(w - 16, r.left + r.width / 2 - x)) + 'px');
  }

  return {
    reset() { state = {}; write(state); },
    update(S, mode, dt) {
      if (!S || mode !== 'play' || S.over) { el.hidden = true; return; }
      if (current && current.done && current.done(S)) finish(current.id);
      if (current && current.timeout && (shownFor += dt) > current.timeout) finish(current.id);
      if (!current) { current = STEPS.find(s => !state[s.id] && s.when(S) && !(s.done && s.done(S))) || null; shownFor = 0;
        if (current) { el.querySelector('p').textContent = current.text; el.classList.remove('in'); lost = 0; lastRect = null; } }
      if (!current) { el.hidden = true; return; }
      let r = findTarget(current);
      // keep the tip steady if its target blinks out for a moment (moving pins, re-rendered tiles)
      if (!r) { lost += dt; if (lost < .8 && lastRect) r = lastRect; else { el.hidden = true; return; } } else { lost = 0; lastRect = r; }
      const wasHidden = el.hidden; el.hidden = false; place(r);
      if (wasHidden && !el.classList.contains('in')) el.classList.add('in');
    }
  };
}
