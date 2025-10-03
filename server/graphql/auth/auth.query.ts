import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { UserPothosObject } from "./auth.pothos";
import { findAllUsers, findUserById } from "./user.repository";

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

            return await findUserById(ctx.user.id);
        },
    }),

    user: t.field({
        type: UserPothosObject,
        nullable: true,
        authScopes: {
            loggedIn: true,
        },
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_parent, args) => await findUserById(args.id),
    }),

    users: t.field({
        type: [UserPothosObject],
        resolve: async () => await findAllUsers(),
    }),
}));
