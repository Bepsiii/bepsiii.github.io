/**
 * Bepsi Technical Drafting Canvas Engine
 * High-performance, zero-dependency, non-AI technical studio backdrop
 * Renders lightweight architectural crosshairs & precision coordinates
 */
(function initTechnicalCanvas() {
    const heroContainer = document.getElementById('hero-canvas-container');
    const bgCanvas = document.getElementById('bg-canvas');
    if (!heroContainer && !bgCanvas) return;

    let canvas;
    let isFullWindow = false;

    if (heroContainer) {
        canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        heroContainer.appendChild(canvas);
    } else {
        canvas = bgCanvas;
        isFullWindow = true;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = (canvas.width = isFullWindow ? window.innerWidth : heroContainer.clientWidth);
    let height = (canvas.height = isFullWindow ? window.innerHeight : heroContainer.clientHeight);

    let isVisible = true;
    let animId = null;

    // Responsive resize with debounce
    function resize() {
        width = canvas.width = isFullWindow ? window.innerWidth : heroContainer.clientWidth;
        height = canvas.height = isFullWindow ? window.innerHeight : heroContainer.clientHeight;
        drawStaticFrame();
    }
    window.addEventListener('resize', resize, { passive: true });

    // Technical nodes array
    const nodes = [];
    const nodeCount = Math.min(28, Math.floor((width * height) / 32000));

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            size: Math.random() > 0.85 ? 2.5 : 1.5,
            code: ['0x' + Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0'), '<45g', '3950', '300Ω', '240W', 'mATX'][i % 6]
        });
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function drawStaticFrame() {
        ctx.clearRect(0, 0, width, height);
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
        ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.45)' : 'rgba(100, 116, 139, 0.45)';
        ctx.font = '9px ui-monospace, SFMono-Regular, monospace';

        nodes.forEach(node => {
            // Draw crosshair at node
            const arm = 4;
            ctx.beginPath();
            ctx.moveTo(node.x - arm, node.y); ctx.lineTo(node.x + arm, node.y);
            ctx.moveTo(node.x, node.y - arm); ctx.lineTo(node.x, node.y + arm);
            ctx.stroke();

            // Spec text label
            ctx.fillText(node.code, node.x + 6, node.y + 3);
        });
    }

    function render() {
        if (!isVisible) {
            animId = null;
            return;
        }

        ctx.clearRect(0, 0, width, height);
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

        ctx.font = '9px ui-monospace, SFMono-Regular, monospace';

        for (let i = 0; i < nodes.length; i++) {
            const p = nodes[i];

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Connect nearby nodes with blueprint hairline bridges
            for (let j = i + 1; j < nodes.length; j++) {
                const p2 = nodes[j];
                const ndx = p.x - p2.x;
                const ndy = p.y - p2.y;
                const nDist = Math.sqrt(ndx * ndx + ndy * ndy);

                if (nDist < 130) {
                    const alpha = (1 - nDist / 130) * (isDark ? 0.08 : 0.06);
                    ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Draw technical precision node crosshair
            const arm = 4;
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x - arm, p.y); ctx.lineTo(p.x + arm, p.y);
            ctx.moveTo(p.x, p.y - arm); ctx.lineTo(p.x, p.y + arm);
            ctx.stroke();

            // Label coordinate
            ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(100, 116, 139, 0.35)';
            ctx.fillText(p.code, p.x + 6, p.y + 3);
        }

        animId = requestAnimationFrame(render);
    }

    if (prefersReducedMotion) {
        drawStaticFrame();
        return;
    }

    // Visibility awareness & IntersectionObserver
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible && !animId) {
                animId = requestAnimationFrame(render);
            }
        }, { threshold: 0.05 });
        obs.observe(canvas);
    }

    animId = requestAnimationFrame(render);
})();
