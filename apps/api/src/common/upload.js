
import busboy from 'busboy';
import { Upload } from '@aws-sdk/lib-storage';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, R2_BUCKET } from './s3.js';
import { randomUUID } from 'crypto';
import { sendJson, readJson } from './http.js';

export function handleUpload(req, res) {
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

    let bb;
    try {
        bb = busboy({ headers: req.headers });
    } catch (e) {
        return sendJson(res, 400, { error: 'Invalid headers' });
    }

    const uploads = [];

    bb.on('file', (name, file, info) => {
        const { filename, mimeType } = info;
        const key = `uploads/${randomUUID()}-${filename}`;

        // Create parallel upload to R2
        const parallelUploads3 = new Upload({
            client: s3,
            params: { Bucket: R2_BUCKET, Key: key, Body: file, ContentType: mimeType },
        });

        uploads.push(
            parallelUploads3.done().then(() => key)
        );
    });

    bb.on('close', async () => {
        try {
            const keys = await Promise.all(uploads);
            if (!keys.length) return sendJson(res, 400, { error: 'No file uploaded' });

            // Return first key
            const key = keys[0];
            const publicUrl = process.env.R2_PUBLIC_URL
                ? `${process.env.R2_PUBLIC_URL}/${key}`
                : key; // Client might need to construct full URL if R2_PUBLIC_URL is missing

            sendJson(res, 201, { url: publicUrl, key });
        } catch (e) {
            console.error(e);
            if (!res.headersSent) sendJson(res, 500, { error: e.message });
        }
    });

    bb.on('error', (err) => {
        console.error('Busboy error:', err);
        if (!res.headersSent) sendJson(res, 500, { error: err.message });
    });

    req.pipe(bb);
}

export async function generatePresignedUrl(req, res) {
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

    try {
        const body = await readJson(req);
        if (!body.filename || !body.contentType) {
            return sendJson(res, 400, { error: 'filename and contentType are required' });
        }

        const key = `uploads/${randomUUID()}-${body.filename}`;

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            ContentType: body.contentType
        });

        // URL expires in 1 hour (3600 seconds)
        const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        const publicUrl = process.env.R2_PUBLIC_URL
            ? `${process.env.R2_PUBLIC_URL}/${key}`
            : key;

        sendJson(res, 200, {
            uploadUrl: presignedUrl,
            publicUrl: publicUrl,
            key: key
        });
    } catch (e) {
        console.error('Presigned URL error:', e);
        sendJson(res, 500, { error: e.message });
    }
}
