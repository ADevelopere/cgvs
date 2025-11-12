import { db } from "@/server/db/drizzleDb";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

export type BaseContext = {
  user?: {
    id: number;
  } | undefined;
  roles: string[];
  refreshToken?: string | undefined;
  sessionId?: string | undefined;
  cookies?: ResponseCookies;
};

export type AuthContexts = {
  loggedIn: BaseContext & { user: object };
  role: BaseContext & { user: object };
};

export async function createContext({ userId }: { userId?: number | null }): Promise<BaseContext> {
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
    roles: user?.roles.map(role => role.name) ?? [],
  };
}
