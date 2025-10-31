import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  ElementRepository,
  TextElementRepository,
} from "@/server/db/repo/element";
import * as ElementPothos from "../pothos/element";

gqlSchemaBuilder.queryFields(t => ({
  /**
   * Get all elements for a template by templateId
   * Returns elements ordered by renderOrder
   */
  elementsByTemplateId: t.loadableList({
    type: ElementPothos.CertificateElementPothosInterface,
    args: {
      templateId: t.arg.int({ required: true }),
    },
    load: async (ids: number[]) => {
      return await ElementRepository.loadByTemplateIds(ids);
    },
    resolve: (_parent, args) => args.templateId,
  }),

  textElementById: t.field({
    type: ElementPothos.TextElementObject,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) =>
      await TextElementRepository.loadById(args.id),
  }),
}));
