/**
 * Table: first row is the header row. Variant `no-header` treats all rows as data.
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const rows = [...block.children];
  const hasHeader = !block.classList.contains('no-header');
  let headers = [];
  if (hasHeader && rows.length) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    headers = [...rows.shift().children].map((cell) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.append(...cell.childNodes);
      tr.append(th);
      return th.textContent.trim();
    });
    thead.append(tr);
    table.append(thead);
  }
  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell, i) => {
      const td = document.createElement('td');
      if (headers[i]) td.dataset.label = headers[i];
      td.append(...cell.childNodes);
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  const scroller = document.createElement('div');
  scroller.className = 'table-scroll';
  scroller.append(table);
  block.replaceChildren(scroller);
}
