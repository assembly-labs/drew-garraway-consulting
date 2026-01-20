# SOFTWARE DEVELOPMENT AGREEMENT

**DRAFT — FOR REVIEW ONLY — NOT FOR EXECUTION**

---

## PARTIES

**This Software Development Agreement** ("Agreement") is entered into as of **[DATE]** ("Effective Date") by and between:

**CLIENT:**
Drew Garraway, doing business as Assembly Labs, LLC
[ADDRESS]
[CITY, STATE ZIP]
Email: DREW@ASSEMBLYLABS.CO
("Client")

**AND**

**DEVELOPER:**
[DEVELOPER NAME]
[DEVELOPER BUSINESS NAME, if applicable]
[ADDRESS]
[CITY, STATE ZIP]
Email: [EMAIL]
("Developer")

Client and Developer are collectively referred to as the "Parties" and individually as a "Party."

---

## RECITALS

**WHEREAS**, Client has developed a web prototype for a mobile application known as "TOMO" (the "Product"), a voice-first training journal for Brazilian Jiu-Jitsu practitioners;

**WHEREAS**, Client desires to engage Developer to convert said prototype into a production-ready iOS application for distribution via Apple's App Store;

**WHEREAS**, Developer represents that it possesses the necessary skills, experience, and qualifications to perform the services described herein;

**NOW, THEREFORE**, in consideration of the mutual covenants and agreements set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

---

## ARTICLE 1: DEFINITIONS

**1.1 "Deliverables"** means all software, source code, object code, documentation, designs, graphics, and other materials created by Developer under this Agreement.

**1.2 "Project"** means the iOS application development work described in Article 2 and the attached Scope of Work (Exhibit A).

**1.3 "Confidential Information"** means any non-public information disclosed by either Party to the other, including but not limited to business plans, technical data, trade secrets, user data, and proprietary methodologies.

**1.4 "Intellectual Property"** means all patents, copyrights, trademarks, trade secrets, and other proprietary rights in the Deliverables.

**1.5 "Client Materials"** means all existing code, designs, documentation, specifications, and other materials provided by Client to Developer.

**1.6 "Third-Party Materials"** means any software, libraries, or components not created by Developer that are incorporated into the Deliverables.

---

## ARTICLE 2: SCOPE OF WORK

**2.1 Services.** Developer agrees to perform the software development services described in Exhibit A: Scope of Work, attached hereto and incorporated by reference.

**2.2 Project Summary.** The Project consists of:

(a) Converting Client's existing React web prototype to a React Native (Expo) iOS application;

(b) Implementing backend infrastructure using Supabase (database, authentication, storage);

(c) Integrating voice recording and transcription functionality via AssemblyAI;

(d) Integrating AI-powered data extraction for session logging;

(e) Preparing the application for Apple TestFlight distribution;

(f) All related documentation and knowledge transfer.

**2.3 Exclusions.** The following are expressly excluded from this Agreement unless separately agreed in writing:

(a) Android application development;
(b) Marketing website development;
(c) Ongoing maintenance after the Warranty Period;
(d) App Store optimization or marketing;
(e) Coach or gym owner features;
(f) Content creation (videos, tutorials).

**2.4 Change Orders.** Any changes to the Scope of Work must be agreed upon in writing by both Parties. Developer shall provide a written estimate for any requested changes, including impact on timeline and cost, within five (5) business days of the request.

---

## ARTICLE 3: TIMELINE AND MILESTONES

**3.1 Project Timeline.** Developer shall complete the Project within **[NUMBER]** weeks from the Effective Date, subject to timely receipt of Client Materials and Client approvals.

**3.2 Milestones.** The Project shall be completed according to the following milestones:

| Milestone | Description | Target Date | Payment |
|-----------|-------------|-------------|---------|
| **M1: Foundation** | Expo project setup, Supabase configuration, authentication working | Week [X] | $[AMOUNT] |
| **M2: Core Screens** | Dashboard, Session History, Profile, Settings functional with real data | Week [X] | $[AMOUNT] |
| **M3: Voice Pipeline** | Voice recording, transcription, AI extraction working end-to-end | Week [X] | $[AMOUNT] |
| **M4: Polish** | iOS platform features, error handling, performance optimization | Week [X] | $[AMOUNT] |
| **M5: TestFlight** | App submitted to TestFlight, internal testing complete | Week [X] | $[AMOUNT] |

