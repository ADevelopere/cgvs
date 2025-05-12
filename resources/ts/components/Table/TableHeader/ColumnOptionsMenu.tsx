import type React from "react"
import { Menu, MenuItem, Typography, Divider } from "@mui/material"
import { PushPin, VisibilityOff, FitScreen, PinDrop } from "@mui/icons-material"
import type { ColumnOptionsMenuProps } from "./types"

const ColumnOptionsMenu: React.FC<ColumnOptionsMenuProps> = ({
  anchorEl,
  open,
  onClose,
  columnId,
  columnLabel,
  isPinnedLeft,
  isPinnedRight,
  onPinLeft,
  onPinRight,
  onUnpin,
  onHide,
  onAutosize,
  onShowColumnManager,
}) => {
  if (!columnId) return null

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
        <Typography variant="subtitle2">{columnLabel}</Typography>
      </MenuItem>
      <Divider />

      {/* Pin options */}
      {isPinnedLeft ? (
        <MenuItem onClick={() => onUnpin(columnId)}>
          <PushPin style={{ marginRight: 8, transform: "rotate(45deg)" }} fontSize="small" />
          Unpin from Left
        </MenuItem>
      ) : (
        <MenuItem onClick={() => onPinLeft(columnId)}>
          <PushPin style={{ marginRight: 8, transform: "rotate(45deg)" }} fontSize="small" />
          Pin to Left
        </MenuItem>
      )}

      {isPinnedRight ? (
        <MenuItem onClick={() => onUnpin(columnId)}>
          <PushPin style={{ marginRight: 8 }} fontSize="small" />
          Unpin from Right
        </MenuItem>
      ) : (
        <MenuItem onClick={() => onPinRight(columnId)}>
          <PushPin style={{ marginRight: 8 }} fontSize="small" />
          Pin to Right
        </MenuItem>
      )}

      <Divider />

      {/* Autosize option */}
      <MenuItem onClick={() => onAutosize(columnId)}>
        <FitScreen style={{ marginRight: 8 }} fontSize="small" />
        Autosize Column
      </MenuItem>

      <Divider />

      {/* Hide option */}
      <MenuItem onClick={() => onHide(columnId)}>
        <VisibilityOff style={{ marginRight: 8 }} fontSize="small" />
        Hide Column
      </MenuItem>

      {/* Column manager option */}
      <MenuItem onClick={onShowColumnManager}>
        <PinDrop style={{ marginRight: 8 }} fontSize="small" />
        Manage Columns
      </MenuItem>
    </Menu>
  )
}

export default ColumnOptionsMenu
