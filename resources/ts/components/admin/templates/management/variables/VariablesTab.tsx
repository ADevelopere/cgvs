import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState<number | null>(null);
  
  const { 
    variables, 
    fetchVariables,
    deleteVariable,
    createVariable,
    updateVariable
  } = useTemplateVariables();

  useEffect(() => {
    if (template?.id) {
      fetchVariables(template.id);
    }
  }, [template?.id]);

  const handleAddClick = () => {
    setSelectedVariable(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (variable: any) => {
    setSelectedVariable(variable);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string | number) => {
    setVariableToDelete(typeof id === 'string' ? parseInt(id, 10) : id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (variableToDelete) {
      try {
        await deleteVariable(template.id, variableToDelete);
      } catch (error) {
        // Error is already handled by the context
      }
      setDeleteDialogOpen(false);
      setVariableToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVariableToDelete(null);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedVariable) {
        await updateVariable(template.id, selectedVariable.id, data);
      } else {
        await createVariable(template.id, data);
      }
      setIsFormOpen(false);
    } catch (error) {
      // Error is already handled by the context
    }
  };

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

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Variable
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this variable? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default VariablesTab;
