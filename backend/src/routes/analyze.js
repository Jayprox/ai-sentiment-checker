const express = require('express');
const router = express.Router();
const { analyzeText } = require('../services/sentimentService');

router.post('/', async (req, res) => {
  const { sentence, text } = req.body;
  // Use either 'sentence' or 'text' field for analysis
  // This allows flexibility in the request body structure
  // If both are provided, prioritize 'sentence'
  // If neither is provided, return an error
  const input = sentence || text;

  console.log("📥 Incoming request body:", req.body);

if (!input || typeof input !== 'string') {
  return res.status(400).json({ error: 'Missing or invalid "sentence" or "text" field' });
}

try {
  const result = await analyzeText(input);
  res.json({ sentence: input, result });
} catch (error) {
  console.error('Error analyzing sentiment:', error.message);
  res.status(500).json({ error: 'Failed to analyze sentiment' });
}
});

module.exports = router;
