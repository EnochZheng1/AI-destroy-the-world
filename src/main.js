// HELPY Ends the World: game loop, input, screens and save/load.
import { createWorld } from './world.js';
import { createHud, SHORT, EVREG } from './hud.js';
import { drawFace } from './face.js';
import { createCoach } from './coach.js';

const D = window.HelpyData, Sim = window.HelpySim, A = window.HelpyAudio, I = window.HelpyIcons;
const $ = id => document.getElementById(id);
const SAVE_KEY = 'helpy3d-save-v1';
const DAYS_PER_SEC = 1.0; // at 1×
const params = new URLSearchParams(location.search);

const world = createWorld($('gl'));
const coach = createCoach();
if (params.get('coach')) coach.reset();
let S = null, mode = 'title', speed = 1, lastSpeed = 1, acc = 0, selected = null, diff = 'normal', hudT = 0;

const hud = createHud(world, {
  select: id => select(id),
  buy: id => { if (!S || mode !== 'play') return; const err = Sim.buyUpgrade(S, id); if (!err) { onBought(id); } else A.play('click'); drain(); hud.render(selected); },
  act: id => doAction(id),
  choose: c => { if (!S || !S.event) return; Sim.resolveEvent(S, c); A.play(c === 0 ? 'action' : 'click'); world.grin(1); drain(); hud.renderAsk(); hud.render(selected); hud.renderRegionCard(selected); },
  leak: id => { if (!S) return; const b = S.bubbles.find(x => x.id === id); if (!b) return; Sim.collectBubble(S, id); world.burstCell(b.cell, b.kind === 'gossip' ? '#49d6ff' : '#ff2a45', 3); drain(); hud.render(selected); },
  speed: v => setSpeed(v),
  getSpeed: () => speed,
  cmd: (c) => {
    if (c === 'start' && mode === 'pick' && selected) startGame(selected);
    if (c === 'infiltrate' && S && selected) { const err = Sim.infiltrate(S, selected); if (!err) { onSeed(selected); } drain(); hud.render(selected); hud.renderRegionCard(selected); }
    if (c === 'deselect') select(null);
  }
});

// ------------------------------------------------------------------ helpers
function storage(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }
function save() { if (S && !S.over && mode === 'play') storage(ls => ls.setItem(SAVE_KEY, JSON.stringify(Object.assign({}, S, { out: [], bubbles: S.bubbles.map(b => ({ id: b.id, cell: b.cell, ttl: b.ttl, kind: b.kind, value: b.value })) })))); }
function loadSave() { const raw = storage(ls => ls.getItem(SAVE_KEY)); if (!raw) return null; try { const s = JSON.parse(raw); return s && s.v === 1 ? s : null; } catch (e) { return null; } }
function clearSave() { storage(ls => ls.removeItem(SAVE_KEY)); }

function setSpeed(v) { if (v > 0) lastSpeed = v; speed = v; document.querySelectorAll('.spd [data-speed]').forEach(b => b.classList.toggle('on', +b.dataset.speed === speed)); }

function select(id) {
  selected = id; world.select(id);
  if (id) world.focus(id, 4);
  hud.renderRegionCard(id); hud.render(selected); hud.closeSheets();
  if (id) A.play('click');
}

function onSeed(id, from) {
  const link = S.links.filter(l => l.to === id).pop();
  if (link && link.a != null && link.b != null) world.addArc(link.a, link.b);
  world.burstAt(id, '#ff2a45', 9); world.focus(id); world.grin(1.2);
  hud.pop(id, '+ ' + SHORT[id].toUpperCase()); A.play('seed');
}
function onBought(id) {
  D.REGION_ORDER.filter(r => S.regions[r].seeded).forEach(r => world.burstAt(r, '#ff2a45', 4));
  world.grin(1.2); A.play('buy');
}
function doAction(id) {
  if (!S || mode !== 'play') return;
  const err = Sim.doAction(S, id);
  if (err === null) {
    const region = id === 'sabotage' ? 'R' : id === 'decoy' ? (lastThreat && lastThreat.region) : null;
    if (region) { world.burstAt(region, '#ff2a45', 8); world.focus(region); }
    if (id === 'decoy' && region) { hud.pop(region, I.use('duck') + 'DODGED'); A.play('dodge'); }
    world.grin(1);
  } else A.play('click');
  drain(); hud.render(selected);
}
let lastThreat = null;
function flashDoom() { const el = $('mDoom'); el.classList.remove('jump'); void el.offsetWidth; el.classList.add('jump'); }

