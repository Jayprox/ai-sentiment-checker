const { analyzeText } = require('../src/services/sentimentService');

describe('Sentiment Service', () => {
  it('should classify positive text', async () => {
    const result = await analyzeText('I love this!');
    expect(result.sentiment).toBe('positive');
  });

  it('should classify negative text', async () => {
    const result = await analyzeText('I hate bugs!');
    expect(result.sentiment).toBe('negative');
  });

  it('should classify neutral text', async () => {
    const result = await analyzeText('This is a test.');
    expect(result.sentiment).toBe('neutral');
  });
});
