import React from "react";
import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { Check, Clear } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import {
    TextFilterOperation,
    NumberFilterOperation,
    DateFilterOperation,
} from "@/types/filters";

import {
    textFilterOperationLabels,
    numberFilterOperationLabels,
    dateFilterOperationLabels,
    operationRequiresValue,
} from "@/constants/filter-labels";
import { useTableDataContext } from "../Table/TableDataContext";
import { useTableColumnContext } from "../Table/TableColumnContext";
import { useTableContext } from "../Table/TableContext";
import { useTableStyles } from "@/styles";

const InlineFilterRow: React.FC = () => {
    const theme = useTheme();
    const { serverFilterUi } = useTableContext();
    const { thStyle } = useTableStyles();
    const {
        allColumns: columns,
        pinnedColumns,
        pinnedLeftStyle,
        pinnedRightStyle,
    } = useTableColumnContext();
    const {
        applyInlineFilter,
        serverOperationMode,
        getActiveServerFilter,

        updateInlineFilterOperation,
        updateInlineFilterValue,
        clearInlineFilter,
        updateInlineDateFilterValue,
        inlineFilterOperations,
        inlineFilterValues,
    } = useTableDataContext();

    // Only render if we're in server mode with inlineHeaderRow UI
    if (!serverOperationMode || serverFilterUi !== "inlineHeaderRow") {
        return null;
    }

    return (
        <tr className="inline-filter-row">
            {columns.map((column) => {
                // Determine if this column is pinned
                const pinPosition = pinnedColumns[column.id];

                // Apply appropriate styles based on pin position
                let cellStyleWithPin = { ...thStyle } as const;
                if (pinPosition === "left") {
                    cellStyleWithPin = {
                        ...thStyle,
                        ...(pinnedLeftStyle as typeof thStyle),
                    };
                } else if (pinPosition === "right") {
                    cellStyleWithPin = {
                        ...thStyle,
                        ...(pinnedRightStyle as typeof thStyle),
                    };
                }

                // Only render filter controls for server-filterable columns
                if (!column.serverFilterable) {
                    return <th key={column.id} style={cellStyleWithPin}></th>;
                }

                const activeFilter = getActiveServerFilter(column.id);

                return (
                    <th
                        key={column.id}
                        style={{
                            ...cellStyleWithPin,
                            padding: theme.spacing(1),
                        }}
                    >
                        {column.type === "text" && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                <FormControl size="small" fullWidth>
                                    <InputLabel
                                        id={`${column.id}-operation-label`}
                                    >
                                        Operation
                                    </InputLabel>
                                    <Select
                                        labelId={`${column.id}-operation-label`}
                                        value={
                                            inlineFilterOperations[column.id] ||
                                            TextFilterOperation.CONTAINS
                                        }
                                        onChange={(e) =>
                                            updateInlineFilterOperation(
                                                column.id,
                                                e.target.value,
                                            )
                                        }
                                        label="Operation"
                                        size="small"
                                    >
                                        {Object.values(TextFilterOperation).map(
                                            (op) => (
                                                <MenuItem key={op} value={op}>
                                                    {
                                                        textFilterOperationLabels[
                                                            op
                                                        ]
                                                    }
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>

                                {(!inlineFilterOperations[column.id] ||
                                    operationRequiresValue(
                                        inlineFilterOperations[
                                            column.id
                                        ] as TextFilterOperation,
                                    )) && (
                                    <TextField
                                        size="small"
                                        placeholder={`Filter ${column.label}...`}
                                        value={
                                            inlineFilterValues[column.id] || ""
                                        }
                                        onChange={(e) =>
                                            updateInlineFilterValue(
                                                column.id,
                                                e.target.value,
                                            )
                                        }
                                        fullWidth
                                    />
                                )}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mt: 1,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            clearInlineFilter(column.id)
                                        }
                                        disabled={!activeFilter}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            applyInlineFilter(
                                                column.id,
                                                column.type,
                                            )
                                        }
                                    >
                                        <Check fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        )}

                        {column.type === "number" && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                <FormControl size="small" fullWidth>
                                    <InputLabel
                                        id={`${column.id}-operation-label`}
                                    >
                                        Operation
                                    </InputLabel>
                                    <Select
                                        labelId={`${column.id}-operation-label`}
                                        value={
                                            inlineFilterOperations[column.id] ||
                                            NumberFilterOperation.EQUALS
                                        }
                                        onChange={(e) =>
                                            updateInlineFilterOperation(
                                                column.id,
                                                e.target.value,
                                            )
                                        }
                                        label="Operation"
                                        size="small"
                                    >
                                        {Object.values(
                                            NumberFilterOperation,
                                        ).map((op) => (
                                            <MenuItem key={op} value={op}>
                                                {
                                                    numberFilterOperationLabels[
                                                        op
                                                    ]
                                                }
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {(!inlineFilterOperations[column.id] ||
                                    operationRequiresValue(
                                        inlineFilterOperations[
                                            column.id
                                        ] as NumberFilterOperation,
                                    )) && (
                                    <TextField
                                        type="number"
                                        size="small"
                                        placeholder={`Filter ${column.label}...`}
                                        value={
                                            inlineFilterValues[column.id] || ""
                                        }
                                        onChange={(e) =>
                                            updateInlineFilterValue(
                                                column.id,
                                                e.target.value,
                                            )
                                        }
                                        fullWidth
                                    />
                                )}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mt: 1,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            clearInlineFilter(column.id)
                                        }
                                        disabled={!activeFilter}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            applyInlineFilter(
                                                column.id,
                                                column.type,
                                            )
                                        }
                                    >
                                        <Check fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        )}

                        {column.type === "date" && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                <FormControl size="small" fullWidth>
                                    <InputLabel
                                        id={`${column.id}-operation-label`}
                                    >
                                        Operation
                                    </InputLabel>
                                    <Select
                                        labelId={`${column.id}-operation-label`}
                                        value={
                                            inlineFilterOperations[column.id] ||
                                            DateFilterOperation.BETWEEN
                                        }
                                        onChange={(e) =>
                                            updateInlineFilterOperation(
                                                column.id,
                                                e.target.value,
                                            )
                                        }
                                        label="Operation"
                                        size="small"
                                    >
                                        {Object.values(DateFilterOperation).map(
                                            (op) => (
                                                <MenuItem key={op} value={op}>
                                                    {
                                                        dateFilterOperationLabels[
                                                            op
                                                        ]
                                                    }
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>

                                {(!inlineFilterOperations[column.id] ||
                                    inlineFilterOperations[column.id] ===
                                        DateFilterOperation.BETWEEN) && (
                                    <>
                                        <TextField
                                            type="date"
                                            size="small"
                                            label="From"
                                            InputLabelProps={{ shrink: true }}
                                            value={
                                                inlineFilterValues[
                                                    `${column.id}_from`
                                                ] || ""
                                            }
                                            onChange={(e) =>
                                                updateInlineDateFilterValue(
                                                    column.id,
                                                    "from",
                                                    e.target.value,
                                                )
                                            }
                                            fullWidth
                                        />
                                        <TextField
                                            type="date"
                                            size="small"
                                            label="To"
                                            InputLabelProps={{ shrink: true }}
                                            value={
                                                inlineFilterValues[
                                                    `${column.id}_to`
                                                ] || ""
                                            }
                                            onChange={(e) =>
                                                updateInlineDateFilterValue(
                                                    column.id,
                                                    "to",
                                                    e.target.value,
                                                )
                                            }
                                            fullWidth
                                        />
                                    </>
                                )}

                                {inlineFilterOperations[column.id] &&
                                    inlineFilterOperations[column.id] !==
                                        DateFilterOperation.BETWEEN &&
                                    inlineFilterOperations[column.id] !==
                                        DateFilterOperation.IS_EMPTY &&
                                    inlineFilterOperations[column.id] !==
                                        DateFilterOperation.IS_NOT_EMPTY && (
                                        <TextField
                                            type="date"
                                            size="small"
                                            label="Date"
                                            InputLabelProps={{ shrink: true }}
                                            value={
                                                inlineFilterValues[
                                                    `${column.id}_from`
                                                ] || ""
                                            }
                                            onChange={(e) =>
                                                updateInlineDateFilterValue(
                                                    column.id,
                                                    "from",
                                                    e.target.value,
                                                )
                                            }
                                            fullWidth
                                        />
                                    )}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mt: 1,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            clearInlineFilter(column.id)
                                        }
                                        disabled={!activeFilter}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            applyInlineFilter(
                                                column.id,
                                                column.type,
                                            )
                                        }
                                    >
                                        <Check fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        )}
                    </th>
                );
            })}
        </tr>
    );
};

export default InlineFilterRow;
