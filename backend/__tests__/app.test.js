const request = require('supertest');
const app = require('../src/app');

describe('App.js Express Server', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.statusCode).toBe(404);
  });

  it('should return error if route handler throws', async () => {
    // Temporarily replace route to simulate error
    app.get('/error', (req, res) => { throw new Error('Test error'); });
    const res = await request(app).get('/error');
    expect(res.statusCode).toBe(500);
    expect(res.text).toMatch(/Test error/i);
  });
});
