(() => {
  const article = document.querySelector('.review-article');
  const tools = document.querySelector('.reading-tools');
  const sidebar = document.querySelector('.review-sidebar');
  if (!article || !tools || !sidebar) return;
  document.body.classList.add('reader-enhanced');
  sidebar.append(tools);
  const contents = tools.querySelector('details');
  if (contents) contents.open = matchMedia('(min-width: 768px)').matches;
  const make = (tag, className, text) => { const el = document.createElement(tag); el.className = className; if (text) el.textContent = text; return el; };
  const sizing = make('div', 'reader-sizing'); sizing.setAttribute('role', 'group'); sizing.setAttribute('aria-label', 'Reading text size');
  sizing.append(make('span', '', 'Text size'));
  let size = 17;
  try { const saved = Number(localStorage.getItem('bepsi-reader-size')); if (saved >= 16 && saved <= 21) size = saved; } catch {}
  const smaller = make('button', '', 'A−'); smaller.type = 'button'; smaller.setAttribute('aria-label', 'Decrease reading text size');
  const larger = make('button', '', 'A+'); larger.type = 'button'; larger.setAttribute('aria-label', 'Increase reading text size');
  const syncSize = () => { document.body.style.setProperty('--reader-size', `${size}px`); smaller.disabled = size <= 16; larger.disabled = size >= 21; };
  [[smaller, -1], [larger, 1]].forEach(([button, delta]) => button.addEventListener('click', () => { size = Math.min(21, Math.max(16, size + delta)); syncSize(); try { localStorage.setItem('bepsi-reader-size', String(size)); } catch {} }));
  sizing.append(smaller, larger); tools.append(sizing); syncSize();
  const progress = make('div', 'reader-progress'); const status = make('span', '', '0% read'); progress.append(status); tools.append(progress);
  const prose = article.querySelector('.review-prose');
  const links = [...tools.querySelectorAll('.article-contents a')];
  const headings = links.map(link => document.getElementById(link.hash.slice(1)));
  let frame = 0;
  const update = () => {
    frame = 0;
    const rect = prose.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (innerHeight - rect.top) / Math.max(innerHeight, prose.offsetHeight)));
    progress.style.setProperty('--read-progress', String(ratio)); status.textContent = `${Math.round(ratio * 100)}% read`;
    let selected = 0;
    headings.forEach((heading, index) => { if (heading && heading.getBoundingClientRect().top < 220) selected = index; });
    links.forEach((link, index) => { if (index === selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', queue, { passive: true }); window.addEventListener('resize', queue, { passive: true });
  new ResizeObserver(queue).observe(prose); update();

  const dialog = make('dialog', 'review-photo-dialog'); dialog.setAttribute('aria-label', 'Review photo, full size');
  const image = make('img', ''); const close = make('button', '', 'Close ×'); close.type = 'button'; dialog.append(close); document.body.append(dialog);
  let opener;
  article.querySelectorAll('.review-photo').forEach(figure => {
    const source = figure.querySelector('img');
    const button = make('button', 'review-image-expand', '↗ View photo'); button.type = 'button'; button.setAttribute('aria-label', `View full photo: ${source.alt}`);
    button.addEventListener('click', () => {
      opener = button;
      image.src = source.currentSrc || source.src; image.alt = source.alt; dialog.append(image);
      dialog.showModal(); document.body.classList.add('review-photo-open'); close.focus();
      const full = new Image(); full.src = source.dataset.fullSrc || source.src;
      full.decode().then(() => { if (dialog.open && opener === button) image.src = full.src; }).catch(() => {});
    });
    figure.append(button);
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('review-photo-open'); opener?.focus({ preventScroll: true }); });
})();
