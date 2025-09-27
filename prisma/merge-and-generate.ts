import { readdir, readFile, writeFile, unlink } from "fs/promises";
import { join } from "path";
import { spawn } from "child_process";
import logger from "@/utils/logger";

const schemasDir = join(process.cwd(), "prisma", "schemas");
const outputFile = join(process.cwd(), "prisma", "schema.prisma");

async function mergeSchemas() {
    const files = await readdir(schemasDir);
    const prismaFiles = files
        .filter((f) => f.endsWith(".prisma"))
        .sort((a, b) => a.localeCompare(b));
    if (prismaFiles.length === 0) {
        throw new Error("No .prisma files found in prisma/schemas");
    }
    const contents = await Promise.all(
        prismaFiles.map((f) => readFile(join(schemasDir, f), "utf8")),
    );
    await writeFile(outputFile, contents.join("\n\n"));
    logger.log(`Merged ${prismaFiles.length} files into schema.prisma`);
}

async function runPrismaGenerate() {
    return new Promise<void>((resolve, reject) => {
        const proc = spawn("bunx", ["prisma", "generate"], {
            stdio: "inherit",
        });
        proc.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`prisma generate failed with code ${code}`));
        });
    });
}


async function cleanupSchema() {
    try {
        await unlink(outputFile);
        logger.log("Deleted schema.prisma after script run.");
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
            logger.error("Failed to delete schema.prisma:", err);
        }
    }
}

async function main() {
    try {
        await mergeSchemas();
        await runPrismaGenerate();
        logger.log("Prisma generate completed successfully.");
    } catch (err) {
        logger.error(err);
        process.exitCode = 1;
    } finally {
        await cleanupSchema();
    }
}

main();
