type TemplateParam = {
  imageUrl?: string | null;
};

/**
 * Get the appropriate image URL for a template based on the current theme mode
 * @param template - The template object containing imageUrl
 * @param isDark - Whether the current theme is dark mode
 * @returns The template's imageUrl or a theme-appropriate placeholder
 */
export function getTemplateImageUrl(
  template: TemplateParam,
  isDark: boolean,
): string {
  // If template has an imageUrl, use it
  if (template.imageUrl) {
    return template.imageUrl;
  }

  // Otherwise, return theme-appropriate placeholder
  return isDark
    ? "/templateCover/placeholder_dark.png"
    : "/templateCover/placeholder_light.png";
}
