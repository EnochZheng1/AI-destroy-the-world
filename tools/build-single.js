#!/usr/bin/env node
/* Bundles the game into one self-contained HTML file (CSS and JS inlined).
 * Usage: node tools/build-single.js [out=dist/helpy.html] [--fragment]
 *   --fragment  omit <!doctype>/<html>/<head>/<body> wrappers (for hosts that add their own). */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const fragment = args.includes('--fragment');
const out = path.resolve(args.find(a => !a.startsWith('--')) || path.join(ROOT, 'dist', 'helpy.html'));

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const inlineAssets = s => s
  .replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (_, f) => '<style>\n' + read(f) + '\n</style>')
  .replace(/<script src="(js\/[^"]+)"><\/script>/g, (_, f) => '<script>\n' + read(f).replace(/<\/script/gi, '<\\/script') + '\n</script>');

let result;
if (fragment) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
    .replace(/<meta charset[^>]*>\s*/, '')
    .replace(/<meta name="viewport"[^>]*>\s*/, '');
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
  result = inlineAssets(head.trim() + '\n' + body.trim()) + '\n';
} else {
  result = inlineAssets(html);
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, result);
console.log('Wrote ' + out + ' (' + Math.round(result.length / 1024) + ' KB)');
