import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
  loading?: boolean;
}

const IdeaInput: React.FC<IdeaInputProps> = ({ onSubmit, loading = false }) => {
  const [idea, setIdea] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (idea.length < 5) {
      setError('Idea must be at least 5 characters');
      return;
    }
    if (idea.length > 200) {
      setError('Idea must be less than 200 characters');
      return;
    }

    setError('');
    onSubmit(idea);
  };

  const charCount = idea.length;
  const charCountColor = charCount > 200 ? 'text-error' : charCount > 150 ? 'text-yellow-500' : 'text-text-secondary';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          What would you like to write about?
        </h2>
        <p className="text-text-secondary">
          Start with a simple idea. We'll research and create comprehensive content for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="idea" className="label">
            Your Idea
          </label>
          <textarea
            id="idea"
            className={`textarea ${error ? 'input-error' : ''}`}
            placeholder="Example: The impact of AI on modern healthcare systems"
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              setError('');
            }}
            rows={3}
            disabled={loading}
            maxLength={250}
          />

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
              {charCount}/200
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading || idea.length < 5}
        >
          {loading ? (
            <>
              <div className="spinner w-5 h-5"></div>
              Starting Research...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Start Creating Content
            </>
          )}
        </button>
      </form>

      {/* Example ideas */}
      <div className="mt-8">
        <p className="text-sm text-text-secondary mb-3">Need inspiration? Try these:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'AI in healthcare',
            'Remote work productivity',
            'Sustainable technology',
            'Digital transformation',
            'Future of education',
          ].map((example) => (
            <button
              key={example}
              onClick={() => setIdea(example)}
              className="px-3 py-1 bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary text-sm rounded-full transition-colors"
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdeaInput;