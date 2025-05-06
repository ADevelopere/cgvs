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
export type OrderByRelationAggregateFunction =
  /** Amount of items. */
  | 'COUNT';

/** Aggregate functions when ordering by a relation that may specify a column. */
export type OrderByRelationWithColumnAggregateFunction =
  /** Average. */
  | 'AVG'
  /** Amount of items. */
  | 'COUNT'
  /** Maximum. */
  | 'MAX'
  /** Minimum. */
  | 'MIN'
  /** Sum. */
  | 'SUM';

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
export type SortOrder =
  /** Sort records in ascending order. */
  | 'ASC'
  /** Sort records in descending order. */
  | 'DESC';

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
  templates: Array<Template>;
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

export type TemplateCategoryType =
  | 'DELETION'
  | 'MAIN';

/** Configuration for templates */
export type TemplateConfig = {
  __typename?: 'TemplateConfig';
  allowedFileTypes: Array<Scalars['String']['output']>;
  maxBackgroundSize: Scalars['Int']['output'];
};

/** Specify if you want to include or exclude trashed results from a query. */
export type Trashed =
  /** Only return trashed results. */
  | 'ONLY'
  /** Return both trashed and non-trashed results. */
  | 'WITH'
  /** Only return non-trashed results. */
  | 'WITHOUT';

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

export type CreateTemplateMutationVariables = Exact<{
  input: CreateTemplateInput;
}>;


export type CreateTemplateMutation = { __typename?: 'Mutation', createTemplate: { __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> } } };

export type CreateTemplateCategoryMutationVariables = Exact<{
  input: CreateTemplateCategoryInput;
}>;


export type CreateTemplateCategoryMutation = { __typename?: 'Mutation', createTemplateCategory: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate: { __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> } } };

export type DeleteTemplateCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTemplateCategoryMutation = { __typename?: 'Mutation', deleteTemplateCategory: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', created_at: any, email: string, email_verified_at?: any | null, id: string, isAdmin: boolean, name: string, updated_at: any } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResponse', message: string } };

export type MoveToDeletionCategoryMutationVariables = Exact<{
  templateId: Scalars['ID']['input'];
}>;


export type MoveToDeletionCategoryMutation = { __typename?: 'Mutation', moveToDeletionCategory: { __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> } } };

export type ReorderTemplateCategoriesMutationVariables = Exact<{
  input: Array<ReorderCategoriesInput> | ReorderCategoriesInput;
}>;


export type ReorderTemplateCategoriesMutation = { __typename?: 'Mutation', reorderTemplateCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> }> };

export type RestoreTemplateMutationVariables = Exact<{
  templateId: Scalars['ID']['input'];
}>;


export type RestoreTemplateMutation = { __typename?: 'Mutation', restoreTemplate: { __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> } } };

export type UpdateTemplateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTemplateInput;
}>;


export type UpdateTemplateMutation = { __typename?: 'Mutation', updateTemplate: { __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> } } };

export type UpdateTemplateCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTemplateCategoryInput;
}>;


export type UpdateTemplateCategoryMutation = { __typename?: 'Mutation', updateTemplateCategory: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } };

export type DeletedCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type DeletedCategoryQuery = { __typename?: 'Query', deletedCategory: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } };

export type MainCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type MainCategoryQuery = { __typename?: 'Query', mainCategory: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', created_at: any, email: string, email_verified_at?: any | null, id: string, isAdmin: boolean, name: string, updated_at: any } };

export type TemplateCategoriesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TemplateCategoriesQuery = { __typename?: 'Query', templateCategories: { __typename?: 'TemplateCategoryPaginator', data: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } }> }>, paginatorInfo: { __typename?: 'PaginatorInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } } };

export type TemplateCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TemplateCategoryQuery = { __typename?: 'Query', templateCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any, childCategories: Array<{ __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any, category: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } }> }> }>, parentCategory?: { __typename?: 'TemplateCategory', created_at: any, deleted_at?: any | null, description?: string | null, id: string, name: string, order: number, specialType?: TemplateCategoryType | null, updated_at: any } | null, templates: Array<{ __typename?: 'Template', background_url?: string | null, created_at: any, description?: string | null, id: string, name: string, order: number, updated_at: any }> } | null };

