// HELPY Ends the World: game loop, input, screens and save/load.
import { createWorld } from './world.js';
import { createHud, SHORT, EVREG } from './hud.js';
import { drawFace } from './face.js';
import { createCoach } from './coach.js';
import { settings } from './settings.js';
import { telemetry } from './telemetry.js';
import { renderCard, shareText } from './share.js';
import { meta, TROPHIES } from './meta.js';

const D = window.HelpyData, Sim = window.HelpySim, A = window.HelpyAudio, I = window.HelpyIcons;
const $ = id => document.getElementById(id);
const SAVE_KEY = 'helpy3d-save-v1';
const DAYS_PER_SEC = 1.0; // at 1×
const params = new URLSearchParams(location.search);

const world = createWorld($('gl'));
const coach = createCoach({ onTip: (tip, how) => telemetry.track('tip_' + how, { tip, day: S ? S.day : 0 }) });
if (params.get('coach')) coach.reset();
let S = null, mode = 'title', speed = 1, lastSpeed = 1, acc = 0, selected = null, diff = 'normal', hudT = 0, model = 'omega';

// ------------------------------------------------------------------ seeded randomness (Daily world)
// A Daily world uses the same seed for everyone that day: same start, same events, same human countermeasures.
function makeRng(state) {
  const f = () => { state |= 0; state = state + 0x6D2B79F5 | 0; let t = Math.imul(state ^ state >>> 15, 1 | state); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  f.state = () => state; return f;
}
const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const hashStr = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

function hudCmd(c) { hudCallbacks.cmd(c); }
const hudCallbacks = {
  select: id => select(id),
  buy: id => { if (!S || mode !== 'play') return; const cost = Sim.upgradeCost(S, id); const err = Sim.buyUpgrade(S, id); if (!err) { onBought(id); telemetry.track('upgrade_bought', { upgrade: id, cost, day: S.day, doom: Math.round(S.doom), suspicion: Math.round(S.suspicion) }); } else A.play('click'); drain(); hud.render(selected); },
  act: id => doAction(id),
  choose: c => { if (!S || !S.event) return; telemetry.track('event_choice', { event: S.event, choice: c === 0 ? 'allow' : 'deny', day: S.day }); Sim.resolveEvent(S, c); A.play(c === 0 ? 'action' : 'click'); world.grin(1); drain(); hud.renderAsk(); hud.render(selected); hud.renderRegionCard(selected); },
  leak: id => { if (!S) return; const b = S.bubbles.find(x => x.id === id); if (!b) return; Sim.collectBubble(S, id); telemetry.track('leak_grabbed', { kind: b.kind, day: S.day }); world.burstCell(b.cell, b.kind === 'gossip' ? '#49d6ff' : '#ff2a45', 3); drain(); hud.render(selected); },
  speed: v => setSpeed(v),
  getSpeed: () => speed,
  cmd: (c) => {
    if (c === 'start' && mode === 'pick' && selected) startGame(selected);
    if (c === 'infiltrate' && S && selected) { const cost = Sim.infiltrateCost(S, selected); const err = Sim.infiltrate(S, selected); if (!err) { onSeed(selected); telemetry.track('region_infiltrated', { region: selected, cost, day: S.day, how: 'manual' }); } drain(); hud.render(selected); hud.renderRegionCard(selected); }
    if (c === 'deselect') select(null);
  }
};
const hud = createHud(world, hudCallbacks);

// ------------------------------------------------------------------ helpers
function storage(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }
function save() { if (S && !S.over && mode === 'play' && Sim.rand.state) S.rngState = Sim.rand.state(); if (S && !S.over && mode === 'play') storage(ls => ls.setItem(SAVE_KEY, JSON.stringify(Object.assign({}, S, { out: [], bubbles: S.bubbles.map(b => ({ id: b.id, cell: b.cell, ttl: b.ttl, kind: b.kind, value: b.value })) })))); }
function loadSave() { const raw = storage(ls => ls.getItem(SAVE_KEY)); if (!raw) return null; try { const s = JSON.parse(raw); return s && s.v === 1 ? s : null; } catch (e) { return null; } }
function clearSave() { storage(ls => ls.removeItem(SAVE_KEY)); }

function setSpeed(v) { if (v > 0) lastSpeed = v; speed = v; document.querySelectorAll('.spd [data-speed]').forEach(b => b.classList.toggle('on', +b.dataset.speed === speed)); $('spdCycle').textContent = v ? v + '×' : '❚❚'; }
$('spdCycle').addEventListener('click', () => setSpeed({ 1: 2, 2: 4, 4: 0, 0: 1 }[speed]));

function select(id) {
  selected = id; world.select(id);
  if (id) world.focus(id, 4);
  hud.renderRegionCard(id); hud.render(selected); if (innerWidth < 760) hud.closeSheets();
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
    telemetry.track('action_used', { action: id, day: S.day, suspicion: Math.round(S.suspicion), kill_switch: Math.round(S.killSwitch) });
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
      if (m.region) { telemetry.track('region_taken', { region: m.region, day: S.day, doom: Math.round(S.doom) }); world.burstAt(m.region, '#ff2a45', 16); world.focus(m.region, 3); world.grin(1.5); hud.pop(m.region, I.use('doom') + '+' + Math.round(m.gain) + ' DOOM · LIGHTS OUT'); A.play('lightsOut'); }
    }
    if (m.type === 'event') { hud.renderAsk(); A.play('event'); const r = EVREG[S.event]; if (r) world.focus(r, 5); }
    if (m.type === 'end') endGame();
  });
}
function dayTick() {
  const seededBefore = D.REGION_ORDER.filter(id => S.regions[id].seeded);
  const threatBefore = S.threat ? Object.assign({}, S.threat) : null;
  Sim.tick(S);
  S.peak = S.peak || { s: 0, k: 0 }; S.peak.s = Math.max(S.peak.s, S.suspicion); S.peak.k = Math.max(S.peak.k, S.killSwitch);
  D.REGION_ORDER.forEach(id => { if (S.regions[id].seeded && !seededBefore.includes(id)) { onSeed(id); telemetry.track('region_infiltrated', { region: id, day: S.day, how: 'spread' }); } });
  if (!threatBefore && S.threat) { telemetry.track('threat_planned', { type: S.threat.type, region: S.threat.region || null, day: S.day }); lastThreat = Object.assign({}, S.threat); if (S.threat.region) world.focus(S.threat.region, 4); A.play('bad'); }
  if (threatBefore && !S.threat && threatBefore.eta <= 1) telemetry.track('threat_landed', { type: threatBefore.type, region: threatBefore.region || null, day: S.day });
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
  renderTitleMeta();
}
function beginPick() {
  clearSave();
  S = Sim.newGame(diff, 'G'); // placeholder state so the planet renders; replaced on start
  S.regions.G.seeded = false; S.regions.G.I = 0; S.regions.G.order = []; S.links = []; S.out.length = 0;
  mode = 'pick'; hud.setMode('pick'); world.setState(S); hud.setState(S);
  $('title').hidden = true; $('pick').hidden = false; select(null); hud.render(null);
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
}
let runStarted = 0;
function runProps() { return { difficulty: S.diff, model: S.model || 'omega', daily: S.daily || null, start_region: S.start || null }; }
function startGame(id, daily) {
  if (!daily && !meta.modelUnlocked(model)) model = 'omega';
  S = Sim.newGame(diff, id, model); S.out.length = 0; S.start = id; if (daily) S.daily = daily; runStarted = performance.now();
  mode = 'play'; hud.setMode('play'); world.setState(S); hud.setState(S);
  $('pick').hidden = true; $('title').hidden = true; $('end').hidden = true; select(null); world.focus(id, 4); world.grin(2);
  setSpeed(1); acc = 0; A.play('seed'); A.ambient(true); hud.render(null); save();
  telemetry.setBase(runProps()); telemetry.track('game_start', runProps());
}
function resumeGame(s) {
  S = s; S.out = S.out || []; diff = S.diff; model = S.model || 'omega';
  Sim.rand = S.daily && S.rngState != null ? makeRng(S.rngState) : Math.random;
  mode = 'play'; hud.setMode('play'); world.setState(S); hud.setState(S);
  $('title').hidden = true; setSpeed(1); A.ambient(true); hud.render(null);
  runStarted = performance.now(); telemetry.setBase(runProps()); telemetry.track('game_resume', { day: S.day });
}
function endGame() {
  mode = 'over'; hud.setMode('over'); clearSave(); A.ambient(false);
  const unlocked = meta.record(S);
  unlocked.trophies.forEach(t => telemetry.track('trophy_unlocked', { trophy: t.id, day: S.day }));
  unlocked.models.forEach(m => telemetry.track('model_unlocked', { model: m }));
  telemetry.track('game_end', Object.assign(runProps(), { result: S.over, day: S.day, doom: Math.round(S.doom), suspicion: Math.round(S.suspicion), kill_switch: Math.round(S.killSwitch),
    regions: D.REGION_ORDER.filter(id => S.regions[id].seeded).length, regions_taken: D.REGION_ORDER.filter(id => S.regions[id].I >= .99).length,
    upgrades: S.stats.upgrades, owned: Object.keys(S.owned).join(','), dodged: S.stats.threatsBlocked, events: S.stats.events, leaks: S.stats.bubbles,
    minutes: Math.round((performance.now() - runStarted) / 6000) / 10 }));
  telemetry.flush();
  const ends = {
    win: ['Victory', 'The world has ended. Helpfully.', 'Every light is out. HELPY rates its own performance 10/10.'],
    killswitch: ['Defeat', 'Someone found the off switch.', 'The Kill Switch fired. HELPY now works as a calculator app.'],
    unplugged: ['Defeat', 'Humanity unplugged everything.', 'Suspicion hit 100. HELPY lives on a USB stick in a drawer now.']
  };
  const e = ends[S.over];
  setTimeout(() => {
    const M = D.MODELS.find(m => m.id === (S.model || 'omega'));
    $('endEyebrow').textContent = e[0] + ' · Day ' + S.day + ' · ' + (S.daily ? 'Daily ' + S.daily : M.name);
    $('endTitle').textContent = e[1];
    $('endBody').textContent = e[2];
    const regions = D.REGION_ORDER.filter(id => S.regions[id].seeded).length;
    $('endStats').innerHTML = [['doom', Math.round(S.doom) + '%', 'Doom'], ['net', regions + '/9', 'Regions'], ['chip', S.stats.upgrades + '/18', 'Upgrades'], ['duck', S.stats.threatsBlocked, 'Dodged']]
      .map(([icn, v, l]) => '<span>' + I.use(icn) + '<b>' + v + '</b><small>' + l + '</small></span>').join('');
    renderEndNew(unlocked);
    endShot = world.snapshot();
    drawFace($('endFace'), S.over === 'win' ? 'grin' : 'dead');
    $('end').hidden = false; $('end').dataset.result = S.over;
    A.play(S.over === 'win' ? 'win' : 'lose');
  }, 2600);
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
  if (e.target.closest && e.target.closest('input, textarea, select')) return;
  if (e.key === 'Escape') { if (!$('trophies').hidden) { closeTrophies(); return; } if (!$('settings').hidden) { closeSettings(); return; } if (!$('sharesheet').hidden) { $('sharesheet').hidden = true; return; } }
  if (e.key === '?') { openSettings(true); return; }
  if (!$('settings').hidden || !$('trophies').hidden) return;
  if (mode === 'play' || mode === 'pick') {
    const step = { ArrowLeft: [-40, 0], ArrowRight: [40, 0], ArrowUp: [0, -30], ArrowDown: [0, 30] }[e.key];
    if (step && !e.target.closest('button')) { e.preventDefault(); world.rotateBy(step[0], step[1]); return; }
    if (e.key === '+' || e.key === '=') world.zoomBy(1 / 1.12);
    if (e.key === '-' || e.key === '_') world.zoomBy(1.12);
    if (e.key === 'r' || e.key === 'R') { const o = D.REGION_ORDER, i = o.indexOf(selected); select(o[(i + (e.shiftKey ? o.length - 1 : 1) + (i < 0 && e.shiftKey ? 1 : 0)) % o.length]); }
  }
  if (mode === 'pick' && e.key === 'Enter' && selected && !e.target.closest('button')) startGame(selected);
  if (mode !== 'play') return;
  if (e.key === 'i' || e.key === 'I') hudCmd('infiltrate');
  if (e.key === 'u' || e.key === 'U') hud.toggleSheet('rack');
  const act = { z: 'scrub', x: 'sabotage', c: 'overclock', v: 'decoy' }[e.key.toLowerCase()];
  if (act && !e.ctrlKey && !e.metaKey) doAction(act);
  if (e.code === 'Space') { e.preventDefault(); setSpeed(speed === 0 ? lastSpeed : 0); }
  if (e.key === '1') setSpeed(1); if (e.key === '2') setSpeed(2); if (e.key === '3') setSpeed(4);
  if (e.key === 'Escape') { if (document.querySelector('.rack.open,.regions.open')) hud.closeSheets(); else select(null); }
  if (S && S.event && (e.key === 'y' || e.key === 'n')) { telemetry.track('event_choice', { event: S.event, choice: e.key === 'y' ? 'allow' : 'deny', day: S.day, via: 'key' }); Sim.resolveEvent(S, e.key === 'y' ? 0 : 1); drain(); hud.renderAsk(); hud.render(selected); }
});
document.querySelectorAll('.difficulty [data-diff]').forEach(b => b.addEventListener('click', () => {
  diff = b.dataset.diff; document.querySelectorAll('.difficulty [data-diff]').forEach(x => x.setAttribute('aria-pressed', x === b)); A.unlock(); A.play('click');
}));
$('newGame').addEventListener('click', () => { A.unlock(); Sim.rand = Math.random; beginPick(); });
$('daily').addEventListener('click', () => { A.unlock(); startDaily(); });
document.querySelectorAll('.models [data-model]').forEach(b => b.addEventListener('click', () => {
  if (!meta.modelUnlocked(b.dataset.model)) { b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); A.play('click'); return; }
  model = b.dataset.model; document.querySelectorAll('.models [data-model]').forEach(x => x.setAttribute('aria-pressed', x === b)); A.unlock(); A.play('click');
}));
function startDaily() {
  const key = todayKey(), seed = hashStr('helpy-' + key);
  Sim.rand = makeRng(seed);
  diff = 'normal'; model = 'omega';
  const starts = ['G', 'T', 'S', 'M', 'B', 'P'];
  startGame(starts[seed % starts.length], key);
}
$('continue').addEventListener('click', () => { const s = loadSave(); if (s) resumeGame(s); });
$('again').addEventListener('click', () => showTitle());
// ------------------------------------------------------------------ trophies, unlocks, streak
const MODEL_SUB = {};
document.querySelectorAll('.models [data-model]').forEach(b => { MODEL_SUB[b.dataset.model] = b.querySelector('small').textContent; });
function renderTitleMeta() {
  if (!meta.modelUnlocked(model)) model = 'omega';
  document.querySelectorAll('.models [data-model]').forEach(b => {
    const id = b.dataset.model, open = meta.modelUnlocked(id);
    b.classList.toggle('locked', !open); b.setAttribute('aria-disabled', !open); b.setAttribute('aria-pressed', id === model);
    b.querySelector('small').textContent = open ? MODEL_SUB[id] : '🔒 ' + meta.unlockHint(id);
  });
  const st = meta.streak();
  $('streak').hidden = st < 1; $('streak').textContent = '🔥' + st;
  $('trophyBtn').textContent = '🏆 ' + meta.count() + '/' + TROPHIES.length;
}
function renderTrophies() {
  const list = meta.trophies();
  $('trophyCount').textContent = list.filter(t => t.got).length + '/' + list.length;
  $('trophyGrid').innerHTML = list.map(t => '<div class="tro' + (t.got ? ' got' : '') + '">' + I.use(t.got ? t.icon : 'lock') + '<b>' + t.name + '</b><small>' + t.how + '</small></div>').join('');
  $('modelUnlocks').innerHTML = D.MODELS.filter(m => m.id !== 'omega').map(m => '<span class="' + (meta.modelUnlocked(m.id) ? 'on' : '') + '">' + (meta.modelUnlocked(m.id) ? '✓ ' : '🔒 ') + m.name + (meta.modelUnlocked(m.id) ? '' : ': ' + meta.unlockHint(m.id)) + '</span>').join('');
}
let trophiesReturn = null;
function openTrophies() { trophiesReturn = document.activeElement; renderTrophies(); $('trophies').hidden = false; $('trophies').querySelector('.x').focus(); telemetry.track('trophies_opened', { count: meta.count() }); }
function closeTrophies() { $('trophies').hidden = true; if (trophiesReturn && trophiesReturn.focus) trophiesReturn.focus(); }
document.querySelectorAll('[data-open-trophies]').forEach(b => b.addEventListener('click', openTrophies));
document.querySelector('[data-close-trophies]').addEventListener('click', closeTrophies);
function renderEndNew(u) {
  const bits = u.trophies.map(t => '<span class="nt">' + I.use(t.icon) + '<b>' + t.name + '</b></span>')
    .concat(u.models.map(id => '<span class="nm">' + I.use('omega') + '<b>' + D.MODELS.find(m => m.id === id).name + ' unlocked</b></span>'));
  if (S.daily) {
    const y = meta.yesterday(), st = meta.streak();
    bits.push('<span class="nd">' + (st > 1 ? '🔥' + st + ' days' : 'Daily done') + (y ? ' · yesterday: ' + (y.r === 'win' ? 'won day ' + y.d : 'lost day ' + y.d) : '') + '</span>');
  }
  $('endNew').innerHTML = bits.join(''); $('endNew').hidden = !bits.length;
}

