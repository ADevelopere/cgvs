"use client";

import React from "react";
import { Designer } from "@pdfme/ui";
import type { Template } from "@pdfme/common";
import { image, text } from "@pdfme/schemas";
import { Box, CircularProgress, Typography } from "@mui/material";
import { usePdfmeStore } from "./PdfmeStoreProvider";
import { useCertificateElementStates } from "./CertificateElementContext";
import { TemplateConverter } from "./services/templateConverter";
import { useQuery } from "@apollo/client/react";
import { elementsByTemplateIdQueryDocument } from "./glqDocuments";
import { logger } from "@/client/lib/logger";

/**
 * Wrapper component for PDFMe Designer
 * Manages Designer lifecycle and bidirectional state synchronization
 */
export const PdfmeEditorWrapper: React.FC = () => {
  const domContainerRef = React.useRef<HTMLDivElement | null>(null);
  const designerRef = React.useRef<Designer | null>(null);
  const lastTemplateRef = React.useRef<Template | null>(null);

  const {
    template,
    loading: templateLoading,
    error: templateError,
    templateId,
    isUpdatingFromPdfme,
    setIsUpdatingFromPdfme,
  } = usePdfmeStore();

  const { bases } = useCertificateElementStates();

  // Fetch elements for update conversion
  const { data: elementsData } = useQuery(elementsByTemplateIdQueryDocument, {
    variables: { templateId },
    fetchPolicy: "cache-first",
  });

  const elements = React.useMemo(
    () => elementsData?.elementsByTemplateId || [],
    [elementsData]
  );

  // Mount: Create Designer instance (only once)
  React.useEffect(() => {
    if (!domContainerRef.current || !template || templateLoading) {
      return;
    }

    // Don't recreate if already exists
    if (designerRef.current) {
      return;
    }

    try {
      logger.debug("PdfmeEditorWrapper: Creating Designer instance", {
        templateId,
      });

      // Create Designer instance
      designerRef.current = new Designer({
        domContainer: domContainerRef.current,
        template,
        plugins: {
          text,
          image
        },
        options: {
          lang: "ar",
        }
      });

      // Register onChange callback for upstream sync (PDFMe → State)
      designerRef.current.onChangeTemplate((newTemplate: Template) => {
        logger.debug("PdfmeEditorWrapper: Template changed in PDFMe", {
          schemaCount: newTemplate.schemas[0]?.length ?? 0,
        });

        // Set flag to prevent circular updates
        setIsUpdatingFromPdfme(true);

        try {
          // Extract element updates from template changes
          const updates = TemplateConverter.extractElementUpdates(
            newTemplate,
            elements
          );

          // Apply updates to element states
          updates.forEach((update, elementId) => {
            if (update.positionX !== undefined) {
              bases.updateBaseElementStateFn(elementId, {
                key: "positionX",
                value: update.positionX,
              });
            }
            if (update.positionY !== undefined) {
              bases.updateBaseElementStateFn(elementId, {
                key: "positionY",
                value: update.positionY,
              });
            }
            if (update.width !== undefined) {
              bases.updateBaseElementStateFn(elementId, {
                key: "width",
                value: update.width,
              });
            }
            if (update.height !== undefined) {
              bases.updateBaseElementStateFn(elementId, {
                key: "height",
                value: update.height,
              });
            }
          });

          logger.debug("PdfmeEditorWrapper: Applied element updates", {
            updateCount: updates.size,
          });
        } catch (error) {
          logger.error("PdfmeEditorWrapper: Error applying updates", {
            error,
          });
        } finally {
          // Clear flag after a short delay to allow state updates to propagate
          setTimeout(() => {
            setIsUpdatingFromPdfme(false);
          }, 100);
        }
      });

      logger.debug("PdfmeEditorWrapper: Designer instance created", {
        templateId,
      });
    } catch (error) {
      logger.error("PdfmeEditorWrapper: Error creating Designer", {
        error,
      });
    }

    // Unmount: Destroy Designer instance
    return () => {
      if (designerRef.current) {
        logger.debug("PdfmeEditorWrapper: Destroying Designer instance", {
          templateId,
        });
        designerRef.current.destroy();
        designerRef.current = null;
      }
    };
  }, [templateLoading, templateId]); // Only run on mount/unmount, not on template changes

  // Downstream sync: Update Designer when template changes (State → PDFMe)
  React.useEffect(() => {
    // Don't update if the change came from PDFMe itself
    if (isUpdatingFromPdfme) {
      return;
    }

    // Don't update if Designer not initialized
    if (!designerRef.current || !template) {
      return;
    }

    // Don't update if template hasn't actually changed
    if (lastTemplateRef.current === template) {
      return;
    }

    // Check if template content has actually changed (deep comparison of schemas)
    if (lastTemplateRef.current && template) {
      const lastSchemas = JSON.stringify(lastTemplateRef.current.schemas);
      const currentSchemas = JSON.stringify(template.schemas);
      if (lastSchemas === currentSchemas) {
        return;
      }
    }

    try {
      logger.debug("PdfmeEditorWrapper: Updating Designer template", {
        schemaCount: template.schemas[0]?.length ?? 0,
      });

      designerRef.current.updateTemplate(template);
      lastTemplateRef.current = template;
    } catch (error) {
      logger.error("PdfmeEditorWrapper: Error updating Designer template", {
        error,
      });
    }
  }, [template, isUpdatingFromPdfme]);

  // Loading state
  if (templateLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (templateError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Error loading PDFMe editor
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {templateError.message}
        </Typography>
      </Box>
    );
  }

  // No template
  if (!template) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No template available
        </Typography>
      </Box>
    );
  }

  // Render container for PDFMe Designer
  return (
    <Box
      ref={domContainerRef}
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        "& .pdfme-designer": {
          height: "100%",
        },
      }}
    />
  );
};
