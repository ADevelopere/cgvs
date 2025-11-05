"use client";

import { Node } from "@xyflow/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TextElementNodeData } from "./nodeRenderer/TextElementNode";
import { ContainerNodeData, ElementBaseNodeData } from "./types";
import { logger } from "@/client/lib/logger";
import { useLazyQuery } from "@apollo/client/react";
import {
  elementsByTemplateIdQueryDocument,
  templateConfigByTemplateIdQueryDocument,
} from "./glqDocuments";
import React from "react";
import { isAbortError } from "@/client/utils/errorUtils";

/**
 * Return type for the useNodesStore hook
 */
export interface UseNodesStoreReturn {
  // Current nodes array - reactive state
  nodes: Node[];
  // Loading state
  loading: boolean;
  // Error state
  error: Error | null;
  // Template ID
  templateId: number;

  // Set all nodes
  setNodes: (nodes: Node[]) => void;

  // Clear all nodes
  clearNodes: () => void;

  // Add a new node
  addNode: (node: Node) => void;

  // Delete a node by id
  deleteNode: (nodeId: string) => void;

  // Update base node data (position, size, etc.)
  updateBaseNodeData: (
    elementId: number,
    updates: Partial<ElementBaseNodeData>
  ) => void;

  // Update text node data
  updateTextNodeData: (
    elementId: number,
    updates: Partial<TextElementNodeData>
  ) => void;

  // Update container node
  updateContainerNode: (updates: Partial<ContainerNodeData>) => void;

  // Update a single node directly (for ReactFlow integration)
  updateNode: (nodeId: string, updates: Partial<Node>) => void;

  // Batch update multiple nodes
  batchUpdateNodes: (
    updates: Array<{ nodeId: string; updates: Partial<Node> }>
  ) => void;
}

/**
 * Create a text element node from a CertificateElementUnion
 */
function createTextNode(
  element: GQL.CertificateElementUnion
): Node<TextElementNodeData> | null {
  if (element.base.type !== GQL.ElementType.Text) {
    return null;
  }

  const data: TextElementNodeData = {
    elementId: element.base.id,
  };

  return {
    id: element.base.id.toString(),
    type: "text",
    position: {
      x: element.base.positionX,
      y: element.base.positionY,
    },
    width: element.base.width,
    height: element.base.height,
    data,
    connectable: false,
    resizing: true,
  };
}

/**
 * Create container node
 */
function createContainerNode(config: {
  width: number;
  height: number;
}): Node<ContainerNodeData> {
  return {
    id: "container",
    type: "container",
    data: {
      width: config.width,
      height: config.height,
    },
    position: { x: 0, y: 0 },
    draggable: false,
    selectable: false,
  };
}

/**
 * Initialize nodes from elements and config
 */
function initializeNodesFromData(
  elements: GQL.CertificateElementUnion[],
  containerConfig: { width: number; height: number }
): Node[] {
  logger.debug("NodesStoreProvider: Initializing nodes", {
    elementCount: elements.length,
  });

  const containerNode = createContainerNode(containerConfig);

  const elementNodes: Node[] = elements
    .map(element => {
      if (element.base.type === GQL.ElementType.Text) {
        return createTextNode(element);
      }
      // Add other element types here as needed
      return null;
    })
    .filter((node): node is Node<TextElementNodeData> => node !== null);

  return [containerNode, ...elementNodes];
}

/**
 * Context for sharing nodes store across components
 */
const NodesStoreContext = React.createContext<UseNodesStoreReturn | null>(null);

/**
 * Provider component that manages the nodes store
 * Place this at the top of your component tree
 */
