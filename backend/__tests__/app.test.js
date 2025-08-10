const request = require('supertest');
const express = require('express');

const app = express();
app.get('/test', (req, res) => res.json({ message: 'ok' }));

describe('App.js Express Server', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toBe(404);
  });

  it('should return error if route handler throws', async () => {
    app.get('/error', () => {
      throw new Error('Forced error');
    });
    const res = await request(app).get('/error');
    expect(res.statusCode).toBe(500);
  });
});
