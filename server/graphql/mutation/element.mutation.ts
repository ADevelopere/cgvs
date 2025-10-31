import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as ElementPothos from "../pothos/element";
import {
  ElementRepository,
  TextElementRepository,
  DateElementRepository,
  NumberElementRepository,
  CountryElementRepository,
  GenderElementRepository,
  ImageElementRepository,
  QRCodeElementRepository,
} from "@/server/db/repo";
import * as Types from "@/server/types";
import {
  TextElementUtils,
  DateElementUtils,
  NumberElementUtils,
  CountryElementUtils,
  GenderElementUtils,
  ImageElementUtils,
  QRCodeElementUtils,
} from "@/server/utils";

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
      return element as Types.TextElementOutput;
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
      const input = TextElementUtils.mapTextElementUpdateGraphqlToInput(
        args.input
      );
      return await TextElementRepository.update(input);
    },
  }),

  // =========================================================================
  // DATE Element Mutations
  // =========================================================================
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

  // =========================================================================
  // NUMBER Element Mutations
  // =========================================================================
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

  // =========================================================================
  // COUNTRY Element Mutations
  // =========================================================================
  createCountryElement: t.field({
    type: ElementPothos.CountryElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.CountryElementInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = CountryElementUtils.mapCountryElementCreateGraphqlToInput(
        args.input
      );
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
      const input = CountryElementUtils.mapCountryElementUpdateGraphqlToInput(
        args.input
      );
      return await CountryElementRepository.update(input);
    },
  }),

  // =========================================================================
  // GENDER Element Mutations
  // =========================================================================
  createGenderElement: t.field({
    type: ElementPothos.GenderElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.GenderElementInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = GenderElementUtils.mapGenderElementCreateGraphqlToInput(
        args.input
      );
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
      const input = GenderElementUtils.mapGenderElementUpdateGraphqlToInput(
        args.input
      );
      return await GenderElementRepository.update(input);
    },
  }),

  // =========================================================================
  // IMAGE Element Mutations
  // =========================================================================
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

  // =========================================================================
  // QR_CODE Element Mutations
  // =========================================================================
  createQRCodeElement: t.field({
    type: ElementPothos.QRCodeElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.QRCodeElementInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = QRCodeElementUtils.mapQRCodeElementCreateGraphqlToInput(
        args.input
      );
      return await QRCodeElementRepository.create(input);
    },
  }),

  updateQRCodeElement: t.field({
    type: ElementPothos.QRCodeElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.QRCodeElementUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = QRCodeElementUtils.mapQRCodeElementUpdateGraphqlToInput(
        args.input
      );
      return await QRCodeElementRepository.update(input); 
    },
  }),

  // =========================================================================
  // Generic Element Mutations (Work Across All Types)
  // =========================================================================

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
