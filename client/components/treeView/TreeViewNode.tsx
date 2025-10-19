import type React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  BaseTreeItem,
  TreeViewItemRenderer,
} from "@/client/components/treeView/TreeView";
import TreeViewItem from "@/client/components/treeView/TreeViewItem";

interface TreeViewNodeProps<T extends BaseTreeItem> {
  items: T[];
  level?: number;
  childrenKey: string;
  selectedItemId?: string;
  itemHeight?: number;
  onSelectItem?: (item: T) => void;
  toggleExpand: (item: T, event: React.MouseEvent) => void;
  isRtl: boolean;
  onHoverItem?: (item: T) => void;
  expandedItems: Set<string | number>;
  itemRenderer?: TreeViewItemRenderer<T>;
  labelKey: string;
  loadingItems?: Set<string | number>;
}

export default function TreeViewNode<T extends BaseTreeItem>({
  items,
  level = 0,
  childrenKey,
  selectedItemId,
  itemHeight,
  onSelectItem,
  toggleExpand,
  isRtl,
  onHoverItem,
  expandedItems,
  itemRenderer,
  labelKey,
  loadingItems,
}: Readonly<TreeViewNodeProps<T>>) {
  return (
    <>
      {items.map(item => {
        const children = item[childrenKey] as T[] | undefined;
        const hasChildren = children && children.length > 0;
        const isExpanded = expandedItems.has(item.id);
        const isSelected = item.id === selectedItemId;
        const isLoading = loadingItems?.has(item.id) || false;

        return (
          <Box key={item.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: item.disabled ? "default" : "pointer",
                opacity: item.disabled ? 0.5 : 1,
                pointerEvents: item.disabled ? "none" : "auto",
                paddingInlineStart: `${level * 20 + (!hasChildren ? 10 : 0)}px`,
                height: `${itemHeight}px`,
                borderRadius: 2,
                backgroundColor: isSelected
                  ? item.selectedColor || "rgba(25, 118, 210, 0.08)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: item.disabled
                    ? "transparent"
                    : isSelected
                      ? item.selectedColor || "rgba(25, 118, 210, 0.12)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
              onClick={() => !item.disabled && onSelectItem?.(item)}
              onMouseOver={() => onHoverItem?.(item)}
            >
              {hasChildren && (
                <IconButton
                  size="small"
                  onClick={e => toggleExpand(item, e)}
                  disabled={isLoading}
                  sx={{
                    padding: "4px",
                    marginRight: "4px",
                    transform: isExpanded
                      ? isRtl
                        ? "rotate(-90deg)"
                        : "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.15s ease-in-out",
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} />
                  ) : isRtl ? (
                    <ChevronLeftIcon fontSize="medium" />
                  ) : (
                    <ChevronRightIcon fontSize="medium" />
                  )}
                </IconButton>
              )}
              {!hasChildren && <Box sx={{ width: 26 }} />}

              <TreeViewItem
                item={item}
                isSelected={isSelected}
                isExpanded={isExpanded}
                itemRenderer={itemRenderer}
                labelKey={labelKey}
              />
            </Box>

            {hasChildren && isExpanded && (
              <Box>
                <TreeViewNode
                  items={children}
                  level={level + 1}
                  childrenKey={childrenKey}
                  selectedItemId={selectedItemId}
                  itemHeight={itemHeight}
                  onSelectItem={onSelectItem}
                  toggleExpand={toggleExpand}
                  isRtl={isRtl}
                  onHoverItem={onHoverItem}
                  expandedItems={expandedItems}
                  itemRenderer={itemRenderer}
                  labelKey={labelKey}
                  loadingItems={loadingItems}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </>
  );
}
