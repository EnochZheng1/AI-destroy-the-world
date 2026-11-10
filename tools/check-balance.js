#!/usr/bin/env node
/* CI balance gate: plays seeded bot games and fails if the game drifts out of its intended shape.
 * Usage: node tools/check-balance.js [games=120] */
'use strict';
const { play } = require('./simulate.js');
const D = globalThis.HelpyData;
const N = +process.argv[2] || 120;

function run(diff, bot, model) {
  let wins = 0, days = 0;
  for (let i = 0; i < N; i++) { const s = play(diff, bot, i + 1, 1, model); if (s.over === 'win') { wins++; days += s.day; } }
  return { win: wins / N, day: wins ? days / wins : 0 };
}

const checks = [];
const expect = (name, ok, got) => { checks.push({ name, ok, got }); };

for (const diff of ['easy', 'normal', 'hard']) expect(diff + ': doing nothing loses', run(diff, 'idle').win === 0, '');
const easy = run('easy', 'balanced'), normal = run('normal', 'balanced'), hard = run('hard', 'balanced'), hardRush = run('hard', 'rush');
expect('easy: a sensible player wins ≥98%', easy.win >= .98, pct(easy.win));
expect('normal: a sensible player wins ≥95%', normal.win >= .95, pct(normal.win));
expect('hard: a sensible player wins 80–99%', hard.win >= .8 && hard.win <= .995, pct(hard.win));
expect('hard: reckless rushing is punished (<80%)', hardRush.win < .8, pct(hardRush.win));
expect('normal: a win takes 180–340 days', normal.day >= 180 && normal.day <= 340, Math.round(normal.day) + ' days');
expect('difficulty orders win day: easy ≤ normal ≤ hard', easy.day <= normal.day + 5 && normal.day <= hard.day + 5, [easy, normal, hard].map(r => Math.round(r.day)).join(' / '));
for (const m of D.MODELS) {
  const r = run('normal', 'balanced', m.id);
  expect('model ' + m.id + ': normal balanced wins ≥85%', r.win >= .85, pct(r.win) + ', day ' + Math.round(r.day));
}

function pct(x) { return (100 * x).toFixed(0) + '%'; }
let failed = 0;
for (const c of checks) { if (!c.ok) failed++; console.log((c.ok ? '  ok   ' : '  FAIL ') + c.name + (c.got ? '  (' + c.got + ')' : '')); }
console.log(failed ? failed + ' balance check(s) failed' : 'All ' + checks.length + ' balance checks passed');
process.exit(failed ? 1 : 0);
