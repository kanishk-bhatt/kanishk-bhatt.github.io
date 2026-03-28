/* ═══════════════════════════════════════
   EFFECTS — Meteors, Shooting Stars,
   Spotlight, 3D Card Tilt, Glow Cards
   ═══════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── METEOR SPAWNER — MagicUI style ─── */
  function spawnMeteor() {
    // Reduce on mobile
    if (window.innerWidth < 768) return;

    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    meteor.style.left = Math.random() * window.innerWidth + 'px';
    meteor.style.top = -100 + 'px';
    meteor.style.height = (60 + Math.random() * 60) + 'px';
    meteor.style.animationDuration = (1 + Math.random() * 1.5) + 's';
    document.body.appendChild(meteor);
    setTimeout(() => meteor.remove(), 3000);
  }

  // Spawn meteors at random intervals
  function meteorLoop() {
    spawnMeteor();
    setTimeout(meteorLoop, 3000 + Math.random() * 6000);
  }
  setTimeout(meteorLoop, 2000);

  /* ─── SHOOTING STARS — Aceternity style ─── */
  function spawnShootingStar() {
    if (window.innerWidth < 768) return;

    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.left = Math.random() * (window.innerWidth * 0.6) + 'px';
    star.style.top = Math.random() * (window.innerHeight * 0.4) + 'px';
    star.style.animationDuration = (1.5 + Math.random() * 1) + 's';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 4000);
  }

  function shootingLoop() {
    spawnShootingStar();
    setTimeout(shootingLoop, 5000 + Math.random() * 10000);
  }
  setTimeout(shootingLoop, 4000);

  /* ─── SPOTLIGHT — Mouse-follow radial gradient ─── */
  const spotlight = document.getElementById('spotlight');
  if (spotlight) {
    document.addEventListener('mousemove', (e) => {
      spotlight.style.setProperty('--mouse-x', e.clientX + 'px');
      spotlight.style.setProperty('--mouse-y', e.clientY + 'px');
    });
  }

  /* ─── SCROLL PROGRESS BAR ─── */
  const scrollBar = document.getElementById('scroll-progress');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const percent = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      scrollBar.style.width = percent + '%';
    });
  }

  /* ─── 3D CARD TILT — Aceternity style ─── */
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    const glow = card.querySelector('.card-glow');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 12;
      const rotateY = (x - 0.5) * 12;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glow) {
        glow.style.setProperty('--card-x', (x * 100) + '%');
        glow.style.setProperty('--card-y', (y * 100) + '%');
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── GLOW CARD — Mouse-follow inner glow ─── */
  const glowCards = document.querySelectorAll('.glow-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--card-x', x + '%');
      card.style.setProperty('--card-y', y + '%');
    });
  });

  /* ─── SKILL CARD MINI TILT ─── */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── TRACING BEAM — Scroll-linked ─── */
  const beamFill = document.querySelector('.tracing-beam-fill');
  const beamContainer = document.querySelector('.tracing-beam-container');
  const beamDots = document.querySelectorAll('.tracing-beam-dot');

  if (beamFill && beamContainer) {
    window.addEventListener('scroll', () => {
      const rect = beamContainer.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const viewH = window.innerHeight;

      // How much of the container has scrolled past
      const scrolled = Math.max(0, viewH * 0.5 - containerTop);
      const percent = Math.min(100, (scrolled / containerHeight) * 100);
      beamFill.style.height = percent + '%';

      // Activate dots
      beamDots.forEach(dot => {
        const dotRect = dot.getBoundingClientRect();
        if (dotRect.top < viewH * 0.6) {
          dot.classList.add('active');
        }
      });
    });
  }

  /* ─── GENERATE STAR PARTICLES in glow cards ─── */
  document.querySelectorAll('.glow-card[data-stars]').forEach(card => {
    for (let i = 0; i < 6; i++) {
      const star = document.createElement('div');
      star.className = 'star-particle';
      star.style.left = (10 + Math.random() * 80) + '%';
      star.style.top = (10 + Math.random() * 80) + '%';
      star.style.animationDelay = (Math.random() * 3) + 's';
      star.style.animationDuration = (2 + Math.random() * 2) + 's';
      card.appendChild(star);
    }
  });

})();
