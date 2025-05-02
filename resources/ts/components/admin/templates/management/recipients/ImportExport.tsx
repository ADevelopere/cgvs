import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTemplateRecipients } from '@/contexts/template/TemplateRecipientsContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ValidationResults from './ValidationResults';

interface ImportExportProps {
    templateId: number;
}

export default function ImportExport({ templateId }: ImportExportProps) {
    const {
        selectedFile,
        setSelectedFile,
        validationResult,
        setValidationResult,
        isUploading,
        showImportDialog,
        setShowImportDialog,
        importRecipients
    } = useTemplateRecipients();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
            try {
                await importRecipients(acceptedFiles[0]);
                setShowImportDialog(false);
                setSelectedFile(null);
                setValidationResult(null);
            } catch (error) {
                // Error handling is done in the context
            }
        }
    }, [importRecipients, setSelectedFile, setShowImportDialog, setValidationResult]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1
    });

    return (
        <Dialog open={showImportDialog} onClose={() => setShowImportDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Import Recipients</DialogTitle>
            <DialogContent>
                {!selectedFile && !isUploading && (
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed #ccc',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: 'primary.main'
                            }
                        }}
                    >
                        <input {...getInputProps()} />
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            {isDragActive
                                ? 'Drop the Excel file here'
                                : 'Drag and drop an Excel file here, or click to select'}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Supported formats: .xlsx, .xls
                        </Typography>
                    </Box>
                )}

                {isUploading && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            Importing recipients...
                        </Typography>
                        <LinearProgress />
                    </Box>
                )}

                {validationResult && validationResult.errors && validationResult.errors.length > 0 && (
                    <ValidationResults sx={{ mt: 2 }} />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowImportDialog(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
