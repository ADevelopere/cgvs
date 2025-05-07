import { gql } from '@apollo/client';

export const TEMPLATE_CONFIG = gql`
query templateConfig{
    templateConfig{
        allowedFileTypes
        maxBackgroundSize
    }
}
`;
