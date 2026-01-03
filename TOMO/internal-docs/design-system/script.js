/**
 * BJJ Journal Design System
 * Interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show target content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === targetId) {
          content.classList.add('active');
        }
      });

      // Update URL hash
      history.pushState(null, '', '#' + targetId);
    });
  });

  // Handle initial hash
  const hash = window.location.hash.slice(1);
  if (hash) {
    const targetTab = document.querySelector(`[data-tab="${hash}"]`);
    if (targetTab) {
      targetTab.click();
    }
  }

  // Interactive button demos
  const demoButtons = document.querySelectorAll('.demo-selectable');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Find siblings in same group
      const group = btn.closest('.demo-group');
      if (group) {
        group.querySelectorAll('.demo-selectable').forEach(b => b.classList.remove('active'));
      }
      btn.classList.add('active');
    });
  });

  // Rating buttons
  const ratingGroups = document.querySelectorAll('.rating-group');
  ratingGroups.forEach(group => {
    const buttons = group.querySelectorAll('.rating-btn');
    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b, i) => {
          b.classList.toggle('active', i <= index);
        });
      });
    });
  });

  // Pill toggles
  const pillGroups = document.querySelectorAll('.pill-group');
  pillGroups.forEach(group => {
    const pills = group.querySelectorAll('.pill:not(.pill-add)');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pill.classList.toggle('active');
      });
    });
  });

  // Progress ring animation on scroll
  const progressRings = document.querySelectorAll('.progress-ring');
  const animateRings = () => {
    progressRings.forEach(ring => {
      const circle = ring.querySelector('.progress-circle');
      if (circle) {
        const rect = ring.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          circle.style.strokeDashoffset = circle.dataset.offset;
        }
      }
    });
  };

  window.addEventListener('scroll', animateRings);
  animateRings();

  // Copy to clipboard for code snippets
  const codeBlocks = document.querySelectorAll('.code-block');
  codeBlocks.forEach(block => {
    block.addEventListener('click', async () => {
      const code = block.textContent;
      try {
        await navigator.clipboard.writeText(code);
        block.classList.add('copied');
        setTimeout(() => block.classList.remove('copied'), 1000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });

  console.log('BJJ Journal Design System loaded');
});

/**
 * Helper: Create SVG progress ring
 */
function createProgressRing(container, percentage, size = 80, strokeWidth = 6) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  container.innerHTML = `
    <svg width="${size}" height="${size}">
      <circle
        cx="${size / 2}"
        cy="${size / 2}"
        r="${radius}"
        fill="none"
        stroke="var(--color-gray-200)"
        stroke-width="${strokeWidth}"
      />
      <circle
        class="progress-circle"
        cx="${size / 2}"
        cy="${size / 2}"
        r="${radius}"
        fill="none"
        stroke="var(--color-accent)"
        stroke-width="${strokeWidth}"
        stroke-linecap="round"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${circumference}"
        data-offset="${offset}"
        style="transition: stroke-dashoffset 0.5s ease;"
      />
    </svg>
    <span class="progress-ring-value">${percentage}%</span>
  `;

  // Animate after a short delay
  setTimeout(() => {
    const circle = container.querySelector('.progress-circle');
    if (circle) {
      circle.style.strokeDashoffset = offset;
    }
  }, 100);
}

// Initialize progress rings
document.querySelectorAll('[data-progress-ring]').forEach(el => {
  const percentage = parseInt(el.dataset.progressRing, 10);
  const size = parseInt(el.dataset.size, 10) || 80;
  const stroke = parseInt(el.dataset.stroke, 10) || 6;
  createProgressRing(el, percentage, size, stroke);
});
