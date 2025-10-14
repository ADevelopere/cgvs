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
  Autocomplete,
} from "@mui/material";
import { useLazyQuery } from "@apollo/client/react";
import { useAppTranslation } from "@/client/locale";
import {
  Template,
  TemplateUpdateInput,
  TemplateCategoryWithParentTree,
} from "@/client/graphql/generated/gql/graphql";
import { searchTemplateCategoriesQueryDocument } from "@/client/graphql/sharedDocuments";

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

  // Category search for autocomplete
  const [
    searchCategories,
    { data: searchCategoriesData, loading: searchLoading },
  ] = useLazyQuery(searchTemplateCategoriesQueryDocument);
  const [categorySearchTerm, setCategorySearchTerm] = React.useState("");
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const categoryOptions = React.useMemo(
    () => searchCategoriesData?.searchTemplateCategories ?? [],
    [searchCategoriesData?.searchTemplateCategories],
  );

  const selectedCategory = React.useMemo(
    () => categoryOptions.find((c) => c.id === categoryId) ?? null,
    [categoryOptions, categoryId],
  );

  // Debounced search handler
  const handleCategorySearch = React.useCallback(
    (searchTerm: string) => {
      setCategorySearchTerm(searchTerm);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (searchTerm.trim().length > 0) {
        searchTimeoutRef.current = setTimeout(() => {
          searchCategories({
            variables: {
              searchTerm,
              limit: 10,
              includeParentTree: false,
            },
          });
        }, 300);
      }
    },
    [searchCategories],
  );

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
          <Autocomplete
            value={selectedCategory}
            onChange={(_, newValue: TemplateCategoryWithParentTree | null) => {
              setCategoryId(newValue?.id ?? parentCategoryId);
            }}
            inputValue={categorySearchTerm}
            onInputChange={(_, newInputValue) => {
              handleCategorySearch(newInputValue);
            }}
            options={categoryOptions}
            getOptionLabel={(option) => option.name ?? strings.unnamed}
            loading={searchLoading}
            loadingText={strings.loading}
            noOptionsText={strings.noCategories}
            renderInput={(params) => (
              <TextField
                {...params}
                label={strings.parentCategory}
                placeholder={strings.selectCategory}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
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
