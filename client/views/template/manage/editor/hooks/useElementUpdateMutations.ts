// import { useMutation } from "@apollo/client/react";
// import * as GQL from "@/client/graphql/generated/gql/graphql";
// import { moveElementMutationDocument } from "../glqDocuments/element/element.documents";

// export const useElementUpdateMutations = () => {
//   const [moveElementMutation, { loading: moveElementLoading }] = useMutation(moveElementMutationDocument, {
//     optimisticResponse: variables => {
//         const input = variables.input
//       return {
//         __typename: "Mutation" as const,
//         moveElement: [
//           {
//             __typename: "UpdateElementBaseResponse" as const,
//             base: {
//               __typename: "CertificateElementBase" as const,
//               alignment: GQL.ElementAlignment.Left,
//               createdAt: new Date().toISOString(),
//               description: null,
//               height: 0,
//               hidden: false,
//               id: variables.input.elementId,
//               name: "",
//               positionX: 0,
//               positionY: 0,
//               renderOrder: variables.input.newRenderOrder,
//               templateId: 0,
//               type: GQL.ElementType.Text,
//               updatedAt: new Date().toISOString(),
//               width: 0,
//             },
//           },
//         ],
//       };
//     },

//     update(cache, { data: mutationResult }) {
//       // 1. Get the *updated parent Element* from the mutation result
//       const updated = mutationResult?.moveElement;

//       if (!updated) {
//         return;
//       }

//       // 2. Identify the parent Element's ID in the cache.
//       // THE FIX IS HERE: We identify the `updated` itself,
//       const cacheId = cache.identify(updated[0]);

//       if (!cacheId) {
//         // This Element isn't in the cache, nothing to do.
//         return;
//       }
//       cache.modify({
//         id: cacheId, // This is now correct (e.g., 'TextElement:123')
//         fields: {
//           // Find the 'base' field on this Element...
//           base() {
//             // ...and replace it with the new base from the mutation.
//             return updated[0].base;
//           },

//           // You could also update other fields if needed, e.g.:
//           // base(existingBase) {
//           //   return updatedElement.base;
//           // }
//         },
//       });
//     },
//   });

//   const moveElement = async (input: GQL.ElementMoveInput) => {
//     await moveElementMutation({
//       variables: {
//         input: input,
//       },
//     });
//   };

//   return {
//     moveElement,
//     moveElementLoading,
//   };
// };
