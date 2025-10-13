"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Box, IconButton, CircularProgress, Typography } from "@mui/material";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import type { ReactiveTreeNode, QueryResolverOptions } from "./types";
import { useAppTheme } from "@/client/contexts/ThemeContext";

interface TreeNodeProps<
  TNode extends ReactiveTreeNode,
  TResult = unknown,
  TVariables = unknown,
> {
  node: TNode;
  level: number;
  resolver: (parent: TNode | undefined) => QueryResolverOptions<TVariables>;
  getItems: (data: TResult) => TNode[];
  hasChildren?: (node: TNode) => boolean;
  getNodeLabel: (node: TNode) => string;
  itemRenderer?: (props: {
    node: TNode;
    level: number;
    isExpanded: boolean;
    isSelected: boolean;
  }) => React.ReactNode;
  selectedItemId?: TNode['id'] | null;
  onSelectItem?: (node: TNode) => void;
  expandedItemIds?: Set<TNode['id']>;
  onToggleExpand?: (nodeId: TNode['id']) => void;
  isFetched?: (nodeId: TNode['id']) => boolean;
  onMarkAsFetched?: (nodeId: TNode['id']) => void;
  itemHeight?: number;
}

export function ReactiveCategoryTreeNode<
  TNode extends ReactiveTreeNode,
  TResult = unknown,
  TVariables = unknown,
>(props: TreeNodeProps<TNode, TResult, TVariables>) {
  const {
    node,
    level,
    resolver,
    getItems,
    hasChildren,
    getNodeLabel,
    itemRenderer,
    selectedItemId,
    onSelectItem,
    expandedItemIds,
    onToggleExpand,
    isFetched: isFetchedExternal,
    onMarkAsFetched,
    itemHeight = 40,
  } = props;

  // Use external expansion state if provided, otherwise use internal state
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = expandedItemIds ? expandedItemIds.has(node.id) : internalExpanded;
  const isSelected = node.id === selectedItemId;
  const { isRtl } = useAppTheme();

  // Track if we've initiated a fetch (via hover or expand click)
  // Use external fetched state if provided, otherwise use internal state
  const [internalFetched, setInternalFetched] = useState(false);
  const hasFetched = isFetchedExternal ? isFetchedExternal(node.id) : internalFetched;

  // Determine if this node might have children
  const mightHaveChildren = hasChildren ? hasChildren(node) : true;

  // Call useQuery for THIS node's children at top level
  // Skip until first fetch is initiated (via hover or expand click)
  const childQueryOptions = resolver(node);
  const { data: childData, loading: childLoading } = useQuery(
    childQueryOptions.query,
    {
      variables: childQueryOptions.variables as Record<
        string,
        string | number | boolean
      >,
      skip: !hasFetched || !mightHaveChildren,
      fetchPolicy: childQueryOptions.fetchPolicy || "cache-first",
    },
  );

  const children = childData ? getItems(childData as TResult) : [];
  const hasLoadedChildren = isExpanded && children.length > 0;
  const isLoading = hasFetched && childLoading;

  // Trigger fetch on first hover
  const handleHover = () => {
    if (!hasFetched && mightHaveChildren) {
      if (onMarkAsFetched) {
        // Use external state handler if provided
        onMarkAsFetched(node.id);
      } else {
        // Fall back to internal state
        setInternalFetched(true);
      }
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Initiate fetch if not already done
    if (!hasFetched && mightHaveChildren) {
      if (onMarkAsFetched) {
        // Use external state handler if provided
        onMarkAsFetched(node.id);
      } else {
        // Fall back to internal state
        setInternalFetched(true);
      }
    }
    if (onToggleExpand) {
      // Use external state handler if provided
      onToggleExpand(node.id);
    } else {
      // Fall back to internal state
      setInternalExpanded(!internalExpanded);
    }
  };

  return (
    <Box>
      {/* Node Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: itemHeight,
          paddingLeft: `${level * 20}px`,
          cursor: "pointer",
          borderRadius: 1,
          backgroundColor: isSelected
            ? "rgba(25, 118, 210, 0.08)"
            : "transparent",
          "&:hover": {
            backgroundColor: isSelected
              ? "rgba(25, 118, 210, 0.12)"
              : "rgba(0, 0, 0, 0.04)",
          },
        }}
        onClick={() => onSelectItem?.(node)}
        onMouseEnter={handleHover}
      >
        {/* Expand/Collapse Button */}
        {mightHaveChildren && (isLoading || !hasFetched || children.length > 0) && (
          <IconButton
            size="small"
            onClick={toggleExpand}
            disabled={isLoading}
            sx={{
              mr: 1,
              transform:
                isExpanded && !isLoading
                  ? "rotate(90deg)"
                  : isRtl
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : <ChevronRightIcon />}
          </IconButton>
        )}

        {/* Item Content */}
        {itemRenderer ? (
          itemRenderer({ node, level, isExpanded, isSelected })
        ) : (
          <Typography>{getNodeLabel(node)}</Typography>
        )}
      </Box>

      {/* Recursive Children */}
      {hasLoadedChildren && (
        <Box>
          {children.map((childNode: TNode) => (
            <ReactiveCategoryTreeNode<TNode, TResult, TVariables>
              key={childNode.id}
              node={childNode}
              level={level + 1}
              resolver={resolver}
              getItems={getItems}
              hasChildren={hasChildren}
              getNodeLabel={getNodeLabel}
              itemRenderer={itemRenderer}
              selectedItemId={selectedItemId}
              onSelectItem={onSelectItem}
              expandedItemIds={expandedItemIds}
              onToggleExpand={onToggleExpand}
              isFetched={isFetchedExternal}
              onMarkAsFetched={onMarkAsFetched}
              itemHeight={itemHeight}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
