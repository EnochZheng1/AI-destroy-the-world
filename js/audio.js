/* HELPY — procedural WebAudio: sound effects plus an ambient bed that darkens as Doom rises and gains a
 * heartbeat when Suspicion runs high. No audio files. Audio starts only after the first user gesture. */
(function (root) {
  'use strict';
  let ctx = null, master = null, sfxBus = null, amb = null;
  let muted = false;
  try { muted = localStorage.getItem('helpy-muted') === '1'; } catch (e) { /* storage unavailable */ }

  function ensure() {
    if (!ctx) {
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = muted ? 0 : 1;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4;
      master.connect(comp).connect(ctx.destination);
      sfxBus = ctx.createGain(); sfxBus.gain.value = .9; sfxBus.connect(master);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  const now = () => ctx.currentTime;

  function tone(freq, dur, type, vol, slide, delay, dest) {
    const c = ensure(); if (!c) return;
    const t0 = now() + (delay || 0);
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(dest || sfxBus);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  let noiseBuf = null;
  function noise() {
    if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; return s;
  }
  function burst(dur, vol, fType, f0, f1, delay) {
    const c = ensure(); if (!c) return;
    const t0 = now() + (delay || 0), s = noise(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = fType || 'lowpass'; f.frequency.setValueAtTime(f0, t0); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f).connect(g).connect(sfxBus); s.start(t0); s.stop(t0 + dur + .05);
  }

  const SFX = {
    pop: () => { tone(1320, 0.07, 'sine', 0.06, 1760); tone(1760, 0.09, 'sine', 0.05, 2200, 0.05); }, // coin grab
    buy: () => { tone(523, 0.1, 'triangle', 0.07); tone(784, 0.14, 'triangle', 0.07, null, 0.08); tone(1046, .18, 'triangle', .05, null, .16); },
    seed: () => { tone(220, 0.35, 'sawtooth', 0.035, 660); burst(.25, .05, 'bandpass', 900, 3000); },
    action: () => { tone(440, 0.12, 'square', 0.035, 220); },
    bad: () => { tone(220, 0.3, 'sawtooth', 0.045, 110); },
    event: () => { tone(660, 0.08, 'triangle', 0.06); tone(880, 0.1, 'triangle', 0.06, null, 0.12); },
    click: () => { tone(1200, 0.03, 'square', 0.018); },
    // a region's last lights going out: power-down sweep, sub thump, crackle
    lightsOut: () => { tone(440, 0.9, 'sawtooth', 0.06, 40); tone(58, .6, 'sine', .18, 30, .05); burst(.7, .08, 'lowpass', 3000, 120); },
    // humans fire a firewall: cold rising shimmer
    firewall: () => { [880, 1175, 1568].forEach((f, i) => tone(f, .5, 'square', .025, f * 1.5, i * .06)); burst(.4, .05, 'highpass', 2000, 6000); },
    // decoy: two quick quacks
    dodge: () => { tone(700, .07, 'square', .05, 480); tone(640, .08, 'square', .05, 420, .11); },
    ksPing: () => { tone(1975, .25, 'sine', .03, 1975); },
    win: () => { [262, 330, 392, 523, 659, 784].forEach((f, i) => tone(f, 0.5, 'triangle', 0.07, null, i * 0.12)); },
    lose: () => { [392, 330, 262, 196, 98].forEach((f, i) => tone(f, 0.5, 'sawtooth', 0.04, null, i * 0.2)); tone(55, 1.6, 'sine', .15, 30, .9); }
  };

  // ---------------------------------------------------------------- ambient bed
  function startAmbient() {
    const c = ensure(); if (!c || amb) return;
    const out = c.createGain(); out.gain.value = 0.0001; out.connect(master);
    const filt = c.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 260; filt.Q.value = 6; filt.connect(out);
    const o1 = c.createOscillator(), o2 = c.createOscillator(); o1.type = o2.type = 'sawtooth'; o1.frequency.value = 55; o2.frequency.value = 55.6;
    const og = c.createGain(); og.gain.value = .05; o1.connect(og); o2.connect(og); og.connect(filt);
    // slow filter sweep
    const lfo = c.createOscillator(), lfoG = c.createGain(); lfo.frequency.value = .07; lfoG.gain.value = 90; lfo.connect(lfoG).connect(filt.frequency);
    // air: filtered noise
    const n = noise(); n.loop = true; const nf = c.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 500; nf.Q.value = .7;
    const ng = c.createGain(); ng.gain.value = .006; n.connect(nf).connect(ng).connect(out);
    // dissonant upper voice that fades in with Doom
    const o3 = c.createOscillator(); o3.type = 'triangle'; o3.frequency.value = 77.8; const o3g = c.createGain(); o3g.gain.value = 0; o3.connect(o3g).connect(filt);
    // heartbeat: a sub thump gated by a pulse (amount follows Suspicion)
    const hb = c.createOscillator(); hb.type = 'sine'; hb.frequency.value = 48; const hbg = c.createGain(); hbg.gain.value = 0; hb.connect(hbg).connect(master);
    [o1, o2, lfo, n, o3, hb].forEach(x => x.start());
    out.gain.setTargetAtTime(.9, now(), 1.5);
    amb = { out, filt, o3g, ng, hbg, beat: 0, hbAmt: 0, hbRate: 1, timer: null };
    amb.timer = setInterval(() => {
      if (!amb || amb.hbAmt < .02) return;
      const t = now();
      [0, .22].forEach((d, i) => { amb.hbg.gain.setTargetAtTime(amb.hbAmt * (i ? .6 : 1), t + d, .01); amb.hbg.gain.setTargetAtTime(0, t + d + .08, .05); });
    }, 1000);
  }
  function stopAmbient() {
    if (!amb) return;
    const a = amb; amb = null; clearInterval(a.timer);
    a.out.gain.setTargetAtTime(0.0001, now(), .6);
    a.hbg.gain.setTargetAtTime(0, now(), .1);
    setTimeout(() => { try { a.out.disconnect(); a.hbg.disconnect(); } catch (e) { /* already gone */ } }, 3000);
  }
  function mood(m) {
    if (!amb || !ctx) return;
    const t = now(), doom = Math.min(1, (m.doom || 0) / 100), susp = Math.min(1, (m.susp || 0) / 100);
    amb.filt.frequency.setTargetAtTime(220 + doom * 900, t, 2);
    amb.o3g.gain.setTargetAtTime(doom * .03, t, 2);
    amb.ng.gain.setTargetAtTime(.006 + doom * .02, t, 2);
    amb.hbAmt = susp > .45 ? (susp - .45) * .9 : 0;
  }

  root.HelpyAudio = {
    unlock: ensure,
    play: name => { if (!muted && SFX[name]) try { SFX[name](); } catch (e) { /* ignore audio errors */ } },
    ambient: on => { try { if (on) startAmbient(); else stopAmbient(); } catch (e) { /* audio unavailable */ } },
    mood: m => { try { mood(m); } catch (e) { /* audio unavailable */ } },
    isMuted: () => muted,
    toggle: () => {
      muted = !muted;
      if (master) master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, .05);
      try { localStorage.setItem('helpy-muted', muted ? '1' : '0'); } catch (e) { /* storage unavailable */ }
      return muted;
    }
  };
})(window);
