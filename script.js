// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// ── Smooth Scroll (Lenis) ──
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutQuint
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Sync Lenis with GSAP
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// Scroll Progress Bar
const progressBar = document.getElementById('scroll-progress');
lenis.on('scroll', ({ scroll, limit }) => {
    if (progressBar) {
        const progress = limit > 0 ? (scroll / limit) * 100 : 0;
        progressBar.style.width = progress + '%';
    }
});


// ── Premium Custom Cursor (GSAP QuickTo) ──
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
    // Reveal cursor
    gsap.set([cursorDot, cursorOutline], { opacity: 1 });

    // GSAP quickTo for zero-latency lerping
    const xDotSet = gsap.quickSetter(cursorDot, "x", "px");
    const yDotSet = gsap.quickSetter(cursorDot, "y", "px");

    const xOutlineTo = gsap.quickTo(cursorOutline, "x", { duration: 0.4, ease: "power3" });
    const yOutlineTo = gsap.quickTo(cursorOutline, "y", { duration: 0.4, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
        // Dot follows instantly
        xDotSet(e.clientX);
        yDotSet(e.clientY);
        // Outline lags elegantly
        xOutlineTo(e.clientX);
        yOutlineTo(e.clientY);
    });

    // Hover logic
    const interactables = document.querySelectorAll('a, button, .nav-menu-link, .btn-outline, .skill-pill');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorOutline, { width: 80, height: 80, backgroundColor: "#fff", duration: 0.3 });
            gsap.to(cursorDot, { opacity: 0, duration: 0.1 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorOutline, { width: 40, height: 40, backgroundColor: "transparent", duration: 0.3 });
            gsap.to(cursorDot, { opacity: 1, duration: 0.1 });
        });
    });

    // Massive hovers (Hero Header)
    const massiveTexts = document.querySelectorAll('.text-hover-interact');
    massiveTexts.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorOutline, { width: 200, height: 200, backgroundColor: "#fff", mixBlendMode: "difference", duration: 0.4 });
            gsap.to(cursorDot, { opacity: 0, duration: 0.1 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorOutline, { width: 40, height: 40, backgroundColor: "transparent", mixBlendMode: "difference", duration: 0.4 });
            gsap.to(cursorDot, { opacity: 1, duration: 0.1 });
        });
    });

    // Elegant Magnetic Physics for Buttons using GSAP
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        el.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = (e.clientX - (left + width / 2)) * 0.4;
            const y = (e.clientY - (top + height / 2)) * 0.4;
            xTo(x);
            yTo(y);
        });

        el.addEventListener('mouseleave', () => {
            xTo(0);
            yTo(0);
        });
    });
}


// ── Navbar Logic ──
const navbar = document.getElementById('navbar');
if (navbar) {
    ScrollTrigger.create({
        start: 'top -60',
        end: 99999,
        toggleClass: { className: 'py-5', targets: navbar }
    });
}

// Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.nav-menu-link');

if (hamburger && mobileMenu) {
    const menuText = hamburger.querySelector('span');
    const bars = hamburger.querySelectorAll('div > span');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            gsap.fromTo(mobileMenu,
                { yPercent: -100 },
                { yPercent: 0, duration: 0.8, ease: "power4.inOut" }
            );

            // Stagger menu links
            gsap.fromTo(mobileLinks,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.4, ease: "power3.out" }
            );

            if (menuText) menuText.textContent = "CLOSE";
            if (bars.length >= 2) {
                gsap.to(bars[0], { y: 3.5, rotation: 45, duration: 0.4 });
                gsap.to(bars[1], { y: -3.5, rotation: -45, duration: 0.4 });
            }

            lenis.stop(); // Stop scroll when menu open
        } else {
            gsap.to(mobileMenu, {
                yPercent: -100,
                duration: 0.8,
                ease: "power4.inOut",
                onComplete: () => mobileMenu.classList.add('hidden')
            });

            if (menuText) menuText.textContent = "MENU";
            if (bars.length >= 2) {
                gsap.to(bars[0], { y: 0, rotation: 0, duration: 0.4 });
                gsap.to(bars[1], { y: 0, rotation: 0, duration: 0.4 });
            }

            lenis.start();
        }
    }
    hamburger.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
}


// ── Page Load Choreography, Preloader & Text Reveals ──

