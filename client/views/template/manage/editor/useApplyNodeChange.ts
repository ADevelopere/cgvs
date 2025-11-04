import { useCallback, useRef } from "react";
import {
  Node,
  NodeChange,
  NodePositionChange,
  NodeDimensionChange,
  applyNodeChanges as applyReactFlowNodeChanges,
} from "@xyflow/react";
import { useNodeData } from "./NodeDataProvider";
import { useEditorStore } from "./useEditorStore";
import { getHelperLines } from "./other/utils";

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
  const {
    updateElementPosition,
    updateElementSize,
    containerWidth,
    containerHeight,
    setHelperLineHorizontal,
    setHelperLineVertical,
  } = useNodeData();
  const { setCurrentElementId } = useEditorStore();

  /**
   * Apply helper lines for snapping during drag
   * Complexity: ~8
   */
  const applyHelperLines = useCallback(
    (change: NodePositionChange, nodes: Node[]): HelperLinesResult => {
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
    },
    []
  );

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

        // Update element position when drag ends
        if (
          constrainedChange.type === "position" &&
          !constrainedChange.dragging &&
          constrainedChange.position
        ) {
          const elementId = Number.parseInt(constrainedChange.id, 10);
          if (!Number.isNaN(elementId)) {
            const x = constrainedChange.position.x;
            const y = constrainedChange.position.y;
            setTimeout(() => {
              updateElementPosition(elementId, x, y);
            }, 0);
          }
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
        if (
          change.type === "dimensions" &&
          !change.resizing &&
          change.dimensions
        ) {
          const elementId = Number.parseInt(change.id, 10);
          if (!Number.isNaN(elementId)) {
            const width = change.dimensions.width;
            const height = change.dimensions.height;
            setTimeout(() => {
              updateElementSize(elementId, width, height);
            }, 0);
          }
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
            setTimeout(() => setCurrentElementId(idNum), 0);
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
        // Defer helper line state updates to avoid setState during render
        setTimeout(() => {
          setHelperLineHorizontal(undefined);
          setHelperLineVertical(undefined);
        }, 0);

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

            // Defer helper line state updates to avoid setState during render
            setTimeout(() => {
              setHelperLineHorizontal(helperLines.horizontal);
              setHelperLineVertical(helperLines.vertical);
            }, 0);
          }
        }

        // Process all changes through handlers
        const processedChanges = changes.map(change =>
          processChange(change, nodes)
        );

        // Apply ReactFlow's node changes
        return applyReactFlowNodeChanges(processedChanges, nodes);
      } catch {
        // If processing fails, apply changes without custom logic
        return applyReactFlowNodeChanges(changes, nodes);
      }
    },
    [
      applyHelperLines,
      processChange,
      setHelperLineHorizontal,
      setHelperLineVertical,
    ]
  );

  return {
    applyNodeChanges,
  };
};
