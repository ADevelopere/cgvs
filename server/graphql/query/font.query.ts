import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  FontVariantPothosObject,
  FontVariantUsageCheckResultPothosObject,
  FontVariantsWithFiltersPothosObject,
  FontVariantFilterArgsPothosObject,
  FontVariantsOrderByClausePothosObject,
} from "../pothos/font.pothos";
import { PaginationArgsObject } from "../pothos";
import { FontVariantRepository } from "@/server/db/repo/fontVariant.repository";
import * as Types from "@/server/types";
import { FontFamilyPothosObject } from "../mutation/fontFamily.mutation";
import { FontFamilyRepository } from "@/server/db/repo/fontFamily.repository";

gqlSchemaBuilder.queryFields(t => ({
  fontVariant: t.field({
    type: FontVariantPothosObject,
    nullable: true,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontVariantRepository.findById(args.id);
    },
  }),

  fontVariants: t.field({
    type: FontVariantsWithFiltersPothosObject,
    nullable: false,
    args: {
      paginationArgs: t.arg({
        type: PaginationArgsObject,
        required: false,
      }),
      orderBy: t.arg({
        type: [FontVariantsOrderByClausePothosObject],
        required: false,
      }),
      filterArgs: t.arg({
        type: FontVariantFilterArgsPothosObject,
        required: false,
      }),
    },
    resolve: async (_, args) =>
      await FontVariantRepository.fetchWithFilters(
        new Types.PaginationArgs({ ...args.paginationArgs }),
        args.filterArgs as unknown as Types.FontVariantFilterArgs,
        args.orderBy
      ),
  }),

  checkFontVariantUsage: t.field({
    type: FontVariantUsageCheckResultPothosObject,
    nullable: false,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontVariantRepository.checkUsage(args.id);
    },
  }),

  fontFamily: t.field({
    type: FontFamilyPothosObject,
    nullable: true,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontFamilyRepository.findById(args.id);
    },
  }),

  fontFamilies: t.field({
    type: [FontFamilyPothosObject],
    nullable: false,
    resolve: async () => {
      return await FontFamilyRepository.findAll();
    },
  }),
}));
