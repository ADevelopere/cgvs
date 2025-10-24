# ColumnHeaderCell Implementation

**File: `client/components/Table/TableHeader/ColumnHeaderCell.tsx`**

Refactored to delegate header rendering to `column.headerRenderer` while managing table-level concerns.

## Complete Implementation

```typescript
import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FunctionComponent } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert, PushPin, VisibilityOff } from '@mui/icons-material';
import ResizeHandle from './ResizeHandle';
import { useTableStyles } from '@/client/theme/styles';
import { AnyColumn, PinPosition } from '@/client/components/Table/table.type';
import { useTableLocale } from '@/client/locale/table/TableLocaleContext';
import { TABLE_CHECKBOX_CONTAINER_SIZE } from '@/client/constants/tableConstants';

export interface ColumnHeaderProps<TRowData = any> {
  column: AnyColumn<TRowData>;
  isPinned: PinPosition;
  columnWidth: number;
  resizeColumn: (columnId: string, newWidth: number) => void;
  pinnedLeftStyle: CSSProperties;
  pinnedRightStyle: CSSProperties;
  // Column management callbacks
  onPinLeft?: (columnId: string) => void;
  onPinRight?: (columnId: string) => void;
  onUnpin?: (columnId: string) => void;
  onHide?: (columnId: string) => void;
}

const StyledTh = styled('th')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: 0,
  position: 'relative',
}));

interface HeaderContainerProps {
  columnWidth: number;
}

const HeaderContainer = styled('div')<HeaderContainerProps>(
  ({ columnWidth }) => ({
    position: 'relative',
    maxWidth: columnWidth,
    width: columnWidth,
    minWidth: columnWidth,
    overflow: 'hidden',
    minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
  })
);

const HeaderInner = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
});

interface HeaderContentProps {
  isPinned: PinPosition;
  pinnedLeftStyle: CSSProperties;
  pinnedRightStyle: CSSProperties;
  thStyle: CSSProperties;
}

const HeaderContent = styled('div')<HeaderContentProps>({
  isPinned,
  pinnedLeftStyle,
  pinnedRightStyle,
  thStyle,
}) => {
  let style = { ...thStyle };
  if (isPinned === 'left') {
    style = { ...thStyle, ...pinnedLeftStyle };
  } else if (isPinned === 'right') {
    style = { ...thStyle, ...pinnedRightStyle };
  }

  return {
    ...style,
    flex: 1,
    overflow: 'hidden',
  };
});

const OptionsButton = styled(IconButton)({
  padding: '4px',
  marginLeft: '4px',
});

/**
 * ColumnHeaderCell Component
 *
 * Manages table-level header concerns:
 * - Column resizing
 * - Column pinning (left/right)
 * - Column visibility
 * - Options menu
 *
 * Delegates header content rendering to column.headerRenderer
 */
const ColumnHeaderCell = <TRowData,>({
  column,
  isPinned,
  columnWidth,
  resizeColumn,
  pinnedLeftStyle,
  pinnedRightStyle,
  onPinLeft,
  onPinRight,
  onUnpin,
  onHide,
}: ColumnHeaderProps<TRowData>) => {
  const theme = useTheme();
  const styles = useTableStyles();
  const locale = useTableLocale();

  const [optionsAnchor, setOptionsAnchor] = useState<HTMLElement | null>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);

  // Calculate th style based on pin position
  const thStyle = useMemo<CSSProperties>(() => {
    const base: CSSProperties = {
      ...styles.th,
      backgroundColor: theme.palette.background.paper,
    };

    if (isPinned === 'left') {
      return { ...base, ...pinnedLeftStyle };
    } else if (isPinned === 'right') {
      return { ...base, ...pinnedRightStyle };
    }

    return base;
  }, [theme, styles, isPinned, pinnedLeftStyle, pinnedRightStyle]);

  // Handle resize
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      resizeStartX.current = e.clientX;
      resizeStartWidth.current = columnWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - resizeStartX.current;
        const newWidth = Math.max(
          column.minWidth || 50,
          Math.min(
            column.maxWidth || 1000,
            resizeStartWidth.current + delta
          )
        );
        resizeColumn(column.id, newWidth);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [column, columnWidth, resizeColumn]
  );

  // Options menu handlers
  const handleOptionsClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setOptionsAnchor(e.currentTarget);
  }, []);

  const handleOptionsClose = useCallback(() => {
    setOptionsAnchor(null);
  }, []);

  const handlePinLeft = useCallback(() => {
    onPinLeft?.(column.id);
    handleOptionsClose();
  }, [column.id, onPinLeft, handleOptionsClose]);

  const handlePinRight = useCallback(() => {
    onPinRight?.(column.id);
    handleOptionsClose();
  }, [column.id, onPinRight, handleOptionsClose]);

  const handleUnpin = useCallback(() => {
    onUnpin?.(column.id);
    handleOptionsClose();
  }, [column.id, onUnpin, handleOptionsClose]);

  const handleHide = useCallback(() => {
    onHide?.(column.id);
    handleOptionsClose();
  }, [column.id, onHide, handleOptionsClose]);

  return (
    <StyledTh>
      <HeaderContainer columnWidth={columnWidth}>
        <HeaderInner>
          <HeaderContent
            isPinned={isPinned}
            pinnedLeftStyle={pinnedLeftStyle}
            pinnedRightStyle={pinnedRightStyle}
            thStyle={thStyle}
          >
            {/* Render custom header content */}
            {column.headerRenderer({ column })}
          </HeaderContent>

          {/* Table-managed options menu */}
          <OptionsButton
            onClick={handleOptionsClick}
            size="small"
            aria-label={`${column.id} options`}
          >
            <MoreVert fontSize="small" />
          </OptionsButton>

          <Menu
            anchorEl={optionsAnchor}
            open={Boolean(optionsAnchor)}
            onClose={handleOptionsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {isPinned !== 'left' && onPinLeft && (
              <MenuItem onClick={handlePinLeft}>
                <ListItemIcon>
                  <PushPin fontSize="small" />
                </ListItemIcon>
                <ListItemText>{locale.pinLeft}</ListItemText>
              </MenuItem>
            )}
            {isPinned !== 'right' && onPinRight && (
              <MenuItem onClick={handlePinRight}>
                <ListItemIcon>
                  <PushPin fontSize="small" />
                </ListItemIcon>
                <ListItemText>{locale.pinRight}</ListItemText>
              </MenuItem>
            )}
            {isPinned && onUnpin && (
              <MenuItem onClick={handleUnpin}>
                <ListItemIcon>
                  <PushPin fontSize="small" />
                </ListItemIcon>
                <ListItemText>{locale.unpin}</ListItemText>
              </MenuItem>
            )}
            {onHide && (
              <MenuItem onClick={handleHide}>
                <ListItemIcon>
                  <VisibilityOff fontSize="small" />
                </ListItemIcon>
                <ListItemText>{locale.hide}</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </HeaderInner>

        {/* Resize handle */}
        {column.resizable !== false && (
          <ResizeHandle onResize={handleResizeStart} />
        )}
      </HeaderContainer>
    </StyledTh>
  );
};

ColumnHeaderCell.displayName = 'ColumnHeaderCell';

export default React.memo(ColumnHeaderCell) as typeof ColumnHeaderCell;
```

## Key Changes from Old Implementation

### Removed

- ✗ Built-in filter handling logic
- ✗ Built-in sort handling logic
- ✗ Filter icon rendering
- ✗ Sort icon rendering
- ✗ Type-specific rendering logic

### Kept

- ✓ Resize handle rendering and logic
- ✓ Options menu (pin left/right, unpin, hide)
- ✓ Column width management
- ✓ Pinned column styling

### New

- ✓ Calls `column.headerRenderer({ column })` for all header content
- ✓ Fully generic with TypeScript generics `<TRowData>`
- ✓ Consumer has complete control over header rendering
- ✓ Cleaner separation of concerns
