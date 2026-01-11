# BJJ Progress Tracker

## Complete Feature List & User Stories

**Version 1.0 — December 2024**

---

## Product Overview

BJJ Progress Tracker is a digital training journal that connects Brazilian Jiu Jitsu practitioners with their coaches and gym owners. The application provides transparency into belt promotion requirements, structured feedback mechanisms, and AI-assisted note-taking to help practitioners advance more efficiently in their martial arts journey.

### User Types

- **Practitioners:** BJJ students tracking their training, progress, and belt advancement
- **Coaches/Instructors:** Teaching staff who provide feedback and manage student progression
- **Gym Owners:** Academy administrators overseeing operations, retention, and curriculum

---

## 1. User Management & Profiles

Core identity and access management for all user types with role-based permissions and gym affiliations.

### Features

- Account creation with role selection (practitioner, coach, owner)
- Practitioner profile: current belt/stripes, training start date, home gym, goals, weight class
- Coach profile: credentials, belt rank, lineage, gyms they teach at
- Gym affiliation and verification (coaches approve practitioners joining their gym)
- Multi-gym support for practitioners training at multiple locations
- Profile privacy settings

### User Stories

1. As a practitioner, I want to create an account and select my current belt level, so that my progress tracking starts from the correct baseline.
2. As a coach, I want to approve practitioners who request to join my gym, so that I only see students who actually train with me.
3. As a practitioner who trains at two gyms, I want to affiliate with both locations, so that coaches from each gym can provide feedback.
4. As a coach, I want to display my lineage and credentials, so that students can verify my qualifications.
5. As a practitioner, I want to control which parts of my profile are visible, so that I can maintain privacy while still receiving coaching.

---

## 2. Curriculum & Technique Library

Comprehensive technique database organized by position and belt level, with gym-customizable curriculum mapping.

### Features

- Hierarchical technique taxonomy (positions → categories → techniques → variations)
- Belt-level tagging for each technique
- Technique detail pages (name, description, key points, common mistakes)
- Video placeholder slots for demonstrations
- Related techniques and chains/flows
- Coach ability to create custom curriculum for their gym
- IBJJF or standard curriculum as default template
- Technique search and filtering by position, belt, or keyword

### User Stories

6. As a practitioner, I want to browse techniques by position (guard, mount, back, etc.), so that I can study what I'm working on in class.
7. As a practitioner, I want to see which techniques are required for my next belt, so that I know what to focus on.
8. As a coach, I want to customize which techniques are required for each belt at my gym, so that the curriculum reflects my teaching philosophy.
9. As a practitioner, I want to see related techniques and combinations, so that I can develop my game strategically.
10. As a gym owner, I want to start with an IBJJF-based template, so that I don't have to build the curriculum from scratch.

---

## 3. Training Journal

Personal training log for documenting sessions, techniques drilled, sparring outcomes, and private notes.

### Features

- Class attendance logging (manual or future integration)
- Training session entries: date, duration, type (gi/no-gi/open mat)
- Techniques drilled with self-rating (learning/developing/proficient)
- Sparring/rolling log: partners, outcomes, notes
- Personal notes and observations
- Injury tracking
- Private vs. coach-visible entry toggle

### User Stories

11. As a practitioner, I want to log each training session with date and duration, so that I can track my consistency.
12. As a practitioner, I want to record which techniques I drilled, so that I can remember what I learned.
13. As a practitioner, I want to rate my proficiency on techniques, so that I can identify what needs more work.
14. As a practitioner, I want to log my sparring rounds with outcomes, so that I can track my performance over time.
15. As a practitioner, I want to mark certain notes as private, so that only I can see personal reflections.
16. As a practitioner, I want to track injuries, so that I can monitor recovery and avoid re-injury.

---

## 4. Progress & Belt Tracking

Visual representation of advancement toward belt promotions with requirement checklists and mastery indicators.

### Features

- Visual belt/stripe progression timeline
- Requirements checklist per belt level (based on gym curriculum)
- Percentage completion toward next rank
- Time-at-belt tracking
- Technique mastery heat map (positions strong vs. weak)
- Coach endorsement on specific techniques
- Milestone celebrations and badges

### User Stories

17. As a practitioner, I want to see a visual timeline of my belt progression, so that I can appreciate how far I've come.
18. As a practitioner, I want to see what percentage of requirements I've completed for my next belt, so that I know how close I am.
19. As a practitioner, I want to see a heat map of my technique mastery, so that I can identify weak positions.
20. As a coach, I want to endorse specific techniques that a student has demonstrated proficiency in, so that their progress is validated.
21. As a practitioner, I want to earn badges for milestones, so that I feel motivated by smaller achievements.

