// End-of-game sharing: a 1200×630 result card (the planet as it ended + the result) and a short text line
// that compares well between friends, especially on the same Daily world.
import { drawFace } from './face.js';
import { PAL } from './palette.js';
import { meta } from './meta.js';

const D = window.HelpyData;
export const SITE = 'https://enochzheng1.github.io/AI-destroy-the-world/';
export const siteUrl = () => (/^https?:/.test(location.protocol) && !/localhost|127\.0\.0\.1/.test(location.host) ? location.origin + location.pathname : SITE);

const RESULT = { win: ['VICTORY', 'ended the world'], killswitch: ['SWITCHED OFF', 'was switched off'], unplugged: ['UNPLUGGED', 'got unplugged'] };

// One square per region, in map order: 🟥 taken · 🟧 partly infiltrated · ⬛ untouched.
export const regionSquares = S => D.REGION_ORDER.map(id => { const r = S.regions[id]; return !r.seeded ? '⬛' : r.I >= .99 ? '🟥' : '🟧'; }).join('');

export function shareText(S) {
  const M = D.MODELS.find(m => m.id === (S.model || 'omega'));
  const who = S.daily ? 'HELPY Daily ' + S.daily : M.name + ' (' + window.HelpySim.DIFFICULTY[S.diff].label + ')';
  const st = S.daily ? meta.streak() : 0;
  const line = who + ': ' + RESULT[S.over][1] + ' on day ' + S.day + ' ' + regionSquares(S) + (S.stats.threatsBlocked ? ' 🦆' + S.stats.threatsBlocked : '') + (st > 1 ? ' 🔥' + st : '');
  return line + '\n' + (S.daily ? 'Play today\'s Daily: ' + siteUrl() + '?daily' : siteUrl());
}

function wrap(g, text, x, y, maxW, lh) {
  const words = text.split(' '); let line = '', yy = y;
  words.forEach((w, i) => { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { g.fillText(line, x, yy); line = w; yy += lh; } else line = t; if (i === words.length - 1) g.fillText(line, x, yy); });
  return yy;
}

export async function renderCard(S, planetDataUrl) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const c = document.createElement('canvas'); c.width = 1200; c.height = 630; const g = c.getContext('2d');
  g.fillStyle = '#04060A'; g.fillRect(0, 0, 1200, 630);
  // planet: cover-crop the frame into the left 660px
  if (planetDataUrl) {
    const img = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = planetDataUrl; });
    if (img) { const s = Math.max(660 / img.width, 630 / img.height) * 1.15, w = img.width * s, h = img.height * s; g.drawImage(img, 330 - w / 2 + 40, 315 - h / 2 - 20, w, h); }
  }
  const fade = g.createLinearGradient(520, 0, 760, 0); fade.addColorStop(0, 'rgba(4,6,10,0)'); fade.addColorStop(1, 'rgba(4,6,10,1)');
  g.fillStyle = fade; g.fillRect(520, 0, 240, 630); g.fillStyle = '#04060A'; g.fillRect(760, 0, 440, 630);
  // text column
  const x = 680, accent = S.over === 'win' ? PAL.ai : PAL.human;
  const face = document.createElement('canvas'); face.width = 120; face.height = 104; drawFace(face, S.over === 'win' ? 'grin' : 'dead');
  g.drawImage(face, x, 48, 96, 83);
  g.fillStyle = accent; g.font = '700 22px Archivo, Arial, sans-serif'; g.fillText(RESULT[S.over][0] + ' · DAY ' + S.day, x, 176);
  g.fillStyle = '#E9ECF4'; g.font = '900 54px Archivo, "Arial Black", sans-serif';
  const title = S.over === 'win' ? 'The world has ended. Helpfully.' : S.over === 'killswitch' ? 'Someone found the off switch.' : 'Humanity unplugged everything.';
  let y = wrap(g, title.toUpperCase(), x, 236, 480, 58);
  const M = D.MODELS.find(m => m.id === (S.model || 'omega'));
  g.fillStyle = '#8F96AA'; g.font = '500 22px "IBM Plex Mono", monospace';
  g.fillText(S.daily ? 'Daily world ' + S.daily : M.name + ' · ' + window.HelpySim.DIFFICULTY[S.diff].label, x, y + 52);
  // region squares
  y += 92;
  D.REGION_ORDER.forEach((id, i) => { const r = S.regions[id]; g.fillStyle = !r.seeded ? '#1b2234' : r.I >= .99 ? PAL.ai : PAL.aiLight; g.globalAlpha = !r.seeded ? 1 : r.I >= .99 ? 1 : .55; g.fillRect(x + i * 50, y, 42, 42); });
  g.globalAlpha = 1;
  // stats
  y += 96;
  const regions = D.REGION_ORDER.filter(id => S.regions[id].seeded).length;
  [['DOOM', Math.round(S.doom) + '%'], ['REGIONS', regions + '/9'], ['UPGRADES', S.stats.upgrades + '/18'], ['DODGED', S.stats.threatsBlocked]].forEach(([l, v], i) => {
    g.fillStyle = '#E9ECF4'; g.font = '600 32px "IBM Plex Mono", monospace'; g.fillText(String(v), x + i * 126, y);
    g.fillStyle = '#7A8298'; g.font = '700 15px Archivo, Arial, sans-serif'; g.fillText(l, x + i * 126, y + 26);
  });
  g.fillStyle = accent; g.fillRect(x, 580, 40, 3);
  g.fillStyle = '#8F96AA'; g.font = '500 16px "IBM Plex Mono", monospace'; g.fillText(siteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''), x + 52, 588);
  return c;
}
