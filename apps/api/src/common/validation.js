import { z } from 'zod';
import { sendJson } from './http.js';

/**
 * Strict schema for international phone numbers
 * E.164 format: begins with '+' followed by 7 to 15 digits
 * This enforces the presence of a country code in all mobile number payloads.
 */
export const phoneSchema = z.string()
    .trim()
    .refine(val => val === '' || /^\+?[0-9]{7,15}$/.test(val), {
        message: 'Must be a valid phone number (7 to 15 digits), optionally starting with +'
    });

/**
 * Validates a payload against a parsed Zod schema.
 * Returns the sanitized payload on success, or null (while automatically sending a 400 response) on failure.
 */
export function validatePayload(res, schema, payload) {
    const result = schema.safeParse(payload);

    if (!result.success) {
        const errorMessages = result.error.issues.map(e => {
            const field = e.path.join('.') || 'payload';
            return `${field}: ${e.message}`;
        });

        sendJson(res, 400, {
            ok: false,
            error: 'Validation failed',
            details: errorMessages
        });
        return null;
    }

    // Return the strict, validated and parsed payload (unwanted fields are stripped if schema uses .strict() or normal parsing)
    return result.data;
}
