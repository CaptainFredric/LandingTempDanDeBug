(() => {
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menuDialog');
  if (!menuBtn || !menu) return;

  const closeEls = menu.querySelectorAll('[data-menu-close]');
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  let lastActive = null;

  const isOpen = () => !menu.hasAttribute('hidden');

  const openMenu = () => {
    if (isOpen()) return;
    lastActive = document.activeElement;

    menu.removeAttribute('hidden');
    document.body.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');

    const first = menu.querySelector(focusableSelector);
    if (first) first.focus();
  };

  const closeMenu = () => {
    if (!isOpen()) return;

    menu.setAttribute('hidden', '');
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');

    if (lastActive && typeof lastActive.focus === 'function') {
      lastActive.focus();
    } else {
      menuBtn.focus();
    }
  };

  menuBtn.addEventListener('click', () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  closeEls.forEach((el) => {
    el.addEventListener('click', closeMenu);
  });

  menu.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches('a[href^="#"]')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusables = Array.from(menu.querySelectorAll(focusableSelector));
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      if (active === first || active === menu) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const signup = document.getElementById('signup');
  if (signup) {
    signup.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailEl = signup.querySelector('input[type="email"]');
      const msgEl = document.getElementById('formMsg');
      const email = emailEl && 'value' in emailEl ? String(emailEl.value || '').trim() : '';

      if (!emailEl || !msgEl) return;

      if (!emailEl.checkValidity()) {
        msgEl.textContent = 'Please enter a valid email address.';
        emailEl.focus();
        return;
      }

      msgEl.textContent = "Thanks — you're on the list (demo).";
      emailEl.blur();

      window.setTimeout(() => {
        msgEl.textContent = '';
      }, 4000);
    });
  }

  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (revealEls.length > 0) {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const makeVisible = (el) => el.classList.add('is-visible');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(makeVisible);
    } else {
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            makeVisible(entry.target);
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.18,
          rootMargin: '0px 0px -10% 0px',
        },
      );

      revealEls.forEach((el) => io.observe(el));
    }
  }
})();
