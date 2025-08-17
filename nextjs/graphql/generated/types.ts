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

export type CountryCode =
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

export type CreateDateCreateTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  maxDate?: InputMaybe<Scalars['LocalDate']['input']>;
  minDate?: InputMaybe<Scalars['LocalDate']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['LocalDate']['input']>;
  required: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

export type CreateNumberCreateTemplateVariableInput = {
  decimalPlaces?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  maxValue?: InputMaybe<Scalars['Float']['input']>;
  minValue?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['Float']['input']>;
  required: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

export type CreateSelectCreateTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  multiple: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  options: Array<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

export type CreateStudentInput = {
  dateOfBirth?: InputMaybe<Scalars['LocalDate']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  gender?: InputMaybe<Gender>;
  name: Scalars['String']['input'];
  nationality?: InputMaybe<CountryCode>;
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

export type CreateTextCreateTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  maxLength?: InputMaybe<Scalars['Int']['input']>;
  minLength?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  pattern?: InputMaybe<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

export type DateTemplateVariable = {
  __typename?: 'DateTemplateVariable';
  createdAt: Scalars['LocalDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  maxDate?: Maybe<Scalars['LocalDate']['output']>;
  minDate?: Maybe<Scalars['LocalDate']['output']>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  previewValue?: Maybe<Scalars['LocalDate']['output']>;
  required: Scalars['Boolean']['output'];
  template?: Maybe<Template>;
  type: TemplateVariableType;
  updatedAt: Scalars['LocalDateTime']['output'];
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
  createDateTemplateVariable: DateTemplateVariable;
  createNumberTemplateVariable: NumberTemplateVariable;
  createSelectTemplateVariable: SelectTemplateVariable;
  createStudent: Student;
  createTemplate: Template;
  createTemplateCategory: TemplateCategory;
  createTextTemplateVariable: TextTemplateVariable;
  deleteStudent: Student;
  deleteTemplate?: Maybe<Template>;
  deleteTemplateCategory: TemplateCategory;
  deleteTemplateVariable: TemplateVariable;
  /** Login user with email and password */
  login?: Maybe<AuthPayload>;
  /** Logout current user */
  logout: LogoutResponse;
  /** Register a new user */
  register?: Maybe<AuthPayload>;
  suspendTemplate?: Maybe<Template>;
  unsuspendTemplate?: Maybe<Template>;
  updateDateTemplateVariable: DateTemplateVariable;
  updateNumberTemplateVariable: NumberTemplateVariable;
  updateSelectTemplateVariable: SelectTemplateVariable;
  updateStudent: Student;
  updateTemplate?: Maybe<Template>;
  updateTemplateCategory: TemplateCategory;
  updateTextTemplateVariable: TextTemplateVariable;
};


export type MutationCreateDateTemplateVariableArgs = {
  input: CreateDateCreateTemplateVariableInput;
};


export type MutationCreateNumberTemplateVariableArgs = {
  input: CreateNumberCreateTemplateVariableInput;
};


export type MutationCreateSelectTemplateVariableArgs = {
  input: CreateSelectCreateTemplateVariableInput;
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


export type MutationCreateTextTemplateVariableArgs = {
  input: CreateTextCreateTemplateVariableInput;
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


export type MutationDeleteTemplateVariableArgs = {
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


export type MutationUpdateDateTemplateVariableArgs = {
  input: UpdateDateCreateTemplateVariableInput;
};


export type MutationUpdateNumberTemplateVariableArgs = {
  input: UpdateNumberCreateTemplateVariableInput;
};


export type MutationUpdateSelectTemplateVariableArgs = {
  input: UpdateSelectCreateTemplateVariableInput;
};


export type MutationUpdateStudentArgs = {
  input: UpdateStudentOptionalFieldsInput;
};


export type MutationUpdateTemplateArgs = {
  input: UpdateTemplateInput;
};


export type MutationUpdateTemplateCategoryArgs = {
  input: UpdateTemplateCategoryInput;
};


export type MutationUpdateTextTemplateVariableArgs = {
  input: UpdateTextCreateTemplateVariableInput;
};

export type NumberTemplateVariable = {
  __typename?: 'NumberTemplateVariable';
  createdAt: Scalars['LocalDateTime']['output'];
  decimalPlaces?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  maxValue?: Maybe<Scalars['Float']['output']>;
  minValue?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  previewValue?: Maybe<Scalars['Float']['output']>;
  required: Scalars['Boolean']['output'];
  template?: Maybe<Template>;
  type: TemplateVariableType;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type OrderStudentsByClauseInput = {
  column: OrderStudentsByColumn;
  order: SortOrder;
};

export type OrderStudentsByColumn =
  | 'CREATED_AT'
  | 'DATE_OF_BIRTH'
  | 'EMAIL'
  | 'GENDER'
  | 'ID'
  | 'NAME'
  | 'UPDATED_AT';

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

export type PaginationArgsInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  defaultCount?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  maxCount?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  count: Scalars['Int']['output'];
  currentPage: Scalars['Int']['output'];
  firstItem?: Maybe<Scalars['Int']['output']>;
  hasMorePages: Scalars['Boolean']['output'];
  lastItem?: Maybe<Scalars['Int']['output']>;
  lastPage: Scalars['Int']['output'];
  perPage: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Check if user is authenticated */
  isAuthenticated: Scalars['Boolean']['output'];
  mainTemplateCategory?: Maybe<TemplateCategory>;
  /** Get current authenticated user */
  me?: Maybe<User>;
  student?: Maybe<Student>;
  students: PaginatedStudentResponse;
  suspensionTemplateCategory?: Maybe<TemplateCategory>;
  template?: Maybe<Template>;
  templateCategories: Array<TemplateCategory>;
  templateCategory?: Maybe<TemplateCategory>;
  templateConfig?: Maybe<TemplateConfig>;
  templates: PaginatedTemplatesResponse;
  /** Get user by ID (authenticated users only) */
  user?: Maybe<User>;
  /** Get all users (admin only) */
  users?: Maybe<Array<User>>;
};


export type QueryStudentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryStudentsArgs = {
  filterArgs?: InputMaybe<StudentFilterArgsInput>;
  orderBy?: InputMaybe<Array<OrderStudentsByClauseInput>>;
  paginationArgs?: InputMaybe<PaginationArgsInput>;
};


export type QueryTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplateCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplatesArgs = {
  paginationArgs?: InputMaybe<PaginationArgsInput>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type RegisterInput = {
  email: Scalars['Email']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SelectTemplateVariable = {
  __typename?: 'SelectTemplateVariable';
  createdAt: Scalars['LocalDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  multiple?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  options?: Maybe<Array<Scalars['String']['output']>>;
  order: Scalars['Int']['output'];
  previewValue?: Maybe<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  template?: Maybe<Template>;
  type: TemplateVariableType;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type SortOrder =
  | 'ASC'
  | 'DESC';

export type Student = {
  __typename?: 'Student';
  createdAt: Scalars['LocalDateTime']['output'];
  dateOfBirth?: Maybe<Scalars['LocalDate']['output']>;
  email?: Maybe<Scalars['Email']['output']>;
  gender?: Maybe<Gender>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  nationality?: Maybe<CountryCode>;
  phoneNumber?: Maybe<Scalars['PhoneNumber']['output']>;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type StudentFilterArgsInput = {
  birthDate?: InputMaybe<Scalars['LocalDateTime']['input']>;
  birthDateAfter?: InputMaybe<Scalars['LocalDateTime']['input']>;
  birthDateBefore?: InputMaybe<Scalars['LocalDateTime']['input']>;
  birthDateFrom?: InputMaybe<Scalars['LocalDateTime']['input']>;
  birthDateIsEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  birthDateIsNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  birthDateNot?: InputMaybe<Scalars['LocalDateTime']['input']>;
  birthDateOnOrAfter?: InputMaybe<Scalars['LocalDateTime']['input']>;
  birthDateOnOrBefore?: InputMaybe<Scalars['LocalDateTime']['input']>;
  birthDateTo?: InputMaybe<Scalars['LocalDateTime']['input']>;
  createdAt?: InputMaybe<Scalars['LocalDateTime']['input']>;
  createdAtAfter?: InputMaybe<Scalars['LocalDateTime']['input']>;
  createdAtBefore?: InputMaybe<Scalars['LocalDateTime']['input']>;
  createdAtFrom?: InputMaybe<Scalars['LocalDateTime']['input']>;
  createdAtIsEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtIsNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtNot?: InputMaybe<Scalars['LocalDateTime']['input']>;
  createdAtOnOrAfter?: InputMaybe<Scalars['LocalDateTime']['input']>;
  createdAtOnOrBefore?: InputMaybe<Scalars['LocalDateTime']['input']>;
  createdAtTo?: InputMaybe<Scalars['LocalDateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emailEndsWith?: InputMaybe<Scalars['String']['input']>;
  emailEquals?: InputMaybe<Scalars['Email']['input']>;
  emailIsEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  emailIsNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  emailNotContains?: InputMaybe<Scalars['String']['input']>;
  emailNotEquals?: InputMaybe<Scalars['String']['input']>;
  emailStartsWith?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Gender>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameEndsWith?: InputMaybe<Scalars['String']['input']>;
  nameEquals?: InputMaybe<Scalars['String']['input']>;
  nameIsEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  nameIsNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  nameNotContains?: InputMaybe<Scalars['String']['input']>;
  nameNotEquals?: InputMaybe<Scalars['String']['input']>;
  nameStartsWith?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<CountryCode>;
  phoneNumber?: InputMaybe<Scalars['PhoneNumber']['input']>;
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

export type TemplateVariable = {
  createdAt: Scalars['LocalDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  template?: Maybe<Template>;
  type: TemplateVariableType;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type TemplateVariableType =
  | 'DATE'
  | 'NUMBER'
  | 'SELECT'
  | 'TEXT';

export type TextTemplateVariable = {
  __typename?: 'TextTemplateVariable';
  createdAt: Scalars['LocalDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  maxLength?: Maybe<Scalars['Int']['output']>;
  minLength?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  pattern?: Maybe<Scalars['String']['output']>;
  previewValue?: Maybe<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  template?: Maybe<Template>;
  type: TemplateVariableType;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type UpdateDateCreateTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  maxDate?: InputMaybe<Scalars['LocalDate']['input']>;
  minDate?: InputMaybe<Scalars['LocalDate']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['LocalDate']['input']>;
  required: Scalars['Boolean']['input'];
};

export type UpdateNumberCreateTemplateVariableInput = {
  decimalPlaces?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  maxValue?: InputMaybe<Scalars['Float']['input']>;
  minValue?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['Float']['input']>;
  required: Scalars['Boolean']['input'];
};

export type UpdateSelectCreateTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  multiple: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  options: Array<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required: Scalars['Boolean']['input'];
};

export type UpdateStudentOptionalFieldsInput = {
  dateOfBirth?: InputMaybe<Scalars['LocalDate']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  gender?: InputMaybe<Gender>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<CountryCode>;
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

export type UpdateTextCreateTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  maxLength?: InputMaybe<Scalars['Int']['input']>;
  minLength?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  pattern?: InputMaybe<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required: Scalars['Boolean']['input'];
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

export type CreateStudentMutationVariables = Exact<{
  input: CreateStudentInput;
}>;


export type CreateStudentMutation = { __typename?: 'Mutation', createStudent: { __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, email?: any | null, phoneNumber?: any | null, createdAt: any, updatedAt: any } };

export type DeleteStudentMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteStudentMutation = { __typename?: 'Mutation', deleteStudent: { __typename?: 'Student', id: number, name: string, createdAt: any, updatedAt: any } };

export type UpdateStudentMutationVariables = Exact<{
  input: UpdateStudentOptionalFieldsInput;
}>;


export type UpdateStudentMutation = { __typename?: 'Mutation', updateStudent: { __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, email?: any | null, phoneNumber?: any | null, createdAt: any, updatedAt: any } };

export type StudentQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type StudentQuery = { __typename?: 'Query', student?: { __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, email?: any | null, phoneNumber?: any | null, createdAt: any, updatedAt: any } | null };

export type StudentsQueryVariables = Exact<{
  orderBy?: InputMaybe<Array<OrderStudentsByClauseInput> | OrderStudentsByClauseInput>;
  paginationArgs?: InputMaybe<PaginationArgsInput>;
  filterArgs?: InputMaybe<StudentFilterArgsInput>;
}>;


export type StudentsQuery = { __typename?: 'Query', students: { __typename?: 'PaginatedStudentResponse', data: Array<{ __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, email?: any | null, phoneNumber?: any | null, createdAt: any, updatedAt: any }>, paginationInfo?: { __typename?: 'PaginationInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } | null } };

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

export type TemplateQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TemplateQuery = { __typename?: 'Query', template?: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl?: string | null, order: number, createdAt: any, updatedAt: any, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type TemplateConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplateConfigQuery = { __typename?: 'Query', templateConfig?: { __typename?: 'TemplateConfig', allowedFileTypes: Array<string>, maxBackgroundSize: number } | null };

export type TemplatesQueryVariables = Exact<{
  paginationArgs?: InputMaybe<PaginationArgsInput>;
}>;


export type TemplatesQuery = { __typename?: 'Query', templates: { __typename?: 'PaginatedTemplatesResponse', data: Array<{ __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl?: string | null, order: number, createdAt: any, updatedAt: any, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null }>, paginationInfo?: { __typename?: 'PaginationInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } | null } };

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

export type CreateDateTemplateVariableMutationVariables = Exact<{
  input: CreateDateCreateTemplateVariableInput;
}>;


export type CreateDateTemplateVariableMutation = { __typename?: 'Mutation', createDateTemplateVariable: { __typename?: 'DateTemplateVariable', createdAt: any, description?: string | null, format?: string | null, id: number, maxDate?: any | null, minDate?: any | null, name: string, order: number, previewValue?: any | null, required: boolean, type: TemplateVariableType, updatedAt: any, template?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } | null }> } | null } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } }> }> } | null }> }> }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } };

export type CreateNumberTemplateVariableMutationVariables = Exact<{
  input: CreateNumberCreateTemplateVariableInput;
}>;


export type CreateNumberTemplateVariableMutation = { __typename?: 'Mutation', createNumberTemplateVariable: { __typename?: 'NumberTemplateVariable', createdAt: any, decimalPlaces?: number | null, description?: string | null, id: number, maxValue?: number | null, minValue?: number | null, name: string, order: number, previewValue?: number | null, required: boolean, type: TemplateVariableType, updatedAt: any, template?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } | null }> } | null } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } }> }> } | null }> }> }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } };

export type CreateSelectTemplateVariableMutationVariables = Exact<{
  input: CreateSelectCreateTemplateVariableInput;
}>;


export type CreateSelectTemplateVariableMutation = { __typename?: 'Mutation', createSelectTemplateVariable: { __typename?: 'SelectTemplateVariable', createdAt: any, description?: string | null, id: number, multiple?: boolean | null, name: string, options?: Array<string> | null, order: number, previewValue?: string | null, required: boolean, type: TemplateVariableType, updatedAt: any, template?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } | null }> } | null } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } }> }> } | null }> }> }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } };

