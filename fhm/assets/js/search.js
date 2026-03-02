/**
 * FHM Training Search
 *
 * Client-side full-text search across all training content.
 * Loads a pre-built JSON index and matches against titles,
 * descriptions, key terms, headings, and body text.
 */

(function () {
  'use strict';

  let searchIndex = null;
  let searchInput = null;
  let resultsContainer = null;
  let overlay = null;
  let activeIndex = -1;
  let debounceTimer = null;

  /**
   * Normalize text for matching: lowercase, collapse whitespace
   */
  function normalize(text) {
    return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  /**
   * Tokenize a query into individual words
   */
  function tokenize(query) {
    return normalize(query)
      .split(/\s+/)
      .filter(function (w) {
        return w.length > 1;
      });
  }

  /**
   * Score a document against query tokens.
   * Higher score = better match. Returns 0 for no match.
   */
  function scoreDocument(doc, tokens) {
    if (tokens.length === 0) return 0;

    var score = 0;
    var matched = 0;
    var titleNorm = normalize(doc.title);
    var descNorm = normalize(doc.description);
    var bodyNorm = normalize(doc.body);
    var termsNorm = (doc.keyTerms || []).map(normalize);
    var headingsNorm = (doc.headings || []).map(normalize);

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      var tokenMatched = false;

      // Title match (highest weight)
      if (titleNorm.indexOf(token) !== -1) {
        score += 10;
        tokenMatched = true;
      }

      // Key term match (very high weight)
      for (var t = 0; t < termsNorm.length; t++) {
        if (termsNorm[t].indexOf(token) !== -1) {
          score += 8;
          tokenMatched = true;
          break;
        }
      }

      // Description match
      if (descNorm.indexOf(token) !== -1) {
        score += 5;
        tokenMatched = true;
      }

      // Heading match
      for (var h = 0; h < headingsNorm.length; h++) {
        if (headingsNorm[h].indexOf(token) !== -1) {
          score += 4;
          tokenMatched = true;
          break;
        }
      }

      // Body text match (lowest weight)
      if (bodyNorm.indexOf(token) !== -1) {
        score += 2;
        tokenMatched = true;
      }

      if (tokenMatched) matched++;
    }

    // Require all tokens to match at least somewhere
    if (matched < tokens.length) return 0;

    // Bonus for chapters (more useful than tool pages)
    if (doc.type === 'chapter') score += 1;

    return score;
  }

  /**
   * Search the index and return ranked results
   */
  function search(query) {
    if (!searchIndex || !searchIndex.documents) return [];

    var tokens = tokenize(query);
    if (tokens.length === 0) return [];

    var results = [];
    var docs = searchIndex.documents;

    for (var i = 0; i < docs.length; i++) {
      var s = scoreDocument(docs[i], tokens);
      if (s > 0) {
        results.push({ doc: docs[i], score: s });
      }
    }

    results.sort(function (a, b) {
      return b.score - a.score;
    });

    return results.slice(0, 8);
  }

  /**
   * Build a readable label for the exam badge
   */
  function examLabel(exam) {
    if (exam === 'series-7') return 'Series 7';
    if (exam === 'sie') return 'SIE';
    return '';
  }

  /**
   * Build the result type label
   */
  function typeLabel(doc) {
    if (doc.type === 'chapter' && doc.chapter != null) {
      return 'Ch. ' + doc.chapter;
    }
    if (doc.type === 'tool') return 'Study Tool';
    return '';
  }

  /**
   * Highlight matching tokens in text
   */
  function highlightText(text, tokens) {
    if (!text || tokens.length === 0) return text;
    var escaped = tokens.map(function (t) {
      return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
    var pattern = new RegExp('(' + escaped.join('|') + ')', 'gi');
    return text.replace(pattern, '<mark>$1</mark>');
  }

  /**
   * Find the best snippet from body text containing query tokens
   */
  function findSnippet(doc, tokens) {
    // Prefer description if it matches
    var descNorm = normalize(doc.description);
    var descMatches = tokens.some(function (t) {
      return descNorm.indexOf(t) !== -1;
    });
    if (descMatches && doc.description) {
      return doc.description.length > 120
        ? doc.description.slice(0, 120) + '\u2026'
        : doc.description;
    }

    // Otherwise pull from body
    var body = doc.body || '';
    var bodyLower = body.toLowerCase();

    for (var i = 0; i < tokens.length; i++) {
      var pos = bodyLower.indexOf(tokens[i]);
      if (pos !== -1) {
        var start = Math.max(0, pos - 40);
        var end = Math.min(body.length, pos + 80);
        var snippet = body.slice(start, end);
        if (start > 0) snippet = '\u2026' + snippet;
        if (end < body.length) snippet = snippet + '\u2026';
        return snippet;
      }
    }

    // Fallback: description or first 120 chars of body
    if (doc.description) {
      return doc.description.length > 120
        ? doc.description.slice(0, 120) + '\u2026'
        : doc.description;
    }
    return body.slice(0, 120) + (body.length > 120 ? '\u2026' : '');
  }

  /**
   * Resolve URL relative to current page location
   */
  function resolveUrl(relativeUrl) {
    // The search-index stores paths relative to fhm/ root like "pages/series-7/file.html"
    // We need to resolve relative to the current page.
    // If we're at pages/training/index.html, we need ../../ prefix
    // Use a base URL approach
    var currentPath = window.location.pathname;

    // Count depth from fhm root by finding how deep we are
    // Look for known path segments
    var fhmIdx = currentPath.indexOf('/fhm/');
    if (fhmIdx !== -1) {
      var afterFhm = currentPath.slice(fhmIdx + 5); // after /fhm/
      var depth = afterFhm.split('/').length - 1; // number of directory levels
      var prefix = '';
      for (var i = 0; i < depth; i++) {
        prefix += '../';
      }
      return prefix + relativeUrl;
    }

    // Fallback: assume we're 2 levels deep (pages/training/)
    return '../../' + relativeUrl;
  }

  /**
   * Render search results into the dropdown
   */
  function renderResults(results, query) {
    if (!resultsContainer) return;

    var tokens = tokenize(query);
    activeIndex = -1;

    if (results.length === 0 && query.length > 0) {
      resultsContainer.innerHTML =
        '<div class="search-empty">' +
        '<p>No results for "<strong>' +
        escapeHtml(query) +
        '</strong>"</p>' +
        '<p class="search-empty__hint">Try broader terms like "options", "bonds", or "margin"</p>' +
        '</div>';
      showResults();
      return;
    }

    if (results.length === 0) {
      hideResults();
      return;
    }

    var html = '';
    for (var i = 0; i < results.length; i++) {
      var doc = results[i].doc;
      var snippet = findSnippet(doc, tokens);
      var url = resolveUrl(doc.url);
      var exam = examLabel(doc.exam);
      var type = typeLabel(doc);

      html +=
        '<a href="' +
        escapeHtml(url) +
        '" class="search-result" data-index="' +
        i +
        '">' +
        '<div class="search-result__header">' +
        '<span class="search-result__title">' +
        highlightText(escapeHtml(doc.title), tokens) +
        '</span>' +
        (exam || type
          ? '<span class="search-result__badges">' +
            (exam ? '<span class="search-result__badge search-result__badge--' + doc.exam + '">' + exam + '</span>' : '') +
            (type ? '<span class="search-result__badge search-result__badge--type">' + type + '</span>' : '') +
            '</span>'
          : '') +
        '</div>' +
        '<p class="search-result__snippet">' +
        highlightText(escapeHtml(snippet), tokens) +
        '</p>' +
        '</a>';
    }

    resultsContainer.innerHTML = html;
    showResults();
  }

  /**
   * Escape HTML special characters
   */
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  /**
   * Show the results dropdown + overlay
   */
  function showResults() {
    if (resultsContainer) resultsContainer.classList.add('search-results--visible');
    if (overlay) overlay.classList.add('search-overlay--visible');
  }

  /**
   * Hide the results dropdown + overlay
   */
  function hideResults() {
    if (resultsContainer) resultsContainer.classList.remove('search-results--visible');
    if (overlay) overlay.classList.remove('search-overlay--visible');
    activeIndex = -1;
  }

  /**
   * Handle keyboard navigation in results
   */
  function handleKeydown(e) {
    var items = resultsContainer ? resultsContainer.querySelectorAll('.search-result') : [];
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      updateActiveItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, -1);
      updateActiveItem(items);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      items[activeIndex].click();
    } else if (e.key === 'Escape') {
      hideResults();
      searchInput.blur();
    }
  }

  /**
   * Update visual active state for keyboard navigation
   */
  function updateActiveItem(items) {
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('search-result--active', i === activeIndex);
    }
    if (activeIndex >= 0 && items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * Debounced input handler
   */
  function handleInput() {
    clearTimeout(debounceTimer);
    var query = searchInput.value.trim();

    if (query.length < 2) {
      hideResults();
      return;
    }

    debounceTimer = setTimeout(function () {
      var results = search(query);
      renderResults(results, query);
    }, 150);
  }

  /**
   * Load the search index JSON
   */
  function loadIndex(indexUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', indexUrl, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          searchIndex = JSON.parse(xhr.responseText);
        } catch (e) {
          console.error('Failed to parse search index:', e);
        }
      }
    };
    xhr.send();
  }

  /**
   * Initialize the search component.
   * Call this after the DOM is ready, passing the base URL for the index.
   *
   * @param {Object} opts
   * @param {string} opts.inputId - ID of the search <input>
   * @param {string} opts.resultsId - ID of the results container
   * @param {string} opts.overlayId - ID of the overlay element
   * @param {string} opts.indexUrl - URL to search-index.json
   */
  function init(opts) {
    searchInput = document.getElementById(opts.inputId);
    resultsContainer = document.getElementById(opts.resultsId);
    overlay = document.getElementById(opts.overlayId);

    if (!searchInput || !resultsContainer) {
      console.warn('Search: missing input or results container');
      return;
    }

    loadIndex(opts.indexUrl);

    searchInput.addEventListener('input', handleInput);
    searchInput.addEventListener('keydown', handleKeydown);
    searchInput.addEventListener('focus', function () {
      if (searchInput.value.trim().length >= 2) {
        handleInput();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', function () {
        hideResults();
      });
    }

    // Close on click outside
    document.addEventListener('click', function (e) {
      var wrapper = searchInput.closest('.search-wrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        hideResults();
      }
    });

    // Keyboard shortcut: / to focus search
    document.addEventListener('keydown', function (e) {
      if (
        e.key === '/' &&
        !e.ctrlKey &&
        !e.metaKey &&
        document.activeElement !== searchInput &&
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  // Expose the init function globally
  window.FHMSearch = { init: init };
})();
