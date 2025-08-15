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
  LocalDateTime: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type CategorySpecialType =
  | 'Main'
  | 'Suspension';

export type CreateTemplateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateTemplateInput = {
  categoryId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTemplate: Template;
  createTemplateCategory: TemplateCategory;
  deleteTemplate?: Maybe<Template>;
  /** Login user with email and password */
  login?: Maybe<AuthPayload>;
  /** Logout current user */
  logout: LogoutResponse;
  /** Register a new user */
  register?: Maybe<AuthPayload>;
  reorderTemplate?: Maybe<Template>;
  suspendTemplate?: Maybe<Template>;
  unsuspendTemplate?: Maybe<Template>;
  updateTemplate?: Maybe<Template>;
};


export type MutationCreateTemplateArgs = {
  input: CreateTemplateInput;
};


export type MutationCreateTemplateCategoryArgs = {
  input: CreateTemplateCategoryInput;
};


export type MutationDeleteTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationReorderTemplateArgs = {
  input: ReorderTemplateInput;
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

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String']['output'];
  /** Check if user is authenticated */
  isAuthenticated: Scalars['Boolean']['output'];
  /** Get current authenticated user */
  me?: Maybe<User>;
  /** Get user by ID (authenticated users only) */
  user?: Maybe<User>;
  /** Get all users (admin only) */
  users?: Maybe<Array<User>>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ReorderTemplateInput = {
  id: Scalars['Int']['input'];
  order: Scalars['Int']['input'];
};

export type Template = {
  __typename?: 'Template';
  category: TemplateCategory;
  createdAt: Scalars['LocalDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  preSuspensionCategory?: Maybe<TemplateCategory>;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type TemplateCategory = {
  __typename?: 'TemplateCategory';
  categorySpecialType?: Maybe<CategorySpecialType>;
  childCategories: Array<TemplateCategory>;
  createdAt: Scalars['LocalDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  parentCategory?: Maybe<TemplateCategory>;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type UpdateTemplateInput = {
  categoryId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['LocalDateTime']['output'];
  email: Scalars['String']['output'];
  emailVerifiedAt?: Maybe<Scalars['LocalDateTime']['output']>;
  id: Scalars['Int']['output'];
  isAdmin: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  rememberToken?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type PlaceholderQueryVariables = Exact<{ [key: string]: never; }>;


export type PlaceholderQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, name: string, email: string } | null };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', createdAt: any, email: string, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any } } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResponse', message: string } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', createdAt: any, email: string, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any } } | null };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };

export type IsAuthenticatedQueryVariables = Exact<{ [key: string]: never; }>;


export type IsAuthenticatedQuery = { __typename?: 'Query', isAuthenticated: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', createdAt: any, email: string, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any } | null };

export type UserQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', createdAt: any, email: string, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any } | null };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'User', createdAt: any, email: string, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any }> | null };

export type CreateTemplateMutationVariables = Exact<{
  input: CreateTemplateInput;
}>;


export type CreateTemplateMutation = { __typename?: 'Mutation', createTemplate: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null }> }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null }> }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } | null };

export type ReorderTemplateMutationVariables = Exact<{
  input: ReorderTemplateInput;
}>;


export type ReorderTemplateMutation = { __typename?: 'Mutation', reorderTemplate?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null }> }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } | null };

export type SuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type SuspendTemplateMutation = { __typename?: 'Mutation', suspendTemplate?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null }> }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } | null };

export type UnsuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type UnsuspendTemplateMutation = { __typename?: 'Mutation', unsuspendTemplate?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null }> }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } | null };

export type UpdateTemplateMutationVariables = Exact<{
  input: UpdateTemplateInput;
}>;


export type UpdateTemplateMutation = { __typename?: 'Mutation', updateTemplate?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null }> }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } | null };


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
export function refetchPlaceholderQuery(variables?: PlaceholderQueryVariables) {
      return { query: PlaceholderDocument, variables: variables }
    }
export const LoginDocument = gql`
    mutation login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      createdAt
      email
      emailVerifiedAt
      id
      isAdmin
      name
      password
      rememberToken
      updatedAt
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
 *      input: // value for 'input'
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
export const RegisterDocument = gql`
    mutation register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      createdAt
      email
      emailVerifiedAt
      id
      isAdmin
      name
      password
      rememberToken
      updatedAt
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const HelloDocument = gql`
    query hello {
  hello
}
    `;

