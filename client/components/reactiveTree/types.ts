import type { DocumentNode } from "@apollo/client";

export type QueryResolverOptions = {
  query: DocumentNode;
  variables?: Record<string, any>;
  skip?: boolean;
  fetchPolicy?: "cache-first" | "cache-only" | "network-only";
};

export type RootResolver<TData> = () => QueryResolverOptions;

export type ChildrenResolver<TData> = (
  parentId: string | number,
) => QueryResolverOptions;

export interface ReactiveTreeNode {
  id: string | number;
  [key: string]: any;
}

export interface ReactiveTreeProps<TNode extends ReactiveTreeNode> {
  // Resolver for root-level items
  rootResolver: RootResolver<TNode[]>;

  // Resolver for children given parent ID
  childrenResolver: ChildrenResolver<TNode[]>;

  // Extract items array from query result
  getRootItems: (data: any) => TNode[];
  getChildItems: (data: any) => TNode[];

  // Check if node has children (before loading)
  hasChildren?: (node: TNode) => boolean;

  // Custom rendering
  itemRenderer?: (props: {
    node: TNode;
    level: number;
    isExpanded: boolean;
    isSelected: boolean;
  }) => React.ReactNode;

  // Selection
  selectedItemId?: string | number;
  onSelectItem?: (node: TNode) => void;

  // Styling
  itemHeight?: number;
  header?: string;
  noItemsMessage?: string;
}

