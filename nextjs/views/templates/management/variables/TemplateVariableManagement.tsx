"use client";

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
    TemplateVariable,
    TemplateVariableType,
} from "@/graphql/generated/types";
import TemplateVariableModal from "./TemplateVariableModal";

interface ContentProps {
    onOpenModal: (variable: TemplateVariable) => void;
}

const Content: FC<ContentProps> = ({ onOpenModal }) => {
    const { deleteTemplateVariable } = useTemplateVariableManagement();
    const { template } = useTemplateManagement();

    console.log(
        "Template Variables:",
        JSON.stringify(template?.variables?.map((v) => v.name + v.order)),
    );

    const handleVariableClick = useCallback(
        (variable: TemplateVariable) => {
            onOpenModal(variable);
        },
        [onOpenModal],
    );

    const handleDeleteClick = useCallback(
        async (id: number) => {
            if (
                window.confirm("Are you sure you want to delete this variable?")
            ) {
                await deleteTemplateVariable(id);
            }
        },
        [deleteTemplateVariable],
    );

    if (!template?.variables || template.variables.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
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
        <List
            sx={{
                width: "100%",
                bgcolor: "background.paper",
                flexGrow: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
            }}
        >
            {template.variables.map((variable) => {
                const type = variable.type;

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
                            onClick={() => handleVariableClick(variable)}
                        >
                            <ListItemText
                                primary={variable.name}
                                secondary={type}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};

interface FooterProps {
    onOpenModal: (type: TemplateVariableType) => void;
}

const Header: FC<FooterProps> = ({ onOpenModal }) => {
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
        handleMenuClose();
        onOpenModal(type);
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
                    pb: 2,
                    mt: 2,
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
                <MenuItem onClick={() => handleVariableTypeSelect("TEXT")}>
                    Text Variable
                </MenuItem>
                <MenuItem onClick={() => handleVariableTypeSelect("NUMBER")}>
                    Number Variable
                </MenuItem>
                <MenuItem onClick={() => handleVariableTypeSelect("DATE")}>
                    Date Variable
                </MenuItem>
                <MenuItem onClick={() => handleVariableTypeSelect("SELECT")}>
                    Select Variable
                </MenuItem>
            </Menu>
        </>
    );
};

const TemplateVariableManagement: FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingVariableID, setEditingVariableID] = useState<
        number | undefined
    >(undefined);
    const [type, setType] = useState<TemplateVariableType>("TEXT");

    const handleEdit = (variable: TemplateVariable) => {
        setEditingVariableID(variable.id);
        setModalOpen(true);
        setType(variable.type);
    };

    const handleCreate = (type: TemplateVariableType) => {
        setEditingVariableID(undefined);
        setModalOpen(true);
        setType(type);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingVariableID(undefined);
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mx: "auto",
                    height: "100%",
                }}
            >
                <Header onOpenModal={handleCreate} />
                <Box
                    sx={{
                        overflow: "auto",
                        flexGrow: 1,
                        overflowY: "auto",
                        maxHeight: `calc(100vh - 250px)`,
                        minHeight: `calc(100vh - 250px)`,
                        px: 2,
                    }}
                >
                    <Content onOpenModal={handleEdit} />
                </Box>
            </Box>

            <TemplateVariableModal
                open={modalOpen}
                onClose={handleCloseModal}
                editingVariableID={editingVariableID}
                type={type}
            />
        </>
    );
};

export default TemplateVariableManagement;
