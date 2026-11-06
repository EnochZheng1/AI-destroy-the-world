/* HELPY — canvas world map renderer (hex grid, infection network, data-leak bubbles). */
(function (root) {
  'use strict';
  const D = root.HelpyData;
  const W = D.WORLD;
  const SQ3 = Math.sqrt(3);

  function create(canvas, host) {
    const ctx = canvas.getContext('2d');
    let R = 10, pad = 8, dpr = 1, cw = 0, ch = 0;
    let pal = {};
    let staticLayer = null;
    const centers = [];
    const regionCentroid = {};

    function readPalette() {
      const cs = getComputedStyle(host);
      ['--ocean', '--land', '--land-edge', '--infect', '--infect-dark', '--ink', '--muted', '--helpy', '--danger', '--panel', '--good', '--warn']
        .forEach(k => { pal[k.slice(2)] = cs.getPropertyValue(k).trim(); });
      staticLayer = null;
    }

    function cellXY(i) {
      const c = W.cells[i];
      return [pad + R * SQ3 * (c.c + 0.5 + 0.5 * (c.r % 2)), pad + R + R * 1.5 * c.r];
    }

    function resize() {
      // Keep hexes tappable on phones: below 700px the map scrolls sideways inside its frame.
      const width = Math.max(700, canvas.parentElement.clientWidth);
      dpr = Math.min(2, root.devicePixelRatio || 1);
      // Fit cols + half offset horizontally.
      R = (width - 2 * pad) / (SQ3 * (W.cols + 0.5));
      const height = Math.round(pad * 2 + R * 2 + R * 1.5 * (W.rows - 1));
      cw = width; ch = height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.height = height + 'px';
      canvas.style.width = width + 'px';
      W.cells.forEach((c, i) => { centers[i] = cellXY(i); });
      D.REGION_ORDER.forEach(id => {
        let x = 0, y = 0;
        const cells = W.regionCells[id];
        cells.forEach(i => { x += centers[i][0]; y += centers[i][1]; });
        regionCentroid[id] = [x / cells.length, y / cells.length];
      });
      staticLayer = null;
    }

    function hexPath(g, x, y, r) {
      g.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 180 * (60 * k - 30);
        const px = x + r * Math.cos(a), py = y + r * Math.sin(a);
        if (k === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.closePath();
    }

    function buildStatic() {
      staticLayer = document.createElement('canvas');
      staticLayer.width = canvas.width;
      staticLayer.height = canvas.height;
      const g = staticLayer.getContext('2d');
      g.scale(dpr, dpr);
      g.fillStyle = pal.ocean;
      g.fillRect(0, 0, cw, ch);
      // faint latitude lines
      g.strokeStyle = pal['land-edge'];
      g.globalAlpha = 0.18;
      g.lineWidth = 1;
      for (let y = R * 3; y < ch; y += R * 4.5) {
        g.setLineDash([2, 6]);
        g.beginPath(); g.moveTo(0, y); g.lineTo(cw, y); g.stroke();
      }
      g.setLineDash([]);
      g.globalAlpha = 1;
      W.cells.forEach((c, i) => {
        const p = centers[i];
        hexPath(g, p[0], p[1], R * 0.94);
        g.fillStyle = pal.land;
        g.fill();
      });
      // region borders: draw edges between hexes of different regions
      g.strokeStyle = pal['land-edge'];
      g.lineWidth = Math.max(1, R * 0.16);
      g.lineCap = 'round';
      W.cells.forEach((c, i) => {
        c.nb.forEach(j => {
          if (j < i || W.cells[j].region === c.region) return;
          const a = centers[i], b = centers[j];
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
          const dx = b[0] - a[0], dy = b[1] - a[1];
          const len = Math.hypot(dx, dy);
          const nx = -dy / len * R * 0.5, ny = dx / len * R * 0.5;
          g.beginPath(); g.moveTo(mx + nx, my + ny); g.lineTo(mx - nx, my - ny); g.stroke();
        });
      });
    }

    function label(g, id, alpha) {
      if (R < 6) return;
      const p = regionCentroid[id];
      const size = Math.max(9, Math.min(15, R * 1.05));
      g.font = '700 ' + size + 'px "Baloo 2", system-ui, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.globalAlpha = alpha;
      g.lineWidth = 3;
      g.strokeStyle = pal.land;
      g.strokeText(D.REGIONS[id].name.toUpperCase(), p[0], p[1]);
      g.fillStyle = pal.ink;
      g.fillText(D.REGIONS[id].name.toUpperCase(), p[0], p[1]);
      g.globalAlpha = 1;
    }

    function draw(s, ui, t) {
      if (!cw) resize();
      if (!staticLayer) buildStatic();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(staticLayer, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const pulse = 0.5 + 0.5 * Math.sin(t / 300);

      if (s) {
        // reachable-but-unseeded regions get a soft dotted hint
        if (!ui.pickMode) D.REGION_ORDER.forEach(id => {
          if (s.regions[id].seeded || !root.HelpySim.canReach(s, id)) return;
          ctx.fillStyle = pal.helpy;
          ctx.globalAlpha = 0.18 + 0.12 * pulse;
          W.regionCells[id].forEach(i => {
            ctx.beginPath(); ctx.arc(centers[i][0], centers[i][1], R * 0.22, 0, Math.PI * 2); ctx.fill();
          });
          ctx.globalAlpha = 1;
        });

        // lit cells
        D.REGION_ORDER.forEach(id => {
          const reg = s.regions[id];
          if (!reg.seeded) return;
          const lit = root.HelpySim.litCells(s, id);
          const frontier = Math.max(0, lit.length - 3);
          lit.forEach((i, k) => {
            const p = centers[i];
            hexPath(ctx, p[0], p[1], R * 0.94);
            ctx.fillStyle = pal.infect;
            ctx.globalAlpha = k >= frontier ? 0.55 + 0.45 * pulse : 1;
            ctx.fill();
          });
          ctx.globalAlpha = 1;
          // network tree
          ctx.strokeStyle = pal['infect-dark'];
          ctx.lineWidth = Math.max(1, R * 0.14);
          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          lit.forEach(i => {
            const par = reg.parent[i];
            if (par === undefined || par < 0) return;
            ctx.moveTo(centers[i][0], centers[i][1]);
            ctx.lineTo(centers[par][0], centers[par][1]);
          });
          ctx.stroke();
          ctx.globalAlpha = 1;
          // nodes
          ctx.fillStyle = pal['infect-dark'];
          lit.forEach(i => {
            ctx.beginPath(); ctx.arc(centers[i][0], centers[i][1], R * 0.2, 0, Math.PI * 2); ctx.fill();
          });
        });

        // inter-region links with travelling packets
        s.links.forEach((l, n) => {
          if (l.a == null || l.b == null) return;
          const a = centers[l.a], b = centers[l.b];
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.25;
          ctx.strokeStyle = pal['infect-dark'];
          ctx.lineWidth = Math.max(1, R * 0.12);
          ctx.setLineDash([R * 0.4, R * 0.35]);
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(mx, my, b[0], b[1]); ctx.stroke();
          ctx.setLineDash([]);
          const u = ((t / 1600) + n * 0.37) % 1;
          const px = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * mx + u * u * b[0];
          const py = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * my + u * u * b[1];
          ctx.fillStyle = pal.infect;
          ctx.beginPath(); ctx.arc(px, py, R * 0.32, 0, Math.PI * 2); ctx.fill();
        });

        // threatened region
        if (s.threat && s.threat.region) {
          ctx.strokeStyle = pal.danger;
          ctx.lineWidth = Math.max(1.5, R * 0.18);
          ctx.globalAlpha = 0.4 + 0.6 * pulse;
          W.regionCells[s.threat.region].forEach(i => { hexPath(ctx, centers[i][0], centers[i][1], R * 0.8); ctx.stroke(); });
          ctx.globalAlpha = 1;
        }
      }

      // selection / hover outline
      const outline = (id, color, width, alpha) => {
        if (!id) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;
        W.regionCells[id].forEach(i => { hexPath(ctx, centers[i][0], centers[i][1], R * 0.94); ctx.stroke(); });
        ctx.globalAlpha = 1;
      };
      if (ui.hover && ui.hover !== ui.selected) outline(ui.hover, pal.ink, Math.max(1, R * 0.1), 0.35);
      outline(ui.selected, pal.ink, Math.max(1.5, R * 0.16), 0.9);

      // labels
      D.REGION_ORDER.forEach(id => label(ctx, id, ui.pickMode || id === ui.selected || id === ui.hover ? 0.95 : 0.55));

      // bubbles
      if (s) s.bubbles.forEach(b => {
        const p = centers[b.cell];
        const bob = Math.sin(t / 250 + b.id) * R * 0.3;
        const fade = Math.min(1, b.ttl / 4);
        const rad = Math.max(12, R * 1.25);
        const x = p[0], y = p[1] - rad * 0.9 + bob;
        b._hit = [x, y, rad * 1.25];
        ctx.globalAlpha = fade;
        ctx.fillStyle = b.kind === 'gossip' ? pal.helpy : pal.panel;
        ctx.strokeStyle = b.kind === 'gossip' ? pal.panel : pal.infect;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - rad * 0.3, y + rad * 0.85); ctx.lineTo(x, y + rad * 1.35); ctx.lineTo(x + rad * 0.3, y + rad * 0.85);
        ctx.fill();
        ctx.fillStyle = b.kind === 'gossip' ? pal.panel : pal.ink;
        ctx.font = '600 ' + Math.round(rad * 0.62) + 'px "Martian Mono", ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.kind === 'gossip' ? '−' + b.value : '+' + b.value, x, y + 1);
        ctx.globalAlpha = 1;
      });
    }

    function toLocal(ev) {
      const r = canvas.getBoundingClientRect();
      return [ev.clientX - r.left, ev.clientY - r.top];
    }

    function hit(s, ev) {
      const p = toLocal(ev);
      if (s) {
        for (let k = s.bubbles.length - 1; k >= 0; k--) {
          const b = s.bubbles[k];
          if (b._hit && Math.hypot(p[0] - b._hit[0], p[1] - b._hit[1]) <= b._hit[2]) return { bubble: b.id };
        }
      }
      let best = -1, bd = Infinity;
      centers.forEach((c, i) => {
        const d = Math.hypot(p[0] - c[0], p[1] - c[1]);
        if (d < bd) { bd = d; best = i; }
      });
      if (best >= 0 && bd < R * 1.6) return { region: W.cells[best].region };
      return {};
    }

    return { resize: resize, draw: draw, hit: hit, readPalette: readPalette };
  }

  root.HelpyRender = { create: create };
})(window);