export type CreateTextTemplateVariableMutationVariables = Exact<{
  input: CreateTextCreateTemplateVariableInput;
}>;


export type CreateTextTemplateVariableMutation = { __typename?: 'Mutation', createTextTemplateVariable: { __typename?: 'TextTemplateVariable', createdAt: any, description?: string | null, id: number, maxLength?: number | null, minLength?: number | null, name: string, order: number, pattern?: string | null, previewValue?: string | null, required: boolean, type: TemplateVariableType, updatedAt: any, template?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } | null }> } | null } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } }> }> } | null }> }> }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } };

export type DeleteTemplateVariableMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateVariableMutation = { __typename?: 'Mutation', deleteTemplateVariable: never };

export type UpdateDateTemplateVariableMutationVariables = Exact<{
  input: UpdateDateCreateTemplateVariableInput;
}>;


export type UpdateDateTemplateVariableMutation = { __typename?: 'Mutation', updateDateTemplateVariable: { __typename?: 'DateTemplateVariable', createdAt: any, description?: string | null, format?: string | null, id: number, maxDate?: any | null, minDate?: any | null, name: string, order: number, previewValue?: any | null, required: boolean, type: TemplateVariableType, updatedAt: any, template?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } | null }> } | null } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } }> }> } | null }> }> }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } };

