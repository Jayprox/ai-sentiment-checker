// backend/__tests__/sentimentService.test.js
const axios = require('axios');
jest.mock('axios'); // important: prevents real network calls

const { analyzeText } = require('../src/services/sentimentService');

describe('Sentiment Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // default to test mode so sentiment is mocked by the service
    process.env = { ...originalEnv, NODE_ENV: 'test' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // ---- Test-mode (mock path) ----
  it('classifies positive text (test mode)', async () => {
    const result = await analyzeText('I love this!');
    expect(result.sentiment).toBe('positive');
    expect(result.source).toBe('mock');
  });

  it('classifies negative text (test mode)', async () => {
    const result = await analyzeText('This is terrible!');
    expect(result.sentiment).toBe('negative');
    expect(result.source).toBe('mock');
  });

  it('classifies neutral text (test mode)', async () => {
    const result = await analyzeText('This is a pen.');
    expect(result.sentiment).toBe('neutral');
    expect(result.source).toBe('mock');
  });

  it('throws on invalid/empty input', async () => {
    await expect(analyzeText('')).rejects.toThrow(/Invalid sentence input/i);
    await expect(analyzeText(null)).rejects.toThrow(/Invalid sentence input/i);
  });

  it('handles long/special-character input (test mode)', async () => {
    const result = await analyzeText('!'.repeat(500));
    expect(['positive', 'negative', 'neutral']).toContain(result.sentiment);
  });

  // ---- Production/OpenAI path (success) ----
  it('calls OpenAI and parses response (production path)', async () => {
    process.env.NODE_ENV = 'production';
    process.env.OPENAI_API_KEY = 'dummy';

    axios.post.mockResolvedValueOnce({
      data: {
        choices: [{ message: { content: ' Positive  ' } }],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 }
      }
    });

    const result = await analyzeText('Great job!');
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      sentiment: 'positive',
      source: 'openai',
      debug: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 }
    });
  });

});
