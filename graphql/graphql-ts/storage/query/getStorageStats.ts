import { gql } from '@apollo/client';

export const GET_STORAGE_STATS = gql`
query getStorageStats($path: String){
    getStorageStats(path: $path){
        fileTypeBreakdown{
            count
            type
        }
        totalFiles
        totalFolders
        totalSize
    }
}
`;