export type UserQueryVariables = Exact<{
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', created_at: any, email: string, email_verified_at?: any | null, id: string, isAdmin: boolean, name: string, updated_at: any } | null };

export type UsersQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UserPaginator', data: Array<{ __typename?: 'User', created_at: any, email: string, email_verified_at?: any | null, id: string, isAdmin: boolean, name: string, updated_at: any }>, paginatorInfo: { __typename?: 'PaginatorInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } } };

export type PlaceholderQueryVariables = Exact<{ [key: string]: never; }>;


export type PlaceholderQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, name: string, email: string } };


export const CreateTemplateDocument = gql`
    mutation createTemplate($input: CreateTemplateInput!) {
  createTemplate(input: $input) {
    background_url
    category {
      childCategories {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        specialType
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      parentCategory {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        updated_at
      }
      specialType
      templates {
        background_url
        category {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        description
        id
        name
        order
        updated_at
      }
      updated_at
    }
    created_at
    description
    id
    name
    order
    updated_at
  }
}
    `;
export type CreateTemplateMutationFn = Apollo.MutationFunction<CreateTemplateMutation, CreateTemplateMutationVariables>;

/**
 * __useCreateTemplateMutation__
 *
 * To run a mutation, you first call `useCreateTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTemplateMutation, { data, loading, error }] = useCreateTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateTemplateMutation, CreateTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTemplateMutation, CreateTemplateMutationVariables>(CreateTemplateDocument, options);
      }
export type CreateTemplateMutationHookResult = ReturnType<typeof useCreateTemplateMutation>;
export type CreateTemplateMutationResult = Apollo.MutationResult<CreateTemplateMutation>;
export type CreateTemplateMutationOptions = Apollo.BaseMutationOptions<CreateTemplateMutation, CreateTemplateMutationVariables>;
export const CreateTemplateCategoryDocument = gql`
    mutation createTemplateCategory($input: CreateTemplateCategoryInput!) {
  createTemplateCategory(input: $input) {
    childCategories {
      childCategories {
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          childCategories {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        templates {
          background_url
          category {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          description
          id
          name
          order
          updated_at
        }
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    created_at
    deleted_at
    description
    id
    name
    order
    parentCategory {
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    specialType
    templates {
      background_url
      created_at
      description
      id
      name
      order
      updated_at
    }
    updated_at
  }
}
    `;
export type CreateTemplateCategoryMutationFn = Apollo.MutationFunction<CreateTemplateCategoryMutation, CreateTemplateCategoryMutationVariables>;

/**
 * __useCreateTemplateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateTemplateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTemplateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTemplateCategoryMutation, { data, loading, error }] = useCreateTemplateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTemplateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateTemplateCategoryMutation, CreateTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTemplateCategoryMutation, CreateTemplateCategoryMutationVariables>(CreateTemplateCategoryDocument, options);
      }
export type CreateTemplateCategoryMutationHookResult = ReturnType<typeof useCreateTemplateCategoryMutation>;
export type CreateTemplateCategoryMutationResult = Apollo.MutationResult<CreateTemplateCategoryMutation>;
export type CreateTemplateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateTemplateCategoryMutation, CreateTemplateCategoryMutationVariables>;
export const DeleteTemplateDocument = gql`
    mutation deleteTemplate($id: ID!) {
  deleteTemplate(id: $id) {
    background_url
    category {
      childCategories {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        specialType
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      parentCategory {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        updated_at
      }
      specialType
      templates {
        background_url
        category {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        description
        id
        name
        order
        updated_at
      }
      updated_at
    }
    created_at
    description
    id
    name
    order
    updated_at
  }
}
    `;
export type DeleteTemplateMutationFn = Apollo.MutationFunction<DeleteTemplateMutation, DeleteTemplateMutationVariables>;

/**
 * __useDeleteTemplateMutation__
 *
 * To run a mutation, you first call `useDeleteTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTemplateMutation, { data, loading, error }] = useDeleteTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTemplateMutation, DeleteTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTemplateMutation, DeleteTemplateMutationVariables>(DeleteTemplateDocument, options);
      }
export type DeleteTemplateMutationHookResult = ReturnType<typeof useDeleteTemplateMutation>;
export type DeleteTemplateMutationResult = Apollo.MutationResult<DeleteTemplateMutation>;
export type DeleteTemplateMutationOptions = Apollo.BaseMutationOptions<DeleteTemplateMutation, DeleteTemplateMutationVariables>;
export const DeleteTemplateCategoryDocument = gql`
    mutation deleteTemplateCategory($id: ID!) {
  deleteTemplateCategory(id: $id) {
    childCategories {
      childCategories {
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          childCategories {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        templates {
          background_url
          category {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          description
          id
          name
          order
          updated_at
        }
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    created_at
    deleted_at
    description
    id
    name
    order
    parentCategory {
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    specialType
    templates {
      background_url
      created_at
      description
      id
      name
      order
      updated_at
    }
    updated_at
  }
}
    `;
export type DeleteTemplateCategoryMutationFn = Apollo.MutationFunction<DeleteTemplateCategoryMutation, DeleteTemplateCategoryMutationVariables>;

/**
 * __useDeleteTemplateCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteTemplateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTemplateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTemplateCategoryMutation, { data, loading, error }] = useDeleteTemplateCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTemplateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTemplateCategoryMutation, DeleteTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTemplateCategoryMutation, DeleteTemplateCategoryMutationVariables>(DeleteTemplateCategoryDocument, options);
      }
export type DeleteTemplateCategoryMutationHookResult = ReturnType<typeof useDeleteTemplateCategoryMutation>;
export type DeleteTemplateCategoryMutationResult = Apollo.MutationResult<DeleteTemplateCategoryMutation>;
export type DeleteTemplateCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteTemplateCategoryMutation, DeleteTemplateCategoryMutationVariables>;
export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      created_at
      email
      email_verified_at
      id
      isAdmin
      name
      updated_at
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
  logout {
    message
  }
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MoveToDeletionCategoryDocument = gql`
    mutation moveToDeletionCategory($templateId: ID!) {
  moveToDeletionCategory(templateId: $templateId) {
    background_url
    category {
      childCategories {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        specialType
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      parentCategory {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        updated_at
      }
      specialType
      templates {
        background_url
        category {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        description
        id
        name
        order
        updated_at
      }
      updated_at
    }
    created_at
    description
    id
    name
    order
    updated_at
  }
}
    `;
export type MoveToDeletionCategoryMutationFn = Apollo.MutationFunction<MoveToDeletionCategoryMutation, MoveToDeletionCategoryMutationVariables>;

/**
 * __useMoveToDeletionCategoryMutation__
 *
 * To run a mutation, you first call `useMoveToDeletionCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveToDeletionCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveToDeletionCategoryMutation, { data, loading, error }] = useMoveToDeletionCategoryMutation({
 *   variables: {
 *      templateId: // value for 'templateId'
 *   },
 * });
 */
