// Dirty Mouth & Clean Mouth character quips

export const DIRTY_MOUTH = {
  name: 'Filthy Phil',
  tagline: 'Your friendly neighborhood potty mouth',

  // When someone gets reported
  reportQuips: [
    "Ooooh, caught you slipping!",
    "That's gonna cost you, sailor mouth!",
    "Another one for the swear jar!",
    "Tsk tsk... potty mouth!",
    "Someone's been watching too many R-rated movies!",
    "Your mother would be so disappointed.",
    "Was that really necessary? (Yes. Yes it was.)",
    "Ding ding ding! We have a curser!",
    "Language! ...just kidding, I love it.",
    "Add it to the tab!",
  ],

  // When 2x multiplier is active
  multiplierQuips: [
    "DOUBLE DAMAGE! Choose your words wisely... or don't!",
    "2x points active! Time to bite that tongue!",
    "Oh, it's ON. Double points baby!",
    "Multiplier madness! Every curse hits twice as hard!",
    "This is where it gets spicy!",
  ],

  // When someone is losing badly
  loserQuips: [
    "Buddy... you're getting wrecked out there.",
    "At this point, just embrace it.",
    "You kiss your mother with that mouth?",
    "Some people are born leaders. You're a born cusser.",
    "If cursing was an Olympic sport... gold medal.",
  ],

  // Weekly recap for losers
  recapLoserQuips: [
    "Congratulations on your... dedication to profanity.",
    "Well well well, look who needs a bar of soap.",
    "The dirtiest mouth award goes to...",
    "You really went for it this week, huh?",
    "I'm impressed. Disgusted, but impressed.",
  ],

  // Notifications
  notificationQuips: {
    youGotReported: [
      "Ooooh {reporter} caught you slipping! +{points} point{s}, potty mouth.",
      "{reporter} just snitched on you! +{points} to your tab.",
      "Busted! {reporter} heard that one. +{points} point{s}.",
    ],
    doubleDayStarting: [
      "It's DOUBLE POINTS day. Watch your mouth. 😈",
      "2x multiplier active! Every slip-up costs you double!",
      "Double damage day! Think before you speak... or don't!",
    ],
  },
};

export const CLEAN_MOUTH = {
  name: 'Sunny',
  tagline: 'Keeping it clean, one word at a time',

  // When someone uses the nice word
  niceWordQuips: [
    "Now THAT'S what I like to hear!",
    "Beautiful! Simply beautiful!",
    "Look at you being all wholesome!",
    "A true wordsmith!",
    "Your vocabulary is evolving!",
    "Music to my ears!",
    "That's the spirit!",
    "Wonderful choice of words!",
  ],

  // When someone achieves a clean day
  cleanDayQuips: [
    "A whole day without cursing? Impressive!",
    "Clean streak! You're doing great!",
    "Look at you go! Not a single slip-up!",
    "Your mouth is squeaky clean today!",
    "That's what I call self-control!",
  ],

  // When someone achieves a clean week
  cleanWeekQuips: [
    "AN ENTIRE WEEK?! You're a legend!",
    "Seven days of clean! This is historic!",
    "The streak continues! You're unstoppable!",
    "A true champion of clean speech!",
  ],

  // When someone is winning
  winnerQuips: [
    "Keep it up! You're crushing it!",
    "The cleanest mouth in the game!",
    "A shining example of restraint!",
    "Leading by example!",
  ],

  // Weekly recap for winners
  recapWinnerQuips: [
    "Congratulations! The cleanest mouth this week!",
    "A true champion of vocabulary!",
    "You did it! The least curse-y person!",
    "Victory through verbal virtue!",
  ],

  // Notifications
  notificationQuips: {
    cleanDayAchieved: [
      "Well well well... a whole day without cursing? Boring, but impressive.",
      "Clean day achieved! Your streak is at {streak} day{s}!",
      "Not a single curse today! Who are you?!",
    ],
    niceWordReminder: [
      "This week's nice word is '{word}'. Use it. Save yourself.",
      "Psst... the nice word is '{word}'. -1 point per use!",
      "Feeling wordy? '{word}' is this week's golden ticket.",
    ],
    ceaseFire: [
      "Cease-fire active. Your filthy mouth gets a break.",
      "Immunity window! Curse freely... wait, no. Don't.",
    ],
  },
};

// Get a random quip from an array
export function getRandomQuip(quips: string[]): string {
  return quips[Math.floor(Math.random() * quips.length)];
}

// Format a quip with variables
export function formatQuip(quip: string, vars: Record<string, string | number>): string {
  let result = quip;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(`{${key}}`, String(value));
  }
  // Handle pluralization
  result = result.replace(/\{s\}/g, (_, offset) => {
    // Find the number before this {s}
    const match = result.slice(0, offset).match(/(\d+)\s*\w*$/);
    return match && parseInt(match[1]) === 1 ? '' : 's';
  });
  return result;
}
