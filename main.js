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
        const shouldCondense = window.scrollY > 48;
        header.classList.toggle('scrolled', shouldCondense);
    });
    window.addEventListener('scroll', handleScroll, { passive: true });
};

const initThreeJS = () => {
    const heroCanvasContainer = document.getElementById('hero-canvas');
    if (!heroCanvasContainer || !window.THREE) return;

    let scene, camera, renderer, terrain, particles;
    let mouseX = 0, mouseY = 0;
    const clock = new THREE.Clock();

    const init = () => {
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.03); // Dark fog for depth

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 3, 10);
        camera.rotation.x = -0.3;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        heroCanvasContainer.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x0ea5e9, 2, 50);
        pointLight.position.set(0, 10, 10);
        scene.add(pointLight);

        // Wireframe Terrain
        const geometry = new THREE.PlaneGeometry(60, 60, 40, 40);
        const material = new THREE.MeshStandardMaterial({
            color: 0x0ea5e9, // Sky blue
            wireframe: true,
            roughness: 0.5,
            metalness: 0.8,
            emissive: 0x0ea5e9,
            emissiveIntensity: 0.2
        });

        terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2;
        terrain.position.y = -2;
        scene.add(terrain);

        // Particles (Stars/Data points)
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50; // Spread them out more
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x8b5cf6, // Purple
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

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
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    };

    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Animate Terrain
        if (terrain) {
            const positions = terrain.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                // Calculate z (which is y in our rotated plane) based on x and y (which is z in rotated plane)
                // We need to access the original plane coordinates.
                // PlaneGeometry is created on XY plane.
                // positions[i] is x, positions[i+1] is y, positions[i+2] is z (0)
                
                // Let's create a moving wave effect
                const x = positions[i];
                const y = positions[i+1];
                
                // Combine sine waves for organic movement
                const wave1 = Math.sin(x * 0.3 + elapsedTime * 0.5) * 1.5;
                const wave2 = Math.cos(y * 0.3 + elapsedTime * 0.5) * 1.5;
                
                // Update the Z coordinate (which becomes height after rotation)
                positions[i + 2] = wave1 + wave2;
            }
            terrain.geometry.attributes.position.needsUpdate = true;
            
            // Subtle rotation based on mouse
            terrain.rotation.z = mouseX * 0.1;
        }

        // Animate Particles
        if (particles) {
            particles.rotation.y = elapsedTime * 0.05;
            particles.rotation.x = mouseY * 0.1;
        }

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
