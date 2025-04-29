import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface Variable {
  name: string;
  type: string;
  description?: string;
  preview_value?: string;
}

interface VariableFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Variable) => void;
  variable?: Variable | null;
}

const variableTypes = [
  { value: 'text', label: 'Text' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
  { value: 'gender', label: 'Gender' },
];

export default function VariableForm({ open, onClose, onSubmit, variable = null }: VariableFormProps) {
  const { control, handleSubmit, reset } = useForm<Variable>({
    defaultValues: {
      name: '',
      type: 'text',
      description: '',
      preview_value: '',
    },
  });

  useEffect(() => {
    if (variable) {
      reset(variable);
    }
  }, [variable, reset]);

  const handleFormSubmit = (data: Variable) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {variable ? 'Edit Variable' : 'Add New Variable'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Variable Name"
                  error={!!error}
                  helperText={error ? 'This field is required' : ''}
                  fullWidth
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select {...field} label="Type">
                    {variableTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows={2}
                  fullWidth
                />
              )}
            />

            <Controller
              name="preview_value"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Preview Value"
                  fullWidth
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {variable ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
