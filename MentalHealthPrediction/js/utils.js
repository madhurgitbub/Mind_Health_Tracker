/* ============================================================
   MindScore — utils.js
   Small shared helpers used across app.js, validation.js, api.js
   ============================================================ */

const MindScoreUtils = (() => {
  /** Query shorthand */
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /** Debounce a function call */
  function debounce(fn, wait = 150) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  /** Clamp a number between min and max */
  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  /** Animate a number counting up, calling onUpdate each frame */
  function animateValue({ from = 0, to, duration = 1200, decimals = 0, onUpdate, onComplete }) {
    const start = performance.now();
    const range = to - from;

    function tick(now) {
      const elapsed = now - start;
      const progress = clamp(elapsed / duration, 0, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = from + range * eased;
      onUpdate(Number(value.toFixed(decimals)));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        onComplete && onComplete();
      }
    }
    requestAnimationFrame(tick);
  }

  /** Read persisted theme, defaulting to system preference */
  function getStoredTheme() {
    try {
      const stored = localStorage.getItem('mindscore-theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) { /* storage unavailable */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function storeTheme(theme) {
    try { localStorage.setItem('mindscore-theme', theme); } catch (e) { /* ignore */ }
  }

  return { qs, qsa, debounce, clamp, animateValue, getStoredTheme, storeTheme };
})();