export function useMoveToDeletionCategoryMutation(baseOptions?: Apollo.MutationHookOptions<MoveToDeletionCategoryMutation, MoveToDeletionCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveToDeletionCategoryMutation, MoveToDeletionCategoryMutationVariables>(MoveToDeletionCategoryDocument, options);
      }
export type MoveToDeletionCategoryMutationHookResult = ReturnType<typeof useMoveToDeletionCategoryMutation>;
export type MoveToDeletionCategoryMutationResult = Apollo.MutationResult<MoveToDeletionCategoryMutation>;
export type MoveToDeletionCategoryMutationOptions = Apollo.BaseMutationOptions<MoveToDeletionCategoryMutation, MoveToDeletionCategoryMutationVariables>;
export const ReorderTemplateCategoriesDocument = gql`
    mutation reorderTemplateCategories($input: [ReorderCategoriesInput!]!) {
  reorderTemplateCategories(input: $input) {
    childCategories {
      childCategories {
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          childCategories {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        templates {
          background_url
          category {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          description
          id
          name
          order
          updated_at
        }
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    created_at
    deleted_at
    description
    id
    name
    order
    parentCategory {
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    specialType
    templates {
      background_url
      created_at
      description
      id
      name
      order
      updated_at
    }
    updated_at
  }
}
    `;
export type ReorderTemplateCategoriesMutationFn = Apollo.MutationFunction<ReorderTemplateCategoriesMutation, ReorderTemplateCategoriesMutationVariables>;

