document.addEventListener('DOMContentLoaded', async function() {
    await initApp();
});

async function initApp() {
    // 1. Load Header/Footer Dynamic Blocks
    const loadComponents = async () => {
        try {
            const headerRes = await fetch('header.html');
            if(headerRes.ok) document.getElementById('header-placeholder').innerHTML = await headerRes.text();
            
            const footerRes = await fetch('footer.html');
            if(footerRes.ok) document.getElementById('footer-placeholder').innerHTML = await footerRes.text();
            
            initializeUI();
            initNavbarScroll();
            initGlowCards();
            initFloatCards();
        } catch (e) { console.error("Error loading header/footer components", e); }
    };
    await loadComponents();

    // 2. Initialize AOS Reveal Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 900, 
            once: true, 
            offset: 40,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        });
    }
    
    // 3. Resource Filter Setup
    initResourceFilter();
}

function initializeUI() {
    // Mobile Menu Button click trigger
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if(btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    // Discord Copy to Clipboard utility
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

// 4. Scroll-Linked Floating Glass Navbar Trigger
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    const bgLayer = navbar.querySelector('.absolute.inset-0');
    
    const updateNavbar = () => {
        if (window.scrollY > 30) {
            navbar.classList.add('py-2');
            navbar.classList.remove('py-4');
            if (bgLayer) {
                bgLayer.style.opacity = '0.95';
                bgLayer.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
            }
        } else {
            navbar.classList.add('py-4');
            navbar.classList.remove('py-2');
            if (bgLayer) {
                bgLayer.style.opacity = '0.6';
                bgLayer.style.boxShadow = 'none';
            }
        }
    };
    
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();
}

// 5. Radial Border Glow Cursor-Tracking Spotlight
function initGlowCards() {
    // Collect both glow-card and soft-card targets (which will be upgraded to include glow)
    const cards = document.querySelectorAll('.glow-card, .soft-card');
    
    cards.forEach(card => {
        // Enforce the glow class
        card.classList.add('glow-card');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// 6. Highly-Optimized Vanilla JS Glass Float & Parallax Shadow Casting Engine
function initFloatCards() {
    // Verify touch devices override to maintain scroll agility
    if (window.matchMedia("(hover: none)").matches) return;
    
    const cards = document.querySelectorAll('.float-card, .soft-card');
    
    cards.forEach(card => {
        // Enforce the float-card class
        card.classList.add('float-card');
        
        let content = card.querySelector('.float-content');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate offsets from the center of the card (-1 to +1 range)
            const offsetX = (x - centerX) / centerX;
            const offsetY = (y - centerY) / centerY;
            
            // 1. Dynamic Drop-Shadow offset (casts shadow in the OPPOSITE direction of cursor)
            // If mouse is on right, shadow moves left. Max shadow offset of 15px.
            const shadowX = -offsetX * 15;
            const shadowY = 25 - (offsetY * 10); // Standard base shadow is 25px down, fluctuates by 10px
            
            card.style.setProperty('--shadow-x', `${shadowX}px`);
            card.style.setProperty('--shadow-y', `${shadowY}px`);
            
            // 2. Parallax content float (inner content floats SLIGHTLY in direction of cursor)
            // Max parallax translation of 5px.
            if (content) {
                const parallaxX = offsetX * 5;
                const parallaxY = offsetY * 5;
                content.style.setProperty('--parallax-x', `${parallaxX}px`);
                content.style.setProperty('--parallax-y', `${parallaxY}px`);
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Smoothly reset shadow offset and parallax translation properties
            card.style.removeProperty('--shadow-x');
            card.style.removeProperty('--shadow-y');
            if (content) {
                content.style.removeProperty('--parallax-x');
                content.style.removeProperty('--parallax-y');
            }
        });
    });
}

// 7. Resource Category Filters
function initResourceFilter() {
    const container = document.getElementById('filter-container');
    if(!container) return;

    const buttons = container.querySelectorAll('.resource-filter-btn');
    const items = document.querySelectorAll('.resource-item');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');

            items.forEach(item => {
                const category = item.getAttribute('data-category');
                if(filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    setTimeout(() => item.classList.add('aos-animate'), 10);
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('aos-animate');
                }
            });
            
            if(typeof AOS !== 'undefined') setTimeout(() => AOS.refresh(), 100);
        });
    });
}

