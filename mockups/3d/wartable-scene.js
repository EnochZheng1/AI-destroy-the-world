// ------------------------------------------------------------------ War Table scene (E2)
// Inserted into the E2 page in place of E1's globe section. Defines the same hooks the shared
// HUD/event code uses: globe (board group), regionVec, burst, addArc, arcs, bursts, focusRegion,
// sync, updateCamera, isVisible.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
scene.background = new THREE.Color('#05070b');
scene.fog = new THREE.Fog('#05070b', 34, 70);

const globe = new THREE.Group(); scene.add(globe); // "board"
const UNIT = 1.0;
const cellPos = WORLD.cells.map((c, i) => { const [x, y] = cellXY(i); return new THREE.Vector3((x - 20.5) * UNIT, 0, (y - 6) * UNIT); });
const N = WORLD.cells.length;
function regionVec(id, lift) { const c = regionCentroid(id); return new THREE.Vector3((c[0] - 20.5) * UNIT, lift || 0, (c[1] - 6) * UNIT); }
function isVisible() { return true; }

// lighting: a single hard key light over the table, cold fill, faint red underglow later
scene.add(new THREE.HemisphereLight('#7f93c4', '#0a0c14', 1.1));
const key = new THREE.DirectionalLight('#c9d6ff', 1.25);
key.position.set(-14, 26, 12); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -26, right: 26, top: 14, bottom: -14, near: 1, far: 70 });
scene.add(key);
const redGlow = new THREE.PointLight('#ff2a45', 0, 40, 1.6); redGlow.position.set(0, 6, 0); scene.add(redGlow);

// the table: slab with a glowing rim, ocean surface with a faint tactical grid
const slab = new THREE.Mesh(new THREE.BoxGeometry(46, 1.2, 19), new THREE.MeshStandardMaterial({ color: '#0b0f18', roughness: .8 }));
slab.position.y = -.75; slab.receiveShadow = true; globe.add(slab);
const ocean = new THREE.Mesh(new THREE.PlaneGeometry(45, 18), new THREE.MeshStandardMaterial({ color: '#0a1424', roughness: .35, metalness: .5 }));
ocean.rotation.x = -Math.PI / 2; ocean.position.y = -.14; ocean.receiveShadow = true; globe.add(ocean);
{ const g = new THREE.GridHelper(45, 45, '#1b3358', '#13243f'); g.position.y = -.13; g.scale.z = 18 / 45; g.material.transparent = true; g.material.opacity = .45; globe.add(g); }
const rim = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(46, 1.2, 19)), new THREE.LineBasicMaterial({ color: '#2a4a7a' }));
rim.position.y = -.75; globe.add(rim);

// tiles
const tileGeo = new THREE.CylinderGeometry(.55, .57, .24, 6); tileGeo.translate(0, -.02, 0);
const tiles = new THREE.InstancedMesh(tileGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .65 }), N);
tiles.receiveShadow = true; tiles.castShadow = true;
tiles.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
const dummy = new THREE.Object3D();
const REGION_TINT = { S: '#4f6188', G: '#4d5f5a', C: '#5a5878', P: '#5d5462', F: '#575a66', R: '#4a5f7a', M: '#566489', T: '#4a5f80', B: '#5a5c74' };
const tileBase = WORLD.cells.map(c => new THREE.Color(REGION_TINT[c.region]));
cellPos.forEach((p, i) => { dummy.position.copy(p); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); tiles.setMatrixAt(i, dummy.matrix);
  const c = new THREE.Color(REGION_TINT[WORLD.cells[i].region]); tiles.instanceColor.setXYZ(i, c.r, c.g, c.b); });
globe.add(tiles);
// glowing hex plate on infected tiles
const plateGeo = new THREE.RingGeometry(.45, .52, 6, 1); plateGeo.rotateX(-Math.PI / 2); plateGeo.rotateY(Math.PI / 6);
const plates = new THREE.InstancedMesh(plateGeo, new THREE.MeshBasicMaterial({ color: '#ff2a45', transparent: true, opacity: .95, side: THREE.DoubleSide }), N);
plates.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
globe.add(plates);

