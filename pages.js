(() => {
    'use strict';
    const init = () => {
        // Read the existing resource filter's output rather than adding a second engine.
        const grid = document.querySelector('.resource-grid');
        if (grid) {
            const items = [...grid.querySelectorAll('.resource-item')];
            const filters = document.getElementById('dashboard-filter-container');
            const count = document.getElementById('resource-result-count');
            const heading = document.getElementById('resource-results-heading');
            let pending = false;
            const sync = () => {
                pending = false;
                const visible = items.filter(item => !item.hidden && !item.classList.contains('hidden') && item.style.display !== 'none').length;
                count.textContent = `${visible} of ${items.length} resources`;
                const active = filters.querySelector('.active');
                heading.textContent = active?.querySelector('span')?.textContent || 'All resources';
                filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
            };
            const queue = () => {
                if (!pending) { pending = true; requestAnimationFrame(sync); }
            };
            const observer = new MutationObserver(queue);
            observer.observe(grid, { subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
            observer.observe(filters, { subtree: true, attributes: true, attributeFilter: ['class'] });
            sync();
        }

        const topics = document.querySelector('.contact-topics');
        if (topics) {
            topics.hidden = false;
            topics.addEventListener('click', event => {
                const topic = event.target.closest('[data-contact-topic]');
                if (!topic) return;
                const subject = document.getElementById('form-subject');
                subject.value = topic.dataset.contactTopic;
                subject.dispatchEvent(new Event('input', { bubbles: true }));
                subject.focus({ preventScroll: true });
            });
        }
        document.querySelectorAll('[data-copy-value]').forEach(button => {
            if (!navigator.clipboard?.writeText) return;
            button.hidden = false;
            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(button.dataset.copyValue);
                    button.textContent = 'Copied';
                    setTimeout(() => { button.textContent = 'Copy'; }, 1800);
                } catch {
                    const handle = button.parentElement.querySelector('.contact-handle');
                    if (handle) {
                        const range = document.createRange();
                        range.selectNodeContents(handle);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                        button.textContent = 'Text selected';
                    }
                }
            });
        });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();
