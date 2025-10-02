import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { db } from "@/db/drizzleDb";
import { UserPothosObject } from "./auth.pothos";
import logger from "@/utils/logger";

gqlSchemaBuilder.queryFields((t) => ({
    me: t.field({
        type: UserPothosObject,
        nullable: true,
        authScopes: {
            loggedIn: true,
        },
        resolve: async (_parent, _args, ctx) => {
            if (!ctx.user) {
                return null;
            }

            try {
                return await db.query.users.findFirst({
                    where: {
                        id: ctx.user.id,
                    },
                });
            } catch (err) {
                logger.error(err);
                return null;
            }
        },
    }),
}));
