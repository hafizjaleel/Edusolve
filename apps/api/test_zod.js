import { z } from 'zod';
import { phoneSchema, validatePayload } from './src/common/validation.js';

const testSchema = z.object({
    contact_number: phoneSchema.optional()
}).strict();

const payload = { contact_number: "9876543210" };

const result = testSchema.safeParse(payload);
if (!result.success) {
    console.log('Errors:', result.error.errors);
    console.log('Issues:', result.error.issues);
}
