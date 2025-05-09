import {
    Popover,
    Box,
    Typography,
    TextField,
    Stack,
    IconButton,
    Tooltip,
    Button,
    Select,
    MenuItem,
} from "@mui/material";
import {
    FilterList as FilterListIcon,
    Clear as ClearIcon,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useStudentManagement } from "@/contexts/student/StudentManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";
import StudentTranslations from "@/locale/components/Student";

interface StudentTableFilterProps {
    anchorEl: HTMLButtonElement | null;
    columnId: string;
    onClose: () => void;
}

// export type StudentsQueryVariables = Exact<{
//   birth_from?: InputMaybe<Scalars['DateTime']['input']>;
//   birth_to?: InputMaybe<Scalars['DateTime']['input']>;
//   created_from?: InputMaybe<Scalars['DateTime']['input']>;
//   created_to?: InputMaybe<Scalars['DateTime']['input']>;
//   email?: InputMaybe<Scalars['String']['input']>;
//   first: Scalars['Int']['input'];
//   gender?: InputMaybe<StudentGender>;
//   name?: InputMaybe<Scalars['String']['input']>;
//   nationality?: InputMaybe<CountryCode>;
//   orderBy?: InputMaybe<Array<OrderByClause> | OrderByClause>;
//   page?: InputMaybe<Scalars['Int']['input']>;
//   phone_number?: InputMaybe<Scalars['String']['input']>;
// }>;

// setQueryParams: (params: Partial<StudentsQueryVariables>) => void;

// for name and email
const StringFilter: React.FC<{
    value: string;
    onChange: (value: string) => void;
    label: string;
}> = ({ value, onChange, label }) => {
    return (
        <TextField
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
        />
    );
};

const DateFilter: React.FC<{
    value: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
    label: string;
}> = ({ value, onFromChange, onToChange, label }) => {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <TextField
                label={label + " " + "from"}
                value={value}
                onChange={(e) => onFromChange(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                type="date"
            />
            <TextField
                label={label + " " + "to"}
                value={value}
                onChange={(e) => onToChange(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                type="date"
            />
        </Stack>
    );
};

const GenderFilter: React.FC<{
    value: string;
    onChange: (value: string) => void;
    label: string;
}> = ({ value, onChange, label }) => {
    return (
        <Select
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
        >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
        </Select>
    );
};

export default function StudentTableFilter({
    anchorEl,
    columnId,
    onClose,
}: StudentTableFilterProps) {
    const strings = useAppTranslation("studentTranslations");

    const [filterValue, setFilterValue] = useState<string>("");
    const { setQueryParams } = useStudentManagement();

    const [filterByText, setFilterByText] = useState<string>("");
    useEffect(() => {
        if (strings && columnId) {
            setFilterByText(strings[columnId] || columnId);
        }
    }, [columnId, strings]);

    // Apply filter
    // const applyFilter = () => {
    //     if (columnId && filterValue) {
    //         setQueryParams({ filter: { [columnId]: filterValue } });
    //         onClose();
    //     }
    // };

    // Apply filter
    const applyFilter = () => {
        if (!columnId || !filterValue) return;
        
        if (columnId === 'birth_date' || columnId === 'created_at') {
            // Date fields are handled directly in the DateFilter component
            onClose();
            return;
        }

        setQueryParams({ [columnId]: filterValue });
        onClose();
    };

    const clearFilter = () => {
        setFilterValue("");
        if (columnId === 'birth_date' || columnId === 'created_at') {
            // For date filters, we need to remove both from and to parameters
            setQueryParams({
                [`${columnId}_from`]: undefined,
                [`${columnId}_to`]: undefined
            });
        } else {
            // For other filters, remove the parameter by setting it to undefined
            setQueryParams({ [columnId]: undefined });
        }
        onClose();
    };

    const renderFilterInput = () => {
        switch (columnId) {
            case "name":
            case "email":
            case "phone_number":
                return (
                    <StringFilter
                        value={filterValue}
                        onChange={setFilterValue}
                        label={filterByText}
                    />
                );
            case "birth_date":
            case "created_at":
                return (
                    <DateFilter
                        value={filterValue}
                        onFromChange={(value) =>
                            setQueryParams({ [`${columnId}_from`]: value })
                        }
                        onToChange={(value) =>
                            setQueryParams({ [`${columnId}_to`]: value })
                        }
                        label={filterByText}
                    />
                );
            case "gender":
                return (
                    <GenderFilter
                        value={filterValue}
                        onChange={setFilterValue}
                        label={filterByText}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
        >
            <Box
                sx={{
                    p: 1,
                    width: 250,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                {/* filter header */}
                <Typography variant="subtitle2" sx={{ px: 1 }}>
                    {strings?.filterBy} {filterByText}
                </Typography>

                {/* filter input */}
                <Box sx={{ px: 1 }}>
                    {renderFilterInput()}
                </Box>

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {/* button that will clear the filter, using mui button, contains text followed by icon */}
                    <Button
                        size="small"
                        color="error"
                        onClick={clearFilter}
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <ClearIcon />
                        {strings?.clearFilter}
                    </Button>

                    <Box sx={{ flexGrow: 1 }} />

                    <Tooltip title={strings?.filter} arrow>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={applyFilter}
                        >
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
        </Popover>
    );
}
