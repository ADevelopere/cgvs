import { gql } from '@apollo/client';

export const STORAGE_STATS = gql`
query storageStats($path: String){
    storageStats(path: $path){
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
