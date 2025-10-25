import type React from "react";
import { Menu, MenuItem, Typography, Divider } from "@mui/material";
import {
  PushPin,
  VisibilityOff,
  FitScreen,
  PinDrop,
} from "@mui/icons-material";
import type { ColumnOptionsMenuProps } from "../../types";
import { useTableLocale } from "../../contexts";

export const ColumnOptionsMenu = ({
  anchorEl,
  open,
  onClose,
  columnId,
  isPinnedLeft,
  isPinnedRight,
  onPinLeft,
  onPinRight,
  onUnpin,
  onHide,
  onAutosize,
  onShowColumnManager,
}: ColumnOptionsMenuProps) => {
  const { strings } = useTableLocale();
  if (!columnId) return null;
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem disabled>
        <Typography variant="subtitle2">{columnId}</Typography>
      </MenuItem>
      <Divider />

      {/* Pin options */}
      {isPinnedLeft ? (
        <MenuItem onClick={() => onUnpin(columnId)}>
          <PushPin
            style={{ marginRight: 8, transform: "rotate(45deg)" }}
            fontSize="small"
          />
          {strings.column.unpin}
        </MenuItem>
      ) : (
        <MenuItem onClick={() => onPinLeft(columnId)}>
          <PushPin
            style={{ marginRight: 8, transform: "rotate(45deg)" }}
            fontSize="small"
          />
          {strings.column.pinLeft}
        </MenuItem>
      )}

      {isPinnedRight ? (
        <MenuItem onClick={() => onUnpin(columnId)}>
          <PushPin style={{ marginRight: 8 }} fontSize="small" />
          {strings.column.unpin}
        </MenuItem>
      ) : (
        <MenuItem onClick={() => onPinRight(columnId)}>
          <PushPin style={{ marginRight: 8 }} fontSize="small" />
          {strings.column.pinRight}
        </MenuItem>
      )}

      <Divider />

      {/* Autosize option */}
      <MenuItem onClick={() => onAutosize(columnId)}>
        <FitScreen style={{ marginRight: 8 }} fontSize="small" />
        {strings.column.autosize}
      </MenuItem>

      <Divider />

      {/* Hide option */}
      <MenuItem onClick={() => onHide(columnId)}>
        <VisibilityOff style={{ marginRight: 8 }} fontSize="small" />
        {strings.column.hide}
      </MenuItem>

      {/* Column manager option */}
      <MenuItem onClick={onShowColumnManager}>
        <PinDrop style={{ marginRight: 8 }} fontSize="small" />
        {strings.column.showColumnManager}
      </MenuItem>
    </Menu>
  );
};
