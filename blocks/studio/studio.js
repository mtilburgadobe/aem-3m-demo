const STRINGS = {
  en: {
    stage: 'Vehicle preview',
    carSide: 'Sports coupe, side view',
    carFront: 'Sports coupe, front three-quarter view',
    angle: 'Angle',
    side: 'Side',
    front: 'Front 3/4',
    lighting: 'Lighting',
    daylight: 'Daylight',
    studio: 'Studio',
    night: 'Night',
    products: 'Products',
    wrap: 'Wrap Film',
    tint: 'Window Tint',
    tintShort: 'Tint',
    ppf: 'Paint Protection Film',
    protection: 'Protection Wrap',
    samples: 'Sample colors',
    vlt: 'Visible light transmission (VLT)',
    vltHelp: 'Lower VLT means darker windows. Check local regulations.',
    ppfToggle: 'PPF on',
    ppfHelp: 'A virtually invisible clear film that helps protect paint from chips and scratches.',
    protectionHelp: 'Durable film that adds color while helping shield high-impact areas.',
    note: 'Colors are approximate; see a 3M certified installer for physical samples.',
    installer: 'Find an Installer',
    share: 'Share',
    copied: 'Link copied',
    launch: 'Launch full studio',
    openStudio: 'Open the full Restyling Studio',
    newTab: 'Open in new tab',
    back: 'Back to preview',
    studioTitle: '3M Restyling Studio',
    gloss: 'Gloss',
    satin: 'Satin',
    matte: 'Matte',
  },
  fr: {
    stage: 'Aperçu du véhicule',
    carSide: 'Coupé sport, vue de côté',
    carFront: 'Coupé sport, vue avant trois quarts',
    angle: 'Angle',
    side: 'Côté',
    front: 'Avant 3/4',
    lighting: 'Éclairage',
    daylight: 'Jour',
    studio: 'Studio',
    night: 'Nuit',
    products: 'Produits',
    wrap: 'Film d’habillage',
    tint: 'Teinte de vitres',
    tintShort: 'Teinte',
    ppf: 'Film de protection de peinture',
    protection: 'Film protecteur',
    samples: 'Couleurs d’exemple',
    vlt: 'Transmission de la lumière visible (TLV)',
    vltHelp: 'Une TLV plus basse donne des vitres plus foncées. Vérifiez la réglementation locale.',
    ppfToggle: 'PPF activé',
    ppfHelp: 'Un film transparent quasi invisible qui aide à protéger la peinture des éclats et des rayures.',
    protectionHelp: 'Film durable qui ajoute de la couleur tout en protégeant les zones exposées.',
    note: 'Les couleurs sont approximatives; consultez un installateur certifié 3M pour des échantillons.',
    installer: 'Trouver un installateur',
    share: 'Partager',
    copied: 'Lien copié',
    launch: 'Lancer le studio complet',
    openStudio: 'Ouvrir le Restyling Studio complet',
    newTab: 'Ouvrir dans un nouvel onglet',
    back: 'Retour à l’aperçu',
    studioTitle: 'Restyling Studio 3M',
    gloss: 'Lustré',
    satin: 'Satiné',
    matte: 'Mat',
  },
};

const TINTS = {
  70: 0.2, 50: 0.4, 35: 0.58, 20: 0.74, 5: 0.92,
};
const LIGHTS = ['daylight', 'studio', 'night'];
const ANGLES = ['side', 'front'];
const FINISHES = ['gloss', 'satin', 'matte'];
const FALLBACK = [['Gloss Hot Rod Red', '#c8102e', 'gloss'], ['Satin Dark Gray', '#3a3d40', 'satin'], ['Matte Black', '#1c1c1c', 'matte']];
let uid = 0;

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  });
  node.append(...children.filter(Boolean));
  return node;
}

