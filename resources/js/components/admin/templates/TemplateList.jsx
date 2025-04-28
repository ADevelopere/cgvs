import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { fetchTemplates } from '../../../store/templateSlice.js';
import CardView from './views/CardView';
import ListView from './views/ListView';
import GridView from './views/GridView';

const TemplateList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templates: rawTemplates } = useSelector((state) => state.templates);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState('card');

  React.useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  // Filter templates based on search
  const templates = React.useMemo(() => {
    if (!Array.isArray(rawTemplates)) {
      return [];
    }
    return rawTemplates
      .map(template => ({
        ...template,
        id: template.id || template.uuid || Date.now() + Math.random(),
      }))
      .filter(template => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          template.name?.toLowerCase().includes(query) ||
          template.description?.toLowerCase().includes(query)
        );
      });
  }, [rawTemplates, searchQuery]);

  const handleViewChange = (event, newView) => {
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
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/templates/create')}
        >
          Create Template
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
        >
          <ToggleButton value="card" aria-label="card view">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid view">
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {renderTemplateView()}
    </Box>
  );
};

export default TemplateList;
