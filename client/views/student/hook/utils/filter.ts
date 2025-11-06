/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { DateFilterOperation, TextFilterOperation, DateFilterValue } from "@/client/types/filters";
import logger from "@/client/lib/logger";

// Helper function to get column type for filter mapping
export const getColumnType = (
  columnId: keyof Graphql.Student
): "text" | "date" | "phone" | "select" | "country" | null => {
  const typeMap: Record<string, "text" | "date" | "phone" | "select" | "country"> = {
    name: "text",
    email: "text",
    phoneNumber: "phone",
    dateOfBirth: "date",
    createdAt: "date",
    updatedAt: "date",
    gender: "select",
    nationality: "country",
  };
  return typeMap[columnId as string] || null;
};

// Helper function to get all possible filter keys for a column in the new structure
// Since filters are now grouped in filterArgs, this function helps clear the appropriate filter fields
export const getFilterKeysForColumn = (columnId: keyof Graphql.Student): (keyof Graphql.StudentFilterArgs)[] => {
  switch (columnId) {
    case "name":
      return [
        "name",
        "nameNotContains",
        "nameEquals",
        "nameNotEquals",
        "nameStartsWith",
        "nameEndsWith",
        "nameIsEmpty",
        "nameIsNotEmpty",
      ];
    case "email":
      return [
        "email",
        "emailNotContains",
        "emailEquals",
        "emailNotEquals",
        "emailStartsWith",
        "emailEndsWith",
        "emailIsEmpty",
        "emailIsNotEmpty",
      ];
    case "phoneNumber":
      return ["phoneNumber"];
    case "dateOfBirth":
      return [
        "birthDate",
        "birthDateNot",
        "birthDateFrom",
        "birthDateTo",
        "birthDateAfter",
        "birthDateBefore",
        "birthDateOnOrAfter",
        "birthDateOnOrBefore",
        "birthDateIsEmpty",
        "birthDateIsNotEmpty",
      ];
    case "createdAt":
      return [
        "createdAt",
        "createdAtNot",
        "createdAtFrom",
        "createdAtTo",
        "createdAtAfter",
        "createdAtBefore",
        "createdAtOnOrAfter",
        "createdAtOnOrBefore",
        "createdAtIsEmpty",
        "createdAtIsNotEmpty",
      ];
    case "gender":
      return ["gender"];
    case "nationality":
      return ["nationality"];
    default:
      return [];
  }
};

// Legacy function to maintain compatibility - maps to top-level query variables that need clearing
export const getQueryParamKeysForColumn = (): (keyof Graphql.StudentsQueryVariables)[] => {
  // In the new structure, filters are grouped in filterArgs and pagination in paginationArgs
  // This function is mainly used for resetting pagination when filters change
  return ["paginationArgs"] as (keyof Graphql.StudentsQueryVariables)[];
};

// Define mappings for text operations to camelCase filter field names
export const textOperationConfig: {
  [key in TextFilterOperation]?: {
    // Field name in StudentFilterArgs (camelCase)
    fieldName: (columnId: keyof Graphql.Student) => keyof Graphql.StudentFilterArgs;
    // Does this operation require a boolean value instead of string?
    isBooleanOp?: boolean;
  };
} = {
  [TextFilterOperation.contains]: {
    fieldName: columnId => {
      // Map to base field name
      const fieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
        name: "name",
        email: "email",
        phoneNumber: "phoneNumber",
      };
      return fieldMap[columnId as string] || (columnId as keyof Graphql.StudentFilterArgs);
    },
  },
  [TextFilterOperation.notContains]: {
    fieldName: columnId => {
      const fieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
        name: "nameNotContains",
        email: "emailNotContains",
      };
      return fieldMap[columnId as string] || (columnId as keyof Graphql.StudentFilterArgs);
    },
  },
  [TextFilterOperation.equals]: {
    fieldName: columnId => {
      const fieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
        name: "nameEquals",
        email: "emailEquals",
      };
      return fieldMap[columnId as string] || (columnId as keyof Graphql.StudentFilterArgs);
    },
  },
  [TextFilterOperation.notEquals]: {
    fieldName: columnId => {
      const fieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
        name: "nameNotEquals",
        email: "emailNotEquals",
      };
      return fieldMap[columnId as string] || (columnId as keyof Graphql.StudentFilterArgs);
    },
  },
  [TextFilterOperation.startsWith]: {
    fieldName: columnId => {
      const fieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
        name: "nameStartsWith",
        email: "emailStartsWith",
      };
      return fieldMap[columnId as string] || (columnId as keyof Graphql.StudentFilterArgs);
    },
  },
  [TextFilterOperation.endsWith]: {
    fieldName: columnId => {
      const fieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
        name: "nameEndsWith",
        email: "emailEndsWith",
      };
      return fieldMap[columnId as string] || (columnId as keyof Graphql.StudentFilterArgs);
    },
  },
  [TextFilterOperation.isEmpty]: {
    fieldName: columnId => {
      const fieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
        name: "nameIsEmpty",
        email: "emailIsEmpty",
      };
      return fieldMap[columnId as string] || (columnId as keyof Graphql.StudentFilterArgs);
    },
    isBooleanOp: true,
  },
  [TextFilterOperation.isNotEmpty]: {
    fieldName: columnId => {
      const fieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
        name: "nameIsNotEmpty",
        email: "emailIsNotEmpty",
      };
      return fieldMap[columnId as string] || (columnId as keyof Graphql.StudentFilterArgs);
    },
    isBooleanOp: true,
  },
};

