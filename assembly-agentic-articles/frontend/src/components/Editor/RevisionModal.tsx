import React, { useState } from 'react';
import Modal from '../common/Modal';
import { AlertCircle } from 'lucide-react';
import PlatformSelector from '../common/PlatformSelector';
import LengthSelector from '../common/LengthSelector';
import useContentStore from '../../store/contentStore';

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
  loading: boolean;
  currentRevision: number; // 0, 1, or 2
}

const RevisionModal: React.FC<RevisionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  currentRevision
}) => {
  const { selectedPlatforms, selectedContentLength, selectPlatforms, selectContentLength } = useContentStore();
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const exampleSuggestions = [
    "Make it more technical and data-driven",
    "Simplify for a general audience",
    "Add more statistics and numbers",
    "Make the tone more conversational",
    "Focus more on practical applications"
  ];

  const handleSubmit = () => {
    // Validation
    if (feedback.length < 10) {
      setError('Feedback must be at least 10 characters');
      return;
    }
    if (feedback.length > 500) {
      setError('Feedback must be less than 500 characters');
      return;
    }

    setError('');
    onSubmit(feedback);
    setFeedback(''); // Clear on submit
  };

  const handleClose = () => {
    setFeedback('');
    setError('');
    onClose();
  };

  const charCount = feedback.length;
  const charCountColor = charCount > 500 ? 'text-error' : charCount > 400 ? 'text-warning' : 'text-text-secondary';
  const remainingRevisions = 2 - currentRevision;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Request Content Revision (${currentRevision + 1}/2)`}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading || charCount < 10 || charCount > 500}
          >
            {loading ? (
              <>
                <div className="spinner w-5 h-5"></div>
                Revising...
              </>
            ) : (
              `Submit Revision Request`
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                {remainingRevisions === 2 ? 'First Revision' : 'Final Revision Available'}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {remainingRevisions === 2
                  ? 'You have 2 revision requests remaining. Be specific about what changes you want.'
                  : 'This is your last revision. After this, you can approve or start over.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Textarea */}
        <div className="form-group">
          <label htmlFor="revision-feedback" className="label">
            What would you like to change?
          </label>
          <textarea
            id="revision-feedback"
            className={`textarea ${error ? 'input-error' : ''}`}
            placeholder="e.g., Make it more technical and add more statistics about AI adoption rates"
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              setError('');
            }}
            rows={4}
            disabled={loading}
            maxLength={550}
            autoFocus
          />

          {/* Platform & Length Selectors */}
          <div className="mt-4">
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onPlatformChange={selectPlatforms}
              disabled={loading}
            />
          </div>

          <div className="mt-3">
            <LengthSelector
              selectedLength={selectedContentLength}
              onLengthChange={selectContentLength}
              disabled={loading}
            />
          </div>

          {/* Character count */}
          <div className="flex justify-between items-center mt-2">
            <div>
              {error && (
                <div className="flex items-center gap-1 text-error text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <span className={`text-sm ${charCountColor}`}>
              {charCount}/500
            </span>
          </div>
        </div>

        {/* Example Suggestions */}
        <div>
          <p className="text-sm font-medium text-text-secondary mb-3">
            Need inspiration? Try these:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {exampleSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setFeedback(suggestion)}
                className="text-left px-3 py-2 bg-surface hover:bg-surface-hover border border-border hover:border-accent rounded-lg text-sm text-text-primary transition-all"
                disabled={loading}
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <p className="text-sm font-semibold text-text-primary mb-2">💡 Tips for better revisions:</p>
          <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
            <li>Be specific about what sections to change</li>
            <li>Mention tone adjustments (formal, casual, technical)</li>
            <li>Request specific data or examples to add</li>
            <li>Indicate if you want longer or shorter content</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default RevisionModal;
