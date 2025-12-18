/**
 * Prompt Property Manager - Prototype Application
 * Demo conversations and interactivity
 */

// ============================================
// Property Configuration
// ============================================

const properties = {
    oakwood: {
        id: 'oakwood',
        name: 'Oakwood Commons',
        type: 'HOA Community',
        description: 'I can answer questions about community rules, policies, and procedures—everything from parking and pets to architectural changes and assessments.',
        docsPath: 'docs/',
        formsPath: 'forms/',
        manager: {
            name: 'Sarah Chen',
            email: 'schen@oakwoodmgmt.com',
            phone: '(555) 123-4567'
        }
    },
    meridian: {
        id: 'meridian',
        name: 'The Meridian',
        type: 'Apartments',
        description: 'I can help with lease questions, maintenance requests, amenities, and apartment policies—from move-in to move-out.',
        docsPath: 'docs/meridian/',
        formsPath: 'forms/meridian/',
        manager: {
            name: 'Marcus Thompson',
            email: 'mthompson@meridianmgmt.com',
            phone: '(555) 234-5678'
        }
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset Ridge',
        type: 'Condominiums',
        description: 'I can answer questions about condo association rules, common area policies, and owner guidelines—from rentals to renovations.',
        docsPath: 'docs/sunset/',
        formsPath: 'forms/sunset/',
        manager: {
            name: 'Jennifer Park',
            email: 'jpark@sunsetridgehoa.com',
            phone: '(555) 345-6789'
        }
    }
};

let currentProperty = 'oakwood';

// ============================================
// Property-Specific Demo Responses
// ============================================

