// State management
let currentLevel = 'easy';
let currentProblem = null;
let stats = {
    correct: 0,
    streak: 0,
    total: 0
};

// DOM Elements
const problemText = document.getElementById('problemText');
const problemType = document.getElementById('problemType');
const answerInput = document.getElementById('answerInput');
const checkBtn = document.getElementById('checkBtn');
const newProblemBtn = document.getElementById('newProblemBtn');
const feedback = document.getElementById('feedback');
const correctCount = document.getElementById('correctCount');
const streakCount = document.getElementById('streakCount');
const totalCount = document.getElementById('totalCount');
const currentDate = document.getElementById('currentDate');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

// Random number generator within range
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a new problem based on current level
function generateProblem() {
    const config = problemConfig[currentLevel];
    const operation = config.operations[randomInt(0, config.operations.length - 1)];
    const opConfig = config[operation];

    let num1, num2, answer;

    switch (operation) {
        case 'addition':
            num1 = randomInt(opConfig.min, opConfig.max);
            num2 = randomInt(opConfig.min, opConfig.max);
            answer = num1 + num2;
            break;

        case 'subtraction':
            num1 = randomInt(opConfig.min, opConfig.max);
            num2 = randomInt(opConfig.min, Math.min(num1, opConfig.max));
            answer = num1 - num2;
            break;

        case 'multiplication':
            num1 = randomInt(opConfig.min, opConfig.max);
            num2 = randomInt(opConfig.min, opConfig.max);
            answer = num1 * num2;
            break;

        case 'division':
            num2 = randomInt(opConfig.min, opConfig.max);
            answer = randomInt(opConfig.min, opConfig.max);
            num1 = num2 * answer;
            break;
    }

    return {
        num1,
        num2,
        operation,
        answer,
        display: `${num1} ${operationSymbols[operation]} ${num2} = ?`
    };
}

// Display the current problem
function displayProblem() {
    currentProblem = generateProblem();
    problemText.textContent = currentProblem.display;
    problemType.textContent = currentProblem.operation.charAt(0).toUpperCase() + currentProblem.operation.slice(1);
    answerInput.value = '';
    feedback.textContent = '';
    feedback.className = 'feedback';
    answerInput.focus();
}

// Check the user's answer
function checkAnswer() {
    const userAnswer = parseInt(answerInput.value, 10);

    if (isNaN(userAnswer)) {
        feedback.textContent = 'Please enter a number';
        feedback.className = 'feedback incorrect';
        return;
    }

    stats.total++;

    if (userAnswer === currentProblem.answer) {
        stats.correct++;
        stats.streak++;
        feedback.textContent = correctMessages[randomInt(0, correctMessages.length - 1)];
        feedback.className = 'feedback correct';

        // Auto-advance after correct answer
        setTimeout(() => {
            displayProblem();
        }, 1000);
    } else {
        stats.streak = 0;
        feedback.textContent = `${incorrectMessages[randomInt(0, incorrectMessages.length - 1)]} The answer was ${currentProblem.answer}.`;
        feedback.className = 'feedback incorrect';
    }

    updateStats();
    saveStats();
}

// Update stats display
function updateStats() {
    correctCount.textContent = stats.correct;
    streakCount.textContent = stats.streak;
    totalCount.textContent = stats.total;
}

// Save stats to localStorage
function saveStats() {
    const data = {
        stats,
        level: currentLevel,
        date: new Date().toDateString()
    };
    localStorage.setItem('mathTeacherStats', JSON.stringify(data));
}

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('mathTeacherStats');
    if (saved) {
        const data = JSON.parse(saved);
        // Reset stats if it's a new day
        if (data.date === new Date().toDateString()) {
            stats = data.stats;
            currentLevel = data.level;
            updateDifficultyButtons();
        }
    }
    updateStats();
}

// Update difficulty button states
function updateDifficultyButtons() {
    difficultyBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === currentLevel);
    });
}

// Change difficulty level
function changeLevel(level) {
    currentLevel = level;
    updateDifficultyButtons();
    displayProblem();
    saveStats();
}

// Format the current date
function formatDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Event Listeners
checkBtn.addEventListener('click', checkAnswer);

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

newProblemBtn.addEventListener('click', displayProblem);

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        changeLevel(btn.dataset.level);
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    currentDate.textContent = formatDate();
    loadStats();
    displayProblem();
});
