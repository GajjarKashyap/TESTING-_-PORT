// Navbar scroll & entrance effect
const navbar = document.getElementById('navbar');

// Initial entrance animation
setTimeout(() => {
    navbar.classList.remove('-translate-y-full');
}, 100);

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.remove('py-8');
        navbar.classList.add('py-5');
    } else {
        navbar.classList.add('py-8');
        navbar.classList.remove('py-5');
    }
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.nav-menu-link');
const menuText = hamburger.querySelector('span'); // The "Menu" text
const bars = hamburger.querySelectorAll('div > span'); // The two lines

function toggleMenu() {
    const isHidden = mobileMenu.classList.contains('hidden');

    if (isHidden) {
        // Open Menu
        mobileMenu.classList.remove('hidden');
        // Force reflow
        void mobileMenu.offsetWidth;
        mobileMenu.classList.remove('-translate-y-full');

        // Animate hamburger to X
        if (menuText) menuText.textContent = "CLOSE";
        bars[0].classList.add('translate-y-[3.5px]', 'rotate-45');
        bars[1].classList.add('-translate-y-[3.5px]', '-rotate-45');

        document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
        // Close Menu
        mobileMenu.classList.add('-translate-y-full');

        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 700);

        // Revert hamburger
        if (menuText) menuText.textContent = "MENU";
        bars[0].classList.remove('translate-y-[3.5px]', 'rotate-45');
        bars[1].classList.remove('-translate-y-[3.5px]', '-rotate-45');

        document.body.style.overflow = ''; // Restore scrolling
    }
}

hamburger.addEventListener('click', toggleMenu);

// Close menu on link click
mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// Fade-in animation
const fadeElements = document.querySelectorAll('.fade-in-section');

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    observer.observe(element);
});

// Smooth Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    // Show cursor on first move
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows instantly without transition for zero latency
        cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    });

    // Smooth trailing outline using requestAnimationFrame and linear interpolation (lerp)
    const renderCursor = () => {
        const dx = mouseX - outlineX;
        const dy = mouseY - outlineY;

        // Adjust the multiplier (0.15) to change the "drag" or "weight" of the cursor
        outlineX += dx * 0.15;
        outlineY += dy * 0.15;

        cursorOutline.style.transform = `translate(calc(${outlineX}px - 50%), calc(${outlineY}px - 50%))`;

        requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hover effects for links and buttons
    const handleHoverEnter = () => {
        cursorOutline.classList.add('w-[80px]', 'h-[80px]', 'bg-white');
        cursorOutline.classList.remove('w-10', 'h-10');
        cursorDot.classList.add('opacity-0'); // Hide dot on hover
    };

    const handleHoverLeave = () => {
        cursorOutline.classList.remove('w-[80px]', 'h-[80px]', 'bg-white', 'w-[150px]', 'h-[150px]', 'w-[200px]', 'h-[200px]', 'w-[250px]', 'h-[250px]');
        cursorOutline.classList.add('w-10', 'h-10');
        cursorDot.classList.remove('opacity-0');
    };

    // Specific huge hover for massive text
    const handleTextHoverEnter = () => {
        cursorOutline.classList.add('w-[200px]', 'h-[200px]', 'bg-white');
        cursorOutline.classList.remove('w-10', 'h-10');
        cursorDot.classList.add('opacity-0');
    };

    // Attach to all interactables (and re-attach if DOM changes, though static here)
    const interactables = document.querySelectorAll('a, button, .nav-menu-link, .btn-outline, .skill-pill');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', handleHoverEnter);
        el.addEventListener('mouseleave', handleHoverLeave);
    });

    // Attach huge hover to massive text blocks
    const massiveTexts = document.querySelectorAll('.text-hover-interact');
    massiveTexts.forEach(el => {
        el.addEventListener('mouseenter', handleTextHoverEnter);
        el.addEventListener('mouseleave', handleHoverLeave);
    });

    // Magnetic Elements Physics
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) * 0.4;
            const y = (e.clientY - top - height / 2) * 0.4;

            el.style.transform = `translate(${x}px, ${y}px)`;
            el.style.transition = `transform 0.1s ease-out`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
            el.style.transition = `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)`;
        });
    });
}

// Live Clock functionality
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

    // Add Timezone for that Bettina Sosa style
    const options = { timeZoneName: 'short' };
    const tzName = new Intl.DateTimeFormat('en-US', options).format(now).split(' ').pop();

    clockElement.textContent = `${timeString} (${tzName})`;
}

setInterval(updateClock, 1000);
updateClock(); // Initial call
// ----- Realistic Interactive WebGL Ripple on Hero -----

$(document).ready(function () {
    const $heroText = $('h1.text-hover-interact');
    const $rippleSection = $('#water-ripple-wrapper');

    // WebGL ripples needs a background image to refract.
    // We create a canvas with a rich gradient to provide deep shadows 
    // for the ripples to warp, making the water effect highly visible.
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Create a high-contrast gradient for sharp water shadows
    // Top-left: lighter, Bottom-right: darker shadows
    const grd = ctx.createLinearGradient(0, 0, 1024, 1024);
    grd.addColorStop(0, '#FFFFFF'); // Highlight
    grd.addColorStop(0.4, '#F5F0EB'); // Main Theme Bg
    grd.addColorStop(1, '#D8D0C8'); // Deep Shadow color matching the theme

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1024, 1024);
    const bgUrl = canvas.toDataURL();

    $rippleSection.css({
        'background-image': `url(${bgUrl})`,
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-attachment': 'fixed' // Makes the gradient span smoothly as you scroll
    });

    try {
        $rippleSection.ripples({
            resolution: 512, // High resolution for smooth water
            dropRadius: 50, // Massive base radius spreads the wave out
            perturbance: 0.05, // Lower perturbance makes the water less "choppy" and more glassy
            // Disable mousemove ripples
            interactive: false
        });

        // Trigger a drop wave ANYWHERE in the wrapper on click, not hover
        $rippleSection.on('mousedown touchstart', function (e) {
            // Get correct coordinates from event
            let clientX = e.clientX || (e.touches && e.touches[0].clientX);
            let clientY = e.clientY || (e.touches && e.touches[0].clientY);

            if (clientX !== undefined && clientY !== undefined) {
                // Calculate position relative to the wrapper
                const offset = $rippleSection.offset();
                const x = clientX - offset.left;
                const y = clientY - offset.top + $(window).scrollTop();

                // By using a massive radius (80) and low strength (0.15), 
                // it creates exactly 3 to 5 thick, slow waves instead of a buzzing vibration
                $rippleSection.ripples('drop', x, y, 80, 0.15);
            }
        });

    } catch (e) {
        console.warn("WebGL ripples failed to initialize.", e);
    }
});
