import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Nav fragment content model (sections in order):
 * 1. brand:    link wrapping the logo (`:3m-logo:` icon) or text
 * 2. sections: list of main menu links (nested list = dropdown)
 * 3. tools:    "Search" link (href = search action, empty query param = field name),
 *              locale list (one item "US - EN" with a nested list of language links),
 *              "Account" link
 * 4. l2:       (optional) list of breadcrumb ancestors, a title link, list of L2 links
 */

const isDesktop = window.matchMedia('(min-width: 900px)');
const OPEN_DROPDOWNS = '.nav-drop > button[aria-expanded="true"], .nav-locale > button[aria-expanded="true"]';

const STRINGS = {
  en: {
    search: 'Search', language: 'Choose a language', open: 'Open navigation', close: 'Close navigation', breadcrumb: 'Breadcrumb', l2: 'Car Personalization',
  },
  fr: {
    search: 'Rechercher', language: 'Choisir une langue', open: 'Ouvrir la navigation', close: 'Fermer la navigation', breadcrumb: 'Fil d’Ariane', l2: 'Personnalisation automobile',
  },
};

function icon(name) {
  return `<img src="${window.hlx.codeBasePath}/icons/${name}.svg" alt="" width="24" height="24" aria-hidden="true">`;
}

function closeDropdowns(scope, except) {
  scope.querySelectorAll(OPEN_DROPDOWNS).forEach((b) => {
    if (b !== except) b.setAttribute('aria-expanded', 'false');
  });
}

function setMenu(nav, open) {
  const button = nav.querySelector('.nav-hamburger');
  const t = nav.strings;
  if (isDesktop.matches) {
    nav.removeAttribute('aria-expanded');
    document.body.style.overflowY = '';
    return;
  }
  nav.setAttribute('aria-expanded', open ? 'true' : 'false');
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  button.setAttribute('aria-label', open ? t.close : t.open);
}

function buildSearch(link, t) {
  const url = new URL(link.href, window.location.href);
  let field = 'q';
  url.searchParams.forEach((value, key) => { if (!value) field = key; });
  url.searchParams.delete(field);
  const form = document.createElement('form');
  form.className = 'nav-search';
  form.role = 'search';
  form.action = url.origin + url.pathname;
  form.method = 'get';
  form.innerHTML = `
    <label class="nav-sr" for="nav-search-input">${t.search}</label>
    <input id="nav-search-input" type="search" name="${field}" placeholder="${t.search}" autocomplete="off">
    <button type="submit" aria-label="${t.search}">${icon('search')}</button>`;
  url.searchParams.forEach((value, key) => {
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = key;
    hidden.value = value;
    form.append(hidden);
  });
  return form;
}

function buildLocale(section, t) {
  const item = section?.querySelector('ul > li:has(> ul)');
  if (!item) return null;
  const options = [...item.querySelectorAll(':scope > ul a')];
  const label = [...item.childNodes].filter((n) => n.nodeName !== 'UL')
    .map((n) => n.textContent).join('').trim();
  const dir = (a) => new URL(a.href, window.location.href).pathname.replace(/[^/]*$/, '');
  const here = window.location.pathname;
  const current = options
    .filter((a) => here.startsWith(dir(a)))
    .sort((a, b) => dir(b).length - dir(a).length)[0];

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-locale';
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'nav-locale-list');
  button.setAttribute('aria-label', `${t.language}: ${label}`);
  button.innerHTML = `<span>${label}</span>${icon('globe')}`;

  const list = document.createElement('ul');
  list.id = 'nav-locale-list';
  options.forEach((a) => {
    const li = document.createElement('li');
    a.className = '';
    if (a === current) a.setAttribute('aria-current', 'true');
    li.append(a);
    list.append(li);
  });

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    closeDropdowns(button.closest('nav'), button);
    button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
  wrapper.append(button, list);
  return wrapper;
}

function buildSections(section) {
  const list = section?.querySelector('ul');
  if (!list) return null;
  list.className = 'nav-sections';
  list.querySelectorAll(':scope > li').forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    if (!sub) return;
    li.classList.add('nav-drop');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    [...li.childNodes].forEach((n) => { if (n !== sub) button.append(n); });
    li.prepend(button);
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      closeDropdowns(list, button);
      button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });
  return list;
}

