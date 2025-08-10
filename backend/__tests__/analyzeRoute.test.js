const request = require('supertest');
const app = require('../src/app');
const sentimentService = require('../src/services/sentimentService');

jest.mock('../src/services/sentimentService');

describe('/analyze route', () => {
  it('should return sentiment when sentence is provided', async () => {
    sentimentService.analyzeText.mockResolvedValueOnce({
      sentiment: 'positive',
      source: 'mock'
    });

    const res = await request(app)
      .post('/analyze')
      .send({ sentence: 'Great work!' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('result.sentiment', 'positive');
  });

  it('should return 400 if sentence is missing', async () => {
    const res = await request(app).post('/analyze').send({});
    expect(res.statusCode).toBe(400);
    // Match current backend error message
    expect(res.body.error).toMatch(/Missing or invalid "sentence" or "text" field/i);
  });

  it('should return 500 if service throws an error', async () => {
    sentimentService.analyzeText.mockRejectedValueOnce(new Error('Service failure'));

    const res = await request(app)
      .post('/analyze')
      .send({ sentence: 'test' });

    expect(res.statusCode).toBe(500);
    // Match current backend error message
    expect(res.body.error).toMatch(/Failed to analyze sentiment/i);
  });
});
