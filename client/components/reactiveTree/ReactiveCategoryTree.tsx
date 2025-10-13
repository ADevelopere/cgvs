"use client";

import { useQuery } from "@apollo/client/react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import type { ReactiveTreeNode, ReactiveTreeProps } from "./types";
import { ReactiveCategoryTreeNode } from "./ReactiveCategoryTreeNode";

export function ReactiveCategoryTree<
  TNode extends ReactiveTreeNode,
  TRootData,
  TChildData,
  TRootVariables,
  TChildVariables
>(
  props: ReactiveTreeProps<TNode, TRootData, TChildData, TRootVariables, TChildVariables>,
) {
  const { rootResolver, getRootItems, header, noItemsMessage, ...nodeProps } =
    props;

  // Call useQuery at top level with root resolver
  const rootQueryOptions = rootResolver();
  const { data, loading, error } = useQuery(rootQueryOptions.query, {
    variables: rootQueryOptions.variables as Record<string, string | number | boolean>,
    skip: rootQueryOptions.skip,
    fetchPolicy: rootQueryOptions.fetchPolicy || "cache-first",
  });

  const rootItems = data ? getRootItems(data as TRootData) : [];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, color: "error.main" }}>
        Error loading categories: {error.message}
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {header && (
        <Typography
          variant="h5"
          sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          {header}
        </Typography>
      )}

      <Box sx={{ p: 2, flexGrow: 1, overflow: "auto" }}>
        {rootItems.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {noItemsMessage || "No items"}
          </Typography>
        ) : (
          rootItems.map((node: TNode) => (
            <ReactiveCategoryTreeNode<TNode, TChildData, TChildVariables>
              key={node.id}
              node={node}
              level={0}
              {...nodeProps}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
