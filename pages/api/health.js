import { formatApiError } from '../../lib/api-error';
import { validateRequiredEnv } from '../../lib/env';
import connectDB from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const timestamp = new Date().toISOString();
  const missing = validateRequiredEnv(process.env, ['MONGODB_URI']);

  if (missing.length > 0) {
    return res.status(503).json({
      success: false,
      status: 'degraded',
      app: 'pst-ms',
      timestamp,
      databaseConfigured: false,
      databaseConnected: false,
      error: `Missing required environment variables: ${missing.join(', ')}`,
    });
  }

  try {
    await connectDB();

    return res.status(200).json({
      success: true,
      status: 'ok',
      app: 'pst-ms',
      timestamp,
      databaseConfigured: true,
      databaseConnected: true,
    });
  } catch (error) {
    const formatted = formatApiError(error, { status: 503 });

    return res.status(formatted.status).json({
      success: false,
      status: 'degraded',
      app: 'pst-ms',
      timestamp,
      databaseConfigured: true,
      databaseConnected: false,
      error: formatted.error,
    });
  }
}
