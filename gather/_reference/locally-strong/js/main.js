/**
 * Locally Strong - Main JavaScript
 * Handles video hero, header scroll, mobile navigation, testimonials, and forms
 */

(function() {
  'use strict';

  // ===================
  // Mobile Navigation
  // ===================
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileNav = document.getElementById('mobile-nav');
  const navOverlay = document.getElementById('nav-overlay');

  function openMobileNav() {
    if (mobileNav && navOverlay) {
      mobileNav.classList.add('active');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMobileNav() {
    if (mobileNav && navOverlay) {
      mobileNav.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileNav);
  if (menuClose) menuClose.addEventListener('click', closeMobileNav);
  if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // ===================
  // Header Scroll Effect
  // ===================
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Check on load

  // ===================
  // Video Hero
  // ===================
  const heroVideo = document.getElementById('hero-video');
  const videoToggle = document.getElementById('video-toggle');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const heroSection = document.querySelector('.hero-video');

  let isVideoPlaying = false;

  function updateVideoUI(playing) {
    isVideoPlaying = playing;
    if (playIcon && pauseIcon && videoToggle) {
      if (playing) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        videoToggle.setAttribute('aria-label', 'Pause video');
      } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        videoToggle.setAttribute('aria-label', 'Play video');
      }
    }
  }

  function playVideo() {
    if (heroVideo) {
      heroVideo.play()
        .then(function() {
          updateVideoUI(true);
        })
        .catch(function() {
          // Autoplay failed, that's okay
          updateVideoUI(false);
        });
    }
  }

  function pauseVideo() {
    if (heroVideo) {
      heroVideo.pause();
      updateVideoUI(false);
    }
  }

  function toggleVideo() {
    if (heroVideo) {
      if (heroVideo.paused) {
        playVideo();
      } else {
        pauseVideo();
      }
    }
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroVideo) {
    // Handle video errors - show fallback
    heroVideo.addEventListener('error', function() {
      if (heroSection) {
        heroSection.classList.add('hero-video-fallback');
      }
      if (videoToggle) {
        videoToggle.style.display = 'none';
      }
    });

    // Auto-play if reduced motion is not preferred
    if (!prefersReducedMotion) {
      playVideo();
    }

    // Intersection observer to pause when not visible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting && isVideoPlaying) {
            pauseVideo();
          }
        });
      }, { threshold: 0.25 });

      observer.observe(heroVideo);
    }
  }

  if (videoToggle) {
    videoToggle.addEventListener('click', toggleVideo);
  }

  // ===================
  // Testimonial Carousel
  // ===================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    if (totalSlides === 0) return;

    // Wrap around
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;

    currentSlide = index;

    // Update slides
    slides.forEach(function(slide, i) {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update dots
    dots.forEach(function(dot, i) {
      if (i === currentSlide) {
        dot.classList.remove('bg-charcoal/20', 'hover:bg-charcoal/40');
        dot.classList.add('bg-forest');
      } else {
        dot.classList.remove('bg-forest');
        dot.classList.add('bg-charcoal/20', 'hover:bg-charcoal/40');
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      showSlide(index);
    });
  });

  // Keyboard navigation for carousel
  const testimonialSection = document.getElementById('testimonials');
  if (testimonialSection) {
    testimonialSection.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    });
  }

  // ===================
  // Newsletter Form
  // ===================
  const newsletterForms = document.querySelectorAll('form[data-newsletter]');

  newsletterForms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      if (!emailInput.value || !emailInput.validity.valid) {
        emailInput.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Subscribing...';

      // Simulate subscription (replace with actual endpoint)
      console.log('Newsletter signup:', emailInput.value);

      setTimeout(function() {
        emailInput.value = '';
        submitButton.textContent = 'Subscribed!';

        setTimeout(function() {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }, 2000);
      }, 1000);
    });
  });

  // ===================
  // Contact Form
  // ===================
  const contactForms = document.querySelectorAll('form[data-form]');

  contactForms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      console.log('Form submitted:', data);

      setTimeout(function() {
        const successMessage = document.createElement('div');
        successMessage.className = 'bg-forest/10 text-forest p-4 rounded-lg mt-4';
        successMessage.innerHTML = '<p class="font-medium">Thank you!</p><p class="text-sm mt-1">We\'ll be in touch soon.</p>';

        form.reset();
        form.appendChild(successMessage);

        submitButton.disabled = false;
        submitButton.textContent = originalText;

        setTimeout(function() {
          successMessage.remove();
        }, 5000);
      }, 1000);
    });
  });

  // ===================
  // Donation Buttons
  // ===================
  const donateButtons = document.querySelectorAll('.donate-btn');

  donateButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      donateButtons.forEach(function(btn) {
        btn.classList.remove('bg-white', 'text-forest');
      });
      this.classList.add('bg-white', 'text-forest');
      console.log('Selected donation amount:', this.textContent.trim());
    });
  });

  // ===================
  // Smooth scroll for anchor links
  // ===================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#main') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
