#!/usr/bin/env node
/* Renders og.png (the 1200×630 link-preview image) from the real game in poster mode.
 * Needs a static server on :8123 at the repo root. Usage: node tools/og-image.js */
'use strict';
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto('http://localhost:8123/index.html?play=G&day=300&poster=1&quality=high');
  await p.waitForTimeout(5000);
  await p.screenshot({ path: path.join(__dirname, '..', 'og.png') });
  await b.close(); console.log('wrote og.png');
})();