/**
 * __useHelloQuery__
 *
 * To run a query within a React component, call `useHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloQuery(baseOptions?: Apollo.QueryHookOptions<HelloQuery, HelloQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
      }
export function useHelloLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelloQuery, HelloQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
        }
export function useHelloSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HelloQuery, HelloQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
        }
export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloLazyQueryHookResult = ReturnType<typeof useHelloLazyQuery>;
export type HelloSuspenseQueryHookResult = ReturnType<typeof useHelloSuspenseQuery>;
export type HelloQueryResult = Apollo.QueryResult<HelloQuery, HelloQueryVariables>;
export function refetchHelloQuery(variables?: HelloQueryVariables) {
      return { query: HelloDocument, variables: variables }
    }
export const IsAuthenticatedDocument = gql`
    query isAuthenticated {
  isAuthenticated
}
    `;

/**
 * __useIsAuthenticatedQuery__
 *
 * To run a query within a React component, call `useIsAuthenticatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsAuthenticatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsAuthenticatedQuery({
 *   variables: {
 *   },
 * });
 */
export function useIsAuthenticatedQuery(baseOptions?: Apollo.QueryHookOptions<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(IsAuthenticatedDocument, options);
      }
export function useIsAuthenticatedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(IsAuthenticatedDocument, options);
        }
export function useIsAuthenticatedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(IsAuthenticatedDocument, options);
        }
export type IsAuthenticatedQueryHookResult = ReturnType<typeof useIsAuthenticatedQuery>;
export type IsAuthenticatedLazyQueryHookResult = ReturnType<typeof useIsAuthenticatedLazyQuery>;
export type IsAuthenticatedSuspenseQueryHookResult = ReturnType<typeof useIsAuthenticatedSuspenseQuery>;
export type IsAuthenticatedQueryResult = Apollo.QueryResult<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>;
export function refetchIsAuthenticatedQuery(variables?: IsAuthenticatedQueryVariables) {
      return { query: IsAuthenticatedDocument, variables: variables }
    }