---

## 5. Coach Feedback System

Structured feedback mechanism for coaches to communicate with students about strengths, weaknesses, and focus areas.

### Features

- Coach can send feedback tied to specific techniques or sessions
- Feedback categories: strength, needs work, drill recommendation
- Private messaging between coach and practitioner
- Periodic review summaries coaches can generate
- Focus areas that coach assigns (visible on practitioner dashboard)
- Acknowledgment/read receipts

### User Stories

22. As a coach, I want to send feedback about a specific technique, so that the student knows exactly what to work on.
23. As a coach, I want to categorize feedback as strength or needs work, so that students get balanced input.
24. As a practitioner, I want to receive feedback directly in my journal, so that it's connected to my training log.
25. As a coach, I want to assign focus areas that appear on the student's dashboard, so that they know their priorities.
26. As a coach, I want to know when a student has read my feedback, so that I can follow up if needed.

---

## 6. Goal Setting

Personal goal management for practitioners with visibility for coaches and progress tracking.

### Features

- Practitioner-defined goals (short-term and long-term)
- Goal types: technique mastery, competition, attendance, belt promotion
- Progress tracking against goals
- Coach visibility into student goals
- Goal suggestions based on curriculum gaps

### User Stories

27. As a practitioner, I want to set goals for specific techniques, so that I have clear targets to work toward.
28. As a practitioner, I want to set an attendance goal, so that I stay consistent with my training.
29. As a coach, I want to see my students' goals, so that I can help them achieve their objectives.
30. As a practitioner, I want the system to suggest goals based on gaps in my technique coverage, so that I focus on what matters.
31. As a practitioner, I want to track my progress toward goals visually, so that I stay motivated.

---

## 7. Competition Tracking

Complete competition history management with match records, preparation tools, and post-competition reflection.

### Features

- Competition history log
- Match records: opponent, weight class, result, submission/points
- Bracket/placement tracking
- Video link slots for match footage
- Pre-competition preparation checklists
- Competition goals and post-comp reflection prompts

### User Stories

32. As a practitioner, I want to log all my competition matches, so that I have a complete record of my competitive history.
33. As a practitioner, I want to record how I won or lost each match, so that I can analyze my performance.
34. As a practitioner, I want to link videos of my matches, so that I can review them later.
35. As a coach, I want to see my students' competition records, so that I can help them prepare for future events.
36. As a practitioner, I want reflection prompts after competitions, so that I capture lessons learned.

---

## 8. Analytics & Insights

Data-driven insights into training patterns, technique coverage, and performance trends.

### Features

- Training frequency trends
- Technique coverage analysis
- Sparring performance patterns
- Time between promotions benchmarking
- Attendance streaks
- Weakness identification (positions/techniques with low ratings)

### User Stories

37. As a practitioner, I want to see my training frequency over time, so that I can identify periods of inconsistency.
38. As a practitioner, I want to see which techniques I've drilled most often, so that I can diversify my training.
39. As a practitioner, I want to see patterns in my sparring results, so that I can understand my game better.
40. As a practitioner, I want to see how my promotion timeline compares to averages, so that I have realistic expectations.
41. As a coach, I want to see aggregate analytics for my students, so that I can improve my teaching.

---

## 9. Gym Owner / Academy Dashboard

Administrative tools for gym owners to manage rosters, track retention, and oversee curriculum across coaches.

### Features

