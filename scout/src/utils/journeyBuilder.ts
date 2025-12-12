import { CatalogItem } from '../types';
import { semanticSearch } from './semanticSearch';
import { PatronIntent } from './intentAnalyzer';

export interface JourneyStage {
  name: string;
  description: string;
  materials: CatalogItem[];
  skills: string[];
  nextSteps: string[];
  estimatedTime?: string;
}

export interface KnowledgeJourney {
  id: string;
  title: string;
  goal: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  stages: JourneyStage[];
  tags: string[];
}

// Predefined learning journeys
const PREDEFINED_JOURNEYS: Record<string, KnowledgeJourney> = {
  'iot-beginner': {
    id: 'iot-beginner',
    title: 'Start Your IoT Journey',
    goal: 'Build your first Internet of Things device',
    estimatedTime: '4-6 weeks',
    difficulty: 'beginner',
    stages: [
      {
        name: 'Foundation',
        description: 'Understand IoT concepts and possibilities',
        materials: [], // Will be populated dynamically
        skills: ['Basic electronics', 'IoT concepts', 'Smart device awareness'],
        nextSteps: ['Choose your first project', 'Get familiar with components'],
        estimatedTime: '1 week'
      },
      {
        name: 'Hands-On Learning',
        description: 'Build your first connected device',
        materials: [],
        skills: ['Arduino programming', 'Sensor integration', 'WiFi connectivity'],
        nextSteps: ['Expand your project', 'Add cloud connectivity'],
        estimatedTime: '2-3 weeks'
      },
      {
        name: 'Advanced Projects',
        description: 'Create real-world IoT applications',
        materials: [],
        skills: ['Data visualization', 'Automation', 'System integration'],
        nextSteps: ['Share your project', 'Join maker community'],
        estimatedTime: '1-2 weeks'
      }
    ],
    tags: ['technology', 'maker', 'programming', 'electronics']
  },

  'stress-relief': {
    id: 'stress-relief',
    title: 'Your Stress Relief Toolkit',
    goal: 'Develop effective stress management techniques',
    estimatedTime: '2-4 weeks',
    difficulty: 'beginner',
    stages: [
      {
        name: 'Understanding Stress',
        description: 'Learn about stress and its effects',
        materials: [],
        skills: ['Self-awareness', 'Stress recognition', 'Mindfulness basics'],
        nextSteps: ['Track your stress triggers', 'Practice daily mindfulness'],
        estimatedTime: '3-5 days'
      },
      {
        name: 'Active Techniques',
        description: 'Engage in stress-reducing activities',
        materials: [],
        skills: ['Meditation', 'Creative expression', 'Physical relaxation'],
        nextSteps: ['Establish daily practice', 'Find your preferred method'],
        estimatedTime: '1-2 weeks'
      },
      {
        name: 'Long-term Management',
        description: 'Build sustainable stress management habits',
        materials: [],
        skills: ['Habit formation', 'Resilience', 'Work-life balance'],
        nextSteps: ['Maintain practices', 'Help others with techniques'],
        estimatedTime: 'Ongoing'
      }
    ],
    tags: ['mental health', 'wellness', 'self-care', 'mindfulness']
  },

  'home-chef': {
    id: 'home-chef',
    title: 'Become a Home Chef',
    goal: 'Master cooking fundamentals and create restaurant-quality meals',
    estimatedTime: '8-12 weeks',
    difficulty: 'beginner',
    stages: [
      {
        name: 'Kitchen Basics',
        description: 'Master fundamental techniques and tools',
        materials: [],
        skills: ['Knife skills', 'Basic techniques', 'Kitchen safety'],
        nextSteps: ['Practice daily', 'Organize your kitchen'],
        estimatedTime: '2 weeks'
      },
      {
        name: 'Flavor Development',
        description: 'Understand how to build and balance flavors',
        materials: [],
        skills: ['Seasoning', 'Flavor pairing', 'Recipe adaptation'],
        nextSteps: ['Experiment with cuisines', 'Create your own recipes'],
        estimatedTime: '3-4 weeks'
      },
      {
        name: 'Advanced Techniques',
        description: 'Learn professional cooking methods',
        materials: [],
        skills: ['Sauces', 'Plating', 'Time management'],
        nextSteps: ['Host dinner parties', 'Continue exploring'],
        estimatedTime: '3-6 weeks'
      }
    ],
    tags: ['cooking', 'culinary', 'food', 'skills']
  },

  'python-programming': {
    id: 'python-programming',
    title: 'Learn Python Programming',
    goal: 'Go from zero to building real applications',
    estimatedTime: '10-12 weeks',
    difficulty: 'beginner',
    stages: [
      {
        name: 'Python Basics',
        description: 'Learn syntax and fundamental concepts',
        materials: [],
        skills: ['Variables', 'Functions', 'Control flow', 'Data structures'],
        nextSteps: ['Write simple programs', 'Practice daily'],
        estimatedTime: '3-4 weeks'
      },
      {
        name: 'Practical Projects',
        description: 'Build real-world applications',
        materials: [],
        skills: ['File handling', 'APIs', 'Libraries', 'Debugging'],
        nextSteps: ['Create portfolio projects', 'Contribute to open source'],
        estimatedTime: '4-5 weeks'
      },
      {
        name: 'Specialization',
        description: 'Choose your Python path',
        materials: [],
        skills: ['Web development or Data science or Automation'],
        nextSteps: ['Build complex projects', 'Learn frameworks'],
        estimatedTime: '3-4 weeks'
      }
    ],
    tags: ['programming', 'technology', 'coding', 'software']
  },

  'home-repair': {
    id: 'home-repair',
    title: 'DIY Home Repair Master',
    goal: 'Handle common home repairs confidently',
    estimatedTime: '4-6 weeks',
    difficulty: 'beginner',
    stages: [
      {
        name: 'Tool Familiarity',
        description: 'Learn to use essential tools safely',
        materials: [],
        skills: ['Tool identification', 'Safety procedures', 'Basic measurements'],
        nextSteps: ['Organize toolbox', 'Practice on scrap materials'],
        estimatedTime: '1 week'
      },
      {
        name: 'Common Repairs',
        description: 'Master frequent household fixes',
        materials: [],
        skills: ['Plumbing basics', 'Electrical safety', 'Wall repairs', 'Painting'],
        nextSteps: ['Fix something in your home', 'Help neighbors'],
        estimatedTime: '2-3 weeks'
      },
      {
        name: 'Advanced Projects',
        description: 'Take on bigger home improvement tasks',
        materials: [],
        skills: ['Planning', 'Budgeting', 'Project management'],
        nextSteps: ['Plan a room renovation', 'Learn specialized skills'],
        estimatedTime: '2 weeks'
      }
    ],
    tags: ['diy', 'repair', 'home improvement', 'tools']
  }
};