**3.3 Milestone Acceptance.** Client shall have five (5) business days to review each Milestone deliverable and provide written acceptance or a detailed list of deficiencies. If Client does not respond within this period, the Milestone shall be deemed accepted.

**3.4 Delays.** If Developer anticipates any delay in meeting a Milestone, Developer shall notify Client in writing immediately, including the reason for the delay and a proposed revised schedule.

---

## ARTICLE 4: COMPENSATION

**4.1 Total Fee.** Client agrees to pay Developer a total fee of **$[TOTAL AMOUNT]** USD for the complete Project as described in Exhibit A.

**4.2 Payment Schedule.** Payments shall be made according to the Milestone schedule in Article 3.2, upon Client's written acceptance of each Milestone.

**4.3 Payment Method.** All payments shall be made via [PAYMENT METHOD: wire transfer / ACH / check] within [NUMBER] days of Milestone acceptance.

**4.4 Expenses.** Developer shall be responsible for all expenses incurred in performing the Services, including but not limited to equipment, software licenses, and subcontractor fees, unless otherwise agreed in writing.

**4.5 Taxes.** Developer is responsible for all taxes arising from compensation received under this Agreement. Developer acknowledges that Client will not withhold any taxes and will issue a Form 1099 if required by law.

---

## ARTICLE 5: INTELLECTUAL PROPERTY OWNERSHIP

**5.1 Work Made for Hire.** All Deliverables created by Developer under this Agreement shall be considered "work made for hire" as defined by the United States Copyright Act. To the extent any Deliverable does not qualify as work made for hire, Developer hereby irrevocably assigns to Client all right, title, and interest in and to such Deliverable, including all Intellectual Property rights therein.

**5.2 Assignment of Rights.** Developer agrees to execute any documents and take any actions reasonably requested by Client to perfect, register, or enforce Client's rights in the Deliverables.

**5.3 Moral Rights.** To the extent permitted by law, Developer waives any moral rights in the Deliverables, including rights of attribution and integrity.

**5.4 Client Materials.** Client retains all ownership rights in Client Materials. Developer is granted a limited, non-exclusive license to use Client Materials solely for the purpose of performing the Services.

**5.5 Third-Party Materials.** Developer shall identify all Third-Party Materials incorporated into the Deliverables prior to incorporation and obtain Client's written approval. Developer represents and warrants that all Third-Party Materials are properly licensed for use in the Project and do not infringe any third-party rights.

**5.6 Developer Tools.** Developer retains ownership of any pre-existing tools, libraries, or methodologies owned by Developer prior to this Agreement ("Developer Tools"). To the extent Developer Tools are incorporated into the Deliverables, Developer grants Client a perpetual, royalty-free, non-exclusive license to use, modify, and distribute such Developer Tools as part of the Deliverables.

**5.7 No Retained Rights.** Upon final payment, Developer shall retain no rights to the Deliverables except as expressly set forth in this Article 5. Developer shall not use, reproduce, or distribute the Deliverables or any derivative works for any purpose.

---

## ARTICLE 6: DEVELOPMENT ENVIRONMENT AND ACCOUNTS

**6.1 Client-Owned Accounts.** All development shall occur using accounts and services owned by Client. Client shall create and maintain the following accounts:

(a) Apple Developer Account
(b) GitHub repository for the Project
(c) Supabase project
(d) AssemblyAI account
(e) Sentry account (crash reporting)
(f) PostHog account (analytics)

**6.2 Access Credentials.** Client shall provide Developer with necessary access credentials via a secure method (e.g., password manager, encrypted transmission). Developer shall not share credentials with any third party without Client's written consent.

**6.3 Repository Requirements.** All source code shall be committed to Client's GitHub repository. Developer shall:

(a) Make commits at least weekly, with meaningful commit messages;
(b) Not use force-push or otherwise destroy git history without Client's consent;
(c) Maintain a clean main branch with working code at all times;
(d) Use feature branches for work-in-progress.

**6.4 No Developer Accounts.** Developer shall not create separate accounts for the Project in Developer's name. Any accounts mistakenly created shall be transferred to Client or deleted upon Client's request.

**6.5 Access Revocation.** Upon Project completion or termination of this Agreement, Client shall revoke Developer's access to all accounts. Developer shall cooperate in the orderly transition of access.

---

## ARTICLE 7: CONFIDENTIALITY

**7.1 Confidentiality Obligation.** Each Party agrees to hold the other Party's Confidential Information in strict confidence and not to disclose such information to any third party without prior written consent.

