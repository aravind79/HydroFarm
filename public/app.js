document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- Parallax Hero Effect ---
  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (scrollPos < window.innerHeight && heroBg) {
      heroBg.style.transform = `translateY(${scrollPos * 0.4}px)`;
    }
  });

  // --- Assign animation classes by element type ---

  // Images / image containers: slide up from below
  document.querySelectorAll('.tp-image-container, .insight-card').forEach(el => {
    el.classList.add('anim-slide-up');
  });

  // Text / content blocks: fade in from left
  document.querySelectorAll('.tp-content, .innovation-header, .insights-header, .soil-content').forEach(el => {
    el.classList.add('anim-fade-left');
  });

  // Cards: slide up with stagger
  document.querySelectorAll('.stat-box, .dash-card').forEach((el, i) => {
    el.classList.add('anim-card');
    el.style.transitionDelay = `${i * 90}ms`;
  });

  // Testimonial: scale up
  document.querySelectorAll('.test-grid').forEach(el => {
    el.classList.add('anim-scale');
  });

  // Analytics cards stagger
  document.querySelectorAll('.analytics-grid .dash-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
  });

  // Generic fade-up for anything with .fade-in not already assigned
  document.querySelectorAll('.fade-in').forEach(el => {
    const hasAnim = ['anim-slide-up','anim-fade-left','anim-card','anim-scale']
      .some(c => el.classList.contains(c));
    if (!hasAnim) el.classList.add('anim-fade-up');
  });

  // --- Single IntersectionObserver for all animated elements ---
  const allAnimEls = document.querySelectorAll(
    '.anim-slide-up, .anim-fade-left, .anim-card, .anim-scale, .anim-fade-up, .fade-in'
  );

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  allAnimEls.forEach(el => observer.observe(el));

  // --- Language Switcher ---
  const langBtn = document.querySelector('.lang-btn');
  let isArabic = false;

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        isArabic = !isArabic;
        select.value = isArabic ? 'ar' : 'en';
        select.dispatchEvent(new Event('change'));
        
        // Update document direction for RTL support
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        document.documentElement.lang = isArabic ? 'ar' : 'en';
      } else {
        console.log('Google Translate not loaded yet.');
      }
    });
  }
});
