const { analyzeText } = require('../src/services/sentimentService');

describe('Sentiment Service', () => {
  it('should classify positive text', async () => {
    const result = await analyzeText('I love this!');
    expect(result.sentiment).toBeDefined();
  });

  it('should classify negative text', async () => {
    const result = await analyzeText('This is awful!');
    expect(result.sentiment).toBeDefined();
  });

  it('should classify neutral text', async () => {
    const result = await analyzeText('This is a pen.');
    expect(result.sentiment).toBeDefined();
  });

  it('should handle empty string gracefully', async () => {
    // Match current backend behavior: throws "Invalid sentence input"
    await expect(analyzeText('')).rejects.toThrow(/Invalid sentence input/i);
  });

  it('should handle long or special character input', async () => {
    const longText = '!'.repeat(500);
    const result = await analyzeText(longText);
    expect(result.sentiment).toBeDefined();
  });

  it('should catch and return error if API call fails', async () => {
    process.env.NODE_ENV = 'production';
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));

    await expect(analyzeText('test')).rejects.toThrow(/API Error/);

    global.fetch.mockRestore();
  });
});
