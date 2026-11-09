#!/usr/bin/env node
/* Counts words a player sees on a mockup: visible DOM text plus text drawn on canvases (approximated
 * by the labels passed through fillText). Usage: node mockups/wordcount.js <file.html> [...] */
'use strict';
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const f of process.argv.slice(2)) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.addInitScript(() => {
      window.__canvasWords = [];
      const orig = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (t, ...a) { window.__canvasWords.push(String(t)); return orig.call(this, t, ...a); };
    });
    await p.goto('http://localhost:8123/mockups/' + f);
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => {
      const words = s => (s.match(/[A-Za-z][A-Za-z'’-]*/g) || []).length;
      const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
      let dom = 0;
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walk.nextNode()) { const n = walk.currentNode; const el = n.parentElement; if (!el || el.closest('script,style,svg')) continue; if (getComputedStyle(el).visibility === 'hidden' || !vis(el)) continue; dom += words(n.textContent); }
      const canvas = window.__canvasWords.reduce((a, t) => a + words(t), 0);
      return { dom, canvas, total: dom + canvas };
    });
    console.log(f.padEnd(32), JSON.stringify(r));
    await p.close();
  }
  await b.close();
})();
