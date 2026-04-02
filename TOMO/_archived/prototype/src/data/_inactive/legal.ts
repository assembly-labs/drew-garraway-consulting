/**
 * Mock Legal Documents Data
 * Terms of Service, Privacy Policy, Liability Waiver
 */

export interface LegalDocument {
  id: string;
  type: 'terms-of-service' | 'privacy-policy' | 'waiver' | 'cookie-policy';
  title: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export interface LegalSection {
  id: string;
  title: string;
  content: string;
  subsections?: LegalSubsection[];
}

export interface LegalSubsection {
  title: string;
  content: string;
}

export interface UserConsent {
  userId: string;
  documentId: string;
  documentVersion: string;
  consentedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// ===========================================
// TERMS OF SERVICE
// ===========================================

export const termsOfService: LegalDocument = {
  id: 'legal-tos-001',
  type: 'terms-of-service',
  title: 'Terms of Service',
  version: '1.0.0',
  effectiveDate: '2025-01-01',
  lastUpdated: '2024-12-15',
  sections: [
    {
      id: 'tos-1',
      title: '1. Acceptance of Terms',
      content: 'By accessing or using the BJJ Progress Tracker application ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. We reserve the right to update these Terms at any time, and your continued use of the Service constitutes acceptance of any modifications.',
    },
    {
      id: 'tos-2',
      title: '2. Description of Service',
      content: 'BJJ Progress Tracker is a digital training journal and progress tracking application designed for Brazilian Jiu-Jitsu practitioners, coaches, and gym owners. The Service allows users to log training sessions, track technique development, receive coach feedback, and monitor progress toward belt promotions.',
      subsections: [
        {
          title: '2.1 User Types',
          content: 'The Service provides different features based on user type: Practitioners can log training and view progress; Coaches can provide feedback and track student development; Gym Owners can manage rosters and view analytics.',
        },
        {
          title: '2.2 Feature Availability',
          content: 'Certain features may be limited based on subscription tier. We reserve the right to modify, suspend, or discontinue any feature at any time.',
        },
      ],
    },
    {
      id: 'tos-3',
      title: '3. User Accounts',
      content: 'To use certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
      subsections: [
        {
          title: '3.1 Account Requirements',
          content: 'You must be at least 13 years old to create an account. Users between 13-18 require parental consent. You agree to provide accurate, current, and complete information during registration.',
        },
        {
          title: '3.2 Account Security',
          content: 'You are responsible for safeguarding your password and must notify us immediately of any unauthorized access to your account.',
        },
        {
          title: '3.3 Account Termination',
          content: 'We may suspend or terminate your account if you violate these Terms or engage in conduct that we determine is harmful to other users or the Service.',
        },
      ],
    },
    {
      id: 'tos-4',
      title: '4. User Content',
      content: 'You retain ownership of content you submit to the Service ("User Content"), including training notes, journal entries, and uploaded media. By submitting User Content, you grant us a limited license to use, store, and display your content as necessary to provide the Service.',
      subsections: [
        {
          title: '4.1 Content Guidelines',
          content: 'User Content must not violate any laws, infringe on intellectual property rights, contain malware, or include harassing, defamatory, or inappropriate material.',
        },
        {
          title: '4.2 Privacy Settings',
          content: 'You control the visibility of your User Content through privacy settings. "Coach Visible" content may be viewed by assigned coaches. "Private" content is only visible to you.',
        },
      ],
    },
    {
      id: 'tos-5',
      title: '5. Intellectual Property',
      content: 'The Service and its original content (excluding User Content), features, and functionality are owned by BJJ Progress Tracker and are protected by international copyright, trademark, and other intellectual property laws.',
      subsections: [
        {
          title: '5.1 License to Use',
          content: 'We grant you a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes.',
        },
        {
          title: '5.2 Technique Library',
          content: 'The technique library, instructional content, and curriculum materials are proprietary. Reproduction or distribution without permission is prohibited.',
        },
      ],
    },
    {
      id: 'tos-6',
      title: '6. Prohibited Conduct',
      content: 'You agree not to: (a) use the Service for any illegal purpose; (b) attempt to gain unauthorized access to any part of the Service; (c) interfere with or disrupt the Service; (d) scrape or collect data without permission; (e) impersonate others or misrepresent your affiliation; (f) upload malicious code or content.',
    },
    {
      id: 'tos-7',
      title: '7. Subscription and Payment',
      content: 'Certain features require a paid subscription. Payment terms, including pricing, billing cycles, and refund policies, are outlined in your subscription agreement. Failure to pay may result in service interruption.',
      subsections: [
        {
          title: '7.1 Automatic Renewal',
          content: 'Subscriptions automatically renew unless cancelled before the renewal date. You may cancel at any time through your account settings.',
        },
        {
          title: '7.2 Price Changes',
          content: 'We may change subscription prices with 30 days notice. Price changes do not affect the current billing period.',
        },
      ],
    },
    {
      id: 'tos-8',
      title: '8. Disclaimer of Warranties',
      content: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.',
    },
    {
      id: 'tos-9',
      title: '9. Limitation of Liability',
      content: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, BJJ PROGRESS TRACKER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, REVENUE, OR PROFITS, ARISING FROM YOUR USE OF THE SERVICE.',
    },
    {
      id: 'tos-10',
      title: '10. Physical Activity Disclaimer',
      content: 'BJJ Progress Tracker is a tracking tool and does not provide medical advice. Brazilian Jiu-Jitsu is a contact sport with inherent risks of injury. Consult a physician before beginning any training program. We are not responsible for injuries sustained during training.',
    },
    {
      id: 'tos-11',
      title: '11. Governing Law',
      content: 'These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Travis County, Texas.',
    },
    {
      id: 'tos-12',
      title: '12. Contact Information',
      content: 'For questions about these Terms, please contact us at legal@bjjprogresstracker.com or write to: BJJ Progress Tracker, 1234 Martial Arts Blvd, Austin, TX 78701.',
    },
  ],
};

// ===========================================
// PRIVACY POLICY
// ===========================================

export const privacyPolicy: LegalDocument = {
  id: 'legal-privacy-001',
  type: 'privacy-policy',
  title: 'Privacy Policy',
  version: '1.0.0',
  effectiveDate: '2025-01-01',
  lastUpdated: '2024-12-15',
  sections: [
    {
      id: 'pp-1',
      title: '1. Introduction',
      content: 'BJJ Progress Tracker ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this policy carefully.',
    },
    {
      id: 'pp-2',
      title: '2. Information We Collect',
      content: 'We collect information that you provide directly to us, information collected automatically, and information from third parties.',
      subsections: [
        {
          title: '2.1 Information You Provide',
          content: 'Account information (name, email, password), profile data (belt rank, training start date, gym affiliation), training journal entries, technique logs, sparring records, goals, and any notes or media you upload.',
        },
        {
          title: '2.2 Automatically Collected Information',
          content: 'Device information (type, operating system, unique identifiers), usage data (features accessed, time spent, interactions), log data (IP address, browser type, access times), and performance data (errors, crashes).',
        },
        {
          title: '2.3 Information from Third Parties',
          content: 'If you connect your account with third-party services (gym management systems, payment processors), we may receive information from those services as authorized by you.',
        },
      ],
    },
    {
      id: 'pp-3',
      title: '3. How We Use Your Information',
      content: 'We use collected information to: provide and maintain the Service, personalize your experience, process transactions, send notifications and updates, analyze usage patterns, improve our Service, prevent fraud, and comply with legal obligations.',
      subsections: [
        {
          title: '3.1 AI-Powered Features',
          content: 'With your consent, we use AI to parse natural language journal entries, provide training insights, and suggest technique recommendations. AI processing may involve third-party providers who are bound by confidentiality agreements.',
        },
        {
          title: '3.2 Coach Visibility',
          content: 'When you enable "Coach Visible" for content, that information is shared with your designated coaches to provide feedback and track your progress.',
        },
      ],
    },
    {
      id: 'pp-4',
      title: '4. Information Sharing',
      content: 'We do not sell your personal information. We may share information in the following circumstances:',
      subsections: [
        {
          title: '4.1 With Your Consent',
          content: 'We share information when you direct us to, such as sharing progress with coaches or syncing with gym systems.',
        },
        {
          title: '4.2 Service Providers',
          content: 'We share information with vendors who assist in providing the Service (hosting, analytics, payment processing). These providers are contractually obligated to protect your data.',
        },
        {
          title: '4.3 Legal Requirements',
          content: 'We may disclose information if required by law, subpoena, or government request, or to protect rights, safety, or property.',
        },
        {
          title: '4.4 Business Transfers',
          content: 'In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction.',
        },
      ],
    },
    {
      id: 'pp-5',
      title: '5. Data Security',
      content: 'We implement appropriate technical and organizational security measures to protect your personal information, including encryption in transit and at rest, access controls, and regular security assessments. However, no method of transmission over the Internet is 100% secure.',
    },
    {
      id: 'pp-6',
      title: '6. Data Retention',
      content: 'We retain your information for as long as your account is active or as needed to provide services. Training data and journal entries are retained indefinitely unless you request deletion. After account deletion, we may retain certain information as required by law or for legitimate business purposes.',
    },
    {
      id: 'pp-7',
      title: '7. Your Rights and Choices',
      content: 'You have the right to access, correct, or delete your personal information. You can export your training data at any time. You may opt out of promotional communications while still receiving essential service notifications.',
      subsections: [
        {
          title: '7.1 Access and Portability',
          content: 'You can request a copy of your data in a machine-readable format through account settings.',
        },
        {
          title: '7.2 Deletion',
          content: 'You can delete your account and associated data. Some information may be retained for legal compliance.',
        },
        {
          title: '7.3 Privacy Controls',
          content: 'You control which content is visible to coaches versus private. You can modify these settings at any time.',
        },
      ],
    },
    {
      id: 'pp-8',
      title: '8. Children\'s Privacy',
      content: 'The Service is not intended for children under 13. We do not knowingly collect personal information from children under 13. Users between 13-18 require parental consent and may use the Service under parental supervision.',
    },
    {
      id: 'pp-9',
      title: '9. International Data Transfers',
      content: 'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses approved by relevant authorities.',
    },
    {
      id: 'pp-10',
      title: '10. California Privacy Rights',
      content: 'California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected, request deletion, and opt out of sales of personal information (we do not sell personal information).',
    },
    {
      id: 'pp-11',
      title: '11. European Privacy Rights',
      content: 'Users in the European Economic Area have rights under GDPR, including access, rectification, erasure, data portability, and the right to object to processing. To exercise these rights, contact our Data Protection Officer at dpo@bjjprogresstracker.com.',
    },
    {
      id: 'pp-12',
      title: '12. Changes to This Policy',
      content: 'We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy and updating the "Last Updated" date. Continued use of the Service after changes constitutes acceptance.',
    },
    {
      id: 'pp-13',
      title: '13. Contact Us',
      content: 'For questions about this Privacy Policy or our privacy practices, contact us at: privacy@bjjprogresstracker.com or BJJ Progress Tracker, Attn: Privacy Team, 1234 Martial Arts Blvd, Austin, TX 78701.',
    },
  ],
};

// ===========================================
// LIABILITY WAIVER
// ===========================================

export const liabilityWaiver: LegalDocument = {
  id: 'legal-waiver-001',
  type: 'waiver',
  title: 'Liability Waiver and Release',
  version: '1.0.0',
  effectiveDate: '2025-01-01',
  lastUpdated: '2024-12-15',
  sections: [
    {
      id: 'waiver-1',
      title: '1. Acknowledgment of Risks',
      content: 'I understand that Brazilian Jiu-Jitsu (BJJ) is a contact martial art that involves physical contact, grappling, submissions, and sparring. I acknowledge that participation in BJJ training carries inherent risks of injury, including but not limited to: sprains, strains, fractures, joint injuries, concussions, cuts, bruises, and in rare cases, serious or permanent injury.',
    },
    {
      id: 'waiver-2',
      title: '2. Assumption of Risk',
      content: 'I voluntarily assume all risks associated with BJJ training, including risks arising from the negligence of instructors, coaches, training partners, gym staff, or facility conditions. I understand that the BJJ Progress Tracker application is a training journal and progress tracking tool, not a substitute for proper instruction or safety precautions.',
    },
    {
      id: 'waiver-3',
      title: '3. Release of Liability',
      content: 'In consideration for being permitted to use the BJJ Progress Tracker application and any affiliated gym facilities or programs, I hereby release, waive, and discharge BJJ Progress Tracker, its affiliates, officers, employees, agents, and partners from any and all liability for injury, damage, or loss that may arise from my participation in BJJ training activities.',
    },
    {
      id: 'waiver-4',
      title: '4. Medical Disclaimer',
      content: 'I understand that BJJ Progress Tracker does not provide medical advice. The application\'s training recommendations, progress tracking, and AI-generated insights are for informational purposes only and should not replace consultation with medical professionals. I confirm that I am physically fit to participate in BJJ training and have consulted with a physician if I have any health concerns.',
    },
    {
      id: 'waiver-5',
      title: '5. Training Responsibility',
      content: 'I agree to train safely, tap out when caught in submissions, and respect my training partners. I will not hold BJJ Progress Tracker responsible for injuries resulting from unsafe training practices, failure to follow instructor guidance, or ignoring my physical limitations.',
    },
    {
      id: 'waiver-6',
      title: '6. Indemnification',
      content: 'I agree to indemnify and hold harmless BJJ Progress Tracker from any claims, demands, or causes of action arising from my use of the application, participation in BJJ training, or any breach of this waiver.',
    },
    {
      id: 'waiver-7',
      title: '7. Photo and Video Release',
      content: 'I grant BJJ Progress Tracker and affiliated gyms the right to use photos and videos of my training for promotional and educational purposes, unless I specifically opt out in my account settings.',
    },
    {
      id: 'waiver-8',
      title: '8. Minor Participants',
      content: 'If I am signing on behalf of a minor, I represent that I am the parent or legal guardian of the minor and have the authority to bind the minor to this waiver. I accept full responsibility for the minor\'s participation.',
    },
    {
      id: 'waiver-9',
      title: '9. Severability',
      content: 'If any provision of this waiver is found to be unenforceable, the remaining provisions shall remain in full force and effect.',
    },
    {
      id: 'waiver-10',
      title: '10. Acknowledgment',
      content: 'BY ACCEPTING THIS WAIVER, I CONFIRM THAT I HAVE READ AND UNDERSTOOD THIS DOCUMENT, THAT I AM SIGNING IT VOLUNTARILY, AND THAT I INTEND IT TO BE A COMPLETE AND UNCONDITIONAL RELEASE OF LIABILITY.',
    },
  ],
};

// ===========================================
// COOKIE POLICY
// ===========================================

export const cookiePolicy: LegalDocument = {
  id: 'legal-cookies-001',
  type: 'cookie-policy',
  title: 'Cookie Policy',
  version: '1.0.0',
  effectiveDate: '2025-01-01',
  lastUpdated: '2024-12-15',
  sections: [
    {
      id: 'cookie-1',
      title: '1. What Are Cookies',
      content: 'Cookies are small text files stored on your device when you visit our website or use our application. They help us provide functionality, remember preferences, and understand how you use our Service.',
    },
    {
      id: 'cookie-2',
      title: '2. Types of Cookies We Use',
      content: 'We use the following categories of cookies:',
      subsections: [
        {
          title: '2.1 Essential Cookies',
          content: 'Required for the Service to function. These cookies enable authentication, security, and core features. They cannot be disabled.',
        },
        {
          title: '2.2 Functional Cookies',
          content: 'Remember your preferences and settings, such as language, theme (dark/light mode), and display options.',
        },
        {
          title: '2.3 Analytics Cookies',
          content: 'Help us understand how users interact with the Service. We use this data to improve features and performance. These cookies are anonymized.',
        },
        {
          title: '2.4 Marketing Cookies',
          content: 'Used to deliver relevant advertisements and track campaign effectiveness. These cookies are optional and can be disabled.',
        },
      ],
    },
    {
      id: 'cookie-3',
      title: '3. Managing Cookies',
      content: 'You can manage cookie preferences through your account settings or browser settings. Note that disabling certain cookies may impact functionality.',
    },
    {
      id: 'cookie-4',
      title: '4. Third-Party Cookies',
      content: 'Some cookies are placed by third-party services we use, such as analytics providers and payment processors. These are governed by the third party\'s privacy policy.',
    },
    {
      id: 'cookie-5',
      title: '5. Updates',
      content: 'We may update this Cookie Policy periodically. The "Last Updated" date indicates when changes were made.',
    },
  ],
};

// ===========================================
// ALL LEGAL DOCUMENTS
// ===========================================

export const allLegalDocuments: LegalDocument[] = [
  termsOfService,
  privacyPolicy,
  liabilityWaiver,
  cookiePolicy,
];

// ===========================================
// MOCK USER CONSENTS
// ===========================================

export const mockUserConsents: UserConsent[] = [
  {
    userId: 'user-001',
    documentId: 'legal-tos-001',
    documentVersion: '1.0.0',
    consentedAt: '2022-03-15T10:00:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
  },
  {
    userId: 'user-001',
    documentId: 'legal-privacy-001',
    documentVersion: '1.0.0',
    consentedAt: '2022-03-15T10:00:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
  },
  {
    userId: 'user-001',
    documentId: 'legal-waiver-001',
    documentVersion: '1.0.0',
    consentedAt: '2022-03-15T10:01:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
  },
];

// ===========================================
// LEGAL HELPERS
// ===========================================

export const getLegalDocument = (type: LegalDocument['type']): LegalDocument | undefined => {
  return allLegalDocuments.find(doc => doc.type === type);
};

export const hasUserConsented = (userId: string, documentType: LegalDocument['type']): boolean => {
  const document = getLegalDocument(documentType);
  if (!document) return false;

  const consent = mockUserConsents.find(
    c => c.userId === userId && c.documentId === document.id && c.documentVersion === document.version
  );

  return !!consent;
};

export const getConsentSummary = (userId: string) => {
  return {
    termsOfService: hasUserConsented(userId, 'terms-of-service'),
    privacyPolicy: hasUserConsented(userId, 'privacy-policy'),
    waiver: hasUserConsented(userId, 'waiver'),
    cookiePolicy: hasUserConsented(userId, 'cookie-policy'),
  };
};
