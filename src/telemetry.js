// Anonymous gameplay analytics, sent to PostHog only after the player says yes.
//
// What is sent: game events (start, upgrades, infiltrations, choices, actions, threats, tips, end, quit),
// game settings (difficulty, model, Daily or not, graphics level), a frame-rate sample once a minute, and a
// device class (phone/desktop, screen size bucket). Each browser gets a random ID so one player's runs can be
// grouped; it is created only after consent and deleted if the player opts out.
// What is never sent: names, emails, free text, precise location. Events ask PostHog to skip GeoIP and
// person profiles; turn on "Discard client IP data" in the PostHog project settings as well.
import { settings } from './settings.js';

const CFG = window.HELPY_CONFIG || {};
const ID_KEY = 'helpy-anon-id';
const VERSION = '2.1.0';
const debug = new URLSearchParams(location.search).get('telemetry') === 'debug';

const enabledByConfig = () => !!(CFG.posthogKey && CFG.posthogHost);
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'x' + Math.random().toString(36).slice(2) + Date.now().toString(36));
function anonId() {
  try { let id = localStorage.getItem(ID_KEY); if (!id) { id = uuid(); localStorage.setItem(ID_KEY, id); } return id; } catch (e) { return 'no-storage'; }
}
const sessionId = uuid();
const device = () => ({
  device: innerWidth < 760 ? 'phone' : 'desktop',
  screen_bucket: (Math.round(innerWidth / 200) * 200) + 'x' + (Math.round(innerHeight / 200) * 200),
  touch: 'ontouchstart' in window
});

let queue = [], timer = null, base = {};
window.__telemetry = []; // what would be / was sent, for testing and the "What is sent" view

function allowed() { return settings.get('telemetry') === true && (enabledByConfig() || debug); }

function flush(beacon) {
  if (!queue.length) return;
  const batch = queue; queue = [];
  if (!enabledByConfig()) return; // debug mode without a key: keep events local only
  const body = JSON.stringify({ api_key: CFG.posthogKey, batch });
  const url = CFG.posthogHost.replace(/\/$/, '') + '/batch/';
  // text/plain keeps this a "simple" request (no CORS preflight), and keepalive lets it finish on page close.
  try { fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'text/plain' }, keepalive: !!beacon, credentials: 'omit' }).catch(() => {}); } catch (e) { /* offline */ }
}

export const telemetry = {
  configured: enabledByConfig,
  needsConsent: () => (enabledByConfig() || debug) && settings.get('telemetry') === null,
  setConsent(yes) {
    settings.set('telemetry', !!yes);
    if (!yes) { queue = []; try { localStorage.removeItem(ID_KEY); } catch (e) { /* storage unavailable */ } }
    else telemetry.track('consent_given');
  },
  setBase(props) { base = Object.assign({}, base, props); },
  track(event, props) {
    if (!allowed()) return;
    const e = {
      event, timestamp: new Date().toISOString(), distinct_id: anonId(),
      properties: Object.assign({ $process_person_profile: false, $geoip_disable: true, $session_id: sessionId, app_version: VERSION }, device(), base, props || {})
    };
    window.__telemetry.push(e);
    if (debug) console.info('[telemetry]', event, e.properties);
    queue.push(e);
    if (queue.length >= 20) flush();
    else if (!timer) timer = setTimeout(() => { timer = null; flush(); }, 15000);
  },
  flush
};
document.addEventListener('visibilitychange', () => { if (document.hidden) flush(true); });
window.addEventListener('pagehide', () => flush(true));
