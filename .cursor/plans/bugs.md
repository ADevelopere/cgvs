student table:

- after creating a student, filter args are not reset after succefully creating the student,
- when reseting filter args (from table header filter popup), the store state is not cleared (store.queryParams.filters)

storage gcp (firstly add logs to server sign url query/mutation):

- when uploading a file to allowed location, server responded with "Signer is not available for the file."
  example request:
  {
  "operationName": "generateUploadSignedUrl",
  "variables": {
  "input": {
  "path": "public/public/templateCover/Screenshot from 2025-09-28 23-04-53.png",
  "contentType": "PNG",
  "fileSize": 306847,
  "contentMd5": "9ddb5764004c7e07025764a228f40c69"
  }
  },
  "extensions": {
  "clientLibrary": {
  "name": "@apollo/client",
  "version": "4.0.7"
  }
  },
  "query": "mutation generateUploadSignedUrl($input: UploadSignedUrlGenerateInput!) {\n generateUploadSignedUrl(input: $input)\n}"
  }
  response:
  {
  "errors": [
  {
  "message": "Signer is not available for the file.",
  "locations": [
  {
  "line": 2,
  "column": 3
  }
  ],
  "path": [
  "generateUploadSignedUrl"
  ],
  "extensions": {
  "code": "INTERNAL_SERVER_ERROR"
  }
  }
  ],
  "data": {
  "generateUploadSignedUrl": null
  }
  }
