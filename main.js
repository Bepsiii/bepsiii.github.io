/**/**document.addEventListener('DOMContentLoaded', function () {

 * Optimized Main JavaScript

 * Performance-focused with reduced reflows and efficient event handling * Optimized Main JavaScript    

 */

 * Performance-focused with reduced reflows and efficient event handling    // --- Reusable Function to Load HTML Components ---

// Utility: Debounce function for performance

const debounce = (func, wait) => { */    const loadComponent = (selector, url) => {

    let timeout;

    return function executedFunction(...args) {        const element = document.querySelector(selector);

        const later = () => {

            clearTimeout(timeout);// Utility: Debounce function for performance        if (element) {

            func(...args);

        };const debounce = (func, wait) => {            fetch(url)

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);    let timeout;                .then(response => {

    };

};    return function executedFunction(...args) {                    if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);



// Utility: RequestAnimationFrame throttle for scroll events        const later = () => {                    return response.text();

const throttleRAF = (func) => {

    let ticking = false;            clearTimeout(timeout);                })

    return function(...args) {

        if (!ticking) {            func(...args);                .then(data => {

            requestAnimationFrame(() => {

                func.apply(this, args);        };                    element.innerHTML = data;

                ticking = false;

            });        clearTimeout(timeout);                    // After loading, initialize any scripts that depend on the new content

            ticking = true;

        }        timeout = setTimeout(later, wait);                    initializeDynamicContent(); 

    };

};    };                })



// ==========================================};                .catch(error => console.error(`Error loading component: ${error}`));

// COMPONENT LOADING

// ==========================================        }

const loadComponent = async (selector, url) => {

    const element = document.querySelector(selector);// Utility: RequestAnimationFrame throttle for scroll events    };

    if (!element) return;

    const throttleRAF = (func) => {

    try {

        const response = await fetch(url);    let ticking = false;    // Load the header and footer into their placeholders

        if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);

        const data = await response.text();    return function(...args) {    loadComponent('header-placeholder', 'header.html');

        element.innerHTML = data;

        return true;        if (!ticking) {    loadComponent('footer-placeholder', 'footer.html');

    } catch (error) {

        console.error(`Error loading component: ${error}`);            requestAnimationFrame(() => {

        return false;

    }                func.apply(this, args);    // This function holds all scripts that need to run AFTER the header/footer are loaded

};

                ticking = false;    const initializeDynamicContent = () => {

// ==========================================

// MOBILE MENU            });        

// ==========================================

const initMobileMenu = () => {            ticking = true;        // --- Mobile Menu Toggle ---

    const mobileMenuButton = document.getElementById('mobile-menu-button');

    const mobileMenu = document.getElementById('mobile-menu');        }        const mobileMenuButton = document.getElementById('mobile-menu-button');

    

    if (!mobileMenuButton || !mobileMenu || mobileMenuButton.dataset.initialized) return;    };        const mobileMenu = document.getElementById('mobile-menu');

    

    mobileMenuButton.addEventListener('click', () => {};        // Check if the button exists and hasn't already had a listener attached

        mobileMenu.classList.toggle('hidden');

        const isExpanded = !mobileMenu.classList.contains('hidden');        if (mobileMenuButton && !mobileMenuButton.dataset.listenerAttached) { 

        mobileMenuButton.setAttribute('aria-expanded', isExpanded);

    });// ==========================================            mobileMenuButton.addEventListener('click', () => {

    

    // Close mobile menu when clicking outside// COMPONENT LOADING                mobileMenu.classList.toggle('hidden');

    document.addEventListener('click', (e) => {

        if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {// ==========================================            });

            mobileMenu.classList.add('hidden');

            mobileMenuButton.setAttribute('aria-expanded', 'false');const loadComponent = async (selector, url) => {            mobileMenuButton.dataset.listenerAttached = 'true'; // Mark as attached

        }

    });    const element = document.querySelector(selector);        }

    

    mobileMenuButton.dataset.initialized = 'true';    if (!element) return;        

};

            // --- Discord Copy Logic ---

// ==========================================

// DISCORD COPY FUNCTIONALITY    try {        const discordID = 'theukgovernment';

// ==========================================

const initDiscordCopy = () => {        const response = await fetch(url);        // We select the tooltip here, assuming one tooltip is shared.

    const discordID = 'theukgovernment';

    const buttons = ['discord-copy', 'discord-copy-footer'];        if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);        const tooltip = document.getElementById('copy-tooltip'); 

    

    buttons.forEach(buttonId => {        const data = await response.text();

        const button = document.getElementById(buttonId);

        if (!button || button.dataset.initialized) return;        element.innerHTML = data;        const setupCopyButton = (buttonId) => {

        

        button.addEventListener('click', async () => {        return true;            const button = document.getElementById(buttonId);

            try {

                await navigator.clipboard.writeText(discordID);    } catch (error) {            // Check if the button exists and hasn't already had a listener attached

                

                // Show tooltip feedback        console.error(`Error loading component: ${error}`);            if (button && !button.dataset.listenerAttached) {

                const tooltip = button.querySelector('span') || document.getElementById('copy-tooltip');

                if (tooltip) {        return false;                button.addEventListener('click', () => {

                    tooltip.classList.remove('hidden', 'opacity-0');

                    tooltip.classList.add('opacity-100');    }                    // Use the modern Navigator API for clipboard access

                    

                    setTimeout(() => {};                    navigator.clipboard.writeText(discordID).then(() => {

                        tooltip.classList.remove('opacity-100');

                        tooltip.classList.add('opacity-0');                        // Find the correct tooltip if there are multiple, or use a shared one.

                        setTimeout(() => tooltip.classList.add('hidden'), 200);

                    }, 1500);// ==========================================                        // For simplicity, we'll assume the hero tooltip is the main one.

                }

            } catch (err) {// MOBILE MENU                        if (tooltip) {

                console.error('Failed to copy text:', err);

            }// ==========================================                            tooltip.classList.remove('hidden');

        });

        const initMobileMenu = () => {                            setTimeout(() => {

        button.dataset.initialized = 'true';

    });    const mobileMenuButton = document.getElementById('mobile-menu-button');                                tooltip.classList.add('hidden');

};

    const mobileMenu = document.getElementById('mobile-menu');                            }, 1500);

// ==========================================

// PARALLAX EFFECTS (Optimized with RAF)                            }

// ==========================================

const initParallax = () => {    if (!mobileMenuButton || !mobileMenu || mobileMenuButton.dataset.initialized) return;                    }).catch(err => console.error('Failed to copy text: ', err));

    const heroText = document.getElementById('hero-text');

    const heroCanvas = document.getElementById('hero-canvas');                    });

    

    if (!heroText && !heroCanvas) return;    mobileMenuButton.addEventListener('click', () => {                button.dataset.listenerAttached = 'true'; // Mark as attached

    

    const handleScroll = throttleRAF(() => {        mobileMenu.classList.toggle('hidden');            }

        const scrollPosition = window.scrollY;

                const isExpanded = !mobileMenu.classList.contains('hidden');        };

        if (heroText) {

            const translateY = scrollPosition * 0.3;        mobileMenuButton.setAttribute('aria-expanded', isExpanded);

            const opacity = Math.max(0, 1 - scrollPosition / 400);

            heroText.style.transform = `translateY(${translateY}px)`;    });        setupCopyButton('discord-copy');

            heroText.style.opacity = opacity;

        }            setupCopyButton('discord-copy-footer');

        

        if (heroCanvas) {    // Close mobile menu when clicking outside    };

            heroCanvas.style.transform = `translateY(${scrollPosition * 0.5}px)`;

        }    document.addEventListener('click', (e) => {

    });

            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {    // --- Initialize AOS (Animate on Scroll) ---

    window.addEventListener('scroll', handleScroll, { passive: true });

};            mobileMenu.classList.add('hidden');    // This can run immediately on page load as it doesn't depend on our components.



// ==========================================            mobileMenuButton.setAttribute('aria-expanded', 'false');    AOS.init({

// SCROLL HEADER EFFECT

// ==========================================        }        duration: 800,

const initScrollHeader = () => {

    const header = document.getElementById('header');    });        once: true,

    if (!header) return;

                offset: 50,

    const handleScroll = throttleRAF(() => {

        if (window.scrollY > 50) {    mobileMenuButton.dataset.initialized = 'true';    });

            header.classList.add('shadow-2xl');

        } else {};

            header.classList.remove('shadow-2xl');

        }    // --- Parallax Effect ---

    });

    // ==========================================    // This also runs immediately as it attaches to the window scroll event.

    window.addEventListener('scroll', handleScroll, { passive: true });

};// DISCORD COPY FUNCTIONALITY    window.addEventListener('scroll', () => {



