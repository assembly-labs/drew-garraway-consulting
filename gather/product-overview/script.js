// Product Overview Page - Interactive Elements

document.addEventListener('DOMContentLoaded', function() {

  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('.nav-pill');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add active state to nav pills based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navPills = document.querySelectorAll('.nav-pill');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navPills.forEach(pill => {
          pill.classList.remove('active');
          if (pill.getAttribute('href') === `#${sectionId}`) {
            pill.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe cards and feature elements
  const animatedElements = document.querySelectorAll(
    '.user-card, .feature-card, .problem-card, .roadmap-quarter'
  );

  animatedElements.forEach(element => {
    element.classList.add('fade-in-up');
    observer.observe(element);
  });

});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .nav-pill.active {
    background: var(--sage-500);
    color: white;
  }

  .fade-in-up {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .fade-in-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);