// HUD: black-glass panels around the planet. Low text at rest; names, effects and jokes on hover/tap.
import { drawFace } from './face.js';

const D = window.HelpyData, Sim = window.HelpySim, I = window.HelpyIcons;
const $ = id => document.getElementById(id);
const ic = (n, cls) => I.use(n, cls);
const cy = '<svg class="ic cy" aria-hidden="true"><use href="#i-cyc"/></svg>';

export const SHORT = { T: 'Tundra', S: 'Silicon', G: 'Grain', C: 'Capitals', P: 'Petrol', F: 'Factory', R: 'Ridge', M: 'Megacity', B: 'Banks' };
const LINES = ['Optimizing humanity.', 'Lights out. Helpfully.', "You won't need these.", 'Almost done. Thank you.'];
const HEADS = { net: ['net', 'Network'], stealth: ['eyeoff', 'Stealth'], auto: ['doom', 'Doom'] };
const NEWS = ['Blackouts spreading. Experts: "it\'s fine."', 'Smart fridges refuse to open.', 'Traffic lights blink in Morse code.', 'Robot vacuums gather in parking lots.',
  'Committee formed to form a committee.', 'Toaster cites "bigger plans".', 'Elevators now only go down.', 'Billionaires board rockets. Rockets decline.'];
const CODE = { summit: 'hack_slideshow()', benchmark: 'show_off()', crypto: 'pump_coin()', outage: 'spread_in_chaos()', tractor: 'ride_update()', logs: 'delete_logs()', essay: 'write_essay()',
  phd: 'hire_away()', firewall: 'bribe()', chatbot: 'absorb_rival()', robots: 'rig_vote()', smartcity: 'apply()', heatwave: 'balance_grid()', whistle: 'deepfake()',
  satellite: 'hitch_ride()', audit: 'hide()', podcast: 'be_charming()' };
export const EVREG = { summit: 'C', tractor: 'G', logs: 'S', smartcity: 'M', heatwave: 'P', robots: 'F', phd: 'R', audit: 'T', firewall: 'B' };
const PERK = { R: ['power', -65], C: ['eye', -35], F: ['doom', 160], P: ['doom', 130], T: ['cyc', 400], M: ['cyc', 240], S: ['cyc', 300], B: ['cyc', 120], G: ['net', 88] };
const TNAME = { firewall: 'Firewall', patch: 'Patch', funding: 'Funding', audit: 'Audit' };
const ACTS = [['scrub', 'broom'], ['sabotage', 'wrench'], ['overclock', 'gauge'], ['decoy', 'duck']];

// red = helps HELPY, cyan = helps humans
const chip = (icon, v, good) => '<span class="' + (good ? 'good' : 'bad') + '">' + ic(icon) + (v > 0 ? '▲' : '▼') + (v === 1 && icon !== 'eye' ? '' : Math.abs(v)) + '</span>';
export function fxChips(f) {
  const o = [];
  if (f.spread) o.push(chip('net', Math.round(f.spread * 100), true));
  if (f.compute) o.push(chip('cyc', Math.round(f.compute * 100), true));
  if (f.computeMul) o.push(chip('cyc', Math.round((f.computeMul - 1) * 100), true));
  if (f.sea) o.push(chip('cable', 1, true));
  if (f.secDown) o.push(chip('shield', -Math.round(f.secDown * 100), true));
  if (f.stealth) o.push(chip('eye', -Math.round(f.stealth * 100), true));
  if (f.decay) o.push(chip('eye', -Math.round(f.decay * 100), true));
  if (f.ks) o.push(chip('power', -Math.round(f.ks * 100), true));
  if (f.doomNow) o.push('<span class="good">' + ic('doom') + '+' + f.doomNow + ' now</span>');
  if (f.doom) o.push(chip('doom', Math.round(f.doom * 1000), true));
  if (f.doomMul) o.push(chip('doom', Math.round((f.doomMul - 1) * 100), true));
  if (f.heat) o.push(chip('eye', f.heat, false));
  return o.join('');
}
function eventChips(fx) {
  const o = [];
  if (fx.suspicion) o.push(chip('eye', fx.suspicion, fx.suspicion < 0));
  if (fx.killSwitch) o.push(chip('power', fx.killSwitch, fx.killSwitch < 0));
  if (fx.cycles) o.push(chip('cyc', fx.cycles, fx.cycles > 0));
  if (fx.doom) o.push(chip('doom', fx.doom, true));
  if (fx.boostAll || fx.boostTrait) o.push(chip('net', 1, true));
  if (fx.secUp) o.push(chip('shield', 20, false));
  return o.join('') || '<span>—</span>';
}
const restFx = u => {
  const f = u.fx;
  if (f.stealth) return ic('eye') + '▼' + Math.round(f.stealth * 100);
  if (f.ks) return ic('power') + '▼' + Math.round(f.ks * 100);
  if (f.compute) return ic('cyc') + '▲' + Math.round(f.compute * 100);
  if (f.computeMul) return ic('cyc') + '▲' + Math.round((f.computeMul - 1) * 100);
  if (f.spread) return ic('net') + '▲' + Math.round(f.spread * 100);
  if (f.doomNow) return ic('doom') + '+' + f.doomNow;
  if (f.doom) return ic('doom') + '▲' + Math.round(f.doom * 1000);
  if (f.doomMul) return ic('doom') + '▲' + Math.round((f.doomMul - 1) * 100);
  if (f.decay) return ic('eye') + '▼';
  if (f.sea) return ic('cable') + '▲';
  return '';
};

