/**
 * Staff Guide Search
 * Client-side filtering and highlighting for dense documentation
 */

(function() {
  'use strict';

  const DEBOUNCE_MS = 150;
  const MIN_QUERY_LENGTH = 2;

  let searchInput;
  let searchClear;
  let searchResults;
  let sections;
  let originalContent = new Map();

  /**
   * Initialize search functionality
   */
  function init() {
    searchInput = document.getElementById('staff-search');
    searchClear = document.getElementById('search-clear');
    searchResults = document.getElementById('search-results');
    sections = document.querySelectorAll('article > section');

    if (!searchInput || !sections.length) return;

    // Store original HTML content for each section
    sections.forEach(section => {
      originalContent.set(section, section.innerHTML);
    });

    // Bind events
    searchInput.addEventListener('input', debounce(handleSearch, DEBOUNCE_MS));
    searchInput.addEventListener('keydown', handleKeydown);

    if (searchClear) {
      searchClear.addEventListener('click', clearSearch);
    }

    // Handle Escape key globally when search is focused
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        clearSearch();
        searchInput.blur();
      }
    });
  }

  /**
   * Handle search input
   */
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();

    // Show/hide clear button
    if (searchClear) {
      searchClear.style.display = query.length > 0 ? 'flex' : 'none';
    }

    // Reset if query too short
    if (query.length < MIN_QUERY_LENGTH) {
      resetSearch();
      return;
    }

    let totalMatches = 0;
    const sectionMatches = [];

    sections.forEach(section => {
      // Restore original content before searching
      section.innerHTML = originalContent.get(section);

      const text = section.textContent.toLowerCase();
      const matches = countMatches(text, query);

      if (matches > 0) {
        totalMatches += matches;
        section.classList.remove('search-hidden');
        section.classList.add('search-visible');
        highlightMatches(section, query);

        const heading = section.querySelector('h2');
        if (heading) {
          sectionMatches.push({
            name: heading.textContent,
            count: matches
          });
        }
      } else {
        section.classList.add('search-hidden');
        section.classList.remove('search-visible');
      }
    });

    updateResultsMessage(totalMatches, sectionMatches, query);
  }

  /**
   * Count occurrences of query in text
   */
  function countMatches(text, query) {
    if (!query) return 0;
    const regex = new RegExp(escapeRegex(query), 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  /**
   * Highlight matching text in a section
   */
  function highlightMatches(section, query) {
    const walker = document.createTreeWalker(
      section,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.toLowerCase().includes(query)) {
        textNodes.push(node);
      }
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent;
      const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
      const parts = text.split(regex);

      if (parts.length > 1) {
        const fragment = document.createDocumentFragment();
        parts.forEach(part => {
          if (part.toLowerCase() === query) {
            const mark = document.createElement('mark');
            mark.className = 'search-highlight';
            mark.textContent = part;
            fragment.appendChild(mark);
          } else {
            fragment.appendChild(document.createTextNode(part));
          }
        });
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });
  }

  /**
   * Update the results message
   */
  function updateResultsMessage(total, sectionMatches, query) {
    if (!searchResults) return;

    if (total === 0) {
      searchResults.innerHTML = `<span class="search-no-results">No results for "${escapeHtml(query)}"</span>`;
      searchResults.hidden = false;
    } else {
      const sectionInfo = sectionMatches
        .map(s => `${s.name}: ${s.count}`)
        .join(' | ');
      searchResults.innerHTML = `<span class="search-match-count">${total} match${total === 1 ? '' : 'es'}</span>`;
      searchResults.hidden = false;
    }
  }

  /**
   * Clear search and reset display
   */
  function clearSearch() {
    searchInput.value = '';
    if (searchClear) {
      searchClear.style.display = 'none';
    }
    resetSearch();
    searchInput.focus();
  }

  /**
   * Reset all sections to original state
   */
  function resetSearch() {
    sections.forEach(section => {
      section.innerHTML = originalContent.get(section);
      section.classList.remove('search-hidden', 'search-visible');
    });

    if (searchResults) {
      searchResults.innerHTML = '';
      searchResults.hidden = true;
    }
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Jump to first visible match
      const firstMatch = document.querySelector('.search-highlight');
      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /**
   * Escape special regex characters
   */
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }

  /**
   * Debounce function calls
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
