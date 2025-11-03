import React from "react";
import {
  CertificateElementUnion,
  TextElement,
} from "@/client/graphql/generated/gql/graphql";
import { useTextProps } from "../../form/hooks/useTextPropsState";
import { useBaseElement } from "../../form/hooks/useBaseElementState";
import { Stack } from "@mui/material";
import { BaseCertificateElementForm } from "../../form/element/base";
import { TextPropsForm } from "../../form/element/textProps";
import { useQuery } from "@apollo/client/react";
import { fontsQueryDocument } from "@/client/views/font/hooks";

export type CurrentTextElementProps = {
  element: TextElement;
  elements: CertificateElementUnion[];
};

export const CurrentTextElement: React.FC<CurrentTextElementProps> = ({
  element,
  elements,
}) => {
  const {
    data: fontsData,
    loading: _fontsLoading,
    error: _fontsError,
  } = useQuery(fontsQueryDocument);

  const fonts = React.useMemo(() => {
    return fontsData?.fonts.data || [];
  }, [fontsData?.fonts]);

  const { textPropsState, updateTextProps, textPropsErrors } = useTextProps({
    elementId: element.base.id,
  });

  
  const { baseElementState, updateBaseElementState, baseElementErrors } =
    useBaseElement({
      elementId: element.base.id,
    });
  return (
    <Stack>
      <BaseCertificateElementForm
        baseProps={baseElementState}
        onFieldChange={updateBaseElementState}
        errors={baseElementErrors}
      />
      <TextPropsForm
        textProps={textPropsState}
        onTextPropsChange={updateTextProps}
        errors={textPropsErrors}
        selfHostedFonts={fonts}
        language="ar"
      />
    </Stack>
  );
};
