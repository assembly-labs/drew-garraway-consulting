# Scout - Product Roadmap

**Last Updated:** 2025-12-11
**Status:** Planning Phase 2 Enhancements

---

## Overview

This roadmap outlines planned enhancements for Scout, your AI library assistant, following successful initial deployment. Features are organized by implementation effort and expected impact.

## Implementation Phases

### Phase 1: Prototype ✅ (Completed)
- Natural language search with Claude AI
- Multi-turn conversations
- Mobile responsive design
- Basic accessibility features
- Mock catalog with 69 books

### Phase 2: UX Enhancements (Current Focus)
Organized by effort and impact below.

---

## Quick Wins (1-2 hours each)

### Visual Feedback Enhancements
- [x] **Typing indicators** - Show "Scout is thinking..." with animated dots during processing
- [ ] **Smooth message animations** - Add fade-in/slide-up effects for new messages
- [ ] **Book-themed loading animation** - Replace generic spinner with flipping pages animation
- [ ] **Success feedback** - Add subtle checkmarks/animations when books are found

### Book Card Improvements
- [ ] **Quick preview tooltips** - Show book description on desktop hover
- [ ] **Color-coded availability badges** - Visual indicators (green=available, yellow=waitlist, red=unavailable)
- [ ] **Format icons** - Replace text with intuitive icons (🎧 audiobook, 📱 ebook, 📖 paperback)
- [ ] **Skeleton loading** - Show placeholder cards while results load

### Search Experience Polish
- [ ] **Smart suggestions** - Rotating example queries ("Try: Books like Harry Potter")
- [ ] **Voice input button** - Add microphone icon for speech-to-text (Web Speech API)
- [ ] **Clear input button** - Add × button to quickly clear search field
- [ ] **Character counter** - Show remaining characters for long queries

---

## Core Enhancements (3-5 hours each)

### Conversation Memory & Context
- [ ] **Visual conversation threads** - Group related messages with connecting lines
- [ ] **Edit previous queries** - Click to edit and refine past messages
- [ ] **Save conversation history** - Download conversation as PDF/text
- [ ] **Smart context trimming** - Show warning before context limit, offer fresh thread

### Advanced Book Discovery
- [ ] **Filter panel** - Collapsible filters (format, availability, genre, year)
- [ ] **Similar books** - "Find similar" button on each book card
- [ ] **Reading lists** - Create temporary lists during session ("My Beach Reads")
- [ ] **Comparison view** - Select 2-3 books to compare side-by-side

### Personalization (Session-Based)
- [ ] **Reading preferences** - Quick onboarding (Mystery ☑ Romance ☐ Sci-Fi ☑)
- [ ] **Age-appropriate toggle** - Kid/Teen/Adult mode switcher
- [ ] **Reading speed indicator** - Estimate reading time based on page count
- [ ] **Mood-based search** - Visual mood selector (🏖️ Beach, ✈️ Travel, 🛋️ Cozy)

---

## Wild Card Feature 🎯

### Librarian Personality Modes
Transform the AI assistant into different librarian personalities that users can choose:

#### Personalities
1. **Classic Librarian** 📚
   - Formal, knowledgeable responses
   - Citations and literary references
   - "Based on your interest in Victorian literature..."

2. **Cool Bookstore Employee** 😎
   - Casual, enthusiastic recommendations
   - Pop culture references
   - "Oh, you're gonna LOVE this one!"

3. **Grandma's Book Club** 👵
   - Warm, nurturing suggestions
   - Personal anecdotes
   - "This reminds me of a book our club read..."

4. **Literary Professor** 🎓
   - Deep analysis and themes
   - Academic perspective
   - "The intertextuality between these works..."

#### Implementation Details
- [ ] Personality selector in header (icon buttons)
- [ ] Adjust Claude's system prompt based on selection
- [ ] Persist choice in session storage
- [ ] Different color themes per personality
- [ ] Custom response patterns per mode

---

## Technical Implementation Notes

### New Components Required
- `FilterPanel.tsx` - Collapsible filter sidebar
- `PersonalitySelector.tsx` - Personality mode switcher
- `VoiceInput.tsx` - Speech recognition component
- `BookComparison.tsx` - Side-by-side comparison view

### New Hooks Required
- `useVoiceInput.ts` - Web Speech API integration
- `usePersonality.ts` - Personality state management
- `useFilters.ts` - Filter state and logic

### New Utilities Required
- `personalities.ts` - Personality-specific prompts
- `animations.ts` - Framer Motion configurations
- `downloadConversation.ts` - PDF/text export logic

### Dependencies to Add
- Framer Motion - Smooth animations
- React Query - Better caching
- Floating UI - Advanced tooltips
- jsPDF - PDF generation

---

## Expected Impact

### User Engagement Metrics
- **Session duration**: +40% with personality modes
- **Messages per session**: +25% with better visual feedback
- **Return visits**: +30% with saved conversations

### Accessibility Improvements
- Voice input helps users with disabilities
- Better keyboard navigation
- Improved screen reader support

### Performance Perception
- 50% faster perceived response with optimistic UI
- Reduced cognitive load with visual threading
- Better error recovery with smart retries

### Pilot Library Interest
- Personality modes create memorable demos
- Accessibility features show commitment to all users
- Advanced features demonstrate growth potential

---

## Priority Recommendations

### Start With (Week 1)
1. Typing indicators & animations - Immediate performance perception boost
2. Voice input - Accessibility win + wow factor
3. Format icons & availability badges - Visual clarity

### Follow With (Week 2)
1. Personality modes - Unique differentiator
2. Filter panel - Power user feature
3. Conversation threading - Better UX for long sessions

### Nice to Have (Week 3+)
1. Comparison view - Advanced feature
2. Reading lists - Session persistence
3. Mood-based search - Fun discovery method

---

## Success Metrics

### Quantitative
- Time to first meaningful result < 3 seconds
- Successful query rate > 85%
- User satisfaction score > 4.5/5

### Qualitative
- "This feels magical" - User feedback
- "I want this in my library" - Librarian feedback
- "The personalities are delightful" - Stakeholder feedback

---

## Notes

- All features maintain frontend-only implementation
- No backend changes required for Phase 2
- Focus on visual delight and accessibility
- Preserve existing architecture and deployment

---

**Next Update:** After pilot library feedback session