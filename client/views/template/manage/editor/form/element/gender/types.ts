import type {
  GenderElement,
  GenderElementCreateInput,
  GenderElementUpdateInput,
} from "@/client/graphql/generated/gql/graphql";
import type {
  BaseElementFormErrors,
} from "../base/types";
import type { TextPropsFormErrors } from "../textProps/types";
import { fontReferenceToGraphQL } from "../textProps/types";


// ============================================================================
// ERROR TYPES
// ============================================================================

export type GenderElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
};

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

/**
 * Convert GenderElement (Output type from GraphQL query) to Update Form State
 * Used when loading an existing element for editing
 */
export const genderElementToFormState = (
  element: GenderElement
): GenderElementFormUpdateState => {
  return {
    id: element.id!,
    base: {
      name: element.name ?? "",
      description: element.description ?? "",
      positionX: element.positionX ?? 0,
      positionY: element.positionY ?? 0,
      width: element.width ?? 100,
      height: element.height ?? 50,
      alignment: element.alignment ?? "START",
      renderOrder: element.renderOrder ?? 0,
    },
    textProps: {
      fontRef: element.textProps?.fontRef
        ? fontReferenceToGraphQL(element.textProps.fontRef)
        : { google: { identifier: "" } },
      color: element.textProps?.color ?? "#000000",
      fontSize: element.textProps?.fontSize ?? 12,
      overflow: element.textProps?.overflow ?? "TRUNCATE",
    },
  };
};

/**
 * Convert Create Form State to GenderElementCreateInput for GraphQL mutation
 */
export const formStateToCreateInput = (
  state: GenderElementFormCreateState,
  templateId: number
): GenderElementCreateInput => {
  return {
    templateId,
    name: state.base.name!,
    description: state.base.description!,
    positionX: state.base.positionX!,
    positionY: state.base.positionY!,
    width: state.base.width!,
    height: state.base.height!,
    alignment: state.base.alignment!,
    renderOrder: state.base.renderOrder!,
    textProps: {
      fontRef: state.textProps.fontRef!,
      color: state.textProps.color!,
      fontSize: state.textProps.fontSize!,
      overflow: state.textProps.overflow!,
    },
  };
};

/**
 * Convert Update Form State to GenderElementUpdateInput for GraphQL mutation
 */
export const formStateToUpdateInput = (
  state: GenderElementFormUpdateState
): GenderElementUpdateInput => {
  const input: GenderElementUpdateInput = {
    id: state.id,
  };

  // Only include base fields that have values
  if (state.base.name !== undefined) input.name = state.base.name;
  if (state.base.description !== undefined)
    input.description = state.base.description;
  if (state.base.positionX !== undefined)
    input.positionX = state.base.positionX;
  if (state.base.positionY !== undefined)
    input.positionY = state.base.positionY;
  if (state.base.width !== undefined) input.width = state.base.width;
  if (state.base.height !== undefined) input.height = state.base.height;
  if (state.base.alignment !== undefined)
    input.alignment = state.base.alignment;
  if (state.base.renderOrder !== undefined)
    input.renderOrder = state.base.renderOrder;

  // Only include textProps if we have all required fields
  if (Object.keys(state.textProps).length > 0) {
    // TextPropsUpdateInput requires all fields, so we need to check if we have them all
    // or omit textProps entirely (which means no update to text props)
    const hasAllTextProps =
      state.textProps.fontRef !== undefined &&
      state.textProps.color !== undefined &&
      state.textProps.fontSize !== undefined &&
      state.textProps.overflow !== undefined;

    if (hasAllTextProps) {
      input.textProps = {
        fontRef: state.textProps.fontRef!,
        color: state.textProps.color!,
        fontSize: state.textProps.fontSize!,
        overflow: state.textProps.overflow!,
      };
    }
  }

  return input;
};
