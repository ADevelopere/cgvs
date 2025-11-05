import { Node } from "@xyflow/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TextElementNodeData } from "./nodeRenderer/TextElementNode";
import { ContainerNodeData, ElementBaseNodeData } from "./types";
import { logger } from "@/client/lib/logger";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import {
  elementsByTemplateIdQueryDocument,
  templateConfigByTemplateIdQueryDocument,
} from "./glqDocuments";
import React from "react";

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
  // Template ID from URL
  templateId: number | null;

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
function createTextNode(element: GQL.CertificateElementUnion): Node<TextElementNodeData> | null {
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
  };
}

/**
 * Initialize nodes from elements and config
 */
function initializeNodesFromData(
  elements: GQL.CertificateElementUnion[],
  containerConfig: { width: number; height: number }
): Node[] {
  logger.debug("useNodesStore: Initializing nodes", {
    elementCount: elements.length,
  });

  const containerNode = createContainerNode(containerConfig);

  const elementNodes: Node[] = elements
    .map((element) => {
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
 * React hook for managing ReactFlow nodes
 * Automatically fetches data from URL params and initializes nodes
 * Nodes are exposed as state for automatic re-renders
 */
export function useNodesStore(): UseNodesStoreReturn {
  // Get templateId from Next.js URL params
  const pathParams = useParams<{ id: string }>();
  const templateId = React.useMemo(() => {
    const id = pathParams?.id;
    return id ? Number.parseInt(id, 10) : null;
  }, [pathParams?.id]);

  // Fetch elements
  const {
    data: elementsData,
    loading: elementsLoading,
    error: elementsError,
  } = useQuery(elementsByTemplateIdQueryDocument, {
    variables: { templateId: templateId ?? 0 },
    skip: !templateId,
    fetchPolicy: "cache-first",
  });

  // Fetch config
  const {
    data: configData,
    loading: configLoading,
    error: configError,
  } = useQuery(templateConfigByTemplateIdQueryDocument, {
    variables: { templateId: templateId ?? 0 },
    skip: !templateId,
    fetchPolicy: "cache-first",
  });

  // Local state for nodes
  const [nodes, setNodesState] = React.useState<Node[]>([]);

  // Initialize nodes when data is loaded
  React.useEffect(() => {
    if (!elementsData?.elementsByTemplateId || !configData?.templateConfigByTemplateId) {
      return;
    }

    const elements = elementsData.elementsByTemplateId;
    const config = configData.templateConfigByTemplateId;

    const initializedNodes = initializeNodesFromData(elements, {
      width: config.width,
      height: config.height,
    });

    setNodesState(initializedNodes);
  }, [elementsData, configData]);

  // Combine loading states
  const loading = elementsLoading || configLoading;
  
  // Combine errors
  const error = elementsError || configError || null;

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
    setNodesState((prev) => [...prev, node]);
  }, []);

  // Action: Delete a node
  const deleteNode = React.useCallback((nodeId: string) => {
    setNodesState((prev) => prev.filter((n) => n.id !== nodeId));
  }, []);

  // Action: Update base node data
  const updateBaseNodeData = React.useCallback(
    (elementId: number, updates: Partial<ElementBaseNodeData>) => {
      setNodesState((prev) => {
        const nodeId = elementId.toString();

        return prev.map((node) => {
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
      setNodesState((prev) => {
        const nodeId = elementId.toString();

        return prev.map((node) => {
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
      setNodesState((prev) => {
        return prev.map((node) => {
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
  const updateNode = React.useCallback((nodeId: string, updates: Partial<Node>) => {
    setNodesState((prev) => {
      return prev.map((node) => {
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
  const batchUpdateNodes = React.useCallback(
    (updates: Array<{ nodeId: string; updates: Partial<Node> }>) => {
      setNodesState((prev) => {
        const updateMap = new Map(updates.map((u) => [u.nodeId, u.updates]));

        return prev.map((node) => {
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

  return {
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
  };
}
