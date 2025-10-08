import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, Clock, Sparkles } from 'lucide-react';
import IdeaInput from '../components/IdeaInput/IdeaInput';
import ResearchPanel from '../components/ResearchPanel/ResearchPanel';
import ContentEditor from '../components/Editor/ContentEditor';
import PlatformPreview from '../components/PlatformPreview/PlatformPreview';
import useContentStore from '../store/contentStore';

type WorkflowStep = 'idea' | 'research' | 'edit' | 'preview';

const CreateContent: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('idea');

  const {
    currentDraft,
    sources,
    formattedContent,
    status,
    error,
    loading,
    createDraft,
    generateContent,
    reviseContent,
    approveDraft,
    formatContent,
    publishContent,
    reset
  } = useContentStore();

  useEffect(() => {
    // Reset store when component mounts
    reset();
  }, []);

  useEffect(() => {
    // Auto-progress through workflow based on status
    if (status === 'idle' && currentDraft) {
      if (currentDraft.status === 'review' && currentStep === 'research') {
        setCurrentStep('edit');
      } else if (currentDraft.status === 'approved' && currentStep === 'edit') {
        setCurrentStep('preview');
      }
    }
  }, [status, currentDraft, currentStep]);

  const handleIdeaSubmit = async (idea: string) => {
    await createDraft(idea);
    setCurrentStep('research');
  };

  const handleApprove = async () => {
    await approveDraft();
    setCurrentStep('preview');
  };

  const handlePublish = async (platforms: string[]) => {
    await publishContent(platforms);
    // Navigate to dashboard or show success message
    navigate('/dashboard');
  };

  const steps = [
    { id: 'idea', label: 'Idea', icon: Sparkles },
    { id: 'research', label: 'Research', icon: Clock },
    { id: 'edit', label: 'Edit', icon: CheckCircle },
    { id: 'preview', label: 'Preview', icon: ChevronRight }
  ];

  const getStepIndex = (step: WorkflowStep) => {
    return steps.findIndex(s => s.id === step);
  };

  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      {/* Progress Bar */}
      <div className="border-b border-border bg-bg-secondary">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-accent text-white'
                          : isComplete
                          ? 'bg-success text-white'
                          : 'bg-surface text-text-secondary'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`ml-3 font-medium ${
                        isActive
                          ? 'text-text-primary'
                          : isComplete
                          ? 'text-success'
                          : 'text-text-secondary'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-surface rounded">
                        <div
                          className={`h-1 rounded transition-all duration-500 ${
                            isComplete ? 'bg-success w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Status Message */}
          {status !== 'idle' && (
            <div className="flex items-center gap-2 text-sm">
              {status === 'researching' && (
                <>
                  <div className="spinner w-4 h-4"></div>
                  <span className="text-accent">Conducting research...</span>
                </>
              )}
              {status === 'generating' && (
                <>
                  <div className="spinner w-4 h-4"></div>
                  <span className="text-accent">Generating content...</span>
                </>
              )}
              {status === 'revising' && (
                <>
                  <div className="spinner w-4 h-4"></div>
                  <span className="text-accent">Revising content...</span>
                </>
              )}
              {status === 'formatting' && (
                <>
                  <div className="spinner w-4 h-4"></div>
                  <span className="text-accent">Formatting for platforms...</span>
                </>
              )}
              {status === 'error' && (
                <span className="text-error">Error: {error}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content Panel */}
        <div className="flex-1 flex">
          {currentStep === 'idea' && (
            <div className="flex-1 flex items-center justify-center p-8">
              <IdeaInput
                onSubmit={handleIdeaSubmit}
                loading={loading || status === 'researching'}
              />
            </div>
          )}

          {currentStep === 'research' && (
            <>
              <div className="flex-1 flex items-center justify-center">
                {status === 'researching' ? (
                  <div className="text-center">
                    <div className="spinner w-16 h-16 mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Researching Your Topic
                    </h3>
                    <p className="text-text-secondary">
                      Finding credible sources... This takes 2-3 minutes
                    </p>
                  </div>
                ) : status === 'generating' ? (
                  <div className="text-center">
                    <div className="spinner w-16 h-16 mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Generating Content
                    </h3>
                    <p className="text-text-secondary">
                      Creating your article with citations... This takes 1-2 minutes
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Research Complete!
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Found {sources.length} credible sources
                    </p>
                    <button
                      onClick={() => setCurrentStep('edit')}
                      className="btn btn-primary"
                    >
                      View Content
                    </button>
                  </div>
                )}
              </div>
              <div className="w-96">
                <ResearchPanel
                  sources={sources}
                  loading={status === 'researching'}
                />
              </div>
            </>
          )}

          {currentStep === 'edit' && (
            <>
              <ContentEditor
                content={currentDraft?.draftContent || null}
                onApprove={handleApprove}
                onRevise={reviseContent}
                revisionCount={currentDraft?.revisionCount || 0}
                status={currentDraft?.status || 'draft'}
                loading={status === 'generating' || status === 'revising'}
              />
              <div className="w-96">
                <ResearchPanel
                  sources={sources}
                  loading={false}
                />
              </div>
            </>
          )}

          {currentStep === 'preview' && (
            <PlatformPreview
              content={formattedContent}
              onPublish={handlePublish}
              loading={loading || status === 'formatting'}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContent;