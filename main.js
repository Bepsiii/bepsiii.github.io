/**document.addEventListener('DOMContentLoaded', function () {

 * Optimized Main JavaScript    

 * Performance-focused with reduced reflows and efficient event handling    // --- Reusable Function to Load HTML Components ---

 */    const loadComponent = (selector, url) => {

        const element = document.querySelector(selector);

// Utility: Debounce function for performance        if (element) {

const debounce = (func, wait) => {            fetch(url)

    let timeout;                .then(response => {

    return function executedFunction(...args) {                    if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);

        const later = () => {                    return response.text();

            clearTimeout(timeout);                })

            func(...args);                .then(data => {

        };                    element.innerHTML = data;

        clearTimeout(timeout);                    // After loading, initialize any scripts that depend on the new content

        timeout = setTimeout(later, wait);                    initializeDynamicContent(); 

    };                })

};                .catch(error => console.error(`Error loading component: ${error}`));

        }

// Utility: RequestAnimationFrame throttle for scroll events    };

const throttleRAF = (func) => {

    let ticking = false;    // Load the header and footer into their placeholders

    return function(...args) {    loadComponent('header-placeholder', 'header.html');

        if (!ticking) {    loadComponent('footer-placeholder', 'footer.html');

            requestAnimationFrame(() => {

                func.apply(this, args);    // This function holds all scripts that need to run AFTER the header/footer are loaded

                ticking = false;    const initializeDynamicContent = () => {

            });        

            ticking = true;        // --- Mobile Menu Toggle ---

        }        const mobileMenuButton = document.getElementById('mobile-menu-button');

    };        const mobileMenu = document.getElementById('mobile-menu');

};        // Check if the button exists and hasn't already had a listener attached

        if (mobileMenuButton && !mobileMenuButton.dataset.listenerAttached) { 

// ==========================================            mobileMenuButton.addEventListener('click', () => {

// COMPONENT LOADING                mobileMenu.classList.toggle('hidden');

// ==========================================            });

const loadComponent = async (selector, url) => {            mobileMenuButton.dataset.listenerAttached = 'true'; // Mark as attached

    const element = document.querySelector(selector);        }

    if (!element) return;        

            // --- Discord Copy Logic ---

    try {        const discordID = 'theukgovernment';

        const response = await fetch(url);        // We select the tooltip here, assuming one tooltip is shared.

        if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);        const tooltip = document.getElementById('copy-tooltip'); 

        const data = await response.text();

        element.innerHTML = data;        const setupCopyButton = (buttonId) => {

        return true;            const button = document.getElementById(buttonId);

    } catch (error) {            // Check if the button exists and hasn't already had a listener attached

        console.error(`Error loading component: ${error}`);            if (button && !button.dataset.listenerAttached) {

        return false;                button.addEventListener('click', () => {

    }                    // Use the modern Navigator API for clipboard access

};                    navigator.clipboard.writeText(discordID).then(() => {

                        // Find the correct tooltip if there are multiple, or use a shared one.

// ==========================================                        // For simplicity, we'll assume the hero tooltip is the main one.

// MOBILE MENU                        if (tooltip) {

// ==========================================                            tooltip.classList.remove('hidden');

const initMobileMenu = () => {                            setTimeout(() => {

    const mobileMenuButton = document.getElementById('mobile-menu-button');                                tooltip.classList.add('hidden');

    const mobileMenu = document.getElementById('mobile-menu');                            }, 1500);

                            }

    if (!mobileMenuButton || !mobileMenu || mobileMenuButton.dataset.initialized) return;                    }).catch(err => console.error('Failed to copy text: ', err));

                    });

    mobileMenuButton.addEventListener('click', () => {                button.dataset.listenerAttached = 'true'; // Mark as attached

        mobileMenu.classList.toggle('hidden');            }

        const isExpanded = !mobileMenu.classList.contains('hidden');        };

        mobileMenuButton.setAttribute('aria-expanded', isExpanded);

    });        setupCopyButton('discord-copy');

            setupCopyButton('discord-copy-footer');

    // Close mobile menu when clicking outside    };

    document.addEventListener('click', (e) => {

        if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {    // --- Initialize AOS (Animate on Scroll) ---

            mobileMenu.classList.add('hidden');    // This can run immediately on page load as it doesn't depend on our components.

            mobileMenuButton.setAttribute('aria-expanded', 'false');    AOS.init({

        }        duration: 800,

    });        once: true,

            offset: 50,

    mobileMenuButton.dataset.initialized = 'true';    });

};

    // --- Parallax Effect ---

// ==========================================    // This also runs immediately as it attaches to the window scroll event.

