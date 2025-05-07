import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Boxes, EditIcon } from "lucide-react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditableTypography from "@/components/input/EditableTypography";
import { TemplateCategory } from "@/contexts/template/template.types";

interface CategoryItemProps {
    category: TemplateCategory; // The category to render
    onCategoryClick: (category: TemplateCategory) => void; // Callback for when a category is clicked
    onEditCategory: (category: TemplateCategory) => void; // Callback for when the edit action is triggered
    onDeleteCategory: (categoryId: string) => void; // Callback for when the delete action is triggered
    onAddSubcategory: (parentCategory: TemplateCategory) => void; // Callback for adding a subcategory
    isSelected: boolean; // Whether the category is currently selected
    isEditable: boolean; // Whether the category name is editable
    validateCategoryName: (name: string) => string; // Validation function for category names
}

const CategoryItem: React.FC<CategoryItemProps> = ({
    category,
    onCategoryClick,
    onEditCategory,
    onDeleteCategory,
    onAddSubcategory,
    isSelected,
    isEditable,
    validateCategoryName,
}) => {
    const handleSaveCategoryName = (newName: string) => {
        const validationError = validateCategoryName(newName);
        if (validationError) {
            console.error(validationError); // Handle validation error if needed
            return;
        }
        onEditCategory({ ...category, name: newName });
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px",
                backgroundColor: isSelected ? "#f0f0f0" : "transparent",
                borderRadius: "4px",
                cursor: "pointer",
            }}
            onClick={() => onCategoryClick(category)}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                    onSave={handleSaveCategoryName}
                    isValid={validateCategoryName}
                    disabled={!isEditable}
                />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Tooltip title="Add Subcategory">
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddSubcategory(category);
                        }}
                        size="small"
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCategory(category.id);
                        }}
                        color="error"
                        size="small"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
};

export default CategoryItem;