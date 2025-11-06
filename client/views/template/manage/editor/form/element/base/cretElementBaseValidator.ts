import { ValidateBaseElementFieldFn } from "./types";

export const validateBaseElementField = () => {
  const validate: ValidateBaseElementFieldFn = ({ key, value }) => {
    switch (key) {
      case "name": {
        const nameValue = value;
        if (!nameValue) return "Name is required";
        if (nameValue.length < 2) return "Name must be at least 2 characters";
        return undefined;
      }
      case "width":
      case "height": {
        const dimensionValue = value;
        if (dimensionValue === undefined || dimensionValue === null) return "Required";
        if (dimensionValue <= 0) return "Must be positive";
        return undefined;
      }
      default:
        return undefined;
    }
  };
  return validate;
};
