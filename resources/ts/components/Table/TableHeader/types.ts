import type React from "react";

// Keep the rest of the interfaces as they are

export type FilterPopoverProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnId: string | null;
  columnLabel: string;
  value: string;
  hasActiveFilter: boolean;
  onChange: (columnId: string, value: string) => void;
  onKeyDown: (event: React.KeyboardEvent, columnId: string) => void;
};

export type ColumnOptionsMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnId: string | null;
  columnLabel: string;
  isPinnedLeft: boolean;
  isPinnedRight: boolean;
  onPinLeft: (columnId: string) => void;
  onPinRight: (columnId: string) => void;
  onUnpin: (columnId: string) => void;
  onHide: (columnId: string) => void;
  onAutosize: (columnId: string) => void;
  onShowColumnManager: () => void;
};
