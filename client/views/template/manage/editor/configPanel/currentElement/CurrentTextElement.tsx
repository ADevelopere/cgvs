import React from "react";
import { TemplateConfig, TextElement } from "@/client/graphql/generated/gql/graphql";
import { Stack, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BaseCertificateElementForm } from "../../form/element/base";
import { TextPropsForm } from "../../form/element/textProps";
import { useQuery } from "@apollo/client/react";
import { fontsQueryDocument } from "@/client/views/font/hooks";
import { DataSourceForm } from "../../form/element/text";
import { useBaseElement, useTextProps, useTextDataSource } from "../../form/hooks";
import { useCertificateElementStates } from "../../context/CertificateElementContext";
import { useAppTranslation } from "@/client/locale";

export type CurrentTextElementProps = {
  element: TextElement;
  templateConfig: TemplateConfig;
};

export const CurrentTextElement: React.FC<CurrentTextElementProps> = ({ element, templateConfig }) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();
  const { data: fontsData, loading: _fontsLoading, error: _fontsError } = useQuery(fontsQueryDocument);

  const fonts = React.useMemo(() => {
    return fontsData?.fonts.data || [];
  }, [fontsData?.fonts]);

  const { textPropsState, updateTextProps, textPropsErrors } = useTextProps({
    elementId: element.base.id,
  });

  const { baseElementState, updateBaseElementState, baseElementErrors } = useBaseElement({
    elementId: element.base.id,
  });

  const { textDataSourceState, updateTextDataSource, textDataSourceErrors } = useTextDataSource({
    elementId: element.base.id,
  });

  const { textVariables, selectVariables } = useCertificateElementStates();

  return (
    <Stack>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{strings.textElement.dataSourceLabel}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "background.default", pt: 2 }}>
          <DataSourceForm
            dataSource={textDataSourceState}
            textVariables={textVariables}
            selectVariables={selectVariables}
            updateDataSource={updateTextDataSource}
            errors={textDataSourceErrors}
            disabled={false}
            showSelector={true}
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
          <TextPropsForm
            textProps={textPropsState}
            onTextPropsChange={updateTextProps}
            errors={textPropsErrors}
            selfHostedFonts={fonts}
            language={templateConfig.language}
            showTitle={false}
          />
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};
