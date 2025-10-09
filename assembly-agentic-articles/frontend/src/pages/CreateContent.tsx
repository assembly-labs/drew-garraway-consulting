import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, Clock, Sparkles } from 'lucide-react';
import IdeaInput from '../components/IdeaInput/IdeaInput';
import ResearchPanel from '../components/ResearchPanel/ResearchPanel';
import ContentEditor from '../components/Editor/ContentEditor';
import PlatformPreview from '../components/PlatformPreview/PlatformPreview';
import SourceSelectionCard from '../components/ResearchPanel/SourceSelectionCard';
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
    selectedSourceIds,
    researchRetryCount,
    canRetryResearch,
    createDraft,
    reviseContent,
    approveDraft,
    publishContent,
    selectSources,
    generateContentFromSelection,
    skipSourceSelection,
    retryResearch,
    reset
  } = useContentStore();

  useEffect(() => {
    // Reset store when component mounts
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Auto-progress through workflow based on status
    if (status === 'idle' && currentDraft) {
      // REMOVED: Auto-progress from research to edit
      // Now user must manually select sources and trigger generation

      if (currentDraft.status === 'approved' && currentStep === 'edit') {
        setCurrentStep('preview');
      }
    }
  }, [status, currentDraft, currentStep]);

  const handleIdeaSubmit = async (idea: string) => {
    setCurrentStep('research'); // Move to research step immediately
    await createDraft(idea); // This will auto-trigger research
  };

  const handleApprove = async () => {
    setCurrentStep('preview'); // Move to preview step immediately
    await approveDraft(); // This will auto-trigger formatting
  };

  const handlePublish = async (platforms: string[]) => {
    await publishContent(platforms);
    // Navigate to dashboard or show success message
    navigate('/dashboard');
  };

  // NEW HANDLERS for source selection

  const handleSourceToggle = (sourceId: string) => {
    const newSelection = selectedSourceIds.includes(sourceId)
      ? selectedSourceIds.filter(id => id !== sourceId)
      : [...selectedSourceIds, sourceId];

    selectSources(newSelection);
  };

  const handleSelectHighCredibility = () => {
    const highCredSources = sources
      .filter(s => s.credibilityScore >= 8)
      .map(s => s.id);

    if (highCredSources.length < 3) {
      alert(`Only ${highCredSources.length} high-credibility sources found. Please select additional sources or use "Find More Sources".`);
      selectSources(highCredSources); // Still select them
    } else {
      selectSources(highCredSources);
    }
  };

  const handleSelectAcademic = () => {
    const academicSources = sources
      .filter(s => s.sourceType === 'academic')
      .map(s => s.id);

    if (academicSources.length < 3) {
      alert(`Only ${academicSources.length} academic sources found. Please select additional sources or use "Find More Sources".`);
      selectSources(academicSources);
    } else {
      selectSources(academicSources);
    }
  };

  const handleSelectAll = () => {
    const allSourceIds = sources.map(s => s.id);
    selectSources(allSourceIds);
  };

  const handleDeselectAll = () => {
    selectSources([]);
  };

  const handleSkipSelection = async () => {
    if (window.confirm('Skip source selection and generate article using all sources?')) {
      await skipSourceSelection();
      setCurrentStep('edit'); // Move to edit after generation
    }
  };

  const handleGenerateFromSelection = async () => {
    if (selectedSourceIds.length < 3) {
      alert('Please select at least 3 sources to continue');
      return;
    }

    await generateContentFromSelection();
    setCurrentStep('edit'); // Move to edit after generation
  };

  const handleRetryResearch = async () => {
    await retryResearch();
  };

  // Helper functions for analytics

  const calculateAvgCredibility = (): number => {
    if (selectedSourceIds.length === 0) return 0;

    const selectedSources = sources.filter(s => selectedSourceIds.includes(s.id));
    const sum = selectedSources.reduce((acc, s) => acc + s.credibilityScore, 0);
    return sum / selectedSources.length;
  };

  const getSelectedSourcesByType = (type: string): number => {
    return sources.filter(s =>
      selectedSourceIds.includes(s.id) && s.sourceType === type
    ).length;
  };

  const getSelectedSourcesByYear = (year: number): number => {
    return sources.filter(s => {
      if (!selectedSourceIds.includes(s.id)) return false;
      if (!s.publicationDate) return false;
      return new Date(s.publicationDate).getFullYear() === year;
    }).length;
  };

  const getSelectedSourcesOlderThan = (year: number): number => {
    return sources.filter(s => {
      if (!selectedSourceIds.includes(s.id)) return false;
      if (!s.publicationDate) return false;
      return new Date(s.publicationDate).getFullYear() < year;
    }).length;
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
      <div className="flex-1 flex overflow-hidden bg-bg-primary">
        {/* Content Panel */}
        <div className="flex-1 flex relative">
          {currentStep === 'idea' && (
            <div className="absolute inset-0 flex items-center justify-center p-8 bg-bg-primary z-10">
              <IdeaInput
                onSubmit={handleIdeaSubmit}
                loading={loading || status === 'researching'}
              />
            </div>
          )}

          {currentStep === 'research' && (
            <div className="absolute inset-0 flex bg-bg-primary z-10">
              {/* LOADING STATE - Researching */}
              {status === 'researching' && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="spinner w-16 h-16 mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {researchRetryCount > 0 ? 'Finding More Sources' : 'Researching Your Topic'}
                    </h3>
                    <p className="text-text-secondary">
                      {researchRetryCount > 0
                        ? 'Searching for additional credible sources...'
                        : 'Finding credible sources... This takes 2-3 minutes'
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* LOADING STATE - Generating after selection */}
              {status === 'generating' && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="spinner w-16 h-16 mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Generating Content
                    </h3>
                    <p className="text-text-secondary">
                      Creating your article with {selectedSourceIds.length} selected sources... This takes 1-2 minutes
                    </p>
                  </div>
                </div>
              )}

              {/* SOURCE SELECTION INTERFACE */}
              {status === 'idle' && sources.length > 0 && (
                <>
                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-border bg-bg-secondary">
                      <h2 className="text-2xl font-bold text-text-primary mb-2">
                        Review Research Results
                      </h2>
                      <p className="text-text-secondary mb-6">
                        Select the sources that best support your idea. We'll generate your article using only the selected sources.
                      </p>

                      {/* Selection Summary Bar */}
                      <div className="bg-surface rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between">
                          {/* Left: Count */}
                          <div>
                            <span className={`text-lg font-semibold ${
                              selectedSourceIds.length >= 3 ? 'text-success' : 'text-warning'
                            }`}>
                              {selectedSourceIds.length} of {sources.length} sources selected
                            </span>
                            <p className="text-sm text-text-secondary mt-1">
                              {selectedSourceIds.length < 3
                                ? `Select ${3 - selectedSourceIds.length} more (minimum 3 required)`
                                : '✓ Ready to generate'
                              }
                            </p>
                          </div>

                          {/* Right: Action Buttons */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleSkipSelection}
                              className="btn btn-secondary"
                              disabled={loading}
                            >
                              Skip Selection (Use All)
                            </button>

                            <button
                              onClick={handleGenerateFromSelection}
                              disabled={selectedSourceIds.length < 3 || loading}
                              className="btn btn-primary btn-lg"
                              title={selectedSourceIds.length < 3 ? 'Select at least 3 sources to continue' : 'Generate article with selected sources'}
                            >
                              Generate Article →
                            </button>
                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                          <span className="text-sm text-text-secondary mr-2">Quick select:</span>

                          <button
                            onClick={handleSelectHighCredibility}
                            className="btn btn-sm btn-outline"
                            disabled={loading}
                          >
                            🟢 High Credibility (8+)
                          </button>

                          <button
                            onClick={handleSelectAcademic}
                            className="btn btn-sm btn-outline"
                            disabled={loading}
                          >
                            📚 Academic Only
                          </button>

                          <button
                            onClick={handleSelectAll}
                            className="btn btn-sm btn-outline"
                            disabled={loading}
                          >
                            ✓ Select All
                          </button>

                          <button
                            onClick={handleDeselectAll}
                            className="btn btn-sm btn-outline"
                            disabled={loading}
                          >
                            ✗ Deselect All
                          </button>

                          {/* Find More Sources */}
                          <div className="ml-auto">
                            <button
                              onClick={handleRetryResearch}
                              disabled={!canRetryResearch || loading}
                              className="btn btn-sm btn-outline"
                              title={!canRetryResearch ? 'Maximum research attempts (2) reached' : 'Find additional sources'}
                            >
                              🔍 Find More Sources
                              {researchRetryCount > 0 && ` (${researchRetryCount}/2)`}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Source Cards Grid */}
                    <div className="flex-1 overflow-y-auto p-8">
                      <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
                        {sources.map((source, index) => (
                          <SourceSelectionCard
                            key={source.id}
                            source={source}
                            index={index}
                            selected={selectedSourceIds.includes(source.id)}
                            onToggle={handleSourceToggle}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar - Research Quality Metrics */}
                  <div className="w-96 bg-bg-secondary border-l border-border overflow-y-auto">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">
                        Research Quality
                      </h3>

                      {/* Average Credibility */}
                      <div className="bg-surface rounded-lg p-4 mb-4 border border-border">
                        <div className="text-sm text-text-secondary mb-2">Average Credibility</div>
                        <div className="flex items-baseline gap-2">
                          <div className={`text-3xl font-bold ${
                            selectedSourceIds.length === 0
                              ? 'text-text-secondary'
                              : calculateAvgCredibility() >= 8
                                ? 'text-success'
                                : calculateAvgCredibility() >= 6
                                  ? 'text-warning'
                                  : 'text-error'
                          }`}>
                            {selectedSourceIds.length === 0
                              ? '--'
                              : calculateAvgCredibility().toFixed(1)
                            }
                          </div>
                          <span className="text-lg text-text-secondary">/10</span>
                        </div>
                        {selectedSourceIds.length > 0 && calculateAvgCredibility() < 7 && (
                          <p className="text-xs text-warning mt-2">
                            ⚠️ Consider selecting higher-quality sources
                          </p>
                        )}
                      </div>

                      {/* Source Type Breakdown */}
                      <div className="bg-surface rounded-lg p-4 mb-4 border border-border">
                        <div className="text-sm text-text-secondary mb-3">Selected Source Types</div>
                        <div className="space-y-2">
                          {['academic', 'industry', 'news', 'blog'].map(type => {
                            const count = getSelectedSourcesByType(type);
                            const total = sources.filter(s => s.sourceType === type).length;
                            return (
                              <div key={type} className="flex items-center justify-between text-sm">
                                <span className="capitalize text-text-primary">{type}</span>
                                <span className={`font-semibold ${count > 0 ? 'text-accent' : 'text-text-secondary'}`}>
                                  {count}/{total}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recency Check */}
                      <div className="bg-surface rounded-lg p-4 mb-4 border border-border">
                        <div className="text-sm text-text-secondary mb-2">Source Recency</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-text-primary">2024 sources</span>
                            <span className="font-semibold text-success">
                              {getSelectedSourcesByYear(2024)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-primary">2023 sources</span>
                            <span className="font-semibold text-text-secondary">
                              {getSelectedSourcesByYear(2023)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-primary">Older</span>
                            <span className="font-semibold text-warning">
                              {getSelectedSourcesOlderThan(2023)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                        <div className="text-sm font-semibold text-accent mb-2">💡 Selection Tips</div>
                        <ul className="text-sm text-text-primary space-y-2">
                          <li>• Mix academic and industry sources for balanced perspectives</li>
                          <li>• Prioritize sources with credibility 8+ for authoritative content</li>
                          <li>• Include recent sources (2024) for timeliness</li>
                          <li>• At least 3 sources required for comprehensive coverage</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Error State */}
              {status === 'error' && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="text-error text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Research Failed
                    </h3>
                    <p className="text-text-secondary mb-4">
                      {error || 'An error occurred during research'}
                    </p>
                    <button
                      onClick={() => reset()}
                      className="btn btn-primary"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'edit' && (
            <div className="absolute inset-0 flex bg-bg-primary z-10">
              <ContentEditor
                content={currentDraft?.draftContent || null}
                onApprove={handleApprove}
                onRevise={reviseContent}
                revisionCount={currentDraft?.revisionCount || 0}
                status={currentDraft?.status || 'draft'}
                loading={status === 'generating' || status === 'revising'}
              />
              <div className="w-96 bg-bg-secondary border-l border-border overflow-y-auto">
                <ResearchPanel
                  sources={sources}
                  loading={false}
                />
              </div>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="absolute inset-0 bg-bg-primary z-10">
              <PlatformPreview
                content={formattedContent}
                onPublish={handlePublish}
                loading={status === 'formatting'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContent;