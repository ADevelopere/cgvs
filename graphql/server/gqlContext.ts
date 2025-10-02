import { db } from "@/db/drizzleDb";

export type BaseContext = {
    user?: {
        id: number;
    };
    roles: string[];
    refreshToken?: string;
};

export type AuthContexts = {
    loggedIn: BaseContext & { user: object };
    role: BaseContext & { user: object };
};

export async function createContext({
    userId,
}: {
    userId?: number | null;
}): Promise<BaseContext> {
    if (!userId) {
        return {
            roles: [],
        };
    }

    const user = await db.query.users.findFirst({
        columns: {
            id: true,
        },
        with: {
            roles: true,
        },
        where: {
            id: userId,
        },
    });

    return {
        user: user ?? undefined,
        roles: user?.roles.map((role) => role.name) ?? [],
    };
}
