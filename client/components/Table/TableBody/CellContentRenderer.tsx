/**
 * @deprecated This file is no longer used after the Table refactor to renderer-based architecture.
 * It will be removed during manual cleanup. Do not use in new code.
 * See client/components/Table/renderers/ for replacement components.
 */

"use client";

import React from "react";
import {
  TextField,
  Tooltip,
  MenuItem,
  Box,
  Autocomplete,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
} from "@mui/material";
import { EditableColumn } from "@/client/components/Table/table.type";
import countries, { preferredCountries } from "@/client/lib/country";
import { MuiTelInput } from "mui-tel-input";
import Image from "next/image";
import { DataCellState } from "./DataCell";
import {
  countryNameByCode,
  formatCellValue,
  formatInputValue,
} from "./DataCell.util";
import { useAppTranslation } from "@/client/locale";
import { CountryCode } from "@/client/graphql/generated/gql/graphql";
import TextVariableCellRenderer from "@/client/views/template/manage/data/components/cellRenderers/TextVariableCellRenderer";
import NumberVariableCellRenderer from "@/client/views/template/manage/data/components/cellRenderers/NumberVariableCellRenderer";
import DateVariableCellRenderer from "@/client/views/template/manage/data/components/cellRenderers/DateVariableCellRenderer";
import SelectVariableCellRenderer from "@/client/views/template/manage/data/components/cellRenderers/SelectVariableCellRenderer";
import ReadyStatusCellRenderer from "@/client/views/template/manage/data/components/cellRenderers/ReadyStatusCellRenderer";

// Props for the main component
type CellContentRendererProps = {
  column: EditableColumn;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cellValue: any;
  state: DataCellState;
  setState: React.Dispatch<React.SetStateAction<DataCellState>>;
  commonProps:
    | FilledTextFieldProps
    | OutlinedTextFieldProps
    | StandardTextFieldProps;
  validateValue: (value: unknown) => string | null;
  handleInputKeyDown: (e: React.KeyboardEvent) => void;
  handleBlur: () => void;
};

// --- View Mode Renderers ---

const SelectViewRenderer: React.FC<{
  column: EditableColumn;
  cellValue: CountryCode;
}> = ({ column, cellValue }) => {
  const option = column.options?.find(opt => opt.value === cellValue);
  return <span>{option?.label ?? cellValue}</span>;
};

const CountryViewRenderer: React.FC<{ cellValue: CountryCode }> = ({
  cellValue,
}) => {
  const countryStrings = useAppTranslation("countryTranslations");
  const country = cellValue ? countries.find(c => c.code === cellValue) : null;

  if (country) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Image
          src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
          alt=""
          width={20}
          height={15}
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
        {countryStrings[country.code]}
      </Box>
    );
  }
  return <span>{String(cellValue ?? "")}</span>;
};

