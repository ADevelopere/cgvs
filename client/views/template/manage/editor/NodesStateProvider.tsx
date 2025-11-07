"use client";

import { Node } from "@xyflow/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TextElementNodeData } from "./nodeRenderer/TextElementNode";
import { ContainerNodeData, ElementBaseNodeData } from "./types";
import { logger } from "@/client/lib/logger";
import { useLazyQuery } from "@apollo/client/react";
import { elementsByTemplateIdQueryDocument, templateConfigByTemplateIdQueryDocument } from "./glqDocuments";
import React from "react";
import { isAbortError } from "@/client/utils/errorUtils";
import { ImageElementNodeData } from "./nodeRenderer/ImageNode";

/**
 * Return type for the useNodesStore hook
 */
export interface UseNodesStoreReturn {
  // Current nodes array - reactive state (visible nodes only)
  nodes: Node[];
  // Hidden nodes state
  hiddenNodes: Map<string, Node>;
  // Loading state
  loading: boolean;
  // Error state
  error: Error | null;

  // Set all nodes
  setNodes: (nodes: Node[]) => void;

  // Clear all nodes
  clearNodes: () => void;

  // Add a new node
  addNode: (node: Node) => void;

  // Delete a node by id
  deleteNode: (nodeId: string) => void;

  addTextNode: (textElement: GQL.TextElement) => void;
  addImageNode: (imageElement: GQL.ImageElement) => void;

  // Update base node data (position, size, etc.)
  updateBaseNodeData: (elementId: number, updates: Partial<ElementBaseNodeData>) => void;

  // Update text node data
  updateTextNodeData: (elementId: number, updates: Partial<TextElementNodeData>) => void;

  // Update container node
  updateContainerNode: (updates: Partial<ContainerNodeData>) => void;

  // Update a single node directly (for ReactFlow integration)
  updateNode: (nodeId: string, updates: Partial<Node>) => void;

  // Batch update multiple nodes
  batchUpdateNodes: (updates: Array<{ nodeId: string; updates: Partial<Node> }>) => void;

  // Reorder nodes based on moved elements
  reorderNodes: (movedElements: Array<{ elementId: number; newZIndex: number }>) => void;

  // Hide a node by element ID (removes from visible nodes, stores in hidden)
  hideNode: (elementId: number) => void;

  // Show a hidden node by element ID (restores to visible nodes)
  showNode: (elementId: number) => void;

  // Toggle node visibility
  toggleNodeVisibility: (elementId: number) => void;

  // Check if a node is hidden
  isNodeHidden: (elementId: number) => boolean;

  nodesInitialized: boolean;

  // Helper line state
  helperLineHorizontal: number | undefined;
  helperLineVertical: number | undefined;
  setHelperLineHorizontal: (value: number | undefined) => void;
  setHelperLineVertical: (value: number | undefined) => void;
}

/**
 * Create a text element node from a CertificateElementUnion
 */
function createTextNode(element: GQL.TextElement): Node<TextElementNodeData> | null {
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
    handles: undefined,
    zIndex: element.base.zIndex,
  };
}

function createImageNode(element: GQL.ImageElement): Node | null {
  const data: ImageElementNodeData = {
    elementId: element.base.id,
  };

  return {
    id: element.base.id.toString(),
    type: "image",
    position: {
      x: element.base.positionX,
      y: element.base.positionY,
    },
    width: element.base.width,
    height: element.base.height,
    data,
    connectable: false,
    resizing: true,
    zIndex: element.base.zIndex,
  };
}

/**
 * Create container node
 */
function createContainerNode(config: { width: number; height: number }): Node<ContainerNodeData> {
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
    zIndex: 0,
  };
}

/**
 * Initialize nodes from elements and config
 */
