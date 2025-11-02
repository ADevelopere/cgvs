import {
  CertificateElementUnion,
  ElementType,
  TextElement,
} from "@/client/graphql/generated/gql/graphql";
import { Stack, Typography } from "@mui/material";
import { CertificateElementIcon } from "../elements/ElementIcon";
import { CurrentTextElement } from "./CurrentTextElement";
import { useEditorStore } from "../../useEditorStore";
import React from "react";

export type CertificateElementCurrentItemSettingsProps = {
  elements: CertificateElementUnion[];
};

export const CertificateElementCurrentItemSettings: React.FC<
  CertificateElementCurrentItemSettingsProps
> = ({ elements }) => {
  const { currentElementId } = useEditorStore();

  const currentElement = React.useMemo(() => {
    return elements.find(el => el.base.id === currentElementId);
  }, [currentElementId, elements]);

  const renderElement = React.useMemo(() => {
    if (!currentElement) {
      return null;
    }
    switch (currentElement.base.type) {
      case ElementType.Text:
        return (
          <CurrentTextElement
            element={currentElement as TextElement}
            elements={elements}
          />
        );
      default:
        return null;
    }
  }, [currentElement, elements]);

  if (!currentElement) {
    return <Typography variant="body2">No element selected.</Typography>;
  }

  return (
    <Stack>
      {/* header */}
      <Stack direction={"row"}>
        {/* icon */}
        <CertificateElementIcon type={currentElement.base.type} />
        {/* name */}
        <Typography>{currentElement.base.name}</Typography>
      </Stack>

      {/* element settings */}
      {renderElement}
    </Stack>
  );
};
