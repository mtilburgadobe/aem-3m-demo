const STRINGS = {
  en: {
    label: 'ZIP or postal code', placeholder: 'e.g. 55118', submit: 'Search',
  },
  fr: {
    label: 'Code postal', placeholder: 'ex. H2X 1Y4', submit: 'Rechercher',
  },
};

function buildZipForm(action) {
  const t = document.documentElement.lang.startsWith('fr') ? STRINGS.fr : STRINGS.en;
  const form = document.createElement('form');
  form.className = 'banner-zip';
  form.action = action;
  form.method = 'get';
  form.innerHTML = `
    <label for="banner-zip-input">${t.label}</label>
    <div class="banner-zip-row">
      <input id="banner-zip-input" name="zip" type="text" inputmode="text" autocomplete="postal-code"
        placeholder="${t.placeholder}" required maxlength="7">
      <button type="submit" class="button primary">${t.submit}</button>
    </div>`;
  return form;
}

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const cells = [...row.children];
  const media = cells.find((c) => c.querySelector('picture') && !c.textContent.trim());
  const content = cells.find((c) => c !== media) || cells[0];
  if (media) media.className = 'banner-media';
  content.className = 'banner-content';
  if (!media) block.classList.add('no-media');

  if (block.classList.contains('zip')) {
    const cta = content.querySelector('a[href]');
    const action = cta ? cta.getAttribute('href') : '/personal-auto/find-an-installer';
    const form = buildZipForm(action);
    const ctaWrapper = cta && cta.closest('p');
    if (ctaWrapper) ctaWrapper.replaceWith(form);
    else content.append(form);
  }
}
