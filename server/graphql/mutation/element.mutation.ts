import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as ElementPothos from "../pothos/element";
import { ElementRepository } from "@/server/db/repo/element";
// TODO: Uncomment individual repositories when their Pothos files are ready
// import {
//   TextElementRepository,
//   DateElementRepository,
//   NumberElementRepository,
//   CountryElementRepository,
//   GenderElementRepository,
//   ImageElementRepository,
//   QRCodeElementRepository,
// } from "@/server/db/repo/element";
// TODO: Uncomment when element mutations are implemented
// import * as Types from "@/server/types/element";

gqlSchemaBuilder.mutationFields(t => ({
  // =========================================================================
  // TEST: FontReference Mutations (for schema testing)
  // =========================================================================
  testFontReferenceInput: t.field({
    type: "String",
    args: {
      fontRef: t.arg({
        type: ElementPothos.FontReferenceInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      // This is a fake mutation to test the schema
      // Check if it's Google or SelfHosted
      if (args.fontRef.google) {
        return `Google Font: ${args.fontRef.google.identifier}`;
      } else if (args.fontRef.selfHosted) {
        return `Self-Hosted Font ID: ${args.fontRef.selfHosted.fontId}`;
      }
      return "Invalid font reference";
    },
  }),

  // =========================================================================
  // TEXT Element Mutations
  // =========================================================================
  // TODO: Implement when text.element.pothos.ts is ready
  // createTextElement: t.field({
  //   type: ElementPothos.TextElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.TextElementCreateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await TextElementRepository.create(args.input);
  //     return element as Types.TextElementPothosDefinition;
  //   },
  // }),

  // TODO: Implement when text.element.pothos.ts is ready
  // updateTextElement: t.field({
  //   type: ElementPothos.TextElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.TextElementUpdateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await TextElementRepository.update(args.input);
  //     return element as Types.TextElementPothosDefinition;
  //   },
  // }),

  // =========================================================================
  // DATE Element Mutations
  // =========================================================================
  // TODO: Implement when date.element.pothos.ts is ready
  // createDateElement: t.field({
  //   type: ElementPothos.DateElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.DateElementCreateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await DateElementRepository.create(args.input);
  //     return element as Types.DateElementPothosDefinition;
  //   },
  // }),

  // TODO: Implement when date.element.pothos.ts is ready
  // updateDateElement: t.field({
  //   type: ElementPothos.DateElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.DateElementUpdateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await DateElementRepository.update(args.input);
  //     return element as Types.DateElementPothosDefinition;
  //   },
  // }),

  // =========================================================================
  // NUMBER Element Mutations
  // =========================================================================
  // TODO: Implement when number.element.pothos.ts is ready
  // createNumberElement: t.field({
  //   type: ElementPothos.NumberElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.NumberElementCreateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await NumberElementRepository.create(args.input);
  //     return element as Types.NumberElementPothosDefinition;
  //   },
  // }),

  // TODO: Implement when number.element.pothos.ts is ready
  // updateNumberElement: t.field({
  //   type: ElementPothos.NumberElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.NumberElementUpdateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await NumberElementRepository.update(args.input);
  //     return element as Types.NumberElementPothosDefinition;
  //   },
  // }),

  // =========================================================================
  // COUNTRY Element Mutations
  // =========================================================================
  // TODO: Implement when country.element.pothos.ts is ready
  // createCountryElement: t.field({
  //   type: ElementPothos.CountryElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.CountryElementCreateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await CountryElementRepository.create(args.input);
  //     return element as Types.CountryElementPothosDefinition;
  //   },
  // }),

  // TODO: Implement when country.element.pothos.ts is ready
  // updateCountryElement: t.field({
  //   type: ElementPothos.CountryElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.CountryElementUpdateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await CountryElementRepository.update(args.input);
  //     return element as Types.CountryElementPothosDefinition;
  //   },
  // }),

  // =========================================================================
  // GENDER Element Mutations
  // =========================================================================
  // TODO: Implement when gender.element.pothos.ts is ready
  // createGenderElement: t.field({
  //   type: ElementPothos.GenderElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.GenderElementCreateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await GenderElementRepository.create(args.input);
  //     return element as Types.GenderElementPothosDefinition;
  //   },
  // }),

  // TODO: Implement when gender.element.pothos.ts is ready
  // updateGenderElement: t.field({
  //   type: ElementPothos.GenderElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.GenderElementUpdateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await GenderElementRepository.update(args.input);
  //     return element as Types.GenderElementPothosDefinition;
  //   },
  // }),

  // =========================================================================
  // IMAGE Element Mutations
  // =========================================================================
  // TODO: Implement when image.element.pothos.ts is ready
  // createImageElement: t.field({
  //   type: ElementPothos.ImageElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.ImageElementCreateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await ImageElementRepository.create(args.input);
  //     return element as Types.ImageElementPothosDefinition;
  //   },
  // }),

  // TODO: Implement when image.element.pothos.ts is ready
  // updateImageElement: t.field({
  //   type: ElementPothos.ImageElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.ImageElementUpdateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await ImageElementRepository.update(args.input);
  //     return element as Types.ImageElementPothosDefinition;
  //   },
  // }),

  // =========================================================================
  // QR_CODE Element Mutations
  // =========================================================================
  // TODO: Implement when qrcode.element.pothos.ts is ready
  // createQRCodeElement: t.field({
  //   type: ElementPothos.QRCodeElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.QRCodeElementCreateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await QRCodeElementRepository.create(args.input);
  //     return element as Types.QRCodeElementPothosDefinition;
  //   },
  // }),

  // TODO: Implement when qrcode.element.pothos.ts is ready
  // updateQRCodeElement: t.field({
  //   type: ElementPothos.QRCodeElementObject,
  //   args: {
  //     input: t.arg({
  //       type: ElementPothos.QRCodeElementUpdateInputObject,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (_, args) => {
  //     const element = await QRCodeElementRepository.create(args.input);
  //     return element as Types.QRCodeElementPothosDefinition;
  //   },
  // }),

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
