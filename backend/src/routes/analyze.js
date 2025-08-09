const express = require('express');
const router = express.Router();
const { analyzeText } = require('../services/sentimentService');

router.post('/', async (req, res) => {
  const { sentence } = req.body;
  console.log("📥 Incoming request body:", req.body);

  if (!sentence || typeof sentence !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "sentence" field' });
  }

  try {
    const result = await analyzeText(sentence);
    res.json({ sentence, result });
  } catch (error) {
    console.error('Error analyzing sentiment:', error.message);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

module.exports = router;
