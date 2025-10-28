import React, { useCallback, useState } from "react";
import * as MUI from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Description as FontIcon,
} from "@mui/icons-material";
import { FontForm } from "./components/FontForm";
import { FontPreview } from "./components/FontPreview";
import { DeleteFontDialog } from "./dialogs/DeleteFontDialog";
import {
  Font,
  FontCreateInput,
  FontUpdateInput,
} from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";
import logger from "@/client/lib/logger";

type FontDetailProps = {
  selectedFont: Font | null;
  isCreating: boolean;
  isEditing: boolean;

  cancelCreating: () => void;
  startEditing: () => void;
  cancelEditing: () => void;
  createFont: (input: FontCreateInput) => Promise<boolean>;
  updateFont: (input: FontUpdateInput) => Promise<boolean>;
};

export const FontDetail: React.FC<FontDetailProps> = ({
  selectedFont,
  isCreating,
  isEditing,
  cancelCreating,
  startEditing,
  cancelEditing,
  createFont,
  updateFont,
}) => {
  const strings = useAppTranslation("fontManagementTranslations");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle create font submission
  const handleCreateSubmit = useCallback(
    async (input: FontCreateInput) => {
      logger.debug("[FontDetail] handleCreateSubmit", input);
      setIsSaving(true);
      await createFont(input);
      setIsSaving(false);
    },
    [createFont]
  );

  // Handle update font submission
  const handleUpdateSubmit = useCallback(
    async (input: FontCreateInput) => {
      if (!selectedFont?.id) return;
      setIsSaving(true);
      await updateFont({
        id: selectedFont.id,
        ...input,
      });
      setIsSaving(false);
    },
    [updateFont, selectedFont?.id]
  );

  // Creating new font
  if (isCreating) {
    return (
      <MUI.Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <MUI.Box sx={{ maxWidth: 900, mx: "auto" }}>
          <MUI.Typography variant="h4" gutterBottom>
            {strings.createNewFont}
          </MUI.Typography>
          <MUI.Card>
            <MUI.CardContent>
              <FontForm
                onSubmit={handleCreateSubmit}
                onCancel={cancelCreating}
                submitLabel={strings.createFont}
                disabled={isSaving}
              />
            </MUI.CardContent>
          </MUI.Card>
        </MUI.Box>
      </MUI.Box>
    );
  }

  // No font selected
  if (!selectedFont) {
    return (
      <MUI.Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <MUI.Box sx={{ textAlign: "center" }}>
          <FontIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <MUI.Typography variant="h6" gutterBottom>
            {strings.noFontSelected}
          </MUI.Typography>
          <MUI.Typography variant="body2" color="text.secondary">
            {strings.selectFontFromList}
          </MUI.Typography>
        </MUI.Box>
      </MUI.Box>
    );
  }

  // Loading font details (when not in cache yet)
  if (!selectedFont) {
    return (
      <MUI.Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <MUI.Box sx={{ maxWidth: 900, mx: "auto" }}>
          <MUI.Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
          <MUI.Card>
            <MUI.CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <MUI.Skeleton variant="rectangular" height={60} />
              <MUI.Skeleton variant="rectangular" height={60} />
              <MUI.Skeleton variant="rectangular" height={150} />
            </MUI.CardContent>
          </MUI.Card>
        </MUI.Box>
      </MUI.Box>
    );
  }

  // Editing mode
  if (isEditing) {
    return (
      <MUI.Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <MUI.Box sx={{ maxWidth: 900, mx: "auto" }}>
          <MUI.Typography variant="h4" gutterBottom>
            {strings.editFont}
          </MUI.Typography>
          <MUI.Card>
            <MUI.CardContent>
              <FontForm
                initialData={{
                  name: selectedFont.name!,
                  locale: (selectedFont.locale || []) as string[],
                  filePath: selectedFont.file?.path,
                  fileName: selectedFont.file?.name,
                  fileUrl: selectedFont.url!,
                }}
                onSubmit={handleUpdateSubmit}
                onCancel={cancelEditing}
                submitLabel={strings.saveChanges}
                disabled={isSaving}
              />
            </MUI.CardContent>
          </MUI.Card>
        </MUI.Box>
      </MUI.Box>
    );
  }

  // View mode
  return (
    <MUI.Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
      <MUI.Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Header */}
        <MUI.Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <MUI.Box>
            <MUI.Typography variant="h4">{selectedFont.name!}</MUI.Typography>
            <MUI.Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {strings.fontId.replace("%{id}", selectedFont.id!.toString())}
            </MUI.Typography>
          </MUI.Box>
          <MUI.Box sx={{ display: "flex", gap: 1 }}>
            <MUI.Button
              variant="outlined"
              size="small"
              onClick={startEditing}
              startIcon={<EditIcon />}
            >
              {strings.edit}
            </MUI.Button>
            <MUI.Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
              startIcon={<DeleteIcon />}
            >
              {strings.delete}
            </MUI.Button>
          </MUI.Box>
        </MUI.Box>

        {/* Font Preview */}
        <MUI.Box sx={{ mt: 3 }}>
          <MUI.Typography variant="h6" gutterBottom>
            {strings.preview}
          </MUI.Typography>
          <FontPreview
            fontName={selectedFont.name!}
            fontUrl={selectedFont.url!}
          />
        </MUI.Box>

        {/* Details Card */}
        <MUI.Card>
          <MUI.CardContent>
            <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Basic Info */}
              <MUI.Box>
                <MUI.Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  {strings.fontName}
                </MUI.Typography>
                <MUI.Typography variant="body1" sx={{ mt: 0.5 }}>
                  {selectedFont.name!}
                </MUI.Typography>
              </MUI.Box>

              <MUI.Box>
                <MUI.Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  {strings.supportedLocales}
                </MUI.Typography>
                <MUI.Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                >
                  {selectedFont.locale!.map(locale => (
                    <MUI.Chip key={locale} label={locale} size="small" />
                  ))}
                </MUI.Box>
              </MUI.Box>

              <MUI.Box>
                <MUI.Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  {strings.storageFilePath}
                </MUI.Typography>
                <MUI.Typography variant="body1" sx={{ mt: 0.5 }}>
                  {selectedFont.file?.path ?? ""}
                </MUI.Typography>
              </MUI.Box>

              <MUI.Box sx={{ display: "flex", gap: 2 }}>
                <MUI.Box sx={{ flex: 1 }}>
                  <MUI.Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="medium"
                  >
                    {strings.created}
                  </MUI.Typography>
                  <MUI.Typography variant="body2" sx={{ mt: 0.5 }}>
                    {new Date(selectedFont.createdAt!).toLocaleString()}
                  </MUI.Typography>
                </MUI.Box>
                <MUI.Box sx={{ flex: 1 }}>
                  <MUI.Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="medium"
                  >
                    {strings.lastUpdated}
                  </MUI.Typography>
                  <MUI.Typography variant="body2" sx={{ mt: 0.5 }}>
                    {new Date(selectedFont.updatedAt!).toLocaleString()}
                  </MUI.Typography>
                </MUI.Box>
              </MUI.Box>
            </MUI.Box>
          </MUI.CardContent>
        </MUI.Card>
      </MUI.Box>

      {/* Delete Dialog */}
      <DeleteFontDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        fontId={selectedFont.id!}
        fontName={selectedFont.name!}
      />
    </MUI.Box>
  );
};
