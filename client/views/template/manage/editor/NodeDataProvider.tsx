import * as GQL from "@/client/graphql/generated/gql/graphql";
import React from "react";
import { UseBaseElementStateReturn } from "./form/hooks";
import { UseTemplateConfigStateReturn } from "./form/config/useTemplateConfigState";
import { Node } from "@xyflow/react";
import { useEditorStore } from "./useEditorStore";
import { logger } from "@/client/lib/logger";
import { useNodesStore } from "./useNodesStore";
import { useLazyQuery } from "@apollo/client/react";
import { elementsByTemplateIdQueryDocument } from "./glqDocuments";

export type NodeDataContextType = {
  templateId: number;
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
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
  templateId: number;
  elements: GQL.CertificateElementUnion[];
  bases: UseBaseElementStateReturn;
  config: UseTemplateConfigStateReturn;
  children: React.ReactNode;
};

export const NodeDataProvider: React.FC<NodeDataProps> = ({
  templateId,
  bases,
  config: { state: container },
  children,
}) => {
  // Get nodes from the store - they're exposed as state so components re-render on updates
  const nodes = useNodesStore((state) => state.nodes);
  const setNodesInStore = useNodesStore((state) => state.setNodes);
  const initializeNodes = useNodesStore((state) => state.initializeNodes);

  // Helper line state (kept local as it's UI-only)
  const [helperLineHorizontal, setHelperLineHorizontal] = React.useState<
    number | undefined
  >(undefined);
  const [helperLineVertical, setHelperLineVertical] = React.useState<
    number | undefined
  >(undefined);

  // Drag/resize state for future use or optimization
  const [, setIsDragging] = React.useState<boolean>(false);
  const [, setIsResizing] = React.useState<boolean>(false);

  const [fetchElementsByTemplateId] = useLazyQuery(
    elementsByTemplateIdQueryDocument
  );

  // Initialize nodes once when component mounts or templateId changes
  React.useEffect(() => {
    let canceled = false;
    const load = async () => {
      if (nodes.length === 0) {
        try {
          const result = await fetchElementsByTemplateId({
            variables: { templateId },
          });
          if (result.error) {
            logger.error("NodeDataProvider: Error fetching elements", {
              templateId,
              error: result.error,
            });
            return;
          }

          const elements = result.data?.elementsByTemplateId || [];
          logger.debug("NodeDataProvider: Initializing nodes in store", {
            templateId,
            elementCount: elements.length,
          });
          if (!canceled) {
            initializeNodes(elements, {
              width: container.width,
              height: container.height,
            });
          }
        } catch (error) {
          logger.error("NodeDataProvider: Error fetching elements", {
            templateId,
            error,
          });
        }
      }
    };
    void load();
    return () => {
      canceled = true;
    };
  }, [templateId, nodes.length, fetchElementsByTemplateId, initializeNodes, container.width, container.height]);

  // Wrapper for setNodes that uses the store
  const setNodes = React.useCallback(
    (newNodes: Node[]) => {
      setNodesInStore(newNodes);
    },
    [setNodesInStore]
  );

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

      // Update base state which will update the store via the enhanced updateFn
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
    (
      elementId: number,
      width: number,
      height: number,
      isResizing: boolean = false
    ) => {
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

      // Update base state which will update the store via the enhanced updateFn
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

    // Apply undo changes - updates both base state and nodes store
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

    // Apply redo changes - updates both base state and nodes store
    changes.forEach(change => {
      bases.updateBaseElementStateFn(change.elementId, {
        key: change.property,
        value: change.newValue,
      });
    });
  }, [redoFromStore, bases.updateBaseElementStateFn]);

  const value = React.useMemo(
    () => ({
      templateId,
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
      templateId,
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
