export interface PushMessage {
  id: string;
  text: string;
  voice: 'Jocko' | 'Goggins' | 'Arnold' | 'Stallone' | 'Bruce Lee' | 'Renzo' | 'Rickson' | 'Chuck';
  tone: 'supportive' | 'aggressive' | 'motivational' | 'humorous';
  context: string[];
}

export const pushMessages: PushMessage[] = [
  {
    id: 'msg-001',
    text: 'Stay hard! No time for weakness!',
    voice: 'Goggins',
    tone: 'aggressive',
    context: ['mid-workout', 'fatigue'],
  },
  {
    id: 'msg-002',
    text: 'Keep moving. Don\'t stop.',
    voice: 'Jocko',
    tone: 'supportive',
    context: ['mid-workout'],
  },
  {
    id: 'msg-003',
    text: 'Come on! One more! You got this!',
    voice: 'Arnold',
    tone: 'motivational',
    context: ['mid-workout', 'struggle'],
  },
  {
    id: 'msg-004',
    text: 'It ain\'t over. Keep punching.',
    voice: 'Stallone',
    tone: 'supportive',
    context: ['mid-workout', 'fatigue'],
  },
  {
    id: 'msg-005',
    text: 'Who\'s gonna carry the boats? You or someone else?',
    voice: 'Goggins',
    tone: 'aggressive',
    context: ['mid-workout', 'struggle'],
  },
  {
    id: 'msg-006',
    text: 'Breathe. Focus. Continue.',
    voice: 'Rickson',
    tone: 'supportive',
    context: ['rest', 'fatigue'],
  },
  {
    id: 'msg-007',
    text: 'Time to fight. Let\'s go.',
    voice: 'Renzo',
    tone: 'aggressive',
    context: ['mid-workout'],
  },
  {
    id: 'msg-008',
    text: 'The mind is the limit. Push through.',
    voice: 'Bruce Lee',
    tone: 'motivational',
    context: ['mid-workout', 'struggle'],
  },
  {
    id: 'msg-009',
    text: 'Chuck Norris never pauses. Neither should you.',
    voice: 'Chuck',
    tone: 'humorous',
    context: ['pause-warning'],
  },
  {
    id: 'msg-010',
    text: 'Get after it. No excuses.',
    voice: 'Jocko',
    tone: 'aggressive',
    context: ['start', 'mid-workout'],
  },
  {
    id: 'msg-011',
    text: 'Pain is temporary. Quit is forever.',
    voice: 'Goggins',
    tone: 'aggressive',
    context: ['fatigue', 'struggle'],
  },
  {
    id: 'msg-012',
    text: 'Your future self is watching!',
    voice: 'Arnold',
    tone: 'motivational',
    context: ['mid-workout'],
  },
  {
    id: 'msg-013',
    text: 'You didn\'t come this far to quit now!',
    voice: 'Stallone',
    tone: 'motivational',
    context: ['fatigue'],
  },
  {
    id: 'msg-014',
    text: 'Discipline equals freedom. Stay disciplined.',
    voice: 'Jocko',
    tone: 'motivational',
    context: ['mid-workout'],
  },
  {
    id: 'msg-015',
    text: 'Embrace the suck.',
    voice: 'Goggins',
    tone: 'aggressive',
    context: ['struggle'],
  },
];

export const getRandomMessage = (context?: string): PushMessage => {
  const filtered = context
    ? pushMessages.filter((msg) => msg.context.includes(context))
    : pushMessages;

  const messages = filtered.length > 0 ? filtered : pushMessages;
  return messages[Math.floor(Math.random() * messages.length)];
};
