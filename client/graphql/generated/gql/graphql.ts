/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  refreshToken?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTemplate?: Maybe<Template>;
  createTemplateCategory?: Maybe<TemplateCategory>;
  deleteTemplate?: Maybe<Template>;
  deleteTemplateCategory?: Maybe<TemplateCategory>;
  login?: Maybe<LoginResponse>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  refreshToken?: Maybe<RefreshTokenResponse>;
  suspendTemplate?: Maybe<Template>;
  unsuspendTemplate?: Maybe<Template>;
  updateTemplate?: Maybe<Template>;
  updateTemplateCategory?: Maybe<TemplateCategory>;
};


export type MutationCreateTemplateArgs = {
  input: TemplateCreateInput;
};


export type MutationCreateTemplateCategoryArgs = {
  input: TemplateCategoryCreateInput;
};


export type MutationDeleteTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteTemplateCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSuspendTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUnsuspendTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateTemplateArgs = {
  input: UpdateTemplateInput;
};


export type MutationUpdateTemplateCategoryArgs = {
  input: TemplateCategoryUpdateInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  count?: Maybe<Scalars['Int']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  firstItem?: Maybe<Scalars['Int']['output']>;
  hasMorePages?: Maybe<Scalars['Boolean']['output']>;
  lastItem?: Maybe<Scalars['Int']['output']>;
  lastPage?: Maybe<Scalars['Int']['output']>;
  perPage?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type PaginatedTemplatesResponse = {
  __typename?: 'PaginatedTemplatesResponse';
  data?: Maybe<Array<Template>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginationArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxCount?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  mainTemplateCategory?: Maybe<TemplateCategory>;
  me?: Maybe<User>;
  suspensionTemplateCategory?: Maybe<TemplateCategory>;
  template?: Maybe<Template>;
  templateCategories?: Maybe<Array<TemplateCategory>>;
  templateCategory?: Maybe<TemplateCategory>;
  templates?: Maybe<PaginatedTemplatesResponse>;
  templatesConfigs?: Maybe<TemplatesConfigs>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplateCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplatesArgs = {
  pagination?: InputMaybe<PaginationArgs>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type RefreshTokenResponse = {
  __typename?: 'RefreshTokenResponse';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Template = {
  __typename?: 'Template';
  category?: Maybe<TemplateCategory>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  preSuspensionCategory?: Maybe<TemplateCategory>;
  updatedAt: Scalars['DateTime']['output'];
};

export type TemplateCategory = {
  __typename?: 'TemplateCategory';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  parentCategory?: Maybe<TemplateCategory>;
  specialType?: Maybe<Scalars['String']['output']>;
  subCategories?: Maybe<Array<TemplateCategory>>;
  templates?: Maybe<Array<Template>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type TemplateCategoryCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
};

export type TemplateCategoryUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
};

export type TemplateCreateInput = {
  categoryId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type TemplatesConfig = {
  __typename?: 'TemplatesConfig';
  key?: Maybe<TemplatesConfigsKey>;
  value?: Maybe<Scalars['String']['output']>;
};

export type TemplatesConfigs = {
  __typename?: 'TemplatesConfigs';
  configs?: Maybe<Array<TemplatesConfig>>;
};

export type TemplatesConfigsKey =
  | 'ALLOWED_FILE_TYPES'
  | 'MAX_BACKGROUND_SIZE';

export type UpdateTemplateInput = {
  categoryId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', createdAt?: any | null, email?: string | null, emailVerifiedAt?: any | null, id?: number | null, name?: string | null, updatedAt?: any | null } | null };

export type UserQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', createdAt?: any | null, email?: string | null, emailVerifiedAt?: any | null, id?: number | null, name?: string | null, updatedAt?: any | null } | null };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'User', createdAt?: any | null, email?: string | null, emailVerifiedAt?: any | null, id?: number | null, name?: string | null, updatedAt?: any | null }> | null };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginResponse', token?: string | null, user?: { __typename?: 'User', createdAt?: any | null, email?: string | null, emailVerifiedAt?: any | null, id?: number | null, name?: string | null, updatedAt?: any | null } | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: boolean | null };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken?: { __typename?: 'RefreshTokenResponse', token?: string | null, user?: { __typename?: 'User', createdAt?: any | null, email?: string | null, emailVerifiedAt?: any | null, id?: number | null, name?: string | null, updatedAt?: any | null } | null } | null };

export type TemplateQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TemplateQuery = { __typename?: 'Query', template?: { __typename?: 'Template', id: number, name: string, description?: string | null, order: number, createdAt: any, updatedAt: any, category?: { __typename?: 'TemplateCategory', id: number, name: string } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type TemplatesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationArgs>;
}>;


export type TemplatesQuery = { __typename?: 'Query', templates?: { __typename?: 'PaginatedTemplatesResponse', data?: Array<{ __typename?: 'Template', id: number, name: string, description?: string | null, order: number, createdAt: any, updatedAt: any, category?: { __typename?: 'TemplateCategory', id: number, name: string } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null }> | null, pageInfo?: { __typename?: 'PageInfo', count?: number | null, currentPage?: number | null, firstItem?: number | null, hasMorePages?: boolean | null, lastItem?: number | null, lastPage?: number | null, perPage?: number | null, total?: number | null } | null } | null };

export type TemplatesConfigsQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplatesConfigsQuery = { __typename?: 'Query', templatesConfigs?: { __typename?: 'TemplatesConfigs', configs?: Array<{ __typename?: 'TemplatesConfig', key?: TemplatesConfigsKey | null, value?: string | null }> | null } | null };

export type CreateTemplateMutationVariables = Exact<{
  input: TemplateCreateInput;
}>;


export type CreateTemplateMutation = { __typename?: 'Mutation', createTemplate?: { __typename?: 'Template', id: number, name: string, description?: string | null, order: number, createdAt: any, updatedAt: any, category?: { __typename?: 'TemplateCategory', id: number, name: string } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type UpdateTemplateMutationVariables = Exact<{
  input: UpdateTemplateInput;
}>;


export type UpdateTemplateMutation = { __typename?: 'Mutation', updateTemplate?: { __typename?: 'Template', id: number, name: string, description?: string | null, order: number, createdAt: any, updatedAt: any, category?: { __typename?: 'TemplateCategory', id: number, name: string } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate?: { __typename?: 'Template', id: number, name: string, category?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type SuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type SuspendTemplateMutation = { __typename?: 'Mutation', suspendTemplate?: { __typename?: 'Template', id: number, name: string, description?: string | null, order: number, createdAt: any, updatedAt: any, category?: { __typename?: 'TemplateCategory', id: number, name: string } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type UnsuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type UnsuspendTemplateMutation = { __typename?: 'Mutation', unsuspendTemplate?: { __typename?: 'Template', id: number, name: string, description?: string | null, order: number, createdAt: any, updatedAt: any, category?: { __typename?: 'TemplateCategory', id: number, name: string } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type MainTemplateCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type MainTemplateCategoryQuery = { __typename?: 'Query', mainTemplateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, specialType?: string | null, order?: number | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null, subCategories?: Array<{ __typename?: 'TemplateCategory', id: number, name: string }> | null } | null };

export type SuspensionTemplateCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type SuspensionTemplateCategoryQuery = { __typename?: 'Query', suspensionTemplateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, specialType?: string | null, order?: number | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null, subCategories?: Array<{ __typename?: 'TemplateCategory', id: number, name: string }> | null } | null };

export type TemplateCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplateCategoriesQuery = { __typename?: 'Query', templateCategories?: Array<{ __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, specialType?: string | null, order?: number | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null, templates?: Array<{ __typename?: 'Template', id: number, name: string, description?: string | null, order: number, createdAt: any, updatedAt: any }> | null }> | null };

export type TemplateCategoryQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TemplateCategoryQuery = { __typename?: 'Query', templateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, specialType?: string | null, order?: number | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null, subCategories?: Array<{ __typename?: 'TemplateCategory', id: number, name: string }> | null } | null };

export type CreateTemplateCategoryMutationVariables = Exact<{
  input: TemplateCategoryCreateInput;
}>;


export type CreateTemplateCategoryMutation = { __typename?: 'Mutation', createTemplateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, specialType?: string | null, order?: number | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type DeleteTemplateCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateCategoryMutation = { __typename?: 'Mutation', deleteTemplateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type UpdateTemplateCategoryMutationVariables = Exact<{
  input: TemplateCategoryUpdateInput;
}>;


export type UpdateTemplateCategoryMutation = { __typename?: 'Mutation', updateTemplateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, specialType?: string | null, order?: number | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };


export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"user"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const TemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"template"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"template"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<TemplateQuery, TemplateQueryVariables>;
export const TemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}},{"kind":"Field","name":{"kind":"Name","value":"lastItem"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<TemplatesQuery, TemplatesQueryVariables>;
export const TemplatesConfigsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplatesConfigs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templatesConfigs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"configs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<TemplatesConfigsQuery, TemplatesConfigsQueryVariables>;
export const CreateTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateMutation, CreateTemplateMutationVariables>;
export const UpdateTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTemplateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateMutation, UpdateTemplateMutationVariables>;
export const DeleteTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTemplateMutation, DeleteTemplateMutationVariables>;
export const SuspendTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"suspendTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suspendTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SuspendTemplateMutation, SuspendTemplateMutationVariables>;
export const UnsuspendTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unsuspendTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsuspendTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UnsuspendTemplateMutation, UnsuspendTemplateMutationVariables>;
export const MainTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mainTemplateCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mainTemplateCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"subCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>;
export const SuspensionTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"suspensionTemplateCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suspensionTemplateCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"subCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>;
export const TemplateCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templateCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templateCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"templates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>;
export const TemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"subCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<TemplateCategoryQuery, TemplateCategoryQueryVariables>;
export const CreateTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateCategoryCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateCategoryMutation, CreateTemplateCategoryMutationVariables>;
export const DeleteTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTemplateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTemplateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTemplateCategoryMutation, DeleteTemplateCategoryMutationVariables>;
export const UpdateTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateCategoryUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateCategoryMutation, UpdateTemplateCategoryMutationVariables>;