import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as ElementPothos from "../pothos/element";
import * as Types from "@/server/types/element";

gqlSchemaBuilder.queryFields(t => ({
  // =========================================================================
  // TEST: FontReference Query (for schema testing)
  // =========================================================================
  testFontReferenceOutput: t.field({
    type: ElementPothos.FontReferenceUnion,
    args: {
      useGoogle: t.arg.boolean({ required: true }),
      identifier: t.arg.string({ required: false }),
      fontId: t.arg.int({ required: false }),
    },
    resolve: async (_, args): Promise<Types.FontReference> => {
      // This is a fake query to test the schema
      if (args.useGoogle) {
        return {
          type: Types.FontSource.GOOGLE,
          identifier: args.identifier || "Roboto",
        };
      } else {
        return {
          type: Types.FontSource.SELF_HOSTED,
          fontId: args.fontId || 1,
        };
      }
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

