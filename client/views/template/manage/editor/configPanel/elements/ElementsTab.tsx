import React, { useState, useEffect } from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { Stack } from "@mui/material";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { SortableCertificateElementsTabItem } from "./SortableCertificateElementsTabItem";
import { useMutation } from "@apollo/client/react";
import {
  deleteElementMutationDocument,
  updateElementCommonPropertiesMutationDocument,
  moveElementMutationDocument,
} from "../../glqDocuments/element/element.documents";
import { extractBaseStateInputFromElement } from "../../form/hooks/useBaseElementState";
import { useCertificateElementStates } from "../../context/CertificateElementContext";
import { useNode } from "../../context/NodesStateProvider";
import { useNotifications } from "@toolpad/core/useNotifications";

export type ElementsTabProps = {
  elements: GQL.CertificateElementUnion[];
};

export const ElementsTab: React.FC<ElementsTabProps> = ({ elements }) => {
  const [localElements, setLocalElements] = useState<GQL.CertificateElementUnion[]>([]);
  const [moveElementMutation] = useMutation(moveElementMutationDocument);
  const [deleteElementMutation] = useMutation(deleteElementMutationDocument);
  const [updateElementMutation] = useMutation(updateElementCommonPropertiesMutationDocument);
  const { bases: baseElements } = useCertificateElementStates();
  const { reorderNodes, toggleNodeVisibility } = useNode();
  const notifications = useNotifications();

  // Sort elements by zIndex and sync with local state
  useEffect(() => {
    const sortedElements = [...elements].sort((a, b) => a.base.zIndex - b.base.zIndex);
    setLocalElements(sortedElements);
  }, [elements]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const moveElement = React.useCallback(
    async (elementId: number, newZIndex: number) => {
      const result = await moveElementMutation({ variables: { input: { elementId, newZIndex } } }).catch(() => {
        // Revert on error
        setLocalElements(localElements);
        notifications.show("Failed to move element", { severity: "error", autoHideDuration: 3000 });
      });
      const movedElement = result?.data?.moveElement;
      if (movedElement) {
        // Update base element states
        for (const elem of movedElement) {
          baseElements.updateBaseElementStateFn(elem.base.id, { key: "zIndex", value: elem.base.zIndex });
        }

        // const movedNodeElements = movedElement.map((elem, index) => ({
        //   elementId: elem.base.id,
        //   newZIndex: index + 1,
        // }));
        // reorderNodes(movedNodeElements);
      }
    },
    [moveElementMutation, localElements, baseElements, reorderNodes]
  );

  const handleDragEnd = React.useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = localElements.findIndex(el => el.base.id === active.id);
      const newIndex = localElements.findIndex(el => el.base.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      // Update local state immediately for responsive UI
      const reorderedElements = arrayMove(localElements, oldIndex, newIndex);
      setLocalElements(reorderedElements);

      // Call mutation with new zIndex (1-indexed)
      const elementId = active.id as number;
      const newZIndex = newIndex + 1;

      await moveElement(elementId, newZIndex);
      setLocalElements(reorderedElements);
    },
    [localElements, moveElement]
  );

  const handleToggleHidden = React.useCallback(
    async (id: number) => {
      const element = localElements.find(el => el.base.id === id);
      if (!element) return;

      const state = extractBaseStateInputFromElement(element);
      const result = await updateElementMutation({
        variables: {
          input: {
            id,
            ...state,
            hidden: element.base.hidden ? false : true,
          },
        },
      }).catch(() => {
        notifications.show("Failed to update element visibility.", { severity: "error", autoHideDuration: 3000 });
        // Revert on error
      });

      const updatedElement = result?.data?.updateElementCommonProperties;
      if (updatedElement) {
        baseElements.updateBaseElementStateFn(id, { key: "hidden", value: updatedElement.base.hidden });
      }
    },
    [localElements, updateElementMutation, toggleNodeVisibility]
  );

  const handleDeleteElement = React.useCallback(
    async (_id: number) => {
      // try {
      //   await deleteElementMutation({
      //     variables: {
      //       deleteElementId: id,
      //     },
      //   });
      // } catch (_error) {
      //   // Error handling
      // }
    },
    [deleteElementMutation]
  );

  const handleManageElement = (_id: number) => {
    // TODO: Implement element management logic
  };

  const handleIncreaseOrder = React.useCallback(
    async (id: number) => {
      const element = localElements.find(el => el.base.id === id);
      if (!element) return;

      const newZIndex = element.base.zIndex - 1;
      await moveElement(id, newZIndex);
    },
    [localElements, moveElement]
  );

  const handleDecreaseOrder = React.useCallback(
    async (id: number) => {
      const element = localElements.find(el => el.base.id === id);
      if (!element) return;

      const newZIndex = element.base.zIndex + 1;

      await moveElement(id, newZIndex);
    },
    [localElements, moveElement]
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={localElements.map(el => el.base.id)} strategy={verticalListSortingStrategy}>
        <Stack direction={"column"} spacing={1}>
          {localElements.map(element => (
            <SortableCertificateElementsTabItem
              key={element.base.id}
              id={element.base.id}
              element={element}
              toggleElementHidden={handleToggleHidden}
              deleteElement={handleDeleteElement}
              manageElement={handleManageElement}
              increaseOrder={() => handleIncreaseOrder(element.base.id)}
              decreaseOrder={() => handleDecreaseOrder(element.base.id)}
            />
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
};
