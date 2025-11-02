import { ElementType } from "@/client/graphql/generated/gql/graphql";
import * as MuiIcons from "@mui/icons-material";

export type CertificateElementIconProps = {
  type: ElementType;
  style?: React.CSSProperties;
};

type ElementIcon = {
  icon: React.ElementType;
  color: string;
};

const elementIconMap: Record<ElementType, ElementIcon> = {
  [ElementType.Country]: { icon: MuiIcons.Public, color: "#1976d2" },
  [ElementType.Date]: { icon: MuiIcons.CalendarToday, color: "#388e3c" },
  [ElementType.Gender]: { icon: MuiIcons.Wc, color: "#d32f2f" },
  [ElementType.Image]: { icon: MuiIcons.Image, color: "#f57c00" },
  [ElementType.Number]: { icon: MuiIcons.Numbers, color: "#7b1fa2" },
  [ElementType.QrCode]: { icon: MuiIcons.QrCode, color: "#00796b" },
  [ElementType.Text]: { icon: MuiIcons.TextFields, color: "#512da8" },
};

export const CertificateElementIcon: React.FC<CertificateElementIconProps> = ({
  type,
  style,
}) => {
  const { icon: IconComponent, color } =
    elementIconMap[type] || elementIconMap[ElementType.Text];
  return <IconComponent style={{ ...style, color }} />;
};