const propertyResponses = {
    oakwood: {
    // Simple answer - Pool hours
    "What are the pool hours?": {
        content: `
            <p>The pool is open <strong>6 AM - 10 PM daily</strong>, year-round.</p>
            <p><strong>Guest policy:</strong> Up to 4 guests per household. Residents must accompany guests at all times.</p>
            <p><strong>Reservations:</strong> Not required for general use. For parties of 8+, reserve 48 hours ahead through the resident portal.</p>
        `,
        citation: "Community Rules Section 5.1",
        citationLink: "docs/ccrs.html",
        followup: "Would you like information about reserving the pool area for an event?"
    },

    // Simple answer - Pet policy
    "What's the pet policy?": {
        content: `
            <p><span class="status-badge status-allowed"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Allowed</span></p>
            <p>Dogs and cats are allowed at Oakwood Commons.</p>
            <h4>Requirements:</h4>
            <ul>
                <li>Maximum 2 pets per household</li>
                <li>Dogs must be leashed in common areas</li>
                <li>Weight limit: 50 lbs</li>
                <li>Some breeds restricted (see community guidelines)</li>
                <li>Registration required within 14 days</li>
            </ul>
            <h4>To register your pet:</h4>
            <ol>
                <li>Log into your resident portal</li>
                <li>Complete the Pet Registration form</li>
                <li>Upload vaccination records</li>
            </ol>
        `,
        citation: "CC&Rs Section 7.1-7.3 (Page 24)",
        citationLink: "docs/ccrs.html#section-7-1",
        followup: "Need help with the registration form?",
        followupLink: "forms/pet-registration.html",
        followupLabel: "Open Pet Registration Form"
    },

    // Conditional answer - Fence
    "Can I put up a fence?": {
        content: `
            <p><span class="status-badge status-conditional"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Approval Required</span></p>
            <p>Yes, fences are allowed at Oakwood Commons with Architectural Review Committee approval.</p>
            <h4>Requirements:</h4>
            <ul>
                <li>Maximum height: 6 feet</li>
                <li>Materials: Wood or vinyl only (no chain link)</li>
                <li>Colors: Must match approved earth-tone palette</li>
                <li>Setback: At least 3 feet from property line</li>
            </ul>
            <h4>Process:</h4>
            <ol>
                <li>Submit Architectural Review Application</li>
                <li>Include fence plan/drawing and material samples</li>
                <li>Pay $50 application fee</li>
                <li>Allow 30 days for review</li>
            </ol>
            <p><strong>Timeline:</strong> The ARC meets the first Tuesday of each month. Most applications are decided within 21 days.</p>
        `,
        citation: "CC&Rs Section 4.1-4.2 (Page 12)",
        citationLink: "docs/ccrs.html#section-4-2",
        followup: "Would you like help with the application process?",
        followupLink: "forms/arc-application.html",
        followupLabel: "Open ARC Application Form"
    },

    // No answer - Airbnb
    "Can I rent my unit on Airbnb?": {
        content: `
            <p><span class="status-badge status-prohibited"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Not Allowed</span></p>
            <p>Short-term rentals under 30 days aren't permitted at Oakwood Commons.</p>
            <p>I know this might affect your plans—this policy exists to maintain community stability and comply with local regulations.</p>
            <h4>What you can do:</h4>
            <ul>
                <li>Rentals of 30 days or longer <em>are</em> allowed with board notification</li>
                <li>The HOA maintains a list of approved property managers if you're considering long-term rental</li>
            </ul>
        `,
        citation: "CC&Rs Section 8.2-8.4 (Page 28)",
        citationLink: "docs/ccrs.html#section-8-2",
        followup: "Would you like information about the long-term rental process?",
        followupLink: "forms/rental-notification.html",
        followupLabel: "Open Rental Notification Form",
        disclaimer: "Policy information only—consult your property manager for your specific situation."
    },

    // Quiet hours
    "What are the quiet hours?": {
        content: `
            <p><strong>Quiet hours are 10 PM to 7 AM</strong> daily.</p>
            <p>During these hours, residents are expected to keep noise at a level that doesn't disturb neighbors. This includes:</p>
            <ul>
                <li>Music and TV volume</li>
                <li>Parties and gatherings</li>
                <li>Pet noise</li>
                <li>Construction or renovation work</li>
            </ul>
            <h4>Construction hours:</h4>
            <p>Renovation and construction work is only permitted:</p>
            <ul>
                <li>Weekdays: 8 AM - 6 PM</li>
                <li>Saturdays: 9 AM - 5 PM</li>
                <li>Sundays: No construction allowed</li>
            </ul>
        `,
        citation: "CC&Rs Section 9.2",
        citationLink: "docs/ccrs.html",
        followup: "Is there anything else about noise policies I can help with?"
    },

    // Parking
    "What are the parking rules?": {
        content: `
            <p>Each unit at Oakwood Commons is assigned <strong>2 parking spaces</strong> (check your lease for your specific spots).</p>
            <h4>Guest parking:</h4>
            <ul>
                <li>Visitor spaces are available in designated areas</li>
                <li>Guests may park for up to 72 hours</li>
                <li>Extended stays require a visitor pass from the office</li>
            </ul>
            <h4>Not permitted:</h4>
            <ul>
                <li>RVs, boats, or trailers in driveways or streets</li>
                <li>Commercial vehicles with visible signage overnight</li>
                <li>Vehicles on blocks or under repair in common view</li>
                <li>Parking on lawns or landscaped areas</li>
            </ul>
            <p><strong>Enforcement:</strong> Vehicles in violation may be towed at owner's expense after 24-hour notice (immediate tow for fire lane or handicap violations).</p>
        `,
        citation: "CC&Rs Section 6.4 (Page 20)",
        citationLink: "docs/ccrs.html#section-6-4",
        followup: "Need information about requesting a visitor parking pass?"
    },

    // Escalation - complex neighbor issue
    "My neighbor's tree is dropping leaves into my yard": {
        content: `
            <p>This is a good question that touches on property line issues and potentially local ordinances—I want to make sure you get accurate guidance.</p>
            <p><strong>What I can tell you:</strong> The CC&Rs don't specifically address overhanging branches from a neighbor's tree.</p>
            <h4>I'd recommend:</h4>
            <p>Contacting your property manager, <strong>Sarah Chen</strong>, who can advise on:</p>
            <ul>
                <li>Any relevant community guidelines</li>
                <li>How similar situations have been handled</li>
                <li>Whether neighbor mediation might help</li>
            </ul>
        `,
        citation: null,
        followup: "Is there anything else about community policies I can help clarify?",
        showContact: true
    },

    // Default fallback
    "default": {
        content: `
            <p>I can help you find information about Oakwood Commons policies. Try asking about:</p>
            <ul>
                <li>Pets and animals</li>
                <li>Parking rules</li>
                <li>Pool and amenity hours</li>
                <li>Home modifications (fences, paint, etc.)</li>
                <li>Noise and quiet hours</li>
                <li>Rental restrictions</li>
            </ul>
            <p>For account-specific questions, payments, or situations that need a judgment call, I'll connect you with your property manager.</p>
        `,
        citation: null,
        followup: "What would you like to know about?"
    }
    },

    // ============================================
    // The Meridian Apartments - Different Rules
    // ============================================
    meridian: {
        "What are the pool hours?": {
            content: `
                <p>The pool at The Meridian is open <strong>7 AM - 9 PM daily</strong> (seasonal: May 1 - October 15).</p>
                <p><strong>Guest policy:</strong> Maximum 2 guests per resident. Guests must be accompanied at all times.</p>
                <p><strong>Key fob required</strong> for pool access. Lost fobs: $25 replacement fee.</p>
            `,
            citation: "Lease Addendum B, Section 3",
            citationLink: "docs/fpo-document.html",
            followup: "Would you like information about the fitness center hours?"
        },
        "What's the pet policy?": {
            content: `
                <p><span class="status-badge status-conditional"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Restricted</span></p>
                <p>Pets are allowed at The Meridian with restrictions.</p>
                <h4>Requirements:</h4>
                <ul>
                    <li>Maximum <strong>1 pet</strong> per apartment</li>
                    <li>Weight limit: <strong>35 lbs</strong></li>
                    <li>Cats and dogs only (no exotic animals)</li>
                    <li>Breed restrictions: No pit bulls, rottweilers, dobermans, or wolf hybrids</li>
                </ul>
                <h4>Fees:</h4>
                <ul>
                    <li>Non-refundable pet fee: $400</li>
                    <li>Monthly pet rent: $50</li>
                </ul>
            `,
            citation: "Pet Policy Addendum, Section 1-3",
            citationLink: "docs/fpo-document.html",
            followup: "Need to submit a pet application?",
            followupLink: "forms/fpo-form.html",
            followupLabel: "Open Pet Application"
        },
        "Can I put up a fence?": {
            content: `
                <p><span class="status-badge status-prohibited"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Not Allowed</span></p>
                <p>As a renter at The Meridian, you cannot make structural modifications including fences, patios, or permanent fixtures.</p>
                <h4>What you CAN do:</h4>
                <ul>
                    <li>Add temporary privacy screens on balconies (removable)</li>
                    <li>Place potted plants</li>
                    <li>Use outdoor furniture</li>
                </ul>
                <p>All modifications must be removed at move-out or charges will apply.</p>
            `,
            citation: "Lease Agreement Section 8.1",
            citationLink: "docs/fpo-document.html",
            followup: "Questions about what's allowed on your balcony?"
        },
        "Can I rent my unit on Airbnb?": {
            content: `
                <p><span class="status-badge status-prohibited"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Not Allowed</span></p>
                <p><strong>Subletting is strictly prohibited</strong> at The Meridian. This includes:</p>
                <ul>
                    <li>Short-term rentals (Airbnb, VRBO)</li>
                    <li>Subletting to roommates not on the lease</li>
                    <li>Long-term subletting of any kind</li>
                </ul>
                <p>Violation may result in lease termination with 30 days notice.</p>
            `,
            citation: "Lease Agreement Section 12.4",
            citationLink: "docs/fpo-document.html",
            disclaimer: "Contact management if you need to discuss early lease termination options."
        },
        "What are the quiet hours?": {
            content: `
                <p><strong>Quiet hours are 10 PM to 8 AM</strong> Sunday-Thursday, and <strong>11 PM to 9 AM</strong> Friday-Saturday.</p>
                <p>The Meridian takes noise seriously. Violations may result in:</p>
                <ul>
                    <li>1st offense: Written warning</li>
                    <li>2nd offense: $100 fine</li>
                    <li>3rd offense: $250 fine and lease review</li>
                </ul>
            `,
            citation: "House Rules Section 4",
            citationLink: "docs/fpo-document.html",
            followup: "Need to report a noise complaint?",
            followupLink: "forms/fpo-form.html",
            followupLabel: "Report Noise Complaint"
        },
        "What are the parking rules?": {
            content: `
                <p>Each apartment includes <strong>1 assigned parking space</strong>. Additional spaces: $75/month (if available).</p>
                <h4>Guest parking:</h4>
                <ul>
                    <li>Visitor lot: 24-hour maximum</li>
                    <li>Guest passes required for overnight (get from office)</li>
                </ul>
                <h4>Strictly prohibited:</h4>
                <ul>
                    <li>Parking in assigned spots other than your own</li>
                    <li>Oversized vehicles, RVs, boats</li>
                    <li>Vehicle repairs in parking lot</li>
                    <li>Storing unregistered vehicles</li>
                </ul>
                <p><strong>Towing:</strong> Violations towed immediately at owner's expense.</p>
            `,
            citation: "Parking Addendum, Section 1-4",
            citationLink: "docs/fpo-document.html",
            followup: "Need to request additional parking?",
            followupLink: "forms/fpo-form.html",
            followupLabel: "Request Additional Parking"
        },
        "default": {
            content: `
                <p>I can help you find information about The Meridian policies. Try asking about:</p>
                <ul>
                    <li>Pet policies and fees</li>
                    <li>Parking rules</li>
                    <li>Pool and amenity hours</li>
                    <li>Noise and quiet hours</li>
                    <li>Maintenance requests</li>
                    <li>Move-out procedures</li>
                </ul>
                <p>For lease questions, rent payments, or maintenance emergencies, contact the leasing office.</p>
            `,
            citation: null,
            followup: "What would you like to know about?"
        }
    },

    // ============================================
    // Sunset Ridge Condos - More Permissive Rules
    // ============================================
    sunset: {
        "What are the pool hours?": {
            content: `
                <p>The pool and hot tub are open <strong>5 AM - 11 PM daily</strong>, year-round.</p>
                <p><strong>Guest policy:</strong> Up to 6 guests per unit. Children under 14 require adult supervision.</p>
                <p><strong>Pool cabana reservations:</strong> Available for private events. Book through the HOA portal ($50 cleaning fee).</p>
            `,
            citation: "Community Rules Section 7.1",
            citationLink: "docs/fpo-document.html",
            followup: "Would you like to reserve the pool cabana?",
            followupLink: "forms/fpo-form.html",
            followupLabel: "Reserve Pool Cabana"
        },
        "What's the pet policy?": {
            content: `
                <p><span class="status-badge status-allowed"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Allowed</span></p>
                <p>Sunset Ridge is a pet-friendly community!</p>
                <h4>Requirements:</h4>
                <ul>
                    <li>Maximum <strong>3 pets</strong> per unit</li>
                    <li>Weight limit: <strong>75 lbs</strong></li>
                    <li>Dogs, cats, and caged small animals permitted</li>
                    <li>No breed restrictions</li>
                    <li>All pets must be registered with HOA</li>
                </ul>
                <h4>Fees:</h4>
                <ul>
                    <li>One-time registration: $50 per pet</li>
                    <li>No monthly pet fees</li>
                </ul>
                <p>We have a dedicated dog park on the north side of the property!</p>
            `,
            citation: "CC&Rs Article 9, Section 9.1-9.3",
            citationLink: "docs/fpo-document.html",
            followup: "Need to register a new pet?",
            followupLink: "forms/fpo-form.html",
            followupLabel: "Register Pet"
        },
        "Can I put up a fence?": {
            content: `
                <p><span class="status-badge status-conditional"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> HOA Approval Required</span></p>
                <p>Fences are allowed with Design Review Committee approval.</p>
                <h4>Requirements:</h4>
                <ul>
                    <li>Maximum height: <strong>6 feet</strong> (8 feet for privacy fences on corner lots)</li>
                    <li>Materials: Wood, vinyl, wrought iron, or composite</li>
                    <li>Chain link allowed in rear yards only</li>
                </ul>
                <h4>Streamlined process:</h4>
                <ol>
                    <li>Submit online application with photos</li>
                    <li>$25 application fee</li>
                    <li>Approval within <strong>14 days</strong></li>
                </ol>
            `,
            citation: "Architectural Guidelines Section 4.2",
            citationLink: "docs/fpo-document.html",
            followup: "Ready to submit a fence application?",
            followupLink: "forms/fpo-form.html",
            followupLabel: "Open Fence Application"
        },
        "Can I rent my unit on Airbnb?": {
            content: `
                <p><span class="status-badge status-conditional"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Allowed with Registration</span></p>
                <p><strong>Short-term rentals ARE permitted</strong> at Sunset Ridge with proper registration.</p>
                <h4>Requirements:</h4>
                <ul>
                    <li>Register with HOA before listing</li>
                    <li>Minimum stay: 3 nights</li>
                    <li>Maximum 180 rental nights per year</li>
                    <li>Provide guest rules to all renters</li>
                </ul>
                <h4>Fees:</h4>
                <ul>
                    <li>Annual STR permit: $200</li>
                    <li>Per-stay fee: $25 (covers common area cleaning)</li>
                </ul>
            `,
            citation: "CC&Rs Article 11, Section 11.4",
            citationLink: "docs/fpo-document.html",
            followup: "Would you like to register for a short-term rental permit?",
            followupLink: "forms/fpo-form.html",
            followupLabel: "Apply for STR Permit"
        },
        "What are the quiet hours?": {
            content: `
                <p><strong>Quiet hours are 10 PM to 7 AM</strong> daily.</p>
                <p>Sunset Ridge values a peaceful community while respecting owners' rights.</p>
                <h4>Special events:</h4>
                <ul>
                    <li>Outdoor parties until 11 PM with 48-hour neighbor notification</li>
                    <li>July 4th and New Year's Eve: Extended to midnight</li>
                </ul>
            `,
            citation: "Community Rules Section 3.1",
            citationLink: "docs/fpo-document.html",
            followup: "Planning an event? I can help with notification requirements.",
            followupLink: "forms/fpo-form.html",
            followupLabel: "Submit Event Notification"
        },
        "What are the parking rules?": {
            content: `
                <p>Each condo includes <strong>2 assigned garage spaces</strong>. Street parking available for guests.</p>
                <h4>Guest & street parking:</h4>
                <ul>
                    <li>Guest passes: Not required for stays under 7 days</li>
                    <li>Street parking: 72-hour limit, then must move</li>
                </ul>
                <h4>RV/Boat storage:</h4>
                <ul>
                    <li>Designated RV lot available ($100/month)</li>
                    <li>No street parking of RVs/boats over 24 hours</li>
                </ul>
            `,
            citation: "CC&Rs Article 6, Section 6.1-6.5",
            citationLink: "docs/fpo-document.html",
            followup: "Need to reserve RV storage?",
            followupLink: "forms/fpo-form.html",
            followupLabel: "Reserve RV Storage"
        },
        "default": {
            content: `
                <p>I can help you find information about Sunset Ridge policies. Try asking about:</p>
                <ul>
                    <li>Pet policies (we're pet-friendly!)</li>
                    <li>Parking and RV storage</li>
                    <li>Pool, hot tub, and amenity hours</li>
                    <li>Home modifications and renovations</li>
                    <li>Short-term rental permits</li>
                    <li>HOA dues and assessments</li>
                </ul>
                <p>For assessment payments or board matters, contact the HOA office.</p>
            `,
            citation: null,
            followup: "What would you like to know about?"
        }
    }
};

