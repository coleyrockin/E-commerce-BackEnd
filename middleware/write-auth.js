const crypto = require('crypto');

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));

  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function requireWriteApiKey(req, res, next) {
  const expectedKey = process.env.WRITE_API_KEY;

  if (!expectedKey) {
    return res.status(503).json({ message: 'Write API key is not configured' });
  }

  const providedKey = req.get('x-api-key');

  if (!providedKey || !safeEqual(providedKey, expectedKey)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return next();
}

module.exports = {
  requireWriteApiKey,
};
