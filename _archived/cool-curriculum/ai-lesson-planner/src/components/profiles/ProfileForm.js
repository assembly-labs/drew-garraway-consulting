import React, { useState, useEffect } from 'react';
import Button from '../shared/Button';

export default function ProfileForm({ profile = null, onSave, onCancel }) {
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
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const characteristicOptions = [
    { value: 'iep_accommodations', label: 'IEP/504 accommodations' },
    { value: 'visual_supports', label: 'Visual supports' },
    { value: 'english_language_learners', label: 'English Language Learners' },
    { value: 'scaffolding_needed', label: 'Scaffolding needed' },
    { value: 'advanced_gifted', label: 'Advanced/Gifted' },
  ];

  const interestOptions = [
    'Sports', 'Animals', 'Space', 'Automotive',
    'Nature', 'Music', 'Art', 'Food/Cooking',
    'Technology', 'Building', 'Fantasy', 'Science'
  ];

  const gradeOptions = ['K', '1', '2', '3', '4'];

  const handleGradeToggle = (grade) => {
    setFormData(prev => {
      const gradeNum = grade === 'K' ? 0 : parseInt(grade);
      const newRange = prev.gradeRange.includes(gradeNum)
        ? prev.gradeRange.filter(g => g !== gradeNum)
        : [...prev.gradeRange, gradeNum].sort((a, b) => a - b);
      return { ...prev, gradeRange: newRange };
    });
  };

  const handleCharacteristicToggle = (value) => {
    setFormData(prev => {
      const newChars = prev.characteristics.includes(value)
        ? prev.characteristics.filter(c => c !== value)
        : [...prev.characteristics, value];
      return { ...prev, characteristics: newChars };
    });
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const newInterests = prev.interestThemes.includes(interest)
        ? prev.interestThemes.filter(i => i !== interest)
        : [...prev.interestThemes, interest];
      return { ...prev, interestThemes: newInterests };
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Profile name is required';
    }

    if (formData.gradeRange.length === 0) {
      newErrors.gradeRange = 'Select at least one grade';
    }

    if (formData.interestThemes.length === 0) {
      newErrors.interestThemes = 'Select at least one interest theme';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Grade Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grade Range <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {gradeOptions.map((grade) => {
            const gradeNum = grade === 'K' ? 0 : parseInt(grade);
            const isSelected = formData.gradeRange.includes(gradeNum);
            return (
              <button
                key={grade}
                type="button"
                onClick={() => handleGradeToggle(grade)}
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
        {errors.gradeRange && <p className="mt-1 text-sm text-red-600">{errors.gradeRange}</p>}
      </div>

      {/* Learning Characteristics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Characteristics
        </label>
        <div className="space-y-2">
          {characteristicOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.characteristics.includes(option.value)}
                onChange={() => handleCharacteristicToggle(option.value)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Interest Themes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interest Themes <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {interestOptions.map((interest) => {
            const isSelected = formData.interestThemes.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
        {errors.interestThemes && <p className="mt-1 text-sm text-red-600">{errors.interestThemes}</p>}
      </div>

      {/* Reading Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reading Level
        </label>
        <div className="flex gap-4">
          {[
            { value: 'below_grade', label: 'Below Grade' },
            { value: 'on_grade', label: 'On Grade' },
            { value: 'above_grade', label: 'Above Grade' }
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="readingLevel"
                value={option.value}
                checked={formData.readingLevel === option.value}
                onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Additional notes about this profile..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {profile ? 'Update Profile' : 'Save Profile'}
        </Button>
      </div>
    </form>
  );
}