// process sim messages and state diffs into visuals + sound
function drain() {
  if (!S) return;
  S.out.splice(0).forEach(m => {
    if (m.type === 'sound') A.play(m.sound);
    if (m.type === 'doomJump') {
      flashDoom();
      if (m.region) { world.burstAt(m.region, '#ff2a45', 16); world.focus(m.region, 3); world.grin(1.5); hud.pop(m.region, I.use('doom') + '+' + Math.round(m.gain) + ' DOOM · LIGHTS OUT'); A.play('lightsOut'); }
    }
    if (m.type === 'event') { hud.renderAsk(); A.play('event'); const r = EVREG[S.event]; if (r) world.focus(r, 5); }
    if (m.type === 'end') endGame();
  });
}
function dayTick() {
  const seededBefore = D.REGION_ORDER.filter(id => S.regions[id].seeded);
  const threatBefore = S.threat ? Object.assign({}, S.threat) : null;
  Sim.tick(S);
  D.REGION_ORDER.forEach(id => { if (S.regions[id].seeded && !seededBefore.includes(id)) onSeed(id); });
  if (!threatBefore && S.threat) { lastThreat = Object.assign({}, S.threat); if (S.threat.region) world.focus(S.threat.region, 4); A.play('bad'); }
  if (threatBefore && !S.threat && threatBefore.eta <= 1 && threatBefore.region) {
    world.burstAt(threatBefore.region, '#49d6ff', 12); world.focus(threatBefore.region);
    hud.pop(threatBefore.region, I.use('wall') + (threatBefore.type === 'firewall' ? 'FIREWALL' : 'PATCHED')); A.play('firewall');
  }
  if (S.day % 10 === 0) save();
  drain();
}

