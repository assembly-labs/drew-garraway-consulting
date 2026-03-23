import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PromptBuilder({
  prompt,
  setPrompt,
  options,
  setOptions,
  selectedProfiles,
  onOpenProfileSelector
}) {
  const [showOptionalGuides, setShowOptionalGuides] = useState(false);

  const gradeOptions = ['K', '1', '2', '3', '4'];
  const subjectOptions = [
    'Math',
    'Reading/ELA',
    'Science',
    'Social Studies',
    'Writing',
    'Other'
  ];
  const materialTypeOptions = [
    'Worksheet',
    'Quiz',
    'Activity',
    'Game',
    'Assessment',
    'Home Practice'
  ];
  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'bilingual', label: 'Bilingual' }
  ];

  const handleGradeClick = (grade) => {
    const gradeNum = grade === 'K' ? 0 : parseInt(grade);
    setOptions({ ...options, grade: gradeNum });
  };

  return (
    <div className="space-y-6">
      {/* Main Prompt */}
      <div>
        <label className="block text-lg font-medium text-gray-900 mb-2">
          What would you like to create?
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          placeholder='Example: Create a worksheet about addition with regrouping for 2nd graders who love animals. Include 5 problems with space for showing work.'
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
        />
        <p className="mt-2 text-sm text-gray-500">
          Be as specific as possible. Mention topics, skills, and any special requirements.
        </p>
      </div>

      {/* Optional Guides - Collapsible */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => setShowOptionalGuides(!showOptionalGuides)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
        >
          <span className="font-medium text-gray-700">Optional: Guide my prompt</span>
          {showOptionalGuides ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showOptionalGuides && (
          <div className="p-4 space-y-4">
            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level
              </label>
              <div className="flex gap-2">
                {gradeOptions.map((grade) => {
                  const gradeNum = grade === 'K' ? 0 : parseInt(grade);
                  const isSelected = options.grade === gradeNum;
                  return (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => handleGradeClick(grade)}
                      className={`px-6 py-2 rounded-lg font-medium transition ${
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
            </div>

            {/* Subject and Material Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={options.subject}
                  onChange={(e) => setOptions({ ...options, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select subject...</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject.toLowerCase().replace('/', '_')}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Type
                </label>
                <select
                  value={options.materialType}
                  onChange={(e) => setOptions({ ...options, materialType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type...</option>
                  {materialTypeOptions.map((type) => (
                    <option key={type} value={type.toLowerCase()}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <div className="flex gap-3">
                {languageOptions.map((lang) => {
                  const isSelected = options.language === lang.value;
                  return (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => setOptions({ ...options, language: lang.value })}
                      className={`px-6 py-2 rounded-lg font-medium transition ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Differentiation Options */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">🎯 Differentiation Options</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedProfiles.length > 0}
              onChange={(e) => {
                if (!e.target.checked && selectedProfiles.length > 0) {
                  // User wants to clear selections - handle in parent
                } else if (e.target.checked) {
                  onOpenProfileSelector();
                }
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">
              Create variations for different students
            </span>
          </label>

          <button
            type="button"
            onClick={onOpenProfileSelector}
            className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-blue-700 font-medium hover:bg-blue-50 transition"
          >
            {selectedProfiles.length > 0
              ? `${selectedProfiles.length}/3 Profiles Selected`
              : 'Select Student Profiles'}
          </button>

          {selectedProfiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {selectedProfiles.map((profile, idx) => (
                <div key={idx} className="text-sm text-gray-600 bg-white px-3 py-1 rounded border border-blue-200">
                  ✓ {profile.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
