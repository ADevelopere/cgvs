import * as GQL from "@/client/graphql/generated/gql/graphql";
import { Stack, Typography } from "@mui/material";
import { CertificateElementIcon } from "../elements/ElementIcon";
import { CurrentTextElement } from "./CurrentTextElement";
import { CurrentImageElement } from "./CurrenImageElement";
import { useEditorStore } from "../../useEditorStore";
import React from "react";

export type CertificateElementCurrentItemSettingsProps = {
  elements: GQL.CertificateElementUnion[];
  templateConfig: GQL.TemplateConfig;
};

export const CertificateElementCurrentItemSettings: React.FC<CertificateElementCurrentItemSettingsProps> = ({
  elements,
  templateConfig,
}) => {
  const { currentElementId } = useEditorStore();

  const currentElement = React.useMemo(() => {
    return elements.find(el => el.base.id === currentElementId);
  }, [currentElementId, elements]);

  const renderElement = React.useMemo(() => {
    if (!currentElement) {
      return null;
    }
    switch (currentElement.base.type) {
      case GQL.ElementType.Text:
        return <CurrentTextElement element={currentElement as GQL.TextElement} templateConfig={templateConfig} />;
      case GQL.ElementType.Image:
        return <CurrentImageElement element={currentElement as GQL.ImageElement} />;
      default:
        return null;
    }
  }, [currentElement, elements, templateConfig]);

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