// DISCORD COPY FUNCTIONALITY    window.addEventListener('scroll', () => {

// ==========================================        const scrollPosition = window.scrollY;

const initDiscordCopy = () => {        const heroText = document.getElementById('hero-text');

    const discordID = 'theukgovernment';        const heroCanvas = document.getElementById('hero-canvas');

    const buttons = ['discord-copy', 'discord-copy-footer'];        

            if (heroText) {

    buttons.forEach(buttonId => {            heroText.style.transform = `translateY(${scrollPosition * 0.3}px)`;

        const button = document.getElementById(buttonId);            heroText.style.opacity = 1 - scrollPosition / 400;

        if (!button || button.dataset.initialized) return;        }

                if (heroCanvas) {

        button.addEventListener('click', async () => {            heroCanvas.style.transform = `translateY(${scrollPosition * 0.5}px)`;

            try {        }

                await navigator.clipboard.writeText(discordID);    });

                

                // Show tooltip feedback    // --- Three.js 3D Background ---

                const tooltip = button.querySelector('span') || document.getElementById('copy-tooltip');    const heroCanvasContainer = document.getElementById('hero-canvas');

                if (tooltip) {    if (heroCanvasContainer) {

                    tooltip.classList.remove('hidden', 'opacity-0');        // All of your original Three.js code goes here.

                    tooltip.classList.add('opacity-100');        // It's self-contained and will only run if it finds the '#hero-canvas' element.

                            let scene, camera, renderer, shape, particles;

                    setTimeout(() => {        let isGyroActive = false;

                        tooltip.classList.remove('opacity-100');        let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

                        tooltip.classList.add('opacity-0');        const windowHalfX = window.innerWidth / 2;

                        setTimeout(() => tooltip.classList.add('hidden'), 200);        const windowHalfY = window.innerHeight / 2;

                    }, 1500);        const clock = new THREE.Clock();

                }

            } catch (err) {        function init() {

                console.error('Failed to copy text:', err);            scene = new THREE.Scene();

            }            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        });            camera.position.z = 5;

                    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        button.dataset.initialized = 'true';            renderer.setSize(window.innerWidth, window.innerHeight);

    });            renderer.setPixelRatio(window.devicePixelRatio);

};            heroCanvasContainer.appendChild(renderer.domElement);

            

// ==========================================            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

// PARALLAX EFFECTS (Optimized with RAF)            scene.add(ambientLight);

// ==========================================            const pointLight = new THREE.PointLight(0x0ea5e9, 4); 

const initParallax = () => {            pointLight.position.set(5, 5, 5);

    const heroText = document.getElementById('hero-text');            scene.add(pointLight);

    const heroCanvas = document.getElementById('hero-canvas');            const pointLight2 = new THREE.PointLight(0x8b5cf6, 4);

                pointLight2.position.set(-5, -5, 2);

    if (!heroText && !heroCanvas) return;            scene.add(pointLight2);

                

    const handleScroll = throttleRAF(() => {            const geometry = new THREE.IcosahedronGeometry(1.5, 1);

        const scrollPosition = window.scrollY;            const material = new THREE.MeshStandardMaterial({

                        color: 0xffffff,

        if (heroText) {                emissive: 0x444444,

            const translateY = scrollPosition * 0.3;                roughness: 0.1,

            const opacity = Math.max(0, 1 - scrollPosition / 400);                metalness: 0.95,

            heroText.style.transform = `translateY(${translateY}px)`;                wireframe: true,

            heroText.style.opacity = opacity;            });

        }            shape = new THREE.Mesh(geometry, material);

                    scene.add(shape);

        if (heroCanvas) {            

            heroCanvas.style.transform = `translateY(${scrollPosition * 0.5}px)`;            const particlesGeometry = new THREE.BufferGeometry;

        }            const particlesCount = 5000;

    });            const posArray = new Float32Array(particlesCount * 3);

                for(let i = 0; i < particlesCount * 3; i++) {

    window.addEventListener('scroll', handleScroll, { passive: true });                posArray[i] = (Math.random() - 0.5) * 15;

};            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// ==========================================            const particlesMaterial = new THREE.PointsMaterial({

// SCROLL HEADER EFFECT                size: 0.015,

// ==========================================                color: 0xffffff,

const initScrollHeader = () => {                transparent: true,

    const header = document.getElementById('header');                blending: THREE.AdditiveBlending

    if (!header) return;            });

                particles = new THREE.Points(particlesGeometry, particlesMaterial);

    const handleScroll = throttleRAF(() => {            scene.add(particles);

        if (window.scrollY > 50) {            

            header.classList.add('shadow-2xl');            window.addEventListener('resize', onWindowResize, false);

        } else {            document.addEventListener('mousemove', onMouseMove, false);

            header.classList.remove('shadow-2xl');        }

        }

    });        function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;

    window.addEventListener('scroll', handleScroll, { passive: true });            camera.updateProjectionMatrix();

};            renderer.setSize(window.innerWidth, window.innerHeight);

        }