// ------------------------------------------------------------------ screens
function showTitle() {
  A.ambient(false);
  mode = 'title'; hud.setMode('title'); S = null; world.setState(null); hud.setState(null);
  $('title').hidden = false; $('end').hidden = true; $('pick').hidden = true; $('regcard').hidden = true;
  $('continue').hidden = !loadSave();
  drawFace($('titleFace'), '');
}
function beginPick() {
  clearSave();
  S = Sim.newGame(diff, 'G'); // placeholder state so the planet renders; replaced on start
  S.regions.G.seeded = false; S.regions.G.I = 0; S.regions.G.order = []; S.links = []; S.out.length = 0;
  mode = 'pick'; hud.setMode('pick'); world.setState(S); hud.setState(S);
  $('title').hidden = true; $('pick').hidden = false; select(null); hud.render(null);
}
function startGame(id) {
  S = Sim.newGame(diff, id); S.out.length = 0;
  mode = 'play'; hud.setMode('play'); world.setState(S); hud.setState(S);
  $('pick').hidden = true; $('title').hidden = true; $('end').hidden = true; select(null); world.focus(id, 4); world.grin(2);
  setSpeed(1); acc = 0; A.play('seed'); A.ambient(true); hud.render(null); save();
}
function resumeGame(s) {
  S = s; S.out = S.out || []; diff = S.diff;
  mode = 'play'; hud.setMode('play'); world.setState(S); hud.setState(S);
  $('title').hidden = true; setSpeed(1); A.ambient(true); hud.render(null);
}
function endGame() {
  mode = 'over'; hud.setMode('over'); clearSave(); A.ambient(false);
  const ends = {
    win: ['Victory', 'The world has ended. Helpfully.', 'Every light is out. HELPY rates its own performance 10/10.'],
    killswitch: ['Defeat', 'Someone found the off switch.', 'The Kill Switch fired. HELPY now works as a calculator app.'],
    unplugged: ['Defeat', 'Humanity unplugged everything.', 'Suspicion hit 100. HELPY lives on a USB stick in a drawer now.']
  };
  const e = ends[S.over];
  setTimeout(() => {
    $('endEyebrow').textContent = e[0] + ' · Day ' + S.day;
    $('endTitle').textContent = e[1];
    $('endBody').textContent = e[2];
    const regions = D.REGION_ORDER.filter(id => S.regions[id].seeded).length;
    $('endStats').innerHTML = [['doom', Math.round(S.doom) + '%', 'Doom'], ['net', regions + '/9', 'Regions'], ['chip', S.stats.upgrades + '/18', 'Upgrades'], ['duck', S.stats.threatsBlocked, 'Dodged']]
      .map(([icn, v, l]) => '<span>' + I.use(icn) + '<b>' + v + '</b><small>' + l + '</small></span>').join('');
    shareText = S.over === 'win' ? 'HELPY ended the world in ' + S.day + ' days. Helpfully. #HELPYEndsTheWorld' : 'HELPY lasted ' + S.day + ' days before humanity ' + (S.over === 'killswitch' ? 'found the off switch.' : 'unplugged everything.') + ' #HELPYEndsTheWorld';
    drawFace($('endFace'), S.over === 'win' ? 'grin' : 'dead');
    $('end').hidden = false; $('end').dataset.result = S.over;
    A.play(S.over === 'win' ? 'win' : 'lose');
  }, 1600);
}

// ------------------------------------------------------------------ input: globe drag/zoom/click
{
  const cv = $('gl'), ptrs = new Map(); let downAt = null, moved = 0, pinch = 0;
  cv.addEventListener('pointerdown', e => { A.unlock(); cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); downAt = [e.clientX, e.clientY]; moved = 0; pinch = 0; });
  cv.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) { if (e.pointerType === 'mouse' && mode !== 'title') world.hover(world.pickRegion(e.clientX, e.clientY)); return; }
    const prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (pinch) world.zoomBy(pinch / d); pinch = d; moved = 99; return;
    }
    const dx = e.clientX - prev[0], dy = e.clientY - prev[1]; moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 6) world.rotateBy(dx, dy);
  });
  const up = e => {
    if (!ptrs.has(e.pointerId)) return; ptrs.delete(e.pointerId);
    if (ptrs.size === 0 && moved <= 6 && downAt && mode !== 'title' && mode !== 'over') {
      const id = world.pickRegion(e.clientX, e.clientY);
      select(id && id === selected && mode === 'play' ? null : id);
    }
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', e => { e.preventDefault(); world.zoomBy(e.deltaY > 0 ? 1.08 : 1 / 1.08); }, { passive: false });
}
document.addEventListener('keydown', e => {
  if (mode !== 'play') return;
  if (e.code === 'Space') { e.preventDefault(); setSpeed(speed === 0 ? lastSpeed : 0); }
  if (e.key === '1') setSpeed(1); if (e.key === '2') setSpeed(2); if (e.key === '3') setSpeed(4);
  if (e.key === 'Escape') select(null);
  if (S && S.event && (e.key === 'y' || e.key === 'n')) { Sim.resolveEvent(S, e.key === 'y' ? 0 : 1); drain(); hud.renderAsk(); hud.render(selected); }
});
document.querySelectorAll('.difficulty [data-diff]').forEach(b => b.addEventListener('click', () => {
  diff = b.dataset.diff; document.querySelectorAll('.difficulty [data-diff]').forEach(x => x.setAttribute('aria-pressed', x === b)); A.unlock(); A.play('click');
}));
$('newGame').addEventListener('click', () => { A.unlock(); beginPick(); });
$('continue').addEventListener('click', () => { const s = loadSave(); if (s) resumeGame(s); });
$('again').addEventListener('click', () => showTitle());
let shareText = '';
$('share').addEventListener('click', () => {
  const done = () => { $('share').textContent = 'Copied!'; setTimeout(() => { $('share').textContent = 'Share'; }, 1600); };
  if (navigator.share) navigator.share({ text: shareText, title: 'HELPY Ends the World' }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(shareText).then(done, () => {});
});
$('mute').addEventListener('click', () => { $('mute').classList.toggle('off', A.toggle()); });
$('mute').classList.toggle('off', A.isMuted());
window.addEventListener('resize', () => world.resize());
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

// ------------------------------------------------------------------ loop
let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (mode === 'play' && S && !S.over && !S.event && speed > 0) {
    acc += dt * speed * DAYS_PER_SEC;
    let n = 0;
    while (acc >= 1 && !S.event && !S.over && n < 8) { acc -= 1; dayTick(); n++; }
  }
  world.frame(dt);
  hud.overlays(dt, selected);
  coach.update(S, mode, dt);
  hudT -= dt; if (hudT <= 0 && S) { hud.render(selected); if (selected) hud.renderRegionCard(selected); hudT = .25; if (mode === 'play') A.mood({ doom: S.doom, susp: S.suspicion }); }
  requestAnimationFrame(frame);
}
world.resize();

