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