// Helper function to get responses for current property
function getDemoResponses() {
    return propertyResponses[currentProperty] || propertyResponses.oakwood;
}

// ============================================
// DOM Elements
// ============================================

const chatContainer = document.getElementById('chatContainer');
const welcomeSection = document.getElementById('welcomeSection');
const messagesContainer = document.getElementById('messagesContainer');
const typingIndicator = document.getElementById('typingIndicator');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const contactModal = document.getElementById('contactModal');
const modalClose = document.getElementById('modalClose');
const quickActionButtons = document.querySelectorAll('.quick-action-btn');

// Property selector elements
const propertySelector = document.getElementById('propertySelector');
const propertySelectorBtn = document.getElementById('propertySelectorBtn');
const propertyDropdown = document.getElementById('propertyDropdown');
const propertyOptions = document.querySelectorAll('.property-option');
const currentPropertyNameEl = document.getElementById('currentPropertyName');
const welcomePropertyNameEl = document.getElementById('welcomePropertyName');
const welcomeDescriptionEl = document.getElementById('welcomeDescription');

// ============================================
// State
// ============================================

let isTyping = false;
let conversationStarted = false;

// ============================================
// Property Switching
// ============================================

function togglePropertyDropdown() {
    propertySelector.classList.toggle('open');
}

