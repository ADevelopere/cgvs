import { TemplateConfigTranslations } from "@/client/locale";
import { TemplateConfigFormValidateFn } from "./types";

export const useTemplateConfigFormValidateFn = (
  strings: TemplateConfigTranslations
) => {

  const validate: TemplateConfigFormValidateFn = ({ key, value }) => {
    switch (key) {
      case "width":
      case "height":
        if (value <= 0) {
          return (
            strings.valueMustBeGreaterThanZero ?? `${key} must be positive`
          );
        } else if (value > 10000) {
          return (
            strings.valueMustBeLessThanOrEqualTo10000 ??
            `${key} must be less than or equal to 10000`
          );
        }
        return undefined;
      default:
        return undefined;
    }
  };
  return validate;
};
