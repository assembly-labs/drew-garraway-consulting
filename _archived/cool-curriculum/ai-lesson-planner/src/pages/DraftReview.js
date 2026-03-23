import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/shared/Button';
import { generateDraft } from '../utils/llm';
import { recordRegeneration } from '../utils/rateLimit';
import { ArrowLeft, RefreshCw, CheckCircle, Edit3, AlertCircle } from 'lucide-react';

export default function DraftReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkRateLimit } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState(null);
  const [request, setRequest] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const requestData = location.state?.request;

    if (!requestData) {
      navigate('/create');
      return;
    }

    setRequest(requestData);
    generateInitialDraft(requestData);
  }, [location.state, navigate]);

  const generateInitialDraft = async (requestData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Record this as a generation event
      recordRegeneration();

      const result = await generateDraft(requestData);

      if (result.success) {
        setDraft(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const rateLimitStatus = checkRateLimit();

    if (!rateLimitStatus.allowed) {
      alert(`Rate limit reached. Please wait ${rateLimitStatus.minutesRemaining} minutes before regenerating.`);
      return;
    }

    setIsRegenerating(true);
    setError(null);

    try {
      recordRegeneration();
      const result = await generateDraft(request);

      if (result.success) {
        setDraft(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleStartOver = () => {
    navigate('/create');
  };

  const handleApprove = () => {
    navigate('/visual-editor', {
      state: {
        draft,
        request
      }
    });
  };

  const handleEdit = (field, value) => {
    setDraft({
      ...draft,
      [field]: value
    });
  };

  const handleQuestionEdit = (index, field, value) => {
    const updatedQuestions = [...draft.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setDraft({
      ...draft,
      questions: updatedQuestions
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <LoadingSpinner
          message="Generating your lesson material... This may take 15-20 seconds"
          size="lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Generation Failed</h3>
              <p className="text-red-800 mb-4">{error}</p>
              <div className="flex gap-3">
                <Button onClick={handleStartOver} variant="secondary">
                  <ArrowLeft size={18} className="mr-2" />
                  Start Over
                </Button>
                <Button onClick={() => generateInitialDraft(request)}>
                  <RefreshCw size={18} className="mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!draft) {
    return null;
  }

  const rateLimitStatus = checkRateLimit();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleStartOver}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft size={20} />
          Back to Edit Prompt
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Review Draft</h1>
        <p className="mt-2 text-gray-600">
          Review and edit the AI-generated content before creating the visual version
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-yellow-900">
            <strong>Review carefully!</strong> AI may make errors. You've used{' '}
            <strong>{rateLimitStatus.count}/3</strong> regenerations.
          </div>
        </div>
      </div>

      {/* Draft Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Edit3 size={16} />
            Title
          </label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => handleEdit('title', e.target.value)}
            className="w-full px-4 py-2 text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Learning Objective */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Edit3 size={16} />
            Learning Objective
          </label>
          <textarea
            value={draft.learningObjective}
            onChange={(e) => handleEdit('learningObjective', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Edit3 size={16} />
            Instructions for Students
          </label>
          <textarea
            value={draft.instructions}
            onChange={(e) => handleEdit('instructions', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Questions</label>
          <div className="space-y-4">
            {draft.questions.map((q, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-lg text-gray-700">{q.number}.</span>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={q.question}
                      onChange={(e) => handleQuestionEdit(idx, 'question', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Answer:</label>
                      <input
                        type="text"
                        value={q.answer}
                        onChange={(e) => handleQuestionEdit(idx, 'answer', e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <Button
          onClick={handleRegenerate}
          disabled={!rateLimitStatus.allowed || isRegenerating}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <RefreshCw size={18} className={isRegenerating ? 'animate-spin' : ''} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </Button>

        <div className="flex gap-3">
          <Button onClick={handleStartOver} variant="secondary">
            Start Over
          </Button>
          <Button onClick={handleApprove} className="flex items-center gap-2">
            <CheckCircle size={18} />
            Looks Good - Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
