import { create } from "zustand";
import { Node } from "@xyflow/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TextElementNodeData } from "./nodeRenderer/TextElementNode";
import { ContainerNodeData, ElementBaseNodeData } from "./types";
import { logger } from "@/client/lib/logger";

/**
 * Node store state - keyed by templateId for lifecycle management
 */
interface NodesStoreState {
  // Map of templateId -> nodes array
  nodesByTemplate: Map<number, Node[]>;
}

/**
 * Node store actions
 */
interface NodesStoreActions {
  // Initialize nodes for a template
  initializeNodes: (
    templateId: number,
    elements: GQL.CertificateElementUnion[],
    containerConfig: { width: number; height: number }
  ) => void;

  // Get nodes for a template
  getNodes: (templateId: number) => Node[];

  // Set all nodes for a template
  setNodes: (templateId: number, nodes: Node[]) => void;

  // Clear all nodes for a template
  clearNodes: (templateId: number) => void;

  // Add a new node
  addNode: (templateId: number, node: Node) => void;

  // Delete a node by id
  deleteNode: (templateId: number, nodeId: string) => void;

  // Update base node data (position, size, etc.)
  updateBaseNodeData: (
    templateId: number,
    elementId: number,
    updates: Partial<ElementBaseNodeData>
  ) => void;

  // Update text node data
  updateTextNodeData: (
    templateId: number,
    elementId: number,
    updates: Partial<TextElementNodeData>
  ) => void;

  // Update container node
  updateContainerNode: (
    templateId: number,
    updates: Partial<ContainerNodeData>
  ) => void;

  // Update a single node directly (for ReactFlow integration)
  updateNode: (templateId: number, nodeId: string, updates: Partial<Node>) => void;

  // Batch update multiple nodes
  batchUpdateNodes: (
    templateId: number,
    updates: Array<{ nodeId: string; updates: Partial<Node> }>
  ) => void;
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
 * Lifecycle is per template ID
 */
export const useNodesStore = create<NodesStore>((set, get) => ({
  nodesByTemplate: new Map(),

  initializeNodes: (templateId, elements, containerConfig) => {
    logger.debug("useNodesStore: Initializing nodes", {
      templateId,
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

    set((state) => {
      const newMap = new Map(state.nodesByTemplate);
      newMap.set(templateId, allNodes);
      return { nodesByTemplate: newMap };
    });
  },

  getNodes: (templateId) => {
    const nodes = get().nodesByTemplate.get(templateId);
    return nodes ?? [];
  },

  setNodes: (templateId, nodes) => {
    set((state) => {
      const newMap = new Map(state.nodesByTemplate);
      newMap.set(templateId, nodes);
      return { nodesByTemplate: newMap };
    });
  },

  clearNodes: (templateId) => {
    set((state) => {
      const newMap = new Map(state.nodesByTemplate);
      newMap.delete(templateId);
      return { nodesByTemplate: newMap };
    });
  },

  addNode: (templateId, node) => {
    set((state) => {
      const nodes = state.nodesByTemplate.get(templateId) ?? [];
      const newMap = new Map(state.nodesByTemplate);
      newMap.set(templateId, [...nodes, node]);
      return { nodesByTemplate: newMap };
    });
  },

  deleteNode: (templateId, nodeId) => {
    set((state) => {
      const nodes = state.nodesByTemplate.get(templateId) ?? [];
      const newMap = new Map(state.nodesByTemplate);
      newMap.set(
        templateId,
        nodes.filter((n) => n.id !== nodeId)
      );
      return { nodesByTemplate: newMap };
    });
  },

  updateBaseNodeData: (templateId, elementId, updates) => {
    set((state) => {
      const nodes = state.nodesByTemplate.get(templateId) ?? [];
      const nodeId = elementId.toString();

      const updatedNodes = nodes.map((node) => {
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

      const newMap = new Map(state.nodesByTemplate);
      newMap.set(templateId, updatedNodes);
      return { nodesByTemplate: newMap };
    });
  },

  updateTextNodeData: (templateId, elementId, updates) => {
    set((state) => {
      const nodes = state.nodesByTemplate.get(templateId) ?? [];
      const nodeId = elementId.toString();

      const updatedNodes = nodes.map((node) => {
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

      const newMap = new Map(state.nodesByTemplate);
      newMap.set(templateId, updatedNodes);
      return { nodesByTemplate: newMap };
    });
  },

  updateContainerNode: (templateId, updates) => {
    set((state) => {
      const nodes = state.nodesByTemplate.get(templateId) ?? [];

      const updatedNodes = nodes.map((node) => {
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

      const newMap = new Map(state.nodesByTemplate);
      newMap.set(templateId, updatedNodes);
      return { nodesByTemplate: newMap };
    });
  },

  updateNode: (templateId, nodeId, updates) => {
    set((state) => {
      const nodes = state.nodesByTemplate.get(templateId) ?? [];

      const updatedNodes = nodes.map((node) => {
        if (node.id !== nodeId) {
          return node;
        }

        return {
          ...node,
          ...updates,
        };
      });

      const newMap = new Map(state.nodesByTemplate);
      newMap.set(templateId, updatedNodes);
      return { nodesByTemplate: newMap };
    });
  },

  batchUpdateNodes: (templateId, updates) => {
    set((state) => {
      const nodes = state.nodesByTemplate.get(templateId) ?? [];
      const updateMap = new Map(updates.map((u) => [u.nodeId, u.updates]));

      const updatedNodes = nodes.map((node) => {
        const nodeUpdates = updateMap.get(node.id);
        if (!nodeUpdates) {
          return node;
        }

        return {
          ...node,
          ...nodeUpdates,
        };
      });

      const newMap = new Map(state.nodesByTemplate);
      newMap.set(templateId, updatedNodes);
      return { nodesByTemplate: newMap };
    });
  },
}));