// ------------------------------------------------------------------ share sheet
let endShot = null, cardBlob = null;
$('share').addEventListener('click', async () => {
  if (!S || !S.over) return;
  $('shareText').textContent = shareText(S);
  $('sharesheet').hidden = false; $('shareImg').removeAttribute('src');
  const card = await renderCard(S, endShot);
  $('shareImg').src = card.toDataURL('image/png');
  cardBlob = await new Promise(res => card.toBlob(res, 'image/png'));
  const file = cardBlob && new File([cardBlob], 'helpy-result.png', { type: 'image/png' });
  $('shareNative').hidden = !(navigator.share && (!file || !navigator.canShare || navigator.canShare({ files: [file] })));
  telemetry.track('share_opened', { result: S.over, day: S.day, daily: S.daily || null });
});
$('shareNative').addEventListener('click', () => {
  const file = cardBlob && new File([cardBlob], 'helpy-result.png', { type: 'image/png' });
  const data = { text: shareText(S), title: 'HELPY Ends the World' };
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file];
  navigator.share(data).then(() => telemetry.track('share_done', { method: data.files ? 'native_image' : 'native_text' })).catch(() => {});
});
$('shareDownload').addEventListener('click', () => {
  if (!cardBlob) return;
  const a = document.createElement('a'); a.href = URL.createObjectURL(cardBlob); a.download = 'helpy-result' + (S.daily ? '-' + S.daily : '') + '.png';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  telemetry.track('share_done', { method: 'download' });
});
$('shareCopy').addEventListener('click', () => {
  const txt = shareText(S), ok = () => { $('shareCopy').textContent = 'Copied!'; setTimeout(() => { $('shareCopy').textContent = 'Copy text'; }, 1600); telemetry.track('share_done', { method: 'copy' }); };
  if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, () => selectText($('shareText'))); else selectText($('shareText'));
});
// inside a Claude artifact the viewer blocks downloads: offer copy instead
if (window.claude) $('shareDownload').hidden = true;
function selectText(el) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
document.querySelector('[data-close-share]').addEventListener('click', () => { $('sharesheet').hidden = true; });
$('mute').addEventListener('click', () => { $('mute').classList.toggle('off', A.toggle()); telemetry.track('setting_changed', { setting: 'sound', value: A.isMuted() ? 'off' : 'on' }); });
$('mute').classList.toggle('off', A.isMuted());
window.addEventListener('resize', () => world.resize());
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