**7.2 Permitted Disclosures.** Notwithstanding the foregoing, a Party may disclose Confidential Information:

(a) To employees, contractors, or advisors who need to know such information and are bound by confidentiality obligations at least as protective as this Agreement;
(b) As required by law, regulation, or court order, provided the disclosing Party gives prompt notice to the other Party.

**7.3 Exclusions.** Confidential Information does not include information that:

(a) Is or becomes publicly available through no fault of the receiving Party;
(b) Was known to the receiving Party prior to disclosure;
(c) Is independently developed by the receiving Party without use of Confidential Information;
(d) Is rightfully obtained from a third party without restriction.

**7.4 Return of Materials.** Upon termination of this Agreement, each Party shall return or destroy all Confidential Information of the other Party, except as required for legal compliance or as part of the Deliverables.

**7.5 Duration.** The confidentiality obligations in this Article 7 shall survive termination of this Agreement for a period of three (3) years.

---

## ARTICLE 8: WARRANTIES AND REPRESENTATIONS

**8.1 Developer Warranties.** Developer represents and warrants that:

(a) Developer has the skills, experience, and qualifications to perform the Services;
(b) The Deliverables will be original work and will not infringe any third-party Intellectual Property rights;
(c) The Deliverables will conform to the specifications in Exhibit A;
(d) The Deliverables will be free from material defects and will function substantially as described;
(e) Developer has the legal right to enter into this Agreement and perform the Services;
(f) Developer will comply with all applicable laws and regulations.

**8.2 Warranty Period.** Developer warrants that the Deliverables will function substantially as specified for a period of **[30/60/90] days** following final acceptance ("Warranty Period"). During the Warranty Period, Developer shall correct any defects or non-conformities at no additional charge.

**8.3 Warranty Exclusions.** The warranty does not cover defects caused by:

(a) Modifications made by Client or third parties after delivery;
(b) Misuse or operation outside intended parameters;
(c) Third-party services or APIs beyond Developer's control;
(d) Client's failure to implement recommended updates.

**8.4 Client Warranties.** Client represents and warrants that:

(a) Client has the legal right to provide Client Materials to Developer;
(b) Client Materials do not infringe any third-party rights;
(c) Client has the authority to enter into this Agreement.

**8.5 Disclaimer.** EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, DEVELOPER MAKES NO OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.

---

## ARTICLE 9: KNOWLEDGE TRANSFER AND HANDOFF

**9.1 Documentation Requirements.** Prior to final payment, Developer shall provide:

(a) README file with complete setup instructions;
(b) Environment variable documentation;
(c) Deployment guide for EAS/TestFlight builds;
(d) Architecture overview document;
(e) Known issues and technical debt log;
(f) Third-party dependency list with license information.

**9.2 Knowledge Transfer Session.** Developer shall conduct a video call of at least **[1-2] hours** to walk Client through the codebase, architecture decisions, and deployment process. This session shall be recorded for Client's future reference.

**9.3 Transition Support.** For a period of **[14/30] days** following final acceptance, Developer shall respond to reasonable technical questions from Client or Client's designee within two (2) business days.

**9.4 Condition of Final Payment.** Final Milestone payment is contingent upon satisfactory completion of the documentation and knowledge transfer requirements in this Article 9.

---

## ARTICLE 10: LIMITATION OF LIABILITY

**10.1 Limitation.** IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

**10.2 Cap on Liability.** DEVELOPER'S TOTAL LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES ACTUALLY PAID BY CLIENT TO DEVELOPER UNDER THIS AGREEMENT.

**10.3 Exceptions.** The limitations in this Article 10 shall not apply to:

(a) Developer's breach of Article 5 (Intellectual Property);
(b) Developer's breach of Article 7 (Confidentiality);
(c) Developer's gross negligence or willful misconduct;
(d) Developer's indemnification obligations under Article 11.

---

## ARTICLE 11: INDEMNIFICATION

**11.1 Developer Indemnification.** Developer shall indemnify, defend, and hold harmless Client and its officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from:

(a) Developer's breach of this Agreement;
(b) Any claim that the Deliverables infringe a third party's Intellectual Property rights;
(c) Developer's negligence or willful misconduct;
(d) Any claim by Developer's employees, subcontractors, or agents.

**11.2 Client Indemnification.** Client shall indemnify, defend, and hold harmless Developer from and against any claims, damages, losses, liabilities, costs, and expenses arising from:

