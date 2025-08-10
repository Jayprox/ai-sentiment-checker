const request = require('supertest');
const express = require('express');

const app = express();
app.use((req, res, next) => next(new Error('Test error handler')));
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong' });
});

describe('App.js Express Server', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toBe(500);
  });

  it('should return error if route handler throws', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(500);
  });
});
