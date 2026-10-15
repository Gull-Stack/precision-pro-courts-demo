// ── Mobile Nav ──
function closeMobileMenu() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('mobileToggle').textContent = '☰';
  document.body.classList.remove('menu-open');
}

document.getElementById('mobileToggle').addEventListener('click', () => {
  const links = document.getElementById('navLinks');
  const toggle = document.getElementById('mobileToggle');
  const body = document.body;
  
  links.classList.toggle('open');
  body.classList.toggle('menu-open', links.classList.contains('open'));
  toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
});

// Close button in mobile menu
document.getElementById('mobileClose').addEventListener('click', closeMobileMenu);

// Close menu when clicking any navigation link
// (except the Services toggle, which opens its list in the drawer)
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    if ((a.matches('.nav-dropdown > a') || a.matches('.dropdown-sub > a')) && window.innerWidth <= 1024) return;
    closeMobileMenu();
  });
});

// ── Mobile dropdown functionality ──
document.querySelectorAll('.nav-dropdown > a').forEach(dropdownToggle => {
  dropdownToggle.addEventListener('click', (e) => {
    // Only prevent default and handle dropdown on mobile
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      const dropdown = dropdownToggle.parentElement;
      const wasActive = dropdown.classList.contains('active');
      
      // Close all other dropdowns
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
      
      // Toggle current dropdown
      if (!wasActive) {
        dropdown.classList.add('active');
      }
    }
  });
});

// ── Phone menu: tap Court Surfacing / Concrete to open their lists ──
document.querySelectorAll('.dropdown-sub > a').forEach(subToggle => {
  subToggle.addEventListener('click', (e) => {
    if (window.innerWidth > 1024) return;
    e.preventDefault();
    const sub = subToggle.parentElement;
    const wasOpen = sub.classList.contains('open');
    document.querySelectorAll('.dropdown-sub').forEach(d => d.classList.remove('open'));
    if (!wasOpen) sub.classList.add('open');
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

  const fullSrc = (img) => img.dataset.full || img.src;

  galleryItems.forEach((img, i) => {
    const item = img.closest('.gallery-item');
    item.addEventListener('click', () => {
      currentIdx = i;
      lbImg.src = fullSrc(img);
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
    lbImg.src = fullSrc(galleryItems[currentIdx]);
    lbImg.alt = galleryItems[currentIdx].alt;
  }
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

// GA4 event tracking handled by ga4-events.js

// Footer "Paint your court" toy. Colors match the court designer palette;
// the "Design it full size" link hands them over as ?sport=&play=&kitchen=&surround=.
(function paintCourt() {
  const root = document.getElementById('paintCourt');
  if (!root) return;
  const COLORS = [
    ['Competition Green', '#4A7B3F'], ['Performance Green', '#5A8A52'], ['Dark Green', '#275E37'],
    ['Competition Blue', '#1A3366'], ['Light Blue', '#3A6BB5'], ['Ice Blue', '#CCD9E0'],
    ['Tournament Purple', '#4B3F8C'], ['Red', '#8D3C1E'], ['Orange', '#FF6600'],
    ['Sandstone', '#B3A57A'], ['Beige', '#867A6F'], ['Slate', '#5A6A72'],
    ['Grey', '#8C8E8E'], ['Dove Grey', '#B4B4B4'], ['Black', '#1A1A1A']
  ];
  const picked = { play: '#1A3366', kitchen: '#3A6BB5', surround: '#4A7B3F' };
  let part = 'play';
  const go = document.getElementById('paintGo');
  const swatches = document.getElementById('paintSwatches');

  function setPart(p) {
    part = p;
    root.querySelectorAll('.paint-parts button').forEach(b => b.classList.toggle('active', b.dataset.part === p));
    swatches.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.hex === picked[p]));
  }
  function paint(p, hex, name) {
    picked[p] = hex;
    root.querySelectorAll(`svg [data-part="${p}"]`).forEach(el => el.setAttribute('fill', hex));
    document.getElementById('pcName-' + p).textContent = name;
    const q = new URLSearchParams({ sport: 'pickleball', play: picked.play.slice(1), kitchen: picked.kitchen.slice(1), surround: picked.surround.slice(1) });
    go.href = go.href.split('?')[0] + '?' + q;
    setPart(part);
  }

  COLORS.forEach(([name, hex]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.style.background = hex;
    b.dataset.hex = hex;
    b.title = name;
    b.setAttribute('aria-label', name);
    b.addEventListener('click', () => paint(part, hex, name));
    swatches.appendChild(b);
  });
  root.querySelectorAll('[data-part]').forEach(el => el.addEventListener('click', () => setPart(el.dataset.part)));
  document.getElementById('paintShuffle').addEventListener('click', () => {
    const pool = COLORS.slice().sort(() => Math.random() - 0.5);
    ['play', 'kitchen', 'surround'].forEach((p, i) => paint(p, pool[i][1], pool[i][0]));
  });
  paint('play', picked.play, 'Competition Blue');
})();
