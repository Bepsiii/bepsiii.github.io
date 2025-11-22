
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    // Match the dark background color for fog to create depth
    scene.fog = new THREE.FogExp2(0x09090b, 0.02);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    // Position camera slightly above the terrain
    camera.position.z = 20;
    camera.position.y = 5;
    camera.rotation.x = -0.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- Terrain (Wireframe Grid) ---
    // Width, Height, SegmentsW, SegmentsH
    const planeGeometry = new THREE.PlaneGeometry(80, 80, 64, 64);
    
    // Store original positions for wave calculations
    const planeOriginalPositions = planeGeometry.attributes.position.array.slice();
    
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6, // Blue-500
        wireframe: true,
        transparent: true,
        opacity: 0.15,
    });

    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 2; // Lay flat
    planeMesh.position.y = -5;
    scene.add(planeMesh);

    // --- Particles (Floating "Data") ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    const randomArray = new Float32Array(particlesCount); // For individual movement speed

    for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        // Spread particles in a wide volume
        posArray[i3] = (Math.random() - 0.5) * 100;     // x
        posArray[i3 + 1] = (Math.random() - 0.5) * 50;  // y
        posArray[i3 + 2] = (Math.random() - 0.5) * 100; // z
        
        randomArray[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randomArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x60a5fa, // Blue-400
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = container.clientWidth / 2;
    const windowHalfY = container.clientHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // 1. Animate Terrain (Wave Effect)
        const positions = planeGeometry.attributes.position.array;
        
        for(let i = 0; i < positions.length; i += 3) {
            // Access original z (which is y in our rotated mesh space)
            // We are modifying the 'z' of the plane geometry, which becomes 'y' height in world space because of rotation
            const x = planeOriginalPositions[i];
            const y = planeOriginalPositions[i+1]; // This is the 'height' in plane local space (flat)
            
            // Create a moving wave
            // Combine sine waves for complexity
            const waveX1 = 0.5 * Math.sin(x * 0.2 + elapsedTime * 0.5);
            const waveX2 = 0.25 * Math.sin(x * 1.5 + elapsedTime * 0.8);
            const waveY1 = 0.5 * Math.sin(y * 0.2 + elapsedTime * 0.5);
            
            // Apply height
            positions[i + 2] = waveX1 + waveX2 + waveY1;
        }
        planeGeometry.attributes.position.needsUpdate = true;

        // 2. Animate Particles
        // Rotate the whole particle system slowly
        particlesMesh.rotation.y = elapsedTime * 0.05;
        
        // 3. Mouse Interaction (Parallax)
        targetX = mouseX * 0.0005;
        targetY = mouseY * 0.0005;

        // Smoothly interpolate rotation
        planeMesh.rotation.z += 0.05 * (targetX - planeMesh.rotation.z);
        planeMesh.rotation.x += 0.05 * ((-Math.PI / 2 + targetY) - planeMesh.rotation.x);

        // Also move camera slightly
        camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.005 + 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // --- Resize Handler ---
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    });
});
