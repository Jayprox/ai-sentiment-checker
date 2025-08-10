const sentimentService = require('../src/services/sentimentService');

describe('Sentiment Service', () => {
  it('classifies positive text (test mode)', async () => {
    process.env.MODE = 'test';
    const result = await sentimentService.analyzeSentiment('I love this!');
    expect(result.sentiment).toBe('positive');
  });

  it('classifies negative text (test mode)', async () => {
    process.env.MODE = 'test';
    const result = await sentimentService.analyzeSentiment('I hate this!');
    expect(result.sentiment).toBe('negative');
  });

  it('classifies neutral text (test mode)', async () => {
    process.env.MODE = 'test';
    const result = await sentimentService.analyzeSentiment('This is a chair.');
    expect(result.sentiment).toBe('neutral');
  });

  it('throws on invalid/empty input', async () => {
    process.env.MODE = 'test';
    await expect(sentimentService.analyzeSentiment('')).rejects.toThrow('Input sentence is required');
  });

  it('handles long/special-character input (test mode)', async () => {
    process.env.MODE = 'test';
    const longText = 'Wow!!! '.repeat(50);
    const result = await sentimentService.analyzeSentiment(longText);
    expect(result).toHaveProperty('sentiment');
  });

  it.skip('calls OpenAI and parses response (production path)', async () => {
    process.env.MODE = 'production';
    process.env.OPENAI_API_KEY = 'test-key';

    jest.mock('axios', () => ({
      post: jest.fn().mockResolvedValue({
        data: {
          choices: [{ message: { content: JSON.stringify({ sentiment: 'positive' }) } }]
        }
      })
    }));

    const axios = require('axios');
    const result = await sentimentService.analyzeSentiment('I am happy');
    expect(axios.post).toHaveBeenCalled();
    expect(result.sentiment).toBe('positive');
  });
});
