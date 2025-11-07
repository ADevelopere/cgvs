import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CertificateElementsTabItem, CertificateElementsTabItemProps } from "./CertificateElementsTabItem";
import { Box } from "@mui/material";

export type SortableCertificateElementsTabItemProps = CertificateElementsTabItemProps & {
  id: string | number;
};

export const SortableCertificateElementsTabItem: React.FC<SortableCertificateElementsTabItemProps> = ({
  id,
  ...props
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CertificateElementsTabItem {...props} />
    </Box>
  );
};
