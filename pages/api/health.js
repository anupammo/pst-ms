import { validateRequiredEnv } from '../../lib/env';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const missing = validateRequiredEnv(process.env, ['MONGODB_URI']);

  return res.status(200).json({
    success: true,
    status: 'ok',
    app: 'pst-ms',
    timestamp: new Date().toISOString(),
    databaseConfigured: missing.length === 0,
  });
}
