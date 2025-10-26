import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  FontPothosObject,
  FontUsageCheckResultPothosObject,
} from "../pothos/font.pothos";
import { FontRepository } from "@/server/db/repo";

gqlSchemaBuilder.queryFields(t => ({
  font: t.field({
    type: FontPothosObject,
    nullable: true,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.findById(args.id);
    },
  }),

  fonts: t.field({
    type: [FontPothosObject],
    nullable: false,
    resolve: async () => {
      return await FontRepository.findAll();
    },
  }),

  searchFonts: t.field({
    type: [FontPothosObject],
    nullable: false,
    args: {
      name: t.arg.string({ required: true }),
      limit: t.arg.int({
        required: false,
        defaultValue: 50,
      }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.searchByName(args.name, args.limit || 50);
    },
  }),

  checkFontUsage: t.field({
    type: FontUsageCheckResultPothosObject,
    nullable: false,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.checkUsage(args.id);
    },
  }),
}));
