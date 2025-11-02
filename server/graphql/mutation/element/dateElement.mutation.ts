import { gqlSchemaBuilder } from "../../gqlSchemaBuilder";
import * as ElementPothos from "../../pothos/element";
import { DateElementRepository } from "@/server/db/repo";

import { DateElementUtils } from "@/server/utils";

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

  updateDateElementDataSource: t.field({
    type: ElementPothos.DateDataSourceUpdateResponsePothosObject,
    args: {
      input: t.arg({
        type: ElementPothos.DateDataSourceStandaloneInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = DateElementUtils.mapDataSourceStandaloneGqlToInput(
        args.input
      );
      return await DateElementRepository.updateDateElementDataSource(input);
    },
  }),

  updateDateElementSpecProps: t.field({
    type: ElementPothos.DateElementSpecPropsUpdateResponsePothosObject,
    args: {
      input: t.arg({
        type: ElementPothos.DateElementSpecPropsStandaloneInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      return await DateElementRepository.updateDateElementSpecProps(args.input);
    },
  }),
}));
