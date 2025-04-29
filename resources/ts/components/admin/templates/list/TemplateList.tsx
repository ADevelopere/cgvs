import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import CardView from './views/CardView';
import ListView from './views/ListView';
import GridView from './views/GridView';
import { useTemplate, useTemplates } from '@/contexts/template/TemplateContext';

type ViewMode = 'card' | 'grid' | 'list';

const TemplateList: React.FC = () => {
  const navigate = useNavigate();
  const { fetchTemplates } = useTemplate();
  const rawTemplates = useTemplates();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Filter templates based on search
  const templates = React.useMemo(() => {
    if (!Array.isArray(rawTemplates)) {
      return [];
    }
    return rawTemplates.filter((template) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        template.name?.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query)
      );
    });
  }, [rawTemplates, searchQuery]);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: ViewMode | null
  ): void => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const renderTemplateView = () => {
    if (templates?.length === 0) {
      return (
        <Paper elevation={2}>
          <Box p={3} textAlign="center">
            <Typography color="textSecondary">
              {searchQuery
                ? 'No templates found matching your search.'
                : 'No templates found. Create your first template to get started.'}
            </Typography>
          </Box>
        </Paper>
      );
    }

    switch (viewMode) {
      case 'list':
        return <ListView templates={templates} />;
      case 'grid':
        return <GridView templates={templates} />;
      default:
        return <CardView templates={templates} />;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Certificate Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/templates/create')}
        >
          Create Template
        </Button>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange}>
          <ToggleButton value="card">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="grid">
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {renderTemplateView()}
    </Box>
  );
};

export default TemplateList;
