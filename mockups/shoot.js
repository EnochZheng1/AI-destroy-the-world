#!/usr/bin/env node
/* Screenshots every mockup at 1440x900. Usage: node mockups/shoot.js <round-name> [file-glob-prefix]
 * Needs a static server on :8123 serving the repo root (python3 -m http.server 8123). */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const round = process.argv[2] || 'draft';
  const only = process.argv[3] || '';
  const dir = path.join(__dirname, 'shots', round);
  fs.mkdirSync(dir, { recursive: true });
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f.startsWith(only)).sort();
  const b = await chromium.launch();
  for (const f of files) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8123/mockups/' + f);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(900);
    const out = path.join(dir, f.replace('.html', '.png'));
    await p.screenshot({ path: out });
    console.log(out, errs.length ? errs : '');
    await p.close();
  }
  await b.close();
})();
