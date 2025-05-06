import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  /** The JWT token */
  token: Scalars['String']['output'];
  /** The authenticated user */
  user: User;
};

export type CreateTemplateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  parentCategoryId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateTemplateInput = {
  backgroundImage?: InputMaybe<Scalars['Upload']['input']>;
  categoryId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
};

/** Response after logout */
export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  /** Status message */
  message: Scalars['String']['output'];
};

/** Indicates what fields are available at the top level of a mutation operation. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new template */
  createTemplate: Template;
  createTemplateCategory: TemplateCategory;
  /** Delete a template */
  deleteTemplate: Template;
  deleteTemplateCategory: TemplateCategory;
  login: AuthPayload;
  logout: LogoutResponse;
  /** Move a template to the deleted category */
  moveToDeletionCategory: Template;
  reorderTemplateCategories: Array<TemplateCategory>;
  /** Restore a template from the deleted category */
  restoreTemplate: Template;
  /** Update an existing template */
  updateTemplate: Template;
  updateTemplateCategory: TemplateCategory;
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationCreateTemplateArgs = {
  input: CreateTemplateInput;
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationCreateTemplateCategoryArgs = {
  input: CreateTemplateCategoryInput;
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationDeleteTemplateArgs = {
  id: Scalars['ID']['input'];
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationDeleteTemplateCategoryArgs = {
  id: Scalars['ID']['input'];
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationMoveToDeletionCategoryArgs = {
  templateId: Scalars['ID']['input'];
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationReorderTemplateCategoriesArgs = {
  input: Array<ReorderCategoriesInput>;
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationRestoreTemplateArgs = {
  templateId: Scalars['ID']['input'];
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationUpdateTemplateArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTemplateInput;
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationUpdateTemplateCategoryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTemplateCategoryInput;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String']['input'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Aggregate functions when ordering by a relation without specifying a column. */
export enum OrderByRelationAggregateFunction {
  /** Amount of items. */
  Count = 'COUNT'
}

/** Aggregate functions when ordering by a relation that may specify a column. */
export enum OrderByRelationWithColumnAggregateFunction {
  /** Average. */
  Avg = 'AVG',
  /** Amount of items. */
  Count = 'COUNT',
  /** Maximum. */
  Max = 'MAX',
  /** Minimum. */
  Min = 'MIN',
  /** Sum. */
  Sum = 'SUM'
}

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: 'PaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int']['output'];
  /** Index of the current page. */
  currentPage: Scalars['Int']['output'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']['output']>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars['Boolean']['output'];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']['output']>;
  /** Index of the last available page. */
  lastPage: Scalars['Int']['output'];
  /** Number of items per page. */
  perPage: Scalars['Int']['output'];
  /** Number of total available items. */
  total: Scalars['Int']['output'];
};

/** Indicates what fields are available at the top level of a query operation. */
export type Query = {
  __typename?: 'Query';
  deletedCategory: TemplateCategory;
  mainCategory: TemplateCategory;
  me: User;
  templateCategories: TemplateCategoryPaginator;
  templateCategory?: Maybe<TemplateCategory>;
  /** Find a single user by an identifying attribute. */
  user?: Maybe<User>;
  /** List multiple users. */
  users: UserPaginator;
};


/** Indicates what fields are available at the top level of a query operation. */
export type QueryTemplateCategoriesArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** Indicates what fields are available at the top level of a query operation. */
export type QueryTemplateCategoryArgs = {
  id: Scalars['ID']['input'];
};


/** Indicates what fields are available at the top level of a query operation. */
export type QueryUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};


/** Indicates what fields are available at the top level of a query operation. */
export type QueryUsersArgs = {
  first?: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type ReorderCategoriesInput = {
  id: Scalars['ID']['input'];
  order: Scalars['Int']['input'];
};

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC'
}

/** A template in the system */
export type Template = {
  __typename?: 'Template';
  background_url?: Maybe<Scalars['String']['output']>;
  category: TemplateCategory;
  created_at: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type TemplateCategory = {
  __typename?: 'TemplateCategory';
  childCategories: Array<TemplateCategory>;
  created_at: Scalars['DateTime']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  parentCategory?: Maybe<TemplateCategory>;
  specialType?: Maybe<TemplateCategoryType>;
  updated_at: Scalars['DateTime']['output'];
};

/** A paginated list of TemplateCategory items. */
export type TemplateCategoryPaginator = {
  __typename?: 'TemplateCategoryPaginator';
  /** A list of TemplateCategory items. */
  data: Array<TemplateCategory>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export enum TemplateCategoryType {
  Deleted = 'DELETED',
  Main = 'MAIN',
  None = 'NONE'
}

/** Configuration for templates */
export type TemplateConfig = {
  __typename?: 'TemplateConfig';
  allowedFileTypes: Array<Scalars['String']['output']>;
  maxBackgroundSize: Scalars['Int']['output'];
};

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = 'ONLY',
  /** Return both trashed and non-trashed results. */
  With = 'WITH',
  /** Only return non-trashed results. */
  Without = 'WITHOUT'
}

export type UpdateTemplateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  parentCategoryId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateTemplateInput = {
  backgroundImage?: InputMaybe<Scalars['Upload']['input']>;
  categoryId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
};

/** A user of the application */
export type User = {
  __typename?: 'User';
  created_at: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  email_verified_at?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

/** A paginated list of User items. */
export type UserPaginator = {
  __typename?: 'UserPaginator';
  /** A list of User items. */
  data: Array<User>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type PlaceholderQueryVariables = Exact<{ [key: string]: never; }>;


export type PlaceholderQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, name: string, email: string } };


export const PlaceholderDocument = gql`
    query Placeholder {
  me {
    id
    name
    email
  }
}
    `;

/**
 * __usePlaceholderQuery__
 *
 * To run a query within a React component, call `usePlaceholderQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaceholderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaceholderQuery({
 *   variables: {
 *   },
 * });
 */
export function usePlaceholderQuery(baseOptions?: Apollo.QueryHookOptions<PlaceholderQuery, PlaceholderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlaceholderQuery, PlaceholderQueryVariables>(PlaceholderDocument, options);
      }
export function usePlaceholderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaceholderQuery, PlaceholderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlaceholderQuery, PlaceholderQueryVariables>(PlaceholderDocument, options);
        }
export function usePlaceholderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PlaceholderQuery, PlaceholderQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PlaceholderQuery, PlaceholderQueryVariables>(PlaceholderDocument, options);
        }
export type PlaceholderQueryHookResult = ReturnType<typeof usePlaceholderQuery>;
export type PlaceholderLazyQueryHookResult = ReturnType<typeof usePlaceholderLazyQuery>;
export type PlaceholderSuspenseQueryHookResult = ReturnType<typeof usePlaceholderSuspenseQuery>;
export type PlaceholderQueryResult = Apollo.QueryResult<PlaceholderQuery, PlaceholderQueryVariables>;