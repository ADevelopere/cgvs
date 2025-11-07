import React from "react";
import { ImageElement } from "@/client/graphql/generated/gql/graphql";
import { Stack, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BaseCertificateElementForm } from "../../form/element/base";
import { ImageDataSourceForm, ImagePropsForm } from "../../form/element/image";
import { useBaseElement, useImageDataSource } from "../../form/hooks";
import { useAppTranslation } from "@/client/locale";
import { useImageProps } from "../../form/hooks/useImagePropsState";

export type CurrentImageElementProps = {
  element: ImageElement;
};

export const CurrentImageElement: React.FC<CurrentImageElementProps> = ({ element }) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  const { baseElementState, updateBaseElementState, baseElementErrors } = useBaseElement({
    elementId: element.base.id,
  });

  const { imageDataSourceState, updateImageDataSource, imageDataSourceErrors } = useImageDataSource({
    elementId: element.base.id,
  });

  const { imagePropsState, updateImageProps, imagePropsErrors } = useImageProps({
    elementId: element.base.id,
  });

  return (
    <Stack>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{strings.imageElement.dataSourceLabel}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "background.default", pt: 2 }}>
          <ImageDataSourceForm
            dataSource={imageDataSourceState}
            updateDataSource={updateImageDataSource}
            errors={imageDataSourceErrors}
            disabled={false}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{strings.baseElement.basePropertiesTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "background.default", pt: 2 }}>
          <BaseCertificateElementForm
            baseProps={baseElementState}
            onFieldChange={updateBaseElementState}
            errors={baseElementErrors}
            showTitle={false}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{strings.textProps.textPropertiesTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "background.default", pt: 2 }}>
          <ImagePropsForm imageProps={imagePropsState} updateImageProps={updateImageProps} errors={imagePropsErrors} />
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};
