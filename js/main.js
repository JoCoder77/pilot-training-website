/* ============================================
   Coral Sky Aviation — Main JS
   ============================================ */

/* --- Navigation --- */
(function () {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.nav-mobile-overlay');
  if (!nav) return;

  const tick = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', tick, { passive: true });
  tick();

  if (!document.querySelector('.hero') && !document.querySelector('.page-hero')) {
    nav.classList.add('scrolled');
  }

  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('active');
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }
})();

/* --- Scroll reveal (AOS-style) --- */
(function () {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('aos-animate'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* --- Counter animation --- */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const run = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const dur = 2000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        run(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
})();

/* --- Pathway line animation --- */
(function () {
  const fill = document.querySelector('.pathway-line-fill');
  const section = document.querySelector('.pathway');
  if (!fill || !section) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { fill.classList.add('animate'); obs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  obs.observe(section);
})();

/* --- Hero particles (canvas) --- */
(function () {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const count = 55;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.18,
    o: Math.random() * 0.07 + 0.02,
    blur: Math.random() * 3,
  }));

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
      ctx.save();
      ctx.globalAlpha = p.o;
      if (p.blur > 0) ctx.filter = `blur(${p.blur}px)`;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(animate);
  };
  animate();
})();

/* --- Testimonials carousel --- */
(function () {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.testimonials-dot');
  const cards = document.querySelectorAll('.testimonial-card');
  if (!track || !cards.length) return;

  let idx = 0;
  let timer;

  const go = (i) => {
    idx = (i + cards.length) % cards.length;
    track.scrollTo({ left: cards[idx].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    dots.forEach((d, j) => d.classList.toggle('active', j === idx));
  };

  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); clearInterval(timer); timer = setInterval(() => go(idx + 1), 5200); }));
  if (dots[0]) dots[0].classList.add('active');
  timer = setInterval(() => go(idx + 1), 5200);
})();

/* --- Contact form (Formspree) --- */
(function () {
  const form = document.querySelector('.enquiry-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const ok = document.querySelector('.form-success');
    const err = document.querySelector('.form-error');
    const orig = btn.innerHTML;
    btn.innerHTML = 'SENDING…'; btn.disabled = true;
    if (ok) ok.style.display = 'none';
    if (err) err.style.display = 'none';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { form.reset(); if (ok) ok.style.display = 'block'; }
      else throw new Error();
    } catch (_) { if (err) err.style.display = 'block'; }
    finally { btn.innerHTML = orig; btn.disabled = false; }
  });
})();
