export function validateRequiredEnv(source = process.env, requiredKeys = []) {
  return requiredKeys.filter((key) => !source?.[key]);
}

export function getRequiredEnv(source = process.env) {
  const missing = validateRequiredEnv(source, ['MONGODB_URI']);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. Add them in .env.local for local development or in your Vercel project settings for production.`
    );
  }

  return {
    MONGODB_URI: source.MONGODB_URI,
  };
}
