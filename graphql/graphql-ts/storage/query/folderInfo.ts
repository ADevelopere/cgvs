import { gql } from '@apollo/client';

export const FOLDER_INFO = gql`
query folderInfo($path: String!){
    folderInfo(path: $path){
        created
        createdBy
        fileCount
        folderCount
        isFromBucket
        isProtected
        lastModified
        name
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
