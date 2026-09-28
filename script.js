const body = document.body;
const loader = document.querySelector('.loader');
const header = document.querySelector('.site-header');
const progress = document.querySelector('.progress span');
const menuToggle = document.querySelector('.menu-toggle');
const mobileLinks = document.querySelectorAll('.mobile-nav a');

window.addEventListener('load', () => {
  window.setTimeout(() => {
    loader?.classList.add('is-hidden');
    body.classList.add('is-ready');
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  }, 550);
});

window.setTimeout(() => {
  loader?.classList.add('is-hidden');
  body.classList.add('is-ready');
}, 1800);

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

if (window.matchMedia('(pointer: fine)').matches) {
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

document.querySelectorAll('.faq details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
