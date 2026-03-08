/* ============================================================
   TAJSEER — script.js
   ============================================================ */

/* ── 1. Navbar scroll ────────────────────────────────────────── */
(function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ── 2. Hamburger ────────────────────────────────────────────── */
(function initHamburger() {
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        const bars = btn.querySelectorAll('span');
        if (isOpen) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            bars[0].style.transform = bars[1].style.opacity = bars[2].style.transform = '';
        }
    });
})();

function closeMobile() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('hamburger');
    if (!menu) return;
    menu.classList.remove('open');
    if (btn) {
        const bars = btn.querySelectorAll('span');
        bars[0].style.transform = bars[1].style.opacity = bars[2].style.transform = '';
    }
}

/* ── 3. SCROLL REVEAL — rich entrance animations ─────────────── */
(function initScrollReveal() {

    // Map each class to its hidden transform
    const STATES = {
        'fade-up': 'opacity:0; transform:translateY(50px)',
        'fade-down': 'opacity:0; transform:translateY(-40px)',
        'fade-left': 'opacity:0; transform:translateX(-60px)',
        'fade-right': 'opacity:0; transform:translateX(60px)',
        'fade-scale': 'opacity:0; transform:scale(0.85)',
        'fade-rotate': 'opacity:0; transform:rotate(-8deg) scale(0.9)',
    };

    const VISIBLE = 'opacity:1; transform:none';

    const TRANSITION = 'opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)';

    // Apply base transition to all animated elements
    const allEls = document.querySelectorAll(Object.keys(STATES).map(c => '.' + c).join(','));

    allEls.forEach(el => {
        el.style.transition = TRANSITION;
        // Start hidden only if NOT already in viewport
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight - 40;
        if (inView) {
            el.style.cssText += '; ' + VISIBLE;
        } else {
            // Pick which class this element has
            for (const cls of Object.keys(STATES)) {
                if (el.classList.contains(cls)) {
                    el.style.cssText += '; ' + STATES[cls];
                    break;
                }
            }
        }
    });

    // Observe and reveal on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            // Get delay from class d1–d5
            let delay = 0;
            if (el.classList.contains('d1')) delay = 80;
            if (el.classList.contains('d2')) delay = 160;
            if (el.classList.contains('d3')) delay = 240;
            if (el.classList.contains('d4')) delay = 320;
            if (el.classList.contains('d5')) delay = 400;

            setTimeout(() => {
                el.style.transition = `opacity 0.65s ${delay ? '0ms' : '0ms'} cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)`;
                el.style.transitionDelay = delay + 'ms';
                el.style.opacity = '1';
                el.style.transform = 'none';
            }, 30);

            observer.unobserve(el);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    allEls.forEach(el => observer.observe(el));

})();

/* ── 4. Smooth scroll ────────────────────────────────────────── */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const navH = document.getElementById('navbar')?.offsetHeight || 70;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
        });
    });
})();

/* ── 5. Active nav highlight ─────────────────────────────────── */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
    function setActive() {
        let current = '';
        const navH = document.getElementById('navbar')?.offsetHeight || 70;
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - navH - 10) current = s.id; });
        links.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === '#' + current) l.classList.add('active');
        });
    }
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
})();

/* ── 6. Counter animation ────────────────────────────────────── */
(function initCounters() {
    document.querySelectorAll('.stat-n, .metric-n').forEach(el => {
        const raw = el.textContent.trim();
        const prefix = raw.startsWith('+') ? '+' : '';
        const suffix = raw.endsWith('%') ? '%' : raw.endsWith('+') ? '+' : '';
        const num = parseInt(raw.replace(/[^0-9]/g, ''), 10);
        if (isNaN(num)) return;

        const obs = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) return;
            obs.disconnect();
            const start = performance.now();
            const dur = 1600;
            (function step(now) {
                const p = Math.min((now - start) / dur, 1);
                const e = 1 - Math.pow(1 - p, 3);
                el.textContent = prefix + Math.round(e * num) + suffix;
                if (p < 1) requestAnimationFrame(step);
            })(performance.now());
        }, { threshold: 0.5 });

        obs.observe(el);
    });
})();

