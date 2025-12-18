// This will be loaded from quotes-data.js
// The quotes array is defined in quotes-data.js and will be available globally

// Get the day of the year (1-365/366)
function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Get quote index based on day of year
function getTodaysQuoteIndex() {
    const dayOfYear = getDayOfYear();
    return dayOfYear % quotes.length;
}

// Format the current date
function formatDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Display today's quote
function displayQuote() {
    const index = getTodaysQuoteIndex();
    const todaysQuote = quotes[index];

    // Update DOM elements
    document.getElementById('mainQuote').textContent = `"${todaysQuote.quote}"`;
    document.getElementById('quoteAuthor').textContent = `— ${todaysQuote.author}, ${todaysQuote.title}`;
    document.getElementById('simplifiedText').querySelector('p').textContent = todaysQuote.simplified;
    document.getElementById('reflectionText').querySelector('p').textContent = todaysQuote.reflection;
    document.getElementById('currentDate').textContent = formatDate();
    document.getElementById('quoteNumber').textContent = getDayOfYear();
}

// Handle scroll indicator visibility
function handleScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Hide indicator after scrolling 100px or near bottom
    if (scrollPosition > 100 || (scrollPosition + windowHeight) >= documentHeight - 100) {
        scrollIndicator.classList.add('hidden');
    } else {
        scrollIndicator.classList.remove('hidden');
    }
}

// Smooth scroll when clicking indicator
function scrollToContent() {
    const simplifiedSection = document.querySelector('.simplified-section');
    simplifiedSection.scrollIntoView({ behavior: 'smooth' });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayQuote();

    // Set up scroll indicator
    const scrollIndicator = document.getElementById('scrollIndicator');
    scrollIndicator.addEventListener('click', scrollToContent);

    // Listen for scroll events
    window.addEventListener('scroll', handleScrollIndicator);

    // Initial check
    handleScrollIndicator();
});
