export default function decorate(block) {
  const rows = [...block.children];
  const figure = document.createElement('figure');
  const quote = document.createElement('blockquote');
  const caption = document.createElement('figcaption');
  rows.forEach((row, i) => {
    const pic = row.querySelector('picture');
    if (pic && !row.textContent.trim()) {
      const media = document.createElement('div');
      media.className = 'testimonial-media';
      media.append(pic);
      figure.prepend(media);
    } else if (i === 0 || !quote.childElementCount) {
      quote.append(...row.firstElementChild.childNodes);
    } else {
      caption.append(...row.firstElementChild.childNodes);
    }
  });
  figure.append(quote);
  if (caption.childNodes.length) figure.append(caption);
  block.replaceChildren(figure);
}