/* ---------- SVG car artwork (static markup, no authored content) ---------- */
function wheel(cx, cy, r, sx = 1) {
  const spokes = [0, 72, 144, 216, 288].map((a) => `<rect x="${cx - 4}" y="${cy - r * 0.62}" width="8" height="${r * 0.56}" rx="4" transform="rotate(${a} ${cx} ${cy})"/>`).join('');
  return `<g class="wheel" transform="matrix(${sx} 0 0 1 ${cx * (1 - sx)} 0)">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#111"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 5}" fill="none" stroke="#2c2c2e" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.66}" fill="#202326" stroke="#b8bec4" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="#4a4e53"/>
    <g fill="#cfd4d9">${spokes}</g>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.13}" fill="#e3e6e9"/></g>`;
}

const stops = (list) => list.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
const grad = (id, name, [x2, y2], list) => `<linearGradient id="${id}-${name}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops(list)}</linearGradient>`;

function defs(id, body) {
  return `<defs>
    ${grad(id, 'shade', [0, 1], [[0, '#fff', 0.2], [0.45, '#fff', 0], [1, '#000', 0.5]])}
    ${grad(id, 'spec', [1, 0.4], [[0.28, '#fff', 0], [0.38, '#fff', 0.4], [0.43, '#fff', 0], [0.64, '#fff', 0], [0.68, '#fff', 0.2], [0.74, '#fff', 0]])}
    ${grad(id, 'soft', [0, 1], [[0, '#fff', 0.45], [0.55, '#fff', 0]])}
    ${grad(id, 'ppf', [1, 1], [[0.2, '#e8f4ff', 0], [0.5, '#e8f4ff', 0.35], [0.8, '#e8f4ff', 0]])}
    <path id="${id}-body" d="${body}"/></defs>`;
}

const use = (id, cls) => `<use href="#${id}-body" class="${cls}"${cls === 'paint' ? '' : ` fill="url(#${id}-${cls})"`}/>`;
const under = (id) => use(id, 'paint') + use(id, 'shade');
const over = (id) => ['spec', 'soft', 'ppf'].map((c) => use(id, c)).join('');
const glass = (d) => `<path class="glass-base" d="${d}"/><path class="glass-tint" d="${d}"/>`;

function sideCar(id, label) {
  const body = 'M60 236L58 206C58 188 66 177 84 172L196 154C236 132 290 108 345 100C400 93 470 94 508 103C546 115 580 136 612 150L722 166C754 172 772 190 772 210L770 240C770 250 762 256 750 256L672 256A62 62 0 0 0 548 256L267 256A62 62 0 0 0 143 256L80 256C66 256 60 250 60 236Z';
  return `<svg class="studio-car studio-car-side" viewBox="30 60 770 260" role="img" aria-label="${label}">${defs(id, body)}
    <ellipse cx="415" cy="302" rx="370" ry="12" class="ground"/>${under(id)}
    ${glass('M226 153C262 133 302 117 350 110L398 107L398 152ZM412 107L482 106C514 111 542 128 566 150L412 152Z')}
    <path class="glare" d="M300 150L360 111L380 109L322 151ZM470 107L490 107L438 151L418 151Z"/>
    <g class="lines"><path d="M90 196C300 184 560 182 765 196"/><path d="M405 152L410 246"/><path d="M196 156L612 152"/></g>
    <rect x="440" y="168" width="30" height="6" rx="3" class="trim"/>
    <path d="M560 146L585 140C592 140 594 150 588 152L566 154Z" class="paint"/>
    <path d="M736 176C754 179 765 187 769 198L746 194Z" class="lamp"/>
    <path d="M60 188L92 174L94 184L60 198Z" class="tail"/>
    <path d="M267 245L548 245L548 256L267 256ZM700 248L770 244L766 256L700 256Z" class="trim"/>
    ${over(id)}${wheel(205, 254, 50)}${wheel(610, 254, 50)}</svg>`;
}

