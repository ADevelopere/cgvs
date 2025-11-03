"use client";
import React from "react";
import {
  useTextPropsState,
  UseTextPropsStateReturn,
} from "@/client/views/template/manage/editor/form/hooks/useTextPropsState";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useBaseElementState, UseBaseElementStateReturn } from "./form/hooks";
import {
  useTemplateConfigState,
  UseTemplateConfigStateReturn,
} from "./form/config/useTemplateConfigState";
import {
  useTextDataSourceState,
  UseTextDataSourceStateReturn,
} from "./form/hooks/useTextDataSourceState";
import {
  useDateDataSourceState,
  UseDateDataSourceStateReturn,
} from "./form/hooks/useDateDataSourceState";

type CertificateElementContextType = {
  bases: UseBaseElementStateReturn;
  textProps: UseTextPropsStateReturn;
  textDataSource: UseTextDataSourceStateReturn;
  dateDataSource: UseDateDataSourceStateReturn;
  config: UseTemplateConfigStateReturn;
  textVariables: GQL.TemplateTextVariable[];
  selectVariables: GQL.TemplateSelectVariable[];
  dateVariables: GQL.TemplateDateVariable[];
  numberVariables: GQL.TemplateNumberVariable[];
};

export const CertificateElementContext =
  React.createContext<CertificateElementContextType | null>(null);

export type CertificateElemenetProviderProps = {
  elements: GQL.CertificateElementUnion[];
  templateId?: number;
  tempalteConfig: GQL.TemplateConfig;
  variables: GQL.TemplateVariable[];
  children: React.ReactNode;
};

export const CertificateElemenetProvider: React.FC<
  CertificateElemenetProviderProps
> = ({ children, ...props }) => {
  const { elements, templateId } = props;
  const config = useTemplateConfigState({ config: props.tempalteConfig });
  const textProps = useTextPropsState({ elements, templateId });
  const bases = useBaseElementState({ elements, templateId });
  const textDataSource = useTextDataSourceState({ elements, templateId });
  const dateDataSource = useDateDataSourceState({ elements, templateId });

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
      textVariables,
      selectVariables,
      dateVariables,
      numberVariables,
    ]
  );

  return (
    <CertificateElementContext.Provider value={value}>
      {children}
    </CertificateElementContext.Provider>
  );
};

export const useCertificateElementContext = () => {
  const context = React.useContext(CertificateElementContext);
  if (!context) {
    throw new Error(
      "useCertificateElementContext must be used within a CertificateElemenetProvider"
    );
  }
  return context;
};
