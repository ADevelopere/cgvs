"use client";

import React, { CSSProperties } from "react";
import { TextField, Tooltip, MenuItem, Box, Autocomplete } from "@mui/material";
// Ensure these are the actual exported React.Context objects
import { EditableColumn } from "@/types/table.type";
import TableColumnContext, {
    TableColumnContextType,
} from "../Table/TableColumnContext";
import TableDataContext, {
    TableDataContextType,
} from "../Table/TableDataContext";
import countries, { CountryType } from "@/utils/country";
import useAppTranslation from "@/locale/useAppTranslation";
import CountryTranslations from "@/locale/components/Country";
import { MuiTelInput, MuiTelInputCountry } from "mui-tel-input";
// import { useTableStyles } from "@/styles"; // Cannot use hooks in class components
// inputStyle will be expected as a prop
import Image from "next/image";

const preferredCountries: MuiTelInputCountry[] = [
    "SA",
    "PS",
    "YE",
    "SY",
    "EG",
    "KW",
    "QA",
    "OM",
    "BH",
    "LB",
    "JO",
    "IQ",
    "LY",
    "AE",
    "TN",
    "DZ",
    "MA",
    "SD",
    "MR",
    "SO",
    "ID",
    "KM",
    "DJ",
    "ER",
    "SS",
    "EH",
];

// Helper functions (getCellValue, formatCellValue, formatInputValue) remain the same
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCellValue = (column: EditableColumn, rowData: any) => {
    if (typeof column.accessor === "function") {
        return column.accessor(rowData);
    }
    return rowData[column.accessor];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            } catch {
                console.error("Invalid date:", value);
            }
            return value;
        case "text":
        default:
            return value.toString();
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatInputValue = (value: any, type: string) => {
    if (value === null || value === undefined) {
        return "";
    }
    switch (type) {
        case "date":
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return date.toISOString().split("T")[0];
                }
            } catch {
                console.error("Invalid date:", value);
            }
            return value;
        case "text":
        default:
            return value.toString();
    }
};

/**
 * Retrieves the country name by its code.
 * @param {CountryTranslations} strings - The language strings for countries.
 * @param {string} code - The country code.
 * @returns {string} The country name.
 */
function countryNameByCode(strings: CountryTranslations, code: string): string {
    return strings[code] || code;
}

type RenderCellProps = {
    column: EditableColumn;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData: any;
    cellEditingStyle: CSSProperties;
    cellStyle: CSSProperties;
    inputStyle: CSSProperties; // Expect inputStyle to be passed as a prop
    countryStrings: CountryTranslations; // Add this line
};

interface DataCellState {
    isEditing: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    localTmpValue: any;
    localErrorMessage: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withTranslation = (WrappedComponent: React.ComponentType<any>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function WithTranslationComponent(props: any) {
        const countryStrings = useAppTranslation("countryTranslations");
        return <WrappedComponent {...props} countryStrings={countryStrings} />;
    };
};

class DataCell extends React.Component<RenderCellProps, DataCellState> {
    private readonly inputRef: React.RefObject<HTMLInputElement | null>;
    private dataContextGetEditingState?: TableDataContextType["getEditingState"];
    private dataContextSetEditingState?: TableDataContextType["setEditingState"];
    private stateInitializedFromContext: boolean = false;

    constructor(props: RenderCellProps) {
        super(props);
        this.inputRef = React.createRef<HTMLInputElement | null>();

        this.state = {
            isEditing: false,
            localTmpValue: undefined,
            localErrorMessage: null,
        };
    }

    componentDidMount() {
        if (
            this.dataContextGetEditingState &&
            !this.stateInitializedFromContext
        ) {
            const editingState = this.dataContextGetEditingState(
                this.props.rowData.id,
                this.props.column.id,
            );
            if (editingState) {
                this.setState({
                    isEditing: editingState.isEditing,
                    localTmpValue: editingState.tmpValue,
                    localErrorMessage: editingState.errorMessage,
                });
            }
            this.stateInitializedFromContext = true;
        }
    }

