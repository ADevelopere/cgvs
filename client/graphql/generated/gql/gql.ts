/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query templateCategory($id: Int!) {\n    templateCategory(id: $id) {\n      id\n      name\n      description\n      specialType\n      order\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.TemplateCategoryDocument,
    "\n  query categoryChildren($parentCategoryId: Int) {\n    categoryChildren(parentCategoryId: $parentCategoryId) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CategoryChildrenDocument,
    "\n  mutation createTemplateCategory($input: TemplateCategoryCreateInput!) {\n    createTemplateCategory(input: $input) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateTemplateCategoryDocument,
    "\n  mutation deleteTemplateCategory($id: Int!) {\n    deleteTemplateCategory(id: $id) {\n      id\n      name\n      parentCategory {\n        id\n      }\n    }\n  }\n": typeof types.DeleteTemplateCategoryDocument,
    "\n  mutation updateTemplateCategory($input: TemplateCategoryUpdateInput!) {\n    updateTemplateCategory(input: $input) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateTemplateCategoryDocument,
    "\n  query templatesByCategoryId(\n    $categoryId: Int\n    $paginationArgs: PaginationArgs\n    $filterArgs: TemplateFilterArgs\n    $orderBy: [TemplatesOrderByClause!]\n  ) {\n    templatesByCategoryId(\n      categoryId: $categoryId\n      paginationArgs: $paginationArgs\n      filterArgs: $filterArgs\n      orderBy: $orderBy\n    ) {\n      data {\n        id\n        name\n        description\n        imageUrl\n        order\n        createdAt\n        updatedAt\n        category {\n          id\n        }\n        preSuspensionCategory {\n          id\n        }\n      }\n      pageInfo {\n        count\n        currentPage\n        firstItem\n        lastItem\n        hasMorePages\n        lastPage\n        perPage\n        total\n      }\n    }\n  }\n": typeof types.TemplatesByCategoryIdDocument,
    "\n  query suspendedTemplates {\n    suspendedTemplates {\n      id\n      name\n      description\n      imageUrl\n      order\n      createdAt\n      updatedAt\n      category {\n        id\n      }\n      preSuspensionCategory {\n        id\n      }\n    }\n  }\n": typeof types.SuspendedTemplatesDocument,
    "\n  mutation createTemplate($input: TemplateCreateInput!) {\n    createTemplate(input: $input) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateTemplateDocument,
    "\n  mutation suspendTemplate($id: Int!) {\n    suspendTemplate(id: $id) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.SuspendTemplateDocument,
    "\n  mutation unsuspendTemplate($id: Int!) {\n    unsuspendTemplate(id: $id) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UnsuspendTemplateDocument,
    "\n  mutation updateTemplate($input: TemplateUpdateInput!) {\n    updateTemplate(input: $input) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateTemplateDocument,
    "\n  mutation deleteTemplate($id: Int!) {\n    deleteTemplate(id: $id) {\n      id\n      name\n      category {\n        id\n      }\n    }\n  }\n": typeof types.DeleteTemplateDocument,
    "\n  query searchTemplateCategories(\n    $searchTerm: String!\n    $limit: Int\n    $includeParentTree: Boolean\n  ) {\n    searchTemplateCategories(\n      searchTerm: $searchTerm\n      limit: $limit\n      includeParentTree: $includeParentTree\n    ) {\n      id\n      name\n      description\n      specialType\n      order\n      parentTree\n    }\n  }\n": typeof types.SearchTemplateCategoriesDocument,
};
const documents: Documents = {
    "\n  query templateCategory($id: Int!) {\n    templateCategory(id: $id) {\n      id\n      name\n      description\n      specialType\n      order\n      createdAt\n      updatedAt\n    }\n  }\n": types.TemplateCategoryDocument,
    "\n  query categoryChildren($parentCategoryId: Int) {\n    categoryChildren(parentCategoryId: $parentCategoryId) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n": types.CategoryChildrenDocument,
    "\n  mutation createTemplateCategory($input: TemplateCategoryCreateInput!) {\n    createTemplateCategory(input: $input) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateTemplateCategoryDocument,
    "\n  mutation deleteTemplateCategory($id: Int!) {\n    deleteTemplateCategory(id: $id) {\n      id\n      name\n      parentCategory {\n        id\n      }\n    }\n  }\n": types.DeleteTemplateCategoryDocument,
    "\n  mutation updateTemplateCategory($input: TemplateCategoryUpdateInput!) {\n    updateTemplateCategory(input: $input) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateTemplateCategoryDocument,
    "\n  query templatesByCategoryId(\n    $categoryId: Int\n    $paginationArgs: PaginationArgs\n    $filterArgs: TemplateFilterArgs\n    $orderBy: [TemplatesOrderByClause!]\n  ) {\n    templatesByCategoryId(\n      categoryId: $categoryId\n      paginationArgs: $paginationArgs\n      filterArgs: $filterArgs\n      orderBy: $orderBy\n    ) {\n      data {\n        id\n        name\n        description\n        imageUrl\n        order\n        createdAt\n        updatedAt\n        category {\n          id\n        }\n        preSuspensionCategory {\n          id\n        }\n      }\n      pageInfo {\n        count\n        currentPage\n        firstItem\n        lastItem\n        hasMorePages\n        lastPage\n        perPage\n        total\n      }\n    }\n  }\n": types.TemplatesByCategoryIdDocument,
    "\n  query suspendedTemplates {\n    suspendedTemplates {\n      id\n      name\n      description\n      imageUrl\n      order\n      createdAt\n      updatedAt\n      category {\n        id\n      }\n      preSuspensionCategory {\n        id\n      }\n    }\n  }\n": types.SuspendedTemplatesDocument,
    "\n  mutation createTemplate($input: TemplateCreateInput!) {\n    createTemplate(input: $input) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateTemplateDocument,
    "\n  mutation suspendTemplate($id: Int!) {\n    suspendTemplate(id: $id) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.SuspendTemplateDocument,
    "\n  mutation unsuspendTemplate($id: Int!) {\n    unsuspendTemplate(id: $id) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.UnsuspendTemplateDocument,
    "\n  mutation updateTemplate($input: TemplateUpdateInput!) {\n    updateTemplate(input: $input) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateTemplateDocument,
    "\n  mutation deleteTemplate($id: Int!) {\n    deleteTemplate(id: $id) {\n      id\n      name\n      category {\n        id\n      }\n    }\n  }\n": types.DeleteTemplateDocument,
    "\n  query searchTemplateCategories(\n    $searchTerm: String!\n    $limit: Int\n    $includeParentTree: Boolean\n  ) {\n    searchTemplateCategories(\n      searchTerm: $searchTerm\n      limit: $limit\n      includeParentTree: $includeParentTree\n    ) {\n      id\n      name\n      description\n      specialType\n      order\n      parentTree\n    }\n  }\n": types.SearchTemplateCategoriesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query templateCategory($id: Int!) {\n    templateCategory(id: $id) {\n      id\n      name\n      description\n      specialType\n      order\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query templateCategory($id: Int!) {\n    templateCategory(id: $id) {\n      id\n      name\n      description\n      specialType\n      order\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query categoryChildren($parentCategoryId: Int) {\n    categoryChildren(parentCategoryId: $parentCategoryId) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query categoryChildren($parentCategoryId: Int) {\n    categoryChildren(parentCategoryId: $parentCategoryId) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createTemplateCategory($input: TemplateCategoryCreateInput!) {\n    createTemplateCategory(input: $input) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation createTemplateCategory($input: TemplateCategoryCreateInput!) {\n    createTemplateCategory(input: $input) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteTemplateCategory($id: Int!) {\n    deleteTemplateCategory(id: $id) {\n      id\n      name\n      parentCategory {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation deleteTemplateCategory($id: Int!) {\n    deleteTemplateCategory(id: $id) {\n      id\n      name\n      parentCategory {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateTemplateCategory($input: TemplateCategoryUpdateInput!) {\n    updateTemplateCategory(input: $input) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation updateTemplateCategory($input: TemplateCategoryUpdateInput!) {\n    updateTemplateCategory(input: $input) {\n      id\n      name\n      description\n      specialType\n      parentCategory {\n        id\n      }\n      order\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query templatesByCategoryId(\n    $categoryId: Int\n    $paginationArgs: PaginationArgs\n    $filterArgs: TemplateFilterArgs\n    $orderBy: [TemplatesOrderByClause!]\n  ) {\n    templatesByCategoryId(\n      categoryId: $categoryId\n      paginationArgs: $paginationArgs\n      filterArgs: $filterArgs\n      orderBy: $orderBy\n    ) {\n      data {\n        id\n        name\n        description\n        imageUrl\n        order\n        createdAt\n        updatedAt\n        category {\n          id\n        }\n        preSuspensionCategory {\n          id\n        }\n      }\n      pageInfo {\n        count\n        currentPage\n        firstItem\n        lastItem\n        hasMorePages\n        lastPage\n        perPage\n        total\n      }\n    }\n  }\n"): (typeof documents)["\n  query templatesByCategoryId(\n    $categoryId: Int\n    $paginationArgs: PaginationArgs\n    $filterArgs: TemplateFilterArgs\n    $orderBy: [TemplatesOrderByClause!]\n  ) {\n    templatesByCategoryId(\n      categoryId: $categoryId\n      paginationArgs: $paginationArgs\n      filterArgs: $filterArgs\n      orderBy: $orderBy\n    ) {\n      data {\n        id\n        name\n        description\n        imageUrl\n        order\n        createdAt\n        updatedAt\n        category {\n          id\n        }\n        preSuspensionCategory {\n          id\n        }\n      }\n      pageInfo {\n        count\n        currentPage\n        firstItem\n        lastItem\n        hasMorePages\n        lastPage\n        perPage\n        total\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query suspendedTemplates {\n    suspendedTemplates {\n      id\n      name\n      description\n      imageUrl\n      order\n      createdAt\n      updatedAt\n      category {\n        id\n      }\n      preSuspensionCategory {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query suspendedTemplates {\n    suspendedTemplates {\n      id\n      name\n      description\n      imageUrl\n      order\n      createdAt\n      updatedAt\n      category {\n        id\n      }\n      preSuspensionCategory {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createTemplate($input: TemplateCreateInput!) {\n    createTemplate(input: $input) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation createTemplate($input: TemplateCreateInput!) {\n    createTemplate(input: $input) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation suspendTemplate($id: Int!) {\n    suspendTemplate(id: $id) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation suspendTemplate($id: Int!) {\n    suspendTemplate(id: $id) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation unsuspendTemplate($id: Int!) {\n    unsuspendTemplate(id: $id) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation unsuspendTemplate($id: Int!) {\n    unsuspendTemplate(id: $id) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateTemplate($input: TemplateUpdateInput!) {\n    updateTemplate(input: $input) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation updateTemplate($input: TemplateUpdateInput!) {\n    updateTemplate(input: $input) {\n      id\n      name\n      description\n      imageUrl\n      category {\n        id\n      }\n      order\n      preSuspensionCategory {\n        id\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteTemplate($id: Int!) {\n    deleteTemplate(id: $id) {\n      id\n      name\n      category {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation deleteTemplate($id: Int!) {\n    deleteTemplate(id: $id) {\n      id\n      name\n      category {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchTemplateCategories(\n    $searchTerm: String!\n    $limit: Int\n    $includeParentTree: Boolean\n  ) {\n    searchTemplateCategories(\n      searchTerm: $searchTerm\n      limit: $limit\n      includeParentTree: $includeParentTree\n    ) {\n      id\n      name\n      description\n      specialType\n      order\n      parentTree\n    }\n  }\n"): (typeof documents)["\n  query searchTemplateCategories(\n    $searchTerm: String!\n    $limit: Int\n    $includeParentTree: Boolean\n  ) {\n    searchTemplateCategories(\n      searchTerm: $searchTerm\n      limit: $limit\n      includeParentTree: $includeParentTree\n    ) {\n      id\n      name\n      description\n      specialType\n      order\n      parentTree\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;