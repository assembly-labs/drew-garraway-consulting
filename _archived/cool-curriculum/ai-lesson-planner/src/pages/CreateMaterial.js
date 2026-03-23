import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/shared/Button';
import PromptBuilder from '../components/creation/PromptBuilder';
import ProfileSelector from '../components/creation/ProfileSelector';
import RateLimitWarning from '../components/creation/RateLimitWarning';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function CreateMaterial() {
  const navigate = useNavigate();
  const { checkRateLimit } = useApp();

  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState({
    grade: null,
    subject: '',
    materialType: '',
    language: 'english'
  });
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);
  const [showRateLimitWarning, setShowRateLimitWarning] = useState(false);

  const rateLimitStatus = checkRateLimit();

  const handleGenerateDraft = () => {
    // Check rate limit
    if (!rateLimitStatus.allowed) {
      setShowRateLimitWarning(true);
      return;
    }

    // Validate prompt
    if (!prompt.trim()) {
      alert('Please enter a prompt describing what you want to create.');
      return;
    }

    // For now, navigate to draft review (Phase 4 will handle actual generation)
    // Pass data via navigate state
    navigate('/draft-review', {
      state: {
        request: {
          prompt,
          options,
          selectedProfiles
        }
      }
    });
  };

  const isGenerateDisabled = !prompt.trim() || !rateLimitStatus.allowed;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Lesson Material</h1>
        <p className="mt-2 text-gray-600">
          Describe what you want to create, and our AI will generate a customized draft
        </p>
      </div>

      {/* Rate Limit Warning */}
      {showRateLimitWarning && !rateLimitStatus.allowed && (
        <div className="mb-6">
          <RateLimitWarning
            minutesRemaining={rateLimitStatus.minutesRemaining}
            count={rateLimitStatus.count}
          />
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <PromptBuilder
          prompt={prompt}
          setPrompt={setPrompt}
          options={options}
          setOptions={setOptions}
          selectedProfiles={selectedProfiles}
          onOpenProfileSelector={() => setIsProfileSelectorOpen(true)}
        />

        {/* Generate Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {selectedProfiles.length > 0 && (
                <p>
                  Will generate {selectedProfiles.length} variant{selectedProfiles.length !== 1 ? 's' : ''}
                  {' '}(~{15 * (selectedProfiles.length || 1)} seconds)
                </p>
              )}
            </div>
            <Button
              onClick={handleGenerateDraft}
              disabled={isGenerateDisabled}
              className="flex items-center gap-2"
            >
              <Sparkles size={20} />
              Generate Draft
            </Button>
          </div>

          {isGenerateDisabled && prompt.trim() === '' && (
            <p className="text-sm text-gray-500 mt-2 text-right">
              Enter a prompt to continue
            </p>
          )}
        </div>
      </div>

      {/* Profile Selector Modal */}
      <ProfileSelector
        isOpen={isProfileSelectorOpen}
        onClose={() => setIsProfileSelectorOpen(false)}
        selectedProfiles={selectedProfiles}
        onSelect={setSelectedProfiles}
        maxProfiles={3}
      />
    </div>
  );
}
