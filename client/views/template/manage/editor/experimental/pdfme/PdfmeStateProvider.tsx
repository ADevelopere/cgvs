"use client";

import React from "react";
import type { Template } from "@pdfme/common";
import { useQuery } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useCertificateElementStates } from "../../context/CertificateElementContext";
import { TemplateConverter } from "./templateConverter";
import { elementsByTemplateIdQueryDocument } from "../../glqDocuments";
import { logger } from "@/client/lib/logger";

/**
 * Return type for the usePdfmeStore hook
 */
export interface PdfmeStateContextValue {
  // PDFMe template object
  template: Template | null;

  // Loading state
  loading: boolean;

  // Error state
  error: Error | null;

  // Template ID
  templateId: number;

  // Flag to indicate if update is from PDFMe (to prevent circular updates)
  isUpdatingFromPdfme: boolean;

  // Set the update flag
  setIsUpdatingFromPdfme: (value: boolean) => void;

  // Initialized flag
  pdfmeInitialized: boolean;
}

/**
 * Context for sharing PDFMe store across components
 */
const PdfmeStateContext = React.createContext<PdfmeStateContextValue | null>(null);

/**
 * Provider component that manages the PDFMe store
 * Converts CertificateElementProvider state to PDFMe template format
 */
export const PdfmeStateProvider: React.FC<{
  templateId: number;
  children: React.ReactNode;
}> = ({ templateId, children }) => {
  const [template, setTemplate] = React.useState<Template | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [initialized, setInitialized] = React.useState(false);
  const [isUpdatingFromPdfme, setIsUpdatingFromPdfme] = React.useState<boolean>(false);

  // Get config from certificate element context
  const { config } = useCertificateElementStates();

  // Fetch elements directly
  const { data: elementsData, loading: elementsLoading } = useQuery(elementsByTemplateIdQueryDocument, {
    variables: { templateId },
    fetchPolicy: "cache-first",
  });

  const elements: GQL.CertificateElementUnion[] = React.useMemo(
    () => elementsData?.elementsByTemplateId || [],
    [elementsData]
  );

  // Track last elements to detect actual changes
  const lastElementsRef = React.useRef<string>("");

  const { bases, textProps, textDataSource } = useCertificateElementStates();

  // Convert element states to PDFMe template whenever they change
  React.useEffect(() => {
    // Don't update if the change came from PDFMe itself
    if (isUpdatingFromPdfme) {
      return;
    }

    // Wait for elements and config to load
    if (elementsLoading || !config.state) {
      return;
    }

    // Check if elements have actually changed
    const elementsJson = JSON.stringify(elements);
    if (lastElementsRef.current === elementsJson) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Convert elements to PDFMe template
      const newTemplate = TemplateConverter.toPdfmeTemplate(elements, config.state, bases, textProps, textDataSource);

      setTemplate(newTemplate);
      setLoading(false);
      setInitialized(true);
      lastElementsRef.current = elementsJson;

      logger.debug({ caller: "PdfmeStoreProvider" }, "Template updated", {
        templateId,
        schemaCount: newTemplate.schemas[0]?.length ?? 0,
      });
    } catch (err) {
      logger.error({ caller: "PdfmeStoreProvider" }, "Error creating template", {
        error: err,
      });
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  }, [elements, config.state, templateId, isUpdatingFromPdfme, elementsLoading]);

  const value: PdfmeStateContextValue = React.useMemo(
    () => ({
      template,
      loading,
      error,
      templateId,
      isUpdatingFromPdfme,
      setIsUpdatingFromPdfme,
      pdfmeInitialized: initialized,
    }),
    [template, loading, error, templateId, isUpdatingFromPdfme, initialized]
  );

  return <PdfmeStateContext.Provider value={value}>{children}</PdfmeStateContext.Provider>;
};

/**
 * Hook to access the PDFMe store from any component
 * Must be used within PdfmeStateProvider
 */
export function usePdfmeState(): PdfmeStateContextValue {
  const context = React.useContext(PdfmeStateContext);

  if (!context) {
    throw new Error("usePdfmeState must be used within PdfmeStateProvider");
  }

  return context;
}
