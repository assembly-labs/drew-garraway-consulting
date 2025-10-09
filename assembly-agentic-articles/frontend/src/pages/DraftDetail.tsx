import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Edit3 } from 'lucide-react';
import ContentEditor from '../components/Editor/ContentEditor';
import ResearchPanel from '../components/ResearchPanel/ResearchPanel';
import PlatformPreview from '../components/PlatformPreview/PlatformPreview';
import useContentStore from '../store/contentStore';

const DraftDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentDraft,
    sources,
    formattedContent,
    loading,
    loadDraft,
    reviseContent,
    approveDraft,
    publishContent
  } = useContentStore();

  useEffect(() => {
    if (id) {
      loadDraft(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading draft...</p>
        </div>
      </div>
    );
  }

  if (!currentDraft) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Draft not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isPublished = currentDraft.status === 'published';
  const isApproved = currentDraft.status === 'approved' || isPublished;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-bg-secondary p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-text-primary">
                {currentDraft.originalIdea}
              </h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(currentDraft.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(currentDraft.createdAt).toLocaleTimeString()}
                </span>
                <span className="flex items-center gap-1">
                  <Edit3 className="w-4 h-4" />
                  {currentDraft.revisionCount} revisions
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isPublished
                ? 'bg-success/20 text-success'
                : isApproved
                ? 'bg-green-600/20 text-green-400'
                : currentDraft.status === 'review'
                ? 'bg-accent/20 text-accent'
                : 'bg-gray-600/20 text-gray-400'
            }`}>
              {currentDraft.status}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {isApproved && formattedContent ? (
          <PlatformPreview
            content={formattedContent}
            onPublish={(platforms) => publishContent(platforms)}
            loading={loading}
          />
        ) : (
          <>
            <ContentEditor
              content={currentDraft.draftContent}
              onApprove={approveDraft}
              onRevise={reviseContent}
              revisionCount={currentDraft.revisionCount}
              status={currentDraft.status}
              loading={loading}
            />
            <div className="w-96">
              <ResearchPanel
                sources={sources}
                loading={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DraftDetail;