import type React from "react";
import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import SortIcon from "@mui/icons-material/Sort";
import { ListItemButton, Typography } from "@mui/material";
import EmptyStateIllustration from "@/components/common/EmptyStateIllustration";
import EditableTypography from "@/components/input/EditableTypography";
import { Boxes, EditIcon } from "lucide-react";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import useAppTranslation from "@/locale/useAppTranslation";
import { TemplateCategory } from "@/graphql/generated/types";
import { getSerializableCategories } from "@/utils/template/template-category-mapper";

const TemplateCategoryManagementCategoryPane: React.FC = () => {
    const { theme } = useAppTheme();
    const strings = useAppTranslation("templateCategoryTranslations");

    const {
        regularCategories,
        currentCategory: selectedCategory,
        trySelectCategory,
        addCategory,
        updateCategory,
        deleteCategory,
    } = useTemplateCategoryManagement();

    useEffect(() => {
        const s = getSerializableCategories(regularCategories);
        console.log("TemplateCategoryManagementCategoryPane categories", s);
    }, [regularCategories]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    // const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    // const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [editCategoryName, setEditCategoryName] = useState("");
    const [editError, setEditError] = useState("");
    const [tempCategory, setTempCategory] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const newCategoryRef = useRef<HTMLLIElement>(null);

    const validateCategoryName = (name: string) => {
        if (name.length < 3) return strings.nameTooShort;
        if (name.length > 255) return strings.nameTooLong;
        return "";
    };

    const handleCategoryClick = (category: TemplateCategory) => {
        trySelectCategory(category).then((r) => r);
    };

    const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMoreClose = () => {
        setAnchorEl(null);
    };

    const handleAddNewCategory = () => {
        setTempCategory({ id: "temp-" + Date.now(), name: "" });
        // Schedule scroll after render
        setTimeout(() => {
            newCategoryRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 100);
    };

    const handleNewCategoryCancel = () => {
        setTempCategory(null);
    };

    const handleNewCategorySave = async (name: string) => {
        const error = validateCategoryName(name);
        if (error) {
            return error;
        }

        try {
            addCategory(name);
            setTempCategory(null);
            return "";
        } catch (error: any) {
            return error.message || strings.categoryAddFailed;
        }
    };

    // const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setSortAnchorEl(event.currentTarget);
    //     setIsSortMenuOpen(true);
    // };

    // const handleSortClose = () => {
    //     setSortAnchorEl(null);
    //     setIsSortMenuOpen(false);
    // };

    // const handleSort = (sortBy: "name" | "id", order: "asc" | "desc") => {
    //     sortCategories(sortBy, order);
    //     handleSortClose();
    // };

    const handleEditCategory = () => {
        const error = validateCategoryName(editCategoryName);
        if (error) {
            setEditError(error);
            return;
        }
        if (selectedCategory) {
            updateCategory(selectedCategory.id, editCategoryName);
            setEditCategoryName("");
            setIsEditDialogOpen(false);
        }
    };

    const handleMoveCategory = () => {
        // todo:
        // moveCategory(categoryToMove, newParentId);
        setIsMoveDialogOpen(false);
    };

    const handleCategoryNameEdit = async (
        categoryId: string,
        newName: string,
    ) => {
        updateCategory(categoryId, newName);
    };

    const renderCategory = (category: (typeof regularCategories)[0]) => (
        <ListItem
            disablePadding
            key={category.id}
            sx={{
                backgroundColor:
                    category.id === selectedCategory?.id
                        ? theme.palette.action.focus
                        : "inherit",
            }}
        >
            <ListItemButton
                selected={category.id === selectedCategory?.id}
                onClick={() => handleCategoryClick(category)}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        alignItems: "center",
                    }}
                >
                    <Boxes />
                    <EditableTypography
                        typography={{
                            variant: "body1",
                        }}
                        textField={{
                            size: "small",
                            variant: "standard",
                            sx: { minWidth: 150 },
                        }}
                        value={category.name}
                        onSave={(newValue) =>
                            handleCategoryNameEdit(category.id, newValue)
                        }
                        isValid={validateCategoryName}
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }} />
                {/* delete */}
                <Tooltip title="Delete">
                    <span>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteCategory(category.id);
                            }}
                            color="error"
                            disabled={
                                !!category.special_type ||
                                (category.templates?.length ?? 0) > 0
                            }
                        >
                            <DeleteIcon />
                        </IconButton>
                    </span>
                </Tooltip>

                {/* edit menu */}
                <Tooltip title="More">
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleMoreClick(e);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </ListItemButton>
        </ListItem>
    );

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                px: 1,
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: theme.palette.divider,
                }}
            >
                {strings.categories}
            </Typography>
            {!Array.isArray(regularCategories) ? (
                <EmptyStateIllustration message={strings.noCategories} />
            ) : regularCategories.length === 0 && !tempCategory ? (
                <EmptyStateIllustration message={strings.noCategories} />
            ) : (
                <List
                    ref={listRef}
                    sx={{
                        flexGrow: 1,
                        overflow: "auto",
                        height: "80%",
                    }}
                >
                    {regularCategories.map(renderCategory)}
                    {tempCategory && (
                        <ListItem
                            ref={newCategoryRef}
                            disablePadding
                            key={tempCategory.id}
                        >
                            <ListItemButton
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    width: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 1,
                                        alignItems: "center",
                                    }}
                                >
                                    <Boxes />
                                    <EditableTypography
                                        typography={{
                                            variant: "body1",
                                        }}
                                        textField={{
                                            size: "small",
                                            variant: "standard",
                                            sx: { minWidth: 150 },
                                        }}
                                        value=""
                                        onSave={handleNewCategorySave}
                                        onCancel={handleNewCategoryCancel}
                                        isValid={validateCategoryName}
                                        startEditing={true}
                                    />
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            )}

            {/* bottom action bar */}
            <Box
                sx={{
                    p: 2,
                    borderTop: "1px solid",
                    borderColor: theme.palette.divider,
                    display: "flex",
                }}
            >
                {/* Add root Category */}
                <Button
                    variant="contained"
                    onClick={handleAddNewCategory}
                    sx={{ mr: 1 }}
                    disabled={!!tempCategory}
                >
                    {strings.addCategory}
                </Button>
                {/* sort categories */}
                {/* <Button
                    variant="outlined"
                    startIcon={<SortIcon />}
                    onClick={handleSortClick}
                    disabled={!regularCategories?.length}
                >
                    {strings.sort}
                </Button> */}
                {/* total count */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Typography>{regularCategories.length}</Typography>
                </Box>
            </Box>
            {/* more menu*/}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMoreClose}
            >
                <MenuItem
                    onClick={() => {
                        setEditCategoryName(
                            regularCategories.find(
                                (cat) => cat.id === selectedCategory?.id,
                            )?.name ?? "",
                        );
                        handleMoreClose();
                        setIsEditDialogOpen(true);
                    }}
                >
                    {strings.edit}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setIsMoveDialogOpen(true);
                        handleMoreClose();
                    }}
                >
                    {strings.move}
                </MenuItem>
            </Menu>

            {/* edit category dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
            >
                <DialogTitle>{strings.edit}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={strings.name}
                        fullWidth
                        value={editCategoryName}
                        onChange={(e) => {
                            setEditCategoryName(e.target.value);
                            setEditError("");
                        }}
                        error={!!editError}
                        helperText={editError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditDialogOpen(false)}>
                        {strings.cancel}
                    </Button>
                    <Button onClick={handleEditCategory}>{strings.save}</Button>
                </DialogActions>
            </Dialog>

            {/* move category dialog */}
            <Dialog
                open={isMoveDialogOpen}
                onClose={() => setIsMoveDialogOpen(false)}
            >
                <DialogTitle>{strings.move}</DialogTitle>
                <DialogContent>
                    {/* Implement a dropdown or list to select the new parent category */}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Parent Category ID"
                        fullWidth
                        onChange={() => handleMoveCategory()}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsMoveDialogOpen(false)}>
                        {strings.cancel}
                    </Button>
                    <Button onClick={() => handleMoveCategory()}>
                        {strings.move}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* sort menu */}
            {/* <Menu
                anchorEl={sortAnchorEl}
                open={isSortMenuOpen}
                onClose={handleSortClose}
            >
                <MenuItem onClick={() => handleSort("name", "asc")}>
                    {strings.nameAsc}
                </MenuItem>
                <MenuItem onClick={() => handleSort("name", "desc")}>
                    {strings.nameDesc}
                </MenuItem>
                <MenuItem onClick={() => handleSort("id", "asc")}>
                    {strings.idAsc}
                </MenuItem>
                <MenuItem onClick={() => handleSort("id", "desc")}>
                    {strings.idDesc}
                </MenuItem>
            </Menu> */}
        </Box>
    );
};
export default TemplateCategoryManagementCategoryPane;
