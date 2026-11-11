#!/usr/bin/env node
/* Screenshots the real game in named states, desktop and phone. Needs a static server on :8123 at the repo root.
 * Usage: node tools/screens.js <outDir> */
'use strict';
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const DESKTOP = [
  ['01-title', ''],
  ['02-pick', '?screen=pick&select=T'],
  ['03-early', '?play=T&day=70'],
  ['04-mid', '?play=G&day=220'],
  ['05-late', '?play=G&day=300'],
  ['06-event', '?play=G&day=230&event=summit'],
  ['07-select-infiltrate', '?play=G&day=150&select=R&pause=1'],
  ['08-buyable', '?play=G&day=215&nobuy=150&pause=1', '.t.ready', '[data-sheet="rack"]'],
  ['12-hover-meter', '?play=G&day=220&pause=1', '#mKs'],
  ['13-hover-action', '?play=G&day=220&pause=1', '[data-act="scrub"]'],
  ['09-end-win', '?play=G&day=420'],
  ['10-end-killswitch', '?play=G&day=120&end=killswitch'],
  ['11-infiltrate', '?play=G&day=40&select=S&pause=1']
];
const PHONE = [['p1-title', ''], ['p2-play', '?play=G&day=220'], ['p3-upgrades', '?play=G&day=215&nobuy=150&pause=1', '.t.ready', '[data-sheet="rack"]'], ['p6-tap-meter', '?play=G&day=220&pause=1', '#mSusp'], ['p4-event', '?play=G&day=230&event=summit'], ['p5-end', '?play=G&day=420']];
(async () => {
  const out = process.argv[2] || 'shots'; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const run = async (ctxOpts, list) => {
    const ctx = await b.newContext(ctxOpts);
    for (const [name, q, hover, first] of list) {
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto('http://localhost:8123/index.html' + q); await p.waitForTimeout(4500);
      if (first) { const f = await p.$(first); if (f) { if (ctxOpts.hasTouch) await f.tap(); else await f.click(); await p.waitForTimeout(500); } }
      if (hover) { const el = await p.$(hover); if (el) { if (ctxOpts.hasTouch) await el.tap(); else await el.hover(); await p.waitForTimeout(600); } }
      await p.screenshot({ path: path.join(out, name + '.png') });
      console.log(name, errs.length ? errs.slice(0, 2) : 'ok'); await p.close();
    }
    await ctx.close();
  };
  await run({ viewport: { width: 1440, height: 900 } }, DESKTOP);
  await run({ ...devices['iPhone 13'] }, PHONE);
  await b.close();
})();