// ==========================================// ==========================================        const scrollPosition = window.scrollY;

// INTERSECTION OBSERVER FOR ANIMATIONS

// ==========================================const initDiscordCopy = () => {        const heroText = document.getElementById('hero-text');

const initIntersectionObserver = () => {

    const observerOptions = {    const discordID = 'theukgovernment';        const heroCanvas = document.getElementById('hero-canvas');

        threshold: 0.1,

        rootMargin: '0px 0px -50px 0px'    const buttons = ['discord-copy', 'discord-copy-footer'];        

    };

                if (heroText) {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {    buttons.forEach(buttonId => {            heroText.style.transform = `translateY(${scrollPosition * 0.3}px)`;

            if (entry.isIntersecting) {

                entry.target.classList.add('animate-fade-in');        const button = document.getElementById(buttonId);            heroText.style.opacity = 1 - scrollPosition / 400;

                observer.unobserve(entry.target);

            }        if (!button || button.dataset.initialized) return;        }

        });

    }, observerOptions);                if (heroCanvas) {

    

    // Observe elements with data-animate attribute        button.addEventListener('click', async () => {            heroCanvas.style.transform = `translateY(${scrollPosition * 0.5}px)`;

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

};            try {        }



// ==========================================                await navigator.clipboard.writeText(discordID);    });

