//it will be used to view all nodes in the template react flow,
// ability to select a node and edit its properties
// delete a node,
// hide/show a node
// change node order (drag and drop)
import * as GQL from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";
import { Stack } from "@mui/material";
import { CertificateElementsTabItem } from "./CertificateElementsTabItem";

export type ElementsTabProps = {
  elements: GQL.CertificateElementUnion[];
};

export const ElementsTab: React.FC<ElementsTabProps> = ({ elements }) => {
  logger.info("Rendering ElementsTab with elements:", elements);
  return (
    <Stack direction={"column"} spacing={1}>
      {/* Render each element here */}
      {elements.map(element => (
        // todo:....
        // @ts-expect-error -- fix this ts error later
        <CertificateElementsTabItem key={element.base.id} element={element} />
      ))}
    </Stack>
  );
};
