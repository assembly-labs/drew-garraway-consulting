/**
 * FHM Global Search — Command Palette
 *
 * Self-initializing: injects a search button into the page header
 * and creates a modal overlay. Works on every page automatically.
 * Loads the search index from a path relative to this script's location.
 */

(function () {
  'use strict';

  var searchIndex = null;
  var modal = null;
  var overlay = null;
  var input = null;
  var resultsContainer = null;
  var activeIndex = -1;
  var debounceTimer = null;

  // ── Utilities ──

  function normalize(text) {
    return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function tokenize(query) {
    return normalize(query).split(/\s+/).filter(function (w) { return w.length > 1; });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  // ── Scoring ──

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

      if (titleNorm.indexOf(token) !== -1) { score += 10; tokenMatched = true; }

      for (var t = 0; t < termsNorm.length; t++) {
        if (termsNorm[t].indexOf(token) !== -1) { score += 8; tokenMatched = true; break; }
      }

      if (descNorm.indexOf(token) !== -1) { score += 5; tokenMatched = true; }

      for (var h = 0; h < headingsNorm.length; h++) {
        if (headingsNorm[h].indexOf(token) !== -1) { score += 4; tokenMatched = true; break; }
      }

      if (bodyNorm.indexOf(token) !== -1) { score += 2; tokenMatched = true; }

      if (tokenMatched) matched++;
    }

    if (matched < tokens.length) return 0;
    if (doc.type === 'chapter') score += 1;
    return score;
  }

  function search(query) {
    if (!searchIndex || !searchIndex.documents) return [];
    var tokens = tokenize(query);
    if (tokens.length === 0) return [];

    var results = [];
    var docs = searchIndex.documents;
    for (var i = 0; i < docs.length; i++) {
      var s = scoreDocument(docs[i], tokens);
      if (s > 0) results.push({ doc: docs[i], score: s });
    }
    results.sort(function (a, b) { return b.score - a.score; });
    return results.slice(0, 8);
  }

  // ── Display Helpers ──

  function examLabel(exam) {
    if (exam === 'series-7') return 'Series 7';
    if (exam === 'sie') return 'SIE';
    return '';
  }

  function typeLabel(doc) {
    if (doc.type === 'chapter' && doc.chapter != null) return 'Ch. ' + doc.chapter;
    if (doc.type === 'tool') return 'Study Tool';
    return '';
  }

  function highlightText(text, tokens) {
    if (!text || tokens.length === 0) return text;
    var escaped = tokens.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
    var pattern = new RegExp('(' + escaped.join('|') + ')', 'gi');
    return text.replace(pattern, '<mark>$1</mark>');
  }

  function findSnippet(doc, tokens) {
    var descNorm = normalize(doc.description);
    var descMatches = tokens.some(function (t) { return descNorm.indexOf(t) !== -1; });
    if (descMatches && doc.description) {
      return doc.description.length > 120 ? doc.description.slice(0, 120) + '\u2026' : doc.description;
    }

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

    if (doc.description) {
      return doc.description.length > 120 ? doc.description.slice(0, 120) + '\u2026' : doc.description;
    }
    return body.slice(0, 120) + (body.length > 120 ? '\u2026' : '');
  }

  // ── URL Resolution ──

  /**
   * Resolve a search-index URL (relative to fhm/ root) to the current page.
   */
  function resolveUrl(relativeUrl) {
    // relativeUrl is like "pages/series-7/file.html"
    // We need to resolve relative to current page depth from fhm/
    var currentPath = window.location.pathname;
    var fhmIdx = currentPath.indexOf('/fhm/');
    if (fhmIdx !== -1) {
      var afterFhm = currentPath.slice(fhmIdx + 5);
      var depth = afterFhm.split('/').length - 1;
      var prefix = '';
      for (var i = 0; i < depth; i++) prefix += '../';
      return prefix + relativeUrl;
    }
    return relativeUrl;
  }

  /**
   * Resolve the search index URL relative to this script's own location.
   */
  function getIndexUrl() {
    // Script is at assets/js/search.js, index is at assets/data/search-index.json
    // Find our own script tag to determine path
    var scripts = document.querySelectorAll('script[src*="search.js"]');
    if (scripts.length > 0) {
      var src = scripts[scripts.length - 1].getAttribute('src');
      return src.replace(/js\/search\.js.*$/, 'data/search-index.json');
    }
    // Fallback: try relative to fhm root
    return resolveUrl('assets/data/search-index.json');
  }

  // ── Modal Rendering ──

  function renderResults(results, query) {
    var tokens = tokenize(query);
    activeIndex = -1;

    if (results.length === 0 && query.length > 0) {
      resultsContainer.innerHTML =
        '<div class="search-modal__empty">' +
        '<p>No results for "<strong>' + escapeHtml(query) + '</strong>"</p>' +
        '<p class="search-modal__empty-hint">Try broader terms like "options", "bonds", or "margin"</p>' +
        '</div>';
      return;
    }

    if (results.length === 0) {
      resultsContainer.innerHTML = '';
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
        '<a href="' + escapeHtml(url) + '" class="search-result" data-index="' + i + '">' +
        '<div class="search-result__header">' +
        '<span class="search-result__title">' + highlightText(escapeHtml(doc.title), tokens) + '</span>' +
        (exam || type
          ? '<span class="search-result__badges">' +
            (exam ? '<span class="search-result__badge search-result__badge--' + doc.exam + '">' + exam + '</span>' : '') +
            (type ? '<span class="search-result__badge search-result__badge--type">' + type + '</span>' : '') +
            '</span>'
          : '') +
        '</div>' +
        '<p class="search-result__snippet">' + highlightText(escapeHtml(snippet), tokens) + '</p>' +
        '</a>';
    }

    resultsContainer.innerHTML = html;
  }

  function updateActiveItem() {
    var items = resultsContainer.querySelectorAll('.search-result');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('search-result--active', i === activeIndex);
    }
    if (activeIndex >= 0 && items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  // ── Modal Control ──

  function openModal() {
    overlay.classList.add('search-modal-overlay--visible');
    modal.classList.add('search-modal--visible');
    input.value = '';
    resultsContainer.innerHTML = '';
    activeIndex = -1;
    setTimeout(function () { input.focus(); }, 50);
  }

  function closeModal() {
    overlay.classList.remove('search-modal-overlay--visible');
    modal.classList.remove('search-modal--visible');
    activeIndex = -1;
  }

  function isOpen() {
    return modal.classList.contains('search-modal--visible');
  }

  // ── DOM Injection ──

  var SVG_SEARCH = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>';

  function injectTriggerButton() {
    // Try nav-style header first (hub pages)
    var nav = document.querySelector('header .nav');
    if (nav) {
      var btn = document.createElement('button');
      btn.className = 'search-trigger';
      btn.setAttribute('aria-label', 'Search training content');
      btn.innerHTML =
        '<span class="search-trigger__icon">' + SVG_SEARCH + '</span>' +
        '<span class="search-trigger__shortcut">/</span>';
      btn.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
      nav.appendChild(btn);
      return;
    }

    // Chapter-style header (breadcrumb pages)
    var headerInner = document.querySelector('.header__inner');
    if (headerInner) {
      var btn = document.createElement('button');
      btn.className = 'search-trigger';
      btn.setAttribute('aria-label', 'Search training content');
      btn.innerHTML =
        '<span class="search-trigger__icon">' + SVG_SEARCH + '</span>' +
        '<span class="search-trigger__shortcut">/</span>';
      btn.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
      // Place it beside the breadcrumb
      headerInner.style.display = 'flex';
      headerInner.style.justifyContent = 'space-between';
      headerInner.style.alignItems = 'flex-start';
      headerInner.appendChild(btn);
      return;
    }

    // Last resort: append to first header
    var header = document.querySelector('header');
    if (header) {
      var btn = document.createElement('button');
      btn.className = 'search-trigger';
      btn.setAttribute('aria-label', 'Search training content');
      btn.innerHTML =
        '<span class="search-trigger__icon">' + SVG_SEARCH + '</span>' +
        '<span class="search-trigger__shortcut">/</span>';
      btn.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
      var container = header.querySelector('.container') || header;
      container.appendChild(btn);
    }
  }

  function injectModal() {
    // Overlay
    overlay = document.createElement('div');
    overlay.className = 'search-modal-overlay';
    overlay.addEventListener('click', closeModal);

    // Modal
    modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Search training content');

    modal.innerHTML =
      '<div class="search-modal__input-wrap">' +
        '<span class="search-modal__icon">' + SVG_SEARCH + '</span>' +
        '<input type="search" class="search-modal__input" placeholder="Search chapters, terms, and study tools..." autocomplete="off" aria-label="Search">' +
        '<button class="search-modal__close" aria-label="Close search">esc</button>' +
      '</div>' +
      '<div class="search-modal__results" role="listbox"></div>' +
      '<div class="search-modal__footer">' +
        '<span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>' +
        '<span><kbd>↵</kbd> open</span>' +
        '<span><kbd>esc</kbd> close</span>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    input = modal.querySelector('.search-modal__input');
    resultsContainer = modal.querySelector('.search-modal__results');

    var closeBtn = modal.querySelector('.search-modal__close');
    closeBtn.addEventListener('click', closeModal);

    // Input handler
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      var query = input.value.trim();
      if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
      }
      debounceTimer = setTimeout(function () {
        renderResults(search(query), query);
      }, 150);
    });

    // Keyboard navigation within modal
    input.addEventListener('keydown', function (e) {
      var items = resultsContainer.querySelectorAll('.search-result');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        updateActiveItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, -1);
        updateActiveItem();
      } else if (e.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
        e.preventDefault();
        items[activeIndex].click();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    });
  }

  function bindGlobalShortcuts() {
    document.addEventListener('keydown', function (e) {
      // Don't trigger when typing in inputs/textareas (unless it's our search input)
      var tag = document.activeElement.tagName;
      var isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable;

      // Cmd/Ctrl+K always opens
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen()) { closeModal(); } else { openModal(); }
        return;
      }

      // / opens when not typing
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !isTyping) {
        e.preventDefault();
        openModal();
        return;
      }

      // Escape closes
      if (e.key === 'Escape' && isOpen()) {
        e.preventDefault();
        closeModal();
      }
    });
  }

  // ── Index Loading ──

  function loadIndex() {
    var url = getIndexUrl();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try { searchIndex = JSON.parse(xhr.responseText); }
        catch (e) { console.error('FHMSearch: failed to parse index', e); }
      }
    };
    xhr.send();
  }

  // ── Init ──

  function init() {
    injectModal();
    injectTriggerButton();
    bindGlobalShortcuts();
    loadIndex();
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
