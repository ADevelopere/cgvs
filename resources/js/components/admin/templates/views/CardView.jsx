import React from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
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
                startIcon={<SettingsIcon />}
                onClick={() => navigate(`/admin/templates/${template.id}/manage`)}
              >
                Manage
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

CardView.propTypes = {
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      background_url: PropTypes.string,
      created_at: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};

export default CardView;
