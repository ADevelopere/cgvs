import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  Paper,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  ImageList,
  ImageListItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import { fetchTemplates } from '../../../store/templateSlice.js';
import { formatDate } from '../../../utils/dateUtils';

const TemplateList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templates: rawTemplates, loading } = useSelector((state) => state.templates);

  React.useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  // Ensure all templates have valid IDs
  const templates = React.useMemo(() => {
    if (!Array.isArray(rawTemplates)) {
      return [];
    }
    return rawTemplates.map(template => ({
      ...template,
      id: template.id || template.uuid || Date.now() + Math.random(),
    }));
  }, [rawTemplates]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Certificate Templates
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/templates/create')}
        >
          Create Template
        </Button>
      </Box>

      {templates?.length === 0 && !loading ? (
        <Paper elevation={2}>
          <Box p={3} textAlign="center">
            <Typography color="textSecondary">
              No templates found. Create your first template to get started.
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ overflowY: 'auto' }}>
          <ImageList cols={3} gap={16}>
            {templates.map((template) => (
              <ImageListItem key={template.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={template.background_url || '/placeholder.png'}
                    alt={template.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Created: {formatDate(template.created_at)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/admin/templates/${template.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<PreviewIcon />}
                      onClick={() => navigate(`/admin/templates/${template.id}/preview`)}
                    >
                      Preview
                    </Button>
                  </CardActions>
                </Card>
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}
    </Box>
  );
};

export default TemplateList;
