import { create } from "zustand";
import { Node } from "@xyflow/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TextElementNodeData } from "./nodeRenderer/TextElementNode";
import { ContainerNodeData, ElementBaseNodeData } from "./types";
import { logger } from "@/client/lib/logger";

/**
 * Node store state
 */
interface NodesStoreState {
  // Current nodes array - exposed as state for reactivity
  nodes: Node[];
}

/**
 * Node store actions
 */
interface NodesStoreActions {
  // Initialize nodes
  initializeNodes: (
    elements: GQL.CertificateElementUnion[],
    containerConfig: { width: number; height: number }
  ) => void;

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
  batchUpdateNodes: (updates: Array<{ nodeId: string; updates: Partial<Node> }>) => void;
}

type NodesStore = NodesStoreState & NodesStoreActions;

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
 * Zustand store for managing ReactFlow nodes
 * Nodes are exposed as state for automatic re-renders
 */
export const useNodesStore = create<NodesStore>((set) => ({
  nodes: [],

  initializeNodes: (elements, containerConfig) => {
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

    const allNodes = [containerNode, ...elementNodes];

    set({ nodes: allNodes });
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  clearNodes: () => {
    set({ nodes: [] });
  },

  addNode: (node) => {
    set((state) => ({ nodes: [...state.nodes, node] }));
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
    }));
  },

  updateBaseNodeData: (elementId, updates) => {
    set((state) => {
      const nodeId = elementId.toString();

      const updatedNodes = state.nodes.map((node) => {
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

        return {
          ...node,
          ...nodeUpdates,
        };
      });

      return { nodes: updatedNodes };
    });
  },

  updateTextNodeData: (elementId, updates) => {
    set((state) => {
      const nodeId = elementId.toString();

      const updatedNodes = state.nodes.map((node) => {
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

      return { nodes: updatedNodes };
    });
  },

  updateContainerNode: (updates) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
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

      return { nodes: updatedNodes };
    });
  },

  updateNode: (nodeId, updates) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.id !== nodeId) {
          return node;
        }

        return {
          ...node,
          ...updates,
        };
      });

      return { nodes: updatedNodes };
    });
  },

  batchUpdateNodes: (updates) => {
    set((state) => {
      const updateMap = new Map(updates.map((u) => [u.nodeId, u.updates]));

      const updatedNodes = state.nodes.map((node) => {
        const nodeUpdates = updateMap.get(node.id);
        if (!nodeUpdates) {
          return node;
        }

        return {
          ...node,
          ...nodeUpdates,
        };
      });

      return { nodes: updatedNodes };
    });
  },
}));
