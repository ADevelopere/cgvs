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
  Date: { input: any; output: any; }
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

/** A certificate issued to a student */
export type Certificate = {
  __typename?: 'Certificate';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  recipientGroup: TemplateRecipientGroup;
  release_date: Scalars['Date']['output'];
  student: Student;
  template: Template;
  updated_at: Scalars['DateTime']['output'];
  verification_code: Scalars['String']['output'];
};

/** Country codes for nationality */
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

export type CreateStudentInput = {
  date_of_birth?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<StudentGender>;
  name: Scalars['String']['input'];
  nationality?: InputMaybe<CountryCode>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTemplateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  parentCategoryId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateTemplateInput = {
  categoryId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
};

/** Dynamic date element that pulls data from various sources */
export type DataDateElement = {
  __typename?: 'DataDateElement';
  created_at: Scalars['DateTime']['output'];
  date_format?: Maybe<Scalars['String']['output']>;
  element: TemplateElement;
  element_id: Scalars['ID']['output'];
  source_field: Scalars['String']['output'];
  source_type: DataSourceType;
  updated_at: Scalars['DateTime']['output'];
};

/** Enum for data source types */
export type DataSourceType =
  | 'certificate'
  | 'student'
  | 'variable';

/** Dynamic text element that pulls data from various sources */
export type DataTextElement = {
  __typename?: 'DataTextElement';
  created_at: Scalars['DateTime']['output'];
  element: TemplateElement;
  element_id: Scalars['ID']['output'];
  source_field: Scalars['String']['output'];
  source_type: DataSourceType;
  updated_at: Scalars['DateTime']['output'];
};

/** Static image element */
export type ImageElement = {
  __typename?: 'ImageElement';
  created_at: Scalars['DateTime']['output'];
  element: TemplateElement;
  element_id: Scalars['ID']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  image_url: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  width?: Maybe<Scalars['Int']['output']>;
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
  /** Create a new student */
  createStudent: Student;
  /** Create a new template */
  createTemplate: Template;
  createTemplateCategory: TemplateCategory;
  /** Delete a student */
  deleteStudent: Student;
  /** Delete a template */
  deleteTemplate: Template;
  deleteTemplateCategory: TemplateCategory;
  login: AuthPayload;
  logout: LogoutResponse;
  /** Move a template to the deleted category */
  moveTemplateToDeletionCategory: Template;
  reorderTemplateCategories: Array<TemplateCategory>;
  /** Reorder templates in a category */
  reorderTemplates: Array<Template>;
  /** Restore a template from the deleted category */
  restoreTemplate: Template;
  /** Update an existing student */
  updateStudent: Student;
  /** Update an existing template */
  updateTemplate: Template;
  updateTemplateCategory: TemplateCategory;
  updateTemplateWithImage: Template;
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationCreateStudentArgs = {
  input: CreateStudentInput;
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
export type MutationDeleteStudentArgs = {
  id: Scalars['ID']['input'];
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
export type MutationMoveTemplateToDeletionCategoryArgs = {
  templateId: Scalars['ID']['input'];
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationReorderTemplateCategoriesArgs = {
  input: Array<ReorderCategoriesInput>;
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationReorderTemplatesArgs = {
  input: Array<ReorderTemplateInput>;
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationRestoreTemplateArgs = {
  templateId: Scalars['ID']['input'];
};


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationUpdateStudentArgs = {
  input: UpdateStudentInput;
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


/** Indicates what fields are available at the top level of a mutation operation. */
export type MutationUpdateTemplateWithImageArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTemplateWithImageInput;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String']['input'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Available fields for sorting students */
export type OrderByColumn =
  | 'CREATED_AT'
  | 'DATE_OF_BIRTH'
  | 'EMAIL'
  | 'GENDER'
  | 'ID'
  | 'NAME'
  | 'UPDATED_AT';

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

/** QR code element for certificate verification */
export type QrCodeElement = {
  __typename?: 'QrCodeElement';
  created_at: Scalars['DateTime']['output'];
  element: TemplateElement;
  element_id: Scalars['ID']['output'];
  size?: Maybe<Scalars['Int']['output']>;
  updated_at: Scalars['DateTime']['output'];
};

/** Indicates what fields are available at the top level of a query operation. */
export type Query = {
  __typename?: 'Query';
  deletionTemplateCategory: TemplateCategory;
  flatTemplateCategories: Array<TemplateCategory>;
  mainTemplateCategory: TemplateCategory;
  me: User;
  /** Get a specific student by ID */
  student?: Maybe<Student>;
  /** Get a list of all students with sorting, filtering and pagination */
  students: StudentPaginator;
  /** Get a specific template by ID */
  template?: Maybe<Template>;
  templateCategories: TemplateCategoryPaginator;
  templateCategory?: Maybe<TemplateCategory>;
  /** Get template configuration */
  templateConfig: TemplateConfig;
  /** Get all templates */
  templates: TemplatePaginator;
  /** Find a single user by an identifying attribute. */
  user?: Maybe<User>;
  /** List multiple users. */
  users: UserPaginator;
};


/** Indicates what fields are available at the top level of a query operation. */
export type QueryStudentArgs = {
  id: Scalars['ID']['input'];
};


/** Indicates what fields are available at the top level of a query operation. */
export type QueryStudentsArgs = {
  birth_date?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_after?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_before?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_from?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_is_empty?: InputMaybe<Scalars['Boolean']['input']>;
  birth_date_is_not_empty?: InputMaybe<Scalars['Boolean']['input']>;
  birth_date_not?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_on_or_after?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_on_or_before?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_to?: InputMaybe<Scalars['DateTime']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_after?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_before?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_from?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_is_empty?: InputMaybe<Scalars['Boolean']['input']>;
  created_at_is_not_empty?: InputMaybe<Scalars['Boolean']['input']>;
  created_at_not?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_on_or_after?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_on_or_before?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_to?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  email_ends_with?: InputMaybe<Scalars['String']['input']>;
  email_equals?: InputMaybe<Scalars['String']['input']>;
  email_is_empty?: InputMaybe<Scalars['Boolean']['input']>;
  email_is_not_empty?: InputMaybe<Scalars['Boolean']['input']>;
  email_not_contains?: InputMaybe<Scalars['String']['input']>;
  email_not_equals?: InputMaybe<Scalars['String']['input']>;
  email_starts_with?: InputMaybe<Scalars['String']['input']>;
  first?: Scalars['Int']['input'];
  gender?: InputMaybe<StudentGender>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_equals?: InputMaybe<Scalars['String']['input']>;
  name_is_empty?: InputMaybe<Scalars['Boolean']['input']>;
  name_is_not_empty?: InputMaybe<Scalars['Boolean']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_equals?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<CountryCode>;
  orderBy?: InputMaybe<Array<OrderByClause>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
};


/** Indicates what fields are available at the top level of a query operation. */
export type QueryTemplateArgs = {
  id: Scalars['ID']['input'];
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
export type QueryTemplatesArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
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

/** A variable value for a student in a recipient group */
export type RecipientGroupItemVariableValue = {
  __typename?: 'RecipientGroupItemVariableValue';
  created_at: Scalars['DateTime']['output'];
  groupItem: TemplateRecipientGroupItem;
  id: Scalars['ID']['output'];
  updated_at: Scalars['DateTime']['output'];
  value?: Maybe<Scalars['String']['output']>;
  value_indexed?: Maybe<Scalars['String']['output']>;
  variable: TemplateVariable;
};

export type ReorderCategoriesInput = {
  id: Scalars['ID']['input'];
  order: Scalars['Int']['input'];
};

export type ReorderTemplateInput = {
  id: Scalars['ID']['input'];
  order: Scalars['Int']['input'];
};

/** Directions for ordering a list of records. */
export type SortOrder =
  /** Sort records in ascending order. */
  | 'ASC'
  /** Sort records in descending order. */
  | 'DESC';

/** Static text element like titles and labels */
export type StaticTextElement = {
  __typename?: 'StaticTextElement';
  content: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  element: TemplateElement;
  element_id: Scalars['ID']['output'];
  updated_at: Scalars['DateTime']['output'];
};

/** A student in the system */
export type Student = {
  __typename?: 'Student';
  certificates?: Maybe<Array<Certificate>>;
  created_at: Scalars['DateTime']['output'];
  date_of_birth?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<StudentGender>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nationality?: Maybe<CountryCode>;
  phone_number?: Maybe<Scalars['String']['output']>;
  recipientGroups?: Maybe<Array<TemplateRecipientGroup>>;
  updated_at: Scalars['DateTime']['output'];
};

/** Gender options for students */
export type StudentGender =
  | 'female'
  | 'male'
  | 'other';

/** A paginated list of Student items. */
export type StudentPaginator = {
  __typename?: 'StudentPaginator';
  /** A list of Student items. */
  data: Array<Student>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** A template in the system */
export type Template = {
  __typename?: 'Template';
  category: TemplateCategory;
  certificates: Array<Certificate>;
  created_at: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  elements: Array<TemplateElement>;
  id: Scalars['ID']['output'];
  image_url?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  pre_deletion_category?: Maybe<TemplateCategory>;
  recipientGroups: Array<TemplateRecipientGroup>;
  trashed_at?: Maybe<Scalars['DateTime']['output']>;
  updated_at: Scalars['DateTime']['output'];
  variables: Array<TemplateVariable>;
};

export type TemplateCategory = {
  __typename?: 'TemplateCategory';
  childCategories: Array<TemplateCategory>;
  created_at: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  parentCategory?: Maybe<TemplateCategory>;
  special_type?: Maybe<TemplateCategoryType>;
  templates?: Maybe<Array<Template>>;
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
  | 'deletion'
  | 'main';

/** Configuration for templates */
export type TemplateConfig = {
  __typename?: 'TemplateConfig';
  allowedFileTypes?: Maybe<Array<Scalars['String']['output']>>;
  maxBackgroundSize?: Maybe<Scalars['Int']['output']>;
};

/** Date variable with range and format */
export type TemplateDateVariable = {
  __typename?: 'TemplateDateVariable';
  created_at: Scalars['DateTime']['output'];
  format?: Maybe<Scalars['String']['output']>;
  max_date?: Maybe<Scalars['Date']['output']>;
  min_date?: Maybe<Scalars['Date']['output']>;
  updated_at: Scalars['DateTime']['output'];
  variable: TemplateVariable;
  variable_id: Scalars['ID']['output'];
};

/** Base template element type */
export type TemplateElement = {
  __typename?: 'TemplateElement';
  alignment?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  dataDate?: Maybe<DataDateElement>;
  dataText?: Maybe<DataTextElement>;
  font_family?: Maybe<Scalars['String']['output']>;
  font_size?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<ImageElement>;
  language_constraint?: Maybe<Scalars['String']['output']>;
  qrCode?: Maybe<QrCodeElement>;
  staticText?: Maybe<StaticTextElement>;
  template: Template;
  type: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  x_coordinate: Scalars['Float']['output'];
  y_coordinate: Scalars['Float']['output'];
};

/** Number variable with range and precision */
export type TemplateNumberVariable = {
  __typename?: 'TemplateNumberVariable';
  created_at: Scalars['DateTime']['output'];
  decimal_places?: Maybe<Scalars['Int']['output']>;
  max_value?: Maybe<Scalars['Float']['output']>;
  min_value?: Maybe<Scalars['Float']['output']>;
  updated_at: Scalars['DateTime']['output'];
  variable: TemplateVariable;
  variable_id: Scalars['ID']['output'];
};

/** A paginated list of Template items. */
export type TemplatePaginator = {
  __typename?: 'TemplatePaginator';
  /** A list of Template items. */
  data: Array<Template>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** Template preview options */
export type TemplatePreview = {
  __typename?: 'TemplatePreview';
  html?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

/** A group of recipients for a template */
export type TemplateRecipientGroup = {
  __typename?: 'TemplateRecipientGroup';
  certificates: Array<Certificate>;
  created_at: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items: Array<TemplateRecipientGroupItem>;
  name: Scalars['String']['output'];
  students: Array<Student>;
  template: Template;
  updated_at: Scalars['DateTime']['output'];
};

/** A student entry in a recipient group */
export type TemplateRecipientGroupItem = {
  __typename?: 'TemplateRecipientGroupItem';
  created_at: Scalars['DateTime']['output'];
  group: TemplateRecipientGroup;
  id: Scalars['ID']['output'];
  student: Student;
  updated_at: Scalars['DateTime']['output'];
  variableValues: Array<RecipientGroupItemVariableValue>;
};

/** Select/Choice variable with options */
export type TemplateSelectVariable = {
  __typename?: 'TemplateSelectVariable';
  created_at: Scalars['DateTime']['output'];
  multiple: Scalars['Boolean']['output'];
  options: Array<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  variable: TemplateVariable;
  variable_id: Scalars['ID']['output'];
};

/** Text variable with validation rules */
export type TemplateTextVariable = {
  __typename?: 'TemplateTextVariable';
  created_at: Scalars['DateTime']['output'];
  max_length?: Maybe<Scalars['Int']['output']>;
  min_length?: Maybe<Scalars['Int']['output']>;
  pattern?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  variable: TemplateVariable;
  variable_id: Scalars['ID']['output'];
};

/** Base template variable type */
export type TemplateVariable = {
  __typename?: 'TemplateVariable';
  created_at: Scalars['DateTime']['output'];
  dateVariable?: Maybe<TemplateDateVariable>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  numberVariable?: Maybe<TemplateNumberVariable>;
  order: Scalars['Int']['output'];
  preview_value?: Maybe<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  selectVariable?: Maybe<TemplateSelectVariable>;
  template: Template;
  textVariable?: Maybe<TemplateTextVariable>;
  type: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  values: Array<RecipientGroupItemVariableValue>;
};

/** Specify if you want to include or exclude trashed results from a query. */
export type Trashed =
  /** Only return trashed results. */
  | 'ONLY'
  /** Return both trashed and non-trashed results. */
  | 'WITH'
  /** Only return non-trashed results. */
  | 'WITHOUT';

export type UpdateStudentInput = {
  date_of_birth?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<StudentGender>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<CountryCode>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTemplateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  parentCategoryId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateTemplateInput = {
  categoryId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateTemplateWithImageInput = {
  categoryId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
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

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', created_at: any, email: string, email_verified_at?: any | null, id: string, isAdmin: boolean, name: string, updated_at: any } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResponse', message: string } };

export type CreateStudentMutationVariables = Exact<{
  input: CreateStudentInput;
}>;


export type CreateStudentMutation = { __typename?: 'Mutation', createStudent: { __typename?: 'Student', id: string, name: string, gender?: StudentGender | null, nationality?: CountryCode | null, date_of_birth?: any | null, email?: string | null, phone_number?: string | null, created_at: any, updated_at: any } };

export type DeleteStudentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteStudentMutation = { __typename?: 'Mutation', deleteStudent: { __typename?: 'Student', id: string, name: string, created_at: any, updated_at: any } };

export type UpdateStudentMutationVariables = Exact<{
  input: UpdateStudentInput;
}>;


export type UpdateStudentMutation = { __typename?: 'Mutation', updateStudent: { __typename?: 'Student', id: string, name: string, gender?: StudentGender | null, nationality?: CountryCode | null, date_of_birth?: any | null, email?: string | null, phone_number?: string | null, created_at: any, updated_at: any } };

export type CreateTemplateMutationVariables = Exact<{
  input: CreateTemplateInput;
}>;


export type CreateTemplateMutation = { __typename?: 'Mutation', createTemplate: { __typename?: 'Template', id: string, name: string, description?: string | null, image_url?: string | null, order?: number | null, created_at: any, updated_at: any, trashed_at?: any | null, category: { __typename?: 'TemplateCategory', id: string } } };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate: { __typename?: 'Template', id: string, name: string, category: { __typename?: 'TemplateCategory', id: string } } };

export type MoveTemplateToDeletionCategoryMutationVariables = Exact<{
  templateId: Scalars['ID']['input'];
}>;


export type MoveTemplateToDeletionCategoryMutation = { __typename?: 'Mutation', moveTemplateToDeletionCategory: { __typename?: 'Template', id: string, name: string, order?: number | null, trashed_at?: any | null, updated_at: any, category: { __typename?: 'TemplateCategory', id: string } } };

export type ReorderTemplatesMutationVariables = Exact<{
  input: Array<ReorderTemplateInput> | ReorderTemplateInput;
}>;


export type ReorderTemplatesMutation = { __typename?: 'Mutation', reorderTemplates: Array<{ __typename?: 'Template', id: string, name: string, order?: number | null, updated_at: any, category: { __typename?: 'TemplateCategory', id: string } }> };

export type RestoreTemplateMutationVariables = Exact<{
  templateId: Scalars['ID']['input'];
}>;


export type RestoreTemplateMutation = { __typename?: 'Mutation', restoreTemplate: { __typename?: 'Template', id: string, name: string, description?: string | null, order?: number | null, created_at: any, trashed_at?: any | null, updated_at: any, category: { __typename?: 'TemplateCategory', id: string } } };

export type UpdateTemplateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTemplateInput;
}>;


export type UpdateTemplateMutation = { __typename?: 'Mutation', updateTemplate: { __typename?: 'Template', id: string, name: string, description?: string | null, image_url?: string | null, order?: number | null, created_at: any, updated_at: any, trashed_at?: any | null, category: { __typename?: 'TemplateCategory', id: string } } };

export type UpdateTemplateWithImageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTemplateWithImageInput;
}>;


export type UpdateTemplateWithImageMutation = { __typename?: 'Mutation', updateTemplateWithImage: { __typename?: 'Template', id: string, name: string, description?: string | null, image_url?: string | null, order?: number | null, created_at: any, updated_at: any, trashed_at?: any | null, category: { __typename?: 'TemplateCategory', id: string } } };

export type CreateTemplateCategoryMutationVariables = Exact<{
  input: CreateTemplateCategoryInput;
}>;


export type CreateTemplateCategoryMutation = { __typename?: 'Mutation', createTemplateCategory: { __typename?: 'TemplateCategory', id: string, name: string, description?: string | null, special_type?: TemplateCategoryType | null, order?: number | null, created_at: any, parentCategory?: { __typename?: 'TemplateCategory', id: string } | null } };

export type DeleteTemplateCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTemplateCategoryMutation = { __typename?: 'Mutation', deleteTemplateCategory: { __typename?: 'TemplateCategory', id: string, name: string, parentCategory?: { __typename?: 'TemplateCategory', id: string } | null } };

export type ReorderTemplateCategoriesMutationVariables = Exact<{
  input: Array<ReorderCategoriesInput> | ReorderCategoriesInput;
}>;


export type ReorderTemplateCategoriesMutation = { __typename?: 'Mutation', reorderTemplateCategories: Array<{ __typename?: 'TemplateCategory', id: string, name: string, special_type?: TemplateCategoryType | null, order?: number | null, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', id: string } | null }> };

export type UpdateTemplateCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTemplateCategoryInput;
}>;


export type UpdateTemplateCategoryMutation = { __typename?: 'Mutation', updateTemplateCategory: { __typename?: 'TemplateCategory', id: string, name: string, description?: string | null, order?: number | null, special_type?: TemplateCategoryType | null, created_at: any, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', id: string } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', created_at: any, email: string, email_verified_at?: any | null, id: string, isAdmin: boolean, name: string, updated_at: any } };

export type StudentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StudentQuery = { __typename?: 'Query', student?: { __typename?: 'Student', id: string, name: string, gender?: StudentGender | null, nationality?: CountryCode | null, date_of_birth?: any | null, email?: string | null, phone_number?: string | null, created_at: any, updated_at: any, certificates?: Array<{ __typename?: 'Certificate', id: string, release_date: any, verification_code: string, template: { __typename?: 'Template', id: string, name: string }, recipientGroup: { __typename?: 'TemplateRecipientGroup', id: string, name: string } }> | null } | null };

export type StudentsQueryVariables = Exact<{
  birth_date?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_after?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_before?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_from?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_is_empty?: InputMaybe<Scalars['Boolean']['input']>;
  birth_date_is_not_empty?: InputMaybe<Scalars['Boolean']['input']>;
  birth_date_not?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_on_or_after?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_on_or_before?: InputMaybe<Scalars['DateTime']['input']>;
  birth_date_to?: InputMaybe<Scalars['DateTime']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_after?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_before?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_from?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_is_empty?: InputMaybe<Scalars['Boolean']['input']>;
  created_at_is_not_empty?: InputMaybe<Scalars['Boolean']['input']>;
  created_at_not?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_on_or_after?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_on_or_before?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_to?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  email_ends_with?: InputMaybe<Scalars['String']['input']>;
  email_equals?: InputMaybe<Scalars['String']['input']>;
  email_is_empty?: InputMaybe<Scalars['Boolean']['input']>;
  email_is_not_empty?: InputMaybe<Scalars['Boolean']['input']>;
  email_not_contains?: InputMaybe<Scalars['String']['input']>;
  email_not_equals?: InputMaybe<Scalars['String']['input']>;
  email_starts_with?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
  gender?: InputMaybe<StudentGender>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_equals?: InputMaybe<Scalars['String']['input']>;
  name_is_empty?: InputMaybe<Scalars['Boolean']['input']>;
  name_is_not_empty?: InputMaybe<Scalars['Boolean']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_equals?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<CountryCode>;
  orderBy?: InputMaybe<Array<OrderByClause> | OrderByClause>;
  page?: InputMaybe<Scalars['Int']['input']>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
}>;


export type StudentsQuery = { __typename?: 'Query', students: { __typename?: 'StudentPaginator', data: Array<{ __typename?: 'Student', id: string, name: string, email?: string | null, gender?: StudentGender | null, nationality?: CountryCode | null, date_of_birth?: any | null, phone_number?: string | null, created_at: any, updated_at: any }>, paginatorInfo: { __typename?: 'PaginatorInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } } };

export type TemplateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TemplateQuery = { __typename?: 'Query', template?: { __typename?: 'Template', id: string, name: string, description?: string | null, image_url?: string | null, order?: number | null, created_at: any, updated_at: any, trashed_at?: any | null, category: { __typename?: 'TemplateCategory', id: string } } | null };

export type TemplateConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplateConfigQuery = { __typename?: 'Query', templateConfig: { __typename?: 'TemplateConfig', allowedFileTypes?: Array<string> | null, maxBackgroundSize?: number | null } };

export type TemplatesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TemplatesQuery = { __typename?: 'Query', templates: { __typename?: 'TemplatePaginator', data: Array<{ __typename?: 'Template', id: string, name: string, description?: string | null, image_url?: string | null, order?: number | null, created_at: any, trashed_at?: any | null, updated_at: any, category: { __typename?: 'TemplateCategory', id: string } }>, paginatorInfo: { __typename?: 'PaginatorInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } } };

export type DeletionTemplateCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type DeletionTemplateCategoryQuery = { __typename?: 'Query', deletionTemplateCategory: { __typename?: 'TemplateCategory', id: string, name: string, description?: string | null, special_type?: TemplateCategoryType | null, created_at: any, updated_at: any, templates?: Array<{ __typename?: 'Template', id: string, name: string, description?: string | null, image_url?: string | null, order?: number | null, created_at: any, trashed_at?: any | null, updated_at: any }> | null } };

export type FlatTemplateCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type FlatTemplateCategoriesQuery = { __typename?: 'Query', flatTemplateCategories: Array<{ __typename?: 'TemplateCategory', id: string, name: string, description?: string | null, special_type?: TemplateCategoryType | null, order?: number | null, created_at: any, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', id: string } | null, templates?: Array<{ __typename?: 'Template', id: string, name: string, description?: string | null, image_url?: string | null, order?: number | null, trashed_at?: any | null, created_at: any, updated_at: any }> | null }> };

export type MainTemplateCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type MainTemplateCategoryQuery = { __typename?: 'Query', mainTemplateCategory: { __typename?: 'TemplateCategory', id: string, name: string, description?: string | null, special_type?: TemplateCategoryType | null, created_at: any, updated_at: any, templates?: Array<{ __typename?: 'Template', id: string, name: string, image_url?: string | null, description?: string | null, order?: number | null, created_at: any, updated_at: any }> | null } };

export type TemplateCategoriesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TemplateCategoriesQuery = { __typename?: 'Query', templateCategories: { __typename?: 'TemplateCategoryPaginator', data: Array<{ __typename?: 'TemplateCategory', id: string, name: string, description?: string | null, special_type?: TemplateCategoryType | null, order?: number | null, created_at: any, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', id: string } | null }>, paginatorInfo: { __typename?: 'PaginatorInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } } };

export type TemplateCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TemplateCategoryQuery = { __typename?: 'Query', templateCategory?: { __typename?: 'TemplateCategory', id: string, name: string, description?: string | null, order?: number | null, special_type?: TemplateCategoryType | null, created_at: any, updated_at: any, parentCategory?: { __typename?: 'TemplateCategory', id: string } | null } | null };

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
export const CreateStudentDocument = gql`
    mutation createStudent($input: CreateStudentInput!) {
  createStudent(input: $input) {
    id
    name
    gender
    nationality
    date_of_birth
    email
    phone_number
    created_at
    updated_at
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
    mutation deleteStudent($id: ID!) {
  deleteStudent(id: $id) {
    id
    name
    created_at
    updated_at
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
    mutation updateStudent($input: UpdateStudentInput!) {
  updateStudent(input: $input) {
    id
    name
    gender
    nationality
    date_of_birth
    email
    phone_number
    created_at
    updated_at
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
export const CreateTemplateDocument = gql`
    mutation createTemplate($input: CreateTemplateInput!) {
  createTemplate(input: $input) {
    id
    name
    description
    image_url
    category {
      id
    }
    order
    created_at
    updated_at
    trashed_at
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
    mutation deleteTemplate($id: ID!) {
  deleteTemplate(id: $id) {
    id
    name
    category {
      id
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
export const MoveTemplateToDeletionCategoryDocument = gql`
    mutation moveTemplateToDeletionCategory($templateId: ID!) {
  moveTemplateToDeletionCategory(templateId: $templateId) {
    id
    name
    category {
      id
    }
    order
    trashed_at
    updated_at
  }
}
    `;
export type MoveTemplateToDeletionCategoryMutationFn = Apollo.MutationFunction<MoveTemplateToDeletionCategoryMutation, MoveTemplateToDeletionCategoryMutationVariables>;

/**
 * __useMoveTemplateToDeletionCategoryMutation__
 *
 * To run a mutation, you first call `useMoveTemplateToDeletionCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveTemplateToDeletionCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveTemplateToDeletionCategoryMutation, { data, loading, error }] = useMoveTemplateToDeletionCategoryMutation({
 *   variables: {
 *      templateId: // value for 'templateId'
 *   },
 * });
 */
export function useMoveTemplateToDeletionCategoryMutation(baseOptions?: Apollo.MutationHookOptions<MoveTemplateToDeletionCategoryMutation, MoveTemplateToDeletionCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveTemplateToDeletionCategoryMutation, MoveTemplateToDeletionCategoryMutationVariables>(MoveTemplateToDeletionCategoryDocument, options);
      }
export type MoveTemplateToDeletionCategoryMutationHookResult = ReturnType<typeof useMoveTemplateToDeletionCategoryMutation>;
export type MoveTemplateToDeletionCategoryMutationResult = Apollo.MutationResult<MoveTemplateToDeletionCategoryMutation>;
export type MoveTemplateToDeletionCategoryMutationOptions = Apollo.BaseMutationOptions<MoveTemplateToDeletionCategoryMutation, MoveTemplateToDeletionCategoryMutationVariables>;
export const ReorderTemplatesDocument = gql`
    mutation reorderTemplates($input: [ReorderTemplateInput!]!) {
  reorderTemplates(input: $input) {
    id
    name
    category {
      id
    }
    order
    updated_at
  }
}
    `;
export type ReorderTemplatesMutationFn = Apollo.MutationFunction<ReorderTemplatesMutation, ReorderTemplatesMutationVariables>;

/**
 * __useReorderTemplatesMutation__
 *
 * To run a mutation, you first call `useReorderTemplatesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReorderTemplatesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reorderTemplatesMutation, { data, loading, error }] = useReorderTemplatesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReorderTemplatesMutation(baseOptions?: Apollo.MutationHookOptions<ReorderTemplatesMutation, ReorderTemplatesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReorderTemplatesMutation, ReorderTemplatesMutationVariables>(ReorderTemplatesDocument, options);
      }
export type ReorderTemplatesMutationHookResult = ReturnType<typeof useReorderTemplatesMutation>;
export type ReorderTemplatesMutationResult = Apollo.MutationResult<ReorderTemplatesMutation>;
export type ReorderTemplatesMutationOptions = Apollo.BaseMutationOptions<ReorderTemplatesMutation, ReorderTemplatesMutationVariables>;
export const RestoreTemplateDocument = gql`
    mutation restoreTemplate($templateId: ID!) {
  restoreTemplate(templateId: $templateId) {
    id
    name
    description
    category {
      id
    }
    order
    created_at
    trashed_at
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
    id
    name
    description
    image_url
    category {
      id
    }
    order
    created_at
    updated_at
    trashed_at
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
export const UpdateTemplateWithImageDocument = gql`
    mutation updateTemplateWithImage($id: ID!, $input: UpdateTemplateWithImageInput!) {
  updateTemplateWithImage(id: $id, input: $input) {
    id
    name
    description
    image_url
    category {
      id
    }
    order
    created_at
    updated_at
    trashed_at
  }
}
    `;
export type UpdateTemplateWithImageMutationFn = Apollo.MutationFunction<UpdateTemplateWithImageMutation, UpdateTemplateWithImageMutationVariables>;

/**
 * __useUpdateTemplateWithImageMutation__
 *
 * To run a mutation, you first call `useUpdateTemplateWithImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTemplateWithImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTemplateWithImageMutation, { data, loading, error }] = useUpdateTemplateWithImageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTemplateWithImageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTemplateWithImageMutation, UpdateTemplateWithImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTemplateWithImageMutation, UpdateTemplateWithImageMutationVariables>(UpdateTemplateWithImageDocument, options);
      }
export type UpdateTemplateWithImageMutationHookResult = ReturnType<typeof useUpdateTemplateWithImageMutation>;
export type UpdateTemplateWithImageMutationResult = Apollo.MutationResult<UpdateTemplateWithImageMutation>;
export type UpdateTemplateWithImageMutationOptions = Apollo.BaseMutationOptions<UpdateTemplateWithImageMutation, UpdateTemplateWithImageMutationVariables>;
export const CreateTemplateCategoryDocument = gql`
    mutation createTemplateCategory($input: CreateTemplateCategoryInput!) {
  createTemplateCategory(input: $input) {
    id
    name
    description
    special_type
    parentCategory {
      id
    }
    order
    created_at
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
    mutation deleteTemplateCategory($id: ID!) {
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
export const ReorderTemplateCategoriesDocument = gql`
    mutation reorderTemplateCategories($input: [ReorderCategoriesInput!]!) {
  reorderTemplateCategories(input: $input) {
    id
    name
    special_type
    parentCategory {
      id
    }
    order
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
export const UpdateTemplateCategoryDocument = gql`
    mutation updateTemplateCategory($id: ID!, $input: UpdateTemplateCategoryInput!) {
  updateTemplateCategory(id: $id, input: $input) {
    id
    name
    description
    order
    parentCategory {
      id
    }
    special_type
    created_at
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
export function refetchMeQuery(variables?: MeQueryVariables) {
      return { query: MeDocument, variables: variables }
    }
export const StudentDocument = gql`
    query student($id: ID!) {
  student(id: $id) {
    id
    name
    gender
    nationality
    date_of_birth
    email
    phone_number
    certificates {
      id
      release_date
      verification_code
      template {
        id
        name
      }
      recipientGroup {
        id
        name
      }
    }
    created_at
    updated_at
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
    query students($birth_date: DateTime, $birth_date_after: DateTime, $birth_date_before: DateTime, $birth_date_from: DateTime, $birth_date_is_empty: Boolean, $birth_date_is_not_empty: Boolean, $birth_date_not: DateTime, $birth_date_on_or_after: DateTime, $birth_date_on_or_before: DateTime, $birth_date_to: DateTime, $created_at: DateTime, $created_at_after: DateTime, $created_at_before: DateTime, $created_at_from: DateTime, $created_at_is_empty: Boolean, $created_at_is_not_empty: Boolean, $created_at_not: DateTime, $created_at_on_or_after: DateTime, $created_at_on_or_before: DateTime, $created_at_to: DateTime, $email: String, $email_ends_with: String, $email_equals: String, $email_is_empty: Boolean, $email_is_not_empty: Boolean, $email_not_contains: String, $email_not_equals: String, $email_starts_with: String, $first: Int!, $gender: StudentGender, $name: String, $name_ends_with: String, $name_equals: String, $name_is_empty: Boolean, $name_is_not_empty: Boolean, $name_not_contains: String, $name_not_equals: String, $name_starts_with: String, $nationality: CountryCode, $orderBy: [OrderByClause!], $page: Int, $phone_number: String) {
  students(
    birth_date: $birth_date
    birth_date_after: $birth_date_after
    birth_date_before: $birth_date_before
    birth_date_from: $birth_date_from
    birth_date_is_empty: $birth_date_is_empty
    birth_date_is_not_empty: $birth_date_is_not_empty
    birth_date_not: $birth_date_not
    birth_date_on_or_after: $birth_date_on_or_after
    birth_date_on_or_before: $birth_date_on_or_before
    birth_date_to: $birth_date_to
    created_at: $created_at
    created_at_after: $created_at_after
    created_at_before: $created_at_before
    created_at_from: $created_at_from
    created_at_is_empty: $created_at_is_empty
    created_at_is_not_empty: $created_at_is_not_empty
    created_at_not: $created_at_not
    created_at_on_or_after: $created_at_on_or_after
    created_at_on_or_before: $created_at_on_or_before
    created_at_to: $created_at_to
    email: $email
    email_ends_with: $email_ends_with
    email_equals: $email_equals
    email_is_empty: $email_is_empty
    email_is_not_empty: $email_is_not_empty
    email_not_contains: $email_not_contains
    email_not_equals: $email_not_equals
    email_starts_with: $email_starts_with
    first: $first
    gender: $gender
    name: $name
    name_ends_with: $name_ends_with
    name_equals: $name_equals
    name_is_empty: $name_is_empty
    name_is_not_empty: $name_is_not_empty
    name_not_contains: $name_not_contains
    name_not_equals: $name_not_equals
    name_starts_with: $name_starts_with
    nationality: $nationality
    orderBy: $orderBy
    page: $page
    phone_number: $phone_number
  ) {
    data {
      id
      name
      email
      gender
      nationality
      date_of_birth
      phone_number
      created_at
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
 *      birth_date: // value for 'birth_date'
 *      birth_date_after: // value for 'birth_date_after'
 *      birth_date_before: // value for 'birth_date_before'
 *      birth_date_from: // value for 'birth_date_from'
 *      birth_date_is_empty: // value for 'birth_date_is_empty'
 *      birth_date_is_not_empty: // value for 'birth_date_is_not_empty'
 *      birth_date_not: // value for 'birth_date_not'
 *      birth_date_on_or_after: // value for 'birth_date_on_or_after'
 *      birth_date_on_or_before: // value for 'birth_date_on_or_before'
 *      birth_date_to: // value for 'birth_date_to'
 *      created_at: // value for 'created_at'
 *      created_at_after: // value for 'created_at_after'
 *      created_at_before: // value for 'created_at_before'
 *      created_at_from: // value for 'created_at_from'
 *      created_at_is_empty: // value for 'created_at_is_empty'
 *      created_at_is_not_empty: // value for 'created_at_is_not_empty'
 *      created_at_not: // value for 'created_at_not'
 *      created_at_on_or_after: // value for 'created_at_on_or_after'
 *      created_at_on_or_before: // value for 'created_at_on_or_before'
 *      created_at_to: // value for 'created_at_to'
 *      email: // value for 'email'
 *      email_ends_with: // value for 'email_ends_with'
 *      email_equals: // value for 'email_equals'
 *      email_is_empty: // value for 'email_is_empty'
 *      email_is_not_empty: // value for 'email_is_not_empty'
 *      email_not_contains: // value for 'email_not_contains'
 *      email_not_equals: // value for 'email_not_equals'
 *      email_starts_with: // value for 'email_starts_with'
 *      first: // value for 'first'
 *      gender: // value for 'gender'
 *      name: // value for 'name'
 *      name_ends_with: // value for 'name_ends_with'
 *      name_equals: // value for 'name_equals'
 *      name_is_empty: // value for 'name_is_empty'
 *      name_is_not_empty: // value for 'name_is_not_empty'
 *      name_not_contains: // value for 'name_not_contains'
 *      name_not_equals: // value for 'name_not_equals'
 *      name_starts_with: // value for 'name_starts_with'
 *      nationality: // value for 'nationality'
 *      orderBy: // value for 'orderBy'
 *      page: // value for 'page'
 *      phone_number: // value for 'phone_number'
 *   },
 * });
 */
export function useStudentsQuery(baseOptions: Apollo.QueryHookOptions<StudentsQuery, StudentsQueryVariables> & ({ variables: StudentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
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
export function refetchStudentsQuery(variables: StudentsQueryVariables) {
      return { query: StudentsDocument, variables: variables }
    }
export const TemplateDocument = gql`
    query template($id: ID!) {
  template(id: $id) {
    id
    name
    description
    image_url
    category {
      id
    }
    order
    created_at
    updated_at
    trashed_at
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
    query templates($first: Int!, $page: Int) {
  templates(first: $first, page: $page) {
    data {
      id
      name
      description
      image_url
      category {
        id
      }
      order
      created_at
      trashed_at
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
 *      first: // value for 'first'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useTemplatesQuery(baseOptions: Apollo.QueryHookOptions<TemplatesQuery, TemplatesQueryVariables> & ({ variables: TemplatesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
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
export function refetchTemplatesQuery(variables: TemplatesQueryVariables) {
      return { query: TemplatesDocument, variables: variables }
    }
export const DeletionTemplateCategoryDocument = gql`
    query deletionTemplateCategory {
  deletionTemplateCategory {
    id
    name
    description
    special_type
    templates {
      id
      name
      description
      image_url
      order
      created_at
      trashed_at
      updated_at
    }
    created_at
    updated_at
  }
}
    `;

/**
 * __useDeletionTemplateCategoryQuery__
 *
 * To run a query within a React component, call `useDeletionTemplateCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDeletionTemplateCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDeletionTemplateCategoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useDeletionTemplateCategoryQuery(baseOptions?: Apollo.QueryHookOptions<DeletionTemplateCategoryQuery, DeletionTemplateCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DeletionTemplateCategoryQuery, DeletionTemplateCategoryQueryVariables>(DeletionTemplateCategoryDocument, options);
      }
export function useDeletionTemplateCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DeletionTemplateCategoryQuery, DeletionTemplateCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DeletionTemplateCategoryQuery, DeletionTemplateCategoryQueryVariables>(DeletionTemplateCategoryDocument, options);
        }
export function useDeletionTemplateCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DeletionTemplateCategoryQuery, DeletionTemplateCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DeletionTemplateCategoryQuery, DeletionTemplateCategoryQueryVariables>(DeletionTemplateCategoryDocument, options);
        }
export type DeletionTemplateCategoryQueryHookResult = ReturnType<typeof useDeletionTemplateCategoryQuery>;
export type DeletionTemplateCategoryLazyQueryHookResult = ReturnType<typeof useDeletionTemplateCategoryLazyQuery>;
export type DeletionTemplateCategorySuspenseQueryHookResult = ReturnType<typeof useDeletionTemplateCategorySuspenseQuery>;
export type DeletionTemplateCategoryQueryResult = Apollo.QueryResult<DeletionTemplateCategoryQuery, DeletionTemplateCategoryQueryVariables>;
export function refetchDeletionTemplateCategoryQuery(variables?: DeletionTemplateCategoryQueryVariables) {
      return { query: DeletionTemplateCategoryDocument, variables: variables }
    }
export const FlatTemplateCategoriesDocument = gql`
    query flatTemplateCategories {
  flatTemplateCategories {
    id
    name
    description
    special_type
    parentCategory {
      id
    }
    order
    templates {
      id
      name
      description
      image_url
      order
      trashed_at
      created_at
      updated_at
    }
    created_at
    updated_at
  }
}
    `;

/**
 * __useFlatTemplateCategoriesQuery__
 *
 * To run a query within a React component, call `useFlatTemplateCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFlatTemplateCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFlatTemplateCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useFlatTemplateCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<FlatTemplateCategoriesQuery, FlatTemplateCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FlatTemplateCategoriesQuery, FlatTemplateCategoriesQueryVariables>(FlatTemplateCategoriesDocument, options);
      }
export function useFlatTemplateCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FlatTemplateCategoriesQuery, FlatTemplateCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FlatTemplateCategoriesQuery, FlatTemplateCategoriesQueryVariables>(FlatTemplateCategoriesDocument, options);
        }
export function useFlatTemplateCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FlatTemplateCategoriesQuery, FlatTemplateCategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FlatTemplateCategoriesQuery, FlatTemplateCategoriesQueryVariables>(FlatTemplateCategoriesDocument, options);
        }
export type FlatTemplateCategoriesQueryHookResult = ReturnType<typeof useFlatTemplateCategoriesQuery>;
export type FlatTemplateCategoriesLazyQueryHookResult = ReturnType<typeof useFlatTemplateCategoriesLazyQuery>;
export type FlatTemplateCategoriesSuspenseQueryHookResult = ReturnType<typeof useFlatTemplateCategoriesSuspenseQuery>;
export type FlatTemplateCategoriesQueryResult = Apollo.QueryResult<FlatTemplateCategoriesQuery, FlatTemplateCategoriesQueryVariables>;
export function refetchFlatTemplateCategoriesQuery(variables?: FlatTemplateCategoriesQueryVariables) {
      return { query: FlatTemplateCategoriesDocument, variables: variables }
    }
export const MainTemplateCategoryDocument = gql`
    query mainTemplateCategory {
  mainTemplateCategory {
    id
    name
    description
    special_type
    templates {
      id
      name
      image_url
      description
      order
      created_at
      updated_at
    }
    created_at
    updated_at
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
export const TemplateCategoriesDocument = gql`
    query templateCategories($first: Int!, $page: Int) {
  templateCategories(first: $first, page: $page) {
    data {
      id
      name
      description
      special_type
      parentCategory {
        id
      }
      order
      created_at
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
export function refetchTemplateCategoriesQuery(variables: TemplateCategoriesQueryVariables) {
      return { query: TemplateCategoriesDocument, variables: variables }
    }
export const TemplateCategoryDocument = gql`
    query templateCategory($id: ID!) {
  templateCategory(id: $id) {
    id
    name
    description
    parentCategory {
      id
    }
    order
    special_type
    created_at
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
export function refetchTemplateCategoryQuery(variables: TemplateCategoryQueryVariables) {
      return { query: TemplateCategoryDocument, variables: variables }
    }
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
export function refetchUserQuery(variables?: UserQueryVariables) {
      return { query: UserDocument, variables: variables }
    }
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
export function refetchUsersQuery(variables: UsersQueryVariables) {
      return { query: UsersDocument, variables: variables }
    }
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