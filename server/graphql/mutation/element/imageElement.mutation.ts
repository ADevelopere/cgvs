import { gqlSchemaBuilder } from "../../gqlSchemaBuilder";
import * as ElementPothos from "../../pothos/element";
import {
  ImageElementRepository,
} from "@/server/db/repo";
import {
  ImageElementUtils,
} from "@/server/utils";

gqlSchemaBuilder.mutationFields(t => ({
  createImageElement: t.field({
    type: ElementPothos.ImageElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.ImageElementInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = ImageElementUtils.mapImageElementCreateGraphqlToInput(
        args.input
      );
      return await ImageElementRepository.create(input);
    },
  }),

  updateImageElement: t.field({
    type: ElementPothos.ImageElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.ImageElementUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = ImageElementUtils.mapImageElementUpdateGraphqlToInput(
        args.input
      );
      return await ImageElementRepository.update(input);
    },
  }),

  updateImageElementSpecProps: t.field({
    type: ElementPothos.ImageElementSpecPropsStandaloneUpdateResponseObject,
    args: {
      input: t.arg({
        type: ElementPothos.ImageElementSpecPropsStandaloneUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      return await ImageElementRepository.updateSpecProps(args.input);
    },
  }),
}));
