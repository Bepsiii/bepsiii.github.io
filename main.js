(() => {
    'use strict';

    const siteRoot = new URL('.', document.currentScript?.src || document.baseURI);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const initializedMenus = new WeakSet();
    const initializedDropdowns = new WeakSet();
    const initializedCards = new WeakSet();
    const initializedFilters = new WeakSet();
    const initializedForms = new WeakSet();
    const initializedReveals = new WeakSet();
    const copyTimers = new WeakMap();
    const copying = new WeakSet();
    let navigationEventsReady = false;
    let copyEventsReady = false;
    let scrollEventsReady = false;
    let scrollFrame = 0;
    let revealObserver;
    let dropdownNumber = 0;
    let readingContent;

    const focusElement = (element) => {
        if (!element) return;
        try {
            element.focus({ preventScroll: true });
        } catch {
            element.focus();
        }
    };

    const setMenuOpen = (open, returnFocus = false) => {
        const button = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        if (!button || !menu) return;
        menu.hidden = !open;
        menu.classList.toggle('hidden', !open);
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
        document.getElementById('header')?.classList.toggle('menu-open', open);
        if (returnFocus) focusElement(button);
    };

    const setDropdownOpen = (dropdown, open, returnFocus = false) => {
        const button = dropdown.querySelector(':scope > button');
        const panel = dropdown.querySelector(':scope > .dropdown-content');
        if (!button || !panel) return;
        dropdown.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', String(open));
        panel.hidden = !open;
        if (returnFocus) focusElement(button);
    };

    const closeDropdowns = (except) => {
        document.querySelectorAll('.dropdown.is-open').forEach((dropdown) => {
            if (dropdown !== except) setDropdownOpen(dropdown, false);
        });
    };

    const initNavigation = () => {
        const button = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        if (button && menu && !initializedMenus.has(button)) {
            initializedMenus.add(button);
            button.setAttribute('aria-controls', menu.id);
            setMenuOpen(false);
            button.addEventListener('click', () => {
                const open = button.getAttribute('aria-expanded') !== 'true';
                closeDropdowns();
                setMenuOpen(open);
            });
            menu.addEventListener('click', (event) => {
                if (event.target instanceof Element && event.target.closest('a')) setMenuOpen(false);
            });
            menu.addEventListener('focusout', (event) => {
                if (event.relatedTarget && !menu.contains(event.relatedTarget) && event.relatedTarget !== button) {
                    setMenuOpen(false);
                }
            });
        }

        document.querySelectorAll('.dropdown').forEach((dropdown) => {
            if (initializedDropdowns.has(dropdown)) return;
            const toggle = dropdown.querySelector(':scope > button');
            const panel = dropdown.querySelector(':scope > .dropdown-content');
            if (!toggle || !panel) return;
            initializedDropdowns.add(dropdown);
            dropdown.dataset.dropdownReady = 'true';
            panel.id ||= `nav-dropdown-${++dropdownNumber}`;
            toggle.setAttribute('aria-controls', panel.id);
            setDropdownOpen(dropdown, false);
            toggle.addEventListener('click', () => {
                const open = toggle.getAttribute('aria-expanded') !== 'true';
                closeDropdowns(dropdown);
                setDropdownOpen(dropdown, open);
            });
            toggle.addEventListener('keydown', (event) => {
                if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
                event.preventDefault();
                closeDropdowns(dropdown);
                setDropdownOpen(dropdown, true);
                const links = panel.querySelectorAll('a[href]');
                focusElement(event.key === 'ArrowUp' ? links[links.length - 1] : links[0]);
            });
            dropdown.addEventListener('focusout', (event) => {
                if (event.relatedTarget && !dropdown.contains(event.relatedTarget)) {
                    setDropdownOpen(dropdown, false);
                }
            });
            panel.addEventListener('click', (event) => {
                if (event.target instanceof Element && event.target.closest('a')) setDropdownOpen(dropdown, false);
            });
        });

        if (!navigationEventsReady) {
            navigationEventsReady = true;
            document.addEventListener('click', (event) => {
                const target = event.target;
                const toggle = document.getElementById('mobile-menu-button');
                const mobileMenu = document.getElementById('mobile-menu');
                if (toggle && mobileMenu && !toggle.contains(target) && !mobileMenu.contains(target)) setMenuOpen(false);
                if (!(target instanceof Element) || !target.closest('.dropdown')) closeDropdowns();
            });
            document.addEventListener('keydown', (event) => {
                if (event.key !== 'Escape') return;
                const toggle = document.getElementById('mobile-menu-button');
                if (toggle?.getAttribute('aria-expanded') === 'true') {
                    event.preventDefault();
                    setMenuOpen(false, true);
                }
                const dropdown = document.querySelector('.dropdown.is-open');
                if (dropdown) {
                    event.preventDefault();
                    setDropdownOpen(dropdown, false, dropdown.contains(document.activeElement));
                }
            });
            window.addEventListener('resize', () => {
                const toggle = document.getElementById('mobile-menu-button');
                if (toggle && getComputedStyle(toggle).display === 'none') setMenuOpen(false);
                closeDropdowns();
            }, { passive: true });
        }

        const normalizePath = (path) => path.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
        const currentPath = normalizePath(window.location.pathname);
        document.querySelectorAll('#header a[href], .footer-links a[href]').forEach((link) => {
            const url = new URL(link.href, document.baseURI);
            if (url.origin === window.location.origin && normalizePath(url.pathname) === currentPath && !url.hash) {
                link.setAttribute('aria-current', 'page');
                link.closest('.dropdown')?.querySelector(':scope > button')?.classList.add('is-current');
            }
        });
    };

    const copyWithFallback = async (value) => {
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(value);
                return;
            } catch {
                // A browser may deny clipboard access; retain a selection-based fallback.
            }
        }
        const previousFocus = document.activeElement;
        const selection = window.getSelection();
        const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : [];
        const field = document.createElement('textarea');
        field.value = value;
        field.readOnly = true;
        field.setAttribute('aria-hidden', 'true');
        field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
        document.body.appendChild(field);
        try {
            field.select();
            if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
        } finally {
            field.remove();
            focusElement(previousFocus);
            if (selection && ranges.length) {
                selection.removeAllRanges();
                ranges.forEach((range) => selection.addRange(range));
            }
        }
    };

    const getClipboardStatus = () => {
        let status = document.getElementById('clipboard-status');
        if (!status) {
            status = document.createElement('p');
            status.id = 'clipboard-status';
            status.className = 'sr-only';
            status.setAttribute('role', 'status');
            status.setAttribute('aria-live', 'polite');
            status.setAttribute('aria-atomic', 'true');
            document.body.appendChild(status);
        }
        return status;
    };

    const showCopyFeedback = (button, message, succeeded) => {
        let tooltip = button.querySelector('.copy-tooltip, .footer-tooltip, #copy-tooltip, #copy-tooltip-contact, [data-copy-tooltip]');
        if (!tooltip) {
            tooltip = document.createElement('span');
            tooltip.className = 'copy-tooltip';
            button.appendChild(tooltip);
        }
        clearTimeout(copyTimers.get(button));
        tooltip.textContent = message;
        tooltip.hidden = false;
        tooltip.classList.remove('hidden', 'opacity-0');
        tooltip.classList.add('opacity-100');
        const status = getClipboardStatus();
        status.textContent = '';
        requestAnimationFrame(() => {
            status.textContent = succeeded ? 'Discord username copied.' : `Could not copy automatically. ${message}`;
        });
        copyTimers.set(button, setTimeout(() => {
            tooltip.hidden = true;
            tooltip.classList.add('hidden', 'opacity-0');
            tooltip.classList.remove('opacity-100');
        }, succeeded ? 2200 : 6000));
    };

    const initDiscordCopy = () => {
        if (copyEventsReady) return;
        copyEventsReady = true;
        getClipboardStatus();
        document.addEventListener('click', async (event) => {
            if (!(event.target instanceof Element)) return;
            const button = event.target.closest('#discord-copy, #discord-copy-footer, [data-copy-discord]');
            if (!button) return;
            event.preventDefault();
            if (copying.has(button)) return;
            copying.add(button);
            const username = button.dataset.copyDiscord || 'theukgovernment';
            try {
                await copyWithFallback(username);
                showCopyFeedback(button, 'Copied!', true);
            } catch {
                showCopyFeedback(button, `Discord: ${username}`, false);
            } finally {
                copying.delete(button);
            }
        });
    };

    const initHighlights = () => {
        document.querySelectorAll('.interactive-card').forEach((card) => {
            if (initializedCards.has(card)) return;
            initializedCards.add(card);
            let frame = 0;
            let pointerX = 0;
            let pointerY = 0;
            card.addEventListener('pointermove', (event) => {
                if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
                pointerX = event.clientX;
                pointerY = event.clientY;
                if (frame) return;
                frame = requestAnimationFrame(() => {
                    frame = 0;
                    if (reducedMotion.matches || !finePointer.matches) return;
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--x', `${pointerX - rect.left}px`);
                    card.style.setProperty('--y', `${pointerY - rect.top}px`);
                });
            }, { passive: true });
            card.addEventListener('pointerleave', () => {
                cancelAnimationFrame(frame);
                frame = 0;
                card.style.removeProperty('--x');
                card.style.removeProperty('--y');
            });
        });
    };

    const initReveals = () => {
        const canObserve = 'IntersectionObserver' in window && !reducedMotion.matches;
        if (canObserve && !revealObserver) {
            revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                });
            }, { threshold: 0.05, rootMargin: '0px 0px -24px 0px' });
        }
        document.querySelectorAll('[data-aos], [data-reveal]').forEach((element) => {
            if (initializedReveals.has(element)) return;
            initializedReveals.add(element);
            if (!canObserve || element.getBoundingClientRect().top < window.innerHeight) {
                element.classList.add('is-visible');
                return;
            }
            element.classList.add('js-reveal');
            revealObserver.observe(element);
        });
    };

    const initResources = () => {
        const filters = document.getElementById('filter-container');
        const items = Array.from(document.querySelectorAll('.resource-item'));
        if (!filters || !items.length || initializedFilters.has(filters)) return;
        initializedFilters.add(filters);
        const buttons = Array.from(filters.querySelectorAll('.filter-card'));
        const search = document.getElementById('resource-search');
        const grid = items[0].parentElement;
        const searchableItems = items.map((element) => ({
            element,
            text: `${element.dataset.category || ''} ${element.textContent}`.toLowerCase(),
        }));
        let activeFilter = filters.querySelector('.filter-card.active')?.dataset.filter || 'all';
        let count = document.getElementById('resource-count');
        if (!count) {
            count = document.createElement('p');
            count.id = 'resource-count';
            count.className = 'resource-count';
            filters.insertAdjacentElement('afterend', count);
        }
        count.setAttribute('role', 'status');
        count.setAttribute('aria-live', 'polite');
        count.setAttribute('aria-atomic', 'true');
        let empty = document.getElementById('resource-empty');
        if (!empty) {
            empty = document.createElement('p');
            empty.id = 'resource-empty';
            empty.className = 'resource-empty';
            empty.textContent = 'No resources match. Try another search or choose All.';
            grid.insertAdjacentElement('afterend', empty);
        }
        filters.setAttribute('role', 'group');
        filters.setAttribute('aria-label', 'Filter resources by category');
        if (grid.id) {
            buttons.forEach((button) => button.setAttribute('aria-controls', grid.id));
            search?.setAttribute('aria-controls', grid.id);
        }
        const update = () => {
            const terms = (search?.value || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
            buttons.forEach((button) => {
                const selected = button.dataset.filter === activeFilter;
                button.classList.toggle('active', selected);
                button.setAttribute('aria-pressed', String(selected));
            });
            let visible = 0;
            searchableItems.forEach(({ element, text }) => {
                const matchesCategory = activeFilter === 'all' || element.dataset.category === activeFilter;
                const matches = matchesCategory && terms.every((term) => text.includes(term));
                element.hidden = !matches;
                element.classList.toggle('hidden', !matches);
                if (matches) {
                    visible++;
                    element.classList.add('is-visible');
                    revealObserver?.unobserve(element);
                }
            });
            count.textContent = `${visible} of ${items.length} resources`;
            empty.hidden = visible > 0;
            empty.classList.toggle('hidden', visible > 0);
        };
        filters.addEventListener('click', (event) => {
            if (!(event.target instanceof Element)) return;
            const button = event.target.closest('.filter-card');
            if (!button || !filters.contains(button)) return;
            activeFilter = button.dataset.filter || 'all';
            update();
        });
        search?.addEventListener('input', update);
        search?.addEventListener('search', update);
        update();
    };

    const initContactForm = () => {
        const form = document.getElementById('contactForm');
        if (!form || initializedForms.has(form)) return;
        initializedForms.add(form);
        let status = document.getElementById('form-status');
        if (!status) {
            status = document.createElement('p');
            status.id = 'form-status';
            status.className = 'form-status';
            form.insertAdjacentElement('afterend', status);
        }
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.setAttribute('aria-atomic', 'true');
        const setStatus = (message, state) => {
            status.textContent = message;
            status.dataset.state = state;
            status.classList.toggle('is-error', state === 'error');
            status.classList.toggle('is-success', state === 'success');
        };
        let submitting = false;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (submitting) return;
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            submitting = true;
            const data = new FormData(form);
            const buttons = Array.from(form.querySelectorAll('button[type="submit"], input[type="submit"]'));
            const buttonStates = buttons.map((button) => ({ button, disabled: button.disabled }));
            const label = buttons[0]?.querySelector('span');
            const originalLabel = label?.textContent;
            buttonStates.forEach(({ button }) => { button.disabled = true; });
            if (label) label.textContent = 'Sending…';
            form.setAttribute('aria-busy', 'true');
            setStatus('Sending your message…', 'pending');
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 20000);
            try {
                const response = await fetch(form.action, {
                    method: form.method || 'POST',
                    body: data,
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                });
                if (response.ok) {
                    form.reset();
                    setStatus('Thanks! Your message has been sent.', 'success');
                } else {
                    const details = await response.json().catch(() => null);
                    const errors = Array.isArray(details?.errors)
                        ? details.errors.map((error) => error?.message).filter((message) => typeof message === 'string').slice(0, 3)
                        : [];
                    setStatus(errors.length ? errors.join(' ') : 'Your message could not be sent. Please try again, or use the email link.', 'error');
                }
            } catch {
                setStatus('We could not confirm delivery. Check your connection and try again, or use the email link.', 'error');
            } finally {
                clearTimeout(timeout);
                submitting = false;
                form.removeAttribute('aria-busy');
                buttonStates.forEach(({ button, disabled }) => { button.disabled = disabled; });
                if (label) label.textContent = originalLabel;
            }
        });
    };

    const updateScroll = () => {
        scrollFrame = 0;
        const header = document.getElementById('header');
        header?.classList.toggle('scrolled', window.scrollY > 48);
        const fill = document.querySelector('#reading-progress .reading-progress-fill');
        if (!fill || !readingContent) return;
        const rect = readingContent.getBoundingClientRect();
        const headerBottom = Math.max(0, header?.getBoundingClientRect().bottom || 0);
        const start = window.scrollY + rect.top - headerBottom;
        const distance = Math.max(1, rect.height - window.innerHeight + headerBottom);
        const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
        fill.style.transform = `scaleX(${progress})`;
    };

    const queueScrollUpdate = () => {
        if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
    };

    const initScrollFeatures = () => {
        if (!readingContent && document.querySelector('.review-content')) {
            readingContent = document.querySelector('#cards-wrapper') || document.getElementById('main-content');
            if (readingContent) {
                let progress = document.getElementById('reading-progress');
                if (!progress) {
                    progress = document.createElement('div');
                    progress.id = 'reading-progress';
                    progress.className = 'reading-progress';
                    progress.innerHTML = '<span class="reading-progress-fill"></span>';
                    document.body.appendChild(progress);
                }
                progress.setAttribute('aria-hidden', 'true');
            }
        }
        if (!scrollEventsReady) {
            scrollEventsReady = true;
            window.addEventListener('scroll', queueScrollUpdate, { passive: true });
            window.addEventListener('resize', queueScrollUpdate, { passive: true });
            document.addEventListener('load', queueScrollUpdate, true);
        }
        queueScrollUpdate();
    };

    const initializeFeatures = () => {
        initNavigation();
        initDiscordCopy();
        initHighlights();
        initReveals();
        initResources();
        initContactForm();
        initScrollFeatures();
    };

    const sharedFallback = (component) => {
        const url = (page) => new URL(page, siteRoot).href;
        if (component === 'header') {
            return `<header id="header"><nav class="nav-shell fallback-nav" aria-label="Main navigation"><a class="nav-logo" href="${url('index.html')}">Bepsi</a><a class="nav-link" href="${url('resources1.html')}">Resources</a><a class="nav-link" href="${url('contact.html')}">Contact</a></nav></header>`;
        }
        return `<footer class="footer-shell"><div class="footer-inner"><p>Bepsi · Tech, design &amp; community. <a href="${url('contact.html')}">Get in touch</a></p></div></footer>`;
    };

    const loadComponent = async (component) => {
        const placeholder = document.getElementById(`${component}-placeholder`);
        if (!placeholder || placeholder.dataset.loaded) return;
        if (!placeholder.children.length) placeholder.innerHTML = sharedFallback(component);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch(new URL(`${component}.html`, siteRoot), { signal: controller.signal });
            if (!response.ok) throw new Error(`Could not load ${component}`);
            const markup = await response.text();
            if (!markup.trim()) throw new Error(`Empty ${component}`);
            placeholder.innerHTML = markup;
            placeholder.dataset.loaded = 'true';
        } catch {
            // The fallback keeps navigation and contact access usable during network failures.
            placeholder.dataset.loaded = 'fallback';
        } finally {
            clearTimeout(timeout);
            initializeFeatures();
        }
    };

    const boot = () => {
        document.documentElement.classList.add('js-ready');
        initializeFeatures();
        window.siteReady = Promise.allSettled([loadComponent('header'), loadComponent('footer')]).then(() => {
            document.dispatchEvent(new CustomEvent('site:ready'));
        });
    };

    reducedMotion.addEventListener('change', () => {
        if (!reducedMotion.matches) return;
        revealObserver?.disconnect();
        document.querySelectorAll('.js-reveal').forEach((element) => element.classList.add('is-visible'));
        document.querySelectorAll('.interactive-card').forEach((card) => {
            card.style.removeProperty('--x');
            card.style.removeProperty('--y');
        });
    });
    window.initializeFeatures = initializeFeatures;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
})();
