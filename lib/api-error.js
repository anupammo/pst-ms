export function isMongoConnectionIssue(error) {
  const rawMessage = error?.message || '';
  const normalized = rawMessage.toLowerCase();

  return (
    error?.name === 'MongooseServerSelectionError' ||
    normalized.includes('mongodb atlas cluster') ||
    normalized.includes('server selection timed out') ||
    normalized.includes("isn't whitelisted") ||
    normalized.includes('whitelist') ||
    normalized.includes('econnrefused') ||
    normalized.includes('enotfound')
  );
}

export function formatApiError(error, { status = 500, fallbackMessage = 'Request failed' } = {}) {
  const rawMessage = error?.message || fallbackMessage;

  if (isMongoConnectionIssue(error)) {
    return {
      status: 503,
      error: 'Database connection unavailable. Whitelist your current IP in MongoDB Atlas or verify MONGODB_URI.',
    };
  }

  return {
    status,
    error: rawMessage,
  };
}

export function sendApiError(res, error, options) {
  const { status, error: message } = formatApiError(error, options);
  return res.status(status).json({ success: false, error: message });
}

export function sendDemoFallback(res, data, warning = 'Live database sync is temporarily unavailable. Showing demo data instead.') {
  return res.status(200).json({
    success: true,
    data,
    demoMode: true,
    warning,
  });
}
