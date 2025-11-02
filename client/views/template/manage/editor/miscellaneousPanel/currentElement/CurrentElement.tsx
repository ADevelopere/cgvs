import { CertificateElementUnion } from "@/client/graphql/generated/gql/graphql";
import { Stack, Typography } from "@mui/material";
import { CertificateElementIcon } from "../elements/ElementIcon";

export type CertificateElementCurrentItemSettingsProps = {
  element: CertificateElementUnion;
};

export const CertificateElementCurrentItemSettings: React.FC<
  CertificateElementCurrentItemSettingsProps
> = ({ element }) => {
  return (
    <Stack>
      {/* header */}
      <Stack direction={"row"}>
        {/* icon */}
        <CertificateElementIcon type={element.base.type} />
        {/* name */}
        <Typography>{element.base.name}</Typography>
      </Stack>
    </Stack>
  );
};
