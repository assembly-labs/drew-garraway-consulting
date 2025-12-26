const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const sourceCards = document.querySelectorAll('.source-card');

// Search functionality
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    const assetType = document.querySelector('input[name="assetType"]:checked').value;

    resultsDiv.innerHTML = '<div class="loading">Searching...</div>';

    try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&type=${assetType}`);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        resultsDiv.innerHTML = '<div class="loading">Error searching. Please try again.</div>';
    }
}

function displayResults(data) {
    if (!data.results || data.results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="loading">
                <h3>Ready to search!</h3>
                <p>Enter a search term above or click a source below to get started.</p>
            </div>
        `;
        return;
    }

    const resultsHTML = `
        <h3>Results for "${data.query}"</h3>
        <div class="results-grid">
            ${data.results.map(result => `
                <div class="result-item">
                    <img src="${result.thumbnail}" alt="${result.title}">
                    <div class="result-info">
                        <strong>${result.title}</strong>
                        <p>${result.source}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    resultsDiv.innerHTML = resultsHTML;
}

// Source card clicks
sourceCards.forEach(card => {
    card.addEventListener('click', () => {
        const source = card.dataset.source;
        openSource(source);
    });
});

function openSource(source) {
    const urls = {
        unsplash: 'https://unsplash.com',
        pexels: 'https://pexels.com',
        iconify: 'https://iconify.design',
        flaticon: 'https://flaticon.com'
    };

    if (urls[source]) {
        window.open(urls[source], '_blank');
    }
}

// Initial display
resultsDiv.innerHTML = `
    <div class="loading">
        <h3>Welcome!</h3>
        <p>Search for images, icons, and design assets above, or click a source to explore.</p>
    </div>
`;
