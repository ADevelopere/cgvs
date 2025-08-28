import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { getLocationInfo } from '@/contexts/storage/storage.location';
import { getAcceptAttribute, contentTypesToMimeTypes, contentTypesToExtensions } from '@/contexts/storage/storage.util';

const FileTypeDebugger: React.FC = () => {
    const templateCoverInfo = getLocationInfo('TEMPLATE_COVER');
    const mimeTypes = contentTypesToMimeTypes(templateCoverInfo.allowedContentTypes);
    const extensions = contentTypesToExtensions(templateCoverInfo.allowedContentTypes);
    const acceptAttribute = getAcceptAttribute(templateCoverInfo.allowedContentTypes);

    return (
        <Paper sx={{ p: 2, m: 2 }}>
            <Typography variant="h6" gutterBottom>
                File Type Debug Information
            </Typography>
            
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    TEMPLATE_COVER Allowed Content Types:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {JSON.stringify(templateCoverInfo.allowedContentTypes)}
                </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    Generated MIME Types:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {JSON.stringify(mimeTypes)}
                </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    Generated Extensions:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {JSON.stringify(extensions)}
                </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    Final Accept Attribute:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {acceptAttribute}
                </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    Test File Input:
                </Typography>
                <input 
                    type="file" 
                    accept={acceptAttribute}
                    multiple
                    onChange={(e) => {
                        console.log('Selected files:', Array.from(e.target.files || []));
                    }}
                />
            </Box>
        </Paper>
    );
};

export default FileTypeDebugger;