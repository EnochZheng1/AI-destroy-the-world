#!/usr/bin/env node
/* Scripted browser playthrough for CI. Serves the repo itself, drives the real game in headless Chromium and
 * fails on any page error, broken flow, phone overflow, or analytics sent without consent.
 * Usage: node tools/smoke.js [--shots dir] */
'use strict';
const { chromium, devices } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };
const shotsDir = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const FAKE_HOST = 'https://ph.example.test';

let failures = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) failures++; };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const f = path.join(ROOT, u === '/' ? 'index.html' : u);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); rsp.end(); return; }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(rsp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

async function main() {
  const srv = await serve(); const BASE = 'http://127.0.0.1:' + srv.address().port + '/index.html';
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

  // Each context: external fonts blocked (CI may be offline), optional fake analytics config, captured analytics.
  async function context(opts = {}, analytics = false) {
    const ctx = await browser.newContext(opts);
    const sent = [];
    await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, body: '' }));
    if (analytics) await ctx.route('**/js/config.js', r => r.fulfill({ contentType: 'text/javascript', body: `window.HELPY_CONFIG={posthogKey:'phc_test',posthogHost:'${FAKE_HOST}'};` }));
    await ctx.route(FAKE_HOST + '/**', r => { try { sent.push(JSON.parse(r.request().postData())); } catch (e) { sent.push({ bad: true }); } r.fulfill({ status: 200, body: '{"status":1}' }); });
    return { ctx, sent };
  }
  async function open(ctx, q, errs) {
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
    await p.goto(BASE + q); await p.waitForFunction(() => window.__helpy && window.__perf, null, { timeout: 20000 });
    await p.waitForTimeout(800);
    return p;
  }
  const shot = async (p, name) => { if (shotsDir) { fs.mkdirSync(shotsDir, { recursive: true }); await p.screenshot({ path: path.join(shotsDir, name + '.png') }); } };
  const visible = (p, sel) => p.$eval(sel, el => !el.hidden && el.getBoundingClientRect().width > 0).catch(() => false);

  // 1. Default build: analytics off, no consent card, full keyboard play.
  console.log('Desktop playthrough (analytics not configured)');
  {
    const errs = []; const { ctx, sent } = await context({ viewport: { width: 1440, height: 900 } });
    const p = await open(ctx, '', errs);
    ok(await visible(p, '#title'), 'title screen shows');
    ok(!(await visible(p, '#consent')), 'no consent prompt when analytics are not configured');
    await p.click('#newGame'); await p.waitForTimeout(400);
    ok(await p.evaluate(() => document.body.dataset.mode) === 'pick', 'New world opens the region picker');
    await p.keyboard.press('r'); await p.keyboard.press('Enter'); await p.waitForTimeout(600);
    ok(await p.evaluate(() => document.body.dataset.mode === 'play' && !!window.__helpy.state.regions[window.__helpy.state.start].seeded), 'keyboard R + Enter starts the game');
    await p.evaluate(() => { window.__helpy.state.cycles += 400; });
    await p.waitForTimeout(300); await p.click('[data-sheet="rack"]');
    await p.waitForSelector('.rack.open .t.ready', { timeout: 5000 });
    const before = await p.evaluate(() => Object.keys(window.__helpy.state.owned).length);
    await p.click('.t.ready'); await p.waitForTimeout(200);
    ok(await p.evaluate(() => Object.keys(window.__helpy.state.owned).length) === before + 1, 'clicking a glowing tile buys an upgrade');
    await p.keyboard.press('Space'); await p.waitForTimeout(100);
    const d0 = await p.evaluate(() => window.__helpy.state.day); await p.waitForTimeout(1200);
    ok(await p.evaluate(() => window.__helpy.state.day) === d0, 'Space pauses');
    await p.keyboard.press('3'); await p.waitForTimeout(1500);
    ok(await p.evaluate(() => window.__helpy.state.day) > d0, '3 runs at 4×');
    await p.keyboard.press('z'); await p.keyboard.press('i'); await p.waitForTimeout(100);
    await p.keyboard.press('?'); await p.waitForTimeout(200);
    ok(await visible(p, '#settings'), '? opens settings');
    ok(!(await visible(p, '#dataRow')), 'analytics row hidden when not configured');
    await p.click('[data-setting="colors"] [data-v="cb"]'); await p.waitForTimeout(300);
    ok(await p.evaluate(() => document.body.dataset.palette) === 'cb', 'colour-blind palette applies');
    await p.click('[data-setting="motion"] [data-v="reduced"]');
    ok(await p.evaluate(() => document.body.classList.contains('reduce-motion')), 'reduced motion applies');
    await shot(p, 'smoke-settings');
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    ok(!(await visible(p, '#settings')), 'Esc closes settings');
    await shot(p, 'smoke-cb-play');
    ok(sent.length === 0, 'nothing sent to analytics');
    ok(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  // 2. Event prompt, end screen and the share card.
  console.log('Event, end screen and share card');
  {
    const errs = []; const { ctx } = await context({ viewport: { width: 1440, height: 900 } });
    let p = await open(ctx, '?play=G&day=230&event=summit', errs);
    ok(await visible(p, '#ask'), 'permission prompt shows');
    await p.keyboard.press('y'); await p.waitForTimeout(300);
    ok(await p.evaluate(() => !window.__helpy.state.event && window.__helpy.state.stats.events > 0), 'Y answers the prompt');
    await p.close();
    p = await open(ctx, '?play=G&day=420', errs);
    await p.waitForSelector('#end:not([hidden])', { timeout: 10000 });
    ok(await p.evaluate(() => window.__helpy.state.over) === 'win', 'a long game ends in a win');
    await p.click('#share');
    await p.waitForFunction(() => { const i = document.getElementById('shareImg'); return i.src && i.complete && i.naturalWidth; }, null, { timeout: 10000 });
    ok(await p.$eval('#shareImg', i => i.naturalWidth === 1200 && i.naturalHeight === 630), 'share card is 1200×630');
    ok(/ended the world on day \d+ [🟥🟧⬛]{9}/u.test(await p.$eval('#shareText', e => e.textContent)), 'share text has the day and 9 region squares');
    await shot(p, 'smoke-share');
    await p.keyboard.press('Escape');
    ok(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  // 3. Analytics configured: nothing before consent; correct, anonymous events after.
  console.log('Analytics consent (fake PostHog)');
  {
    const errs = []; const { ctx, sent } = await context({ viewport: { width: 1280, height: 800 } }, true);
    let p = await open(ctx, '', errs);
    ok(await visible(p, '#consent'), 'consent prompt shows once analytics are configured');
    await p.waitForTimeout(1500);
    ok(sent.length === 0 && await p.evaluate(() => window.__telemetry.length) === 0, 'nothing recorded or sent before consent');
    await p.click('[data-consent="yes"]');
    ok(!(await visible(p, '#consent')), 'consent prompt closes');
    await p.click('#newGame'); await p.waitForTimeout(300); await p.keyboard.press('r'); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
    await p.evaluate(() => { window.__helpy.state.cycles += 400; }); await p.waitForTimeout(300); await p.click('[data-sheet="rack"]'); await p.waitForSelector('.rack.open .t.ready'); await p.click('.t.ready');
    await p.evaluate(() => window.dispatchEvent(new Event('pagehide'))); // what the browser fires when the tab closes
    await p.waitForTimeout(500);
    ok(sent.flatMap(b => b.batch || []).some(e => e.event === 'game_quit'), 'leaving mid-game sends game_quit');
    await p.close();
    p = await open(ctx, '?play=G&day=420', errs);
    await p.waitForSelector('#end:not([hidden])', { timeout: 10000 });
    await p.waitForTimeout(800);
    ok(!(await visible(p, '#consent')), 'consent is only asked once');
    const events = sent.flatMap(b => b.batch || []);
    const names = events.map(e => e.event);
    ok(sent.every(b => b.api_key === 'phc_test'), 'batches carry the project key');
    ok(names.includes('game_start') && names.includes('game_end') && names.includes('upgrade_bought'), 'game_start, upgrade_bought and game_end sent (' + [...new Set(names)].join(', ') + ')');
    const end = events.find(e => e.event === 'game_end');
    ok(end && end.properties.result === 'win' && end.properties.day > 0 && end.properties.difficulty === 'normal', 'game_end has result, day and difficulty');
    const ids = new Set(events.map(e => e.distinct_id));
    ok(ids.size === 1 && /^[\w-]{8,}$/.test([...ids][0]), 'one anonymous ID per browser');
    ok(events.every(e => e.properties.$geoip_disable === true && e.properties.$process_person_profile === false), 'every event disables GeoIP and person profiles');
    const forbidden = JSON.stringify(events).match(/"(\$ip|email|name|\$current_url|\$referrer)"\s*:/);
    ok(!forbidden, 'no IP, email, name or URL fields' + (forbidden ? ' (found ' + forbidden[1] + ')' : ''));
    // opting out stops sending and drops the ID
    await p.evaluate(() => document.querySelector('[data-open-settings]').click());
    ok(await visible(p, '#dataRow'), 'analytics row shows in settings');
    await p.click('[data-setting="telemetry"] [data-v="off"]');
    ok(await p.evaluate(() => !localStorage.getItem('helpy-anon-id')), 'opting out deletes the anonymous ID');
    const n = sent.length; await p.close();
    p = await open(ctx, '?play=G&day=420', errs); await p.waitForTimeout(1500); await p.close();
    ok(sent.length <= n + 1, 'nothing more sent after opting out');
    ok(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  // 4. Declining sends nothing.
  console.log('Analytics declined');
  {
    const errs = []; const { ctx, sent } = await context({ viewport: { width: 1280, height: 800 } }, true);
    let p = await open(ctx, '', errs);
    await p.click('[data-consent="no"]'); await p.close();
    p = await open(ctx, '?play=G&day=420', errs); await p.waitForTimeout(1500);
    ok(sent.length === 0 && await p.evaluate(() => window.__telemetry.length) === 0, '"No thanks" sends and records nothing');
    await ctx.close();
  }

  // 5. Phone: no sideways scrolling on any screen, Daily link works.
  console.log('Phone');
  {
    const errs = []; const { ctx } = await context({ ...devices['iPhone 13'] });
    for (const q of ['', '?play=G&day=220', '?play=G&day=420', '?daily']) {
      const p = await open(ctx, q, errs);
      if (q === '?daily') ok(await p.evaluate(() => document.body.dataset.mode === 'play' && /^\d{4}-\d\d-\d\d$/.test(window.__helpy.state.daily)), '?daily starts today\'s Daily world');
      ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal scroll at ' + (q || 'title'));
      await shot(p, 'smoke-phone' + q.replace(/\W+/g, '-')); await p.close();
    }
    {
      const p = await open(ctx, '?play=G&day=220&pause=1', errs);
      await p.evaluate(() => { window.__helpy.state.cycles += 300; window.__helpy.state.cd.overclock = 0; }); await p.waitForTimeout(400);
      const oc = () => p.evaluate(() => window.__helpy.state.cd.overclock || 0);
      await p.tap('[data-act="overclock"]'); await p.waitForTimeout(250);
      ok(await oc() === 0 && /Tap again/.test(await p.$eval('#tip', e => e.hidden ? '' : e.textContent)), 'first tap on an action explains it without using it');
      await p.tap('[data-act="overclock"]'); await p.waitForTimeout(250);
      ok(await oc() > 0, 'second tap uses it');
      await p.close();
    }
    ok(errs.length === 0, 'no page errors' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  await browser.close(); srv.close();
  console.log(failures ? failures + ' smoke check(s) failed' : 'Smoke test passed');
  process.exit(failures ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
