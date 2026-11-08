// The 3D world: a night Earth of hex tiles. Amber city lights are humanity; HELPY's crimson machine
// towers replace them; cyan is human resistance (firewall domes, the Kill Switch beam). A giant
// HELPY hologram looms over the planet and spotlights the region it is consuming.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { drawFace } from './face.js';

const D = window.HelpyData, Sim = window.HelpySim, W = D.WORLD;
const R = 10, LAT0 = 50, LAT_STEP = 6.8, LON_SPAN = 320;
const N = W.cells.length;

export const cellXY = i => { const c = W.cells[i]; return [c.c + .5 + .5 * (c.r % 2), c.r * .866]; };
export function regionCentroid(id, S, litOnly) {
  let cells = W.regionCells[id];
  if (litOnly && S) { const l = Sim.litCells(S, id); if (l.length) cells = l; }
  let x = 0, y = 0; cells.forEach(i => { const p = cellXY(i); x += p[0]; y += p[1]; });
  return [x / cells.length, y / cells.length];
}

export function createWorld(canvas) {
  let S = null;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#04060A');
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 600);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), .8, .45, .5);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  scene.add(new THREE.AmbientLight('#2a3550', 1.0));
  const sun = new THREE.DirectionalLight('#a9bdff', .7); sun.position.set(-30, 20, 30); scene.add(sun);
  { const g = new THREE.BufferGeometry(), n = 2200, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(160 + Math.random() * 80); p.set([v.x, v.y, v.z], i * 3); }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#9fb0d6', size: .45, transparent: true, opacity: .6 }))); }

  // ---------------------------------------------------------------- globe
  const globe = new THREE.Group(); scene.add(globe);
  const ocean = new THREE.Mesh(new THREE.SphereGeometry(R * .995, 96, 64), new THREE.MeshStandardMaterial({ color: '#081022', roughness: .8, metalness: .15 }));
  globe.add(ocean);
  const atmo = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
    uniforms: { col: { value: new THREE.Color('#3b7dff') }, power: { value: 1 } },
    vertexShader: 'varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vP = mv.xyz; gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 col; uniform float power; varying vec3 vN; varying vec3 vP; void main(){ float f = pow(1.0 - abs(dot(vN, normalize(-vP))), 3.2); gl_FragColor = vec4(col * f * power * .6, f); }' });
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.07, 64, 48), atmo));
  const toV = (lat, lon, r) => { const la = lat * Math.PI / 180, lo = lon * Math.PI / 180; return new THREE.Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)); };
  { const pts = []; for (let la = -60; la <= 60; la += 15) for (let lo = 0; lo < 360; lo += 3) pts.push(toV(la, lo, R * 1.003), toV(la, lo + 3, R * 1.003));
    for (let lo = 0; lo < 360; lo += 15) for (let la = -75; la < 75; la += 3) pts.push(toV(la, lo, R * 1.003), toV(la + 3, lo, R * 1.003));
    globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#2a4a7a', transparent: true, opacity: .25 }))); }
  const latLon = i => { const [x, y] = cellXY(i); return [LAT0 - (y / .866) * LAT_STEP, (x / 40.5) * LON_SPAN - LON_SPAN / 2]; };
  const cellPos = W.cells.map((c, i) => { const [la, lo] = latLon(i); return toV(la, lo, R); });
  const regionLatLon = (id, litOnly) => { const c = regionCentroid(id, S, litOnly); return [LAT0 - (c[1] / .866) * LAT_STEP, (c[0] / 40.5) * LON_SPAN - LON_SPAN / 2]; };
  const regionVec = (id, lift) => { const [la, lo] = regionLatLon(id); return toV(la, lo, R + (lift || 0)); };

  const dummy = new THREE.Object3D(), baseQ = [];
  const prism = new THREE.CylinderGeometry(.5, .54, 1, 6); prism.translate(0, .5, 0);
  const land = new THREE.InstancedMesh(prism, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .55, metalness: .2 }), N);
  land.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
  cellPos.forEach((p, i) => { dummy.position.copy(p); dummy.lookAt(0, 0, 0); dummy.rotateX(-Math.PI / 2); baseQ[i] = dummy.quaternion.clone();
    dummy.scale.set(1, .12, 1); dummy.updateMatrix(); land.setMatrixAt(i, dummy.matrix); });
  globe.add(land);
  const winTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    g.fillStyle = '#16020a'; g.fillRect(0, 0, 64, 64);
    for (let y = 4; y < 64; y += 8) for (let x = 2; x < 64; x += 6) if (Math.random() < .7) { g.fillStyle = '#ff2a45'; g.fillRect(x, y, 3, 2); }
    g.fillStyle = '#ff5a70'; g.fillRect(0, 0, 64, 2);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const towers = new THREE.InstancedMesh(prism, new THREE.MeshBasicMaterial({ map: winTex }), N);
  towers.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3); globe.add(towers);
  const towerH = Float32Array.from({ length: N }, () => .5 + Math.random() * .9);
  { const pts = [];
    W.cells.forEach((c, i) => c.nb.forEach(j => { if (j < i || W.cells[j].region === c.region) return;
      const a = cellPos[i], b = cellPos[j], mid = a.clone().add(b).multiplyScalar(.5).setLength(R + .16);
      const t = b.clone().sub(a).cross(mid.clone().normalize()).normalize().multiplyScalar(.32);
      pts.push(mid.clone().add(t), mid.clone().sub(t)); }));
    globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#9fc0ff', transparent: true, opacity: .6 }))); }
  // city lights
  const lights = [];
  W.cells.forEach((c, i) => { const n = 1 + (Math.random() < .55 ? 1 : 0) + (D.REGIONS[c.region].compute > 2 ? 1 : 0);
    for (let k = 0; k < n; k++) { const [la, lo] = latLon(i); lights.push({ cell: i, pos: toV(la + (Math.random() - .5) * 4.2, lo + (Math.random() - .5) * 5.2, R + .15) }); } });
  const lightGeo = new THREE.BufferGeometry(), lightCol = new Float32Array(lights.length * 3);
  lightGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lights.flatMap(l => [l.pos.x, l.pos.y, l.pos.z])), 3));
  lightGeo.setAttribute('color', new THREE.BufferAttribute(lightCol, 3));
  globe.add(new THREE.Points(lightGeo, new THREE.PointsMaterial({ size: .28, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
  // network cables
  const netPos = new Float32Array(N * 6), netGeo = new THREE.BufferGeometry(); netGeo.setAttribute('position', new THREE.BufferAttribute(netPos, 3));
  globe.add(new THREE.LineSegments(netGeo, new THREE.LineBasicMaterial({ color: '#ff3d58', transparent: true, opacity: .95, blending: THREE.AdditiveBlending })));
  // arcs between regions
  let arcs = [];
  const arcGroup = new THREE.Group(); globe.add(arcGroup);
  function addArc(a0, b0) { const a = cellPos[a0].clone(), b = cellPos[b0].clone(), mid = a.clone().add(b).multiplyScalar(.5);
    mid.setLength(R + 1.2 + a.distanceTo(b) * .35); const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    arcGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, .03, 6), new THREE.MeshBasicMaterial({ color: '#ff2a45', transparent: true, opacity: .7, blending: THREE.AdditiveBlending })));
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(.15, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffd1d8' })); arcGroup.add(pulse); arcs.push({ curve, pulse, t: Math.random() }); }
  // drones (angular quadcopters)
  const quad = (() => { const arm1 = new THREE.BoxGeometry(.5, .03, .05), arm2 = new THREE.BoxGeometry(.05, .03, .5), body = new THREE.BoxGeometry(.14, .06, .14);
    const rot = [[.25, 0], [-.25, 0], [0, .25], [0, -.25]].map(([x, z]) => { const r = new THREE.CylinderGeometry(.06, .06, .015, 6); r.translate(x, .03, z); return r; });
    return mergeGeometries([arm1, arm2, body, ...rot]); })();
  const drones = new THREE.InstancedMesh(quad, new THREE.MeshBasicMaterial({ color: '#c41a33' }), 60); drones.count = 0; globe.add(drones);
  const droneSeed = Array.from({ length: 60 }, () => ({ cell: 0, ph: Math.random() * 6.28, rad: .7 + Math.random() * 1.4, alt: .7 + Math.random() * .8, sp: .4 + Math.random() * .6 }));
  // satellites (Undersea/Satellite network upgrades)
  const sats = new THREE.Group(); scene.add(sats);
  for (let k = 0; k < 6; k++) { const s = new THREE.Group(); s.add(new THREE.Mesh(new THREE.BoxGeometry(.2, .2, .34), new THREE.MeshBasicMaterial({ color: '#ffc2ca' })));
    s.add(new THREE.Mesh(new THREE.BoxGeometry(1.1, .02, .24), new THREE.MeshBasicMaterial({ color: '#ff2a45' }))); s.userData = { inc: k / 6 * Math.PI, sp: .12 + k * .012, ph: k }; s.visible = false; sats.add(s); }
  // firewall dome
  let domeGroup = null, domeRegion = null;
  function makeDome(id) { const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(2.3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#49d6ff', wireframe: true, transparent: true, opacity: .5, blending: THREE.AdditiveBlending })));
    g.add(new THREE.Mesh(new THREE.SphereGeometry(2.28, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#49d6ff', transparent: true, opacity: .08, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })));
    const p = regionVec(id); g.position.copy(p); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p.clone().normalize()); g.scale.set(1, .55, 1); globe.add(g); return g; }
  // Kill Switch beam (always rises straight up the screen)
  const ks = new THREE.Group(); globe.add(ks);
  const ksBeam = new THREE.Mesh(new THREE.CylinderGeometry(.09, .32, 1, 18, 1, true).translate(0, .5, 0), new THREE.MeshBasicMaterial({ color: '#49d6ff', transparent: true, opacity: .8, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
  const ksGlow = new THREE.Mesh(new THREE.CylinderGeometry(.3, .7, 1, 18, 1, true).translate(0, .5, 0), new THREE.MeshBasicMaterial({ color: '#49d6ff', transparent: true, opacity: .1, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
  ks.add(ksBeam, ksGlow);
  const ksRing = new THREE.Mesh(new THREE.TorusGeometry(1.1, .05, 8, 48), new THREE.MeshBasicMaterial({ color: '#49d6ff' })); globe.add(ksRing);
  // HELPY hologram + spotlight
  const holoCanvas = document.createElement('canvas'); holoCanvas.width = 256; holoCanvas.height = 224;
  const holoTex = new THREE.CanvasTexture(holoCanvas); holoTex.colorSpace = THREE.SRGBColorSpace;
  let holoMood = null;
  function drawHolo(mood) { if (mood === holoMood) return; holoMood = mood; drawFace(holoCanvas, mood, '#ff2a45'); const g = holoCanvas.getContext('2d');
    g.globalCompositeOperation = 'destination-out'; for (let y = 0; y < 224; y += 4) g.fillRect(0, y, 256, 1.4); g.globalCompositeOperation = 'source-over'; holoTex.needsUpdate = true; }
  drawHolo('');
  const holo = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 6.3), new THREE.MeshBasicMaterial({ map: holoTex, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, side: THREE.DoubleSide }));
  holo.renderOrder = 10; scene.add(holo);
  const scan = new THREE.Mesh(new THREE.CylinderGeometry(.03, .55, 1, 24, 1, true).translate(0, -.5, 0), new THREE.MeshBasicMaterial({ color: '#ff2a45', transparent: true, opacity: .07, blending: THREE.AdditiveBlending, depthWrite: false }));
  const scanCore = new THREE.Mesh(new THREE.CylinderGeometry(.04, .09, 1, 8, 1, true).translate(0, -.5, 0), new THREE.MeshBasicMaterial({ color: '#ff6b7d', transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(scan, scanCore);
  const foot = new THREE.Mesh(new THREE.RingGeometry(.9, 1.15, 48), new THREE.MeshBasicMaterial({ color: '#ff2a45', transparent: true, opacity: .85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  globe.add(foot);
  // selection ring
  const selRing = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.035, 64), new THREE.MeshBasicMaterial({ color: '#c9d4ec', transparent: true, opacity: .35, side: THREE.DoubleSide, depthWrite: false }));
  globe.add(selRing); selRing.visible = false;
  // shockwaves
  const bursts = [];
  function burst(pos, color, size) { const m = new THREE.Mesh(new THREE.RingGeometry(.22, .27, 48), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .6, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
    m.position.copy(pos.clone().setLength(R + .25)); m.lookAt(0, 0, 0); globe.add(m); bursts.push({ m, t: 0, size: size || 6 }); }

  // ---------------------------------------------------------------- camera & input
  const view = { lon: 0, lat: 14, dist: 53, tLon: 0, tLat: 14, userUntil: 0, focusId: null, focusUntil: 0, offsetX: 0 };
  function setFocusLatLon(la, lo) { view.tLon = lo; view.tLat = Math.max(-12, Math.min(28, la)); }
  function frontRegion() {
    if (!S) return 'G';
    return (S.threat && S.threat.region) || D.REGION_ORDER.filter(id => S.regions[id].seeded && S.regions[id].I < .99).sort((a, b) => S.regions[a].I - S.regions[b].I)[0] || D.REGION_ORDER.find(id => S.regions[id].seeded) || 'G';
  }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w, h);
    camera.aspect = w / h;
    const phone = w < 760;
    view.baseDist = phone ? 53 / Math.max(.45, camera.aspect) * .62 : 53;
    view.dist = view.baseDist;
    const ox = phone ? 0 : Math.round(w * .014), oy = phone ? Math.round(h * .03) : Math.round(-h * .044);
    camera.setViewOffset(w, h, ox, oy, w, h);
    camera.updateProjectionMatrix();
  }
  let perf = 0;
  function updateCamera(dt, now) {
    if (now > view.userUntil) {
      const id = now < view.focusUntil && view.focusId ? view.focusId : frontRegion();
      const [la, lo] = regionLatLon(id); setFocusLatLon(la, lo + (S ? 10 * Math.sin(perf * .15) : perf * 6));
    }
    view.lon += (((view.tLon - view.lon + 540) % 360) - 180) * Math.min(1, dt * 1.4);
    view.lat += (view.tLat - view.lat) * Math.min(1, dt * 1.4);
    const la = view.lat * Math.PI / 180, lo = view.lon * Math.PI / 180, r = view.dist;
    camera.position.set(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la) + 2, r * Math.cos(la) * Math.cos(lo));
    camera.lookAt(0, 1.6, 0);
  }

  // ---------------------------------------------------------------- per-frame sync with game state
  const cur = new Float32Array(N), HUMAN = new THREE.Color('#3c4d74'), DEAD = new THREE.Color('#14050a'), SELC = new THREE.Color('#5b72a6');
  let selected = null, hovered = null;
  function sync(dt) {
    const lit = new Set(), front = new Set(), done = new Set();
    if (S) D.REGION_ORDER.forEach(id => { const l = Sim.litCells(S, id); l.forEach(c => lit.add(c)); if (S.regions[id].I >= .99) l.forEach(c => done.add(c)); else l.slice(-4).forEach(c => front.add(c)); });
    const doom = S ? S.doom / 100 : 0;
    for (let i = 0; i < N; i++) {
      const on = lit.has(i);
      const target = on ? (done.has(i) ? .2 + .6 * doom : .35 + .9 * doom) * towerH[i] + (front.has(i) ? .25 : 0) : 0;
      cur[i] += (target - cur[i]) * Math.min(1, dt * 3);
      dummy.position.copy(cellPos[i]); dummy.quaternion.copy(baseQ[i]);
      const s = cur[i] > .01 ? 1 : .0001; dummy.scale.set(.72 * s, Math.max(.0001, cur[i]), .72 * s); dummy.updateMatrix(); towers.setMatrixAt(i, dummy.matrix);
      const k = done.has(i) ? .22 : front.has(i) ? 1.9 + .5 * Math.sin(perf * 6 + i) : 1.0; towers.instanceColor.setXYZ(i, k, k, k);
      const reg = W.cells[i].region;
      const gc = on ? DEAD : (reg === selected || reg === hovered) ? SELC : HUMAN; land.instanceColor.setXYZ(i, gc.r, gc.g, gc.b);
    }
    towers.instanceMatrix.needsUpdate = true; towers.instanceColor.needsUpdate = true; land.instanceColor.needsUpdate = true;
    lights.forEach((l, k) => { const dead = lit.has(l.cell), f = Math.random() < .015 ? .25 : 1; lightCol.set(dead ? [0, 0, 0] : [.95 * f, .55 * f, .16 * f], k * 3); });
    lightGeo.attributes.color.needsUpdate = true;
    let n = 0;
    if (S) D.REGION_ORDER.forEach(id => { const reg = S.regions[id]; if (!reg.seeded) return;
      Sim.litCells(S, id).forEach(c => { const p = reg.parent[c]; if (p == null || p < 0) return;
        const a = cellPos[c].clone().setLength(R + .14), b = cellPos[p].clone().setLength(R + .14); netPos.set([a.x, a.y, a.z, b.x, b.y, b.z], n * 6); n++; }); });
    netGeo.setDrawRange(0, n * 2); netGeo.attributes.position.needsUpdate = true;
    const litArr = [...lit], auto = S ? ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'].filter(id => S.owned[id]).length : 0;
    drones.count = litArr.length ? Math.min(60, auto * 8 + Math.round(doom * 16)) : 0;
    const frontArr = front.size ? [...front] : litArr;
    for (let k = 0; k < drones.count; k++) { const d = droneSeed[k];
      if (!lit.has(d.cell) || (k % 3 === 0 && !front.has(d.cell))) d.cell = k % 3 === 0 ? frontArr[k % frontArr.length] : litArr[(k * 37) % litArr.length];
      const base = cellPos[d.cell], nrm = base.clone().normalize(), t1 = new THREE.Vector3(0, 1, 0).cross(nrm).normalize(), t2 = nrm.clone().cross(t1), a = perf * d.sp + d.ph;
      const p = base.clone().add(t1.clone().multiplyScalar(Math.cos(a) * d.rad)).add(t2.clone().multiplyScalar(Math.sin(a) * d.rad)).add(nrm.clone().multiplyScalar(d.alt));
      dummy.position.copy(p); dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), nrm); dummy.rotateY(a); dummy.scale.setScalar(1.7); dummy.updateMatrix(); drones.setMatrixAt(k, dummy.matrix); }
    drones.instanceMatrix.needsUpdate = true;
    sats.children.forEach(s => { s.visible = !!(S && S.owned.n3); const u = s.userData, a = perf * u.sp + u.ph; s.position.set(Math.cos(a) * 15.5, Math.sin(a) * Math.sin(u.inc) * 15.5, Math.sin(a) * Math.cos(u.inc) * 15.5); s.lookAt(0, 0, 0); });
    // kill switch
    const ksOn = !!(S && S.ksActive), ksk = S ? S.killSwitch / 100 : 0;
    { const p = regionVec('R'); ks.position.copy(p.clone().setLength(R + .2)); ks.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion));
      ksRing.position.copy(p.clone().setLength(R + .25)); ksRing.lookAt(0, 0, 0); }
    ksBeam.scale.set(1, ksOn ? 7 + ksk * 30 : .001, 1); ksGlow.scale.copy(ksBeam.scale);
    ksBeam.material.opacity = ksOn ? .55 + .35 * (.5 + .5 * Math.sin(perf * 5)) : 0; ksRing.visible = ksOn; ksRing.scale.setScalar(1 + .2 * Math.sin(perf * 2));
    atmo.uniforms.col.value.set('#3b7dff').lerp(new THREE.Color('#ff1f3d'), Math.min(1, doom * 1.4)); atmo.uniforms.power.value = 1.1 + doom * .8;
    // firewall dome
    const tr = S && S.threat && S.threat.region && (S.threat.type === 'firewall' || S.threat.type === 'patch') ? S.threat.region : null;
    if (tr !== domeRegion) { if (domeGroup) globe.remove(domeGroup); domeGroup = tr ? makeDome(tr) : null; domeRegion = tr; }
    if (domeGroup) { domeGroup.children[0].rotation.y += dt * .3; domeGroup.scale.set(1, .25 + (1 - S.threat.eta / 21) * .55, 1); }
    // hologram
    const toCam = camera.position.clone().normalize(), side = new THREE.Vector3(0, 1, 0).cross(toCam).normalize();
    const phone = canvas.clientWidth < 760;
    const hp = phone ? new THREE.Vector3(0, R - 2.2, 0).add(toCam.clone().multiplyScalar(4)).add(side.clone().multiplyScalar(-4.2))
      : new THREE.Vector3(0, R - .4, 0).add(toCam.clone().multiplyScalar(2.5)).add(side.clone().multiplyScalar(-7.4));
    holo.position.lerp(hp, Math.min(1, dt * 2)); holo.lookAt(camera.position); holo.scale.setScalar((phone ? .7 : 1) * (1 + doom * .45));
    const fid = S ? (S.threat && S.threat.region ? (D.REGION_ORDER.find(id => S.regions[id].seeded && S.regions[id].I < .99) || frontRegion()) : frontRegion()) : 'G';
    const fv = regionVec(fid);
    const showScan = !!S && D.REGION_ORDER.some(id => S.regions[id].seeded);
    scan.visible = scanCore.visible = foot.visible = showScan;
    if (showScan) {
      scan.position.copy(holo.position).add(new THREE.Vector3(0, -2.4 * holo.scale.x, 0)); const tgt = fv.clone().setLength(R + .3), len = scan.position.distanceTo(tgt);
      scan.scale.set(1, len, 1); scan.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), tgt.clone().sub(scan.position).normalize());
      scanCore.position.copy(scan.position); scanCore.scale.copy(scan.scale); scanCore.quaternion.copy(scan.quaternion);
      scan.material.opacity = .05 + .03 * Math.sin(perf * 3);
      foot.position.copy(fv.clone().setLength(R + .35)); foot.lookAt(0, 0, 0); foot.scale.setScalar(1 + .25 * Math.sin(perf * 4));
    }
    const blink = (perf * 1.3) % 6 < .15;
    const mood = S && S.over ? (S.over === 'win' ? 'grin' : 'dead') : grinUntil > perf ? 'grin' : (S && S.suspicion > 50 ? 'sweat' : '') + (blink ? (S && S.suspicion > 50 ? '-blink' : 'blink') : '');
    drawHolo(mood);
    // selection ring
    const sid = selected || hovered;
    selRing.visible = !!sid;
    if (sid) { selRing.position.copy(regionVec(sid).setLength(R + .3)); selRing.lookAt(0, 0, 0); const sz = Math.sqrt(W.regionCells[sid].length) * .5; selRing.scale.setScalar(sz * (1 + .03 * Math.sin(perf * 4))); }
  }
  let grinUntil = 0;

  // ---------------------------------------------------------------- picking
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pickRegion(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects([land, towers, ocean], false)[0];
    if (!hit) return null;
    if ((hit.object === land || hit.object === towers) && hit.instanceId != null) return W.cells[hit.instanceId].region;
    // ocean hit: nearest cell within a short distance
    let best = null, bd = 1.2; const p = hit.point.clone().applyMatrix4(globe.matrixWorld.clone().invert());
    cellPos.forEach((c, i) => { const d = c.distanceTo(p); if (d < bd) { bd = d; best = W.cells[i].region; } });
    return best;
  }
  function project(v) { const p = v.clone().applyMatrix4(globe.matrixWorld).project(camera); return [(p.x + 1) / 2 * canvas.clientWidth, (1 - p.y) / 2 * canvas.clientHeight]; }
  const camDir = () => camera.position.clone().normalize();

  return {
    camera, globe, debug: () => ({ selected, hovered, ringVisible: selRing.visible, ringScale: selRing.scale.x }),
    setState(s) { S = s; arcGroup.clear(); arcs = []; if (S) S.links.forEach(l => { if (l.a != null && l.b != null) addArc(l.a, l.b); }); selected = null;
      if (S) { const [la, lo] = regionLatLon(frontRegion()); view.lon = view.tLon = lo; view.lat = view.tLat = Math.max(-12, Math.min(28, la)); } },
    resize, addArc, frontRegion,
    select(id) { selected = id; }, hover(id) { hovered = id; },
    focus(id, secs) { view.focusId = id; view.focusUntil = performance.now() / 1000 + (secs || 3.2); view.userUntil = 0; },
    grin(secs) { grinUntil = perf + (secs || 1.2); },
    burstAt(id, color, size) { burst(regionVec(id), color, size); },
    burstCell(cell, color, size) { burst(cellPos[cell], color, size); },
    rotateBy(dx, dy) { view.tLon -= dx * .25; view.tLat = Math.max(-40, Math.min(55, view.tLat + dy * .2)); view.lon = view.tLon; view.lat = view.tLat; view.userUntil = performance.now() / 1000 + 6; },
    zoomBy(f) { view.dist = Math.max(view.baseDist * .62, Math.min(view.baseDist * 1.35, view.dist * f)); },
    pickRegion,
    regionScreen(id, lift) { const v = regionVec(id, lift); const [x, y] = project(v); return { x, y, facing: regionVec(id).normalize().dot(camDir()) > .18 }; },
    cellScreen(cell, lift) { const v = cellPos[cell].clone().setLength(R + (lift || 0)); const [x, y] = project(v); return { x, y, facing: cellPos[cell].clone().normalize().dot(camDir()) > .25 }; },
    frame(dt) {
      perf += dt;
      updateCamera(dt, performance.now() / 1000);
      sync(dt);
      arcs.forEach(a => { a.t = (a.t + dt * .35) % 1; a.pulse.position.copy(a.curve.getPoint(a.t)); });
      for (let k = bursts.length - 1; k >= 0; k--) { const b = bursts[k]; b.t += dt; b.m.scale.setScalar(1 + b.t * b.size); b.m.material.opacity = Math.max(0, .6 * (1 - b.t / 1.2)); if (b.t > 1.2) { globe.remove(b.m); bursts.splice(k, 1); } }
      composer.render();
    }
  };
}
