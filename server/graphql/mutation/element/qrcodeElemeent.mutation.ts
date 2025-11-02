import { gqlSchemaBuilder } from "../../gqlSchemaBuilder";
import * as ElementPothos from "../../pothos/element";
import {
  QRCodeElementRepository,
} from "@/server/db/repo";
import {
  QRCodeElementUtils,
} from "@/server/utils";

gqlSchemaBuilder.mutationFields(t => ({
  // =========================================================================
  // QR_CODE Element Mutations
  // =========================================================================
  createQRCodeElement: t.field({
    type: ElementPothos.QRCodeElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.QRCodeElementInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = QRCodeElementUtils.mapQRCodeElementCreateGraphqlToInput(
        args.input
      );
      return await QRCodeElementRepository.create(input);
    },
  }),

  updateQRCodeElement: t.field({
    type: ElementPothos.QRCodeElementObject,
    args: {
      input: t.arg({
        type: ElementPothos.QRCodeElementUpdateInputObject,
        required: true,
      }),
    },
    resolve: async (_, args) => {
      const input = QRCodeElementUtils.mapQRCodeElementUpdateGraphqlToInput(
        args.input
      );
      return await QRCodeElementRepository.update(input);
    },
  }),
}));