export type UpdateNumberTemplateVariableMutationVariables = Exact<{
  input: UpdateNumberCreateTemplateVariableInput;
}>;


export type UpdateNumberTemplateVariableMutation = { __typename?: 'Mutation', updateNumberTemplateVariable: { __typename?: 'NumberTemplateVariable', createdAt: any, decimalPlaces?: number | null, description?: string | null, id: number, maxValue?: number | null, minValue?: number | null, name: string, order: number, previewValue?: number | null, required: boolean, type: TemplateVariableType, updatedAt: any, template?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } | null }> } | null } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } }> }> } | null }> }> }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } };

export type UpdateSelectTemplateVariableMutationVariables = Exact<{
  input: UpdateSelectCreateTemplateVariableInput;
}>;


export type UpdateSelectTemplateVariableMutation = { __typename?: 'Mutation', updateSelectTemplateVariable: { __typename?: 'SelectTemplateVariable', createdAt: any, description?: string | null, id: number, multiple?: boolean | null, name: string, options?: Array<string> | null, order: number, previewValue?: string | null, required: boolean, type: TemplateVariableType, updatedAt: any, template?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } | null }> } | null } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } }> }> } | null }> }> }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } };

export type UpdateTextTemplateVariableMutationVariables = Exact<{
  input: UpdateTextCreateTemplateVariableInput;
}>;


