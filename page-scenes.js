import * as THREE from './assets/vendor/three.module.min.js';

// Small, self-contained sculptures. Content and navigation never depend on WebGL.
const mounts = [...document.querySelectorAll('[data-scene]')];
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(pointer: fine)');
const controllers = new Map();
let animationFrame = 0;
let suspended = document.hidden;
let disposed = false;
let observedReducedMotion = motionPreference.matches;

const palette = () => document.documentElement.dataset.theme === 'light'
    ? { silver: 0x485d78, blue: 0x416997, edge: 0x7694b6, dim: 0x95a8bd, opacity: .66 }
    : { silver: 0xcad6e6, blue: 0x829fc7, edge: 0xb9cbe3, dim: 0x546982, opacity: .42 };

function createScene(host) {
    let renderer;
    const button = host.parentElement.querySelector('[data-scene-toggle]');
    try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
        host.dataset.sceneState = 'fallback';
        host.dataset.motion = 'idle';
        if (button) button.hidden = true;
        return null;
    }
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.tabIndex = -1;
    host.append(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);
    const sculpture = new THREE.Group();
    scene.add(sculpture);
    scene.add(new THREE.AmbientLight(0xc6d5eb, 1.7));
    const light = new THREE.DirectionalLight(0xffffff, 3.8);
    light.position.set(-4, 7, 8);
    scene.add(light);
    const rim = new THREE.DirectionalLight(0x8caee0, 2.5);
    rim.position.set(5, -1, -5);
    scene.add(rim);

    const materials = [];
    const animations = [];
    const pointer = new THREE.Vector2();
    const parallax = new THREE.Vector2();
    const type = host.dataset.scene;
    const controller = { host, visible: true, paused: false, lost: false, time: 1.6, last: 0, frames: 0, dirty: true };

    function lineMaterial(role = 'edge', opacity = .6) {
        const material = new THREE.LineBasicMaterial({ color: palette()[role], transparent: true, opacity, depthWrite: false });
        materials.push({ material, role, opacity });
        return material;
    }
    function metal(role = 'silver', opacity = 1) {
        const material = new THREE.MeshStandardMaterial({ color: palette()[role], metalness: .52, roughness: .32, transparent: opacity < 1, opacity });
        materials.push({ material, role, opacity });
        return material;
    }
    function lines(points, material, parent = sculpture) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
        const item = new THREE.LineSegments(geometry, material);
        parent.add(item);
        return item;
    }
    function outlinedBox(width, height, depth, position, parent, fill = false) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const group = new THREE.Group();
        group.position.set(...position);
        group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), lineMaterial('edge', .72)));
        if (fill) group.add(new THREE.Mesh(geometry, metal('blue', .17)));
        else geometry.dispose();
        parent.add(group);
        return group;
    }
    function dot(position, radius = .045, parent = sculpture, material = metal()) {
        const item = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 1), material);
        item.position.set(...position);
        parent.add(item);
        return item;
    }

    if (type === 'lattice') {
        const frameGeometry = new THREE.IcosahedronGeometry(2.03, 0);
        const frame = new THREE.LineSegments(new THREE.EdgesGeometry(frameGeometry), lineMaterial('edge', .46));
        sculpture.add(frame);
        const vertices = frameGeometry.getAttribute('position');
        const unique = new Map();
        for (let i = 0; i < vertices.count; i++) {
            const p = [vertices.getX(i), vertices.getY(i), vertices.getZ(i)];
            unique.set(p.map(n => n.toFixed(3)).join(','), p);
        }
        const nodeMaterial = metal('silver');
        [...unique.values()].forEach(p => dot(p, .072, sculpture, nodeMaterial));
        frameGeometry.dispose();
        const heart = new THREE.Mesh(new THREE.OctahedronGeometry(.83, 0), metal('silver'));
        heart.rotation.set(.35, .2, .1);
        sculpture.add(heart);
        const inner = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.17, 0)), lineMaterial('blue', .48));
        sculpture.add(inner);
        const links = [...unique.values()].flatMap(p => [[0, 0, 0], p]);
        lines(links, lineMaterial('dim', .25));
        const belt = new THREE.Mesh(new THREE.TorusGeometry(2.48, .008, 4, 120), metal('blue', .65));
        belt.rotation.set(Math.PI / 2.6, .1, .2);
        sculpture.add(belt);
        animations.push(time => {
            sculpture.rotation.set(.15 + parallax.y * .09, time * .085 + parallax.x * .13, -.08);
            heart.rotation.y = -.2 + time * .14;
            inner.rotation.set(time * .04, -time * .08, .1);
        });
        camera.position.set(0, .1, 10.6);
    } else if (type === 'waveform') {
        const geometry = new THREE.BufferGeometry();
        const lanes = 35, segments = 140;
        const positions = new Float32Array(lanes * segments * 6);
        const values = new Float32Array(lanes * segments * 2);
        let vertex = 0;
        for (let lane = 0; lane < lanes; lane++) {
            for (let segment = 0; segment < segments; segment++) {
                for (let endpoint = 0; endpoint < 2; endpoint++) {
                    positions[vertex * 3] = ((segment + endpoint) / segments - .5) * 7;
                    values[vertex] = lane / (lanes - 1) * 2 - 1;
                    vertex++;
                }
            }
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aLane', new THREE.BufferAttribute(values, 1));
        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);
        const uniforms = { uTime: { value: 1.6 }, uLight: { value: 0 } };
        const waveMaterial = new THREE.ShaderMaterial({
            uniforms, transparent: true, depthWrite: false,
            vertexShader: `
                uniform float uTime;
                attribute float aLane;
                varying float vFade;
                varying float vLane;
                void main() {
                    float x = position.x;
                    float envelope = exp(-x * x * .2);
                    float pulse = sin(x * 3.1 - uTime * .52) * envelope;
                    float phase = aLane * 1.5;
                    vec3 p = vec3(x, pulse * (1.1 + aLane * .22) + sin(x * 1.1 + phase) * .28, aLane * 1.45);
                    p.y += cos(x * 2.0 + phase - uTime * .24) * envelope * .22;
                    vFade = smoothstep(0., 1.1, 3.5 - abs(x));
                    vLane = abs(aLane);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
                }
            `,
            fragmentShader: `
                uniform float uLight;
                varying float vFade;
                varying float vLane;
                void main() {
                    vec3 silver = mix(vec3(.51, .63, .78), vec3(.85, .9, .97), vLane);
                    silver = mix(silver, vec3(.22, .36, .54), uLight);
                    gl_FragColor = vec4(silver, (.35 + vLane * .3) * vFade);
                }
            `,
        });
        materials.push({ material: waveMaterial, uniforms });
        sculpture.add(new THREE.LineSegments(geometry, waveMaterial));
        lines([[-3.3, -1.7, 0], [3.3, -1.7, 0]], lineMaterial('dim', .4));
        const ticks = [];
        for (let i = -6; i <= 6; i++) ticks.push([i * .5, -1.77, 0], [i * .5, -1.63, 0]);
        lines(ticks, lineMaterial('edge', .28));
        animations.push(time => {
            uniforms.uTime.value = time;
            sculpture.rotation.set(.4 + parallax.y * .09, -.18 + parallax.x * .13, -.12);
        });
        camera.position.set(0, 0, 12);
    } else if (type === 'rig') {
        outlinedBox(5.6, .12, 2.65, [0, -1.16, 0], sculpture, true);
        outlinedBox(.09, 1.45, .09, [-2.15, -1.91, .75], sculpture);
        outlinedBox(.09, 1.45, .09, [2.15, -1.91, .75], sculpture);
        outlinedBox(2.6, 1.62, .12, [-.75, .16, -.66], sculpture, true);
        outlinedBox(.11, .45, .1, [-.75, -.83, -.66], sculpture);
        outlinedBox(.76, .04, .44, [-.75, -1.06, -.6], sculpture);
        outlinedBox(2.1, .07, .6, [-.75, -1.035, .5], sculpture, true);
        outlinedBox(.35, .09, .48, [.79, -1.01, .5], sculpture, true);
        const tower = outlinedBox(1.12, 2.32, 1.35, [1.95, .04, -.18], sculpture, true);
        const parts = new THREE.Group();
        parts.position.copy(tower.position);
        sculpture.add(parts);
        outlinedBox(.49, .47, .07, [0, .47, .38], parts, true);
        outlinedBox(.77, .13, .71, [0, -.12, 0], parts, true);
        outlinedBox(.11, .67, .06, [.32, .48, .36], parts, true);
        const fanMaterial = metal('silver', .58);
        const fans = [];
        for (let i = 0; i < 2; i++) {
            const fan = new THREE.Group();
            fan.position.set(0, .58 - i * .96, .69);
            fan.add(new THREE.Mesh(new THREE.TorusGeometry(.3, .013, 4, 36), fanMaterial));
            for (let spoke = 0; spoke < 5; spoke++) {
                const blade = new THREE.Mesh(new THREE.BoxGeometry(.05, .24, .015), fanMaterial);
                blade.position.set(Math.sin(spoke * Math.PI * .4) * .14, Math.cos(spoke * Math.PI * .4) * .14, 0);
                blade.rotation.z = -spoke * Math.PI * .4 + .3;
                fan.add(blade);
            }
            parts.add(fan);
            fans.push(fan);
        }
        const circuit = [[1.93, -.58, .36], [.85, -.58, .36], [.85, -.87, .36], [-.7, -.87, .36], [-.7, -.83, -.55]];
        const circuitPoints = circuit.map(p => new THREE.Vector3(...p));
        const connection = new THREE.Line(new THREE.BufferGeometry().setFromPoints(circuitPoints), lineMaterial('blue', .66));
        sculpture.add(connection);
        const travel = dot(circuit[0], .05, sculpture, metal('silver'));
        const grid = new THREE.GridHelper(6, 12, 0x748eae, 0x34465f);
        grid.position.y = -2.67;
        grid.material.transparent = true;
        grid.material.opacity = .13;
        materials.push({ material: grid.material, role: 'dim', opacity: .13 });
        sculpture.add(grid);
        animations.push(time => {
            sculpture.rotation.y = -.14 + Math.sin(time * .12) * .025 + parallax.x * .1;
            sculpture.rotation.x = parallax.y * .04;
            fans.forEach(fan => fan.rotation.z = time * .45);
            const step = (time * .28) % (circuit.length - 1);
            travel.position.lerpVectors(circuitPoints[Math.floor(step)], circuitPoints[Math.floor(step) + 1], step % 1);
        });
        camera.position.set(8.5, 5.7, 10.2);
        camera.lookAt(0, -.4, 0);
    } else {
        // Orbital planes form a quiet, dimensional counterpart to the page typography.
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.67, 2), metal('silver'));
        sculpture.add(core);
        const rings = [];
        const satellites = [];
        for (let i = 0; i < 3; i++) {
            const ring = new THREE.Group();
            ring.rotation.set(.4 + i * .65, i * .8, i * .7);
            ring.add(new THREE.Mesh(new THREE.TorusGeometry(1.43 + i * .39, .012 + i * .002, 6, 120), metal(i === 1 ? 'blue' : 'silver', .62)));
            const satellite = dot([1.43 + i * .39, 0, 0], .072 + i * .025, ring, metal('silver'));
            sculpture.add(ring);
            rings.push(ring);
            satellites.push(satellite);
        }
        const outer = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 120 }, (_, i) => new THREE.Vector3(Math.cos(i / 120 * Math.PI * 2) * 2.77, Math.sin(i / 120 * Math.PI * 2) * 2.77, 0))), lineMaterial('dim', .22));
        outer.rotation.x = .65;
        sculpture.add(outer);
        animations.push(time => {
            sculpture.rotation.set(parallax.y * .08, time * .045 + parallax.x * .13, -.2);
            core.rotation.set(time * .07, time * .12, 0);
            satellites.forEach((satellite, i) => {
                const angle = time * (.17 + i * .035) + i * 1.8;
                const radius = 1.43 + i * .39;
                satellite.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            });
            rings[1].rotation.y = .8 + Math.sin(time * .13) * .16;
        });
        camera.position.set(0, .1, 10.7);
    }
    const defaultCamera = camera.position.clone();
    const applyTheme = () => {
        const colors = palette();
        materials.forEach(({ material, role, opacity, uniforms }) => {
            if (uniforms) uniforms.uLight.value = document.documentElement.dataset.theme === 'light' ? 1 : 0;
            else {
                material.color.setHex(colors[role]);
                material.opacity = opacity;
            }
        });
        controller.dirty = true;
        paintStatic();
    };
    const animate = () => motionPreference.matches ? false : controller.visible && !controller.paused && !controller.lost && !suspended;
    const paint = () => {
        if (controller.lost || disposed || suspended || !controller.visible) return;
        parallax.lerp(pointer, .045);
        animations.forEach(update => update(controller.time));
        renderer.render(scene, camera);
        host.dataset.frames = String(++controller.frames);
        controller.dirty = false;
    };
    const paintStatic = () => {
        if (controller.dirty) paint();
    };
    const sync = () => {
        host.dataset.motion = controller.lost ? 'idle' : motionPreference.matches ? 'reduced' : controller.paused ? 'paused' : controller.visible && !suspended ? 'running' : 'idle';
        if (button) {
            button.hidden = motionPreference.matches || controller.lost;
            button.setAttribute('aria-pressed', String(controller.paused));
            button.textContent = controller.paused ? 'Resume motion' : 'Pause motion';
        }
        if (motionPreference.matches) { pointer.set(0, 0); parallax.set(0, 0); }
        controller.dirty = true;
        paintStatic();
        schedule();
    };
    const resize = () => {
        const width = host.clientWidth, height = host.clientHeight;
        if (!width || !height) return;
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 768 ? 1 : 1.5));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Rig is taller; the other pieces favor a wider frame with room at the edges.
        camera.position.copy(defaultCamera).multiplyScalar(Math.max(1, (type === 'rig' ? .98 : 1.15) / camera.aspect));
        camera.updateProjectionMatrix();
        controller.dirty = true;
        paintStatic();
    };
    const onPointer = event => {
        if (motionPreference.matches || !finePointer.matches || event.pointerType === 'touch') return;
        const rect = host.getBoundingClientRect();
        pointer.set(Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)), Math.max(-1, Math.min(1, -((event.clientY - rect.top) / rect.height * 2 - 1))));
    };
    const onLeave = () => pointer.set(0, 0);
    const onToggle = () => { controller.paused = !controller.paused; sync(); };
    host.parentElement.addEventListener('pointermove', onPointer, { passive: true });
    host.parentElement.addEventListener('pointerleave', onLeave);
    button?.addEventListener('click', onToggle);
    renderer.domElement.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        controller.lost = true;
        host.dataset.sceneState = 'fallback';
        sync();
    });
    renderer.domElement.addEventListener('webglcontextrestored', () => {
        controller.lost = false;
        host.dataset.sceneState = 'ready';
        resize(); sync();
    });
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(host);
    controller.sync = sync;
    controller.tick = timestamp => {
        if (!animate()) return;
        const interval = 1000 / (innerWidth < 768 ? 24 : 30);
        if (timestamp - controller.last < interval) return;
        controller.time += Math.min(.06, (timestamp - controller.last) / 1000);
        controller.last = timestamp;
        paint();
    };
    controller.shouldAnimate = animate;
    controller.theme = applyTheme;
    controller.dispose = () => {
        sizeObserver.disconnect();
        host.parentElement.removeEventListener('pointermove', onPointer);
        host.parentElement.removeEventListener('pointerleave', onLeave);
        button?.removeEventListener('click', onToggle);
        const geometries = new Set();
        scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); });
        geometries.forEach(geometry => geometry.dispose());
        new Set(materials.map(item => item.material)).forEach(material => material.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
    };
    host.dataset.sceneState = 'ready';
    applyTheme(); resize(); sync();
    return controller;
}

