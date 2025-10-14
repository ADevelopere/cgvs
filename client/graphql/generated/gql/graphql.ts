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
  /** A type representing a validated email address */
  Email: { input: any; output: any; }
  /** A type representing a validated phone number */
  PhoneNumber: { input: any; output: any; }
};

export type BulkOperationFailure = {
  __typename?: 'BulkOperationFailure';
  error?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
};

export type BulkOperationResult = {
  __typename?: 'BulkOperationResult';
  failureCount?: Maybe<Scalars['Int']['output']>;
  failures?: Maybe<Array<BulkOperationFailure>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  successCount?: Maybe<Scalars['Int']['output']>;
  successfulItems?: Maybe<Array<StorageObject>>;
};

export type ContentType =
  | 'DOC'
  | 'DOCX'
  | 'GIF'
  | 'JPEG'
  | 'MP3'
  | 'MP4'
  | 'PDF'
  | 'PNG'
  | 'RAR'
  | 'TXT'
  | 'WAV'
  | 'WEBP'
  | 'XLS'
  | 'XLSX'
  | 'ZIP';

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

export type DirectoryInfo = StorageObject & {
  __typename?: 'DirectoryInfo';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  fileCount?: Maybe<Scalars['Int']['output']>;
  folderCount?: Maybe<Scalars['Int']['output']>;
  isFromBucket?: Maybe<Scalars['Boolean']['output']>;
  isProtected: Scalars['Boolean']['output'];
  lastModified?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  permissions?: Maybe<DirectoryPermissions>;
  protectChildren?: Maybe<Scalars['Boolean']['output']>;
  totalSize?: Maybe<Scalars['Int']['output']>;
};

export type DirectoryPermissions = {
  __typename?: 'DirectoryPermissions';
  allowCreateSubDirs?: Maybe<Scalars['Boolean']['output']>;
  allowDelete?: Maybe<Scalars['Boolean']['output']>;
  allowDeleteFiles?: Maybe<Scalars['Boolean']['output']>;
  allowMove?: Maybe<Scalars['Boolean']['output']>;
  allowMoveFiles?: Maybe<Scalars['Boolean']['output']>;
  allowUploads?: Maybe<Scalars['Boolean']['output']>;
};

export type DirectoryPermissionsInput = {
  allowCreateSubDirs: Scalars['Boolean']['input'];
  allowDelete: Scalars['Boolean']['input'];
  allowDeleteFiles: Scalars['Boolean']['input'];
  allowMove: Scalars['Boolean']['input'];
  allowMoveFiles: Scalars['Boolean']['input'];
  allowUploads: Scalars['Boolean']['input'];
};

export type DirectoryPermissionsUpdateInput = {
  path: Scalars['String']['input'];
  permissions: DirectoryPermissionsInput;
};

export type FileInfo = StorageObject & {
  __typename?: 'FileInfo';
  contentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  directoryPath?: Maybe<Scalars['String']['output']>;
  fileType?: Maybe<FileType>;
  isFromBucket?: Maybe<Scalars['Boolean']['output']>;
  isInUse?: Maybe<Scalars['Boolean']['output']>;
  isProtected: Scalars['Boolean']['output'];
  isPublic?: Maybe<Scalars['Boolean']['output']>;
  lastModified?: Maybe<Scalars['DateTime']['output']>;
  md5Hash?: Maybe<Scalars['String']['output']>;
  mediaLink?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  url: Scalars['String']['output'];
  usages?: Maybe<Array<FileUsageInfo>>;
};

