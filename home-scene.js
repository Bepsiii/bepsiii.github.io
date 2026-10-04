import * as THREE from './assets/vendor/three.module.min.js';

// A continuous silver ribbon: vertex motion runs on the GPU, not in the page UI.
const host = document.getElementById('hero-scene');
const hero = host?.closest('.home-hero');
const toggle = document.getElementById('scene-toggle');
if (host && hero) {
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' }); }
    catch { host.dataset.sceneState = 'fallback'; }
    if (renderer) {
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
        camera.position.set(0, 0, 15);
        const uniforms = {
            uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() },
            uScroll: { value: 0 }, uLight: { value: 0 },
        };
        const material = new THREE.ShaderMaterial({
            uniforms, transparent: true, depthWrite: false,
            blending: THREE.NormalBlending,
            vertexShader: `
                uniform float uTime;
                uniform vec2 uPointer;
                uniform float uScroll;
                attribute float aLane;
                varying float vLane;
                varying float vFade;
                void main() {
                    float x = position.x;
                    float lane = aLane;
                    float twist = x * 0.52 + sin(x * 0.3 + uTime * 0.18) * 0.5 + uTime * 0.12;
                    float envelope = 0.5 + 0.5 * cos(x * 0.16);
                    vec3 p = vec3(x, lane * cos(twist) * 2.0, lane * sin(twist) * 2.8);
                    p.y += sin(x * 0.48 + uTime * 0.2) * 1.05 - 2.0;
                    p.y += uPointer.y * 0.22 + uScroll * 0.6;
                    p.z += uPointer.x * 0.35 + sin(x * 0.65 - uTime * 0.14) * envelope;
                    vLane = abs(lane);
                    vFade = smoothstep(0.0, 1.4, 10.0 - abs(x));
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uLight;
                varying float vLane;
                varying float vFade;
                void main() {
                    vec3 silver = mix(vec3(0.48, 0.57, 0.69), vec3(0.86, 0.9, 0.96), vLane);
                    silver = mix(silver, vec3(0.12, 0.21, 0.35), uLight);
                    float alpha = (0.08 + pow(vLane, 3.0) * 0.28) * vFade;
                    gl_FragColor = vec4(silver, alpha);
                }
            `,
        });
        const geometry = new THREE.BufferGeometry();
        const lanes = 64;
        const segments = 180;
        const positions = new Float32Array(lanes * segments * 6);
        const laneValues = new Float32Array(lanes * segments * 2);
        let vertex = 0;
        for (let lane = 0; lane < lanes; lane++) {
            for (let segment = 0; segment < segments; segment++) {
                for (let endpoint = 0; endpoint < 2; endpoint++) {
                    positions[vertex * 3] = ((segment + endpoint) / segments - 0.5) * 20;
                    laneValues[vertex] = lane / (lanes - 1) * 2 - 1;
                    vertex++;
                }
            }
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aLane', new THREE.BufferAttribute(laneValues, 1));
        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);
        const ribbon = new THREE.LineSegments(geometry, material);
        ribbon.rotation.z = -0.16;
        scene.add(ribbon);
        const particles = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(160 * 3);
        for (let i = 0; i < 160; i++) {
            particlePositions[i * 3] = Math.sin(i * 127.1) * 11;
            particlePositions[i * 3 + 1] = Math.sin(i * 311.7) * 5;
            particlePositions[i * 3 + 2] = Math.cos(i * 74.3) * 4 - 3;
        }
        particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMaterial = new THREE.PointsMaterial({ color: 0xcbd5e1, size: 0.025, transparent: true, opacity: 0.28, depthWrite: false });
        const points = new THREE.Points(particles, particleMaterial);
        scene.add(points);
        renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1 : 1.5));
        renderer.setClearColor(0, 0);
        renderer.domElement.setAttribute('aria-hidden', 'true');
        host.append(renderer.domElement);
        host.dataset.sceneState = 'ready';
        const pointer = new THREE.Vector2();
        let frame = 0, active = true, paused = false, disposed = false, contextLost = false, elapsed = 0, last = 0, rendered = 0;
        const paint = () => {
            if (disposed || contextLost) return;
            uniforms.uLight.value = document.documentElement.dataset.theme === 'light' ? 1 : 0;
            uniforms.uPointer.value.lerp(pointer, 0.035);
            uniforms.uScroll.value = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
            uniforms.uTime.value = elapsed;
            points.rotation.y = elapsed * 0.015;
            renderer.render(scene, camera);
            host.dataset.frames = String(++rendered);
        };
        const loop = timestamp => {
            frame = 0;
            if (disposed || contextLost || !active || paused || document.hidden) return;
            // Keep controls in sync if a motion preference changes between frames.
            if (reduced.matches) { sync(); return; }
            if (timestamp - last >= 1000 / 30) {
                elapsed += Math.min((timestamp - last) / 1000, 0.05);
                last = timestamp; paint();
            }
            frame = requestAnimationFrame(loop);
        };
        const sync = () => {
            cancelAnimationFrame(frame); frame = 0;
            host.dataset.motion = contextLost ? 'idle' : reduced.matches ? 'reduced' : paused ? 'paused' : active && !document.hidden ? 'running' : 'idle';
            toggle.hidden = reduced.matches || contextLost;
            if (!disposed) paint();
            if (!disposed && !contextLost && !reduced.matches && active && !paused && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(loop); }
        };
        const resize = () => {
            const width = host.clientWidth, height = host.clientHeight;
            if (!width || !height) return;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.position.z = width < 768 ? 20 : 15;
            camera.updateProjectionMatrix(); paint();
        };
        const sizes = new ResizeObserver(resize); sizes.observe(host);
        const visibility = new IntersectionObserver(entries => { active = entries[0].isIntersecting; sync(); }, { threshold: 0.01 }); visibility.observe(hero);
        const theme = new MutationObserver(() => paint()); theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        hero.addEventListener('pointermove', event => {
            if (reduced.matches || event.pointerType === 'touch') return;
            const rect = hero.getBoundingClientRect();
            pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height * 2 - 1));
        }, { passive: true });
        hero.addEventListener('pointerleave', () => pointer.set(0, 0));
        toggle.addEventListener('click', () => { paused = !paused; toggle.setAttribute('aria-pressed', String(paused)); toggle.textContent = paused ? 'Resume motion' : 'Pause motion'; sync(); });
        reduced.addEventListener('change', sync);
        document.addEventListener('visibilitychange', sync);
        renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); contextLost = true; sync(); host.dataset.sceneState = 'fallback'; });
        renderer.domElement.addEventListener('webglcontextrestored', () => { contextLost = false; host.dataset.sceneState = 'ready'; resize(); sync(); });
        window.addEventListener('pagehide', event => {
            if (event.persisted) { active = false; sync(); return; }
            disposed = true; cancelAnimationFrame(frame);
            sizes.disconnect(); visibility.disconnect(); theme.disconnect();
            geometry.dispose(); particles.dispose(); material.dispose(); particleMaterial.dispose(); renderer.dispose();
        });
        window.addEventListener('pageshow', event => { if (event.persisted) { active = true; sync(); } });
        resize(); sync();
    }
}
