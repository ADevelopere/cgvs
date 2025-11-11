import * as GQL from "@/client/graphql/generated/gql/graphql";

export const mapFontRefInputToFontRef = (fontRefInput: GQL.FontReferenceInput): GQL.FontReference => {
  if (fontRefInput.google) {
    const g: GQL.FontReferenceGoogle = {
      __typename: "FontReferenceGoogle",
      family: fontRefInput.google.family,
      variant: fontRefInput.google.variant,
      type: GQL.FontSource.Google,
    };
    return g;
  } else if (fontRefInput.selfHosted) {
    const s: GQL.FontReferenceSelfHosted = {
      __typename: "FontReferenceSelfHosted",
      fontVariantId: fontRefInput.selfHosted.fontVariantId,
      type: GQL.FontSource.SelfHosted,
    };
    return s;
  } else {
    throw new Error("Invalid FontReferenceInput provided for optimistic response");
  }
};
