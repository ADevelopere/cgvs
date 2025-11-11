import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  FontVariantPothosObject,
  FontVariantCreateInputPothosObject,
  FontVariantUpdateInputPothosObject,
} from "../pothos/font.pothos";
import { FontVariantRepository } from "@/server/db/repo/fontVariant.repository";
import { FontFamilyRepository } from "@/server/db/repo/fontFamily.repository";

gqlSchemaBuilder.mutationFields(t => ({
  createFontVariant: t.field({
    type: FontVariantPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: FontVariantCreateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_parent, args) => {
      return await FontVariantRepository.create(args.input);
    },
  }),

  updateFontVariant: t.field({
    type: FontVariantPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: FontVariantUpdateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_parent, args) => {
      return await FontVariantRepository.update(args.input);
    },
  }),

  deleteFontVariant: t.field({
    type: FontVariantPothosObject,
    nullable: false,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontVariantRepository.deleteById(args.id);
    },
  }),

  createFontWithFamily: t.field({
    type: FontVariantPothosObject,
    nullable: false,
    args: {
      familyName: t.arg.string({ required: true }),
      category: t.arg.string({ required: false }),
      locale: t.arg.stringList({ required: true }),
      variant: t.arg.string({ required: true }),
      storageFilePath: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args) => {
      // Check if family exists
      let family = await FontFamilyRepository.findByName(args.familyName);

      // Create family if it doesn't exist
      if (!family) {
        family = await FontFamilyRepository.create({
          name: args.familyName,
          category: args.category || null,
          locale: args.locale,
        });
      }

      // Create variant
      return await FontVariantRepository.create({
        familyId: family.id,
        variant: args.variant,
        storageFilePath: args.storageFilePath,
      });
    },
  }),
}));