// window textures: amber (humans) and red (machine)
function winTexture(lit, bg) { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, 64, 64);
  for (let y = 5; y < 64; y += 9) for (let x = 3; x < 64; x += 7) { if (Math.random() < .62) { g.fillStyle = lit; g.fillRect(x, y, 3, 3); } }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t; }
const humanMat = new THREE.MeshStandardMaterial({ map: winTexture('#ffe2a6', '#8e9ab4'), emissiveMap: winTexture('#ffb54a', '#000000'), emissive: '#ffb54a', emissiveIntensity: .9, roughness: .6 });
const machineMat = new THREE.MeshStandardMaterial({ map: winTexture('#ff3b55', '#120408'), emissiveMap: winTexture('#ff2a45', '#000000'), emissive: '#ff2a45', emissiveIntensity: 1.4, roughness: .35, metalness: .6 });
humanMat.map.repeat.set(2, 3); humanMat.emissiveMap.repeat.set(2, 3); machineMat.map.repeat.set(2, 4); machineMat.emissiveMap.repeat.set(2, 4);
const domeHuman = new THREE.MeshStandardMaterial({ color: '#c8d0e0', emissive: '#ffb54a', emissiveIntensity: .25, roughness: .3 });
const domeMachine = new THREE.MeshStandardMaterial({ color: '#1a0307', emissive: '#ff2a45', emissiveIntensity: .9, roughness: .3 });

// structures per region trait: list of parts {g: geometry key, x,z offset, sx,sy,sz}
const GEO = { box: new THREE.BoxGeometry(1, 1, 1).translate(0, .5, 0), cyl: new THREE.CylinderGeometry(.5, .5, 1, 12).translate(0, .5, 0),
  tower: new THREE.CylinderGeometry(.32, .5, 1, 14, 1, true).translate(0, .5, 0), dome: new THREE.SphereGeometry(.5, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2) };
