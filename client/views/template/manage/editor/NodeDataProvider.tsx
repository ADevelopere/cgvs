import * as GQL from "@/client/graphql/generated/gql/graphql";
import React from "react";
import { UseBaseElementStateReturn } from "./form/hooks";
import { UseTemplateConfigStateReturn } from "./form/config/useTemplateConfigState";
import { useNodesState, Node } from "@xyflow/react";
import { TextElementNodeData } from "./nodeRenderer/TextElementNode";
import { useEditorStore } from "./useEditorStore";

export type NodeDataContextType = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  updateElementPosition: (
    elementId: number,
    x: number,
    y: number,
    isDragging?: boolean
  ) => void;
  updateElementSize: (
    elementId: number,
    width: number,
    height: number,
    isResizing?: boolean
  ) => void;
  containerWidth: number;
  containerHeight: number;
  helperLineHorizontal: number | undefined;
  helperLineVertical: number | undefined;
  setHelperLineHorizontal: (value: number | undefined) => void;
  setHelperLineVertical: (value: number | undefined) => void;
  setIsDragging: (isDragging: boolean) => void;
  setIsResizing: (isResizing: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const NodeDataContext = React.createContext<NodeDataContextType | null>(null);

export type NodeDataProps = {
  elements: GQL.CertificateElementUnion[];
  bases: UseBaseElementStateReturn;
  config: UseTemplateConfigStateReturn;
  children: React.ReactNode;
};
export const NodeDataProvider: React.FC<NodeDataProps> = ({
  elements,
  bases,
  config: { state: container },
  children,
}) => {
  const [nodes, setNodes] = useNodesState<Node>([]);

  const [containerNode, setContainerNode] = React.useState<Node>({
    id: "container",
    type: "container",
    data: {
      width: container.width,
      height: container.height,
    },
    position: { x: 0, y: 0 },
    draggable: false,
    selectable: false,
  });

  const [elementNodes, setElementNodes] = React.useState<Node[]>([]);

  // Helper line state
  const [helperLineHorizontal, setHelperLineHorizontal] = React.useState<
    number | undefined
  >(undefined);
  const [helperLineVertical, setHelperLineVertical] = React.useState<
    number | undefined
  >(undefined);

  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [isResizing, setIsResizing] = React.useState<boolean>(false);

  // Update container node when container data changes
  React.useEffect(() => {
    const node: Node = {
      id: "container",
      type: "container",
      data: {
        width: container.width,
        height: container.height,
      },
      position: { x: 0, y: 0 },
      draggable: false,
      selectable: false,
    };
    setContainerNode(node);
  }, [container]);

  // Create nodes from base states ONLY on external changes (not during drag)
  React.useEffect(() => {
    if (isDragging || isResizing) return;
    const nodes: Node[] = elements
      .map((element) => {
        // Use external base state
        const activeBaseInputState = bases.baseElementStates.get(
          element.base.id
        );
        const base = activeBaseInputState ?? element.base;

        // Create node based on element type
        if (element.base.type === GQL.ElementType.Text) {
          const data: TextElementNodeData = {
            elementId: element.base.id,
          };

          const node: Node<TextElementNodeData> = {
            id: element.base.id.toString(),
            type: "text",
            position: {
              x: base.positionX,
              y: base.positionY,
            },
            width: base.width,
            height: base.height,
            data: data,
            connectable: false,
            resizing: true,
          };
          return node;
        }
      })
      .filter((node) => node !== undefined);

    setElementNodes(nodes);
  }, [elements, bases.baseElementStates, isDragging, isResizing]);

  React.useEffect(() => {
    setNodes([containerNode, ...elementNodes]);
  }, [containerNode, elementNodes]);

  const addToHistory = useEditorStore(state => state.addToHistory);
  const undoFromStore = useEditorStore(state => state.undo);
  const redoFromStore = useEditorStore(state => state.redo);
  const canUndo = useEditorStore(state => state.canUndo());
  const canRedo = useEditorStore(state => state.canRedo());

  const updateElementPosition = React.useCallback(
    (elementId: number, x: number, y: number, isDragging: boolean = false) => {
      // Get old values for undo/redo
      const oldBase = bases.baseElementStates.get(elementId);
      if (!oldBase) return;

      const changes = [
        {
          elementId,
          property: "positionX" as const,
          oldValue: oldBase.positionX,
          newValue: x,
        },
        {
          elementId,
          property: "positionY" as const,
          oldValue: oldBase.positionY,
          newValue: y,
        },
      ];

      // Add to history only when drag ends
      if (!isDragging) {
        addToHistory(changes);
      }

      // Update external base state immediately
      // ReactFlow handles visual updates via applyNodeChanges
      bases.updateBaseElementStateFn(elementId, {
        key: "positionX",
        value: x,
      });
      bases.updateBaseElementStateFn(elementId, {
        key: "positionY",
        value: y,
      });
    },
    [bases.updateBaseElementStateFn, bases.baseElementStates, addToHistory]
  );

  const updateElementSize = React.useCallback(
    (elementId: number, width: number, height: number, isResizing: boolean = false) => {
      // Get old values for undo/redo
      const oldBase = bases.baseElementStates.get(elementId);
      if (!oldBase) return;

      const changes = [
        {
          elementId,
          property: "width" as const,
          oldValue: oldBase.width,
          newValue: width,
        },
        {
          elementId,
          property: "height" as const,
          oldValue: oldBase.height,
          newValue: height,
        },
      ];

      // Add to history only when resize ends
      if (!isResizing) {
        addToHistory(changes);
      }

      // Update external base state immediately
      // ReactFlow handles visual updates via applyNodeChanges
      bases.updateBaseElementStateFn(elementId, {
        key: "width",
        value: width,
      });
      bases.updateBaseElementStateFn(elementId, {
        key: "height",
        value: height,
      });
    },
    [bases.updateBaseElementStateFn, bases.baseElementStates, addToHistory]
  );

  const undo = React.useCallback(() => {
    const changes = undoFromStore();
    if (!changes) return;

    // Apply undo changes
    changes.forEach(change => {
      bases.updateBaseElementStateFn(change.elementId, {
        key: change.property,
        value: change.newValue,
      });
    });
  }, [undoFromStore, bases.updateBaseElementStateFn]);

  const redo = React.useCallback(() => {
    const changes = redoFromStore();
    if (!changes) return;

    // Apply redo changes
    changes.forEach(change => {
      bases.updateBaseElementStateFn(change.elementId, {
        key: change.property,
        value: change.newValue,
      });
    });
  }, [redoFromStore, bases.updateBaseElementStateFn]);

  const value = React.useMemo(
    () => ({
      nodes,
      setNodes,
      updateElementPosition,
      updateElementSize,
      containerWidth: container.width,
      containerHeight: container.height,
      helperLineHorizontal,
      helperLineVertical,
      setHelperLineHorizontal,
      setHelperLineVertical,
      setIsDragging,
      setIsResizing,
      undo,
      redo,
      canUndo,
      canRedo,
    }),
    [
      nodes,
      setNodes,
      updateElementPosition,
      updateElementSize,
      container.width,
      container.height,
      helperLineHorizontal,
      helperLineVertical,
      setIsDragging,
      setIsResizing,
      undo,
      redo,
      canUndo,
      canRedo,
    ]
  );

  return (
    <NodeDataContext.Provider value={value}>
      {children}
    </NodeDataContext.Provider>
  );
};

export const useNodeData = (): NodeDataContextType => {
  const context = React.useContext(NodeDataContext);
  if (!context) {
    throw new Error("useNodeData must be used within a NodeData");
  }
  return context;
};