export const NodesStoreProvider: React.FC<{
  templateId: number;
  children: React.ReactNode;
}> = ({ templateId, children }) => {
  // Local state for nodes
  const [nodes, setNodesState] = React.useState<Node[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Setup lazy queries
  const [fetchElements, { error: elementsError }] = useLazyQuery(
    elementsByTemplateIdQueryDocument,
    {
      fetchPolicy: "cache-first",
    }
  );

  const [fetchConfig, { error: configError }] = useLazyQuery(
    templateConfigByTemplateIdQueryDocument,
    {
      fetchPolicy: "cache-first",
    }
  );

  // Single useEffect to initialize nodes on mount
  React.useEffect(() => {
    if (!templateId) {
      setLoading(false);
      return;
    }

    const initializeNodes = async () => {
      try {
        setLoading(true);
        setError(null);

        logger.debug("NodesStoreProvider: Fetching data for template", {
          templateId,
        });

        // Fetch both queries
        const [elementsResult, configResult] = await Promise.all([
          fetchElements({ variables: { templateId } }),
          fetchConfig({ variables: { templateId } }),
        ]);

        // Check for errors
        if (elementsResult.error || configResult.error) {
          const errorMsg =
            elementsResult.error?.message ||
            configResult.error?.message ||
            "Unknown error";
          setError(new Error(errorMsg));
          setLoading(false);
          return;
        }

        // Check for data
        const elements = elementsResult.data?.elementsByTemplateId;
        const config = configResult.data?.templateConfigByTemplateId;

        if (!elements || !config) {
          logger.warn("NodesStoreProvider: Missing data", {
            hasElements: !!elements,
            hasConfig: !!config,
          });
          setLoading(false);
          return;
        }

        // Initialize nodes
        const initializedNodes = initializeNodesFromData(elements, {
          width: config.width,
          height: config.height,
        });

        setNodesState(initializedNodes);
        setLoading(false);

        logger.debug("NodesStoreProvider: Nodes initialized successfully", {
          templateId,
          nodeCount: initializedNodes.length,
        });
      } catch (err) {
        if (!isAbortError(err)) {
          logger.error("NodesStoreProvider: Error initializing nodes", {
            error: err,
          });
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    initializeNodes();
    // Only run on mount or when templateId changes
  }, [templateId]);

  // Update error state if queries have errors
  React.useEffect(() => {
    if (elementsError || configError) {
      const errorMsg =
        elementsError?.message || configError?.message || "Query error";
      setError(new Error(errorMsg));
    }
  }, [elementsError, configError]);

  // Action: Set all nodes
  const setNodes = React.useCallback((newNodes: Node[]) => {
    setNodesState(newNodes);
  }, []);

  // Action: Clear all nodes
  const clearNodes = React.useCallback(() => {
    setNodesState([]);
  }, []);

  // Action: Add a node
  const addNode = React.useCallback((node: Node) => {
    setNodesState(prev => [...prev, node]);
  }, []);

  // Action: Delete a node
  const deleteNode = React.useCallback((nodeId: string) => {
    setNodesState(prev => prev.filter(n => n.id !== nodeId));
  }, []);

  // Action: Update base node data
  const updateBaseNodeData = React.useCallback(
    (elementId: number, updates: Partial<ElementBaseNodeData>) => {
      setNodesState(prev => {
        const nodeId = elementId.toString();

        return prev.map(node => {
          if (node.id !== nodeId) {
            return node;
          }

          const nodeUpdates: Partial<Node> = {};

          if (
            updates.positionX !== undefined ||
            updates.positionY !== undefined
          ) {
            nodeUpdates.position = {
              x: updates.positionX ?? node.position.x,
              y: updates.positionY ?? node.position.y,
            };
          }

          if (updates.width !== undefined) {
            nodeUpdates.width = updates.width;
          }

          if (updates.height !== undefined) {
            nodeUpdates.height = updates.height;
          }

          return {
            ...node,
            ...nodeUpdates,
          };
        });
      });
    },
    []
  );

  // Action: Update text node data
  const updateTextNodeData = React.useCallback(
    (elementId: number, updates: Partial<TextElementNodeData>) => {
      setNodesState(prev => {
        const nodeId = elementId.toString();

        return prev.map(node => {
          if (node.id !== nodeId || node.type !== "text") {
            return node;
          }

          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            } as TextElementNodeData,
          };
        });
      });
    },
    []
  );

  // Action: Update container node
  const updateContainerNode = React.useCallback(
    (updates: Partial<ContainerNodeData>) => {
      setNodesState(prev => {
        return prev.map(node => {
          if (node.id !== "container") {
            return node;
          }

          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            } as ContainerNodeData,
          };
        });
      });
    },
    []
  );

  // Action: Update a single node
  const updateNode = React.useCallback(
    (nodeId: string, updates: Partial<Node>) => {
      setNodesState(prev => {
        return prev.map(node => {
          if (node.id !== nodeId) {
            return node;
          }

          return {
            ...node,
            ...updates,
          };
        });
      });
    },
    []
  );

  // Action: Batch update nodes
  const batchUpdateNodes = React.useCallback(
    (updates: Array<{ nodeId: string; updates: Partial<Node> }>) => {
      setNodesState(prev => {
        const updateMap = new Map(updates.map(u => [u.nodeId, u.updates]));

        return prev.map(node => {
          const nodeUpdates = updateMap.get(node.id);
          if (!nodeUpdates) {
            return node;
          }

          return {
            ...node,
            ...nodeUpdates,
          };
        });
      });
    },
    []
  );

  const value: UseNodesStoreReturn = React.useMemo(
    () => ({
      nodes,
      loading,
      error,
      templateId,
      setNodes,
      clearNodes,
      addNode,
      deleteNode,
      updateBaseNodeData,
      updateTextNodeData,
      updateContainerNode,
      updateNode,
      batchUpdateNodes,
    }),
    [
      nodes,
      loading,
      error,
      templateId,
      setNodes,
      clearNodes,
      addNode,
      deleteNode,
      updateBaseNodeData,
      updateTextNodeData,
      updateContainerNode,
      updateNode,
      batchUpdateNodes,
    ]
  );

  return (
    <NodesStoreContext.Provider value={value}>
      {children}
    </NodesStoreContext.Provider>
  );
};

/**
 * Hook to access the nodes store from any component
 * Must be used within NodesStoreProvider
 */
export function useNodesStore(): UseNodesStoreReturn {
  const context = React.useContext(NodesStoreContext);

  if (!context) {
    throw new Error("useNodesStore must be used within NodesStoreProvider");
  }

  return context;
}
