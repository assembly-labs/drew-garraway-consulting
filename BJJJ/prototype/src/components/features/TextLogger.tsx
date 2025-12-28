/**
 * TextLogger Component
 * Type-to-log alternative for when voice isn't ideal
 *
 * Design Philosophy: "Quick Dump"
 * - Single text field for natural language input
 * - Smart parsing extracts structured data in real-time
 * - Confirmation chips show what was understood
 * - Minimal friction for exhausted post-training users
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useUserProfile } from '../../context/UserProfileContext';
import { useBeltPersonalization } from '../../hooks/useBeltPersonalization';
import type { SubmissionInsert } from '../../types/database';

// Types for extracted session data (matches VoiceLogger)
interface SparringResult {
  type: 'submission_given' | 'submission_received';
  technique: string;
}

interface SessionData {
  date: string;
  time: string;
  dayOfWeek: string;
  trainingType: 'gi' | 'nogi' | 'open-mat' | 'drilling' | 'private' | null;
  durationMinutes: number | null;
  sparringRounds: number | null;
  techniques: string[];
  sparringResults: SparringResult[];
  workedWell: string[];
  struggles: string[];
  rawText: string;
}

interface ParsedChip {
  id: string;
  type: 'trainingType' | 'duration' | 'rounds' | 'technique' | 'positive' | 'negative' | 'submission_given' | 'submission_received';
  label: string;
  value: string | number;
  confirmed: boolean;
}

// Common BJJ techniques for matching
const TECHNIQUE_KEYWORDS = [
  // Guards
  'closed guard', 'open guard', 'half guard', 'butterfly guard', 'spider guard',
  'lasso guard', 'de la riva', 'dlr', 'reverse de la riva', 'rdlr', 'x-guard',
  'single leg x', 'slx', 'z-guard', '50/50', 'rubber guard', 'worm guard',
  // Passes
  'knee slice', 'knee cut', 'torreando', 'leg drag', 'stack pass', 'over under',
  'long step', 'smash pass', 'bodylock pass', 'pressure pass', 'float pass',
  // Submissions
  'armbar', 'arm bar', 'triangle', 'kimura', 'americana', 'omoplata',
  'guillotine', 'rear naked', 'rnc', 'darce', 'd\'arce', 'anaconda',
  'arm triangle', 'ezekiel', 'loop choke', 'baseball bat', 'bow and arrow',
  'cross collar', 'collar choke', 'heel hook', 'knee bar', 'toe hold',
  'ankle lock', 'straight ankle', 'calf slicer', 'wrist lock',
  // Sweeps
  'scissor sweep', 'hip bump', 'flower sweep', 'pendulum sweep', 'elevator sweep',
  'tripod sweep', 'sickle sweep', 'overhead sweep', 'balloon sweep',
  // Takedowns
  'single leg', 'double leg', 'ankle pick', 'arm drag', 'snap down',
  'foot sweep', 'hip throw', 'seoi nage', 'uchi mata',
  // Positions
  'mount', 'back mount', 'side control', 'north south', 'knee on belly',
  'turtle', 'crucifix', 'back control', 'rear mount',
  // Escapes
  'bridge', 'shrimp', 'hip escape', 'elbow escape', 'trap and roll',
];

// Positive sentiment keywords
const POSITIVE_KEYWORDS = [
  'good', 'great', 'solid', 'smooth', 'nice', 'clean', 'sharp', 'tight',
  'finally got', 'hit', 'landed', 'caught', 'finished', 'working', 'clicked',
  'felt good', 'felt great', 'on point', 'dialed in', 'flowing',
];

// Negative/struggle sentiment keywords
const NEGATIVE_KEYWORDS = [
  'struggled', 'trouble', 'couldn\'t', 'lost', 'got caught', 'got swept',
  'got passed', 'got submitted', 'need to work', 'weak', 'sloppy', 'tired',
  'gassed', 'need work', 'couldn\'t finish', 'kept losing', 'getting stuck',
];

// Submission techniques for matching
const SUBMISSION_TECHNIQUES = [
  'armbar', 'arm bar', 'triangle', 'kimura', 'americana', 'omoplata',
  'guillotine', 'rear naked', 'rnc', 'darce', 'd\'arce', 'anaconda',
  'arm triangle', 'ezekiel', 'loop choke', 'baseball bat', 'bow and arrow',
  'cross collar', 'collar choke', 'heel hook', 'knee bar', 'kneebar', 'toe hold',
  'ankle lock', 'straight ankle', 'calf slicer', 'wrist lock',
];

// Patterns for detecting submissions given
const SUBMISSION_GIVEN_PATTERNS = [
  /(?:got|caught|tapped|submitted|finished)\s+(?:him|her|them|someone|a?\s*\w+\s*belt)?\s*(?:with|using|via)?\s*(?:an?\s+)?(\w+(?:\s+\w+)?)/i,
  /hit\s+(?:an?\s+)?(\w+(?:\s+\w+)?)/i,
  /landed\s+(?:an?\s+)?(\w+(?:\s+\w+)?)/i,
  /(\w+(?:\s+\w+)?)\s+(?:tap|submission|finish)/i,
];

// Patterns for detecting submissions received
const SUBMISSION_RECEIVED_PATTERNS = [
  /(?:got|was)\s+(?:caught|tapped|submitted|finished)\s+(?:by|with|in|to)?\s*(?:an?\s+)?(\w+(?:\s+\w+)?)/i,
  /(?:tapped|submitted)\s+to\s+(?:an?\s+)?(\w+(?:\s+\w+)?)/i,
  /(?:caught|got)\s+(?:me|in)\s+(?:an?\s+)?(\w+(?:\s+\w+)?)/i,
];

// Training type patterns
const TRAINING_TYPE_PATTERNS: { pattern: RegExp; type: SessionData['trainingType'] }[] = [
  { pattern: /\bno[- ]?gi\b/i, type: 'nogi' },
  { pattern: /\bnogi\b/i, type: 'nogi' },
  { pattern: /\bgi\b(?!\s*class)/i, type: 'gi' },
  { pattern: /\bgi\s+class\b/i, type: 'gi' },
  { pattern: /\bopen\s*mat\b/i, type: 'open-mat' },
  { pattern: /\bdrill(ing|ed)?\b/i, type: 'drilling' },
  { pattern: /\bprivate\b/i, type: 'private' },
];

// Duration patterns
const DURATION_PATTERNS = [
  { pattern: /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i, multiplier: 60 },
  { pattern: /(\d+)\s*(?:minutes?|mins?|min)/i, multiplier: 1 },
  { pattern: /(\d{2,3})\s*(?:min)?/i, multiplier: 1 }, // Just numbers like "90" or "60"
];

// Round patterns
const ROUND_PATTERNS = [
  /(\d+)\s*(?:rounds?|rolls?)/i,
  /rolled\s*(\d+)/i,
  /(\d+)\s*(?:times?|matches?|sparring)/i,
];

/**
 * Check if a technique name matches any known submission technique
 */
