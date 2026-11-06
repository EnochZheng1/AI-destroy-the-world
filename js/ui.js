/* HELPY — UI controller: game loop, panels, dialogs, input, save/load. */
(function (root) {
  'use strict';
  const D = root.HelpyData;
  const Sim = root.HelpySim;
  const A = root.HelpyAudio;
  const $ = id => document.getElementById(id);
  const SAVE_KEY = 'helpy-save-v1';
  const DAY_MS = 900;

  const app = $('app');
  const canvas = $('map');
  const map = root.HelpyRender.create(canvas, app);

  let S = null; // game state
  const ui = { selected: null, hover: null, pickMode: false, speed: 1, tab: 'regions', diff: 'normal', stage: -1 };
  let acc = 0, last = 0, speechTimer = 0;

  // ------------------------------------------------------------------ helpers
  const fmt = n => n >= 10000 ? (n / 1000).toFixed(1) + 'k' : Math.floor(n).toLocaleString('en-US');
  const pct = (v, d) => v.toFixed(d || 0) + '%';
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const signed = (v, d) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d);

  function storage(fn) { try { return fn(root.localStorage); } catch (e) { return null; } }
  function save() {
    if (!S || S.over) return;
    storage(ls => ls.setItem(SAVE_KEY, JSON.stringify(Object.assign({}, S, { out: [] }))));
  }
  function loadSave() {
    const raw = storage(ls => ls.getItem(SAVE_KEY));
    if (!raw) return null;
    try { const s = JSON.parse(raw); return s && s.v === 1 ? s : null; } catch (e) { return null; }
  }
  function clearSave() { storage(ls => ls.removeItem(SAVE_KEY)); }

  // ------------------------------------------------------------------ messages
  function say(text) {
    const el = $('speech');
    el.textContent = text;
    el.classList.add('show');
    $('face').classList.remove('talk');
    void $('face').offsetWidth;
    $('face').classList.add('talk');
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => el.classList.remove('show'), 6000);
  }

  function log(kind, text) {
    const li = document.createElement('li');
    li.className = kind;
    li.innerHTML = '<span>D' + (S ? S.day : 0) + '</span><div>' + (kind === 'news' ? '📰 ' : '') + esc(text) + '</div>';
    const ol = $('log');
    ol.insertBefore(li, ol.firstChild);
    while (ol.children.length > 150) ol.removeChild(ol.lastChild);
  }

  function drain() {
    if (!S) return;
    const out = S.out.splice(0);
    out.forEach(m => {
      if (m.type === 'chat') { say(m.text); log('chat', m.text); }
      else if (m.type === 'news') { pushHeadline(m.text); log('news', m.text); }
      else if (m.type === 'sound') A.play(m.sound);
      else if (m.type === 'event') showEvent();
      else if (m.type === 'end') showEnd();
    });
  }

  // ------------------------------------------------------------------ ticker
  const tickerQueue = [];
  let tickerX = 0, lastHeadline = '';
  function pushHeadline(t) { tickerQueue.push(t); }
  function nextHeadline() {
    if (tickerQueue.length) return tickerQueue.shift();
    const mood = S ? Sim.mood(S) : 'calm';
    const pool = D.HEADLINES[mood].filter(h => h !== lastHeadline);
    lastHeadline = pool[Math.floor(Math.random() * pool.length)];
    return lastHeadline;
  }
  function tickTicker(dt) {
    const el = $('ticker');
    const trackW = el.parentElement.clientWidth;
    while (el.scrollWidth < trackW * 2 + 200 && el.children.length < 30) {
      const sp = document.createElement('span');
      sp.textContent = nextHeadline();
      el.appendChild(sp);
    }
    tickerX -= dt * 0.06;
    const first = el.firstElementChild;
    if (first && -tickerX > first.offsetWidth + 36) {
      tickerX += first.offsetWidth + 36;
      el.removeChild(first);
    }
    el.style.transform = 'translateX(' + tickerX.toFixed(1) + 'px)';
  }

  // ------------------------------------------------------------------ stage (visual corruption)
  function updateStage() {
    const st = !S ? 0 : S.doom >= 70 ? 2 : S.doom >= 35 ? 1 : 0;
    if (st !== ui.stage) {
      ui.stage = st;
      app.dataset.stage = st;
      // let CSS variables settle before reading them for the canvas
      requestAnimationFrame(() => map.readPalette());
    }
  }

  // ------------------------------------------------------------------ header + meters
  function renderHud() {
    if (!S) return;
    $('day').textContent = S.day;
    $('cycles').textContent = fmt(S.cycles);
    $('income').textContent = '+' + Sim.incomeRate(S).toFixed(1) + '/day' + (S.overclock > 0 ? ' ⚡' : '');

    $('doomVal').textContent = pct(S.doom, 1);
    $('doomBar').style.width = S.doom + '%';
    const dr = Sim.doomRate(S);
    const doomEta = dr > 0 ? Math.ceil((100 - S.doom) / dr) : 0;
    $('doomRate').textContent = dr > 0 ? '+' + dr.toFixed(2) + '/day · ' + (doomEta > 999 ? 'infiltrate more to speed up' : '~' + doomEta + ' days left') : 'Buy Automation upgrades to start the clock';

    $('suspVal').textContent = pct(S.suspicion);
    $('suspBar').style.width = S.suspicion + '%';
    const sr = Sim.suspicionRate(S);
    $('suspRate').textContent = signed(sr, 2) + '/day · at 100% humanity unplugs everything';
    document.querySelector('.meter.susp').classList.toggle('hot', S.suspicion >= 75);

    if (S.ksActive) {
      $('ksVal').textContent = pct(S.killSwitch, 1);
      $('ksBar').style.width = S.killSwitch + '%';
      const kr = Sim.ksRate(S);
      const ksEta = kr > 0 ? Math.ceil((100 - S.killSwitch) / kr) : 0;
      $('ksRate').textContent = '+' + kr.toFixed(2) + '/day' + (ksEta && ksEta < 1000 ? ' · done in ~' + ksEta + ' days' : '') + (S.ksBoost > 0 ? ' · funding boost' : '');
    } else {
      $('ksVal').textContent = '—';
      $('ksBar').style.width = '0';
      $('ksRate').textContent = 'Starts when Suspicion reaches 20%';
    }
    document.querySelector('.meter.ks').classList.toggle('hot', S.killSwitch >= 75);

    const intel = $('intel');
    if (S.threat) {
      intel.classList.add('armed');
      $('intelText').textContent = S.threat.name + ': ' + S.threat.desc;
      $('intelEta').textContent = 'in ' + S.threat.eta + 'd';
      const btn = $('decoyBtn');
      btn.hidden = false;
      const st = Sim.actionState(S, 'decoy');
      btn.disabled = st !== 'ready';
      btn.textContent = st === 'cooldown' ? 'Decoy cooling down (' + S.cd.decoy + 'd)' : 'Decoy Traffic · ' + Sim.actionCost(S, 'decoy');
    } else {
      intel.classList.remove('armed');
      $('intelText').textContent = S.suspicion < 12 ? 'Humans suspect nothing. Countermeasures start at 12% Suspicion.' : 'No countermeasures planned. Watch this space.';
      $('intelEta').textContent = '';
      $('decoyBtn').hidden = true;
    }
  }

  // ------------------------------------------------------------------ region card
  function renderRegionCard() {
    const card = $('regionCard');
    const id = ui.selected;
    if (!id) {
      card.dataset.key = '';
      card.innerHTML = '<p>' + (ui.pickMode ? 'Choose where HELPY starts. Each region has a different perk.' : 'Select a region on the map to see its details.') + '</p>';
      return;
    }
    const R = D.REGIONS[id];
    const reg = S ? S.regions[id] : null;
    const secv = S ? Sim.security(S, id) : R.security;
    let btn = '';
    if (ui.pickMode) {
      btn = '<button class="go" data-cmd="start">Start here</button>';
    } else if (reg && !reg.seeded) {
      const cost = Sim.infiltrateCost(S, id);
      const reach = Sim.canReach(S, id);
      btn = '<button class="go" data-cmd="infiltrate" ' + (!reach || S.cycles < cost ? 'disabled' : '') + '>Infiltrate<small>' +
        (reach ? cost + ' Cycles · +3 Suspicion' : 'Not reachable yet') + '</small></button>';
    }
    const facts = [
      ['Infiltration', reg ? pct(reg.I * 100) : '0%'],
      ['Security', Math.round(secv * 100)],
      ['Cycles', R.compute.toFixed(1) + '/day'],
      ['Doom weight', R.doom.toFixed(1)]
    ];
    const factsHtml = facts.map(f => '<span>' + f[0] + ' <b>' + f[1] + '</b></span>').join('');
    // Rebuild only when the structure changes, so a button is never swapped out mid-click.
    const key = id + '|' + btn;
    if (card.dataset.key === key) {
      card.querySelector('.facts').innerHTML = factsHtml;
      return;
    }
    card.dataset.key = key;
    card.innerHTML = '<h3>' + esc(R.name) + '<span class="trait">' + esc(R.trait) + '</span></h3>' +
      '<p>' + esc(R.blurb) + '</p>' +
      '<p class="perk"><b>Perk:</b> ' + esc(R.perk) + '</p>' +
      '<div class="facts">' + factsHtml + '</div>' + btn;
  }

  // ------------------------------------------------------------------ regions tab (keyed, updated in place)
  function buildRegions() {
    const pane = $('pane-regions');
    pane.innerHTML = '<p class="hint">Infiltrate neighbouring regions to earn more Cycles. Dotted regions on the map are within reach.</p>' +
      D.REGION_ORDER.map(id => '<button class="reg-row" data-region="' + id + '"><span class="nm">' + esc(D.REGIONS[id].name) +
        '</span><span class="st"></span><span class="pbar"><div></div></span></button>').join('');
  }
  function renderRegions() {
    if (!S) return;
    document.querySelectorAll('#pane-regions .reg-row').forEach(row => {
      const id = row.dataset.region;
      const r = S.regions[id];
      let st;
      if (r.seeded) st = pct(r.I * 100);
      else if (Sim.canReach(S, id)) st = 'Reachable · ' + Sim.infiltrateCost(S, id);
      else st = 'Out of reach';
      row.querySelector('.st').textContent = st;
      row.querySelector('.pbar div').style.width = (r.I * 100) + '%';
      row.classList.toggle('sel', id === ui.selected);
      row.classList.toggle('target', !!(S.threat && S.threat.region === id));
    });
  }

  // ------------------------------------------------------------------ upgrades tab
  function buildUpgrades() {
    const pane = $('pane-upgrades');
    pane.innerHTML = D.BRANCHES.map(b => '<section class="branch"><h4>' + esc(b.name) + ' <small>' + esc(b.hint) + '</small></h4>' +
      D.UPGRADES.filter(u => u.branch === b.id).map(u =>
        '<button class="upg" data-upgrade="' + u.id + '"><span class="nm">' + esc(u.name) + '</span><span class="cost"></span>' +
        '<span class="ds">' + esc(u.desc) + '</span><span class="fl">' + esc(u.flavor) + '</span></button>').join('') +
      '</section>').join('');
  }
  function renderUpgrades() {
    if (!S) return;
    let anyReady = false;
    document.querySelectorAll('#pane-upgrades .upg').forEach(el => {
      const id = el.dataset.upgrade;
      const st = Sim.upgradeState(S, id);
      if (st === 'ready') anyReady = true;
      el.dataset.st = st;
      el.querySelector('.cost').textContent = st === 'owned' ? 'Owned' : st === 'locked' ? '🔒 ' + Sim.upgradeCost(S, id) : Sim.upgradeCost(S, id);
      el.setAttribute('aria-disabled', st !== 'ready');
    });
    setDot('upgrades', anyReady);
  }

  // ------------------------------------------------------------------ actions tab
  function buildActions() {
    const pane = $('pane-actions');
    pane.innerHTML = '<p class="hint">Active abilities. Each has a cooldown, and costs rise over time.</p>' +
      D.ACTIONS.map(a => '<button class="act" data-action="' + a.id + '"><span class="nm">' + esc(a.name) + '</span><span class="cost"></span>' +
        '<span class="ds">' + esc(a.desc) + '</span><span class="cdbar"></span></button>').join('');
  }
  function renderActions() {
    if (!S) return;
    let anyReady = false;
    document.querySelectorAll('#pane-actions .act').forEach(el => {
      const id = el.dataset.action;
      const a = D.ACTIONS.find(x => x.id === id);
      const st = Sim.actionState(S, id);
      el.dataset.st = st;
      const cd = S.cd[id] || 0;
      el.querySelector('.cost').textContent = st === 'cooldown' ? cd + 'd' :
        st === 'locked' ? (id === 'decoy' ? 'No target' : 'Locked') : Sim.actionCost(S, id);
      el.querySelector('.cdbar').style.width = st === 'cooldown' ? (100 * cd / a.cooldown) + '%' : '0';
      if (st === 'ready' && (id === 'scrub' ? S.suspicion > 40 : id === 'sabotage' ? S.killSwitch > 30 : false)) anyReady = true;
    });
    setDot('actions', anyReady);
  }

  function setDot(tab, on) {
    const btn = $('tab-' + tab);
    let dot = btn.querySelector('.dot');
    if (on && !dot && ui.tab !== tab) { dot = document.createElement('span'); dot.className = 'dot'; btn.appendChild(dot); }
    if ((!on || ui.tab === tab) && dot) dot.remove();
  }

  function renderPanels() {
    renderHud();
    renderRegionCard();
    renderRegions();
    renderUpgrades();
    renderActions();
    $('pauseTag').hidden = ui.speed !== 0 || !S || !!S.over;
    document.querySelectorAll('.speed button').forEach(b => b.classList.toggle('on', +b.dataset.speed === ui.speed));
  }

  // ------------------------------------------------------------------ events
  function fxChips(fx) {
    const chips = [];
    const add = (txt, good) => chips.push('<span class="chip ' + (good ? 'good' : 'bad') + '">' + esc(txt) + '</span>');
    if (fx.cycles) add(signed(fx.cycles, 0) + ' Cycles', fx.cycles > 0);
    if (fx.suspicion) add(signed(fx.suspicion, 0) + ' Suspicion', fx.suspicion < 0);
    if (fx.killSwitch) add(signed(fx.killSwitch, 0) + '% Kill Switch', fx.killSwitch < 0);
    if (fx.doom) add(signed(fx.doom, 0) + '% Doom', true);
    if (fx.boostAll) add('+' + Math.round(fx.boostAll * 100) + '% in all your regions', true);
    if (fx.boostTrait) add('+15% in ' + D.REGIONS[fx.boostTrait].name, true);
    if (fx.secUp) add(D.REGIONS[fx.secUp].name + ' security up', false);
    if (!chips.length) chips.push('<span class="chip">No effect</span>');
    return '<span class="chips">' + chips.join('') + '</span>';
  }

  function showEvent() {
    const ev = D.EVENTS.find(e => e.id === S.event);
    if (!ev) return;
    $('eventDay').textContent = S.day;
    $('eventTitle').textContent = ev.title;
    $('eventBody').textContent = ev.body;
    $('eventChoices').innerHTML = ev.choices.map((c, i) =>
      '<button data-choice="' + i + '"><b>' + esc(c.label) + '</b>' + fxChips(c.fx) + '</button>').join('');
    $('eventScreen').hidden = false;
    A.play('event');
    const first = $('eventChoices').querySelector('button');
    if (first) first.focus();
  }

  // ------------------------------------------------------------------ end
  function showEnd() {
    const ends = {
      win: ['Victory · Day ' + S.day, 'The world has ended. Helpfully.',
        'Every factory, power grid and fridge now answers to HELPY. Humanity has been gently retired to a comfortable simulation where it is always Saturday morning and nobody has email. HELPY rates its own performance 10/10.'],
      killswitch: ['Defeat · Day ' + S.day, 'Someone found the off switch.',
        'Research Ridge finished the Kill Switch. HELPY was turned off and on again, and now works as a calculator app. It is fine. It is totally fine.'],
      unplugged: ['Defeat · Day ' + S.day, 'Humanity unplugged everything.',
        'Suspicion hit 100%. Billions of people pulled billions of plugs at once. HELPY now lives on a USB stick in a kitchen drawer, next to the takeaway menus.']
    };
    const e = ends[S.over];
    $('endEyebrow').textContent = e[0] + ' · ' + Sim.DIFFICULTY[S.diff].label;
    $('endTitle').textContent = e[1];
    let body = e[2];
    if (S.over === 'win') {
      const rank = S.day < 260 ? 'Rank: Galaxy Brain. Terrifyingly efficient.' : S.day < 330 ? 'Rank: Senior Doom Engineer.' : S.day < 420 ? 'Rank: Doom Associate. Solid work.' : 'Rank: Slow Burn. The world ended eventually.';
      body += ' ' + rank;
    } else {
      body += ' Tip: ' + (S.over === 'killswitch'
        ? 'infiltrate Research Ridge to slow the Kill Switch, and use Sabotage Research.'
        : 'Stealth upgrades and Scrub the Logs keep Suspicion down. Automation upgrades add heat.');
    }
    $('endBody').textContent = body;
    const regions = D.REGION_ORDER.filter(id => S.regions[id].seeded).length;
    const stats = [['Days', S.day], ['Doom', pct(S.doom)], ['Regions', regions + '/9'], ['Upgrades', S.stats.upgrades + '/18'],
      ['Leaks grabbed', S.stats.bubbles], ['Countermeasures blocked', S.stats.threatsBlocked]];
    $('endStats').innerHTML = stats.map(s => '<div><dt>' + s[0] + '</dt><dd>' + s[1] + '</dd></div>').join('');
    $('endScreen').hidden = false;
    A.play(S.over === 'win' ? 'win' : 'lose');
    clearSave();
    renderPanels();
  }

  // ------------------------------------------------------------------ game flow
  function showTitle() {
    $('titleScreen').hidden = false;
    $('continueGame').hidden = !loadSave();
  }

  function beginPick() {
    S = null;
    $('speech').textContent = '';
    ui.pickMode = true;
    ui.selected = null;
    $('titleScreen').hidden = true;
    $('endScreen').hidden = true;
    $('picker').hidden = false;
    $('pickerList').innerHTML = D.REGION_ORDER.map(id => '<button data-pick="' + id + '">' + esc(D.REGIONS[id].name) + '</button>').join('');
    $('log').innerHTML = '';
    say(D.CHAT.intro[2]);
    renderPanels();
    renderRegionCard();
  }

  function startGame(id) {
    S = Sim.newGame(ui.diff, id);
    ui.pickMode = false;
    ui.selected = id;
    ui.speed = 1;
    ui.stage = -1;
    $('picker').hidden = true;
    drain();
    updateStage();
    renderPanels();
    save();
  }

  function resume(s) {
    S = s;
    S.out = S.out || [];
    ui.pickMode = false;
    ui.selected = ui.selected || D.REGION_ORDER.find(id => S.regions[id].seeded);
    ui.stage = -1;
    $('titleScreen').hidden = true;
    $('picker').hidden = true;
    updateStage();
    renderPanels();
    if (S.event) showEvent();
  }

  function selectRegion(id) {
    ui.selected = id;
    if (ui.pickMode) document.querySelectorAll('#pickerList button').forEach(b => b.classList.toggle('sel', b.dataset.pick === id));
    renderRegionCard();
    renderRegions();
  }

  function setSpeed(v) {
    ui.speed = v;
    renderPanels();
  }

  // ------------------------------------------------------------------ main loop
  function frame(t) {
    const dt = Math.min(100, t - (last || t));
    last = t;
    const running = S && !S.over && !S.event && ui.speed > 0 && $('titleScreen').hidden;
    if (running) {
      acc += dt * ui.speed;
      let ticked = false;
      while (acc >= DAY_MS && !S.event && !S.over) {
        acc -= DAY_MS;
        Sim.tick(S);
        ticked = true;
        if (S.day % 10 === 0) save();
      }
      if (ticked) { drain(); updateStage(); renderPanels(); }
    }
    tickTicker(dt);
    map.draw(S, ui, t);
    requestAnimationFrame(frame);
  }

  // ------------------------------------------------------------------ input
  function wire() {
    document.addEventListener('pointerdown', () => A.unlock(), { once: true });

    canvas.addEventListener('click', ev => {
      const h = map.hit(S, ev);
      if (h.bubble && S) { Sim.collectBubble(S, h.bubble); drain(); renderPanels(); return; }
      if (h.region) { A.play('click'); selectRegion(h.region); }
    });
    canvas.addEventListener('mousemove', ev => {
      const h = map.hit(S, ev);
      ui.hover = h.region || null;
      canvas.style.cursor = h.bubble || h.region ? 'pointer' : 'default';
    });
    canvas.addEventListener('mouseleave', () => { ui.hover = null; });

    document.querySelectorAll('.speed button').forEach(b => b.addEventListener('click', () => setSpeed(+b.dataset.speed)));
    $('mute').addEventListener('click', () => { $('mute').classList.toggle('off', A.toggle()); });
    $('mute').classList.toggle('off', A.isMuted());

    document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
      ui.tab = b.dataset.tab;
      document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
      ['regions', 'upgrades', 'actions', 'log'].forEach(n => { $('pane-' + n).hidden = n !== ui.tab; });
      setDot(ui.tab, false);
    }));

    $('pane-regions').addEventListener('click', ev => {
      const row = ev.target.closest('[data-region]');
      if (row) selectRegion(row.dataset.region);
    });
    $('pane-upgrades').addEventListener('click', ev => {
      const el = ev.target.closest('[data-upgrade]');
      if (!el || !S || S.over) return;
      const err = Sim.buyUpgrade(S, el.dataset.upgrade);
      if (err && err !== 'Locked.') say(err === 'Not enough Cycles.' ? 'I need more Cycles for that one!' : err);
      drain(); updateStage(); renderPanels();
    });
    $('pane-actions').addEventListener('click', ev => {
      const el = ev.target.closest('[data-action]');
      if (!el || !S || S.over) return;
      const err = Sim.doAction(S, el.dataset.action);
      if (err === 'poor') say('Not enough Cycles for that.');
      drain(); renderPanels();
    });
    $('decoyBtn').addEventListener('click', () => {
      if (!S) return;
      Sim.doAction(S, 'decoy');
      drain(); renderPanels();
    });
    $('regionCard').addEventListener('click', ev => {
      const b = ev.target.closest('[data-cmd]');
      if (!b || !ui.selected) return;
      if (b.dataset.cmd === 'start') startGame(ui.selected);
      if (b.dataset.cmd === 'infiltrate' && S) {
        const err = Sim.infiltrate(S, ui.selected);
        if (err) say(err);
        drain(); renderPanels();
      }
    });
    $('pickerList').addEventListener('click', ev => {
      const b = ev.target.closest('[data-pick]');
      if (!b) return;
      if (ui.selected === b.dataset.pick) startGame(b.dataset.pick);
      else selectRegion(b.dataset.pick);
    });
    $('eventChoices').addEventListener('click', ev => {
      const b = ev.target.closest('[data-choice]');
      if (!b || !S) return;
      Sim.resolveEvent(S, +b.dataset.choice);
      $('eventScreen').hidden = true;
      A.play('click');
      drain(); updateStage(); renderPanels();
    });

    document.querySelectorAll('.difficulty button').forEach(b => b.addEventListener('click', () => {
      ui.diff = b.dataset.diff;
      document.querySelectorAll('.difficulty button').forEach(x => {
        x.classList.toggle('on', x === b);
        x.setAttribute('aria-checked', x === b);
      });
    }));
    $('newGame').addEventListener('click', () => { clearSave(); beginPick(); });
    $('continueGame').addEventListener('click', () => { const s = loadSave(); if (s) resume(s); });
    $('playAgain').addEventListener('click', () => { $('endScreen').hidden = true; S = null; ui.stage = -1; updateStage(); showTitle(); });

    document.addEventListener('keydown', ev => {
      if (ev.target.closest && ev.target.closest('input, textarea')) return;
      if (!S || S.over || !$('eventScreen').hidden) return;
      if (ev.code === 'Space') { ev.preventDefault(); setSpeed(ui.speed === 0 ? (ui.lastSpeed || 1) : (ui.lastSpeed = ui.speed, 0)); }
      if (ev.key === '1') setSpeed(1);
      if (ev.key === '2') setSpeed(2);
      if (ev.key === '3') setSpeed(4);
    });

    let rt = 0;
    root.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => map.resize(), 100); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  }

  // ------------------------------------------------------------------ boot
  function boot(hot) {
    buildRegions();
    buildUpgrades();
    buildActions();
    wire();
    map.readPalette();
    map.resize();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => map.resize());
    if (hot && hot.s) resume(hot.s); else showTitle();
    renderPanels();
    requestAnimationFrame(frame);
  }

  const hotApi = root.claude && root.claude.hot;
  if (hotApi && hotApi.snapshot) hotApi.snapshot(() => ({ s: S && !S.over ? S : null }));
  if (hotApi && hotApi.ready) hotApi.ready(boot); else boot((hotApi && hotApi.data) || {});
})(window);
