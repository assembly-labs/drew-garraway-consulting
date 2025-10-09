# AI Lesson Planner - Complete Build Documentation
## Comprehensive Guide for Rapid Prototyping

**Version:** 1.0  
**Last Updated:** October 2025  
**Estimated Build Time:** 13-15 days (65-75 hours)  
**Target:** Functional MVP with real LLM integration

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Technical Architecture](#technical-architecture)
4. [Build Sequence (7 Phases)](#build-sequence)
5. [Mock Content Strategy](#mock-content-strategy)
6. [UI/UX Guidelines](#ui-ux-guidelines)
7. [Brand Voice & Copy](#brand-voice)
8. [Testing & Validation](#testing-validation)
9. [Troubleshooting Guide](#troubleshooting)
10. [Handoff & Next Steps](#handoff)

---

## Executive Summary

### What We're Building
An AI-powered lesson material generator for K-4 educators that creates differentiated, standards-aligned worksheets, quizzes, and activities through a two-stage process:
- **Stage 1:** Real LLM generates text drafts (working prototype)
- **Stage 2:** Mock visual templates (faked for MVP)

### Core Value Proposition
Teachers input a prompt → AI generates customized draft → Teacher reviews/edits → Polished visual output ready to print. Differentiation happens automatically through student profiles.

### Key Differentiators
1. **Teacher validation workflow** - AI co-pilot, not autopilot
2. **K-4 specific design** - Age-appropriate visuals and language
3. **Student profiles** - Reusable differentiation without PII
4. **Print-first** - Parent-friendly materials for home use
5. **Bilingual support** (future) - Authentic Spanish content

### Success Criteria
- ✅ Real LLM text generation working
- ✅ Draft readiness >50% (vs market's 40%)
- ✅ Can create lesson material in <5 minutes
- ✅ Rate limiting prevents token abuse
- ✅ Professional print output
- ✅ Zero critical bugs

---

## Product Overview

### Target Users
- **Primary:** K-4 classroom teachers (1.8M in US)
- **Secondary:** Homeschool parents, tutors, intervention specialists

### Core User Flow
```
1. Dashboard → Create New
2. Enter prompt + select student profiles (optional)
3. AI generates draft (~15 seconds)
4. Review/edit draft
5. Regenerate if needed (3x limit per 10min)
6. Approve → Visual template generation
7. Save to library / Print / Export
```

### Feature Scope - MVP

**✅ INCLUDED (Working):**
- Student profile CRUD (no PII)
- Prompt builder with optional guides
- Profile selector (max 3 profiles)
- Real LLM integration (Claude API)
- Draft review with inline editing
- Rate limiting (3 regenerations/10min)
- Mock visual templates (worksheet + quiz)
- Library with search/filter
- Dashboard with quick actions
- localStorage persistence
- Print-friendly output

**⚠️ MOCKED (Fake for MVP):**
- Visual generation (templates, not AI)
- Image illustrations (emojis + simple graphics)
- PDF export (use browser print)
- Answer key generation

**❌ NOT INCLUDED (Future):**
- User authentication
- Backend/database
- Multi-device sync
- Sharing features
- Template marketplace
- Bilingual Spanish generation
- Advanced customization
- Analytics dashboard

---

## Technical Architecture

### Tech Stack

**Frontend:**
- React 18+ with Hooks
- React Router v6 for navigation
- Tailwind CSS for styling
- Lucide React for icons

**State Management:**
- React Context API (no Redux)
- localStorage for persistence

**LLM Integration:**
- Claude Sonnet 4 (Anthropic API)
- Direct API calls (no backend for MVP)

**Storage:**
- localStorage (~5-10MB limit)
- JSON format for all data

**No Backend Required** - Entirely client-side for prototype

### Application Structure

```
ai-lesson-planner/
├── public/
│   └── assets/              # Mock illustrations
│       ├── illustrations/
│       └── patterns/
├── src/
│   ├── components/
│   │   ├── shared/          # Button, Modal, LoadingSpinner, Header
│   │   ├── profiles/        # ProfileForm, ProfileCard, ProfileSelector
│   │   ├── creation/        # PromptBuilder, RateLimitWarning
│   │   └── templates/       # WorksheetTemplate, QuizTemplate
│   ├── contexts/
│   │   └── AppContext.js    # Global state management
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── CreateMaterial.js
│   │   ├── DraftReview.js
│   │   ├── VisualEditor.js
│   │   ├── ProfileManager.js
│   │   └── Library.js
│   ├── utils/
│   │   ├── llm.js           # LLM API integration
│   │   ├── rateLimit.js     # Rate limiting logic
│   │   ├── templateLogic.js # Template selection
│   │   └── mockData.js      # Demo library items
│   ├── styles/
│   │   └── templates.css    # Print-friendly styles
│   ├── App.js
│   └── index.js
├── .env.local               # API keys (NEVER commit)
├── .gitignore
├── package.json
└── README.md
```

### Data Models

**StudentProfile:**
```javascript
{
  id: "uuid",
  name: "Visual Learners Group A",
  gradeRange: [1, 2],
  characteristics: ["visual_supports", "iep_accommodations"],
  interestThemes: ["animals", "nature", "art"],
  readingLevel: "below_grade" | "on_grade" | "above_grade",
  notes: "Optional teacher notes",
  createdAt: "ISO timestamp"
}
```

**GenerationRequest:**
```javascript
{
  prompt: "Create worksheet about addition...",
  materialType: "worksheet" | "quiz" | "activity",
  grade: 0-4, // 0 = K
  subject: "math" | "reading" | "science" | "social_studies",
  language: "english" | "spanish" | "bilingual",
  profileIds: ["uuid1", "uuid2"]
}
```

**DraftOutput:**
```javascript
{
  title: "Addition with Regrouping Practice",
  learningObjective: "Students will add two 2-digit numbers...",
  instructions: "Show your work in the boxes below...",
  questions: [
    { number: 1, question: "23 + 19 = ___", answer: "42" }
  ]
}
```

**LibraryItem:**
```javascript
{
  id: "uuid",
  title: "Addition Worksheet",
  type: "worksheet",
  grade: 2,
  subject: "Math",
  content: DraftOutput,
  thumbnail: "📊",
  savedAt: "ISO timestamp"
}
```

---

## Build Sequence

**Total Duration:** 13 days (65 hours)  
**Approach:** Phase-gate model - cannot proceed until current phase complete

### Critical Path
```
Phase 1 → Phase 2 → Phase 3 → Phase 4 (CRITICAL) → Phase 5 → Phase 6 → Phase 7
```

---

## Phase 1: Foundation & Core Shell
**Duration:** 2 days (10 hours)  
**Goal:** Working app structure with navigation

### Task 1.1: Project Setup (1 hour)

```bash
# Create React app
npx create-react-app ai-lesson-planner
cd ai-lesson-planner

# Install dependencies
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react uuid react-router-dom
```

**Configure Tailwind** (`tailwind.config.js`):
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
        'fredoka': ['Fredoka One', 'cursive'],
        'baloo': ['Baloo 2', 'cursive'],
      }
    },
  },
  plugins: [],
}
```

**Add Google Fonts** (`public/index.html`):
```html
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Fredoka+One&family=Baloo+2:wght@400;500;600&display=swap" rel="stylesheet">
```

**Create folder structure:**
```
src/
├── components/
│   ├── shared/
│   ├── profiles/
│   ├── creation/
│   └── templates/
├── contexts/
├── utils/
├── pages/
└── styles/
```

### Task 1.2: AppContext Setup (2 hours)

**Create:** `src/contexts/AppContext.js`

```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [rateLimitData, setRateLimitData] = useState({ regenerations: [] });
  const [libraryItems, setLibraryItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const profiles = localStorage.getItem('lesson_planner_profiles');
      const rateLimit = localStorage.getItem('lesson_planner_rate_limit');
      const library = localStorage.getItem('lesson_planner_library');
      const session = localStorage.getItem('lesson_planner_session');

      if (profiles) setStudentProfiles(JSON.parse(profiles));
      if (rateLimit) setRateLimitData(JSON.parse(rateLimit));
      if (library) setLibraryItems(JSON.parse(library));
      if (session) setUserSession(session);
      else {
        const newSession = `session_${Date.now()}`;
        localStorage.setItem('lesson_planner_session', newSession);
        setUserSession(newSession);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (studentProfiles.length > 0) {
      localStorage.setItem('lesson_planner_profiles', JSON.stringify(studentProfiles));
    }
  }, [studentProfiles]);

  useEffect(() => {
    localStorage.setItem('lesson_planner_rate_limit', JSON.stringify(rateLimitData));
  }, [rateLimitData]);

  useEffect(() => {
    if (libraryItems.length > 0) {
      localStorage.setItem('lesson_planner_library', JSON.stringify(libraryItems));
    }
  }, [libraryItems]);

  // Profile management
  const addProfile = (profile) => {
    const newProfile = {
      ...profile,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setStudentProfiles([...studentProfiles, newProfile]);
    return newProfile;
  };

  const updateProfile = (id, updates) => {
    setStudentProfiles(profiles =>
      profiles.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const deleteProfile = (id) => {
    setStudentProfiles(profiles => profiles.filter(p => p.id !== id));
  };

  // Rate limiting
  const checkRateLimit = () => {
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
    const recentRegens = rateLimitData.regenerations.filter(
      r => new Date(r.timestamp).getTime() > tenMinutesAgo
    );

    if (recentRegens.length >= 3) {
      const oldestRegen = recentRegens[0];
      const timeUntilReset = new Date(oldestRegen.timestamp).getTime() + (10 * 60 * 1000) - Date.now();
      const minutesRemaining = Math.ceil(timeUntilReset / 60000);
      return { allowed: false, minutesRemaining, count: recentRegens.length };
    }

    return { allowed: true, count: recentRegens.length };
  };

  const recordRegeneration = (materialId) => {
    setRateLimitData(data => ({
      regenerations: [...data.regenerations, {
        timestamp: new Date().toISOString(),
        materialId: materialId || 'draft'
      }]
    }));
  };

  // Library management
  const addToLibrary = (item) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString()
    };
    setLibraryItems([...libraryItems, newItem]);
    return newItem;
  };

  const value = {
    userSession,
    studentProfiles,
    rateLimitData,
    libraryItems,
    addProfile,
    updateProfile,
    deleteProfile,
    checkRateLimit,
    recordRegeneration,
    addToLibrary
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
```

**Wrap App** (`src/index.js`):
```javascript
import { AppProvider } from './contexts/AppContext';

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
```

### Task 1.3: Routing Setup (1.5 hours)

**Create:** `src/App.js`

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/shared/Header';
import Dashboard from './pages/Dashboard';
import CreateMaterial from './pages/CreateMaterial';
import DraftReview from './pages/DraftReview';
import VisualEditor from './pages/VisualEditor';
import ProfileManager from './pages/ProfileManager';
import Library from './pages/Library';
import './styles/templates.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateMaterial />} />
            <Route path="/draft-review" element={<DraftReview />} />
            <Route path="/visual-editor" element={<VisualEditor />} />
            <Route path="/profiles" element={<ProfileManager />} />
            <Route path="/library" element={<Library />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```

**Create placeholder pages** (all files in `src/pages/`):

```javascript
// Dashboard.js
export default function Dashboard() {
  return <div>Dashboard - Coming Soon</div>;
}

// CreateMaterial.js
export default function CreateMaterial() {
  return <div>Create Material - Coming Soon</div>;
}

// DraftReview.js
export default function DraftReview() {
  return <div>Draft Review - Coming Soon</div>;
}

// VisualEditor.js
export default function VisualEditor() {
  return <div>Visual Editor - Coming Soon</div>;
}

// ProfileManager.js
export default function ProfileManager() {
  return <div>Profile Manager - Coming Soon</div>;
}

// Library.js
export default function Library() {
  return <div>Library - Coming Soon</div>;
}
```

### Task 1.4: Shared Components (3 hours)

**Create:** `src/components/shared/Header.js`

```javascript
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, FolderOpen, PlusCircle } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BookOpen },
    { path: '/create', label: 'Create', icon: PlusCircle },
    { path: '/profiles', label: 'Profiles', icon: Users },
    { path: '/library', label: 'Library', icon: FolderOpen }
  ];

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen size={28} />
            <span className="text-xl font-bold">AI Lesson Planner</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-700 font-semibold'
                    : 'hover:bg-blue-500'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
```

**Create:** `src/components/shared/Button.js`

```javascript
import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon
}) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}
```

**Create:** `src/components/shared/Modal.js`

```javascript
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative bg-white rounded-lg shadow-xl ${maxWidth} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
```

**Create:** `src/components/shared/LoadingSpinner.js`

```javascript
import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}
```

### Phase 1 Definition of Done

**Verify ALL before proceeding:**
- ✅ App runs without errors (`npm start`)
- ✅ All dependencies installed
- ✅ Tailwind CSS working
- ✅ Routing functional (all pages render)
- ✅ AppContext provides state globally
- ✅ localStorage persistence works
- ✅ Header navigation functional
- ✅ Shared components working
- ✅ No console errors
- ✅ Git commits made

**Time:** 10 hours max

---

## Phase 2: Profile Management
**Duration:** 2 days (10 hours)  
**Goal:** Functional student profile creation and storage

### Task 2.1: ProfileManager Page (2 hours)

**Create:** `src/pages/ProfileManager.js`

```javascript
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import ProfileForm from '../components/profiles/ProfileForm';
import ProfileCard from '../components/profiles/ProfileCard';
import { PlusCircle, Users } from 'lucide-react';

export default function ProfileManager() {
  const { studentProfiles, addProfile, updateProfile, deleteProfile } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const handleSaveProfile = (profileData) => {
    if (editingProfile) {
      updateProfile(editingProfile.id, profileData);
    } else {
      addProfile(profileData);
    }
    setIsModalOpen(false);
    setEditingProfile(null);
  };

  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleDeleteProfile = (id) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      deleteProfile(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Profiles</h1>
        <p className="text-gray-600">Manage learning profiles (no student names or PII)</p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Button 
          icon={PlusCircle}
          onClick={() => {
            setEditingProfile(null);
            setIsModalOpen(true);
          }}
        >
          Create New Profile
        </Button>
      </div>

      {studentProfiles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Users size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No profiles yet!</h3>
          <p className="text-gray-500 mb-6">Create student profiles to differentiate lessons</p>
          <Button icon={PlusCircle} onClick={() => setIsModalOpen(true)}>
            Create Your First Profile
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {studentProfiles.map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={() => handleEditProfile(profile)}
              onDelete={() => handleDeleteProfile(profile.id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProfile(null);
        }}
        title={editingProfile ? 'Edit Profile' : 'Create Student Profile'}
      >
        <ProfileForm
          onSave={handleSaveProfile}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProfile(null);
          }}
          existingProfile={editingProfile}
        />
      </Modal>
    </div>
  );
}
```

### Task 2.2: ProfileCard Component (1.5 hours)

**Create:** `src/components/profiles/ProfileCard.js`

```javascript
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function ProfileCard({ profile, onEdit, onDelete }) {
  const gradeDisplay = profile.gradeRange?.length > 0 
    ? profile.gradeRange.map(g => g === 0 ? 'K' : g).join('-')
    : 'Not specified';

  const readingLevelLabels = {
    below_grade: 'Below Grade',
    on_grade: 'On Grade',
    above_grade: 'Above Grade'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👥</span>
            <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
          </div>

          <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
            <div><span className="font-medium">Grade:</span> {gradeDisplay}</div>
            <div><span className="font-medium">Reading:</span> {readingLevelLabels[profile.readingLevel] || 'Not specified'}</div>
          </div>

          {profile.interestThemes?.length > 0 && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">Interests: </span>
              <span className="text-sm text-gray-600">
                {profile.interestThemes.map((theme, i) => {
                  const emoji = getInterestEmoji(theme);
                  return <span key={i} className="mr-2">{emoji} {formatInterest(theme)}</span>;
                })}
              </span>
            </div>
          )}

          {profile.characteristics?.length > 0 && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">Characteristics: </span>
              <span className="text-sm text-gray-600">
                {profile.characteristics.map(char => formatCharacteristic(char)).join(', ')}
              </span>
            </div>
          )}

          {profile.notes && (
            <div className="text-sm text-gray-600 italic">{profile.notes}</div>
          )}

          <div className="text-xs text-gray-400 mt-3">
            Created: {new Date(profile.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit profile"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete profile"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

const getInterestEmoji = (theme) => {
  const emojiMap = {
    sports: '⚽', animals: '🐰', space: '🚀', nature: '🌿',
    music: '🎵', art: '🎨', food: '🍎', vehicles: '🚗',
    technology: '💻', building: '🏗️', fantasy: '🧙', science: '🔬'
  };
  return emojiMap[theme] || '⭐';
};

const formatInterest = (theme) => {
  return theme.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const formatCharacteristic = (char) => {
  const labels = {
    iep_accommodations: 'IEP/504',
    visual_supports: 'Visual Supports',
    ell: 'English Language Learner',
    scaffolding_needed: 'Scaffolding Needed',
    advanced: 'Advanced/Gifted'
  };
  return labels[char] || char;
};
```

### Task 2.3: ProfileForm Component (4 hours)

**Create:** `src/components/profiles/ProfileForm.js`

```javascript
import React, { useState, useEffect } from 'react';
import Button from '../shared/Button';

const CHARACTERISTICS = [
  { value: 'iep_accommodations', label: 'IEP/504 accommodations' },
  { value: 'visual_supports', label: 'Visual supports needed' },
  { value: 'ell', label: 'English Language Learners' },
  { value: 'scaffolding_needed', label: 'Scaffolding needed' },
  { value: 'advanced', label: 'Advanced/Gifted' }
];

const INTERESTS = [
  { value: 'sports', label: 'Sports' },
  { value: 'animals', label: 'Animals' },
  { value: 'space', label: 'Space' },
  { value: 'nature', label: 'Nature' },
  { value: 'music', label: 'Music' },
  { value: 'art', label: 'Art' },
  { value: 'food', label: 'Food/Cooking' },
  { value: 'vehicles', label: 'Vehicles/Automotive' },
  { value: 'technology', label: 'Technology' },
  { value: 'building', label: 'Building/Construction' },
  { value: 'fantasy', label: 'Fantasy/Fiction' },
  { value: 'science', label: 'Science' }
];

export default function ProfileForm({ onSave, onCancel, existingProfile = null }) {
  const [formData, setFormData] = useState({
    name: '',
    gradeRange: [],
    characteristics: [],
    interestThemes: [],
    readingLevel: 'on_grade',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingProfile) {
      setFormData({
        name: existingProfile.name || '',
        gradeRange: existingProfile.gradeRange || [],
        characteristics: existingProfile.characteristics || [],
        interestThemes: existingProfile.interestThemes || [],
        readingLevel: existingProfile.readingLevel || 'on_grade',
        notes: existingProfile.notes || ''
      });
    }
  }, [existingProfile]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Profile name is required';
    if (formData.gradeRange.length === 0) newErrors.gradeRange = 'Select at least one grade level';
    if (formData.interestThemes.length === 0) newErrors.interestThemes = 'Select at least one interest';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSave(formData);
  };

  const toggleGrade = (grade) => {
    setFormData(prev => ({
      ...prev,
      gradeRange: prev.gradeRange.includes(grade)
        ? prev.gradeRange.filter(g => g !== grade)
        : [...prev.gradeRange, grade].sort()
    }));
  };

  const toggleCheckbox = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder='e.g., "Visual Learners Group A"'
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Grade Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grade Range <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {['K', 1, 2, 3, 4].map((grade) => {
            const gradeValue = grade === 'K' ? 0 : grade;
            const isSelected = formData.gradeRange.includes(gradeValue);
            return (
              <button
                key={grade}
                type="button"
                onClick={() => toggleGrade(gradeValue)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>
        {errors.gradeRange && <p className="text-red-500 text-sm mt-1">{errors.gradeRange}</p>}
      </div>

      {/* Characteristics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Characteristics
        </label>
        <div className="space-y-2">
          {CHARACTERISTICS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.characteristics.includes(value)}
                onChange={() => toggleCheckbox('characteristics', value)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interest Themes <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {INTERESTS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.interestThemes.includes(value)}
                onChange={() => toggleCheckbox('interestThemes', value)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
        {errors.interestThemes && <p className="text-red-500 text-sm mt-1">{errors.interestThemes}</p>}
      </div>

      {/* Reading Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Reading Level</label>
        <div className="space-y-2">
          {[
            { value: 'below_grade', label: 'Below grade level' },
            { value: 'on_grade', label: 'On grade level' },
            { value: 'above_grade', label: 'Above grade level' }
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="readingLevel"
                value={value}
                checked={formData.readingLevel === value}
                onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value })}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional notes about this profile..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Profile</Button>
      </div>
    </form>
  );
}
```

### Phase 2 Definition of Done

**Verify ALL before proceeding:**
- ✅ ProfileManager page renders
- ✅ Can create new profiles
- ✅ Can edit existing profiles
- ✅ Can delete profiles (with confirmation)
- ✅ Empty state shows when no profiles
- ✅ Form validation works
- ✅ Profiles persist across page refreshes
- ✅ No console errors

**Time:** 10 hours max

---

## Phase 3: Material Creation - Prompt Input
**Duration:** 1.5 days (7.5 hours)  
**Goal:** Prompt builder interface with profile selection

### Task 3.1: CreateMaterial Page (2 hours)

**Update:** `src/pages/CreateMaterial.js`

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import PromptBuilder from '../components/creation/PromptBuilder';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function CreateMaterial() {
  const navigate = useNavigate();
  const { studentProfiles } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (promptData) => {
    setIsGenerating(true);
    // Will implement in Phase 4
    console.log('Generating with:', promptData);
    setTimeout(() => {
      navigate('/draft-review', { state: { promptData } });
    }, 2000);
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto">
        <LoadingSpinner message="Generating your draft... ☕ (~15 seconds)" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Lesson Material</h1>

      <PromptBuilder profiles={studentProfiles} onGenerate={handleGenerate} />
    </div>
  );
}
```

### Task 3.2: PromptBuilder Component (3.5 hours)

**Create:** `src/components/creation/PromptBuilder.js`

```javascript
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../shared/Button';
import ProfileSelector from './ProfileSelector';
import RateLimitWarning from './RateLimitWarning';
import { useApp } from '../../contexts/AppContext';

const GRADES = [
  { value: 0, label: 'K' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' }
];

const SUBJECTS = ['Math', 'Reading', 'Science', 'Social Studies', 'Writing'];
const MATERIAL_TYPES = ['Worksheet', 'Quiz', 'Activity', 'Answer Key'];
const LANGUAGES = ['English', 'Spanish', 'Bilingual'];

export default function PromptBuilder({ profiles, onGenerate }) {
  const { checkRateLimit } = useApp();
  const [prompt, setPrompt] = useState('');
  const [showGuides, setShowGuides] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [selectedMaterialType, setSelectedMaterialType] = useState('Worksheet');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [showProfileSelector, setShowProfileSelector] = useState(false);

  const rateLimitCheck = checkRateLimit();
  const canGenerate = prompt.trim().length > 0 && rateLimitCheck.allowed;

  const handleGenerate = () => {
    if (!canGenerate) return;

    const promptData = {
      prompt: prompt.trim(),
      grade: selectedGrade,
      subject: selectedSubject,
      materialType: selectedMaterialType,
      language: selectedLanguage,
      profileIds: selectedProfiles.map(p => p.id)
    };

    onGenerate(promptData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {!rateLimitCheck.allowed && (
        <RateLimitWarning minutesRemaining={rateLimitCheck.minutesRemaining} />
      )}

      {/* Main Prompt */}
      <div>
        <label className="block text-lg font-medium text-gray-900 mb-2">
          What would you like to create?
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Example: Create a worksheet about addition with regrouping for 2nd graders who love animals...'
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
        />
        <p className="text-sm text-gray-500 mt-2">Be specific! The more details, the better the draft.</p>
      </div>

      {/* Optional Guides */}
      <div>
        <button
          type="button"
          onClick={() => setShowGuides(!showGuides)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          {showGuides ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          Optional: Guide my prompt
        </button>

        {showGuides && (
          <div className="mt-4 space-y-4 pl-4 border-l-2 border-blue-200">
            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <div className="flex flex-wrap gap-2">
                {GRADES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedGrade(value)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      selectedGrade === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject & Material Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {SUBJECTS.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material Type</label>
                <select
                  value={selectedMaterialType}
                  onChange={(e) => setSelectedMaterialType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {MATERIAL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <div className="flex gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedLanguage === lang
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Differentiation Options */}
      <div className="bg-blue-50 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          🎯 Differentiation Options
        </label>
        <p className="text-sm text-gray-600 mb-3">Create variations for different students</p>
        
        <Button variant="secondary" onClick={() => setShowProfileSelector(true)}>
          Select Student Profiles
        </Button>

        {selectedProfiles.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Selected ({selectedProfiles.length}/3):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedProfiles.map(profile => (
                <span
                  key={profile.id}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm"
                >
                  {profile.name}
                  <button
                    onClick={() => setSelectedProfiles(prev => prev.filter(p => p.id !== profile.id))}
                    className="text-gray-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleGenerate} disabled={!canGenerate} className="px-8">
          Generate Draft
        </Button>
      </div>

      {/* Profile Selector Modal */}
      {showProfileSelector && (
        <ProfileSelector
          profiles={profiles}
          selectedProfiles={selectedProfiles}
          onSelect={setSelectedProfiles}
          onClose={() => setShowProfileSelector(false)}
        />
      )}
    </div>
  );
}
```

### Task 3.3: Supporting Components (2 hours)

**Create:** `src/components/creation/ProfileSelector.js`

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { PlusCircle } from 'lucide-react';

export default function ProfileSelector({ profiles, selectedProfiles, onSelect, onClose }) {
  const navigate = useNavigate();
  const selectedIds = selectedProfiles.map(p => p.id);
  const maxReached = selectedProfiles.length >= 3;

  const handleToggle = (profile) => {
    if (selectedIds.includes(profile.id)) {
      onSelect(selectedProfiles.filter(p => p.id !== profile.id));
    } else if (!maxReached) {
      onSelect([...selectedProfiles, profile]);
    }
  };

  const handleCreateNew = () => {
    onClose();
    navigate('/profiles');
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Select Student Profiles (${selectedProfiles.length}/3 selected)`}
    >
      {profiles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No profiles yet!</p>
          <Button icon={PlusCircle} onClick={handleCreateNew}>
            Create Your First Profile
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {profiles.map(profile => {
              const isSelected = selectedIds.includes(profile.id);
              const isDisabled = maxReached && !isSelected;

              return (
                <button
                  key={profile.id}
                  onClick={() => !isDisabled && handleToggle(profile)}
                  disabled={isDisabled}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked={isSelected} disabled={isDisabled} readOnly className="mt-1 w-5 h-5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Grade: {profile.gradeRange?.map(g => g === 0 ? 'K' : g).join('-') || 'N/A'}
                      </p>
                      {profile.interestThemes?.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {profile.interestThemes.slice(0, 3).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  {isDisabled && <p className="text-xs text-red-600 mt-2">Max 3 reached</p>}
                </button>
              );
            })}
          </div>

          <div className="border-t pt-4">
            <Button variant="secondary" icon={PlusCircle} onClick={handleCreateNew}>
              Create New Profile
            </Button>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Apply Selection</Button>
          </div>
        </>
      )}
    </Modal>
  );
}
```

**Create:** `src/components/creation/RateLimitWarning.js`

```javascript
import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';

export default function RateLimitWarning({ minutesRemaining }) {
  const [timeLeft, setTimeLeft] = useState(minutesRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1/60));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft);
  const seconds = Math.floor((timeLeft - minutes) * 60);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 mb-1">Generation Limit Reached</h3>
          <p className="text-sm text-yellow-800 mb-2">
            You've used 3 regenerations in the last 10 minutes. This helps us conserve tokens and keep costs low!
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-yellow-900">
            <Clock size={16} />
            Next available in: {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Phase 3 Definition of Done

**Verify ALL before proceeding:**
- ✅ CreateMaterial page renders
- ✅ Prompt textarea functional
- ✅ Optional guides expand/collapse
- ✅ All form fields work
- ✅ Profile selector opens and allows selection
- ✅ Max 3 profiles enforced
- ✅ Rate limit warning displays correctly
- ✅ Generate button validates
- ✅ No console errors

**Time:** 7.5 hours max

---

## Phase 4: LLM Integration (CRITICAL ⚠️)
**Duration:** 2.5 days (12.5 hours)  
**Goal:** Real text generation from LLM API

**⚠️ THIS IS THE MOST CRITICAL PHASE - Take your time!**

### Task 4.1: API Utility Setup (3 hours)

**Create:** `.env.local` (⚠️ Add to .gitignore!)

```
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here
```

**Update:** `.gitignore`

```
# Add this line
.env.local
```

**Create:** `src/utils/llm.js`

```javascript
/**
 * LLM API Integration
 * Handles calls to Claude for draft generation
 */

const API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 2000;
const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

/**
 * Build prompt for LLM
 */
export const buildPrompt = (request) => {
  const { prompt, grade, subject, materialType, language, profiles } = request;
  const gradeDisplay = grade === 0 ? 'K' : grade;

  let systemPrompt = `You are an expert K-4 educator. Generate a ${materialType.toLowerCase()} for grade ${gradeDisplay} ${subject.toLowerCase()}.

Output ONLY valid JSON in this exact format:
{
  "title": "string",
  "learningObjective": "string (what students will learn)",
  "instructions": "string (instructions for students)",
  "questions": [
    {"number": 1, "question": "text", "answer": "correct answer"}
  ]
}

IMPORTANT:
- Make content age-appropriate for grade ${gradeDisplay}
- Use clear, simple language
- Include 5-8 questions
- Ensure answers are correct
- Make it engaging and educational`;

  if (profiles && profiles.length > 0) {
    const profileContext = profiles.map(p => 
      `Profile: ${p.name}
- Interests: ${p.interestThemes?.join(', ') || 'general'}
- Characteristics: ${p.characteristics?.map(formatCharacteristic).join(', ') || 'none'}
- Reading level: ${formatReadingLevel(p.readingLevel)}`
    ).join('\n\n');

    systemPrompt += `\n\nAdapt content for these student profiles:\n${profileContext}

Make the content especially engaging by incorporating their interests where possible.`;
  }

  if (language === 'Spanish') {
    systemPrompt += `\n\nGenerate all content in SPANISH.`;
  } else if (language === 'Bilingual') {
    systemPrompt += `\n\nGenerate content in BOTH English and Spanish.`;
  }

  return systemPrompt + `\n\nTeacher's request: ${prompt}`;
};

/**
 * Call LLM API
 */
export const generateDraft = async (request) => {
  if (!API_KEY) {
    throw new Error('API key not configured. Add REACT_APP_ANTHROPIC_API_KEY to .env.local');
  }

  const fullPrompt = buildPrompt(request);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [{ role: 'user', content: fullPrompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();
    const parsedResult = parseLLMResponse(data.content[0].text);
    
    if (!parsedResult.success) {
      throw new Error('Failed to parse LLM response');
    }

    return {
      success: true,
      data: parsedResult.data,
      rawResponse: data.content[0].text
    };
  } catch (error) {
    console.error('LLM API Error:', error);
    return {
      success: false,
      error: error.message,
      details: error
    };
  }
};

/**
 * Parse LLM response JSON
 */
export const parseLLMResponse = (rawText) => {
  try {
    let cleaned = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.title || !parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response structure');
    }

    parsed.questions.forEach((q, i) => {
      if (!q.question || !q.answer) {
        throw new Error(`Question ${i + 1} missing required fields`);
      }
      if (!q.number) q.number = i + 1;
    });

    return { success: true, data: parsed };
  } catch (error) {
    console.error('Parse error:', error);
    return { success: false, error: 'Failed to parse LLM response', rawText };
  }
};

// Helper functions
const formatCharacteristic = (char) => {
  const labels = {
    iep_accommodations: 'IEP/504',
    visual_supports: 'Visual Supports',
    ell: 'English Language Learner',
    scaffolding_needed: 'Scaffolding Needed',
    advanced: 'Advanced/Gifted'
  };
  return labels[char] || char;
};

const formatReadingLevel = (level) => {
  const labels = {
    below_grade: 'Below Grade',
    on_grade: 'On Grade',
    above_grade: 'Above Grade'
  };
  return labels[level] || 'On Grade';
};
```

### Task 4.2: Rate Limit Utility (1.5 hours)

**Create:** `src/utils/rateLimit.js`

```javascript
/**
 * Rate Limiting Utilities
 */

const STORAGE_KEY = 'lesson_planner_rate_limit';
const MAX_REGENERATIONS = 3;
const TIME_WINDOW = 10 * 60 * 1000; // 10 minutes

export const checkRateLimit = () => {
  const rateData = getRateLimitData();
  const now = Date.now();
  const windowStart = now - TIME_WINDOW;

  const recentRegens = rateData.regenerations.filter(
    r => new Date(r.timestamp).getTime() > windowStart
  );

  if (recentRegens.length >= MAX_REGENERATIONS) {
    const oldestRegen = recentRegens[0];
    const oldestTime = new Date(oldestRegen.timestamp).getTime();
    const timeUntilReset = (oldestTime + TIME_WINDOW) - now;
    const minutesRemaining = Math.ceil(timeUntilReset / 60000);

    return { allowed: false, count: recentRegens.length, minutesRemaining };
  }

  return { allowed: true, count: recentRegens.length };
};

export const recordRegeneration = (materialId = 'draft') => {
  const rateData = getRateLimitData();
  
  rateData.regenerations.push({
    timestamp: new Date().toISOString(),
    materialId
  });

  const now = Date.now();
  const windowStart = now - TIME_WINDOW;
  rateData.regenerations = rateData.regenerations.filter(
    r => new Date(r.timestamp).getTime() > windowStart
  );

  saveRateLimitData(rateData);
};

export const getRegenerationCount = () => {
  const check = checkRateLimit();
  return check.count;
};

const getRateLimitData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (error) {
    console.error('Error reading rate limit data:', error);
  }
  return { regenerations: [] };
};

const saveRateLimitData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving rate limit data:', error);
  }
};
```

### Task 4.3: Wire Up Generation (3 hours)

**Update:** `src/pages/CreateMaterial.js`

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { generateDraft } from '../utils/llm';
import { checkRateLimit, recordRegeneration } from '../utils/rateLimit';
import PromptBuilder from '../components/creation/PromptBuilder';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function CreateMaterial() {
  const navigate = useNavigate();
  const { studentProfiles } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (promptData) => {
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      alert(`Hold on! You've used your 3 tries. Back in ${rateLimitCheck.minutesRemaining} minutes ⏰`);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const profiles = promptData.profileIds
        .map(id => studentProfiles.find(p => p.id === id))
        .filter(Boolean);

      const result = await generateDraft({
        prompt: promptData.prompt,
        grade: promptData.grade || 2,
        subject: promptData.subject,
        materialType: promptData.materialType,
        language: promptData.language,
        profiles
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate draft');
      }

      recordRegeneration();

      navigate('/draft-review', {
        state: {
          draftData: result.data,
          rawResponse: result.rawResponse,
          promptData,
          profiles
        }
      });
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.message);
      setIsGenerating(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-2">Oops—something went wrong</h2>
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto">
        <LoadingSpinner message="Generating your draft... ☕ (~15 seconds)" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700">
          ← Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Lesson Material</h1>

      <PromptBuilder profiles={studentProfiles} onGenerate={handleGenerate} />
    </div>
  );
}
```

### Task 4.4: DraftReview Placeholder (2 hours)

**Update:** `src/pages/DraftReview.js`

```javascript
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/shared/Button';

export default function DraftReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { draftData } = location.state || {};

  if (!draftData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-600 mb-6">No draft data available. Please generate a draft first.</p>
        <Button onClick={() => navigate('/create')}>Create Material</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Draft Review</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{draftData.title}</h2>
        </div>

        {draftData.learningObjective && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Learning Objective:</h3>
            <p className="text-gray-700">{draftData.learningObjective}</p>
          </div>
        )}

        {draftData.instructions && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
            <p className="text-gray-700">{draftData.instructions}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Questions:</h3>
          <div className="space-y-4">
            {draftData.questions.map((q, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2">
                  {q.number}. {q.question}
                </p>
                <p className="text-sm text-gray-600">Answer: {q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="secondary" onClick={() => navigate('/create')}>
          Start Over
        </Button>
        <Button onClick={() => alert('Phase 5 coming soon!')}>
          Looks Good →
        </Button>
      </div>
    </div>
  );
}
```

### Phase 4 Definition of Done

**Verify ALL before proceeding:**
- ✅ API utility functions working
- ✅ LLM API calls succeed
- ✅ Responses parse correctly
- ✅ Rate limiting enforced
- ✅ Generation flow works end-to-end
- ✅ Profile data incorporated
- ✅ Error handling works
- ✅ Multiple test generations successful
- ✅ No console errors

**Time:** 12.5 hours max - TAKE YOUR TIME ON THIS PHASE!

---

## Phase 5: Draft Review & Editing
**Duration:** 2 days (10 hours)  
**Goal:** Interactive draft review with regeneration

### Task 5.1: DraftReview Full Implementation (4 hours)

**Update:** `src/pages/DraftReview.js`

```javascript
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { generateDraft } from '../utils/llm';
import { checkRateLimit, recordRegeneration, getRegenerationCount } from '../utils/rateLimit';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Edit2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function DraftReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentProfiles } = useApp();
  
  const [draftData, setDraftData] = useState(location.state?.draftData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(draftData);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState(null);

  const { promptData, profiles } = location.state || {};
  const regenerationCount = getRegenerationCount();

  if (!draftData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No draft data available</h2>
        <p className="text-gray-600 mb-6">Please generate a draft first.</p>
        <Button onClick={() => navigate('/create')}>Create Material</Button>
      </div>
    );
  }

  const handleRegenerate = async () => {
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      alert(`Hold on! You've used your 3 tries. Back in ${rateLimitCheck.minutesRemaining} minutes ⏰`);
      return;
    }

    setIsRegenerating(true);
    setError(null);

    try {
      const fullProfiles = promptData.profileIds
        ?.map(id => studentProfiles.find(p => p.id === id))
        .filter(Boolean) || [];

      const result = await generateDraft({
        prompt: promptData.prompt,
        grade: promptData.grade || 2,
        subject: promptData.subject,
        materialType: promptData.materialType,
        language: promptData.language,
        profiles: fullProfiles
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to regenerate draft');
      }

      recordRegeneration();
      setDraftData(result.data);
      setEditedContent(result.data);
    } catch (error) {
      console.error('Regeneration error:', error);
      setError(error.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleStartOver = () => {
    if (window.confirm('Are you sure? This will discard your current draft.')) {
      navigate('/create');
    }
  };

  const handleApprove = () => {
    navigate('/visual-editor', {
      state: {
        approvedDraft: editedContent,
        promptData,
        profiles
      }
    });
  };

  const handleSaveEdits = () => {
    setDraftData(editedContent);
    setIsEditing(false);
  };

  if (isRegenerating) {
    return (
      <div className="max-w-4xl mx-auto">
        <LoadingSpinner message="Regenerating draft... ☕" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={handleStartOver} className="text-blue-600 hover:text-blue-700">
          ← Start Over
        </button>
        <div className="text-sm text-gray-600">
          Regenerations used: {regenerationCount}/3
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Draft Review</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-blue-900 font-medium">
              You're the expert—fix anything that needs tweaking!
            </p>
            <p className="text-sm text-blue-800 mt-1">
              AI tried its best, but you know your students better than any algorithm.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-900 font-medium">Oops—something went wrong</p>
          <p className="text-red-800 text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          {isEditing ? (
            <input
              type="text"
              value={editedContent.title}
              onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xl font-bold"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900">{draftData.title}</h2>
          )}
        </div>

        {draftData.learningObjective && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objective</label>
            {isEditing ? (
              <textarea
                value={editedContent.learningObjective}
                onChange={(e) => setEditedContent({ ...editedContent, learningObjective: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-700">{draftData.learningObjective}</p>
            )}
          </div>
        )}

        {draftData.instructions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            {isEditing ? (
              <textarea
                value={editedContent.instructions}
                onChange={(e) => setEditedContent({ ...editedContent, instructions: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-700">{draftData.instructions}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Questions</label>
          <div className="space-y-4">
            {(isEditing ? editedContent : draftData).questions.map((q, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Question</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          const newQuestions = [...editedContent.questions];
                          newQuestions[index].question = e.target.value;
                          setEditedContent({ ...editedContent, questions: newQuestions });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Answer</label>
                      <input
                        type="text"
                        value={q.answer}
                        onChange={(e) => {
                          const newQuestions = [...editedContent.questions];
                          newQuestions[index].answer = e.target.value;
                          setEditedContent({ ...editedContent, questions: newQuestions });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-gray-900 mb-2">
                      {q.number}. {q.question}
                    </p>
                    <p className="text-sm text-gray-600">Answer: {q.answer}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button onClick={handleSaveEdits} icon={CheckCircle}>Save Changes</Button>
              <Button variant="secondary" onClick={() => {
                setEditedContent(draftData);
                setIsEditing(false);
              }}>Cancel</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setIsEditing(true)} icon={Edit2}>
              Edit Text
            </Button>
          )}
          
          <Button 
            variant="secondary" 
            onClick={handleRegenerate}
            icon={RefreshCw}
            disabled={!checkRateLimit().allowed}
          >
            Regenerate
          </Button>
        </div>

        <Button onClick={handleApprove} disabled={isEditing}>
          Looks Good! →
        </Button>
      </div>
    </div>
  );
}
```

### Phase 5 Definition of Done

**Verify ALL before proceeding:**
- ✅ DraftReview page fully functional
- ✅ Can edit all draft fields
- ✅ Save changes works
- ✅ Regenerate calls LLM successfully
- ✅ Rate limit enforced
- ✅ Start Over returns to creation
- ✅ Approve advances to Visual Editor
- ✅ No console errors

**Time:** 10 hours max

---

## Phase 6: Visual Editor (Mock Output)
**Duration:** 1.5 days (7.5 hours)  
**Goal:** Mock visual representation of final material

### Task 6.1: Visual Editor Page (2 hours)

**Update:** `src/pages/VisualEditor.js`

```javascript
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/shared/Button';
import { ArrowLeft, Save, Eye, Download, X } from 'lucide-react';
import WorksheetTemplate from '../components/templates/WorksheetTemplate';
import QuizTemplate from '../components/templates/QuizTemplate';
import { populateTemplate } from '../utils/templateLogic';

export default function VisualEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToLibrary } = useApp();
  
  const [showBanner, setShowBanner] = useState(true);
  const [templateData, setTemplateData] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { approvedDraft, promptData, profiles } = location.state || {};

  useEffect(() => {
    if (approvedDraft) {
      const data = populateTemplate(approvedDraft, profiles?.[0]);
      setTemplateData(data);
    }
  }, [approvedDraft, profiles]);

  if (!approvedDraft) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-600 mb-6">No approved draft available.</p>
        <Button onClick={() => navigate('/create')}>Create Material</Button>
      </div>
    );
  }

  const handleSave = () => {
    addToLibrary({
      title: approvedDraft.title,
      type: promptData?.materialType || 'worksheet',
      grade: promptData?.grade || 2,
      subject: promptData?.subject || 'General',
      content: approvedDraft,
      thumbnail: templateData?.emoji || '📄'
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePreview = () => {
    window.print();
  };

  const handleExport = () => {
    alert('PDF export coming soon! For now, use Print → Save as PDF.');
  };

  if (!templateData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const TemplateComponent = approvedDraft.materialType === 'Quiz' 
    ? QuizTemplate 
    : WorksheetTemplate;

  return (
    <div className="min-h-screen bg-gray-100">
      {showBanner && (
        <div className="bg-blue-100 border-b border-blue-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-800">ℹ️</span>
                <span className="text-sm text-blue-900">
                  <strong>Preview Mode:</strong> Visual generation coming soon! This shows how your worksheet will look.
                </span>
              </div>
              <button onClick={() => setShowBanner(false)} className="text-blue-600 hover:text-blue-800">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/draft-review', { state: location.state })}>
              Back to Draft
            </Button>

            <div className="flex items-center gap-3">
              {saveSuccess && (
                <span className="text-green-600 font-medium animate-fade-in">
                  ✓ Saved to library!
                </span>
              )}
              <Button variant="secondary" icon={Eye} onClick={handlePreview}>Preview Print</Button>
              <Button variant="secondary" icon={Download} onClick={handleExport}>Export</Button>
              <Button icon={Save} onClick={handleSave}>Save to Library</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <TemplateComponent
          data={approvedDraft}
          illustration={templateData.illustration}
          emoji={templateData.emoji}
          category={templateData.category}
          profile={profiles?.[0]}
          grade={promptData?.grade || 2}
          subject={promptData?.subject || 'General'}
        />
      </div>
    </div>
  );
}
```

### Task 6.2: Template Logic (1.5 hours)

**Create:** `src/utils/templateLogic.js`

```javascript
export const populateTemplate = (approvedDraft, profile) => {
  const keywords = extractKeywords(
    approvedDraft.title,
    approvedDraft.instructions || '',
    approvedDraft.questions?.map(q => q.question).join(' ') || ''
  );

  const category = findCategory(keywords);
  const illustration = null; // Using emojis for MVP
  const emoji = selectEmoji(category);

  return {
    template: approvedDraft.materialType || 'worksheet',
    illustration,
    emoji,
    category,
    keywords
  };
};

const extractKeywords = (title, instructions, questionsText) => {
  const text = `${title} ${instructions} ${questionsText}`.toLowerCase();
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'with', 'about', 'for', 'to', 'of', 'in', 'on'];
  const words = text.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
  return [...new Set(words)];
};

const categoryMap = {
  animals: ['animal', 'pet', 'dog', 'cat', 'rabbit', 'lion', 'tiger', 'monkey', 'elephant', 'bird', 'fish', 'zoo'],
  nature: ['nature', 'tree', 'plant', 'flower', 'garden', 'forest', 'leaf', 'seed', 'grow'],
  sports: ['sport', 'soccer', 'basketball', 'baseball', 'football', 'tennis', 'run', 'jump', 'play', 'game'],
  space: ['space', 'planet', 'star', 'moon', 'sun', 'rocket', 'astronaut', 'galaxy'],
  school: ['school', 'learn', 'study', 'book', 'read', 'write', 'classroom'],
  math: ['add', 'subtract', 'multiply', 'divide', 'number', 'count', 'math']
};

const findCategory = (keywords) => {
  let bestMatch = { category: 'school', score: 0 };
  for (const [category, terms] of Object.entries(categoryMap)) {
    const score = keywords.filter(kw => terms.some(term => kw.includes(term) || term.includes(kw))).length;
    if (score > bestMatch.score) {
      bestMatch = { category, score };
    }
  }
  return bestMatch.category;
};

const emojiMap = {
  animals: ['🐰', '🦁', '🐵', '🦋', '🐛', '🐸'],
  nature: ['🌱', '🌿', '🌳', '🌻', '☀️', '🌈'],
  sports: ['⚽', '🏀', '⚾', '🏈', '🎾'],
  space: ['🚀', '🌙', '⭐', '🌟', '🪐'],
  school: ['📚', '📖', '✏️', '📝', '🎓'],
  math: ['🔢', '➕', '➖', '✖️', '➗']
};

const selectEmoji = (category) => {
  const options = emojiMap[category] || emojiMap.school;
  return options[Math.floor(Math.random() * options.length)];
};
```

### Task 6.3: Worksheet Template (2.5 hours)

**Create:** `src/components/templates/WorksheetTemplate.js`

```javascript
import React from 'react';
import { Pencil } from 'lucide-react';

export default function WorksheetTemplate({ data, emoji, category, profile, grade, subject }) {
  const gradeDisplay = grade === 0 ? 'K' : grade;

  return (
    <div className="worksheet-container bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="worksheet-paper p-8" style={{ minHeight: '11in' }}>
        
        <div className="worksheet-header border-b-4 border-blue-600 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{emoji}</span>
                <h1 className="text-3xl font-bold text-gray-900 font-fredoka">{data.title}</h1>
              </div>
              <div className="text-sm text-gray-600">Grade {gradeDisplay} | {subject}</div>
            </div>
            <div className="text-sm text-gray-600 text-right">
              <div className="mb-2">Name: <span className="inline-block border-b-2 border-gray-300 w-40"></span></div>
              <div>Date: <span className="inline-block border-b-2 border-gray-300 w-32"></span></div>
            </div>
          </div>
        </div>

        {category && (
          <div className="text-center mb-6">
            <div className="text-6xl">{getCategoryIllustration(category)}</div>
          </div>
        )}

        {data.instructions && (
          <div className="instructions-box bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-2">
              <Pencil className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-blue-900 mb-2 font-baloo">Instructions:</h3>
                <p className="text-gray-800 leading-relaxed font-quicksand">{data.instructions}</p>
              </div>
            </div>
          </div>
        )}

        {data.learningObjective && (
          <div className="text-xs text-gray-500 italic mb-4 px-2">
            Learning Goal: {data.learningObjective}
          </div>
        )}

        <div className="questions-section space-y-6">
          {data.questions?.map((q, index) => (
            <div key={index} className="question-box border-2 border-blue-300 rounded-lg p-5 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <span className="question-number text-3xl font-bold text-blue-600 font-baloo flex-shrink-0">
                  {q.number || index + 1}.
                </span>
                <div className="flex-1">
                  <p className="question-text text-lg text-gray-900 mb-4 font-quicksand">{q.question}</p>
                  
                  <div className="work-space bg-gray-50 rounded p-4 min-h-32 border-2 border-dashed border-gray-300">
                    {profile?.characteristics?.includes('visual_supports') && (
                      <div className="text-sm text-gray-500 italic">Show your work here ↓</div>
                    )}
                    <div className="space-y-6 mt-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="border-b border-gray-300"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="worksheet-footer mt-8 pt-6 border-t-2 border-dashed border-gray-300 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span className="text-xl">{emoji}</span>
            <span className="font-medium">{getFooterMessage(category)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const getCategoryIllustration = (category) => {
  const illustrations = {
    animals: '🦁🐰🐵🦋',
    nature: '🌳🌻🌿🍃',
    sports: '⚽🏀⚾🎾',
    space: '🚀🌙⭐🪐',
    school: '📚📖✏️📝',
    math: '🔢➕➖📊'
  };
  return illustrations[category] || '📚✨';
};

const getFooterMessage = (category) => {
  const messages = {
    animals: 'Great work learning about animals!',
    nature: 'Keep exploring nature!',
    sports: 'You\'re a superstar!',
    space: 'Reach for the stars!',
    school: 'Keep up the great work!',
    math: 'Math wizard in training!'
  };
  return messages[category] || 'Excellent effort!';
};
```

### Task 6.4: Quiz Template (1.5 hours)

**Create:** `src/components/templates/QuizTemplate.js`

```javascript
import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function QuizTemplate({ data, emoji, grade, subject }) {
  const gradeDisplay = grade === 0 ? 'K' : grade;

  return (
    <div className="worksheet-container bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="worksheet-paper p-8" style={{ minHeight: '11in' }}>
        
        <div className="quiz-header bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{emoji}</span>
                <h1 className="text-2xl font-bold font-fredoka">Quiz: {data.title}</h1>
              </div>
              <div className="text-sm opacity-90">Grade {gradeDisplay} | {subject}</div>
            </div>
            <div className="bg-white text-blue-600 px-6 py-3 rounded-lg">
              <div className="text-xs text-gray-600">Score</div>
              <div className="text-2xl font-bold">
                <span className="border-b-2 border-blue-600 inline-block w-12 text-center">__</span>
                <span className="mx-1">/</span>
                <span>{data.questions?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 text-sm text-gray-600">
          <span>Name: </span>
          <span className="inline-block border-b-2 border-gray-300 w-64 ml-2"></span>
          <span className="ml-8">Date: </span>
          <span className="inline-block border-b-2 border-gray-300 w-32 ml-2"></span>
        </div>

        {data.instructions && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start gap-2">
            <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <p className="text-gray-800 font-quicksand">{data.instructions}</p>
          </div>
        )}

        <div className="space-y-6">
          {data.questions?.map((q, index) => (
            <div key={index} className="quiz-question bg-white border-2 border-gray-300 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-4">
                <span className="quiz-question-number bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {q.number || index + 1}
                </span>
                <p className="text-lg text-gray-900 font-quicksand flex-1">{q.question}</p>
              </div>

              <div className="ml-11">
                <div className="text-sm text-gray-600 mb-2">Answer:</div>
                <div className="border-2 border-gray-300 rounded p-3 min-h-20 bg-gray-50"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span className="text-xl">{emoji}</span>
            <span className="font-medium">Do your best! ⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Task 6.5: Template CSS (30 minutes)

**Create:** `src/styles/templates.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Fredoka+One&family=Baloo+2:wght@400;500;600&display=swap');

.font-quicksand { font-family: 'Quicksand', sans-serif; }
.font-fredoka { font-family: 'Fredoka One', cursive; }
.font-baloo { font-family: 'Baloo 2', cursive; }

.worksheet-container { font-family: 'Quicksand', sans-serif; }
.worksheet-paper { background: white; line-height: 1.8; }

@media print {
  body { background: white; }
  .worksheet-container {
    box-shadow: none !important;
    margin: 0 !important;
    max-width: none !important;
  }
  .worksheet-paper {
    padding: 0.5in !important;
    page-break-after: always;
  }
  header, nav, .toolbar, .banner, button {
    display: none !important;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in { animation: fade-in 0.3s ease-in; }
```

### Phase 6 Definition of Done

**Verify ALL before proceeding:**
- ✅ VisualEditor page renders
- ✅ Template selection works
- ✅ Mock templates display beautifully
- ✅ All content displays correctly
- ✅ Print preview works
- ✅ Save to library functional
- ✅ Banner displays and dismisses
- ✅ No console errors

**Time:** 7.5 hours max

---

## Phase 7: Dashboard & Library
**Duration:** 1.5 days (7.5 hours)  
**Goal:** Landing page with quick actions and library view

### Task 7.1: Dashboard Page (3 hours)

**Update:** `src/pages/Dashboard.js`

```javascript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/shared/Button';
import { PlusCircle, BookOpen, Users, FolderOpen, FileText } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { studentProfiles, libraryItems } = useApp();
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const recent = [...libraryItems]
      .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
      .slice(0, 3);
    setRecentItems(recent);
  }, [libraryItems]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI Lesson Planner! 👋</h1>
        <p className="text-xl mb-6 opacity-90">Create differentiated lesson materials in minutes</p>
        <Button
          icon={PlusCircle}
          onClick={() => navigate('/create')}
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          Create New Lesson
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            icon={FolderOpen}
            title="My Library"
            description={`${libraryItems.length} saved materials`}
            onClick={() => navigate('/library')}
          />
          <QuickActionCard
            icon={Users}
            title="Student Profiles"
            description={`${studentProfiles.length} profiles created`}
            onClick={() => navigate('/profiles')}
          />
          <QuickActionCard
            icon={FileText}
            title="Browse Templates"
            description="Coming soon!"
            onClick={() => alert('Template browser coming soon!')}
            disabled
          />
        </div>
      </div>

      {recentItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentItems.map((item) => (
              <MaterialCard key={item.id} item={item} onClick={() => navigate('/library')} />
            ))}
          </div>
        </div>
      )}

      {libraryItems.length === 0 && (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No materials yet!</h3>
          <p className="text-gray-500 mb-6">Create your first lesson material to get started</p>
          <Button icon={PlusCircle} onClick={() => navigate('/create')}>
            Create Your First Lesson
          </Button>
        </div>
      )}
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all text-left ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
      }`}
    >
      <Icon size={32} className="text-blue-600 mb-3" />
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

function MaterialCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all text-left hover:scale-105"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-4xl">{item.thumbnail}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
          <p className="text-sm text-gray-600">
            {item.type} | Grade {item.grade === 0 ? 'K' : item.grade}
          </p>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        {new Date(item.savedAt).toLocaleDateString()}
      </div>
    </button>
  );
}
```

### Task 7.2: Library Page (3 hours)

**Update:** `src/pages/Library.js`

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import { FolderOpen, Search, Filter, Trash2, Eye } from 'lucide-react';

export default function Library() {
  const navigate = useNavigate();
  const { libraryItems } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = filterGrade === 'all' || item.grade.toString() === filterGrade;
    const matchesSubject = filterSubject === 'all' || item.subject === filterSubject;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  const grades = ['all', ...new Set(libraryItems.map(i => i.grade.toString()))];
  const subjects = ['all', ...new Set(libraryItems.map(i => i.subject))];

  if (libraryItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <FolderOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your library is empty</h2>
          <p className="text-gray-500 mb-6">Materials you save will show up here</p>
          <Button onClick={() => navigate('/create')}>Create Your First Lesson</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Library</h1>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Grades</option>
              {grades.filter(g => g !== 'all').map(grade => (
                <option key={grade} value={grade}>Grade {grade === '0' ? 'K' : grade}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {subjects.filter(s => s !== 'all').map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredItems.length} of {libraryItems.length} materials
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="text-center mb-4">
              <span className="text-6xl">{item.thumbnail}</span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 truncate">{item.title}</h3>
            <div className="text-sm text-gray-600 mb-4">
              <div>{item.type}</div>
              <div>Grade {item.grade === 0 ? 'K' : item.grade} | {item.subject}</div>
              <div className="text-xs text-gray-500 mt-1">
                Saved {new Date(item.savedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setShowPreview(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Eye size={16} />
                View
              </button>
              <button
                onClick={() => alert('Delete functionality coming soon!')}
                className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && libraryItems.length > 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No materials match your filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterGrade('all');
              setFilterSubject('all');
            }}
            className="text-blue-600 hover:text-blue-700 mt-2"
          >
            Clear filters
          </button>
        </div>
      )}

      {showPreview && selectedItem && (
        <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title={selectedItem.title}>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Type: </span>
              <span className="font-medium">{selectedItem.type}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Grade: </span>
              <span className="font-medium">{selectedItem.grade === 0 ? 'K' : selectedItem.grade}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Subject: </span>
              <span className="font-medium">{selectedItem.subject}</span>
            </div>
            {selectedItem.content && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Content Preview:</h4>
                <p className="text-sm text-gray-700">
                  {selectedItem.content.learningObjective || 'No preview available'}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
```

### Task 7.3: Mock Library Data (1 hour)

**Create:** `src/utils/mockData.js`

```javascript
export const MOCK_LIBRARY_ITEMS = [
  {
    id: 'mock-1',
    title: 'Adding Two-Digit Numbers with Regrouping',
    type: 'Worksheet',
    grade: 2,
    subject: 'Math',
    thumbnail: '📊',
    savedAt: new Date(Date.now() - 86400000).toISOString(),
    content: {
      title: 'Adding Two-Digit Numbers with Regrouping',
      learningObjective: 'Students will add two 2-digit numbers with regrouping',
      questions: [
        { number: 1, question: '23 + 19 = ___', answer: '42' }
      ]
    }
  },
  {
    id: 'mock-2',
    title: 'Animal Habitats Quiz',
    type: 'Quiz',
    grade: 1,
    subject: 'Science',
    thumbnail: '🦁',
    savedAt: new Date(Date.now() - 172800000).toISOString(),
    content: {
      title: 'Animal Habitats Quiz',
      learningObjective: 'Students will identify different animal habitats',
      questions: [
        { number: 1, question: 'Where do fish live?', answer: 'Water' }
      ]
    }
  },
  {
    id: 'mock-3',
    title: 'Sight Words Practice - Set 1',
    type: 'Worksheet',
    grade: 0,
    subject: 'Reading',
    thumbnail: '📖',
    savedAt: new Date(Date.now() - 259200000).toISOString(),
    content: {
      title: 'Sight Words Practice',
      learningObjective: 'Students will recognize common sight words'
    }
  }
];

export const loadMockData = (addToLibrary) => {
  const existingData = localStorage.getItem('lesson_planner_library');
  
  if (!existingData || JSON.parse(existingData).length === 0) {
    MOCK_LIBRARY_ITEMS.forEach(item => {
      addToLibrary(item);
    });
    return true;
  }
  return false;
};
```

**Update:** `src/contexts/AppContext.js` - Add to useEffect:

```javascript
// After loading existing data
import('../utils/mockData').then(({ loadMockData }) => {
  loadMockData((item) => {
    setLibraryItems(prev => [...prev, item]);
  });
});
```

### Phase 7 Definition of Done

**Verify ALL before proceeding:**
- ✅ Dashboard page complete
- ✅ Library page complete
- ✅ Empty states display correctly
- ✅ Mock data loads
- ✅ Search and filters functional
- ✅ Preview modal works
- ✅ All navigation works
- ✅ Data persistence working
- ✅ No console errors

**Time:** 7.5 hours max

---

## Mock Content Strategy

### Yes, Dummy Content is Included!

The build sequence includes **comprehensive dummy content generation**:

✅ **Mock Library Items** - 3 pre-built example materials (Phase 7, Task 7.3)  
✅ **Template Emojis** - Category-based emoji selection (Phase 6, Task 6.2)  
✅ **Template Illustrations** - Simple emoji combinations for visual interest (Phase 6, Task 6.3)  
✅ **Mock Worksheet Layout** - Complete HTML/CSS template (Phase 6, Task 6.3)  
✅ **Mock Quiz Layout** - Alternative template for assessments (Phase 6, Task 6.4)  
✅ **Category Detection** - Keywords matched to visual themes (Phase 6, Task 6.2)  
✅ **Footer Messages** - Context-appropriate encouragement text (Phase 6, Task 6.3)

### What's NOT Generated (Intentionally Faked)

⚠️ **Stage 2 Visual Generation** - Uses pre-built templates instead of AI image generation  
⚠️ **Real Illustrations** - Uses emojis instead of SVG artwork (for MVP speed)  
⚠️ **Custom Graphics** - No actual drawing/image generation  
⚠️ **PDF Export** - Uses browser print instead of PDF library

### Why This Approach Works

The dummy content strategy allows you to:
- **Ship faster** - No need to integrate image generation APIs
- **Test user flows** - Complete journey from prompt to printable material
- **Validate concept** - Prove text generation value before investing in visuals
- **Iterate quickly** - Easy to modify templates vs. regenerating AI images
- **Reduce costs** - No image API charges during prototyping

---

## UI/UX Guidelines

### Design Principles
- **Educator-friendly:** Clear labels, minimal jargon, helpful tooltips
- **Scannable:** Visual hierarchy with headers, whitespace, grouping
- **Efficient:** Minimize clicks to common actions
- **Reassuring:** Show progress, confirm actions, explain limitations
- **Accessible:** WCAG AA contrast, keyboard navigation, clear focus states

### Color System

**Primary Colors:**
- Blue-600 (#2563EB) - CTAs, active states, primary actions
- Gray-700 (#374151) - Body text
- Gray-200 (#E5E7EB) - Borders, dividers

**Semantic Colors:**
- Green-600 (#16A34A) - Success states, approvals
- Yellow-500 (#EAB308) - Warnings, rate limits
- Red-600 (#DC2626) - Errors, validation failures

**Backgrounds:**
- White (#FFFFFF) - Cards, containers
- Gray-50 (#F9FAFB) - Page background
- Gray-100 (#F3F4F6) - Subtle differentiation

### Typography

**Fonts:**
- **Fredoka One** - Headers, titles (playful, bold)
- **Baloo 2** - Question numbers, emphasis (friendly, rounded)
- **Quicksand** - Body text, worksheets (clean, readable)

**Sizes:**
- K-1st grade: 20px base (larger for early readers)
- 2nd-3rd grade: 18px base
- 4th grade: 16px base
- Line height: 1.8 (generous spacing for young readers)

### Component Patterns

**Buttons:**
```jsx
// Primary action
<Button>Generate Draft</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// With icon
<Button icon={PlusCircle}>Create New</Button>

// Disabled state
<Button disabled>Generate Draft</Button>
```

**Modals:**
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
>
  {/* Content */}
</Modal>
```

**Empty States:**
```jsx
<div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
  <Icon size={64} className="mx-auto text-gray-400 mb-4" />
  <h3 className="text-xl font-semibold text-gray-700 mb-2">Empty State Title</h3>
  <p className="text-gray-500 mb-6">Helpful explanation</p>
  <Button onClick={handleAction}>Primary Action</Button>
</div>
```

**Loading States:**
```jsx
<LoadingSpinner message="Generating your draft... ☕" />
```

### Responsive Breakpoints

**Desktop (>1024px):**
- Side-by-side layouts
- 3-column grids
- Fixed sidebar navigation

**Tablet (768-1024px):**
- 2-column grids
- Stacked form sections
- Collapsible navigation

**Mobile (<768px):**
- Single column
- Full-width elements
- Bottom navigation bar (future)

---

## Brand Voice & Copy

### Core Voice Attributes

**1. Warm & Human**
- Write like a real person, not a robot
- Use contractions ("we'll" not "we will")
- Acknowledge emotions and dedication

**Examples:**
- ✅ "Coffee break! This'll take about 15 seconds"
- ✅ "No students harmed in the making of this worksheet"
- ❌ "Please await processing completion"

**2. Brief & Scannable**
- Every word earns its place
- Front-load important info
- Use fragments when clearer

**Examples:**
- ✅ "3 profiles selected (max reached!)"
- ✅ "Saved! Find it in your library."
- ❌ "Your file has been saved successfully and is now available in your library"

**3. Encouraging & Supportive**
- Celebrate effort AND outcomes
- Never guilt-trip or add pressure
- Position them as heroes

**Examples:**
- ✅ "You're making magic happen for your students"
- ✅ "You know your students best"
- ❌ "Warning: AI-generated content may contain errors"

**4. Playfully Transparent**
- Upfront about limitations
- Honest with personality
- "If you don't laugh, you'll cry" energy

**Examples:**
- ✅ "AI tried its best. You'll probably need to fix a few things"
- ✅ "Visual editor coming soon™️—here's a preview"
- ❌ "This feature is not yet available"

### UX Copy Library

**Loading Messages:**
- "Generating your draft... ☕ (~15 seconds)"
- "AI is thinking... This is the robot part. You're still the teaching genius!"
- "Brewing something good..."

**Success Messages:**
- "✓ Saved to library!"
- "Boom! Worksheet ready"
- "Nice work—profile created!"

**Error Messages:**
- "Oops—something went wrong. Try again?"
- "Can't reach the AI right now. Check your connection?"
- "That didn't work. Refresh the page?"

**Rate Limit:**
- "Hold on! You've used your 3 tries. Back in 8 minutes ⏰"
- "This helps us conserve tokens and keep costs low! 🎉"

**Empty States:**
- "No profiles yet! Create one to get started"
- "Your library is empty (for now!)"
- "Nothing here... yet. Let's fix that!"

**CRITICAL RULE:**
❌ **NEVER** joke about students - they're sacred
✅ Gentle humor about system challenges, timing, dedication
✅ Always position teacher/parent as hero and expert

---

## Testing & Validation

### Phase-Gate Testing

After each phase, verify:
- ✅ All acceptance criteria met
- ✅ No console errors
- ✅ localStorage persistence works
- ✅ Navigation functional
- ✅ Responsive design works
- ✅ Git commit made

### End-to-End User Journeys

**Journey 1: New User**
1. Visit dashboard → see empty states
2. Create first profile
3. Create first material
4. Approve draft
5. Save to library
6. View in library

**Journey 2: Returning User**
1. Dashboard shows recent materials
2. Quick access to profiles
3. Create new material with existing profile
4. Edit and regenerate
5. Save variations

**Journey 3: Power User**
1. Browse library
2. Search by keyword
3. Filter by grade/subject
4. Preview material
5. Re-open for editing (future)

### Critical Functionality Checklist

**Profile Management:**
- [ ] Create profile with all fields
- [ ] Edit existing profile
- [ ] Delete profile (with confirmation)
- [ ] Profile persists after refresh

**Material Generation:**
- [ ] Enter prompt
- [ ] Select profiles (0-3)
- [ ] Generate draft (LLM API call)
- [ ] Draft displays correctly
- [ ] Edit draft content
- [ ] Regenerate (with rate limit)
- [ ] Approve → navigate to visual

**Visual Templates:**
- [ ] Worksheet template renders
- [ ] Quiz template renders
- [ ] Content populates correctly
- [ ] Print preview works
- [ ] Save to library works

**Library:**
- [ ] All saved materials display
- [ ] Search functionality works
- [ ] Grade filter works
- [ ] Subject filter works
- [ ] Preview modal opens

**Data Persistence:**
- [ ] Profiles persist (localStorage)
- [ ] Library items persist
- [ ] Rate limit tracking persists
- [ ] Session maintains across refreshes

### Browser Compatibility

**Test in:**
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ Edge (should work, same engine as Chrome)
- ❌ IE11 (not supported)

### Performance Targets

- **Load time:** <3 seconds (first load)
- **LLM generation:** 10-20 seconds (acceptable for teachers)
- **Navigation:** Instant (<100ms perceived)
- **localStorage:** <5MB total usage

---

## Troubleshooting Guide

### Common Issues & Solutions

**Issue: App won't start**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

**Issue: Tailwind styles not applying**
```bash
# Check tailwind.config.js content paths
# Ensure: content: ["./src/**/*.{js,jsx,ts,tsx}"]
# Restart dev server after config changes
```

**Issue: API key not working**
```bash
# Verify .env.local exists in root directory
# Check variable name: REACT_APP_ANTHROPIC_API_KEY
# Restart dev server after adding .env.local
# Confirm .env.local is in .gitignore
```

**Issue: LLM returns invalid JSON**
```javascript
// Check parseLLMResponse function
// Add more aggressive cleaning:
let cleaned = rawText
  .replace(/```json\n?/g, '')
  .replace(/```\n?/g, '')
  .replace(/^[\s\n]+/, '')  // Remove leading whitespace
  .replace(/[\s\n]+$/, '')  // Remove trailing whitespace
  .trim();
```

**Issue: Rate limiting not working**
```javascript
// Check localStorage key matches
// Verify timestamps are ISO format
// Test in browser console:
localStorage.getItem('lesson_planner_rate_limit')
```

**Issue: localStorage full**
```javascript
// Clear old data
localStorage.clear();
// Or selectively clear:
localStorage.removeItem('lesson_planner_library');
```

**Issue: Print styles not applying**
```css
/* Ensure @media print in templates.css */
/* Test: Open print preview (Ctrl/Cmd+P) */
/* Check browser console for CSS errors */
```

**Issue: Modal won't close**
```javascript
// Check escape key listener
// Verify backdrop onClick handler
// Ensure onClose function passed correctly
```

### Debugging Tools

**React DevTools:**
```bash
# Install browser extension
# Inspect component tree
# Check props and state
```

**localStorage Inspector:**
```javascript
// In browser console:
console.log(localStorage);
console.log(JSON.parse(localStorage.getItem('lesson_planner_profiles')));
```

**Network Tab:**
```
# Check LLM API calls
# Verify request headers (API key present)
# Check response status codes
# Inspect response body
```

**Console Logging:**
```javascript
// Add strategic logs
console.log('Generating with prompt:', promptData);
console.log('LLM response:', result);
console.log('Parsed data:', parsedResult);
```

---

## Handoff & Next Steps

### What Works (MVP Features)

✅ **Core Functionality:**
- Student profile CRUD (create, read, update, delete)
- Prompt-based material generation with LLM
- Real-time draft review and editing
- Rate limiting (3 regenerations per 10 minutes)
- Mock visual templates (worksheet + quiz)
- Library with search and filters
- Dashboard with quick actions
- Data persistence via localStorage
- Print-friendly outputs

✅ **User Experience:**
- Intuitive navigation
- Clear empty states
- Loading states with friendly messages
- Error handling with recovery options
- Responsive design (desktop primary)
- Brand voice throughout

### What's Mocked (Temporary)

⚠️ **Stage 2 Visual Generation:**
- Using pre-built HTML/CSS templates
- Emojis instead of real illustrations
- No actual AI image generation

⚠️ **Export Features:**
- PDF export uses browser print
- No custom PDF generation library

⚠️ **Library Management:**
- Delete button present but non-functional
- No edit/re-open from library

### Known Limitations

**Technical:**
- Client-side API key (NOT production-secure)
- localStorage capacity (~5-10MB browser limit)
- No backend/database
- No user authentication
- Rate limiting per browser (not per user)
- Single-device only (no sync)

**Feature:**
- Max 3 profiles per generation
- English only (Spanish planned, not implemented)
- No collaborative features
- No sharing capabilities
- No analytics/tracking

### Production Roadmap

**Phase 1: Infrastructure (Months 1-3)**
```
Priority: High
- Backend API (Node.js + Express)
- Database (PostgreSQL or Supabase)
- User authentication (Auth0 or Clerk)
- API key proxy (secure LLM calls)
- Redis for rate limiting (distributed)
- S3 for file storage
```

**Phase 2: Real Visual Generation (Months 3-4)**
```
Priority: High
- Integrate DALL-E or Midjourney API
- Build template customization engine
- PDF generation library (PDFKit)
- Asset library management
- Template marketplace foundation
```

**Phase 3: Bilingual Support (Months 4-5)**
```
Priority: High (competitive advantage)
- Spanish content generation
- Culturally sustaining pedagogy
- Translanguaging strategies
- Bilingual family materials
- Translation management system
```

**Phase 4: Scale Features (Months 5-8)**
```
Priority: Medium
- District admin dashboards
- Team collaboration (shared profiles)
- Standards database (Common Core, NGSS, state)
- Curriculum alignment tools
- Usage analytics
- A/B testing framework
```

**Phase 5: Advanced Features (Months 8-12)**
```
Priority: Low
- Student-facing components (practice mode)
- Parent communication portal
- Professional development modules
- Assessment analytics
- Integration marketplace (Google Classroom, Canvas)
- Mobile apps (iOS, Android)
```

### Investment Requirements

**Year 1 Budget Estimate:**
- Development team: $300-500K (2-3 engineers)
- Infrastructure: $50-100K (AWS, APIs, services)
- Design: $50-80K (UI/UX specialist)
- Legal/compliance: $20-40K (privacy, COPPA)
- Marketing: $100-200K (teacher acquisition)
- **Total: $520K-920K**

**Revenue Targets:**
- Year 1: 10,000 teachers @ $96/year = $960K
- Year 2: 50,000 teachers @ $96/year = $4.8M
- Year 3: 200,000 teachers (15% penetration) = $19.2M

### Success Metrics

**Product Metrics:**
- Draft readiness rating: >70% (vs. market's 40%)
- Time to create material: <5 minutes
- Regeneration rate: <30%
- Library save rate: >80%

**Business Metrics:**
- Free-to-paid conversion: 5-10%
- Monthly Active Users (MAU): Track growth
- Customer Acquisition Cost (CAC): <$50
- Lifetime Value (LTV): >$150 (3:1 LTV:CAC)
- Churn: <5% monthly

**User Experience:**
- Task completion rate: >90%
- Error rate: <5%
- Support tickets per user: <0.1
- NPS (Net Promoter Score): >50

---

## Quick Reference

### Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests (when added)
npm test

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables

```bash
# Required in .env.local
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here

# Optional for development
REACT_APP_ENV=development
```

### Key File Locations

```
Critical Files:
├── src/contexts/AppContext.js       # Global state
├── src/utils/llm.js                 # LLM integration
├── src/utils/rateLimit.js           # Rate limiting
├── src/pages/CreateMaterial.js      # Generation flow
├── src/pages/DraftReview.js         # Review/edit
├── src/components/templates/        # Visual templates
└── .env.local                       # API keys (never commit!)
```

### localStorage Keys

```javascript
'lesson_planner_profiles'    // StudentProfile[]
'lesson_planner_library'     // LibraryItem[]
'lesson_planner_rate_limit'  // RateLimit object
'lesson_planner_session'     // Session ID string
```

### API Endpoints

```
Anthropic Claude API:
POST https://api.anthropic.com/v1/messages

Headers:
- Content-Type: application/json
- x-api-key: YOUR_API_KEY
- anthropic-version: 2023-06-01

Body:
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 2000,
  "messages": [{"role": "user", "content": "..."}]
}
```

---

## Final Checklist

### Before Shipping Prototype

**Code Quality:**
- [ ] No console.error messages
- [ ] No hardcoded API keys in code
- [ ] .env.local in .gitignore
- [ ] All components have proper PropTypes (optional)
- [ ] Commented complex logic

**Functionality:**
- [ ] All 7 phases complete
- [ ] Can create profile end-to-end
- [ ] Can generate material end-to-end
- [ ] Can edit draft
- [ ] Can save to library
- [ ] Print preview works
- [ ] Rate limiting enforced
- [ ] Data persists across sessions

**User Experience:**
- [ ] No broken links
- [ ] All buttons functional or disabled
- [ ] Loading states display
- [ ] Error messages helpful
- [ ] Empty states clear
- [ ] Responsive on tablet minimum

**Documentation:**
- [ ] README.md updated
- [ ] Setup instructions clear
- [ ] Known issues documented
- [ ] Demo flow prepared

### Demo Script

**3-Minute Demo Flow:**

1. **Dashboard (30 sec)**
   - "This is AI Lesson Planner for K-4 teachers"
   - Show empty state or existing materials
   - "Let's create a new lesson"

2. **Create Profile (30 sec)**
   - "First, we'll create a student profile"
   - Quick profile creation
   - "This lets teachers differentiate automatically"

3. **Generate Material (60 sec)**
   - "Now let's create a worksheet"
   - Enter prompt: "Addition with regrouping for 2nd graders who love animals"
   - Select profile
   - Click Generate
   - Show loading state
   - "Real AI generates this in 15 seconds"

4. **Review & Edit (45 sec)**
   - "Teacher reviews the draft"
   - Quick inline edit
   - "They're always in control"
   - Approve draft

5. **Visual Output (15 sec)**
   - "Here's the printable worksheet"
   - Show print preview
   - "Save to library"

**Key Points to Emphasize:**
- ✅ Real AI generation (not fake)
- ✅ Teacher validation (not autopilot)
- ✅ K-4 specific design
- ✅ 5 minutes total (huge time savings)
- ✅ Differentiation built-in

---

## Document Summary

### What This Document Includes

**1. Complete Build Sequence** (7 Phases, 65-75 hours)
- Phase-by-phase tasks with time estimates
- Copy-paste ready code examples
- Acceptance criteria for each phase
- Definition of Done gates
- Rollback procedures

**2. Mock Content Strategy**
- Dummy library items
- Template selection logic
- Emoji-based illustrations
- Category detection
- Mock visual templates

**3. Technical Architecture**
- Tech stack decisions
- Component hierarchy
- Data models
- API integration patterns
- State management approach

**4. UI/UX Guidelines**
- Design principles
- Color system
- Typography rules
- Component patterns
- Responsive breakpoints

**5. Brand Voice & Copy**
- Voice attributes
- UX copy library
- Loading messages
- Error messages
- Empty states

**6. Testing & Validation**
- Phase-gate testing
- User journey tests
- Critical functionality checklist
- Browser compatibility
- Performance targets

**7. Troubleshooting**
- Common issues & solutions
- Debugging tools
- Console logging strategies
- Network inspection tips

**8. Handoff Documentation**
- What works (MVP features)
- What's mocked (temporary)
- Known limitations
- Production roadmap
- Investment requirements
- Success metrics

### How to Use This Document

**For Development:**
1. Follow phases sequentially (1→7)
2. Complete all tasks within each phase
3. Verify Definition of Done before proceeding
4. Use rollback procedures if blocked
5. Reference troubleshooting when stuck

**For Planning:**
- Time estimates help scope work
- Dependencies show critical path
- Known limitations set expectations
- Production roadmap shows next steps

**For Stakeholders:**
- Executive summary explains value
- Success metrics show targets
- Investment requirements set budget
- Demo script enables presentations

---

## Final Notes

### This Is a Prototype, Not Production

Remember:
- ✅ Proves concept and generates real value
- ✅ Perfect for user testing and feedback
- ✅ Validates market need
- ⚠️ NOT secure enough for real user data
- ⚠️ NOT scalable to thousands of users
- ⚠️ Requires backend for production

### What Success Looks Like

**After 13 days of building, you should have:**
- Working app that teachers can use
- Real LLM integration generating drafts
- Differentiation through profiles
- Professional-looking worksheets
- Library to save/browse materials
- Printable outputs ready for classroom

**You can demonstrate:**
- Complete user flow (5 minutes)
- Time savings vs. manual creation
- Draft quality (better than market 40%)
- K-4 specific design
- Teacher validation workflow

**You're ready to:**
- Show to potential investors
- User test with real teachers
- Iterate on feedback
- Build production version
- Raise funding with proof

---

## Success! 🎉

You now have complete documentation to rapidly prototype the AI Lesson Planner. Every technical detail, design decision, and implementation step is covered. Hand this to Claude Code and say:

**"Build this prototype following the Master Build Sequence exactly as written. Start with Phase 1, Task 1.1."**

Good luck! You're building something teachers actually need. 

---

**Document Version:** 1.0  
**Total Pages:** ~100 (markdown)  
**Build Time:** 13-15 days (65-75 hours)  
**Last Updated:** October 2025  
**Status:** ✅ Complete and Ready for Development