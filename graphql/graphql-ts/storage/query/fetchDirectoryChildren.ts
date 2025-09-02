import { gql } from '@apollo/client';

export const FETCH_DIRECTORY_CHILDREN = gql`
query fetchDirectoryChildren($path: String){
    fetchDirectoryChildren(path: $path){
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
