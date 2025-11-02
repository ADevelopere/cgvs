import { gqlSchemaBuilder } from "../../gqlSchemaBuilder";
import * as ElementPothos from "../../pothos/element";
import {
  DateElementRepository,
} from "@/server/db/repo";

import {
  DateElementUtils,
} from "@/server/utils";

gqlSchemaBuilder.mutationFields(t => ({
  createDateElement: t.field({
    type: ElementPothos.DateElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.DateElementInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = DateElementUtils.mapDateElementCreateGraphqlToInput(
        args.input
      );
      return await DateElementRepository.create(input);
    },
  }),

  updateDateElement: t.field({
    type: ElementPothos.DateElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.DateElementUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = DateElementUtils.mapDateElementUpdateGraphqlToInput(
        args.input
      );
      return await DateElementRepository.update(input);
    },
  }),

}));
