import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

// Query: Get single font by ID
export const fontQueryDocument: TypedDocumentNode<
  Graphql.FontQuery,
  Graphql.FontQueryVariables
> = gql`
  query font($id: Int!) {
    font(id: $id) {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

// Query: Get all fonts
export const fontsQueryDocument: TypedDocumentNode<
  Graphql.FontsQuery,
  Graphql.FontsQueryVariables
> = gql`
  query fonts {
    fonts {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

// Query: Search fonts by name
export const searchFontsQueryDocument: TypedDocumentNode<
  Graphql.SearchFontsQuery,
  Graphql.SearchFontsQueryVariables
> = gql`
  query searchFonts($name: String!, $limit: Int) {
    searchFonts(name: $name, limit: $limit) {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

// Query: Check font usage before deletion
export const checkFontUsageQueryDocument: TypedDocumentNode<
  Graphql.CheckFontUsageQuery,
  Graphql.CheckFontUsageQueryVariables
> = gql`
  query checkFontUsage($id: Int!) {
    checkFontUsage(id: $id) {
      isInUse
      usageCount
      usedBy {
        elementId
        elementType
        templateId
        templateName
      }
      canDelete
      deleteBlockReason
    }
  }
`;

// Mutation: Create font
export const createFontMutationDocument: TypedDocumentNode<
  Graphql.CreateFontMutation,
  Graphql.CreateFontMutationVariables
> = gql`
  mutation createFont($input: FontCreateInput!) {
    createFont(input: $input) {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

// Mutation: Update font
export const updateFontMutationDocument: TypedDocumentNode<
  Graphql.UpdateFontMutation,
  Graphql.UpdateFontMutationVariables
> = gql`
  mutation updateFont($input: FontUpdateInput!) {
    updateFont(input: $input) {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

// Mutation: Delete font
export const deleteFontMutationDocument: TypedDocumentNode<
  Graphql.DeleteFontMutation,
  Graphql.DeleteFontMutationVariables
> = gql`
  mutation deleteFont($id: Int!) {
    deleteFont(id: $id) {
      id
      name
      locale
      storageFileId
      createdAt
      updatedAt
    }
  }
`;

