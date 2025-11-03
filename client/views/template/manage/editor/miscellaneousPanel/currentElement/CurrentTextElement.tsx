import React from "react";
import { TextElement } from "@/client/graphql/generated/gql/graphql";
import { Stack } from "@mui/material";
import { BaseCertificateElementForm } from "../../form/element/base";
import { TextPropsForm } from "../../form/element/textProps";
import { useQuery } from "@apollo/client/react";
import { fontsQueryDocument } from "@/client/views/font/hooks";
import { DataSourceForm } from "../../form/element/text";
import {
  useBaseElement,
  useTextProps,
  useTextDataSource,
} from "../../form/hooks";
import { useCertificateElementContext } from "../../CertificateElementContext";

export type CurrentTextElementProps = {
  element: TextElement;
};

export const CurrentTextElement: React.FC<CurrentTextElementProps> = ({
  element,
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

  const {
    textDataSourceState,
    updateTextDataSource,
    textDataSourceErrors,
  } = useTextDataSource({
    elementId: element.base.id,
  });

  const { textVariables, selectVariables } = useCertificateElementContext();

  return (
    <Stack>
      <DataSourceForm
        dataSource={textDataSourceState}
        textVariables={textVariables}
        selectVariables={selectVariables}
        updateDataSource={updateTextDataSource}
        errors={textDataSourceErrors}
        disabled={false}
        showSelector={true}
      />
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
