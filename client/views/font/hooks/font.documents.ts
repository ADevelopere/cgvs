import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

// Query: Get all font families
export const fontFamiliesQueryDocument: TypedDocumentNode<
  Graphql.FontFamiliesQuery,
  Graphql.FontFamiliesQueryVariables
> = gql`
  query fontFamilies {
    fontFamilies {
      id
      name
      category
      locale
      variants {
        id
        familyId
        variant
        file {
          path
          url
          name
          size
        }
        url
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

// Query: Get single font family by ID
export const fontFamilyQueryDocument: TypedDocumentNode<Graphql.FontFamilyQuery, Graphql.FontFamilyQueryVariables> =
  gql`
    query fontFamily($id: Int!) {
      fontFamily(id: $id) {
        id
        name
        category
        locale
        variants {
          id
          familyId
          variant
          file {
            path
            url
            name
            size
          }
          url
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  `;

// Query: Get font variants by family ID
export const fontVariantsByFamilyQueryDocument: TypedDocumentNode<
  Graphql.FontVariantsQuery,
  Graphql.FontVariantsQueryVariables
> = gql`
  query fontVariants($filterArgs: FontVariantFilterArgs) {
    fontVariants(filterArgs: $filterArgs) {
      data {
        id
        familyId
        variant
        file {
          path
          url
          name
          size
        }
        url
        createdAt
        updatedAt
      }
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasMorePages
      }
    }
  }
`;

// Query: Check font variant usage before deletion
export const checkFontUsageQueryDocument: TypedDocumentNode<
  Graphql.CheckFontVariantUsageQuery,
  Graphql.CheckFontVariantUsageQueryVariables
> = gql`
  query checkFontVariantUsage($id: Int!) {
    checkFontVariantUsage(id: $id) {
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

// Mutation: Create font family
export const createFontFamilyMutationDocument: TypedDocumentNode<
  Graphql.CreateFontFamilyMutation,
  Graphql.CreateFontFamilyMutationVariables
> = gql`
  mutation createFontFamily($input: FontFamilyCreateInput!) {
    createFontFamily(input: $input) {
      id
      name
      category
      locale
      createdAt
      updatedAt
    }
  }
`;

// Mutation: Update font family
export const updateFontFamilyMutationDocument: TypedDocumentNode<
  Graphql.UpdateFontFamilyMutation,
  Graphql.UpdateFontFamilyMutationVariables
> = gql`
  mutation updateFontFamily($input: FontFamilyUpdateInput!) {
    updateFontFamily(input: $input) {
      id
      name
      category
      locale
      createdAt
      updatedAt
    }
  }
`;

// Mutation: Delete font family
export const deleteFontFamilyMutationDocument: TypedDocumentNode<
  Graphql.DeleteFontFamilyMutation,
  Graphql.DeleteFontFamilyMutationVariables
> = gql`
  mutation deleteFontFamily($id: Int!) {
    deleteFontFamily(id: $id) {
      id
      name
      category
      locale
      createdAt
      updatedAt
    }
  }
`;

// Mutation: Create font variant
export const createFontVariantMutationDocument: TypedDocumentNode<
  Graphql.CreateFontVariantMutation,
  Graphql.CreateFontVariantMutationVariables
> = gql`
  mutation createFontVariant($input: FontVariantCreateInput!) {
    createFontVariant(input: $input) {
      id
      familyId
      variant
      file {
        path
        url
        name
        size
      }
      url
      createdAt
      updatedAt
    }
  }
`;

// Mutation: Update font variant
export const updateFontVariantMutationDocument: TypedDocumentNode<
  Graphql.UpdateFontVariantMutation,
  Graphql.UpdateFontVariantMutationVariables
> = gql`
  mutation updateFontVariant($input: FontVariantUpdateInput!) {
    updateFontVariant(input: $input) {
      id
      familyId
      variant
      file {
        path
        url
        name
        size
      }
      url
      createdAt
      updatedAt
    }
  }
`;

// Mutation: Delete font variant
export const deleteFontVariantMutationDocument: TypedDocumentNode<
  Graphql.DeleteFontVariantMutation,
  Graphql.DeleteFontVariantMutationVariables
> = gql`
  mutation deleteFontVariant($id: Int!) {
    deleteFontVariant(id: $id) {
      id
      familyId
      variant
      file {
        path
        url
        name
        size
      }
      url
      createdAt
      updatedAt
    }
  }
`;

// Mutation: Create font with family (creates family if doesn't exist)
export const createFontWithFamilyMutationDocument: TypedDocumentNode<
  Graphql.CreateFontWithFamilyMutation,
  Graphql.CreateFontWithFamilyMutationVariables
> = gql`
  mutation createFontWithFamily(
    $familyName: String!
    $category: String
    $locale: [String!]!
    $variant: String!
    $storageFilePath: String!
  ) {
    createFontWithFamily(
      familyName: $familyName
      category: $category
      locale: $locale
      variant: $variant
      storageFilePath: $storageFilePath
    ) {
      id
      familyId
      variant
      file {
        path
        url
        name
        size
      }
      url
      createdAt
      updatedAt
    }
  }
`;
