import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchVariables,
  createVariable,
  updateVariable,
  deleteVariable,
} from '@/store/variablesSlice';
import VariableList from './VariableList';
import PreviewValueDisplay from './PreviewValueDisplay';
import VariableForm from './VariableForm';
import { RootState } from '@/store/store.types';
import { Template } from '@/store/templateSlice';
import { AppDispatch } from '@/store/store.types';

interface VariablesTabProps {
  template: Template;
}

const VariablesTab: React.FC<VariablesTabProps> = ({ template }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<any>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if data is loaded
  const [localVariables, setLocalVariables] = useState<any[]>([]); // Initialize with an empty array
  const dispatch = useDispatch<AppDispatch>();
  const { variables, loading, error } = useSelector((state: RootState) => state.variables);

  useEffect(() => {
    if (template?.id && !isDataLoaded) {
      dispatch(fetchVariables(template.id));
      setIsDataLoaded(true);
    }
  }, [dispatch, template, isDataLoaded]);

  useEffect(() => {
    setLocalVariables(variables || []); // Sync local state with Redux state, fallback to empty array
  }, [variables]);

  const handleAddClick = () => {
    setSelectedVariable(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (variable: any) => {
    setSelectedVariable(variable);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (variableId: number) => {
    if (window.confirm('Are you sure you want to delete this variable?')) {
      dispatch(deleteVariable({ templateId: template.id, variableId }));
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedVariable) {
      await dispatch(updateVariable({
        templateId: template.id,
        variableId: selectedVariable.id,
        data,
      }));
    } else {
      const result = await dispatch(createVariable({
        templateId: template.id,
        data,
      }));

      if (result.meta.requestStatus === 'fulfilled') {
        setLocalVariables((prev) => [...prev, result.payload as any]); // Update local state immutably
      }
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
          variables={localVariables as any} // Temporary cast to align types
          onEdit={handleEditClick}
          onDelete={(id) => handleDeleteClick(id as number)} // Ensure id is cast to number
        />
      </Paper>

      <PreviewValueDisplay variables={localVariables as any} />

      <VariableForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        variable={selectedVariable}
      />
    </Paper>
  );
};

export default VariablesTab;