    componentWillUnmount() {
        console.log("Cleaning up editing state");
        if (this.dataContextSetEditingState) {
            if (this.state.isEditing) {
                this.dataContextSetEditingState(
                    this.props.rowData.id,
                    this.props.column.id,
                    {
                        isEditing: this.state.isEditing,
                        tmpValue: this.state.localTmpValue,
                        errorMessage: this.state.localErrorMessage,
                    },
                );
            } else {
                this.dataContextSetEditingState(
                    this.props.rowData.id,
                    this.props.column.id,
                    null,
                );
            }
        }
    }

    shouldComponentUpdate(
        nextProps: RenderCellProps,
        nextState: DataCellState,
    ) {
        if (
            this.props.column.id !== nextProps.column.id ||
            this.props.rowData.id !== nextProps.rowData.id ||
            this.props.cellEditingStyle !== nextProps.cellEditingStyle ||
            this.props.cellStyle !== nextProps.cellStyle ||
            this.props.inputStyle !== nextProps.inputStyle // Also check new prop
        ) {
            return true;
        }
        if (
            this.state.isEditing !== nextState.isEditing ||
            this.state.localTmpValue !== nextState.localTmpValue ||
            this.state.localErrorMessage !== nextState.localErrorMessage
        ) {
            return true;
        }
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateValue = (value: any): string | null => {
        return this.props.column?.getIsValid?.(value) ?? null;
    };

    handleCellClick = () => {
        const { column, rowData } = this.props;
        console.log("Cell clicked:", {
            isEditable: column.editable,
            currentlyEditing: this.state.isEditing,
            column,
        });
        if (column.editable && !this.state.isEditing) {
            const value = getCellValue(column, rowData);
            const validationError = this.validateValue(value);
            this.setState(
                {
                    isEditing: true,
                    localTmpValue: value,
                    localErrorMessage: validationError,
                },
                () => {
                    setTimeout(() => {
                        if (this.inputRef.current) {
                            this.inputRef.current.focus();
                        }
                    }, 10);
                },
            );
        }
    };

    handleUpdate = () => {
        if (this.state.localErrorMessage) return;
        const { column, rowData } = this.props;
        const { localTmpValue } = this.state;
        const originalValue = getCellValue(column, rowData);

        if (
            localTmpValue !== null &&
            localTmpValue !== undefined &&
            localTmpValue !== originalValue &&
            column.onUpdate
        ) {
            column.onUpdate(rowData.id, localTmpValue);
        }
    };

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const validationError = this.validateValue(newValue);

        // For select type, update and blur immediately after selection
        if (this.props.column.type === "select") {
            this.setState(
                {
                    localTmpValue: newValue,
                    localErrorMessage: validationError,
                    isEditing: false,
                },
                () => {
                    this.handleUpdate();
                },
            );
            return;
        }

        // For other input types, just update the value
        this.setState({
            localTmpValue: newValue,
            localErrorMessage: validationError,
        });
    };

    handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (this.props.column.editable) {
            if (e.key === "Enter" && !this.state.localErrorMessage) {
                this.setState({ isEditing: false });
                this.handleUpdate();
            } else if (e.key === "Escape") {
                // Revert changes or simply exit editing mode
                // For now, just exit, mirroring original implicit behavior
                const originalValue = getCellValue(
                    this.props.column,
                    this.props.rowData,
                );
                this.setState({
                    isEditing: false,
                    localTmpValue: originalValue, // Revert to original value on escape
                    localErrorMessage: this.validateValue(originalValue), // Re-validate original value
                });
            }
        }
    };

    handleInputBlur = () => {
        this.handleUpdate();
    };

