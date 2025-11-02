//it will be used to view all nodes in the template react flow,
// ability to select a node and edit its properties
// delete a node,
// hide/show a node
// change node order (drag and drop)
import * as GQL from "@/client/graphql/generated/gql/graphql";

export type ElementsTabProps = {
  elements: GQL.CertificateElementUnion[];
};

export function ElementsTab({ elements }: ElementsTabProps) {
  return (
    <div>
      {/* Render elements here */}
      {elements.map((element, index) => (
        <div key={index}>{/* Render element details */}</div>
      ))}
    </div>
  );
}
