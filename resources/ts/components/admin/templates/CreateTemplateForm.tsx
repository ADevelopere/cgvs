import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Paper,
  Button,
  Card,
  CardMedia,
  Snackbar,
  Alert,
  Container,
  Typography
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTemplate, useTemplateConfig } from '@/contexts/template/TemplateContext';

interface FormData {
  name: string;
  description: string;
  background?: File;
}

const CreateTemplateForm: React.FC = () => {
  const navigate = useNavigate();
  const { createTemplate } = useTemplate();
  const config = useTemplateConfig();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFormChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File): void => {
    setFormData(prev => ({ ...prev, background: file }));
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      await createTemplate(formData);
      navigate('/admin/templates');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: config.maxFileSize * 1024, // Convert KB to bytes
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles[0]);
      }
    }
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Template
        </Typography>

        <Box component={Paper} p={3}>
          <TextField
            fullWidth
            label="Template Name"
            value={formData.name}
            onChange={(e) => handleFormChange('name', e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
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
              Maximum file size: {(config.maxFileSize / 1024).toFixed(1)}MB
            </Box>
          </Paper>
        </Box>

        {preview && (
          <Card sx={{ mt: 3, position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={preview}
              alt="Background preview"
            />
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={() => {
                setFormData(prev => ({ ...prev, background: undefined }));
                setPreview(null);
              }}
            >
              Remove
            </Button>
          </Card>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/templates')}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateTemplateForm;
