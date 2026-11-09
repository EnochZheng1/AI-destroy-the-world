#!/usr/bin/env node
/* Frame-time profile of the real game in a mid-game state. CPU-side numbers (sync, hud) are meaningful
 * anywhere; render time here is software WebGL, so compare it only between runs on the same machine.
 * Usage: node tools/perf.js [label] [query]   (needs a static server on :8123 at the repo root) */
'use strict';
const { chromium, devices } = require('playwright');
(async () => {
  const label = process.argv[2] || 'run', extra = process.argv[3] || '';
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [name, opts] of [['desktop 1440x900@2x', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }], ['phone (iPhone 13)', { ...devices['iPhone 13'] }]]) {
    const ctx = await b.newContext(opts); const p = await ctx.newPage();
    await p.goto('http://localhost:8123/index.html?play=G&day=240' + extra); await p.waitForTimeout(3000);
    await p.evaluate(() => window.__helpy.setSpeed(4)); await p.waitForTimeout(6000);
    const r = await p.evaluate(() => window.__perf());
    console.log(label.padEnd(10), name.padEnd(18), Object.entries(r).map(([k, v]) => k + '=' + (typeof v === 'number' ? v.toFixed(k === 'fps' ? 1 : 2) : v)).join('  '));
    await ctx.close();
  }
  await b.close();
})();
