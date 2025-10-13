import type { DocumentNode } from "@apollo/client";

export type QueryResolverOptions<TVariables> = {
  query: DocumentNode;
  variables?: TVariables;
  skip?: boolean;
  fetchPolicy?: "cache-first" | "cache-only" | "network-only";
};

export type ItemResolver<TNode extends ReactiveTreeNode, TVariables> = (
  parent: TNode | undefined,
) => QueryResolverOptions<TVariables>;

export interface ReactiveTreeNode<TId = string | number> {
  id: TId;
}

export interface ReactiveTreeProps<
  TNode extends ReactiveTreeNode,
  TResult = unknown,
  TVariables = unknown,
> {
  // Unified resolver for both root and children items
  resolver: ItemResolver<TNode, TVariables>;

  // Extract items array from query result
  getItems: (data: TResult) => TNode[];

  // Check if node has children (before loading)
  hasChildren?: (node: TNode) => boolean;

  // Get node label for display
  getNodeLabel: (node: TNode) => string;

  // Custom rendering
  itemRenderer?: (props: {
    node: TNode;
    level: number;
    isExpanded: boolean;
    isSelected: boolean;
  }) => React.ReactNode;

  // Selection
  selectedItemId?: TNode['id'] | null;
  onSelectItem?: (node: TNode) => void;

  // Expansion state management (optional - uses internal state if not provided)
  expandedItemIds?: Set<TNode['id']>;
  onToggleExpand?: (nodeId: TNode['id']) => void;

  // Fetch tracking (optional - uses internal state if not provided)
  isFetched?: (nodeId: TNode['id']) => boolean;
  onMarkAsFetched?: (nodeId: TNode['id']) => void;

  // Styling
  itemHeight?: number;
  header?: string;
  noItemsMessage?: string;
}
