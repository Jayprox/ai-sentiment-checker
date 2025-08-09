const request = require('supertest');
const app = require('../src/app'); // Your Express app

describe('Sentiment API (with OpenAI)', () => {
  it('should return sentiment analysis result from OpenAI', async () => {
    const res = await request(app)
      .post('/analyze') // Your route
      .send({ sentence: 'I love Jenkins!' }); // Match analyze.js field name

    // Log body for debugging
    console.log('API Response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('sentence', 'I love Jenkins!');
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toHaveProperty('sentiment');
    expect(['positive', 'negative', 'neutral']).toContain(res.body.result.sentiment);
  }, 15000); // Give enough time for OpenAI request
});