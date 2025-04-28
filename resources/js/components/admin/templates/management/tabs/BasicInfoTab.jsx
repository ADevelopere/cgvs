import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardMedia,
  Button,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { fetchTemplate } from '../../../../../store/templateSlice';
import DeleteIcon from '@mui/icons-material/Delete';

const BasicInfoTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentTemplate, loading, error } = useSelector((state) => state.templates);
  const [status, setStatus] = useState('draft');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchTemplate(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentTemplate?.background_url) {
      setPreview(currentTemplate.background_url);
    }
  }, [currentTemplate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveBackground = () => {
    setPreview(null);
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box color="error.main">{error}</Box>;
  }

  return (
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="templateName"
        label="Template Name"
        name="name"
        value={currentTemplate?.name || ''}
        autoFocus
      />
      
      <TextField
        margin="normal"
        fullWidth
        multiline
        rows={4}
        id="templateDescription"
        label="Description"
        name="description"
        value={currentTemplate?.description || ''}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          id="status"
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </Select>
      </FormControl>

      {preview ? (
        <Card sx={{ mt: 3, position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={preview}
            alt="Template background"
            sx={{ objectFit: 'contain' }}
          />
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveBackground}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            Remove
          </Button>
        </Card>
      ) : (
        <Card sx={{ mt: 3, mb: 3 }}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload Background
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Recommended size: 1920x1080px
            </Typography>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default BasicInfoTab;
