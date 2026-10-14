/**
 * CAVENTRA — Premium Theme Switcher & Progressive Nanotechnology Reveal
 * Progressive View Transitions API with synchronized mechanical nanotech wave.
 * Uncovered areas strictly retain their original theme until reached.
 * Fully accessible, zero external dependencies, hardware accelerated.
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'cv_theme';
  const html = document.documentElement;

  // 1. Initial theme resolution (executes immediately to avoid FOUC)
  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  const initialTheme = getPreferredTheme();
  html.setAttribute('data-theme', initialTheme);

  let isTransitioning = false;

  function updateToggleState(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    const isLight = theme === 'light';
    toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    toggle.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    toggle.classList.toggle('light-active', isLight);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isLight ? '#F1EFE8' : '#0f1316');
    }
  }

  function updateThemeLogos(theme) {
    const isLight = theme === 'light';
    const logoNavSrc = isLight ? '/assets/logo-nav-light.png' : '/assets/logo-nav.png';
    const logoSrc = isLight ? '/assets/logo-light.png' : '/assets/logo.png';

    // 1. Navigation logo
    document.querySelectorAll('nav .mk').forEach(img => {
      if (img.getAttribute('src') !== logoNavSrc) img.src = logoNavSrc;
    });

    // 2. Footer logo
    const fl = document.getElementById('fl');
    if (fl && fl.getAttribute('src') !== logoSrc) fl.src = logoSrc;

    // 3. Hero logos
    document.querySelectorAll('.hl').forEach(img => {
      if (img.getAttribute('src') !== logoSrc) img.src = logoSrc;
    });

    // 4. Splash logo
    const sp = document.getElementById('sp');
    if (sp && sp.getAttribute('src') !== logoSrc) sp.src = logoSrc;

    // 5. Curtain logo
    const curImg = document.querySelector('#cur img');
    if (curImg && curImg.getAttribute('src') !== logoSrc) curImg.src = logoSrc;

    // 6. Hero shine mask
    document.querySelectorAll('.shine').forEach(s => {
      s.style.webkitMaskImage = s.style.maskImage = 'url(' + logoSrc + ')';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => updateThemeLogos(html.getAttribute('data-theme') || 'dark'));
  } else {
    updateThemeLogos(initialTheme);
  }

  // 2. Progressive Nanotechnology Reveal Transition Engine
  async function executeThemeSwitch(originX, originY, targetTheme) {
    if (isTransitioning) return;
    isTransitioning = true;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Immediate fallback for users who prefer reduced motion or browsers without View Transitions
    if (prefersReducedMotion || !document.startViewTransition) {
      html.setAttribute('data-theme', targetTheme);
      try { localStorage.setItem(STORAGE_KEY, targetTheme); } catch(e) {}
      updateToggleState(targetTheme);
      updateThemeLogos(targetTheme);
      window.dispatchEvent(new CustomEvent('cv-theme-changed', { detail: { theme: targetTheme } }));
      isTransitioning = false;
      return;
    }

    // Viewport dimensions & maximum radius to cover entire screen from origin
    const width = window.innerWidth;
    const height = window.innerHeight;
    const corners = [
      [0, 0],
      [width, 0],
      [0, height],
      [width, height]
    ];
    let maxDist = 0;
    for (const [cx, cy] of corners) {
      const d = Math.hypot(cx - originX, cy - originY);
      if (d > maxDist) maxDist = d;
    }
    maxDist += 80;

    const duration = 1000; // 1,000ms smooth cinematic mechanical sweep

    // Create synchronized nanotech boundary canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'nano-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:999999;pointer-events:none;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    const isTargetLight = targetTheme === 'light';
    const goldColor = isTargetLight ? 'rgba(147, 116, 62, ' : 'rgba(201, 184, 160, ';
    const crimsonColor = 'rgba(201, 70, 61, ';
    const hexRadius = Math.max(22, Math.min(36, width / 38));
    const hexHeight = hexRadius * Math.sqrt(3);

    // Pre-calculate spark particles on the wave perimeter
    const sparkCount = 36;
    const sparks = [];
    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        angleOffset: (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.25,
        radialJitter: (Math.random() - 0.5) * 36,
        size: 1.2 + Math.random() * 2.2,
        crimson: Math.random() > 0.65
      });
    }

    function drawHex(x, y, r) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const hx = x + r * Math.cos(angle);
        const hy = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    }

    let vtAnimation = null;

    // Start native browser View Transition
    const transition = document.startViewTransition(() => {
      html.setAttribute('data-theme', targetTheme);
      try { localStorage.setItem(STORAGE_KEY, targetTheme); } catch(e) {}
      updateToggleState(targetTheme);
      updateThemeLogos(targetTheme);
      window.dispatchEvent(new CustomEvent('cv-theme-changed', { detail: { theme: targetTheme } }));
    });

    try {
      await transition.ready;

      // Progressively clip the new theme layer outward from toggle coordinates
      vtAnimation = document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${originX}px ${originY}px)`,
            `circle(${maxDist}px at ${originX}px ${originY}px)`
          ]
        },
        {
          duration: duration,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
          fill: 'forwards'
        }
      );

      // Synchronized mechanical nanotech lattice & particle rendering
      const startTime = performance.now();

      function render(now) {
        const elapsed = now - startTime;
        const rawProgress = Math.min(1, elapsed / duration);
        // Matching ease-out curve
        const eased = 1 - Math.pow(1 - rawProgress, 2.8);
        const currentRadius = eased * maxDist;
        const bandWidth = 90; // Active transformation band around the seam

        ctx.clearRect(0, 0, width, height);

        const cols = Math.ceil(width / (hexRadius * 1.5)) + 2;
        const rows = Math.ceil(height / hexHeight) + 2;

        for (let c = -1; c < cols; c++) {
          for (let r = -1; r < rows; r++) {
            const x = c * hexRadius * 1.5;
            const y = r * hexHeight + (c % 2 === 0 ? hexHeight / 2 : 0);
            const dist = Math.hypot(x - originX, y - originY);
            const delta = dist - currentRadius;

            // Only draw plates in the active transformation zone
            if (Math.abs(delta) <= bandWidth) {
              const intensity = Math.max(0, 1 - Math.abs(delta) / bandWidth);

              // Metallic interlocking plate
              ctx.fillStyle = isTargetLight
                ? `rgba(225, 220, 210, ${intensity * 0.7})`
                : `rgba(26, 30, 35, ${intensity * 0.8})`;
              drawHex(x, y, hexRadius * 0.94);
              ctx.fill();

              // Gold micro-circuit borders
              ctx.strokeStyle = goldColor + (intensity * 0.9) + ')';
              ctx.lineWidth = 1.3;
              ctx.stroke();

              // Crimson / Gold energy nodes
              if ((c + r) % 2 === 0 && intensity > 0.35) {
                ctx.beginPath();
                ctx.arc(x, y, 2.4, 0, Math.PI * 2);
                ctx.fillStyle = ((c + r) % 4 === 0)
                  ? crimsonColor + (intensity * 0.95) + ')'
                  : goldColor + (intensity * 0.95) + ')';
                ctx.fill();

                // Specular micro-glint
                ctx.beginPath();
                ctx.arc(x - 0.7, y - 0.7, 1, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.9})`;
                ctx.fill();
              }
            }
          }
        }

        // Leading edge particles & energy wave
        if (rawProgress < 0.98) {
          for (const sp of sparks) {
            const spDist = currentRadius + sp.radialJitter * (1 - rawProgress);
            const spX = originX + spDist * Math.cos(sp.angleOffset);
            const spY = originY + spDist * Math.sin(sp.angleOffset);

            if (spX >= -20 && spX <= width + 20 && spY >= -20 && spY <= height + 20) {
              ctx.beginPath();
              ctx.arc(spX, spY, sp.size, 0, Math.PI * 2);
              ctx.fillStyle = sp.crimson ? crimsonColor + '0.9)' : goldColor + '0.9)';
              ctx.fill();
            }
          }

          // Leading energy wavefront perimeter
          ctx.beginPath();
          ctx.arc(originX, originY, currentRadius, 0, Math.PI * 2);
          ctx.strokeStyle = goldColor + (Math.max(0, 1 - rawProgress * 0.8) * 0.75) + ')';
          ctx.lineWidth = 2.4;
          ctx.stroke();
        }

        if (rawProgress < 1) {
          requestAnimationFrame(render);
        }
      }

      requestAnimationFrame(render);

      await transition.finished;
    } catch (err) {
      console.warn('Theme view transition:', err);
    } finally {
      if (vtAnimation) {
        try { vtAnimation.cancel(); } catch(e) {}
      }
      if (canvas && canvas.parentNode) {
        canvas.remove();
      }
      isTransitioning = false;
    }
  }

  // 3. Theme Toggle Controller
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    updateToggleState(html.getAttribute('data-theme') || 'dark');

    toggle.addEventListener('click', function(e) {
      if (isTransitioning) return;
      const currentTheme = html.getAttribute('data-theme') || 'dark';
      const targetTheme = currentTheme === 'light' ? 'dark' : 'light';

      // Activation pulse on button
      toggle.classList.add('pulse');
      setTimeout(() => toggle.classList.remove('pulse'), 450);

      const rect = toggle.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      executeThemeSwitch(originX, originY, targetTheme);
    });
  }

  // Bind on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }

  // Expose global API
  window.CaventraTheme = {
    get: () => html.getAttribute('data-theme') || 'dark',
    set: (theme) => {
      const toggle = document.getElementById('theme-toggle');
      let ox = window.innerWidth - 60;
      let oy = 40;
      if (toggle) {
        const rect = toggle.getBoundingClientRect();
        ox = rect.left + rect.width / 2;
        oy = rect.top + rect.height / 2;
      }
      executeThemeSwitch(ox, oy, theme);
    }
  };
})();
