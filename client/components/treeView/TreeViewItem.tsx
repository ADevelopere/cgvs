import Typography from "@mui/material/Typography";
import type React from "react";
import {
    BaseTreeItem,
    TreeViewItemRenderer,
} from "@/client/components/treeView/TreeView";

interface TreeViewItemProps<T extends BaseTreeItem> {
    item: T;
    isSelected: boolean;
    isExpanded: boolean;
    itemRenderer?: TreeViewItemRenderer<T>;
    labelKey: string;
}

export default function TreeViewItem<T extends BaseTreeItem>({
    item,
    isSelected,
    isExpanded,
    itemRenderer,
    labelKey,
}: Readonly<TreeViewItemProps<T>>) {
    if (itemRenderer) {
        return itemRenderer({ item, isSelected, isExpanded });
    }

    const itemLabel = item[labelKey] || "";
    return (
        <Typography
            variant="body2"
            noWrap
            sx={{
                fontWeight: isSelected ? 500 : 400,
                minWidth: "max-content",
                textWrap: "balance",
            }}
        >
            {itemLabel}
        </Typography>
    );
}
