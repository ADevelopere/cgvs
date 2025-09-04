import { gql } from '@apollo/client';

export const GET_FOLDER_INFO = gql`
query getFolderInfo($path: String!){
    getFolderInfo(path: $path){
        created
        createdBy
        fileCount
        folderCount
        isFromBucket
        isProtected
        lastModified
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
        totalSize
    }
}
`;
