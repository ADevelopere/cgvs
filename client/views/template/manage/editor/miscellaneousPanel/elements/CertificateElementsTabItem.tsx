import { CertificateElementUnion } from "@/client/graphql/generated/gql/graphql";
import { IconButton, Stack, Typography } from "@mui/material";
import * as MuiICons from "@mui/icons-material";
import { CertificateElementIcon } from "./ElementIcon";

export type CertificateElementsTabItemProps = {
  element: CertificateElementUnion;
  toggleElementHidden: (id: number) => void;
  deleteElement: (id: number) => void;
  manageElement: (id: number) => void;
  increaseOrder?: () => void;
  decreaseOrder?: () => void;
};

export const CertificateElementsTabItem: React.FC<CertificateElementsTabItemProps> = ({
  element,
  deleteElement,
  toggleElementHidden,
  manageElement,
  increaseOrder,
  decreaseOrder,
}) => {
  return (
    <Stack direction={"row"} sx={{ alignItems: "center" }}>
      {/* increaseOrder */}
      <IconButton disabled={element.base.renderOrder === 1} onClick={increaseOrder}>
        <MuiICons.ArrowUpward />
      </IconButton>
      {/* decreaseOrder */}
      <IconButton onClick={decreaseOrder}>
        <MuiICons.ArrowDownward />
      </IconButton>
      {/* icon */}
      <CertificateElementIcon type={element.base.type} style={{ marginInline: 8 }} />
      {/* name */}
      <Typography
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {element.base.name}
      </Typography>
      {/* hide/show */}
      <IconButton onClick={() => toggleElementHidden(element.base.id)}>
        {element.base.hidden ? <MuiICons.VisibilityOff /> : <MuiICons.Visibility />}
      </IconButton>
      {/* settings */}
      <IconButton onClick={() => manageElement(element.base.id)}>
        <MuiICons.Settings />
      </IconButton>
      {/* delete */}
      <IconButton color="error" onClick={() => deleteElement(element.base.id)}>
        <MuiICons.Delete />
      </IconButton>
    </Stack>
  );
};
