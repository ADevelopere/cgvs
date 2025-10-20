# Signed URL Upload Test

This directory contains a shell script test that validates the complete upload flow using the `get-signed-url.sh` script.

## Test Script: `test-signed-url-upload.sh`

This script performs an end-to-end test of the signed URL generation and file upload process:

1. **Generates a signed URL** using the `get-signed-url.sh` script
2. **Extracts the signed URL and MD5 hash** from the script output
3. **Tests the upload** using curl to upload the file to Google Cloud Storage
4. **Validates the upload** was successful (HTTP 200 response)

## Prerequisites

- GraphQL server running on `http://localhost:3000`
- `get-signed-url.sh` script available in `./scripts/`
- `demo1.jpg` file in `public/templateCover/`
- `curl` command available
- `md5sum` or `md5` command available
- `bun` or `node` runtime available

## Usage

```bash
# Make the script executable (if not already)
chmod +x tests/test-signed-url-upload.sh

# Run the test
./tests/test-signed-url-upload.sh
```

## Test File

The test uses `public/templateCover/demo1.jpg` as the test file. This file:

- Is a JPEG image (230KB)
- Has the correct content type (`image/jpeg`)
- Is used to test the complete upload flow

## Expected Output

On success, you should see:

```
==========================================
    ALL TESTS PASSED!
==========================================
```

On failure, the script will show detailed error information including:

- Missing dependencies
- Script execution errors
- Curl upload failures
- HTTP status codes

## What the Test Validates

1. **Prerequisites**: All required tools and files are available
2. **Signed URL Generation**: The `get-signed-url.sh` script can generate a valid signed URL
3. **URL Extraction**: The script can parse the signed URL from the output
4. **MD5 Hash Extraction**: The script can extract the MD5 hash for the Content-MD5 header
5. **File Upload**: The curl command can successfully upload the file to Google Cloud Storage
6. **HTTP Response**: The upload returns a 200 status code indicating success

## Troubleshooting

- **"Missing dependencies"**: Install the required tools (curl, md5sum/md5, bun/node)
- **"Failed to generate signed URL"**: Check that the GraphQL server is running
- **"Upload failed"**: Check the curl output for specific error details
- **"Could not extract signed URL"**: The script output format may have changed

## Integration with CI/CD

This test can be integrated into CI/CD pipelines to validate the upload functionality:

```bash
# In your CI pipeline
./tests/test-signed-url-upload.sh
```

The script returns exit code 0 on success and exit code 1 on failure, making it suitable for automated testing.
