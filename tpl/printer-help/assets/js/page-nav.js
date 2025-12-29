/**
 * Page Navigation - Active Section Highlighting
 * Uses Intersection Observer to highlight current section in sticky TOC
 */

(function() {
  'use strict';

  // Get all section headings and nav links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.page-nav-list a');
  const mobileSelect = document.getElementById('section-nav');

  if (!sections.length || !navLinks.length) return;

  // Create Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -66%',
    threshold: 0
  };

  let currentSection = null;

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentSection = entry.target.id;
        updateActiveLink(currentSection);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });

  // Update active link in nav
  function updateActiveLink(sectionId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + sectionId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });

    // Update mobile select
    if (mobileSelect) {
      mobileSelect.value = '#' + sectionId;
    }
  }

  // Mobile select navigation
  if (mobileSelect) {
    mobileSelect.addEventListener('change', function() {
      const value = this.value;
      if (value) {
        window.location.hash = value;
        // Reset select to placeholder after navigation
        setTimeout(() => {
          this.value = '';
        }, 100);
      }
    });
  }

  // Set initial active state based on hash or first section
  const initialHash = window.location.hash.slice(1);
  if (initialHash && document.getElementById(initialHash)) {
    updateActiveLink(initialHash);
  } else if (sections.length) {
    updateActiveLink(sections[0].id);
  }
})();
