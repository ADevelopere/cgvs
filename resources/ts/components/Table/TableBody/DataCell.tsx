"use client";

import type React from "react";
import { CSSProperties, useMemo, forwardRef } from "react";
import { TextField } from "@mui/material";
import { useTableColumnContext } from "../Table/TableColumnContext";
import { Column } from "@/types/table.type";
import { useTableStyles } from "@/styles";

// Function to get cell value based on column accessor
const getCellValue = (column: Column, rowData: any) => {
  if (typeof column.accessor === "function") {
    return column.accessor(rowData);
  }

  return rowData[column.accessor];
};

// Function to format cell value based on column type
const formatCellValue = (value: any, type: string) => {
  if (value === null || value === undefined) {
    return "";
  }

  switch (type) {
    case "date":
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch (e) {
        console.error("Invalid date:", value);
      }
      return value;
    case "text":
    default:
      return value.toString();
  }
};

// Function to format value for input based on column type
const formatInputValue = (value: any, type: string) => {
  if (value === null || value === undefined) {
    return "";
  }

  switch (type) {
    case "date":
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD for date input
        }
      } catch (e) {
        console.error("Invalid date:", value);
      }
      return value;
    case "text":
    default:
      return value.toString();
  }
};

type RenderCellProps = {
  column: Column;
  rowData: any;
  tempValue: string | number | null;
  handleCellClick: (columnId: string, value: any) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  cellEditingStyle: CSSProperties;
  cellStyle: CSSProperties;
  isEditing?: boolean;
};

const DataCell = forwardRef<HTMLInputElement, RenderCellProps>(
  (
    {
      column,
      rowData,
      tempValue,
      handleCellClick,
      handleInputChange,
      onBlur,
      onKeyDown,
      cellEditingStyle,
      cellStyle,
      isEditing,
    },
    ref
  ) => {
    const { pinnedColumns, pinnedLeftStyle, pinnedRightStyle, columnWidths } =
      useTableColumnContext();
    const { inputStyle } = useTableStyles();
    const width = columnWidths[column.id]; // Default width if not set
    if (column.id === "status") {
      console.log("DataCell column: ", column.id, "width:", width);
    }

    const cellValue = getCellValue(column, rowData);
    const effectiveCellStyle = isEditing
      ? {
          ...cellEditingStyle,
          width: `${width}px`,
        }
      : {
          ...cellStyle,
          width: `${width}px`,
        };

    // Determine if this cell is in a pinned column
    const pinPosition = pinnedColumns[column.id];
    const isPinnedLeft = pinPosition === "left";
    const isPinnedRight = pinPosition === "right";

    // Apply appropriate styles based on pin position
    let cellStyleWithPin = { ...effectiveCellStyle } as React.CSSProperties;
    if (isPinnedLeft) {
      cellStyleWithPin = { ...effectiveCellStyle, ...pinnedLeftStyle };
    } else if (isPinnedRight) {
      cellStyleWithPin = { ...effectiveCellStyle, ...pinnedRightStyle };
    }

    // Ensure pinned cells inherit the row's background color
    // if (rowStyle.backgroundColor) {
    //   cellStyleWithPin.backgroundColor = rowStyle.backgroundColor;
    // }

    const commonTextFieldProps = useMemo(
      () => ({
        inputRef: ref,
        onChange: handleInputChange,
        onBlur: onBlur,
        onKeyDown: onKeyDown,
        variant: "standard" as const,
        fullWidth: true,
        sx: {
          ...inputStyle,
        },
        slotProps: {
          input: {
            disableUnderline: true,
          },
        },
      }),
      [inputStyle, ref, handleInputChange, onBlur, onKeyDown]
    );

    const renderCellContent = () => {
      if (!isEditing) {
        return <span>{formatCellValue(cellValue, column.type)}</span>;
      }

      if (column.type === "date") {
        return (
          <TextField
            {...commonTextFieldProps}
            type="date"
            value={formatInputValue(tempValue, column.type)}
          />
        );
      }

      return <TextField {...commonTextFieldProps} value={tempValue} />;
    };

    return (
      <td key={column.id} onClick={() => handleCellClick(column.id, cellValue)}>
        <div
          style={{
            ...cellStyleWithPin,
          }}
        >
          {renderCellContent()}
        </div>
      </td>
    );
  }
);

export default DataCell;