export type UpdateTextTemplateVariableMutation = { __typename?: 'Mutation', updateTextTemplateVariable: { __typename?: 'TextTemplateVariable', createdAt: any, description?: string | null, id: number, maxLength?: number | null, minLength?: number | null, name: string, order: number, pattern?: string | null, previewValue?: string | null, required: boolean, type: TemplateVariableType, updatedAt: any, template?: { __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, category: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any, childCategories: Array<{ __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any }>, parentCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } | null }> } | null } | null, templates: Array<{ __typename?: 'Template', createdAt: any, description?: string | null, id: number, imageUrl?: string | null, name: string, order: number, updatedAt: any }> } }> }> } | null }> }> }, preSuspensionCategory?: { __typename?: 'TemplateCategory', categorySpecialType?: CategorySpecialType | null, createdAt: any, description?: string | null, id: number, name: string, order?: number | null, updatedAt: any } | null } | null } };


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
export const CreateStudentDocument = gql`
    mutation createStudent($input: CreateStudentInput!) {
  createStudent(input: $input) {
    id
    name
    gender
    nationality
    dateOfBirth
    email
    phoneNumber
    createdAt
    updatedAt
  }
}
    `;
export type CreateStudentMutationFn = Apollo.MutationFunction<CreateStudentMutation, CreateStudentMutationVariables>;

