import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Typography, 
  Button 
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/dateUtils';

interface Template {
  id: string | number;
  name: string;
  description?: string;
  background_url?: string;
  created_at: string | number;
}

interface TemplateCardProps {
  template: Template;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const navigate = useNavigate();

  return (
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
          Created: {formatDate(template.created_at.toString())}
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
  );
};

export default TemplateCard;