(a) Client's breach of this Agreement;
(b) Any claim that Client Materials infringe a third party's rights;
(c) Client's use of the Deliverables after acceptance.

**11.3 Indemnification Procedure.** The indemnified Party shall promptly notify the indemnifying Party of any claim and cooperate in the defense. The indemnifying Party shall have sole control of the defense and settlement.

---

## ARTICLE 12: TERMINATION

**12.1 Termination for Convenience.** Client may terminate this Agreement at any time upon **[14/30] days** written notice to Developer. In such event, Client shall pay Developer for:

(a) All accepted Milestones;
(b) A pro-rata portion of work completed on the current Milestone, as reasonably determined by the Parties.

**12.2 Termination for Cause.** Either Party may terminate this Agreement immediately upon written notice if the other Party:

(a) Materially breaches this Agreement and fails to cure such breach within **[15/30] days** of written notice;
(b) Becomes insolvent, files for bankruptcy, or ceases business operations.

**12.3 Effect of Termination.** Upon termination:

(a) Developer shall immediately deliver all Deliverables and work-in-progress to Client;
(b) Developer shall return or destroy all Client Materials and Confidential Information;
(c) Client shall pay Developer for all work completed and accepted prior to termination;
(d) Articles 5, 7, 10, 11, and 14 shall survive termination.

**12.4 No Withholding.** Developer shall not withhold Deliverables or source code due to any dispute over payment. Developer's sole remedy for non-payment is to pursue legal remedies after delivering all completed work.

---

## ARTICLE 13: INDEPENDENT CONTRACTOR

**13.1 Relationship.** Developer is an independent contractor and not an employee, agent, or partner of Client. Nothing in this Agreement creates an employment, agency, partnership, or joint venture relationship.

**13.2 No Benefits.** Developer is not entitled to any employee benefits, including health insurance, retirement contributions, or paid leave.

**13.3 Taxes and Insurance.** Developer is solely responsible for:

(a) Payment of all taxes on compensation received;
(b) Obtaining appropriate business insurance;
(c) Compliance with all applicable labor and employment laws.

**13.4 No Authority.** Developer has no authority to bind Client to any agreement or obligation without Client's express written consent.

---

## ARTICLE 14: GENERAL PROVISIONS

**14.1 Entire Agreement.** This Agreement, together with all Exhibits, constitutes the entire agreement between the Parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter hereof.

**14.2 Amendments.** This Agreement may only be amended by a written instrument signed by both Parties.

**14.3 Waiver.** No waiver of any breach shall be deemed a waiver of any subsequent breach. No waiver shall be effective unless in writing.

**14.4 Severability.** If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.

**14.5 Assignment.** Developer may not assign this Agreement or any rights hereunder without Client's prior written consent. Client may assign this Agreement to any successor or affiliate.

**14.6 Notices.** All notices shall be in writing and delivered by email (with confirmation of receipt) or certified mail to the addresses set forth above.

**14.7 Governing Law.** This Agreement shall be governed by the laws of the State of **[STATE]**, without regard to conflict of law principles.

**14.8 Dispute Resolution.** Any dispute arising from this Agreement shall first be subject to good-faith negotiation. If unresolved within thirty (30) days, the dispute shall be resolved by:

[ ] Binding arbitration under the rules of the American Arbitration Association
[ ] Litigation in the state or federal courts of [STATE/COUNTY]

**14.9 Force Majeure.** Neither Party shall be liable for delays caused by circumstances beyond its reasonable control, including natural disasters, war, terrorism, or government action.

**14.10 Headings.** Article and section headings are for convenience only and shall not affect interpretation.

**14.11 Counterparts.** This Agreement may be executed in counterparts, each of which shall be deemed an original.

---

## SIGNATURES

**IN WITNESS WHEREOF**, the Parties have executed this Agreement as of the Effective Date.

---

**CLIENT:**

Assembly Labs, LLC

By: ________________________________

Name: Drew Garraway

Title: Owner

Date: ______________________________

---

**DEVELOPER:**

[DEVELOPER BUSINESS NAME]

By: ________________________________

Name: [DEVELOPER NAME]

Title: [TITLE]

Date: ______________________________

---

# EXHIBIT A: SCOPE OF WORK

*[Attach detailed scope of work or reference the RFP document]*

## Project Description