function closePropertyDropdown() {
    propertySelector.classList.remove('open');
}

function switchProperty(propertyId) {
    if (propertyId === currentProperty) {
        closePropertyDropdown();
        return;
    }

    currentProperty = propertyId;
    const property = properties[propertyId];

    // Update UI elements
    currentPropertyNameEl.textContent = property.name;
    welcomePropertyNameEl.textContent = property.name;
    welcomeDescriptionEl.textContent = property.description;
    document.title = `Prompt Property Manager - ${property.name}`;

    // Update active state in dropdown
    propertyOptions.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.property === propertyId);
    });

    // Reset conversation
    conversationStarted = false;
    messagesContainer.innerHTML = '';
    welcomeSection.style.display = 'block';

    closePropertyDropdown();
}

// ============================================
// Message Functions
// ============================================

function createUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    return messageDiv;
}

function createAssistantMessage(response) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant-message';

    let html = `<div class="message-content">${response.content}`;

    // Add citation if present
    if (response.citation) {
        html += `
            <div class="source-citation">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>Source: <a href="${response.citationLink || '#'}" target="_blank">${response.citation}</a></span>
            </div>
        `;
    }

    // Add disclaimer if present
    if (response.disclaimer) {
        html += `<p class="inline-disclaimer">${response.disclaimer}</p>`;
    }

    // Add action buttons if present
    if (response.actions && response.actions.length > 0) {
        html += `<div class="message-actions">`;
        response.actions.forEach(action => {
            html += `
                <button class="action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    ${action.label}
                </button>
            `;
        });
        html += `</div>`;
    }

    // Add contact card button if needed
    if (response.showContact) {
        html += `
            <div class="message-actions">
                <button class="action-btn" onclick="showContactModal()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Contact Sarah Chen
                </button>
            </div>
        `;
    }

    // Add follow-up prompt
    if (response.followup) {
        html += `<p class="followup-prompt">${response.followup}</p>`;
        if (response.followupLink) {
            html += `
                <div class="message-actions">
                    <a href="${response.followupLink}" target="_blank" class="action-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        ${response.followupLabel || 'Open Form'}
                    </a>
                </div>
            `;
        }
    }

    html += `</div>`;
    messageDiv.innerHTML = html;

    return messageDiv;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function findResponse(query) {
    const normalizedQuery = query.toLowerCase().trim();
    const responses = getDemoResponses();

    // Check for exact matches first
    for (const [key, value] of Object.entries(responses)) {
        if (key.toLowerCase() === normalizedQuery) {
            return value;
        }
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(responses)) {
        // Check if key topics are mentioned
        if (key.toLowerCase().includes('pool') && normalizedQuery.includes('pool')) {
            return value;
        }
        if (key.toLowerCase().includes('pet') && (normalizedQuery.includes('pet') || normalizedQuery.includes('dog') || normalizedQuery.includes('cat'))) {
            return value;
        }
        if (key.toLowerCase().includes('fence') && normalizedQuery.includes('fence')) {
            return value;
        }
        if (key.toLowerCase().includes('airbnb') && (normalizedQuery.includes('airbnb') || normalizedQuery.includes('short-term') || normalizedQuery.includes('short term') || normalizedQuery.includes('rent'))) {
            return value;
        }
        if (key.toLowerCase().includes('quiet') && (normalizedQuery.includes('quiet') || normalizedQuery.includes('noise'))) {
            return value;
        }
        if (key.toLowerCase().includes('parking') && normalizedQuery.includes('parking')) {
            return value;
        }
    }

    // Return default
    return responses.default;
}