/**
 * Generates a knowledge journey based on user query and intent
 */
export function generateJourney(
  query: string,
  catalog: CatalogItem[],
  intent: PatronIntent
): KnowledgeJourney | null {
  const queryLower = query.toLowerCase();

  // Check for matching predefined journey
  let selectedJourney: KnowledgeJourney | null = null;

  if (queryLower.includes('iot') || queryLower.includes('internet of things') || queryLower.includes('arduino')) {
    selectedJourney = { ...PREDEFINED_JOURNEYS['iot-beginner'] };
  } else if (queryLower.includes('stress') || queryLower.includes('anxiety') || queryLower.includes('mental health')) {
    selectedJourney = { ...PREDEFINED_JOURNEYS['stress-relief'] };
  } else if (queryLower.includes('cook') || queryLower.includes('chef') || queryLower.includes('culinary')) {
    selectedJourney = { ...PREDEFINED_JOURNEYS['home-chef'] };
  } else if (queryLower.includes('python') || queryLower.includes('programming') && queryLower.includes('learn')) {
    selectedJourney = { ...PREDEFINED_JOURNEYS['python-programming'] };
  } else if (queryLower.includes('repair') || queryLower.includes('fix') || queryLower.includes('diy')) {
    selectedJourney = { ...PREDEFINED_JOURNEYS['home-repair'] };
  }

  if (!selectedJourney) {
    // Generate a dynamic journey based on intent
    selectedJourney = createDynamicJourney(query, intent);
  }

  // Populate materials for each stage
  if (selectedJourney) {
    selectedJourney.stages.forEach((stage) => {
      // Search for relevant materials for this stage
      const stageQuery = `${selectedJourney!.tags.join(' ')} ${stage.skills.join(' ')}`;
      const materials = semanticSearch(stageQuery, catalog, 3, intent);

      // Ensure diversity in material types
      const diverseMaterials = ensureMaterialDiversity(materials, catalog, stageQuery);
      stage.materials = diverseMaterials;
    });
  }

  return selectedJourney;
}

