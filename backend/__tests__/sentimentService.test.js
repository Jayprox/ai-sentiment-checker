const analyzeSentiment = require('../src/services/sentimentService');

describe('Sentiment Service', () => {
  it('should classify positive text', () => {
    const result = analyzeSentiment('I love this!');
    expect(result.sentiment).toBe('positive');
  });

  it('should classify negative text', () => {
    const result = analyzeSentiment('I hate bugs!');
    expect(result.sentiment).toBe('negative');
  });
});
