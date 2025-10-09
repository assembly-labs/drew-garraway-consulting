import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import useContentStore from '../store/contentStore';

const Dashboard: React.FC = () => {
  const { drafts, loadDrafts, loading } = useContentStore();

  useEffect(() => {
    loadDrafts();
  }, []);

  // Calculate real stats from actual drafts
  const totalDrafts = drafts.length;
  const publishedCount = drafts.filter(d => d.status === 'published').length;
  const reviewCount = drafts.filter(d => d.status === 'review' || d.status === 'approved').length;
  const draftCount = drafts.filter(d => d.status === 'draft').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'review':
      case 'approved':
        return <AlertCircle className="w-5 h-5 text-accent" />;
      default:
        return <Clock className="w-5 h-5 text-text-secondary" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      draft: 'bg-gray-600/20 text-gray-400',
      researching: 'bg-yellow-600/20 text-yellow-600',
      drafting: 'bg-blue-600/20 text-blue-400',
      review: 'bg-accent/20 text-accent',
      approved: 'bg-green-600/20 text-green-400',
      published: 'bg-success/20 text-success',
    };
    return badges[status] || badges.draft;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Content Dashboard</h1>
        <p className="text-text-secondary">Manage your research-backed content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Total Drafts</p>
              <p className="text-3xl font-bold text-text-primary">{totalDrafts}</p>
            </div>
            <FileText className="w-10 h-10 text-accent opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Published</p>
              <p className="text-3xl font-bold text-success">{publishedCount}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-success opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">In Review</p>
              <p className="text-3xl font-bold text-accent">{reviewCount}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-accent opacity-50" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">In Progress</p>
              <p className="text-3xl font-bold text-text-primary">{draftCount}</p>
            </div>
            <Clock className="w-10 h-10 text-text-secondary opacity-50" />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Recent Drafts</h2>
        <Link to="/create">
          <button className="btn btn-primary">
            <Plus className="w-5 h-5" />
            Create New Content
          </button>
        </Link>
      </div>

      {/* Drafts Table */}
      <div className="bg-bg-secondary rounded-lg border border-border overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-12"></th>
              <th>Idea</th>
              <th>Status</th>
              <th>Created</th>
              <th>Revisions</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="spinner mx-auto"></div>
                  <p className="text-text-secondary mt-2">Loading drafts...</p>
                </td>
              </tr>
            ) : drafts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <p className="text-text-secondary">No drafts yet. Create your first content!</p>
                </td>
              </tr>
            ) : (
              drafts.map((draft: any) => (
                <tr key={draft.id} className="hover:bg-surface/50 transition-colors">
                  <td className="pl-4">
                    {getStatusIcon(draft.status)}
                  </td>
                  <td>
                    <p className="text-text-primary font-medium">{draft.originalIdea}</p>
                  </td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(draft.status)}`}>
                      {draft.status}
                    </span>
                  </td>
                  <td className="text-text-secondary text-sm">
                    {new Date(draft.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-text-secondary text-sm">
                    {draft.revisionCount}/2
                  </td>
                  <td className="text-right pr-4">
                    <Link
                      to={`/draft/${draft.id}`}
                      className="text-accent hover:text-accent-hover text-sm font-medium"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;