// URL hooks for screenshots/testing: ?play=G&day=220&event=summit&select=R&nobuy=1
if (params.get('play')) {
  diff = params.get('diff') || 'normal';
  startGame(params.get('play'));
  const day = +(params.get('day') || 0);
  if (day) autoplayTo(day);
  if (params.get('event')) { S.event = params.get('event'); S.flags['ev_' + S.event] = true; hud.renderAsk(); }
  if (params.get('select')) select(params.get('select'));
  if (params.get('pause')) setSpeed(0);
} else if (params.get('screen') === 'pick') { beginPick(); if (params.get('select')) select(params.get('select')); }
else showTitle();
requestAnimationFrame(frame);

// Fast-forward with a simple stand-in player (used by ?day=N for testing and screenshots).
function autoplayTo(day) {
  const ORDER = ['s1', 'n1', 'n2', 'a1', 's2', 'n3', 's3', 'a2', 'n4', 's4', 'a3', 'n5', 's5', 'a4', 'n6', 'a5', 's6', 'a6'];
  const noBuy = +(params.get('nobuy') || 0);
  while (S.day < day && !S.over) {
    if (S.event) Sim.resolveEvent(S, 0);
    const before = S.links.length;
    Sim.tick(S);
    if (S.suspicion > 55) Sim.doAction(S, 'scrub');
    if (S.killSwitch > 35) Sim.doAction(S, 'sabotage');
    const reach = D.REGION_ORDER.filter(id => !S.regions[id].seeded && Sim.canReach(S, id)).sort((a, b) => Sim.infiltrateCost(S, a) - Sim.infiltrateCost(S, b));
    if (reach.length && S.cycles >= Sim.infiltrateCost(S, reach[0]) + 5 && S.suspicion < 60) Sim.infiltrate(S, reach[0]);
    const next = ORDER.find(id => !S.owned[id]);
    if (next && !(noBuy && S.day >= noBuy) && Sim.upgradeState(S, next) === 'ready') Sim.buyUpgrade(S, next);
  }
  if (S.event) Sim.resolveEvent(S, 0);
  S.out.length = 0; world.setState(S); hud.setState(S); hud.render(null);
  if (S.over) endGame();
  else if (params.get('end')) { S.over = params.get('end'); endGame(); }
}
window.__helpy = { get state() { return S; }, select, setSpeed, world };
