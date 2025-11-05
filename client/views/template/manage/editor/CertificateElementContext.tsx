"use client";
import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import {
  useTemplateConfigState,
  UseTemplateConfigStateReturn,
} from "./form/config/useTemplateConfigState";
import * as ElState from "./form/hooks";
import {
  elementsByTemplateIdQueryDocument,
  templateConfigByTemplateIdQueryDocument,
} from "./glqDocuments";
import { useQuery } from "@apollo/client/react";
import { templateVariablesByTemplateIdQueryDocument } from "../variables/hooks/templateVariable.documents";
import { useParams } from "next/navigation";

/**
 * Return type for useCertificateElementStates hook
 */
export interface UseCertificateElementStatesReturn {
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
}

/**
 * Hook for managing certificate element states
 * Provides all element states, props, and data sources
 */
export function useCertificateElementStates(): UseCertificateElementStatesReturn {
  // Internal state for elements, config, and variables
    // Get templateId from Next.js URL params
    const pathParams = useParams<{ id: string }>();
    const templateId = React.useMemo(() => {
      const id = pathParams?.id;
      return id ? Number.parseInt(id, 10) : null;
    }, [pathParams?.id]);

    // ========== Template Config ==========
    const {
      data: configData,
      loading: configApolloLoading,
    } = useQuery(templateConfigByTemplateIdQueryDocument, {
      variables: { templateId: templateId ?? 0 },
      skip: !templateId,
      fetchPolicy: "cache-and-network",
    });
  
    const templateConfig: GQL.TemplateConfig | null | undefined =
      React.useMemo(() => {
        const config = configData?.templateConfigByTemplateId;
        return config;
      }, [configApolloLoading, configData?.templateConfigByTemplateId]);
  
    // =========== Elements =============
  
    const {
      data: elementsData,
      loading: elementsApolloLoading,
    } = useQuery(elementsByTemplateIdQueryDocument, {
      variables: { templateId: templateId ?? 0 },
      skip: !templateId,
      fetchPolicy: "cache-first",
    });
  
    const elements: GQL.CertificateElementUnion[] = React.useMemo(() => {
      const elementsList = elementsData?.elementsByTemplateId || [];
      return elementsList;
    }, [elementsApolloLoading, elementsData?.elementsByTemplateId]);

      const { data: variablesData } = useQuery(
    templateVariablesByTemplateIdQueryDocument,
    {
      variables: { templateId: templateId ?? 0 },
      skip: !templateId,
      fetchPolicy: "cache-first",
    }
  );

    const variables: GQL.TemplateVariable[] = React.useMemo(
    () => variablesData?.templateVariablesByTemplateId || [],
    [variablesData]
  );

  const config = useTemplateConfigState({ config: templateConfig});
  const textProps = ElState.useTextPropsState({ elements });
  const bases = ElState.useBaseElementState({ elements });
  const textDataSource = ElState.useTextDataSourceState({ elements });
  const dateDataSource = ElState.useDateDataSourceState({ elements });
  const numberDataSource = ElState.useNumberDataSourceState({ elements });
  const dateProps = ElState.useDatePropsState({ elements });
  const countryProps = ElState.useCountryPropsState({ elements });
  const imageProps = ElState.useImagePropsState({ elements });
  const numberProps = ElState.useNumberPropsState({ elements });
  const qrCodeProps = ElState.useQRCodePropsState({ elements });

  // Process variables by type
  const { textVariables, selectVariables, dateVariables, numberVariables } =
    React.useMemo(() => {
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

  return {
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
  };
}