    getCommonTextFieldProps = () => {
        return {
            inputRef: this.inputRef,
            onChange: this.handleInputChange,
            onBlur: this.handleInputBlur,
            onKeyDown: this.handleInputKeyDown,
            focused: this.state.isEditing,
            variant: "standard" as const,
            fullWidth: true,
            sx: this.props.inputStyle,
            className: this.state.localErrorMessage ? "error" : undefined,
            InputProps: {
                disableUnderline: true,
            },
            error: !!this.state.localErrorMessage,
            color: this.state.localErrorMessage
                ? ("error" as const)
                : ("primary" as const),
        };
    };

    renderCellContent = () => {
        const { column, rowData } = this.props;
        const { isEditing, localTmpValue, localErrorMessage } = this.state;
        const cellValue = getCellValue(column, rowData);

        if (!isEditing) {
            if (column.type === "select" && column.options) {
                const option = column.options.find(
                    (opt) => opt.value === cellValue,
                );
                return <span>{option?.label ?? cellValue}</span>;
            }

            if (column.type === "country") {
                const country = cellValue
                    ? countries.find((c) => c.code === cellValue)
                    : null;
                if (country) {
                    return (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Image
                                src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                alt=""
                                width={20}
                                height={15}
                                style={{ objectFit: "cover" }}
                                loading="lazy"
                            />
                            {this.props.countryStrings[country.code]}
                        </Box>
                    );
                }
                return String(cellValue ?? "");
            }

            return (
                <span
                    style={{
                        direction: column.type === "phone" ? "ltr" : "inherit",
                    }}
                >
                    {formatCellValue(cellValue, column.type)}
                </span>
            );
        }

        const commonProps = this.getCommonTextFieldProps();

        // Handle select type
        if (column.type === "select" && column.options) {
            return (
                <TextField
                    {...commonProps}
                    select
                    value={localTmpValue ?? ""}
                    slotProps={{
                        select: {
                            open: isEditing,
                            onClose: () => this.setState({ isEditing: false }),
                        },
                    }}
                >
                    {column.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            );
        }

        if (column.type === "country") {
            return (
                <Autocomplete
                    fullWidth
                    options={countries}
                    autoHighlight
                    value={
                        countries.find((c) => c.code === localTmpValue) ||
                        countries[0]
                    }
                    onChange={(_, newValue) => {
                        if (newValue) {
                            const validationError = this.validateValue(
                                newValue.code,
                            );
                            this.setState(
                                {
                                    localTmpValue: newValue.code,
                                    localErrorMessage: validationError,
                                    isEditing: false,
                                },
                                () => {
                                    this.handleUpdate();
                                },
                            );
                        }
                    }}
                    onBlur={this.handleInputBlur}
                    getOptionLabel={(option) =>
                        countryNameByCode(
                            this.props.countryStrings,
                            option.code,
                        )
                    }
                    renderOption={(
                        props: React.HTMLAttributes<HTMLLIElement> & {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            key: any;
                        },
                        option: CountryType,
                    ) => {
                        // key is extracted from props to prevent it from being passed to the DOM
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
                                {countryNameByCode(
                                    this.props.countryStrings,
                                    option.code,
                                )}
                            </Box>
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...commonProps}
                            {...params}
                            onBlur={this.handleInputBlur}
                            slotProps={{
                                htmlInput: {
                                    ...params.inputProps,
                                },
                            }}
                        />
                    )}
                />
            );
        }

        if (column.type === "phone") {
            return (
                <MuiTelInput
                    {...commonProps}
                    value={localTmpValue ?? ""}
                    //     onChange?: (value: string, info: MuiTelInputInfo) => void;
                    onChange={(value: string) => {
                        const validationError = this.validateValue(value);
                        this.setState({
                            localTmpValue: value,
                            localErrorMessage: validationError,
                        });
                    }}
                    onBlur={this.handleInputBlur}
                    onKeyDown={this.handleInputKeyDown}
                    langOfCountryName={"ar"}
                    defaultCountry={"EG"}
                    focusOnSelectCountry={true}
                    excludedCountries={["IL"]}
                    preferredCountries={preferredCountries}
                    fullWidth
                    error={localErrorMessage !== null}
                    helperText={localErrorMessage}
                />
            );
        }

        const inputValue =
            column.type === "date"
                ? formatInputValue(localTmpValue, column.type)
                : (localTmpValue ?? "");

        const inputElement = (
            <TextField
                {...commonProps}
                type={column.type === "date" ? "date" : "text"}
                value={inputValue}
            />
        );

        return (
            <Tooltip
                open={!!localErrorMessage}
                title={localErrorMessage ?? ""}
                arrow
                placement="bottom-start"
            >
                {inputElement}
            </Tooltip>
        );
    };

