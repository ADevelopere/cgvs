"use client";

import React, { useState } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import { FontManagementView } from "./FontManagementView";
import { CreateFontWithFamilyDialog } from "./dialogs/CreateFontWithFamilyDialog";
import { useFontStore } from "./stores/useFontStore";
import { useFontApolloMutations } from "./hooks/useFontApolloMutations";
import { useAppTranslation } from "@/client/locale";

export const FontManagementViewPage: React.FC = () => {
  const { fontManagementTranslations: t } = useAppTranslation();
  const { selectedFamilyId, setSelectedFamilyId } = useFontStore();
  const { createFontWithFamilyMutation } = useFontApolloMutations();
  const notifications = useNotifications();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <FontManagementView
        selectedFamilyId={selectedFamilyId}
        selectFamily={setSelectedFamilyId}
        onCreateClick={() => setCreateDialogOpen(true)}
      />

      <CreateFontWithFamilyDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={async data => {
          const result = await createFontWithFamilyMutation({ variables: data });
          if (result.data?.createFontWithFamily) {
            notifications.show(t.fontCreatedSuccess.replace("%{name}", data.familyName), { severity: "success" });
            setSelectedFamilyId(result.data.createFontWithFamily.familyId);
          }
        }}
      />
    </>
  );
};
