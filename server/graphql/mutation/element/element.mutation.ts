import { gqlSchemaBuilder } from "../../gqlSchemaBuilder";
import * as ElementPothos from "../../pothos/element";
import { ElementRepository, TextPropsRepository } from "@/server/db/repo";
import { CommonElementUtils, TextPropsUtils } from "@/server/utils";

// =========================================================================
// Generic Element Mutations (Work Across All Types)
// =========================================================================
gqlSchemaBuilder.mutationFields(t => ({
  updateElementCommonProperties: t.field({
    type: ElementPothos.UpdateElemenetBaseResponseObject,
    args: {
      input: t.arg({
        type: ElementPothos.CertificateElementBaseUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = args.input;
      const base = await ElementRepository.updateBaseElement(input);
      return {
        base: base,
      };
    },
  }),

  updateElementTextProps: t.field({
    type: ElementPothos.ElementWithTextPropsPothosObject,
    args: {
      input: t.arg({
        type: ElementPothos.TextPropsUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = args.input;
      const textProps = CommonElementUtils.mapTextPropsUpdateGraphqlToInput(input)!;
      const result = await TextPropsRepository.update(textProps);
      return {
        textProps: TextPropsUtils.entityToTextProps(result),
      };
    },
  }),

  deleteElement: t.field({
    type: "Boolean",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_, args) => {
      await ElementRepository.deleteById(args.id);
      return true;
    },
  }),

  deleteElements: t.field({
    type: "Boolean",
    args: {
      ids: t.arg.intList({ required: true }),
    },
    resolve: async (_, args) => {
      await ElementRepository.deleteByIds(args.ids);
      return true;
    },
  }),

  moveElement: t.field({
    type: [ElementPothos.UpdateElemenetBaseResponseObject],
    args: {
      input: t.arg({
        type: ElementPothos.ElementMoveInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      return await ElementRepository.moveElement(args.input);
    },
  }),

  increaseElementOrder: t.field({
    type: [ElementPothos.UpdateElemenetBaseResponseObject],
    args: {
      input: t.arg({
        type: ElementPothos.IncreaseElementOrderInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      return await ElementRepository.increaseElementOrder(args.input);
    },
  }),

  decreaseElementOrder: t.field({
    type: [ElementPothos.UpdateElemenetBaseResponseObject],
    args: {
      input: t.arg({
        type: ElementPothos.DecreaseElementOrderInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      return await ElementRepository.decreaseElementOrder(args.input);
    },
  }),
}));
