import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function ProfileCard({ profile, onEdit, onDelete, isSelectable = false, isSelected = false, onSelect }) {
  const gradeDisplay = profile.gradeRange?.length > 1
    ? `${profile.gradeRange[0]}-${profile.gradeRange[profile.gradeRange.length - 1]}`
    : `${profile.gradeRange?.[0] || 'K'}`;

  const readingLevelDisplay = {
    below_grade: 'Below Grade',
    on_grade: 'On Grade',
    above_grade: 'Above Grade'
  }[profile.readingLevel] || 'Not specified';

  const handleClick = () => {
    if (isSelectable && onSelect) {
      onSelect(profile);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-sm p-5 transition-all ${
        isSelectable ? 'cursor-pointer hover:shadow-md' : ''
      } ${isSelected ? 'border-2 border-blue-600 ring-2 ring-blue-200' : 'border border-gray-200'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isSelectable && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(profile)}
                className="w-5 h-5 text-blue-600 rounded"
              />
            )}
            <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
          </div>

          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p>Grade: {gradeDisplay} | Reading: {readingLevelDisplay}</p>

            {profile.interestThemes && profile.interestThemes.length > 0 && (
              <p className="flex items-center gap-1 flex-wrap">
                <span className="font-medium">Interests:</span>
                {profile.interestThemes.map((interest, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                    {interest}
                  </span>
                ))}
              </p>
            )}

            {profile.characteristics && profile.characteristics.length > 0 && (
              <p className="flex items-center gap-1 flex-wrap">
                <span className="font-medium">Characteristics:</span>
                {profile.characteristics.map((char, idx) => (
                  <span key={idx} className="text-gray-600">
                    {char.replace(/_/g, ' ')}{idx < profile.characteristics.length - 1 ? ',' : ''}
                  </span>
                ))}
              </p>
            )}

            {profile.notes && (
              <p className="mt-2 italic text-gray-500">{profile.notes}</p>
            )}
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Created: {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>

        {!isSelectable && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(profile)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
              title="Edit profile"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(profile.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
              title="Delete profile"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