    render() {
        return (
            <TableColumnContext.Consumer>
                {(columnContextValue: TableColumnContextType | null) => {
                    if (!columnContextValue) return null; // Or some fallback UI

                    return (
                        <TableDataContext.Consumer>
                            {(
                                dataContextValue: TableDataContextType | null,
                            ) => {
                                if (!dataContextValue) return null; // Or some fallback UI

                                // Set context methods on instance for lifecycle methods to use
                                // This happens on every render but is safe.
                                this.dataContextGetEditingState =
                                    dataContextValue.getEditingState;
                                this.dataContextSetEditingState =
                                    dataContextValue.setEditingState;

                                // If componentDidMount hasn't run yet and we have the function,
                                // and state isn't initialized, try to initialize.
                                // This helps if initial render needs the state before cDM.
                                // However, setState should not be called directly in render.
                                // cDM is the correct place. This is more of a note.
                                if (
                                    !this.stateInitializedFromContext &&
                                    this.dataContextGetEditingState?.(
                                        this.props.rowData.id,
                                        this.props.column.id,
                                    )
                                ) {
                                    // Initial state will be set in componentDidMount
                                }

                                const { column, cellEditingStyle, cellStyle } =
                                    this.props;
                                const {
                                    pinnedColumns,
                                    pinnedLeftStyle,
                                    pinnedRightStyle,
                                    columnWidths,
                                } = columnContextValue;
                                const width = columnWidths[column.id];
                                const { isEditing } = this.state;

                                const effectiveCellStyle = isEditing
                                    ? {
                                          ...cellEditingStyle,
                                          width: `${width}px`,
                                      }
                                    : { ...cellStyle, width: `${width}px` };

                                const pinPosition = pinnedColumns[column.id];
                                const isPinnedLeft = pinPosition === "left";
                                const isPinnedRight = pinPosition === "right";

                                let cellStyleWithPin: CSSProperties = {
                                    ...effectiveCellStyle,
                                };
                                if (isPinnedLeft) {
                                    cellStyleWithPin = {
                                        ...effectiveCellStyle,
                                        ...pinnedLeftStyle,
                                    };
                                } else if (isPinnedRight) {
                                    cellStyleWithPin = {
                                        ...effectiveCellStyle,
                                        ...pinnedRightStyle,
                                    };
                                }

                                return (
                                    <td
                                        key={column.id}
                                        onDoubleClick={this.handleCellClick}
                                    >
                                        <div
                                            style={{
                                                ...cellStyleWithPin,
                                                position: "relative",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    direction:
                                                        column.type === "phone"
                                                            ? "ltr"
                                                            : "inherit",
                                                    textAlign:
                                                        column.type === "phone"
                                                            ? "left"
                                                            : "inherit",
                                                }}
                                            >
                                                {this.renderCellContent()}
                                            </div>
                                        </div>
                                    </td>
                                );
                            }}
                        </TableDataContext.Consumer>
                    );
                }}
            </TableColumnContext.Consumer>
        );
    }
}

// Wrap the component with translation HOC
const TranslatedDataCell = withTranslation(DataCell);

export default TranslatedDataCell;
