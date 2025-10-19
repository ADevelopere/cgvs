/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import type { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import TreeViewNode from "@/client/components/treeView/TreeViewNode";

export interface BaseTreeItem {
  id: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type TreeViewItemRenderer<T> = (props: {
  item: T;
  isSelected: boolean;
  isExpanded: boolean;
}) => React.ReactNode;

export type LazyLoadStrategy = "on-expand" | "preload-level";

export function TreeView<T extends BaseTreeItem>({
  items,
  onSelectItem,
  selectedItemId,
  itemHeight,
  itemRenderer,
  childrenKey = "children",
  labelKey = "label",
  header,
  noItemsMessage,
  searchText,
  style,
  expandedItems: expandedItemsProp,
  onExpandItem,
  onCollapseItem,
  onHoverItem,
  childrenResolver,
  lazyLoadStrategy,
  hasChildrenKey,
  onChildrenLoaded,
}: Readonly<{
  items: T[];
  onSelectItem?: (item: T) => void;
  selectedItemId?: string;
  itemHeight?: number;
  itemRenderer?: TreeViewItemRenderer<T>;
  childrenKey?: string;
  labelKey?: string;
  header?: string;
  noItemsMessage: string | React.ReactNode;
  searchText: string;
  style?: React.CSSProperties;
  expandedItems?: Set<string | number>;
  onExpandItem?: (item: T) => void;
  onCollapseItem?: (item: T) => void;
  onHoverItem?: (item: T) => void;
  childrenResolver?: (item: T) => Promise<T[]>;
  lazyLoadStrategy?: LazyLoadStrategy;
  hasChildrenKey?: string;
  onChildrenLoaded?: (item: T, children: T[]) => void;
}>) {
  const { isRtl } = useAppTheme();

  const [internalExpandedItems, setInternalExpandedItems] = useState<
    Set<string | number>
  >(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingItems, setLoadingItems] = useState<Set<string | number>>(
    new Set()
  );

  const expandedItems = expandedItemsProp ?? internalExpandedItems;
  const setExpandedItems = useMemo(
    () => (expandedItemsProp ? () => {} : setInternalExpandedItems),
    [expandedItemsProp, setInternalExpandedItems]
  );

  const toggleExpand = useCallback(
    async (item: T, event: React.MouseEvent) => {
      event.stopPropagation();
      if (expandedItems.has(item.id)) {
        // Collapse
        onCollapseItem?.(item);
        if (!expandedItemsProp) {
          setInternalExpandedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(item.id);
            return newSet;
          });
        }
      } else {
        // Expand - check if need to load children
        const children = item[childrenKey] as T[] | undefined;
        const hasChildrenFlag = hasChildrenKey ? item[hasChildrenKey] : true;

        if (
          childrenResolver &&
          hasChildrenFlag &&
          (!children || children.length === 0)
        ) {
          setLoadingItems(prev => new Set(prev).add(item.id));
          try {
            const loadedChildren = await childrenResolver(item);
            onChildrenLoaded?.(item, loadedChildren);
          } finally {
            setLoadingItems(prev => {
              const s = new Set(prev);
              s.delete(item.id);
              return s;
            });
          }
        }

        onExpandItem?.(item);
        if (!expandedItemsProp) {
          setInternalExpandedItems(prev => {
            const newSet = new Set(prev);
            newSet.add(item.id);
            return newSet;
          });
        }
      }
    },
    [
      expandedItems,
      childrenResolver,
      childrenKey,
      hasChildrenKey,
      onChildrenLoaded,
      onCollapseItem,
      expandedItemsProp,
      onExpandItem,
    ]
  );

  const flattenedItems = useMemo(() => {
    const result: T[] = [];
    const flatten = (items: T[]) => {
      items.forEach(item => {
        result.push(item);
        if (item[childrenKey]) {
          flatten(item[childrenKey]);
        }
      });
    };
    flatten(items);
    return result;
  }, [items, childrenKey]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const filterTree = (items: T[]): T[] => {
      return items
        .map(item => {
          const itemLabel = item[labelKey] || "";
          const matchesSearch = itemLabel
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          const children = item[childrenKey] as T[] | undefined;
          const filteredChildren = children ? filterTree(children) : undefined;
          const hasMatchingChildren =
            filteredChildren && filteredChildren.length > 0;

          if (matchesSearch || hasMatchingChildren) {
            return {
              ...item,
              [childrenKey]: filteredChildren,
            } as T;
          }

          return null;
        })
        .filter((item): item is T => item !== null);
    };

    return filterTree(items);
  }, [items, searchTerm, childrenKey, labelKey]);

  useEffect(() => {
    if (!searchTerm.trim()) return;

    const itemsToExpand = new Set<string | number>();
    const findAndExpandParents = (
      items: T[],
      parentIds: (string | number)[] = []
    ) => {
      items.forEach(item => {
        const currentPath = [...parentIds, item.id];
        const itemLabel = item[labelKey] || "";
        if (itemLabel.toLowerCase().includes(searchTerm.toLowerCase())) {
          parentIds.forEach(id => itemsToExpand.add(id));
        }

        const children = item[childrenKey] as T[] | undefined;
        if (children && children.length > 0) {
          findAndExpandParents(children, currentPath);
        }
      });
    };

    findAndExpandParents(items);
    setExpandedItems(prev => new Set([...prev, ...itemsToExpand]));
  }, [searchTerm, items, childrenKey, labelKey, setExpandedItems]);

  const handleAutocompleteChange = useCallback(
    (
      _event: React.SyntheticEvent,
      value: T | string | null,
      _reason: AutocompleteChangeReason
    ) => {
      if (value && typeof value !== "string") {
        const itemLabel: string = value[labelKey] || "";
        setSearchTerm(itemLabel);

        const findParents = (
          items: T[],
          targetId: string | number,
          path: (string | number)[] = []
        ): (string | number)[] | null => {
          for (const item of items) {
            if (item.id === targetId) {
              return path;
            }
            const children = item[childrenKey] as T[] | undefined;
            if (children) {
              const result = findParents(children, targetId, [
                ...path,
                item.id,
              ]);
              if (result) return result;
            }
          }
          return null;
        };

        const parents = findParents(items, value.id);
        if (parents) {
          setExpandedItems(prev => new Set([...prev, ...parents, value.id]));
          onSelectItem?.(value);
        }
      }
    },
    [items, labelKey, childrenKey, onSelectItem, setExpandedItems]
  );

  const treeHeaderRef = useRef<HTMLDivElement>(null);
  const [treeHeaderRefHeight, setTreeHeaderRefHeight] = useState(0);

  useEffect(() => {
    if (treeHeaderRef.current) {
      setTreeHeaderRefHeight(treeHeaderRef.current.clientHeight);
    }
  }, [treeHeaderRef]);

  return (
    <>
      <Box
        ref={treeHeaderRef}
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          width: "100%",
          gap: 2,
          borderColor: "divider",
          ...style,
        }}
      >
        {header && (
          <Typography
            variant="h5"
            sx={{
              p: 2,
            }}
          >
            {header}
          </Typography>
        )}

        <Autocomplete
          sx={{
            flexGrow: 1,
          }}
          freeSolo
          options={flattenedItems}
          getOptionLabel={option => {
            if (typeof option === "string") return option;
            const label = option[labelKey];
            return typeof label === "string" ? label : String(label);
          }}
          inputValue={searchTerm}
          onInputChange={(_event, newValue) => setSearchTerm(newValue)}
          onChange={handleAutocompleteChange}
          renderInput={params => (
            <TextField
              {...params}
              placeholder={searchText}
              variant="outlined"
              size="small"
              fullWidth
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Search size={16} />
                      {params.InputProps.startAdornment}
                    </Box>
                  ),
                },
              }}
            />
          )}
        />
      </Box>

      <Box
        id="tree-view-scrollable"
        sx={{
          overflow: "auto",
          height: `calc(100% - ${treeHeaderRefHeight + 8}px)`,
          p: 2,
        }}
      >
        {filteredItems.length > 0 ? (
          <TreeViewNode
            items={filteredItems}
            level={0}
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
        ) : (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            {typeof noItemsMessage === "string" ? (
              <Typography variant="body2" component="div">
                {noItemsMessage}
              </Typography>
            ) : (
              noItemsMessage
            )}
          </Box>
        )}
      </Box>
    </>
  );
}
