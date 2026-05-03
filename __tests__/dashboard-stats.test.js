jest.mock('../lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../models/Quotation', () => ({
  __esModule: true,
  default: {
    countDocuments: jest.fn(),
    find: jest.fn(),
  },
}));

jest.mock('../models/Traveller', () => ({
  __esModule: true,
  default: {
    countDocuments: jest.fn(),
  },
}));

jest.mock('../models/Lead', () => ({
  __esModule: true,
  default: {
    countDocuments: jest.fn(),
    find: jest.fn(),
  },
}));

jest.mock('../models/Invoice', () => ({
  __esModule: true,
  default: {
    countDocuments: jest.fn(),
  },
}));

import handler from '../pages/api/dashboard/stats';
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

describe('/api/dashboard/stats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns demo dashboard data when MongoDB Atlas is unreachable', async () => {
    connectDB.mockRejectedValue(
      new Error(
        "Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted."
      )
    );

    const req = { method: 'GET' };
    const res = createRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        demoMode: true,
        warning: expect.stringMatching(/demo data|database connection unavailable/i),
        data: expect.objectContaining({
          totalQuotations: expect.any(Number),
          totalTravellers: expect.any(Number),
          totalLeads: expect.any(Number),
          totalInvoices: expect.any(Number),
        }),
      })
    );
  });
});
