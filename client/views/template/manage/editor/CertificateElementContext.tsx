"use client";
import React from "react";
import {
  useTextPropsState,
  UseTextPropsStateReturn,
} from "@/client/views/template/manage/editor/form/hooks/useTextPropsState";
import { CertificateElementUnion } from "@/client/graphql/generated/gql/graphql";
import { useBaseElementState, UseBaseElementStateReturn } from "./form/hooks";

type CertificateElementContextType = {
  bases: UseBaseElementStateReturn;
  textProps: UseTextPropsStateReturn;
};

export const CertificateElementContext =
  React.createContext<CertificateElementContextType | null>(null);

export type CertificateElemenetProviderProps = {
  elements: CertificateElementUnion[];
  templateId?: number;
  children: React.ReactNode;
};

export const CertificateElemenetProvider: React.FC<
  CertificateElemenetProviderProps
> = ({ children, ...props }) => {
  const textProps = useTextPropsState(props);
  const bases = useBaseElementState(props);

  const value = React.useMemo(() => ({ textProps, bases }), [textProps]);
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
