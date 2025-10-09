import React, { useState } from 'react';
import { FileText, Code, Database, Workflow, Settings } from 'lucide-react';

const SpecificationViewer = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'architecture', label: 'Architecture', icon: Code },
    { id: 'components', label: 'Components', icon: Workflow },
    { id: 'data', label: 'Data Models', icon: Database },
    { id: 'apis', label: 'API Contracts', icon: Settings }
  ];

  const specifications = {
    overview: {
      title: "AI Lesson Planner - Technical Specification v1.0",
      sections: [
        {
          heading: "Product Vision",
          content: "AI-powered lesson material generator for K-4 educators enabling rapid creation of differentiated, standards-aligned worksheets, quizzes, and activities with two-stage generation (text draft validation → visual generation)."
        },
        {
          heading: "MVP Scope - Prototype Constraints",
          items: [
            "Stage 1: Real LLM integration (text generation only)",
            "Stage 2: Mock visual outputs (hardcoded examples)",
            "Library: Mock content for UI demonstration",
            "Student Profiles: Functional creation, max 3 variants per material",
            "Rate Limiting: 3 draft regenerations per 10 minutes",
            "Auth: Simple (no full system, placeholder)"
          ]
        },
        {
          heading: "Tech Stack",
          items: [
            "Frontend: React 18+ with Hooks, Tailwind CSS",
            "State: React Context or useState (no Redux for MVP)",
            "Backend Simulation: Fetch API to external LLM endpoints",
            "LLM Tier 1 (Drafts): GPT-4o-mini or Claude Haiku",
            "LLM Tier 2 (Final): Mock for prototype",
            "Storage: localStorage for profiles and rate limiting",
            "No database required for prototype"
          ]
        },
        {
          heading: "Core User Flows",
          items: [
            "1. Dashboard → Create New → Prompt Input → Draft Generation",
            "2. Review Draft → Edit/Regenerate → Approve → Visual Output (mock)",
            "3. Profile Management → Create Profile → Use in Generation",
            "4. Library → View Saved Materials (mock data)"
          ]
        },
        {
          heading: "Success Criteria for Prototype",
          items: [
            "✓ Functional LLM prompt → text draft generation",
            "✓ Interactive draft editor with regenerate capability",
            "✓ Profile creation and selection working",
            "✓ Rate limiting enforced visually",
            "✓ Clean, educator-friendly UI",
            "✓ Responsive design (desktop primary)"
          ]
        }
      ]
    },
    architecture: {
      title: "System Architecture",
      sections: [
        {
          heading: "Application Structure",
          content: "Single-page React application with component-based architecture. No backend server required for prototype - uses direct API calls to LLM providers with CORS-compatible endpoints."
        },
        {
          heading: "Component Hierarchy",
          code: `App
├── AppProvider (Context: user, profiles, rate limits)
├── Router
│   ├── Dashboard
│   │   ├── QuickActions
│   │   ├── LibraryPreview (mock data)
│   │   └── RecentMaterials (mock data)
│   ├── CreateMaterial
│   │   ├── PromptBuilder
│   │   │   ├── FreeformInput
│   │   │   ├── OptionalGuides
│   │   │   └── ProfileSelector
│   │   ├── DraftReview (Stage 1)
│   │   │   ├── DraftContent
│   │   │   ├── EditControls
│   │   │   ├── RegenerateButton (rate limited)
│   │   │   └── ApproveButton
│   │   └── VisualEditor (Stage 2 - mock)
│   ├── ProfileManager
│   │   ├── ProfileList
│   │   ├── ProfileForm
│   │   └── ProfileCard
│   └── Library (mock content)
└── Components (shared)
    ├── Header
    ├── Button
    ├── Modal
    ├── LoadingState
    └── RateLimitWarning`
        },
        {
          heading: "State Management Strategy",
          items: [
            "AppContext: Global state for user session, profiles, rate limit counters",
            "Component State: Local UI state (modals, form inputs, loading)",
            "localStorage: Persist profiles, track regeneration timestamps",
            "No server-side session management for prototype"
          ]
        },
        {
          heading: "Data Flow: Material Generation",
          code: `1. User Input → PromptBuilder component
2. User clicks "Generate Draft"
   → Check rate limit (localStorage)
   → If OK: Send to LLM API
   → Store timestamp
3. LLM Response → Parse text
   → Display in DraftReview
4. User edits/regenerates
   → Repeat step 2 (check limits)
5. User approves
   → Navigate to VisualEditor
   → Display mock visual output`
        }
      ]
    },
    components: {
      title: "Component Specifications",
      sections: [
        {
          heading: "PromptBuilder Component",
          props: "onGenerate: (prompt, options) => void",
          state: "prompt: string, selectedGrade: number, selectedSubject: string, selectedProfiles: string[], showOptionalGuides: boolean",
          behavior: [
            "Textarea for freeform prompt (required)",
            "Collapsible section for optional guides",
            "Profile selector opens modal with saved profiles",
            "Max 3 profiles selectable (disable after 3)",
            "Grade buttons (K-4), Subject dropdown",
            "Generate button disabled if prompt empty",
            "Shows rate limit warning if 3 regenerations used"
          ]
        },
        {
          heading: "DraftReview Component",
          props: "draftData: object, onEdit: (newContent) => void, onRegenerate: () => void, onApprove: () => void, selectedProfiles: array",
          state: "isEditing: boolean, editedContent: string, regenerationCount: number",
          behavior: [
            "Displays parsed LLM output (learning objective, questions, instructions)",
            "If multiple profiles: tab navigation between variants",
            "Inline text editing (contentEditable or textarea)",
            "Regenerate button checks rate limit before API call",
            "Shows countdown timer if rate limited (10 min)",
            "Approve button navigates to Stage 2 (mock visual)"
          ]
        },
        {
          heading: "ProfileForm Component",
          props: "onSave: (profile) => void, onCancel: () => void, existingProfile?: object",
          state: "formData: object (name, grade, characteristics, interests, readingLevel, notes)",
          behavior: [
            "Text input for profile name (required)",
            "Multi-select checkboxes for characteristics and interests",
            "Radio buttons for reading level",
            "Textarea for notes (optional)",
            "Validation: name required, at least 1 interest selected",
            "Save to localStorage with UUID",
            "Close modal on save/cancel"
          ]
        },
        {
          heading: "ProfileSelector Component",
          props: "profiles: array, selectedProfiles: array, onSelect: (profileIds) => void, maxSelections: number",
          behavior: [
            "Displays profile cards (name, grade, key characteristics)",
            "Checkbox selection with max 3 enforced",
            "Visual indicator when max reached",
            "Link to 'Create New Profile' (opens ProfileForm)",
            "Shows empty state if no profiles exist"
          ]
        },
        {
          heading: "VisualEditor Component (Mock for Prototype)",
          props: "approvedDraft: object, profiles: array",
          behavior: [
            "Displays hardcoded mock worksheet visual",
            "Shows different mock based on material type",
            "Toolbar with Save, Preview, Export (non-functional buttons)",
            "Banner: 'Visual generation coming soon - this is a preview'",
            "Save button stores draft to localStorage (mock library entry)"
          ]
        }
      ]
    },
    data: {
      title: "Data Models & Storage",
      sections: [
        {
          heading: "StudentProfile Object",
          code: `{
  id: "uuid-v4",
  name: "Visual Learners Group A",
  gradeRange: [1, 2],
  characteristics: [
    "visual_supports",
    "iep_accommodations",
    "ell"
  ],
  interestThemes: [
    "animals",
    "nature",
    "art"
  ],
  readingLevel: "below_grade" | "on_grade" | "above_grade",
  notes: "Responds well to step-by-step instructions",
  createdAt: "ISO timestamp",
  isShared: boolean
}`
        },
        {
          heading: "GenerationRequest Object",
          code: `{
  prompt: "Create a worksheet about addition with regrouping",
  materialType: "worksheet" | "quiz" | "answer_key",
  grade: 0-4, // 0 = K
  subject: "math" | "reading" | "science" | "social_studies",
  language: "english" | "spanish" | "bilingual",
  targetProfiles: ["profile-uuid-1", "profile-uuid-2"],
  stage: "draft" | "visual"
}`
        },
        {
          heading: "DraftOutput Object (LLM Response)",
          code: `{
  generationId: "uuid",
  materialType: "worksheet",
  content: {
    title: "Addition with Regrouping Practice",
    learningObjective: "Students will add two 2-digit numbers...",
    instructions: "Show your work in the boxes below...",
    questions: [
      { number: 1, question: "23 + 19 = ___", answer: 42 },
      { number: 2, question: "47 + 36 = ___", answer: 83 }
    ],
    accommodations: "Large print, extra space for work" // if IEP profile
  },
  profileUsed: "profile-uuid",
  timestamp: "ISO timestamp"
}`
        },
        {
          heading: "RateLimit Object (localStorage)",
          code: `{
  userId: "temp-session-id",
  regenerations: [
    { timestamp: "ISO timestamp", materialId: "uuid" },
    { timestamp: "ISO timestamp", materialId: "uuid" }
  ]
  // Filter entries older than 10 minutes before checking count
}`
        },
        {
          heading: "LocalStorage Keys",
          items: [
            "lesson_planner_profiles: JSON array of StudentProfile objects",
            "lesson_planner_rate_limit: RateLimit object",
            "lesson_planner_library: JSON array of saved materials (mock)",
            "lesson_planner_session: temp user identifier"
          ]
        }
      ]
    },
    apis: {
      title: "API Integration & Contracts",
      sections: [
        {
          heading: "LLM API Call Pattern (Stage 1 Only)",
          content: "Direct fetch to Claude API or OpenAI API. No backend proxy for prototype."
        },
        {
          heading: "Claude API Integration",
          code: `// Using Anthropic's API (if available in browser context)
const generateDraft = async (request) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Note: API key handling for prototype
      // In production, this would go through backend
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", // or haiku for cost
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: buildPrompt(request)
      }]
    })
  });
  
  const data = await response.json();
  return parseLLMResponse(data.content[0].text);
};`
        },
        {
          heading: "Prompt Engineering Function",
          code: `const buildPrompt = (request) => {
  const { prompt, materialType, grade, subject, targetProfiles } = request;
  
  let systemPrompt = \`You are an expert K-4 educator. Generate a \${materialType} for grade \${grade} \${subject}.
  
Output ONLY valid JSON in this exact format:
{
  "title": "string",
  "learningObjective": "string",
  "instructions": "string for students",
  "questions": [
    {"number": 1, "question": "text", "answer": "correct answer"}
  ]
}\`;

  // Add profile context if selected
  if (targetProfiles.length > 0) {
    const profileContext = targetProfiles.map(p => 
      \`Profile: \${p.name}
- Interests: \${p.interestThemes.join(', ')}
- Characteristics: \${p.characteristics.join(', ')}
- Reading level: \${p.readingLevel}\`
    ).join('\\n\\n');
    
    systemPrompt += \`\\n\\nAdapt content for these student profiles:\\n\${profileContext}\`;
  }
  
  return systemPrompt + \`\\n\\nTeacher's request: \${prompt}\`;
};`
        },
        {
          heading: "Response Parser",
          code: `const parseLLMResponse = (rawText) => {
  try {
    // Strip markdown code blocks if present
    const cleaned = rawText.replace(/\`\`\`json\\n?/g, '').replace(/\`\`\`\\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    // Validate required fields
    if (!parsed.title || !parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response structure');
    }
    
    return {
      success: true,
      data: parsed
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to parse LLM response',
      rawText
    };
  }
};`
        },
        {
          heading: "Rate Limiting Logic",
          code: `const checkRateLimit = () => {
  const rateData = JSON.parse(localStorage.getItem('lesson_planner_rate_limit') || '{"regenerations":[]}');
  const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
  
  // Filter recent regenerations
  const recentRegens = rateData.regenerations.filter(
    r => new Date(r.timestamp).getTime() > tenMinutesAgo
  );
  
  if (recentRegens.length >= 3) {
    const oldestRegen = recentRegens[0];
    const timeUntilReset = new Date(oldestRegen.timestamp).getTime() + (10 * 60 * 1000) - Date.now();
    const minutesRemaining = Math.ceil(timeUntilReset / 60000);
    
    return {
      allowed: false,
      minutesRemaining
    };
  }
  
  return { allowed: true };
};

const recordRegeneration = (materialId) => {
  const rateData = JSON.parse(localStorage.getItem('lesson_planner_rate_limit') || '{"regenerations":[]}');
  rateData.regenerations.push({
    timestamp: new Date().toISOString(),
    materialId
  });
  localStorage.setItem('lesson_planner_rate_limit', JSON.stringify(rateData));
};`
        },
        {
          heading: "Mock Data for Library",
          code: `const MOCK_LIBRARY_ITEMS = [
  {
    id: "mock-1",
    title: "Adding Two-Digit Numbers",
    type: "worksheet",
    grade: 2,
    subject: "math",
    thumbnail: "📊",
    createdAt: "2025-10-01T10:30:00Z"
  },
  {
    id: "mock-2",
    title: "Animal Habitats Quiz",
    type: "quiz",
    grade: 1,
    subject: "science",
    thumbnail: "🦁",
    createdAt: "2025-10-05T14:20:00Z"
  },
  {
    id: "mock-3",
    title: "Sight Words Practice",
    type: "worksheet",
    grade: 0, // K
    subject: "reading",
    thumbnail: "📖",
    createdAt: "2025-10-08T09:15:00Z"
  }
];`
        }
      ]
    }
  };

  const renderContent = (content) => {
    if (typeof content === 'string') {
      return <p className="text-gray-700 mb-4">{content}</p>;
    }
    if (content.items) {
      return (
        <ul className="list-disc pl-6 space-y-2 mb-4">
          {content.items.map((item, i) => (
            <li key={i} className="text-gray-700">{item}</li>
          ))}
        </ul>
      );
    }
    if (content.code) {
      return (
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>{content.code}</code>
        </pre>
      );
    }
    if (content.props || content.behavior) {
      return (
        <div className="mb-4">
          {content.props && (
            <div className="mb-3">
              <span className="font-semibold text-gray-800">Props: </span>
              <code className="bg-blue-50 px-2 py-1 rounded text-sm">{content.props}</code>
            </div>
          )}
          {content.state && (
            <div className="mb-3">
              <span className="font-semibold text-gray-800">State: </span>
              <code className="bg-purple-50 px-2 py-1 rounded text-sm">{content.state}</code>
            </div>
          )}
          {content.behavior && (
            <div>
              <span className="font-semibold text-gray-800">Behavior:</span>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                {content.behavior.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const activeSpec = specifications[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 px-6 shadow-lg">
        <h1 className="text-3xl font-bold">AI Lesson Planner - Technical Specification</h1>
        <p className="text-blue-100 mt-2">Complete build guide for Claude Code</p>
      </header>

      <div className="flex">
        <nav className="w-64 bg-white min-h-screen shadow-md p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{activeSpec.title}</h2>
            
            {activeSpec.sections.map((section, index) => (
              <div key={index} className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.heading}</h3>
                {section.content && renderContent({ content: section.content })}
                {section.items && renderContent({ items: section.items })}
                {section.code && renderContent({ code: section.code })}
                {section.props && renderContent(section)}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SpecificationViewer;