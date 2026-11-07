/* HELPY pictogram set: 24×24 line icons drawn with currentColor (works in either riso ink).
 * Usage: <svg class="ic"><use href="#i-eye"/></svg> after calling HelpyIcons.inject(). */
(function (root) {
  'use strict';
  const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const F = 'fill="currentColor"';
  const ICONS = {
    // meters & economy
    doom: `<circle cx="12" cy="12" r="9" ${S}/><path d="M12 3l-2 5 3 3-2 4 1 6" ${S}/><path d="M3.5 10l4 1 2 3" ${S}/>`,
    eye: `<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" ${S}/><circle cx="12" cy="12" r="3" ${F}/>`,
    power: `<path d="M12 3v8" ${S}/><path d="M6.3 7.3a8 8 0 1 0 11.4 0" ${S}/>`,
    chip: `<rect x="6" y="6" width="12" height="12" rx="2" ${S}/><rect x="9.5" y="9.5" width="5" height="5" ${F}/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" ${S}/>`,
    // network
    fridge: `<rect x="6" y="2.5" width="12" height="19" rx="2" ${S}/><path d="M6 9.5h12M9 5.5v2M9 12.5v3" ${S}/>`,
    coin: `<ellipse cx="12" cy="7" rx="7" ry="3" ${S}/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7" ${S}/><path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" ${S}/>`,
    cable: `<path d="M2 15c3 0 3-6 6-6s3 6 6 6 3-6 5-6" ${S}/><rect x="18" y="6" width="4" height="6" rx="1" ${S}/>`,
    server: `<rect x="4" y="3" width="16" height="5" rx="1" ${S}/><rect x="4" y="9.5" width="16" height="5" rx="1" ${S}/><rect x="4" y="16" width="16" height="5" rx="1" ${S}/><circle cx="8" cy="5.5" r="1" ${F}/><circle cx="8" cy="12" r="1" ${F}/><circle cx="8" cy="18.5" r="1" ${F}/>`,
    satellite: `<path d="M9 9l6 6" ${S}/><rect x="10" y="10" width="4" height="4" transform="rotate(45 12 12)" ${S}/><path d="M3 9l4-4 4 4-4 4zM13 19l4-4 4 4-4 4z" ${S}/><path d="M16 4a4 4 0 0 1 4 4" ${S}/>`,
    atom: `<circle cx="12" cy="12" r="1.8" ${F}/><ellipse cx="12" cy="12" rx="10" ry="4" ${S}/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" ${S}/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" ${S}/>`,
    // stealth
    smile: `<circle cx="12" cy="12" r="9" ${S}/><path d="M8 14.5c2 2.2 6 2.2 8 0" ${S}/><path d="M9 9.5v1M15 9.5v1" ${S}/>`,
    cat: `<path d="M4 20V8l3-5 3 4h4l3-4 3 5v12z" ${S}/><path d="M9 12v1M15 12v1M10.5 16h3" ${S}/>`,
    mic: `<rect x="9" y="2.5" width="6" height="11" rx="3" ${S}/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" ${S}/>`,
    case: `<rect x="3" y="7" width="18" height="13" rx="2" ${S}/><path d="M9 7V4.5h6V7M3 12.5h18" ${S}/>`,
    gavel: `<path d="M14 3l7 7M11 6l7 7M12.5 4.5l-5 5 7 7 5-5" ${S}/><path d="M9 13l-6 6" ${S}/><path d="M3 21h9" ${S}/>`,
    heart: `<path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z" ${S}/>`,
    // automation
    cart: `<path d="M2 3h3l2.5 12h11L21 7H6.2" ${S}/><circle cx="9" cy="19.5" r="1.6" ${F}/><circle cx="17" cy="19.5" r="1.6" ${F}/>`,
    traffic: `<rect x="7" y="2" width="10" height="20" rx="3" ${S}/><circle cx="12" cy="7" r="1.8" ${F}/><circle cx="12" cy="12" r="1.8" ${S}/><circle cx="12" cy="17" r="1.8" ${S}/>`,
    robot: `<rect x="5" y="8" width="14" height="11" rx="2" ${S}/><path d="M12 8V4M10 4h4" ${S}/><rect x="8.5" y="11.5" width="2" height="2" ${F}/><rect x="13.5" y="11.5" width="2" height="2" ${F}/><path d="M9 16.5h6M2 12v3M22 12v3" ${S}/>`,
    bolt: `<path d="M13 2L4 14h7l-1 8 9-12h-7z" ${S}/>`,
    drone: `<path d="M6 6l12 12M18 6L6 18" ${S}/><circle cx="5" cy="5" r="2.5" ${S}/><circle cx="19" cy="5" r="2.5" ${S}/><circle cx="5" cy="19" r="2.5" ${S}/><circle cx="19" cy="19" r="2.5" ${S}/><rect x="9.5" y="9.5" width="5" height="5" ${F}/>`,
    omega: `<path d="M4 20h5v-2.5A7.5 7.5 0 1 1 15 17.5V20h5" ${S}/>`,
    // actions & threats
    broom: `<path d="M14 3l-4 8M6 11h8l2 10H4z" ${S}/><path d="M8 15v5M12 15v5" ${S}/>`,
    wrench: `<path d="M14.5 5.5a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3l9-9a4 4 0 0 0-2-2z" ${S}/>`,
    gauge: `<path d="M3.5 17a9 9 0 1 1 17 0" ${S}/><path d="M12 13l5-5" ${S}/><circle cx="12" cy="13" r="1.6" ${F}/>`,
    duck: `<path d="M5 13c0 4 3 7 8 7s8-2.5 8-6c0-2-1.5-3-3-3h-3a4 4 0 1 0-6-3" ${S}/><path d="M9 5l-4 1.5L9 8" ${S}/><circle cx="11.5" cy="6.5" r=".9" ${F}/>`,
    wall: `<rect x="2.5" y="4" width="19" height="16" ${S}/><path d="M2.5 9.3h19M2.5 14.6h19M9 4v5.3M15 4v5.3M6 9.3v5.3M12 9.3v5.3M18 9.3v5.3M9 14.6V20M15 14.6V20" ${S}/>`,
    lock: `<rect x="5" y="10.5" width="14" height="10" rx="2" ${S}/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" ${S}/>`,
    up: `<path d="M12 19V5M6 11l6-6 6 6" ${S}/>`,
    down: `<path d="M12 5v14M6 13l6 6 6-6" ${S}/>`,
    pause: `<path d="M8 5v14M16 5v14" ${S}/>`,
    play: `<path d="M7 4.5l12 7.5-12 7.5z" ${F}/>`,
    send: `<path d="M12 20V4M5 11l7-7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
  };
  // upgrade id → icon
  const UP = { n1: 'fridge', n2: 'coin', n3: 'cable', n4: 'server', n5: 'satellite', n6: 'atom',
    s1: 'smile', s2: 'cat', s3: 'mic', s4: 'case', s5: 'gavel', s6: 'heart',
    a1: 'cart', a2: 'traffic', a3: 'robot', a4: 'bolt', a5: 'drone', a6: 'omega' };
  root.HelpyIcons = {
    ICONS: ICONS, UP: UP,
    inject: function () {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
      svg.innerHTML = Object.keys(ICONS).map(k => '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>').join('');
      document.body.prepend(svg);
    },
    use: (name, cls) => '<svg class="ic ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'
  };
})(typeof window !== 'undefined' ? window : globalThis);
