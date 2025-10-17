"use client";

import { FC, useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { Template } from "@/client/graphql/generated/gql/graphql";
import TemplateVariableModal from "./TemplateVariableModal";
import { useAppTranslation } from "@/client/locale";
import { TemplateVariableTranslation } from "@/client/locale/components";
import {
  TemplateVariable,
  TemplateVariableType,
} from "@/client/graphql/generated/gql/graphql";
import { useTemplateVariableOperations, useTemplateVariableModal } from "./hooks";

interface ContentProps {
  onOpenModal: (variable: TemplateVariable) => void;
  strings: TemplateVariableTranslation;
  variables: TemplateVariable[];
  loading: boolean;
  onDelete: (id: number) => Promise<boolean>;
}

const Content: FC<ContentProps> = ({ onOpenModal, strings, variables, loading, onDelete }) => {
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] =
    useState(false);
  const [variableToDelete, setVariableToDelete] = useState<number | null>(null);

  const typeToLabelMap: Record<TemplateVariableType, string> = useMemo(
    () => ({
      TEXT: strings.textTypeLabel,
      NUMBER: strings.numberTypeLabel,
      DATE: strings.dateTypeLabel,
      SELECT: strings.selectTypeLabel,
    }),
    [
      strings.dateTypeLabel,
      strings.numberTypeLabel,
      strings.selectTypeLabel,
      strings.textTypeLabel,
    ],
  );

  const handleVariableClick = useCallback(
    (variable: TemplateVariable) => {
      onOpenModal(variable);
    },
    [onOpenModal],
  );

  const handleDeleteClick = useCallback((id: number) => {
    setVariableToDelete(id);
    setIsDeleteConfirmationDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (variableToDelete) {
      await onDelete(variableToDelete);
      setIsDeleteConfirmationDialogOpen(false);
      setVariableToDelete(null);
    }
  }, [variableToDelete, onDelete]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (variables.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Typography>{strings.noVariables}</Typography>
      </Box>
    );
  }

  return (
    <>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          flexGrow: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
        }}
      >
        {variables.map((variable: TemplateVariable) => {
          if (!variable.type || !variable.id) return null;
          const variableId = variable.id;
          const type = variable.type;

          return (
            <ListItem
              key={variable.id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label={strings.delete}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(variableId);
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => handleVariableClick(variable)}>
                <ListItemText
                  primary={variable.name}
                  secondary={typeToLabelMap[type] || type}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/*  Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmationDialogOpen}
        onClose={() => setIsDeleteConfirmationDialogOpen(false)}
      >
        <DialogTitle>{strings.deleteVariable}</DialogTitle>
        <DialogContent>
          <DialogContentText>{strings.confirmDelete}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteConfirmationDialogOpen(false)}
            color="primary"
            variant="contained"
          >
            {strings.cancel}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            autoFocus
            color="error"
            variant="outlined"
          >
            {strings.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface FooterProps {
  onOpenModal: (type: TemplateVariableType) => void;
  strings: TemplateVariableTranslation;
}

const Header: FC<FooterProps> = ({ onOpenModal, strings }) => {
  // Popover menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Handlers
  const handleCreateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleVariableTypeSelect = (type: TemplateVariableType) => {
    handleMenuClose();
    onOpenModal(type);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          justifyContent: "end",
          width: "100%",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          size="small"
          startIcon={<Plus size={16} />}
          onClick={handleCreateClick}
        >
          {strings.createVariable}
        </Button>
      </Box>

      {/* popover menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleVariableTypeSelect("TEXT")}>
          {strings.textVariable}
        </MenuItem>
        <MenuItem onClick={() => handleVariableTypeSelect("NUMBER")}>
          {strings.numberVariable}
        </MenuItem>
        <MenuItem onClick={() => handleVariableTypeSelect("DATE")}>
          {strings.dateVariable}
        </MenuItem>
        <MenuItem onClick={() => handleVariableTypeSelect("SELECT")}>
          {strings.selectVariable}
        </MenuItem>
      </Menu>
    </>
  );
};

interface TemplateVariableManagementProps {
  template: Template;
}

const TemplateVariableManagement: FC<TemplateVariableManagementProps> = ({
  template,
}) => {
  const operations = useTemplateVariableOperations(template.id);
  const modal = useTemplateVariableModal(template.id);
  const strings = useAppTranslation("templateVariableTranslations");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mx: "auto",
          height: "100%",
        }}
      >
        <Header onOpenModal={modal.openCreateModal} strings={strings} />
        <Box
          sx={{
            overflow: "auto",
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: `calc(100vh - 250px)`,
            minHeight: `calc(100vh - 250px)`,
            px: 2,
          }}
        >
          <Content
            onOpenModal={modal.openEditModal}
            strings={strings}
            variables={operations.variables}
            loading={operations.loading}
            onDelete={operations.deleteVariable}
          />
        </Box>
      </Box>

      <TemplateVariableModal
        open={modal.isOpen}
        onClose={modal.closeModal}
        editingVariableId={modal.editingVariableId}
        type={modal.variableType}
        templateId={template.id}
        onSave={modal.handleSave}
      />
    </>
  );
};

export default TemplateVariableManagement;
