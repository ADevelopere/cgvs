import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { ElementRepository } from "@/server/db/repo/element";
import * as ElementPothos from "../pothos/element";
import { CertificateElementPothosUnion } from "@/server/types";

gqlSchemaBuilder.queryFields(t => ({
  /**
   * Get all elements for a template by templateId
   * Returns elements ordered by renderOrder
   */
  elementsByTemplateId: t.loadableList({
    type: ElementPothos.CertificateElementUnion,
    args: {
      templateId: t.arg.int({ required: true }),
    },
    load: async (ids: number[]) => {
      const results = await ElementRepository.loadByTemplateIds(ids);
      return results.map(elements => 
        elements instanceof Error ? elements : elements as CertificateElementPothosUnion[]
      );
    },
    resolve: (_parent, args) => args.templateId,
  }),
}));

