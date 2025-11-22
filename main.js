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

// Three.js: Deep Sea Mesh (Slow & Calm) - DEPRECATED (Replaced by background-animation.js)
/*
function initThreeJS() {
    if (typeof THREE === 'undefined') return;
    
    const container = document.getElementById('hero-canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x09090b, 10, 60); // Matches bg-body

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 10;
    camera.rotation.x = 0.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Geometry: Dense Plane
    const geometry = new THREE.PlaneGeometry(120, 120, 50, 50);
    
    // Material: Wireframe with Navy Blue
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x3b82f6, // Navy Blue
        wireframe: true, 
        transparent: true, 
        opacity: 0.15
    });
    
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -12;
    scene.add(plane);

    let time = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        time += 0.002; // Very slow movement
        
        const positions = plane.geometry.attributes.position.array;
        for(let i=0; i<positions.length; i+=3) {
            const x = positions[i];
            const y = positions[i+1];
            // Gentle rolling hills
            positions[i+2] = Math.sin(x/15 + time) * 3 + Math.cos(y/15 + time) * 3;
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
*/