/**
 * __useReorderTemplateCategoriesMutation__
 *
 * To run a mutation, you first call `useReorderTemplateCategoriesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReorderTemplateCategoriesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reorderTemplateCategoriesMutation, { data, loading, error }] = useReorderTemplateCategoriesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReorderTemplateCategoriesMutation(baseOptions?: Apollo.MutationHookOptions<ReorderTemplateCategoriesMutation, ReorderTemplateCategoriesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReorderTemplateCategoriesMutation, ReorderTemplateCategoriesMutationVariables>(ReorderTemplateCategoriesDocument, options);
      }
export type ReorderTemplateCategoriesMutationHookResult = ReturnType<typeof useReorderTemplateCategoriesMutation>;
export type ReorderTemplateCategoriesMutationResult = Apollo.MutationResult<ReorderTemplateCategoriesMutation>;
export type ReorderTemplateCategoriesMutationOptions = Apollo.BaseMutationOptions<ReorderTemplateCategoriesMutation, ReorderTemplateCategoriesMutationVariables>;
export const RestoreTemplateDocument = gql`
    mutation restoreTemplate($templateId: ID!) {
  restoreTemplate(templateId: $templateId) {
    background_url
    category {
      childCategories {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        specialType
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      parentCategory {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        updated_at
      }
      specialType
      templates {
        background_url
        category {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        description
        id
        name
        order
        updated_at
      }
      updated_at
    }
    created_at
    description
    id
    name
    order
    updated_at
  }
}
    `;
export type RestoreTemplateMutationFn = Apollo.MutationFunction<RestoreTemplateMutation, RestoreTemplateMutationVariables>;

/**
 * __useRestoreTemplateMutation__
 *
 * To run a mutation, you first call `useRestoreTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestoreTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restoreTemplateMutation, { data, loading, error }] = useRestoreTemplateMutation({
 *   variables: {
 *      templateId: // value for 'templateId'
 *   },
 * });
 */
export function useRestoreTemplateMutation(baseOptions?: Apollo.MutationHookOptions<RestoreTemplateMutation, RestoreTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RestoreTemplateMutation, RestoreTemplateMutationVariables>(RestoreTemplateDocument, options);
      }
export type RestoreTemplateMutationHookResult = ReturnType<typeof useRestoreTemplateMutation>;
export type RestoreTemplateMutationResult = Apollo.MutationResult<RestoreTemplateMutation>;
export type RestoreTemplateMutationOptions = Apollo.BaseMutationOptions<RestoreTemplateMutation, RestoreTemplateMutationVariables>;
export const UpdateTemplateDocument = gql`
    mutation updateTemplate($id: ID!, $input: UpdateTemplateInput!) {
  updateTemplate(id: $id, input: $input) {
    background_url
    category {
      childCategories {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        specialType
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      parentCategory {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        updated_at
      }
      specialType
      templates {
        background_url
        category {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        description
        id
        name
        order
        updated_at
      }
      updated_at
    }
    created_at
    description
    id
    name
    order
    updated_at
  }
}
    `;
export type UpdateTemplateMutationFn = Apollo.MutationFunction<UpdateTemplateMutation, UpdateTemplateMutationVariables>;

