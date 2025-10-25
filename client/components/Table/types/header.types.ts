export interface ColumnOptionsMenuProps<TColumnId extends string = string> {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnId: TColumnId;
  isPinnedLeft: boolean;
  isPinnedRight: boolean;
  onPinLeft: (columnId: TColumnId) => void;
  onPinRight: (columnId: TColumnId) => void;
  onUnpin: (columnId: TColumnId) => void;
  onHide: (columnId: TColumnId) => void;
  onAutosize: (columnId: TColumnId) => void;
  onShowColumnManager: () => void;
}
