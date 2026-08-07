/* ============================================================
   MindScore — app.js
   UI interaction: navbar, theme, scroll reveals, hero effects,
   form submission flow, result rendering, toasts.
   ============================================================ */

(() => {
  const { qs, qsa, debounce, animateValue, getStoredTheme, storeTheme } = MindScoreUtils;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initPageLoader();
    initTheme();
    initCustomCursor();
    initNavbar();
    initMobileMenu();
    initSmoothAnchors();
    initScrollReveal();
    initTypingHeadline();
    initHeroStats();
    initMagneticButtons();
    initRipple();
    initTiltCards();
    initBackToTop();
    initPredictForm();
    qs('#footerYear').textContent = new Date().getFullYear();
    warmUpBackend();
  }

  /* ============ BACKEND WARM-UP ============
     Render's free tier spins the API down when idle. Ping it as soon as
     the page loads so it's likely already awake by the time the user
     finishes the form and hits Predict. Fire-and-forget, errors ignored. */
  function warmUpBackend() {
    if (!window.MindScoreAPI || !MindScoreAPI.BASE_URL) return;
    fetch(MindScoreAPI.BASE_URL, { method: 'GET' }).catch(() => {});
  }

  /* ============ PAGE LOADER ============ */
  function initPageLoader() {
    const loader = qs('#pageLoader');
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 350);
    });
    // Fallback in case 'load' already fired
    if (document.readyState === 'complete') {
      setTimeout(() => loader.classList.add('hidden'), 350);
    }
  }

  /* ============ THEME (dark mode + persistence) ============ */
  function initTheme() {
    const toggle = qs('#themeToggle');
    const root = document.documentElement;
    let theme = getStoredTheme();
    applyTheme(theme);

    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      storeTheme(theme);
    });

    function applyTheme(t) {
      if (t === 'dark') {
        root.setAttribute('data-theme', 'dark');
        toggle.setAttribute('aria-pressed', 'true');
      } else {
        root.removeAttribute('data-theme');
        toggle.setAttribute('aria-pressed', 'false');
      }
    }
  }

  /* ============ CUSTOM CURSOR ============ */
  function initCustomCursor() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const dot = qs('.cursor-dot');
    const ring = qs('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    (function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(loop);
    })();

    qsa('a, button, input, select, .tilt-card').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  /* ============ STICKY NAVBAR ============ */
  function initNavbar() {
    const navbar = qs('#navbar');
    const onScroll = debounce(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
      updateActiveLink();
    }, 30);
    window.addEventListener('scroll', onScroll);
    onScroll();

    const sections = qsa('main section[id], main[id]');
    const links = qsa('.nav-link');

    function updateActiveLink() {
      let current = sections[0]?.id;
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top;
        if (top - 120 <= 0) current = sec.id;
      });
      links.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    }
  }

  /* ============ MOBILE MENU ============ */
  function initMobileMenu() {
    const burger = qs('#navBurger');
    const links = qs('#navLinks');
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    qsa('.nav-link', links).forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============ SMOOTH ANCHOR SCROLL ============ */
  function initSmoothAnchors() {
    qsa('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length <= 1) return;
        const target = qs(id);
        if (!target) return;
        e.preventDefault();
        const navH = qs('#navbar').offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navH + 1;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
    qs('#scrollCue')?.addEventListener('click', () => {
      qs('#features').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ============ SCROLL REVEAL (Intersection Observer) ============ */
  function initScrollReveal() {
    const items = qsa('.reveal-up');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in-view'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => observer.observe(el));
  }

  /* ============ TYPING HEADLINE ============ */
  function initTypingHeadline() {
    const el = qs('#typingLine');
    if (!el) return;
    const full = el.textContent.trim();
    el.textContent = '';
    let i = 0;
    const speed = 42;

    function type() {
      if (i <= full.length) {
        el.textContent = full.slice(0, i);
        i++;
        setTimeout(type, speed);
      } else {
        el.classList.add('done');
      }
    }
    setTimeout(type, 500);
  }

  /* ============ HERO ANIMATED STATS ============ */
  function initHeroStats() {
    const statEls = qsa('.stat-number');
    if (!statEls.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        statEls.forEach((el) => {
          const to = parseFloat(el.dataset.count);
          const decimals = el.dataset.count.includes('.') ? 1 : 0;
          animateValue({
            to, decimals, duration: 1400,
            onUpdate: (v) => { el.textContent = v; },
          });
        });
        obs.disconnect();
      });
    }, { threshold: 0.4 });
    observer.observe(qs('#heroStats'));
  }

  /* ============ MAGNETIC BUTTONS ============ */
  function initMagneticButtons() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    qsa('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ============ RIPPLE EFFECT ============ */
  function initRipple() {
    qsa('.ripple').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const circle = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        circle.className = 'ripple-circle';
        circle.style.width = circle.style.height = size + 'px';
        circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
        circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(circle);
        circle.addEventListener('animationend', () => circle.remove());
      });
    });
  }

  /* ============ TILT CARD ============ */
  function initTiltCards() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    qsa('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ============ BACK TO TOP ============ */
  function initBackToTop() {
    const btn = qs('#backToTop');
    const onScroll = debounce(() => btn.classList.toggle('visible', window.scrollY > 500), 50);
    window.addEventListener('scroll', onScroll);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ============ TOASTS ============ */
  function showToast(message, type = 'info') {
    const container = qs('#toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconPath = type === 'success'
      ? '<path d="M20 6 9 17l-5-5"/>'
      : type === 'error'
        ? '<circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/>'
        : '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>';
    const strokeColor = type === 'success' ? '#22C55E' : type === 'error' ? '#EF4444' : '#2563EB';

    toast.innerHTML = `
      <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2.2">${iconPath}</svg>
      <span>${message}</span>
      <button class="toast-close" aria-label="Dismiss notification">&times;</button>
    `;
    container.appendChild(toast);

    const remove = () => {
      toast.classList.add('leaving');
      setTimeout(() => toast.remove(), 320);
    };
    toast.querySelector('.toast-close').addEventListener('click', remove);
    setTimeout(remove, 5000);
  }

  /* ============ PREDICTION FORM ============ */
  function initPredictForm() {
    const form = qs('#predictForm');
    if (!form) return;
    const btn = qs('#predictBtn');
    const resetBtn = qs('#resetBtn');

    // Live validation on blur
    Object.keys(MindScoreValidation.RULES).forEach((name) => {
      const input = qs(`#${name}`);
      if (!input) return;
      input.addEventListener('blur', () => validateSingleField(name));
      input.addEventListener('input', () => clearFieldError(name));
      input.addEventListener('change', () => clearFieldError(name));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const values = collectValues();
      const { valid, errors } = MindScoreValidation.validateForm(values);

      if (!valid) {
        renderErrors(errors);
        showToast('Please fix the highlighted fields.', 'error');
        const firstErrorField = qs(`.field.has-error input, .field.has-error select`);
        firstErrorField?.focus();
        return;
      }

      setLoading(true);
      showResultSkeleton();

      try {
        const data = await MindScoreAPI.predict(values);
        renderResult(data.predicted_Mental_Health_Score);
        showToast('Prediction complete.', 'success');
      } catch (err) {
        showResultEmpty();
        showToast(err.message || 'Something went wrong. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    });

    resetBtn?.addEventListener('click', () => {
      form.reset();
      qsa('.field').forEach((f) => f.classList.remove('has-error'));
      qsa('.field-error').forEach((e) => (e.textContent = ''));
      showResultEmpty();
      form.querySelector('input, select')?.focus();
    });

    function collectValues() {
      const values = {};
      Object.keys(MindScoreValidation.RULES).forEach((name) => {
        const input = qs(`#${name}`);
        values[name] = input ? input.value : '';
      });
      return values;
    }

    function validateSingleField(name) {
      const input = qs(`#${name}`);
      const { valid, message } = MindScoreValidation.validateField(name, input.value);
      const field = input.closest('.field');
      const errorEl = field.querySelector('.field-error');
      if (!valid) {
        field.classList.add('has-error');
        errorEl.textContent = message;
      } else {
        field.classList.remove('has-error');
        errorEl.textContent = '';
      }
      return valid;
    }

    function clearFieldError(name) {
      const input = qs(`#${name}`);
      const field = input.closest('.field');
      field.classList.remove('has-error');
      field.querySelector('.field-error').textContent = '';
    }

    function renderErrors(errors) {
      qsa('.field').forEach((f) => f.classList.remove('has-error'));
      qsa('.field-error').forEach((e) => (e.textContent = ''));
      Object.entries(errors).forEach(([name, message]) => {
        const input = qs(`#${name}`);
        if (!input) return;
        const field = input.closest('.field');
        field.classList.add('has-error');
        field.querySelector('.field-error').textContent = message;
      });
    }

    function setLoading(isLoading) {
      btn.classList.toggle('is-loading', isLoading);
      btn.disabled = isLoading;
    }
  }

  /* ============ RESULT RENDERING ============ */
  const TIERS = [
    { min: 8.0, key: 'excellent', label: 'Excellent Mental Wellness', color: '#22C55E',
      message: 'Your habits are strongly supporting your mental wellbeing. Keep up the balance you\u2019ve built.' },
    { min: 6.5, key: 'healthy',   label: 'Healthy Lifestyle', color: '#16A34A',
      message: 'You\u2019re maintaining a healthy lifestyle overall — small refinements could push this even higher.' },
    { min: 5.0, key: 'moderate',  label: 'Moderate Risk', color: '#F59E0B',
      message: 'A few habits may be adding strain. Consider adjusting screen time, sleep, or activity levels.' },
    { min: 3.5, key: 'attention', label: 'Needs Attention', color: '#F97316',
      message: 'Several factors appear to be affecting your wellbeing. Small, consistent changes can help a lot.' },
    { min: 0,   key: 'high-risk', label: 'High Risk', color: '#EF4444',
      message: 'Your current patterns suggest real strain. Consider talking to someone you trust or a professional.' },
  ];

  function getTier(score) {
    return TIERS.find((t) => score >= t.min) || TIERS[TIERS.length - 1];
  }

  function showResultEmpty() {
    qs('#resultEmpty').hidden = false;
    qs('#resultSkeleton').hidden = true;
    qs('#resultContent').hidden = true;
  }

  function showResultSkeleton() {
    qs('#resultEmpty').hidden = true;
    qs('#resultSkeleton').hidden = false;
    qs('#resultContent').hidden = true;
  }

  function renderResult(rawScore) {
    const score = MindScoreUtils.clamp(Number(rawScore), 0, 10);
    const tier = getTier(score);

    qs('#resultEmpty').hidden = true;
    qs('#resultSkeleton').hidden = true;
    qs('#resultContent').hidden = false;

    const tierEl = qs('#resultTier');
    tierEl.textContent = tier.label;
    tierEl.className = `result-tier tier-${tier.key}`;
    qs('#resultMessage').textContent = tier.message;

    const numberEl = qs('#scoreNumber');
    const bar = qs('#progressRingBar');
    const circumference = 540.4; // 2 * PI * r(86)
    bar.style.stroke = tier.color;

    animateValue({
      to: score,
      decimals: 1,
      duration: 1300,
      onUpdate: (v) => {
        numberEl.textContent = v.toFixed(1);
        const offset = circumference - (v / 10) * circumference;
        bar.style.strokeDashoffset = offset;
      },
      onComplete: () => {
        numberEl.textContent = score.toFixed(1);
        numberEl.classList.add('pop');
      },
    });
  }

  // Expose for potential external use / debugging
  window.MindScoreApp = { showToast };
})();
