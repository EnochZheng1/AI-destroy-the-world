#!/usr/bin/env node
/* Captures a filmstrip of a live 3D prototype: for each start day, load ?day=N, let it play,
 * and grab frames. Usage: node mockups/shoot3d.js <round> <file.html> <day,day,...> [secondsPerShot] */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const [round, file, days = '0', wait = '5'] = process.argv.slice(2);
  const dir = path.join(__dirname, 'shots', round);
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const d of days.split(',')) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(`http://localhost:8123/mockups/${file}?day=${d}`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(+wait * 1000);
    const fps = await p.evaluate(() => new Promise(r => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(f); else r(n); })(); }));
    const out = path.join(dir, file.replace('.html', '') + '-day' + d.padStart(3, '0') + '.png');
    await p.screenshot({ path: out });
    console.log(out, 'fps~' + fps, errs.length ? errs.slice(0, 3) : '');
    await p.close();
  }
  await b.close();
})();
