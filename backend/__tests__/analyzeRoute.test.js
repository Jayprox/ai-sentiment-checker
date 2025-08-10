const request = require('supertest');
const app = require('../src/app');
jest.mock('../src/services/sentimentService');

const { analyzeText } = require('../src/services/sentimentService');

describe('/analyze route', () => {
  it('should return sentiment when sentence is provided', async () => {
    analyzeText.mockResolvedValue({ sentiment: 'positive', source: 'mock' });
    const res = await request(app).post('/analyze').send({ sentence: 'Great work!' });
    expect(res.statusCode).toBe(200);
    expect(res.body.result.sentiment).toBe('positive');
  });

  it('should return 400 if sentence is missing', async () => {
    const res = await request(app).post('/analyze').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/sentence is required/i);
  });

  it('should return 500 if service throws an error', async () => {
    analyzeText.mockRejectedValue(new Error('Service failure'));
    const res = await request(app).post('/analyze').send({ sentence: 'test' });
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/Service failure/);
  });
});
