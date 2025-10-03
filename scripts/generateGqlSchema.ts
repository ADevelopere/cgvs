// scripts/generate-schema.ts
import fs from "fs";
import path from "path";
import { printSchema } from "graphql";
import { graphQLSchema } from "@/server/graphql/gqlSchema";
import logger from "@/utils/logger";

// Use the standard printSchema function
const schemaAsString = printSchema(graphQLSchema);
const outputPath = path.join(process.cwd(), "schemaGenerate.graphql");

fs.writeFileSync(outputPath, schemaAsString);

logger.log("📜 Schema generated at", outputPath);
