import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { FontFamilyRepository } from "@/server/db/repo/fontFamily.repository";

// We need to create FontFamily Pothos objects first
import { FontFamilyPothosDefinition, FontFamilyCreateInput, FontFamilyUpdateInput } from "@/server/types/font.types";
import { FontVariantPothosObject } from "../pothos/font.pothos";

const FontFamilyObjectRef = gqlSchemaBuilder.objectRef<FontFamilyPothosDefinition>("FontFamily");

export const FontFamilyPothosObject = FontFamilyObjectRef.implement({
  fields: t => ({
    id: t.exposeInt("id", { nullable: false }),
    name: t.exposeString("name", { nullable: false }),
    category: t.exposeString("category", { nullable: true }),
    locale: t.field({
      type: ["String"],
      nullable: false,
      resolve: family => (Array.isArray(family.locale) ? family.locale : []),
    }),
    variants: t.field({
      type: [FontVariantPothosObject],
      nullable: false,
      resolve: async family => {
        const FontVariantRepository = (await import("@/server/db/repo/fontVariant.repository")).FontVariantRepository;
        return await FontVariantRepository.findByFamilyId(family.id);
      },
    }),
    createdAt: t.expose("createdAt", { type: "DateTime", nullable: false }),
    updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: false }),
  }),
});

const FontFamilyCreateInputRef = gqlSchemaBuilder.inputRef<FontFamilyCreateInput>("FontFamilyCreateInput");

export const FontFamilyCreateInputPothosObject = FontFamilyCreateInputRef.implement({
  fields: t => ({
    name: t.string({ required: true }),
    category: t.string({ required: false }),
    locale: t.stringList({ required: true }),
  }),
});

const FontFamilyUpdateInputRef = gqlSchemaBuilder.inputRef<FontFamilyUpdateInput>("FontFamilyUpdateInput");

export const FontFamilyUpdateInputPothosObject = FontFamilyUpdateInputRef.implement({
  fields: t => ({
    id: t.int({ required: true }),
    name: t.string({ required: true }),
    category: t.string({ required: false }),
    locale: t.stringList({ required: true }),
  }),
});

gqlSchemaBuilder.mutationFields(t => ({
  createFontFamily: t.field({
    type: FontFamilyPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: FontFamilyCreateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_parent, args) => {
      return await FontFamilyRepository.create(args.input);
    },
  }),

  updateFontFamily: t.field({
    type: FontFamilyPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: FontFamilyUpdateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_parent, args) => {
      return await FontFamilyRepository.update(args.input);
    },
  }),

  deleteFontFamily: t.field({
    type: FontFamilyPothosObject,
    nullable: false,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontFamilyRepository.deleteById(args.id);
    },
  }),
}));
