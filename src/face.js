// HELPY's face (uses the current palette's HELPY colour): a red speech bubble with two eyes and a smile.
// Moods: '' (calm), 'blink', 'sweat' (Suspicion > 50), 'sweat-blink', 'grin' (just did something), 'dead' (game over).
import { PAL } from './palette.js';

export function drawFace(canvas, mood = '', color = PAL.ai) {
  const g = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  g.clearRect(0, 0, W, H);
  const rx = W * .06, ry = H * .05, rw = W * .88, rh = H * .7, r = W * .2;
  g.fillStyle = color;
  g.beginPath(); g.roundRect(rx, ry, rw, rh, r); g.fill();
  g.beginPath(); g.moveTo(W * .22, ry + rh - 2); g.lineTo(W * .2, H * .97); g.lineTo(W * .44, ry + rh - 2); g.fill();
  g.fillStyle = '#12030a';
  g.strokeStyle = '#12030a';
  g.lineCap = 'round';
  if (mood === 'dead') {
    g.lineWidth = W * .045;
    [[.35, .36], [.65, .36]].forEach(([x, y]) => {
      g.beginPath(); g.moveTo(W * (x - .06), H * (y - .07)); g.lineTo(W * (x + .06), H * (y + .07));
      g.moveTo(W * (x + .06), H * (y - .07)); g.lineTo(W * (x - .06), H * (y + .07)); g.stroke();
    });
    g.beginPath(); g.moveTo(W * .36, H * .58); g.lineTo(W * .64, H * .58); g.stroke();
    return;
  }
  const blink = mood.includes('blink'), side = mood.includes('sweat') ? W * .05 : 0;
  const ey = H * .3, eh = blink ? H * .03 : H * .16;
  g.fillRect(W * .3 + side, ey, W * .1, eh);
  g.fillRect(W * .6 + side, ey, W * .1, eh);
  g.lineWidth = W * .055;
  g.beginPath();
  if (mood === 'grin') g.arc(W * .5, H * .36, W * .22, Math.PI * .12, Math.PI * .88);
  else g.arc(W * .5, H * .38, W * .2, Math.PI * .2, Math.PI * .8);
  g.stroke();
  if (mood.includes('sweat')) {
    g.fillStyle = '#9fe9ff';
    g.beginPath(); g.moveTo(W * .86, H * .1);
    g.quadraticCurveTo(W * .95, H * .26, W * .86, H * .3);
    g.quadraticCurveTo(W * .77, H * .26, W * .86, H * .1); g.fill();
  }
}
