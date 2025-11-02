import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
export type ElementNodesProps = {
  elements: GQL.CertificateElementUnion[];
};

export const ElementNodes: React.FC<ElementNodesProps> = ({ elements }) => {
  return (
    <>
      {elements.map(element => (
        <div key={element.id}>
          {/* Render element details here */}
          <p>{element.id}</p>
        </div>
      ))}
    </>
  );
};
