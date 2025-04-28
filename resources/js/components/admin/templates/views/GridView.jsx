import React from 'react';
import { ImageList, ImageListItem, ImageListItemBar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const GridView = ({ templates }) => {
  const navigate = useNavigate();

  return (
    <ImageList cols={4} gap={16}>
      {templates.map((template) => (
        <ImageListItem key={template.id}>
          <img
            src={template.background_url || '/placeholder.png'}
            alt={template.name}
            loading="lazy"
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <ImageListItemBar
            title={template.name}
            subtitle={template.description}
            actionIcon={
              <>
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  onClick={() => navigate(`/admin/templates/${template.id}/edit`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  onClick={() => navigate(`/admin/templates/${template.id}/preview`)}
                >
                  <PreviewIcon />
                </IconButton>
              </>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

GridView.propTypes = {
  templates: PropTypes.array.isRequired,
};

export default GridView;
