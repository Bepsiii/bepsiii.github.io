// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttleRAF = (func) => {
    let ticking = false;
    return function(...args) {
        if (!ticking) {
            requestAnimationFrame(() => {
                func.apply(this, args);
                ticking = false;
            });
            ticking = true;
        }
    };
};

const initMobileMenu = () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenuButton || !mobileMenu || mobileMenuButton.dataset.initialized) return;
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const isExpanded = !mobileMenu.classList.contains('hidden');
        mobileMenuButton.setAttribute('aria-expanded', isExpanded);
    });
    document.addEventListener('click', (e) => {
        if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    });
    mobileMenuButton.dataset.initialized = 'true';
};

const initDiscordCopy = () => {
    const discordID = 'theukgovernment';
    const buttons = ['discord-copy', 'discord-copy-footer'];
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (!button || button.dataset.initialized) return;
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(discordID);
                const tooltip = button.querySelector('span') || document.getElementById('copy-tooltip');
                if (tooltip) {
                    tooltip.classList.remove('hidden', 'opacity-0');
                    tooltip.classList.add('opacity-100');
                    setTimeout(() => {
                        tooltip.classList.remove('opacity-100');
                        tooltip.classList.add('opacity-0');
                        setTimeout(() => tooltip.classList.add('hidden'), 200);
                    }, 1500);
                }
            } catch (err) {
                console.error('Failed to copy text:', err);
            }
        });
        button.dataset.initialized = 'true';
    });
};

const initParallax = () => {
    const heroText = document.getElementById('hero-text');
    const heroCanvas = document.getElementById('hero-canvas');
    if (!heroText && !heroCanvas) return;
    const handleScroll = throttleRAF(() => {
        const scrollPosition = window.scrollY;
        if (heroText) {
            const translateY = scrollPosition * 0.3;
            const opacity = Math.max(0, 1 - scrollPosition / 400);
            heroText.style.transform = `translateY($${translateY}px)`;
            heroText.style.opacity = opacity;
        }
        if (heroCanvas) {
            heroCanvas.style.transform = `translateY($${scrollPosition * 0.5}px)`;
        }
    });
    window.addEventListener('scroll', handleScroll, { passive: true });
};

const initScrollHeader = () => {
    const header = document.getElementById('header');
    if (!header) return;
    const handleScroll = throttleRAF(() => {
        const scrollY = window.scrollY;
        const nav = header.querySelector('nav');
        if (scrollY > 50) {
            header.classList.add('scrolled');
            if (nav) {
                nav.style.background = 'rgba(10, 10, 10, 0.95)';
                nav.style.backdropFilter = 'blur(40px)';
                nav.style.borderBottom = '1px solid rgba(14, 165, 233, 0.2)';
            }
        } else {
            header.classList.remove('scrolled');
            if (nav) {
                nav.style.background = '';
                nav.style.backdropFilter = '';
                nav.style.borderBottom = '';
            }
        }
    });
    window.addEventListener('scroll', handleScroll, { passive: true });
};

const initThreeJS = () => {
    const heroCanvasContainer = document.getElementById('hero-canvas');
    if (!heroCanvasContainer || !window.THREE) return;
    let scene, camera, renderer, shape, particles;
    let mouseX = 0, mouseY = 0;
    const clock = new THREE.Clock();
    const init = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        heroCanvasContainer.appendChild(renderer.domElement);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const pointLight1 = new THREE.PointLight(0x0ea5e9, 4);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);
        const pointLight2 = new THREE.PointLight(0x8b5cf6, 4);
        pointLight2.position.set(-5, -5, 2);
        scene.add(pointLight2);
        const geometry = new THREE.IcosahedronGeometry(1.5, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x444444, roughness: 0.1, metalness: 0.95, wireframe: true });
        shape = new THREE.Mesh(geometry, material);
        scene.add(shape);
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000;
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 15; }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({ size: 0.015, color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending });
        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);
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
        if (particles) { particles.rotation.y = elapsedTime * 0.1; }
        renderer.render(scene, camera);
    };
    init();
    animate();
};

const initializeFeatures = () => {
    initMobileMenu();
    initDiscordCopy();
    initParallax();
    initScrollHeader();
    initThreeJS();
};

window.initializeFeatures = initializeFeatures;
