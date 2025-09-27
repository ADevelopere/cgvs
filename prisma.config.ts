import type { PrismaConfig } from "prisma";
import "dotenv/config";

export default {
    schema: "prisma/schema",
    migrations: {
        seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    },
} satisfies PrismaConfig;
