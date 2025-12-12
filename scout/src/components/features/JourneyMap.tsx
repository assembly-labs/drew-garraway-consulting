import React from 'react';
import { KnowledgeJourney } from '../../utils/journeyBuilder';
import { formatItemCreator } from '../../utils/formatters';

interface JourneyMapProps {
  journey: KnowledgeJourney;
  onMaterialClick?: (materialId: string) => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ journey, onMaterialClick }) => {
  const getMaterialIcon = (itemType: string) => {
    switch (itemType) {
      case 'book': return '📚';
      case 'dvd': return '📀';
      case 'thing':
      case 'equipment': return '🔧';
      case 'game': return '🎮';
      case 'comic': return '📖';
      case 'kit': return '📦';
      default: return '📦';
    }
  };

  return (
    <div className="journey-map bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="journey-header mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {journey.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{journey.goal}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
            {journey.difficulty}
          </span>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
            ⏱️ {journey.estimatedTime}
          </span>
          {journey.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="journey-timeline relative">
        {journey.stages.map((stage, stageIndex) => (
          <div key={stageIndex} className="stage-container mb-8 relative">
            {/* Timeline connector */}
            {stageIndex < journey.stages.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-purple-200 dark:from-purple-600 dark:to-purple-800"></div>
            )}

            {/* Stage marker */}
            <div className="flex items-start gap-4">
              <div className="stage-marker flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {stageIndex + 1}
              </div>

              {/* Stage content */}
              <div className="stage-content flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {stage.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {stage.description}
                </p>

                {stage.estimatedTime && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    ⏱️ {stage.estimatedTime}
                  </p>
                )}

                {/* Skills to develop */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Skills you'll develop:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {stage.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Materials for this stage */}
                {stage.materials && stage.materials.length > 0 && (
                  <div className="materials-grid mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Recommended materials:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stage.materials.map((material) => (
                        <div
                          key={material.id}
                          className="material-card flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => onMaterialClick?.(material.id)}
                        >
                          <span className="text-2xl">
                            {getMaterialIcon(material.itemType)}
                          </span>
                          <div className="flex-grow min-w-0">
                            <h5 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                              {material.title}
                            </h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatItemCreator(material)}
                            </p>
                            {material.formats && material.formats[0] && (
                              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                                material.formats[0].status === 'available'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {material.formats[0].status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next steps */}
                {stage.nextSteps && stage.nextSteps.length > 0 && (
                  <div className="next-steps">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Next steps:
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {stage.nextSteps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">→</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Journey completion message */}
      <div className="journey-completion mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
        <p className="text-center text-gray-700 dark:text-gray-300">
          🎉 <span className="font-semibold">Ready to start your journey?</span> Check out the first material and begin learning!
        </p>
      </div>
    </div>
  );
};