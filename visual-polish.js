(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const cards = [...document.querySelectorAll('.home-page .work-card, .home-page .review-preview, .home-page .hub-card, .hero-showcase')];
    cards.forEach(card => {
        let frame = 0, x = 0, y = 0;
        card.addEventListener('pointermove', event => {
            if (reduced.matches || !fine.matches || event.pointerType === 'touch') return;
            const rect = card.getBoundingClientRect();
            x = (event.clientX - rect.left) / rect.width; y = (event.clientY - rect.top) / rect.height;
            if (!frame) frame = requestAnimationFrame(() => {
                frame = 0;
                card.style.setProperty('--card-x', `${x * 100}%`); card.style.setProperty('--card-y', `${y * 100}%`);
                card.style.setProperty('--tilt-x', `${(0.5 - y) * 3}deg`); card.style.setProperty('--tilt-y', `${(x - 0.5) * 3}deg`);
            });
        }, { passive: true });
        card.addEventListener('pointerleave', () => {
            cancelAnimationFrame(frame); frame = 0;
            ['--card-x', '--card-y', '--tilt-x', '--tilt-y'].forEach(property => card.style.removeProperty(property));
        });
    });
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
        }), { threshold: 0.05 });
        const reveal = [...document.querySelectorAll('.home-section .section-heading, .home-section .work-card, .home-section .review-preview, .home-section .hub-card, .setup-page main > div > div > section')];
        reveal.forEach((node, index) => { node.classList.add('polish-reveal'); node.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`); observer.observe(node); });
        const showAll = () => { if (reduced.matches) reveal.forEach(node => node.classList.add('is-revealed')); };
        reduced.addEventListener('change', showAll); showAll();
    }
})();
