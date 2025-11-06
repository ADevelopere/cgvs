import { TemplateConfigTranslations } from "@/client/locale";
import { TemplateConfigFormValidateFn } from "./types";

export const useTemplateConfigFormValidateFn = (strings: TemplateConfigTranslations) => {
  const validate: TemplateConfigFormValidateFn = ({ key, value }) => {
    switch (key) {
      case "width":
      case "height":
        if (!value) {
          return strings.valueIsRequired ?? `${key} is required`;
        }
        if (value <= 100) {
          return strings.valueIsTooSmall ?? `${key} must be positive`;
        } else if (value > 10000) {
          return strings.valueIsTooLarge ?? `${key} must be less than or equal to 10000`;
        }
        return undefined;
      default:
        return undefined;
    }
  };
  return validate;
};
