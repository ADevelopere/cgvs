import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VariableList from '../variables/VariableList';
import VariableForm from '../variables/VariableForm';
import PreviewValueDisplay from '../variables/PreviewValueDisplay';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchVariables,
  createVariable,
  updateVariable,
  deleteVariable,
} from '../../../../../store/variablesSlice.js';

const VariablesTab = ({ template }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const dispatch = useDispatch();
  const { variables, loading, error } = useSelector((state) => state.variables);

  useEffect(() => {
    if (template?.id) {
      dispatch(fetchVariables(template.id));
    }
  }, [dispatch, template]);

  const handleAddClick = () => {
    setSelectedVariable(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (variable) => {
    setSelectedVariable(variable);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (variableId) => {
    if (window.confirm('Are you sure you want to delete this variable?')) {
      dispatch(deleteVariable({ templateId: template.id, variableId }));
    }
  };

  const handleFormSubmit = async (data) => {
    if (selectedVariable) {
      dispatch(updateVariable({
        templateId: template.id,
        variableId: selectedVariable.id,
        data,
      }));
    } else {
      dispatch(createVariable({
        templateId: template.id,
        data,
      }));
    }
    setIsFormOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Template Variables
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Variable
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <VariableList
          variables={variables}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Paper>

      <PreviewValueDisplay variables={variables} />

      <VariableForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        variable={selectedVariable}
      />
    </Paper>
  );
};
VariablesTab.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // add other properties if needed
  }).isRequired,
};

export default VariablesTab;
