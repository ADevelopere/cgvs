import React from "react";
import { Node } from "@xyflow/react";
import { useEditorStore } from "./useEditorStore";
import { logger } from "@/client/lib/logger";
import { useNodesStore } from "./NodesStoreProvider";
import { useCertificateElementStates } from "./CertificateElementContext";

/**
 * Return type for useNodeData hook
 */
export interface UseNodeDataReturn {
  templateId: number | null;
  nodes: Node[];
  loading: boolean;
  error: Error | null;
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
  // Node update actions
  updateBaseNodeData: (
    elementId: number,
    updates: Partial<import("./types").ElementBaseNodeData>
  ) => void;
  updateContainerNode: (
    updates: Partial<import("./types").ContainerNodeData>
  ) => void;
}

/**
 * Hook for managing ReactFlow nodes and editor state
 * Automatically fetches data from URL params and initializes nodes
 * Gets bases and config from useCertificateElementStates
 */
export function useNodeData(): UseNodeDataReturn {
  // Get bases and config from certificate element context
  const { bases, config } = useCertificateElementStates();
  const containerWidth = config.state.width;
  const containerHeight = config.state.height;

  // Use the nodes hook - it automatically fetches data and initializes nodes
  const {
    nodes,
    setNodes: setNodesInStore,
    templateId,
    loading: nodesLoading,
    error: nodesError,
    updateBaseNodeData: updateBaseNodeDataFromStore,
    updateContainerNode: updateContainerNodeFromStore,
  } = useNodesStore();

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

  // Log loading/error states
  React.useEffect(() => {
    if (nodesLoading) {
      logger.debug("NodeDataProvider: Loading nodes...", { templateId });
    }
    if (nodesError) {
      logger.error("NodeDataProvider: Error loading nodes", {
        templateId,
        error: nodesError,
      });
    }
    if (!nodesLoading && !nodesError && nodes.length > 0) {
      logger.debug("NodeDataProvider: Nodes loaded successfully", {
        templateId,
        nodeCount: nodes.length,
      });
    }
  }, [nodesLoading, nodesError, nodes.length, templateId]);

  // Wrapper for setNodes
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

  return {
    templateId,
    nodes,
    loading: nodesLoading,
    error: nodesError,
    setNodes,
    updateElementPosition,
    updateElementSize,
    containerWidth,
    containerHeight,
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
    updateBaseNodeData: updateBaseNodeDataFromStore,
    updateContainerNode: updateContainerNodeFromStore,
  };
}
