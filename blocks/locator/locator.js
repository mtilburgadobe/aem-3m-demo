import { loadCSS, loadScript, readBlockConfig } from '../../scripts/aem.js';

const PRODUCTS = [
  'Automotive Window Film',
  'Ceramic Coating',
  'Color Change Film',
  'Paint Protection Film',
  'Protection Wrap Film',
];
const TYPES = ['3M Authorized Dealer', '3M Pro Shop Dealer'];
const DEFAULT_DATA = '/personal-auto/data/dealers.json';
const LEAFLET = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet';

const STRINGS = {
  en: {
    back: 'Back',
    searchLabel: 'ZIP or postal code',
    searchPlaceholder: 'e.g. 55118 or M5V 2T6',
    search: 'Search',
    useLocation: 'Use my location',
    filters: 'Filter results',
    productsLegend: 'Products',
    typesLegend: 'Dealer type',
    prompt: 'Enter a ZIP or postal code to find 3M installers near you.',
    loading: 'Searching for installers…',
    results: '{count} installers within {radius} miles',
    resultsOne: '1 installer within {radius} miles',
    nearest: 'No installers within {radius} miles. Showing the {count} nearest.',
    none: 'No installers match your filters. Try clearing some filters.',
    invalid: 'Please enter a valid US ZIP code (e.g. 55118) or Canadian postal code (e.g. M5V 2T6).',
    notFound: 'We could not find that location. Please check the code and try again.',
    geoError: 'We could not access your location. Please enter a ZIP or postal code instead.',
    dataError: 'Installer data is currently unavailable. Please try again later.',
    myLocation: 'your location',
    miles: '{d} mi',
    call: 'Call',
    website: 'Website',
    directions: 'Get directions',
    opensNew: '(opens in a new tab)',
    quote: 'Get a Quote',
    quoteTitle: 'Request a quote',
    quoteFor: 'Your request will be sent to {name}.',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone',
    postal: 'ZIP / postal code',
    vehicle: 'Vehicle (year, make, model)',
    product: 'Product of interest',
    message: 'Message',
    consent: 'I agree that 3M and the selected dealer may contact me about my request.',
    required: '(required)',
    errEmail: 'Please enter a valid email address.',
    errConsent: 'Please agree to be contacted so we can process your request.',
    submit: 'Send request',
    sending: 'Sending…',
    close: 'Close',
    success: 'Thank you! Your request has been sent to {name}.',
    successDemo: 'Demo mode: in production this request is routed to 3M and to {name}.',
    submitError: 'Sorry, your request could not be sent. Please try again later.',
    demoNote: 'Demo – no data is sent',
    mapLabel: 'Map of installer locations',
    products: {},
    types: {},
  },
  fr: {
    back: 'Retour',
    searchLabel: 'Code postal ou ZIP',
    searchPlaceholder: 'p. ex. H2T 1S6 ou 55118',
    search: 'Rechercher',
    useLocation: 'Utiliser ma position',
    filters: 'Filtrer les résultats',
    productsLegend: 'Produits',
    typesLegend: 'Type de détaillant',
    prompt: 'Entrez un code postal pour trouver un installateur 3M près de chez vous.',
    loading: 'Recherche d’installateurs…',
    results: '{count} installateurs dans un rayon de {radius} milles',
    resultsOne: '1 installateur dans un rayon de {radius} milles',
    nearest: 'Aucun installateur dans un rayon de {radius} milles. Voici les {count} plus proches.',
    none: 'Aucun installateur ne correspond à vos filtres. Essayez d’en retirer.',
    invalid: 'Veuillez entrer un code postal canadien valide (p. ex. M5V 2T6) ou un code ZIP américain (p. ex. 55118).',
    notFound: 'Emplacement introuvable. Veuillez vérifier le code et réessayer.',
    geoError: 'Impossible d’accéder à votre position. Veuillez plutôt entrer un code postal.',
    dataError: 'Les données des installateurs sont indisponibles pour le moment. Veuillez réessayer plus tard.',
    myLocation: 'votre position',
    miles: '{d} mi',
    call: 'Appeler',
    website: 'Site Web',
    directions: 'Itinéraire',
    opensNew: '(s’ouvre dans un nouvel onglet)',
    quote: 'Obtenir une soumission',
    quoteTitle: 'Demande de soumission',
    quoteFor: 'Votre demande sera envoyée à {name}.',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Courriel',
    phone: 'Téléphone',
    postal: 'Code postal',
    vehicle: 'Véhicule (année, marque, modèle)',
    product: 'Produit souhaité',
    message: 'Message',
    consent: 'J’accepte que 3M et le détaillant sélectionné communiquent avec moi au sujet de ma demande.',
    required: '(obligatoire)',
    errEmail: 'Veuillez entrer une adresse courriel valide.',
    errConsent: 'Veuillez accepter d’être contacté afin que nous puissions traiter votre demande.',
    submit: 'Envoyer la demande',
    sending: 'Envoi…',
    close: 'Fermer',
    success: 'Merci! Votre demande a été envoyée à {name}.',
    successDemo: 'Mode démo : en production, cette demande est acheminée à 3M et à {name}.',
    submitError: 'Désolé, votre demande n’a pas pu être envoyée. Veuillez réessayer plus tard.',
    demoNote: 'Démo – aucune donnée n’est envoyée',
    mapLabel: 'Carte des installateurs',
    products: {
      'Automotive Window Film': 'Pellicule pour vitres d’automobile',
      'Ceramic Coating': 'Revêtement céramique',
      'Color Change Film': 'Pellicule de changement de couleur',
      'Paint Protection Film': 'Pellicule de protection de peinture',
      'Protection Wrap Film': 'Pellicule d’enveloppement protectrice',
    },
    types: {
      '3M Authorized Dealer': 'Détaillant autorisé 3M',
      '3M Pro Shop Dealer': 'Détaillant Pro Shop 3M',
    },
  },
};

