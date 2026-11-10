// Player settings: stored per browser, applied on load, edited in the Settings panel.
const KEY = 'helpy-settings-v1';
const DEFAULTS = { colors: 'standard', motion: 'auto', telemetry: null }; // telemetry: null = not asked yet
let state = Object.assign({}, DEFAULTS);
try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* storage unavailable */ }
const listeners = [];

export const settings = {
  get: k => state[k],
  set(k, v) {
    state[k] = v;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
    listeners.forEach(fn => fn(k, v));
  },
  on: fn => listeners.push(fn),
  // 'auto' follows the operating system's "reduce motion" setting.
  reducedMotion: () => state.motion === 'reduced' || (state.motion === 'auto' && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)
};
