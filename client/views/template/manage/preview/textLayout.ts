import * as GQL from "@/client/graphql/generated/gql/graphql";
import { getTrueFontMetrics } from "./useOpentypeMetrics";
import type { Font as OpentypeFont } from "opentype.js";

export type TextLayoutResult = {
  lines: string[];
  totalHeight: number;
  fontSize: number;
};

export function layoutWrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: OpentypeFont | undefined,
  fontSize: number
): TextLayoutResult {
  const { lineHeight } = getTrueFontMetrics(font, fontSize);
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const width = ctx.measureText(test).width;
    if (width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return { lines, totalHeight: lines.length * lineHeight, fontSize };
}

export function layoutTruncate(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number
): TextLayoutResult {
  const ellipsis = "...";
  const ellipsisWidth = ctx.measureText(ellipsis).width;
  const fullWidth = ctx.measureText(text).width;
  if (fullWidth <= maxWidth) {
    return { lines: [text], totalHeight: 0, fontSize };
  }
  const target = Math.max(0, maxWidth - ellipsisWidth);
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    const w = ctx.measureText(text.substring(0, mid)).width;
    if (w <= target) lo = mid;
    else hi = mid - 1;
  }
  const truncated = text.substring(0, lo) + ellipsis;
  return { lines: [truncated], totalHeight: 0, fontSize };
}

export function layoutResizeDown(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  font: OpentypeFont | undefined,
  baseFontSize: number,
  family: string
): TextLayoutResult {
  let min = 1;
  let max = baseFontSize;
  let best: TextLayoutResult = { lines: [], totalHeight: Infinity, fontSize: 1 };
  while (max - min > 0.5) {
    const size = (min + max) / 2;
    ctx.font = `${size}px ${family}`;
    const layout = layoutWrap(ctx, text, maxWidth, font, size);
    if (layout.totalHeight <= maxHeight) {
      best = layout;
      min = size;
    } else {
      max = size;
    }
  }
  if (best.lines.length === 0) {
    ctx.font = `${min}px ${family}`;
    best = layoutWrap(ctx, text, maxWidth, font, min);
  }
  return best;
}

function horizontalAlignFrom(alignment: GQL.ElementAlignment): CanvasTextAlign {
  switch (alignment) {
    case GQL.ElementAlignment.TopCenter:
    case GQL.ElementAlignment.Center:
    case GQL.ElementAlignment.BottomCenter:
    case GQL.ElementAlignment.BaselineCenter:
      return "center";
    case GQL.ElementAlignment.TopEnd:
    case GQL.ElementAlignment.CenterEnd:
    case GQL.ElementAlignment.BottomEnd:
    case GQL.ElementAlignment.BaselineEnd:
      return "right";
    default:
      return "left";
  }
}

function verticalBlockTop(
  alignment: GQL.ElementAlignment,
  elementY: number,
  elementHeight: number,
  totalHeight: number
): number {
  switch (alignment) {
    case GQL.ElementAlignment.TopStart:
    case GQL.ElementAlignment.TopCenter:
    case GQL.ElementAlignment.TopEnd:
      return elementY;
    case GQL.ElementAlignment.CenterStart:
    case GQL.ElementAlignment.Center:
    case GQL.ElementAlignment.CenterEnd:
      return elementY + (elementHeight - totalHeight) / 2;
    case GQL.ElementAlignment.BottomStart:
    case GQL.ElementAlignment.BottomCenter:
    case GQL.ElementAlignment.BottomEnd:
    case GQL.ElementAlignment.BaselineStart:
    case GQL.ElementAlignment.BaselineCenter:
    case GQL.ElementAlignment.BaselineEnd:
      return elementY + (elementHeight - totalHeight);
    default:
      return elementY;
  }
}

export function drawLayout(
  ctx: CanvasRenderingContext2D,
  element: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    alignment: GQL.ElementAlignment;
  },
  layout: TextLayoutResult,
  font: OpentypeFont | undefined,
  family: string
) {
  const { lines, totalHeight, fontSize } = layout;
  const { lineHeight, baselineOffset } = getTrueFontMetrics(font, fontSize);

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = horizontalAlignFrom(element.alignment);
  ctx.fillStyle = element.color;
  ctx.font = `${fontSize}px ${family}`;

  let drawX = element.x;
  if (ctx.textAlign === "center") drawX = element.x + element.width / 2;
  else if (ctx.textAlign === "right") drawX = element.x + element.width;

  const blockTop = verticalBlockTop(element.alignment, element.y, element.height, totalHeight);

  lines.forEach((line, idx) => {
    const y = blockTop + idx * lineHeight + baselineOffset;
    ctx.fillText(line, drawX, y);
  });
}
