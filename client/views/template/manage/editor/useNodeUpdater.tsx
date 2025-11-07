import React from "react";
import { useEditorStore } from "./useEditorStore";
import { useCertificateElementStates } from "./CertificateElementContext";

/**
 * Return type for useNodeData hook
 */
export interface UseFlowUpdaterReturn {
  updateElementPosition: (elementId: number, x: number, y: number, isDragging?: boolean) => void;
  updateElementSize: (elementId: number, width: number, height: number, isResizing?: boolean) => void;
  undo: () => void;
  redo: () => void;
}

/**
 * Hook for managing ReactFlow nodes and editor state
 * Automatically fetches data from URL params and initializes nodes
 * Gets bases and config from useCertificateElementStates
 */
export function useFlowUpdater(): UseFlowUpdaterReturn {
  // Get bases and config from certificate element context
  const { bases } = useCertificateElementStates();

  const addToHistory = useEditorStore(state => state.addToHistory);
  const undoFromStore = useEditorStore(state => state.undo);
  const redoFromStore = useEditorStore(state => state.redo);

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
    updateElementPosition,
    updateElementSize,
    undo,
    redo,
  };
}