export type FileOperationResult = {
  __typename?: 'FileOperationResult';
  data?: Maybe<StorageObject>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type FileRenameInput = {
  currentPath: Scalars['String']['input'];
  newName: Scalars['String']['input'];
};

export type FileSortField =
  | 'CREATED'
  | 'MODIFIED'
  | 'NAME'
  | 'SIZE'
  | 'TYPE';

export type FileType =
  | 'ARCHIVE'
  | 'AUDIO'
  | 'DOCUMENT'
  | 'IMAGE'
  | 'OTHER'
  | 'VIDEO';

export type FileTypeBreakdown = {
  __typename?: 'FileTypeBreakdown';
  count?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['String']['output']>;
  type?: Maybe<FileType>;
};

export type FileUsageCheckInput = {
  path: Scalars['String']['input'];
};

export type FileUsageInfo = {
  __typename?: 'FileUsageInfo';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  filePath?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  referenceId?: Maybe<Scalars['String']['output']>;
  referenceTable?: Maybe<Scalars['String']['output']>;
  usageType?: Maybe<Scalars['String']['output']>;
};

export type FileUsageResult = {
  __typename?: 'FileUsageResult';
  canDelete?: Maybe<Scalars['Boolean']['output']>;
  deleteBlockReason?: Maybe<Scalars['String']['output']>;
  isInUse?: Maybe<Scalars['Boolean']['output']>;
  usages?: Maybe<Array<FileUsageInfo>>;
};

export type FilesListInput = {
  fileType?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  path: Scalars['String']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<FileSortField>;
  sortDirection?: InputMaybe<OrderSortDirection>;
};

export type FolderCreateInput = {
  path: Scalars['String']['input'];
  permissions?: InputMaybe<DirectoryPermissionsInput>;
  protectChildren?: InputMaybe<Scalars['Boolean']['input']>;
  protected?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Gender =
  | 'FEMALE'
  | 'MALE'
  | 'OTHER';

export type LoginInput = {
  email: Scalars['Email']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  copyStorageItems?: Maybe<BulkOperationResult>;
  createFolder?: Maybe<FileOperationResult>;
  createRecipient: TemplateRecipient;
  createRecipients: Array<TemplateRecipient>;
  createStudent?: Maybe<Student>;
  createTemplate?: Maybe<Template>;
  createTemplateCategory: TemplateCategory;
  createTemplateDateVariable?: Maybe<TemplateDateVariable>;
  createTemplateNumberVariable?: Maybe<TemplateNumberVariable>;
  createTemplateRecipientGroup?: Maybe<TemplateRecipientGroup>;
  createTemplateSelectVariable?: Maybe<TemplateSelectVariable>;
  createTemplateTextVariable?: Maybe<TemplateTextVariable>;
  deleteFile?: Maybe<FileOperationResult>;
  deleteRecipient: TemplateRecipient;
  deleteRecipients: Array<TemplateRecipient>;
  deleteStorageItems?: Maybe<BulkOperationResult>;
  deleteStudent?: Maybe<Student>;
  deleteTemplate?: Maybe<Template>;
  deleteTemplateCategory: TemplateCategory;
  deleteTemplateRecipientGroup?: Maybe<TemplateRecipientGroup>;
  deleteTemplateVariable?: Maybe<TemplateVariable>;
  generateUploadSignedUrl?: Maybe<Scalars['String']['output']>;
  login?: Maybe<LoginResponse>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  moveStorageItems?: Maybe<BulkOperationResult>;
  partiallyUpdateStudent?: Maybe<Student>;
  refreshToken?: Maybe<RefreshTokenResponse>;
  renameFile?: Maybe<FileOperationResult>;
  setStorageItemProtection?: Maybe<FileOperationResult>;
  suspendTemplate?: Maybe<Template>;
  unsuspendTemplate?: Maybe<Template>;
  updateDirectoryPermissions?: Maybe<FileOperationResult>;
  updateTemplate?: Maybe<Template>;
  updateTemplateCategory: TemplateCategory;
  updateTemplateDateVariable?: Maybe<TemplateDateVariable>;
  updateTemplateNumberVariable?: Maybe<TemplateNumberVariable>;
  updateTemplateRecipientGroup?: Maybe<TemplateRecipientGroup>;
  updateTemplateSelectVariable?: Maybe<TemplateSelectVariable>;
  updateTemplateTextVariable?: Maybe<TemplateTextVariable>;
};


export type MutationCopyStorageItemsArgs = {
  input: StorageItemsCopyInput;
};


export type MutationCreateFolderArgs = {
  input: FolderCreateInput;
};


export type MutationCreateRecipientArgs = {
  input: TemplateRecipientCreateInput;
};


export type MutationCreateRecipientsArgs = {
  input: TemplateRecipientCreateListInput;
};


export type MutationCreateStudentArgs = {
  input: StudentCreateInput;
};


export type MutationCreateTemplateArgs = {
  input: TemplateCreateInput;
};


export type MutationCreateTemplateCategoryArgs = {
  input: TemplateCategoryCreateInput;
};


export type MutationCreateTemplateDateVariableArgs = {
  input: TemplateDateVariableCreateInput;
};


export type MutationCreateTemplateNumberVariableArgs = {
  input: TemplateNumberVariableCreateInput;
};


export type MutationCreateTemplateRecipientGroupArgs = {
  input: TemplateRecipientGroupCreateInput;
};


export type MutationCreateTemplateSelectVariableArgs = {
  input: TemplateSelectVariableCreateInput;
};


export type MutationCreateTemplateTextVariableArgs = {
  input: TemplateTextVariableCreateInput;
};


export type MutationDeleteFileArgs = {
  path: Scalars['String']['input'];
};


export type MutationDeleteRecipientArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteRecipientsArgs = {
  ids: Array<Scalars['Int']['input']>;
};


export type MutationDeleteStorageItemsArgs = {
  input: StorageItemsDeleteInput;
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


export type MutationDeleteTemplateRecipientGroupArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteTemplateVariableArgs = {
  id: Scalars['Int']['input'];
};


export type MutationGenerateUploadSignedUrlArgs = {
  input: UploadSignedUrlGenerateInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMoveStorageItemsArgs = {
  input: StorageItemsMoveInput;
};


export type MutationPartiallyUpdateStudentArgs = {
  input: PartialStudentUpdateInput;
};


export type MutationRenameFileArgs = {
  input: FileRenameInput;
};


export type MutationSetStorageItemProtectionArgs = {
  input: StorageItemProtectionUpdateInput;
};


export type MutationSuspendTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUnsuspendTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateDirectoryPermissionsArgs = {
  input: DirectoryPermissionsUpdateInput;
};


export type MutationUpdateTemplateArgs = {
  input: TemplateUpdateInput;
};


export type MutationUpdateTemplateCategoryArgs = {
  input: TemplateCategoryUpdateInput;
};


export type MutationUpdateTemplateDateVariableArgs = {
  input: TemplateDateVariableUpdateInput;
};


export type MutationUpdateTemplateNumberVariableArgs = {
  input: TemplateNumberVariableUpdateInput;
};


export type MutationUpdateTemplateRecipientGroupArgs = {
  input: TemplateRecipientGroupUpdateInput;
};


export type MutationUpdateTemplateSelectVariableArgs = {
  input: TemplateSelectVariableUpdateInput;
};


export type MutationUpdateTemplateTextVariableArgs = {
  input: TemplateTextVariableUpdateInput;
};

export type OrderSortDirection =
  | 'ASC'
  | 'DESC';

export type PageInfo = {
  __typename?: 'PageInfo';
  count: Scalars['Int']['output'];
  currentPage: Scalars['Int']['output'];
  firstItem?: Maybe<Scalars['Int']['output']>;
  hasMorePages: Scalars['Boolean']['output'];
  lastItem?: Maybe<Scalars['Int']['output']>;
  lastPage: Scalars['Int']['output'];
  perPage: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
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

export type PartialStudentUpdateInput = {
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  gender?: InputMaybe<Gender>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<CountryCode>;
  phoneNumber?: InputMaybe<Scalars['PhoneNumber']['input']>;
};

export type Query = {
  __typename?: 'Query';
  categoryChildren: Array<TemplateCategory>;
  directoryChildren?: Maybe<Array<DirectoryInfo>>;
  fileInfo?: Maybe<FileInfo>;
  fileUsage?: Maybe<FileUsageResult>;
  folderInfo?: Maybe<DirectoryInfo>;
  listFiles?: Maybe<StorageObjectList>;
  mainTemplateCategory: TemplateCategory;
  me?: Maybe<User>;
  recipient?: Maybe<TemplateRecipient>;
  recipientsByGroupId: Array<TemplateRecipient>;
  recipientsByStudentId: Array<TemplateRecipient>;
  searchFiles?: Maybe<StorageObjectList>;
  searchTemplateCategories: Array<TemplateCategoryWithParentTree>;
  storageStats?: Maybe<StorageStats>;
  student?: Maybe<Student>;
  students: StudentsWithFiltersResponse;
  studentsInRecipientGroup: StudentsWithFiltersResponse;
  studentsNotInRecipientGroup: StudentsWithFiltersResponse;
  suspendedTemplates?: Maybe<Array<Template>>;
  suspensionTemplateCategory: TemplateCategory;
  template?: Maybe<Template>;
  templateCategories: Array<TemplateCategory>;
  templateCategory?: Maybe<TemplateCategory>;
  templateRecipientGroupById?: Maybe<TemplateRecipientGroup>;
  templateRecipientGroupsByTemplateId?: Maybe<Array<TemplateRecipientGroup>>;
  templateVariable?: Maybe<TemplateVariable>;
  templateVariablesByTemplateId?: Maybe<Array<TemplateVariable>>;
  templates?: Maybe<PaginatedTemplatesResponse>;
  templatesByCategoryId?: Maybe<TemplatesWithFiltersResponse>;
  templatesConfigs?: Maybe<TemplatesConfigs>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryCategoryChildrenArgs = {
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDirectoryChildrenArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFileInfoArgs = {
  path: Scalars['String']['input'];
};


export type QueryFileUsageArgs = {
  input: FileUsageCheckInput;
};


export type QueryFolderInfoArgs = {
  path: Scalars['String']['input'];
};


export type QueryListFilesArgs = {
  input: FilesListInput;
};


export type QueryRecipientArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRecipientsByGroupIdArgs = {
  recipientGroupId: Scalars['Int']['input'];
};


export type QueryRecipientsByStudentIdArgs = {
  studentId: Scalars['Int']['input'];
};


export type QuerySearchFilesArgs = {
  fileType?: InputMaybe<Scalars['String']['input']>;
  folder?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  searchTerm: Scalars['String']['input'];
};


export type QuerySearchTemplateCategoriesArgs = {
  includeParentTree?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  searchTerm: Scalars['String']['input'];
};


export type QueryStorageStatsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStudentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryStudentsArgs = {
  filterArgs?: InputMaybe<StudentFilterArgs>;
  orderBy?: InputMaybe<Array<StudentsOrderByClause>>;
  paginationArgs?: InputMaybe<PaginationArgs>;
};


export type QueryStudentsInRecipientGroupArgs = {
  filterArgs?: InputMaybe<StudentFilterArgs>;
  orderBy?: InputMaybe<Array<StudentsOrderByClause>>;
  paginationArgs?: InputMaybe<PaginationArgs>;
  recipientGroupId: Scalars['Int']['input'];
};


export type QueryStudentsNotInRecipientGroupArgs = {
  filterArgs?: InputMaybe<StudentFilterArgs>;
  orderBy?: InputMaybe<Array<StudentsOrderByClause>>;
  paginationArgs?: InputMaybe<PaginationArgs>;
  recipientGroupId: Scalars['Int']['input'];
};


export type QueryTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplateCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplateRecipientGroupByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplateRecipientGroupsByTemplateIdArgs = {
  templateId: Scalars['Int']['input'];
};


export type QueryTemplateVariableArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplateVariablesByTemplateIdArgs = {
  templateId: Scalars['Int']['input'];
};


export type QueryTemplatesArgs = {
  pagination?: InputMaybe<PaginationArgs>;
};


export type QueryTemplatesByCategoryIdArgs = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  filterArgs?: InputMaybe<TemplateFilterArgs>;
  orderBy?: InputMaybe<Array<TemplatesOrderByClause>>;
  paginationArgs?: InputMaybe<PaginationArgs>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type RefreshTokenResponse = {
  __typename?: 'RefreshTokenResponse';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type StorageItemProtectionUpdateInput = {
  isProtected: Scalars['Boolean']['input'];
  path: Scalars['String']['input'];
  protectChildren?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StorageItemsCopyInput = {
  destinationPath: Scalars['String']['input'];
  sourcePaths: Array<Scalars['String']['input']>;
};

export type StorageItemsDeleteInput = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  paths: Array<Scalars['String']['input']>;
};

export type StorageItemsMoveInput = {
  destinationPath: Scalars['String']['input'];
  sourcePaths: Array<Scalars['String']['input']>;
};

export type StorageObject = {
  isProtected: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type StorageObjectList = {
  __typename?: 'StorageObjectList';
  hasMore: Scalars['Boolean']['output'];
  items?: Maybe<Array<StorageObject>>;
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type StorageStats = {
  __typename?: 'StorageStats';
  directoryCount?: Maybe<Scalars['Int']['output']>;
  fileTypeBreakdown?: Maybe<Array<FileTypeBreakdown>>;
  totalFiles?: Maybe<Scalars['Int']['output']>;
  totalSize?: Maybe<Scalars['String']['output']>;
};

export type Student = {
  __typename?: 'Student';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Gender>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  nationality?: Maybe<CountryCode>;
  phoneNumber?: Maybe<Scalars['PhoneNumber']['output']>;
  recipientRecords?: Maybe<Array<TemplateRecipient>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type StudentCreateInput = {
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  gender?: InputMaybe<Gender>;
  name: Scalars['String']['input'];
  nationality?: InputMaybe<CountryCode>;
  phoneNumber?: InputMaybe<Scalars['PhoneNumber']['input']>;
};

export type StudentFilterArgs = {
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  birthDateAfter?: InputMaybe<Scalars['DateTime']['input']>;
  birthDateBefore?: InputMaybe<Scalars['DateTime']['input']>;
  birthDateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  birthDateIsEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  birthDateIsNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  birthDateNot?: InputMaybe<Scalars['DateTime']['input']>;
  birthDateOnOrAfter?: InputMaybe<Scalars['DateTime']['input']>;
  birthDateOnOrBefore?: InputMaybe<Scalars['DateTime']['input']>;
  birthDateTo?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtBefore?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtFrom?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtIsEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtIsNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  createdAtNot?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtOnOrAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtOnOrBefore?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTo?: InputMaybe<Scalars['DateTime']['input']>;
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

export type StudentsOrderByClause = {
  column: StudentsOrderByColumn;
  order?: InputMaybe<OrderSortDirection>;
};

export type StudentsOrderByColumn =
  | 'CREATED_AT'
  | 'DATE_OF_BIRTH'
  | 'EMAIL'
  | 'GENDER'
  | 'ID'
  | 'NAME'
  | 'UPDATED_AT';

export type StudentsWithFiltersResponse = {
  __typename?: 'StudentsWithFiltersResponse';
  data: Array<Student>;
  pageInfo: PageInfo;
};

export type Template = {
  __typename?: 'Template';
  category?: Maybe<TemplateCategory>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  imageFile?: Maybe<FileInfo>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  preSuspensionCategory?: Maybe<TemplateCategory>;
  recipientGroups?: Maybe<Array<TemplateRecipientGroup>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  variables?: Maybe<Array<TemplateVariable>>;
};

export type TemplateCategory = {
  __typename?: 'TemplateCategory';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  parentCategory?: Maybe<TemplateCategory>;
  specialType?: Maybe<Scalars['String']['output']>;
  subCategories?: Maybe<Array<TemplateCategory>>;
  templates?: Maybe<Array<Template>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
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

export type TemplateCategoryWithParentTree = {
  __typename?: 'TemplateCategoryWithParentTree';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  parentTree: Array<Scalars['Int']['output']>;
  specialType?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TemplateCreateInput = {
  categoryId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type TemplateDateVariable = TemplateVariable & {
  __typename?: 'TemplateDateVariable';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  maxDate?: Maybe<Scalars['DateTime']['output']>;
  minDate?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  previewValue?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  template?: Maybe<Template>;
  type?: Maybe<TemplateVariableType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TemplateDateVariableCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  maxDate?: InputMaybe<Scalars['DateTime']['input']>;
  minDate?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['DateTime']['input']>;
  required?: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

export type TemplateDateVariableUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  maxDate?: InputMaybe<Scalars['DateTime']['input']>;
  minDate?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['DateTime']['input']>;
  required?: Scalars['Boolean']['input'];
};

export type TemplateFilterArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type TemplateNumberVariable = TemplateVariable & {
  __typename?: 'TemplateNumberVariable';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  decimalPlaces?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  maxValue?: Maybe<Scalars['Float']['output']>;
  minValue?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  previewValue?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  template?: Maybe<Template>;
  type?: Maybe<TemplateVariableType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TemplateNumberVariableCreateInput = {
  decimalPlaces?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  maxValue?: InputMaybe<Scalars['Float']['input']>;
  minValue?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['Float']['input']>;
  required?: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

export type TemplateNumberVariableUpdateInput = {
  decimalPlaces?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  maxValue?: InputMaybe<Scalars['Float']['input']>;
  minValue?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['Float']['input']>;
  required?: Scalars['Boolean']['input'];
};

export type TemplateRecipient = {
  __typename?: 'TemplateRecipient';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  recipientGroup?: Maybe<TemplateRecipientGroup>;
  recipientGroupId?: Maybe<Scalars['Int']['output']>;
  student?: Maybe<Student>;
  studentId?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TemplateRecipientCreateInput = {
  recipientGroupId: Scalars['Int']['input'];
  studentId: Scalars['Int']['input'];
};

export type TemplateRecipientCreateListInput = {
  recipientGroupId: Scalars['Int']['input'];
  studentIds: Array<Scalars['Int']['input']>;
};

export type TemplateRecipientGroup = {
  __typename?: 'TemplateRecipientGroup';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  recipients?: Maybe<Array<TemplateRecipient>>;
  studentCount?: Maybe<Scalars['Int']['output']>;
  template?: Maybe<Template>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TemplateRecipientGroupCreateInput = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  templateId: Scalars['Int']['input'];
};

export type TemplateRecipientGroupUpdateInput = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type TemplateSelectVariable = TemplateVariable & {
  __typename?: 'TemplateSelectVariable';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  multiple?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<Scalars['String']['output']>>;
  order?: Maybe<Scalars['Int']['output']>;
  previewValue?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  template?: Maybe<Template>;
  type?: Maybe<TemplateVariableType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TemplateSelectVariableCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  multiple?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  options: Array<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required?: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

export type TemplateSelectVariableUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  multiple?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  options: Array<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required?: Scalars['Boolean']['input'];
};

export type TemplateTextVariable = TemplateVariable & {
  __typename?: 'TemplateTextVariable';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  maxLength?: Maybe<Scalars['Int']['output']>;
  minLength?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  pattern?: Maybe<Scalars['String']['output']>;
  previewValue?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  template?: Maybe<Template>;
  type?: Maybe<TemplateVariableType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TemplateTextVariableCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  maxLength?: InputMaybe<Scalars['Int']['input']>;
  minLength?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  pattern?: InputMaybe<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required?: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

export type TemplateTextVariableUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  maxLength?: InputMaybe<Scalars['Int']['input']>;
  minLength?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  pattern?: InputMaybe<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required?: Scalars['Boolean']['input'];
};

export type TemplateUpdateInput = {
  categoryId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type TemplateVariable = {
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  previewValue?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  template?: Maybe<Template>;
  type?: Maybe<TemplateVariableType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TemplateVariableType =
  | 'DATE'
  | 'NUMBER'
  | 'SELECT'
  | 'TEXT';

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

export type TemplatesOrderByClause = {
  column: TemplatesOrderByColumn;
  order?: InputMaybe<OrderSortDirection>;
};

export type TemplatesOrderByColumn =
  | 'CREATED_AT'
  | 'NAME'
  | 'ORDER'
  | 'UPDATED_AT';

export type TemplatesWithFiltersResponse = {
  __typename?: 'TemplatesWithFiltersResponse';
  data: Array<Template>;
  pageInfo: PageInfo;
};

export type UploadLocationPath =
  | 'TEMPLATE_COVERS';

export type UploadSignedUrlGenerateInput = {
  contentMd5: Scalars['String']['input'];
  contentType: ContentType;
  fileSize: Scalars['Int']['input'];
  path: Scalars['String']['input'];
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

export type TemplateCategoryQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TemplateCategoryQuery = { __typename?: 'Query', templateCategory?: { __typename?: 'TemplateCategory', id: number, name?: string | null, description?: string | null, specialType?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type CategoryChildrenQueryVariables = Exact<{
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CategoryChildrenQuery = { __typename?: 'Query', categoryChildren: Array<{ __typename?: 'TemplateCategory', id: number, name?: string | null, description?: string | null, specialType?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null }> };

export type CreateTemplateCategoryMutationVariables = Exact<{
  input: TemplateCategoryCreateInput;
}>;


export type CreateTemplateCategoryMutation = { __typename?: 'Mutation', createTemplateCategory: { __typename?: 'TemplateCategory', id: number, name?: string | null, description?: string | null, specialType?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } };

export type DeleteTemplateCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateCategoryMutation = { __typename?: 'Mutation', deleteTemplateCategory: { __typename?: 'TemplateCategory', id: number, name?: string | null, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } };

export type UpdateTemplateCategoryMutationVariables = Exact<{
  input: TemplateCategoryUpdateInput;
}>;


export type UpdateTemplateCategoryMutation = { __typename?: 'Mutation', updateTemplateCategory: { __typename?: 'TemplateCategory', id: number, name?: string | null, description?: string | null, specialType?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } };

export type TemplatesByCategoryIdQueryVariables = Exact<{
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  paginationArgs?: InputMaybe<PaginationArgs>;
  filterArgs?: InputMaybe<TemplateFilterArgs>;
  orderBy?: InputMaybe<Array<TemplatesOrderByClause> | TemplatesOrderByClause>;
}>;


export type TemplatesByCategoryIdQuery = { __typename?: 'Query', templatesByCategoryId?: { __typename?: 'TemplatesWithFiltersResponse', data: Array<{ __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null }>, pageInfo: { __typename?: 'PageInfo', count: number, currentPage: number, firstItem?: number | null, lastItem?: number | null, hasMorePages: boolean, lastPage: number, perPage: number, total: number } } | null };

export type SuspendedTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type SuspendedTemplatesQuery = { __typename?: 'Query', suspendedTemplates?: Array<{ __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null }> | null };

export type CreateTemplateMutationVariables = Exact<{
  input: TemplateCreateInput;
}>;


export type CreateTemplateMutation = { __typename?: 'Mutation', createTemplate?: { __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type SuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type SuspendTemplateMutation = { __typename?: 'Mutation', suspendTemplate?: { __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type UnsuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type UnsuspendTemplateMutation = { __typename?: 'Mutation', unsuspendTemplate?: { __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type UpdateTemplateMutationVariables = Exact<{
  input: TemplateUpdateInput;
}>;


export type UpdateTemplateMutation = { __typename?: 'Mutation', updateTemplate?: { __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate?: { __typename?: 'Template', id: number, name?: string | null, category?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type SearchTemplateCategoriesQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  includeParentTree?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SearchTemplateCategoriesQuery = { __typename?: 'Query', searchTemplateCategories: Array<{ __typename?: 'TemplateCategoryWithParentTree', id: number, name?: string | null, description?: string | null, specialType?: string | null, order?: number | null, parentTree: Array<number> }> };


export const TemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<TemplateCategoryQuery, TemplateCategoryQueryVariables>;
export const CategoryChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"categoryChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentCategoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryChildren"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"parentCategoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentCategoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CategoryChildrenQuery, CategoryChildrenQueryVariables>;
export const CreateTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateCategoryCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateCategoryMutation, CreateTemplateCategoryMutationVariables>;
export const DeleteTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTemplateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTemplateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTemplateCategoryMutation, DeleteTemplateCategoryMutationVariables>;
export const UpdateTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateCategoryUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateCategoryMutation, UpdateTemplateCategoryMutationVariables>;
export const TemplatesByCategoryIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templatesByCategoryId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationArgs"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateFilterArgs"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplatesOrderByClause"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templatesByCategoryId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"}},{"kind":"Field","name":{"kind":"Name","value":"lastItem"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<TemplatesByCategoryIdQuery, TemplatesByCategoryIdQueryVariables>;
export const SuspendedTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"suspendedTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suspendedTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<SuspendedTemplatesQuery, SuspendedTemplatesQueryVariables>;
export const CreateTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateMutation, CreateTemplateMutationVariables>;
export const SuspendTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"suspendTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suspendTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SuspendTemplateMutation, SuspendTemplateMutationVariables>;
export const UnsuspendTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unsuspendTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsuspendTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UnsuspendTemplateMutation, UnsuspendTemplateMutationVariables>;
export const UpdateTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateMutation, UpdateTemplateMutationVariables>;
export const DeleteTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTemplateMutation, DeleteTemplateMutationVariables>;
export const SearchTemplateCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchTemplateCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeParentTree"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchTemplateCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeParentTree"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeParentTree"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"parentTree"}}]}}]}}]} as unknown as DocumentNode<SearchTemplateCategoriesQuery, SearchTemplateCategoriesQueryVariables>;