(() => {
    const sections = ['workstation', 'peripherals', 'audio', 'ecosystem'].map(id => document.getElementById(id)).filter(Boolean);
    if (sections.length !== 4) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const make = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text) el.textContent = text; return el; };
    const labels = ['Workstation', 'Peripherals', 'Audio', 'Desk & lab'];
    const originalPhoto = { src: 'images/setup/section1.webp', alt: 'The Battlestation' };
    // Keep the clipboard tied to the static inventory, before adding navigation and visual labels.
    sections.forEach(section => {
        const sceneCaption = section.querySelector('.rig-visual')?.innerText || '';
        section.dataset.originalSpecs = section.innerText.replace(sceneCaption, '').trim();
    });
    const mainHeader = document.querySelector('#main-content > div > header');

    // The photo is a map into the existing inventory, not a second set of gear data.
    const explorer = make('section', 'desk-explorer'); explorer.id = 'desk-explorer';
    explorer.setAttribute('aria-labelledby', 'desk-explorer-title');
    explorer.innerHTML = '<div class="explorer-heading"><div><span class="eyebrow">Explore the setup</span><h2 id="desk-explorer-title">A closer look.</h2></div><p>Select a point to browse the current gear.</p></div><div class="explorer-grid"><div class="desk-map"><img class="desk-map-image" src="images/optimized/desk-full-1600.webp" width="1600" height="1200" alt="Desk photo with monitors, speakers, keyboard, mouse, and headphones" loading="eager" decoding="async"><div class="desk-map-grid" aria-hidden="true"></div><span class="map-corner map-corner-top" aria-hidden="true"></span><span class="map-corner map-corner-bottom" aria-hidden="true"></span><button type="button" class="photo-expand" aria-label="Open full desk photo">↗ Full photo</button></div><div class="desk-inspector"><span class="eyebrow">Current inventory</span><div class="inspector-content" aria-live="polite" aria-atomic="true"></div><div class="inspector-tabs" role="group" aria-label="Select gear category"></div></div></div>';
    mainHeader.after(explorer);
    const audioLists = [...sections[2].querySelectorAll('ul')];
    const inventory = list => list ? [...list.querySelectorAll('li')].map(item => ({ name: item.querySelector('[data-gear-name]')?.textContent.trim() || item.textContent.trim(), role: item.querySelector('[data-gear-role]')?.textContent.trim() || '' })) : [];
    const monitoring = inventory(audioLists[0]);
    const keyboards = [...sections[1].querySelectorAll('[data-keyboard-name]')].map(heading => ({ name: heading.textContent.trim(), role: 'Keyboard' }));
    const mice = [...sections[1].querySelectorAll('.mouse-inventory [data-gear-name]')].map(node => ({ name: node.textContent.trim(), role: 'Mouse' }));
    const nodes = [
        { title: 'Speakers', section: 'audio', x: 76, y: 37, items: monitoring.filter(item => !item.name.startsWith('Sennheiser')) },
        { title: 'Headphones', section: 'audio', x: 30, y: 64, items: monitoring.filter(item => item.name.startsWith('Sennheiser')) },
        { title: 'Keyboards', section: 'peripherals', x: 41, y: 73, items: keyboards },
        { title: 'Mice', section: 'peripherals', x: 58, y: 79, items: mice },
    ];
    const map = explorer.querySelector('.desk-map');
    const panel = explorer.querySelector('.inspector-content');
    const controls = explorer.querySelector('.inspector-tabs');
    const points = [], tabs = [];
    const select = index => {
        const node = nodes[index];
        points.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
        tabs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
        panel.replaceChildren(make('span', 'inspector-number', `0${index + 1} / 04`), make('h3', '', node.title));
        const list = make('ul', 'inspector-list');
        node.items.forEach(item => { const li = make('li'); li.append(make('strong', '', item.name), make('span', '', item.role)); list.append(li); });
        panel.append(list);
        const link = make('a', 'inspector-link', 'View full specifications ↗'); link.href = `#${node.section}`; panel.append(link);
        map.style.setProperty('--spot-x', `${node.x}%`); map.style.setProperty('--spot-y', `${node.y}%`);
        map.dataset.selection = String(index);
    };
    nodes.forEach((node, index) => {
        const point = make('button', 'desk-hotspot', String(index + 1)); point.type = 'button';
        point.setAttribute('aria-label', `Explore ${node.title.toLowerCase()}`);
        point.style.left = `${node.x}%`; point.style.top = `${node.y}%`;
        point.setAttribute('aria-controls', 'desk-inspector-content');
        const tab = make('button', 'inspector-tab', node.title); tab.type = 'button';
        point.addEventListener('click', () => select(index)); tab.addEventListener('click', () => select(index));
        map.append(point); controls.append(tab); points.push(point); tabs.push(tab);
    });
    panel.id = 'desk-inspector-content'; select(0);

    const photoDialog = make('dialog', 'photo-dialog'); photoDialog.setAttribute('aria-label', 'Full desk photo');
    const photo = make('img'); photo.src = originalPhoto.src; photo.alt = originalPhoto.alt;
    const closePhoto = make('button', 'photo-close', 'Close ×'); closePhoto.type = 'button';
    photoDialog.append(closePhoto, photo); document.body.append(photoDialog);
    let photoOpener;
    explorer.querySelector('.photo-expand').addEventListener('click', event => { photoOpener = event.currentTarget; photoDialog.showModal(); document.body.classList.add('photo-open'); closePhoto.focus(); });
    closePhoto.addEventListener('click', () => photoDialog.close());
    photoDialog.addEventListener('click', event => { if (event.target === photoDialog) photoDialog.close(); });
    photoDialog.addEventListener('close', () => { document.body.classList.remove('photo-open'); photoOpener?.focus({ preventScroll: true }); });

    // Focus a section without losing any inventory; All restores the complete page.
    const browser = make('nav', 'setup-browser'); browser.setAttribute('aria-label', 'Browse setup sections');
    const group = make('div', 'setup-browser-buttons'); const count = make('span', 'setup-browser-count', '04 sections');
    count.setAttribute('aria-live', 'polite');
    const filterButtons = [];
    ['All sections', ...labels].forEach((label, index) => {
        const button = make('button', 'setup-section-filter', label); button.type = 'button'; button.dataset.section = index ? sections[index - 1].id : 'all';
        button.setAttribute('aria-pressed', String(index === 0));
        button.addEventListener('click', () => {
            filterButtons.forEach((other, i) => other.setAttribute('aria-pressed', String(i === index)));
            sections.forEach((section, i) => { section.hidden = index !== 0 && i !== index - 1; });
            count.textContent = index === 0 ? '04 sections' : `0${index} / 04`;
            const target = index === 0 ? browser : sections[index - 1];
            target.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
        });
        group.append(button); filterButtons.push(button);
    });
    browser.append(group, count); explorer.after(browser);
    document.body.classList.add('setup-enhanced');
    // Internal links always reveal their destination, even while a filter is active.
    document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        const section = sections.find(item => `#${item.id}` === link?.getAttribute('href'));
        if (section) { sections.forEach(item => item.hidden = false); filterButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === 0))); count.textContent = '04 sections'; }
    });

    // An overview of the actual audio categories, with a visual path into each list.
    const overview = make('div', 'audio-overview'); overview.setAttribute('aria-label', 'Audio equipment categories');
    audioLists.forEach((list, index) => {
        const card = list.parentElement; const title = card.querySelector('[data-audio-title]')?.textContent.trim() || 'Audio';
        const button = make('button', 'audio-node'); button.type = 'button';
        button.append(make('span', 'audio-node-index', `0${index + 1}`), make('strong', '', title), make('span', 'audio-node-count', `${list.children.length} items`));
        button.addEventListener('click', () => {
            card.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'center' });
            card.classList.add('gear-highlight'); setTimeout(() => card.classList.remove('gear-highlight'), 1800);
        });
        overview.append(button);
    });
    sections[2].querySelector('h2').after(overview);
    sections.forEach((section, index) => {
        section.classList.add('inventory-section');
        const heading = section.querySelector('h2');
        const number = make('span', 'inventory-number', `0${index + 1}`); number.setAttribute('aria-hidden', 'true'); heading.prepend(number);
    });
})();
