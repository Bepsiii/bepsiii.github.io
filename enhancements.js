(() => {
    'use strict';
    const create = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    };
    const pages = [
        ['Home', '/', 'Resources, gear and reviews'],
        ['About Bepsi', '/about.html', 'Background, interests and community'],
        ['Resource library', '/resources1.html', 'Spreadsheets, keyboards, mice, audio and monitors'],
        ['Hardware reviews', '/reviews.html', 'Hands-on audio, mini PC and mouse reviews'],
        ['My setup', '/setup.html', 'Workstation, peripherals, headphones, audio and home lab'],
        ['Articles and notes', '/articles.html', 'Writing and project notes'],
        ['GEEKOM A5 Pro', '/geekoma5pro-review.html', 'Mini PC benchmarks, thermals and home server'],
        ['Moondrop Space Travel', '/spacetravel-review.html', 'Wireless earbuds and budget audio'],
        ['7Hz Sonus', '/7hzsonus-review.html', 'Hybrid in-ear monitor audio review'],
        ['Beanmouse', '/beanmouse-review.html', 'Fingertip mouse mod for Viper V2 Pro'],
        ['Contact', '/contact.html', 'Collaborations, gear questions and feedback'],
        ['AscentCustoms', '/ascentcustoms.html', 'Earlier project: 3D printed mice and coatings'],
    ];
    const dialog = create('dialog', 'command-dialog');
    dialog.setAttribute('aria-labelledby', 'search-title');
    dialog.innerHTML = '<div class="command-top"><h2 id="search-title">Search the site</h2><button type="button" class="icon-button" data-close-search aria-label="Close search">×</button></div><label class="sr-only" for="global-search">Search the site</label><input id="global-search" type="search" placeholder="Search resources, reviews, or gear…" autocomplete="off"><p class="command-count" role="status" aria-live="polite"></p><div class="command-results"></div><div class="command-bottom">↑ ↓ to navigate · Enter to open · Esc to close</div>';
    document.body.appendChild(dialog);
    const input = dialog.querySelector('input');
    const results = dialog.querySelector('.command-results');
    let opener;
    let selected = 0;
    let gearRequest;
    let gearLoading = false;
    // Read the current inventory rather than maintaining a second set of specs.
    const loadGear = () => {
        if (gearRequest) return gearRequest;
        gearLoading = true;
        gearRequest = (async () => {
            const local = document.querySelector('.setup-inventory');
            let source = document;
            if (!local) {
                const response = await fetch('setup.html');
                if (!response.ok) throw new Error('Inventory unavailable');
                source = new DOMParser().parseFromString(await response.text(), 'text/html');
            }
            const text = node => node?.textContent.replace(/\s+/g, ' ').trim() || '';
            const names = selector => [...source.querySelectorAll(selector)].map(text).join(', ');
            const specs = node => [...node.querySelectorAll('dl > div')].map(row => [...row.children].map(text).join(': ')).join(' · ');
            const workstation = source.querySelector('#workstation .component-board');
            if (workstation) pages.push(['Workstation specifications', '/setup.html#workstation', specs(workstation)]);
            pages.push(['Keyboards', '/setup.html#peripherals', names('[data-keyboard-name]')]);
            const mice = source.querySelector('.mouse-inventory')?.closest('.gear-panel');
            if (mice) pages.push(['Mice & mousepads', '/setup.html#peripherals', `${names('.mouse-inventory [data-gear-name]')} · ${specs(mice)}`]);
            source.querySelectorAll('.audio-category').forEach(card => {
                pages.push([text(card.querySelector('[data-audio-title]')), `/setup.html#${card.id}`, [...card.querySelectorAll('[data-gear-name]')].map(text).join(', ')]);
            });
            source.querySelectorAll('.server-card').forEach(card => {
                pages.push([`${text(card.querySelector('h4'))} home server`, '/setup.html#home-lab', specs(card)]);
            });
        })().catch(() => {}).finally(() => { gearLoading = false; if (dialog.open) render(); });
        return gearRequest;
    };
    const updateSelection = () => {
        const links = [...results.querySelectorAll('a')];
        links.forEach((link, i) => link.classList.toggle('is-selected', i === selected));
        input.setAttribute('aria-describedby', links[selected]?.id || 'search-title');
        links[selected]?.scrollIntoView({ block: 'nearest' });
    };
    const render = () => {
        const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        results.replaceChildren();
        const matches = pages.filter(page => terms.every(term => page.join(' ').toLowerCase().includes(term)));
        dialog.querySelector('.command-count').textContent = `${matches.length} ${matches.length === 1 ? 'page' : 'pages'} found`;
        matches.forEach(([title, href, description], i) => {
            const link = create('a', 'command-result');
            link.href = href;
            link.id = `search-result-${i}`;
            link.append(create('strong', '', title), create('span', '', description), create('b', '', '↗'));
            results.appendChild(link);
        });
        if (!matches.length) results.append(create('p', 'empty-message', gearLoading ? 'Loading setup gear…' : 'No matches. Try a shorter search, like “audio” or “mouse”.'));
        selected = 0;
        updateSelection();
    };
    const open = () => {
        if (dialog.open) return;
        opener = document.activeElement;
        document.getElementById('mobile-menu-button')?.getAttribute('aria-expanded') === 'true' && document.getElementById('mobile-menu-button').click();
        input.value = '';
        dialog.showModal();
        document.body.classList.add('search-open');
        loadGear();
        render();
        input.focus();
    };
    document.addEventListener('click', event => {
        if (event.target.closest('[data-site-search]')) open();
        if (event.target.closest('[data-close-search]')) dialog.close();
    });
    dialog.addEventListener('click', event => { if (event.target === dialog && !event.target.closest('.command-top')) {
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    } });
    dialog.addEventListener('close', () => {
        document.body.classList.remove('search-open');
        opener?.focus({ preventScroll: true });
    });
    input.addEventListener('input', render);
    input.addEventListener('keydown', event => {
        const links = [...results.querySelectorAll('a')];
        if (!links.length) return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            selected = (selected + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
            updateSelection();
        } else if (event.key === 'Enter') { event.preventDefault(); links[selected].click(); }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && dialog.open) { event.preventDefault(); dialog.close(); return; }
        const typing = event.target.matches('input, textarea, select, [contenteditable="true"]');
        if ((event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !typing)) {
            event.preventDefault(); open();
        }
    });

    // Review filters preserve their state in a shareable URL.
    const listing = document.querySelector('[data-review-card]')?.parentElement;
    if (listing) {
        const oldFilter = document.querySelector('[data-review-filter]')?.parentElement;
        if (oldFilter) oldFilter.hidden = true;
        const cards = [...listing.querySelectorAll('[data-review-card]')];
        const toolbar = create('div', 'browse-toolbar');
        toolbar.innerHTML = '<div><label for="review-search">Find a review</label><input id="review-search" type="search" placeholder="Search a product or topic…"></div><div><label for="review-category">Category</label><select id="review-category"><option value="all">All categories</option><option value="audio">Audio</option><option value="pc">Mini PCs</option><option value="mouse">Mouse mods</option></select></div><button class="button button-secondary" type="button" data-reset-reviews>Reset</button><p role="status" aria-live="polite" class="browse-count"></p>';
        listing.before(toolbar);
        const query = toolbar.querySelector('input');
        const category = toolbar.querySelector('select');
        const empty = create('p', 'empty-message', 'No matching reviews. Clear your search or choose another category.');
        listing.after(empty);
        const apply = () => {
            const terms = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
            let count = 0;
            cards.forEach(card => {
                const type = card.href.includes('geekom') ? 'pc' : card.href.includes('beanmouse') ? 'mouse' : 'audio';
                card.hidden = !(category.value === 'all' || category.value === type) || !terms.every(term => card.textContent.toLowerCase().includes(term));
                if (!card.hidden) { count++; card.classList.add('is-visible'); card.classList.remove('hidden'); }
            });
            empty.hidden = count > 0;
            toolbar.querySelector('.browse-count').textContent = `${count} of ${cards.length} reviews`;
        };
        const readURL = () => {
            const params = new URLSearchParams(location.search);
            query.value = params.get('q') || '';
            category.value = ['all', 'audio', 'pc', 'mouse'].includes(params.get('category')) ? params.get('category') : 'all';
            apply();
        };
        const update = () => {
            const url = new URL(location.href);
            query.value.trim() ? url.searchParams.set('q', query.value.trim()) : url.searchParams.delete('q');
            category.value !== 'all' ? url.searchParams.set('category', category.value) : url.searchParams.delete('category');
            history.replaceState(null, '', url);
            apply();
        };
        query.addEventListener('input', update);
        category.addEventListener('change', update);
        toolbar.querySelector('button').addEventListener('click', () => { query.value = ''; category.value = 'all'; update(); query.focus(); });
        window.addEventListener('popstate', readURL);
        readURL();
    }

    // Save resource cards locally; this works even when persistence is unavailable.
    const resourceItems = [...document.querySelectorAll('.resource-item')];
    if (resourceItems.length) {
        let saved = new Set();
        try { const value = JSON.parse(localStorage.getItem('bepsi-saved-resources') || '[]'); if (Array.isArray(value)) saved = new Set(value.filter(item => typeof item === 'string')); } catch {}
        const status = create('p', 'saved-summary');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        document.querySelector('#filter-container, #dashboard-filter-container')?.before(status);
        const buttons = [];
        const sync = () => {
            buttons.forEach(({ button, key, item }) => { item.dataset.resourceSaved = String(saved.has(key)); button.setAttribute('aria-pressed', String(saved.has(key))); button.textContent = saved.has(key) ? '★ Saved' : '☆ Save resource'; });
            status.textContent = `${buttons.filter(item => saved.has(item.key)).length} resources saved on this device`;
            document.dispatchEvent(new Event('resource-saved-change'));
        };
        resourceItems.forEach(item => {
            const title = item.querySelector('h3, h2')?.textContent.trim();
            const key = item.querySelector('a[href]')?.href;
            if (!key || !title) return;
            const button = create('button', 'save-resource');
            button.type = 'button';
            button.setAttribute('aria-label', `Save resource: ${title}`);
            buttons.push({ button, key, item });
            (item.querySelector('.float-content') || item).append(button);
            button.addEventListener('click', () => {
                saved.has(key) ? saved.delete(key) : saved.add(key);
                try { localStorage.setItem('bepsi-saved-resources', JSON.stringify([...saved])); } catch {}
                sync();
            });
        });
        const savedLabel = create('label', 'saved-filter');
        const savedOnly = create('input'); savedOnly.type = 'checkbox'; savedOnly.id = 'saved-resources-only';
        savedLabel.append(savedOnly, document.createTextNode(' Show saved resources only'));
        status.after(savedLabel);
        sync();
    }

    // A generated contents list uses each review's actual section headings.
    if (location.pathname.endsWith('-review.html')) {
        const main = document.querySelector('main');
        const headings = [...main.querySelectorAll('h2, h3')].filter(heading => !heading.closest('header') && heading.textContent.trim());
        const tools = create('div', 'reading-tools');
        const words = main.textContent.trim().split(/\s+/).length;
        tools.append(create('span', 'reading-time', `${Math.max(1, Math.ceil(words / 220))} min read`));
        const focus = create('button', 'icon-button', 'Focus reading');
        focus.type = 'button'; focus.setAttribute('aria-pressed', 'false');
        focus.addEventListener('click', () => { const enabled = document.body.classList.toggle('reading-focus'); focus.setAttribute('aria-pressed', String(enabled)); focus.textContent = enabled ? 'Exit focus reading' : 'Focus reading'; });
        tools.append(focus);
        if (headings.length > 1) {
            const details = create('details', 'article-contents');
            details.append(create('summary', '', 'On this page'));
            const nav = create('nav'); nav.setAttribute('aria-label', 'Review contents');
            headings.forEach((heading, i) => {
                heading.id ||= `review-section-${i + 1}`;
                const link = create('a', '', heading.textContent.trim());
                link.href = `#${heading.id}`; nav.append(link);
            });
            details.append(nav); tools.append(details);
        }
        (main.querySelector('h1')?.closest('section, header') || main.querySelector('h1'))?.after(tools);
    }
    const top = create('button', 'return-top', '↑');
    top.type = 'button'; top.setAttribute('aria-label', 'Back to top'); top.hidden = true;
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
    document.body.append(top);
    let scrollPending = false;
    window.addEventListener('scroll', () => {
        if (scrollPending) return;
        scrollPending = true;
        requestAnimationFrame(() => { top.hidden = window.scrollY < 600; scrollPending = false; });
    }, { passive: true });
})();
