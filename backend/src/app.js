const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const analyzeRoute = require('./routes/analyze');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/analyze', analyzeRoute);

app.get('/', (req, res) => {
  res.send('AI Sentiment Checker API is running!');
});

app.get('/ping', (req, res) => {
  console.log('✅ /ping route was hit');
  res.json({ pong: true });
});

module.exports = app; // Export raw app for testing
