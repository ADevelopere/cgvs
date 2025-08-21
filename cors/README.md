# GCS CORS configuration for client-side direct uploads

Why this exists

- Browsers enforce Cross-Origin Resource Sharing (CORS) which prevents a web page served from one origin (for example, `http://localhost:3000`) from making certain requests (like `PUT`) to another origin (like `https://storage.googleapis.com`) unless the remote server explicitly allows it.
- When uploading directly from the browser to Google Cloud Storage using signed URLs, the browser sends a preflight `OPTIONS` request to verify the bucket allows cross-origin `PUT` requests. If the bucket is not configured with an appropriate CORS policy, the browser will block the upload and report a generic "Network error" or a CORS error in the console.

What this configuration does

- Allows `PUT`, `GET`, and `OPTIONS` requests from `http://localhost:3000` and a placeholder for your production domain.
- Exposes necessary response headers like `Content-Type` and `x-goog-resumable` so the browser can proceed with uploads.

How to apply

1. Install and authenticate the Google Cloud SDK (`gcloud`) if you haven't already. See: https://cloud.google.com/sdk/docs/install

2. From the repository root (or where `cors-config.json` is located), run:

```bash
# Apply CORS configuration to the bucket
gcloud storage buckets update gs://bucket-name --cors-file=./cors/cors-config.json
```

3. Wait a minute for the changes to propagate, then retry uploading from your web app.

Notes

- Replace `https://your-production-domain.com` in `cors-config.json` with your actual production origin before deploying.
- You can add or remove origins as required.
- For security, avoid using `*` for `origin` in production; list trusted domains explicitly.