function isSubmissionTechnique(technique: string): boolean {
  const lower = technique.toLowerCase();
  return SUBMISSION_TECHNIQUES.some(sub => lower.includes(sub));
}

/**
 * Parse raw text into structured session data
 */
function parseSessionText(text: string): { data: Partial<SessionData>; chips: ParsedChip[] } {
  const chips: ParsedChip[] = [];
  const data: Partial<SessionData> = {
    techniques: [],
    sparringResults: [],
    workedWell: [],
    struggles: [],
    rawText: text,
  };

  const lowerText = text.toLowerCase();

  // Extract training type
  for (const { pattern, type } of TRAINING_TYPE_PATTERNS) {
    if (pattern.test(text)) {
      data.trainingType = type;
      const typeLabels: Record<string, string> = {
        'gi': 'Gi',
        'nogi': 'No-Gi',
        'open-mat': 'Open Mat',
        'drilling': 'Drilling',
        'private': 'Private',
      };
      chips.push({
        id: 'trainingType',
        type: 'trainingType',
        label: typeLabels[type || ''] || type || '',
        value: type || '',
        confirmed: true,
      });
      break;
    }
  }

  // Extract duration
  for (const { pattern, multiplier } of DURATION_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const duration = Math.round(parseFloat(match[1]) * multiplier);
      if (duration >= 15 && duration <= 300) { // Reasonable range
        data.durationMinutes = duration;
        chips.push({
          id: 'duration',
          type: 'duration',
          label: `${duration} min`,
          value: duration,
          confirmed: true,
        });
        break;
      }
    }
  }

  // Extract rounds
  for (const pattern of ROUND_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const rounds = parseInt(match[1]);
      if (rounds >= 1 && rounds <= 20) {
        data.sparringRounds = rounds;
        chips.push({
          id: 'rounds',
          type: 'rounds',
          label: `${rounds} roll${rounds > 1 ? 's' : ''}`,
          value: rounds,
          confirmed: true,
        });
        break;
      }
    }
  }

  // Extract techniques
  const foundTechniques: string[] = [];
  for (const technique of TECHNIQUE_KEYWORDS) {
    if (lowerText.includes(technique.toLowerCase())) {
      foundTechniques.push(technique);
      chips.push({
        id: `tech-${technique}`,
        type: 'technique',
        label: technique.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        value: technique,
        confirmed: true,
      });
    }
  }
  data.techniques = foundTechniques;

  // Extract submissions given
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  for (const sentence of sentences) {
    // Check for submissions given patterns
    for (const pattern of SUBMISSION_GIVEN_PATTERNS) {
      const match = sentence.match(pattern);
      if (match && match[1]) {
        const technique = match[1].trim();
        if (isSubmissionTechnique(technique)) {
          const capitalizedTechnique = technique.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          data.sparringResults?.push({
            type: 'submission_given',
            technique: capitalizedTechnique,
          });
          chips.push({
            id: `sub-given-${technique}-${data.sparringResults?.length}`,
            type: 'submission_given',
            label: `Tapped: ${capitalizedTechnique}`,
            value: capitalizedTechnique,
            confirmed: true,
          });
          break; // Only one submission per sentence
        }
      }
    }

    // Check for submissions received patterns
    for (const pattern of SUBMISSION_RECEIVED_PATTERNS) {
      const match = sentence.match(pattern);
      if (match && match[1]) {
        const technique = match[1].trim();
        if (isSubmissionTechnique(technique)) {
          const capitalizedTechnique = technique.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          data.sparringResults?.push({
            type: 'submission_received',
            technique: capitalizedTechnique,
          });
          chips.push({
            id: `sub-recv-${technique}-${data.sparringResults?.length}`,
            type: 'submission_received',
            label: `Caught: ${capitalizedTechnique}`,
            value: capitalizedTechnique,
            confirmed: true,
          });
          break; // Only one submission per sentence
        }
      }
    }
  }

  // Extract positive insights (reuse sentences array from above)
  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    for (const keyword of POSITIVE_KEYWORDS) {
      if (lowerSentence.includes(keyword)) {
        const trimmed = sentence.trim();
        if (trimmed.length > 10 && !data.workedWell?.includes(trimmed)) {
          data.workedWell?.push(trimmed);
          chips.push({
            id: `pos-${trimmed.slice(0, 20)}`,
            type: 'positive',
            label: trimmed.length > 40 ? trimmed.slice(0, 40) + '...' : trimmed,
            value: trimmed,
            confirmed: true,
          });
          break;
        }
      }
    }

    // Extract struggles
    for (const keyword of NEGATIVE_KEYWORDS) {
      if (lowerSentence.includes(keyword)) {
        const trimmed = sentence.trim();
        if (trimmed.length > 10 && !data.struggles?.includes(trimmed)) {
          data.struggles?.push(trimmed);
          chips.push({
            id: `neg-${trimmed.slice(0, 20)}`,
            type: 'negative',
            label: trimmed.length > 40 ? trimmed.slice(0, 40) + '...' : trimmed,
            value: trimmed,
            confirmed: true,
          });
          break;
        }
      }
    }
  }

  return { data, chips };
}

