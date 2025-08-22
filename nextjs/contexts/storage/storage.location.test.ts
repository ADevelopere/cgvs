import { isFileTypeAllowed } from "./storage.location";
import { UploadLocation, ContentType } from "@/graphql/generated/types";

describe("isFileTypeAllowed", () => {
  it("allows ContentType enum directly", () => {
    expect(isFileTypeAllowed("TEMPLATE_COVER" as UploadLocation, "JPEG")).toBe(true);
    expect(isFileTypeAllowed("TEMPLATE_COVER" as UploadLocation, "PNG")).toBe(true);
    expect(isFileTypeAllowed("TEMPLATE_COVER" as UploadLocation, "WEBP")).toBe(true);
    expect(isFileTypeAllowed("TEMPLATE_COVER" as UploadLocation, "GIF")).toBe(false);
  });

  it("allows correct MIME types", () => {
    expect(isFileTypeAllowed("TEMPLATE_COVER" as UploadLocation, "image/jpeg")).toBe(true);
    expect(isFileTypeAllowed("TEMPLATE_COVER" as UploadLocation, "image/png")).toBe(true);
    expect(isFileTypeAllowed("TEMPLATE_COVER" as UploadLocation, "image/webp")).toBe(true);
    expect(isFileTypeAllowed("TEMPLATE_COVER" as UploadLocation, "image/gif")).toBe(false);
  });

  it("returns false for unknown types", () => {
    expect(isFileTypeAllowed("TEMPLATE_COVER" as UploadLocation, "application/zip")).toBe(false);
    expect(isFileTypeAllowed("TEMPLATE_COVER" as UploadLocation, "RAR" as ContentType)).toBe(false);
  });
});
