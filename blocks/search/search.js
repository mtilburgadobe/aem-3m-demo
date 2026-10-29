import { getMetadata } from '../../scripts/aem.js';

/*
 * Site search without a query index: indexes the internal pages linked from
 * the nav (plus any links authored in the block) and matches page text.
 */

const STRINGS = {
  en: {
    label: 'Search this site', submit: 'Search', results: (n, q) => `${n} result${n === 1 ? '' : 's'} for “${q}”`, none: (q) => `No results for “${q}”.`, hint: 'Enter a search term above.',
  },
  fr: {
    label: 'Rechercher sur ce site', submit: 'Rechercher', results: (n, q) => `${n} résultat${n === 1 ? '' : 's'} pour « ${q} »`, none: (q) => `Aucun résultat pour « ${q} ».`, hint: 'Saisissez un terme de recherche ci-dessus.',
  },
};

async function getText(url) {
  const resp = await fetch(url);
  return resp.ok ? resp.text() : '';
}

async function collectPaths(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const doc = new DOMParser().parseFromString(await getText(`${navPath}.plain.html`), 'text/html');
  const links = [...doc.querySelectorAll('a'), ...block.querySelectorAll('a')];
  const paths = new Set();
  links.forEach((a) => {
    const url = new URL(a.getAttribute('href'), window.location.href);
    if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
      paths.add(url.pathname);
    }
  });
  return [...paths];
}

async function loadPage(path) {
  const html = await getText(`${path.replace(/\/$/, '/index')}.plain.html`);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('.metadata, .section-metadata').forEach((el) => el.remove());
  const title = doc.querySelector('h1')?.textContent.trim() || path;
  const text = doc.body.textContent.replace(/\s+/g, ' ').trim();
  return { path, title, text };
}

function snippet(text, terms) {
  const lower = text.toLowerCase();
  const i = Math.max(0, Math.min(...terms.map((t) => lower.indexOf(t)).filter((n) => n >= 0)));
  const start = Math.max(0, i - 60);
  return `${start > 0 ? '…' : ''}${text.slice(start, start + 180)}${start + 180 < text.length ? '…' : ''}`;
}

function highlight(el, value, terms) {
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  value.split(re).forEach((part) => {
    if (terms.includes(part.toLowerCase())) {
      const mark = document.createElement('mark');
      mark.textContent = part;
      el.append(mark);
    } else el.append(part);
  });
}

export default async function decorate(block) {
  const t = document.documentElement.lang.startsWith('fr') ? STRINGS.fr : STRINGS.en;
  const query = new URLSearchParams(window.location.search).get('q')?.trim() || '';
  const pathsPromise = collectPaths(block);

  const form = document.createElement('form');
  form.className = 'search-form';
  form.role = 'search';
  form.innerHTML = `<label for="search-q">${t.label}</label>
    <div><input id="search-q" name="q" type="search" autocomplete="off"><button type="submit">${t.submit}</button></div>`;
  form.querySelector('input').value = query;

  const status = document.createElement('p');
  status.className = 'search-status';
  status.setAttribute('aria-live', 'polite');
  const list = document.createElement('ol');
  list.className = 'search-results';
  block.replaceChildren(form, status, list);

  if (!query) {
    status.textContent = t.hint;
    return;
  }
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const pages = await Promise.all((await pathsPromise).map(loadPage));
  const hits = pages
    .map((p) => {
      const title = p.title.toLowerCase();
      const body = p.text.toLowerCase();
      if (!terms.every((term) => body.includes(term) || title.includes(term))) return null;
      const score = terms.reduce((s, term) => s + (title.includes(term) ? 10 : 0)
        + body.split(term).length - 1, 0);
      return { ...p, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  status.textContent = hits.length ? t.results(hits.length, query) : t.none(query);
  hits.forEach((hit) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = hit.path;
    highlight(a, hit.title, terms);
    const p = document.createElement('p');
    highlight(p, snippet(hit.text, terms), terms);
    li.append(a, p);
    list.append(li);
  });
}
