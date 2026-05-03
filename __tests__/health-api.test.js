jest.mock('../lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import handler from '../pages/api/health';
import connectDB from '../lib/mongodb';

function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('/api/health', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, MONGODB_URI: 'mongodb://example/test' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns 503 when the database is configured but unreachable', async () => {
    connectDB.mockRejectedValue(new Error('Could not connect to any servers in your MongoDB Atlas cluster'));

    const req = { method: 'GET' };
    const res = createRes();

    await handler(req, res);

    expect(res.statusCode).toBe(503);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        status: 'degraded',
        databaseConfigured: true,
        databaseConnected: false,
        error: expect.stringMatching(/database connection unavailable/i),
      })
    );
  });
});
