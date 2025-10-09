import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/shared/Modal';
import Button from '../components/shared/Button';
import ProfileCard from '../components/profiles/ProfileCard';
import ProfileForm from '../components/profiles/ProfileForm';
import { Plus, Users } from 'lucide-react';

export default function ProfileManager() {
  const { studentProfiles, addProfile, updateProfile, deleteProfile } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const handleSave = (profileData) => {
    if (editingProfile) {
      updateProfile(editingProfile.id, profileData);
    } else {
      addProfile(profileData);
    }
    setIsModalOpen(false);
    setEditingProfile(null);
  };

  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleDelete = (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      deleteProfile(profileId);
    }
  };

  const handleNewProfile = () => {
    setEditingProfile(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="text-blue-600" size={32} />
              Student Profiles
            </h1>
            <p className="mt-2 text-gray-600">
              Manage learning profiles to differentiate lessons (no student names or PII)
            </p>
          </div>
          <Button onClick={handleNewProfile} className="flex items-center gap-2">
            <Plus size={20} />
            Create New Profile
          </Button>
        </div>
      </div>

      {/* Profiles List */}
      {studentProfiles.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No profiles yet!</h2>
          <p className="text-gray-500 mb-6">
            Create student profiles to differentiate lessons for different learning needs
          </p>
          <Button onClick={handleNewProfile} className="flex items-center gap-2 mx-auto">
            <Plus size={20} />
            Create Your First Profile
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {studentProfiles.length} profile{studentProfiles.length !== 1 ? 's' : ''} saved
          </p>
          {studentProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Profile Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProfile(null);
        }}
        title={editingProfile ? 'Edit Student Profile' : 'Create Student Profile'}
        size="lg"
      >
        <ProfileForm
          profile={editingProfile}
          onSave={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProfile(null);
          }}
        />
      </Modal>
    </div>
  );
}