// Helper to map a single text filter operation to StudentFilterArgs
export const mapTextFilter = (
  columnId: keyof Graphql.Student,
  op: TextFilterOperation,
  value: string | boolean
): Partial<Graphql.StudentFilterArgs> => {
  const filterArgs: Partial<Graphql.StudentFilterArgs> = {};
  const config = textOperationConfig[op];

  // If operation is not configured, return empty params
  if (!config) {
    logger.warn(`Unsupported text filter operation: ${op}`);
    return filterArgs;
  }

  // Validate value type based on operation config
  const requiresBoolean = config.isBooleanOp ?? false;
  if (requiresBoolean && typeof value !== "boolean") {
    logger.warn(`Operation ${op} requires a boolean value.`);
    return filterArgs;
  }
  if (!requiresBoolean && typeof value !== "string") {
    logger.warn(`Operation ${op} requires a string value.`);
    return filterArgs;
  }

  // Handle special case: phoneNumber might only support CONTAINS
  if (columnId === "phoneNumber") {
    if (op === TextFilterOperation.contains && typeof value === "string") {
      filterArgs.phoneNumber = value; // Raw value, server will add wildcards
    } else if (op !== TextFilterOperation.contains) {
      logger.warn(`Operation ${op} might not be supported for phoneNumber.`);
    }
    return filterArgs; // Return early for phoneNumber
  }

  // Get the field name for this operation and column
  const fieldName = config.fieldName(columnId);

  // Assign value based on type
  if (requiresBoolean) {
    // Only assign if the boolean value is true
    if (value === true) {
      (filterArgs as any)[fieldName] = true;
    }
  } else {
    // Pass raw string value - server will handle wildcards
    (filterArgs as any)[fieldName] = value as string;
  }

  return filterArgs;
};

// Helper to format date for MySQL datetime format
export const formatDate = (date: string | Date | null | undefined): string | undefined => {
  if (!date) return undefined;

  try {
    // Convert to Date if it's a string
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Format as YYYY-MM-DD HH:mm:ss
    return dateObj.toISOString().slice(0, 19).replace("T", " ");
  } catch {
    return undefined; // Handle invalid date object
  }
};

// Helper to map a single date filter operation to StudentFilterArgs
export const mapDateFilter = (
  columnId: keyof Graphql.Student,
  op: DateFilterOperation,
  value: DateFilterValue | string | boolean
): Partial<Graphql.StudentFilterArgs> => {
  const filterArgs: Partial<Graphql.StudentFilterArgs> = {};

  // Handle boolean operations (isEmpty, isNotEmpty)
  if (op === DateFilterOperation.isEmpty || op === DateFilterOperation.isNotEmpty) {
    // Map columnId to the appropriate boolean field
    const fieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
      dateOfBirth: op === DateFilterOperation.isEmpty ? "birthDateIsEmpty" : "birthDateIsNotEmpty",
      createdAt: op === DateFilterOperation.isEmpty ? "createdAtIsEmpty" : "createdAtIsNotEmpty",
    };

    const fieldName = fieldMap[columnId as string];
    if (fieldName) {
      (filterArgs as any)[fieldName] = true;
    }
    return filterArgs;
  }

  // Handle date range operations (between)
  if (op === DateFilterOperation.between && typeof value === "object" && value !== null) {
    const { from, to } = value;

    // Map columnId to from/to field names
    const fromFieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
      dateOfBirth: "birthDateFrom",
      createdAt: "createdAtFrom",
    };
    const toFieldMap: Record<string, keyof Graphql.StudentFilterArgs> = {
      dateOfBirth: "birthDateTo",
      createdAt: "createdAtTo",
    };

    if (from) {
      const fromField = fromFieldMap[columnId as string];
      if (fromField) {
        (filterArgs as any)[fromField] = formatDate(from);
      }
    }
    if (to) {
      const toField = toFieldMap[columnId as string];
      if (toField) {
        (filterArgs as any)[toField] = formatDate(to);
      }
    }
    return filterArgs;
  }

  // Handle single date operations
  const operationFieldMap: Record<string, Record<DateFilterOperation, keyof Graphql.StudentFilterArgs>> = {
    dateOfBirth: {
      [DateFilterOperation.is]: "birthDate",
      [DateFilterOperation.isNot]: "birthDateNot",
      [DateFilterOperation.isBefore]: "birthDateBefore",
      [DateFilterOperation.isAfter]: "birthDateAfter",
      [DateFilterOperation.isOnOrBefore]: "birthDateOnOrBefore",
      [DateFilterOperation.isOnOrAfter]: "birthDateOnOrAfter",
    } as any,
    createdAt: {
      [DateFilterOperation.is]: "createdAt",
      [DateFilterOperation.isNot]: "createdAtNot",
      [DateFilterOperation.isBefore]: "createdAtBefore",
      [DateFilterOperation.isAfter]: "createdAtAfter",
      [DateFilterOperation.isOnOrBefore]: "createdAtOnOrBefore",
      [DateFilterOperation.isOnOrAfter]: "createdAtOnOrAfter",
    } as any,
  };

  const fieldName = operationFieldMap[columnId as string]?.[op];
  if (!fieldName) {
    logger.warn(`Unsupported date filter operation: ${op} for column: ${columnId}`);
    return filterArgs;
  }

  // For single date operations, we use the 'from' value if available
  if (typeof value === "object" && value?.from) {
    (filterArgs as any)[fieldName] = formatDate(value.from);
  } else if (typeof value === "string") {
    // Handle direct date string value
    (filterArgs as any)[fieldName] = formatDate(value);
  }

  return filterArgs;
};
