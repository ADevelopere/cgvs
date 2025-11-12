import { gqlSchemaBuilder } from "../../gqlSchemaBuilder";
import * as ElementPothos from "../../pothos/element";
import { TextElementRepository } from "@/server/db/repo";
import { TextElementUtils } from "@/server/utils";

gqlSchemaBuilder.mutationFields(t => ({
  // =========================================================================
  // TEXT Element Mutations
  // =========================================================================
  createTextElement: t.field({
    type: ElementPothos.TextElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.TextElementInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = TextElementUtils.mapTextElementGraphqlToInput(args.input);
      const element = await TextElementRepository.create(input);
      return element;
    },
  }),

  updateTextElement: t.field({
    type: ElementPothos.TextElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.TextElementUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = TextElementUtils.mapTextElementUpdateGraphqlToInput(args.input);
      return await TextElementRepository.update(input);
    },
  }),

  updateTextElementDataSource: t.field({
    type: ElementPothos.TextDataSourceUpdateResponsePothosObject,
    args: {
      input: t.arg({
        type: ElementPothos.TextDataSourceStandaloneInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = TextElementUtils.mapDataSourceStandaloneGqlToInput(args.input);
      return await TextElementRepository.updateTextElementDataSource(input);
    },
  }),
}));
