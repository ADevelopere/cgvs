import { TextPropsInput } from "./textProps.input";
import { CertificateElementBaseInput } from "./base.element.input";
import { genderElement } from "@/server/db/schema";

export type GenderElementEntityInput = typeof genderElement.$inferInsert;

export type GenderElementInput = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInput;
};

export type GenderElementUpdateInput = GenderElementInput & {
  id: number;
};
