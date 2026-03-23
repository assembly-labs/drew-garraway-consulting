import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/shared/Button';
import { Save, Eye, Download, ArrowLeft, Info } from 'lucide-react';

export default function VisualEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToLibrary } = useApp();

  const [draft, setDraft] = useState(null);
  const [request, setRequest] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const draftData = location.state?.draft;
    const requestData = location.state?.request;

    if (!draftData || !requestData) {
      navigate('/create');
      return;
    }

    setDraft(draftData);
    setRequest(requestData);
  }, [location.state, navigate]);

  const handleSave = () => {
    if (!draft || !request) return;

    addToLibrary({
      title: draft.title,
      type: request.options?.materialType || 'worksheet',
      grade: request.options?.grade || 'K',
      subject: request.options?.subject || 'General',
      content: draft,
      thumbnail: getEmojiForType(request.options?.materialType)
    });

    setSaved(true);
    setTimeout(() => {
      navigate('/library');
    }, 1500);
  };

  const handlePreview = () => {
    window.print();
  };

  const handleExport = () => {
    alert('Export functionality coming soon! For now, use your browser\'s print function to save as PDF.');
  };

  if (!draft) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Toolbar */}
      <div className="mb-6 no-print">
        <button
          onClick={() => navigate('/draft-review', { state: { request } })}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft size={20} />
          Back to Draft
        </button>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Visual Editor</h1>
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex items-center gap-2" disabled={saved}>
              <Save size={18} />
              {saved ? 'Saved!' : 'Save to Library'}
            </Button>
            <Button onClick={handlePreview} variant="secondary" className="flex items-center gap-2">
              <Eye size={18} />
              Preview
            </Button>
            <Button onClick={handleExport} variant="secondary" className="flex items-center gap-2">
              <Download size={18} />
              Export
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-900">
            <strong>Visual generation coming soon!</strong> This is a preview of your material.
            The final version will include custom illustrations, interactive elements for digital preview,
            and print-optimized layouts. Use the Preview button to see the print version.
          </div>
        </div>
      </div>

      {/* Mock Visual Template */}
      <div className="worksheet-template bg-white shadow-lg rounded-lg border-2 border-gray-200">
        {/* Header */}
        <div className="border-b-4 border-blue-600 pb-4 mb-6">
          <h2 className="text-3xl font-fredoka text-blue-600 mb-2">{draft.title}</h2>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Grade: {request.options?.grade === 0 ? 'K' : request.options?.grade || 'K-4'}</span>
            <span>Name: _________________________</span>
            <span>Date: _______________</span>
          </div>
        </div>

        {/* Learning Objective */}
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-sm font-semibold text-green-800 mb-1">Learning Objective:</p>
          <p className="text-gray-700">{draft.learningObjective}</p>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <p className="font-semibold text-gray-900 mb-2">Instructions:</p>
          <p className="text-gray-700">{draft.instructions}</p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {draft.questions.map((q, idx) => (
            <div key={idx} className="question-box">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl font-bold text-blue-600">{q.number}.</span>
                <p className="flex-1 text-lg text-gray-800 pt-1">{q.question}</p>
              </div>

              {/* Work Space */}
              {q.workSpace !== false && (
                <div className="work-space bg-blue-50">
                  <p className="text-xs text-gray-500 p-2">Show your work:</p>
                </div>
              )}

              {/* Answer Space */}
              <div className="mt-3 flex items-center gap-3">
                <span className="font-medium text-gray-700">Answer:</span>
                <div className="flex-1 border-b-2 border-gray-300 pb-1">
                  <span className="text-gray-400">_________________________</span>
                </div>
              </div>

              {/* Teacher Answer Key (print only shows on answer key version) */}
              <div className="mt-2 text-xs text-green-700 bg-green-50 px-3 py-1 rounded inline-block no-print">
                ✓ Correct Answer: {q.answer}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>Created with AI Lesson Planner • {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Mock Info */}
      <div className="mt-6 text-center text-sm text-gray-500 no-print">
        <p>This is a placeholder template. Final version will include:</p>
        <div className="flex justify-center gap-6 mt-2">
          <span>✓ Custom illustrations</span>
          <span>✓ Interactive drag-and-drop (digital preview)</span>
          <span>✓ Print-optimized layout</span>
          <span>✓ Answer key generation</span>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 no-print">
          <Save size={20} />
          Saved to Library!
        </div>
      )}
    </div>
  );
}

function getEmojiForType(type) {
  const emojiMap = {
    'worksheet': '📊',
    'quiz': '📝',
    'activity': '🎨',
    'game': '🎮',
    'assessment': '📋',
    'home_practice': '🏠'
  };
  return emojiMap[type] || '📄';
}