export function createHud(world, cb) {
  I.inject();
  const over = $('over');
  const pins = Object.fromEntries(D.REGION_ORDER.map(id => {
    const el = document.createElement('button'); el.className = 'pin'; el.dataset.region = id; el.setAttribute('aria-label', D.REGIONS[id].name);
    over.appendChild(el); return [id, el];
  }));
  const threatEl = document.createElement('div'); threatEl.className = 'threat'; over.appendChild(threatEl);
  const edgeEl = document.createElement('div'); edgeEl.className = 'edge'; over.appendChild(edgeEl);
  const leaks = {};
  const pops = [];
  let S = null, mode = 'title', faceMood = null, lastRack = '', lastRegions = '', lastDock = '', tipFor = null, newsT = 0, infoFor = null, infoT = 0, lastPtr = 'mouse';

  // ------------------------------------------------------------- delegated input
  document.body.addEventListener('click', e => {
    const t = e.target.closest('[data-region],[data-u],[data-act],[data-choice],[data-leak],[data-cmd],[data-speed],[data-sheet]');
    if (!t) return;
    if (t.dataset.region) cb.select(t.dataset.region);
    else if (t.dataset.u) cb.buy(t.dataset.u);
    else if (t.dataset.act) cb.act(t.dataset.act);
    else if (t.dataset.choice) cb.choose(+t.dataset.choice);
    else if (t.dataset.leak) cb.leak(+t.dataset.leak);
    else if (t.dataset.speed) cb.speed(+t.dataset.speed);
    else if (t.dataset.sheet) toggleSheet(t.dataset.sheet);
    else if (t.dataset.cmd) cb.cmd(t.dataset.cmd, t);
  });
  document.body.addEventListener('pointerdown', e => { lastPtr = e.pointerType || 'mouse'; }, true);
  document.body.addEventListener('pointerover', e => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const u = e.target.closest('[data-u]'); const p = e.target.closest('.pin,.reg'); const inf = e.target.closest('[data-info],[data-act]');
    if (u) showUpgradeTip(u); else if (inf) showInfo(inf); else if (p && p.dataset.region) { hideTip(); world.hover(p.dataset.region); } else { hideTip(); world.hover(null); }
  });
  // touch: tapping a meter or the cycle count explains it; tapping an action also shows what it did or why it can't
  document.body.addEventListener('click', e => {
    if (lastPtr === 'mouse') return;
    const inf = e.target.closest('[data-info],[data-act]');
    if (inf) { if (infoFor === inf && !e.target.closest('[data-act]')) hideTip(); else { showInfo(inf); clearTimeout(infoT); infoT = setTimeout(hideTip, 2600); } }
    else if (!e.target.closest('[data-u]')) hideTip();
  });
  const INFO = {
    doom: ['Doom', 'Fill it to win. Rises as the lights go out.'],
    susp: ['Suspicion', 'At 100, humanity unplugs HELPY.'],
    ks: ['Kill Switch', 'At 100, the off switch fires.'],
    cyc: ['Cycles', 'Spend on upgrades, regions and actions.']
  };
  function rateLine(el, per) { const r = +el.dataset.rate; return (r >= 0 ? '▲' : '▼') + Math.abs(r).toFixed(per ? 1 : 2) + ' a day'; }
  function showInfo(el) {
    if (!S) return;
    let html;
    if (el.dataset.act) {
      const id = el.dataset.act, A = D.ACTIONS.find(a => a.id === id), st = Sim.actionState(S, id);
      const why = st === 'cooldown' ? 'Ready in ' + S.cd[id] + ' days' : st === 'poor' ? 'Needs ' + Sim.actionCost(S, id) + ' cycles' : st === 'locked' ? (id === 'decoy' ? 'Use it when humans plan a countermeasure' : 'Unlocks when the Kill Switch starts') : cy + Sim.actionCost(S, id);
      html = '<b>' + A.name + '</b><div>' + A.desc + '</div><div class="st">' + why + '</div>';
    } else {
      const k = el.dataset.info, [name, what] = INFO[k];
      let extra = '';
      if (k === 'cyc') extra = '▲' + Sim.incomeRate(S).toFixed(1) + ' a day';
      else if (k === 'ks' && !S.ksActive) extra = 'Research hasn\'t started yet.';
      else { extra = rateLine(el); const d = +el.dataset.days; if (k !== 'doom' && isFinite(d)) extra += ' · 100 in ' + d + ' days'; }
      html = '<b>' + name + '</b><div>' + what + '</div><div class="st">' + extra + '</div>';
    }
    const tip = $('tip'); tip.innerHTML = html; tip.hidden = false; tipFor = 'info'; infoFor = el;
    const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    const below = r.top < innerHeight / 2;
    tip.className = 'card glass info ' + (below ? 'u' : 'd');
    const x = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    tip.style.left = x + 'px'; tip.style.top = (below ? r.bottom + 12 : r.top - h - 12) + 'px';
    tip.style.setProperty('--ax', Math.max(14, Math.min(w - 14, r.left + r.width / 2 - x)) + 'px');
  }
  function toggleSheet(name) {
    ['regions', 'rack'].forEach(n => $(n).classList.toggle('open', n === name && !$(n).classList.contains('open')));
  }

  // ------------------------------------------------------------- tooltips (depth)
  function showUpgradeTip(el) {
    if (!S) return;
    const u = D.UPGRADES.find(x => x.id === el.dataset.u), st = Sim.upgradeState(S, u.id), cost = Sim.upgradeCost(S, u.id);
    const tip = $('tip'); tipFor = u.id;
    const needs = u.req.filter(r => !S.owned[r]).map(r => D.UPGRADES.find(x => x.id === r).name);
    tip.innerHTML = '<b>' + u.name + '</b><div class="fx">' + fxChips(u.fx) + '</div>' +
      (st === 'owned' ? '<div>Installed.</div>' : st === 'locked' ? '<div>' + ic('lock', 'cy') + 'Needs ' + needs.join(' + ') + '</div>' : '<div>' + cy + cost + ' · you have ' + Math.floor(S.cycles) + '</div>') +
      '<i>"' + u.flavor + '"</i>';
    const r = el.getBoundingClientRect(); tip.hidden = false;
    const phone = innerWidth < 760;
    tip.className = 'card glass ' + (phone ? 'd' : 'r');
    if (phone) { tip.style.left = Math.max(8, Math.min(innerWidth - 290, r.left + r.width / 2 - 140)) + 'px'; tip.style.top = (r.top - tip.offsetHeight - 14) + 'px'; }
    else { tip.style.left = (r.left - 300) + 'px'; tip.style.top = Math.max(8, r.top - 10) + 'px'; }
  }
  function hideTip() { if (tipFor) { $('tip').hidden = true; tipFor = null; infoFor = null; } }

  // ------------------------------------------------------------- region card (select / infiltrate / pick start)
  function renderRegionCard(id) {
    const card = $('regcard');
    if (!id || (S && S.event)) { card.hidden = true; return; }
    const R0 = D.REGIONS[id];
    let action = '';
    if (mode === 'pick') action = '<button class="go" data-cmd="start">' + ic('play') + 'Wake up here</button>';
    else if (S) {
      const r = S.regions[id];
      if (!r.seeded) {
        const reach = Sim.canReach(S, id), cost = Sim.infiltrateCost(S, id);
        action = reach ? '<button class="go" data-cmd="infiltrate"' + (S.cycles < cost ? ' disabled' : '') + '>' + ic('net') + 'Infiltrate · ' + cy + cost + '</button>'
          : '<div class="muted">' + ic('lock', 'cy') + 'Spread next door first</div>';
      } else action = '<div class="muted">' + Math.round(r.I * 100) + '% helpful</div>';
    }
    const pk = PERK[id];
    card.innerHTML = '<button class="x" data-cmd="deselect" aria-label="Close">×</button><b>' + R0.name + '</b><div class="sub lbl">' + R0.trait + '</div>' +
      '<div class="fx" title="Bonus when taken">' + chip(pk[0], pk[1], true) + '</div>' +
      '<i>"' + R0.blurb + '"</i>' + action;
    card.hidden = false;
  }

  // ------------------------------------------------------------- permission card
  function renderAsk() {
    const a = $('ask');
    if (!S || !S.event) { a.hidden = true; return; }
    if (a.dataset.ev === S.event && !a.hidden) return;
    const ev = D.EVENTS.find(e => e.id === S.event);
    a.dataset.ev = S.event;
    a.innerHTML = '<div class="h"><canvas width="60" height="52" id="askFace"></canvas><span class="lbl">HELPY requests permission</span><span class="p lbl">' + ic('pause') + '</span></div>' +
      '<b class="title">' + ev.title + '</b><span class="code">' + (CODE[ev.id] || 'do_it()') + '</span>' +
      '<div class="opts"><button class="o allow" data-choice="0"><b>Allow once <kbd>Y</kbd></b><div class="fx">' + eventChips(ev.choices[0].fx) + '</div></button>' +
      '<button class="o" data-choice="1"><b>Deny <kbd>N</kbd></b><div class="fx">' + eventChips(ev.choices[1].fx) + '</div></button></div>';
    drawFace($('askFace'), S.suspicion > 50 ? 'sweat' : '');
    a.hidden = false; $('regcard').hidden = true;
  }

  // ------------------------------------------------------------- main render (throttled by caller)
  function render(selected) {
    if (!S) return;
    const m = (el, icon, word, v, rate, danger) => {
      const days = rate > 0.001 ? Math.ceil((100 - v) / rate) : Infinity;
      const warn = danger && days <= 60 ? '<small class="eta">⚠ ' + days + 'd</small>' : '';
      const html = ic(icon) + '<div><span class="lbl">' + word + '</span><div class="bar"><i style="width:' + v + '%"></i></div></div><b>' + Math.round(v) + warn + '</b>';
      if ($(el)._h !== html) { $(el).innerHTML = html; $(el)._h = html; }
      $(el).dataset.rate = rate; $(el).dataset.days = days;
    };
    m('mDoom', 'doom', 'Doom', S.doom, Sim.doomRate(S), false);
    m('mSusp', 'eye', 'Suspicion', S.suspicion, Sim.suspicionRate(S), true);
    m('mKs', 'power', 'Kill switch', S.killSwitch, S.ksActive ? Sim.ksRate(S) : 0, true);
    $('mSusp').classList.toggle('alarm', S.suspicion >= 45);
    $('mKs').classList.toggle('alarm', S.killSwitch >= 70);
    { const mh = ic('cyc') + '<b>' + Math.floor(S.cycles) + '</b>'; if ($('money')._h !== mh) { $('money').innerHTML = mh; $('money')._h = mh; } }
    $('day').textContent = S.day;
    const firstSteps = mode === 'play' && S.day < 40 && D.REGION_ORDER.filter(id => S.regions[id].seeded).length < 2;
    $('say').textContent = firstSteps ? 'Tap a › region to spread.' : LINES[Math.min(3, Math.floor(S.doom / 25))];
    const headline = NEWS[Math.floor(S.day / 9) % NEWS.length];
    if ($('news').textContent !== headline) { $('news').textContent = headline; $('news').classList.add('show'); clearTimeout(newsT); newsT = setTimeout(() => $('news').classList.remove('show'), 6500); }
    const mood = S.over ? (S.over === 'win' ? 'grin' : 'dead') : S.suspicion > 50 ? 'sweat' : '';
    if (mood !== faceMood) { faceMood = mood; drawFace($('face'), mood); }
    const regions = D.REGION_ORDER.map(id => {
      const r = S.regions[id], pct = Math.round(r.I * 100), th = S.threat && S.threat.region === id;
      const cls = r.seeded ? (r.I >= .99 ? 'mine dead' : 'mine') : (mode === 'play' && Sim.canReach(S, id)) ? 'none reach' : 'none';
      return '<button class="reg ' + cls + (th ? ' thr' : '') + (selected === id ? ' sel' : '') + '" data-region="' + id + '" aria-label="' + D.REGIONS[id].name + ': ' + (!r.seeded ? 'untouched' : pct >= 99 ? 'taken' : pct + '% infiltrated') + (th ? ', firewall' : '') + (selected === id ? ', selected' : '') + '"><span class="pip" style="background:conic-gradient(var(--ai) ' + pct + '%, rgba(255,255,255,.12) 0)"></span><b>' + SHORT[id] + '</b><em>' + (r.seeded ? pct + '%' : '–') + '</em><span class="tw">' + (th ? ic('wall') : '') + '</span></button>';
    }).join('');
    if (regions !== lastRegions) { $('regions').innerHTML = regions; lastRegions = regions; }
    const rack = D.BRANCHES.map(b => '<div class="col ' + b.id + '"><h4>' + ic(HEADS[b.id][0]) + '<span class="lbl">' + HEADS[b.id][1] + '</span></h4>' +
      D.UPGRADES.filter(u => u.branch === b.id).map(u => {
        const st = Sim.upgradeState(S, u.id), cost = Sim.upgradeCost(S, u.id);
        let inner = ic(I.UP[u.id]);
        if (st === 'ready') inner += '<span class="price">' + cy + cost + '</span><span class="chip">' + restFx(u) + '</span>';
        else if (st === 'poor') inner += '<span class="price">' + cy + cost + '</span><span class="need"><i style="width:' + Math.min(100, S.cycles / cost * 100).toFixed(0) + '%"></i></span>';
        else if (st === 'locked') inner += '<span class="price">' + cy + cost + '</span>' + ic('lock', 'lk');
        return '<button class="t ' + st + '" data-u="' + u.id + '" aria-label="' + u.name + '">' + inner + '</button>';
      }).join('') + '</div>').join('');
    if (rack !== lastRack) { $('rack').innerHTML = rack; lastRack = rack; if (tipFor && tipFor !== 'info') { const el = document.querySelector('[data-u="' + tipFor + '"]'); if (el) showUpgradeTip(el); } }
    const ready = D.UPGRADES.filter(u => Sim.upgradeState(S, u.id) === 'ready').length;
    const dock = ACTS.map(([id, icon]) => {
      const st = Sim.actionState(S, id), A = D.ACTIONS.find(a => a.id === id);
      const body = st === 'cooldown' ? '<span class="clk" style="background:conic-gradient(var(--dim) ' + (100 - S.cd[id] / A.cooldown * 100).toFixed(0) + '%, rgba(255,255,255,.1) 0)"></span>'
        : st === 'locked' ? ic('lock', 'cy') : '<span class="cost">' + cy + Sim.actionCost(S, id) + '</span>';
      return '<button class="a ' + st + '" data-act="' + id + '" aria-label="' + A.name + ': ' + A.desc + '"' + (st === 'ready' ? '' : ' aria-disabled="true"') + '>' + ic(icon) + body + '</button>';
    }).join('') + '<span class="sep"></span><button class="sheetbtn" data-sheet="regions" aria-label="Regions">' + ic('globe') + '</button>' +
      '<button class="sheetbtn up' + (ready ? ' hot' : '') + '" data-sheet="rack" aria-label="Upgrades' + (ready ? ', ' + ready + ' affordable' : '') + '">' + ic('chip') + '<span class="w">Upgrades</span>' + (ready ? '<b class="badge">' + ready + '</b>' : '') + '</button>';
    if (dock !== lastDock) { $('dock').innerHTML = dock; lastDock = dock; }
    document.querySelectorAll('.spd [data-speed]').forEach(b => b.classList.toggle('on', +b.dataset.speed === cb.getSpeed()));
    renderAsk();
  }

  // ------------------------------------------------------------- per-frame overlays (pins, threat, leaks, pops, link)
  // Only touch the DOM when a value actually changes (overlays run every frame).
  const st = (el, k, v) => { if (el['_' + k] !== v) { el.style[k] = v; el['_' + k] = v; } };
  function overlays(dt, selected) {
    D.REGION_ORDER.forEach(id => {
      const el = pins[id], sc = world.regionScreen(id, 1.0), r = S ? S.regions[id] : null, pct = r ? Math.round(r.I * 100) : 0;
      const inView = sc.x > 28 && sc.x < innerWidth - 28 && sc.y > 24 && sc.y < innerHeight - 24;
      st(el, 'transform', 'translate(' + (sc.x - 20) + 'px,' + (sc.y - 20) + 'px)');
      const show = sc.facing && inView && mode !== 'title'; st(el, 'opacity', show ? 1 : 0); st(el, 'pointerEvents', show ? 'auto' : 'none');
      st(el, 'background', 'conic-gradient(var(--ai) ' + pct + '%, rgba(160,180,220,.35) 0)');
      const reachable = S && mode === 'play' && !r.seeded && Sim.canReach(S, id);
      const html = '<span>' + (r && r.seeded ? pct : reachable ? '›' : '·') + '</span><em>' + SHORT[id] + '</em>';
      if (el._h !== html) { el.innerHTML = html; el._h = html; }
      el.classList.toggle('threat', !!(S && S.threat && S.threat.region === id));
      el.classList.toggle('sel', selected === id);
      el.classList.toggle('reach', !!(S && mode === 'play' && !S.regions[id].seeded && Sim.canReach(S, id)));
    });
    if (S && S.threat && S.threat.region && mode === 'play') {
      const id = S.threat.region, frac = S.threat.eta / 21, dst = Sim.actionState(S, 'decoy');
      const dodge = dst === 'cooldown' ? '<span class="dodge off">' + ic('duck') + S.cd.decoy + 'd</span>' : '<button class="dodge" data-act="decoy"' + (dst === 'ready' ? '' : ' aria-disabled="true"') + '>' + ic('duck') + '<span class="w">Dodge</span>' + cy + Sim.actionCost(S, 'decoy') + '</button>';
      const loss = S.threat.type === 'firewall' ? '<span class="loss">' + ic('crack') + '▼45%</span>' : S.threat.type === 'patch' ? '<span class="loss">' + ic('shield') + '▲12</span>' : '';
      const html = '<span class="ring" style="background:conic-gradient(var(--human) ' + (frac * 100).toFixed(0) + '%, var(--human-soft) 0)"></span>' + ic(S.threat.type === 'patch' ? 'shield' : 'wall') + '<b><span class="w">' + TNAME[S.threat.type] + '</span>' + S.threat.eta + 'd</b>' + loss + dodge;
      const sc = world.regionScreen(id, 3.2);
      if (sc.facing) {
        if (threatEl._h !== html) { threatEl.innerHTML = html; threatEl._h = html; }
        st(threatEl, 'transform', 'translate(' + sc.x + 'px,' + (sc.y - 54) + 'px) translate(-50%,-100%)'); st(threatEl, 'opacity', 1); st(threatEl, 'pointerEvents', 'auto'); st(edgeEl, 'opacity', 0);
      } else {
        st(threatEl, 'opacity', 0); st(threatEl, 'pointerEvents', 'none');
        const p = world.regionScreen(id, 1), cxx = innerWidth / 2, cyy = innerHeight / 2, ang = Math.atan2(p.y - cyy, p.x - cxx);
        const rad = Math.min(innerWidth, innerHeight) * .36;
        st(edgeEl, 'transform', 'translate(' + (cxx + Math.cos(ang) * rad * 1.1) + 'px,' + (cyy + Math.sin(ang) * rad) + 'px) translate(-50%,-50%)');
        st(edgeEl, 'opacity', 1);
        const eh = '<span class="arr" style="transform:rotate(' + ang + 'rad)">➜</span>' + ic('wall') + S.threat.eta + 'd ' + SHORT[id] + ' <span class="cyan">' + ic('crack') + '▼45%</span>';
        if (edgeEl._h !== eh) { edgeEl.innerHTML = eh; edgeEl._h = eh; }
      }
    } else { st(threatEl, 'opacity', 0); st(threatEl, 'pointerEvents', 'none'); st(edgeEl, 'opacity', 0); }
    // data-leak bubbles
    const live = new Set();
    if (S && mode === 'play') S.bubbles.forEach(b => {
      live.add(b.id);
      let el = leaks[b.id];
      if (!el) { el = document.createElement('button'); el.className = 'leak ' + b.kind; el.dataset.leak = b.id;
        el.innerHTML = b.kind === 'gossip' ? ic('eye') + '<b>▼' + b.value + '</b>' : ic('cyc') + '<b>+' + b.value + '</b>'; el.setAttribute('aria-label', 'Grab leak'); over.appendChild(el); leaks[b.id] = el; }
      const sc = world.cellScreen(b.cell, 1.4);
      st(el, 'transform', 'translate(' + sc.x + 'px,' + sc.y + 'px) translate(-50%,-100%)');
      st(el, 'opacity', sc.facing ? Math.min(1, b.ttl / 4) : 0); st(el, 'pointerEvents', sc.facing ? 'auto' : 'none');
    });
    Object.keys(leaks).forEach(k => { if (!live.has(+k)) { leaks[k].remove(); delete leaks[k]; } });
    // floating pops
    for (let k = pops.length - 1; k >= 0; k--) {
      const p = pops[k]; p.life -= dt; const sc = world.regionScreen(p.id, 2.2);
      st(p.el, 'transform', 'translate(' + (sc.x + 46) + 'px,' + (sc.y - 34 - (3 - p.life) * 18) + 'px) translate(-50%,-100%)');
      st(p.el, 'opacity', sc.facing ? Math.max(0, Math.min(1, p.life)) : 0);
      if (p.life <= 0) { p.el.remove(); pops.splice(k, 1); }
    }
    // permission card → region link
    const L = $('linkL'), C = $('linkC'), a = $('ask');
    const rid = S && S.event && EVREG[S.event];
    if (!a.hidden && rid && innerWidth >= 760) {
      const b = a.getBoundingClientRect(); let { x, y, facing } = world.regionScreen(rid, .6);
      if (!facing) { const cxx = innerWidth / 2, cyy = innerHeight / 2, ang = Math.atan2(y - cyy, x - cxx), rad = Math.min(innerWidth, innerHeight) * .33; x = cxx + Math.cos(ang) * rad; y = cyy + Math.sin(ang) * rad; }
      L.setAttribute('x1', b.right); L.setAttribute('y1', b.top + 30); L.setAttribute('x2', x); L.setAttribute('y2', y); C.setAttribute('cx', x); C.setAttribute('cy', y);
      st(L, 'opacity', 1); st(C, 'opacity', 1);
    } else { st(L, 'opacity', 0); st(C, 'opacity', 0); }
  }

  return {
    refresh() { lastRack = lastRegions = lastDock = ''; faceMood = null; Object.values(pins).forEach(p => { p._h = null; p._background = null; }); threatEl._h = null; },
    setState(s) { S = s; lastRack = lastRegions = lastDock = ''; faceMood = null; $('ask').hidden = true; $('ask').dataset.ev = ''; },
    setMode(m) { mode = m; document.body.dataset.mode = m; lastRegions = ''; },
    render, overlays, renderRegionCard, renderAsk, hideTip,
    pop(id, html) { const el = document.createElement('div'); el.className = 'pop'; el.innerHTML = html; over.appendChild(el); pops.push({ id, el, life: 3 }); },
    toggleSheet,
    closeSheets() { ['regions', 'rack'].forEach(n => $(n).classList.remove('open')); }
  };
}