export const MeDocument = gql`
    query me {
  me {
    createdAt
    email
    emailVerifiedAt
    id
    isAdmin
    name
    password
    rememberToken
    updatedAt
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
export function refetchMeQuery(variables?: MeQueryVariables) {
      return { query: MeDocument, variables: variables }
    }
export const UserDocument = gql`
    query user($id: Int!) {
  user(id: $id) {
    createdAt
    email
    emailVerifiedAt
    id
    isAdmin
    name
    password
    rememberToken
    updatedAt
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables> & ({ variables: UserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
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
export function refetchUserQuery(variables: UserQueryVariables) {
      return { query: UserDocument, variables: variables }
    }
export const UsersDocument = gql`
    query users {
  users {
    createdAt
    email
    emailVerifiedAt
    id
    isAdmin
    name
    password
    rememberToken
    updatedAt
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
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
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
export function refetchUsersQuery(variables?: UsersQueryVariables) {
      return { query: UsersDocument, variables: variables }
    }
export const CreateTemplateDocument = gql`
    mutation createTemplate($input: CreateTemplateInput!) {
  createTemplate(input: $input) {
    category {
      categorySpecialType
      childCategories {
        categorySpecialType
        childCategories {
          categorySpecialType
          createdAt
          description
          id
          name
          order
          parentCategory {
            categorySpecialType
            childCategories {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            createdAt
            description
            id
            name
            order
            parentCategory {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            updatedAt
          }
          updatedAt
        }
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    createdAt
    description
    id
    imageUrl
    name
    order
    preSuspensionCategory {
      categorySpecialType
      childCategories {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    updatedAt
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
export const DeleteTemplateDocument = gql`
    mutation deleteTemplate($id: Int!) {
  deleteTemplate(id: $id) {
    category {
      categorySpecialType
      childCategories {
        categorySpecialType
        childCategories {
          categorySpecialType
          createdAt
          description
          id
          name
          order
          parentCategory {
            categorySpecialType
            childCategories {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            createdAt
            description
            id
            name
            order
            parentCategory {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            updatedAt
          }
          updatedAt
        }
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    createdAt
    description
    id
    imageUrl
    name
    order
    preSuspensionCategory {
      categorySpecialType
      childCategories {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    updatedAt
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
export const ReorderTemplateDocument = gql`
    mutation reorderTemplate($input: ReorderTemplateInput!) {
  reorderTemplate(input: $input) {
    category {
      categorySpecialType
      childCategories {
        categorySpecialType
        childCategories {
          categorySpecialType
          createdAt
          description
          id
          name
          order
          parentCategory {
            categorySpecialType
            childCategories {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            createdAt
            description
            id
            name
            order
            parentCategory {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            updatedAt
          }
          updatedAt
        }
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    createdAt
    description
    id
    imageUrl
    name
    order
    preSuspensionCategory {
      categorySpecialType
      childCategories {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    updatedAt
  }
}
    `;
export type ReorderTemplateMutationFn = Apollo.MutationFunction<ReorderTemplateMutation, ReorderTemplateMutationVariables>;

/**
 * __useReorderTemplateMutation__
 *
 * To run a mutation, you first call `useReorderTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReorderTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reorderTemplateMutation, { data, loading, error }] = useReorderTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReorderTemplateMutation(baseOptions?: Apollo.MutationHookOptions<ReorderTemplateMutation, ReorderTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReorderTemplateMutation, ReorderTemplateMutationVariables>(ReorderTemplateDocument, options);
      }
export type ReorderTemplateMutationHookResult = ReturnType<typeof useReorderTemplateMutation>;
export type ReorderTemplateMutationResult = Apollo.MutationResult<ReorderTemplateMutation>;
export type ReorderTemplateMutationOptions = Apollo.BaseMutationOptions<ReorderTemplateMutation, ReorderTemplateMutationVariables>;
export const SuspendTemplateDocument = gql`
    mutation suspendTemplate($id: Int!) {
  suspendTemplate(id: $id) {
    category {
      categorySpecialType
      childCategories {
        categorySpecialType
        childCategories {
          categorySpecialType
          createdAt
          description
          id
          name
          order
          parentCategory {
            categorySpecialType
            childCategories {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            createdAt
            description
            id
            name
            order
            parentCategory {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            updatedAt
          }
          updatedAt
        }
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    createdAt
    description
    id
    imageUrl
    name
    order
    preSuspensionCategory {
      categorySpecialType
      childCategories {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    updatedAt
  }
}
    `;
export type SuspendTemplateMutationFn = Apollo.MutationFunction<SuspendTemplateMutation, SuspendTemplateMutationVariables>;

/**
 * __useSuspendTemplateMutation__
 *
 * To run a mutation, you first call `useSuspendTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSuspendTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [suspendTemplateMutation, { data, loading, error }] = useSuspendTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSuspendTemplateMutation(baseOptions?: Apollo.MutationHookOptions<SuspendTemplateMutation, SuspendTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SuspendTemplateMutation, SuspendTemplateMutationVariables>(SuspendTemplateDocument, options);
      }
export type SuspendTemplateMutationHookResult = ReturnType<typeof useSuspendTemplateMutation>;
export type SuspendTemplateMutationResult = Apollo.MutationResult<SuspendTemplateMutation>;
export type SuspendTemplateMutationOptions = Apollo.BaseMutationOptions<SuspendTemplateMutation, SuspendTemplateMutationVariables>;
export const UnsuspendTemplateDocument = gql`
    mutation unsuspendTemplate($id: Int!) {
  unsuspendTemplate(id: $id) {
    category {
      categorySpecialType
      childCategories {
        categorySpecialType
        childCategories {
          categorySpecialType
          createdAt
          description
          id
          name
          order
          parentCategory {
            categorySpecialType
            childCategories {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            createdAt
            description
            id
            name
            order
            parentCategory {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            updatedAt
          }
          updatedAt
        }
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    createdAt
    description
    id
    imageUrl
    name
    order
    preSuspensionCategory {
      categorySpecialType
      childCategories {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    updatedAt
  }
}
    `;
export type UnsuspendTemplateMutationFn = Apollo.MutationFunction<UnsuspendTemplateMutation, UnsuspendTemplateMutationVariables>;

/**
 * __useUnsuspendTemplateMutation__
 *
 * To run a mutation, you first call `useUnsuspendTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsuspendTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsuspendTemplateMutation, { data, loading, error }] = useUnsuspendTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnsuspendTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UnsuspendTemplateMutation, UnsuspendTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnsuspendTemplateMutation, UnsuspendTemplateMutationVariables>(UnsuspendTemplateDocument, options);
      }
export type UnsuspendTemplateMutationHookResult = ReturnType<typeof useUnsuspendTemplateMutation>;
export type UnsuspendTemplateMutationResult = Apollo.MutationResult<UnsuspendTemplateMutation>;
export type UnsuspendTemplateMutationOptions = Apollo.BaseMutationOptions<UnsuspendTemplateMutation, UnsuspendTemplateMutationVariables>;
export const UpdateTemplateDocument = gql`
    mutation updateTemplate($input: UpdateTemplateInput!) {
  updateTemplate(input: $input) {
    category {
      categorySpecialType
      childCategories {
        categorySpecialType
        childCategories {
          categorySpecialType
          createdAt
          description
          id
          name
          order
          parentCategory {
            categorySpecialType
            childCategories {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            createdAt
            description
            id
            name
            order
            parentCategory {
              categorySpecialType
              createdAt
              description
              id
              name
              order
              updatedAt
            }
            updatedAt
          }
          updatedAt
        }
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    createdAt
    description
    id
    imageUrl
    name
    order
    preSuspensionCategory {
      categorySpecialType
      childCategories {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      createdAt
      description
      id
      name
      order
      parentCategory {
        categorySpecialType
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    updatedAt
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