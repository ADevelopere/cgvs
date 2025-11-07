"use client";

import React from "react";
import { useQuery } from "@apollo/client/react";
import logger from "@/client/lib/logger";
import { FontProvider } from "./FontContext";
import { CanvasRendererWithRef } from "./canvas/CanvasRenderer";
import { collectFontFamilies } from "./canvas/text/fontUtils";
import { generateDataHash } from "./canvas/util/hashUtils";
import { useCanvasCacheStore } from "./canvasCacheStore";
import { ClientCanvasGeneratorProps, ClientCanvasGeneratorRef } from "./canvas/types";
import { elementsByTemplateIdQueryDocument, templateConfigByTemplateIdQueryDocument } from "../editor/glqDocuments";
import { ErrorLike } from "@apollo/client";
import { TemplateConfig } from "@/client/graphql/generated/gql/graphql";

/**
 * Main ClientCanvasGenerator component with caching
 * Complexity: 12 (queries + memo + caching + error handling)
 * Optimized: Parallel resource loading (fonts, images, metrics)
 */
export const ClientCanvasGenerator = React.forwardRef<ClientCanvasGeneratorRef, ClientCanvasGeneratorProps>(
  ({ templateId, onExport, onReady, showDebugBorders = true, renderScale = 1, timeoutMs, onTimeout }, ref) => {
    const { data: configData, error: configError } = useQuery(templateConfigByTemplateIdQueryDocument, {
      variables: { templateId },
      fetchPolicy: "cache-first",
    });

    const { data: elementsData, error: elementsError } = useQuery(elementsByTemplateIdQueryDocument, {
      variables: { templateId },
      fetchPolicy: "cache-first",
    });

    handleQueryErrors(configError, elementsError);

    const config = configData?.templateConfigByTemplateId;
    const elements = elementsData?.elementsByTemplateId;

    // Extract font families immediately when elements arrive (parallel optimization)
    const families = React.useMemo(() => {
      return elements ? collectFontFamilies(elements) : [];
    }, [elements]);

    const { getCache, setCache } = useCanvasCacheStore();
    const hashGenerationTimeRef = React.useRef<number>(0);
    const [dataHash, setDataHash] = React.useState<string | null>(null);

    // Generate hash asynchronously without blocking render
    React.useEffect(() => {
      if (!config || !elements) {
        setDataHash(null);
        return;
      }

      let cancelled = false;
      generateDataHash(elements, config, showDebugBorders, renderScale).then((result) => {
        if (!cancelled) {
          hashGenerationTimeRef.current = result.hashGenerationTime;
          setDataHash(result.hash);
        }
      });

      return () => {
        cancelled = true;
      };
    }, [elements, config, showDebugBorders, renderScale]);

    const cachedCanvas = dataHash ? getCache(dataHash) : null;

    const handleDrawComplete = React.useCallback(
      (dataUrl: string) => {
        if (dataHash) {
          setCache(dataHash, dataUrl);
        }
      },
      [dataHash, setCache]
    );

    if (!config || !elements) return null;

    if (cachedCanvas) {
      return renderCachedImage(cachedCanvas, config);
    }

    // FontProvider starts loading fonts immediately when families are available
    // This runs in parallel with config query completion
    return (
      <FontProvider families={families}>
        <CanvasRendererWithRef
          ref={ref}
          elements={elements}
          config={config}
          onExport={onExport}
          onReady={onReady}
          showDebugBorders={showDebugBorders}
          renderScale={renderScale}
          onDrawComplete={handleDrawComplete}
          timeoutMs={timeoutMs}
          onTimeout={onTimeout}
          hashGenerationTimeRef={hashGenerationTimeRef}
        />
      </FontProvider>
    );
  }
);

ClientCanvasGenerator.displayName = "ClientCanvasGenerator";

/**
/**
 * Handle GraphQL query errors
 * Complexity: 4 (conditional error logging)
 */
function handleQueryErrors(configError: ErrorLike | undefined, elementsError: ErrorLike | undefined): void {
  if (configError) {
    logger.error({ caller: "ClientCanvasGenerator" }, "config query error", { error: configError });
  }
  if (elementsError) {
    logger.error({ caller: "ClientCanvasGenerator" }, "elements query error", { error: elementsError });
  }
}

/**
 * Render cached canvas as image
 * Complexity: 2 (img element creation)
 */
function renderCachedImage(cachedCanvas: string, config: TemplateConfig): React.ReactElement {
  return (
    <img
      src={cachedCanvas}
      alt="Certificate Preview"
      style={{ width: `${config.width}px`, height: `${config.height}px`, border: "1px solid #ccc" }}
    />
  );
}

export default ClientCanvasGenerator;
