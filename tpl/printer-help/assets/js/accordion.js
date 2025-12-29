/**
 * FAQ Accordion
 * Accessible accordion with expand/collapse all functionality
 */

(function() {
  'use strict';

  /**
   * Initialize all accordions on the page
   */
  function init() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
      initAccordion(accordion);
    });

    // Initialize expand/collapse all buttons
    initExpandCollapseButtons();
  }

  // Counter for unique IDs
  let idCounter = 0;

  /**
   * Initialize a single accordion
   */
  function initAccordion(accordion) {
    const triggers = accordion.querySelectorAll('.accordion-trigger');

    triggers.forEach((trigger) => {
      // Find the content element (next sibling of trigger)
      const content = trigger.nextElementSibling;
      if (!content || !content.classList.contains('accordion-content')) {
        return; // Skip if no valid content found
      }

      // Generate unique ID for content if not present
      if (!content.id) {
        idCounter++;
        content.id = `accordion-content-${idCounter}`;
      }

      // Set ARIA attributes
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', content.id);
      content.setAttribute('aria-hidden', 'true');

      // Add click handler
      trigger.addEventListener('click', () => {
        toggleItem(trigger, content);
      });

      // Add keyboard handler
      trigger.addEventListener('keydown', (e) => {
        handleKeydown(e, trigger, content, triggers);
      });
    });
  }

  /**
   * Toggle accordion item open/closed
   */
  function toggleItem(trigger, content) {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      closeItem(trigger, content);
    } else {
      openItem(trigger, content);
    }

    // Update expand/collapse all button states
    updateExpandCollapseButtons();
  }

  /**
   * Open an accordion item
   */
  function openItem(trigger, content) {
    trigger.setAttribute('aria-expanded', 'true');
    content.setAttribute('aria-hidden', 'false');
    content.classList.add('is-open');
  }

  /**
   * Close an accordion item
   */
  function closeItem(trigger, content) {
    trigger.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');
    content.classList.remove('is-open');
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeydown(e, trigger, content, allTriggers) {
    const triggers = Array.from(allTriggers);
    const currentIndex = triggers.indexOf(trigger);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % triggers.length;
        triggers[nextIndex].focus();
        break;

      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        triggers[prevIndex].focus();
        break;

      case 'Home':
        e.preventDefault();
        triggers[0].focus();
        break;

      case 'End':
        e.preventDefault();
        triggers[triggers.length - 1].focus();
        break;
    }
  }

  /**
   * Initialize expand/collapse all buttons
   */
  function initExpandCollapseButtons() {
    const expandAllBtns = document.querySelectorAll('.accordion-expand-all');
    const collapseAllBtns = document.querySelectorAll('.accordion-collapse-all');

    expandAllBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.closest('section') || document;
        expandAll(section);
      });
    });

    collapseAllBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.closest('section') || document;
        collapseAll(section);
      });
    });
  }

  /**
   * Find content element for a trigger
   */
  function getContentForTrigger(trigger) {
    // First try aria-controls
    const controlsId = trigger.getAttribute('aria-controls');
    if (controlsId) {
      const content = document.getElementById(controlsId);
      if (content) return content;
    }
    // Fallback to next sibling
    const sibling = trigger.nextElementSibling;
    if (sibling && sibling.classList.contains('accordion-content')) {
      return sibling;
    }
    return null;
  }

  /**
   * Expand all accordion items in a container
   */
  function expandAll(container) {
    const triggers = container.querySelectorAll('.accordion-trigger');

    triggers.forEach(trigger => {
      const content = getContentForTrigger(trigger);
      if (content) {
        openItem(trigger, content);
      }
    });

    updateExpandCollapseButtons();
  }

  /**
   * Collapse all accordion items in a container
   */
  function collapseAll(container) {
    const triggers = container.querySelectorAll('.accordion-trigger');

    triggers.forEach(trigger => {
      const content = getContentForTrigger(trigger);
      if (content) {
        closeItem(trigger, content);
      }
    });

    updateExpandCollapseButtons();
  }

  /**
   * Update button states based on current accordion state
   */
  function updateExpandCollapseButtons() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
      const triggers = section.querySelectorAll('.accordion-trigger');
      const expandBtn = section.querySelector('.accordion-expand-all');
      const collapseBtn = section.querySelector('.accordion-collapse-all');

      if (!triggers.length) return;

      const allExpanded = Array.from(triggers).every(
        t => t.getAttribute('aria-expanded') === 'true'
      );
      const allCollapsed = Array.from(triggers).every(
        t => t.getAttribute('aria-expanded') === 'false'
      );

      if (expandBtn) {
        expandBtn.disabled = allExpanded;
      }
      if (collapseBtn) {
        collapseBtn.disabled = allCollapsed;
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
