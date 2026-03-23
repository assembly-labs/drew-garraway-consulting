import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/shared/Button';
import { Plus, Users, BookOpen, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { studentProfiles, libraryItems } = useApp();

  const recentMaterials = libraryItems.slice(-3).reverse();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-12 text-white text-center mb-12">
        <h1 className="text-4xl font-fredoka mb-4">
          Welcome to AI Lesson Planner
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Create engaging, differentiated lesson materials in minutes with AI
        </p>
        <Button
          onClick={() => navigate('/create')}
          variant="light"
          className="text-lg px-8 py-4 flex items-center gap-3 mx-auto"
        >
          <Sparkles size={24} />
          Create New Lesson Material
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* My Library */}
          <button
            onClick={() => navigate('/library')}
            className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">My Library</h3>
            </div>
            <p className="text-gray-600">
              {libraryItems.length} saved material{libraryItems.length !== 1 ? 's' : ''}
            </p>
          </button>

          {/* Student Profiles */}
          <button
            onClick={() => navigate('/profiles')}
            className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Student Profiles</h3>
            </div>
            <p className="text-gray-600">
              {studentProfiles.length} profile{studentProfiles.length !== 1 ? 's' : ''}
            </p>
          </button>

          {/* Browse Templates */}
          <div className="bg-gray-50 rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gray-200 p-3 rounded-lg">
                <Plus className="text-gray-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-500">Browse Templates</h3>
            </div>
            <p className="text-gray-500 text-sm">Coming Soon!</p>
          </div>
        </div>
      </div>

      {/* Recent Materials */}
      {recentMaterials.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Materials</h2>
            <button
              onClick={() => navigate('/library')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentMaterials.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate('/visual-editor', {
                  state: {
                    draft: item.content,
                    request: { options: { grade: item.grade, subject: item.subject, materialType: item.type } }
                  }
                })}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-500 transition text-left"
              >
                <div className="text-4xl mb-3">{item.thumbnail}</div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Grade {item.grade === 0 ? 'K' : item.grade}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded capitalize">
                    {item.subject}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {new Date(item.savedAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {libraryItems.length === 0 && (
        <div className="bg-blue-50 rounded-lg border-2 border-dashed border-blue-300 p-12 text-center">
          <Sparkles className="mx-auto text-blue-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ready to create your first lesson?
          </h3>
          <p className="text-gray-600 mb-6">
            Click the button above to generate AI-powered learning materials in minutes
          </p>
        </div>
      )}
    </div>
  );
}
