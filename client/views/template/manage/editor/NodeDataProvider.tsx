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
  updateElementPosition: (elementId: number, x: number, y: number) => void;
  updateElementSize: (elementId: number, width: number, height: number) => void;
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

  // Visual base states - used for rendering nodes during drag/resize
  // Using the same type as baseElementStates for compatibility
  const [visualBaseStates, setVisualBaseStates] = React.useState<
    Map<number, BaseCertificateElementFormState>
  >(new Map());

  // Flags to prevent external updates during user interactions
  const isDraggingRef = React.useRef(false);
  const isResizingRef = React.useRef(false);

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

  // Sync external base state changes to visual base states (only when not dragging/resizing)
  React.useEffect(() => {
    if (isDraggingRef.current || isResizingRef.current) {
      return; // Skip external updates during user interactions
    }

    // Copy external base states to visual base states
    setVisualBaseStates(new Map(bases.baseElementStates));
  }, [bases.baseElementStates]);

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

  // Create nodes from visual base states
  React.useEffect(() => {
    const nodes: Node[] = elements
      .map(element => {
        // Use visual base state for rendering
        const visualBase = visualBaseStates.get(element.base.id);
        const base = visualBase ?? element.base;

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
      .filter(node => node !== undefined);

    setElementNodes(nodes);
  }, [elements, visualBaseStates, setElementNodes]);

  React.useEffect(() => {
    setNodes([containerNode, ...elementNodes]);
  }, [containerNode, elementNodes, setNodes]);

  const addToHistory = useEditorStore(state => state.addToHistory);
  const undoFromStore = useEditorStore(state => state.undo);
  const redoFromStore = useEditorStore(state => state.redo);
  const canUndo = useEditorStore(state => state.canUndo());
  const canRedo = useEditorStore(state => state.canRedo());

  const updateElementPosition = React.useCallback(
    (elementId: number, x: number, y: number) => {
      // Get old values for undo/redo
      const oldBase = visualBaseStates.get(elementId);
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

      // Add to history for undo/redo
      addToHistory(changes);

      // Update visual base state immediately for smooth rendering
      setVisualBaseStates(prev => {
        const next = new Map(prev);
        const base = next.get(elementId);
        if (base) {
          next.set(elementId, { ...base, positionX: x, positionY: y });
        }
        return next;
      });

      // Sync to external base state (will be reflected when drag ends)
      bases.updateBaseElementStateFn(elementId, {
        key: "positionX",
        value: x,
      });
      bases.updateBaseElementStateFn(elementId, {
        key: "positionY",
        value: y,
      });
    },
    [bases.updateBaseElementStateFn, visualBaseStates, addToHistory]
  );

  const updateElementSize = React.useCallback(
    (elementId: number, width: number, height: number) => {
      // Get old values for undo/redo
      const oldBase = visualBaseStates.get(elementId);
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

      // Add to history for undo/redo
      addToHistory(changes);

      // Update visual base state immediately for smooth rendering
      setVisualBaseStates(prev => {
        const next = new Map(prev);
        const base = next.get(elementId);
        if (base) {
          next.set(elementId, { ...base, width, height });
        }
        return next;
      });

      // Sync to external base state (will be reflected when resize ends)
      bases.updateBaseElementStateFn(elementId, {
        key: "width",
        value: width,
      });
      bases.updateBaseElementStateFn(elementId, {
        key: "height",
        value: height,
      });
    },
    [bases.updateBaseElementStateFn, visualBaseStates, addToHistory]
  );

  const setIsDragging = React.useCallback((isDragging: boolean) => {
    isDraggingRef.current = isDragging;
  }, []);

  const setIsResizing = React.useCallback((isResizing: boolean) => {
    isResizingRef.current = isResizing;
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
