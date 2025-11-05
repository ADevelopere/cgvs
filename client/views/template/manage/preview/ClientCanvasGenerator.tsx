"use client";

import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useQuery } from "@apollo/client/react";
import logger from "@/client/lib/logger";
import { FontProvider, FontContext } from "./FontContext";
import { useOpentypeMetrics } from "./useOpentypeMetrics";
import { layoutResizeDown, layoutTruncate, layoutWrap, drawLayout } from "./textLayout";
import { resolveTextContent } from "../editor/renderer/textResolvers";
import {
  elementsByTemplateIdQueryDocument,
  templateConfigByTemplateIdQueryDocument,
} from "../editor/glqDocuments";

export interface ClientCanvasGeneratorProps {
  templateId: number;
  onExport?: (dataUrl: string) => void;
}

export type ClientCanvasGeneratorRef = {
  download: () => void;
};

function collectFontFamilies(elements: GQL.CertificateElementUnion[]): string[] {
  const families = new Set<string>();
  for (const el of elements) {
    if (el.__typename === "TextElement") {
      const ref = el.textProps.fontRef;
      if (ref.__typename === "FontReferenceGoogle" && ref.identifier) {
        families.add(ref.identifier);
      } else {
        families.add("Roboto");
      }
    }
  }
  return Array.from(families);
}

function CanvasInner(
  { elements, config, onExport }: { elements: GQL.CertificateElementUnion[]; config: GQL.TemplateConfig; onExport?: (d: string) => void },
  ref: React.Ref<ClientCanvasGeneratorRef>
) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { fontsLoaded, families } = React.useContext(FontContext);
  const { metricsReady, getFont } = useOpentypeMetrics(families);

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fontsLoaded || !metricsReady) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = config;
    ctx.clearRect(0, 0, width, height);

    const textElements = elements
      .filter((e): e is GQL.TextElement => e.__typename === "TextElement")
      .slice()
      .sort((a, b) => a.base.renderOrder - b.base.renderOrder);

    for (const el of textElements) {
      const text = resolveTextContent(el.textDataSource, config.language, "Text");
      const family = el.textProps.fontRef.__typename === "FontReferenceGoogle" && el.textProps.fontRef.identifier
        ? el.textProps.fontRef.identifier
        : "Roboto";
      const fontSize = el.textProps.fontSize;
      const color = el.textProps.color || "#000";
      const font = getFont(family);

      ctx.font = `${fontSize}px ${family}`;
      ctx.textBaseline = "alphabetic";

      let layout;
      if (el.textProps.overflow === GQL.ElementOverflow.Wrap) {
        layout = layoutWrap(ctx, text, el.base.width, font, fontSize);
      } else if (el.textProps.overflow === GQL.ElementOverflow.Ellipse || el.textProps.overflow === GQL.ElementOverflow.Truncate) {
        layout = layoutTruncate(ctx, text, el.base.width, fontSize);
      } else if (el.textProps.overflow === GQL.ElementOverflow.ResizeDown) {
        layout = layoutResizeDown(ctx, text, el.base.width, el.base.height, font, fontSize, family);
      } else {
        layout = layoutTruncate(ctx, text, el.base.width, fontSize);
      }

      drawLayout(
        ctx,
        {
          x: el.base.positionX,
          y: el.base.positionY,
          width: el.base.width,
          height: el.base.height,
          color,
          alignment: el.base.alignment,
        },
        layout,
        font,
        family
      );
    }
  }, [elements, config, fontsLoaded, metricsReady, getFont]);

  React.useEffect(() => {
    draw();
  }, [draw]);

  const download = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onExport?.(dataUrl);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "certificate-preview.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [onExport]);

  React.useImperativeHandle(ref, () => ({ download }), [download]);

  return (
    <canvas
      ref={canvasRef}
      width={config.width}
      height={config.height}
      style={{ width: `${config.width}px`, height: `${config.height}px`, border: "1px solid #ccc" }}
    />
  );
}

const CanvasInnerWithRef = React.forwardRef<ClientCanvasGeneratorRef, { elements: GQL.CertificateElementUnion[]; config: GQL.TemplateConfig; onExport?: (d: string) => void }>(CanvasInner);

export const ClientCanvasGenerator = React.forwardRef<ClientCanvasGeneratorRef, ClientCanvasGeneratorProps>(
  ({ templateId, onExport }, ref) => {
    const { data: configData, error: configError } = useQuery(
      templateConfigByTemplateIdQueryDocument,
      { variables: { templateId }, fetchPolicy: "cache-first" }
    );
    const { data: elementsData, error: elementsError } = useQuery(
      elementsByTemplateIdQueryDocument,
      { variables: { templateId }, fetchPolicy: "cache-first" }
    );

    if (configError) {
      logger.error("ClientCanvasGenerator: config query error", { error: configError });
    }
    if (elementsError) {
      logger.error("ClientCanvasGenerator: elements query error", { error: elementsError });
    }

    const config = configData?.templateConfigByTemplateId
    const elements = elementsData?.elementsByTemplateId 

    if (!config || !elements) return null;

    const families = collectFontFamilies(elements);

    return (
      <FontProvider families={families}>
        <CanvasInnerWithRef ref={ref} elements={elements} config={config} onExport={onExport} />
      </FontProvider>
    );
  }
);

ClientCanvasGenerator.displayName = "ClientCanvasGenerator";

export default ClientCanvasGenerator;


