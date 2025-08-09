const request = require('supertest');
const app = require('../src/index'); // assuming Express app

describe('Sentiment API', () => {
  it('should return sentiment analysis result', async () => {
    const res = await request(app)
      .post('/api/sentiment')
      .send({ text: 'I love Jenkins!' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('sentiment');
  });
});
