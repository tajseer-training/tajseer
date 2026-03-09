/* ============================================================
   TAJSEER — script.js
   ============================================================ */

/* ── Navbar scroll effect ─────────────────────────────────── */
const nav = document.querySelector('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });
}

/* ── Mobile hamburger menu ────────────────────────────────── */
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        hamburger.classList.toggle('active');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

/* ── Scroll animations (fade-up, fade-left, etc.) ─────────── */
const animatedEls = document.querySelectorAll(
    '.fade-up, .fade-down, .fade-left, .fade-right, .fade-scale, .fade-rotate'
);

const delays = { d1: 0, d2: 120, d3: 240, d4: 360, d5: 480 };

function getDelay(el) {
    for (const [cls, ms] of Object.entries(delays)) {
        if (el.classList.contains(cls)) return ms;
    }
    return 0;
}

function getInitialTransform(el) {
    if (el.classList.contains('fade-up')) return 'translateY(32px)';
    if (el.classList.contains('fade-down')) return 'translateY(-32px)';
    if (el.classList.contains('fade-left')) return 'translateX(32px)';
    if (el.classList.contains('fade-right')) return 'translateX(-32px)';
    if (el.classList.contains('fade-scale')) return 'scale(0.9)';
    if (el.classList.contains('fade-rotate')) return 'rotate(-6deg) scale(0.9)';
    return 'none';
}

// Set initial state
animatedEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = getInitialTransform(el);
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const delay = getDelay(el);
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }, delay);
            observer.unobserve(el);
        }
    });
}, { threshold: 0.12 });

animatedEls.forEach(el => observer.observe(el));

/* ── Team carousel ────────────────────────────────────────── */
const track = document.getElementById('tmTrack');
const prevBtn = document.getElementById('tmPrev');
const nextBtn = document.getElementById('tmNext');
const dotsWrap = document.getElementById('tmDots');

if (track && prevBtn && nextBtn) {
    const cards = Array.from(track.querySelectorAll('.tm-card'));
    let current = 0;

    function getVisible() {
        if (window.innerWidth >= 1024) return 5;
        if (window.innerWidth >= 768) return 3;
        return 2;
    }

    function maxIndex() {
        return Math.max(0, cards.length - getVisible());
    }

    function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        const total = maxIndex() + 1;
        for (let i = 0; i < total; i++) {
            const d = document.createElement('button');
            d.className = 'tm-dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(d);
        }
    }

    function updateDots() {
        if (!dotsWrap) return;
        dotsWrap.querySelectorAll('.tm-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function goTo(index) {
        current = Math.max(0, Math.min(index, maxIndex()));
        const cardWidth = cards[0].offsetWidth + 24; // gap = 1.5rem ≈ 24px
        track.style.transform = `translateX(${current * -cardWidth}px)`;
        track.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
        updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    window.addEventListener('resize', () => { buildDots(); goTo(current); });

    buildDots();
    goTo(0);
}

/* ── Animated stat counters ───────────────────────────────── */
function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start) + suffix;
        }
    }, step);
}

const statNumbers = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const raw = el.textContent.trim();
            const num = parseInt(raw.replace(/\D/g, ''), 10);
            const suffix = raw.replace(/[\d]/g, '');
            if (!isNaN(num)) animateCounter(el, num, suffix);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));

/* ── Smooth scroll for anchor links ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});