import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as ElementPothos from "../pothos/element";
import * as Types from "@/server/types/element/output";

gqlSchemaBuilder.queryFields(t => ({
  // =========================================================================
  // TEST: FontReference Query (for schema testing)
  // =========================================================================
  testFontReferenceOutput: t.field({
    type: [ElementPothos.FontReferenceUnion],
    resolve: async (): Promise<Types.FontReference[]> => {
      // This is a fake query to test the schema
      return [
        {
          type: Types.FontSource.GOOGLE,
          identifier: "Roboto",
        },
        {
          type: Types.FontSource.SELF_HOSTED,
          fontId: 1,
        },
      ];
    },
  }),

  testTextProps: t.field({
    type: ElementPothos.TextPropsObject,
    resolve: async (): Promise<Types.TextProps> => {
      // This is a fake query to test the schema
      return {
        fontRef: {
          type: Types.FontSource.GOOGLE,
          identifier: "Inter",
        },
        fontSize: 24,
        color: "#000000",
        overflow: Types.ElementOverflow.TRUNCATE,
      };
    },
  }),
}));

