import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useSelector } from 'react-redux';
import { selectUnsavedChanges } from '../../../../store/templateManagementSlice';

const SaveButton = ({ onSave, disabled }) => {
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

SaveButton.propTypes = {
  onSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SaveButton;
