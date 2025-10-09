import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/shared/Button';
import { BookOpen, Search, Filter } from 'lucide-react';

export default function Library() {
  const navigate = useNavigate();
  const { libraryItems } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  // Get unique grades and subjects for filters
  const grades = ['all', ...new Set(libraryItems.map(item => item.grade))].sort();
  const subjects = ['all', ...new Set(libraryItems.map(item => item.subject))];

  // Filter materials
  const filteredMaterials = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || item.grade === parseInt(filterGrade) || (filterGrade === '0' && item.grade === 0);
    const matchesSubject = filterSubject === 'all' || item.subject === filterSubject;
    return matchesSearch && matchesGrade && matchesSubject;
  }).reverse(); // Most recent first

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-blue-600" size={36} />
          <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
        </div>
        <p className="text-gray-600">
          {libraryItems.length} saved material{libraryItems.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search and Filters */}
      {libraryItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Grade Filter */}
            <div>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Grades</option>
                {grades.filter(g => g !== 'all').map(grade => (
                  <option key={grade} value={grade}>
                    Grade {grade === 0 ? 'K' : grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Subjects</option>
                {subjects.filter(s => s !== 'all').map(subject => (
                  <option key={subject} value={subject} className="capitalize">
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterGrade !== 'all' || filterSubject !== 'all') && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Filter size={16} className="text-gray-500" />
              <span className="text-gray-600">
                Showing {filteredMaterials.length} of {libraryItems.length} materials
              </span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterGrade('all');
                  setFilterSubject('all');
                }}
                className="ml-2 text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Materials Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => (
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
              <div className="text-5xl mb-4">{item.thumbnail}</div>
              <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                {item.title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                    Grade {item.grade === 0 ? 'K' : item.grade}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                    {item.subject}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded capitalize">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Saved {new Date(item.savedAt).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : libraryItems.length === 0 ? (
        /* Empty State */
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Your library is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Create and save lesson materials to access them here anytime
          </p>
          <Button
            onClick={() => navigate('/create')}
            className="mx-auto"
          >
            Create Your First Material
          </Button>
        </div>
      ) : (
        /* No Results */
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-8 text-center">
          <p className="text-yellow-900">
            No materials match your filters. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
