import { gql } from '@apollo/client';

export const GET_FOLDER_INFO = gql`
query getFolderInfo($path: String!){
    getFolderInfo(path: $path){
        created
        createdBy
        id
        isFromBucket
        isProtected
        lastModified
        name
        parentPath
        path
        permissions{
            allowCreateSubDirs
            allowDelete
            allowDeleteFiles
            allowMove
            allowMoveFiles
            allowUploads
        }
        protectChildren
    }
}
`;
