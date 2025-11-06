"use client";
import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useTemplateConfigState, UseTemplateConfigStateReturn } from "./form/config/useTemplateConfigState";
import * as ElState from "./form/hooks";
import { elementsByTemplateIdQueryDocument, templateConfigByTemplateIdQueryDocument } from "./glqDocuments";
import { useQuery } from "@apollo/client/react";
import { templateVariablesByTemplateIdQueryDocument } from "../variables/hooks/templateVariable.documents";

/**
 * Context value type
 */
export interface CertificateElementContextValue {
  templateId: number;
  // common
  bases: ElState.UseBaseElementStateReturn;
  textProps: ElState.UseTextPropsStateReturn;
  // data sources
  textDataSource: ElState.UseTextDataSourceStateReturn;
  dateDataSource: ElState.UseDateDataSourceStateReturn;
  numberDataSource: ElState.UseNumberDataSourceStateReturn;
  imageDataSource: ElState.UseImageDataSourceStateReturn;
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
}

/**
 * Context for certificate element states
 */
const CertificateElementContext = React.createContext<CertificateElementContextValue | null>(null);

/**
 * Provider component for certificate element states
 */
export const CertificateElementProvider: React.FC<{
  templateId: number;
  children: React.ReactNode;
}> = ({ templateId, children }) => {
  // ========== Template Config ==========
  const { data: configData, loading: configApolloLoading } = useQuery(templateConfigByTemplateIdQueryDocument, {
    variables: { templateId },
    fetchPolicy: "cache-and-network",
  });

  const templateConfig: GQL.TemplateConfig | null | undefined = React.useMemo(() => {
    const config = configData?.templateConfigByTemplateId;
    return config;
  }, [configApolloLoading, configData?.templateConfigByTemplateId]);

  // =========== Elements =============
  const { data: elementsData, loading: elementsApolloLoading } = useQuery(elementsByTemplateIdQueryDocument, {
    variables: { templateId },
    fetchPolicy: "cache-first",
  });

  const elements: GQL.CertificateElementUnion[] = React.useMemo(() => {
    const elementsList = elementsData?.elementsByTemplateId || [];
    return elementsList;
  }, [elementsApolloLoading, elementsData?.elementsByTemplateId]);

  // =========== Variables =============
  const { data: variablesData } = useQuery(templateVariablesByTemplateIdQueryDocument, {
    variables: { templateId },
    fetchPolicy: "cache-first",
  });

  const variables: GQL.TemplateVariable[] = React.useMemo(
    () => variablesData?.templateVariablesByTemplateId || [],
    [variablesData]
  );

  const config = useTemplateConfigState({ config: templateConfig });
  const textProps = ElState.useTextPropsState({ elements });
  const bases = ElState.useBaseElementState({ elements });
  const textDataSource = ElState.useTextDataSourceState({ elements });
  const dateDataSource = ElState.useDateDataSourceState({ elements });
  const numberDataSource = ElState.useNumberDataSourceState({ elements });
  const imageDataSource = ElState.useImageDataSourceState({ elements });
  const dateProps = ElState.useDatePropsState({ elements });
  const countryProps = ElState.useCountryPropsState({ elements });
  const imageProps = ElState.useImagePropsState({ elements });
  const numberProps = ElState.useNumberPropsState({ elements });
  const qrCodeProps = ElState.useQRCodePropsState({ elements });

  // Process variables by type
  const { textVariables, selectVariables, dateVariables, numberVariables } = React.useMemo(() => {
    const textVariables: GQL.TemplateTextVariable[] = [];
    const selectVariables: GQL.TemplateSelectVariable[] = [];
    const dateVariables: GQL.TemplateDateVariable[] = [];
    const numberVariables: GQL.TemplateNumberVariable[] = [];

    for (const variable of variables) {
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
  }, [variables]);

  const value: CertificateElementContextValue = React.useMemo(
    () => ({
      templateId,
      textProps,
      bases,
      config,
      textDataSource,
      dateDataSource,
      numberDataSource,
      imageDataSource,
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
      templateId,
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

  return <CertificateElementContext.Provider value={value}>{children}</CertificateElementContext.Provider>;
};

/**
 * Hook to access certificate element states
 * Must be used within CertificateElementProvider
 */
export function useCertificateElementStates(): CertificateElementContextValue {
  const context = React.useContext(CertificateElementContext);

  if (!context) {
    throw new Error("useCertificateElementStates must be used within CertificateElementProvider");
  }

  return context;
}
