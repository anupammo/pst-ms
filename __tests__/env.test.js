import { validateRequiredEnv } from '../lib/env';

describe('validateRequiredEnv', () => {
  it('returns missing variables when required env is absent', () => {
    expect(validateRequiredEnv({}, ['MONGODB_URI'])).toEqual(['MONGODB_URI']);
  });

  it('returns an empty array when all required env variables are present', () => {
    expect(validateRequiredEnv({ MONGODB_URI: 'mongodb://localhost:27017/test' }, ['MONGODB_URI'])).toEqual([]);
  });
});
