import * as Graphql from "@/graphql/generated/types";
import { mimeToContentType } from "./storage.constant";

// Define location metadata for frontend usage
export type LocationInfo = {
  key: Graphql.UploadLocation;
  label: string;
  description: string;
  path: string;
  allowedContentTypes: Graphql.ContentType[];
  icon?: string; // You can add Material-UI icon names here
};

// Location definitions - this should match the backend UploadLocation enum
export const UPLOAD_LOCATIONS: Record<Graphql.UploadLocation, LocationInfo> = {
  TEMPLATE_COVER: {
    key: "TEMPLATE_COVER",
    label: "Template Covers",
    description: "Cover images for certificate templates",
    path: "public/templateCover",
    allowedContentTypes: ["JPEG", "PNG", "WEBP"],
    icon: "Image",
  },
  // Add more locations here as they're defined in the backend
};

// Helper functions
export const getLocationInfo = (location: Graphql.UploadLocation): LocationInfo => {
  return UPLOAD_LOCATIONS[location];
};

export const getLocationByPath = (path: string): LocationInfo | null => {
  // Remove 'public/' prefix if present to match the paths
  const normalizedPath = path.startsWith("public/") ? path.substring(7) : path;
  
  for (const location of Object.values(UPLOAD_LOCATIONS)) {
    const locationPath = location.path.startsWith("public/") 
      ? location.path.substring(7) 
      : location.path;
    
    if (locationPath === normalizedPath) {
      return location;
    }
  }
  return null;
};

export const isValidUploadLocation = (path: string): boolean => {
  return getLocationByPath(path) !== null;
};

export const getUploadLocationOptions = (): LocationInfo[] => {
  return Object.values(UPLOAD_LOCATIONS);
};

/**
 * Checks if a file type (ContentType or MIME type string) is allowed for a given upload location.
 * Accepts either a ContentType (e.g., 'JPEG') or a MIME type (e.g., 'image/jpeg').
 * @param location The upload location
 * @param fileType ContentType or MIME type string
 */
export const isFileTypeAllowed = (
  location: Graphql.UploadLocation,
  fileType: string
): boolean => {
  const locationInfo = getLocationInfo(location);
  let contentType: Graphql.ContentType | undefined;

  // If fileType is a known ContentType, use it directly
  if (
    typeof fileType === "string" &&
    locationInfo.allowedContentTypes.includes(fileType as Graphql.ContentType)
  ) {
    contentType = fileType as Graphql.ContentType;
  } else if (typeof fileType === "string" && mimeToContentType[fileType]) {
    // If fileType is a MIME type, map it
    contentType = mimeToContentType[fileType];
  }

  // If not recognized, disallow
  if (!contentType) return false;
  return locationInfo.allowedContentTypes.includes(contentType);
};

// Get the appropriate upload location for a given path
export const getUploadLocationForPath = (path: string): Graphql.UploadLocation | null => {
  const locationInfo = getLocationByPath(path);
  return locationInfo?.key || null;
};

// Check if the path is within the public directory structure
export const isPublicPath = (path: string): boolean => {
  return path === "" || path === "public" || path.startsWith("public/");
};

// Get the display path (removes 'public/' prefix for UI)
export const getDisplayPath = (path: string): string => {
  if (path === "public" || path === "") return "";
  return path.startsWith("public/") ? path.substring(7) : path;
};

// Get the full storage path (adds 'public/' prefix if needed)
export const getStoragePath = (displayPath: string): string => {
  if (displayPath === "") return "public";
  return `public/${displayPath}`;
};
