// scripts/generate-schema.ts
import fs from "fs";
import path from "path";
import { printSchema } from "graphql";
import { spawn } from "child_process";
import { graphQLSchema } from "./gqlSchema";
import logger from "@/server/lib/logger";

// Use the standard printSchema function
const schemaAsString = printSchema(graphQLSchema);
const outputPath = path.join(
  process.cwd(),
  "./client/graphql/generated/schema.graphql"
);

fs.writeFileSync(outputPath, schemaAsString);

logger.log("📜 Schema generated at", outputPath);

const codegenProcess = spawn("bun", ["run", "graphql-codegen"], {
  stdio: "inherit",
  shell: true,
});

codegenProcess.on("close", code => {
  if (code === 0) {
    logger.log("✅ GraphQL Code Generation completed successfully!");
  } else {
    logger.error(`❌ GraphQL Code Generation failed with exit code ${code}`);
    process.exit(1);
  }
});

codegenProcess.on("error", error => {
  logger.error("❌ Failed to start GraphQL Code Generation:", error.message);
  process.exit(1);
});