/**
 * __useCreateStudentMutation__
 *
 * To run a mutation, you first call `useCreateStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStudentMutation, { data, loading, error }] = useCreateStudentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateStudentMutation(baseOptions?: Apollo.MutationHookOptions<CreateStudentMutation, CreateStudentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStudentMutation, CreateStudentMutationVariables>(CreateStudentDocument, options);
      }
export type CreateStudentMutationHookResult = ReturnType<typeof useCreateStudentMutation>;
export type CreateStudentMutationResult = Apollo.MutationResult<CreateStudentMutation>;
export type CreateStudentMutationOptions = Apollo.BaseMutationOptions<CreateStudentMutation, CreateStudentMutationVariables>;
export const DeleteStudentDocument = gql`
    mutation deleteStudent($id: Int!) {
  deleteStudent(id: $id) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;
export type DeleteStudentMutationFn = Apollo.MutationFunction<DeleteStudentMutation, DeleteStudentMutationVariables>;

/**
 * __useDeleteStudentMutation__
 *
 * To run a mutation, you first call `useDeleteStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStudentMutation, { data, loading, error }] = useDeleteStudentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteStudentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStudentMutation, DeleteStudentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteStudentMutation, DeleteStudentMutationVariables>(DeleteStudentDocument, options);
      }
export type DeleteStudentMutationHookResult = ReturnType<typeof useDeleteStudentMutation>;
export type DeleteStudentMutationResult = Apollo.MutationResult<DeleteStudentMutation>;
export type DeleteStudentMutationOptions = Apollo.BaseMutationOptions<DeleteStudentMutation, DeleteStudentMutationVariables>;
export const UpdateStudentDocument = gql`
    mutation updateStudent($input: UpdateStudentOptionalFieldsInput!) {
  updateStudent(input: $input) {
    id
    name
    gender
    nationality
    dateOfBirth
    email
    phoneNumber
    createdAt
    updatedAt
  }
}
    `;
export type UpdateStudentMutationFn = Apollo.MutationFunction<UpdateStudentMutation, UpdateStudentMutationVariables>;

/**
 * __useUpdateStudentMutation__
 *
 * To run a mutation, you first call `useUpdateStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStudentMutation, { data, loading, error }] = useUpdateStudentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateStudentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStudentMutation, UpdateStudentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStudentMutation, UpdateStudentMutationVariables>(UpdateStudentDocument, options);
      }
export type UpdateStudentMutationHookResult = ReturnType<typeof useUpdateStudentMutation>;
export type UpdateStudentMutationResult = Apollo.MutationResult<UpdateStudentMutation>;
export type UpdateStudentMutationOptions = Apollo.BaseMutationOptions<UpdateStudentMutation, UpdateStudentMutationVariables>;
export const StudentDocument = gql`
    query student($id: Int!) {
  student(id: $id) {
    id
    name
    gender
    nationality
    dateOfBirth
    email
    phoneNumber
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useStudentQuery__
 *
 * To run a query within a React component, call `useStudentQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStudentQuery(baseOptions: Apollo.QueryHookOptions<StudentQuery, StudentQueryVariables> & ({ variables: StudentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudentQuery, StudentQueryVariables>(StudentDocument, options);
      }
export function useStudentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentQuery, StudentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudentQuery, StudentQueryVariables>(StudentDocument, options);
        }
export function useStudentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudentQuery, StudentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StudentQuery, StudentQueryVariables>(StudentDocument, options);
        }
export type StudentQueryHookResult = ReturnType<typeof useStudentQuery>;
export type StudentLazyQueryHookResult = ReturnType<typeof useStudentLazyQuery>;
export type StudentSuspenseQueryHookResult = ReturnType<typeof useStudentSuspenseQuery>;
export type StudentQueryResult = Apollo.QueryResult<StudentQuery, StudentQueryVariables>;
export function refetchStudentQuery(variables: StudentQueryVariables) {
      return { query: StudentDocument, variables: variables }
    }
export const StudentsDocument = gql`
    query students($orderBy: [OrderStudentsByClauseInput!], $paginationArgs: PaginationArgsInput, $filterArgs: StudentFilterArgsInput) {
  students(
    orderBy: $orderBy
    paginationArgs: $paginationArgs
    filterArgs: $filterArgs
  ) {
    data {
      id
      name
      gender
      nationality
      dateOfBirth
      email
      phoneNumber
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
 * __useStudentsQuery__
 *
 * To run a query within a React component, call `useStudentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentsQuery({
 *   variables: {
 *      orderBy: // value for 'orderBy'
 *      paginationArgs: // value for 'paginationArgs'
 *      filterArgs: // value for 'filterArgs'
 *   },
 * });
 */
export function useStudentsQuery(baseOptions?: Apollo.QueryHookOptions<StudentsQuery, StudentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, options);
      }
export function useStudentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentsQuery, StudentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, options);
        }
export function useStudentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudentsQuery, StudentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, options);
        }
