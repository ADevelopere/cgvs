import React from 'react';
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useSelector } from 'react-redux';
import { selectUnsavedChanges } from '@/store/templateManagementSlice';

interface SaveButtonProps {
  onSave: () => void;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, disabled }) => {
  const hasUnsavedChanges = useSelector(selectUnsavedChanges);

  return (
    <Button
      variant="contained"
      startIcon={<SaveIcon />}
      onClick={onSave}
      disabled={disabled || !hasUnsavedChanges}
    >
      {hasUnsavedChanges ? 'Save Changes*' : 'Save Changes'}
    </Button>
  );
};

export default SaveButton;
