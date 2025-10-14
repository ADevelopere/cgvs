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
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { GraduationCap, SquareArrowOutUpRight, EditIcon } from "lucide-react";
import { useQuery } from "@apollo/client/react";

import EmptyStateIllustration from "@/client/components/common/EmptyStateIllustration";
import EditableTypography from "@/client/components/input/EditableTypography";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import { useAppTranslation } from "@/client/locale";
import { mapTemplateToUpdateInput } from "@/client/utils/template/template-mappers";
import { useTemplateCategoryManagement } from "./4-categories.context";
import TemplateEditDialog from "./TemplateEditDialog";
import { useTemplateCategoryUIStore } from "./3-categories.store";

import {
  Template,
  TemplateUpdateInput,
} from "@/client/graphql/generated/gql/graphql";
import * as Document from "@/client/graphql/documents";

const TemplateCategoryManagementTemplatePane: React.FC = () => {
  const {
    createTemplate: addTemplate,
    updateTemplate,
    suspendTemplate,
    // trySelectCategory,
    setIsAddingTemplate,
    setOnNewTemplateCancel,
    manageTemplate,
    currentCategoryId,
  } = useTemplateCategoryManagement();

  const store = useTemplateCategoryUIStore();

  // Get query variables from store for the current category
  const queryVariables = React.useMemo(
    () => (currentCategoryId ? store.getTemplateQueryVariables(currentCategoryId) : undefined),
    [currentCategoryId, store]
  );

  // Fetch templates for current category
  const { data: templatesByCategoryIdQuery, loading: regularTemplatesLoading } =
    useQuery(Document.templatesByCategoryIdQueryDocument, {
      variables: {
        categoryId: currentCategoryId,
        ...queryVariables,
      },
      skip: !currentCategoryId,
      fetchPolicy: "cache-first",
    });

  const templates = React.useMemo(
    () => templatesByCategoryIdQuery?.templatesByCategoryId?.data ?? [],
    [templatesByCategoryIdQuery?.templatesByCategoryId?.data],
  );

  const pageInfo = React.useMemo(
    () => templatesByCategoryIdQuery?.templatesByCategoryId?.pageInfo,
    [templatesByCategoryIdQuery?.templatesByCategoryId?.pageInfo],
  );

  // todo: use server side query, or read from apollo cache only
  // Fetch all categories for the autocomplete
  // const { data: categoriesData } = useQuery(
  //     Document.templateCategoriesQueryDocument,
  //     {
  //         fetchPolicy: "cache-first",
  //     },
  // );

  // const regularCategories: TemplateCategory[] = [];
  // categoriesData?.templateCategories?.filter(
  //     (cat) => cat.specialType !== "Suspension",
  // ) ?? [];

  const { theme } = useAppTheme();
  const [tempTemplate, setTempTemplate] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const newTemplateRef = React.useRef<HTMLLIElement>(null);
  const strings = useAppTranslation("templateCategoryTranslations");

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [templateToEdit, setTemplateToEdit] = React.useState<Template | null>(
    null,
  );

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
    if (!currentCategoryId) return;
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
    if (!currentCategoryId) return strings.selectCategoryFirst;

    const error = validateTemplateName(name);
    if (error) {
      return error;
    }

    try {
      addTemplate(name, currentCategoryId);
      setTempTemplate(null);
      setIsAddingTemplate(false);
      return "";
    } catch (error: unknown) {
      return (error as Error).message || strings.templateAddFailed;
    }
  };

  const handleTemplateNameEdit = async (
    template: Template,
    newName: string,
  ) => {
    const error = validateTemplateName(newName);
    if (error) {
      return error;
    }

    try {
      updateTemplate({
        input: mapTemplateToUpdateInput({ ...template, name: newName }),
      });
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
    await updateTemplate({
      input,
    });
    setIsEditDialogOpen(false);
    setTemplateToEdit(null);
  };

  const getEmptyMessage = () => {
    if (!currentCategoryId) {
      return strings.selectCategoryFirst;
    }
    return strings.noTemplates;
  };

  // Pagination handlers
  const handlePageChange = React.useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      if (!currentCategoryId) return;
      const currentVars = queryVariables || {};
      store.setTemplateQueryVariables(currentCategoryId, {
        ...currentVars,
        paginationArgs: {
          ...currentVars.paginationArgs,
          page,
        },
      });
    },
    [currentCategoryId, queryVariables, store]
  );

  const handlePageSizeChange = React.useCallback(
    (event: SelectChangeEvent<number>) => {
      if (!currentCategoryId) return;
      const pageSize = event.target.value as number;
      const currentVars = queryVariables || {};
      store.setTemplateQueryVariables(currentCategoryId, {
        ...currentVars,
        paginationArgs: {
          first: pageSize,
          page: 1, // Reset to page 1 on page size change
        },
      });
    },
    [currentCategoryId, queryVariables, store]
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
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            // flexGrow: 1,
          }}
        >
          <Autocomplete
            value={currentCategory}
            onChange={(_, newValue) => {
              trySelectCategory(newValue?.id ?? null);
            }}
            options={Array.isArray(regularCategories) ? regularCategories : []}
            getOptionLabel={(option) => {
              if (!option.name) {
                throw new Error("Category name is required");
              }
              return option.name;
            }}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={strings.selectCategory}
                variant="outlined"
                size="small"
                disabled={
                  !Array.isArray(regularCategories) ||
                  regularCategories.length === 0
                }
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
          />
        </Box> */}
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
          templates.map((template) => (
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
                <GraduationCap style={{ marginRight: 2 }} />
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
                  onSave={(newValue) =>
                    handleTemplateNameEdit(template, newValue)
                  }
                  isValid={validateTemplateName}
                />
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Tooltip title={strings.delete}>
                <IconButton
                  onClick={() => suspendTemplate(template.id)}
                  color="error"
                  disabled={false}
                >
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
                <IconButton
                  onClick={() => manageTemplate(template.id)}
                  color="info"
                  disabled={false}
                >
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
              <GraduationCap style={{ marginRight: 2 }} />
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
                onSave={handleNewTemplateSave}
                onCancel={handleNewTemplateCancel}
                isValid={validateTemplateName}
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
          disabled={!currentCategoryId || !!tempTemplate}
        >
          {strings.addTemplate}
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {/* Pagination info */}
        {pageInfo && pageInfo.total > 0 && (
          <Typography variant="body2" color="text.secondary">
            {strings.showing} {pageInfo.firstItem ?? 0}-{pageInfo.lastItem ?? 0} {strings.of}{" "}
            {pageInfo.total}
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

      {templateToEdit && currentCategoryId && (
        <TemplateEditDialog
          open={isEditDialogOpen}
          template={templateToEdit}
          onClose={handleCloseEditDialog}
          onSave={handleUpdateTemplate}
          parentCategoryId={currentCategoryId}
        />
      )}
    </Box>
  );
};

export default TemplateCategoryManagementTemplatePane;
