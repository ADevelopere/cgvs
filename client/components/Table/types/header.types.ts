
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
