// Check if the path is within the public directory structure
export const isPublicPath = (path: string): boolean => {
  return path === "" || path === "public" || path.startsWith("public/");
};

// Get the display path (removes 'public/' prefix for UI)
export const getDisplayPath = (path: string): string => {
  if (path === "public" || path === "") return "";
  return path.startsWith("public/") ? path.substring(7) : path;
};

// Get the full storage path
export const getStoragePath = (displayPath: string): string => {
  // if (displayPath === "") return "public";
  return displayPath;
};