/**
 * Creates a dynamic journey based on user intent
 */
function createDynamicJourney(query: string, intent: PatronIntent): KnowledgeJourney {
  const title = intent.primary === 'learn' ? `Learn ${query}` :
                intent.primary === 'solve' ? `Solve: ${query}` :
                intent.primary === 'create' ? `Create with ${query}` :
                intent.primary === 'explore' ? `Explore ${query}` :
                `Your ${query} Journey`;

  return {
    id: `dynamic-${Date.now()}`,
    title,
    goal: `Master the essentials of ${query}`,
    estimatedTime: '2-4 weeks',
    difficulty: intent.journeyStage as KnowledgeJourney['difficulty'],
    stages: [
      {
        name: 'Getting Started',
        description: 'Build your foundation',
        materials: [],
        skills: ['Basic concepts', 'Essential tools', 'Safety'],
        nextSteps: ['Practice basics', 'Join community'],
        estimatedTime: '1 week'
      },
      {
        name: 'Skill Building',
        description: 'Develop core competencies',
        materials: [],
        skills: ['Practical application', 'Problem solving'],
        nextSteps: ['Complete projects', 'Get feedback'],
        estimatedTime: '1-2 weeks'
      },
      {
        name: 'Mastery',
        description: 'Advanced techniques and creativity',
        materials: [],
        skills: ['Advanced skills', 'Creative application'],
        nextSteps: ['Share knowledge', 'Continue learning'],
        estimatedTime: 'Ongoing'
      }
    ],
    tags: query.toLowerCase().split(' ').filter(t => t.length > 3)
  };
}

/**
 * Ensures diversity in material types for a better learning experience
 */
function ensureMaterialDiversity(
  materials: CatalogItem[],
  catalog: CatalogItem[],
  query: string
): CatalogItem[] {
  const result: CatalogItem[] = [];
  const typesIncluded = new Set<string>();

  // Add existing materials
  materials.forEach(item => {
    if (result.length < 3) {
      result.push(item);
      typesIncluded.add(item.itemType);
    }
  });

  // If we don't have enough diversity, search for other types
  if (typesIncluded.size < 2 && result.length < 3) {
    const preferredTypes = ['book', 'dvd', 'thing', 'equipment', 'kit'];

    for (const type of preferredTypes) {
      if (!typesIncluded.has(type) && result.length < 3) {
        const additionalItem = catalog.find(item =>
          item.itemType === type &&
          (item.description.toLowerCase().includes(query.toLowerCase()) ||
           ('subjects' in item && item.subjects &&
            item.subjects.some((s: string) => query.toLowerCase().includes(s.toLowerCase()))))
        );

        if (additionalItem && !result.some(r => r.id === additionalItem.id)) {
          result.push(additionalItem);
          typesIncluded.add(type);
        }
      }
    }
  }

  return result.slice(0, 4); // Return maximum 4 items per stage
}

/**
 * Gets journey recommendations based on user history or interests
 */
export function recommendJourneys(userInterests: string[]): KnowledgeJourney[] {
  const recommendations: KnowledgeJourney[] = [];

  userInterests.forEach(interest => {
    const interestLower = interest.toLowerCase();

    Object.values(PREDEFINED_JOURNEYS).forEach(journey => {
      if (journey.tags.some(tag => interestLower.includes(tag) || tag.includes(interestLower))) {
        if (!recommendations.some(r => r.id === journey.id)) {
          recommendations.push(journey);
        }
      }
    });
  });

  return recommendations.slice(0, 3); // Return top 3 recommendations
}