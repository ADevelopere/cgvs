import type React from "react";
import { useRef, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { ColumnHeaderCell } from "../components";
import { Box, Checkbox } from "@mui/material";

import { useTableColumnContext, useTableRowsContext } from "../contexts";
import { TABLE_CHECKBOX_CONTAINER_SIZE, TABLE_CHECKBOX_WIDTH } from "../constants";

/**
 * TableHeader Component
 *
 * Renders the table header row with column headers.
 * In the new architecture, each column's headerRenderer is responsible
 * for rendering its own content (label, sort, filter, etc.)
 */
export const TableHeader: React.FC<{
  width: number;
  indexColWidth: number;
}> = ({ width, indexColWidth }) => {
  const theme = useTheme();
  const headerRef = useRef<HTMLTableRowElement>(null);
  const {
    visibleColumns,
    pinnedColumns,
    pinnedLeftStyle,
    pinnedRightStyle,
    resizeColumn,
    columnWidths,
    pinColumn,
    hideColumn,
  } = useTableColumnContext();

  const { rowSelectionEnabled, isAllRowsSelected, toggleAllRowsSelection } = useTableRowsContext();

  // Column management callbacks
  const handlePinLeft = useCallback(
    (columnId: string) => {
      pinColumn(columnId, "left");
    },
    [pinColumn]
  );

  const handlePinRight = useCallback(
    (columnId: string) => {
      pinColumn(columnId, "right");
    },
    [pinColumn]
  );

  const handleUnpin = useCallback(
    (columnId: string) => {
      pinColumn(columnId, null);
    },
    [pinColumn]
  );

  const handleHide = useCallback(
    (columnId: string) => {
      hideColumn(columnId);
    },
    [hideColumn]
  );

  return (
    <tr
      ref={headerRef}
      style={{
        width: width - 20,
        display: "table-row",
        flexDirection: "row",
        color: theme.palette.text.secondary,
        textAlign: "start" as const,
        whiteSpace: "nowrap" as const,
        textOverflow: "ellipsis" as const,
        boxShadow: `inset 0 -2px 0 0 ${theme.palette.divider}`,
      }}
    >
      {/* Index column header */}
      <th
        style={{
          width: indexColWidth,
          textAlign: "center",
          fontWeight: "bold",
          borderInlineEnd: `1px solid ${theme.palette.divider}`,
        }}
      ></th>

      {/* Row selection checkbox */}
      {rowSelectionEnabled && (
        <th>
          <Box
            sx={{
              height: TABLE_CHECKBOX_CONTAINER_SIZE,
              display: "flex",
              alignItems: "center",
              paddingInline: "8px",
              borderInlineEnd: `1px solid ${theme.palette.divider}`,
              width: TABLE_CHECKBOX_CONTAINER_SIZE,
              minWidth: TABLE_CHECKBOX_CONTAINER_SIZE,
            }}
          >
            <Checkbox
              checked={isAllRowsSelected === true}
              indeterminate={isAllRowsSelected === null}
              onChange={toggleAllRowsSelection}
              color="primary"
              size="small"
              sx={{
                maxHeight: TABLE_CHECKBOX_WIDTH,
                height: TABLE_CHECKBOX_WIDTH,
                width: TABLE_CHECKBOX_WIDTH,
                minWidth: TABLE_CHECKBOX_WIDTH,
              }}
            />
          </Box>
        </th>
      )}

      {/* Column headers */}
      {visibleColumns.map(column => {
        const pinPosition = pinnedColumns[column.id];
        const columnWidth = columnWidths[column.id];

        return (
          <ColumnHeaderCell
            key={column.id}
            column={column}
            isPinned={pinPosition}
            columnWidth={columnWidth}
            resizeColumn={resizeColumn}
            pinnedLeftStyle={pinnedLeftStyle}
            pinnedRightStyle={pinnedRightStyle}
            onPinLeft={handlePinLeft}
            onPinRight={handlePinRight}
            onUnpin={handleUnpin}
            onHide={handleHide}
          />
        );
      })}

      {/* Spacer cell to account for scrollbar */}
      <th
        style={{
          width: 20,
        }}
      ></th>
    </tr>
  );
};
