import { db } from "@/db/db";
import { schemaBuilder } from "./builder";

// Define the TemplateCategory object type
export const TemplateCategory = schemaBuilder.drizzleObject(
    "templateCategories",
    {
        name: "TemplateCategory",
        select: {
            columns: {
                id: true,
            },
        },
        fields: (t) => ({
            id: t.exposeID("id"),
            name: t.exposeString("name"),
            description: t.exposeString("description", { nullable: true }),
            order: t.exposeInt("order", { nullable: true }),
            specialType: t.exposeString("specialType", { nullable: true }),
            createdAt: t.expose("createdAt", { type: "DateTime" }),
            updatedAt: t.expose("updatedAt", { type: "DateTime" }),
            // Relations
            parentCategory: t.relation("parentCategory"),
            childCategories: t.relation("subCategories"),
            templates: t.relation("templates"),
        }),
    },
);

schemaBuilder.queryFields((t) => ({
    templateCategory: t.drizzleField({
        type: "templateCategories",
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (query, _parent, args) => {
            return await db.query.templateCategories.findFirst({
                ...query,
                where: { id: args.id },
            });
        },
    }),
}));
