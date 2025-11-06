"use client";

import React from "react";
import {
  Box,
  List,
  ListItem,
  IconButton,
  Tooltip,
  Button,
  Typography,
  LinearProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { GraduationCap, SquareArrowOutUpRight, EditIcon } from "lucide-react";
import { useQuery, useLazyQuery } from "@apollo/client/react";

import { useAppTheme } from "@/client/contexts";
import { useAppTranslation } from "@/client/locale";
import { EmptyStateIllustration, EditableTypography } from "@/client/components";
import { Template, TemplateUpdateInput, TemplateCategoryWithParentTree } from "@/client/graphql/generated/gql/graphql";
import { TemplateDocuments, CategoryDocuments } from "../hooks";
import { TemplateUtils } from "../utils";
import TemplateEditDialog from "./TemplateEditDialog";
import { useTemplateCategoryOperations } from "./hooks/useTemplateCategoryOperations";
import { useTemplateCategoryStore } from "./hooks/useTemplateCategoryStore";

const TemplateCategoryManagementTemplatePane: React.FC = () => {
  const {
    createTemplate: addTemplate,
    updateTemplate,
    suspendTemplate,
    manageTemplate,
  } = useTemplateCategoryOperations();

  const {
    currentCategory,
    setIsAddingTemplate,
    setOnNewTemplateCancel,
    getTemplateQueryVariables,
    setTemplateQueryVariables,
    selectCategory,
  } = useTemplateCategoryStore();

  // Get query variables from store for the current category
  const queryVariables = React.useMemo(
    () => (currentCategory ? getTemplateQueryVariables(currentCategory.id) : undefined),
    [currentCategory, getTemplateQueryVariables]
  );

  // Fetch templates for current category
  const { data: templatesByCategoryIdQuery, loading: regularTemplatesLoading } = useQuery(
    TemplateDocuments.templatesByCategoryIdQueryDocument,
    {
      variables: {
        categoryId: currentCategory?.id,
        ...queryVariables,
      },
      skip: !currentCategory?.id,
      fetchPolicy: "cache-first",
    }
  );

  const templates = React.useMemo(
    () => templatesByCategoryIdQuery?.templatesByCategoryId?.data ?? [],
    [templatesByCategoryIdQuery?.templatesByCategoryId?.data]
  );

  const pageInfo = React.useMemo(
    () => templatesByCategoryIdQuery?.templatesByCategoryId?.pageInfo,
    [templatesByCategoryIdQuery?.templatesByCategoryId?.pageInfo]
  );

  const { theme } = useAppTheme();
  const [tempTemplate, setTempTemplate] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const newTemplateRef = React.useRef<HTMLLIElement>(null);
  const { templateCategoryTranslations: strings } = useAppTranslation();

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [templateToEdit, setTemplateToEdit] = React.useState<Template | null>(null);

  // Category search for autocomplete
  const [searchCategories, { data: searchCategoriesData, loading: searchLoading }] = useLazyQuery(
    CategoryDocuments.searchTemplateCategoriesQueryDocument
  );
  const [categorySearchTerm, setCategorySearchTerm] = React.useState("");
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const categoryOptions = React.useMemo(
    () => searchCategoriesData?.searchTemplateCategories ?? [],
    [searchCategoriesData?.searchTemplateCategories]
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
              includeParentTree: true,
            },
          });
        }, 300);
      }
    },
    [searchCategories]
  );

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const validateTemplateName = (name: string) => {
    if (name.length < 3) return strings.nameTooShort;
    if (name.length > 255) return strings.nameTooLong;
    return "";
  };

  const handleNewTemplateCancel = React.useCallback(() => {
    setTempTemplate(null);
    setIsAddingTemplate(false);
    setOnNewTemplateCancel(undefined);
  }, [setOnNewTemplateCancel, setIsAddingTemplate]);

  const handleAddNewTemplate = () => {
    if (!currentCategory) return;
    setTempTemplate({ id: "temp-" + Date.now(), name: "" });
    setIsAddingTemplate(true);
    setOnNewTemplateCancel(() => handleNewTemplateCancel);
    // Schedule scroll after render
    setTimeout(() => {
      newTemplateRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  const handleNewTemplateSave = async (name: string) => {
    if (!currentCategory) return strings.selectCategoryFirst;

    const error = validateTemplateName(name);
    if (error) {
      return error;
    }

    try {
      addTemplate({
        name,
        categoryId: currentCategory.id,
      });
      setTempTemplate(null);
      setIsAddingTemplate(false);
      return "";
    } catch (error: unknown) {
      return (error as Error).message || strings.templateAddFailed;
    }
  };

  const handleTemplateNameEdit = async (template: Template, newName: string) => {
    const error = validateTemplateName(newName);
    if (error) {
      return error;
    }

    try {
      updateTemplate(TemplateUtils.mapTemplateToUpdateInput({ ...template, name: newName }));
      return ""; // success
    } catch (error: unknown) {
      return (error as Error).message || strings.templateUpdateFailed;
    }
  };

  const handleOpenEditDialog = (template: Template) => {
    setTemplateToEdit(template);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setTemplateToEdit(null);
  };

  const handleUpdateTemplate = async (input: TemplateUpdateInput) => {
    await updateTemplate(input);
    setIsEditDialogOpen(false);
    setTemplateToEdit(null);
  };

  const getEmptyMessage = () => {
    if (!currentCategory) {
      return strings.selectCategoryFirst;
    }
    return strings.noTemplates;
  };

  // Pagination handlers
  const handlePageChange = React.useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      if (!currentCategory) return;
      const currentVars = queryVariables || {};
      setTemplateQueryVariables(currentCategory.id, {
        ...currentVars,
        paginationArgs: {
          ...currentVars.paginationArgs,
          page,
        },
      });
    },
    [currentCategory, queryVariables, setTemplateQueryVariables]
  );

  const handlePageSizeChange = React.useCallback(
    (event: SelectChangeEvent<number>) => {
      if (!currentCategory) return;
      const pageSize = event.target.value as number;
      const currentVars = queryVariables || {};
      setTemplateQueryVariables(currentCategory.id, {
        ...currentVars,
        paginationArgs: {
          first: pageSize,
          page: 1, // Reset to page 1 on page size change
        },
      });
    },
    [currentCategory, queryVariables, setTemplateQueryVariables]
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        px: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            p: 2,
          }}
        >
          {strings.templates}
        </Typography>

        {/* category selector */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            flexGrow: 1,
          }}
        >
          <Autocomplete
            options={categoryOptions}
            value={
              currentCategory
                ? {
                    ...currentCategory,
                    __typename: undefined,
                    parentTree: [],
                  }
                : null
            }
            onChange={(_, newValue: TemplateCategoryWithParentTree | null) => {
              if (newValue) {
                selectCategory(newValue);
              }
            }}
            inputValue={categorySearchTerm}
            onInputChange={(_, newInputValue) => {
              handleCategorySearch(newInputValue);
            }}
            getOptionLabel={option => option.name ?? strings.unnamed}
            loading={searchLoading}
            loadingText={strings.loading}
            noOptionsText={strings.noCategories}
            sx={{ width: "100%" }}
            renderInput={params => (
              <TextField
                {...params}
                label={strings.selectCategory}
                variant="outlined"
                size="small"
                placeholder={strings.selectCategory}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name ?? strings.unnamed}
              </li>
            )}
          />
        </Box>
      </Box>

      {/* Horizontal loading progress bar */}
      <Box
        sx={{
          width: "100%",
          height: 4,
          visibility: regularTemplatesLoading ? "visible" : "hidden",
        }}
      >
        <LinearProgress />
      </Box>

      <List
        ref={listRef}
        sx={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        {templates &&
          templates.map(template => (
            <ListItem
              key={template?.id}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <GraduationCap style={{ marginInlineEnd: 2 }} />
                <EditableTypography
                  typography={{
                    variant: "body1",
                  }}
                  textField={{
                    size: "small",
                    variant: "standard",
                    sx: { minWidth: 150 },
                  }}
                  value={template?.name ?? ""}
                  onSaveAction={newValue => handleTemplateNameEdit(template, newValue)}
                  isValidAction={validateTemplateName}
                />
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Tooltip title={strings.delete}>
                <IconButton onClick={() => suspendTemplate(template.id)} color="error" disabled={false}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={strings.edit}>
                <IconButton
                  onClick={() => {
                    handleOpenEditDialog(template);
                  }}
                  color="primary"
                  disabled={false}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={strings.manage}>
                <IconButton onClick={() => manageTemplate(template.id)} color="info" disabled={false}>
                  <SquareArrowOutUpRight />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}

        {tempTemplate && (
          <ListItem
            ref={newTemplateRef}
            key={tempTemplate.id}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
              }}
            >
              <GraduationCap style={{ marginInlineEnd: 2 }} />
              <EditableTypography
                typography={{
                  variant: "body1",
                }}
                textField={{
                  size: "small",
                  variant: "standard",
                  sx: { minWidth: 150 },
                }}
                value=""
                onSaveAction={handleNewTemplateSave}
                onCancelAction={handleNewTemplateCancel}
                isValidAction={validateTemplateName}
                startEditing={true}
              />
            </Box>
          </ListItem>
        )}
      </List>

      {/* Show empty state only when no templates and no temp template */}
      {templates.length === 0 && !tempTemplate && !regularTemplatesLoading && (
        <EmptyStateIllustration message={getEmptyMessage()} />
      )}

      {/* Bottom action bar */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: theme.palette.divider,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* add template button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewTemplate}
          disabled={!currentCategory || !!tempTemplate}
        >
          {strings.addTemplate}
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {/* Pagination info */}
        {pageInfo && pageInfo.total > 0 && (
          <Typography variant="body2" color="text.secondary">
            {strings.showing} {pageInfo.firstItem ?? 0}-{pageInfo.lastItem ?? 0} {strings.of} {pageInfo.total}
          </Typography>
        )}

        {/* Page size selector */}
        {pageInfo && pageInfo.total > 0 && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="page-size-label">{strings.perPage}</InputLabel>
            <Select
              labelId="page-size-label"
              value={queryVariables?.paginationArgs?.first ?? pageInfo.perPage}
              label={strings.perPage}
              onChange={handlePageSizeChange}
              disabled={regularTemplatesLoading}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Pagination component */}
        {pageInfo && pageInfo.lastPage > 1 && (
          <Pagination
            count={pageInfo.lastPage}
            page={pageInfo.currentPage}
            onChange={handlePageChange}
            color="primary"
            disabled={regularTemplatesLoading}
            showFirstButton
            showLastButton
          />
        )}
      </Box>

      {/* end of 2 */}

      {templateToEdit && currentCategory && (
        <TemplateEditDialog
          open={isEditDialogOpen}
          template={templateToEdit}
          onClose={handleCloseEditDialog}
          onSave={handleUpdateTemplate}
          parentCategoryId={currentCategory.id}
        />
      )}
    </Box>
  );
};

export default TemplateCategoryManagementTemplatePane;
