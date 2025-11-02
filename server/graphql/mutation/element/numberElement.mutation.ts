import { gqlSchemaBuilder } from "../../gqlSchemaBuilder";
import * as ElementPothos from "../../pothos/element";
import { NumberElementRepository } from "@/server/db/repo";
import { NumberElementUtils } from "@/server/utils";

// =========================================================================
// NUMBER Element Mutations
// =========================================================================
gqlSchemaBuilder.mutationFields(t => ({
  createNumberElement: t.field({
    type: ElementPothos.NumberElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.NumberElementInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = NumberElementUtils.mapNumberElementCreateGraphqlToInput(
        args.input
      );
      return await NumberElementRepository.create(input);
    },
  }),

  updateNumberElement: t.field({
    type: ElementPothos.NumberElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.NumberElementUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = NumberElementUtils.mapNumberElementUpdateGraphqlToInput(
        args.input
      );
      return await NumberElementRepository.update(input);
    },
  }),

  updateNumberElementDataSource: t.field({
    type: ElementPothos.NumberElementDataSourceUpdateResponseObject,
    args: {
      input: t.arg({
        type: ElementPothos.NumberElementDataSourceStandaloneUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input =
        NumberElementUtils.mapNumberElementDataSourceStandaloneUpdateGraphqlToInput(
          args.input
        );
      return await NumberElementRepository.updateNumberElementDataSource(input);
    },
  }),

  updateNumberElementSpecProps: t.field({
    type: ElementPothos.NumberElementSpecPropsUpdateResponseObject,
    args: {
      input: t.arg({
        type: ElementPothos.NumberElementSpecPropsStandaloneUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      return await NumberElementRepository.updateNumberElementSpecProps(
        args.input
      );
    },
  }),
}));
