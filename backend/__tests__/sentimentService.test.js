const { analyzeText } = require('../src/services/sentimentService');

describe('Sentiment Service', () => {
  it('should classify positive text', async () => {
    const result = await analyzeText('I love this!');
    expect(result.sentiment).toBe('positive');
  });

  it('should classify negative text', async () => {
    const result = await analyzeText('I hate this!');
    expect(result.sentiment).toBe('negative');
  });

  it('should classify neutral text', async () => {
    const result = await analyzeText('This is a pen.');
    expect(result.sentiment).toBe('neutral');
  });

  it('should handle empty string gracefully', async () => {
    const result = await analyzeText('');
    expect(result.sentiment).toBe('neutral'); // or whatever your code defaults to
  });

  it('should handle long or special character input', async () => {
    const result = await analyzeText('!!!???');
    expect(result.sentiment).toBeDefined();
  });

  it('should catch and return error if API call fails', async () => {
    // Mock fetch/OpenAI call failure if used
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('API Error'));
    try {
      await analyzeText('trigger error');
    } catch (err) {
      expect(err.message).toBe('API Error');
    }
    global.fetch.mockRestore();
  });
});
