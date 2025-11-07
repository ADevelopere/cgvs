import * as GQL from "@/client/graphql/generated/gql/graphql";
import { ImageDimensions } from "../types";

/**
 * Load an image from URL and return as HTMLImageElement
 * Complexity: 5 (promise + callbacks + error handling)
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Calculate image dimensions based on fit mode
 * Complexity: 8 (switch + multiple conditionals per case)
 */
export function calculateImageDimensions(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
  fit: GQL.ElementImageFit
): ImageDimensions {
  const imageAspect = imageWidth / imageHeight;
  const containerAspect = containerWidth / containerHeight;

  switch (fit) {
    case GQL.ElementImageFit.Fill:
      return calculateFillDimensions(containerWidth, containerHeight);

    case GQL.ElementImageFit.Cover:
      return calculateCoverDimensions(imageAspect, containerAspect, containerWidth, containerHeight);

    case GQL.ElementImageFit.Contain:
    default:
      return calculateContainDimensions(imageAspect, containerAspect, containerWidth, containerHeight);
  }
}

/**
 * Calculate dimensions for FILL mode (stretch to container)
 * Complexity: 1 (simple return)
 */
function calculateFillDimensions(containerWidth: number, containerHeight: number): ImageDimensions {
  return {
    width: containerWidth,
    height: containerHeight,
    x: 0,
    y: 0,
  };
}

/**
 * Calculate dimensions for COVER mode (fill container, crop excess)
 * Complexity: 5 (conditional + calculations)
 */
function calculateCoverDimensions(
  imageAspect: number,
  containerAspect: number,
  containerWidth: number,
  containerHeight: number
): ImageDimensions {
  if (imageAspect > containerAspect) {
    // Image is wider - fit height and crop width
    const finalHeight = containerHeight;
    const finalWidth = containerHeight * imageAspect;
    return {
      width: finalWidth,
      height: finalHeight,
      x: -(finalWidth - containerWidth) / 2,
      y: 0,
    };
  } else {
    // Image is taller - fit width and crop height
    const finalWidth = containerWidth;
    const finalHeight = containerWidth / imageAspect;
    return {
      width: finalWidth,
      height: finalHeight,
      x: 0,
      y: -(finalHeight - containerHeight) / 2,
    };
  }
}

/**
 * Calculate dimensions for CONTAIN mode (fit inside container)
 * Complexity: 5 (conditional + calculations)
 */
function calculateContainDimensions(
  imageAspect: number,
  containerAspect: number,
  containerWidth: number,
  containerHeight: number
): ImageDimensions {
  if (imageAspect > containerAspect) {
    // Image is wider - fit width
    const finalWidth = containerWidth;
    const finalHeight = containerWidth / imageAspect;
    return {
      width: finalWidth,
      height: finalHeight,
      x: 0,
      y: (containerHeight - finalHeight) / 2,
    };
  } else {
    // Image is taller - fit height
    const finalHeight = containerHeight;
    const finalWidth = containerHeight * imageAspect;
    return {
      width: finalWidth,
      height: finalHeight,
      x: (containerWidth - finalWidth) / 2,
      y: 0,
    };
  }
}

/**
 * Extract image URLs from image elements
 * Complexity: 4 (filter + map + filter)
 * Skips hidden elements to avoid loading unnecessary images
 */
export function extractImageUrls(elements: GQL.CertificateElementUnion[]): string[] {
  const imageElements = elements.filter(
    (e): e is GQL.ImageElement => e.__typename === "ImageElement" && !e.base.hidden
  );

  return imageElements.map(el => el.imageDataSource?.imageUrl).filter((url): url is string => !!url);
}
