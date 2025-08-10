const axios = require('axios');
require('dotenv').config();

async function analyzeSentiment(sentence) {
  if (!sentence || typeof sentence !== 'string') {
    throw new Error('Input sentence is required');
  }

  // When running in test mode, skip OpenAI and return a fake result
  if (process.env.MODE === 'test') {
    let sentiment = 'neutral';
    const lower = sentence.toLowerCase();

    if (lower.includes('love') || lower.includes('great') || lower.includes('awesome')) {
      sentiment = 'positive';
    } else if (lower.includes('hate') || lower.includes('terrible') || lower.includes('bad')) {
      sentiment = 'negative';
    }

    return { sentiment, source: 'mock' };
  }

  // Production: Call OpenAI API
  const prompt = `Classify the sentiment of this sentence as "positive", "negative", or "neutral":\n\n"${sentence}"`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const message = response.data.choices[0].message.content.trim().toLowerCase();

    return {
      sentiment: message,
      source: 'openai',
      debug: response.data.usage
    };

  } catch (error) {
    console.error('❌ OpenAI API error:', error.response?.data || error.message);
    throw new Error('OpenAI API call failed');
  }
}

module.exports = { analyzeSentiment };