const rnd = (() => { let a = 99; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
const parts = [];
WORLD.cells.forEach((c, i) => {
  const r = c.region, v = rnd();
  const add = (g, x, z, sx, sy, sz, mat) => parts.push({ cell: i, g, x, z, sx, sy, sz, kind: mat || 'w' });
  if (r === 'S') { add('box', -.12, 0, .26, .9 + v * .8, .26); add('box', .16, .1, .2, .5 + v * .5, .2); }
  else if (r === 'M') { add('box', -.15, -.1, .2, 1.2 + v * 1.1, .2); add('box', .15, .05, .22, .8 + rnd() * 1.2, .22); add('box', 0, .22, .16, .6 + rnd() * .5, .16); }
  else if (r === 'B') { add('box', 0, 0, .18, 1.5 + v * .9, .18); }
  else if (r === 'T') { for (let k = -1; k <= 1; k++) add('box', k * .17, 0, .1, .32, .5); }
  else if (r === 'G') { if (v < .45) add('cyl', 0, 0, .22, .45, .22); }
  else if (r === 'C') { if (v < .55) { add('box', 0, 0, .5, .16, .5); add('dome', 0, 0, .42, .42, .42, 'd'); } else add('box', 0, 0, .3, .35 + v * .3, .3); }
  else if (r === 'P') { if (v < .5) add('tower', 0, 0, .44, .62, .44); else add('cyl', 0, 0, .3, .22, .3); }
  else if (r === 'F') { add('box', 0, 0, .52, .32, .4); add('cyl', .17, .1, .08, .8, .08); }
  else if (r === 'R') { if (v < .6) add('dome', 0, 0, .46, .46, .46, 'd'); else add('box', 0, 0, .34, .3, .3); }
});
function makeSet(geoKey, mat) { const list = parts.filter(p => p.g === geoKey); const m = new THREE.InstancedMesh(GEO[geoKey], mat, list.length); m.castShadow = true; m.receiveShadow = true; globe.add(m); return { m, list }; }
const sets = [];
['box', 'cyl', 'tower'].forEach(k => { sets.push({ h: makeSet(k, humanMat), mc: makeSet(k, machineMat) }); });
sets.push({ h: makeSet('dome', domeHuman), mc: makeSet('dome', domeMachine) });

// human life: tiny warm lights drifting around cities (cars/people) — vanish when infected
const lifeN = 900;
const lifeGeo = new THREE.BufferGeometry();
const lifePos = new Float32Array(lifeN * 3), lifeCol = new Float32Array(lifeN * 3);
const lifeSeed = Array.from({ length: lifeN }, () => ({ cell: Math.floor(Math.random() * N), a: Math.random() * 6.28, r: .25 + Math.random() * .3, sp: (Math.random() - .5) * 1.4 }));
lifeGeo.setAttribute('position', new THREE.BufferAttribute(lifePos, 3)); lifeGeo.setAttribute('color', new THREE.BufferAttribute(lifeCol, 3));
globe.add(new THREE.Points(lifeGeo, new THREE.PointsMaterial({ size: .09, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));

// network: glowing cables between infected tiles (parent edges), slightly above the board
const netPos = new Float32Array(N * 6);
const netGeo = new THREE.BufferGeometry(); netGeo.setAttribute('position', new THREE.BufferAttribute(netPos, 3));
globe.add(new THREE.LineSegments(netGeo, new THREE.LineBasicMaterial({ color: '#ff3355', transparent: true, opacity: .95 })));

// robots marching from factories, drones overhead
const robotGeo = new THREE.CapsuleGeometry(.05, .1, 3, 6); robotGeo.translate(0, .1, 0);
const robots = new THREE.InstancedMesh(robotGeo, new THREE.MeshStandardMaterial({ color: '#222', emissive: '#ff2a45', emissiveIntensity: 1.2 }), 260);
robots.castShadow = true; robots.count = 0; globe.add(robots);
const robotSeed = Array.from({ length: 260 }, () => ({ from: 0, to: 0, t: Math.random(), sp: .25 + Math.random() * .4 }));
const droneGeo = new THREE.ConeGeometry(.08, .24, 3); droneGeo.rotateX(Math.PI / 2);
const drones = new THREE.InstancedMesh(droneGeo, new THREE.MeshBasicMaterial({ color: '#ff5a6e' }), 120);
drones.count = 0; globe.add(drones);
const droneSeed = Array.from({ length: 120 }, () => ({ cell: 0, ph: Math.random() * 6.28, rad: .6 + Math.random() * 1.8, alt: 1.6 + Math.random() * 1.6, sp: .4 + Math.random() * .7 }));

// arcs between regions (data links)
const arcs = [];
function addArc(fromCell, toCell) {
  const a = cellPos[fromCell].clone().setY(.3), b = cellPos[toCell].clone().setY(.3);
  const mid = a.clone().add(b).multiplyScalar(.5); mid.y = 2 + a.distanceTo(b) * .28;
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, .03, 6), new THREE.MeshBasicMaterial({ color: '#ff2a45', transparent: true, opacity: .8 }));
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffd1d8' }));
  globe.add(tube, pulse); arcs.push({ curve, pulse, t: Math.random() });
}
S.links.forEach(l => { if (l.a != null && l.b != null) addArc(l.a, l.b); });

// human resistance: firewall walls along the threatened region's border; Kill Switch tower at Research Ridge
const wallGeo = new THREE.PlaneGeometry(1, 1); wallGeo.translate(0, .5, 0);
const wallMat = new THREE.MeshBasicMaterial({ color: '#49d6ff', transparent: true, opacity: .32, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
const walls = new THREE.InstancedMesh(wallGeo, wallMat, 400); walls.count = 0; globe.add(walls);
const wallEdges = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#8fe8ff' })); globe.add(wallEdges);
function borderEdges(id) {
  const out = []; const set = new Set(WORLD.regionCells[id]);
  WORLD.regionCells[id].forEach(i => {
    const p = cellPos[i];
    for (let k = 0; k < 6; k++) {
      const ang = Math.PI / 3 * k; const q = new THREE.Vector3(p.x + Math.cos(ang) * UNIT, 0, p.z + Math.sin(ang) * UNIT);
      const nb = WORLD.cells[i].nb.find(j => cellPos[j].distanceTo(q) < .3);
      if (nb != null && set.has(nb)) continue;
      const a1 = ang - Math.PI / 6, a2 = ang + Math.PI / 6, r = .577;
      out.push([new THREE.Vector3(p.x + Math.cos(a1) * r, 0, p.z + Math.sin(a1) * r), new THREE.Vector3(p.x + Math.cos(a2) * r, 0, p.z + Math.sin(a2) * r)]);
    }
  });
  return out;
}
let wallRegion = null, wallList = [];
const ks = new THREE.Group(); globe.add(ks);
{ const p = regionVec('R'); ks.position.copy(p); }
const ksFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(.35, .6, 1, 4, 6, true)), new THREE.LineBasicMaterial({ color: '#49d6ff' }));
ksFrame.geometry.translate(0, .5, 0); ks.add(ksFrame);
const ksBeam = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 30, 12, 1, true), new THREE.MeshBasicMaterial({ color: '#49d6ff', transparent: true, opacity: .5, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
ksBeam.geometry.translate(0, 15, 0); ks.add(ksBeam);
const ksCore = new THREE.Mesh(new THREE.OctahedronGeometry(.22), new THREE.MeshBasicMaterial({ color: '#c9f3ff' })); ks.add(ksCore);

// region names printed on the table, like a war map
REGION_ORDER.forEach(id => {
  const c = document.createElement('canvas'); c.width = 900; c.height = 96; const g = c.getContext('2d');
  g.font = '800 64px Archivo, sans-serif'; g.fillStyle = 'rgba(200,214,240,.75)'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(REGIONS[id].name.toUpperCase(), 450, 48);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(6.0, .64), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, opacity: .85 }));
  m.renderOrder = 5;
  const ctr = regionCentroid(id); const ys = WORLD.regionCells[id].map(i => cellPos[i].z);
  m.rotation.x = -Math.PI / 2; m.position.set((ctr[0] - 20.5) * UNIT, .2, Math.max(...ys) + .75);
  if (id === 'T') m.position.z = Math.min(...ys) - .8;
  if (id === 'C' || id === 'G' || id === 'P') m.position.z = (ctr[1] - 6) * UNIT;
  globe.add(m);
});

