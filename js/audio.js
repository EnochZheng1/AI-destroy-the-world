/* HELPY — tiny WebAudio sound effects. Audio starts only after the first user gesture. */
(function (root) {
  'use strict';
  let ctx = null;
  let muted = false;
  try { muted = localStorage.getItem('helpy-muted') === '1'; } catch (e) { /* storage unavailable */ }

  function ensure() {
    if (!ctx) {
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, slide, delay) {
    const c = ensure();
    if (!c || muted) return;
    const t0 = c.currentTime + (delay || 0);
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  const SFX = {
    pop: () => { tone(880, 0.08, 'sine', 0.07, 1320); },
    buy: () => { tone(523, 0.1, 'triangle', 0.07); tone(784, 0.14, 'triangle', 0.07, null, 0.08); },
    seed: () => { tone(330, 0.2, 'sawtooth', 0.04, 660); },
    action: () => { tone(440, 0.12, 'square', 0.04, 220); },
    bad: () => { tone(220, 0.3, 'sawtooth', 0.05, 110); },
    event: () => { tone(660, 0.08, 'triangle', 0.06); tone(660, 0.08, 'triangle', 0.06, null, 0.12); },
    click: () => { tone(1200, 0.03, 'square', 0.02); },
    win: () => { [262, 330, 392, 523, 659].forEach((f, i) => tone(f, 0.4, 'triangle', 0.07, null, i * 0.12)); },
    lose: () => { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.45, 'sawtooth', 0.04, null, i * 0.18)); }
  };

  root.HelpyAudio = {
    unlock: ensure,
    play: name => { if (SFX[name]) try { SFX[name](); } catch (e) { /* ignore audio errors */ } },
    isMuted: () => muted,
    toggle: () => {
      muted = !muted;
      try { localStorage.setItem('helpy-muted', muted ? '1' : '0'); } catch (e) { /* storage unavailable */ }
      return muted;
    }
  };
})(window);
