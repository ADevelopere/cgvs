import { gql } from '@apollo/client';

export const GENERATE_UPLOAD_SIGNED_URL = gql`
mutation generateUploadSignedUrl($input: GenerateUploadSignedUrlInput!){
    generateUploadSignedUrl(input: $input)
}
`;
