import React, { useState } from "react";
import * as MUI from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Description as FontIcon, Add as AddIcon } from "@mui/icons-material";
import { useQuery } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { FontPreview } from "./components/FontPreview";
import { fontFamilyQueryDocument, fontVariantsByFamilyQueryDocument } from "./hooks/font.documents";
import { FontFamilyDialog } from "./dialogs/FontFamilyDialog";
import { FontVariantDialog } from "./dialogs/FontVariantDialog";
import { DeleteVariantDialog } from "./dialogs/DeleteVariantDialog";
import { useFontApolloMutations } from "./hooks/useFontApolloMutations";
import { LOCALE_OPTIONS } from "./types";
import { useAppTranslation } from "@/client/locale";

type FontDetailProps = {
  selectedFamilyId: number | null;
};

export const FontDetail: React.FC<FontDetailProps> = ({ selectedFamilyId }) => {
  const { fontManagementTranslations: strings } = useAppTranslation();
  const notifications = useNotifications();
  const { updateFontFamilyMutation, createFontVariantMutation, updateFontVariantMutation, deleteFontVariantMutation } =
    useFontApolloMutations();

  const [editFamilyOpen, setEditFamilyOpen] = useState(false);
  const [addVariantOpen, setAddVariantOpen] = useState(false);
  const [editVariantOpen, setEditVariantOpen] = useState(false);
  const [deleteVariantOpen, setDeleteVariantOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  const { data: familyData, loading: familyLoading } = useQuery(fontFamilyQueryDocument, {
    variables: { id: selectedFamilyId! },
    skip: !selectedFamilyId,
  });

  const { data: variantsData, loading: variantsLoading } = useQuery(fontVariantsByFamilyQueryDocument, {
    variables: { filterArgs: { familyId: selectedFamilyId } },
    skip: !selectedFamilyId,
  });

  const family = familyData?.fontFamily;
  const variants = variantsData?.fontVariants?.data || [];

  const getLocaleLabel = (localeCode: string) => {
    const option = LOCALE_OPTIONS.find(opt => opt.value === localeCode);
    return option?.flag || localeCode;
  };

  if (!selectedFamilyId) {
    return (
      <MUI.Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
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

  if (familyLoading || !family) {
    return (
      <MUI.Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <MUI.Box sx={{ maxWidth: 900, mx: "auto" }}>
          <MUI.Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
          <MUI.Card>
            <MUI.CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <MUI.Skeleton variant="rectangular" height={60} />
              <MUI.Skeleton variant="rectangular" height={60} />
              <MUI.Skeleton variant="rectangular" height={150} />
            </MUI.CardContent>
          </MUI.Card>
        </MUI.Box>
      </MUI.Box>
    );
  }

  return (
    <MUI.Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
      <MUI.Box sx={{ maxWidth: 900, mx: "auto" }}>
        <MUI.Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
          <MUI.Box>
            <MUI.Typography variant="h4">{family.name}</MUI.Typography>
            {family.category && (
              <MUI.Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {family.category}
              </MUI.Typography>
            )}
          </MUI.Box>
          <MUI.Box sx={{ display: "flex", gap: 1 }}>
            <MUI.Button
              variant="outlined"
              size="small"
              onClick={() => setEditFamilyOpen(true)}
              startIcon={<EditIcon />}
            >
              {strings.edit}
            </MUI.Button>
          </MUI.Box>
        </MUI.Box>

        <MUI.Card sx={{ mb: 3 }}>
          <MUI.CardContent>
            <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <MUI.Box>
                <MUI.Typography variant="caption" color="text.secondary" fontWeight="medium">
                  {strings.supportedLocales}
                </MUI.Typography>
                <MUI.Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {family.locale.map(locale => (
                    <MUI.Chip key={locale} label={getLocaleLabel(locale)} size="small" />
                  ))}
                </MUI.Box>
              </MUI.Box>

              <MUI.Box sx={{ display: "flex", gap: 2 }}>
                <MUI.Box sx={{ flex: 1 }}>
                  <MUI.Typography variant="caption" color="text.secondary" fontWeight="medium">
                    {strings.created}
                  </MUI.Typography>
                  <MUI.Typography variant="body2" sx={{ mt: 0.5 }}>
                    {new Date(family.createdAt).toLocaleString()}
                  </MUI.Typography>
                </MUI.Box>
                <MUI.Box sx={{ flex: 1 }}>
                  <MUI.Typography variant="caption" color="text.secondary" fontWeight="medium">
                    {strings.lastUpdated}
                  </MUI.Typography>
                  <MUI.Typography variant="body2" sx={{ mt: 0.5 }}>
                    {new Date(family.updatedAt).toLocaleString()}
                  </MUI.Typography>
                </MUI.Box>
              </MUI.Box>
            </MUI.Box>
          </MUI.CardContent>
        </MUI.Card>

        <MUI.Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <MUI.Typography variant="h6">{strings.fontVariants}</MUI.Typography>
          <MUI.Button variant="contained" size="small" onClick={() => setAddVariantOpen(true)} startIcon={<AddIcon />}>
            {strings.addVariant}
          </MUI.Button>
        </MUI.Box>

        {variantsLoading ? (
          <MUI.Card>
            <MUI.CardContent>
              <MUI.Skeleton variant="rectangular" height={100} />
            </MUI.CardContent>
          </MUI.Card>
        ) : variants.length === 0 ? (
          <MUI.Card>
            <MUI.CardContent>
              <MUI.Box sx={{ textAlign: "center", py: 3 }}>
                <MUI.Typography variant="body2" color="text.secondary">
                  {strings.noVariantsYet}
                </MUI.Typography>
              </MUI.Box>
            </MUI.CardContent>
          </MUI.Card>
        ) : (
          variants.map(variant => (
            <MUI.Card key={variant.id} sx={{ mb: 2 }}>
              <MUI.CardContent>
                <MUI.Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <MUI.Typography variant="h6">{variant.variant}</MUI.Typography>
                  <MUI.Box sx={{ display: "flex", gap: 1 }}>
                    <MUI.IconButton
                      size="small"
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setEditVariantOpen(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </MUI.IconButton>
                    <MUI.IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setDeleteVariantOpen(true);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </MUI.IconButton>
                  </MUI.Box>
                </MUI.Box>

                <FontPreview fontName={family.name} fontUrl={variant.url!} variant={variant.variant} />

                <MUI.Box sx={{ mt: 2 }}>
                  <MUI.Typography variant="caption" color="text.secondary" fontWeight="medium">
                    {strings.filePath}
                  </MUI.Typography>
                  <MUI.Typography variant="body2" sx={{ mt: 0.5 }}>
                    {variant.file?.path}
                  </MUI.Typography>
                </MUI.Box>
              </MUI.CardContent>
            </MUI.Card>
          ))
        )}

        <FontFamilyDialog
          open={editFamilyOpen}
          onClose={() => setEditFamilyOpen(false)}
          title={strings.editFontFamily}
          initialData={{ name: family.name, category: family.category || undefined, locale: family.locale }}
          onSubmit={async data => {
            await updateFontFamilyMutation({ variables: { input: { id: family.id, ...data } } });
            notifications.show(strings.familyUpdatedSuccess, { severity: "success" });
          }}
        />

        <FontVariantDialog
          open={addVariantOpen}
          onClose={() => setAddVariantOpen(false)}
          title={strings.addVariant}
          familyName={family.name}
          onSubmit={async data => {
            await createFontVariantMutation({ variables: { input: { familyId: family.id, ...data } } });
            notifications.show(strings.variantAddedSuccess, { severity: "success" });
          }}
        />

        {selectedVariantId && (
          <>
            <FontVariantDialog
              open={editVariantOpen}
              onClose={() => {
                setEditVariantOpen(false);
                setSelectedVariantId(null);
              }}
              title={strings.editVariant}
              familyName={family.name}
              onSubmit={async data => {
                await updateFontVariantMutation({ variables: { input: { id: selectedVariantId, ...data } } });
                notifications.show(strings.variantUpdatedSuccess, { severity: "success" });
              }}
            />

            <DeleteVariantDialog
              open={deleteVariantOpen}
              onClose={() => {
                setDeleteVariantOpen(false);
                setSelectedVariantId(null);
              }}
              variantId={selectedVariantId}
              variantName={variants.find(v => v.id === selectedVariantId)?.variant || ""}
              onConfirm={async () => {
                await deleteFontVariantMutation({ variables: { id: selectedVariantId } });
                notifications.show(strings.variantDeletedSuccess, { severity: "success" });
              }}
            />
          </>
        )}
      </MUI.Box>
    </MUI.Box>
  );
};
