import { db } from "@/db/db";

export interface BaseContext {
    user?: {
        id: number;
    };
    roles: string[];
}

export interface AuthContexts {
    loggedIn: BaseContext & { user: object };
    role: BaseContext & { user: object };
}

export async function createContext({
    userId,
}: {
    userId?: string | null;
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
            //   roles: true,
        },
        where: {
            id: Number.parseInt(userId, 10),
        },
    });

    return {
        user: user ?? undefined,
        roles:
            // user?.roles.map((role) => role.name) ??
            [],
    };
}
