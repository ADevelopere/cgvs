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
    const {
        deleteTemplateVariable,
    } = useTemplateVariableManagement();
    const { template } = useTemplateManagement();

    const handleVariableClick = useCallback(
        (variable: TemplateVariable) => {
            onOpenModal(variable);
        },
        [onOpenModal],
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
        <List sx={{ 
            width: "100%", 
            bgcolor: "background.paper", 
            flexGrow: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
        }}>
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
                            onClick={() =>
                                handleVariableClick(variable)
                            }
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

const Footer: FC<FooterProps> = ({ onOpenModal }) => {
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
                    borderTop: "1px solid",
                    borderColor: "divider",
                    pt: 2,
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
    const [modalOpen, setModalOpen] = useState(false);
    const [editingVariableID, setEditingVariableID] = useState<string | undefined>(undefined);
    const [type, setType] = useState<TemplateVariableType>("text");

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
                    height: "100%",
                    maxWidth: "800px",
                    mx: "auto",
                    p: 2,
                }}
                id="template-variable-management-list"
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                    }}
                >
                    <Content onOpenModal={handleEdit} />
                </Box>
                <Box
                    sx={{
                        minHeight: "max-content",
                    }}
                >
                    <Footer onOpenModal={handleCreate} />
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

export default TemplateVariablesList;
