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
  Email: { input: any; output: any; }
  LocalDate: { input: any; output: any; }
  LocalDateTime: { input: any; output: any; }
  PhoneNumber: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type CategorySpecialType =
  | 'Main'
  | 'Suspension';

export type CreateStudentInput = {
  dateOfBirth?: InputMaybe<Scalars['LocalDate']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  gender?: InputMaybe<Gender>;
  name: Scalars['String']['input'];
  nationality?: InputMaybe<Nationality>;
  phoneNumber?: InputMaybe<Scalars['PhoneNumber']['input']>;
};

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

export type Gender =
  | 'Female'
  | 'Male'
  | 'Other';

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
  createStudent: Student;
  createTemplate: Template;
  createTemplateCategory: TemplateCategory;
  deleteStudent: Student;
  deleteTemplate?: Maybe<Template>;
  deleteTemplateCategory: TemplateCategory;
  /** Login user with email and password */
  login?: Maybe<AuthPayload>;
  /** Logout current user */
  logout: LogoutResponse;
  /** Register a new user */
  register?: Maybe<AuthPayload>;
  suspendTemplate?: Maybe<Template>;
  unsuspendTemplate?: Maybe<Template>;
  updateStudent: Student;
  updateTemplate?: Maybe<Template>;
  updateTemplateCategory: TemplateCategory;
};


export type MutationCreateStudentArgs = {
  input: CreateStudentInput;
};


export type MutationCreateTemplateArgs = {
  input: CreateTemplateInput;
};


export type MutationCreateTemplateCategoryArgs = {
  input: CreateTemplateCategoryInput;
};


