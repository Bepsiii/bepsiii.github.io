document.addEventListener('DOMContentLoaded', async function() {
    // 1. Load Header/Footer dynamically
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

    // 2. Initialize Scroll Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 50, easing: 'ease-out-cubic' });
    }

    // 3. Initialize 3D Animation (Only if container exists)
    if(document.getElementById('hero-canvas-container')) initThreeJS();
    
    // 4. Initialize Card Spotlight
    initSpotlight();
    
    // 5. Initialize Resource Filtering (if on resources page)
    initResourceFilter();
});

function initializeUI() {
    // Mobile Menu Toggle
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if(btn && menu) {
        btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    }

    // Discord Copy to Clipboard
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-copy]');
        if(btn) {
            navigator.clipboard.writeText(btn.getAttribute('data-copy'));
            const tooltip = btn.querySelector('.tooltip');
            if(tooltip) {
                tooltip.classList.remove('hidden');
                setTimeout(() => tooltip.classList.add('hidden'), 2000);
            }
        }
    });
}

// Mouse tracking for liquid cards
function initSpotlight() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.interactive-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Resource Page Filter Logic
function initResourceFilter() {
    const filterContainer = document.getElementById('filter-container');
    if(!filterContainer) return;

    const buttons = filterContainer.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.resource-item');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');

            items.forEach(item => {
                if(filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    // Re-trigger AOS animation
                    item.classList.remove('aos-animate');
                    setTimeout(() => item.classList.add('aos-animate'), 50);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Three.js Wireframe Landscape
function initThreeJS() {
    if (typeof THREE === 'undefined') return;
    
    const container = document.getElementById('hero-canvas-container');
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 10;
    camera.rotation.x = 0.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create the Wireframe Grid
    const geometry = new THREE.PlaneGeometry(150, 150, 40, 40);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x38bdf8, // Sky Blue
        wireframe: true, 
        transparent: true, 
        opacity: 0.2 
    });
    
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -8;
    scene.add(plane);

    // Add some floating particles
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 400;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xa855f7, // Purple
        transparent: true,
        opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    let time = 0;
    
    const animate = () => {
        requestAnimationFrame(animate);
        time += 0.003;
        
        // Animate Grid Waves
        const positions = plane.geometry.attributes.position.array;
        for(let i=0; i<positions.length; i+=3) {
            const x = positions[i];
            const y = positions[i+1];
            // Z is Up/Down in Plane geometry after rotation
            positions[i+2] = Math.sin(x/8 + time) * 2 + Math.cos(y/8 + time) * 2;
        }
        plane.geometry.attributes.position.needsUpdate = true;

        // Rotate Particles
        particlesMesh.rotation.y = time * 0.05;

        renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}