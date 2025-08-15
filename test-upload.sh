#!/bin/bash

# Test script to verify file upload configuration
# This tests basic multipart/form-data support

echo "Testing basic multipart support..."

# Create a test file
echo "test content" > /tmp/test-upload.txt

# Test with curl
echo "Testing multipart upload with curl..."
curl -X POST \
  http://localhost:8080/graphql \
  -H "Content-Type: multipart/form-data" \
  -F "operations={\"query\":\"mutation UpdateTemplateWithImage(\$input: UpdateTemplateWithImageInput!) { updateTemplateWithImage(input: \$input) { id name imageUrl } }\", \"variables\": {\"input\": {\"id\": 1, \"name\": \"Test Template\"}}}" \
  -F "map={\"0\":[\"variables.input.imageFile\"]}" \
  -F "0=@/tmp/test-upload.txt" \
  -v

echo ""
echo "Test completed. Check server logs for diagnostic output."

# Clean up
rm -f /tmp/test-upload.txt