interface TextLoggerProps {
  onComplete?: () => void;
  onCancel?: () => void;
  onSwitchToVoice?: () => void;
}

type Phase = 'input' | 'processing' | 'gap-fill' | 'review' | 'success' | 'error';

export function TextLogger({ onComplete, onCancel, onSwitchToVoice }: TextLoggerProps) {
  const { profile } = useUserProfile();
  const { getPostSessionMessage, getSuggestedPrompts, analyzeJournal } = useBeltPersonalization();

  // Get belt-specific prompts for placeholder/suggestions
  const beltPrompts = getSuggestedPrompts();
  const [phase, setPhase] = useState<Phase>('input');
  const [text, setText] = useState('');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [journalResponse, setJournalResponse] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get belt-specific post-session message
  const postSessionMessage = getPostSessionMessage();

  // Auto-focus textarea
  useEffect(() => {
    if (phase === 'input' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [phase]);

  // Parse text in real-time
  const { chips } = useMemo(() => {
    if (!text.trim()) return { data: {}, chips: [] };
    return parseSessionText(text);
  }, [text]);

  // Smooth phase transition
  const transitionTo = useCallback((newPhase: Phase) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase(newPhase);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  }, []);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!text.trim()) return;

    transitionTo('processing');

    // Simulate processing
    setTimeout(() => {
      const { data } = parseSessionText(text);
      const now = new Date();

      const fullData: SessionData = {
        date: now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
        trainingType: data.trainingType || null,
        durationMinutes: data.durationMinutes || null,
        sparringRounds: data.sparringRounds || null,
        techniques: data.techniques || [],
        sparringResults: data.sparringResults || [],
        workedWell: data.workedWell || [],
        struggles: data.struggles || [],
        rawText: text,
      };

      setSessionData(fullData);

      // If training type is unknown, ask
      if (!fullData.trainingType) {
        transitionTo('gap-fill');
      } else {
        transitionTo('review');
      }
    }, 1500);
  }, [text, transitionTo]);

  // Handle gap-fill answer
  const handleGapFillAnswer = useCallback((type: SessionData['trainingType']) => {
    if (sessionData) {
      setSessionData({ ...sessionData, trainingType: type });
    }
    transitionTo('review');
  }, [sessionData, transitionTo]);

  // Handle save - saves session and submissions to API
  const handleSave = useCallback(async () => {
    if (!sessionData) return;

    try {
      const userId = profile.userId;
      const sessionDate = new Date().toISOString().split('T')[0];

      // Map training type to API format
      const trainingTypeMap: Record<string, 'gi' | 'nogi' | 'openmat' | 'private' | 'competition'> = {
        'gi': 'gi',
        'nogi': 'nogi',
        'open-mat': 'openmat',
        'drilling': 'gi', // Default drilling to gi
        'private': 'private',
      };

      const sessionResult = await api.sessions.create({
        user_id: userId,
        date: sessionDate,
        training_type: trainingTypeMap[sessionData.trainingType || 'gi'] || 'gi',
        time: sessionData.time,
        duration_minutes: sessionData.durationMinutes,
        sparring_rounds: sessionData.sparringRounds,
        techniques: sessionData.techniques,
        worked_well: sessionData.workedWell,
        struggles: sessionData.struggles,
        notes: sessionData.rawText,
      });

      // Save submissions if we have any
      if (sessionResult.data && sessionData.sparringResults.length > 0) {
        const submissionInserts: SubmissionInsert[] = sessionData.sparringResults.map(result => ({
          session_id: sessionResult.data!.id,
          user_id: userId,
          technique_name: result.technique,
          outcome: result.type === 'submission_given' ? 'given' : 'received',
          date: sessionDate,
        }));

        await api.submissions.createBatch(submissionInserts);
      }

      // Analyze journal text for belt-contextualized response
      if (sessionResult.data && sessionData.rawText) {
        const analysis = analyzeJournal(sessionResult.data.id, sessionData.rawText);
        if (analysis.beltAppropriateResponse) {
          setJournalResponse(analysis.beltAppropriateResponse);
        }
      }

      transitionTo('success');
      setTimeout(() => {
        onComplete?.();
      }, 2500); // Slightly longer to read contextual message
    } catch (error) {
      console.error('Failed to save session:', error);
      transitionTo('error');
    }
  }, [sessionData, transitionTo, onComplete, profile.userId, analyzeJournal]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setPhase('input');
    setText('');
    setSessionData(null);
    onCancel?.();
  }, [onCancel]);

  // Transition wrapper style
  const transitionStyle: React.CSSProperties = {
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-primary)',
      ...transitionStyle,
    }}>
      {phase === 'input' && (
        <InputPhase
          text={text}
          setText={setText}
          chips={chips}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onSwitchToVoice={onSwitchToVoice}
          textareaRef={textareaRef}
          beltPrompts={beltPrompts}
        />
      )}

      {phase === 'processing' && <ProcessingPhase />}

      {phase === 'gap-fill' && (
        <GapFillPhase onAnswer={handleGapFillAnswer} />
      )}

      {phase === 'review' && sessionData && (
        <ReviewPhase
          data={sessionData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {phase === 'success' && (
        <SuccessPhase
          postSessionMessage={postSessionMessage}
          journalResponse={journalResponse}
        />
      )}

      {phase === 'error' && (
        <ErrorPhase
          onRetry={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

// ============================================
// INPUT PHASE - Main text entry with live chips
// ============================================
function InputPhase({
  text,
  setText,
  chips,
  onSubmit,
  onCancel,
  onSwitchToVoice,
  textareaRef,
  beltPrompts,
}: {
  text: string;
  setText: (text: string) => void;
  chips: ParsedChip[];
  onSubmit: () => void;
  onCancel?: () => void;
  onSwitchToVoice?: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  beltPrompts: string[];
}) {
  const hasContent = text.trim().length > 0;

  // Use first belt prompt as placeholder, with fallback
  const placeholderPrompt = beltPrompts[0] || 'What did you work on today?';

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-lg)',
        paddingTop: 'var(--space-xl)',
      }}>
        {/* Close button */}
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-gray-500)',
              cursor: 'pointer',
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-full)',
              transition: 'color 0.2s, background-color 0.2s',
            }}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Voice toggle */}
        {onSwitchToVoice && (
          <button
            onClick={onSwitchToVoice}
            style={{
              background: 'var(--color-gray-800)',
              border: 'none',
              color: 'var(--color-gray-300)',
              cursor: 'pointer',
              padding: 'var(--space-sm) var(--space-md)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              fontSize: 'var(--text-sm)',
              transition: 'background-color 0.2s',
            }}
            aria-label="Switch to voice"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            Voice
          </button>
        )}
      </div>

      {/* Title */}
      <div style={{
        padding: '0 var(--space-lg)',
        marginBottom: 'var(--space-md)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wider)',
          color: 'var(--color-white)',
          marginBottom: 'var(--space-xs)',
        }}>
          Quick Log
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-gray-400)',
        }}>
          Type what you worked on. I'll capture the details.
        </p>
      </div>

      {/* Text Input Area */}
      <div style={{
        flex: 1,
        padding: '0 var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          flex: 1,
          backgroundColor: 'var(--dark-bg-secondary)',
          border: '2px solid var(--dark-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'border-color 0.2s',
          ...(hasContent ? { borderColor: 'var(--color-accent)' } : {}),
        }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholderPrompt}
            style={{
              flex: 1,
              minHeight: 180,
              padding: 'var(--space-lg)',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--color-white)',
              fontSize: 'var(--text-lg)',
              lineHeight: 'var(--leading-relaxed)',
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />

          {/* Live parsed chips */}
          {chips.length > 0 && (
            <div style={{
              padding: 'var(--space-md) var(--space-lg)',
              borderTop: '1px solid var(--dark-border)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-sm)',
            }}>
              {chips.map((chip) => (
                <ChipTag key={chip.id} chip={chip} />
              ))}
            </div>
          )}
        </div>

        {/* Quick add buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          marginTop: 'var(--space-md)',
          flexWrap: 'wrap',
        }}>
          <QuickAddButton
            label="Gi"
            onClick={() => setText(text + (text ? ' ' : '') + 'Gi class.')}
            active={chips.some(c => c.value === 'gi')}
          />
          <QuickAddButton
            label="No-Gi"
            onClick={() => setText(text + (text ? ' ' : '') + 'No-gi class.')}
            active={chips.some(c => c.value === 'nogi')}
          />
          <QuickAddButton
            label="60 min"
            onClick={() => setText(text + (text ? ' ' : '') + '60 min.')}
            active={chips.some(c => c.type === 'duration')}
          />
          <QuickAddButton
            label="90 min"
            onClick={() => setText(text + (text ? ' ' : '') + '90 min.')}
            active={chips.some(c => c.type === 'duration')}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div style={{
        padding: 'var(--space-lg)',
        paddingBottom: 'max(var(--space-xl), env(safe-area-inset-bottom))',
      }}>
        <button
          onClick={onSubmit}
          disabled={!hasContent}
          style={{
            width: '100%',
            padding: 'var(--space-lg)',
            backgroundColor: hasContent ? 'var(--color-accent)' : 'var(--color-gray-700)',
            color: hasContent ? 'var(--color-primary)' : 'var(--color-gray-500)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: hasContent ? 'pointer' : 'not-allowed',
            transition: 'transform 0.2s, background-color 0.2s',
          }}
        >
          Save Session
        </button>
      </div>
    </div>
  );
}

// ============================================
// CHIP TAG - Visual confirmation of parsed data
// ============================================
function ChipTag({ chip }: { chip: ParsedChip }) {
  const colors: Record<ParsedChip['type'], { bg: string; text: string; border: string }> = {
    trainingType: {
      bg: 'rgba(59, 130, 246, 0.15)',
      text: 'var(--color-info)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    duration: {
      bg: 'rgba(168, 85, 247, 0.15)',
      text: '#a855f7',
      border: 'rgba(168, 85, 247, 0.3)',
    },
    rounds: {
      bg: 'rgba(236, 72, 153, 0.15)',
      text: '#ec4899',
      border: 'rgba(236, 72, 153, 0.3)',
    },
    technique: {
      bg: 'rgba(252, 211, 77, 0.15)',
      text: 'var(--color-accent)',
      border: 'rgba(252, 211, 77, 0.3)',
    },
    positive: {
      bg: 'rgba(34, 197, 94, 0.15)',
      text: 'var(--color-success)',
      border: 'rgba(34, 197, 94, 0.3)',
    },
    negative: {
      bg: 'rgba(239, 68, 68, 0.15)',
      text: 'var(--color-error)',
      border: 'rgba(239, 68, 68, 0.3)',
    },
    submission_given: {
      bg: 'rgba(34, 197, 94, 0.2)',
      text: 'var(--color-success)',
      border: 'rgba(34, 197, 94, 0.4)',
    },
    submission_received: {
      bg: 'rgba(239, 68, 68, 0.2)',
      text: 'var(--color-error)',
      border: 'rgba(239, 68, 68, 0.4)',
    },
  };

  const style = colors[chip.type];

  const icons: Record<ParsedChip['type'], string> = {
    trainingType: '',
    duration: '',
    rounds: '',
    technique: '',
    positive: '✓',
    negative: '!',
    submission_given: '✓',
    submission_received: '✗',
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-xs)',
      padding: 'var(--space-xs) var(--space-sm)',
      backgroundColor: style.bg,
      color: style.text,
      border: `1px solid ${style.border}`,
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
    }}>
      {icons[chip.type] && <span>{icons[chip.type]}</span>}
      {chip.label}
    </span>
  );
}

// ============================================
// QUICK ADD BUTTON
// ============================================
function QuickAddButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 'var(--space-sm) var(--space-md)',
        backgroundColor: active ? 'var(--color-accent)' : 'var(--color-gray-800)',
        color: active ? 'var(--color-primary)' : 'var(--color-gray-300)',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
        opacity: active ? 0.6 : 1,
      }}
      disabled={active}
    >
      + {label}
    </button>
  );
}

// ============================================
// PROCESSING PHASE
// ============================================
function ProcessingPhase() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 'var(--radius-full)',
        border: '3px solid var(--color-gray-700)',
        borderTopColor: 'var(--color-accent)',
        animation: 'spin 0.8s linear infinite',
        marginBottom: 'var(--space-xl)',
      }} />

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-lg)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-white)',
        marginBottom: 'var(--space-sm)',
      }}>
        Got It
      </h2>

      <p style={{
        fontSize: 'var(--text-lg)',
        color: 'var(--color-gray-300)',
      }}>
        Organizing your notes...
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================
// GAP-FILL PHASE
// ============================================
function GapFillPhase({ onAnswer }: { onAnswer: (type: SessionData['trainingType']) => void }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-gray-800)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-xl)',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-white)',
        marginBottom: 'var(--space-sm)',
      }}>
        One Quick Thing
      </h2>

      <p style={{
        fontSize: 'var(--text-lg)',
        color: 'var(--color-gray-300)',
        marginBottom: 'var(--space-2xl)',
        maxWidth: 280,
      }}>
        Was this a Gi or No-Gi session?
      </p>

      <div style={{
        display: 'flex',
        gap: 'var(--space-md)',
        width: '100%',
        maxWidth: 320,
      }}>
        <button
          onClick={() => onAnswer('gi')}
          style={{
            flex: 1,
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-training-gi)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
          }}
        >
          Gi
        </button>
        <button
          onClick={() => onAnswer('nogi')}
          style={{
            flex: 1,
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-training-nogi)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
          }}
        >
          No-Gi
        </button>
      </div>
    </div>
  );
}

// ============================================
// REVIEW PHASE
// ============================================
function ReviewPhase({
  data,
  onSave,
  onCancel,
}: {
  data: SessionData;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-lg)',
        paddingTop: 'var(--space-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            color: 'var(--color-white)',
            marginBottom: 'var(--space-xs)',
          }}>
            Look Right?
          </h2>
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-gray-400)',
          }}>
            Tap save when ready
          </p>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray-500)',
            cursor: 'pointer',
            padding: 'var(--space-sm)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Summary Card */}
      <div style={{
        flex: 1,
        padding: 'var(--space-lg)',
        paddingTop: 0,
        overflowY: 'auto',
      }}>
        <div style={{
          backgroundColor: 'var(--dark-bg-secondary)',
          border: '1px solid var(--dark-border)',
          borderLeft: '4px solid var(--color-accent)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
        }}>
          {/* Date/Time Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 'var(--space-md)',
            paddingBottom: 'var(--space-md)',
            borderBottom: '1px solid var(--dark-border)',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)',
                color: 'var(--color-white)',
              }}>
                {data.date}
              </div>
              <div style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-gray-400)',
              }}>
                {data.time}
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}>
              {data.trainingType && (
                <span
                  className={`training-badge training-${data.trainingType === 'nogi' ? 'nogi' : 'gi'}`}
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  {data.trainingType === 'gi' ? 'Gi' :
                   data.trainingType === 'nogi' ? 'No-Gi' :
                   data.trainingType === 'open-mat' ? 'Open Mat' :
                   data.trainingType === 'drilling' ? 'Drilling' : 'Private'}
                </span>
              )}
              {data.durationMinutes && (
                <span style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-300)',
                }}>
                  ~{data.durationMinutes} min
                </span>
              )}
              {data.sparringRounds && (
                <span style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-300)',
                }}>
                  • {data.sparringRounds} rolls
                </span>
              )}
            </div>
          </div>

          {/* Techniques */}
          {data.techniques.length > 0 && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-gray-400)',
                marginBottom: 'var(--space-xs)',
              }}>
                Worked On
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-xs)',
              }}>
                {data.techniques.map((tech, i) => (
                  <span key={i} style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    backgroundColor: 'rgba(252, 211, 77, 0.15)',
                    color: 'var(--color-accent)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-sm)',
                  }}>
                    {tech.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* What's Working */}
          {data.workedWell.length > 0 && (
            <div style={{
              marginBottom: 'var(--space-md)',
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-success)',
                marginBottom: 'var(--space-xs)',
              }}>
                What's Working
              </div>
              {data.workedWell.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-sm)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-200)',
                }}>
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Needs Work */}
          {data.struggles.length > 0 && (
            <div style={{
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-error)',
                marginBottom: 'var(--space-xs)',
              }}>
                Needs Work
              </div>
              {data.struggles.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-sm)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-200)',
                }}>
                  <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>!</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Raw text preview if nothing was extracted */}
          {data.techniques.length === 0 && data.workedWell.length === 0 && data.struggles.length === 0 && (
            <div style={{
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-gray-800)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-gray-400)',
                marginBottom: 'var(--space-xs)',
              }}>
                Notes
              </div>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-gray-200)',
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}>
                {data.rawText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        padding: 'var(--space-lg)',
        paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        backgroundColor: 'var(--dark-bg-secondary)',
        borderTop: '1px solid var(--dark-border)',
        display: 'flex',
        gap: 'var(--space-md)',
      }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: 'var(--space-md)',
            backgroundColor: 'transparent',
            color: 'var(--color-gray-400)',
            border: '1px solid var(--color-gray-600)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
          }}
        >
          Start Over
        </button>
        <button
          onClick={onSave}
          style={{
            flex: 2,
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ============================================
// SUCCESS PHASE - Belt-contextualized response
// ============================================
function SuccessPhase({
  postSessionMessage,
  journalResponse,
}: {
  postSessionMessage?: string;
  journalResponse?: string | null;
}) {
  // Prefer contextual response if we detected meaningful patterns
  const displayMessage = journalResponse || postSessionMessage || "Keep showing up. Consistency compounds.";
  const hasContextualResponse = !!journalResponse;

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-success)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-xl)',
        animation: 'scaleIn 0.3s ease-out',
        boxShadow: '0 0 0 15px rgba(34, 197, 94, 0.2), 0 0 0 30px rgba(34, 197, 94, 0.1)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--color-white)',
        marginBottom: 'var(--space-sm)',
      }}>
        Session Logged
      </h2>

      {/* Contextual response with special styling */}
      {hasContextualResponse && (
        <div style={{
          backgroundColor: 'rgba(252, 211, 77, 0.1)',
          border: '1px solid rgba(252, 211, 77, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          marginBottom: 'var(--space-md)',
          maxWidth: 320,
        }}>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-200)',
            lineHeight: 'var(--leading-relaxed)',
            margin: 0,
          }}>
            {displayMessage}
          </p>
        </div>
      )}

      {/* Fallback message when no contextual response */}
      {!hasContextualResponse && (
        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--color-gray-300)',
          maxWidth: 260,
          lineHeight: 'var(--leading-relaxed)',
        }}>
          {displayMessage}
        </p>
      )}

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// ERROR PHASE - Save failed, retry option
// ============================================
function ErrorPhase({ onRetry, onCancel }: { onRetry: () => void; onCancel?: () => void }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-xl)',
      textAlign: 'center',
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
    }}>
      {/* Error icon */}
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-error)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-xl)',
        boxShadow: '0 0 0 15px rgba(239, 68, 68, 0.2), 0 0 0 30px rgba(239, 68, 68, 0.1)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        marginBottom: 'var(--space-sm)',
      }}>
        Couldn't Save Session
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: 'var(--color-gray-400)',
        maxWidth: 260,
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-xl)',
      }}>
        Something went wrong. Your session data is still here—try again.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <button
          onClick={onRetry}
          className="btn btn-primary"
          style={{ minWidth: 120 }}
        >
          Try Again
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="btn btn-outline"
            style={{ minWidth: 120 }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default TextLogger;
