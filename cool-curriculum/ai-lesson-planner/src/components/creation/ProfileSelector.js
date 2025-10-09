import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import ProfileCard from '../profiles/ProfileCard';
import { Plus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileSelector({ isOpen, onClose, selectedProfiles, onSelect, maxProfiles = 3 }) {
  const { studentProfiles } = useApp();
  const navigate = useNavigate();

  const handleProfileToggle = (profile) => {
    const isCurrentlySelected = selectedProfiles.some(p => p.id === profile.id);

    if (isCurrentlySelected) {
      // Deselect
      onSelect(selectedProfiles.filter(p => p.id !== profile.id));
    } else {
      // Select if under limit
      if (selectedProfiles.length < maxProfiles) {
        onSelect([...selectedProfiles, profile]);
      }
    }
  };

  const handleCreateProfile = () => {
    onClose();
    navigate('/profiles');
  };

  const handleApply = () => {
    onClose();
  };

  const isProfileSelected = (profile) => {
    return selectedProfiles.some(p => p.id === profile.id);
  };

  const isMaxReached = selectedProfiles.length >= maxProfiles;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Select Student Profiles (${selectedProfiles.length}/${maxProfiles} selected)`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-blue-900">
            Select up to {maxProfiles} student profiles to create differentiated versions of your material.
            Each profile will generate a customized variant.
          </p>
        </div>

        {/* Profiles Grid */}
        {studentProfiles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600 mb-4">No student profiles yet!</p>
            <Button onClick={handleCreateProfile} className="flex items-center gap-2 mx-auto">
              <Plus size={20} />
              Create Your First Profile
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {studentProfiles.map((profile) => {
              const isSelected = isProfileSelected(profile);
              const isDisabled = !isSelected && isMaxReached;

              return (
                <div key={profile.id} className={isDisabled ? 'opacity-50' : ''}>
                  <ProfileCard
                    profile={profile}
                    isSelectable={true}
                    isSelected={isSelected}
                    onSelect={() => !isDisabled && handleProfileToggle(profile)}
                  />
                  {isDisabled && (
                    <p className="text-xs text-gray-500 mt-1 ml-4">
                      Maximum {maxProfiles} profiles reached
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Create New Profile Link */}
        {studentProfiles.length > 0 && (
          <button
            onClick={handleCreateProfile}
            className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Create New Profile
          </button>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Selection
          </Button>
        </div>
      </div>
    </Modal>
  );
}
