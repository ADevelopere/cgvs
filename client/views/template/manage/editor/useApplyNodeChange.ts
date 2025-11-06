import { useCallback, useRef } from "react";
import {
  Node,
  NodeChange,
  NodePositionChange,
  NodeDimensionChange,
  applyNodeChanges as applyReactFlowNodeChanges,
} from "@xyflow/react";
import { useFlowUpdater } from "./useNodeUpdater";
import { useEditorStore } from "./useEditorStore";
import { getHelperLines } from "./other/utils";
import { useCertificateElementStates } from "./CertificateElementContext";
import { useNode } from "./NodesStateProvider";

type HelperLinesResult = {
  horizontal: number | undefined;
  vertical: number | undefined;
  snapPosition: { x?: number; y?: number };
};

/**
 * Hook that provides a function to apply node changes with custom logic
 * Handles position changes, dimension changes, selection changes, and boundary constraints
 */
export const useApplyNodeChange = () => {
  const { updateElementPosition, updateElementSize } = useFlowUpdater();
  const { setCurrentElementId } = useEditorStore();
  const { setHelperLineHorizontal, setHelperLineVertical } = useNode();

  const {
    config: {
      state: { width: containerWidth, height: containerHeight },
    },
  } = useCertificateElementStates();

  // Use refs to batch state updates and avoid re-renders during drag
  const helperLinesRef = useRef<{
    horizontal: number | undefined;
    vertical: number | undefined;
  }>({ horizontal: undefined, vertical: undefined });
  const updateHelperLinesTimeoutRef = useRef<number | null>(null);

  /**
   * Apply helper lines for snapping during drag
   * Complexity: ~8
   */
  const applyHelperLines = useCallback((change: NodePositionChange, nodes: Node[]): HelperLinesResult => {
    try {
      if (change.type === "position" && change.dragging && change.position) {
        const helperLines = getHelperLines(change, nodes);
        return {
          horizontal: helperLines.horizontal,
          vertical: helperLines.vertical,
          snapPosition: helperLines.snapPosition,
        };
      }
    } catch {
      // If helper lines fail, return no snapping
      return {
        horizontal: undefined,
        vertical: undefined,
        snapPosition: {},
      };
    }

    return {
      horizontal: undefined,
      vertical: undefined,
      snapPosition: {},
    };
  }, []);

  /**
   * Apply boundary constraints to keep node within container
   * Complexity: ~10
   */
  const applyBoundaryConstraints = useCallback(
    (change: NodePositionChange, nodes: Node[]): NodePositionChange => {
      try {
        if (change.type === "position" && change.dragging && change.position) {
          const node = nodes.find(n => n.id === change.id);
          if (!node) {
            return change;
          }

          const nodeWidth = node.measured?.width ?? 0;
          const nodeHeight = node.measured?.height ?? 0;

          const maxX = containerWidth - nodeWidth;
          const maxY = containerHeight - nodeHeight;

          // Constrain X position
          if (change.position.x < 0) {
            change.position.x = 0;
          } else if (change.position.x > maxX) {
            change.position.x = maxX;
          }

          // Constrain Y position
          if (change.position.y < 0) {
            change.position.y = 0;
          } else if (change.position.y > maxY) {
            change.position.y = maxY;
          }
        }
      } catch {
        // If boundary constraints fail, return unchanged
        return change;
      }

      return change;
    },
    [containerWidth, containerHeight]
  );

  /**
   * Handle position changes - apply constraints and update state when drag ends
   * Complexity: ~8
   */
  const handlePositionChange = useCallback(
    (change: NodePositionChange, nodes: Node[]): NodePositionChange => {
      try {
        // Apply boundary constraints during drag
        const constrainedChange = applyBoundaryConstraints(change, nodes);

        const elementId = Number.parseInt(constrainedChange.id, 10);
        if (Number.isNaN(elementId)) {
          return constrainedChange;
        }

        // Update position during drag (with isDragging flag)
        if (constrainedChange.type === "position" && constrainedChange.dragging && constrainedChange.position) {
          const x = constrainedChange.position.x;
          const y = constrainedChange.position.y;
          // Update with isDragging=true for visual feedback
          updateElementPosition(elementId, x, y, true);
        }

        // Update element position when drag ends
        if (constrainedChange.type === "position" && !constrainedChange.dragging && constrainedChange.position) {
          const x = constrainedChange.position.x;
          const y = constrainedChange.position.y;
          // Use queueMicrotask for better performance than setTimeout
          queueMicrotask(() => {
            // Update with isDragging=false to add to history
            updateElementPosition(elementId, x, y, false);
          });
        }

        return constrainedChange;
      } catch {
        return change;
      }
    },
    [applyBoundaryConstraints, updateElementPosition]
  );

  /**
   * Handle dimension changes - update state when resize ends
   * Complexity: ~6
   */
  const handleDimensionChange = useCallback(
    (change: NodeDimensionChange): NodeDimensionChange => {
      try {
        const elementId = Number.parseInt(change.id, 10);
        if (Number.isNaN(elementId)) {
          return change;
        }

        // Update size during resize (with isResizing flag)
        if (change.type === "dimensions" && change.resizing && change.dimensions) {
          const width = change.dimensions.width;
          const height = change.dimensions.height;
          // Update with isResizing=true for visual feedback
          updateElementSize(elementId, width, height, true);
        }

        // Update size when resize ends
        if (change.type === "dimensions" && !change.resizing && change.dimensions) {
          const width = change.dimensions.width;
          const height = change.dimensions.height;
          // Use queueMicrotask for better performance than setTimeout
          queueMicrotask(() => {
            // Update with isResizing=false to add to history
            updateElementSize(elementId, width, height, false);
          });
        }
      } catch {
        // If dimension change fails, return unchanged
        return change;
      }

      return change;
    },
    [updateElementSize]
  );

  /**
   * Handle selection changes - update editor store when node is selected
   * Complexity: ~4
   */
  const handleSelectionChange = useCallback(
    (change: NodeChange): NodeChange => {
      try {
        if (change.type === "select" && change.selected) {
          const idNum = Number.parseInt(change.id, 10);
          if (!Number.isNaN(idNum)) {
            // Use queueMicrotask for better performance than setTimeout
            queueMicrotask(() => setCurrentElementId(idNum));
          }
        }
      } catch {
        // If selection change fails, return unchanged
        return change;
      }

      return change;
    },
    [setCurrentElementId]
  );

  /**
   * Process a single change by routing to appropriate handler
   * Complexity: ~8
   */
  const processChange = useCallback(
    (change: NodeChange, nodes: Node[]): NodeChange => {
      try {
        if (change.type === "position") {
          return handlePositionChange(change, nodes);
        }

        if (change.type === "dimensions") {
          return handleDimensionChange(change);
        }

        if (change.type === "select") {
          return handleSelectionChange(change);
        }

        // For other change types (add, remove, reset), return unchanged
        return change;
      } catch {
        return change;
      }
    },
    [handlePositionChange, handleDimensionChange, handleSelectionChange]
  );

  /**
   * Main function to apply node changes with custom logic
   * Complexity: ~10
   */
  const applyNodeChanges = useCallback(
    (changes: NodeChange[], nodes: Node[]): Node[] => {
      try {
        // Handle single position change for helper lines
        if (changes.length === 1 && changes[0].type === "position") {
          const firstChange = changes[0];
          if (firstChange.dragging && firstChange.position) {
            const helperLines = applyHelperLines(firstChange, nodes);

            // Apply snap position
            if (helperLines.snapPosition.x !== undefined) {
              firstChange.position.x = helperLines.snapPosition.x;
            }
            if (helperLines.snapPosition.y !== undefined) {
              firstChange.position.y = helperLines.snapPosition.y;
            }

            // Update ref immediately for synchronous access
            helperLinesRef.current = {
              horizontal: helperLines.horizontal,
              vertical: helperLines.vertical,
            };

            // Batch state updates using requestAnimationFrame for better performance
            if (updateHelperLinesTimeoutRef.current) {
              cancelAnimationFrame(updateHelperLinesTimeoutRef.current);
            }
            updateHelperLinesTimeoutRef.current = requestAnimationFrame(() => {
              setHelperLineHorizontal(helperLines.horizontal);
              setHelperLineVertical(helperLines.vertical);
            });
          } else {
            // Clear helper lines when not dragging
            helperLinesRef.current = {
              horizontal: undefined,
              vertical: undefined,
            };
            if (updateHelperLinesTimeoutRef.current) {
              cancelAnimationFrame(updateHelperLinesTimeoutRef.current);
            }
            updateHelperLinesTimeoutRef.current = requestAnimationFrame(() => {
              setHelperLineHorizontal(undefined);
              setHelperLineVertical(undefined);
            });
          }
        }

        // Process all changes through handlers
        const processedChanges = changes.map(change => processChange(change, nodes));

        // Apply ReactFlow's node changes
        return applyReactFlowNodeChanges(processedChanges, nodes);
      } catch {
        // If processing fails, apply changes without custom logic
        return applyReactFlowNodeChanges(changes, nodes);
      }
    },
    [applyHelperLines, processChange, setHelperLineHorizontal, setHelperLineVertical]
  );

  return {
    applyNodeChanges,
  };
};
