"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import {
  Template,
  TemplateUpdateInput,
} from "@/client/graphql/generated/gql/graphql";

interface Props {
  open: boolean;
  template: Template;
  onClose: () => void;
  onSave: (input: TemplateUpdateInput) => Promise<void>;
  parentCategoryId: number;
}

const TemplateEditDialog: React.FC<Props> = ({
  open,
  template,
  onClose,
  onSave,
  parentCategoryId,
}) => {
  const strings = useAppTranslation("templateCategoryTranslations");
  const [name, setName] = React.useState(template?.name ?? "");
  const [description, setDescription] = React.useState<
    string | undefined | null
  >(template?.description);
  const [categoryId, setCategoryId] = React.useState<number>(parentCategoryId);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (template) {
      if (!template.name) {
        throw new Error("Template name is required");
      }
      setName(template.name);
      setDescription(template.description ?? "");
      setCategoryId(parentCategoryId);
    }
  }, [template, parentCategoryId]);

  const handleSave = () => {
    if (name.length < 3) {
      setError(strings.nameTooShort);
      return;
    }
    if (name.length > 255) {
      setError(strings.nameTooLong);
      return;
    }

    if (!template) return;

    onSave({
      ...template,
      name,
      description: description ?? undefined,
      categoryId: categoryId,
    });
    handleClose();
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{strings.edit}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 1,
          }}
        >
          <TextField
            autoFocus
            label={strings.name}
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error}
            required
          />
          <TextField
            label={strings.description ?? ""}
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* todo: add category autocomplete */}
          {/* <Autocomplete
            value={categories.find((c) => c.id === categoryId) || null}
            onChange={(_, newValue) => setCategoryId(newValue?.id ?? null)}
            options={categories}
            getOptionLabel={(option) => {
              if (!option.name) {
                throw new Error("Category name is required");
              }
              return option.name;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={strings.parentCategory}
                placeholder={strings.selectCategory}
              />
            )}
          /> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{strings.cancel}</Button>
        <Button onClick={handleSave} variant="contained">
          {strings.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateEditDialog;
