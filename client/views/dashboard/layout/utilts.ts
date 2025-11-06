import { NavigationPageItem } from "./types";

export const isPathActive = (navItem: NavigationPageItem, currentPathname: string): boolean => {
  const normalizedPathname = currentPathname.replace(/\/$/, "");
  const itemPath = navItem.pattern || (navItem.segment ? `/${navItem.segment}` : "");

  if (itemPath) {
    // Direct match
    if (normalizedPathname === itemPath) {
      return true;
    }
    // Check if current path starts with the item path (for nested routes)
    if (normalizedPathname.startsWith(itemPath + "/")) {
      return true;
    }
  }

  // Check children recursively
  if (navItem.children) {
    return navItem.children.some(child => child.kind === "page" && isPathActive(child, currentPathname));
  }

  return false;
};
