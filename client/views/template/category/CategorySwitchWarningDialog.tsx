"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { useTemplateCategoryStore } from "./hooks/useTemplateCategoryStore";

export const CategorySwitchWarningDialog = () => {
  const { templateCategoryTranslations: strings } = useAppTranslation();

  // Get all necessary state and actions directly from the store
  const { isSwitchWarningOpen, closeSwitchWarning, confirmSwitch } =
    useTemplateCategoryStore();

  return (
    <Dialog open={isSwitchWarningOpen} onClose={closeSwitchWarning}>
      <DialogTitle>{strings.confirmSwitchCategory}</DialogTitle>
      <DialogContent>{strings.switchCategoryWhileAddingTemplate}</DialogContent>
      <DialogActions>
        <Button onClick={closeSwitchWarning}>{strings.cancel}</Button>
        <Button onClick={confirmSwitch} color="primary">
          {strings.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
