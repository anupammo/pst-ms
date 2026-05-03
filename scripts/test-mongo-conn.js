const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function loadMongoUri() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^MONGODB_URI=(.+)$/m);
    if (match) return match[1].trim();
    return process.env.MONGODB_URI;
  } catch (e) {
    return process.env.MONGODB_URI;
  }
}

(async () => {
  try {
    const uri = loadMongoUri();
    if (!uri) {
      console.error('MONGODB_URI not found in .env.local or environment');
      process.exit(1);
    }
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected');
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();