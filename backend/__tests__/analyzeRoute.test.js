const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const analyzeRoute = require('../src/routes/analyze');

const app = express();
app.use(bodyParser.json());
app.use('/analyze', analyzeRoute);

describe('/analyze route', () => {
  it('should return sentiment when sentence is provided', async () => {
    process.env.MODE = 'test';
    const res = await request(app)
      .post('/analyze')
      .send({ sentence: 'Great work!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('result.sentiment');
  });

  it('should return 400 if sentence is missing', async () => {
    const res = await request(app).post('/analyze').send({});
    expect(res.statusCode).toBe(400);
  });

  it('should return 500 if service throws an error', async () => {
    jest.spyOn(require('../src/services/sentimentService'), 'analyzeSentiment')
      .mockRejectedValue(new Error('Service failure'));

    const res = await request(app)
      .post('/analyze')
      .send({ sentence: 'test' });

    expect(res.statusCode).toBe(500);
  });
});