const t = (document.documentElement.lang || '').toLowerCase().startsWith('fr') ? STRINGS.fr : STRINGS.en;
const fmt = (str, vals = {}) => str.replace(/\{(\w+)\}/g, (m, k) => (k in vals ? vals[k] : m));
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const label = (map, key) => map[key] || key;
let uid = 0;

function distanceMiles(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

async function geocode(query) {
  const q = query.trim().toUpperCase();
  let url;
  if (/^\d{5}(-\d{4})?$/.test(q)) url = `https://api.zippopotam.us/us/${q.slice(0, 5)}`;
  else if (/^[A-Z]\d[A-Z](\s?\d[A-Z]\d)?$/.test(q)) url = `https://api.zippopotam.us/ca/${q.slice(0, 3)}`;
  else throw new Error('invalid');
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('notFound');
  const place = (await resp.json()).places?.[0];
  if (!place) throw new Error('notFound');
  return { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) };
}

async function loadDealers(src) {
  const url = new URL(src, window.location.href);
  url.searchParams.set('limit', '1000');
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`dealers ${resp.status}`);
  const { data = [] } = await resp.json();
  return data.map((row) => ({
    ...row,
    lat: parseFloat(row.lat),
    lng: parseFloat(row.lng),
    productList: (row.products || '').split(',').map((p) => p.trim()).filter(Boolean),
  })).filter((d) => d.name && Number.isFinite(d.lat) && Number.isFinite(d.lng));
}

let leafletPromise;
function loadLeaflet() {
  if (!leafletPromise) {
    leafletPromise = Promise.all([
      loadCSS(`${LEAFLET}.css`),
      loadScript(`${LEAFLET}.js`),
    ]).then(() => {
      if (!window.L) throw new Error('Leaflet unavailable');
      return window.L;
    });
  }
  return leafletPromise;
}

function checkboxes(name, values, map) {
  return values.map((v) => `<label class="locator-check"><input type="checkbox" name="${name}" value="${esc(v)}"> ${esc(label(map, v))}</label>`).join('');
}

function field(id, name, text, { type = 'text', required = false, autocomplete = '' } = {}) {
  const req = required ? ` <span class="locator-req">${t.required}</span>` : '';
  const ac = autocomplete ? ` autocomplete="${autocomplete}"` : '';
  return `<div class="locator-field"><label for="${id}-${name}">${text}${req}</label>
    <input id="${id}-${name}" name="${name}" type="${type}"${ac}${required ? ' required' : ''} aria-describedby="${id}-${name}-err">
    <p class="locator-error" id="${id}-${name}-err" hidden></p></div>`;
}

