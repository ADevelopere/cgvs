import * as GQL from "@/client/graphql/generated/gql/graphql";
import type { Font as OpentypeFont } from "opentype.js";

/**
 * Ref interface for ClientCanvasGenerator component
 */
export interface ClientCanvasGeneratorRef {
  download: () => void;
}

/**
 * Props for ClientCanvasGenerator component
 */
export interface ClientCanvasGeneratorProps {
  templateId: number;
  onExport?: (dataUrl: string) => void;
  onReady?: (timings: PerformanceTimings) => void;
  showDebugBorders?: boolean;
  renderScale?: number; // Multiplier for high-quality rendering (e.g., 2 = 2x resolution)
  timeoutMs?: number; // Maximum time allowed for generation in milliseconds
  onTimeout?: () => void; // Callback when generation exceeds timeout
}

/**
 * Performance timing measurements
 */
export interface PerformanceTimings {
  canvasGenerationTime: number;
  hashGenerationTime: number;
}

/**
 * Image dimensions with offset for positioning
 */
export interface ImageDimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

/**
 * Rendering box coordinates and dimensions
 */
export interface RenderBox {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  alignment: GQL.ElementAlignment;
}

/**
 * Canvas renderer props
 */
export interface CanvasRendererProps {
  templateId: number;
  elements: GQL.CertificateElementUnion[];
  config: GQL.TemplateConfig;
  onExport?: (dataUrl: string) => void;
  onReady?: (timings: PerformanceTimings) => void;
  showDebugBorders?: boolean;
  renderScale?: number;
  onDrawComplete?: (dataUrl: string) => void;
  timeoutMs?: number;
  onTimeout?: () => void;
  hashGenerationTimeRef?: React.MutableRefObject<number>;
}

/**
 * Image element renderer props
 */
export interface ImageElementRendererProps {
  element: GQL.ImageElement;
  ctx: CanvasRenderingContext2D;
  imageCache: Map<string, HTMLImageElement>;
  showDebugBorder?: boolean;
}

/**
 * Text element renderer props
 */
export interface TextElementRendererProps {
  element: GQL.TextElement;
  ctx: CanvasRenderingContext2D;
  config: GQL.TemplateConfig;
  getFont: (family: string) => OpentypeFont | undefined;
  showDebugBorder?: boolean;
}

/**
 * Element renderer props for all element types
 */
export interface ElementRendererProps {
  element: GQL.CertificateElementUnion;
  ctx: CanvasRenderingContext2D;
  config: GQL.TemplateConfig;
  imageCache: Map<string, HTMLImageElement>;
  getFont: (family: string) => OpentypeFont | undefined;
  showDebugBorder?: boolean;
}
