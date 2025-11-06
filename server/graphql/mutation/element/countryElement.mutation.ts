import { gqlSchemaBuilder } from "../../gqlSchemaBuilder";
import * as ElementPothos from "../../pothos/element";
import { CountryElementRepository } from "@/server/db/repo";
import { CountryElementUtils } from "@/server/utils";
// =========================================================================
// COUNTRY Element Mutations
// =========================================================================
gqlSchemaBuilder.mutationFields(t => ({
  createCountryElement: t.field({
    type: ElementPothos.CountryElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.CountryElementInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = CountryElementUtils.mapCountryElementCreateGraphqlToInput(args.input);
      return await CountryElementRepository.create(input);
    },
  }),

  updateCountryElement: t.field({
    type: ElementPothos.CountryElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.CountryElementUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = CountryElementUtils.mapCountryElementUpdateGraphqlToInput(args.input);
      return await CountryElementRepository.update(input);
    },
  }),

  updateCountryElementSpecProps: t.field({
    type: ElementPothos.CountryElementSpecPropsStandaloneUpdateResponseObject,
    args: {
      input: t.arg({
        type: ElementPothos.CountryElementSpecPropsStandaloneUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      return await CountryElementRepository.updateSpecProps(args.input);
    },
  }),
}));
