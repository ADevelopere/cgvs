import React from 'react';
import { Box, TextField, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FormData {
  name: string;
  description: string;
  [key: string]: any; // for any additional fields
}

interface CreateTemplateFormProps {
  formData: FormData;
  onFormChange: (field: string, value: string) => void;
  onFileChange: (file: File) => void;
  maxFileSize: number;
}

const CreateTemplateForm: React.FC<CreateTemplateFormProps> = ({ formData, onFormChange, onFileChange, maxFileSize }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: maxFileSize * 1024, // Convert KB to bytes
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    }
  });

  return (
    <Box component={Paper} p={3}>
      <TextField
        fullWidth
        label="Template Name"
        value={formData.name}
        onChange={(e) => onFormChange('name', e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) => onFormChange('description', e.target.value)}
        margin="normal"
        multiline
        rows={4}
      />
      <Paper
        {...getRootProps()}
        sx={{
          mt: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: 'background.default',
          border: '2px dashed',
          borderColor: 'grey.500',
          '&:hover': {
            borderColor: 'primary.main'
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
        <Box>
          Drag and drop your background image here, or click to select
        </Box>
        <Box mt={1} color="text.secondary" fontSize="0.875rem">
          Maximum file size: {(maxFileSize / 1024).toFixed(1)}MB
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateTemplateForm;
