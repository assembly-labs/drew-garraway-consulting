/**
 * Dev Queue - Kill Your PM
 * Kanban-style project management for autonomous Claude Code execution
 */

(function() {
  'use strict';

  // ============================================
  // State Management
  // ============================================

  const STORAGE_KEY = 'devqueue_user';
  const STATUSES = ['backlog', 'review', 'approved', 'queued', 'in-progress', 'done', 'blocked'];
  const PRIORITY_LABELS = ['', 'Critical', 'High', 'Medium', 'Low', 'Nice to have'];

  let state = {
    data: null,
    filters: {
      project: '',
      priority: '',
      status: '',
      search: '',
      myTickets: false
    },
    currentView: 'board', // 'board' or 'table'
    tableSort: {
      column: 'createdAt',
      direction: 'desc'
    },
    currentUser: '',
    currentTicketId: null,
    draggedTicket: null
  };

  // ============================================
  // Data Persistence
  // ============================================

  async function loadData() {
    try {
      const response = await fetch('BACKLOG.json');
      if (!response.ok) {
        throw new Error('Failed to load BACKLOG.json');
      }
      state.data = await response.json();
    } catch (error) {
      console.warn('Creating new BACKLOG.json:', error.message);
      state.data = {
        meta: {
          lastUpdated: null,
          version: '1.0',
          ticketCounter: 0
        },
        projects: [],
        tickets: []
      };
    }

    // Load user preferences from localStorage
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        const prefs = JSON.parse(savedUser);
        state.currentUser = prefs.name || '';
      } catch (e) {}
    }
  }

  async function saveData() {
    state.data.meta.lastUpdated = new Date().toISOString();

    // In a real implementation, this would POST to a server
    // For now, we use localStorage as a fallback and log the data
    localStorage.setItem('devqueue_backlog', JSON.stringify(state.data));

    // Generate QUEUE.md whenever data changes
    generateQueueFile();

    // Show saved indicator
    showSavedIndicator();

    // Log for debugging
    console.log('Data saved:', state.data);
  }

  function showSavedIndicator() {
    const indicator = document.getElementById('savedIndicator');
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 2000);
  }

  // ============================================
  // QUEUE.md Generation
  // ============================================

  function generateQueueFile() {
    const queuedTickets = state.data.tickets
      .filter(t => t.status === 'queued')
      .sort((a, b) => a.priority - b.priority);

    if (queuedTickets.length === 0) {
      console.log('QUEUE.md: No tickets in queue');
      return;
    }

    let content = '# Claude Code Queue\n\n## Next Up\n\n';

    for (const ticket of queuedTickets) {
      const project = state.data.projects.find(p => p.id === ticket.project);

      content += `### ${ticket.id}: ${ticket.title}\n`;
      content += `**Project:** ${project?.name || ticket.project}\n`;
      content += `**Path:** ${project?.path || 'N/A'}\n\n`;

      content += `**Description:**\n${ticket.description}\n\n`;

      content += `**Acceptance Criteria:**\n`;
      for (const criterion of ticket.acceptanceCriteria) {
        content += `- [ ] ${criterion}\n`;
      }
      content += '\n';

      if (ticket.filesAffected && ticket.filesAffected.length > 0) {
        content += `**Files Affected:**\n`;
        for (const file of ticket.filesAffected) {
          content += `- ${file}\n`;
        }
        content += '\n';
      }

      if (ticket.edgeCases && ticket.edgeCases.length > 0) {
        content += `**Edge Cases:**\n`;
        for (const edge of ticket.edgeCases) {
          content += `- ${edge}\n`;
        }
        content += '\n';
      }

      if (ticket.technicalNotes) {
        content += `**Technical Notes:**\n${ticket.technicalNotes}\n\n`;
      }

      content += '---\n\n';
    }

    // Store in localStorage for reference
    localStorage.setItem('devqueue_queue_md', content);
    console.log('QUEUE.md generated:\n', content);
  }

  // ============================================
  // Ticket Operations
  // ============================================

  function generateTicketId() {
    state.data.meta.ticketCounter++;
    return `TKT-${String(state.data.meta.ticketCounter).padStart(4, '0')}`;
  }

  function createTicket(ticketData) {
    const now = new Date().toISOString();
    const ticket = {
      id: generateTicketId(),
      title: ticketData.title,
      project: ticketData.project,
      status: 'backlog',
      priority: parseInt(ticketData.priority),
      createdAt: now,
      updatedAt: now,
      createdBy: ticketData.createdBy,
      description: ticketData.description,
      acceptanceCriteria: ticketData.acceptanceCriteria.filter(c => c.trim()),
      filesAffected: ticketData.filesAffected.filter(f => f.trim()),
      dependencies: [],
      edgeCases: ticketData.edgeCases.filter(e => e.trim()),
      technicalNotes: ticketData.technicalNotes || '',
      comments: [],
      activityLog: [
        {
          action: 'created',
          by: ticketData.createdBy,
          at: now
        }
      ],
      claudeOutput: null
    };

    state.data.tickets.push(ticket);
    saveData();
    return ticket;
  }

  function updateTicket(ticketId, updates) {
    const ticket = state.data.tickets.find(t => t.id === ticketId);
    if (!ticket) return null;

    Object.assign(ticket, updates, { updatedAt: new Date().toISOString() });
    saveData();
    return ticket;
  }

  function deleteTicket(ticketId) {
    const index = state.data.tickets.findIndex(t => t.id === ticketId);
    if (index === -1) return false;

    state.data.tickets.splice(index, 1);
    saveData();
    return true;
  }

  function moveTicket(ticketId, newStatus, movedBy) {
    const ticket = state.data.tickets.find(t => t.id === ticketId);
    if (!ticket) return { success: false, error: 'Ticket not found' };

    // Validation for moving to 'approved'
    if (newStatus === 'approved') {
      if (ticket.description.length < 100) {
        return { success: false, error: 'Description must be at least 100 characters' };
      }
      if (ticket.acceptanceCriteria.length < 2) {
        return { success: false, error: 'At least 2 acceptance criteria required' };
      }
    }

    // Validation for moving to 'queued'
    if (newStatus === 'queued') {
      if (ticket.status !== 'approved') {
        return { success: false, error: 'Ticket must be approved before queuing' };
      }

      // Check dependencies
      if (ticket.dependencies && ticket.dependencies.length > 0) {
        for (const depId of ticket.dependencies) {
          const depTicket = state.data.tickets.find(t => t.id === depId);
          if (depTicket && depTicket.status !== 'done') {
            return { success: false, error: `Dependency ${depId} is not complete` };
          }
        }
      }
    }

    const oldStatus = ticket.status;
    ticket.status = newStatus;
    ticket.updatedAt = new Date().toISOString();
    ticket.activityLog.push({
      action: 'moved',
      from: oldStatus,
      to: newStatus,
      by: movedBy || state.currentUser || 'Unknown',
      at: ticket.updatedAt
    });

    saveData();
    return { success: true };
  }

  function addComment(ticketId, author, text) {
    const ticket = state.data.tickets.find(t => t.id === ticketId);
    if (!ticket) return null;

    const comment = {
      id: `comment-${Date.now()}`,
      author,
      text,
      createdAt: new Date().toISOString()
    };

    ticket.comments.push(comment);
    saveData();
    return comment;
  }

  // ============================================
  // Project Operations
  // ============================================

  function createProject(slug, name, path) {
    if (state.data.projects.find(p => p.id === slug)) {
      return { success: false, error: 'Project slug already exists' };
    }

    state.data.projects.push({ id: slug, name, path });
    saveData();
    return { success: true };
  }

  function deleteProject(projectId) {
    const hasTickets = state.data.tickets.some(t => t.project === projectId);
    if (hasTickets) {
      return { success: false, error: 'Cannot delete project with tickets' };
    }

    const index = state.data.projects.findIndex(p => p.id === projectId);
    if (index === -1) return { success: false, error: 'Project not found' };

    state.data.projects.splice(index, 1);
    saveData();
    return { success: true };
  }

  // ============================================
  // Filtering
  // ============================================

  function getFilteredTickets() {
    let tickets = [...state.data.tickets];

    if (state.filters.project) {
      tickets = tickets.filter(t => t.project === state.filters.project);
    }

    if (state.filters.priority) {
      tickets = tickets.filter(t => t.priority === parseInt(state.filters.priority));
    }

    if (state.filters.status) {
      tickets = tickets.filter(t => t.status === state.filters.status);
    }

    if (state.filters.myTickets && state.currentUser) {
      tickets = tickets.filter(t => t.createdBy === state.currentUser);
    }

    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      tickets = tickets.filter(t =>
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.id.toLowerCase().includes(search) ||
        t.acceptanceCriteria.some(c => c.toLowerCase().includes(search))
      );
    }

    return tickets;
  }

  // ============================================
  // Rendering
  // ============================================

  function render() {
    const board = document.getElementById('board');
    const tableView = document.getElementById('tableView');

    if (state.currentView === 'board') {
      board.style.display = 'flex';
      tableView.style.display = 'none';
      renderBoard();
      updateColumnCounts();
    } else {
      board.style.display = 'none';
      tableView.style.display = 'block';
      renderTable();
    }

    renderProjectFilters();
    renderFilterPills();
  }

  function renderBoard() {
    const tickets = getFilteredTickets();

    for (const status of STATUSES) {
      const column = document.querySelector(`.column-content[data-status="${status}"]`);
      column.innerHTML = '';

      const statusTickets = tickets
        .filter(t => t.status === status)
        .sort((a, b) => a.priority - b.priority);

      for (const ticket of statusTickets) {
        column.appendChild(createTicketCard(ticket));
      }
    }
  }

  function createTicketCard(ticket) {
    const project = state.data.projects.find(p => p.id === ticket.project);
    const priorityClass = getPriorityClass(ticket.priority);
    const priorityLabel = PRIORITY_LABELS[ticket.priority];
    const initials = getInitials(ticket.createdBy);
    const dateStr = formatDate(ticket.createdAt);

    const card = document.createElement('div');
    card.className = `ticket-card priority-${ticket.priority}`;
    card.draggable = true;
    card.dataset.ticketId = ticket.id;

    card.innerHTML = `
      <div class="ticket-card-header">
        <span class="project-tag" style="background: ${getProjectColor(ticket.project)}">${project?.name || ticket.project}</span>
        <span class="ticket-card-priority">
          <span class="priority-dot ${priorityClass}"></span>
          ${priorityLabel}
        </span>
      </div>
      <div class="ticket-card-title">${escapeHtml(ticket.title)}</div>
      <div class="ticket-card-desc">${escapeHtml(ticket.description.substring(0, 80))}${ticket.description.length > 80 ? '...' : ''}</div>
      <div class="ticket-card-footer">
        <div class="ticket-card-info">
          <span class="ticket-id">${ticket.id}</span>
          <span>·</span>
          <span class="creator-avatar">${initials}</span>
          <span>·</span>
          <span>${dateStr}</span>
        </div>
      </div>
    `;

    // Event listeners
    card.addEventListener('click', () => openTicketDetail(ticket.id));
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
  }

  /**
   * Get priority class name for CSS
   */
  function getPriorityClass(priority) {
    const classes = ['', 'critical', 'high', 'medium', 'low', 'nice'];
    return classes[priority] || 'medium';
  }

  /**
   * Get status class name for CSS
   */
  function getStatusClass(status) {
    return status.replace('-', '-');
  }

  function renderProjectFilters() {
    const projectFilter = document.getElementById('projectFilter');
    const ticketProject = document.getElementById('ticketProject');

    projectFilter.innerHTML = '<option value="">All Projects</option>';
    ticketProject.innerHTML = '<option value="">Select project</option>';

    for (const project of state.data.projects) {
      const option1 = document.createElement('option');
      option1.value = project.id;
      option1.textContent = project.name;
      projectFilter.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = project.id;
      option2.textContent = project.name;
      ticketProject.appendChild(option2);
    }
  }

  function updateColumnCounts() {
    const tickets = getFilteredTickets();

    for (const status of STATUSES) {
      const count = tickets.filter(t => t.status === status).length;
      const countEl = document.querySelector(`.column-count[data-count="${status}"]`);
      if (countEl) countEl.textContent = count;
    }
  }

  // ============================================
  // Table View Rendering
  // ============================================

  function renderTable() {
    const tickets = getFilteredTickets();
    const tbody = document.getElementById('tableBody');
    const emptyState = document.getElementById('tableEmpty');

    // Sort tickets
    const sorted = sortTickets(tickets, state.tableSort.column, state.tableSort.direction);

    // Update sort indicators in header
    document.querySelectorAll('.ticket-table th.sortable').forEach(th => {
      th.classList.remove('sorted', 'asc', 'desc');
      if (th.dataset.sort === state.tableSort.column) {
        th.classList.add('sorted', state.tableSort.direction);
      }
    });

    tbody.innerHTML = '';

    if (sorted.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }

    emptyState.style.display = 'none';

    for (const ticket of sorted) {
      const row = createTableRow(ticket);
      tbody.appendChild(row);
    }
  }

  function createTableRow(ticket) {
    const project = state.data.projects.find(p => p.id === ticket.project);
    const priorityClass = getPriorityClass(ticket.priority);
    const priorityLabel = PRIORITY_LABELS[ticket.priority];
    const statusClass = ticket.status;
    const statusLabel = formatStatus(ticket.status);
    const initials = getInitials(ticket.createdBy);
    const dateStr = formatDate(ticket.createdAt);

    const row = document.createElement('tr');
    row.dataset.ticketId = ticket.id;

    row.innerHTML = `
      <td class="td-id">${ticket.id}</td>
      <td class="td-title">${escapeHtml(ticket.title)}</td>
      <td class="td-project">
        <span class="project-tag" style="background: ${getProjectColor(ticket.project)}">${project?.name || ticket.project}</span>
      </td>
      <td class="td-priority">
        <span class="priority-badge">
          <span class="priority-dot ${priorityClass}"></span>
          ${priorityLabel}
        </span>
      </td>
      <td class="td-status">
        <span class="status-badge">
          <span class="status-dot ${statusClass}"></span>
          ${statusLabel}
        </span>
      </td>
      <td class="td-date">${dateStr}</td>
      <td class="td-creator">
        <span class="creator-avatar">${initials}</span>
        <span>${escapeHtml(ticket.createdBy)}</span>
      </td>
    `;

    row.addEventListener('click', () => openTicketDetail(ticket.id));

    return row;
  }

  function sortTickets(tickets, column, direction) {
    const sorted = [...tickets];

    sorted.sort((a, b) => {
      let aVal, bVal;

      switch (column) {
        case 'id':
          // Extract number from TKT-XXXX
          aVal = parseInt(a.id.replace('TKT-', ''));
          bVal = parseInt(b.id.replace('TKT-', ''));
          break;
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'project':
          aVal = a.project.toLowerCase();
          bVal = b.project.toLowerCase();
          break;
        case 'priority':
          aVal = a.priority;
          bVal = b.priority;
          break;
        case 'status':
          aVal = STATUSES.indexOf(a.status);
          bVal = STATUSES.indexOf(b.status);
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  // ============================================
  // Filter Pills
  // ============================================

  function renderFilterPills() {
    const container = document.getElementById('filterPills');
    container.innerHTML = '';

    const hasFilters = state.filters.project || state.filters.priority ||
                       state.filters.status || state.filters.search || state.filters.myTickets;

    if (!hasFilters) {
      container.classList.remove('has-filters');
      return;
    }

    container.classList.add('has-filters');

    // Project filter pill
    if (state.filters.project) {
      const project = state.data.projects.find(p => p.id === state.filters.project);
      container.appendChild(createFilterPill('Project', project?.name || state.filters.project, 'project'));
    }

    // Priority filter pill
    if (state.filters.priority) {
      container.appendChild(createFilterPill('Priority', PRIORITY_LABELS[state.filters.priority], 'priority'));
    }

    // Status filter pill
    if (state.filters.status) {
      container.appendChild(createFilterPill('Status', formatStatus(state.filters.status), 'status'));
    }

    // Search filter pill
    if (state.filters.search) {
      container.appendChild(createFilterPill('Search', `"${state.filters.search}"`, 'search'));
    }

    // My Tickets filter pill
    if (state.filters.myTickets) {
      container.appendChild(createFilterPill('Creator', state.currentUser || 'Me', 'myTickets'));
    }

    // Clear all button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'filter-clear-all';
    clearBtn.textContent = 'Clear all';
    clearBtn.addEventListener('click', clearAllFilters);
    container.appendChild(clearBtn);
  }

  function createFilterPill(label, value, filterKey) {
    const pill = document.createElement('div');
    pill.className = 'filter-pill';
    pill.innerHTML = `
      <span class="filter-pill-label">${label}:</span>
      <span class="filter-pill-value">${escapeHtml(value)}</span>
      <button class="filter-pill-remove" title="Remove filter">&times;</button>
    `;

    pill.querySelector('.filter-pill-remove').addEventListener('click', () => {
      clearFilter(filterKey);
    });

    return pill;
  }

  function clearFilter(filterKey) {
    if (filterKey === 'myTickets') {
      state.filters.myTickets = false;
      document.getElementById('myTicketsToggle').checked = false;
    } else {
      state.filters[filterKey] = '';
      const selectEl = document.getElementById(`${filterKey}Filter`);
      if (selectEl) selectEl.value = '';
      if (filterKey === 'search') {
        document.getElementById('searchInput').value = '';
      }
    }
    render();
  }

  function clearAllFilters() {
    state.filters = {
      project: '',
      priority: '',
      status: '',
      search: '',
      myTickets: false
    };

    document.getElementById('projectFilter').value = '';
    document.getElementById('priorityFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('myTicketsToggle').checked = false;

    render();
  }

  function renderProjectList() {
    const list = document.getElementById('projectList');
    list.innerHTML = '';

    if (state.data.projects.length === 0) {
      list.innerHTML = '<p class="text-muted">No projects yet. Create one below.</p>';
      return;
    }

    for (const project of state.data.projects) {
      const ticketCount = state.data.tickets.filter(t => t.project === project.id).length;
      const item = document.createElement('div');
      item.className = 'project-item';
      item.innerHTML = `
        <div class="project-info">
          <span class="project-slug">[${project.id}]</span>
          <span class="project-name">${escapeHtml(project.name)}</span>
          <span class="project-path">${escapeHtml(project.path)} (${ticketCount} tickets)</span>
        </div>
        <div class="project-actions">
          <button class="btn btn-danger btn-small delete-project-btn" data-project="${project.id}" ${ticketCount > 0 ? 'disabled title="Cannot delete project with tickets"' : ''}>Delete</button>
        </div>
      `;
      list.appendChild(item);
    }

    // Add delete handlers
    list.querySelectorAll('.delete-project-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const projectId = btn.dataset.project;
        showConfirmModal('Delete Project', `Are you sure you want to delete this project?`, () => {
          const result = deleteProject(projectId);
          if (result.success) {
            showToast('Project deleted', 'success');
            renderProjectList();
            renderProjectFilters();
          } else {
            showToast(result.error, 'error');
          }
        });
      });
    });
  }

  // ============================================
  // Ticket Detail Modal
  // ============================================

  function openTicketDetail(ticketId) {
    const ticket = state.data.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    state.currentTicketId = ticketId;
    const project = state.data.projects.find(p => p.id === ticket.project);
    const content = document.getElementById('ticketDetailContent');

    content.innerHTML = `
      <div class="ticket-detail-header">
        <h1 class="ticket-detail-title">${escapeHtml(ticket.title)}</h1>
        <div class="ticket-detail-meta">
          <span class="project-tag" style="background: ${getProjectColor(ticket.project)}">${project?.name || ticket.project}</span>
          <select class="status-select" id="detailStatusSelect">
            ${STATUSES.map(s => `<option value="${s}" ${s === ticket.status ? 'selected' : ''}>${formatStatus(s)}</option>`).join('')}
          </select>
          <span class="priority-stars">${getPriorityStars(ticket.priority)} ${PRIORITY_LABELS[ticket.priority]}</span>
        </div>
        <div class="ticket-detail-info">
          ${ticket.id} &bull; Created by ${escapeHtml(ticket.createdBy)} on ${formatDateLong(ticket.createdAt)}
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-header">
          <h3 class="detail-section-title">Description</h3>
        </div>
        <div class="detail-section-content">
          <p>${escapeHtml(ticket.description)}</p>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-header">
          <h3 class="detail-section-title">Acceptance Criteria</h3>
        </div>
        <div class="detail-section-content">
          <ul>
            ${ticket.acceptanceCriteria.map(c => `
              <li>
                <input type="checkbox" class="criteria-checkbox" disabled>
                <span>${escapeHtml(c)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      ${ticket.filesAffected.length > 0 ? `
        <div class="detail-section">
          <div class="detail-section-header">
            <h3 class="detail-section-title">Files Affected</h3>
          </div>
          <div class="detail-section-content">
            <ul>
              ${ticket.filesAffected.map(f => `<li><span class="file-path">${escapeHtml(f)}</span></li>`).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      ${ticket.dependencies.length > 0 ? `
        <div class="detail-section">
          <div class="detail-section-header">
            <h3 class="detail-section-title">Dependencies</h3>
          </div>
          <div class="detail-section-content">
            <ul>
              ${ticket.dependencies.map(depId => {
                const dep = state.data.tickets.find(t => t.id === depId);
                return `<li>
                  <a href="#" class="dependency-link" data-ticket="${depId}">${depId}</a>
                  ${dep ? `- ${escapeHtml(dep.title)}` : ''}
                  <span class="dependency-status ${dep?.status === 'done' ? 'done' : 'pending'}">${dep?.status === 'done' ? '✓ Done' : dep?.status || 'Unknown'}</span>
                </li>`;
              }).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      ${ticket.edgeCases.length > 0 ? `
        <div class="detail-section">
          <div class="detail-section-header">
            <h3 class="detail-section-title">Edge Cases</h3>
          </div>
          <div class="detail-section-content">
            <ul>
              ${ticket.edgeCases.map(e => `<li>• ${escapeHtml(e)}</li>`).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      ${ticket.technicalNotes ? `
        <div class="detail-section">
          <div class="detail-section-header">
            <h3 class="detail-section-title">Technical Notes</h3>
          </div>
          <div class="detail-section-content">
            <p>${escapeHtml(ticket.technicalNotes)}</p>
          </div>
        </div>
      ` : ''}

      <div class="detail-section">
        <div class="detail-section-header">
          <h3 class="detail-section-title">Comments</h3>
        </div>
        <div class="comments-section">
          <div class="comment-list">
            ${ticket.comments.length > 0 ? ticket.comments.map(c => `
              <div class="comment-item">
                <div class="comment-avatar">${getInitials(c.author)}</div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">${escapeHtml(c.author)}</span>
                    <span class="comment-date">${formatDateLong(c.createdAt)}</span>
                  </div>
                  <p class="comment-text">${escapeHtml(c.text)}</p>
                </div>
              </div>
            `).join('') : '<p class="text-muted">No comments yet.</p>'}
          </div>
          <div class="comment-form">
            <input type="text" id="commentInput" class="form-input comment-input" placeholder="Write a comment...">
            <button class="btn btn-primary btn-small" id="postCommentBtn">Post</button>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-header">
          <h3 class="detail-section-title">Activity Log</h3>
        </div>
        <div class="activity-log">
          ${ticket.activityLog.slice().reverse().map(a => `
            <div class="activity-item">
              <span class="activity-date">${formatDateLong(a.at)}</span>
              <span>${escapeHtml(a.by)} ${formatActivity(a)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      ${ticket.claudeOutput ? `
        <div class="detail-section claude-output">
          <div class="detail-section-header">
            <h3 class="detail-section-title">Claude Output</h3>
          </div>
          <div class="claude-output-info">
            <div class="claude-output-row">
              <span class="claude-output-label">Branch:</span>
              <span class="claude-output-value">${escapeHtml(ticket.claudeOutput.branch)}</span>
            </div>
            <div class="claude-output-row">
              <span class="claude-output-label">Commits:</span>
              <span class="claude-output-value">${ticket.claudeOutput.commits.join(', ')}</span>
            </div>
            <div class="claude-output-row">
              <span class="claude-output-label">Completed:</span>
              <span class="claude-output-value">${formatDateLong(ticket.claudeOutput.completedAt)}</span>
            </div>
          </div>
          <div class="claude-output-summary">
            <p>${escapeHtml(ticket.claudeOutput.summary)}</p>
          </div>
        </div>
      ` : ''}
    `;

    // Event listeners
    document.getElementById('detailStatusSelect').addEventListener('change', (e) => {
      const result = moveTicket(ticketId, e.target.value, state.currentUser);
      if (!result.success) {
        showToast(result.error, 'error');
        e.target.value = ticket.status;
      } else {
        showToast('Status updated', 'success');
        render();
      }
    });

    document.getElementById('postCommentBtn').addEventListener('click', () => {
      const input = document.getElementById('commentInput');
      const text = input.value.trim();
      if (!text) return;

      const author = state.currentUser || 'Anonymous';
      addComment(ticketId, author, text);
      input.value = '';
      openTicketDetail(ticketId); // Refresh
      showToast('Comment added', 'success');
    });

    // Dependency links
    content.querySelectorAll('.dependency-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openTicketDetail(link.dataset.ticket);
      });
    });

    openModal('ticketDetailModal');
  }

  function formatActivity(activity) {
    if (activity.action === 'created') return 'created this ticket';
    if (activity.action === 'moved') return `moved from ${formatStatus(activity.from)} to ${formatStatus(activity.to)}`;
    return activity.action;
  }

  function formatStatus(status) {
    return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // ============================================
  // Drag and Drop
  // ============================================

  function handleDragStart(e) {
    const card = e.target.closest('.ticket-card');
    state.draggedTicket = card.dataset.ticketId;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd(e) {
    const card = e.target.closest('.ticket-card');
    if (card) card.classList.remove('dragging');
    state.draggedTicket = null;

    document.querySelectorAll('.column-content').forEach(col => {
      col.classList.remove('drag-over');
    });
  }

  function setupDragAndDrop() {
    document.querySelectorAll('.column-content').forEach(column => {
      column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('drag-over');
      });

      column.addEventListener('dragleave', () => {
        column.classList.remove('drag-over');
      });

      column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('drag-over');

        if (!state.draggedTicket) return;

        const newStatus = column.dataset.status;
        const result = moveTicket(state.draggedTicket, newStatus, state.currentUser);

        if (result.success) {
          showToast(`Moved to ${formatStatus(newStatus)}`, 'success');
          render();
        } else {
          showToast(result.error, 'error');
        }
      });
    });
  }

  // ============================================
  // Modal Management
  // ============================================

  function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
  }

  function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  function setupModals() {
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        closeAllModals();
      });
    });

    // Backdrop clicks
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', () => {
        closeAllModals();
      });
    });
  }

  function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;

    const confirmBtn = document.getElementById('confirmBtn');
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

    newBtn.addEventListener('click', () => {
      onConfirm();
      closeModal('confirmModal');
    });

    openModal('confirmModal');
  }

  // ============================================
  // Toast Notifications
  // ============================================

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // ============================================
  // Form Handling
  // ============================================

  function setupNewTicketForm() {
    const form = document.getElementById('newTicketForm');
    const descInput = document.getElementById('ticketDescription');
    const charCount = document.getElementById('descCharCount');

    // Character count
    descInput.addEventListener('input', () => {
      const count = descInput.value.length;
      charCount.textContent = count;
      charCount.style.color = count >= 100 ? 'var(--status-done)' : 'var(--text-muted)';
    });

    // Add criteria button
    document.getElementById('addCriteriaBtn').addEventListener('click', () => {
      addListItem('acceptanceCriteriaList', 'criteria');
    });

    // Add file button
    document.getElementById('addFileBtn').addEventListener('click', () => {
      addListItem('filesAffectedList', 'file');
    });

    // Add edge case button
    document.getElementById('addEdgeCaseBtn').addEventListener('click', () => {
      addListItem('edgeCasesList', 'edge-case');
    });

    // Remove buttons (delegated)
    form.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remove-criteria') ||
          e.target.classList.contains('btn-remove-file') ||
          e.target.classList.contains('btn-remove-edge-case')) {
        e.target.closest('.criteria-item, .file-item, .edge-case-item').remove();
      }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('ticketTitle').value.trim();
      const project = document.getElementById('ticketProject').value;
      const priority = document.querySelector('input[name="priority"]:checked')?.value || '3';
      const description = document.getElementById('ticketDescription').value.trim();
      const technicalNotes = document.getElementById('ticketTechnicalNotes').value.trim();
      const createdBy = document.getElementById('ticketCreator').value.trim();

      const acceptanceCriteria = Array.from(
        document.querySelectorAll('#acceptanceCriteriaList .criteria-input')
      ).map(input => input.value.trim());

      const filesAffected = Array.from(
        document.querySelectorAll('#filesAffectedList .file-input')
      ).map(input => input.value.trim());

      const edgeCases = Array.from(
        document.querySelectorAll('#edgeCasesList .edge-case-input')
      ).map(input => input.value.trim());

      // Validation
      if (!project) {
        showToast('Please select a project', 'error');
        return;
      }

      if (description.length < 100) {
        showToast('Description must be at least 100 characters', 'error');
        return;
      }

      const validCriteria = acceptanceCriteria.filter(c => c);
      if (validCriteria.length < 2) {
        showToast('At least 2 acceptance criteria required', 'error');
        return;
      }

      // Save user preference
      state.currentUser = createdBy;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: createdBy }));

      // Create ticket
      const ticket = createTicket({
        title,
        project,
        priority,
        description,
        acceptanceCriteria: validCriteria,
        filesAffected,
        edgeCases,
        technicalNotes,
        createdBy
      });

      showToast(`Ticket ${ticket.id} created`, 'success');
      closeAllModals();
      resetNewTicketForm();
      render();
    });
  }

  function addListItem(listId, type) {
    const list = document.getElementById(listId);
    const item = document.createElement('div');
    item.className = `${type}-item`;

    let placeholder = '';
    if (type === 'criteria') placeholder = 'Another criterion...';
    if (type === 'file') placeholder = '/path/to/file.js';
    if (type === 'edge-case') placeholder = 'What if the user...';

    item.innerHTML = `
      <input type="text" class="form-input ${type}-input" placeholder="${placeholder}">
      <button type="button" class="btn btn-icon btn-remove-${type}">&times;</button>
    `;
    list.appendChild(item);
    item.querySelector('input').focus();
  }

  function resetNewTicketForm() {
    const form = document.getElementById('newTicketForm');
    form.reset();

    // Reset criteria list to 2 items
    document.getElementById('acceptanceCriteriaList').innerHTML = `
      <div class="criteria-item">
        <input type="text" class="form-input criteria-input" placeholder="What must be true for this to be complete?">
        <button type="button" class="btn btn-icon btn-remove-criteria">&times;</button>
      </div>
      <div class="criteria-item">
        <input type="text" class="form-input criteria-input" placeholder="Another criterion...">
        <button type="button" class="btn btn-icon btn-remove-criteria">&times;</button>
      </div>
    `;

    // Reset files list to 1 item
    document.getElementById('filesAffectedList').innerHTML = `
      <div class="file-item">
        <input type="text" class="form-input file-input" placeholder="/path/to/file.js">
        <button type="button" class="btn btn-icon btn-remove-file">&times;</button>
      </div>
    `;

    // Reset edge cases list to 1 item
    document.getElementById('edgeCasesList').innerHTML = `
      <div class="edge-case-item">
        <input type="text" class="form-input edge-case-input" placeholder="What if the user...">
        <button type="button" class="btn btn-icon btn-remove-edge-case">&times;</button>
      </div>
    `;

    // Restore user name
    if (state.currentUser) {
      document.getElementById('ticketCreator').value = state.currentUser;
    }

    document.getElementById('descCharCount').textContent = '0';
  }

  function setupProjectForm() {
    const form = document.getElementById('addProjectForm');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const slug = document.getElementById('projectSlug').value.trim().toLowerCase();
      const name = document.getElementById('projectName').value.trim();
      const path = document.getElementById('projectPath').value.trim();

      const result = createProject(slug, name, path);

      if (result.success) {
        showToast('Project created', 'success');
        form.reset();
        renderProjectList();
        renderProjectFilters();
      } else {
        showToast(result.error, 'error');
      }
    });
  }

  // ============================================
  // Event Handlers
  // ============================================

  function setupEventHandlers() {
    // New ticket button
    document.getElementById('newTicketBtn').addEventListener('click', () => {
      if (state.data.projects.length === 0) {
        showToast('Create a project first', 'warning');
        openModal('projectModal');
        return;
      }
      resetNewTicketForm();
      openModal('newTicketModal');
    });

    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', () => {
      renderProjectList();
      openModal('projectModal');
    });

    // Help button
    document.getElementById('helpBtn').addEventListener('click', () => {
      openModal('shortcutsModal');
    });

    // Welcome modal
    document.getElementById('welcomeCreateProjectBtn').addEventListener('click', () => {
      closeModal('welcomeModal');
      openModal('projectModal');
    });

    // Delete ticket button
    document.getElementById('deleteTicketBtn').addEventListener('click', () => {
      if (!state.currentTicketId) return;

      showConfirmModal('Delete Ticket', 'Are you sure you want to delete this ticket?', () => {
        deleteTicket(state.currentTicketId);
        showToast('Ticket deleted', 'success');
        closeAllModals();
        render();
      });
    });

    // Filters
    document.getElementById('projectFilter').addEventListener('change', (e) => {
      state.filters.project = e.target.value;
      render();
    });

    document.getElementById('priorityFilter').addEventListener('change', (e) => {
      state.filters.priority = e.target.value;
      render();
    });

    document.getElementById('myTicketsToggle').addEventListener('change', (e) => {
      state.filters.myTickets = e.target.checked;
      render();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      render();
    });

    // Status filter
    document.getElementById('statusFilter').addEventListener('change', (e) => {
      state.filters.status = e.target.value;
      render();
    });

    // View toggle
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        if (view === state.currentView) return;

        state.currentView = view;

        // Update button states
        document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        render();
      });
    });

    // Table sorting
    document.querySelectorAll('.ticket-table th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const column = th.dataset.sort;

        if (state.tableSort.column === column) {
          // Toggle direction
          state.tableSort.direction = state.tableSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
          // New column, default to descending for dates/IDs, ascending for text
          state.tableSort.column = column;
          state.tableSort.direction = (column === 'createdAt' || column === 'id') ? 'desc' : 'asc';
        }

        renderTable();
      });
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ignore if in input
      if (e.target.matches('input, textarea, select')) {
        if (e.key === 'Escape') {
          e.target.blur();
          closeAllModals();
        }
        return;
      }

      switch (e.key) {
        case 'n':
        case 'N':
          e.preventDefault();
          if (state.data.projects.length === 0) {
            showToast('Create a project first', 'warning');
            openModal('projectModal');
          } else {
            resetNewTicketForm();
            openModal('newTicketModal');
          }
          break;

        case 'Escape':
          closeAllModals();
          break;

        case '/':
          e.preventDefault();
          document.getElementById('searchInput').focus();
          break;

        case '?':
          e.preventDefault();
          openModal('shortcutsModal');
          break;

        case 'v':
        case 'V':
          e.preventDefault();
          // Toggle view
          state.currentView = state.currentView === 'board' ? 'table' : 'board';
          document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === state.currentView);
          });
          render();
          break;
      }
    });
  }

  // ============================================
  // Utility Functions
  // ============================================

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatDateLong(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  function getPriorityStars(priority) {
    const filled = 6 - priority;
    return '<span class="filled">' + '★'.repeat(filled) + '</span><span class="empty">' + '☆'.repeat(priority - 1) + '</span>';
  }

  function getProjectColor(projectId) {
    // Generate consistent color from project ID
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
      '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'
    ];
    let hash = 0;
    for (let i = 0; i < projectId.length; i++) {
      hash = projectId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  // ============================================
  // Initialization
  // ============================================

  async function init() {
    await loadData();

    // Check for localStorage backup
    const backup = localStorage.getItem('devqueue_backlog');
    if (backup && !state.data.tickets.length) {
      try {
        const parsed = JSON.parse(backup);
        if (parsed.tickets && parsed.tickets.length > 0) {
          state.data = parsed;
        }
      } catch (e) {}
    }

    setupModals();
    setupDragAndDrop();
    setupNewTicketForm();
    setupProjectForm();
    setupEventHandlers();
    setupKeyboardShortcuts();

    render();

    // Show welcome modal if no projects
    if (state.data.projects.length === 0) {
      openModal('welcomeModal');
    }

    console.log('Dev Queue initialized');
  }

  // Start the app
  init();

})();
