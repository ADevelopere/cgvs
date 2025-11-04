import * as GQL from "@/client/graphql/generated/gql/graphql";
import React from "react";
import { UseBaseElementStateReturn } from "./form/hooks";
import { UseTemplateConfigStateReturn } from "./form/config/useTemplateConfigState";
import { useNodesState, Node } from "@xyflow/react";
import { TextElementNodeData } from "./nodeRenderer/TextElementNode";
import { useEditorStore } from "./useEditorStore";
import { BaseCertificateElementFormState } from "./form/element/base/types";

export type NodeDataContextType = {
  nodes: Node[];
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

  // Single dragging/resizing node state - only for the node currently being interacted with
  const [draggingNodeState, setDraggingNodeState] = React.useState<{
    elementId: number;
    state: BaseCertificateElementFormState;
  } | null>(null);

  const [containerNode, setContainerNode] = React.useState<Node>({
    id: "container",
    type: "container",
    data: {},
    position: { x: 0, y: 0 },
    draggable: false,
    selectable: false,
    style: {
      width: container.width,
      height: container.height,
      border: "2px solid #000000",
      boxSizing: "border-box",
      backgroundColor: "transparent",
    },
  });

  const [elementNodes, setElementNodes] = React.useState<Node[]>([]);

  // Helper line state
  const [helperLineHorizontal, setHelperLineHorizontal] = React.useState<
    number | undefined
  >(undefined);
  const [helperLineVertical, setHelperLineVertical] = React.useState<
    number | undefined
  >(undefined);

  // Clear dragging node state when external base states change (external update happened)
  React.useEffect(() => {
    // If we have a dragging node and external state changed, clear it
    // This handles the case where drag ended and external state was updated
    if (draggingNodeState) {
      const externalState = bases.baseElementStates.get(
        draggingNodeState.elementId
      );
      if (externalState) {
        // Check if external state matches our dragging state (drag completed)
        const matches =
          externalState.positionX === draggingNodeState.state.positionX &&
          externalState.positionY === draggingNodeState.state.positionY &&
          externalState.width === draggingNodeState.state.width &&
          externalState.height === draggingNodeState.state.height;

        if (matches) {
          // External state synced, clear dragging state
          setDraggingNodeState(null);
        }
      }
    }
  }, [bases.baseElementStates, draggingNodeState]);

  // Update container node when container data changes
  React.useEffect(() => {
    const node: Node = {
      id: "container",
      type: "container",
      data: {},
      position: { x: 0, y: 0 },
      draggable: false,
      selectable: false,
      style: {
        width: container.width,
        height: container.height,
        border: "2px solid #000000",
        boxSizing: "border-box",
        backgroundColor: "transparent",
      },
    };
    setContainerNode(node);
  }, [container]);

  // Create nodes from base states (with override for dragging node)
  React.useEffect(() => {
    const elementNodes: Node[] = elements
      .map((element) => {
        // Check if this is the dragging node
        const isDraggingThisNode =
          draggingNodeState?.elementId === element.base.id;

        // Use dragging state if available, otherwise use external base state
        const activeBaseInputState = bases.baseElementStates.get(
          element.base.id
        );
        const externalBase = activeBaseInputState ?? element.base;
        const base = isDraggingThisNode
          ? draggingNodeState.state
          : externalBase;

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

    setNodes([containerNode, ...elementNodes]);
  }, [elements, bases.baseElementStates, draggingNodeState, containerNode, setNodes]);

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

      if (isDragging) {
        // During drag: Update dragging node state for smooth visual feedback
        setDraggingNodeState({
          elementId,
          state: { ...oldBase, positionX: x, positionY: y },
        });
      }

      // Always update external base state immediately
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

      if (isResizing) {
        // During resize: Update dragging node state for smooth visual feedback
        setDraggingNodeState({
          elementId,
          state: { ...oldBase, width, height },
        });
      }

      // Always update external base state immediately
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

  const setIsDragging = React.useCallback((isDragging: boolean) => {
    // Clear dragging node state when drag ends
    if (!isDragging) {
      setDraggingNodeState(null);
    }
  }, []);

  const setIsResizing = React.useCallback((isResizing: boolean) => {
    // Clear dragging node state when resize ends
    if (!isResizing) {
      setDraggingNodeState(null);
    }
  }, []);

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
