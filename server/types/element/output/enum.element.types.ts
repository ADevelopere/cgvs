export enum ElementType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DATE = "DATE",
  IMAGE = "IMAGE",
  GENDER = "GENDER",
  COUNTRY = "COUNTRY",
  QR_CODE = "QR_CODE",
}

export enum ElementAlignment {
  TopStart = "TOP_START",
  TopCenter = "TOP_CENTER",
  TopEnd = "TOP_END",
  CenterStart = "CENTER_START",
  Center = "CENTER", // Represents CenterCenter
  CenterEnd = "CENTER_END",
  BottomStart = "BOTTOM_START",
  BottomCenter = "BOTTOM_CENTER",
  BottomEnd = "BOTTOM_END",
  BaselineStart = "BASELINE_START",
  BaselineCenter = "BASELINE_CENTER",
  BaselineEnd = "BASELINE_END",
}

export enum FontSource {
  GOOGLE = "GOOGLE",
  SELF_HOSTED = "SELF_HOSTED",
}