function reconcileMotionPreference() {
    if (disposed || observedReducedMotion === motionPreference.matches) return;
    observedReducedMotion = motionPreference.matches;
    // Some browsers update matches before dispatching change. Synchronize at an
    // existing frame boundary before the new preference can stop that loop.
    if (observedReducedMotion) { cancelAnimationFrame(animationFrame); animationFrame = 0; }
    controllers.forEach(controller => controller.sync());
}

function schedule() {
    reconcileMotionPreference();
    if (animationFrame || disposed || suspended || ![...controllers.values()].some(controller => controller.shouldAnimate())) return;
    animationFrame = requestAnimationFrame(timestamp => {
        animationFrame = 0;
        reconcileMotionPreference();
        controllers.forEach(controller => controller.tick(timestamp));
        schedule();
    });
}

const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const host = entry.target;
        let controller = controllers.get(host);
        if (!controller && entry.isIntersecting && host.dataset.sceneState !== 'fallback') {
            controller = createScene(host);
            if (controller) controllers.set(host, controller);
        }
        if (controller) {
            controller.visible = entry.isIntersecting;
            controller.last = performance.now();
            controller.sync();
        }
    });
    schedule();
}, { threshold: .01 });
mounts.forEach(host => {
    host.dataset.sceneState = 'pending';
    host.dataset.motion = 'idle';
    host.dataset.frames = '0';
    const button = host.parentElement.querySelector('[data-scene-toggle]');
    if (button) button.hidden = true;
    visibility.observe(host);
});
const theme = new MutationObserver(() => controllers.forEach(controller => controller.theme()));
theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
const syncAll = () => {
    suspended = document.hidden;
    observedReducedMotion = motionPreference.matches;
    if (suspended) { cancelAnimationFrame(animationFrame); animationFrame = 0; }
    controllers.forEach(controller => { controller.last = performance.now(); controller.sync(); });
    schedule();
};
const onMotionChange = () => { reconcileMotionPreference(); schedule(); };
motionPreference.addEventListener('change', onMotionChange);
document.addEventListener('visibilitychange', syncAll);
window.addEventListener('pagehide', event => {
    cancelAnimationFrame(animationFrame); animationFrame = 0;
    suspended = true;
    if (event.persisted) controllers.forEach(controller => controller.sync());
    else {
        disposed = true;
        visibility.disconnect(); theme.disconnect();
        motionPreference.removeEventListener('change', onMotionChange);
        document.removeEventListener('visibilitychange', syncAll);
        controllers.forEach(controller => controller.dispose());
        controllers.clear();
    }
});
window.addEventListener('pageshow', event => { if (event.persisted) syncAll(); });
