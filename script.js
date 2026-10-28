const body = document.body;
const loader = document.querySelector('.loader');
const header = document.querySelector('.site-header');
const progress = document.querySelector('.progress span');
const menuToggle = document.querySelector('.menu-toggle');
const mobileLinks = document.querySelectorAll('.mobile-nav a');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  window.setTimeout(() => {
    loader?.classList.add('is-hidden');
    body.classList.add('is-ready');
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  }, 120);
});

window.setTimeout(() => {
  loader?.classList.add('is-hidden');
  body.classList.add('is-ready');
}, 900);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const updateScroll = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${amount}%`;
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};

window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

menuToggle?.addEventListener('click', () => {
  const isOpen = body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count || 0);
    const duration = 1200;
    const start = performance.now();
    const decimals = Number.isInteger(target) ? 0 : 1;

    const animate = (time) => {
      const progressValue = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = (target * eased).toFixed(decimals);
      if (progressValue < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    metricObserver.unobserve(element);
  });
}, { threshold: 0.7 });

document.querySelectorAll('[data-count]').forEach((element) => metricObserver.observe(element));

if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const bounds = card.getBoundingClientRect();
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
  const cursorGlow = document.querySelector('.cursor-glow');
  let pointerX = window.innerWidth * 0.5;
  let pointerY = window.innerHeight * 0.35;
  let glowX = pointerX;
  let glowY = pointerY;

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorGlow?.classList.add('is-active');
  }, { passive: true });

  const animateGlow = () => {
    glowX += (pointerX - glowX) * 0.14;
    glowY += (pointerY - glowY) * 0.14;
    cursorGlow?.style.setProperty('--cursor-x', `${glowX}px`);
    cursorGlow?.style.setProperty('--cursor-y', `${glowY}px`);
    requestAnimationFrame(animateGlow);
  };
  requestAnimationFrame(animateGlow);

  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect();
      button.style.setProperty('--mag-x', `${(event.clientX - bounds.left - bounds.width / 2) * 0.12}px`);
      button.style.setProperty('--mag-y', `${(event.clientY - bounds.top - bounds.height / 2) * 0.16}px`);
    });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--mag-x', '0px');
      button.style.setProperty('--mag-y', '0px');
    });
  });

  document.querySelectorAll('.principle, .service-card, .project-card, .testimonial-card, .metric').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
      card.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
    });
  });
}

if (!reduceMotion) {
  const heroImage = document.querySelector('.hero__visual img');
  const heroOrbit = document.querySelector('.hero__orbit');
  let parallaxQueued = false;
  const updateParallax = () => {
    const amount = Math.min(window.scrollY, window.innerHeight);
    heroImage?.style.setProperty('--hero-shift', `${amount * 0.09}px`);
    heroOrbit?.style.setProperty('--orbit-shift', `${amount * -0.06}px`);
    parallaxQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (parallaxQueued) return;
    parallaxQueued = true;
    requestAnimationFrame(updateParallax);
  }, { passive: true });
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });

document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('.faq details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
