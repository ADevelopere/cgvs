"use client";

import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { useTemplateCategoryStore } from "./hooks/useTemplateCategoryStore";

export const CategorySwitchWarningDialog = () => {
  const messages = useAppTranslation("templateCategoryTranslations");

  // Get all necessary state and actions directly from the store
  const { isSwitchWarningOpen, closeSwitchWarning, confirmSwitch } = useTemplateCategoryStore();

  return (
    <Dialog open={isSwitchWarningOpen} onClose={closeSwitchWarning}>
      <DialogTitle>{messages.confirmSwitchCategory}</DialogTitle>
      <DialogContent>
        {messages.switchCategoryWhileAddingTemplate}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeSwitchWarning}>{messages.cancel}</Button>
        <Button onClick={confirmSwitch} color="primary">
          {messages.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
