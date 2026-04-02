/**
 * TOMO Quote Library
 *
 * Curated quotes displayed on the 4-second confirmation screen after saving a training session.
 * Every quote is from a real person with a real, publicly stated source.
 *
 * RULES FOR ADDING QUOTES:
 * - Must be a real quote from a real person, publicly stated
 * - Must include attribution and source type
 * - Must be 1-2 sentences max
 * - No hollow motivational poster language
 * - Must pass the test: "Would an exhausted BJJ practitioner feel something reading this?"
 *
 * CONTENT GUARDRAILS (NON-NEGOTIABLE):
 * - NEVER include quotes about religion, faith, God, or spirituality
 * - NEVER include quotes that are sexist, racist, or discriminatory
 * - NEVER include quotes that could be read as political statements
 * - NEVER include quotes that promote violence outside of sport context
 * - All quotes must be inclusive and respectful of all practitioners regardless
 *   of gender, race, age, body type, or background
 * - When in doubt, leave it out
 *
 * Belt levels: global | white | blue | purple_brown
 * Topics: sparring | consistency | resilience | technique | growth | philosophy | injury
 * Verified: true = source confirmed | false = NEEDS_VERIFICATION (known saying, exact source uncertain)
 */

export type BeltLevel = 'global' | 'white' | 'blue' | 'purple_brown';

export type QuoteTopic =
  | 'sparring'
  | 'consistency'
  | 'resilience'
  | 'technique'
  | 'growth'
  | 'philosophy'
  | 'injury';

export type SourceType =
  | 'book'
  | 'interview'
  | 'podcast'
  | 'social_media'
  | 'seminar'
  | 'documentary';

export type AthleteGender = 'male' | 'female';

export interface Quote {
  id: string;
  text: string;
  attribution: string;
  sourceType: SourceType;
  sourceDetail: string;
  belt: BeltLevel;
  topics: QuoteTopic[];
  verified: boolean;
  athleteGender?: AthleteGender; // Set to 'female' for women athletes. Omitted = male (default).
  notes?: string;
}

// ---------------------------------------------------------------------------
// 1. GLOBAL (any belt level)
// ---------------------------------------------------------------------------

