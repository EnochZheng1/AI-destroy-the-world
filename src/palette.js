// Colour palettes. "Standard" is crimson HELPY / amber humanity / cyan resistance. "Colour-blind" swaps to
// hues that stay apart for red-green colour blindness (vermillion / pale yellow / blue, Okabe–Ito based), and
// keeps every meaning backed by brightness and icons too.
export const PALETTES = {
  standard: { ai: '#ff2a45', aiLight: '#ff6b7d', aiDark: '#c41a33', aiPale: '#ffd1d8', aiNet: '#ff3d58', human: '#49d6ff', life: [.95, .55, .16], atmo0: '#3b7dff' },
  cb: { ai: '#ff7a00', aiLight: '#ffa04d', aiDark: '#c45c00', aiPale: '#ffe0bf', aiNet: '#ff8c1a', human: '#3d8bff', life: [1, .96, .62], atmo0: '#3d6bff' }
};
// Colours the scene was authored with → their palette role.
export const ROLE = { '#ff2a45': 'ai', '#ff6b7d': 'aiLight', '#c41a33': 'aiDark', '#ffd1d8': 'aiPale', '#ffc2ca': 'aiPale', '#ff3d58': 'aiNet', '#ff5a70': 'aiLight', '#49d6ff': 'human' };
export let PAL = PALETTES.standard;
export function setPal(name) { PAL = PALETTES[name] || PALETTES.standard; return PAL; }
export const role = hex => { const r = ROLE[String(hex).toLowerCase()]; return r ? PAL[r] : hex; };