function resultItem(d, i) {
  const addr = [d.address, `${d.city || ''}${d.region ? `, ${d.region}` : ''} ${d.postal || ''}`.trim()].filter(Boolean);
  const dest = encodeURIComponent([d.address, d.city, d.region, d.postal, d.country].filter(Boolean).join(', '));
  const links = [
    d.phone && `<li><a href="tel:${esc(d.phone.replace(/[^\d+]/g, ''))}" aria-label="${t.call} ${esc(d.name)}: ${esc(d.phone)}">${esc(d.phone)}</a></li>`,
    d.website && `<li><a href="${esc(d.website)}" target="_blank" rel="noopener">${t.website}<span class="locator-sr"> ${esc(d.name)} ${t.opensNew}</span></a></li>`,
    `<li><a href="https://www.google.com/maps/dir/?api=1&amp;destination=${dest}" target="_blank" rel="noopener">${t.directions}<span class="locator-sr"> ${t.opensNew}</span></a></li>`,
  ].filter(Boolean).join('');
  return `<li class="locator-result" data-index="${i}">
    <span class="locator-num" aria-hidden="true">${i + 1}</span>
    <div class="locator-result-body">
      <p class="locator-type">${esc(label(t.types, d.type))}</p>
      <h3 class="locator-name"><button type="button" class="locator-focus">${esc(d.name)}</button></h3>
      <p class="locator-distance">${fmt(t.miles, { d: d.distance.toFixed(1) })}</p>
      <address>${addr.map(esc).join('<br>')}</address>
      <ul class="locator-links">${links}</ul>
      <ul class="locator-tags">${d.productList.map((p) => `<li>${esc(label(t.products, p))}</li>`).join('')}</ul>
      <button type="button" class="locator-quote">${t.quote}</button>
    </div></li>`;
}

