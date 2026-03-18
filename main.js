document.addEventListener('DOMContentLoaded', async function() {
    await initApp();
});

async function initApp() {
    // 1. Load Header/Footer
    const loadComponents = async () => {
        try {
            const headerRes = await fetch('header.html');
            if(headerRes.ok) document.getElementById('header-placeholder').innerHTML = await headerRes.text();
            
            const footerRes = await fetch('footer.html');
            if(footerRes.ok) document.getElementById('footer-placeholder').innerHTML = await footerRes.text();
            
            initializeUI();
        } catch (e) { console.error("Error loading components", e); }
    };
    await loadComponents();

    // 2. Initialize Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 800, 
            once: true, 
            offset: 40,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        });
    }

    // 3. Initialize 3D Background
    // if(document.getElementById('hero-canvas-container')) initThreeJS();
    
    // 4. Resource Filter
    initResourceFilter();
}

function initializeUI() {
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if(btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    // Discord Copy
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-copy]');
        if(btn) {
            navigator.clipboard.writeText(btn.getAttribute('data-copy'));
            const tooltip = btn.querySelector('.tooltip');
            if(tooltip) {
                tooltip.classList.remove('opacity-0');
                setTimeout(() => tooltip.classList.add('opacity-0'), 2000);
            }
        }
    });
}

function initResourceFilter() {
    const container = document.getElementById('filter-container');
    if(!container) return;

    // Use the new class name
    const buttons = container.querySelectorAll('.resource-filter-btn');
    const items = document.querySelectorAll('.resource-item');

    console.log(`Found ${buttons.length} filter buttons and ${items.length} resource items.`);

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default button behavior
            
            // Toggle active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            console.log(`Filtering by: ${filter}`);

            items.forEach(item => {
                const category = item.getAttribute('data-category');
                if(filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    // Small delay to allow display:block to apply before animating
                    setTimeout(() => item.classList.add('aos-animate'), 10);
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('aos-animate');
                }
            });
            
            // Refresh AOS layout if needed
            if(typeof AOS !== 'undefined') setTimeout(() => AOS.refresh(), 100);
        });
    });
}
