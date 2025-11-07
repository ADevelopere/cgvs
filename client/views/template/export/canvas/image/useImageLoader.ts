import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";
import { extractImageUrls, loadImage } from "./imageUtils";
import { useCanvasImageStore } from "../stores/useCanvasImageStore";

/**
 * Custom hook for loading and caching images
 * Complexity: 12 (effect + promise handling + error handling)
 * Only loads images for visible (non-hidden) elements
 * Uses Zustand store for persistence across tab switches
 */
export function useImageLoader(elements: GQL.CertificateElementUnion[]) {
  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const { getImage, hasImage, setImage, getInflight, setInflight, removeInflight } = useCanvasImageStore();

  // Memoize visible image URLs to detect changes in hidden state
  const imageUrls = React.useMemo(() => extractImageUrls(elements), [elements]);
  const imageUrlsKey = imageUrls.join("|");

  React.useEffect(() => {
    if (imageUrls.length === 0) {
      setImagesLoaded(true);
      return;
    }

    setImagesLoaded(false);

    const loadImageWithCache = async (url: string): Promise<void> => {
      if (hasImage(url)) return;
      const existingInflight = getInflight(url);
      if (existingInflight) {
        await existingInflight;
        return;
      }

      const promise = loadImage(url)
        .then(img => {
          setImage(url, img);
          return img;
        })
        .catch(error => {
          logger.error({ caller: "useImageLoader" }, "Failed to load image", { url, error });
          throw error;
        })
        .finally(() => {
          removeInflight(url);
        });

      setInflight(url, promise);
      await promise;
    };

    Promise.all(imageUrls.map(url => loadImageWithCache(url)))
      .then(() => {
        setImagesLoaded(true);
      })
      .catch(error => {
        logger.error({ caller: "useImageLoader" }, "Failed to load images", { error });
        setImagesLoaded(true);
      });
  }, [imageUrlsKey, getImage, hasImage, setImage, getInflight, setInflight, removeInflight]);

  // Create imageCache ref that returns current store state
  const imageCache = React.useMemo(() => {
    const cache = new Map<string, HTMLImageElement>();
    imageUrls.forEach(url => {
      const img = getImage(url);
      if (img) cache.set(url, img);
    });
    return { current: cache };
  }, [imageUrls, getImage, imagesLoaded]);

  return { imagesLoaded, imageCache };
}