function buildDialog(id, endpoint) {
  const dialog = document.createElement('dialog');
  dialog.className = 'locator-dialog';
  dialog.setAttribute('aria-labelledby', `${id}-dtitle`);
  dialog.innerHTML = `<form method="dialog" novalidate>
    <div class="locator-dialog-head"><h2 id="${id}-dtitle">${t.quoteTitle}</h2>
      <button type="button" class="locator-close" aria-label="${t.close}">×</button></div>
    <p class="locator-dealer"></p>
    <div class="locator-grid">
      ${field(id, 'firstName', t.firstName, { autocomplete: 'given-name' })}
      ${field(id, 'lastName', t.lastName, { autocomplete: 'family-name' })}
      ${field(id, 'email', t.email, { type: 'email', required: true, autocomplete: 'email' })}
      ${field(id, 'phone', t.phone, { type: 'tel', autocomplete: 'tel' })}
      ${field(id, 'postal', t.postal, { autocomplete: 'postal-code' })}
      ${field(id, 'vehicle', t.vehicle)}
    </div>
    <div class="locator-field"><label for="${id}-product">${t.product}</label>
      <select id="${id}-product" name="product">${PRODUCTS.map((p) => `<option value="${esc(p)}">${esc(label(t.products, p))}</option>`).join('')}</select></div>
    <div class="locator-field"><label for="${id}-message">${t.message}</label>
      <textarea id="${id}-message" name="message" rows="3"></textarea></div>
    <div class="locator-field"><label class="locator-check"><input type="checkbox" name="consent" required aria-describedby="${id}-consent-err">
      <span>${t.consent} <span class="locator-req">${t.required}</span></span></label>
      <p class="locator-error" id="${id}-consent-err" hidden></p></div>
    <p class="locator-form-status" role="status"></p>
    <div class="locator-dialog-foot"><button type="submit" class="locator-submit">${t.submit}</button>
      ${endpoint ? '' : `<small class="locator-demo">${t.demoNote}</small>`}</div>
  </form>`;
  const form = dialog.querySelector('form');
  const status = form.querySelector('.locator-form-status');
  const submit = form.querySelector('.locator-submit');
  let dealer;

  const showError = (input, msg) => {
    const err = form.querySelector(`#${input.getAttribute('aria-describedby')}`);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    err.textContent = msg || '';
    err.hidden = !msg;
  };
  const validate = () => {
    const { email, consent } = form.elements;
    showError(email, email.checkValidity() && email.value.trim() ? '' : t.errEmail);
    showError(consent, consent.checked ? '' : t.errConsent);
    return [email, consent].find((el) => el.getAttribute('aria-invalid') === 'true');
  };

  dialog.querySelector('.locator-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = validate();
    if (invalid) { invalid.focus(); return; }
    const lead = Object.fromEntries(new FormData(form));
    lead.consent = true;
    const payload = {
      dealer: { name: dealer.name, email: dealer.email, type: dealer.type },
      lead,
      routing: ['3m', dealer.email].filter(Boolean),
      source: window.location.href,
      submittedAt: new Date().toISOString(),
    };
    submit.disabled = true;
    status.className = 'locator-form-status';
    if (!endpoint) {
      // eslint-disable-next-line no-console
      console.info('[locator] demo lead payload', payload);
      status.textContent = fmt(t.successDemo, { name: dealer.name });
      status.classList.add('success');
      return;
    }
    status.textContent = t.sending;
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(resp.status);
      status.textContent = fmt(t.success, { name: dealer.name });
      status.classList.add('success');
    } catch {
      status.textContent = t.submitError;
      status.classList.add('error');
      submit.disabled = false;
    }
  });

  dialog.openFor = (d, postal) => {
    dealer = d;
    form.reset();
    form.querySelectorAll('[aria-invalid]').forEach((el) => showError(el, ''));
    status.textContent = '';
    submit.disabled = false;
    dialog.querySelector('.locator-dealer').textContent = fmt(t.quoteFor, { name: d.name });
    form.elements.postal.value = postal || '';
    if (d.productList.length) [form.elements.product.value] = d.productList;
    dialog.showModal();
    form.elements.firstName.focus();
  };
  return dialog;
}

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  const dataSrc = cfg.data || DEFAULT_DATA;
  const endpoint = (cfg['lead-endpoint'] || '').trim();
  const radius = parseFloat(cfg.radius) || 50;
  uid += 1;
  const id = `locator-${uid}`;

  block.innerHTML = `<div class="locator-panel">
    <button type="button" class="locator-back">${t.back}</button>
    <form class="locator-search" role="search">
      <label for="${id}-q">${t.searchLabel}</label>
      <div class="locator-search-row">
        <input id="${id}-q" name="q" type="search" inputmode="text" autocomplete="postal-code" placeholder="${t.searchPlaceholder}">
        <button type="submit">${t.search}</button>
      </div>
      <button type="button" class="locator-geo">${t.useLocation}</button>
    </form>
    <details class="locator-filters"><summary>${t.filters}</summary>
      <fieldset><legend>${t.productsLegend}</legend>${checkboxes('product', PRODUCTS, t.products)}</fieldset>
      <fieldset><legend>${t.typesLegend}</legend>${checkboxes('type', TYPES, t.types)}</fieldset>
    </details>
    <p class="locator-status" aria-live="polite">${t.prompt}</p>
    <ol class="locator-results"></ol>
  </div>
  <div class="locator-map-wrap"><div class="locator-map" role="region" aria-label="${t.mapLabel}"></div></div>`;

  const $ = (sel) => block.querySelector(sel);
  const input = $(`#${id}-q`);
  const status = $('.locator-status');
  const list = $('.locator-results');
  const mapEl = $('.locator-map');
  const filters = $('.locator-filters');
  const dialog = buildDialog(id, endpoint);
  block.append(dialog);
  filters.open = window.matchMedia('(width >= 900px)').matches;

  const state = {
    dealers: null, origin: null, postal: '', results: [], map: null, layer: null, markers: [],
  };
  const dealersPromise = loadDealers(dataSrc).then((d) => { state.dealers = d; return d; });
  dealersPromise.catch(() => {});

  const setStatus = (msg, kind = '') => {
    status.textContent = msg;
    status.className = `locator-status ${kind}`.trim();
  };

  function setActive(i, { scroll = false, pan = false } = {}) {
    list.querySelectorAll('.locator-result').forEach((li) => li.classList.toggle('active', Number(li.dataset.index) === i));
    state.markers.forEach((m, mi) => m.getElement()?.classList.toggle('active', mi === i));
    if (scroll) list.children[i]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (pan && state.markers[i]) state.map.panTo(state.markers[i].getLatLng());
  }

  let mapPromise;
  function ensureMap() {
    if (!mapPromise) {
      mapPromise = loadLeaflet().then((L) => {
        state.map = L.map(mapEl, { scrollWheelZoom: false }).setView([45.5, -85], 4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(state.map);
        state.layer = L.layerGroup().addTo(state.map);
        return L;
      }).catch(() => {
        block.classList.add('locator-no-map');
        return null;
      });
    }
    return mapPromise;
  }

  async function drawMap() {
    const L = await ensureMap();
    if (!L || !state.origin) return;
    state.layer.clearLayers();
    state.markers = state.results.map((d, i) => {
      const icon = L.divIcon({
        className: 'locator-pin', html: `<span>${i + 1}</span>`, iconSize: [30, 30], iconAnchor: [15, 15],
      });
      return L.marker([d.lat, d.lng], { icon, title: d.name, alt: `${i + 1}. ${d.name}` })
        .on('click', () => setActive(i, { scroll: true }))
        .addTo(state.layer);
    });
    L.circleMarker([state.origin.lat, state.origin.lng], {
      radius: 6, color: '#fff', weight: 2, fillColor: '#131313', fillOpacity: 1,
    }).addTo(state.layer);
    state.map.invalidateSize();
    const pts = [[state.origin.lat, state.origin.lng], ...state.results.map((d) => [d.lat, d.lng])];
    if (pts.length > 1) state.map.fitBounds(pts, { padding: [40, 40], maxZoom: 13 });
    else state.map.setView(pts[0], 11);
  }

  function render() {
    if (!state.origin || !state.dealers) return;
    const checked = (name) => [...block.querySelectorAll(`input[name="${name}"]:checked`)].map((c) => c.value);
    const prods = checked('product');
    const types = checked('type');
    const matches = state.dealers
      .filter((d) => !prods.length || prods.some((p) => d.productList.includes(p)))
      .filter((d) => !types.length || types.includes(d.type))
      .map((d) => ({ ...d, distance: distanceMiles(state.origin, d) }))
      .sort((a, b) => a.distance - b.distance);
    const within = matches.filter((d) => d.distance <= radius);
    state.results = within.length ? within : matches.slice(0, 5);
    list.innerHTML = state.results.map(resultItem).join('');
    if (!matches.length) setStatus(t.none, 'empty');
    else if (!within.length) setStatus(fmt(t.nearest, { radius, count: state.results.length }), 'note');
    else {
      const msg = within.length > 1 ? t.results : t.resultsOne;
      setStatus(fmt(msg, { count: within.length, radius }));
    }
    drawMap();
  }

  async function search(originPromise) {
    setStatus(t.loading, 'loading');
    list.innerHTML = '';
    list.setAttribute('aria-busy', 'true');
    ensureMap();
    try {
      const [origin] = await Promise.all([originPromise, dealersPromise.catch(() => { throw new Error('dataError'); })]);
      state.origin = origin;
      render();
    } catch (e) {
      setStatus(t[e.message] || t.notFound, 'error');
    } finally {
      list.removeAttribute('aria-busy');
    }
  }

  $('.locator-search').addEventListener('submit', (e) => {
    e.preventDefault();
    state.postal = input.value.trim();
    const url = new URL(window.location.href);
    url.searchParams.set('zip', state.postal);
    window.history.replaceState(null, '', url);
    search(geocode(state.postal));
  });
  $('.locator-geo').addEventListener('click', () => {
    if (!navigator.geolocation) { setStatus(t.geoError, 'error'); return; }
    search(new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => reject(new Error('geoError')),
        { timeout: 10000 },
      );
    }));
  });
  $('.locator-back').addEventListener('click', () => {
    if (document.referrer.startsWith(window.location.origin)) window.history.back();
    else window.location.href = '/';
  });
  filters.addEventListener('change', render);
  list.addEventListener('click', (e) => {
    const li = e.target.closest('.locator-result');
    if (!li) return;
    const i = Number(li.dataset.index);
    if (e.target.closest('.locator-quote')) dialog.openFor(state.results[i], state.postal);
    else if (e.target.closest('.locator-focus')) setActive(i, { pan: true });
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) { io.disconnect(); ensureMap(); }
    }, { rootMargin: '200px' });
    io.observe(mapEl);
  }

  const zip = new URLSearchParams(window.location.search).get('zip');
  if (zip) {
    input.value = zip;
    state.postal = zip;
    search(geocode(zip));
  }
}
