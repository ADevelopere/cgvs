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
import { getHelperLines } from "../other/utils";
import { useCertificateElementStates } from "../CertificateElementContext";
import { useNode } from "../NodesStateProvider";
import {logger} from "@/client/lib/console"

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
  
  // Track dimension changes during resize to use updated dimensions for boundary constraints
  const resizeDimensionsRef = useRef<Map<string, { width: number; height: number }>>(new Map());

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
   * Apply dimension constraints to keep node size within container bounds
   * Rules:
   * 1. When increasing size: Element cannot exceed container dimensions
   * 2. When decreasing size: Always allowed (helps fix oversized elements after container shrinks)
   * 3. Element size must account for its current position to stay within bounds
   * Complexity: ~12
   */
  const applyDimensionConstraints = useCallback(
    (change: NodeDimensionChange, nodes: Node[]): NodeDimensionChange => {
      try {
        if (change.type === "dimensions" && change.dimensions) {
          const node = nodes.find(n => n.id === change.id);
          if (!node) {
            return change;
          }

          const currentWidth = node.measured?.width ?? 0;
          const currentHeight = node.measured?.height ?? 0;
          const newWidth = change.dimensions.width;
          const newHeight = change.dimensions.height;

          // Get node position
          const nodeX = node.position?.x ?? 0;
          const nodeY = node.position?.y ?? 0;

          // Check if we're increasing or decreasing dimensions
          const isIncreasingWidth = newWidth > currentWidth;
          const isIncreasingHeight = newHeight > currentHeight;

          // When increasing: constrain to container bounds
          // When decreasing: always allow (helps fix oversized elements after container shrinks)
          if (isIncreasingWidth) {
            // Maximum width = container width - element's X position
            // This ensures element stays within container bounds
            const maxWidth = containerWidth - nodeX;
            if (newWidth > maxWidth) {
              change.dimensions.width = Math.max(maxWidth, 0);
            }
          }

          if (isIncreasingHeight) {
            // Maximum height = container height - element's Y position
            // This ensures element stays within container bounds
            const maxHeight = containerHeight - nodeY;
            if (newHeight > maxHeight) {
              change.dimensions.height = Math.max(maxHeight, 0);
            }
          }

          // When decreasing: no constraints applied
          // This allows users to shrink oversized elements that resulted from
          // container size reduction or manual resizing beyond bounds
        }
      } catch {
        // If dimension constraints fail, return unchanged
        return change;
      }

      return change;
    },
    [containerWidth, containerHeight]
  );

  /**
   * Apply boundary constraints to keep node within container
   * Complexity: ~10
   */
  const applyBoundaryConstraints = useCallback(
    (change: NodePositionChange, nodes: Node[]): NodePositionChange => {
      try {
        logger.log("Applying boundary constraints");
        if (change.type === "position" && change.position) {
          logger.log("Container dimensions:", containerWidth, containerHeight);
          logger.log("change.position before constraints:", change.position);
          const node = nodes.find(n => n.id === change.id);
          if (!node) {
            return change;
          }

          // Use updated dimensions from resize if available, otherwise use measured dimensions
          const resizeDimensions = resizeDimensionsRef.current.get(change.id);
          const nodeWidth = resizeDimensions?.width ?? node.measured?.width ?? 0;
          const nodeHeight = resizeDimensions?.height ?? node.measured?.height ?? 0;

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

          logger.log("change.position after constraints:", change.position);
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
      logger.log("Position change:", change);
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
   * Handle dimension changes - apply constraints and update state when resize ends
   * Complexity: ~8
   */
  const handleDimensionChange = useCallback(
    (change: NodeDimensionChange, nodes: Node[]): NodeDimensionChange => {
      try {
        const elementId = Number.parseInt(change.id, 10);
        if (Number.isNaN(elementId)) {
          return change;
        }

        // Apply dimension constraints to keep element within container bounds
        const constrainedChange = applyDimensionConstraints(change, nodes);

        // Track dimensions during resize for boundary constraint calculations
        if (constrainedChange.type === "dimensions" && constrainedChange.dimensions) {
          const width = constrainedChange.dimensions.width;
          const height = constrainedChange.dimensions.height;
          
          if (constrainedChange.resizing) {
            // Store current dimensions during resize for use in position constraint calculations
            resizeDimensionsRef.current.set(constrainedChange.id, { width, height });
            
            // Update with isResizing=true for visual feedback
            updateElementSize(elementId, width, height, true);
          } else {
            // Clear stored dimensions when resize ends
            resizeDimensionsRef.current.delete(constrainedChange.id);
            
            // Use queueMicrotask for better performance than setTimeout
            queueMicrotask(() => {
              // Update with isResizing=false to add to history
              updateElementSize(elementId, width, height, false);
            });
          }
        }

        return constrainedChange;
      } catch {
        // If dimension change fails, return unchanged
        return change;
      }
    },
    [applyDimensionConstraints, updateElementSize]
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
          return handleDimensionChange(change, nodes);
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