window.addEventListener("load", () => {

    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    const preloaderCircle = document.getElementById('preloader-circle');

    // Create an elegant timeline for the preloader
    const tl = gsap.timeline({
        onStart: () => lenis.stop(), // freeze screen
        onComplete: () => lenis.start()
    });

    if (preloader && preloaderText && preloaderCircle) {
        // Calculate max scale to cover the viewport plus a safe margin
        const maxDim = Math.max(window.innerWidth, window.innerHeight);
        const targetScale = (maxDim * 2.5) / 10; // Initial circle size is 10px

        tl.to(preloaderText, { opacity: 1, duration: 0.8, ease: "power2.out" })
            .to(preloaderText, { scale: 1.05, duration: 0.8, ease: "none" }) // subtle text tension
            .to(preloaderCircle, { opacity: 1, duration: 0.01 }, "-=0.3") // Make circle visible
            .to(preloaderCircle, { scale: targetScale, duration: 0.9, ease: "power4.inOut" }, "-=0.3") // Expand circle
            .to(preloaderText, { color: "#F5F0EB", duration: 0.1 }, "-=0.6") // Invert text color over dark circle
            .to(preloaderText, { opacity: 0, duration: 0.4, y: -10, ease: "power2.in" }, "-=0.1") // Text fades out
            .to(preloader, { opacity: 0, duration: 1, ease: "power3.inOut" }, "-=0.2") // Whole preloader fades revealing #hero
            .set(preloader, { display: "none" }); // hide from DOM
    }

    // 1. Initial Navbar entrance AFTER preloader
    tl.to(navbar, { y: 0, duration: 1.2, ease: "power3.out" }, "-=0.7");

    // 2. Prepare SplitType for Hero Header and Section Headers
    const revealBlocks = document.querySelectorAll('.reveal-block');
    revealBlocks.forEach(block => {
        gsap.set(block, { autoAlpha: 1 }); // Clear CSS hidden state

        // Split text into lines and characters
        const text = new SplitType(block, { types: 'lines, words, chars' });

        // Wrap lines in an overflow hidden div to act as a mask
        text.lines.forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.display = 'inline-block';
            wrapper.style.verticalAlign = 'bottom';
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
        });

        // Intro animation for Hero H1
        if (block.tagName === 'H1') {
            tl.from(text.chars, {
                yPercent: 100,
                autoAlpha: 0,
                rotateZ: 4,
                duration: 1.2,
                stagger: 0.02,
                ease: "power4.out"
            }, "-=0.8"); // Sync with navbar dropping in
        }
        // ScrollTrigger animation for other headers
        else {
            gsap.from(text.chars, {
                scrollTrigger: {
                    trigger: block,
                    start: "top 85%",
                },
                yPercent: 100,
                autoAlpha: 0,
                rotateZ: 2,
                duration: 1,
                stagger: 0.015,
                ease: "power3.out"
            });
        }
    });

    // 3. Stagger fade-in sections natively with GSAP instead of CSS
    const fadeSections = gsap.utils.toArray('.fade-in-section');
    fadeSections.forEach(section => {
        gsap.set(section, { autoAlpha: 1 }); // Clear CSS hidden state

        // If it's already in the hero, just animate it immediately
        if (section.closest('.hero-grain')) {
            tl.fromTo(section,
                { autoAlpha: 0, y: 30 },
                { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out" },
                "-=0.9"
            );
        } else {
            gsap.fromTo(section,
                { autoAlpha: 0, y: 40 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                    },
                    autoAlpha: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out"
                }
            );
        }
    });

    // 4. Philosophy Text specialized split
    gsap.set('#philosophy-text', { autoAlpha: 1 }); // Clear CSS hidden state
    const philosophyText = new SplitType('#philosophy-text', { types: 'chars' });
    philosophyText.chars.forEach(char => {
        // Emulate the CSS scale hover via JS for better control, or let CSS handle it.
        // The CSS is currently handling it beautifully, so we leave it! 
        // But we add an entrance animation:
        gsap.from(char, {
            scrollTrigger: {
                trigger: '#philosophy-text',
                start: "top 80%"
            },
            autoAlpha: 0,
            y: 20,
            scale: 0.8,
            duration: 0.6,
            stagger: 0.01,
            ease: "back.out(1.5)"
        });
    });

    // Refresh ScrollTrigger after initial DOM load to fix layout offsets
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
});

// ── JSON Card 3D Tilt ──
const jsonCard = document.getElementById('json-card');
if (jsonCard) {
    let ticking = false;
    jsonCard.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const rect = jsonCard.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                const tiltX = y * -15;  // deeper tilt
                const tiltY = x * 15;

                gsap.to(jsonCard, {
                    rotationX: tiltX,
                    rotationY: tiltY,
                    transformPerspective: 800,
                    scale: 1.02,
                    duration: 0.4,
                    ease: "power2.out"
                });
                ticking = false;
            });
            ticking = true;
        }
    });
    jsonCard.addEventListener('mouseleave', () => {
        gsap.to(jsonCard, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.4)"
        });
    });
}

// ── Live Clock ──
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    const options = { timeZoneName: 'short' };
    const tzName = new Intl.DateTimeFormat('en-US', options).format(now).split(' ').pop();
    clockElement.textContent = `${timeString} (${tzName})`;
}
setInterval(updateClock, 1000);
updateClock();

// ── jQuery Ripples (Untouched logic, wrapped safely) ──
if (typeof jQuery !== 'undefined') {
    $(document).ready(function () {
        const $rippleSection = $('#water-ripple-wrapper');

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const grd = ctx.createLinearGradient(0, 0, 512, 512);
        grd.addColorStop(0, '#FFFFFF');
        grd.addColorStop(0.4, '#F5F0EB');
        grd.addColorStop(1, '#D8D0C8');

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 512, 512);
        const bgUrl = canvas.toDataURL();

        $rippleSection.css({
            'background-image': `url(${bgUrl})`,
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'background-attachment': 'fixed'
        });

        try {
            $rippleSection.ripples({
                resolution: 256,
                dropRadius: 80,
                perturbance: 0.05,
                interactive: false
            });

            $rippleSection.on('mousedown touchstart', function (e) {
                let clientX = e.clientX || (e.touches && e.touches[0].clientX);
                let clientY = e.clientY || (e.touches && e.touches[0].clientY);

                if (clientX !== undefined && clientY !== undefined) {
                    const offset = $rippleSection.offset();
                    const x = clientX - offset.left;
                    const y = clientY - offset.top + $(window).scrollTop();
                    $rippleSection.ripples('drop', x, y, 80, 0.15);
                }
            });
        } catch (e) {
            console.warn("WebGL ripples failed to initialize.");
        }
    });
}
