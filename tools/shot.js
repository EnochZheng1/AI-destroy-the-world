#!/usr/bin/env node
/* One screenshot of the game in any state, for reviews. Needs a static server on :8123 at the repo root.
 * Usage: node tools/shot.js "<query>" out.png [--phone] [--hover <css>] [--click <css>] [--wait ms] */
'use strict';
const { chromium, devices } = require('playwright');
const a = process.argv.slice(2), q = a[0] || '', out = a[1] || 'shot.png';
const opt = k => { const i = a.indexOf(k); return i > 0 ? a[i + 1] : null; };
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage(a.includes('--phone') ? { ...devices['iPhone 13'] } : { viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:8123/index.html' + q); await p.waitForTimeout(+(opt('--wait') || 3500));
  if (opt('--click')) { await p.click(opt('--click')); await p.waitForTimeout(500); }
  if (opt('--hover')) { await p.hover(opt('--hover')); await p.waitForTimeout(600); }
  await p.screenshot({ path: out }); await b.close(); console.log('wrote', out);
})();
