import React, { useCallback, useState } from "react";
import * as MUI from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Description as FontIcon,
} from "@mui/icons-material";
import { FontForm } from "./components/FontForm";
import { DeleteFontDialog } from "./dialogs/DeleteFontDialog";
import {
  Font,
  FontCreateInput,
  FontUpdateInput,
} from "@/client/graphql/generated/gql/graphql";
import { FontFormData } from "./types";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle create font submission
  const handleCreateSubmit = useCallback(
    async (data: FontFormData) => {
      if (!data.storageFileId) return;
      setIsSaving(true);
      await createFont({
        name: data.name,
        locale: data.locale,
        storageFileId: data.storageFileId,
      });
      setIsSaving(false);
    },
    [createFont]
  );

  // Handle update font submission
  const handleUpdateSubmit = useCallback(
    async (data: FontFormData) => {
      if (!data.storageFileId || !selectedFont?.id) return;
      setIsSaving(true);
      await updateFont({
        id: selectedFont.id,
        name: data.name,
        locale: data.locale,
        storageFileId: data.storageFileId,
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
            Create New Font
          </MUI.Typography>
          <MUI.Card>
            <MUI.CardContent>
              <FontForm
                onSubmit={handleCreateSubmit}
                onCancel={cancelCreating}
                submitLabel="Create Font"
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
            No Font Selected
          </MUI.Typography>
          <MUI.Typography variant="body2" color="text.secondary">
            Select a font from the list to view details
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
            Edit Font
          </MUI.Typography>
          <MUI.Card>
            <MUI.CardContent>
              <FontForm
                initialData={{
                  name: selectedFont.name!,
                  locale: (selectedFont.locale || []) as string[],
                  storageFileId: selectedFont.storageFileId!,
                  fileName: `Font file ${selectedFont.storageFileId}`,
                  fileUrl: "", // Would need storage file query
                }}
                onSubmit={handleUpdateSubmit}
                onCancel={cancelEditing}
                submitLabel="Save Changes"
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
              Font ID: {selectedFont.id!}
            </MUI.Typography>
          </MUI.Box>
          <MUI.Box sx={{ display: "flex", gap: 1 }}>
            <MUI.Button
              variant="outlined"
              size="small"
              onClick={startEditing}
              startIcon={<EditIcon />}
            >
              Edit
            </MUI.Button>
            <MUI.Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
              startIcon={<DeleteIcon />}
            >
              Delete
            </MUI.Button>
          </MUI.Box>
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
                  Font Name
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
                  Supported Locales
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
                  Storage File ID
                </MUI.Typography>
                <MUI.Typography variant="body1" sx={{ mt: 0.5 }}>
                  {selectedFont.storageFileId!}
                </MUI.Typography>
              </MUI.Box>

              <MUI.Box sx={{ display: "flex", gap: 2 }}>
                <MUI.Box sx={{ flex: 1 }}>
                  <MUI.Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="medium"
                  >
                    Created
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
                    Last Updated
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
