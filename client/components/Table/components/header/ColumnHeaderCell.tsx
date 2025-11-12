import React, { useCallback, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { styled } from "@mui/material/styles";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MoreVert, PushPin, VisibilityOff } from "@mui/icons-material";
import { ResizeHandle } from "./ResizeHandle";
import { AnyColumn, PinPosition } from "../../types";
import { useTableLocale } from "../../contexts";
import { TABLE_CHECKBOX_CONTAINER_SIZE } from "../../constants";
import { useAppTheme } from "@/client/contexts";

export interface ColumnHeaderProps<
  TRowData,
  TRowId extends string | number = string | number
> {
  column: AnyColumn<TRowData, TRowId>;
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

const StyledTh = styled("th")(() => ({
  padding: 0,
  position: "relative",
}));

interface HeaderContainerProps {
  columnWidth: number;
}

const HeaderContainer = styled("div")<HeaderContainerProps>(
  ({ columnWidth, theme }) => ({
    position: "relative",
    maxWidth: columnWidth,
    width: columnWidth,
    minWidth: columnWidth,
    overflow: "visible",
    minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
    textAlign: "start" as const,
    color: theme.palette.text.primary,
    paddingInlineStart: 12,
    paddingInlineEnd: 8,
  })
);

const HeaderContentWrapper = styled("div")({
  overflow: "hidden",
  flex: 1,
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "100%",
  minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
});

const HeaderInner = styled("div")({
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "100%",
  minHeight: TABLE_CHECKBOX_CONTAINER_SIZE,
});

interface HeaderContentProps {
  isPinned: PinPosition;
  pinnedLeftStyle: CSSProperties;
  pinnedRightStyle: CSSProperties;
}

const HeaderContent = styled("div")<HeaderContentProps>(
  ({ isPinned, pinnedLeftStyle, pinnedRightStyle }) => {
    let style: CSSProperties = {};
    if (isPinned === "left") {
      style = { ...pinnedLeftStyle };
    } else if (isPinned === "right") {
      style = { ...pinnedRightStyle };
    }

    return {
      ...style,
      flex: 1,
      overflow: "hidden",
      fontWeight: "bold",
      position: "relative",
      display: "flex",
    };
  }
);

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
const ColumnHeaderCellComponent = <
  TRowData,
  TRowId extends string | number = string | number
>({
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
}: ColumnHeaderProps<TRowData, TRowId>) => {
  const locale = useTableLocale();
  const { isRtl } = useAppTheme();

  const [optionsAnchor, setOptionsAnchor] = useState<HTMLElement | null>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);

  // Handle resize
  const handleResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      if (!clientX) throw new Error("undefined clientX");
      resizeStartX.current = clientX;
      resizeStartWidth.current = columnWidth;

      const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
        const moveClientX =
          "touches" in moveEvent
            ? moveEvent.touches[0]?.clientX
            : moveEvent.clientX;
        if (!moveClientX) throw new Error("undefined moveClientX");

        const rawDelta = moveClientX - resizeStartX.current;

        const delta = isRtl ? -rawDelta : rawDelta;
        const newWidth = Math.max(
          column.minWidth || 50,
          Math.min(column.maxWidth || 1000, resizeStartWidth.current + delta)
        );

        resizeColumn(column.id, newWidth);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleMouseMove);
        document.removeEventListener("touchend", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleMouseMove);
      document.addEventListener("touchend", handleMouseUp);
    },
    [column, columnWidth, resizeColumn, isRtl]
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
        <HeaderContentWrapper>
          <HeaderInner>
            <HeaderContent
              isPinned={isPinned}
              pinnedLeftStyle={pinnedLeftStyle}
              pinnedRightStyle={pinnedRightStyle}
            >
              {/* Render custom header content */}
              {column.headerRenderer()}
            </HeaderContent>

            {/* Table-managed options menu */}
            <IconButton
              onClick={handleOptionsClick}
              size="small"
              aria-label={`${column.id} options`}
            >
              <MoreVert fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={optionsAnchor}
              open={Boolean(optionsAnchor)}
              onClose={handleOptionsClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {isPinned !== "left" && onPinLeft && (
                <MenuItem onClick={handlePinLeft}>
                  <ListItemIcon>
                    <PushPin fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{locale.strings.column.pinLeft}</ListItemText>
                </MenuItem>
              )}
              {isPinned !== "right" && onPinRight && (
                <MenuItem onClick={handlePinRight}>
                  <ListItemIcon>
                    <PushPin fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{locale.strings.column.pinRight}</ListItemText>
                </MenuItem>
              )}
              {isPinned && onUnpin && (
                <MenuItem onClick={handleUnpin}>
                  <ListItemIcon>
                    <PushPin fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{locale.strings.column.unpin}</ListItemText>
                </MenuItem>
              )}
              {onHide && (
                <MenuItem onClick={handleHide}>
                  <ListItemIcon>
                    <VisibilityOff fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{locale.strings.column.hide}</ListItemText>
                </MenuItem>
              )}
            </Menu>
          </HeaderInner>
        </HeaderContentWrapper>

        {/* Resize handle - now outside overflow:hidden wrapper */}
        <ResizeHandle
          onResize={handleResizeStart}
          enabled={column.resizable !== false}
        />
      </HeaderContainer>
    </StyledTh>
  );
};

ColumnHeaderCellComponent.displayName = "ColumnHeaderCell";

export const ColumnHeaderCell = React.memo(
  ColumnHeaderCellComponent
) as typeof ColumnHeaderCellComponent;
