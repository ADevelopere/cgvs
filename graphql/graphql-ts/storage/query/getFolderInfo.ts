import { gql } from '@apollo/client';

export const GET_FOLDER_INFO = gql`
query getFolderInfo($path: String!){
    getFolderInfo(path: $path){
        created
        fileCount
        folderCount
        lastModified
        name
        path
        totalSize
    }
}
`;