function frontCar(id, label) {
  const body = 'M300 318L116 297C104 295 98 285 98 274L102 252C104 240 110 234 120 232L240 192L328 144C400 136 520 134 574 140C628 160 682 180 722 190L748 196C756 200 758 208 757 216L752 264C750 274 746 278 740 279L698 283A43 50 0 0 0 615 290L455 304A54 60 0 0 0 350 313Z';
  return `<svg class="studio-car studio-car-front" viewBox="70 110 720 260" role="img" aria-label="${label}">${defs(id, body)}
    <ellipse cx="425" cy="338" rx="345" ry="24" class="ground"/>${wheel(150, 302, 28, 0.5)}${under(id)}
    <path d="M98 274L102 252C104 240 110 234 120 232L300 244C306 270 305 295 300 318L116 297C104 295 98 285 98 274Z" class="face"/>
    <path d="M120 232L300 244L428 196L240 193Z" class="hood"/>
    ${glass('M244 192L426 195L466 148L330 145ZM440 194L476 152L572 150C620 164 670 182 712 192Z')}
    <path class="glare" d="M318 192L366 146L386 146L340 193ZM540 192L566 151L578 151L554 192Z"/>
    <g class="lines"><path d="M300 244C306 270 305 295 300 318"/><path d="M306 254C450 238 600 224 752 214"/><path d="M560 195L566 294"/><path d="M428 197L718 192"/></g>
    <path d="M440 196L424 188C418 182 426 176 434 180L446 190Z" class="paint"/>
    <path d="M134 268L288 279L286 304L134 290Z" class="grille"/>
    <path d="M112 244L168 248L166 258L116 256ZM228 252L298 256L299 266L236 263Z" class="lamp"/>
    <path d="M738 200L754 204L752 226L736 220Z" class="tail"/>
    <path d="M455 300L615 286L615 291L455 305Z" class="trim"/>
    ${over(id)}${wheel(402, 306, 46, 0.8)}${wheel(656, 284, 40, 0.72)}</svg>`;
}

/* ---------- helpers ---------- */
function readSwatches(rows) {
  const list = rows.map((row) => {
    const [name, hex, finish] = [...row.children].map((c) => c.textContent.trim());
    if (!name) return null;
    const f = (finish || '').toLowerCase();
    return {
      name,
      id: slug(name),
      hex: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex || '') ? hex : '#888888',
      finish: FINISHES.includes(f) ? f : 'gloss',
    };
  }).filter(Boolean);
  return list.length ? list : FALLBACK.map(([name, hex, finish]) => ({
    name, id: slug(name), hex, finish,
  }));
}

function rove(container, selector, onPick, vertical = true) {
  const next = ['ArrowRight', ...(vertical ? ['ArrowDown'] : [])];
  const prev = ['ArrowLeft', ...(vertical ? ['ArrowUp'] : [])];
  container.addEventListener('keydown', (e) => {
    const items = [...container.querySelectorAll(selector)];
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    let n;
    if (next.includes(e.key)) n = (i + 1) % items.length;
    else if (prev.includes(e.key)) n = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = items.length - 1;
    else return;
    e.preventDefault();
    items[n].focus();
    onPick(items[n]);
  });
}

function group(radio, label, items, onPick, cls) {
  const wrap = el('div', { role: radio ? 'radiogroup' : 'group', 'aria-label': label, class: cls });
  items.forEach(({ key, content, attr }) => {
    const btn = el('button', {
      type: 'button', 'data-key': key, ...(radio ? { role: 'radio' } : {}), ...attr,
    }, ...content);
    btn.addEventListener('click', () => onPick(btn));
    wrap.append(btn);
  });
  if (radio) rove(wrap, '[role="radio"]', onPick);
  return wrap;
}