const DefaultViewRenderer: React.FC<{
  column: EditableColumn;
  cellValue: string;
}> = ({ column, cellValue }) => (
  <span style={{ direction: column.type === "phone" ? "ltr" : "inherit" }}>
    {formatCellValue(cellValue, column.type)}
  </span>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const viewRenderers: Record<string, React.FC<any>> = {
  select: SelectViewRenderer,
  country: CountryViewRenderer,
};

// --- Edit Mode Renderers ---

type EditRendererProps = Omit<CellContentRendererProps, "cellValue">;

const SelectEditRenderer = React.forwardRef<
  HTMLInputElement,
  EditRendererProps
>(({ column, state, setState, commonProps }, ref) => (
  <TextField
    {...commonProps}
    inputRef={ref}
    select
    value={state.editingValue ?? ""}
    slotProps={{
      select: {
        open: state.isEditing,
        onClose: () => setState(prev => ({ ...prev, isEditing: false })),
      },
    }}
  >
    {column.options?.map(option => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
));
SelectEditRenderer.displayName = "SelectEditRenderer";

const CountryEditRenderer = React.forwardRef<
  HTMLInputElement,
  EditRendererProps
>(({ state, commonProps, handleBlur }, ref) => {
  const countryStrings = useAppTranslation("countryTranslations");
  return (
    <Autocomplete
      fullWidth
      options={countries}
      openOnFocus
      autoHighlight
      value={countries.find(c => c.code === state.editingValue) || countries[0]}
      onChange={(_, newValue) => {
        if (newValue) {
          // Create a synthetic event to use the existing change handler
          const syntheticEvent = {
            target: { value: newValue.code },
          } as React.ChangeEvent<HTMLInputElement>;
          commonProps.onChange?.(syntheticEvent);
        }
      }}
      onBlur={handleBlur}
      getOptionLabel={option => countryNameByCode(countryStrings, option.code)}
      renderOption={(props, option) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { key, ...optionProps } = props;
        return (
          <Box
            key={option.code}
            component="li"
            sx={{ "& > img": { mr: 0, flexShrink: 0 } }}
            {...optionProps}
          >
            <Image
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt=""
              width={20}
              height={15}
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
            {countryNameByCode(countryStrings, option.code)}
          </Box>
        );
      }}
      renderInput={params => (
        <TextField
          {...commonProps}
          inputRef={ref}
          {...params}
          onBlur={handleBlur}
          slotProps={{ htmlInput: { ...params.inputProps } }}
        />
      )}
    />
  );
});
CountryEditRenderer.displayName = "CountryEditRenderer";

const PhoneEditRenderer = React.forwardRef<HTMLInputElement, EditRendererProps>(
  (
    {
      state,
      setState,
      commonProps,
      validateValue,
      handleBlur,
      handleInputKeyDown,
    },
    ref
  ) => (
    <MuiTelInput
      {...commonProps}
      inputRef={ref}
      value={(state.editingValue as string) ?? ""}
      onChange={(value: string) => {
        const validationError = validateValue(value);
        setState(prev => ({
          ...prev,
          editingValue: value,
          errorMessage: validationError,
        }));
      }}
      onBlur={handleBlur}
      onKeyDown={handleInputKeyDown}
      langOfCountryName={"ar"}
      defaultCountry={"EG"}
      focusOnSelectCountry={true}
      excludedCountries={["IL"]}
      preferredCountries={preferredCountries}
      fullWidth
      error={state.errorMessage !== null}
      helperText={state.errorMessage}
    />
  )
);
PhoneEditRenderer.displayName = "PhoneEditRenderer";

const DefaultEditRenderer = React.forwardRef<
  HTMLInputElement,
  EditRendererProps
>(({ column, state, commonProps }, ref) => {
  const inputValue =
    column.type === "date"
      ? formatInputValue(state.editingValue, column.type)
      : (state.editingValue ?? "");

  const inputElement = (
    <TextField
      {...commonProps}
      inputRef={ref}
      type={column.type === "date" ? "date" : "text"}
      value={inputValue}
    />
  );

  return (
    <Tooltip
      open={!!state.errorMessage}
      title={state.errorMessage ?? ""}
      arrow
      placement="bottom-start"
    >
      {inputElement}
    </Tooltip>
  );
});
DefaultEditRenderer.displayName = "DefaultEditRenderer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editRenderers: Record<string, React.FC<any>> = {
  select: SelectEditRenderer,
  country: CountryEditRenderer,
  phone: PhoneEditRenderer,
};

// Custom renderers that handle both view and edit modes internally
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customRenderers: Record<string, React.FC<any>> = {
  templateText: TextVariableCellRenderer,
  templateNumber: NumberVariableCellRenderer,
  templateDate: DateVariableCellRenderer,
  templateSelect: SelectVariableCellRenderer,
  readyStatus: ReadyStatusCellRenderer,
};

// --- Main Component ---

const CellContentRenderer = React.forwardRef<
  HTMLInputElement,
  CellContentRendererProps
>(({ column, cellValue, state, ...rest }, ref) => {
  // Check if this is a custom renderer that handles both view and edit modes
  const CustomRenderer = customRenderers[column.type];
  if (CustomRenderer) {
    return (
      <CustomRenderer
        column={column}
        cellValue={cellValue}
        state={state}
        {...rest}
        ref={ref}
      />
    );
  }

  if (!state.isEditing) {
    const ViewRenderer = viewRenderers[column.type] || DefaultViewRenderer;
    return <ViewRenderer column={column} cellValue={cellValue} />;
  }

  const EditRenderer = editRenderers[column.type] || DefaultEditRenderer;
  const editProps = { column, state, ...rest };
  return <EditRenderer {...editProps} ref={ref} />;
});

CellContentRenderer.displayName = "CellContentRenderer";

export default CellContentRenderer;
