/* ═══════════════════════════════════════
   EFFECTS — Custom Cursor, Click Spark (SVG),
   Splash Cursor, Border Glow, Meteors,
   Decrypted Text
   ═══════════════════════════════════════ */

(function() {

  /* ═══ CUSTOM CURSOR ═══ */
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    dot.style.left = cursorX + 'px';
    dot.style.top = cursorY + 'px';
  });

  // Smooth cursor follow
  function cursorLoop() {
    dotX += (cursorX - dotX) * 0.5;
    dotY += (cursorY - dotY) * 0.5;
    cursor.style.left = dotX + 'px';
    cursor.style.top = dotY + 'px';
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  // Hover detection
  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('a, button, .btn, .dock-item, .cert-card, .project-link, .social-icon, .skill-card, .nav-resume, .theme-toggle');
    if (el) cursor.classList.add('cursor-hover');
    else cursor.classList.remove('cursor-hover');
  });

  /* ═══ CLICK SPARK — SVG Line-based (ReactBits style) ═══ */
  const sparkContainer = document.createElement('div');
  sparkContainer.className = 'click-spark-container';
  document.body.appendChild(sparkContainer);

  document.addEventListener('click', (e) => {
    createClickSpark(e.clientX, e.clientY);
  });

  function createClickSpark(x, y) {
    const sparkCount = 8;
    const sparkRadius = 20;
    const sparkLength = 12;
    const duration = 500;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    svg.setAttribute('viewBox', '-50 -50 100 100');
    svg.style.cssText = `position:fixed;left:${x}px;top:${y}px;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);`;

    const colors = ['#8b5cf6', '#a78bfa', '#2dd4bf', '#f472b6', '#fbbf24', '#c4b5fd'];

    for (let i = 0; i < sparkCount; i++) {
      const angle = (i * (360 / sparkCount)) * (Math.PI / 180);
      const x1 = Math.cos(angle) * sparkRadius;
      const y1 = Math.sin(angle) * sparkRadius;
      const x2 = Math.cos(angle) * (sparkRadius + sparkLength);
      const y2 = Math.sin(angle) * (sparkRadius + sparkLength);

      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', colors[i % colors.length]);
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-linecap', 'round');
      line.style.cssText = `opacity:1;transform-origin:center;`;

      // Animate
      line.animate([
        { transform: 'scale(0.5)', opacity: 1 },
        { transform: 'scale(1.8)', opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      });

      svg.appendChild(line);
    }

    // Center dot burst
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '0');
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', '#8b5cf6');
    circle.animate([
      { r: '3', opacity: 1 },
      { r: '12', opacity: 0 }
    ], {
      duration: duration * 0.8,
      easing: 'ease-out',
      fill: 'forwards'
    });
    svg.appendChild(circle);

    document.body.appendChild(svg);
    setTimeout(() => svg.remove(), duration + 50);
  }

  /* ═══ DECRYPTED TEXT EFFECT ═══ */
  class DecryptedText {
    constructor(el) {
      this.el = el;
      this.finalText = el.getAttribute('data-text') || el.textContent;
      this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      this.duration = parseInt(el.getAttribute('data-duration')) || 2000;
      this.started = false;

      this.el.textContent = this.scramble(this.finalText.length);

      const ob = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.started) {
            this.started = true;
            this.animate();
          }
        });
      }, { threshold: 0.5 });
      ob.observe(this.el);
    }

    scramble(len) {
      let s = '';
      for (let i = 0; i < len; i++) {
        s += this.chars[Math.floor(Math.random() * this.chars.length)];
      }
      return s;
    }

    animate() {
      const startTime = performance.now();
      const len = this.finalText.length;

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        const revealed = Math.floor(progress * len);

        let display = '';
        for (let i = 0; i < len; i++) {
          if (i < revealed) {
            display += this.finalText[i];
          } else {
            display += this.chars[Math.floor(Math.random() * this.chars.length)];
          }
        }
        this.el.textContent = display;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          this.el.textContent = this.finalText;
        }
      };
      requestAnimationFrame(tick);
    }
  }

  /* ═══ SPLASH CURSOR — WebGL Fluid ═══ */
  const splashCanvas = document.getElementById('splash-canvas');
  if (splashCanvas) {
    const gl = splashCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (gl) {
      splashCanvas.width = window.innerWidth;
      splashCanvas.height = window.innerHeight;
      gl.viewport(0, 0, splashCanvas.width, splashCanvas.height);

      let mouseX = 0, mouseY = 0, prevMouseX = 0, prevMouseY = 0;
      let ripples = [];
      const maxRipples = 30;

      document.addEventListener('mousemove', (e) => {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;

        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 2) {
          // Multi-color ripples
          const hues = [270, 175, 330, 45];
          ripples.push({
            x: mouseX / splashCanvas.width,
            y: 1 - mouseY / splashCanvas.height,
            size: Math.min(speed * 0.003, 0.06),
            life: 1.0,
            hue: hues[Math.floor(Math.random() * hues.length)] + Math.random() * 20 - 10
          });
          if (ripples.length > maxRipples) ripples.shift();
        }
      });

      const vsSource = `
        attribute vec2 a_position;
        void main() { gl_Position = vec4(a_position, 0, 1); }
      `;
      const fsSource = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_ripples[30];
        uniform float u_sizes[30];
        uniform float u_lives[30];
        uniform float u_hues[30];
        uniform int u_count;

        vec3 hsl2rgb(float h, float s, float l) {
          float c = (1.0 - abs(2.0*l - 1.0)) * s;
          float x = c * (1.0 - abs(mod(h/60.0, 2.0) - 1.0));
          float m = l - c/2.0;
          vec3 rgb;
          if (h < 60.0) rgb = vec3(c,x,0);
          else if (h < 120.0) rgb = vec3(x,c,0);
          else if (h < 180.0) rgb = vec3(0,c,x);
          else if (h < 240.0) rgb = vec3(0,x,c);
          else if (h < 300.0) rgb = vec3(x,0,c);
          else rgb = vec3(c,0,x);
          return rgb + m;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution;
          vec4 color = vec4(0.0);
          for (int i = 0; i < 30; i++) {
            if (i >= u_count) break;
            float dist = distance(uv, u_ripples[i]);
            float r = u_sizes[i];
            float life = u_lives[i];
            if (dist < r) {
              float intensity = smoothstep(r, 0.0, dist) * life * 0.35;
              vec3 c = hsl2rgb(u_hues[i], 0.7, 0.55);
              color += vec4(c * intensity, intensity * 0.4);
            }
          }
          gl_FragColor = color;
        }
      `;

      function createShader(type, source) {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          gl.deleteShader(s);
          return null;
        }
        return s;
      }

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

      if (vs && fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(program, 'u_resolution');
        const uTime = gl.getUniformLocation(program, 'u_time');
        const uCount = gl.getUniformLocation(program, 'u_count');

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        function renderSplash() {
          gl.viewport(0, 0, splashCanvas.width, splashCanvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.uniform2f(uRes, splashCanvas.width, splashCanvas.height);
          gl.uniform1f(uTime, performance.now() * 0.001);
          gl.uniform1i(uCount, ripples.length);

          for (let i = 0; i < 30; i++) {
            const r = ripples[i] || { x: 0, y: 0, size: 0, life: 0, hue: 270 };
            gl.uniform2f(gl.getUniformLocation(program, `u_ripples[${i}]`), r.x, r.y);
            gl.uniform1f(gl.getUniformLocation(program, `u_sizes[${i}]`), r.size);
            gl.uniform1f(gl.getUniformLocation(program, `u_lives[${i}]`), r.life);
            gl.uniform1f(gl.getUniformLocation(program, `u_hues[${i}]`), r.hue);
          }

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

          ripples.forEach(r => {
            r.life -= 0.008;
            r.size += 0.0005;
          });
          ripples = ripples.filter(r => r.life > 0);

          requestAnimationFrame(renderSplash);
        }
        renderSplash();

        window.addEventListener('resize', () => {
          splashCanvas.width = window.innerWidth;
          splashCanvas.height = window.innerHeight;
        });
      }
    }
  }

  /* ═══ BORDER GLOW — Mouse follow on ALL glow-target cards ═══ */
  document.addEventListener('mousemove', (e) => {
    const glowTargets = document.querySelectorAll(
      '.border-glow-card, .skill-card, .timeline-content, .cert-card, .contact-form, .stat-item, .social-icon'
    );
    glowTargets.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', x + 'px');
      card.style.setProperty('--glow-y', y + 'px');
    });
  });

  /* ═══ SPOTLIGHT ═══ */
  const spotlight = document.getElementById('spotlight');
  if (spotlight) {
    document.addEventListener('mousemove', (e) => {
      spotlight.style.setProperty('--mouse-x', (e.clientX / window.innerWidth * 100) + '%');
      spotlight.style.setProperty('--mouse-y', (e.clientY / window.innerHeight * 100) + '%');
    });
  }

  /* ═══ METEORS — Multi-color ═══ */
  function spawnMeteor() {
    const m = document.createElement('div');
    const colors = ['purple', 'teal', 'rose'];
    m.className = 'meteor ' + colors[Math.floor(Math.random() * colors.length)];
    m.style.height = (Math.random() * 150 + 50) + 'px';
    m.style.left = Math.random() * window.innerWidth + 'px';
    m.style.top = '-50px';
    m.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 4000);
  }
  setInterval(() => { if (Math.random() > 0.5) spawnMeteor(); }, 3000);

  /* ═══ INIT DECRYPTED TEXT ═══ */
  document.querySelectorAll('[data-decrypt]').forEach(el => new DecryptedText(el));

  /* ═══ CERTIFICATE MODAL ═══ */
  const certModal = document.getElementById('cert-modal');
  const certModalOverlay = document.getElementById('cert-modal-overlay');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalFrame = document.getElementById('cert-modal-frame');
  const certModalClose = document.getElementById('cert-modal-close');

  if (certModal && certModalOverlay) {
    // Open modal on cert card click
    document.querySelectorAll('.cert-card[data-preview]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const previewUrl = card.getAttribute('data-preview');
        const title = card.querySelector('.cert-title').textContent;
        if (certModalTitle) certModalTitle.textContent = title;
        if (certModalFrame) certModalFrame.src = previewUrl;
        certModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal
    if (certModalClose) {
      certModalClose.addEventListener('click', closeCertModal);
    }
    certModalOverlay.addEventListener('click', (e) => {
      if (e.target === certModalOverlay) closeCertModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCertModal();
    });

    function closeCertModal() {
      certModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (certModalFrame) certModalFrame.src = '';
      }, 350);
    }
  }

})();
