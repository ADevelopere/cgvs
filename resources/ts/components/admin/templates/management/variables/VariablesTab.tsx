import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VariableList from './VariableList';
import PreviewValueDisplay from './PreviewValueDisplay';
import VariableForm from './VariableForm';
import { Template } from '@/contexts/template/template.types';
import { useTemplateVariables } from '@/contexts/template/TemplateVariablesContext';

interface VariablesTabProps {
  template: Template;
}

const VariablesTab: React.FC<VariablesTabProps> = ({ template }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<any>(null);
  const { 
    variables, 
    loading, 
    error, 
    fetchVariables,
    deleteVariable,
    createVariable,
    updateVariable
  } = useTemplateVariables();

  useEffect(() => {
    if (template?.id) {
      fetchVariables(template.id);
    }
  }, [template?.id]); // Removed fetchVariables from dependencies since it's now stable

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
      await deleteVariable(template.id, variableId);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedVariable) {
      await updateVariable(template.id, selectedVariable.id, data);
    } else {
      await createVariable(template.id, data);
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

      <Paper sx={{ mb: 3, height: 450 }}>
        <VariableList
          variables={variables}
          onEdit={handleEditClick}
          onDelete={(id) => handleDeleteClick(id as number)}
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

export default VariablesTab;
