"use client";

import React from "react";
import Image from "next/image";
import * as Mui from "@mui/material";
import { useAppTheme } from "@/client/contexts";
import { useQuery } from "@apollo/client/react";
import { useAppTranslation } from "@/client/locale";
import { Delete as DeleteIcon, Image as ImageIcon } from "@mui/icons-material";
// import FilePickerDialog from "@/storage/dialogs/FilePickerDialog";
import {
  FileInfo,
  TemplateUpdateInput,
  Template,
  TemplatesConfigs,
} from "@/client/graphql/generated/gql/graphql";
import {
  useTemplateOperations,
  TemplateDocuments,
} from "../hooks";
import { TemplateUtils } from "../utils";
import { useTemplateUIStore } from "./useTemplateManagementStore";

type FormDataType = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  imagePath?: string | null;
};

const defaultConfig: TemplatesConfigs = {
  configs: [
    { key: "MAX_BACKGROUND_SIZE", value: "5125048" },
    { key: "ALLOWED_FILE_TYPES", value: '["image/jpeg", "image/png"]' },
  ],
};

interface BasicInfoTabProps {
  template: Template;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ template }) => {
  const { theme, isDark } = useAppTheme();
  const strings = useAppTranslation("templateCategoryTranslations");
  const storageStrings = useAppTranslation("storageTranslations");

  const { unsavedChanges, setUnsavedChanges } = useTemplateUIStore();
  const templateOperations = useTemplateOperations();

  // Fetch template config using useQuery with cache-first
  const { data: configData } = useQuery(
    TemplateDocuments.templatesConfigsQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  const config = React.useMemo(() => {
    return configData?.templatesConfigs ?? defaultConfig;
  }, [configData?.templatesConfigs]);

  // Create a ref to store the setUnsavedChanges function to prevent infinite re-renders
  const setUnsavedChangesRef = React.useRef(setUnsavedChanges);

  // Update the ref when the function changes
  React.useEffect(() => {
    setUnsavedChangesRef.current = setUnsavedChanges;
  }, [setUnsavedChanges]);

  const [formData, setFormData] = React.useState<FormDataType>({
    name: "",
    description: "",
  });

  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const [filePickerOpen, setFilePickerOpen] = React.useState(false);

  React.useEffect(() => {
    if (template) {
      setFormData({
        name: template.name ?? "",
        description: template.description ?? "",
        imageUrl: TemplateUtils.getTemplateImageUrl(template, isDark),
      });
    }
  }, [template, isDark]);

  React.useEffect(() => {
    if (!template?.name) {
      setUnsavedChangesRef.current(false);
      return;
    }
    const originalData: FormDataType = {
      name: template.name,
      description: template.description,
      imageUrl: TemplateUtils.getTemplateImageUrl(template, isDark),
    };

    const currentData = formData;

    const hasChanges =
      originalData.name !== currentData.name ||
      originalData.description !== currentData.description ||
      originalData.imageUrl !== currentData.imageUrl;

    setUnsavedChangesRef.current(hasChanges);
  }, [formData, template, isDark]);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  const handleFileSelect = React.useCallback((file: FileInfo) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: file.url,
      imagePath: file.path,
    }));
    setFilePickerOpen(false);
  }, []);

  const handleRemoveImage = React.useCallback((): void => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: undefined,
      imagePath: undefined,
    }));
  }, []);

  const handleSave = React.useCallback(async () => {
    if (!template?.id || !template.category?.id) {
      const msg = "Template data is incomplete for saving.";
      setError(msg);
      return;
    }
    setSaving(true);
    setError(null);

    const input: TemplateUpdateInput = {
      id: template.id,
      name: formData.name,
      description: formData.description,
      categoryId: template.category.id,
      // todo
      // imagePath: formData.imagePath,
    };

    const updatedTemplate = await templateOperations.updateTemplate(input);

    if (updatedTemplate) {
      setError(null);
      setUnsavedChangesRef.current(false);
    }
    setSaving(false);
  }, [
    formData.description,
    // formData.imagePath,
    formData.name,
    template?.category?.id,
    template?.id,
    templateOperations,
  ]);

  const handleCancel = React.useCallback(() => {
    if (template) {
      setFormData({
        name: template.name ?? "",
        description: template.description ?? "",
        imageUrl: TemplateUtils.getTemplateImageUrl(template, isDark),
      });
    }
    setError(null);
  }, [template, isDark]);

  return (
    <Mui.Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "hidden",
      }}
    >
      {/* Action Bar */}
      <Mui.Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 1,
        }}
      >
        <Mui.Typography variant="h6" component="h2">
          {strings.tabBasicInfo}
        </Mui.Typography>

        <Mui.Box
          sx={{
            display: "flex",
            justifyContent: "start",
            gap: 2,
          }}
        >
          <Mui.Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            disabled={saving || !unsavedChanges}
          >
            {strings.cancel}
          </Mui.Button>
          <Mui.Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving || !unsavedChanges}
          >
            {saving ? strings.saving : strings.save}
          </Mui.Button>
        </Mui.Box>
      </Mui.Box>

      {/* form */}
      <Mui.Box
        component="form"
        noValidate
        sx={{
          mt: 1,
          overflowY: "auto",
          maxHeight: `calc(100vh - 230px)`,
          minHeight: `calc(100vh - 230px)`,
          px: 2,
        }}
      >
        {error && (
          <Mui.Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Mui.Alert>
        )}
        <Mui.Grid container spacing={2}>
          <Mui.Grid size={{ xs: 12, md: 12 }}>
            <Mui.TextField
              margin="normal"
              required
              fullWidth
              id="templateName"
              label={strings.name}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              autoFocus
            />

            <Mui.TextField
              margin="normal"
              fullWidth
              multiline
              rows={4}
              id="templateDescription"
              label={strings.description}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Mui.Grid>
          <Mui.Grid size={{ xs: 12, md: 12 }}>
            <Mui.Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Mui.Typography variant="h6">Cover Image</Mui.Typography>
              <Mui.Stack direction="row" spacing={2}>
                <Mui.Button
                  variant="contained"
                  startIcon={<ImageIcon />}
                  onClick={() => setFilePickerOpen(true)}
                  color="primary"
                >
                  {storageStrings.ui.filePickerDialogSelectFile}
                </Mui.Button>
                {formData.imageUrl && (
                  <Mui.Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveImage}
                    color="error"
                  >
                    {strings.delete}
                  </Mui.Button>
                )}
              </Mui.Stack>
            </Mui.Box>
            <Mui.Card
              sx={{
                mt: 1,
                mb: 2,
                maxWidth: "100%",
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px dashed grey",
              }}
            >
              {formData.imageUrl ? (
                <Image
                  src={formData.imageUrl}
                  alt={
                    formData.imageUrl &&
                    formData.imageUrl !==
                      "/templateCover/placeholder_dark.png" &&
                    formData.imageUrl !== "/templateCover/placeholder_light.png"
                      ? formData.imageUrl.split("/").pop() || "Template Image"
                      : "Template Image"
                  }
                  width={300}
                  height={200}
                  style={{
                    maxHeight: "200px",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <ImageIcon
                  sx={{
                    fontSize: "4rem",
                    color: "text.secondary",
                  }}
                />
              )}
            </Mui.Card>
          </Mui.Grid>
        </Mui.Grid>
      </Mui.Box>

      {/* File Picker Dialog */}
      {/* <FilePickerDialog
        open={filePickerOpen}
        onClose={() => setFilePickerOpen(false)}
        onFileSelect={handleFileSelect}
        allowedFileTypes={["image/*"]} // Only allow image files for template covers
        title={storageStrings.ui.filePickerDialogSelectFile}
      /> */}
    </Mui.Box>
  );
};

export default BasicInfoTab;
