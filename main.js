document.addEventListener('DOMContentLoaded', async function() {
    // 1. Load Header/Footer
    const loadComponents = async () => {
        try {
            const headerRes = await fetch('header.html');
            if(headerRes.ok) document.getElementById('header-placeholder').innerHTML = await headerRes.text();
            const footerRes = await fetch('footer.html');
            if(footerRes.ok) document.getElementById('footer-placeholder').innerHTML = await footerRes.text();
            initializeUI();
        } catch (e) { console.error(e); }
    };
    await loadComponents();

    // 2. Initialize AOS
    if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 50 });

    // 3. Initialize Three.js (Hero)
    if(document.getElementById('hero-canvas-container')) initThreeJS();
    
    // 4. Initialize Spotlight Effect
    initSpotlight();
});

function initializeUI() {
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if(btn && menu) {
        btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    }

    // Discord Copy Logic
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-copy]');
        if(btn) {
            navigator.clipboard.writeText(btn.getAttribute('data-copy'));
            const tooltip = btn.querySelector('.tooltip');
            if(tooltip) {
                tooltip.classList.remove('hidden');
                setTimeout(() => tooltip.classList.add('hidden'), 1500);
            }
        }
    });
}

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

function initThreeJS() {
    if (typeof THREE === 'undefined') return;
    const container = document.getElementById('hero-canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Wireframe Terrain
    const geometry = new THREE.PlaneGeometry(100, 100, 40, 40);
    const material = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true, transparent: true, opacity: 0.15 });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -5;
    scene.add(plane);

    camera.position.z = 20;
    camera.position.y = 5;
    
    let time = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        time += 0.005;
        
        // Waving effect
        const positions = plane.geometry.attributes.position.array;
        for(let i=0; i<positions.length; i+=3) {
            const x = positions[i];
            const y = positions[i+1];
            positions[i+2] = Math.sin(x/5 + time*5) * 2 + Math.cos(y/5 + time*3) * 2;
        }
        plane.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}