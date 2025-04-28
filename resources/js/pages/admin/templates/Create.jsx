import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  TextField,
  Card,
  CardMedia,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { createTemplate, fetchConfig } from '../../../store/templateSlice.js';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const steps = ['Basic Information', 'Background Image', 'Review'];

const Create = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    background: null,
  });
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const { config } = useSelector((state) => ({
    config: state.templates.config || { maxFileSize: 5120 }  // Use 5MB as default
  }));
  
  useEffect(() => {
    // Fetch config and log the response
    dispatch(fetchConfig())
      .unwrap()
      .then(config => {
        console.log('Received config from server:', config);
      })
      .catch(error => {
        console.error('Error fetching config:', error);
      });
  }, [dispatch]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: config.maxFileSize * 1024, // Convert KB to bytes
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFormData(prev => ({ ...prev, background: file }));
        setPreview(URL.createObjectURL(file));
        setError(null);
      }
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0].code === 'file-too-large') {
          setError(`File is too large. Maximum size allowed is ${(config.maxFileSize / 1024).toFixed(1)} MB`);
        } else {
          setError(rejection.errors[0].message);
        }
      }
    }
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      await dispatch(createTemplate(formData)).unwrap();
      navigate('/admin/templates');
    } catch (err) {
      setError(err.message);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="Template Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Paper
              {...getRootProps()}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'background.default',
                border: error ? '2px dashed error.main' : '2px dashed grey.500',
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 48, color: error ? 'error.main' : 'text.secondary', mb: 2 }} />
              <Typography>
                Drag and drop a background image here, or click to select one
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Maximum file size: {(config.maxFileSize / 1024).toFixed(1)} MB
              </Typography>
              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Paper>

            {preview && (
              <Card sx={{ mt: 2, position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={preview}
                  alt="Template background preview"
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, background: null }));
                    setPreview(null);
                  }}
                >
                  <DeleteIcon sx={{ color: 'white' }} />
                </IconButton>
              </Card>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Template
            </Typography>
            <Typography>Name: {formData.name}</Typography>
            <Typography>Description: {formData.description}</Typography>
            {preview && (
              <Card sx={{ mt: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={preview}
                  alt="Template background preview"
                />
              </Card>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Template
        </Typography>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!formData.name}
            >
              {activeStep === steps.length - 1 ? 'Create Template' : 'Next'}
            </Button>
          </Box>
        </Paper>
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

export default Create;
