// Career-related keywords for client-side filtering
const CAREER_KEYWORDS = [
  'experience', 'work', 'job', 'role', 'project', 'skill', 'education',
  'company', 'team', 'manage', 'build', 'develop', 'lead', 'career',
  'position', 'responsibility', 'achievement', 'tech', 'business',
  'product', 'manager', 'engineer', 'developer', 'design', 'strategy',
  'client', 'software', 'app', 'website', 'launch', 'agile', 'scrum',
  'tesla', 'apple', 'google', 'samsung', 'lexus', 'subaru', 'dakota',
  'dreamworks', 'beyond meat', 'fortress', 'assembly labs', 'paybyplate',
  'where', 'when', 'what', 'how', 'why', 'who', 'worked', 'did',
  'degree', 'certification', 'university', 'college', 'trained'
];

// Check if message is career-related
function isCareerRelated(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CAREER_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

// Get Cloudflare Worker URL from environment
const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function queryCareerBot(
  userMessage: string,
  resumeContent: string,
  conversationHistory: Message[] = []
): Promise<string> {
  // Client-side keyword filter - redirect immediately if off-topic
  if (!isCareerRelated(userMessage)) {
    return "I only discuss Drew's career. Ask me about his experience, skills, or projects!";
  }

  try {
    // Only send last 10 messages to save tokens
    const recentHistory = conversationHistory.slice(-10);

    // Call Cloudflare Worker (which proxies to Anthropic)
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: recentHistory,
        resumeContent: resumeContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response');
    }

    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to get response. Please try again.');
  }
}