function buildL2(section, t) {
  if (!section) return null;
  const [ancestors, l2Links] = section.querySelectorAll('ul');
  const titleLink = [...section.querySelectorAll('a')].find((a) => !a.closest('ul'));
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-l2';

  const crumbs = document.createElement('nav');
  crumbs.className = 'nav-breadcrumb';
  crumbs.setAttribute('aria-label', t.breadcrumb);
  const ol = document.createElement('ol');
  [...(ancestors?.querySelectorAll('a') || [])].forEach((a) => {
    const li = document.createElement('li');
    li.append(a.cloneNode(true));
    ol.append(li);
  });
  const here = window.location.pathname.replace(/\/$/, '');
  const titlePath = titleLink ? new URL(titleLink.href).pathname.replace(/\/$/, '') : '';
  if (titleLink) {
    const li = document.createElement('li');
    if (here === titlePath) {
      li.textContent = titleLink.textContent;
      li.setAttribute('aria-current', 'page');
    } else {
      li.append(titleLink.cloneNode(true));
    }
    ol.append(li);
  }
  const h1 = document.querySelector('main h1');
  if (here !== titlePath && h1) {
    const li = document.createElement('li');
    li.textContent = h1.textContent;
    li.setAttribute('aria-current', 'page');
    ol.append(li);
  }
  crumbs.append(ol);

  const head = document.createElement('div');
  head.className = 'nav-l2-head';
  const title = document.createElement('p');
  title.className = 'nav-l2-title';
  if (titleLink) {
    const a = titleLink.cloneNode(true);
    title.append(a);
  } else {
    title.textContent = t.l2;
  }
  head.append(title);
  if (l2Links) {
    l2Links.className = 'nav-l2-links';
    l2Links.querySelectorAll('a').forEach((a) => {
      if (new URL(a.href).pathname.replace(/\/$/, '') === here) a.setAttribute('aria-current', 'page');
    });
    head.append(l2Links);
  }
  wrapper.append(crumbs, head);
  return wrapper;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const [brandSection, menuSection, toolsSection, l2Section] = [...fragment.children];
  const t = document.documentElement.lang.startsWith('fr') ? STRINGS.fr : STRINGS.en;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.strings = t;

  // top row: hamburger, brand, search, locale
  const top = document.createElement('div');
  top.className = 'nav-top';
  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-controls', 'nav-menu');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  hamburger.addEventListener('click', () => setMenu(nav, nav.getAttribute('aria-expanded') !== 'true'));

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const brandLink = brandSection?.querySelector('a');
  if (brandLink) {
    brandLink.className = '';
    // `:3m-logo:` is not converted by the pipeline (icon names must start with a letter)
    const token = brandLink.textContent.trim().match(/^:([\w-]+):$/);
    if (token && !brandLink.querySelector('img')) {
      const img = document.createElement('img');
      img.src = `${window.hlx.codeBasePath}/icons/${token[1]}.svg`;
      img.width = 159;
      img.height = 28;
      const span = document.createElement('span');
      span.className = `icon icon-${token[1]}`;
      span.append(img);
      brandLink.replaceChildren(span);
    }
    const logo = brandLink.querySelector('img');
    if (logo) {
      logo.alt = '3M';
      logo.removeAttribute('loading');
    }
    brand.append(brandLink);
  } else if (brandSection) {
    brand.append(...brandSection.querySelector('.default-content-wrapper')?.childNodes || []);
  }
  top.append(hamburger, brand);

  const toolLinks = [...(toolsSection?.querySelectorAll('a') || [])];
  const searchLink = toolLinks.find((a) => /^(search|rechercher)$/i.test(a.textContent.trim()));
  const accountLink = toolLinks.find((a) => /account|compte/i.test(a.textContent));
  if (searchLink) top.append(buildSearch(searchLink, t));
  const locale = buildLocale(toolsSection, t);
  if (locale) top.append(locale);

  // menu row: main sections + account
  const menu = document.createElement('div');
  menu.className = 'nav-menu';
  menu.id = 'nav-menu';
  const sections = buildSections(menuSection);
  if (sections) menu.append(sections);
  if (accountLink) {
    accountLink.className = 'nav-account';
    accountLink.innerHTML = `${icon('account')}<span>${accountLink.textContent.trim()}</span>`;
    menu.append(accountLink);
  }
  nav.append(top, menu);

  nav.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = nav.querySelector(OPEN_DROPDOWNS);
    if (open) {
      open.setAttribute('aria-expanded', 'false');
      open.focus();
    } else if (nav.getAttribute('aria-expanded') === 'true') {
      setMenu(nav, false);
      hamburger.focus();
    }
  });
  nav.addEventListener('focusout', (e) => {
    if (!nav.contains(e.relatedTarget)) closeDropdowns(nav);
  });
  setMenu(nav, false);
  isDesktop.addEventListener('change', () => setMenu(nav, false));

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  const l2 = buildL2(l2Section, t);
  if (l2) wrapper.append(l2);
  block.replaceChildren(wrapper);
}