// THREE.JS 3D BACKGROUND (Optimized)

// ==========================================                

const initThreeJS = () => {

    const heroCanvasContainer = document.getElementById('hero-canvas');                // Show tooltip feedback    // --- Three.js 3D Background ---

    if (!heroCanvasContainer || !window.THREE) return;

                    const tooltip = button.querySelector('span') || document.getElementById('copy-tooltip');    const heroCanvasContainer = document.getElementById('hero-canvas');

    let scene, camera, renderer, shape, particles;

    let mouseX = 0, mouseY = 0;                if (tooltip) {    if (heroCanvasContainer) {

    const clock = new THREE.Clock();

                        tooltip.classList.remove('hidden', 'opacity-0');        // All of your original Three.js code goes here.

    // Initialize scene

    const init = () => {                    tooltip.classList.add('opacity-100');        // It's self-contained and will only run if it finds the '#hero-canvas' element.

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(                            let scene, camera, renderer, shape, particles;

            75,

            window.innerWidth / window.innerHeight,                    setTimeout(() => {        let isGyroActive = false;

            0.1,

            1000                        tooltip.classList.remove('opacity-100');        let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

        );

        camera.position.z = 5;                        tooltip.classList.add('opacity-0');        const windowHalfX = window.innerWidth / 2;

        

        renderer = new THREE.WebGLRenderer({                        setTimeout(() => tooltip.classList.add('hidden'), 200);        const windowHalfY = window.innerHeight / 2;

            antialias: true,

            alpha: true,                    }, 1500);        const clock = new THREE.Clock();

            powerPreference: 'high-performance'

        });                }

        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance            } catch (err) {        function init() {

        heroCanvasContainer.appendChild(renderer.domElement);

                        console.error('Failed to copy text:', err);            scene = new THREE.Scene();

        // Lights

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);            }            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        scene.add(ambientLight);

                });            camera.position.z = 5;

        const pointLight1 = new THREE.PointLight(0x0ea5e9, 4);

        pointLight1.position.set(5, 5, 5);                    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        scene.add(pointLight1);

                button.dataset.initialized = 'true';            renderer.setSize(window.innerWidth, window.innerHeight);

        const pointLight2 = new THREE.PointLight(0x8b5cf6, 4);

        pointLight2.position.set(-5, -5, 2);    });            renderer.setPixelRatio(window.devicePixelRatio);

        scene.add(pointLight2);

        };            heroCanvasContainer.appendChild(renderer.domElement);

        // Main shape

        const geometry = new THREE.IcosahedronGeometry(1.5, 1);            

        const material = new THREE.MeshStandardMaterial({

            color: 0xffffff,// ==========================================            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);

            emissive: 0x444444,

            roughness: 0.1,// PARALLAX EFFECTS (Optimized with RAF)            scene.add(ambientLight);

            metalness: 0.95,

            wireframe: true// ==========================================            const pointLight = new THREE.PointLight(0x0ea5e9, 4); 

        });

        shape = new THREE.Mesh(geometry, material);const initParallax = () => {            pointLight.position.set(5, 5, 5);

        scene.add(shape);

            const heroText = document.getElementById('hero-text');            scene.add(pointLight);

        // Particles

        const particlesGeometry = new THREE.BufferGeometry();    const heroCanvas = document.getElementById('hero-canvas');            const pointLight2 = new THREE.PointLight(0x8b5cf6, 4);

        const particlesCount = 3000; // Reduced for performance

        const posArray = new Float32Array(particlesCount * 3);                pointLight2.position.set(-5, -5, 2);

        

        for (let i = 0; i < particlesCount * 3; i++) {    if (!heroText && !heroCanvas) return;            scene.add(pointLight2);

            posArray[i] = (Math.random() - 0.5) * 15;

        }                

        

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));    const handleScroll = throttleRAF(() => {            const geometry = new THREE.IcosahedronGeometry(1.5, 1);

        

        const particlesMaterial = new THREE.PointsMaterial({        const scrollPosition = window.scrollY;            const material = new THREE.MeshStandardMaterial({

            size: 0.015,

            color: 0xffffff,                        color: 0xffffff,

            transparent: true,

            blending: THREE.AdditiveBlending        if (heroText) {                emissive: 0x444444,

        });

                    const translateY = scrollPosition * 0.3;                roughness: 0.1,

        particles = new THREE.Points(particlesGeometry, particlesMaterial);

        scene.add(particles);            const opacity = Math.max(0, 1 - scrollPosition / 400);                metalness: 0.95,

        

        // Event listeners            heroText.style.transform = `translateY(${translateY}px)`;                wireframe: true,

        window.addEventListener('resize', debounce(onWindowResize, 250), false);

        document.addEventListener('mousemove', onMouseMove, { passive: true });            heroText.style.opacity = opacity;            });

    };

            }            shape = new THREE.Mesh(geometry, material);

    const onWindowResize = () => {

        camera.aspect = window.innerWidth / window.innerHeight;                    scene.add(shape);

        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);        if (heroCanvas) {            

    };

                heroCanvas.style.transform = `translateY(${scrollPosition * 0.5}px)`;            const particlesGeometry = new THREE.BufferGeometry;

    const onMouseMove = (event) => {

        mouseX = (event.clientX - window.innerWidth / 2) * 0.002;        }            const particlesCount = 5000;

        mouseY = (event.clientY - window.innerHeight / 2) * 0.002;

    };    });            const posArray = new Float32Array(particlesCount * 3);

    

    const animate = () => {                for(let i = 0; i < particlesCount * 3; i++) {

        requestAnimationFrame(animate);

            window.addEventListener('scroll', handleScroll, { passive: true });                posArray[i] = (Math.random() - 0.5) * 15;

        const elapsedTime = clock.getElapsedTime();

        };            }

        if (shape) {

            shape.rotation.y += (mouseX - shape.rotation.y) * 0.05 + 0.001;            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

            shape.rotation.x += (mouseY - shape.rotation.x) * 0.05 + 0.001;

        }// ==========================================            const particlesMaterial = new THREE.PointsMaterial({

        

        if (particles) {// SCROLL HEADER EFFECT                size: 0.015,

            particles.rotation.y = elapsedTime * 0.1;

        }// ==========================================                color: 0xffffff,

        

        renderer.render(scene, camera);const initScrollHeader = () => {                transparent: true,

    };

        const header = document.getElementById('header');                blending: THREE.AdditiveBlending

    init();

    animate();    if (!header) return;            });

};

                particles = new THREE.Points(particlesGeometry, particlesMaterial);

