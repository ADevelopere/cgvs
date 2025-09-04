import { gql } from '@apollo/client';

export const DIRECTORY_CHILDREN = gql`
query directoryChildren($path: String){
    directoryChildren(path: $path){
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
