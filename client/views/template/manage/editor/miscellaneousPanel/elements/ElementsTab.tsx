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

export type ElementsTabProps = {
  elements: GQL.CertificateElementUnion[];
};

export const ElementsTab: React.FC<ElementsTabProps> = ({ elements }) => {
  const [localElements, setLocalElements] = useState<GQL.CertificateElementUnion[]>([]);
  const [moveElementMutation] = useMutation(moveElementMutationDocument);
  const [deleteElementMutation] = useMutation(deleteElementMutationDocument);
  const [updateElementMutation] = useMutation(updateElementCommonPropertiesMutationDocument);

  // Sort elements by renderOrder and sync with local state
  useEffect(() => {
    const sortedElements = [...elements].sort((a, b) => a.base.renderOrder - b.base.renderOrder);
    setLocalElements(sortedElements);
  }, [elements]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
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

    // Call mutation with new renderOrder (1-indexed)
    const elementId = active.id as number;
    const newRenderOrder = newIndex + 1;

    moveElementMutation({ variables: { input: { elementId, newRenderOrder } } }).catch(() => {
      // Revert on error
      setLocalElements(localElements);
    });
  };

  const handleToggleHidden = async (id: number) => {
    const element = localElements.find(el => el.base.id === id);
    if (!element) return;

    const state = extractBaseStateInputFromElement(element);
    try {
      await updateElementMutation({
        variables: {
          input: {
            id,
            ...state,
            hidden: !element.base.hidden,
          },
        },
      });
    } catch (_error) {
      // Error handling
    }
  };

  const handleDeleteElement = async (id: number) => {
    try {
      await deleteElementMutation({
        variables: {
          deleteElementId: id,
        },
      });
    } catch (_error) {
      // Error handling
    }
  };

  const handleManageElement = (id: number) => {
    // TODO: Implement element management logic
    console.log("Manage element:", id);
  };

  const handleIncreaseOrder = (id: number) => {
    const element = localElements.find(el => el.base.id === id);
    if (!element) return;

    const newRenderOrder = element.base.renderOrder - 1;

    moveElementMutation({ variables: { input: { elementId: id, newRenderOrder } } });
  };

  const handleDecreaseOrder = (id: number) => {
    const element = localElements.find(el => el.base.id === id);
    if (!element) return;

    const newRenderOrder = element.base.renderOrder + 1;

    moveElementMutation({ variables: { input: { elementId: id, newRenderOrder } } });
  };

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