// ==========================================

// MODAL FUNCTIONALITY    const handleScroll = throttleRAF(() => {            scene.add(particles);

// ==========================================

const initModal = () => {        if (window.scrollY > 50) {            

    const modal = document.getElementById('issue-modal');

    const closeButton = document.getElementById('close-modal-button');            header.classList.add('shadow-2xl');            window.addEventListener('resize', onWindowResize, false);

    

    if (!modal) return;        } else {            document.addEventListener('mousemove', onMouseMove, false);

    

    // Show modal on first visit (check localStorage)            header.classList.remove('shadow-2xl');        }

    if (!localStorage.getItem('modalSeen')) {

        setTimeout(() => {        }

            modal.classList.remove('hidden');

        }, 1000);    });        function onWindowResize() {

    }

                    camera.aspect = window.innerWidth / window.innerHeight;

    if (closeButton) {

        closeButton.addEventListener('click', () => {    window.addEventListener('scroll', handleScroll, { passive: true });            camera.updateProjectionMatrix();

            modal.classList.add('hidden');

            localStorage.setItem('modalSeen', 'true');};            renderer.setSize(window.innerWidth, window.innerHeight);

        });

    }        }

    

    // Close on outside click// ==========================================

    modal.addEventListener('click', (e) => {

        if (e.target === modal) {// INTERSECTION OBSERVER FOR ANIMATIONS        function onMouseMove(event) {

            modal.classList.add('hidden');

            localStorage.setItem('modalSeen', 'true');// ==========================================            if (!isGyroActive) {

        }

    });const initIntersectionObserver = () => {                mouseX = (event.clientX - windowHalfX);

};

    const observerOptions = {                mouseY = (event.clientY - windowHalfY);

// ==========================================

// INITIALIZE ALL FEATURES        threshold: 0.1,            }

// ==========================================

const initializeFeatures = () => {        rootMargin: '0px 0px -50px 0px'        }

    initMobileMenu();

    initDiscordCopy();    };        

    initParallax();

    initScrollHeader();            function animate() {

    initIntersectionObserver();

    initModal();    const observer = new IntersectionObserver((entries) => {            requestAnimationFrame(animate);

    initThreeJS();

};        entries.forEach(entry => {            targetX = mouseX * 0.002;



// ==========================================            if (entry.isIntersecting) {            targetY = mouseY * 0.002;

// MAIN INITIALIZATION

// ==========================================                entry.target.classList.add('animate-fade-in');            const elapsedTime = clock.getElapsedTime();

document.addEventListener('DOMContentLoaded', async () => {

    // Load components                observer.unobserve(entry.target);            

    await Promise.all([

        loadComponent('#header-placeholder', 'header.html'),            }            if (shape) {

        loadComponent('#footer-placeholder', 'footer.html')

    ]);        });                shape.rotation.y += (targetX - shape.rotation.y) * 0.05 + 0.001;

    

    // Initialize features after components load    }, observerOptions);                shape.rotation.x += (targetY - shape.rotation.x) * 0.05 + 0.001;

    initializeFeatures();

                    }

    // Initialize AOS if available

    if (typeof AOS !== 'undefined') {    // Observe elements with data-animate attribute            if(particles) {

        AOS.init({

            duration: 800,    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));                particles.rotation.y = elapsedTime * 0.1;

            once: true,

            offset: 50,};            }

            easing: 'ease-out-cubic'

        });            renderer.render(scene, camera);

    }

});// ==========================================        }


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
