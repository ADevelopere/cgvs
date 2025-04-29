import React from 'react';
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useTemplateManagement } from '@/contexts/template/TemplateManagementContext';

interface SaveButtonProps {
  onSave: () => void;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, disabled }) => {
  const { unsavedChanges } = useTemplateManagement();

  return (
    <Button
      variant="contained"
      startIcon={<SaveIcon />}
      onClick={onSave}
      disabled={disabled || !unsavedChanges}
    >
      {unsavedChanges ? 'Save Changes*' : 'Save Changes'}
    </Button>
  );
};

export default SaveButton;