// ============================================
// Conversation Flow
// ============================================

async function sendMessage(text) {
    if (isTyping || !text.trim()) return;

    // Hide welcome section on first message
    if (!conversationStarted) {
        welcomeSection.classList.add('hidden');
        conversationStarted = true;
    }

    // Clear input
    messageInput.value = '';

    // Add user message
    const userMessage = createUserMessage(text);
    messagesContainer.appendChild(userMessage);

    // Scroll to bottom
    scrollToBottom();

    // Show typing indicator
    isTyping = true;
    typingIndicator.classList.add('visible');

    // Simulate response delay (1-2 seconds)
    const delay = 1000 + Math.random() * 1000;
    await sleep(delay);

    // Hide typing indicator
    typingIndicator.classList.remove('visible');
    isTyping = false;

    // Find and add response
    const response = findResponse(text);
    const assistantMessage = createAssistantMessage(response);
    messagesContainer.appendChild(assistantMessage);

    // Scroll to bottom
    scrollToBottom();
}

function scrollToBottom() {
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// Modal Functions
// ============================================

function showContactModal() {
    contactModal.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function hideContactModal() {
    contactModal.classList.remove('visible');
    document.body.style.overflow = '';
}

// ============================================
// Event Listeners
// ============================================

// Property selector toggle
propertySelectorBtn.addEventListener('click', togglePropertyDropdown);

// Property option selection
propertyOptions.forEach(option => {
    option.addEventListener('click', () => {
        switchProperty(option.dataset.property);
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!propertySelector.contains(e.target)) {
        closePropertyDropdown();
    }
});

// Send message on button click
sendButton.addEventListener('click', () => {
    sendMessage(messageInput.value);
});

// Send message on Enter key
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(messageInput.value);
    }
});

// Quick action buttons
quickActionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-question');
        if (question) {
            sendMessage(question);
        }
    });
});

// Modal close
modalClose.addEventListener('click', hideContactModal);
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        hideContactModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('visible')) {
        hideContactModal();
    }
});

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    messageInput.focus();
});

// Make showContactModal available globally for inline onclick
window.showContactModal = showContactModal;
