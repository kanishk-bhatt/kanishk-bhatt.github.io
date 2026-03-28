/* ═══════════════════════════════════════
   NAV — Navbar, Floating Dock, Hamburger,
   Smooth Scroll, Back-to-Top
   ═══════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');
  const dockItems = document.querySelectorAll('.dock-item');

  function updateActiveSection() {
    const scrollY = window.scrollY;

    // Navbar background
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 60);
    }

    // Find current section
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 150;
      if (scrollY >= top) current = s.getAttribute('id');
    });

    // Update nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });

    // Update dock items
    dockItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === '#' + current) item.classList.add('active');
    });
  }

  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();

  /* ─── HAMBURGER ─── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── BACK TO TOP ─── */
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 500);
    });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── SMOOTH SCROLL — All anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ─── FLOATING DOCK — macOS magnify effect ─── */
  const dock = document.querySelector('.floating-dock');
  if (dock) {
    const items = dock.querySelectorAll('.dock-item');

    dock.addEventListener('mousemove', (e) => {
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const dist = Math.abs(e.clientX - cx);
        const maxDist = 120;

        if (dist < maxDist) {
          const scale = 1 + 0.3 * (1 - dist / maxDist);
          item.style.width = (42 * scale) + 'px';
          item.style.height = (42 * scale) + 'px';
        } else {
          item.style.width = '';
          item.style.height = '';
        }
      });
    });

    dock.addEventListener('mouseleave', () => {
      items.forEach(item => {
        item.style.width = '';
        item.style.height = '';
      });
    });
  }

  /* ─── CONTACT FORM — Formspree ─── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const statusEl = document.getElementById('form-status');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.style.pointerEvents = 'none';

      try {
        const resp = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (resp.ok) {
          if (statusEl) {
            statusEl.className = 'form-status success';
            statusEl.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
          }
          btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
          form.reset();
        } else {
          throw new Error('Submit failed');
        }
      } catch (err) {
        if (statusEl) {
          statusEl.className = 'form-status error';
          statusEl.textContent = '✗ Something went wrong. Please try again or email me directly.';
        }
        btn.innerHTML = '<i class="fas fa-times"></i> Failed';
      }

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.pointerEvents = '';
        if (statusEl) {
          setTimeout(() => { statusEl.className = 'form-status'; }, 3000);
        }
      }, 3000);
    });
  }

  /* ─── LANGUAGE RING SVG GRADIENT ─── */
  const svgNS = 'http://www.w3.org/2000/svg';
  const langRings = document.querySelectorAll('.lang-ring svg');
  langRings.forEach(svg => {
    if (svg.querySelector('defs')) return;
    const defs = document.createElementNS(svgNS, 'defs');
    const grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', 'lang-gradient');
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '100%');
    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#ff6b35');
    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#ffc107');
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    svg.prepend(defs);
  });

})();
