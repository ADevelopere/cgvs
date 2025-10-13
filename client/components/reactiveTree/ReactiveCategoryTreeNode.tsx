"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type {
  ReactiveTreeNode,
  ChildrenResolver,
} from "./types";

interface TreeNodeProps<TNode extends ReactiveTreeNode> {
  node: TNode;
  level: number;
  childrenResolver: ChildrenResolver<TNode[]>;
  getChildItems: (data: any) => TNode[];
  hasChildren?: (node: TNode) => boolean;
  itemRenderer?: (props: {
    node: TNode;
    level: number;
    isExpanded: boolean;
    isSelected: boolean;
  }) => React.ReactNode;
  selectedItemId?: string | number;
  onSelectItem?: (node: TNode) => void;
  itemHeight?: number;
}

export function ReactiveCategoryTreeNode<TNode extends ReactiveTreeNode>(
  props: TreeNodeProps<TNode>,
) {
  const {
    node,
    level,
    childrenResolver,
    getChildItems,
    hasChildren,
    itemRenderer,
    selectedItemId,
    onSelectItem,
    itemHeight = 40,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = node.id === selectedItemId;

  // Determine if this node might have children
  const mightHaveChildren = hasChildren ? hasChildren(node) : true;

  // Call useQuery for THIS node's children at top level
  // Skip if not expanded or if we know it has no children
  const childQueryOptions = childrenResolver(node.id);
  const { data: childData, loading: childLoading } = useQuery(
    childQueryOptions.query,
    {
      variables: childQueryOptions.variables,
      skip: !isExpanded || !mightHaveChildren,
      fetchPolicy: childQueryOptions.fetchPolicy || "cache-first",
    },
  );

  const children = childData ? getChildItems(childData) : [];
  const hasLoadedChildren = isExpanded && children.length > 0;
  const isLoading = isExpanded && childLoading;

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
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
      >
        {/* Expand/Collapse Button */}
        {mightHaveChildren && (
          <IconButton
            size="small"
            onClick={toggleExpand}
            disabled={isLoading}
            sx={{
              mr: 1,
              transform:
                isExpanded && !isLoading ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        )}

        {/* Item Content */}
        {itemRenderer ? (
          itemRenderer({ node, level, isExpanded, isSelected })
        ) : (
          <Typography>{(node as any).name || node.id}</Typography>
        )}
      </Box>

      {/* Recursive Children */}
      {hasLoadedChildren && (
        <Box>
          {children.map((childNode) => (
            <ReactiveCategoryTreeNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              {...props}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

