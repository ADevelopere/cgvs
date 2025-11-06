import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { FontPothosObject, FontCreateInputPothosObject, FontUpdateInputPothosObject } from "../pothos/font.pothos";
import { FontRepository } from "@/server/db/repo";

gqlSchemaBuilder.mutationFields(t => ({
  createFont: t.field({
    type: FontPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: FontCreateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.create(args.input);
    },
  }),

  updateFont: t.field({
    type: FontPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: FontUpdateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.update(args.input);
    },
  }),

  deleteFont: t.field({
    type: FontPothosObject,
    nullable: false,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => {
      return await FontRepository.deleteById(args.id);
    },
  }),
}));
