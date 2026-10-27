/**
 * Swatch promo: first row = intro content with a studio link,
 * following rows = swatch name | hex color.
 */
export default function decorate(block) {
  const [intro, ...swatchRows] = [...block.children];
  const content = intro.firstElementChild;
  content.className = 'swatch-promo-content';
  const studioLink = content.querySelector('a[href]');
  const studioHref = studioLink ? studioLink.getAttribute('href') : '/personal-auto/restyling-studio';

  const list = document.createElement('ul');
  list.className = 'swatch-promo-swatches';
  swatchRows.forEach((row) => {
    const [nameCell, colorCell] = [...row.children];
    const name = nameCell?.textContent.trim();
    const color = colorCell?.textContent.trim();
    if (!name || !/^#[0-9a-f]{3,8}$/i.test(color || '')) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    const url = new URL(studioHref, window.location.href);
    url.searchParams.set('color', name);
    a.href = url.pathname + url.search;
    a.style.setProperty('--swatch', color);
    a.innerHTML = '<span class="swatch-promo-chip" aria-hidden="true"></span><span class="swatch-promo-name"></span>';
    a.querySelector('.swatch-promo-name').textContent = name;
    li.append(a);
    list.append(li);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'swatch-promo-inner';
  wrapper.append(content, list);
  block.replaceChildren(wrapper);
}
