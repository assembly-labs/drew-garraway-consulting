/**
 * Alliance BJJ - Advanced Modal System
 * Dynamic, accessible modal management with smooth animations
 */

class ModalSystem {
    constructor() {
        this.activeModals = [];
        this.templates = {};
        this.focusTrap = null;
        this.previousFocus = null;
        this.init();
    }

    init() {
        // Set up event listeners
        this.setupEventListeners();

        // Register modal templates from the page
        this.registerTemplates();

        // Initialize any modals that should be open on load
        this.checkUrlHash();
    }

    setupEventListeners() {
        // Click handler for modal triggers
        document.addEventListener('click', (e) => {
            // Handle modal triggers
            const trigger = e.target.closest('[data-modal]');
            if (trigger) {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                const modalData = this.extractDataAttributes(trigger);
                this.open(modalId, modalData);
            }

            // Handle modal close buttons
            const closeBtn = e.target.closest('[data-modal-close]');
            if (closeBtn) {
                e.preventDefault();
                this.close();
            }

            // Handle backdrop clicks
            if (e.target.classList.contains('modal-backdrop')) {
                this.close();
            }
        });

        // Keyboard handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.length > 0) {
                this.close();
            }
        });
    }

    extractDataAttributes(element) {
        const data = {};
        for (const attr of element.attributes) {
            if (attr.name.startsWith('data-') && attr.name !== 'data-modal') {
                const key = attr.name.slice(5).replace(/-(.)/g, (_, char) => char.toUpperCase());
                data[key] = attr.value;
            }
        }
        return data;
    }

    registerTemplates() {
        // Find all modal templates in the page
        document.querySelectorAll('[data-modal-template]').forEach(template => {
            const id = template.dataset.modalTemplate;
            this.templates[id] = template;
            template.style.display = 'none';
        });
    }

    checkUrlHash() {
        if (window.location.hash) {
            const modalId = window.location.hash.slice(1);
            if (this.templates[modalId]) {
                this.open(modalId);
            }
        }
    }

    async open(modalId, data = {}) {
        // Store previous focus for accessibility
        this.previousFocus = document.activeElement;

        // Create backdrop
        const backdrop = this.createBackdrop();

        // Get or create modal content
        const modalContent = await this.getModalContent(modalId, data);
        if (!modalContent) {
            console.error(`Modal template not found: ${modalId}`);
            return;
        }

        // Create modal container
        const modalContainer = this.createModalContainer(modalContent);

        // Add to DOM
        document.body.appendChild(backdrop);
        document.body.appendChild(modalContainer);

        // Force reflow for animation
        backdrop.offsetHeight;
        modalContainer.offsetHeight;

        // Trigger animations
        requestAnimationFrame(() => {
            backdrop.classList.add('active');
            modalContainer.classList.add('active');
        });

        // Set up focus trap
        this.setupFocusTrap(modalContainer);

        // Add to active modals
        this.activeModals.push({
            id: modalId,
            backdrop,
            container: modalContainer,
            data
        });

        // Emit custom event
        this.emit('modal:opened', { modalId, data });

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    async getModalContent(modalId, data) {
        // Check for template
        if (this.templates[modalId]) {
            return this.renderTemplate(this.templates[modalId], data);
        }

        // Check for predefined modal content
        const content = this.getPredefinedModal(modalId, data);
        if (content) {
            return content;
        }

        // Try to load from external file (for existing modal pages)
        try {
            const response = await fetch(`owner/${modalId}.html`);
            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const modalContent = doc.querySelector('.modal');
                if (modalContent) {
                    return this.processExternalModal(modalContent, data);
                }
            }
        } catch (error) {
            console.error('Error loading modal:', error);
        }

        return null;
    }

    getPredefinedModal(modalId, data) {
        const modals = {
            'promote-member': this.createPromotionModal(data),
            'add-member': this.createAddMemberModal(data),
            'class-detail': this.createClassDetailModal(data),
            'payment-failed': this.createPaymentFailedModal(data),
            'confirm-action': this.createConfirmModal(data)
        };

        return modals[modalId] || null;
    }

    createPromotionModal(data) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h2>Promote ${data.memberName || 'Member'}</h2>
                <button class="modal-close-btn" data-modal-close>
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="promotion-preview">
                    <div class="current-rank">
                        <h4>Current Rank</h4>
                        <div class="belt-badge belt-${data.currentBelt || 'white'}">
                            <div class="stripes">${this.generateStripes(data.currentStripes || 0)}</div>
                        </div>
                    </div>
                    <div class="promotion-arrow">→</div>
                    <div class="new-rank">
                        <h4>New Rank</h4>
                        <div class="belt-badge belt-${data.newBelt || data.currentBelt || 'white'}">
                            <div class="stripes">${this.generateStripes(data.newStripes || 0)}</div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" data-modal-close>Cancel</button>
                    <button class="btn btn-primary btn-interactive" onclick="this.classList.add('celebration'); setTimeout(() => window.ModalSystem.close(), 800);">
                        Confirm Promotion
                    </button>
                </div>
            </div>
        `;
        return modal;
    }

    createAddMemberModal(data) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h2>Add New Member</h2>
                <button class="modal-close-btn" data-modal-close>
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form class="form-modern">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" class="form-control input-modern" placeholder="Enter member name">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control input-modern" placeholder="member@email.com">
                    </div>
                    <div class="form-group">
                        <label>Belt Rank</label>
                        <select class="form-control input-modern">
                            <option>White Belt</option>
                            <option>Blue Belt</option>
                            <option>Purple Belt</option>
                            <option>Brown Belt</option>
                            <option>Black Belt</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" data-modal-close>Cancel</button>
                        <button type="submit" class="btn btn-primary btn-interactive">Add Member</button>
                    </div>
                </form>
            </div>
        `;
        return modal;
    }

    createClassDetailModal(data) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h2>${data.className || 'Class Details'}</h2>
                <button class="modal-close-btn" data-modal-close>
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="class-info">
                    <div class="info-row">
                        <span class="label">Type:</span>
                        <span class="badge badge-${data.classType || 'gi'}">${data.classType || 'Gi'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Time:</span>
                        <span>${data.time || '6:00 PM'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Duration:</span>
                        <span>${data.duration || '90 minutes'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Instructor:</span>
                        <span>${data.instructor || 'Professor Mike'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Enrolled:</span>
                        <span>${data.enrolled || '12'} / ${data.capacity || '20'}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" data-modal-close>Close</button>
                    <button class="btn btn-primary btn-interactive">Edit Class</button>
                </div>
            </div>
        `;
        return modal;
    }

    createPaymentFailedModal(data) {
        const modal = document.createElement('div');
        modal.className = 'modal modal-warning';
        modal.innerHTML = `
            <div class="modal-header">
                <h2>⚠️ Payment Failed</h2>
                <button class="modal-close-btn" data-modal-close>
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Payment failed for <strong>${data.memberName || 'Member'}</strong></p>
                <div class="error-details">
                    <p>Amount: ${data.amount || '$149'}</p>
                    <p>Card: •••• ${data.lastFour || '4242'}</p>
                    <p>Error: ${data.error || 'Insufficient funds'}</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" data-modal-close>Later</button>
                    <button class="btn btn-primary btn-interactive">Contact Member</button>
                </div>
            </div>
        `;
        return modal;
    }

    createConfirmModal(data) {
        const modal = document.createElement('div');
        modal.className = 'modal modal-confirm';
        modal.innerHTML = `
            <div class="modal-header">
                <h2>${data.title || 'Confirm Action'}</h2>
                <button class="modal-close-btn" data-modal-close>
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>${data.message || 'Are you sure you want to proceed?'}</p>
                <div class="modal-actions">
                    <button class="btn btn-secondary" data-modal-close>Cancel</button>
                    <button class="btn btn-${data.type || 'primary'} btn-interactive">
                        ${data.confirmText || 'Confirm'}
                    </button>
                </div>
            </div>
        `;
        return modal;
    }

    generateStripes(count) {
        let stripes = '';
        for (let i = 0; i < count; i++) {
            stripes += '<span class="stripe"></span>';
        }
        return stripes;
    }

    renderTemplate(template, data) {
        const clone = template.cloneNode(true);
        clone.style.display = 'block';

        // Replace template variables
        const html = clone.innerHTML.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || '';
        });

        clone.innerHTML = html;
        return clone;
    }

    processExternalModal(modalContent, data) {
        // Process and enhance external modal content
        modalContent.querySelectorAll('a[href*="modal"]').forEach(link => {
            link.setAttribute('data-modal-close', '');
            link.removeAttribute('href');
        });

        return modalContent;
    }

    createBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        return backdrop;
    }

    createModalContainer(content) {
        const container = document.createElement('div');
        container.className = 'modal-container';
        container.appendChild(content);
        return container;
    }

    setupFocusTrap(container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Focus first element
        if (firstFocusable) {
            firstFocusable.focus();
        }

        // Trap focus
        this.focusTrap = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        };

        container.addEventListener('keydown', this.focusTrap);
    }

    close() {
        const current = this.activeModals.pop();
        if (!current) return;

        // Remove active classes for animation
        current.backdrop.classList.remove('active');
        current.container.classList.remove('active');

        // Clean up after animation
        setTimeout(() => {
            // Remove elements
            current.backdrop.remove();
            current.container.remove();

            // Restore focus
            if (this.previousFocus) {
                this.previousFocus.focus();
            }

            // Restore body scroll if no more modals
            if (this.activeModals.length === 0) {
                document.body.style.overflow = '';
            }

            // Emit custom event
            this.emit('modal:closed', { modalId: current.id });
        }, 300);
    }

    closeAll() {
        while (this.activeModals.length > 0) {
            this.close();
        }
    }

    emit(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // Public API
    isOpen(modalId) {
        return this.activeModals.some(modal => modal.id === modalId);
    }

    getCurrentModal() {
        return this.activeModals[this.activeModals.length - 1] || null;
    }
}

// Initialize and expose globally
window.ModalSystem = new ModalSystem();

// Utility function for quick modal opening
window.openModal = (modalId, data) => {
    window.ModalSystem.open(modalId, data);
};

window.closeModal = () => {
    window.ModalSystem.close();
};