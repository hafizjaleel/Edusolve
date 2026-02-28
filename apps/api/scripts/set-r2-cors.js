import { PutBucketCorsCommand } from '@aws-sdk/client-s3';
import { s3, R2_BUCKET } from '../src/common/s3.js';

const corsConfig = {
    CORSRules: [
        {
            AllowedOrigins: ['*'],                         // Allow all origins (browser uploads)
            AllowedMethods: ['PUT', 'GET', 'HEAD'],        // Allow PUT for direct uploads
            AllowedHeaders: ['*'],                         // Allow all headers (Content-Type etc.)
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3600,
        },
    ],
};

async function setCors() {
    try {
        await s3.send(new PutBucketCorsCommand({
            Bucket: R2_BUCKET,
            CORSConfiguration: corsConfig,
        }));
        console.log(`✅ CORS configured successfully on bucket: ${R2_BUCKET}`);
    } catch (err) {
        console.error('❌ Failed to set CORS:', err.message);
    }
}

setCors();