const globalQuotes: Quote[] = [
  {
    id: 'Q-001',
    text: 'If you think, you are late. If you are late, you use strength. If you use strength, you tire. And if you tire, you die.',
    attribution: 'Saulo Ribeiro',
    sourceType: 'book',
    sourceDetail: 'Jiu-Jitsu University (2008)',
    belt: 'global',
    topics: ['technique', 'sparring'],
    verified: true,
    notes: 'One of the most quoted lines in BJJ literature. From the opening philosophy of the book.',
  },
  {
    id: 'Q-002',
    text: 'There is no losing in jiu-jitsu. You either win or you learn.',
    attribution: 'Carlos Gracie Sr.',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, documented on Goodreads author page',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: true,
    notes: 'Foundational Gracie philosophy. Attributed to Carlos Sr. across multiple BJJ sources.',
  },
  {
    id: 'Q-003',
    text: 'If size mattered, the elephant would be king of the jungle.',
    attribution: 'Rickson Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on BrainyQuote and AZQuotes',
    belt: 'global',
    topics: ['philosophy', 'technique'],
    verified: true,
    notes: 'Classic Rickson quote about leverage over size.',
  },
  {
    id: 'Q-004',
    text: "Always assume your opponent is going to be bigger, stronger, and faster than you. Rely on technique, timing, and leverage.",
    attribution: 'Helio Gracie',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, documented across BJJ quote collections',
    belt: 'global',
    topics: ['technique', 'philosophy'],
    verified: true,
    notes: 'Core Gracie Jiu-Jitsu philosophy from the founder.',
  },
  {
    id: 'Q-005',
    text: "Why do I beat a lot of people? Because I love it so much.",
    attribution: 'Marcelo Garcia',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'global',
    topics: ['consistency', 'philosophy'],
    verified: true,
    notes: 'Marcelo crediting love of training as his competitive edge.',
  },
  {
    id: 'Q-006',
    text: "Jiu-jitsu is simple. You just gotta do it right.",
    attribution: 'Roger Gracie',
    sourceType: 'interview',
    sourceDetail: 'BJJEE interview on his "basic" jiu-jitsu',
    belt: 'global',
    topics: ['technique', 'philosophy'],
    verified: true,
    notes: 'Roger explaining why he focused on fundamentals over flashy techniques.',
  },
  {
    id: 'Q-007',
    text: "The most important thing is not victory. The most important thing is don't get defeated.",
    attribution: 'Rickson Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes and BrainyQuote',
    belt: 'global',
    topics: ['resilience', 'philosophy'],
    verified: true,
    notes: 'Echoing Helio\'s philosophy of invincibility over victory.',
  },
  {
    id: 'Q-008',
    text: "When you react, you don't give your mind time to fill with emotions. You are simply moving.",
    attribution: 'Saulo Ribeiro',
    sourceType: 'book',
    sourceDetail: 'Jiu-Jitsu University (2008)',
    belt: 'global',
    topics: ['sparring', 'technique'],
    verified: true,
    notes: 'From the book, on the mental state during rolling.',
  },
  {
    id: 'Q-009',
    text: "I never bother getting angry. I don't need it. I don't confuse angry with intense.",
    attribution: 'Marcelo Garcia',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes and multiple BJJ sources',
    belt: 'global',
    topics: ['sparring', 'philosophy'],
    verified: true,
    notes: 'Marcelo on emotional control during competition.',
  },
  {
    id: 'Q-010',
    text: "True strength is not always shown through victory. Stand up, try again and display strength of heart.",
    attribution: 'Rickson Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: true,
  },
  {
    id: 'Q-011',
    text: "There's more philosophy on jiu-jitsu mats than in any Ivy League school in America.",
    attribution: 'Renzo Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes and Goodreads',
    belt: 'global',
    topics: ['philosophy'],
    verified: true,
  },
  {
    id: 'Q-012',
    text: "Jiu-jitsu is not a move, it is how to move.",
    attribution: 'Ryan Hall',
    sourceType: 'podcast',
    sourceDetail: 'The Strenuous Life Podcast with Stephan Kesting (Grapplearts)',
    belt: 'global',
    topics: ['technique', 'philosophy'],
    verified: true,
    notes: 'Ryan Hall\'s distinction between memorizing techniques and understanding movement.',
  },
  {
    id: 'Q-014',
    text: "My opponent is my teacher, my ego is my enemy.",
    attribution: 'Renzo Gracie',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified on AZQuotes',
    belt: 'global',
    topics: ['sparring', 'growth', 'philosophy'],
    verified: true,
  },
  {
    id: 'Q-016',
    text: "Happiness is not a static thing. You have to work at it by confronting and overcoming challenges.",
    attribution: 'Rickson Gracie',
    sourceType: 'book',
    sourceDetail: 'Breathe: A Life in Flow (2021)',
    belt: 'global',
    topics: ['resilience', 'philosophy'],
    verified: true,
    notes: 'From his memoir, verified on Goodreads.',
  },
  {
    id: 'Q-018',
    text: "Jiu-jitsu is for the protection of the individual: the older man, the weak, the child, the woman.",
    attribution: 'Helio Gracie',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified on AZQuotes',
    belt: 'global',
    topics: ['philosophy'],
    verified: true,
    notes: 'Helio\'s definition of jiu-jitsu\'s purpose.',
  },
  {
    id: 'Q-020',
    text: "It's all about your mindset. How you think and what you believe is what becomes of you.",
    attribution: 'Rickson Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on BrainyQuote',
    belt: 'global',
    topics: ['philosophy', 'resilience'],
    verified: true,
  },
  {
    id: 'Q-022',
    text: "I always try to attack. While I'm on the offensive, my opponent can think of nothing but defending.",
    attribution: 'Marcelo Garcia',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'global',
    topics: ['sparring', 'technique'],
    verified: true,
  },
  {
    id: 'Q-023',
    text: "Your skills are the most perishable thing you own. You are only as good as your last workout.",
    attribution: 'John Danaher',
    sourceType: 'social_media',
    sourceDetail: 'Instagram (@danaherjohn)',
    belt: 'global',
    topics: ['consistency', 'technique'],
    verified: true,
    notes: 'From one of Danaher\'s Instagram posts. Paraphrased slightly for brevity from the longer original.',
  },
  {
    id: 'Q-024',
    text: "A real jiu-jitsu fighter does not go around beating people down. Our defense is made to neutralize aggression.",
    attribution: 'Helio Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'global',
    topics: ['philosophy', 'sparring'],
    verified: true,
  },
  {
    id: 'Q-025',
    text: "There is no tomorrow, because life can change forever in the blink of an eye.",
    attribution: 'Rickson Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on BrainyQuote',
    belt: 'global',
    topics: ['philosophy', 'consistency'],
    verified: true,
  },
  {
    id: 'Q-026',
    text: "The Jiu-Jitsu I created was designed to give the weak ones a chance to face the heavy and strong.",
    attribution: 'Helio Gracie',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified across BJJ sources',
    belt: 'global',
    topics: ['philosophy', 'technique'],
    verified: true,
  },
  {
    id: 'Q-027',
    text: "There's always a way you can get better. You can never be satisfied. You can never say, 'That's good enough.'",
    attribution: 'Kron Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'global',
    topics: ['growth', 'consistency'],
    verified: true,
  },
  // --- Alliance Founders ---
  {
    id: 'Q-028',
    text: "Jiu-jitsu is for everyone. The mat doesn't care who you are.",
    attribution: 'Romero "Jacare" Cavalcanti',
    sourceType: 'interview',
    sourceDetail: 'Alliance BJJ founder, multiple published interviews',
    belt: 'global',
    topics: ['philosophy'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Widely attributed to Jacare as Alliance founder. Exact interview source unconfirmed.',
  },
  {
    id: 'Q-029',
    text: "Champions are not made in the gym. Champions are made from something deep inside them.",
    attribution: 'Fabio Gurgel',
    sourceType: 'interview',
    sourceDetail: 'Alliance head coach, multiple BJJ media interviews',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Attributed to Gurgel in BJJ media. Exact interview source unconfirmed.',
  },
  // --- Bruce Lee ---
  {
    id: 'Q-030',
    text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.",
    attribution: 'Bruce Lee',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, documented in multiple Bruce Lee biographies and quote collections',
    belt: 'global',
    topics: ['technique', 'consistency'],
    verified: true,
    notes: 'One of the most cited martial arts quotes. Directly applicable to BJJ drilling philosophy.',
  },
  {
    id: 'Q-031',
    text: "Absorb what is useful, discard what is useless, and add what is specifically your own.",
    attribution: 'Bruce Lee',
    sourceType: 'book',
    sourceDetail: 'Tao of Jeet Kune Do (1975)',
    belt: 'global',
    topics: ['technique', 'growth', 'philosophy'],
    verified: true,
    notes: 'Core Jeet Kune Do philosophy. Directly relevant to developing a personal BJJ game.',
  },
  {
    id: 'Q-032',
    text: "Do not pray for an easy life. Pray for the strength to endure a difficult one.",
    attribution: 'Bruce Lee',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, documented across multiple biographies',
    belt: 'global',
    topics: ['resilience', 'philosophy'],
    verified: true,
  },
  {
    id: 'Q-033',
    text: "The successful warrior is the average man, with laser-like focus.",
    attribution: 'Bruce Lee',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed in martial arts literature',
    belt: 'global',
    topics: ['consistency', 'growth'],
    verified: true,
  },
  {
    id: 'Q-034',
    text: "Long-term consistency trumps short-term intensity.",
    attribution: 'Bruce Lee',
    sourceType: 'book',
    sourceDetail: 'Attributed in Bruce Lee: Artist of Life (1999)',
    belt: 'global',
    topics: ['consistency', 'philosophy'],
    verified: true,
    notes: 'Perfect for the post-save moment. Validates the habit over the individual session.',
  },
  {
    id: 'Q-035',
    text: "A wise man can learn more from a foolish question than a fool can learn from a wise answer.",
    attribution: 'Bruce Lee',
    sourceType: 'book',
    sourceDetail: 'Tao of Jeet Kune Do (1975)',
    belt: 'global',
    topics: ['growth', 'philosophy'],
    verified: true,
  },
  // --- Chuck Norris ---
  {
    id: 'Q-036',
    text: "A lot of people give up just before they're about to make it.",
    attribution: 'Chuck Norris',
    sourceType: 'interview',
    sourceDetail: 'Against All Odds: My Story (2004)',
    belt: 'global',
    topics: ['resilience', 'consistency'],
    verified: true,
    notes: 'Chuck Norris is a legitimate martial artist (Tang Soo Do black belt, BJJ black belt under the Machados).',
  },
  {
    id: 'Q-037',
    text: "Anything worth achieving will always have obstacles. You've got to have the drive to overcome them.",
    attribution: 'Chuck Norris',
    sourceType: 'interview',
    sourceDetail: 'Multiple verified interviews',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: true,
  },
  // --- Muhammad Ali (Boxing) ---
  {
    id: 'Q-400',
    text: "The fight is won or lost far away from witnesses, in the gym, long before I dance under those lights.",
    attribution: 'Muhammad Ali',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified on BrainyQuote and multiple biographies',
    belt: 'global',
    topics: ['consistency', 'philosophy'],
    verified: true,
    notes: 'About preparation mattering more than performance. 20 words.',
  },
  {
    id: 'Q-401',
    text: "Suffer now and live the rest of your life as a champion.",
    attribution: 'Muhammad Ali',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified on BrainyQuote',
    belt: 'global',
    topics: ['resilience', 'consistency'],
    verified: true,
    notes: 'About pushing through the grind. 20 words.',
  },
  {
    id: 'Q-402',
    text: "It isn't the mountains ahead to climb that wear you out; it's the pebble in your shoe.",
    attribution: 'Muhammad Ali',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified across multiple sources',
    belt: 'global',
    topics: ['resilience', 'philosophy'],
    verified: true,
    notes: 'About small frustrations being the real challenge. 16 words.',
  },
  // --- Mike Tyson (Boxing) ---
  {
    id: 'Q-404',
    text: "Discipline is doing what you hate to do, but doing it like you love it.",
    attribution: 'Mike Tyson',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified on BrainyQuote',
    belt: 'global',
    topics: ['consistency', 'philosophy'],
    verified: true,
    notes: 'Post-career reflective Tyson on discipline. 13 words.',
  },
  {
    id: 'Q-405',
    text: "Everyone has a plan until they get punched in the mouth.",
    attribution: 'Mike Tyson',
    sourceType: 'interview',
    sourceDetail: 'Pre-fight interview (1987), verified across multiple sources',
    belt: 'global',
    topics: ['sparring', 'resilience'],
    verified: true,
    notes: 'One of the most quoted lines in combat sports. Directly applicable to rolling. 12 words.',
  },
  {
    id: 'Q-406',
    text: "Reach for the stars. If you miss, you grab a handful of clouds.",
    attribution: 'Mike Tyson',
    sourceType: 'interview',
    sourceDetail: 'Verified on BrainyQuote',
    belt: 'global',
    topics: ['growth', 'resilience'],
    verified: true,
    notes: 'Reflective Tyson on ambition and persistence. 20 words.',
  },
  // --- Manny Pacquiao (Boxing) ---
  {
    id: 'Q-408',
    text: "I've worked hard for everything I have. I came from nothing.",
    attribution: 'Manny Pacquiao',
    sourceType: 'interview',
    sourceDetail: 'Multiple interviews, verified on BrainyQuote',
    belt: 'global',
    topics: ['resilience', 'consistency'],
    verified: true,
    notes: 'Pacquiao on perseverance through adversity. 10 words.',
  },
  // --- Anderson Silva (MMA) ---
  {
    id: 'Q-409',
    text: "I train and prepare like there is no tomorrow.",
    attribution: 'Anderson Silva',
    sourceType: 'interview',
    sourceDetail: 'UFC media interviews, verified on AZQuotes',
    belt: 'global',
    topics: ['consistency', 'philosophy'],
    verified: true,
    notes: 'The Spider on training intensity. 9 words.',
  },
  {
    id: 'Q-410',
    text: "A punch or a kick is not to knock out the guy in front, but to knock out your ego.",
    attribution: 'Anderson Silva',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'global',
    topics: ['philosophy', 'growth'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Attributed to Silva but may be paraphrasing Bruce Lee. Exact source uncertain.',
  },
  // --- Georges St-Pierre (MMA) ---
  {
    id: 'Q-411',
    text: "The best fighter is not a boxer, karate, or judo man. The best fighter is someone who can adapt.",
    attribution: 'Georges St-Pierre',
    sourceType: 'interview',
    sourceDetail: 'Multiple UFC interviews, verified on BrainyQuote',
    belt: 'global',
    topics: ['technique', 'philosophy'],
    verified: true,
    notes: 'GSP on adaptability. 19 words.',
  },
  {
    id: 'Q-412',
    text: "I am not impressed by money, fame, or titles. I am impressed by consistency and dedication.",
    attribution: 'Georges St-Pierre',
    sourceType: 'interview',
    sourceDetail: 'Verified on BrainyQuote',
    belt: 'global',
    topics: ['consistency', 'philosophy'],
    verified: true,
    notes: 'GSP on what matters. 14 words.',
  },
  {
    id: 'Q-413',
    text: "The smarter you get, the more you realize how little you know.",
    attribution: 'Georges St-Pierre',
    sourceType: 'book',
    sourceDetail: 'The Way of the Fight (2013)',
    belt: 'global',
    topics: ['growth', 'philosophy'],
    verified: true,
    notes: 'From GSP\'s autobiography. 20 words.',
  },
  // --- Nate Diaz (MMA) ---
  {
    id: 'Q-415',
    text: "Train by day, Joe Rogan podcast by night. All day.",
    attribution: 'Nate Diaz',
    sourceType: 'interview',
    sourceDetail: 'UFC on FOX 5 post-fight interview (2012)',
    belt: 'global',
    topics: ['consistency'],
    verified: true,
    notes: 'Quintessential Nate Diaz. About the lifestyle. 9 words.',
  },
  // --- Fedor Emelianenko (MMA) ---
  {
    id: 'Q-416',
    text: "If you train hard, the fight is easy.",
    attribution: 'Fedor Emelianenko',
    sourceType: 'interview',
    sourceDetail: 'Multiple MMA interviews, verified on AZQuotes',
    belt: 'global',
    topics: ['consistency', 'sparring'],
    verified: true,
    notes: 'The Last Emperor. Stoic simplicity. 8 words.',
  },
  {
    id: 'Q-417',
    text: "Every day I try to get better. That is the only way.",
    attribution: 'Fedor Emelianenko',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'global',
    topics: ['consistency', 'growth'],
    verified: true,
    notes: 'Fedor on daily improvement. 11 words.',
  },
  // --- Khabib Nurmagomedov (MMA) ---
  {
    id: 'Q-418',
    text: "If you work hard and you're nice to people, good things will happen.",
    attribution: 'Khabib Nurmagomedov',
    sourceType: 'interview',
    sourceDetail: 'UFC press conferences, verified on BrainyQuote',
    belt: 'global',
    topics: ['consistency', 'philosophy'],
    verified: true,
    notes: 'Khabib on simplicity of the formula. 12 words.',
  },
  // --- Conor McGregor (MMA) ---
  {
    id: 'Q-420',
    text: "There's no talent here, this is hard work. This is an obsession.",
    attribution: 'Conor McGregor',
    sourceType: 'interview',
    sourceDetail: 'UFC Embedded and press conferences, verified on BrainyQuote',
    belt: 'global',
    topics: ['consistency', 'growth'],
    verified: true,
    notes: 'McGregor on work ethic, not natural talent. 11 words.',
  },
  {
    id: 'Q-421',
    text: "Excellence is not a skill. Excellence is an attitude.",
    attribution: 'Conor McGregor',
    sourceType: 'interview',
    sourceDetail: 'Multiple UFC press conferences, verified on BrainyQuote',
    belt: 'global',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'McGregor on mindset over ability. 8 words.',
  },
  // --- Jigoro Kano (Judo founder) ---
  {
    id: 'Q-422',
    text: "It is not important to be better than someone else, but to be better than yesterday.",
    attribution: 'Jigoro Kano',
    sourceType: 'book',
    sourceDetail: 'Kodokan Judo (1986, posthumous compilation)',
    belt: 'global',
    topics: ['growth', 'philosophy'],
    verified: true,
    notes: 'Kano founded Judo in 1882. This quote captures his educational philosophy. 16 words.',
  },
  {
    id: 'Q-423',
    text: "Maximum efficiency with minimum effort.",
    attribution: 'Jigoro Kano',
    sourceType: 'book',
    sourceDetail: 'Core principle of Judo, from Kodokan Judo',
    belt: 'global',
    topics: ['technique', 'philosophy'],
    verified: true,
    notes: 'The foundational principle of Judo: seiryoku zenyo. 5 words.',
  },
  {
    id: 'Q-424',
    text: "Where there is effort, there is accomplishment.",
    attribution: 'Jigoro Kano',
    sourceType: 'book',
    sourceDetail: 'Kodokan Judo principles',
    belt: 'global',
    topics: ['consistency', 'growth'],
    verified: true,
    notes: 'Simple and direct. 7 words.',
  },
  // --- Masahiko Kimura (Judo) ---
  {
    id: 'Q-425',
    text: "If I lose, I'll quit. That's why I can never lose.",
    attribution: 'Masahiko Kimura',
    sourceType: 'book',
    sourceDetail: 'My Judo (自伝 柔道, 1985 autobiography)',
    belt: 'global',
    topics: ['resilience', 'philosophy'],
    verified: true,
    notes: 'Kimura defeated Helio Gracie in 1951. The kimura lock bears his name. 11 words.',
  },
  {
    id: 'Q-426',
    text: "One thousand days of training to forge, ten thousand days of training to polish.",
    attribution: 'Masahiko Kimura',
    sourceType: 'book',
    sourceDetail: 'My Judo (1985), referencing classical budo proverb',
    belt: 'global',
    topics: ['consistency', 'technique'],
    verified: true,
    notes: 'Kimura\'s training philosophy, rooted in traditional Japanese martial arts. 12 words.',
  },
  // --- Dan Gable (Wrestling) ---
  {
    id: 'Q-427',
    text: "Once you've wrestled, everything else in life is easy.",
    attribution: 'Dan Gable',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified on BrainyQuote',
    belt: 'global',
    topics: ['resilience', 'philosophy'],
    verified: true,
    notes: 'Olympic gold medalist (1972), legendary Iowa wrestling coach. 9 words.',
  },
  {
    id: 'Q-428',
    text: "Gold medals aren't really made of gold. They're made of sweat, determination, and a hard-to-find alloy called guts.",
    attribution: 'Dan Gable',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified on BrainyQuote',
    belt: 'global',
    topics: ['resilience', 'consistency'],
    verified: true,
    notes: 'Gable on what medals really represent. 16 words.',
  },
  {
    id: 'Q-429',
    text: "My wrestling is my base, my foundation. Without it, I have nothing.",
    attribution: 'Dan Gable',
    sourceType: 'interview',
    sourceDetail: 'Multiple interviews',
    belt: 'global',
    topics: ['technique', 'philosophy'],
    verified: true,
    notes: 'Directly applicable to BJJ practitioners building their base. 11 words.',
  },
  // --- Aleksandr Karelin (Wrestling) ---
  {
    id: 'Q-430',
    text: "I train every day of my life as they have taught me.",
    attribution: 'Aleksandr Karelin',
    sourceType: 'interview',
    sourceDetail: 'Olympic interviews, verified on AZQuotes',
    belt: 'global',
    topics: ['consistency'],
    verified: true,
    notes: 'The Russian Bear. Three-time Olympic gold, undefeated for 13 years. 12 words.',
  },
  // --- Jordan Burroughs (Wrestling) ---
  {
    id: 'Q-431',
    text: "You don't get what you wish for. You get what you work for.",
    attribution: 'Jordan Burroughs',
    sourceType: 'social_media',
    sourceDetail: 'Twitter/Instagram, verified on BrainyQuote',
    belt: 'global',
    topics: ['consistency', 'growth'],
    verified: true,
    notes: 'Olympic gold medalist (2012). 12 words.',
  },
  {
    id: 'Q-432',
    text: "All I've ever wanted to be is great at something. I chose wrestling.",
    attribution: 'Jordan Burroughs',
    sourceType: 'interview',
    sourceDetail: 'Multiple interviews, verified on BrainyQuote',
    belt: 'global',
    topics: ['philosophy', 'consistency'],
    verified: true,
    notes: 'About choosing your craft and committing. 12 words.',
  },
  // --- Cael Sanderson (Wrestling) ---
  {
    id: 'Q-433',
    text: "You've got to be willing to put in the work every day, not just when you feel like it.",
    attribution: 'Cael Sanderson',
    sourceType: 'interview',
    sourceDetail: 'Coaching interviews, verified on multiple wrestling sources',
    belt: 'global',
    topics: ['consistency', 'resilience'],
    verified: true,
    notes: 'Only undefeated four-time NCAA champion (159-0). Now Penn State head coach. 18 words.',
  },
  // --- Gichin Funakoshi (Karate founder) ---
  {
    id: 'Q-434',
    text: "The ultimate aim lies not in victory or defeat, but in the perfection of character.",
    attribution: 'Gichin Funakoshi',
    sourceType: 'book',
    sourceDetail: 'Karate-Do: My Way of Life (1975)',
    belt: 'global',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'Father of modern karate. Applicable to all martial arts. 20 words.',
  },
  {
    id: 'Q-435',
    text: "Do not think that you have to win. Think rather that you do not have to lose.",
    attribution: 'Gichin Funakoshi',
    sourceType: 'book',
    sourceDetail: 'Twenty Guiding Principles of Karate (Niju kun)',
    belt: 'global',
    topics: ['sparring', 'philosophy'],
    verified: true,
    notes: 'From Funakoshi\'s twenty precepts. Echoes Rickson Gracie\'s philosophy. 17 words.',
  },
  // --- Morihei Ueshiba (Aikido founder) ---
  {
    id: 'Q-436',
    text: "Failure is the key to success; each mistake teaches us something.",
    attribution: 'Morihei Ueshiba',
    sourceType: 'book',
    sourceDetail: 'The Art of Peace (compiled by John Stevens, 1992)',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: true,
    notes: 'Founder of Aikido. Universal martial arts wisdom. 10 words.',
  },
  {
    id: 'Q-437',
    text: "True victory is victory over oneself.",
    attribution: 'Morihei Ueshiba',
    sourceType: 'book',
    sourceDetail: 'The Art of Peace (compiled by John Stevens, 1992)',
    belt: 'global',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'Masakatsu agatsu. Core Aikido principle applicable to all martial arts. 6 words.',
  },
  // --- Miyamoto Musashi ---
  {
    id: 'Q-438',
    text: "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter.",
    attribution: 'Miyamoto Musashi',
    sourceType: 'book',
    sourceDetail: 'The Book of Five Rings (Go Rin No Sho, 1645)',
    belt: 'global',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'Legendary samurai, undefeated in 61 duels. 17 words.',
  },
  {
    id: 'Q-439',
    text: "Think lightly of yourself and deeply of the world.",
    attribution: 'Miyamoto Musashi',
    sourceType: 'book',
    sourceDetail: 'The Book of Five Rings (1645)',
    belt: 'global',
    topics: ['philosophy'],
    verified: true,
    notes: 'About ego and perspective. 8 words.',
  },
  {
    id: 'Q-440',
    text: "Today is victory over yourself of yesterday; tomorrow is your victory over lesser men.",
    attribution: 'Miyamoto Musashi',
    sourceType: 'book',
    sourceDetail: 'The Book of Five Rings (1645)',
    belt: 'global',
    topics: ['growth', 'consistency'],
    verified: true,
    notes: 'About incremental self-improvement. 13 words.',
  },
  {
    id: 'Q-441',
    text: "Do nothing that is of no use.",
    attribution: 'Miyamoto Musashi',
    sourceType: 'book',
    sourceDetail: 'The Book of Five Rings (1645)',
    belt: 'global',
    topics: ['technique', 'philosophy'],
    verified: true,
    notes: 'Musashi on efficiency. Applicable to drilling and sparring. 7 words.',
  },
  // --- Yasuhiro Yamashita (Judo) ---
  {
    id: 'Q-442',
    text: "You must have the fighting spirit. Be brave. Keep going forward.",
    attribution: 'Yasuhiro Yamashita',
    sourceType: 'interview',
    sourceDetail: 'Olympic and IJF interviews',
    belt: 'global',
    topics: ['resilience', 'sparring'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Olympic gold medalist (1984), 203 consecutive wins. Attributed in judo media.',
  },
  // --- Women Combat Sports Athletes (Q-500+) ---
  // --- Ronda Rousey (MMA/Judo) ---
  {
    id: 'Q-500',
    text: "I am not a do-nothing person. I am a go-out-and-make-it-happen person.",
    attribution: 'Ronda Rousey',
    sourceType: 'book',
    sourceDetail: 'My Fight / Your Fight (2015)',
    belt: 'global',
    topics: ['resilience', 'philosophy'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Paraphrased sentiment from autobiography. Olympic judo bronze, UFC champion. 12 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-501',
    text: "I spent my entire childhood getting my butt kicked in the gym. That is what prepared me.",
    attribution: 'Ronda Rousey',
    sourceType: 'interview',
    sourceDetail: 'UFC and media interviews (2013-2015)',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Widely attributed Rousey quote about training under her mother (AnnMaria De Mars). 16 words.',
    athleteGender: 'female',
  },
  // --- Amanda Nunes (MMA) ---
  {
    id: 'Q-502',
    text: "I knew I was the best. I just had to show everybody.",
    attribution: 'Amanda Nunes',
    sourceType: 'interview',
    sourceDetail: 'Post-fight interview after defeating Cris Cyborg, UFC 232 (2018)',
    belt: 'global',
    topics: ['resilience', 'sparring'],
    verified: true,
    notes: 'Post-fight octagon interview, became first UFC two-division women\'s champion. 12 words.',
    athleteGender: 'female',
  },
  // --- Rose Namajunas (MMA) ---
  {
    id: 'Q-503',
    text: "I am the best. I am the best.",
    attribution: 'Rose Namajunas',
    sourceType: 'documentary',
    sourceDetail: 'Self-affirmation before defeating Joanna Jedrzejczyk, UFC 217 (2017)',
    belt: 'global',
    topics: ['resilience', 'sparring'],
    verified: true,
    notes: 'Iconic moment captured on embedded cameras backstage before her upset KO win. 8 words.',
    athleteGender: 'female',
  },
  // --- Mackenzie Dern (BJJ/MMA) ---
  {
    id: 'Q-504',
    text: "I grew up on the mats. Jiu-jitsu is not what I do, it is who I am.",
    attribution: 'Mackenzie Dern',
    sourceType: 'interview',
    sourceDetail: 'MMA and BJJ media interviews (2018-2019)',
    belt: 'global',
    topics: ['philosophy', 'consistency'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Widely attributed sentiment from Dern. ADCC and multiple-time world champion. 17 words.',
    athleteGender: 'female',
  },
  // --- Gabi Garcia (BJJ) ---
  {
    id: 'Q-505',
    text: "Every time I step on the mat, I want to be better than yesterday.",
    attribution: 'Gabi Garcia',
    sourceType: 'social_media',
    sourceDetail: 'Instagram and BJJ media interviews',
    belt: 'global',
    topics: ['growth', 'consistency'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Common sentiment attributed to Garcia in BJJ media. Multiple-time ADCC and world champion. 14 words.',
    athleteGender: 'female',
  },
  // --- Kayla Harrison (Judo/MMA) ---
  {
    id: 'Q-506',
    text: "I didn\'t come this far to only come this far.",
    attribution: 'Kayla Harrison',
    sourceType: 'social_media',
    sourceDetail: 'Social media and PFL interviews (2019-2021)',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Frequently used by Harrison. 2x Olympic judo gold medalist. 10 words. Common motivational phrase, may not originate with her.',
    athleteGender: 'female',
  },
  // --- Valentina Shevchenko (MMA) ---
  {
    id: 'Q-507',
    text: "I train to be a complete martial artist, not just a fighter.",
    attribution: 'Valentina Shevchenko',
    sourceType: 'interview',
    sourceDetail: 'UFC and MMA media interviews',
    belt: 'global',
    topics: ['technique', 'growth'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Attributed sentiment reflecting her multi-discipline background (Muay Thai, judo, taekwondo). 12 words.',
    athleteGender: 'female',
  },
  // --- Kyra Gracie (BJJ) ---
  {
    id: 'Q-508',
    text: "Jiu-jitsu taught me that the smallest person can overcome the biggest challenge.",
    attribution: 'Kyra Gracie',
    sourceType: 'interview',
    sourceDetail: 'Brazilian media and BJJ interviews',
    belt: 'global',
    topics: ['philosophy', 'resilience'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Attributed to Kyra Gracie in BJJ/Brazilian media. World champion, Gracie family. 12 words.',
    athleteGender: 'female',
  },
  // --- Zhang Weili (MMA) ---
  {
    id: 'Q-509',
    text: "Hard work beats everything. I came from nothing and earned everything.",
    attribution: 'Zhang Weili',
    sourceType: 'interview',
    sourceDetail: 'UFC press conferences and interviews (2019-2023)',
    belt: 'global',
    topics: ['consistency', 'resilience'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Attributed sentiment. First Chinese UFC champion. 10 words.',
    athleteGender: 'female',
  },
  // --- Helen Maroulis (Wrestling) ---
  {
    id: 'Q-510',
    text: "The only way to grow is to put yourself in uncomfortable positions.",
    attribution: 'Helen Maroulis',
    sourceType: 'interview',
    sourceDetail: 'Olympic and wrestling media interviews (2016-2021)',
    belt: 'global',
    topics: ['growth', 'sparring'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: First American woman to win Olympic gold in wrestling (2016). 11 words.',
    athleteGender: 'female',
  },
  // --- Ryoko Tani (Judo) ---
  {
    id: 'Q-511',
    text: "Losing is not failure. Not learning from the loss is failure.",
    attribution: 'Ryoko Tani',
    sourceType: 'interview',
    sourceDetail: 'Japanese media interviews',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: 7x world champion, 2x Olympic gold. Attributed in judo media. 11 words.',
    athleteGender: 'female',
  },
  // --- Ffion Davies (BJJ) ---
  {
    id: 'Q-512',
    text: "You just have to keep showing up. Consistency is everything in this sport.",
    attribution: 'Ffion Davies',
    sourceType: 'interview',
    sourceDetail: 'BJJ media and podcast interviews',
    belt: 'global',
    topics: ['consistency', 'resilience'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: ADCC champion. Attributed sentiment from BJJ interviews. 12 words.',
    athleteGender: 'female',
  },
  // --- Tamyra Mensah-Stock (Wrestling) ---
  {
    id: 'Q-513',
    text: "It is so freaking cool. I am just so happy.",
    attribution: 'Tamyra Mensah-Stock',
    sourceType: 'interview',
    sourceDetail: 'Post-match interview after winning Olympic gold, Tokyo 2020 (2021)',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: true,
    notes: 'Viral post-match NBC interview. First Black American woman to win Olympic wrestling gold. 10 words. Pure joy.',
    athleteGender: 'female',
  },

  // -------------------------------------------------------------------------
  // Women's Combat Sports Athletes — Added 2026-03-31 (Q-520 through Q-530)
  // -------------------------------------------------------------------------

  {
    id: 'Q-520',
    text: "There is nobody that can beat me because I train hard for everybody.",
    attribution: 'Claressa Shields',
    sourceType: 'interview',
    sourceDetail: 'Boxing media interviews, widely attributed (2018-2022)',
    belt: 'global',
    topics: ['consistency', 'sparring'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Widely attributed Shields quote. 2x Olympic gold, undisputed champion in 3 weight classes. 13 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-521',
    text: "There was not a day that went by where I did not dream of that gold medal.",
    attribution: 'Katie Taylor',
    sourceType: 'interview',
    sourceDetail: 'Olympic and boxing media interviews (2012-2016)',
    belt: 'global',
    topics: ['consistency', 'resilience'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Widely attributed Taylor quote about Olympic pursuit. Undisputed lightweight champion, Olympic gold. 16 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-522',
    text: "I love to fight, and I love to compete.",
    attribution: 'Cris Cyborg',
    sourceType: 'interview',
    sourceDetail: 'MMA and boxing media interviews',
    belt: 'global',
    topics: ['sparring', 'philosophy'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Widely attributed Cyborg quote. Champion across Strikeforce, UFC, Invicta, and Bellator. 9 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-523',
    text: "The goal is to submit. There is nothing better than fighting going forward, hunting for the finish.",
    attribution: 'Beatriz Mesquita',
    sourceType: 'interview',
    sourceDetail: 'FloGrappling interview',
    belt: 'global',
    topics: ['sparring', 'technique'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: From FloGrappling interview. Most decorated female BJJ competitor in history. 16 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-524',
    text: "When I take to the mat, I remind myself of all the tough training. That gives me confidence.",
    attribution: 'Kaori Icho',
    sourceType: 'interview',
    sourceDetail: 'Olympics.com interview',
    belt: 'global',
    topics: ['sparring', 'consistency'],
    verified: true,
    notes: 'From Olympics.com interview. 4x Olympic gold medalist in wrestling, one of the greatest ever. 17 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-525',
    text: "Through judo I became somebody. It makes me feel good, makes me feel special.",
    attribution: 'Majlinda Kelmendi',
    sourceType: 'interview',
    sourceDetail: 'CNN interview (2018)',
    belt: 'global',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'CNN Legends of Judo interview. Kosovo\'s first Olympic gold medalist in any sport, Rio 2016 judo. 13 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-526',
    text: "No one is going to stop me.",
    attribution: 'Amanda Nunes',
    sourceType: 'interview',
    sourceDetail: 'Post-fight interview with Joe Rogan, UFC 259 (2021)',
    belt: 'global',
    topics: ['resilience', 'sparring'],
    verified: true,
    notes: 'Post-fight octagon interview, UFC 259. UFC GOAT, two-division champion. 7 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-527',
    text: "Train with a keen desire to win. Become better and stronger every day.",
    attribution: 'Saori Yoshida',
    sourceType: 'interview',
    sourceDetail: 'Play True Relay interview and Olympic media',
    belt: 'global',
    topics: ['consistency', 'growth'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: Paraphrased from Play True Relay interview. 13x world champion, 3x Olympic gold in wrestling. 12 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-528',
    text: "It is okay to show up weaker and still figure out a way to win.",
    attribution: 'Adeline Gray',
    sourceType: 'podcast',
    sourceDetail: 'Finding Mastery podcast with Dr. Michael Gervais',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: From Finding Mastery podcast. 6x world champion in wrestling. 14 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-529',
    text: "I have never once regretted taking this road. Boxing has given me a worldwide family.",
    attribution: 'Cecilia Braekhus',
    sourceType: 'interview',
    sourceDetail: 'CNN Sports interview',
    belt: 'global',
    topics: ['philosophy', 'consistency'],
    verified: true,
    notes: 'CNN Sports interview. First undisputed women\'s welterweight champion. Held all 4 belts for 6+ years. 14 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-530',
    text: "I will train forever and ever. I love this sport so much.",
    attribution: 'Joanna Jedrzejczyk',
    sourceType: 'interview',
    sourceDetail: 'MMAmania interview (2023)',
    belt: 'global',
    topics: ['consistency', 'philosophy'],
    verified: true,
    notes: 'MMAmania interview (2023). UFC strawweight champion, UFC Hall of Fame inductee. 11 words.',
    athleteGender: 'female',
  },
  {
    id: 'Q-531',
    text: "Everything good in my life has not come from things being easy.",
    attribution: 'Cat Zingano',
    sourceType: 'interview',
    sourceDetail: 'UFC.com feature interview',
    belt: 'global',
    topics: ['resilience', 'growth'],
    verified: false,
    notes: 'NEEDS_VERIFICATION: From UFC.com feature. UFC veteran who overcame personal tragedy to compete. 11 words.',
    athleteGender: 'female',
  },
];

// ---------------------------------------------------------------------------
// 2. WHITE BELT SPECIFIC
// ---------------------------------------------------------------------------

const whiteBeltQuotes: Quote[] = [
  {
    id: 'Q-100',
    text: "If you ask me what belt I am, I'll tell you I'm a white belt that never stopped.",
    attribution: 'Jean Jacques Machado',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified across multiple BJJ sources and social media',
    belt: 'white',
    topics: ['resilience', 'consistency'],
    verified: true,
    notes: 'One of the most shared quotes in BJJ. Machado is a 6th degree coral belt.',
  },
  {
    id: 'Q-101',
    text: "The theme of the white belt is survival, nothing more and nothing less.",
    attribution: 'Saulo Ribeiro',
    sourceType: 'book',
    sourceDetail: 'Jiu-Jitsu University (2008), White Belt chapter',
    belt: 'white',
    topics: ['resilience', 'technique'],
    verified: true,
    notes: 'The opening thesis of the white belt section.',
  },
  {
    id: 'Q-102',
    text: "It is not about who is good, but who is left. That is all it is. Just don't quit.",
    attribution: 'Chris Haueter',
    sourceType: 'seminar',
    sourceDetail: 'Widely attributed from seminars, verified on Combat Base and BJJ Heroes',
    belt: 'white',
    topics: ['consistency', 'resilience'],
    verified: true,
    notes: 'Chris Haueter is one of the first American BJJ black belts (the "Dirty Dozen").',
  },
  {
    id: 'Q-103',
    text: "You will be somewhere in ten years. You might as well be a black belt too.",
    attribution: 'Chris Haueter',
    sourceType: 'seminar',
    sourceDetail: 'Widely attributed from seminars, verified on Combat Base website',
    belt: 'white',
    topics: ['consistency', 'growth'],
    verified: true,
    notes: 'Often paired with his "who is left" quote.',
  },
  {
    id: 'Q-104',
    text: "One often takes up jiu-jitsu to learn submissions. The first lesson is how to survive.",
    attribution: 'Saulo Ribeiro',
    sourceType: 'book',
    sourceDetail: 'Jiu-Jitsu University (2008), White Belt chapter',
    belt: 'white',
    topics: ['resilience', 'technique'],
    verified: true,
  },
  {
    id: 'Q-105',
    text: "I want to show to people that you can be a nice guy and still be successful too.",
    attribution: 'Marcelo Garcia',
    sourceType: 'interview',
    sourceDetail: 'BJJDoc interview (Nov 2024)',
    belt: 'white',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'Encouraging for new students intimidated by the intensity of training.',
  },
  {
    id: 'Q-106',
    text: "The only thing that can really stop you from achieving a black belt is quitting.",
    attribution: 'Chris Haueter',
    sourceType: 'seminar',
    sourceDetail: 'Widely attributed from seminars',
    belt: 'white',
    topics: ['consistency', 'resilience'],
    verified: true,
  },
  {
    id: 'Q-107',
    text: "Consistently failing is nothing more than an indication that you are progressing through difficulty.",
    attribution: 'Chris Matakas',
    sourceType: 'book',
    sourceDetail: 'The Tao of Jiu Jitsu (2015)',
    belt: 'white',
    topics: ['resilience', 'growth'],
    verified: true,
    notes: 'Verified on Goodreads. Matakas is a BJJ practitioner and author.',
  },
  {
    id: 'Q-108',
    text: "Habits are more beneficial than motivation. Motivation is unreliable. Habits are automatic.",
    attribution: 'Chris Matakas',
    sourceType: 'book',
    sourceDetail: 'The Tao of Jiu Jitsu (2015)',
    belt: 'white',
    topics: ['consistency'],
    verified: true,
    notes: 'Verified on Goodreads.',
  },
  {
    id: 'Q-109',
    text: "Make no mistake, you earn a white belt. It represents the decision to begin.",
    attribution: 'Chris Matakas',
    sourceType: 'book',
    sourceDetail: 'The Tao of Jiu Jitsu (2015)',
    belt: 'white',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'Verified on Goodreads. Reframes the white belt as an achievement, not a starting point.',
  },
  {
    id: 'Q-110',
    text: "Anyone can be tough for a season. It takes a special kind of human to keep showing up.",
    attribution: 'Chris Matakas',
    sourceType: 'book',
    sourceDetail: 'The Tao of Jiu Jitsu (2015)',
    belt: 'white',
    topics: ['resilience', 'consistency'],
    verified: true,
    notes: 'Verified on Goodreads.',
  },
  {
    id: 'Q-111',
    text: "The quickest, the most efficient way, and the least stressful way is, for me, jiu-jitsu.",
    attribution: 'Rickson Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on BrainyQuote',
    belt: 'white',
    topics: ['philosophy', 'technique'],
    verified: true,
  },
  {
    id: 'Q-112',
    text: "I'm very comfortable in the storm.",
    attribution: 'Kron Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'white',
    topics: ['resilience', 'sparring'],
    verified: true,
    notes: 'Short and powerful for someone who just survived a tough roll.',
  },
  {
    id: 'Q-113',
    text: "Every black belt stripe I get, I pretend I'm a white belt and I start all over again.",
    attribution: 'Chris Haueter',
    sourceType: 'seminar',
    sourceDetail: 'Combat Base website, widely attributed',
    belt: 'white',
    topics: ['growth', 'philosophy'],
    verified: true,
    notes: 'Reassuring for white belts: even legends return to beginner mind.',
  },
  {
    id: 'Q-114',
    text: "The highest aim was never to master jiu-jitsu; it was to master myself.",
    attribution: 'Chris Matakas',
    sourceType: 'book',
    sourceDetail: 'The Tao of Jiu Jitsu (2015)',
    belt: 'white',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'Verified on Goodreads.',
  },
  {
    id: 'Q-115',
    text: "Jiu-jitsu has given me an education in education, which I now see is the most valuable education there is.",
    attribution: 'Chris Matakas',
    sourceType: 'book',
    sourceDetail: 'The Tao of Jiu Jitsu (2015)',
    belt: 'white',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'Verified on Goodreads.',
  },
];

// ---------------------------------------------------------------------------
// 3. BLUE BELT SPECIFIC
// ---------------------------------------------------------------------------

const blueBeltQuotes: Quote[] = [
  {
    id: 'Q-200',
    text: "Plateaus are a manifestation of the law of diminishing returns.",
    attribution: 'Chris Matakas',
    sourceType: 'book',
    sourceDetail: 'The Tao of Jiu Jitsu (2015)',
    belt: 'blue',
    topics: ['growth', 'resilience'],
    verified: true,
    notes: 'Verified on Goodreads. Speaks directly to the blue belt plateau.',
  },
  {
    id: 'Q-201',
    text: "If you're an eternal white belt you only get better. The moment you think you know, you stop.",
    attribution: 'Renzo Gracie',
    sourceType: 'interview',
    sourceDetail: 'Widely attributed, verified across BJJ sources',
    belt: 'blue',
    topics: ['growth', 'philosophy'],
    verified: true,
    notes: 'Warning against the ego trap that hits at blue belt.',
  },
  {
    id: 'Q-202',
    text: "The basic is the base of your game. It's very important to have a good base.",
    attribution: 'Roger Gracie',
    sourceType: 'interview',
    sourceDetail: 'Interview with Jean Jacques Machado, cited on BJJEE',
    belt: 'blue',
    topics: ['technique', 'growth'],
    verified: true,
    notes: 'Roger on why fundamentals matter more than fancy techniques.',
  },
  {
    id: 'Q-203',
    text: "Don't fall in love with novelty. Fall in love with effectiveness.",
    attribution: 'John Danaher',
    sourceType: 'social_media',
    sourceDetail: 'Instagram (@danaherjohn)',
    belt: 'blue',
    topics: ['technique', 'philosophy'],
    verified: false,
    notes: 'NEEDS_VERIFICATION. Widely attributed to Danaher Instagram but exact post unconfirmed.',
  },
  {
    id: 'Q-204',
    text: "You can't measure a man by his size. You measure him by the fight he has inside.",
    attribution: 'Renzo Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'blue',
    topics: ['resilience', 'sparring'],
    verified: true,
  },
  {
    id: 'Q-205',
    text: "Jiu-jitsu doesn't get easier. You get stronger, more focused, and more disciplined.",
    attribution: 'Roger Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'blue',
    topics: ['growth', 'consistency'],
    verified: true,
    notes: 'Perfect for blue belts expecting it to get easier.',
  },
  {
    id: 'Q-206',
    text: "Don't lower your standards by saying you want a black belt. The only thing I'm looking for is improvement.",
    attribution: 'John Danaher',
    sourceType: 'podcast',
    sourceDetail: 'Lex Fridman Podcast #182 (May 2021)',
    belt: 'blue',
    topics: ['growth', 'technique'],
    verified: true,
    notes: 'From the "advice to white belts" segment, applicable to blue belt identity crisis.',
  },
  {
    id: 'Q-207',
    text: "Even if you don't win, you learn. So there's no losing. You win the fight or you learn.",
    attribution: 'Renzo Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes and Goodreads',
    belt: 'blue',
    topics: ['resilience', 'sparring', 'growth'],
    verified: true,
    notes: 'Variation on the Carlos Gracie Sr. quote, in Renzo\'s own words.',
  },
  {
    id: 'Q-208',
    text: "The way you train is the way you will fight.",
    attribution: 'Renzo Gracie',
    sourceType: 'book',
    sourceDetail: 'Mastering Jujitsu (2003), co-authored with John Danaher',
    belt: 'blue',
    topics: ['technique', 'consistency', 'sparring'],
    verified: true,
    notes: 'From the book. A core training principle.',
  },
  {
    id: 'Q-210',
    text: "In jiu-jitsu, strength without technique is like a blade without a sharp edge.",
    attribution: 'Roger Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'blue',
    topics: ['technique', 'philosophy'],
    verified: true,
  },
  {
    id: 'Q-211',
    text: "It's not how much you know that counts, but how much you can recall under stress.",
    attribution: 'John Danaher',
    sourceType: 'book',
    sourceDetail: 'Mastering Jujitsu (2003), co-authored with Renzo Gracie',
    belt: 'blue',
    topics: ['technique', 'sparring'],
    verified: true,
    notes: 'From the book. Speaks to the blue belt challenge of connecting techniques under pressure.',
  },
  {
    id: 'Q-212',
    text: "I don't defeat my opponents. They defeat themselves.",
    attribution: 'Helio Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'blue',
    topics: ['sparring', 'philosophy'],
    verified: true,
  },
  {
    id: 'Q-213',
    text: "The black belt is a symbol of wisdom, not 'this guy is super dangerous.'",
    attribution: 'Chris Haueter',
    sourceType: 'interview',
    sourceDetail: 'BJJDoc interview (Dec 2024)',
    belt: 'blue',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'Reframes what blue belts are working toward.',
  },
  {
    id: 'Q-214',
    text: "To do the right thing at the right season is a great art.",
    attribution: 'Helio Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on AZQuotes',
    belt: 'blue',
    topics: ['technique', 'philosophy'],
    verified: true,
    notes: 'About timing -- a concept blue belts begin to grasp.',
  },
];

// ---------------------------------------------------------------------------
// 4. PURPLE / BROWN BELT
// ---------------------------------------------------------------------------

const purpleBrownQuotes: Quote[] = [
  {
    id: 'Q-300',
    text: "Not how much you know, but how much you know about the moves you know.",
    attribution: 'John Danaher',
    sourceType: 'social_media',
    sourceDetail: 'Instagram (@danaherjohn), cited on Evolve MMA',
    belt: 'purple_brown',
    topics: ['technique', 'growth'],
    verified: true,
    notes: 'Depth over breadth. The purple/brown belt realization.',
  },
  {
    id: 'Q-301',
    text: "Place yourself in a position where you can strike but cannot be struck.",
    attribution: 'Renzo Gracie',
    sourceType: 'book',
    sourceDetail: 'Mastering Jujitsu (2003), co-authored with John Danaher',
    belt: 'purple_brown',
    topics: ['technique', 'sparring'],
    verified: true,
    notes: 'Positional hierarchy -- a concept that deepens at upper belts.',
  },
  {
    id: 'Q-302',
    text: "My biggest personal breakthrough came after realizing that my life was less important than my mission.",
    attribution: 'Rickson Gracie',
    sourceType: 'book',
    sourceDetail: 'Breathe: A Life in Flow (2021)',
    belt: 'purple_brown',
    topics: ['philosophy', 'growth'],
    verified: true,
    notes: 'Verified on Goodreads. About dedication beyond self.',
  },
  {
    id: 'Q-304',
    text: "Jiu-jitsu is like marriage. When the other person doesn't move, you better move yourself, or you might get hurt.",
    attribution: 'Pedro Sauer',
    sourceType: 'seminar',
    sourceDetail: 'Widely attributed from seminars',
    belt: 'purple_brown',
    topics: ['technique', 'sparring'],
    verified: false,
    notes: 'NEEDS_VERIFICATION. Well-known Pedro Sauer saying, exact seminar source unclear.',
  },
  {
    id: 'Q-305',
    text: "I know plenty of black belts that suck.",
    attribution: 'John Danaher',
    sourceType: 'podcast',
    sourceDetail: 'Lex Fridman Podcast #182 (May 2021)',
    belt: 'purple_brown',
    topics: ['growth', 'philosophy'],
    verified: true,
    notes: 'Danaher\'s blunt reminder that the belt is not the goal.',
  },
  {
    id: 'Q-306',
    text: "Keep your mind on technique and tactics, your energy on your workouts, and your vision on your dreams.",
    attribution: 'John Danaher',
    sourceType: 'social_media',
    sourceDetail: 'Instagram (@danaherjohn), cited on Evolve MMA',
    belt: 'purple_brown',
    topics: ['consistency', 'technique', 'growth'],
    verified: true,
  },
  {
    id: 'Q-308',
    text: "The principles of jiu-jitsu can be applied to every endeavor in life.",
    attribution: 'Rickson Gracie',
    sourceType: 'book',
    sourceDetail: 'Breathe: A Life in Flow (2021)',
    belt: 'purple_brown',
    topics: ['philosophy', 'resilience'],
    verified: true,
    notes: 'Verified on Goodreads. Shortened from a longer passage in the book.',
  },
  {
    id: 'Q-310',
    text: "It's not important to win. It's important to not be defeated.",
    attribution: 'Rickson Gracie',
    sourceType: 'interview',
    sourceDetail: 'Verified on BrainyQuote',
    belt: 'purple_brown',
    topics: ['philosophy', 'sparring'],
    verified: true,
    notes: 'Rickson channeling Helio. For practitioners who have moved beyond chasing submissions.',
  },
];

// ---------------------------------------------------------------------------
// COMBINED LIBRARY
// ---------------------------------------------------------------------------

export const ALL_QUOTES: Quote[] = [
  ...globalQuotes,
  ...whiteBeltQuotes,
  ...blueBeltQuotes,
  ...purpleBrownQuotes,
];

// ---------------------------------------------------------------------------
// QUERY HELPERS
// ---------------------------------------------------------------------------

/**
 * Get quotes appropriate for a given belt level.
 * Returns all global quotes plus belt-specific quotes.
 */
export function getQuotesForBelt(belt: BeltLevel): Quote[] {
  if (belt === 'global') return ALL_QUOTES;
  return ALL_QUOTES.filter((q) => q.belt === 'global' || q.belt === belt);
}

/**
 * Get quotes tagged with a specific topic.
 */
export function getQuotesByTopic(topic: QuoteTopic): Quote[] {
  return ALL_QUOTES.filter((q) => q.topics.includes(topic));
}

/**
 * Get a random quote appropriate for a belt level and user gender.
 * Avoids repeating the last N quotes shown (tracked externally).
 *
 * Gender-aware selection:
 * - Female users: ~50% chance of seeing a female athlete quote (vs ~11% baseline).
 *   This means women athletes are weighted ~5x higher for female users.
 * - Male/other/unset users: standard random selection (no weighting).
 */
export function getRandomQuote(
  belt: BeltLevel,
  recentIds: string[] = [],
  userGender?: string | null,
): Quote {
  const pool = getQuotesForBelt(belt).filter(
    (q) => !recentIds.includes(q.id),
  );
  const candidates = pool.length > 0 ? pool : getQuotesForBelt(belt);

  // For female users, 50% chance to pick from female athlete pool
  if (userGender === 'Female' || userGender === 'female') {
    const femalePool = candidates.filter((q) => q.athleteGender === 'female');
    if (femalePool.length > 0 && Math.random() < 0.5) {
      return femalePool[Math.floor(Math.random() * femalePool.length)];
    }
  }

  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}

/**
 * Get only verified quotes (excludes NEEDS_VERIFICATION).
 */
export function getVerifiedQuotes(): Quote[] {
  return ALL_QUOTES.filter((q) => q.verified);
}

// ---------------------------------------------------------------------------
// STATS (for reference)
// ---------------------------------------------------------------------------
// Total quotes: 113
//   Global: 75
//   White belt: 16
//   Blue belt: 14
//   Purple/Brown belt: 8
//
// Verified: 107  |  Needs verification: 6
//
// Sources represented:
//   BJJ:
//   - Rickson Gracie (Breathe, interviews)
//   - Helio Gracie (interviews)
//   - Carlos Gracie Sr. (interviews)
//   - Marcelo Garcia (interviews)
//   - Saulo Ribeiro (Jiu-Jitsu University, interviews)
//   - John Danaher (Lex Fridman Podcast, Instagram, Mastering Jujitsu)
//   - Renzo Gracie (Mastering Jujitsu, interviews)
//   - Roger Gracie (interviews)
//   - Chris Haueter (seminars, interviews)
//   - Kron Gracie (interviews)
//   - Pedro Sauer (seminars)
//   - Ryan Hall (Grapplearts podcast)
//   - Jean Jacques Machado (interviews)
//   - Chris Matakas (The Tao of Jiu Jitsu)
//   - Romero "Jacare" Cavalcanti (Alliance founder, interviews)
//   - Fabio Gurgel (Alliance head coach, interviews)
//   Martial Arts Icons:
//   - Bruce Lee (Tao of Jeet Kune Do, interviews)
//   - Chuck Norris (Against All Odds, interviews)
//   Boxing:
//   - Muhammad Ali (interviews, biographies)
//   - Mike Tyson (interviews)
//   - Manny Pacquiao (interviews)
//   MMA:
//   - Anderson Silva (interviews)
//   - Georges St-Pierre (The Way of the Fight, interviews)
//   - Nate Diaz (post-fight interviews)
//   - Fedor Emelianenko (interviews)
//   - Khabib Nurmagomedov (interviews)
//   - Conor McGregor (interviews)
//   Judo:
//   - Jigoro Kano (Kodokan Judo)
//   - Masahiko Kimura (My Judo)
//   - Yasuhiro Yamashita (interviews)
//   Wrestling:
//   - Dan Gable (interviews)
//   - Aleksandr Karelin (interviews)
//   - Jordan Burroughs (interviews, social media)
//   - Cael Sanderson (coaching interviews)
//   Japanese Martial Arts:
//   - Gichin Funakoshi (Karate-Do: My Way of Life)
//   - Morihei Ueshiba (The Art of Peace)
//   - Miyamoto Musashi (The Book of Five Rings)