export type MutationDeleteStudentArgs = {
  id: Scalars['Int']['input'];
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


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationSuspendTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUnsuspendTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateStudentArgs = {
  input: UpdateStudentInput;
};


export type MutationUpdateTemplateArgs = {
  input: UpdateTemplateInput;
};


export type MutationUpdateTemplateCategoryArgs = {
  input: UpdateTemplateCategoryInput;
};

export type Nationality =
  | 'AD'
  | 'AE'
  | 'AF'
  | 'AG'
  | 'AI'
  | 'AL'
  | 'AM'
  | 'AO'
  | 'AQ'
  | 'AR'
  | 'AS'
  | 'AT'
  | 'AU'
  | 'AW'
  | 'AX'
  | 'AZ'
  | 'BA'
  | 'BB'
  | 'BD'
  | 'BE'
  | 'BF'
  | 'BG'
  | 'BH'
  | 'BI'
  | 'BJ'
  | 'BL'
  | 'BM'
  | 'BN'
  | 'BO'
  | 'BR'
  | 'BS'
  | 'BT'
  | 'BV'
  | 'BW'
  | 'BY'
  | 'BZ'
  | 'CA'
  | 'CC'
  | 'CD'
  | 'CF'
  | 'CG'
  | 'CH'
  | 'CI'
  | 'CK'
  | 'CL'
  | 'CM'
  | 'CN'
  | 'CO'
  | 'CR'
  | 'CU'
  | 'CV'
  | 'CW'
  | 'CX'
  | 'CY'
  | 'CZ'
  | 'DE'
  | 'DJ'
  | 'DK'
  | 'DM'
  | 'DO'
  | 'DZ'
  | 'EC'
  | 'EE'
  | 'EG'
  | 'EH'
  | 'ER'
  | 'ES'
  | 'ET'
  | 'FI'
  | 'FJ'
  | 'FK'
  | 'FM'
  | 'FO'
  | 'FR'
  | 'GA'
  | 'GB'
  | 'GD'
  | 'GE'
  | 'GF'
  | 'GG'
  | 'GH'
  | 'GI'
  | 'GL'
  | 'GM'
  | 'GN'
  | 'GP'
  | 'GQ'
  | 'GR'
  | 'GS'
  | 'GT'
  | 'GU'
  | 'GW'
  | 'GY'
  | 'HK'
  | 'HM'
  | 'HN'
  | 'HR'
  | 'HT'
  | 'HU'
  | 'ID'
  | 'IE'
  | 'IM'
  | 'IN'
  | 'IO'
  | 'IQ'
  | 'IR'
  | 'IS'
  | 'IT'
  | 'JE'
  | 'JM'
  | 'JO'
  | 'JP'
  | 'KE'
  | 'KG'
  | 'KH'
  | 'KI'
  | 'KM'
  | 'KN'
  | 'KP'
  | 'KR'
  | 'KW'
  | 'KY'
  | 'KZ'
  | 'LA'
  | 'LB'
  | 'LC'
  | 'LI'
  | 'LK'
  | 'LR'
  | 'LS'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'LY'
  | 'MA'
  | 'MC'
  | 'MD'
  | 'ME'
  | 'MF'
  | 'MG'
  | 'MH'
  | 'MK'
  | 'ML'
  | 'MM'
  | 'MN'
  | 'MO'
  | 'MP'
  | 'MQ'
  | 'MR'
  | 'MS'
  | 'MT'
  | 'MU'
  | 'MV'
  | 'MW'
  | 'MX'
  | 'MY'
  | 'MZ'
  | 'NA'
  | 'NC'
  | 'NE'
  | 'NF'
  | 'NG'
  | 'NI'
  | 'NL'
  | 'NO'
  | 'NP'
  | 'NR'
  | 'NU'
  | 'NZ'
  | 'OM'
  | 'PA'
  | 'PE'
  | 'PF'
  | 'PG'
  | 'PH'
  | 'PK'
  | 'PL'
  | 'PM'
  | 'PN'
  | 'PR'
  | 'PS'
  | 'PT'
  | 'PW'
  | 'PY'
  | 'QA'
  | 'RE'
  | 'RO'
  | 'RS'
  | 'RU'
  | 'RW'
  | 'SA'
  | 'SB'
  | 'SC'
  | 'SD'
  | 'SE'
  | 'SG'
  | 'SH'
  | 'SI'
  | 'SJ'
  | 'SK'
  | 'SL'
  | 'SM'
  | 'SN'
  | 'SO'
  | 'SR'
  | 'SS'
  | 'ST'
  | 'SV'
  | 'SX'
  | 'SY'
  | 'SZ'
  | 'TC'
  | 'TD'
  | 'TF'
  | 'TG'
  | 'TH'
  | 'TJ'
  | 'TK'
  | 'TL'
  | 'TM'
  | 'TN'
  | 'TO'
  | 'TR'
  | 'TV'
  | 'TW'
  | 'TZ'
  | 'UA'
  | 'UG'
  | 'US'
  | 'UY'
  | 'UZ'
  | 'VA'
  | 'VC'
  | 'VE'
  | 'VG'
  | 'VI'
  | 'VN'
  | 'VU'
  | 'WF'
  | 'WS'
  | 'XK'
  | 'YE'
  | 'YT'
  | 'ZA'
  | 'ZM'
  | 'ZW';

export type PaginatedStudentResponse = {
  __typename?: 'PaginatedStudentResponse';
  data: Array<Student>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type PaginatedTemplatesResponse = {
  __typename?: 'PaginatedTemplatesResponse';
  data: Array<Template>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  count: Scalars['Int']['output'];
  currentPage: Scalars['Int']['output'];
  firstItem?: Maybe<Scalars['Int']['output']>;
  hasMorePages: Scalars['Boolean']['output'];
  lastItem?: Maybe<Scalars['Int']['output']>;
  lastPage?: Maybe<Scalars['Int']['output']>;
  perPage: Scalars['Int']['output'];
  total?: Maybe<Scalars['Int']['output']>;
};

export type PaginationType =
  /** Cursor-based pagination compatible with Relay specification */
  | 'CONNECTION'
  /** Offset-based pagination with total count */
  | 'PAGINATOR'
  /** Simple offset-based pagination without total count */
  | 'SIMPLE';

export type Query = {
  __typename?: 'Query';
  /** Check if user is authenticated */
  isAuthenticated: Scalars['Boolean']['output'];
  mainTemplateCategory?: Maybe<TemplateCategory>;
  /** Get current authenticated user */
  me?: Maybe<User>;
  paginatedStudents: PaginatedStudentResponse;
  paginatedTemplates: PaginatedTemplatesResponse;
  student?: Maybe<Student>;
  students: Array<Student>;
  suspensionTemplateCategory?: Maybe<TemplateCategory>;
  template?: Maybe<Template>;
  templateCategories: Array<TemplateCategory>;
  templateCategory?: Maybe<TemplateCategory>;
  templateConfig?: Maybe<TemplateConfig>;
  templates: Array<Template>;
  /** Get user by ID (authenticated users only) */
  user?: Maybe<User>;
  /** Get all users (admin only) */
  users?: Maybe<Array<User>>;
};


export type QueryPaginatedStudentsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPaginatedTemplatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStudentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplateCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type RegisterInput = {
  email: Scalars['Email']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Student = {
  __typename?: 'Student';
  createdAt: Scalars['LocalDateTime']['output'];
  dateOfBirth?: Maybe<Scalars['LocalDate']['output']>;
  email?: Maybe<Scalars['Email']['output']>;
  gender?: Maybe<Gender>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  nationality?: Maybe<Nationality>;
  phoneNumber?: Maybe<Scalars['PhoneNumber']['output']>;
  updatedAt: Scalars['LocalDateTime']['output'];
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
  templates: Array<Template>;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type TemplateConfig = {
  __typename?: 'TemplateConfig';
  allowedFileTypes: Array<Scalars['String']['output']>;
  maxBackgroundSize: Scalars['Int']['output'];
};

export type UpdateStudentInput = {
  dateOfBirth?: InputMaybe<Scalars['LocalDate']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  gender?: InputMaybe<Gender>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  nationality?: InputMaybe<Nationality>;
  phoneNumber?: InputMaybe<Scalars['PhoneNumber']['input']>;
};

export type UpdateTemplateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
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
  email: Scalars['Email']['output'];
  emailVerifiedAt?: Maybe<Scalars['LocalDateTime']['output']>;
  id: Scalars['Int']['output'];
  isAdmin: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  rememberToken?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type PlaceholderQueryVariables = Exact<{ [key: string]: never; }>;


export type PlaceholderQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, name: string, email: any } | null };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', createdAt: any, email: any, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any } } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResponse', message: string } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', createdAt: any, email: any, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any } } | null };

export type IsAuthenticatedQueryVariables = Exact<{ [key: string]: never; }>;


export type IsAuthenticatedQuery = { __typename?: 'Query', isAuthenticated: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', createdAt: any, email: any, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any } | null };

export type UserQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', createdAt: any, email: any, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any } | null };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'User', createdAt: any, email: any, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any }> | null };

export type CreateTemplateMutationVariables = Exact<{
  input: CreateTemplateInput;
}>;


export type CreateTemplateMutation = { __typename?: 'Mutation', createTemplate: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl?: string | null, order: number, createdAt: any, updatedAt: any, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate?: { __typename?: 'Template', id: number, name: string, category: { __typename?: 'TemplateCategory', id: number, name: string } } | null };

export type SuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type SuspendTemplateMutation = { __typename?: 'Mutation', suspendTemplate?: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl?: string | null, order: number, createdAt: any, updatedAt: any, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type UnsuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type UnsuspendTemplateMutation = { __typename?: 'Mutation', unsuspendTemplate?: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl?: string | null, order: number, createdAt: any, updatedAt: any, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type UpdateTemplateMutationVariables = Exact<{
  input: UpdateTemplateInput;
}>;


export type UpdateTemplateMutation = { __typename?: 'Mutation', updateTemplate?: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl?: string | null, order: number, createdAt: any, updatedAt: any, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type PaginatedTemplatesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PaginatedTemplatesQuery = { __typename?: 'Query', paginatedTemplates: { __typename?: 'PaginatedTemplatesResponse', data: Array<{ __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl?: string | null, order: number, createdAt: any, updatedAt: any, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null }>, paginationInfo?: { __typename?: 'PaginationInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage?: number | null, perPage: number, total?: number | null } | null } };

export type TemplateQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TemplateQuery = { __typename?: 'Query', template?: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl?: string | null, order: number, createdAt: any, updatedAt: any, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type TemplateConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplateConfigQuery = { __typename?: 'Query', templateConfig?: { __typename?: 'TemplateConfig', allowedFileTypes: Array<string>, maxBackgroundSize: number } | null };

export type TemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplatesQuery = { __typename?: 'Query', templates: Array<{ __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl?: string | null, order: number, createdAt: any, updatedAt: any, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null }> };

export type CreateTemplateCategoryMutationVariables = Exact<{
  input: CreateTemplateCategoryInput;
}>;


export type CreateTemplateCategoryMutation = { __typename?: 'Mutation', createTemplateCategory: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } };

export type DeleteTemplateCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateCategoryMutation = { __typename?: 'Mutation', deleteTemplateCategory: { __typename?: 'TemplateCategory', id: number, name: string, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } };

export type UpdateTemplateCategoryMutationVariables = Exact<{
  input: UpdateTemplateCategoryInput;
}>;


export type UpdateTemplateCategoryMutation = { __typename?: 'Mutation', updateTemplateCategory: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, order?: number | null, categorySpecialType?: CategorySpecialType | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } };

export type MainTemplateCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type MainTemplateCategoryQuery = { __typename?: 'Query', mainTemplateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null, childCategories: Array<{ __typename?: 'TemplateCategory', id: number, name: string }> } | null };

export type SuspensionTemplateCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type SuspensionTemplateCategoryQuery = { __typename?: 'Query', suspensionTemplateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null, childCategories: Array<{ __typename?: 'TemplateCategory', id: number, name: string }> } | null };

export type TemplateCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplateCategoriesQuery = { __typename?: 'Query', templateCategories: Array<{ __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null, templates: Array<{ __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl?: string | null, order: number, createdAt: any, updatedAt: any }> }> };

export type TemplateCategoryQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TemplateCategoryQuery = { __typename?: 'Query', templateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt: any, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null, childCategories: Array<{ __typename?: 'TemplateCategory', id: number, name: string }> } | null };


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
    id
    name
    description
    imageUrl
    category {
      id
      name
    }
    order
    preSuspensionCategory {
      id
      name
    }
    createdAt
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
    id
    name
    category {
      id
      name
    }
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
export const SuspendTemplateDocument = gql`
    mutation suspendTemplate($id: Int!) {
  suspendTemplate(id: $id) {
    id
    name
    description
    imageUrl
    category {
      id
      name
    }
    order
    preSuspensionCategory {
      id
      name
    }
    createdAt
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
    id
    name
    description
    imageUrl
    category {
      id
      name
    }
    order
    preSuspensionCategory {
      id
      name
    }
    createdAt
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
    id
    name
    description
    imageUrl
    category {
      id
      name
    }
    order
    preSuspensionCategory {
      id
      name
    }
    createdAt
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
export const PaginatedTemplatesDocument = gql`
    query paginatedTemplates($first: Int, $page: Int, $skip: Int) {
  paginatedTemplates(first: $first, page: $page, skip: $skip) {
    data {
      id
      name
      description
      imageUrl
      category {
        id
        name
      }
      order
      preSuspensionCategory {
        id
        name
      }
      createdAt
      updatedAt
    }
    paginationInfo {
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
 * __usePaginatedTemplatesQuery__
 *
 * To run a query within a React component, call `usePaginatedTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaginatedTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaginatedTemplatesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      page: // value for 'page'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function usePaginatedTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<PaginatedTemplatesQuery, PaginatedTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PaginatedTemplatesQuery, PaginatedTemplatesQueryVariables>(PaginatedTemplatesDocument, options);
      }
export function usePaginatedTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaginatedTemplatesQuery, PaginatedTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PaginatedTemplatesQuery, PaginatedTemplatesQueryVariables>(PaginatedTemplatesDocument, options);
        }
export function usePaginatedTemplatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PaginatedTemplatesQuery, PaginatedTemplatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PaginatedTemplatesQuery, PaginatedTemplatesQueryVariables>(PaginatedTemplatesDocument, options);
        }
export type PaginatedTemplatesQueryHookResult = ReturnType<typeof usePaginatedTemplatesQuery>;
export type PaginatedTemplatesLazyQueryHookResult = ReturnType<typeof usePaginatedTemplatesLazyQuery>;
export type PaginatedTemplatesSuspenseQueryHookResult = ReturnType<typeof usePaginatedTemplatesSuspenseQuery>;
export type PaginatedTemplatesQueryResult = Apollo.QueryResult<PaginatedTemplatesQuery, PaginatedTemplatesQueryVariables>;
export function refetchPaginatedTemplatesQuery(variables?: PaginatedTemplatesQueryVariables) {
      return { query: PaginatedTemplatesDocument, variables: variables }
    }
export const TemplateDocument = gql`
    query template($id: Int!) {
  template(id: $id) {
    id
    name
    description
    imageUrl
    category {
      id
      name
    }
    order
    preSuspensionCategory {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useTemplateQuery__
 *
 * To run a query within a React component, call `useTemplateQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplateQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTemplateQuery(baseOptions: Apollo.QueryHookOptions<TemplateQuery, TemplateQueryVariables> & ({ variables: TemplateQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplateQuery, TemplateQueryVariables>(TemplateDocument, options);
      }
export function useTemplateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplateQuery, TemplateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplateQuery, TemplateQueryVariables>(TemplateDocument, options);
        }
export function useTemplateSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TemplateQuery, TemplateQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TemplateQuery, TemplateQueryVariables>(TemplateDocument, options);
        }
export type TemplateQueryHookResult = ReturnType<typeof useTemplateQuery>;
export type TemplateLazyQueryHookResult = ReturnType<typeof useTemplateLazyQuery>;
export type TemplateSuspenseQueryHookResult = ReturnType<typeof useTemplateSuspenseQuery>;
export type TemplateQueryResult = Apollo.QueryResult<TemplateQuery, TemplateQueryVariables>;
export function refetchTemplateQuery(variables: TemplateQueryVariables) {
      return { query: TemplateDocument, variables: variables }
    }
export const TemplateConfigDocument = gql`
    query templateConfig {
  templateConfig {
    allowedFileTypes
    maxBackgroundSize
  }
}
    `;

/**
 * __useTemplateConfigQuery__
 *
 * To run a query within a React component, call `useTemplateConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplateConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplateConfigQuery({
 *   variables: {
 *   },
 * });
 */
export function useTemplateConfigQuery(baseOptions?: Apollo.QueryHookOptions<TemplateConfigQuery, TemplateConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplateConfigQuery, TemplateConfigQueryVariables>(TemplateConfigDocument, options);
      }
export function useTemplateConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplateConfigQuery, TemplateConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplateConfigQuery, TemplateConfigQueryVariables>(TemplateConfigDocument, options);
        }
export function useTemplateConfigSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TemplateConfigQuery, TemplateConfigQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TemplateConfigQuery, TemplateConfigQueryVariables>(TemplateConfigDocument, options);
        }
export type TemplateConfigQueryHookResult = ReturnType<typeof useTemplateConfigQuery>;
export type TemplateConfigLazyQueryHookResult = ReturnType<typeof useTemplateConfigLazyQuery>;
export type TemplateConfigSuspenseQueryHookResult = ReturnType<typeof useTemplateConfigSuspenseQuery>;
export type TemplateConfigQueryResult = Apollo.QueryResult<TemplateConfigQuery, TemplateConfigQueryVariables>;
export function refetchTemplateConfigQuery(variables?: TemplateConfigQueryVariables) {
      return { query: TemplateConfigDocument, variables: variables }
    }
export const TemplatesDocument = gql`
    query templates {
  templates {
    id
    name
    description
    imageUrl
    category {
      id
      name
    }
    order
    preSuspensionCategory {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useTemplatesQuery__
 *
 * To run a query within a React component, call `useTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTemplatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<TemplatesQuery, TemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TemplatesQuery, TemplatesQueryVariables>(TemplatesDocument, options);
      }
export function useTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TemplatesQuery, TemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TemplatesQuery, TemplatesQueryVariables>(TemplatesDocument, options);
        }
export function useTemplatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TemplatesQuery, TemplatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TemplatesQuery, TemplatesQueryVariables>(TemplatesDocument, options);
        }
export type TemplatesQueryHookResult = ReturnType<typeof useTemplatesQuery>;
export type TemplatesLazyQueryHookResult = ReturnType<typeof useTemplatesLazyQuery>;
export type TemplatesSuspenseQueryHookResult = ReturnType<typeof useTemplatesSuspenseQuery>;
export type TemplatesQueryResult = Apollo.QueryResult<TemplatesQuery, TemplatesQueryVariables>;
export function refetchTemplatesQuery(variables?: TemplatesQueryVariables) {
      return { query: TemplatesDocument, variables: variables }
    }
export const CreateTemplateCategoryDocument = gql`
    mutation createTemplateCategory($input: CreateTemplateCategoryInput!) {
  createTemplateCategory(input: $input) {
    id
    name
    description
    categorySpecialType
    parentCategory {
      id
    }
    order
    createdAt
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
export const DeleteTemplateCategoryDocument = gql`
    mutation deleteTemplateCategory($id: Int!) {
  deleteTemplateCategory(id: $id) {
    id
    name
    parentCategory {
      id
    }
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
export const UpdateTemplateCategoryDocument = gql`
    mutation updateTemplateCategory($input: UpdateTemplateCategoryInput!) {
  updateTemplateCategory(input: $input) {
    id
    name
    description
    order
    parentCategory {
      id
    }
    categorySpecialType
    createdAt
    updatedAt
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
export const MainTemplateCategoryDocument = gql`
    query mainTemplateCategory {
  mainTemplateCategory {
    id
    name
    description
    categorySpecialType
    parentCategory {
      id
      name
    }
    order
    childCategories {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMainTemplateCategoryQuery__
 *
 * To run a query within a React component, call `useMainTemplateCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMainTemplateCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMainTemplateCategoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useMainTemplateCategoryQuery(baseOptions?: Apollo.QueryHookOptions<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>(MainTemplateCategoryDocument, options);
      }
export function useMainTemplateCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>(MainTemplateCategoryDocument, options);
        }
export function useMainTemplateCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>(MainTemplateCategoryDocument, options);
        }
export type MainTemplateCategoryQueryHookResult = ReturnType<typeof useMainTemplateCategoryQuery>;
export type MainTemplateCategoryLazyQueryHookResult = ReturnType<typeof useMainTemplateCategoryLazyQuery>;
export type MainTemplateCategorySuspenseQueryHookResult = ReturnType<typeof useMainTemplateCategorySuspenseQuery>;
export type MainTemplateCategoryQueryResult = Apollo.QueryResult<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>;
export function refetchMainTemplateCategoryQuery(variables?: MainTemplateCategoryQueryVariables) {
      return { query: MainTemplateCategoryDocument, variables: variables }
    }
export const SuspensionTemplateCategoryDocument = gql`
    query suspensionTemplateCategory {
  suspensionTemplateCategory {
    id
    name
    description
    categorySpecialType
    parentCategory {
      id
      name
    }
    order
    childCategories {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useSuspensionTemplateCategoryQuery__
 *
 * To run a query within a React component, call `useSuspensionTemplateCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useSuspensionTemplateCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSuspensionTemplateCategoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useSuspensionTemplateCategoryQuery(baseOptions?: Apollo.QueryHookOptions<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>(SuspensionTemplateCategoryDocument, options);
      }
export function useSuspensionTemplateCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>(SuspensionTemplateCategoryDocument, options);
        }
export function useSuspensionTemplateCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>(SuspensionTemplateCategoryDocument, options);
        }
export type SuspensionTemplateCategoryQueryHookResult = ReturnType<typeof useSuspensionTemplateCategoryQuery>;
export type SuspensionTemplateCategoryLazyQueryHookResult = ReturnType<typeof useSuspensionTemplateCategoryLazyQuery>;
export type SuspensionTemplateCategorySuspenseQueryHookResult = ReturnType<typeof useSuspensionTemplateCategorySuspenseQuery>;
export type SuspensionTemplateCategoryQueryResult = Apollo.QueryResult<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>;
export function refetchSuspensionTemplateCategoryQuery(variables?: SuspensionTemplateCategoryQueryVariables) {
      return { query: SuspensionTemplateCategoryDocument, variables: variables }
    }
export const TemplateCategoriesDocument = gql`
    query templateCategories {
  templateCategories {
    id
    name
    description
    categorySpecialType
    parentCategory {
      id
    }
    order
    templates {
      id
      name
      description
      imageUrl
      order
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
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
 *   },
 * });
 */
export function useTemplateCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>) {
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
export function refetchTemplateCategoriesQuery(variables?: TemplateCategoriesQueryVariables) {
      return { query: TemplateCategoriesDocument, variables: variables }
    }
export const TemplateCategoryDocument = gql`
    query templateCategory($id: Int!) {
  templateCategory(id: $id) {
    id
    name
    description
    categorySpecialType
    parentCategory {
      id
      name
    }
    order
    childCategories {
      id
      name
    }
    createdAt
    updatedAt
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
export function refetchTemplateCategoryQuery(variables: TemplateCategoryQueryVariables) {
      return { query: TemplateCategoryDocument, variables: variables }
    }