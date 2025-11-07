import * as GQL from "@/client/graphql/generated/gql/graphql";

/**
 * Draw debug border around element bounding box
 * Complexity: 3 (save/restore + drawing operations)
 */
export function drawDebugBorder(
  ctx: CanvasRenderingContext2D,
  element: GQL.CertificateElementBase,
  color = "red"
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(element.positionX, element.positionY, element.width, element.height);
  ctx.restore();
}
