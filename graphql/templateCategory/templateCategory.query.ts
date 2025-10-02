import { schemaBuilder } from "../builder";
import { TemplateCategoryObject } from "./templateCategory.objects";
import { findTemplateCategoryById } from "./templateCategory.repository";

schemaBuilder.queryFields((t) => ({
    templateCategory: t.field({
        type: TemplateCategoryObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) => findTemplateCategoryById(args.id),
    }),
}));
