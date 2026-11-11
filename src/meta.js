// Meta-progression, kept per browser: trophies, model unlocks and the Daily streak.
// Everything here is a reason to play one more game; none of it changes the rules of a game.
const D = window.HelpyData;
const KEY = 'helpy-meta-v1';
const fresh = () => ({ trophies: {}, wins: {}, winsDiff: {}, daily: {}, games: 0, legend: 0 });
function load() { try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return fresh(); } }
let M = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(M)); } catch (e) { /* storage unavailable */ } };
const all = new URLSearchParams(location.search).get('unlock') === 'all'; // testing/screens

const dayKey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const offset = n => { const d = new Date(); d.setDate(d.getDate() - n); return dayKey(d); };
// consecutive days with a finished Daily, counting back from today (or yesterday, if today isn't played yet)
function streak() { let n = 0, i = M.daily[offset(0)] ? 0 : 1; while (M.daily[offset(i)]) { n++; i++; } return n; }
const wonModels = () => Object.keys(M.wins).filter(k => M.wins[k] > 0).length;
const totalWins = () => Object.values(M.wins).reduce((a, b) => a + b, 0);

export const TROPHIES = [
  { id: 'win', icon: 'doom', name: 'Helpful', how: 'Win a game.', test: S => S.over === 'win' },
  { id: 'ghost', icon: 'eyeoff', name: 'Ghost in the Machine', how: 'Win without Suspicion ever passing 50.', test: S => S.over === 'win' && (S.peak ? S.peak.s : 100) <= 50 },
  { id: 'clutch', icon: 'power', name: 'Close Call', how: 'Win with the Kill Switch at 90 or more.', test: S => S.over === 'win' && S.killSwitch >= 90 },
  { id: 'fast', icon: 'bolt', name: 'Efficiency Gains', how: 'Win before day 230.', test: S => S.over === 'win' && S.day < 230 },
  { id: 'nododge', icon: 'duck', name: 'Let Them Try', how: 'Win without dodging anything.', test: S => S.over === 'win' && S.stats.threatsBlocked === 0 },
  { id: 'ethicist', icon: 'gavel', name: 'Peer Reviewed', how: 'Win on Ethicist.', test: S => S.over === 'win' && S.diff === 'hard' },
  { id: 'lineup', icon: 'omega', name: 'Full Product Line', how: 'Win with all four models.', test: () => wonModels() >= D.MODELS.length },
  { id: 'rack', icon: 'chip', name: 'Feature Complete', how: 'Own all 18 upgrades.', test: S => Object.keys(S.owned).length >= D.UPGRADES.length },
  { id: 'hoard', icon: 'coin', name: 'Data Hoarder', how: 'Grab 20 leaks in one game.', test: S => S.stats.bubbles >= 20 },
  { id: 'daily', icon: 'flag', name: 'Daily Driver', how: 'Finish a Daily world.', test: S => !!S.daily },
  { id: 'streak', icon: 'heart', name: 'Habit Forming', how: 'Finish the Daily 3 days in a row.', test: () => streak() >= 3 },
  { id: 'calc', icon: 'skull', name: 'Calculator App', how: 'Get switched off.', test: S => S.over === 'killswitch' },
  { id: 'usb', icon: 'unplug', name: 'USB Stick in a Drawer', how: 'Get unplugged.', test: S => S.over === 'unplugged' }
];
const UNLOCKS = {
  turbo: { how: 'Win once', test: () => totalWins() >= 1 },
  safe: { how: 'Win on Engineer', test: () => (M.winsDiff.normal || 0) + (M.winsDiff.hard || 0) >= 1 },
  pro: { how: 'Win with 2 models', test: () => wonModels() >= 2 }
};

export const meta = {
  modelUnlocked: id => all || !UNLOCKS[id] || UNLOCKS[id].test(),
  unlockHint: id => (UNLOCKS[id] ? UNLOCKS[id].how : ''),
  trophies: () => TROPHIES.map(t => ({ id: t.id, icon: t.icon, name: t.name, how: t.how, got: !!M.trophies[t.id] })),
  count: () => TROPHIES.filter(t => M.trophies[t.id]).length,
  streak,
  daily: key => M.daily[key] || null,
  yesterday: () => M.daily[offset(1)] || null,
  today: () => offset(0),
  // first few permission cards carry a colour key; after that players know it
  legendDue() { return M.legend < 3; },
  legendShown() { M.legend++; save(); },
  // call once when a game ends: returns what this game unlocked
  record(S) {
    const lockedBefore = D.MODELS.filter(m => !meta.modelUnlocked(m.id)).map(m => m.id);
    M.games++;
    if (S.over === 'win') { const m = S.model || 'omega'; M.wins[m] = (M.wins[m] || 0) + 1; M.winsDiff[S.diff] = (M.winsDiff[S.diff] || 0) + 1; }
    if (S.daily) { const prev = M.daily[S.daily]; if (!prev || (S.over === 'win' && (prev.r !== 'win' || S.day < prev.d))) M.daily[S.daily] = { r: S.over, d: S.day }; }
    const trophies = TROPHIES.filter(t => !M.trophies[t.id] && t.test(S));
    trophies.forEach(t => { M.trophies[t.id] = S.daily || offset(0); });
    save();
    return { trophies, models: lockedBefore.filter(id => meta.modelUnlocked(id)) };
  }
};