/* ── 7. Card tilt on hover ───────────────────────────────────── */
(function initCardTilt() {
    document.querySelectorAll('.sv-card, .wcard, .p-badge').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
            card.style.transition = 'transform .1s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
        });
    });
})();

/* ── 8. Scroll progress bar ──────────────────────────────────── */
(function initProgressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#00c9c8,#1e7fd4);z-index:9999;width:0%;transition:width .1s linear;pointer-events:none;box-shadow:0 0 6px rgba(0,201,200,.5);';
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    }, { passive: true });
})();

/* ── Team Slider ─────────────────────────────────────────────── */
(function () {
    var track = document.getElementById('tmTrack');
    var prevBtn = document.getElementById('tmPrev');
    var nextBtn = document.getElementById('tmNext');
    var dotsEl = document.getElementById('tmDots');
    if (!track || !prevBtn || !nextBtn) return;

    var cards = Array.from(track.querySelectorAll('.tm-card'));
    var total = cards.length;
    var current = 0;
    var GAP = 16;
    var startX = 0;
    var startScroll = 0;
    var dragging = false;
    var lastX = 0;
    var vel = 0;

    // Build dots
    cards.forEach(function (_, i) {
        var dot = document.createElement('div');
        dot.className = 'tm-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', function () { goTo(i); });
        dotsEl.appendChild(dot);
    });

    function cardWidth() {
        return cards[0].offsetWidth + GAP;
    }

    function maxScroll() {
        return track.scrollWidth - track.parentElement.offsetWidth;
    }

    function goTo(idx) {
        current = Math.max(0, Math.min(idx, total - 1));
        // Scroll the track container
        var wrap = track.parentElement;
        var target = current * cardWidth();
        // smooth scroll
        smoothScroll(wrap, target);
        updateDots();
        updateCards();
    }

    function smoothScroll(el, target) {
        var start = el.scrollLeft;
        var dist = target - start;
        var dur = 420;
        var t0 = null;
        function step(ts) {
            if (!t0) t0 = ts;
            var prog = Math.min((ts - t0) / dur, 1);
            var ease = 1 - Math.pow(1 - prog, 3);
            el.scrollLeft = start + dist * ease;
            if (prog < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function updateDots() {
        var dots = dotsEl.querySelectorAll('.tm-dot');
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    function updateCards() {
        cards.forEach(function (c, i) {
            if (i === current) {
                c.style.transform = 'scale(1)';
                c.style.opacity = '1';
            } else {
                c.style.transform = 'scale(0.92)';
                c.style.opacity = '0.55';
            }
        });
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    // Touch
    track.parentElement.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startScroll = track.parentElement.scrollLeft;
        lastX = startX;
        vel = 0;
    }, { passive: true });

    track.parentElement.addEventListener('touchmove', function (e) {
        vel = e.touches[0].clientX - lastX;
        lastX = e.touches[0].clientX;
        var diff = startX - e.touches[0].clientX;
        track.parentElement.scrollLeft = startScroll + diff;
    }, { passive: true });

    track.parentElement.addEventListener('touchend', function () {
        var diff = startX - lastX;
        var momentum = -vel * 4;
        var projected = current * cardWidth() + diff + momentum;
        goTo(Math.round(projected / cardWidth()));
    });

    // Mouse drag
    track.parentElement.addEventListener('mousedown', function (e) {
        dragging = true;
        startX = e.clientX;
        startScroll = track.parentElement.scrollLeft;
        lastX = startX;
        vel = 0;
        track.parentElement.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        vel = e.clientX - lastX;
        lastX = e.clientX;
        track.parentElement.scrollLeft = startScroll - (e.clientX - startX);
    });

    window.addEventListener('mouseup', function (e) {
        if (!dragging) return;
        dragging = false;
        track.parentElement.style.cursor = 'grab';
        var diff = startX - e.clientX;
        var momentum = -vel * 3;
        var projected = current * cardWidth() + diff + momentum;
        goTo(Math.round(projected / cardWidth()));
    });

    // Keyboard
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') goTo(current - 1);
        if (e.key === 'ArrowLeft') goTo(current + 1);
    });

    // Init
    updateCards();
    updateDots();
})();