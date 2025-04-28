import React from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../utils/dateUtils';
import PropTypes from 'prop-types';

const CardView = ({ templates }) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      {templates.map((template) => (
        <Grid item xs={12} sm={6} md={4} key={template.id}>
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
        </Grid>
      ))}
    </Grid>
  );
};

CardView.propTypes = {
  templates: PropTypes.array.isRequired,
};

export default CardView;
