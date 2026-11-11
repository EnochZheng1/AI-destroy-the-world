#!/usr/bin/env node
/* Counts the words a player can actually see on each screen (visible, on-screen text only).
 * Needs a static server on :8123 at the repo root. Usage: node tools/wordcount.js [--list] */
'use strict';
const { chromium, devices } = require('playwright');
const STATES = [['title', ''], ['pick', '?screen=pick'], ['early', '?play=T&day=70'], ['mid', '?play=G&day=220'], ['event', '?play=G&day=230&event=summit'], ['selected', '?play=G&day=150&select=R&pause=1'], ['end', '?play=G&day=420']];
const visibleText = () => {
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    const t = n.textContent.trim(); if (!t) continue;
    const el = n.parentElement; if (!el || el.closest('[hidden],script,style,[aria-hidden="true"] .sr')) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0 || cs.display === 'none') continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    let p = el, hid = false; while (p) { const s = getComputedStyle(p); if (s.display === 'none' || +s.opacity === 0) { hid = true; break; } p = p.parentElement; } if (hid) continue;
    out.push(t);
  }
  return out;
};
const words = list => list.join(' ').split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
(async () => {
  const list = process.argv.includes('--list');
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [label, opts] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['phone', { ...devices['iPhone 13'] }]]) {
    const ctx = await b.newContext(opts);
    for (const [name, q] of STATES) {
      const p = await ctx.newPage(); await p.goto('http://localhost:8123/index.html' + q); await p.waitForTimeout(3500);
      const t = await p.evaluate(visibleText);
      console.log(label.padEnd(8), name.padEnd(9), String(words(t)).padStart(4), 'words');
      if (list) console.log('          ' + t.join(' | ').slice(0, 1200));
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
})();
