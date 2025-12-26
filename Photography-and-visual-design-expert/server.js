const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints for image sources
app.get('/api/search', async (req, res) => {
  const { query, type } = req.query;
  // Placeholder for now - will integrate with APIs
  res.json({ results: [], query, type });
});

app.listen(PORT, () => {
  console.log(`Photography & Visual Design Expert running on http://localhost:${PORT}`);
});
