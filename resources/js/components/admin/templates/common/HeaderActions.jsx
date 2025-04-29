import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Button } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveButton from './SaveButton';

const HeaderActions = ({ onPreview, onSave, disabled }) => {
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

HeaderActions.propTypes = {
  onPreview: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default HeaderActions;
