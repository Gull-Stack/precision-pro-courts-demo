// ── Mobile Nav ──
document.getElementById('mobileToggle').addEventListener('click', () => {
  const links = document.getElementById('navLinks');
  const toggle = document.getElementById('mobileToggle');
  links.classList.toggle('open');
  toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('mobileToggle').textContent = '☰';
  });
});

// ── Nav scroll effect ──
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

// ── Sticky CTA bar ──
const stickyCta = document.getElementById('stickyCta');
if (stickyCta) {
  const hero = document.querySelector('.hero') || document.querySelector('.page-hero');
  if (hero) {
    const obs = new IntersectionObserver(([e]) => {
      stickyCta.classList.toggle('visible', !e.isIntersecting);
    }, { threshold: 0.1 });
    obs.observe(hero);
  } else {
    // No hero, show after scroll
    window.addEventListener('scroll', () => {
      stickyCta.classList.toggle('visible', window.scrollY > 300);
    });
  }
}

// ── Fade-up on scroll ──
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }});
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ── Animated counters ──
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.textContent.replace(/[0-9]/g, '');
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current + suffix;
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── FAQ accordion ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const wasActive = btn.classList.contains('active');
    document.querySelectorAll('.faq-q').forEach(b => { b.classList.remove('active'); b.nextElementSibling.classList.remove('open'); });
    if (!wasActive) { btn.classList.add('active'); btn.nextElementSibling.classList.add('open'); }
  });
});

// ── Lightbox ──
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = lightbox.querySelector('img');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  let currentIdx = 0;

  galleryItems.forEach((img, i) => {
    img.parentElement.addEventListener('click', () => {
      currentIdx = i;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav.next');
  if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function navigateLightbox(dir) {
    currentIdx = (currentIdx + dir + galleryItems.length) % galleryItems.length;
    lbImg.src = galleryItems[currentIdx].src;
    lbImg.alt = galleryItems[currentIdx].alt;
  }
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}
