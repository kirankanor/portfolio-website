// dot-text.js
// Turns any text into a grid of small colored dots, then repels nearby dots
// away from the mouse cursor and eases them back to their "home" position.
//
// Usage: give a <canvas> element the attributes
//   data-text="IMPOSSIBLE TO IGNORE"
//   class="dot-text"
// and call initDotText() after the page loads.

function initDotText() {
    document.querySelectorAll("canvas.dot-text").forEach((canvas) => {
        setupDotCanvas(canvas);
    });
}

function setupDotCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    const text = canvas.dataset.text || "IMPOSSIBLE TO IGNORE";

    // Two colors to randomly assign to each dot -- this is what produces the
    // stippled two-tone look instead of a single flat color.
    const palette = ["#ff7a3d", "#1a1a2e"];

    // How far apart we sample the letter shape. Bigger = fewer, chunkier dots.
    const GRID_STEP = 2;
    const DOT_SIZE = 3;

    // How close the mouse needs to be to push a dot, and how strong that push is.
    const REPEL_RADIUS = 60;
    const REPEL_STRENGTH = 25;

    // How quickly a pushed dot eases back to its home position each frame.
    // Smaller = slower/floatier, closer to 1 = snaps back almost instantly.
    const RETURN_EASE = 0.08;

    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    let width, height;

    function resize() {
        // Match canvas resolution to its on-screen CSS size, accounting for
        // high-DPI screens so the dots stay crisp instead of blurry.
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        buildParticles();
    }

    function buildParticles() {
        // Step 1: draw the text once, off-screen (in memory only), just to
        // read back which pixels belong to a letter.
        // Splitting on "|" lets data-text="IMPOSSIBLE|TO IGNORE" render as
        // two stacked lines instead of one long line.
        const lines = text.split("|");

        const offscreen = document.createElement("canvas");
        offscreen.width = width;
        offscreen.height = height;
        const offCtx = offscreen.getContext("2d");

        // Size the font off the longest line so it still fits the canvas width.
        const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b));
        const fontSize = Math.min(
            width / (longestLine.length * 0.6),
            (height / lines.length) * 0.75
        );
        offCtx.font = `900 ${fontSize}px sans-serif`;
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        offCtx.fillStyle = "#fff";

        // Stack lines evenly around the vertical center of the canvas.
        const lineHeight = fontSize * 1.1;
        const startY = height / 2 - (lineHeight * (lines.length - 1)) / 2;
        lines.forEach((line, i) => {
            offCtx.fillText(line, width / 2, startY + i * lineHeight);
        });

        const imageData = offCtx.getImageData(0, 0, width, height).data;

        // Step 2: walk the pixel grid in steps of GRID_STEP, and wherever the
        // alpha channel is above a threshold, that pixel is "inside" a letter.
        particles = [];
        for (let y = 0; y < height; y += GRID_STEP) {
            for (let x = 0; x < width; x += GRID_STEP) {
                const alphaIndex = (y * width + x) * 4 + 3;
                if (imageData[alphaIndex] > 128) {
                    particles.push({
                        homeX: x,
                        homeY: y,
                        x: x,
                        y: y,
                        color: palette[Math.floor(Math.random() * palette.length)],
                    });
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (const p of particles) {
            // Vector from the mouse to this particle
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < REPEL_RADIUS) {
                // Closer dots get pushed harder -- force falls off with distance.
                const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
                const angle = Math.atan2(dy, dx);
                p.x += Math.cos(angle) * force * REPEL_STRENGTH;
                p.y += Math.sin(angle) * force * REPEL_STRENGTH;
            } else {
                // Ease back toward home position, like a soft spring.
                p.x += (p.homeX - p.x) * RETURN_EASE;
                p.y += (p.homeY - p.y) * RETURN_EASE;
            }

            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, DOT_SIZE, DOT_SIZE);
        }

        requestAnimationFrame(animate);
    }

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseleave", () => {
        // Send the mouse far away so every dot eases back home when the
        // cursor exits the canvas.
        mouse.x = -9999;
        mouse.y = -9999;
    });

    window.addEventListener("resize", resize);

    resize();
    animate();
}

document.addEventListener("DOMContentLoaded", initDotText);