
import { ElementOverflow, FontReference } from "../output";


// ============================================================================
// Text Props (shared by TEXT, DATE, NUMBER, COUNTRY, GENDER elements)
// ============================================================================

export type TextPropsCreateInput = {
  fontRef: FontReference;
  fontSize: number;
  color: string;
  overflow: ElementOverflow;
};

export type TextPropsUpdateInput = {
  fontRef?: FontReference | null;
  fontSize?: number | null;
  color?: string | null;
  overflow?: ElementOverflow | null;
};