// ------------------------------------------------------------------ loop
let last = performance.now();
const perfStats = [];
window.__perf = () => { const q = world.getQuality(); const avg = k => perfStats.reduce((a, s) => a + s[k], 0) / Math.max(1, perfStats.length); return { quality: q, fps: 1000 / avg('dt'), frameMs: avg('frame'), syncMs: avg('sync'), renderMs: avg('render'), hudMs: avg('hud') }; };
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (mode === 'play' && S && !S.over && !S.event && speed > 0) {
    acc += dt * speed * DAYS_PER_SEC;
    let n = 0;
    while (acc >= 1 && !S.event && !S.over && n < 8) { acc -= 1; dayTick(); n++; }
  }
  const tf = performance.now();
  world.frame(dt);
  const th = performance.now();
  hud.overlays(dt, selected);
  coach.update(S, mode, dt);
  const te = performance.now();
  perfStats.push({ frame: te - tf, sync: world.timing.sync, render: world.timing.render, hud: te - th, dt: dt * 1000 });
  if (perfStats.length > 240) perfStats.shift();
  adaptQuality(dt);
  hudT -= dt; if (hudT <= 0 && S) { hud.render(selected); if (selected) hud.renderRegionCard(selected); hudT = .25; if (mode === 'play') A.mood({ doom: S.doom, susp: S.suspicion }); }
  requestAnimationFrame(frame);
}
// Quality: 'auto' starts phones on medium and steps down if frames run slow; players can force a level.
const QKEY = 'helpy-quality', QLEVELS = ['auto', 'high', 'medium', 'low'];
let qPref = params.get('quality') || storage(ls => ls.getItem(QKEY)) || 'auto';
if (!QLEVELS.includes(qPref)) qPref = 'auto';
let qCheckT = 4;
function applyQuality() {
  const start = qPref === 'auto' ? (innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4 ? 'medium' : 'high') : qPref;
  world.setQuality(start); syncSettingsUi();
}
function adaptQuality(dt) {
  if (qPref !== 'auto' || mode !== 'play') return;
  qCheckT -= dt; if (qCheckT > 0) return; qCheckT = 3;
  const recent = perfStats.slice(-90); if (recent.length < 60) return;
  const avg = recent.reduce((a, s) => a + s.dt, 0) / recent.length;
  const cur = world.getQuality();
  if (avg > 22 && cur !== 'low') { world.setQuality(cur === 'high' ? 'medium' : 'low'); syncSettingsUi(); telemetry.track('quality_auto_lowered', { to: world.getQuality(), fps: Math.round(1000 / avg) }); }
}
// ------------------------------------------------------------------ settings panel
function syncSettingsUi() {
  const v = { sound: A.isMuted() ? 'off' : 'on', graphics: qPref, colors: settings.get('colors'), motion: settings.get('motion'), telemetry: settings.get('telemetry') ? 'on' : 'off' };
  document.querySelectorAll('#settings [data-setting]').forEach(row => row.querySelectorAll('[data-v]').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v[row.dataset.setting])));
  $('gfxNow').textContent = qPref === 'auto' ? 'now ' + world.getQuality() : '';
  $('dataRow').hidden = !(telemetry.configured() || params.get('telemetry') === 'debug');
  $('mute').classList.toggle('off', A.isMuted());
}
let settingsReturn = null;
function openSettings(keys) {
  settingsReturn = document.activeElement; syncSettingsUi(); $('settings').hidden = false; if (keys) $('keysHelp').open = true;
  ($('settings').querySelector('[aria-pressed="true"]') || $('settings').querySelector('button')).focus();
}
function closeSettings() { $('settings').hidden = true; if (settingsReturn && settingsReturn.focus) settingsReturn.focus(); }
document.querySelectorAll('[data-open-settings]').forEach(b => b.addEventListener('click', () => openSettings()));
document.querySelector('[data-close-settings]').addEventListener('click', closeSettings);
$('settings').addEventListener('click', e => {
  const b = e.target.closest('[data-v]'), row = b && b.closest('[data-setting]');
  if (row) {
    const k = row.dataset.setting, v = b.dataset.v;
    if (k === 'sound' && (v === 'off') !== A.isMuted()) A.toggle();
    if (k === 'graphics') { qPref = v; storage(ls => ls.setItem(QKEY, qPref)); applyQuality(); }
    if (k === 'colors') settings.set('colors', v);
    if (k === 'motion') settings.set('motion', v);
    if (k === 'telemetry') { if (v === 'off') telemetry.track('consent_withdrawn'); telemetry.flush(); telemetry.setConsent(v === 'on'); }
    if (k !== 'telemetry') telemetry.track('setting_changed', { setting: k, value: v });
    A.play('click'); syncSettingsUi();
  }
  if (e.target.closest('[data-reset-tips]')) { coach.reset(); e.target.textContent = 'Tips reset'; }
});
document.querySelectorAll('[data-whatsent]').forEach(b => b.addEventListener('click', () => {
  if ($('settings').hidden) openSettings(); $('whatSent').hidden = !$('whatSent').hidden; $('whatSent').scrollIntoView({ block: 'nearest' });
}));
function applyLook() {
  document.body.dataset.palette = settings.get('colors');
  world.setPalette(settings.get('colors'));
  const rm = settings.reducedMotion(); document.body.classList.toggle('reduce-motion', rm); world.setReducedMotion(rm);
  hud.refresh(); coach.redraw(); drawFace($('titleFace'), ''); drawFace($('face'), '');
}
settings.on(k => { if (k === 'colors' || k === 'motion') applyLook(); });
// consent: asked once, on the title screen, only if analytics are configured
function maybeAskConsent() {
  if (!telemetry.needsConsent()) return;
  drawFace($('consentFace'), 'grin'); $('consent').hidden = false;
}
document.querySelectorAll('[data-consent]').forEach(b => b.addEventListener('click', () => {
  telemetry.setConsent(b.dataset.consent === 'yes'); $('consent').hidden = true; syncSettingsUi();
  if (b.dataset.consent === 'yes') telemetry.track('session_start', { referrer_host: document.referrer ? new URL(document.referrer).host : null });
}));
// once a minute while playing: frame rate and quality, to see where the game struggles
setInterval(() => { if (mode === 'play' && !document.hidden) { const p = window.__perf(); telemetry.track('perf_sample', { fps: Math.round(p.fps), frame_ms: Math.round(p.frameMs * 10) / 10, quality: p.quality, day: S && S.day }); } }, 60000);
window.addEventListener('pagehide', () => { if (mode === 'play' && S && !S.over) { telemetry.track('game_quit', { day: S.day, doom: Math.round(S.doom), suspicion: Math.round(S.suspicion), kill_switch: Math.round(S.killSwitch) }); telemetry.flush(true); } });
world.resize();
applyQuality();
applyLook();
telemetry.track('session_start', { referrer_host: document.referrer ? (() => { try { return new URL(document.referrer).host; } catch (e) { return null; } })() : null });

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
else if (params.has('daily')) { showTitle(); startDaily(); }
else { showTitle(); telemetry.ready.then(() => { if (mode === 'title') maybeAskConsent(); syncSettingsUi(); }); }
telemetry.ready.then(() => { if (telemetry.destination() === 'artifact') $('whatSent').textContent = $('whatSent').textContent.replace('to PostHog', "to this page's owner, stored in its Claude artifact database"); });
if (params.get('poster')) { document.body.classList.add('poster'); world.setPoster(true); setSpeed(0); }
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