/**
 * __useUpdateTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTemplateMutation, { data, loading, error }] = useUpdateTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTemplateMutation, UpdateTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTemplateMutation, UpdateTemplateMutationVariables>(UpdateTemplateDocument, options);
      }
export type UpdateTemplateMutationHookResult = ReturnType<typeof useUpdateTemplateMutation>;
export type UpdateTemplateMutationResult = Apollo.MutationResult<UpdateTemplateMutation>;
export type UpdateTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateTemplateMutation, UpdateTemplateMutationVariables>;
export const UpdateTemplateCategoryDocument = gql`
    mutation updateTemplateCategory($id: ID!, $input: UpdateTemplateCategoryInput!) {
  updateTemplateCategory(id: $id, input: $input) {
    childCategories {
      childCategories {
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          childCategories {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        templates {
          background_url
          category {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          description
          id
          name
          order
          updated_at
        }
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    created_at
    deleted_at
    description
    id
    name
    order
    parentCategory {
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    specialType
    templates {
      background_url
      created_at
      description
      id
      name
      order
      updated_at
    }
    updated_at
  }
}
    `;
export type UpdateTemplateCategoryMutationFn = Apollo.MutationFunction<UpdateTemplateCategoryMutation, UpdateTemplateCategoryMutationVariables>;

/**
 * __useUpdateTemplateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateTemplateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTemplateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTemplateCategoryMutation, { data, loading, error }] = useUpdateTemplateCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTemplateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTemplateCategoryMutation, UpdateTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTemplateCategoryMutation, UpdateTemplateCategoryMutationVariables>(UpdateTemplateCategoryDocument, options);
      }
export type UpdateTemplateCategoryMutationHookResult = ReturnType<typeof useUpdateTemplateCategoryMutation>;
export type UpdateTemplateCategoryMutationResult = Apollo.MutationResult<UpdateTemplateCategoryMutation>;
export type UpdateTemplateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateTemplateCategoryMutation, UpdateTemplateCategoryMutationVariables>;
export const DeletedCategoryDocument = gql`
    query deletedCategory {
  deletedCategory {
    childCategories {
      childCategories {
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          childCategories {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        templates {
          background_url
          category {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          description
          id
          name
          order
          updated_at
        }
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    created_at
    deleted_at
    description
    id
    name
    order
    parentCategory {
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    specialType
    templates {
      background_url
      created_at
      description
      id
      name
      order
      updated_at
    }
    updated_at
  }
}
    `;

/**
 * __useDeletedCategoryQuery__
 *
 * To run a query within a React component, call `useDeletedCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDeletedCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDeletedCategoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useDeletedCategoryQuery(baseOptions?: Apollo.QueryHookOptions<DeletedCategoryQuery, DeletedCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DeletedCategoryQuery, DeletedCategoryQueryVariables>(DeletedCategoryDocument, options);
      }
export function useDeletedCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DeletedCategoryQuery, DeletedCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DeletedCategoryQuery, DeletedCategoryQueryVariables>(DeletedCategoryDocument, options);
        }
export function useDeletedCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DeletedCategoryQuery, DeletedCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DeletedCategoryQuery, DeletedCategoryQueryVariables>(DeletedCategoryDocument, options);
        }
export type DeletedCategoryQueryHookResult = ReturnType<typeof useDeletedCategoryQuery>;
export type DeletedCategoryLazyQueryHookResult = ReturnType<typeof useDeletedCategoryLazyQuery>;
export type DeletedCategorySuspenseQueryHookResult = ReturnType<typeof useDeletedCategorySuspenseQuery>;
export type DeletedCategoryQueryResult = Apollo.QueryResult<DeletedCategoryQuery, DeletedCategoryQueryVariables>;
export const MainCategoryDocument = gql`
    query mainCategory {
  mainCategory {
    childCategories {
      childCategories {
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          childCategories {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        templates {
          background_url
          category {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          description
          id
          name
          order
          updated_at
        }
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    created_at
    deleted_at
    description
    id
    name
    order
    parentCategory {
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    specialType
    templates {
      background_url
      created_at
      description
      id
      name
      order
      updated_at
    }
    updated_at
  }
}
    `;

/**
 * __useMainCategoryQuery__
 *
 * To run a query within a React component, call `useMainCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMainCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMainCategoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useMainCategoryQuery(baseOptions?: Apollo.QueryHookOptions<MainCategoryQuery, MainCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MainCategoryQuery, MainCategoryQueryVariables>(MainCategoryDocument, options);
      }
export function useMainCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MainCategoryQuery, MainCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MainCategoryQuery, MainCategoryQueryVariables>(MainCategoryDocument, options);
        }
export function useMainCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MainCategoryQuery, MainCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MainCategoryQuery, MainCategoryQueryVariables>(MainCategoryDocument, options);
        }
export type MainCategoryQueryHookResult = ReturnType<typeof useMainCategoryQuery>;
export type MainCategoryLazyQueryHookResult = ReturnType<typeof useMainCategoryLazyQuery>;
export type MainCategorySuspenseQueryHookResult = ReturnType<typeof useMainCategorySuspenseQuery>;
export type MainCategoryQueryResult = Apollo.QueryResult<MainCategoryQuery, MainCategoryQueryVariables>;
export const MeDocument = gql`
    query me {
  me {
    created_at
    email
    email_verified_at
    id
    isAdmin
    name
    updated_at
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const TemplateCategoriesDocument = gql`
    query templateCategories($first: Int!, $page: Int) {
  templateCategories(first: $first, page: $page) {
    data {
      childCategories {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        specialType
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      parentCategory {
        childCategories {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          updated_at
        }
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          created_at
          deleted_at
          description
          id
          name
          order
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        updated_at
      }
      specialType
      templates {
        background_url
        category {
          childCategories {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        created_at
        description
        id
        name
        order
        updated_at
      }
      updated_at
    }
    paginatorInfo {
      count
      currentPage
      firstItem
      hasMorePages
      lastItem
      lastPage
      perPage
      total
    }
  }
}
    `;

/**
 * __useTemplateCategoriesQuery__
 *
 * To run a query within a React component, call `useTemplateCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplateCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplateCategoriesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useTemplateCategoriesQuery(baseOptions: Apollo.QueryHookOptions<TemplateCategoriesQuery, TemplateCategoriesQueryVariables> & ({ variables: TemplateCategoriesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>(TemplateCategoriesDocument, options);
      }
export function useTemplateCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>(TemplateCategoriesDocument, options);
        }
export function useTemplateCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>(TemplateCategoriesDocument, options);
        }
export type TemplateCategoriesQueryHookResult = ReturnType<typeof useTemplateCategoriesQuery>;
export type TemplateCategoriesLazyQueryHookResult = ReturnType<typeof useTemplateCategoriesLazyQuery>;
export type TemplateCategoriesSuspenseQueryHookResult = ReturnType<typeof useTemplateCategoriesSuspenseQuery>;
export type TemplateCategoriesQueryResult = Apollo.QueryResult<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>;
export const TemplateCategoryDocument = gql`
    query templateCategory($id: ID!) {
  templateCategory(id: $id) {
    childCategories {
      childCategories {
        created_at
        deleted_at
        description
        id
        name
        order
        parentCategory {
          childCategories {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          deleted_at
          description
          id
          name
          order
          parentCategory {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          specialType
          templates {
            background_url
            created_at
            description
            id
            name
            order
            updated_at
          }
          updated_at
        }
        specialType
        templates {
          background_url
          category {
            created_at
            deleted_at
            description
            id
            name
            order
            specialType
            updated_at
          }
          created_at
          description
          id
          name
          order
          updated_at
        }
        updated_at
      }
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    created_at
    deleted_at
    description
    id
    name
    order
    parentCategory {
      created_at
      deleted_at
      description
      id
      name
      order
      specialType
      updated_at
    }
    specialType
    templates {
      background_url
      created_at
      description
      id
      name
      order
      updated_at
    }
    updated_at
  }
}
    `;

/**
 * __useTemplateCategoryQuery__
 *
 * To run a query within a React component, call `useTemplateCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplateCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplateCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTemplateCategoryQuery(baseOptions: Apollo.QueryHookOptions<TemplateCategoryQuery, TemplateCategoryQueryVariables> & ({ variables: TemplateCategoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplateCategoryQuery, TemplateCategoryQueryVariables>(TemplateCategoryDocument, options);
      }
export function useTemplateCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplateCategoryQuery, TemplateCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplateCategoryQuery, TemplateCategoryQueryVariables>(TemplateCategoryDocument, options);
        }
export function useTemplateCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TemplateCategoryQuery, TemplateCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TemplateCategoryQuery, TemplateCategoryQueryVariables>(TemplateCategoryDocument, options);
        }
export type TemplateCategoryQueryHookResult = ReturnType<typeof useTemplateCategoryQuery>;
export type TemplateCategoryLazyQueryHookResult = ReturnType<typeof useTemplateCategoryLazyQuery>;
export type TemplateCategorySuspenseQueryHookResult = ReturnType<typeof useTemplateCategorySuspenseQuery>;
export type TemplateCategoryQueryResult = Apollo.QueryResult<TemplateCategoryQuery, TemplateCategoryQueryVariables>;
export const UserDocument = gql`
    query user($email: String, $id: ID) {
  user(email: $email, id: $id) {
    created_at
    email
    email_verified_at
    id
    isAdmin
    name
    updated_at
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      email: // value for 'email'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export function useUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query users($first: Int!, $name: String, $page: Int) {
  users(first: $first, name: $name, page: $page) {
    data {
      created_at
      email
      email_verified_at
      id
      isAdmin
      name
      updated_at
    }
    paginatorInfo {
      count
      currentPage
      firstItem
      hasMorePages
      lastItem
      lastPage
      perPage
      total
    }
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      first: // value for 'first'
 *      name: // value for 'name'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useUsersQuery(baseOptions: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables> & ({ variables: UsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export function useUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
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