/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import type { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import { useAppTheme } from "@/contexts/ThemeContext";
// Base interface for tree items with required id
export interface BaseTreeItem {
    id: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// Define the item renderer types
type ItemRendererFull<T> = (props: {
    item: T;
    isSelected: boolean;
    isExpanded: boolean;
}) => React.ReactNode;
type ItemRendererSimple<T> = (item: T) => React.ReactNode;
type ItemRenderer<T> = ItemRendererFull<T> | ItemRendererSimple<T>;

// Generic TreeView component
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
}: Readonly<{
    items: T[];
    onSelectItem?: (item: T) => void;
    selectedItemId?: string;
    itemHeight?: number;
    itemRenderer?: ItemRenderer<T>;
    childrenKey?: string;
    labelKey?: string;
    header?: string;
    noItemsMessage: string;
    searchText: string;
    style?: React.CSSProperties;
}>) {
    const { isRtl } = useAppTheme();

    const [expandedItems, setExpandedItems] = useState<Set<string | number>>(
        new Set(),
    );
    const [searchTerm, setSearchTerm] = useState("");

    // Function to toggle expand/collapse
    const toggleExpand = (itemId: string | number, event: React.MouseEvent) => {
        event.stopPropagation();
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    // Helper function to determine if the renderer is simple or full
    const renderItem = (item: T, isSelected: boolean, isExpanded: boolean) => {
        if (!itemRenderer) {
            // Default renderer
            const itemLabel = item[labelKey] || "";
            return (
                <Typography
                    variant="body2"
                    noWrap
                    sx={{
                        fontWeight: isSelected ? 500 : 400,
                        minWidth: "max-content", // Set minimum width to content size
                        textWrap: "balance",
                    }}
                >
                    {typeof itemLabel === "string"
                        ? itemLabel
                        : String(itemLabel)}
                </Typography>
            );
        }

        // Check if it's a simple renderer (one parameter) or full renderer (object parameter)
        if (itemRenderer.length === 1) {
            // Simple renderer that only takes the item
            return (itemRenderer as ItemRendererSimple<T>)(item);
        } else {
            // Full renderer that takes an object with item, isSelected, and isExpanded
            return (itemRenderer as ItemRendererFull<T>)({
                item,
                isSelected,
                isExpanded,
            });
        }
    };

    // Update the flatten function to use childrenKey
    const flattenedItems = useMemo(() => {
        const result: T[] = [];

        const flatten = (items: T[]) => {
            items.forEach((item) => {
                result.push(item);
                if (item[childrenKey]) {
                    flatten(item[childrenKey]);
                }
            });
        };

        flatten(items);
        return result;
    }, [items, childrenKey]);

    // Update the filter function to use childrenKey and labelKey
    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return items;

        // Helper function to search recursively
        const filterTree = (items: T[]): T[] => {
            return items
                .map((item) => {
                    // Check if current item matches
                    const itemLabel = item[labelKey] || "";
                    const matchesSearch =
                        typeof itemLabel === "string" &&
                        itemLabel
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase());

                    // Check if any children match
                    const children = item[childrenKey] as T[] | undefined;
                    const filteredChildren = children
                        ? filterTree(children)
                        : undefined;
                    const hasMatchingChildren =
                        filteredChildren && filteredChildren.length > 0;

                    // Include this item if it matches or has matching children
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

    // Update the auto-expand function to use labelKey and childrenKey
    useEffect(() => {
        if (!searchTerm.trim()) return;

        const itemsToExpand = new Set<string | number>();

        const findAndExpandParents = (
            items: T[],
            parentIds: (string | number)[] = [],
        ) => {
            items.forEach((item) => {
                const currentPath = [...parentIds, item.id];

                const itemLabel = item[labelKey] || "";
                if (
                    typeof itemLabel === "string" &&
                    itemLabel.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                    // Add all parents to the expanded set
                    parentIds.forEach((id) => itemsToExpand.add(id));
                }

                const children = item[childrenKey] as T[] | undefined;
                if (children && children.length > 0) {
                    findAndExpandParents(children, currentPath);
                }
            });
        };

        findAndExpandParents(items);
        setExpandedItems((prev) => new Set([...prev, ...itemsToExpand]));
    }, [searchTerm, items, childrenKey, labelKey]);

    // Update the findParents function to use childrenKey

    // Refactored to use useCallback and match Autocomplete onChange signature
    const handleAutocompleteChange = useCallback(
        (
            _event: React.SyntheticEvent,
            value: T | string | null,
            _reason: AutocompleteChangeReason,
        ) => {
            if (value && typeof value !== "string") {
                const itemLabel = value[labelKey] || "";
                setSearchTerm(typeof itemLabel === "string" ? itemLabel : "");

                // Find and expand all parent nodes
                const findParents = (
                    items: T[],
                    targetId: string | number,
                    path: (string | number)[] = [],
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
                    setExpandedItems((prev) =>
                        new Set([...prev, ...parents, value.id]),
                    );
                    onSelectItem?.(value);
                }
            }
        },
        [items, labelKey, childrenKey, onSelectItem],
    );

    // Recursive component to render tree items
    const renderTreeItems = (items: T[], level = 0) => {
        return items.map((item) => {
            const children = item[childrenKey] as T[] | undefined;
            const hasChildren = children && children.length > 0;
            const isExpanded = expandedItems.has(item.id);
            const isSelected = item.id === selectedItemId;

            return (
                <Box key={item.id}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: item.disabled ? "default" : "pointer",
                            opacity: item.disabled ? 0.5 : 1,
                            pointerEvents: item.disabled ? "none" : "auto",
                            paddingInlineStart: `${
                                level * 20 + (!hasChildren ? 10 : 0)
                            }px`,
                            height: `${itemHeight}px`,
                            borderRadius: 2,
                            backgroundColor: isSelected
                                ? item.selectedColor ||
                                  "rgba(25, 118, 210, 0.08)"
                                : "transparent",
                            "&:hover": {
                                backgroundColor: item.disabled
                                    ? "transparent"
                                    : isSelected
                                      ? item.selectedColor ||
                                        "rgba(25, 118, 210, 0.12)"
                                      : "rgba(0, 0, 0, 0.04)",
                            },
                        }}
                        onClick={() => !item.disabled && onSelectItem?.(item)}
                    >
                        {hasChildren && (
                            <IconButton
                                size="small"
                                onClick={(e) => toggleExpand(item.id, e)}
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
                                {isRtl ? (
                                    <ChevronLeftIcon fontSize="medium" />
                                ) : (
                                    <ChevronRightIcon fontSize="medium" />
                                )}
                                {/* <ChevronRight size={18} /> */}
                            </IconButton>
                        )}
                        {!hasChildren && <Box sx={{ width: 26 }} />}

                        {renderItem(item, isSelected, isExpanded)}
                    </Box>

                    {hasChildren && isExpanded && (
                        <Box>{renderTreeItems(children, level + 1)}</Box>
                    )}
                </Box>
            );
        });
    };

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
                    getOptionLabel={(option) => {
                        if (typeof option === "string") return option;
                        const label = option[labelKey];
                        return typeof label === "string"
                            ? label
                            : String(label);
                    }}
                    inputValue={searchTerm}
                    onInputChange={(_event, newValue) =>
                        setSearchTerm(newValue)
                    }
                    onChange={handleAutocompleteChange}
                    renderInput={(params) => (
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
                    renderTreeItems(filteredItems)
                ) : (
                    <Box
                        sx={{
                            p: 4,
                            textAlign: "center",
                            color: "text.secondary",
                        }}
                    >
                        <Typography variant="body2">
                            {noItemsMessage}
                        </Typography>
                    </Box>
                )}
            </Box>
        </>
    );
}
