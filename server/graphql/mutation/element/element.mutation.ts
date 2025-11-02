import { gqlSchemaBuilder } from "../../gqlSchemaBuilder";
import * as ElementPothos from "../../pothos/element";
import { ElementRepository, TextPropsRepository } from "@/server/db/repo";
import { CommonElementUtils, TextPropsUtils } from "@/server/utils";

// =========================================================================
// Generic Element Mutations (Work Across All Types)
// =========================================================================
gqlSchemaBuilder.mutationFields(t => ({
  updateElementCommonProperties: t.field({
    type: ElementPothos.CertificateElementBaseObject,
    args: {
      input: t.arg({
        type: ElementPothos.CertificateElementBaseUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = args.input;
      return await ElementRepository.updateBaseElement(input);
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
      const textProps =
        CommonElementUtils.mapTextPropsUpdateGraphqlToInput(input)!;
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

  updateElementsRenderOrder: t.field({
    type: "Boolean",
    args: {
      updates: t.arg({
        type: [ElementPothos.ElementOrderUpdateInputObject],
        required: true,
      }),
    },
    resolve: async (_, args) => {
      await ElementRepository.updateRenderOrder(args.updates);
      return true;
    },
  }),
}));