Convert the TOMO web prototype (https://bjjj.pages.dev) to a production-ready iOS application using React Native (Expo), Supabase backend, and AssemblyAI voice transcription.

## Deliverables

### Phase 1: Foundation
- [ ] Expo project initialized with TypeScript
- [ ] React Navigation configured
- [ ] Supabase client integrated
- [ ] Email authentication working
- [ ] Apple Sign-In working
- [ ] Database tables created with RLS policies

### Phase 2: Core Screens
- [ ] Dashboard with real user statistics
- [ ] Session History with database queries
- [ ] Session Detail view with edit capability
- [ ] Profile screen with progressive profiling
- [ ] Settings screen with preferences
- [ ] Technique Library with search
- [ ] Belt personalization system integrated

### Phase 3: Voice Pipeline
- [ ] Audio recording with expo-av
- [ ] Waveform visualization during recording
- [ ] Audio upload to AssemblyAI
- [ ] Transcription with custom vocabulary (BJJ terms)
- [ ] AI extraction via [GPT-4 / Claude] API
- [ ] Review and edit UI for extracted data
- [ ] Microphone permission handling
- [ ] Error handling for all failure modes

### Phase 4: Polish
- [ ] App icons (all required sizes)
- [ ] Splash screen
- [ ] Offline detection and graceful degradation
- [ ] Sentry crash reporting integrated
- [ ] PostHog analytics integrated
- [ ] Performance optimization (< 3s cold start)
- [ ] Testing on iPhone SE, 14, 15 Pro Max

### Phase 5: TestFlight
- [ ] App Store Connect configuration
- [ ] Privacy policy URL
- [ ] App Store screenshots (6.5" and 5.5")
- [ ] EAS build configuration
- [ ] TestFlight submission
- [ ] 5-10 internal testers onboarded

## Technical Requirements

- Minimum iOS version: 15.0
- Framework: React Native with Expo (managed workflow preferred)
- Language: TypeScript (strict mode)
- State management: React Context (matching prototype)
- Backend: Supabase (PostgreSQL, Auth, Storage)
- Voice: AssemblyAI API
- AI Extraction: [GPT-4 / Claude API]

## Acceptance Criteria

Each Milestone is accepted when:
1. All checklist items for that phase are complete
2. Code is committed to Client's GitHub repository
3. Application runs without crashes on test devices
4. Client has reviewed and approved functionality

## Out of Scope

- Android application
- Web application maintenance
- Coach/gym owner features
- Social features
- Competition tracking
- Video content creation
- Marketing materials
- Post-warranty maintenance

---

# EXHIBIT B: PAYMENT SCHEDULE

| Milestone | Amount | Due Upon |
|-----------|--------|----------|
| M1: Foundation | $[AMOUNT] | Acceptance of Phase 1 deliverables |
| M2: Core Screens | $[AMOUNT] | Acceptance of Phase 2 deliverables |
| M3: Voice Pipeline | $[AMOUNT] | Acceptance of Phase 3 deliverables |
| M4: Polish | $[AMOUNT] | Acceptance of Phase 4 deliverables |
| M5: TestFlight + Handoff | $[AMOUNT] | TestFlight submission + knowledge transfer complete |
| **Total** | **$[TOTAL]** | |

---

# EXHIBIT C: CLIENT MATERIALS

The following materials will be provided by Client to Developer:

1. Access to prototype source code repository
2. Design system documentation
3. Brand guidelines and voice documentation
4. User persona documentation
5. Belt personalization system specifications
6. API keys for third-party services (via secure method)
7. Apple Developer account access
8. Supabase project access
9. GitHub repository collaborator access

---

# EXHIBIT D: COMMUNICATION AND REPORTING

## Communication Channels

- **Primary:** [Slack / Discord / Email]
- **Video Calls:** [Zoom / Google Meet]
- **Project Tracking:** [Linear / GitHub Issues / Notion]

## Reporting Cadence

- **Weekly:** 15-minute video check-in (day/time TBD)
- **Per Milestone:** Demo of completed functionality
- **As Needed:** Async updates via primary channel

## Response Times

- Developer shall respond to Client inquiries within **one (1) business day**
- Urgent issues (blocking bugs, security concerns) within **4 hours** during business hours

## Business Hours

Developer's business hours: [TIME ZONE], [DAYS], [HOURS]

---

*END OF AGREEMENT*

---

**DOCUMENT STATUS: DRAFT**
**Version:** 1.0
**Last Updated:** January 2026
**Prepared By:** Claude Code (AI-assisted drafting)

**DISCLAIMER:** This document is a template for discussion purposes only. Client should have this Agreement reviewed by a licensed attorney before execution. This template does not constitute legal advice.