export default function decorate(block) {
  const S = STRINGS[(document.documentElement.lang || '').toLowerCase().startsWith('fr') ? 'fr' : 'en'];
  const embed = block.classList.contains('embed');
  const [introRow, ...rows] = [...block.children];
  const swatches = readSwatches(rows);
  uid += 1;
  const id = `studio-${uid}`;
  const intro = el('div', { class: 'studio-intro' }, ...(introRow ? [...introRow.querySelectorAll(':scope > div > *')] : []));
  let studioUrl = '';
  let installerUrl = '/personal-auto/find-an-installer';
  intro.querySelectorAll('a[href]').forEach((a) => {
    const isStudio = /restylingstudio\.3m\.com/i.test(a.href);
    if (!isStudio && !/installer/i.test(`${a.textContent} ${a.href}`)) return;
    if (isStudio) studioUrl = a.href; else installerUrl = a.getAttribute('href');
    const p = a.closest('p');
    if (p && p.textContent.trim() === a.textContent.trim()) p.remove(); else a.remove();
  });

  const params = new URLSearchParams(window.location.search);
  const pick = (v, list, d) => (list.includes(v) ? v : d);
  // color param may be a swatch name (any case), its slug, or a hex value
  const c = (params.get('color') || '').trim().toLowerCase();
  const fromParam = swatches.find((s) => [s.name.toLowerCase(), s.id, s.hex.toLowerCase()].includes(c) || `#${c}` === s.hex.toLowerCase());
  const state = {
    color: (fromParam || swatches[0]).id,
    tint: pick(params.get('tint'), Object.keys(TINTS), '35'),
    light: pick(params.get('light'), LIGHTS, 'studio'),
    angle: pick(params.get('angle'), ANGLES, 'side'),
    ppf: params.get('ppf') === '1',
  };

  const stage = el('div', { class: 'studio-stage', role: 'region', 'aria-label': S.stage });
  const cars = el('div', { class: 'studio-cars' });
  cars.innerHTML = sideCar(`${id}-s`, S.carSide) + frontCar(`${id}-f`, S.carFront);
  const summary = el('p', { class: 'studio-summary', 'aria-live': 'polite' });
  const status = el('span', { class: 'studio-status', role: 'status' });

  const update = () => {
    const sw = swatches.find((s) => s.id === state.color);
    block.style.setProperty('--wrap-color', sw.hex);
    block.style.setProperty('--tint', TINTS[state.tint]);
    block.classList.remove(...FINISHES.map((f) => `finish-${f}`), ...LIGHTS.map((l) => `light-${l}`), ...ANGLES.map((a) => `angle-${a}`));
    block.classList.add(`finish-${sw.finish}`, `light-${state.light}`, `angle-${state.angle}`);
    block.classList.toggle('ppf-on', state.ppf);
    block.querySelectorAll('[data-state]').forEach((btn) => {
      const on = state[btn.dataset.state] === btn.dataset.key;
      const isRadio = btn.getAttribute('role') === 'radio';
      btn.setAttribute(isRadio ? 'aria-checked' : 'aria-pressed', on);
      if (isRadio) btn.tabIndex = on ? 0 : -1;
    });
    block.querySelectorAll('[role="switch"]').forEach((b) => b.setAttribute('aria-checked', state.ppf));
    summary.textContent = `${sw.name} · ${S[sw.finish]} · ${S.tintShort} ${state.tint}% VLT${state.ppf ? ' · PPF' : ''}`;
  };

  const setter = (key) => (btn) => { state[key] = btn.dataset.key; update(); };
  const toggles = (key, values) => group(false, S[key === 'light' ? 'lighting' : 'angle'], values.map((v) => ({
    key: v, content: [S[v]], attr: { 'data-state': key, class: 'studio-toggle' },
  })), setter(key), 'studio-toggles');
  const swatchGroup = () => group(true, S.samples, swatches.map((s) => ({
    key: s.id,
    content: [el('span', { class: 'studio-chip', style: `background-color:${s.hex}`, 'aria-hidden': 'true' }),
      el('span', { class: 'studio-swatch-name', text: s.name }),
      el('span', { class: 'studio-swatch-finish', text: S[s.finish] })],
    attr: { 'data-state': 'color', class: `studio-swatch ${s.finish}` },
  })), setter('color'), 'studio-swatches');

  const ppfSwitch = el('button', { type: 'button', role: 'switch', class: 'studio-switch' }, el('span', { class: 'studio-switch-track', 'aria-hidden': 'true' }), S.ppfToggle);
  ppfSwitch.addEventListener('click', () => { state.ppf = !state.ppf; update(); });
  const panels = {
    wrap: [el('h3', { text: S.samples }), swatchGroup()],
    tint: [el('h3', { text: S.vlt }), group(true, S.vlt, Object.keys(TINTS).reverse().map((t) => ({
      key: t,
      content: [el('span', { class: 'studio-chip studio-vlt', style: `--v:${TINTS[t]}`, 'aria-hidden': 'true' }), el('span', { class: 'studio-swatch-name', text: `${t}%` })],
      attr: { 'data-state': 'tint', class: 'studio-swatch' },
    })), setter('tint'), 'studio-swatches studio-tints'), el('p', { class: 'studio-help', text: S.vltHelp })],
    ppf: [el('p', { class: 'studio-help', text: S.ppfHelp }), ppfSwitch],
    protection: [el('p', { class: 'studio-help', text: S.protectionHelp }), el('h3', { text: S.samples }), swatchGroup()],
  };
  const tablist = el('div', { role: 'tablist', 'aria-label': S.products, class: 'studio-tabs' });
  const tabpanels = Object.entries(panels).map(([key, content], i) => {
    const tab = el('button', {
      type: 'button', role: 'tab', id: `${id}-tab-${key}`, 'aria-controls': `${id}-panel-${key}`, 'aria-selected': i === 0, tabindex: i === 0 ? 0 : -1, text: S[key],
    });
    tablist.append(tab);
    const panel = el('div', {
      role: 'tabpanel', id: `${id}-panel-${key}`, 'aria-labelledby': tab.id, class: 'studio-tabpanel',
    }, ...content);
    panel.hidden = i > 0;
    return panel;
  });
  const selectTab = (tab) => {
    tablist.querySelectorAll('[role="tab"]').forEach((t, i) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      tabpanels[i].hidden = !on;
    });
  };
  tablist.querySelectorAll('[role="tab"]').forEach((t) => t.addEventListener('click', () => selectTab(t)));
  rove(tablist, '[role="tab"]', selectTab, false);

  const share = el('button', { type: 'button', class: 'studio-btn secondary', text: S.share });
  share.addEventListener('click', async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('color', swatches.find((s) => s.id === state.color).name);
    ['tint', 'light', 'angle'].forEach((k) => url.searchParams.set(k, state[k]));
    if (state.ppf) url.searchParams.set('ppf', '1'); else url.searchParams.delete('ppf');
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: url.href });
      } else {
        await navigator.clipboard.writeText(url.href);
        status.textContent = S.copied;
        setTimeout(() => { status.textContent = ''; }, 3000);
      }
    } catch { /* share dismissed or clipboard unavailable */ }
  });
  const actions = el('div', { class: 'studio-actions' }, el('a', { class: 'studio-btn primary', href: installerUrl, text: S.installer }), share);
  if (studioUrl) {
    if (embed) {
      const launch = el('button', { type: 'button', class: 'studio-btn secondary', text: S.launch });
      launch.addEventListener('click', () => {
        const frame = el('iframe', {
          src: studioUrl, title: S.studioTitle, loading: 'lazy', allow: 'fullscreen', allowfullscreen: '',
        });
        const back = el('button', { type: 'button', class: 'studio-btn secondary studio-back', text: S.back });
        back.addEventListener('click', () => {
          stage.classList.remove('is-embedded');
          frame.remove();
          back.remove();
          launch.focus();
        });
        stage.classList.add('is-embedded');
        stage.append(frame, back);
        back.focus();
      });
      actions.append(launch);
    }
    actions.append(el('a', {
      class: embed ? 'studio-link' : 'studio-btn secondary', href: studioUrl, target: '_blank', rel: 'noopener', text: embed ? S.newTab : S.openStudio,
    }));
  }
  actions.append(status);

  stage.append(cars, el('span', { class: 'studio-badge', text: S.ppf }), el('div', { class: 'studio-stage-controls' }, toggles('angle', ANGLES), toggles('light', LIGHTS)));
  const panel = el('div', { class: 'studio-panel' }, intro, tablist, ...tabpanels, summary, el('p', { class: 'studio-note', text: S.note }), actions);
  block.replaceChildren(stage, panel);
  update();
}