- Roster management
- Aggregate student progress views
- Promotion pipeline (who's close to next belt)
- Retention metrics
- Class attendance patterns
- Coach performance/activity tracking
- Curriculum management across multiple coaches

### User Stories

42. As a gym owner, I want to see all students organized by belt level, so that I can manage my roster effectively.
43. As a gym owner, I want to see which students are close to promotion, so that I can plan belt ceremonies.
44. As a gym owner, I want to see retention metrics, so that I can identify and address student drop-off.
45. As a gym owner, I want to see which classes have the best attendance, so that I can optimize scheduling.
46. As a gym owner, I want to ensure all coaches are using a consistent curriculum, so that students get a unified experience.

---

## 10. Notifications & Reminders

Proactive communication system to keep users engaged and informed about relevant updates.

### Features

- New coach feedback alerts
- Training streak reminders
- Goal deadline approaching notifications
- Promotion eligibility notification
- Teammate achievements (optional social notifications)

### User Stories

47. As a practitioner, I want to be notified when my coach sends feedback, so that I don't miss important input.
48. As a practitioner, I want reminders when I'm about to break a training streak, so that I stay consistent.
49. As a practitioner, I want to know when I've met promotion requirements, so that I can follow up with my coach.
50. As a coach, I want to be notified when students complete significant milestones, so that I can acknowledge them.
51. As a practitioner, I want to optionally see when teammates achieve goals, so that I feel part of a community.

---

## 11. Social / Community Features

Optional social layer to foster community, encourage teammates, and create healthy motivation.

### Features

- Training partner connections
- Teammate progress visibility (opt-in)
- Gym leaderboards (attendance, rolls, etc.)
- Kudos/props system for teammates
- Shared technique notes between training partners

### User Stories

52. As a practitioner, I want to connect with my regular training partners, so that I can coordinate rolls.
53. As a practitioner, I want to opt-in to showing my progress, so that my teammates can see my journey.
54. As a practitioner, I want to see gym leaderboards for attendance, so that I'm motivated by healthy competition.
55. As a practitioner, I want to give props to teammates who hit milestones, so that I can encourage them.
56. As a practitioner, I want to share technique notes with my regular training partner, so that we can learn together.

---

## 12. Coach Feedback Input (Voice/AI-Assisted)

AI-powered input system that allows coaches to provide feedback via voice, with automatic transcription, technique extraction, and formatting.

### Features

- Voice-to-text recording for coaches
- LLM processing that cleans up transcription for clarity
- Automatic extraction and tagging of mentioned techniques
- Suggested categorization (strength, needs work, drill focus)
- Formatting into structured feedback before sending
- Coach review/edit of AI-processed feedback before delivery
- Quick feedback templates triggered by voice
- Batch feedback after class (rapid-fire notes on multiple students)
- Searchable feedback history

### User Stories

57. As a coach, I want to record voice feedback on my phone after class, so that I don't have to type while I'm tired.
58. As a coach, I want my spoken feedback automatically transcribed and cleaned up, so that it reads professionally.
59. As a coach, I want techniques I mention to be automatically tagged, so that feedback is linked to the curriculum.
60. As a coach, I want to review AI-processed feedback before it goes to students, so that I maintain control.
61. As a coach, I want to give quick feedback to multiple students in a batch, so that I can efficiently capture thoughts after class.
62. As a coach, I want to search past feedback I've given, so that I can maintain consistency and track themes.

---

## 13. Student Class Notes (Natural Language → Structured Progress)

AI-powered note-taking that allows students to write naturally, with automatic extraction and population of structured training data.

### Features

- Free-form note-taking during or after class
- LLM parsing to extract techniques drilled (auto-tags to curriculum)
- Extraction of sparring outcomes (submissions given/received, sweeps, passes)
- Recognition of training partners mentioned
- Identification of self-identified struggles or breakthroughs
- Detection of duration and intensity signals
- Automatic population of technique log, sparring record, and progress tracking
- Student review and correction of parsed data
- Preservation of raw notes alongside structured data
- Prompt suggestions if notes are sparse

### User Stories

63. As a practitioner, I want to write notes in my own words after class, so that I don't have to use structured forms.
64. As a practitioner, I want the system to extract techniques from my notes, so that they're automatically logged.
65. As a practitioner, when I write 'I tapped a white belt with an armbar,' I want that logged as a submission success, so that my sparring record updates automatically.
66. As a practitioner, I want to review what the system extracted from my notes, so that I can correct any mistakes.
67. As a practitioner, I want my raw notes preserved, so that I can read my own words later.
68. As a practitioner, I want prompts when my notes are brief, so that I capture more useful information.
69. As a practitioner, I want extracted data to feed into my progress tracking, so that my journal does the bookkeeping for me.

---

## Appendix: Development Scope

### Fully Buildable via Claude Code

- Complete web application (React/Next.js frontend, Node/Python backend)
- Database schema and all data relationships
- User authentication and role-based permissions
- All CRUD operations for journals, feedback, techniques, progress
- Dashboard UIs for all user types
- Curriculum builder tools
- Progress visualization components
- LLM integration for voice/text processing
- Notification system architecture
- API layer for future mobile applications

### Requires Manual Creation (FPO in Development)

- Technique library content (BJJ subject matter expert required)
- Video content for technique demonstrations
- Photography and brand assets
- Default curriculum templates from BJJ experts
- Legal documents (terms of service, privacy policy)
- Payment integration credentials and testing
