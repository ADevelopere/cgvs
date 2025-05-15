import { FC, useCallback, useState } from "react";
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { useTemplateVariableManagement } from "@/contexts/templateVariable/TemplateVariableManagementContext";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import type {
    TemplateSelectVariable,
    TemplateVariable,
    TemplateVariableType,
} from "@/graphql/generated/types";
import {
    isDateVariableDifferent,
    isNumberVariableDifferent,
    isSelectVariableDifferent,
    isTextVariableDifferent,
} from "@/utils/templateVariable/templateVariable";

const Content: FC = () => {
    const {
        getTemporaryValue,
        deleteTemplateVariable,
        trySetEditMode,
        setTemporaryValue,
    } = useTemplateVariableManagement();
    const { template } = useTemplateManagement();

    const handleVariableClick = useCallback(
        (id: string, variable: TemplateVariable) => {
            console.log("Variable clicked:", variable);

            setTemporaryValue(id, variable);
            trySetEditMode(id, variable.type);
        },
        [trySetEditMode, setTemporaryValue, trySetEditMode],
    );

    const handleDeleteClick = useCallback(
        async (id: string) => {
            if (
                window.confirm("Are you sure you want to delete this variable?")
            ) {
                await deleteTemplateVariable(id);
            }
        },
        [deleteTemplateVariable],
    );

    const hasChanged = useCallback(
        (variable: TemplateVariable) => {
            const temp = getTemporaryValue(variable.id);
            if (!temp) return false;
            switch (variable.type) {
                case "text":
                    return isTextVariableDifferent(variable, temp);
                case "number":
                    return isNumberVariableDifferent(variable, temp);
                case "date":
                    return isDateVariableDifferent(variable, temp);
                case "select":
                    return isSelectVariableDifferent(
                        variable as TemplateSelectVariable,
                        temp,
                    );
                default:
                    return false;
            }
        },
        [getTemporaryValue],
    );

    if (!template?.variables || template.variables.length === 0) {
        return (
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Typography>
                    No variables found. Create one by clicking the create
                    button.
                </Typography>
            </Box>
        );
    }

    return (
        <List sx={{ width: "100%", bgcolor: "background.paper", flexGrow: 1 }}>
            {template.variables.map((variable) => {
                const type = variable.type;
                const hasUnsavedChanges = hasChanged(variable);

                return (
                    <ListItem
                        key={variable.id}
                        disablePadding
                        secondaryAction={
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(variable.id);
                                }}
                            >
                                <Trash2 size={18} />
                            </IconButton>
                        }
                    >
                        <ListItemButton
                            onClick={() =>
                                handleVariableClick(variable.id, variable)
                            }
                        >
                            <ListItemText
                                primary={
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Typography>{variable.name}</Typography>
                                        {hasUnsavedChanges && (
                                            <Typography
                                                component="span"
                                                sx={{
                                                    bgcolor: "warning.main",
                                                    color: "warning.contrastText",
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: "0.75rem",
                                                }}
                                            >
                                                Unsaved
                                            </Typography>
                                        )}
                                    </Box>
                                }
                                secondary={type}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};

const Footer: FC = () => {
    const { trySetCreateMode } = useTemplateVariableManagement();

    // Popover menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Handlers
    const handleCreateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleVariableTypeSelect = (type: TemplateVariableType) => {
        trySetCreateMode(type);
        handleMenuClose();
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "end",
                    width: "100%",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    pb: 1,
                }}
            >
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<Plus size={16} />}
                    onClick={handleCreateClick}
                >
                    Create Variable
                </Button>
            </Box>

            {/* popover menu */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleVariableTypeSelect("text")}>
                    Text Variable
                </MenuItem>
                <MenuItem onClick={() => handleVariableTypeSelect("number")}>
                    Number Variable
                </MenuItem>
                <MenuItem onClick={() => handleVariableTypeSelect("date")}>
                    Date Variable
                </MenuItem>
                <MenuItem onClick={() => handleVariableTypeSelect("select")}>
                    Select Variable
                </MenuItem>
            </Menu>
        </>
    );
};

const TemplateVariablesList: FC = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                height: "100%",
                justifyContent: "space-between",
                paddingInlineEnd: 1,
            }}
            id="template-variable-management-list"
        >
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                }}
            >
                <Content />
            </Box>
            <Box
                sx={{
                    minHeight: "max-content",
                }}
            >
                <Footer />
            </Box>
        </Box>
    );
};

export default TemplateVariablesList;
