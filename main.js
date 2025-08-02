document.addEventListener('DOMContentLoaded', function () {
    
    // --- Reusable Function to Load HTML Components ---
    const loadComponent = (selector, url) => {
        const element = document.querySelector(selector);
        if (element) {
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to load ${url}: ${response.statusText}`);
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                    // After loading, initialize any scripts that depend on the new content
                    initializeDynamicContent(); 
                })
                .catch(error => console.error(`Error loading component: ${error}`));
        }
    };

    // Load the header and footer into their placeholders
    loadComponent('#header-placeholder', 'header.html');
    loadComponent('#footer-placeholder', 'footer.html');

    // This function holds all scripts that need to run AFTER the header/footer are loaded
    const initializeDynamicContent = () => {
        
        // --- Mobile Menu Toggle ---
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        // Check if the button exists and hasn't already had a listener attached
        if (mobileMenuButton && !mobileMenuButton.dataset.listenerAttached) { 
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
            mobileMenuButton.dataset.listenerAttached = 'true'; // Mark as attached
        }
        
        // --- Discord Copy Logic ---
        const discordID = 'theukgovernment';
        // We select the tooltip here, assuming one tooltip is shared.
        const tooltip = document.getElementById('copy-tooltip'); 

        const setupCopyButton = (buttonId) => {
            const button = document.getElementById(buttonId);
            // Check if the button exists and hasn't already had a listener attached
            if (button && !button.dataset.listenerAttached) {
                button.addEventListener('click', () => {
                    // Use the modern Navigator API for clipboard access
                    navigator.clipboard.writeText(discordID).then(() => {
                        // Find the correct tooltip if there are multiple, or use a shared one.
                        // For simplicity, we'll assume the hero tooltip is the main one.
                        if (tooltip) {
                            tooltip.classList.remove('hidden');
                            setTimeout(() => {
                                tooltip.classList.add('hidden');
                            }, 1500);
                        }
                    }).catch(err => console.error('Failed to copy text: ', err));
                });
                button.dataset.listenerAttached = 'true'; // Mark as attached
            }
        };

        setupCopyButton('discord-copy');
        setupCopyButton('discord-copy-footer');
    };

    // --- Initialize AOS (Animate on Scroll) ---
    // This can run immediately on page load as it doesn't depend on our components.
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    // --- Parallax Effect ---
    // This also runs immediately as it attaches to the window scroll event.
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroText = document.getElementById('hero-text');
        const heroCanvas = document.getElementById('hero-canvas');
        
        if (heroText) {
            heroText.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            heroText.style.opacity = 1 - scrollPosition / 400;
        }
        if (heroCanvas) {
            heroCanvas.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
    });

    // --- Three.js 3D Background ---
    const heroCanvasContainer = document.getElementById('hero-canvas');
    if (heroCanvasContainer) {
        // All of your original Three.js code goes here.
        // It's self-contained and will only run if it finds the '#hero-canvas' element.
        let scene, camera, renderer, shape, particles;
        let isGyroActive = false;
        let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        const clock = new THREE.Clock();

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            heroCanvasContainer.appendChild(renderer.domElement);
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);
            const pointLight = new THREE.PointLight(0x0ea5e9, 4); 
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);
            const pointLight2 = new THREE.PointLight(0x8b5cf6, 4);
            pointLight2.position.set(-5, -5, 2);
            scene.add(pointLight2);
            
            const geometry = new THREE.IcosahedronGeometry(1.5, 1);
            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0x444444,
                roughness: 0.1,
                metalness: 0.95,
                wireframe: true,
            });
            shape = new THREE.Mesh(geometry, material);
            scene.add(shape);
            
            const particlesGeometry = new THREE.BufferGeometry;
            const particlesCount = 5000;
            const posArray = new Float32Array(particlesCount * 3);
            for(let i = 0; i < particlesCount * 3; i++) {
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
            
            window.addEventListener('resize', onWindowResize, false);
            document.addEventListener('mousemove', onMouseMove, false);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onMouseMove(event) {
            if (!isGyroActive) {
                mouseX = (event.clientX - windowHalfX);
                mouseY = (event.clientY - windowHalfY);
            }
        }
        
        function animate() {
            requestAnimationFrame(animate);
            targetX = mouseX * 0.002;
            targetY = mouseY * 0.002;
            const elapsedTime = clock.getElapsedTime();
            
            if (shape) {
                shape.rotation.y += (targetX - shape.rotation.y) * 0.05 + 0.001;
                shape.rotation.x += (targetY - shape.rotation.x) * 0.05 + 0.001;
            }
            if(particles) {
                particles.rotation.y = elapsedTime * 0.1;
            }
            renderer.render(scene, camera);
        }

        init();
        animate();
    }
});