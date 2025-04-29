import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  Snackbar,
  Alert,
} from '@mui/material';
import { createTemplate, fetchConfig } from '../../../store/templateSlice';
import CreateTemplateForm from '../../../components/admin/templates/CreateTemplateForm';
import DeleteIcon from '@mui/icons-material/Delete';

const Create = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    background: null,
  });
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const { config } = useSelector((state) => ({
    config: state.templates.config || { maxFileSize: 5120 }
  }));

  useEffect(() => {
    dispatch(fetchConfig())
      .unwrap()
      .then(config => {
        console.log('Received config from server:', config);
      })
      .catch(error => {
        console.error('Error fetching config:', error);
      });
  }, [dispatch]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file) => {
    setFormData(prev => ({ ...prev, background: file }));
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      await dispatch(createTemplate(formData)).unwrap();
      navigate('/admin/templates');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Template
        </Typography>

        <CreateTemplateForm
          formData={formData}
          onFormChange={handleFormChange}
          onFileChange={handleFileChange}
          maxFileSize={config.maxFileSize}
        />

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
                setFormData(prev => ({ ...prev, background: null }));
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

export default Create;
