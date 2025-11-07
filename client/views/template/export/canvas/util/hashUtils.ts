import { sha256 } from "crypto-hash";
import * as GQL from "@/client/graphql/generated/gql/graphql";

/**
 * Result of hash generation with timing information
 */
export interface HashGenerationResult {
  hash: string;
  hashGenerationTime: number;
}

/**
 * Generate SHA-256 hash from canvas generation data
 * Complexity: 4 (timing + stringify + hash generation)
 * Uses browser-compatible crypto-hash for better performance
 */
export async function generateDataHash(
  elements: GQL.CertificateElementUnion[],
  config: GQL.TemplateConfig,
  showDebugBorders: boolean,
  renderScale: number
): Promise<HashGenerationResult> {
  const startTime = performance.now();

  const dataString = createHashInput(elements, config, showDebugBorders, renderScale);
  const hash = await sha256(dataString);

  const hashGenerationTime = performance.now() - startTime;

  return { hash, hashGenerationTime };
}

/**
 * Create string input for hash generation
 * Complexity: 2 (object creation + stringify)
 */
function createHashInput(
  elements: GQL.CertificateElementUnion[],
  config: GQL.TemplateConfig,
  showDebugBorders: boolean,
  renderScale: number
): string {
  return JSON.stringify({
    elements,
    config,
    showDebugBorders,
    renderScale,
  });
}
