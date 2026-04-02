/* ═══════════════════════════════════════
   NAV — Scroll tracking, Dock magnification,
   Theme toggle, Form handling, Back to top
   ═══════════════════════════════════════ */

(function() {

  /* ═══ SCROLL PROGRESS ═══ */
  const scrollBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (scrollBar) scrollBar.style.width = pct + '%';
  }

  /* ═══ NAVBAR SCROLLED STATE ═══ */
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }

  /* ═══ ACTIVE SECTION TRACKING ═══ */
  const sections = document.querySelectorAll('section[id]');
  const dockItems = document.querySelectorAll('.dock-item');

  function updateActive() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 200;
      if (window.scrollY >= top) current = sec.id;
    });
    dockItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === '#' + current) item.classList.add('active');
      else item.classList.remove('active');
    });
  }

  /* ═══ BACK TO TOP ═══ */
  const backToTop = document.getElementById('back-to-top');
  function updateBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══ COMBINED SCROLL HANDLER ═══ */
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbar();
        updateActive();
        updateBackToTop();
        triggerAOS();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  /* ═══ AOS (Scroll-in animations) ═══ */
  function triggerAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const delay = parseInt(el.getAttribute('data-aos-delay') || '0');
      if (rect.top < window.innerHeight * 0.85) {
        setTimeout(() => el.classList.add('aos-in'), delay);
      }
    });
  }
  // Initial trigger
  setTimeout(triggerAOS, 300);

  /* ═══ SMOOTH ANCHOR NAV ═══ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ═══ DOCK MAGNIFICATION — macOS style ═══ */
  const dock = document.getElementById('floating-dock');
  if (dock) {
    dock.addEventListener('mousemove', (e) => {
      dockItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const dist = Math.abs(e.clientX - itemCenter);
        const maxDist = 120;
        if (dist < maxDist) {
          const scale = 1 + (1 - dist / maxDist) * 0.3;
          const lift = (1 - dist / maxDist) * 10;
          item.style.transform = `translateY(-${lift}px) scale(${scale})`;
        } else {
          item.style.transform = '';
        }
      });
    });

    dock.addEventListener('mouseleave', () => {
      dockItems.forEach(item => {
        item.style.transform = '';
      });
    });
  }

  /* ═══ THEME TOGGLE ═══ */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('kb-theme') || 'dark';
  if (savedTheme === 'light') html.setAttribute('data-theme', 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next === 'light' ? 'light' : '');
      if (next === 'dark') html.removeAttribute('data-theme');
      else html.setAttribute('data-theme', 'light');
      localStorage.setItem('kb-theme', next);
    });
  }

  /* ═══ NUMBER TICKER ═══ */
  const tickers = document.querySelectorAll('.ticker');
  const tickerOb = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const increment = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current;
        }, 40);
        tickerOb.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  tickers.forEach(t => tickerOb.observe(t));

  /* ═══ FORM HANDLING (Formspree) ═══ */
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (formStatus) {
            formStatus.textContent = '✅ Message sent! I\'ll get back to you soon.';
            formStatus.className = 'form-status success';
          }
          form.reset();
        } else {
          throw new Error('Failed');
        }
      } catch {
        if (formStatus) {
          formStatus.textContent = '❌ Something went wrong. Try again.';
          formStatus.className = 'form-status error';
        }
      }
      btn.innerHTML = origText;
      btn.disabled = false;
      if (formStatus) setTimeout(() => { formStatus.textContent = ''; }, 5000);
    });
  }

  /* ═══ RESUME DOWNLOAD HANDLER ═══ */
  const resumeBtn = document.getElementById('resume-download');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      // Google Drive direct download URL
      // The href already has export=download, just let it proceed
    });
  }

  /* ═══ INIT ═══ */
  updateScrollProgress();
  updateNavbar();
  updateActive();
  updateBackToTop();

})();
