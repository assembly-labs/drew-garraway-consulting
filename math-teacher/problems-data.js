// Math problem configurations by difficulty level
const problemConfig = {
    easy: {
        addition: { min: 1, max: 10 },
        subtraction: { min: 1, max: 10 },
        operations: ['addition', 'subtraction']
    },
    medium: {
        addition: { min: 10, max: 50 },
        subtraction: { min: 10, max: 50 },
        multiplication: { min: 2, max: 10 },
        operations: ['addition', 'subtraction', 'multiplication']
    },
    hard: {
        addition: { min: 50, max: 200 },
        subtraction: { min: 50, max: 200 },
        multiplication: { min: 5, max: 15 },
        division: { min: 2, max: 12 },
        operations: ['addition', 'subtraction', 'multiplication', 'division']
    }
};

// Operation symbols
const operationSymbols = {
    addition: '+',
    subtraction: '-',
    multiplication: '\u00D7',
    division: '\u00F7'
};

// Encouraging messages for correct answers
const correctMessages = [
    "Excellent!",
    "Great job!",
    "Perfect!",
    "You got it!",
    "Awesome!",
    "Well done!",
    "Fantastic!",
    "Brilliant!",
    "Superb!",
    "Outstanding!"
];

// Encouraging messages for incorrect answers
const incorrectMessages = [
    "Not quite - try again!",
    "Keep trying!",
    "Almost there!",
    "Give it another shot!",
    "You can do it!"
];
