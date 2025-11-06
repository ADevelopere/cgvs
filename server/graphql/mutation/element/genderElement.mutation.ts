import { gqlSchemaBuilder } from "../../gqlSchemaBuilder";
import * as ElementPothos from "../../pothos/element";
import { GenderElementRepository } from "@/server/db/repo";
import { GenderElementUtils } from "@/server/utils";

// =========================================================================
// GENDER Element Mutations
// =========================================================================
gqlSchemaBuilder.mutationFields(t => ({
  createGenderElement: t.field({
    type: ElementPothos.GenderElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.GenderElementInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = GenderElementUtils.mapGenderElementCreateGraphqlToInput(args.input);
      return await GenderElementRepository.create(input);
    },
  }),

  updateGenderElement: t.field({
    type: ElementPothos.GenderElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.GenderElementUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = GenderElementUtils.mapGenderElementUpdateGraphqlToInput(args.input);
      return await GenderElementRepository.update(input);
    },
  }),
}));
