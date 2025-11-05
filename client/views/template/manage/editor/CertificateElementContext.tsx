"use client";
import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import {
  useTemplateConfigState,
  UseTemplateConfigStateReturn,
} from "./form/config/useTemplateConfigState";
import * as ElState from "./form/hooks";
import { NodeDataProvider } from "./NodeDataProvider";
import { ReactFlowProvider } from "@xyflow/react";

type CertificateElementContextType = {
  // common
  bases: ElState.UseBaseElementStateReturn;
  textProps: ElState.UseTextPropsStateReturn;
  // data sources
  textDataSource: ElState.UseTextDataSourceStateReturn;
  dateDataSource: ElState.UseDateDataSourceStateReturn;
  numberDataSource: ElState.UseNumberDataSourceStateReturn;
  // props
  dateProps: ElState.UseDatePropsStateReturn;
  countryProps: ElState.UseCountryPropsStateReturn;
  imageProps: ElState.UseImagePropsStateReturn;
  numberProps: ElState.UseNumberPropsStateReturn;
  qrCodeProps: ElState.UseQRCodePropsStateReturn;
  // config
  config: UseTemplateConfigStateReturn;
  // Variables
  textVariables: GQL.TemplateTextVariable[];
  selectVariables: GQL.TemplateSelectVariable[];
  dateVariables: GQL.TemplateDateVariable[];
  numberVariables: GQL.TemplateNumberVariable[];
};

export const CertificateElementContext =
  React.createContext<CertificateElementContextType | null>(null);

export type CertificateElementProviderProps = {
  elements: GQL.CertificateElementUnion[];
  templateConfig: GQL.TemplateConfig;
  variables: GQL.TemplateVariable[];
  children: React.ReactNode;
};

export const CertificateElementProvider: React.FC<
  CertificateElementProviderProps
> = ({ children, ...props }) => {
  const { elements } = props;
  const config = useTemplateConfigState({ config: props.templateConfig });
  const textProps = ElState.useTextPropsState({ elements });
  const bases = ElState.useBaseElementState({ elements });
  const textDataSource = ElState.useTextDataSourceState({
    elements,
  });
  const dateDataSource = ElState.useDateDataSourceState({
    elements,
  });
  const numberDataSource = ElState.useNumberDataSourceState({
    elements,
  });
  const dateProps = ElState.useDatePropsState({ elements });
  const countryProps = ElState.useCountryPropsState({ elements });
  const imageProps = ElState.useImagePropsState({ elements });
  const numberProps = ElState.useNumberPropsState({ elements });
  const qrCodeProps = ElState.useQRCodePropsState({ elements });

  const { textVariables, selectVariables, dateVariables, numberVariables } =
    React.useMemo(() => {
      const textVariables: GQL.TemplateTextVariable[] = [];
      const selectVariables: GQL.TemplateSelectVariable[] = [];
      const dateVariables: GQL.TemplateDateVariable[] = [];
      const numberVariables: GQL.TemplateNumberVariable[] = [];

      for (const variable of props.variables) {
        switch (variable.type) {
          case GQL.TemplateVariableType.Text:
            textVariables.push(variable);
            break;
          case GQL.TemplateVariableType.Select:
            selectVariables.push(variable);
            break;
          case GQL.TemplateVariableType.Date:
            dateVariables.push(variable);
            break;
          case GQL.TemplateVariableType.Number:
            numberVariables.push(variable);
            break;
        }
      }

      return { textVariables, selectVariables, dateVariables, numberVariables };
    }, [props.variables]);

  const value = React.useMemo(
    () => ({
      textProps,
      bases,
      config,
      textDataSource,
      dateDataSource,
      numberDataSource,
      dateProps,
      countryProps,
      imageProps,
      numberProps,
      qrCodeProps,
      textVariables,
      selectVariables,
      dateVariables,
      numberVariables,
    }),
    [
      textProps,
      bases,
      config,
      textDataSource,
      dateDataSource,
      numberDataSource,
      dateProps,
      countryProps,
      imageProps,
      numberProps,
      qrCodeProps,
      textVariables,
      selectVariables,
      dateVariables,
      numberVariables,
    ]
  );

  return (
    <CertificateElementContext.Provider value={value}>
      <ReactFlowProvider>
        <NodeDataProvider bases={bases} config={config}>
          {children}
        </NodeDataProvider>
      </ReactFlowProvider>
    </CertificateElementContext.Provider>
  );
};

export const useCertificateElementStates = () => {
  const context = React.useContext(CertificateElementContext);
  if (!context) {
    throw new Error(
      "useCertificateElementContext must be used within a CertificateElementProvider"
    );
  }
  return context;
};
