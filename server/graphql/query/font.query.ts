import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  FontPothosObject,
  FontUsageCheckResultPothosObject,
  FontsWithFiltersPothosObject,
  FontFilterArgsPothosObject,
  FontsOrderByClausePothosObject,
} from "../pothos/font.pothos";
import { PaginationArgsObject } from "../pothos";
import { FontRepository } from "@/server/db/repo";
import * as Types from "@/server/types";

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
    type: FontsWithFiltersPothosObject,
    nullable: false,
    args: {
      paginationArgs: t.arg({
        type: PaginationArgsObject,
        required: false,
      }),
      orderBy: t.arg({
        type: [FontsOrderByClausePothosObject],
        required: false,
      }),
      filterArgs: t.arg({
        type: FontFilterArgsPothosObject,
        required: false,
      }),
    },
    resolve: async (_, args) =>
      await FontRepository.fetchWithFilters(
        new Types.PaginationArgs({ ...args.paginationArgs }),
        args.filterArgs as unknown as Types.FontFilterArgs,
        args.orderBy
      ),
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