// ==========================================

// INTERSECTION OBSERVER FOR ANIMATIONS        function onMouseMove(event) {

// ==========================================            if (!isGyroActive) {

const initIntersectionObserver = () => {                mouseX = (event.clientX - windowHalfX);

    const observerOptions = {                mouseY = (event.clientY - windowHalfY);

        threshold: 0.1,            }

        rootMargin: '0px 0px -50px 0px'        }

    };        

            function animate() {

    const observer = new IntersectionObserver((entries) => {            requestAnimationFrame(animate);

        entries.forEach(entry => {            targetX = mouseX * 0.002;

            if (entry.isIntersecting) {            targetY = mouseY * 0.002;

                entry.target.classList.add('animate-fade-in');            const elapsedTime = clock.getElapsedTime();

                observer.unobserve(entry.target);            

            }            if (shape) {

        });                shape.rotation.y += (targetX - shape.rotation.y) * 0.05 + 0.001;

    }, observerOptions);                shape.rotation.x += (targetY - shape.rotation.x) * 0.05 + 0.001;

                }

    // Observe elements with data-animate attribute            if(particles) {

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));                particles.rotation.y = elapsedTime * 0.1;

};            }

            renderer.render(scene, camera);

// ==========================================        }

// THREE.JS 3D BACKGROUND (Optimized)

// ==========================================        init();

const initThreeJS = () => {        animate();

    const heroCanvasContainer = document.getElementById('hero-canvas');    }

    if (!heroCanvasContainer || !window.THREE) return;});
    
    let scene, camera, renderer, shape, particles;
    let mouseX = 0, mouseY = 0;
    const clock = new THREE.Clock();
    
    // Initialize scene
    const init = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;
        
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
        heroCanvasContainer.appendChild(renderer.domElement);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x0ea5e9, 4);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x8b5cf6, 4);
        pointLight2.position.set(-5, -5, 2);
        scene.add(pointLight2);
        
        // Main shape
        const geometry = new THREE.IcosahedronGeometry(1.5, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x444444,
            roughness: 0.1,
            metalness: 0.95,
            wireframe: true
        });
        shape = new THREE.Mesh(geometry, material);
        scene.add(shape);
        
        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000; // Reduced for performance
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.015,
            color: 0xffffff,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);
        
        // Event listeners
        window.addEventListener('resize', debounce(onWindowResize, 250), false);
        document.addEventListener('mousemove', onMouseMove, { passive: true });
    };
    
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    const onMouseMove = (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.002;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.002;
    };
    
    const animate = () => {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        if (shape) {
            shape.rotation.y += (mouseX - shape.rotation.y) * 0.05 + 0.001;
            shape.rotation.x += (mouseY - shape.rotation.x) * 0.05 + 0.001;
        }
        
        if (particles) {
            particles.rotation.y = elapsedTime * 0.1;
        }
        
        renderer.render(scene, camera);
    };
    
    init();
    animate();
};

// ==========================================
// MODAL FUNCTIONALITY
// ==========================================
const initModal = () => {
    const modal = document.getElementById('issue-modal');
    const closeButton = document.getElementById('close-modal-button');
    
    if (!modal) return;
    
    // Show modal on first visit (check localStorage)
    if (!localStorage.getItem('modalSeen')) {
        setTimeout(() => {
            modal.classList.remove('hidden');
        }, 1000);
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.classList.add('hidden');
            localStorage.setItem('modalSeen', 'true');
        });
    }
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            localStorage.setItem('modalSeen', 'true');
        }
    });
};

// ==========================================
// INITIALIZE ALL FEATURES
// ==========================================
const initializeFeatures = () => {
    initMobileMenu();
    initDiscordCopy();
    initParallax();
    initScrollHeader();
    initIntersectionObserver();
    initModal();
    initThreeJS();
};

// ==========================================
// MAIN INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load components
    await Promise.all([
        loadComponent('#header-placeholder', 'header.html'),
        loadComponent('#footer-placeholder', 'footer.html')
    ]);
    
    // Initialize features after components load
    initializeFeatures();
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }
});

// Preconnect to external resources for faster loading
if (document.head) {
    const preconnect = (href) => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        document.head.appendChild(link);
    };
    
    preconnect('https://cdn.tailwindcss.com');
    preconnect('https://fonts.googleapis.com');
}
