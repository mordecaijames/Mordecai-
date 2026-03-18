/* Portfolio JavaScript - Enhanced & Production Ready */
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ========== Mobile Menu with Focus Management ========== */
  const mobileBtn = document.getElementById('mobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
  let focusableElements = [];

  function getFocusable() {
    if (!mobileMenu) return [];
    return Array.from(mobileMenu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
  }

  function openMobile() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('show');
    mobileBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    focusableElements = getFocusable();
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
    mobileMenu.addEventListener('keydown', trapFocus);
  }

  function closeMobile() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('show');
    mobileBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    mobileBtn?.focus();
    mobileMenu.removeEventListener('keydown', trapFocus);
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openMobile();
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobile);
  }

  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMobile();
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('show')) {
      closeMobile();
    }
  });

  /* ========== Active Navigation (Desktop & Mobile) ========== */
  const NAV_HEIGHT = 80;
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-link'); // exclude CTA button

  function updateActiveNav() {
    const scrollY = window.scrollY;
    let activeId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - NAV_HEIGHT - 50;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        activeId = sectionId;
      }
    });

    // Update desktop links
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === activeId);
      if (href === activeId) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Update mobile links
    mobileNavLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === activeId);
      if (href === activeId) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  });
  updateActiveNav();

  /* ========== Scroll Progress Bar ========== */
  const progressBar = document.getElementById('scrollProgress');
  function updateProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    if (progressBar) progressBar.style.width = `${scrolled}%`;
  }

  /* ========== Reveal on Scroll ========== */
  const reveals = document.querySelectorAll('.reveal');
  const progressBars = document.querySelectorAll('[data-progress]');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');

          entry.target.querySelectorAll('[data-progress]').forEach(bar => {
            const progress = parseInt(bar.getAttribute('data-progress'), 10);
            setTimeout(() => {
              bar.style.width = `${progress}%`;
              bar.setAttribute('aria-valuenow', progress);
            }, 150);
          });

          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in-view'));
    progressBars.forEach(bar => {
      const progress = parseInt(bar.getAttribute('data-progress'), 10);
      bar.style.width = `${progress}%`;
      bar.setAttribute('aria-valuenow', progress);
    });
  }

  /* ========== Stats Counter Animation ========== */
  const statNumbers = document.querySelectorAll('.stat-number');
  function animateCounter(element) {
    const target = parseInt(element.textContent);
    if (Number.isNaN(target)) return;
    const suffix = element.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const increment = Math.ceil(target / 50);
    const stepTime = 1500 / (target / increment);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = current + suffix;
      }
    }, stepTime);
  }

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(stat => statsObserver.observe(stat));
  } else {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.textContent);
      const suffix = stat.textContent.replace(/[0-9]/g, '');
      if (!Number.isNaN(target)) stat.textContent = `${target}${suffix}`;
    });
  }

  /* ========== Particle Background ========== */
  (function initParticles() {
    if (prefersReducedMotion) return;
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles = [];
    const particleCount = Math.min(35, Math.floor((w * h) / 20000));
    let rafId = 0;
    let running = true;
    let lastFrame = 0;

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > w) this.speedX *= -1;
        if (this.y < 0 || this.y > h) this.speedY *= -1;
      }
      draw() {
        ctx.fillStyle = `rgba(0, 201, 255, ${0.05 + (this.size / 10)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate(timestamp) {
      if (!running) return;
      if (timestamp - lastFrame < 33) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      lastFrame = timestamp;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (!running && rafId) cancelAnimationFrame(rafId);
      if (running) rafId = requestAnimationFrame(animate);
    });
  })();

  /* ========== Contact Form (WhatsApp) ========== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const statusMsg = document.getElementById('statusMsg');
    function showStatus(message, type = 'success') {
      if (!statusMsg) return;
      statusMsg.textContent = message;
      statusMsg.className = `status-msg show ${type}`;
      setTimeout(() => statusMsg.classList.remove('show'), 5000);
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const subject = formData.get('subject')?.toString().trim() || 'Portfolio Contact';
      const message = formData.get('message')?.toString().trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg> Sending...';
      }

      const waNumber = '2349077673110';
      const waText = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
      const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

      setTimeout(() => {
        window.open(waLink, '_blank', 'noopener,noreferrer');
        showStatus('Opening WhatsApp for instant reply...', 'success');
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Send Message';
        }
      }, 500);
    });
  }

  /* ========== Cookie Banner ========== */
  (function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('cookieAccept');
    const declineBtn = document.getElementById('cookieDecline');
    const COOKIE_NAME = 'cookie_consent';

    function getCookie(name) {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
      }
      return null;
    }

    function setCookie(name, value, days = 365) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    }

    function showBanner() {
      if (banner) setTimeout(() => banner.classList.add('show'), 1500);
    }

    function hideBanner() {
      if (banner) banner.classList.remove('show');
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        setCookie(COOKIE_NAME, 'accepted');
        hideBanner();
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        setCookie(COOKIE_NAME, 'declined');
        hideBanner();
      });
    }

    const consent = getCookie(COOKIE_NAME);
    if (!consent) showBanner();

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && banner?.classList.contains('show')) {
        setCookie(COOKIE_NAME, 'declined');
        hideBanner();
      }
    });
  })();

  /* ========== FAQ Accordion ========== */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true' ? false : true;
      btn.setAttribute('aria-expanded', expanded);
      btn.classList.toggle('open', expanded);
      const answerId = btn.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      if (answer) {
        answer.classList.toggle('open', expanded);
      }
    });
  });
});