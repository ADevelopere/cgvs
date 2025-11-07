"use client";

import React from "react";
import { useQuery } from "@apollo/client/react";
import logger from "@/client/lib/logger";
import { FontProvider } from "./FontContext";
import { CanvasRendererWithRef } from "../../export/canvas/CanvasRenderer";
import { collectFontFamilies } from "../../export/canvas/text/fontUtils";
import { generateDataHash } from "../../export/canvas/util/hashUtils";
import { useCanvasCacheStore } from "./canvasCacheStore";
import { ClientCanvasGeneratorProps, ClientCanvasGeneratorRef } from "../../export/canvas/types";
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
    const canvasRendererRef = React.useRef<ClientCanvasGeneratorRef>(null);

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

    const { setCache } = useCanvasCacheStore();
    const hashGenerationTimeRef = React.useRef<number>(0);
    const [dataHash, setDataHash] = React.useState<string | null>(null);

    // Generate hash asynchronously without blocking render
    React.useEffect(() => {
      if (!config || !elements) {
        logger.debug({ caller: "ClientCanvasGenerator" }, "Config or elements missing", { config: !!config, elements: !!elements });
        setDataHash(null);
        return;
      }

      let cancelled = false;
      logger.debug({ caller: "ClientCanvasGenerator" }, "Starting hash generation", {
        templateId,
        elementCount: elements.length,
        renderScale,
        showDebugBorders
      });

      generateDataHash(elements, config, showDebugBorders, renderScale).then((result) => {
        if (!cancelled) {
          hashGenerationTimeRef.current = result.hashGenerationTime;
          setDataHash(result.hash);
          logger.debug({ caller: "ClientCanvasGenerator" }, "Hash generated", { hash: result.hash });
        }
      });

      return () => {
        cancelled = true;
      };
    }, [elements, config, showDebugBorders, renderScale, templateId]);

    const handleDrawComplete = React.useCallback(
      (dataUrl: string) => {
        logger.debug({ caller: "ClientCanvasGenerator" }, "handleDrawComplete called", {
          dataHash,
          dataUrlLength: dataUrl.length
        });
        if (dataHash) {
          setCache(dataHash, dataUrl);
          logger.debug({ caller: "ClientCanvasGenerator" }, "Cache set", { hash: dataHash });
        } else {
          logger.warn({ caller: "ClientCanvasGenerator" }, "handleDrawComplete called but no dataHash");
        }
      },
      [dataHash, setCache]
    );

    // Subscribe to cache changes to re-render when cache is populated
    // Use selector to only subscribe to changes for THIS specific hash
    const cachedCanvasFromStore = useCanvasCacheStore(
      React.useCallback((state) => {
        if (!dataHash) {
          logger.debug({ caller: "ClientCanvasGenerator" }, "No dataHash for cache lookup");
          return null;
        }
        const cached = state.cache.get(dataHash);
        logger.debug({ caller: "ClientCanvasGenerator" }, "Cache lookup", {
          hash: dataHash,
          found: !!cached,
          cacheSize: state.cache.size
        });
        return cached ?? null;
      }, [dataHash])
    );

    // Early check: if we have a hash and cache immediately, no need to render canvas at all
    const { getCache } = useCanvasCacheStore();
    const earlyCache = dataHash ? getCache(dataHash) : null;

    // Notify ready when using cached image
    React.useEffect(() => {
      if ((cachedCanvasFromStore || earlyCache) && onReady) {
        logger.debug({ caller: "ClientCanvasGenerator" }, "Calling onReady for cached canvas", { hash: dataHash });
        onReady({ canvasGenerationTime: 0, hashGenerationTime: hashGenerationTimeRef.current });
      }
    }, [cachedCanvasFromStore, earlyCache, onReady, dataHash]);

    // Expose download method that works with cached images
    React.useImperativeHandle(ref, () => ({
      download: () => {
        const finalCache = cachedCanvasFromStore || earlyCache;
        if (finalCache) {
          // Download from cache
          logger.debug({ caller: "ClientCanvasGenerator" }, "Downloading from cache", { hash: dataHash });
          const a = document.createElement("a");
          a.setAttribute("download", "certificate.png");
          a.setAttribute("href", finalCache);
          a.click();
        } else if (canvasRendererRef.current) {
          // Download from canvas renderer
          canvasRendererRef.current.download();
        }
      }
    }), [cachedCanvasFromStore, earlyCache, dataHash]);

    if (!config || !elements) {
      logger.debug({ caller: "ClientCanvasGenerator" }, "Early return: missing config or elements");
      return null;
    }

    // Use the memoized cache value that updates when store changes, or early cache check
    const finalCache = cachedCanvasFromStore || earlyCache;
    if (finalCache) {
      logger.debug({ caller: "ClientCanvasGenerator" }, "Rendering from cache", { hash: dataHash });
      return renderCachedImage(finalCache, config);
    }

    logger.debug({ caller: "ClientCanvasGenerator" }, "Rendering CanvasRenderer (no cache)", {
      templateId,
      dataHash,
      renderScale,
      showDebugBorders
    });

    // FontProvider starts loading fonts immediately when families are available
    // This runs in parallel with config query completion
    return (
      <FontProvider families={families}>
        <CanvasRendererWithRef
          ref={canvasRendererRef}
          templateId={templateId}
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
