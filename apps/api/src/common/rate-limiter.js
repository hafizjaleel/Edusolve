import { sendJson } from './http.js';

const rateLimitMap = new Map();

// Background job to clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitMap.entries()) {
        if (now > data.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

/**
 * Basic in-memory rate limiter
 * Allows `limit` requests per `windowMs` window per IP/User.
 */
export function rateLimit(req, res, limit = 1000, windowMs = 15 * 60 * 1000) {
    // Identify the user by IP address or explicit User ID 
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const userId = req.headers['x-user-id'] || 'anonymous';

    // Depending on whether user is logged in, restrict by both IP and UserID to prevent multi-account abuse from same IP
    const key = `${ip}-${userId}`;
    const now = Date.now();

    let record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
        record = { count: 1, resetTime: now + windowMs };
        rateLimitMap.set(key, record);
        return true; // Proceed smoothly
    }

    record.count++;

    if (record.count > limit) {
        const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
        res.setHeader('Retry-After', retryAfterSeconds);

        sendJson(res, 429, {
            ok: false,
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Please try again in ${retryAfterSeconds} seconds.`
        });

        return false; // Blocks the request
    }

    return true; // Proceed
}
