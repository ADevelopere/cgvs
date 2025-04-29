import React from 'react';
import { Stack, Button } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveButton from './SaveButton';

interface HeaderActionsProps {
  onPreview: () => void;
  onSave: () => void;
  disabled?: boolean;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onPreview, onSave, disabled }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="outlined"
        startIcon={<PreviewIcon />}
        onClick={onPreview}
        disabled={disabled}
      >
        Preview
      </Button>
      <SaveButton onSave={onSave} disabled={disabled} />
    </Stack>
  );
};

export default HeaderActions;