export type StudentsQueryHookResult = ReturnType<typeof useStudentsQuery>;
export type StudentsLazyQueryHookResult = ReturnType<typeof useStudentsLazyQuery>;
export type StudentsSuspenseQueryHookResult = ReturnType<typeof useStudentsSuspenseQuery>;
export type StudentsQueryResult = Apollo.QueryResult<StudentsQuery, StudentsQueryVariables>;
export function refetchStudentsQuery(variables?: StudentsQueryVariables) {
      return { query: StudentsDocument, variables: variables }
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
    query templates($paginationArgs: PaginationArgsInput) {
  templates(paginationArgs: $paginationArgs) {
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
 *      paginationArgs: // value for 'paginationArgs'
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
export const CreateDateTemplateVariableDocument = gql`
    mutation createDateTemplateVariable($input: CreateDateCreateTemplateVariableInput!) {
  createDateTemplateVariable(input: $input) {
    createdAt
    description
    format
    id
    maxDate
    minDate
    name
    order
    previewValue
    required
    template {
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
                templates {
                  category {
                    categorySpecialType
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
                      parentCategory {
                        categorySpecialType
                        createdAt
                        description
                        id
                        name
                        order
                        templates {
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
                            templates {
                              createdAt
                              description
                              id
                              imageUrl
                              name
                              order
                              updatedAt
                            }
                            updatedAt
                          }
                          updatedAt
                        }
                        updatedAt
                      }
                      updatedAt
                    }
                    templates {
                      createdAt
                      description
                      id
                      imageUrl
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
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    type
    updatedAt
  }
}
    `;
export type CreateDateTemplateVariableMutationFn = Apollo.MutationFunction<CreateDateTemplateVariableMutation, CreateDateTemplateVariableMutationVariables>;

/**
 * __useCreateDateTemplateVariableMutation__
 *
 * To run a mutation, you first call `useCreateDateTemplateVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDateTemplateVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDateTemplateVariableMutation, { data, loading, error }] = useCreateDateTemplateVariableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDateTemplateVariableMutation(baseOptions?: Apollo.MutationHookOptions<CreateDateTemplateVariableMutation, CreateDateTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDateTemplateVariableMutation, CreateDateTemplateVariableMutationVariables>(CreateDateTemplateVariableDocument, options);
      }
export type CreateDateTemplateVariableMutationHookResult = ReturnType<typeof useCreateDateTemplateVariableMutation>;
export type CreateDateTemplateVariableMutationResult = Apollo.MutationResult<CreateDateTemplateVariableMutation>;
export type CreateDateTemplateVariableMutationOptions = Apollo.BaseMutationOptions<CreateDateTemplateVariableMutation, CreateDateTemplateVariableMutationVariables>;
export const CreateNumberTemplateVariableDocument = gql`
    mutation createNumberTemplateVariable($input: CreateNumberCreateTemplateVariableInput!) {
  createNumberTemplateVariable(input: $input) {
    createdAt
    decimalPlaces
    description
    id
    maxValue
    minValue
    name
    order
    previewValue
    required
    template {
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
                templates {
                  category {
                    categorySpecialType
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
                      parentCategory {
                        categorySpecialType
                        createdAt
                        description
                        id
                        name
                        order
                        templates {
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
                            templates {
                              createdAt
                              description
                              id
                              imageUrl
                              name
                              order
                              updatedAt
                            }
                            updatedAt
                          }
                          updatedAt
                        }
                        updatedAt
                      }
                      updatedAt
                    }
                    templates {
                      createdAt
                      description
                      id
                      imageUrl
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
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    type
    updatedAt
  }
}
    `;
export type CreateNumberTemplateVariableMutationFn = Apollo.MutationFunction<CreateNumberTemplateVariableMutation, CreateNumberTemplateVariableMutationVariables>;

/**
 * __useCreateNumberTemplateVariableMutation__
 *
 * To run a mutation, you first call `useCreateNumberTemplateVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNumberTemplateVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNumberTemplateVariableMutation, { data, loading, error }] = useCreateNumberTemplateVariableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNumberTemplateVariableMutation(baseOptions?: Apollo.MutationHookOptions<CreateNumberTemplateVariableMutation, CreateNumberTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNumberTemplateVariableMutation, CreateNumberTemplateVariableMutationVariables>(CreateNumberTemplateVariableDocument, options);
      }
export type CreateNumberTemplateVariableMutationHookResult = ReturnType<typeof useCreateNumberTemplateVariableMutation>;
export type CreateNumberTemplateVariableMutationResult = Apollo.MutationResult<CreateNumberTemplateVariableMutation>;
export type CreateNumberTemplateVariableMutationOptions = Apollo.BaseMutationOptions<CreateNumberTemplateVariableMutation, CreateNumberTemplateVariableMutationVariables>;
export const CreateSelectTemplateVariableDocument = gql`
    mutation createSelectTemplateVariable($input: CreateSelectCreateTemplateVariableInput!) {
  createSelectTemplateVariable(input: $input) {
    createdAt
    description
    id
    multiple
    name
    options
    order
    previewValue
    required
    template {
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
                templates {
                  category {
                    categorySpecialType
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
                      parentCategory {
                        categorySpecialType
                        createdAt
                        description
                        id
                        name
                        order
                        templates {
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
                            templates {
                              createdAt
                              description
                              id
                              imageUrl
                              name
                              order
                              updatedAt
                            }
                            updatedAt
                          }
                          updatedAt
                        }
                        updatedAt
                      }
                      updatedAt
                    }
                    templates {
                      createdAt
                      description
                      id
                      imageUrl
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
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    type
    updatedAt
  }
}
    `;
export type CreateSelectTemplateVariableMutationFn = Apollo.MutationFunction<CreateSelectTemplateVariableMutation, CreateSelectTemplateVariableMutationVariables>;

/**
 * __useCreateSelectTemplateVariableMutation__
 *
 * To run a mutation, you first call `useCreateSelectTemplateVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSelectTemplateVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSelectTemplateVariableMutation, { data, loading, error }] = useCreateSelectTemplateVariableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSelectTemplateVariableMutation(baseOptions?: Apollo.MutationHookOptions<CreateSelectTemplateVariableMutation, CreateSelectTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSelectTemplateVariableMutation, CreateSelectTemplateVariableMutationVariables>(CreateSelectTemplateVariableDocument, options);
      }
export type CreateSelectTemplateVariableMutationHookResult = ReturnType<typeof useCreateSelectTemplateVariableMutation>;
export type CreateSelectTemplateVariableMutationResult = Apollo.MutationResult<CreateSelectTemplateVariableMutation>;
export type CreateSelectTemplateVariableMutationOptions = Apollo.BaseMutationOptions<CreateSelectTemplateVariableMutation, CreateSelectTemplateVariableMutationVariables>;
export const CreateTextTemplateVariableDocument = gql`
    mutation createTextTemplateVariable($input: CreateTextCreateTemplateVariableInput!) {
  createTextTemplateVariable(input: $input) {
    createdAt
    description
    id
    maxLength
    minLength
    name
    order
    pattern
    previewValue
    required
    template {
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
                templates {
                  category {
                    categorySpecialType
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
                      parentCategory {
                        categorySpecialType
                        createdAt
                        description
                        id
                        name
                        order
                        templates {
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
                            templates {
                              createdAt
                              description
                              id
                              imageUrl
                              name
                              order
                              updatedAt
                            }
                            updatedAt
                          }
                          updatedAt
                        }
                        updatedAt
                      }
                      updatedAt
                    }
                    templates {
                      createdAt
                      description
                      id
                      imageUrl
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
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    type
    updatedAt
  }
}
    `;
export type CreateTextTemplateVariableMutationFn = Apollo.MutationFunction<CreateTextTemplateVariableMutation, CreateTextTemplateVariableMutationVariables>;

/**
 * __useCreateTextTemplateVariableMutation__
 *
 * To run a mutation, you first call `useCreateTextTemplateVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTextTemplateVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTextTemplateVariableMutation, { data, loading, error }] = useCreateTextTemplateVariableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTextTemplateVariableMutation(baseOptions?: Apollo.MutationHookOptions<CreateTextTemplateVariableMutation, CreateTextTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTextTemplateVariableMutation, CreateTextTemplateVariableMutationVariables>(CreateTextTemplateVariableDocument, options);
      }
export type CreateTextTemplateVariableMutationHookResult = ReturnType<typeof useCreateTextTemplateVariableMutation>;
export type CreateTextTemplateVariableMutationResult = Apollo.MutationResult<CreateTextTemplateVariableMutation>;
export type CreateTextTemplateVariableMutationOptions = Apollo.BaseMutationOptions<CreateTextTemplateVariableMutation, CreateTextTemplateVariableMutationVariables>;
export const DeleteTemplateVariableDocument = gql`
    mutation deleteTemplateVariable($id: Int!) {
  deleteTemplateVariable(id: $id) {
    createdAt
    description
    id
    name
    order
    required
    template {
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
                templates {
                  category {
                    categorySpecialType
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
                      parentCategory {
                        categorySpecialType
                        createdAt
                        description
                        id
                        name
                        order
                        templates {
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
                            templates {
                              createdAt
                              description
                              id
                              imageUrl
                              name
                              order
                              updatedAt
                            }
                            updatedAt
                          }
                          updatedAt
                        }
                        updatedAt
                      }
                      updatedAt
                    }
                    templates {
                      createdAt
                      description
                      id
                      imageUrl
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
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    type
    updatedAt
  }
}
    `;
export type DeleteTemplateVariableMutationFn = Apollo.MutationFunction<DeleteTemplateVariableMutation, DeleteTemplateVariableMutationVariables>;

/**
 * __useDeleteTemplateVariableMutation__
 *
 * To run a mutation, you first call `useDeleteTemplateVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTemplateVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTemplateVariableMutation, { data, loading, error }] = useDeleteTemplateVariableMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTemplateVariableMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTemplateVariableMutation, DeleteTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTemplateVariableMutation, DeleteTemplateVariableMutationVariables>(DeleteTemplateVariableDocument, options);
      }
export type DeleteTemplateVariableMutationHookResult = ReturnType<typeof useDeleteTemplateVariableMutation>;
export type DeleteTemplateVariableMutationResult = Apollo.MutationResult<DeleteTemplateVariableMutation>;
export type DeleteTemplateVariableMutationOptions = Apollo.BaseMutationOptions<DeleteTemplateVariableMutation, DeleteTemplateVariableMutationVariables>;
export const UpdateDateTemplateVariableDocument = gql`
    mutation updateDateTemplateVariable($input: UpdateDateCreateTemplateVariableInput!) {
  updateDateTemplateVariable(input: $input) {
    createdAt
    description
    format
    id
    maxDate
    minDate
    name
    order
    previewValue
    required
    template {
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
                templates {
                  category {
                    categorySpecialType
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
                      parentCategory {
                        categorySpecialType
                        createdAt
                        description
                        id
                        name
                        order
                        templates {
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
                            templates {
                              createdAt
                              description
                              id
                              imageUrl
                              name
                              order
                              updatedAt
                            }
                            updatedAt
                          }
                          updatedAt
                        }
                        updatedAt
                      }
                      updatedAt
                    }
                    templates {
                      createdAt
                      description
                      id
                      imageUrl
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
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    type
    updatedAt
  }
}
    `;
export type UpdateDateTemplateVariableMutationFn = Apollo.MutationFunction<UpdateDateTemplateVariableMutation, UpdateDateTemplateVariableMutationVariables>;

/**
 * __useUpdateDateTemplateVariableMutation__
 *
 * To run a mutation, you first call `useUpdateDateTemplateVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDateTemplateVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDateTemplateVariableMutation, { data, loading, error }] = useUpdateDateTemplateVariableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDateTemplateVariableMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDateTemplateVariableMutation, UpdateDateTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDateTemplateVariableMutation, UpdateDateTemplateVariableMutationVariables>(UpdateDateTemplateVariableDocument, options);
      }
export type UpdateDateTemplateVariableMutationHookResult = ReturnType<typeof useUpdateDateTemplateVariableMutation>;
export type UpdateDateTemplateVariableMutationResult = Apollo.MutationResult<UpdateDateTemplateVariableMutation>;
export type UpdateDateTemplateVariableMutationOptions = Apollo.BaseMutationOptions<UpdateDateTemplateVariableMutation, UpdateDateTemplateVariableMutationVariables>;
export const UpdateNumberTemplateVariableDocument = gql`
    mutation updateNumberTemplateVariable($input: UpdateNumberCreateTemplateVariableInput!) {
  updateNumberTemplateVariable(input: $input) {
    createdAt
    decimalPlaces
    description
    id
    maxValue
    minValue
    name
    order
    previewValue
    required
    template {
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
                templates {
                  category {
                    categorySpecialType
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
                      parentCategory {
                        categorySpecialType
                        createdAt
                        description
                        id
                        name
                        order
                        templates {
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
                            templates {
                              createdAt
                              description
                              id
                              imageUrl
                              name
                              order
                              updatedAt
                            }
                            updatedAt
                          }
                          updatedAt
                        }
                        updatedAt
                      }
                      updatedAt
                    }
                    templates {
                      createdAt
                      description
                      id
                      imageUrl
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
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    type
    updatedAt
  }
}
    `;
export type UpdateNumberTemplateVariableMutationFn = Apollo.MutationFunction<UpdateNumberTemplateVariableMutation, UpdateNumberTemplateVariableMutationVariables>;

/**
 * __useUpdateNumberTemplateVariableMutation__
 *
 * To run a mutation, you first call `useUpdateNumberTemplateVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNumberTemplateVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNumberTemplateVariableMutation, { data, loading, error }] = useUpdateNumberTemplateVariableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNumberTemplateVariableMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNumberTemplateVariableMutation, UpdateNumberTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNumberTemplateVariableMutation, UpdateNumberTemplateVariableMutationVariables>(UpdateNumberTemplateVariableDocument, options);
      }
export type UpdateNumberTemplateVariableMutationHookResult = ReturnType<typeof useUpdateNumberTemplateVariableMutation>;
export type UpdateNumberTemplateVariableMutationResult = Apollo.MutationResult<UpdateNumberTemplateVariableMutation>;
export type UpdateNumberTemplateVariableMutationOptions = Apollo.BaseMutationOptions<UpdateNumberTemplateVariableMutation, UpdateNumberTemplateVariableMutationVariables>;
export const UpdateSelectTemplateVariableDocument = gql`
    mutation updateSelectTemplateVariable($input: UpdateSelectCreateTemplateVariableInput!) {
  updateSelectTemplateVariable(input: $input) {
    createdAt
    description
    id
    multiple
    name
    options
    order
    previewValue
    required
    template {
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
                templates {
                  category {
                    categorySpecialType
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
                      parentCategory {
                        categorySpecialType
                        createdAt
                        description
                        id
                        name
                        order
                        templates {
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
                            templates {
                              createdAt
                              description
                              id
                              imageUrl
                              name
                              order
                              updatedAt
                            }
                            updatedAt
                          }
                          updatedAt
                        }
                        updatedAt
                      }
                      updatedAt
                    }
                    templates {
                      createdAt
                      description
                      id
                      imageUrl
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
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    type
    updatedAt
  }
}
    `;
export type UpdateSelectTemplateVariableMutationFn = Apollo.MutationFunction<UpdateSelectTemplateVariableMutation, UpdateSelectTemplateVariableMutationVariables>;

/**
 * __useUpdateSelectTemplateVariableMutation__
 *
 * To run a mutation, you first call `useUpdateSelectTemplateVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSelectTemplateVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSelectTemplateVariableMutation, { data, loading, error }] = useUpdateSelectTemplateVariableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSelectTemplateVariableMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSelectTemplateVariableMutation, UpdateSelectTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSelectTemplateVariableMutation, UpdateSelectTemplateVariableMutationVariables>(UpdateSelectTemplateVariableDocument, options);
      }
export type UpdateSelectTemplateVariableMutationHookResult = ReturnType<typeof useUpdateSelectTemplateVariableMutation>;
export type UpdateSelectTemplateVariableMutationResult = Apollo.MutationResult<UpdateSelectTemplateVariableMutation>;
export type UpdateSelectTemplateVariableMutationOptions = Apollo.BaseMutationOptions<UpdateSelectTemplateVariableMutation, UpdateSelectTemplateVariableMutationVariables>;
export const UpdateTextTemplateVariableDocument = gql`
    mutation updateTextTemplateVariable($input: UpdateTextCreateTemplateVariableInput!) {
  updateTextTemplateVariable(input: $input) {
    createdAt
    description
    id
    maxLength
    minLength
    name
    order
    pattern
    previewValue
    required
    template {
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
                templates {
                  category {
                    categorySpecialType
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
                      parentCategory {
                        categorySpecialType
                        createdAt
                        description
                        id
                        name
                        order
                        templates {
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
                            templates {
                              createdAt
                              description
                              id
                              imageUrl
                              name
                              order
                              updatedAt
                            }
                            updatedAt
                          }
                          updatedAt
                        }
                        updatedAt
                      }
                      updatedAt
                    }
                    templates {
                      createdAt
                      description
                      id
                      imageUrl
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
        createdAt
        description
        id
        name
        order
        updatedAt
      }
      updatedAt
    }
    type
    updatedAt
  }
}
    `;
export type UpdateTextTemplateVariableMutationFn = Apollo.MutationFunction<UpdateTextTemplateVariableMutation, UpdateTextTemplateVariableMutationVariables>;

/**
 * __useUpdateTextTemplateVariableMutation__
 *
 * To run a mutation, you first call `useUpdateTextTemplateVariableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTextTemplateVariableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTextTemplateVariableMutation, { data, loading, error }] = useUpdateTextTemplateVariableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTextTemplateVariableMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTextTemplateVariableMutation, UpdateTextTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTextTemplateVariableMutation, UpdateTextTemplateVariableMutationVariables>(UpdateTextTemplateVariableDocument, options);
      }
export type UpdateTextTemplateVariableMutationHookResult = ReturnType<typeof useUpdateTextTemplateVariableMutation>;
export type UpdateTextTemplateVariableMutationResult = Apollo.MutationResult<UpdateTextTemplateVariableMutation>;
export type UpdateTextTemplateVariableMutationOptions = Apollo.BaseMutationOptions<UpdateTextTemplateVariableMutation, UpdateTextTemplateVariableMutationVariables>;