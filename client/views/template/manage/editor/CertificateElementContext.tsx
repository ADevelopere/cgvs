"use client";
import React from "react";
import {
  useTextPropsState,
  UseTextPropsStateReturn,
} from "@/client/views/template/manage/editor/form/hooks/useTextPropsState";
import {
  CertificateElementUnion,
  TemplateConfig,
} from "@/client/graphql/generated/gql/graphql";
import { useBaseElementState, UseBaseElementStateReturn } from "./form/hooks";
import {
  useTemplateConfigState,
  UseTemplateConfigStateReturn,
} from "./form/config/useTemplateConfigState";

type CertificateElementContextType = {
  bases: UseBaseElementStateReturn;
  textProps: UseTextPropsStateReturn;
  config: UseTemplateConfigStateReturn;
};

export const CertificateElementContext =
  React.createContext<CertificateElementContextType | null>(null);

export type CertificateElemenetProviderProps = {
  elements: CertificateElementUnion[];
  templateId?: number;
  tempalteConfig: TemplateConfig;
  children: React.ReactNode;
};

export const CertificateElemenetProvider: React.FC<
  CertificateElemenetProviderProps
> = ({ children, ...props }) => {
  const { elements, templateId } = props;
  const config = useTemplateConfigState({ config: props.tempalteConfig });
  const textProps = useTextPropsState({ elements, templateId });
  const bases = useBaseElementState({ elements, templateId });

  const value = React.useMemo(
    () => ({ textProps, bases, config }),
    [textProps]
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
