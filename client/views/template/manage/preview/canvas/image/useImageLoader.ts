import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";
import { extractImageUrls, loadImage } from "./imageUtils";

/**
 * Custom hook for loading and caching images
 * Complexity: 12 (effect + promise handling + error handling)
 */
export function useImageLoader(elements: GQL.CertificateElementUnion[]) {
  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const imageCache = React.useRef<Map<string, HTMLImageElement>>(new Map());

  React.useEffect(() => {
    const imageUrls = extractImageUrls(elements);

    if (imageUrls.length === 0) {
      setImagesLoaded(true);
      return;
    }

    loadAllImages(imageUrls)
      .then(images => {
        cacheImages(imageUrls, images, imageCache.current);
        setImagesLoaded(true);
      })
      .catch(error => {
        handleLoadError(error);
        setImagesLoaded(true);
      });
  }, [elements]);

  return { imagesLoaded, imageCache };
}

/**
 * Load all images from URLs
 * Complexity: 2 (Promise.all + map)
 */
function loadAllImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(urls.map(url => loadImage(url)));
}

/**
 * Cache loaded images by URL
 * Complexity: 2 (forEach + map set)
 */
function cacheImages(
  urls: string[],
  images: HTMLImageElement[],
  cache: Map<string, HTMLImageElement>
): void {
  urls.forEach((url, idx) => {
    cache.set(url, images[idx]);
  });
}

/**
 * Handle image loading errors
 * Complexity: 2 (error logging)
 */
function handleLoadError(error: unknown): void {
  logger.error({ caller: "useImageLoader" }, "Failed to load images", { error });
}
