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
        type: ElementPothos.TextElementCreateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = TextElementUtils.mapTextElementCreateGraphqlToInput(
        args.input
      );
      const element = await TextElementRepository.create(input);
      return element as Types.TextElementPothosDefinition;
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
      const element = await TextElementRepository.update(input);
      return element as Types.TextElementPothosDefinition;
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
      const element = await DateElementRepository.create(input);
      return element as Types.DateElementPothosDefinition;
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
        type: ElementPothos.NumberElementCreateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = NumberElementUtils.mapNumberElementCreateGraphqlToInput(
        args.input
      );
      const element = await NumberElementRepository.create(input);
      return element as Types.NumberElementPothosDefinition;
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
      const element = await NumberElementRepository.update(input);
      return element as Types.NumberElementPothosDefinition;
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
      const element = await CountryElementRepository.create(input);
      return element as Types.CountryElementPothosDefinition;
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
      const element = await CountryElementRepository.update(input);
      return element as Types.CountryElementPothosDefinition;
    },
  }),

  // =========================================================================
  // GENDER Element Mutations
  // =========================================================================
  createGenderElement: t.field({
    type: ElementPothos.GenderElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.GenderElementCreateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = GenderElementUtils.mapGenderElementCreateGraphqlToInput(
        args.input
      );
      const element = await GenderElementRepository.create(input);
      return element as Types.GenderElementPothosDefinition;
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
      const element = await GenderElementRepository.update(input);
      return element as Types.GenderElementPothosDefinition;
    },
  }),

  // =========================================================================
  // IMAGE Element Mutations
  // =========================================================================
  createImageElement: t.field({
    type: ElementPothos.ImageElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.ImageElementCreateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = ImageElementUtils.mapImageElementCreateGraphqlToInput(
        args.input
      );
      const element = await ImageElementRepository.create(input);
      return element as Types.ImageElementPothosDefinition;
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
      const element = await ImageElementRepository.update(input);
      return element as Types.ImageElementPothosDefinition;
    },
  }),

  // =========================================================================
  // QR_CODE Element Mutations
  // =========================================================================
  createQRCodeElement: t.field({
    type: ElementPothos.QRCodeElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.QRCodeElementCreateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = QRCodeElementUtils.mapQRCodeElementCreateGraphqlToInput(
        args.input
      );
      const element = await QRCodeElementRepository.create(input);
      return element as Types.QRCodeElementPothosDefinition;
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
      const element = await QRCodeElementRepository.update(input);
      return element as Types.QRCodeElementPothosDefinition;
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