function initializeNodesFromData(
  elements: GQL.CertificateElementUnion[],
  containerConfig: { width: number; height: number }
): Node[] {
  logger.debug({ caller: "NodesProvider" }, "Initializing nodes", {
    elementCount: elements.length,
  });

  const containerNode = createContainerNode(containerConfig);

  const elementNodes: Node[] = elements
    .map(element => {
      if (element.base.type === GQL.ElementType.Text) {
        return createTextNode(element as GQL.TextElement);
      }
      if (element.base.type === GQL.ElementType.Image) {
        return createImageNode(element as GQL.ImageElement);
      }
      // Add other element types here as needed
      return null;
    })
    .filter(node => node !== null);

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
export const NodesProvider: React.FC<{
  templateId: number;
  children: React.ReactNode;
}> = ({ templateId, children }) => {
  // Local state for nodes
  const [nodes, setNodesState] = React.useState<Node[]>([]);
  const [hiddenNodes, setHiddenNodes] = React.useState<Map<string, Node>>(new Map());
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);
  // Helper line state (kept local as it's UI-only)
  const [helperLineHorizontal, setHelperLineHorizontal] = React.useState<number | undefined>(undefined);
  const [helperLineVertical, setHelperLineVertical] = React.useState<number | undefined>(undefined);

  // Setup lazy queries
  const [fetchElements, { error: elementsError }] = useLazyQuery(elementsByTemplateIdQueryDocument, {
    fetchPolicy: "cache-first",
  });

  const [fetchConfig, { error: configError }] = useLazyQuery(templateConfigByTemplateIdQueryDocument, {
    fetchPolicy: "cache-first",
  });

  const [initialized, setInitialized] = React.useState(false);

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

        logger.debug({ caller: "NodesProvider" }, "Fetching data for template", {
          templateId,
        });

        // Fetch both queries
        const [elementsResult, configResult] = await Promise.all([
          fetchElements({ variables: { templateId } }),
          fetchConfig({ variables: { templateId } }),
        ]);

        // Check for errors
        if (elementsResult.error || configResult.error) {
          const errorMsg = elementsResult.error?.message || configResult.error?.message || "Unknown error";
          setError(new Error(errorMsg));
          setLoading(false);
          return;
        }

        // Check for data
        const elements = elementsResult.data?.elementsByTemplateId;
        const config = configResult.data?.templateConfigByTemplateId;

        if (!elements || !config) {
          logger.warn({ caller: "NodesProvider" }, "Missing data", {
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

        logger.debug({ caller: "NodesProvider" }, "Nodes initialized successfully", {
          templateId,
          nodeCount: initializedNodes.length,
        });
      } catch (err) {
        if (!isAbortError(err)) {
          logger.error({ caller: "NodesProvider" }, "Error initializing nodes", {
            error: err,
          });
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    initializeNodes();
    setInitialized(true);
    // Only run on mount or when templateId changes
  }, [templateId]);

  // Update error state if queries have errors
  React.useEffect(() => {
    if (elementsError || configError) {
      const errorMsg = elementsError?.message || configError?.message || "Query error";
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
  const updateBaseNodeData = React.useCallback((elementId: number, updates: Partial<ElementBaseNodeData>) => {
    setNodesState(prev => {
      const nodeId = elementId.toString();

      return prev.map(node => {
        if (node.id !== nodeId) {
          return node;
        }

        const nodeUpdates: Partial<Node> = {};

        if (updates.positionX !== undefined || updates.positionY !== undefined) {
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

        if( updates.zIndex !== undefined) {
          nodeUpdates.zIndex = updates.zIndex;
        }

        return {
          ...node,
          ...nodeUpdates,
        };
      });
    });
  }, []);

  // Action: Update text node data
  const updateTextNodeData = React.useCallback((elementId: number, updates: Partial<TextElementNodeData>) => {
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
  }, []);

  // Action: Update container node
  const updateContainerNode = React.useCallback((updates: Partial<ContainerNodeData>) => {
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
  }, []);

  // Action: Update a single node
  const updateNode = React.useCallback((nodeId: string, updates: Partial<Node>) => {
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
  }, []);

  // Action: Batch update nodes
  const batchUpdateNodes = React.useCallback((updates: Array<{ nodeId: string; updates: Partial<Node> }>) => {
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
  }, []);

  const addTextNode = React.useCallback((textElement: GQL.TextElement) => {
    const textNode = createTextNode(textElement);
    if (textNode) {
      setNodesState(prev => [...prev, textNode]);
    }
  }, []);

  const addImageNode = React.useCallback((imageElement: GQL.ImageElement) => {
    const imageNode = createImageNode(imageElement);
    if (imageNode) {
      setNodesState(prev => [...prev, imageNode]);
    }
  }, []);

  // Action: Reorder nodes based on moved elements
  const reorderNodes = React.useCallback((movedElements: Array<{ elementId: number; newZIndex: number }>) => {
    setNodesState(prev => {
      // Create a map of element ID to new render order
      const orderMap = new Map(movedElements.map(e => [e.elementId.toString(), e.newZIndex]));

      // Sort nodes: container first, then by render order
      return prev.sort((a, b) => {
        // Container node always first
        if (a.id === "container") return -1;
        if (b.id === "container") return 1;

        // Get render order from the map or keep current position
        const aOrder = orderMap.get(a.id);
        const bOrder = orderMap.get(b.id);

        // If both have new orders, compare them
        if (aOrder !== undefined && bOrder !== undefined) {
          return aOrder - bOrder;
        }

        // If only one has a new order, it's hard to determine
        // Keep original order
        return 0;
      });
    });
  }, []);

  // Action: Hide a node
  const hideNode = React.useCallback((elementId: number) => {
    const nodeId = elementId.toString();

    setNodesState(prev => {
      const nodeToHide = prev.find(n => n.id === nodeId);
      if (!nodeToHide) {
        logger.warn({ caller: "NodesProvider" }, "Cannot hide node - not found", { elementId });
        return prev;
      }

      // Store in hidden nodes
      setHiddenNodes(hidden => new Map(hidden).set(nodeId, nodeToHide));

      // Remove from visible nodes
      return prev.filter(n => n.id !== nodeId);
    });
  }, []);

  // Action: Show a hidden node
  const showNode = React.useCallback((elementId: number) => {
    const nodeId = elementId.toString();

    setHiddenNodes(prev => {
      const nodeToShow = prev.get(nodeId);
      if (!nodeToShow) {
        logger.warn({ caller: "NodesProvider" }, "Cannot show node - not in hidden nodes", { elementId });
        return prev;
      }

      // Add back to visible nodes
      setNodesState(nodes => [...nodes, nodeToShow]);

      // Remove from hidden nodes
      const newHidden = new Map(prev);
      newHidden.delete(nodeId);
      return newHidden;
    });
  }, []);

  // Action: Toggle node visibility
  const toggleNodeVisibility = React.useCallback(
    (elementId: number) => {
      const nodeId = elementId.toString();
      const isHidden = hiddenNodes.has(nodeId);

      if (isHidden) {
        showNode(elementId);
      } else {
        hideNode(elementId);
      }
    },
    [hiddenNodes, showNode, hideNode]
  );

  // Utility: Check if a node is hidden
  const isNodeHidden = React.useCallback(
    (elementId: number) => {
      return hiddenNodes.has(elementId.toString());
    },
    [hiddenNodes]
  );

  const value: UseNodesStoreReturn = React.useMemo(
    () => ({
      nodes,
      hiddenNodes,
      loading,
      error,
      setNodes,
      clearNodes,
      addNode,
      addTextNode,
      addImageNode,
      deleteNode,
      updateBaseNodeData,
      updateTextNodeData,
      updateContainerNode,
      updateNode,
      batchUpdateNodes,
      reorderNodes,
      hideNode,
      showNode,
      toggleNodeVisibility,
      isNodeHidden,
      nodesInitialized: initialized,

      // Helper line state
      helperLineHorizontal,
      helperLineVertical,
      setHelperLineHorizontal,
      setHelperLineVertical,
    }),
    [
      nodes,
      hiddenNodes,
      loading,
      error,
      setNodes,
      clearNodes,
      addTextNode,
      addNode,
      deleteNode,
      updateBaseNodeData,
      updateTextNodeData,
      updateContainerNode,
      updateNode,
      batchUpdateNodes,
      reorderNodes,
      hideNode,
      showNode,
      toggleNodeVisibility,
      isNodeHidden,
      initialized,

      // Helper line state
      helperLineHorizontal,
      helperLineVertical,
      setHelperLineHorizontal,
      setHelperLineVertical,
    ]
  );

  return <NodesStoreContext.Provider value={value}>{children}</NodesStoreContext.Provider>;
};

/**
 * Hook to access the nodes store from any component
 * Must be used within NodesStoreProvider
 */
export function useNode(): UseNodesStoreReturn {
  const context = React.useContext(NodesStoreContext);

  if (!context) {
    throw new Error("useNodesStore must be used within NodesStoreProvider");
  }

  return context;
}
