"use client";

import type React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
} from "@mui/material";
import { useTableColumnContext, useTableLocale } from "../../contexts";

interface ColumnVisibilityPanelProps {
  onClose: () => void;
}

const ColumnVisibilityPanel: React.FC<ColumnVisibilityPanelProps> = ({ onClose }) => {
  const { allColumns, showColumn, hideColumn, hiddenColumns } = useTableColumnContext();
  const { strings } = useTableLocale();

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{strings.general.columnVisibility}</DialogTitle>
      <DialogContent>
        <List>
          {allColumns.map(column => (
            <ListItem key={column.id}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={!hiddenColumns.includes(column.id)}
                  onChange={() => (hiddenColumns.includes(column.id) ? showColumn(column.id) : hideColumn(column.id))}
                />
              </ListItemIcon>
              <ListItemText primary={column.label || column.id} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {strings.filter.apply}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnVisibilityPanel;
