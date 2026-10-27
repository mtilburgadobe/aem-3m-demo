let consentedLoaded = false;
const STORAGE_KEY = 'consent';

/*
 * Lightweight consent banner standing in for 3M's production CMP (e.g. OneTrust).
 * Banner copy is provisional until 3M supplies its approved cookie language.
 *
 * Query parameter overrides for testing:
 *   ?consent=accept   grant consent (loads consented.js)
 *   ?consent=decline  decline consent
 */
const STRINGS = {
  en: {
    label: 'Cookie consent',
    text: 'We use cookies to operate this site, analyze traffic and personalize content. You can accept all cookies or decline non-essential cookies.',
    accept: 'Accept all',
    decline: 'Decline non-essential',
    privacy: 'Privacy policy',
  },
  fr: {
    label: 'Consentement aux témoins',
    text: 'Nous utilisons des témoins pour faire fonctionner ce site, analyser le trafic et personnaliser le contenu. Vous pouvez accepter tous les témoins ou refuser les témoins non essentiels.',
    accept: 'Tout accepter',
    decline: 'Refuser les non essentiels',
    privacy: 'Politique de confidentialité',
  },
};

function storedChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function hasConsent() {
  const consent = new URLSearchParams(window.location.search).get('consent');
  if (consent !== null) {
    return ['accept', 'true', '1', 'yes'].includes(consent.toLowerCase());
  }
  return storedChoice() === 'accept';
}

function loadConsented() {
  if (consentedLoaded) return;
  consentedLoaded = true;
  import('./consented.js');
}

function onConsentUpdate() {
  const consented = hasConsent();
  window.dispatchEvent(new CustomEvent('consent.update', { detail: { consented } }));
  if (consented) loadConsented();
}

function showBanner() {
  if (document.querySelector('.consent-banner')) return;
  const t = document.documentElement.lang.startsWith('fr') ? STRINGS.fr : STRINGS.en;
  const banner = document.createElement('section');
  banner.className = 'consent-banner';
  banner.setAttribute('aria-label', t.label);
  banner.innerHTML = `
    <p>${t.text} <a href="https://www.3m.com/3M/en_US/company-us/privacy-policy/">${t.privacy}</a></p>
    <div class="consent-banner-actions">
      <button type="button" class="button secondary" data-choice="decline">${t.decline}</button>
      <button type="button" class="button primary" data-choice="accept">${t.accept}</button>
    </div>`;
  banner.addEventListener('click', (e) => {
    const { choice } = e.target.dataset;
    if (!choice) return;
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch (err) { /* storage unavailable */ }
    banner.remove();
    onConsentUpdate();
  });
  document.body.append(banner);
  banner.querySelector('[data-choice="accept"]').focus({ preventScroll: true });
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href$="#cookie-preferences"]');
  if (!link) return;
  e.preventDefault();
  showBanner();
});

const hasOverride = new URLSearchParams(window.location.search).has('consent');
if (!hasOverride && !storedChoice()) showBanner();
onConsentUpdate();
