import type { DocumentNode } from "@apollo/client";

export type QueryResolverOptions<TVariables> = {
  query: DocumentNode;
  variables?: TVariables;
  skip?: boolean;
  fetchPolicy?: "cache-first" | "cache-only" | "network-only";
};

export type RootResolver<TVariables> =
  () => QueryResolverOptions<TVariables>;

export type ChildrenResolver<TVariables> = (
  parentId: string | number,
) => QueryResolverOptions<TVariables>;

export interface ReactiveTreeNode {
  id: string | number;
}

export interface ReactiveTreeProps<
  TNode extends ReactiveTreeNode,
  TRootData,
  TChildData,
  TRootVariables,
  TChildVariables,
> {
  // Resolver for root-level items
  rootResolver: RootResolver<TRootVariables>;

  // Resolver for children given parent ID
  childrenResolver: ChildrenResolver<TChildVariables>;

  // Extract items array from query result
  getRootItems: (data: TRootData) => TNode[];
  getChildItems: (data: TChildData) => TNode[];

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
  selectedItemId?: string | number | null;
  onSelectItem?: (node: TNode) => void;

  // Styling
  itemHeight?: number;
  header?: string;
  noItemsMessage?: string;
}
