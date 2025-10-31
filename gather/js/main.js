/**
 * Gather Investor Website - Main JavaScript
 * Scroll animations, number counters, smooth interactions
 */

// ============================================
// 1. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// 2. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-on-scroll');

      // Trigger number counters if this section has them
      const counters = entry.target.querySelectorAll('[data-count]:not(.counted)');
      counters.forEach(counter => animateCounter(counter));
    }
  });
}, observerOptions);

// Observe all major sections and cards
document.querySelectorAll('section, .audience-card, .feature-card, .result-card, .testimonial-card, .founder-card, .stream-card, .fund-card').forEach(element => {
  observer.observe(element);
});

// ============================================
// 3. NUMBER COUNTER ANIMATION
// ============================================
function animateCounter(element) {
  // Mark as counted to prevent re-animation
  element.classList.add('counted');

  const targetText = element.getAttribute('data-count');

  // Handle range values like "40-60"
  if (targetText.includes('-')) {
    element.textContent = targetText;
    return;
  }

  // Handle percentage or plain numbers
  const target = parseInt(targetText.replace(/[^\d]/g, ''));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = targetText; // Use original text with % or other chars
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// ============================================
// 4. LAZY LOAD IMAGES (if real images are added later)
// ============================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// 5. PARALLAX SCROLL EFFECT (subtle)
// ============================================
let ticking = false;

function updateParallax() {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero::before');

  // Subtle parallax on hero background
  if (hero && scrolled < window.innerHeight) {
    const heroElement = document.querySelector('.hero');
    if (heroElement) {
      heroElement.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

// ============================================
// 6. INITIAL PAGE LOAD ANIMATIONS
// ============================================
window.addEventListener('load', () => {
  // Fade in hero content
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.classList.add('animate-on-scroll');
  }

  // Trigger counter animation for hero stats immediately
  const heroCounters = document.querySelectorAll('.hero [data-count]');
  setTimeout(() => {
    heroCounters.forEach(counter => animateCounter(counter));
  }, 500);
});

// ============================================
// 7. HANDLE REDUCED MOTION PREFERENCE
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Disable animations for users who prefer reduced motion
  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    element.style.animation = 'none';
    element.style.transition = 'none';
  });

  // Make counters instant
  document.querySelectorAll('[data-count]').forEach(element => {
    element.textContent = element.getAttribute('data-count');
  });
}

// ============================================
// 8. CONSOLE MESSAGE FOR DEVELOPERS
// ============================================
console.log('%cGather - Good things from good people', 'font-size: 24px; font-weight: bold; color: #4A7C28;');
console.log('%cBuilding infrastructure for local food commerce.', 'font-size: 14px; color: #787774;');
console.log('%cInterested in joining the team? founders@gather.market', 'font-size: 12px; color: #FF9800;');
