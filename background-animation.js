document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Match the deeper dark void background color (#030303) for fog to create rich depth
    scene.fog = new THREE.FogExp2(0x030303, 0.015);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    // Position camera above and looking down at the terrain grid
    camera.position.z = 25;
    camera.position.y = 7;
    camera.rotation.x = -0.25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to 2 for performance
    container.appendChild(renderer.domElement);

    // --- Terrain (Highly Refined Wireframe Grid) ---
    // Width, Height, SegmentsW, SegmentsH
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 72, 72);
    
    // Store original positions for multi-layered wave calculations
    const planeOriginalPositions = planeGeometry.attributes.position.array.slice();
    
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6, // Cyber Blue
        wireframe: true,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending
    });

    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 2; // Lay flat
    planeMesh.position.y = -6;
    scene.add(planeMesh);

    // --- High-Density Dual-Tone Particles (Floating Digital Dust) ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2200; // Increased density for premium visual volume
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    const randomArray = new Float32Array(particlesCount); 

    for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Spread particles in a wide 3D viewport bounding box
        posArray[i3] = (Math.random() - 0.5) * 120;     // x
        posArray[i3 + 1] = (Math.random() - 0.5) * 60;  // y
        posArray[i3 + 2] = (Math.random() - 0.5) * 120; // z
        
        randomArray[i] = Math.random();

        // Assign gorgeous gradient vertex colors: Cyan (#06b6d4), Blue (#3b82f6), and Violet (#8b5cf6)
        const colorWeight = Math.random();
        if (colorWeight < 0.35) {
            // Cyan
            colorsArray[i3] = 0.02;
            colorsArray[i3 + 1] = 0.71;
            colorsArray[i3 + 2] = 0.83;
        } else if (colorWeight < 0.7) {
            // Blue
            colorsArray[i3] = 0.23;
            colorsArray[i3 + 1] = 0.51;
            colorsArray[i3 + 2] = 0.96;
        } else {
            // Violet
            colorsArray[i3] = 0.54;
            colorsArray[i3 + 1] = 0.36;
            colorsArray[i3 + 2] = 0.96;
        }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    particlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randomArray, 1));

    // Enable vertex colors for custom neon sparks
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- Interactive Coordinates & Mouse Parallax ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let windowHalfX = container.clientWidth / 2;
    let windowHalfY = container.clientHeight / 2;

    // Use passive listener to maintain mobile scroll performance
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    }, { passive: true });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // 1. Multi-Octave Terrain Wave Simulation
        const positions = planeGeometry.attributes.position.array;
        
        for(let i = 0; i < positions.length; i += 3) {
            const x = planeOriginalPositions[i];
            const y = planeOriginalPositions[i+1];
            
            // Layered waves for complex fluid look
            const wave1 = 0.7 * Math.sin(x * 0.12 + elapsedTime * 0.45);
            const wave2 = 0.35 * Math.sin(y * 0.15 + elapsedTime * 0.3);
            const wave3 = 0.2 * Math.cos((x + y) * 0.3 + elapsedTime * 0.6);
            
            positions[i + 2] = wave1 + wave2 + wave3;
        }
        planeGeometry.attributes.position.needsUpdate = true;

        // Slow grid rotation over time
        planeMesh.rotation.z = elapsedTime * 0.015;

        // 2. Slow particle cloud drift
        particlesMesh.rotation.y = elapsedTime * 0.025;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;

        // 3. Smooth Camera Parallax Interpolation (Lerp)
        targetX = mouseX * 0.0004;
        targetY = mouseY * 0.0004;

        planeMesh.rotation.x += 0.04 * ((-Math.PI / 2 + targetY) - planeMesh.rotation.x);

        // Slow camera floating drift
        const bounce = Math.sin(elapsedTime * 0.3) * 0.3;
        camera.position.x += (mouseX * 0.004 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 0.004 + 7 + bounce - camera.position.y) * 0.04;
        camera.lookAt(new THREE.Vector3(0, -2, 0));

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // --- Resize Handler ---
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        windowHalfX = width / 2;
        windowHalfY = height / 2;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    });
});