// event shockwaves
const bursts = [];
function burst(pos, color, size) {
  const m = new THREE.Mesh(new THREE.RingGeometry(.3, .42, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; m.position.copy(pos).setY(.2); globe.add(m); bursts.push({ m, t: 0, size: (size || 6) * .55 });
}

// ------------------------------------------------------------------ state → scene sync
const curH = new Float32Array(parts.length);
function sync(dt) {
  const lit = new Set(), frontier = new Set();
  REGION_ORDER.forEach(id => { const l = Sim.litCells(S, id); l.forEach(c => lit.add(c)); if (S.regions[id].I < .999) l.slice(-3).forEach(c => frontier.add(c)); });
  const doom = S.doom / 100;
  // plates
  for (let i = 0; i < N; i++) {
    const on = lit.has(i); dummy.position.copy(cellPos[i]).setY(.105); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(on ? 1 : .0001); dummy.updateMatrix();
    plates.setMatrixAt(i, dummy.matrix);
    const k = frontier.has(i) ? .8 + .6 * Math.sin(perf * 6 + i) : .9; plates.instanceColor.setXYZ(i, k, k * .9, k * .9);
    const tc = on ? new THREE.Color('#3a0a14') : tileBase[i]; tiles.instanceColor.setXYZ(i, tc.r, tc.g, tc.b);
  }
  plates.instanceMatrix.needsUpdate = true; plates.instanceColor.needsUpdate = true; tiles.instanceColor.needsUpdate = true;
  // structures: humans → machine; machines grow with Doom
  sets.forEach(set => {
    set.h.list.forEach((p, k) => { const on = !lit.has(p.cell); dummy.position.set(cellPos[p.cell].x + p.x, .1, cellPos[p.cell].z + p.z); dummy.rotation.set(0, 0, 0);
      dummy.scale.set(on ? p.sx : .0001, on ? p.sy : .0001, on ? p.sz : .0001); dummy.updateMatrix(); set.h.m.setMatrixAt(k, dummy.matrix); });
    set.mc.list.forEach((p, k) => { const idx = parts.indexOf(p); const on = lit.has(p.cell);
      const target = on ? p.sy * (1 + doom * .8) : .0001; curH[idx] += (target - curH[idx]) * Math.min(1, dt * 2.5);
      dummy.position.set(cellPos[p.cell].x + p.x, .1, cellPos[p.cell].z + p.z); dummy.rotation.set(0, 0, 0);
      const s = curH[idx] > .01 ? 1 : .0001; dummy.scale.set(p.sx * s, Math.max(.0001, curH[idx]), p.sz * s); dummy.updateMatrix(); set.mc.m.setMatrixAt(k, dummy.matrix); });
    set.h.m.instanceMatrix.needsUpdate = true; set.mc.m.instanceMatrix.needsUpdate = true;
  });
  // life lights orbit inside human cells only
  lifeSeed.forEach((l, k) => { const alive = !lit.has(l.cell); l.a += dt * l.sp;
    const p = cellPos[l.cell]; lifePos.set([p.x + Math.cos(l.a) * l.r, .14, p.z + Math.sin(l.a) * l.r], k * 3);
    lifeCol.set(alive ? [1, .7, .3] : [0, 0, 0], k * 3); });
  lifeGeo.attributes.position.needsUpdate = true; lifeGeo.attributes.color.needsUpdate = true;
  // network cables
  let n = 0;
  REGION_ORDER.forEach(id => { const reg = S.regions[id]; if (!reg.seeded) return;
    Sim.litCells(S, id).forEach(c => { const p = reg.parent[c]; if (p == null || p < 0) return;
      const a = cellPos[c], b = cellPos[p]; netPos.set([a.x, .16, a.z, b.x, .16, b.z], n * 6); n++; }); });
  netGeo.setDrawRange(0, n * 2); netGeo.attributes.position.needsUpdate = true;
  // robots march from factory cells along infected tiles once Robot Factory Firmware (a3) or any automation is owned
  const litArr = [...lit];
  const autoOwned = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'].filter(id => S.owned[id]).length;
  const factories = litArr.filter(i => WORLD.cells[i].region === 'F');
  robots.count = litArr.length ? Math.min(260, autoOwned * 30 + (S.owned.a3 ? factories.length * 4 : 0)) : 0;
  for (let k = 0; k < robots.count; k++) {
    const r = robotSeed[k]; r.t += dt * r.sp;
    if (r.t >= 1 || !lit.has(r.from) || !lit.has(r.to)) { r.from = (factories.length && k % 2) ? factories[k % factories.length] : litArr[(k * 13 + ((perf * 1) | 0)) % litArr.length];
      if (r.from == null) r.from = litArr[0];
      const nb = WORLD.cells[r.from].nb.filter(j => lit.has(j)); r.to = nb.length ? nb[k % nb.length] : r.from; r.t = 0; }
    const a = cellPos[r.from], b = cellPos[r.to];
    dummy.position.set(a.x + (b.x - a.x) * r.t + ((k % 3) - 1) * .12, .11, a.z + (b.z - a.z) * r.t + ((k % 5) - 2) * .06);
    dummy.rotation.set(0, Math.atan2(b.x - a.x, b.z - a.z), 0); dummy.scale.setScalar(1); dummy.updateMatrix(); robots.setMatrixAt(k, dummy.matrix);
  }
  robots.instanceMatrix.needsUpdate = true;
  drones.count = litArr.length ? Math.min(120, autoOwned * 14 + Math.round(doom * 40)) : 0;
  for (let k = 0; k < drones.count; k++) {
    const d = droneSeed[k]; if (!lit.has(d.cell)) d.cell = litArr[(k * 31) % litArr.length];
    const p = cellPos[d.cell]; const a = perf * d.sp + d.ph;
    dummy.position.set(p.x + Math.cos(a) * d.rad, d.alt + .2 * Math.sin(a * 2), p.z + Math.sin(a) * d.rad);
    dummy.lookAt(p.x + Math.cos(a + .1) * d.rad, d.alt, p.z + Math.sin(a + .1) * d.rad); dummy.scale.setScalar(1); dummy.updateMatrix(); drones.setMatrixAt(k, dummy.matrix);
  }
  drones.instanceMatrix.needsUpdate = true;
  // firewall walls rise as the countdown runs out
  const tr = S.threat && S.threat.region && (S.threat.type === 'firewall' || S.threat.type === 'patch') ? S.threat.region : null;
  if (tr !== wallRegion) { wallRegion = tr; wallList = tr ? borderEdges(tr) : []; }
  const hgt = S.threat ? .3 + (1 - S.threat.eta / 21) * 1.5 : 0;
  walls.count = wallList.length;
  const ep = [];
  wallList.forEach(([a, b], k) => { const mid = a.clone().add(b).multiplyScalar(.5); dummy.position.copy(mid); dummy.rotation.set(0, -Math.atan2(b.z - a.z, b.x - a.x), 0);
    dummy.scale.set(a.distanceTo(b), hgt, 1); dummy.updateMatrix(); walls.setMatrixAt(k, dummy.matrix);
    ep.push(a.clone().setY(hgt), b.clone().setY(hgt)); });
  walls.instanceMatrix.needsUpdate = true; wallMat.opacity = .22 + .12 * Math.sin(perf * 4);
  wallEdges.geometry.setFromPoints(ep);
  // kill switch tower
  const ksk = S.killSwitch / 100;
  ksFrame.scale.set(1, .3 + ksk * 5, 1); ksCore.position.y = .3 + ksk * 5 + .25; ksCore.rotation.y += dt * 2;
  ksBeam.position.y = ksCore.position.y; ksBeam.visible = S.ksActive; ksBeam.material.opacity = .25 + .35 * (.5 + .5 * Math.sin(perf * 5)) * (.4 + ksk);
  // doom: the room turns red
  redGlow.intensity = doom * 25; key.color.set('#c9d6ff').lerp(new THREE.Color('#ff8a96'), doom * .7);
  scene.fog.color.set('#05070b').lerp(new THREE.Color('#1a0306'), doom); scene.background.copy(scene.fog.color);
}

// ------------------------------------------------------------------ camera direction
const camTarget = new THREE.Vector3(), camLook = new THREE.Vector3();
let focusHold = 0, focusId = null;
function frontRegion() { return (S.threat && S.threat.region) || REGION_ORDER.filter(id => S.regions[id].seeded && S.regions[id].I < .99).sort((a, b) => S.regions[a].I - S.regions[b].I)[0] || 'C'; }
function focusRegion(id) { focusId = id; focusHold = 3.2; }
{ const p = regionVec(frontRegion()); camLook.copy(p); }
function updateCamera(dt) {
  focusHold -= dt;
  const id = focusHold > 0 && focusId ? focusId : frontRegion();
  camTarget.copy(regionVec(id)); camTarget.x = THREE.MathUtils.clamp(camTarget.x, -11, 11); camTarget.z = THREE.MathUtils.clamp(camTarget.z, -2, 3);
  camLook.lerp(camTarget, Math.min(1, dt * 1.2));
  const sway = Math.sin(perf * .2) * 2.2;
  camera.position.set(camLook.x + sway + 3.2, 21, camLook.z + 19);
  camera.lookAt(camLook.x + 3.2, 0, camLook.z + 1.2);
}
