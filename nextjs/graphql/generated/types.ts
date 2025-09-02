/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from '@apollo/client';
import * as ApolloReact from '@apollo/client/react';
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
  Long: { input: any; output: any; }
  PhoneNumber: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

/** Result of bulk operations */
export type BulkOperationResult = {
  __typename?: 'BulkOperationResult';
  /** List of error messages for failed items */
  errors: Array<Scalars['String']['output']>;
  /** Number of items that failed */
  failureCount: Scalars['Int']['output'];
  /** Number of items successfully processed */
  successCount: Scalars['Int']['output'];
  /** List of successfully processed items */
  successfulItems: Array<StorageObject>;
};

export type CategorySpecialType =
  | 'Main'
  | 'Suspension';

/** Input for checking file usage */
export type CheckFileUsageInput = {
  /** File path to check */
  filePath: Scalars['String']['input'];
};

/** Supported content types for file uploads. */
export type ContentType =
  | 'GIF'
  | 'JPEG'
  | 'JSON'
  | 'OTF'
  | 'PDF'
  | 'PNG'
  | 'SVG'
  | 'TEXT'
  | 'TTF'
  | 'WEBP'
  | 'WOFF'
  | 'WOFF2';

/** Input for copying files or directories */
export type CopyStorageItemsInput = {
  /** Destination directory path */
  destinationPath: Scalars['String']['input'];
  /** Source paths to copy */
  sourcePaths: Array<Scalars['String']['input']>;
};

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

export type CreateDateTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  maxDate?: InputMaybe<Scalars['LocalDate']['input']>;
  minDate?: InputMaybe<Scalars['LocalDate']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['LocalDate']['input']>;
  required: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

/** Input for creating a folder with permissions */
export type CreateFolderInput = {
  /** The name of the folder */
  name: Scalars['String']['input'];
  /** The path where to create the folder */
  path: Scalars['String']['input'];
  /** Initial permissions for the folder */
  permissions?: InputMaybe<DirectoryPermissionsInput>;
};

export type CreateNumberTemplateVariableInput = {
  decimalPlaces?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  maxValue?: InputMaybe<Scalars['Float']['input']>;
  minValue?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['Float']['input']>;
  required: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

export type CreateSelectTemplateVariableInput = {
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

export type CreateTextTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  maxLength?: InputMaybe<Scalars['Int']['input']>;
  minLength?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  pattern?: InputMaybe<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required: Scalars['Boolean']['input'];
  templateId: Scalars['Int']['input'];
};

export type DateTemplateVariable = TemplateVariable & {
  __typename?: 'DateTemplateVariable';
  createdAt: Scalars['LocalDateTime']['output'];
  datePreviewValue?: Maybe<Scalars['LocalDate']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  maxDate?: Maybe<Scalars['LocalDate']['output']>;
  minDate?: Maybe<Scalars['LocalDate']['output']>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  template?: Maybe<Template>;
  type: TemplateVariableType;
  updatedAt: Scalars['LocalDateTime']['output'];
};

/** Input for bulk deletion */
export type DeleteItemsInput = {
  /** Force deletion even if files are in use (requires admin) */
  force: Scalars['Boolean']['input'];
  /** Paths to delete */
  paths: Array<Scalars['String']['input']>;
};

/** Directory permissions configuration */
export type DirectoryPermissions = {
  __typename?: 'DirectoryPermissions';
  /** Whether subdirectories can be created */
  allowCreateSubdirs: Scalars['Boolean']['output'];
  /** Whether this directory can be deleted */
  allowDelete: Scalars['Boolean']['output'];
  /** Whether files in this directory can be deleted */
  allowDeleteFiles: Scalars['Boolean']['output'];
  /** Whether this directory can be moved */
  allowMove: Scalars['Boolean']['output'];
  /** Whether files in this directory can be moved */
  allowMoveFiles: Scalars['Boolean']['output'];
  /** Whether uploads are allowed to this directory */
  allowUploads: Scalars['Boolean']['output'];
};

/** Directory permissions configuration */
export type DirectoryPermissionsInput = {
  /** Whether subdirectories can be created */
  allowCreateSubdirs: Scalars['Boolean']['input'];
  /** Whether this directory can be deleted */
  allowDelete: Scalars['Boolean']['input'];
  /** Whether files in this directory can be deleted */
  allowDeleteFiles: Scalars['Boolean']['input'];
  /** Whether this directory can be moved */
  allowMove: Scalars['Boolean']['input'];
  /** Whether files in this directory can be moved */
  allowMoveFiles: Scalars['Boolean']['input'];
  /** Whether uploads are allowed to this directory */
  allowUploads: Scalars['Boolean']['input'];
};

/** Enhanced file information with metadata */
export type FileInfo = StorageObject & {
  __typename?: 'FileInfo';
  /** MIME content type */
  contentType?: Maybe<Scalars['String']['output']>;
  /** Creation timestamp */
  created: Scalars['LocalDateTime']['output'];
  /** File type category */
  fileType: FileType;
  /** Whether this file exists only in bucket (not in DB) */
  isFromBucketOnly: Scalars['Boolean']['output'];
  /** Whether the file is currently being used */
  isInUse: Scalars['Boolean']['output'];
  /** Whether the file is protected from deletion */
  isProtected: Scalars['Boolean']['output'];
  /** Whether the file is publicly accessible */
  isPublic: Scalars['Boolean']['output'];
  /** Last modified timestamp */
  lastModified: Scalars['LocalDateTime']['output'];
  /** MD5 hash of the file */
  md5Hash?: Maybe<Scalars['String']['output']>;
  /** Media link for streaming (if applicable) */
  mediaLink?: Maybe<Scalars['String']['output']>;
  /** File name */
  name: Scalars['String']['output'];
  /** Full path in the bucket */
  path: Scalars['String']['output'];
  /** File size in bytes */
  size: Scalars['Long']['output'];
  /** URL for accessing the file */
  url?: Maybe<Scalars['String']['output']>;
  /** List of current usages */
  usages: Array<FileUsageInfo>;
};

/** Result of a file operation */
export type FileOperationResult = {
  __typename?: 'FileOperationResult';
  /** The affected file/folder (if applicable) */
  item?: Maybe<StorageObject>;
  /** Success or error message */
  message: Scalars['String']['output'];
  /** Whether the operation was successful */
  success: Scalars['Boolean']['output'];
};

export type FileSortField =
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

/** File type and its count */
export type FileTypeCount = {
  __typename?: 'FileTypeCount';
  /** Number of files of this type */
  count: Scalars['Int']['output'];
  /** File type */
  type: FileType;
};

/** File usage information */
export type FileUsageInfo = {
  __typename?: 'FileUsageInfo';
  /** When this usage was created */
  created: Scalars['LocalDateTime']['output'];
  /** ID of the entity using this file */
  referenceId: Scalars['Long']['output'];
  /** Table/entity type using this file */
  referenceTable: Scalars['String']['output'];
  /** Type of usage */
  usageType: Scalars['String']['output'];
};

/** Result of checking file usage */
export type FileUsageResult = {
  __typename?: 'FileUsageResult';
  /** Whether the file can be safely deleted */
  canDelete: Scalars['Boolean']['output'];
  /** Reason why file cannot be deleted (if applicable) */
  deleteBlockReason?: Maybe<Scalars['String']['output']>;
  /** Whether the file is currently in use */
  isInUse: Scalars['Boolean']['output'];
  /** List of current usages */
  usages: Array<FileUsageInfo>;
};

/** Folder information */
export type FolderInfo = StorageObject & {
  __typename?: 'FolderInfo';
  /** Creation timestamp */
  created: Scalars['LocalDateTime']['output'];
  /** Number of files in the folder */
  fileCount: Scalars['Int']['output'];
  /** Number of subfolders */
  folderCount: Scalars['Int']['output'];
  /** Whether this directory exists only in bucket (not in DB) */
  isFromBucketOnly: Scalars['Boolean']['output'];
  /** Whether this directory is protected from deletion */
  isProtected: Scalars['Boolean']['output'];
  /** Last modified timestamp */
  lastModified: Scalars['LocalDateTime']['output'];
  /** Folder name */
  name: Scalars['String']['output'];
  /** Full path in the bucket */
  path: Scalars['String']['output'];
  /** Directory permissions */
  permissions: DirectoryPermissions;
  /** Whether children are protected from deletion */
  protectChildren: Scalars['Boolean']['output'];
  /** Total size of all files in the folder */
  totalSize: Scalars['Long']['output'];
};

export type Gender =
  | 'Female'
  | 'Male'
  | 'Other';

/** Input for generating a signed URL for file upload */
export type GenerateUploadSignedUrlInput = {
  /** The content type of the file to be uploaded (e.g., 'image/jpeg', 'application/pdf'). */
  contentType: ContentType;
  /** The name of the file. */
  fileName: Scalars['String']['input'];
  /** The location where the file will be stored. */
  location: UploadLocation;
};

/** Input for listing files with pagination and filtering */
export type ListFilesInput = {
  /** Filter by file type (e.g., 'image', 'document') */
  fileType?: InputMaybe<Scalars['String']['input']>;
  /** Number of items per page */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Page offset */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The folder path to list (empty for root) */
  path: Scalars['String']['input'];
  /** Search term for file names */
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  /** Sort by field */
  sortBy?: InputMaybe<FileSortField>;
  /** Sort direction */
  sortDirection?: InputMaybe<SortDirection>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  message: Scalars['String']['output'];
};

/** Input for moving files or directories */
export type MoveStorageItemsInput = {
  /** Destination directory path */
  destinationPath: Scalars['String']['input'];
  /** Source paths to move */
  sourcePaths: Array<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Copy multiple files/folders to a new location */
  copyStorageItems: BulkOperationResult;
  createDateTemplateVariable: DateTemplateVariable;
  /** Create a new folder */
  createFolder: FileOperationResult;
  createNumberTemplateVariable: NumberTemplateVariable;
  createSelectTemplateVariable: SelectTemplateVariable;
  createStudent: Student;
  createTemplate: Template;
  createTemplateCategory: TemplateCategory;
  createTextTemplateVariable: TextTemplateVariable;
  /** Delete a single file */
  deleteFile: FileOperationResult;
  /** Delete multiple files/folders */
  deleteStorageItems: BulkOperationResult;
  deleteStudent: Student;
  deleteTemplate?: Maybe<Template>;
  deleteTemplateCategory: TemplateCategory;
  deleteTemplateVariable: TemplateVariable;
  /** Generate a signed URL for file upload */
  generateUploadSignedUrl: Scalars['String']['output'];
  /** Login user with email and password */
  login?: Maybe<AuthPayload>;
  /** Logout current user */
  logout: LogoutResponse;
  /** Move multiple files/folders to a new location */
  moveStorageItems: BulkOperationResult;
  partialUpdateStudent: Student;
  /** Refresh the access token using the session cookie */
  refreshToken?: Maybe<AuthPayload>;
  /** Register a new user */
  register?: Maybe<AuthPayload>;
  /** Register file usage to track dependencies */
  registerFileUsage: FileOperationResult;
  /** Rename a file */
  renameFile: FileOperationResult;
  /** Set protection for files or directories */
  setStorageItemProtection: FileOperationResult;
  suspendTemplate?: Maybe<Template>;
  /** Unregister file usage to remove dependencies */
  unregisterFileUsage: FileOperationResult;
  unsuspendTemplate?: Maybe<Template>;
  updateDateTemplateVariable: DateTemplateVariable;
  /** Update directory permissions */
  updateDirectoryPermissions: FileOperationResult;
  updateNumberTemplateVariable: NumberTemplateVariable;
  updateSelectTemplateVariable: SelectTemplateVariable;
  updateTemplate?: Maybe<Template>;
  updateTemplateCategory: TemplateCategory;
  updateTextTemplateVariable: TextTemplateVariable;
};


export type MutationCopyStorageItemsArgs = {
  input: CopyStorageItemsInput;
};


export type MutationCreateDateTemplateVariableArgs = {
  input: CreateDateTemplateVariableInput;
};


export type MutationCreateFolderArgs = {
  input: CreateFolderInput;
};


export type MutationCreateNumberTemplateVariableArgs = {
  input: CreateNumberTemplateVariableInput;
};


export type MutationCreateSelectTemplateVariableArgs = {
  input: CreateSelectTemplateVariableInput;
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
  input: CreateTextTemplateVariableInput;
};


export type MutationDeleteFileArgs = {
  path: Scalars['String']['input'];
};


export type MutationDeleteStorageItemsArgs = {
  input: DeleteItemsInput;
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


export type MutationGenerateUploadSignedUrlArgs = {
  input: GenerateUploadSignedUrlInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMoveStorageItemsArgs = {
  input: MoveStorageItemsInput;
};


export type MutationPartialUpdateStudentArgs = {
  input: PartialUpdateStudentInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRegisterFileUsageArgs = {
  input: RegisterFileUsageInput;
};


export type MutationRenameFileArgs = {
  input: RenameFileInput;
};


export type MutationSetStorageItemProtectionArgs = {
  input: SetStorageItemProtectionInput;
};


export type MutationSuspendTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUnregisterFileUsageArgs = {
  input: UnregisterFileUsageInput;
};


export type MutationUnsuspendTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateDateTemplateVariableArgs = {
  input: UpdateDateTemplateVariableInput;
};


export type MutationUpdateDirectoryPermissionsArgs = {
  input: UpdateDirectoryPermissionsInput;
};


export type MutationUpdateNumberTemplateVariableArgs = {
  input: UpdateNumberTemplateVariableInput;
};


export type MutationUpdateSelectTemplateVariableArgs = {
  input: UpdateSelectTemplateVariableInput;
};


export type MutationUpdateTemplateArgs = {
  input: UpdateTemplateInput;
};


export type MutationUpdateTemplateCategoryArgs = {
  input: UpdateTemplateCategoryInput;
};


export type MutationUpdateTextTemplateVariableArgs = {
  input: UpdateTextTemplateVariableInput;
};

export type NumberTemplateVariable = TemplateVariable & {
  __typename?: 'NumberTemplateVariable';
  createdAt: Scalars['LocalDateTime']['output'];
  decimalPlaces?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  maxValue?: Maybe<Scalars['Float']['output']>;
  minValue?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  numberPreviewValue?: Maybe<Scalars['Float']['output']>;
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  template?: Maybe<Template>;
  type: TemplateVariableType;
  updatedAt: Scalars['LocalDateTime']['output'];
};

export type OrderStudentsByClauseInput = {
  column: OrderStudentsByColumn;
  order: SortDirection;
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

export type PartialUpdateStudentInput = {
  dateOfBirth?: InputMaybe<Scalars['LocalDate']['input']>;
  email?: InputMaybe<Scalars['Email']['input']>;
  gender?: InputMaybe<Gender>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<CountryCode>;
  phoneNumber?: InputMaybe<Scalars['PhoneNumber']['input']>;
};

export type Query = {
  __typename?: 'Query';
  /** Check if a file is currently in use */
  checkFileUsage: FileUsageResult;
  /** Fetch immediate children directories for lazy loading directory tree */
  fetchDirectoryChildren: Array<FolderInfo>;
  getFileInfo?: Maybe<FileInfo>;
  getFolderInfo: FolderInfo;
  /** Get storage statistics */
  getStorageStats: StorageStats;
  /** Check if user is authenticated */
  isAuthenticated: Scalars['Boolean']['output'];
  /** List files and folders with pagination and filtering */
  listFiles: StorageObjectList;
  mainTemplateCategory?: Maybe<TemplateCategory>;
  /** Get current authenticated user */
  me?: Maybe<User>;
  searchFiles: StorageObjectList;
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


export type QueryCheckFileUsageArgs = {
  input: CheckFileUsageInput;
};


export type QueryFetchDirectoryChildrenArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetFileInfoArgs = {
  path: Scalars['String']['input'];
};


export type QueryGetFolderInfoArgs = {
  path: Scalars['String']['input'];
};


export type QueryGetStorageStatsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListFilesArgs = {
  input: ListFilesInput;
};


export type QuerySearchFilesArgs = {
  fileType?: InputMaybe<Scalars['String']['input']>;
  folder?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  searchTerm: Scalars['String']['input'];
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

/** Input for registering file usage */
export type RegisterFileUsageInput = {
  /** File path being used */
  filePath: Scalars['String']['input'];
  /** ID of the entity using this file */
  referenceId: Scalars['Long']['input'];
  /** Table/entity type using this file */
  referenceTable: Scalars['String']['input'];
  /** Type of usage (e.g., 'template_cover', 'certificate_image') */
  usageType: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['Email']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** Input for renaming a file or folder */
export type RenameFileInput = {
  /** The current path of the file/folder */
  currentPath: Scalars['String']['input'];
  /** The new name */
  newName: Scalars['String']['input'];
};

export type SelectTemplateVariable = TemplateVariable & {
  __typename?: 'SelectTemplateVariable';
  createdAt: Scalars['LocalDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  multiple?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  options?: Maybe<Array<Scalars['String']['output']>>;
  order: Scalars['Int']['output'];
  required: Scalars['Boolean']['output'];
  selectPreviewValue?: Maybe<Scalars['String']['output']>;
  template?: Maybe<Template>;
  type: TemplateVariableType;
  updatedAt: Scalars['LocalDateTime']['output'];
};

/** Input for setting file/directory protection */
export type SetStorageItemProtectionInput = {
  /** Whether to protect from deletion */
  isProtected: Scalars['Boolean']['input'];
  /** The file or directory path */
  path: Scalars['String']['input'];
  /** For directories: whether to protect all children (recursive) */
  protectChildren: Scalars['Boolean']['input'];
};

export type SortDirection =
  | 'ASC'
  | 'DESC';

export type StorageObject = {
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

/** Paginated list of storage objects */
export type StorageObjectList = {
  __typename?: 'StorageObjectList';
  /** Whether there are more items */
  hasMore: Scalars['Boolean']['output'];
  /** List of files and folders */
  items: Array<StorageObject>;
  /** Items per page */
  limit: Scalars['Int']['output'];
  /** Current page offset */
  offset: Scalars['Int']['output'];
  /** Total number of items */
  totalCount: Scalars['Int']['output'];
};

/** Storage statistics */
export type StorageStats = {
  __typename?: 'StorageStats';
  /** Breakdown by file type */
  fileTypeBreakdown: Array<FileTypeCount>;
  /** Total number of files */
  totalFiles: Scalars['Int']['output'];
  /** Total number of folders */
  totalFolders: Scalars['Int']['output'];
  /** Total size in bytes */
  totalSize: Scalars['Long']['output'];
};

export type Student = {
  __typename?: 'Student';
  createdAt?: Maybe<Scalars['LocalDateTime']['output']>;
  dateOfBirth?: Maybe<Scalars['LocalDate']['output']>;
  email?: Maybe<Scalars['Email']['output']>;
  gender?: Maybe<Gender>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  nationality?: Maybe<CountryCode>;
  phoneNumber?: Maybe<Scalars['PhoneNumber']['output']>;
  updatedAt?: Maybe<Scalars['LocalDateTime']['output']>;
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
  createdAt?: Maybe<Scalars['LocalDateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  imageFile?: Maybe<FileInfo>;
  imageUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  preSuspensionCategory?: Maybe<TemplateCategory>;
  updatedAt?: Maybe<Scalars['LocalDateTime']['output']>;
  variables?: Maybe<Array<TemplateVariable>>;
};

export type TemplateCategory = {
  __typename?: 'TemplateCategory';
  categorySpecialType?: Maybe<CategorySpecialType>;
  childCategories?: Maybe<Array<TemplateCategory>>;
  createdAt?: Maybe<Scalars['LocalDateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  parentCategory?: Maybe<TemplateCategory>;
  templates?: Maybe<Array<Template>>;
  updatedAt?: Maybe<Scalars['LocalDateTime']['output']>;
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

export type TextTemplateVariable = TemplateVariable & {
  __typename?: 'TextTemplateVariable';
  createdAt: Scalars['LocalDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  maxLength?: Maybe<Scalars['Int']['output']>;
  minLength?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  pattern?: Maybe<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  template?: Maybe<Template>;
  textPreviewValue?: Maybe<Scalars['String']['output']>;
  type: TemplateVariableType;
  updatedAt: Scalars['LocalDateTime']['output'];
};

/** Input for unregistering file usage */
export type UnregisterFileUsageInput = {
  /** File path */
  filePath: Scalars['String']['input'];
  /** Reference ID to remove */
  referenceId: Scalars['Long']['input'];
  /** Usage type to remove */
  usageType: Scalars['String']['input'];
};

export type UpdateDateTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  maxDate?: InputMaybe<Scalars['LocalDate']['input']>;
  minDate?: InputMaybe<Scalars['LocalDate']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['LocalDate']['input']>;
  required: Scalars['Boolean']['input'];
};

/** Input for updating directory permissions */
export type UpdateDirectoryPermissionsInput = {
  /** The directory path */
  path: Scalars['String']['input'];
  /** New permissions configuration */
  permissions: DirectoryPermissionsInput;
};

export type UpdateNumberTemplateVariableInput = {
  decimalPlaces?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  maxValue?: InputMaybe<Scalars['Float']['input']>;
  minValue?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  previewValue?: InputMaybe<Scalars['Float']['input']>;
  required: Scalars['Boolean']['input'];
};

export type UpdateSelectTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  multiple: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  options: Array<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required: Scalars['Boolean']['input'];
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
  imageFileId?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTextTemplateVariableInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  maxLength?: InputMaybe<Scalars['Int']['input']>;
  minLength?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  pattern?: InputMaybe<Scalars['String']['input']>;
  previewValue?: InputMaybe<Scalars['String']['input']>;
  required: Scalars['Boolean']['input'];
};

export type UploadLocation =
  | 'TEMPLATE_COVER';

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

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', createdAt: any, email: any, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any } } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResponse', message: string } };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken?: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', createdAt: any, email: any, emailVerifiedAt?: any | null, id: number, isAdmin: boolean, name: string, password: string, rememberToken?: string | null, updatedAt: any } } | null };

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

export type DeleteFileMutationVariables = Exact<{
  path: Scalars['String']['input'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: { __typename?: 'FileOperationResult', message: string, success: boolean, item?: { __typename?: 'FileInfo', name: string, path: string } | { __typename?: 'FolderInfo', name: string, path: string } | null } };

export type GenerateUploadSignedUrlMutationVariables = Exact<{
  input: GenerateUploadSignedUrlInput;
}>;


export type GenerateUploadSignedUrlMutation = { __typename?: 'Mutation', generateUploadSignedUrl: string };

export type RenameFileMutationVariables = Exact<{
  input: RenameFileInput;
}>;


export type RenameFileMutation = { __typename?: 'Mutation', renameFile: { __typename?: 'FileOperationResult', message: string, success: boolean, item?: { __typename?: 'FileInfo', name: string, path: string } | { __typename?: 'FolderInfo', name: string, path: string } | null } };

export type GetFileInfoQueryVariables = Exact<{
  path: Scalars['String']['input'];
}>;


export type GetFileInfoQuery = { __typename?: 'Query', getFileInfo?: { __typename?: 'FileInfo', contentType?: string | null, created: any, fileType: FileType, isPublic: boolean, lastModified: any, md5Hash?: string | null, mediaLink?: string | null, name: string, path: string, size: any, url?: string | null } | null };

export type GetFolderInfoQueryVariables = Exact<{
  path: Scalars['String']['input'];
}>;


export type GetFolderInfoQuery = { __typename?: 'Query', getFolderInfo: { __typename?: 'FolderInfo', created: any, fileCount: number, folderCount: number, lastModified: any, name: string, path: string, totalSize: any } };

export type GetStorageStatsQueryVariables = Exact<{
  path?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStorageStatsQuery = { __typename?: 'Query', getStorageStats: { __typename?: 'StorageStats', totalFiles: number, totalFolders: number, totalSize: any, fileTypeBreakdown: Array<{ __typename?: 'FileTypeCount', count: number, type: FileType }> } };

export type ListFilesQueryVariables = Exact<{
  input: ListFilesInput;
}>;


export type ListFilesQuery = { __typename?: 'Query', listFiles: { __typename?: 'StorageObjectList', hasMore: boolean, limit: number, offset: number, totalCount: number, items: Array<{ __typename?: 'FileInfo', contentType?: string | null, created: any, fileType: FileType, isPublic: boolean, lastModified: any, md5Hash?: string | null, mediaLink?: string | null, name: string, path: string, size: any, url?: string | null } | { __typename?: 'FolderInfo', created: any, fileCount: number, folderCount: number, lastModified: any, name: string, path: string, totalSize: any }> } };

export type SearchFilesQueryVariables = Exact<{
  fileType?: InputMaybe<Scalars['String']['input']>;
  folder?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  searchTerm: Scalars['String']['input'];
}>;


export type SearchFilesQuery = { __typename?: 'Query', searchFiles: { __typename?: 'StorageObjectList', hasMore: boolean, limit: number, offset: number, totalCount: number, items: Array<{ __typename?: 'FileInfo', contentType?: string | null, created: any, fileType: FileType, isPublic: boolean, lastModified: any, md5Hash?: string | null, mediaLink?: string | null, name: string, path: string, size: any, url?: string | null } | { __typename?: 'FolderInfo', created: any, fileCount: number, folderCount: number, lastModified: any, name: string, path: string, totalSize: any }> } };

export type CreateStudentMutationVariables = Exact<{
  input: CreateStudentInput;
}>;


export type CreateStudentMutation = { __typename?: 'Mutation', createStudent: { __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, email?: any | null, phoneNumber?: any | null, createdAt?: any | null, updatedAt?: any | null } };

export type DeleteStudentMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteStudentMutation = { __typename?: 'Mutation', deleteStudent: { __typename?: 'Student', id: number, name: string, createdAt?: any | null, updatedAt?: any | null } };

export type PartialUpdateStudentMutationVariables = Exact<{
  input: PartialUpdateStudentInput;
}>;


export type PartialUpdateStudentMutation = { __typename?: 'Mutation', partialUpdateStudent: { __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, email?: any | null, phoneNumber?: any | null, createdAt?: any | null, updatedAt?: any | null } };

export type StudentQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type StudentQuery = { __typename?: 'Query', student?: { __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, email?: any | null, phoneNumber?: any | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type StudentsQueryVariables = Exact<{
  orderBy?: InputMaybe<Array<OrderStudentsByClauseInput> | OrderStudentsByClauseInput>;
  paginationArgs?: InputMaybe<PaginationArgsInput>;
  filterArgs?: InputMaybe<StudentFilterArgsInput>;
}>;


export type StudentsQuery = { __typename?: 'Query', students: { __typename?: 'PaginatedStudentResponse', data: Array<{ __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, email?: any | null, phoneNumber?: any | null, createdAt?: any | null, updatedAt?: any | null }>, paginationInfo?: { __typename?: 'PaginationInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } | null } };

export type CreateTemplateMutationVariables = Exact<{
  input: CreateTemplateInput;
}>;


export type CreateTemplateMutation = { __typename?: 'Mutation', createTemplate: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl: string, order: number, createdAt?: any | null, updatedAt?: any | null, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate?: { __typename?: 'Template', id: number, name: string, category: { __typename?: 'TemplateCategory', id: number, name: string } } | null };

export type SuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type SuspendTemplateMutation = { __typename?: 'Mutation', suspendTemplate?: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl: string, order: number, createdAt?: any | null, updatedAt?: any | null, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type UnsuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type UnsuspendTemplateMutation = { __typename?: 'Mutation', unsuspendTemplate?: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl: string, order: number, createdAt?: any | null, updatedAt?: any | null, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type UpdateTemplateMutationVariables = Exact<{
  input: UpdateTemplateInput;
}>;


export type UpdateTemplateMutation = { __typename?: 'Mutation', updateTemplate?: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl: string, order: number, createdAt?: any | null, updatedAt?: any | null, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null } | null };

export type TemplateQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TemplateQuery = { __typename?: 'Query', template?: { __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl: string, order: number, createdAt?: any | null, updatedAt?: any | null, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null, variables?: Array<{ __typename?: 'DateTemplateVariable', minDate?: any | null, maxDate?: any | null, format?: string | null, datePreviewValue?: any | null, type: TemplateVariableType, id: number, name: string, description?: string | null, required: boolean, order: number } | { __typename?: 'NumberTemplateVariable', minValue?: number | null, maxValue?: number | null, decimalPlaces?: number | null, numberPreviewValue?: number | null, type: TemplateVariableType, id: number, name: string, description?: string | null, required: boolean, order: number } | { __typename?: 'SelectTemplateVariable', options?: Array<string> | null, multiple?: boolean | null, selectPreviewValue?: string | null, type: TemplateVariableType, id: number, name: string, description?: string | null, required: boolean, order: number } | { __typename?: 'TextTemplateVariable', minLength?: number | null, maxLength?: number | null, pattern?: string | null, textPreviewValue?: string | null, type: TemplateVariableType, id: number, name: string, description?: string | null, required: boolean, order: number }> | null } | null };

export type TemplateConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplateConfigQuery = { __typename?: 'Query', templateConfig?: { __typename?: 'TemplateConfig', allowedFileTypes: Array<string>, maxBackgroundSize: number } | null };

export type TemplatesQueryVariables = Exact<{
  paginationArgs?: InputMaybe<PaginationArgsInput>;
}>;


export type TemplatesQuery = { __typename?: 'Query', templates: { __typename?: 'PaginatedTemplatesResponse', data: Array<{ __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl: string, order: number, createdAt?: any | null, updatedAt?: any | null, category: { __typename?: 'TemplateCategory', id: number, name: string }, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null }>, paginationInfo?: { __typename?: 'PaginationInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } | null } };

export type CreateTemplateCategoryMutationVariables = Exact<{
  input: CreateTemplateCategoryInput;
}>;


export type CreateTemplateCategoryMutation = { __typename?: 'Mutation', createTemplateCategory: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } };

export type DeleteTemplateCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateCategoryMutation = { __typename?: 'Mutation', deleteTemplateCategory: { __typename?: 'TemplateCategory', id: number, name: string, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } };

export type UpdateTemplateCategoryMutationVariables = Exact<{
  input: UpdateTemplateCategoryInput;
}>;


export type UpdateTemplateCategoryMutation = { __typename?: 'Mutation', updateTemplateCategory: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null } };

export type MainTemplateCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type MainTemplateCategoryQuery = { __typename?: 'Query', mainTemplateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, parentCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null, childCategories?: Array<{ __typename?: 'TemplateCategory', id: number, name: string }> | null } | null };

export type SuspensionTemplateCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type SuspensionTemplateCategoryQuery = { __typename?: 'Query', suspensionTemplateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, parentCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null, childCategories?: Array<{ __typename?: 'TemplateCategory', id: number, name: string }> | null } | null };

export type TemplateCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplateCategoriesQuery = { __typename?: 'Query', templateCategories: Array<{ __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null, templates?: Array<{ __typename?: 'Template', id: number, name: string, description?: string | null, imageUrl: string, order: number, createdAt?: any | null, updatedAt?: any | null }> | null }> };

export type TemplateCategoryQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TemplateCategoryQuery = { __typename?: 'Query', templateCategory?: { __typename?: 'TemplateCategory', id: number, name: string, description?: string | null, categorySpecialType?: CategorySpecialType | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, parentCategory?: { __typename?: 'TemplateCategory', id: number, name: string } | null, childCategories?: Array<{ __typename?: 'TemplateCategory', id: number, name: string }> | null } | null };

export type CreateDateTemplateVariableMutationVariables = Exact<{
  input: CreateDateTemplateVariableInput;
}>;


export type CreateDateTemplateVariableMutation = { __typename?: 'Mutation', createDateTemplateVariable: { __typename?: 'DateTemplateVariable', id: number, name: string, description?: string | null, type: TemplateVariableType, required: boolean, order: number, minDate?: any | null, maxDate?: any | null, format?: string | null, datePreviewValue?: any | null, createdAt: any, updatedAt: any, template?: { __typename?: 'Template', id: number, name: string } | null } };

export type CreateNumberTemplateVariableMutationVariables = Exact<{
  input: CreateNumberTemplateVariableInput;
}>;


export type CreateNumberTemplateVariableMutation = { __typename?: 'Mutation', createNumberTemplateVariable: { __typename?: 'NumberTemplateVariable', id: number, name: string, description?: string | null, type: TemplateVariableType, required: boolean, order: number, minValue?: number | null, maxValue?: number | null, decimalPlaces?: number | null, numberPreviewValue?: number | null, createdAt: any, updatedAt: any, template?: { __typename?: 'Template', id: number, name: string } | null } };

export type CreateSelectTemplateVariableMutationVariables = Exact<{
  input: CreateSelectTemplateVariableInput;
}>;


export type CreateSelectTemplateVariableMutation = { __typename?: 'Mutation', createSelectTemplateVariable: { __typename?: 'SelectTemplateVariable', id: number, name: string, description?: string | null, type: TemplateVariableType, required: boolean, order: number, options?: Array<string> | null, multiple?: boolean | null, selectPreviewValue?: string | null, createdAt: any, updatedAt: any, template?: { __typename?: 'Template', id: number, name: string } | null } };

export type CreateTextTemplateVariableMutationVariables = Exact<{
  input: CreateTextTemplateVariableInput;
}>;


export type CreateTextTemplateVariableMutation = { __typename?: 'Mutation', createTextTemplateVariable: { __typename?: 'TextTemplateVariable', id: number, name: string, description?: string | null, type: TemplateVariableType, required: boolean, order: number, minLength?: number | null, maxLength?: number | null, pattern?: string | null, textPreviewValue?: string | null, createdAt: any, updatedAt: any, template?: { __typename?: 'Template', id: number, name: string } | null } };

export type DeleteTemplateVariableMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateVariableMutation = { __typename?: 'Mutation', deleteTemplateVariable: { __typename?: 'DateTemplateVariable', id: number, name: string, template?: { __typename?: 'Template', id: number, name: string } | null } | { __typename?: 'NumberTemplateVariable', id: number, name: string, template?: { __typename?: 'Template', id: number, name: string } | null } | { __typename?: 'SelectTemplateVariable', id: number, name: string, template?: { __typename?: 'Template', id: number, name: string } | null } | { __typename?: 'TextTemplateVariable', id: number, name: string, template?: { __typename?: 'Template', id: number, name: string } | null } };

export type UpdateDateTemplateVariableMutationVariables = Exact<{
  input: UpdateDateTemplateVariableInput;
}>;


export type UpdateDateTemplateVariableMutation = { __typename?: 'Mutation', updateDateTemplateVariable: { __typename?: 'DateTemplateVariable', id: number, name: string, description?: string | null, type: TemplateVariableType, required: boolean, order: number, minDate?: any | null, maxDate?: any | null, format?: string | null, datePreviewValue?: any | null, createdAt: any, updatedAt: any, template?: { __typename?: 'Template', id: number, name: string } | null } };

export type UpdateNumberTemplateVariableMutationVariables = Exact<{
  input: UpdateNumberTemplateVariableInput;
}>;


export type UpdateNumberTemplateVariableMutation = { __typename?: 'Mutation', updateNumberTemplateVariable: { __typename?: 'NumberTemplateVariable', id: number, name: string, description?: string | null, type: TemplateVariableType, required: boolean, order: number, minValue?: number | null, maxValue?: number | null, decimalPlaces?: number | null, numberPreviewValue?: number | null, createdAt: any, updatedAt: any, template?: { __typename?: 'Template', id: number, name: string } | null } };

export type UpdateSelectTemplateVariableMutationVariables = Exact<{
  input: UpdateSelectTemplateVariableInput;
}>;


export type UpdateSelectTemplateVariableMutation = { __typename?: 'Mutation', updateSelectTemplateVariable: { __typename?: 'SelectTemplateVariable', id: number, name: string, description?: string | null, type: TemplateVariableType, required: boolean, order: number, options?: Array<string> | null, multiple?: boolean | null, selectPreviewValue?: string | null, createdAt: any, updatedAt: any, template?: { __typename?: 'Template', id: number, name: string } | null } };

export type UpdateTextTemplateVariableMutationVariables = Exact<{
  input: UpdateTextTemplateVariableInput;
}>;


export type UpdateTextTemplateVariableMutation = { __typename?: 'Mutation', updateTextTemplateVariable: { __typename?: 'TextTemplateVariable', id: number, name: string, description?: string | null, type: TemplateVariableType, required: boolean, order: number, minLength?: number | null, maxLength?: number | null, pattern?: string | null, textPreviewValue?: string | null, createdAt: any, updatedAt: any, template?: { __typename?: 'Template', id: number, name: string } | null } };


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
export function useLoginMutation(baseOptions?: ApolloReact.useMutation.Options<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReact.useMutation.Result<LoginMutation>;
export const LogoutDocument = gql`
    mutation logout {
  logout {
    message
  }
}
    `;

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
export function useLogoutMutation(baseOptions?: ApolloReact.useMutation.Options<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReact.useMutation.Result<LogoutMutation>;
export const RefreshTokenDocument = gql`
    mutation refreshToken {
  refreshToken {
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

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: ApolloReact.useMutation.Options<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = ApolloReact.useMutation.Result<RefreshTokenMutation>;
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
export function useRegisterMutation(baseOptions?: ApolloReact.useMutation.Options<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReact.useMutation.Result<RegisterMutation>;
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
export function useIsAuthenticatedQuery(baseOptions?: ApolloReact.useQuery.Options<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(IsAuthenticatedDocument, options);
      }
export function useIsAuthenticatedLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(IsAuthenticatedDocument, options);
        }
export function useIsAuthenticatedSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<IsAuthenticatedQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(IsAuthenticatedDocument, options);
        }
export type IsAuthenticatedQueryHookResult = ReturnType<typeof useIsAuthenticatedQuery>;
export type IsAuthenticatedLazyQueryHookResult = ReturnType<typeof useIsAuthenticatedLazyQuery>;
export type IsAuthenticatedSuspenseQueryHookResult = ReturnType<typeof useIsAuthenticatedSuspenseQuery>;
export type IsAuthenticatedQueryResult = ApolloReact.useQuery.Result<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>;
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
export function useMeQuery(baseOptions?: ApolloReact.useQuery.Options<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<MeQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = ApolloReact.useQuery.Result<MeQuery, MeQueryVariables>;
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
export function useUserQuery(baseOptions: ApolloReact.useQuery.Options<UserQuery, UserQueryVariables> & ({ variables: UserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export function useUserSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<UserQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = ApolloReact.useQuery.Result<UserQuery, UserQueryVariables>;
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
export function useUsersQuery(baseOptions?: ApolloReact.useQuery.Options<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export function useUsersSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<UsersQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = ApolloReact.useQuery.Result<UsersQuery, UsersQueryVariables>;
export function refetchUsersQuery(variables?: UsersQueryVariables) {
      return { query: UsersDocument, variables: variables }
    }
export const DeleteFileDocument = gql`
    mutation deleteFile($path: String!) {
  deleteFile(path: $path) {
    item {
      name
      path
    }
    message
    success
  }
}
    `;

/**
 * __useDeleteFileMutation__
 *
 * To run a mutation, you first call `useDeleteFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFileMutation, { data, loading, error }] = useDeleteFileMutation({
 *   variables: {
 *      path: // value for 'path'
 *   },
 * });
 */
export function useDeleteFileMutation(baseOptions?: ApolloReact.useMutation.Options<DeleteFileMutation, DeleteFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<DeleteFileMutation, DeleteFileMutationVariables>(DeleteFileDocument, options);
      }
export type DeleteFileMutationHookResult = ReturnType<typeof useDeleteFileMutation>;
export type DeleteFileMutationResult = ApolloReact.useMutation.Result<DeleteFileMutation>;
export const GenerateUploadSignedUrlDocument = gql`
    mutation generateUploadSignedUrl($input: GenerateUploadSignedUrlInput!) {
  generateUploadSignedUrl(input: $input)
}
    `;

/**
 * __useGenerateUploadSignedUrlMutation__
 *
 * To run a mutation, you first call `useGenerateUploadSignedUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateUploadSignedUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateUploadSignedUrlMutation, { data, loading, error }] = useGenerateUploadSignedUrlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGenerateUploadSignedUrlMutation(baseOptions?: ApolloReact.useMutation.Options<GenerateUploadSignedUrlMutation, GenerateUploadSignedUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<GenerateUploadSignedUrlMutation, GenerateUploadSignedUrlMutationVariables>(GenerateUploadSignedUrlDocument, options);
      }
export type GenerateUploadSignedUrlMutationHookResult = ReturnType<typeof useGenerateUploadSignedUrlMutation>;
export type GenerateUploadSignedUrlMutationResult = ApolloReact.useMutation.Result<GenerateUploadSignedUrlMutation>;
export const RenameFileDocument = gql`
    mutation renameFile($input: RenameFileInput!) {
  renameFile(input: $input) {
    item {
      name
      path
    }
    message
    success
  }
}
    `;

/**
 * __useRenameFileMutation__
 *
 * To run a mutation, you first call `useRenameFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameFileMutation, { data, loading, error }] = useRenameFileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRenameFileMutation(baseOptions?: ApolloReact.useMutation.Options<RenameFileMutation, RenameFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<RenameFileMutation, RenameFileMutationVariables>(RenameFileDocument, options);
      }
export type RenameFileMutationHookResult = ReturnType<typeof useRenameFileMutation>;
export type RenameFileMutationResult = ApolloReact.useMutation.Result<RenameFileMutation>;
export const GetFileInfoDocument = gql`
    query getFileInfo($path: String!) {
  getFileInfo(path: $path) {
    contentType
    created
    fileType
    isPublic
    lastModified
    md5Hash
    mediaLink
    name
    path
    size
    url
  }
}
    `;

/**
 * __useGetFileInfoQuery__
 *
 * To run a query within a React component, call `useGetFileInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFileInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFileInfoQuery({
 *   variables: {
 *      path: // value for 'path'
 *   },
 * });
 */
export function useGetFileInfoQuery(baseOptions: ApolloReact.useQuery.Options<GetFileInfoQuery, GetFileInfoQueryVariables> & ({ variables: GetFileInfoQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<GetFileInfoQuery, GetFileInfoQueryVariables>(GetFileInfoDocument, options);
      }
export function useGetFileInfoLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<GetFileInfoQuery, GetFileInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<GetFileInfoQuery, GetFileInfoQueryVariables>(GetFileInfoDocument, options);
        }
export function useGetFileInfoSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<GetFileInfoQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<GetFileInfoQuery, GetFileInfoQueryVariables>(GetFileInfoDocument, options);
        }
export type GetFileInfoQueryHookResult = ReturnType<typeof useGetFileInfoQuery>;
export type GetFileInfoLazyQueryHookResult = ReturnType<typeof useGetFileInfoLazyQuery>;
export type GetFileInfoSuspenseQueryHookResult = ReturnType<typeof useGetFileInfoSuspenseQuery>;
export type GetFileInfoQueryResult = ApolloReact.useQuery.Result<GetFileInfoQuery, GetFileInfoQueryVariables>;
export function refetchGetFileInfoQuery(variables: GetFileInfoQueryVariables) {
      return { query: GetFileInfoDocument, variables: variables }
    }
export const GetFolderInfoDocument = gql`
    query getFolderInfo($path: String!) {
  getFolderInfo(path: $path) {
    created
    fileCount
    folderCount
    lastModified
    name
    path
    totalSize
  }
}
    `;

/**
 * __useGetFolderInfoQuery__
 *
 * To run a query within a React component, call `useGetFolderInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFolderInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFolderInfoQuery({
 *   variables: {
 *      path: // value for 'path'
 *   },
 * });
 */
export function useGetFolderInfoQuery(baseOptions: ApolloReact.useQuery.Options<GetFolderInfoQuery, GetFolderInfoQueryVariables> & ({ variables: GetFolderInfoQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<GetFolderInfoQuery, GetFolderInfoQueryVariables>(GetFolderInfoDocument, options);
      }
export function useGetFolderInfoLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<GetFolderInfoQuery, GetFolderInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<GetFolderInfoQuery, GetFolderInfoQueryVariables>(GetFolderInfoDocument, options);
        }
export function useGetFolderInfoSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<GetFolderInfoQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<GetFolderInfoQuery, GetFolderInfoQueryVariables>(GetFolderInfoDocument, options);
        }
export type GetFolderInfoQueryHookResult = ReturnType<typeof useGetFolderInfoQuery>;
export type GetFolderInfoLazyQueryHookResult = ReturnType<typeof useGetFolderInfoLazyQuery>;
export type GetFolderInfoSuspenseQueryHookResult = ReturnType<typeof useGetFolderInfoSuspenseQuery>;
export type GetFolderInfoQueryResult = ApolloReact.useQuery.Result<GetFolderInfoQuery, GetFolderInfoQueryVariables>;
export function refetchGetFolderInfoQuery(variables: GetFolderInfoQueryVariables) {
      return { query: GetFolderInfoDocument, variables: variables }
    }
export const GetStorageStatsDocument = gql`
    query getStorageStats($path: String) {
  getStorageStats(path: $path) {
    fileTypeBreakdown {
      count
      type
    }
    totalFiles
    totalFolders
    totalSize
  }
}
    `;

/**
 * __useGetStorageStatsQuery__
 *
 * To run a query within a React component, call `useGetStorageStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStorageStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStorageStatsQuery({
 *   variables: {
 *      path: // value for 'path'
 *   },
 * });
 */
export function useGetStorageStatsQuery(baseOptions?: ApolloReact.useQuery.Options<GetStorageStatsQuery, GetStorageStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<GetStorageStatsQuery, GetStorageStatsQueryVariables>(GetStorageStatsDocument, options);
      }
export function useGetStorageStatsLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<GetStorageStatsQuery, GetStorageStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<GetStorageStatsQuery, GetStorageStatsQueryVariables>(GetStorageStatsDocument, options);
        }
export function useGetStorageStatsSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<GetStorageStatsQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<GetStorageStatsQuery, GetStorageStatsQueryVariables>(GetStorageStatsDocument, options);
        }
export type GetStorageStatsQueryHookResult = ReturnType<typeof useGetStorageStatsQuery>;
export type GetStorageStatsLazyQueryHookResult = ReturnType<typeof useGetStorageStatsLazyQuery>;
export type GetStorageStatsSuspenseQueryHookResult = ReturnType<typeof useGetStorageStatsSuspenseQuery>;
export type GetStorageStatsQueryResult = ApolloReact.useQuery.Result<GetStorageStatsQuery, GetStorageStatsQueryVariables>;
export function refetchGetStorageStatsQuery(variables?: GetStorageStatsQueryVariables) {
      return { query: GetStorageStatsDocument, variables: variables }
    }
export const ListFilesDocument = gql`
    query listFiles($input: ListFilesInput!) {
  listFiles(input: $input) {
    hasMore
    items {
      name
      path
      ... on FileInfo {
        contentType
        created
        fileType
        isPublic
        lastModified
        md5Hash
        mediaLink
        name
        path
        size
        url
      }
      ... on FolderInfo {
        created
        fileCount
        folderCount
        lastModified
        name
        path
        totalSize
      }
    }
    limit
    offset
    totalCount
  }
}
    `;

/**
 * __useListFilesQuery__
 *
 * To run a query within a React component, call `useListFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListFilesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useListFilesQuery(baseOptions: ApolloReact.useQuery.Options<ListFilesQuery, ListFilesQueryVariables> & ({ variables: ListFilesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<ListFilesQuery, ListFilesQueryVariables>(ListFilesDocument, options);
      }
export function useListFilesLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<ListFilesQuery, ListFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<ListFilesQuery, ListFilesQueryVariables>(ListFilesDocument, options);
        }
export function useListFilesSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<ListFilesQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<ListFilesQuery, ListFilesQueryVariables>(ListFilesDocument, options);
        }
export type ListFilesQueryHookResult = ReturnType<typeof useListFilesQuery>;
export type ListFilesLazyQueryHookResult = ReturnType<typeof useListFilesLazyQuery>;
export type ListFilesSuspenseQueryHookResult = ReturnType<typeof useListFilesSuspenseQuery>;
export type ListFilesQueryResult = ApolloReact.useQuery.Result<ListFilesQuery, ListFilesQueryVariables>;
export function refetchListFilesQuery(variables: ListFilesQueryVariables) {
      return { query: ListFilesDocument, variables: variables }
    }
export const SearchFilesDocument = gql`
    query searchFiles($fileType: String, $folder: String, $limit: Int!, $searchTerm: String!) {
  searchFiles(
    fileType: $fileType
    folder: $folder
    limit: $limit
    searchTerm: $searchTerm
  ) {
    hasMore
    items {
      name
      path
      ... on FileInfo {
        contentType
        created
        fileType
        isPublic
        lastModified
        md5Hash
        mediaLink
        name
        path
        size
        url
      }
      ... on FolderInfo {
        created
        fileCount
        folderCount
        lastModified
        name
        path
        totalSize
      }
    }
    limit
    offset
    totalCount
  }
}
    `;

/**
 * __useSearchFilesQuery__
 *
 * To run a query within a React component, call `useSearchFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchFilesQuery({
 *   variables: {
 *      fileType: // value for 'fileType'
 *      folder: // value for 'folder'
 *      limit: // value for 'limit'
 *      searchTerm: // value for 'searchTerm'
 *   },
 * });
 */
export function useSearchFilesQuery(baseOptions: ApolloReact.useQuery.Options<SearchFilesQuery, SearchFilesQueryVariables> & ({ variables: SearchFilesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<SearchFilesQuery, SearchFilesQueryVariables>(SearchFilesDocument, options);
      }
export function useSearchFilesLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<SearchFilesQuery, SearchFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<SearchFilesQuery, SearchFilesQueryVariables>(SearchFilesDocument, options);
        }
export function useSearchFilesSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<SearchFilesQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<SearchFilesQuery, SearchFilesQueryVariables>(SearchFilesDocument, options);
        }
export type SearchFilesQueryHookResult = ReturnType<typeof useSearchFilesQuery>;
export type SearchFilesLazyQueryHookResult = ReturnType<typeof useSearchFilesLazyQuery>;
export type SearchFilesSuspenseQueryHookResult = ReturnType<typeof useSearchFilesSuspenseQuery>;
export type SearchFilesQueryResult = ApolloReact.useQuery.Result<SearchFilesQuery, SearchFilesQueryVariables>;
export function refetchSearchFilesQuery(variables: SearchFilesQueryVariables) {
      return { query: SearchFilesDocument, variables: variables }
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
export function useCreateStudentMutation(baseOptions?: ApolloReact.useMutation.Options<CreateStudentMutation, CreateStudentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<CreateStudentMutation, CreateStudentMutationVariables>(CreateStudentDocument, options);
      }
export type CreateStudentMutationHookResult = ReturnType<typeof useCreateStudentMutation>;
export type CreateStudentMutationResult = ApolloReact.useMutation.Result<CreateStudentMutation>;
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
export function useDeleteStudentMutation(baseOptions?: ApolloReact.useMutation.Options<DeleteStudentMutation, DeleteStudentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<DeleteStudentMutation, DeleteStudentMutationVariables>(DeleteStudentDocument, options);
      }
export type DeleteStudentMutationHookResult = ReturnType<typeof useDeleteStudentMutation>;
export type DeleteStudentMutationResult = ApolloReact.useMutation.Result<DeleteStudentMutation>;
export const PartialUpdateStudentDocument = gql`
    mutation partialUpdateStudent($input: PartialUpdateStudentInput!) {
  partialUpdateStudent(input: $input) {
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
 * __usePartialUpdateStudentMutation__
 *
 * To run a mutation, you first call `usePartialUpdateStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePartialUpdateStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [partialUpdateStudentMutation, { data, loading, error }] = usePartialUpdateStudentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePartialUpdateStudentMutation(baseOptions?: ApolloReact.useMutation.Options<PartialUpdateStudentMutation, PartialUpdateStudentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<PartialUpdateStudentMutation, PartialUpdateStudentMutationVariables>(PartialUpdateStudentDocument, options);
      }
export type PartialUpdateStudentMutationHookResult = ReturnType<typeof usePartialUpdateStudentMutation>;
export type PartialUpdateStudentMutationResult = ApolloReact.useMutation.Result<PartialUpdateStudentMutation>;
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
export function useStudentQuery(baseOptions: ApolloReact.useQuery.Options<StudentQuery, StudentQueryVariables> & ({ variables: StudentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<StudentQuery, StudentQueryVariables>(StudentDocument, options);
      }
export function useStudentLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<StudentQuery, StudentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<StudentQuery, StudentQueryVariables>(StudentDocument, options);
        }
export function useStudentSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<StudentQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<StudentQuery, StudentQueryVariables>(StudentDocument, options);
        }
export type StudentQueryHookResult = ReturnType<typeof useStudentQuery>;
export type StudentLazyQueryHookResult = ReturnType<typeof useStudentLazyQuery>;
export type StudentSuspenseQueryHookResult = ReturnType<typeof useStudentSuspenseQuery>;
export type StudentQueryResult = ApolloReact.useQuery.Result<StudentQuery, StudentQueryVariables>;
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
export function useStudentsQuery(baseOptions?: ApolloReact.useQuery.Options<StudentsQuery, StudentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, options);
      }
export function useStudentsLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<StudentsQuery, StudentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, options);
        }
export function useStudentsSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<StudentsQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, options);
        }
export type StudentsQueryHookResult = ReturnType<typeof useStudentsQuery>;
export type StudentsLazyQueryHookResult = ReturnType<typeof useStudentsLazyQuery>;
export type StudentsSuspenseQueryHookResult = ReturnType<typeof useStudentsSuspenseQuery>;
export type StudentsQueryResult = ApolloReact.useQuery.Result<StudentsQuery, StudentsQueryVariables>;
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
export function useCreateTemplateMutation(baseOptions?: ApolloReact.useMutation.Options<CreateTemplateMutation, CreateTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<CreateTemplateMutation, CreateTemplateMutationVariables>(CreateTemplateDocument, options);
      }
export type CreateTemplateMutationHookResult = ReturnType<typeof useCreateTemplateMutation>;
export type CreateTemplateMutationResult = ApolloReact.useMutation.Result<CreateTemplateMutation>;
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
export function useDeleteTemplateMutation(baseOptions?: ApolloReact.useMutation.Options<DeleteTemplateMutation, DeleteTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<DeleteTemplateMutation, DeleteTemplateMutationVariables>(DeleteTemplateDocument, options);
      }
export type DeleteTemplateMutationHookResult = ReturnType<typeof useDeleteTemplateMutation>;
export type DeleteTemplateMutationResult = ApolloReact.useMutation.Result<DeleteTemplateMutation>;
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
export function useSuspendTemplateMutation(baseOptions?: ApolloReact.useMutation.Options<SuspendTemplateMutation, SuspendTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<SuspendTemplateMutation, SuspendTemplateMutationVariables>(SuspendTemplateDocument, options);
      }
export type SuspendTemplateMutationHookResult = ReturnType<typeof useSuspendTemplateMutation>;
export type SuspendTemplateMutationResult = ApolloReact.useMutation.Result<SuspendTemplateMutation>;
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
export function useUnsuspendTemplateMutation(baseOptions?: ApolloReact.useMutation.Options<UnsuspendTemplateMutation, UnsuspendTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<UnsuspendTemplateMutation, UnsuspendTemplateMutationVariables>(UnsuspendTemplateDocument, options);
      }
export type UnsuspendTemplateMutationHookResult = ReturnType<typeof useUnsuspendTemplateMutation>;
export type UnsuspendTemplateMutationResult = ApolloReact.useMutation.Result<UnsuspendTemplateMutation>;
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
export function useUpdateTemplateMutation(baseOptions?: ApolloReact.useMutation.Options<UpdateTemplateMutation, UpdateTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<UpdateTemplateMutation, UpdateTemplateMutationVariables>(UpdateTemplateDocument, options);
      }
export type UpdateTemplateMutationHookResult = ReturnType<typeof useUpdateTemplateMutation>;
export type UpdateTemplateMutationResult = ApolloReact.useMutation.Result<UpdateTemplateMutation>;
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
    variables {
      type
      id
      name
      description
      required
      order
      ... on TextTemplateVariable {
        minLength
        maxLength
        pattern
        textPreviewValue
      }
      ... on NumberTemplateVariable {
        minValue
        maxValue
        decimalPlaces
        numberPreviewValue
      }
      ... on DateTemplateVariable {
        minDate
        maxDate
        format
        datePreviewValue
      }
      ... on SelectTemplateVariable {
        options
        multiple
        selectPreviewValue
      }
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
export function useTemplateQuery(baseOptions: ApolloReact.useQuery.Options<TemplateQuery, TemplateQueryVariables> & ({ variables: TemplateQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<TemplateQuery, TemplateQueryVariables>(TemplateDocument, options);
      }
export function useTemplateLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<TemplateQuery, TemplateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<TemplateQuery, TemplateQueryVariables>(TemplateDocument, options);
        }
export function useTemplateSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<TemplateQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<TemplateQuery, TemplateQueryVariables>(TemplateDocument, options);
        }
export type TemplateQueryHookResult = ReturnType<typeof useTemplateQuery>;
export type TemplateLazyQueryHookResult = ReturnType<typeof useTemplateLazyQuery>;
export type TemplateSuspenseQueryHookResult = ReturnType<typeof useTemplateSuspenseQuery>;
export type TemplateQueryResult = ApolloReact.useQuery.Result<TemplateQuery, TemplateQueryVariables>;
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
export function useTemplateConfigQuery(baseOptions?: ApolloReact.useQuery.Options<TemplateConfigQuery, TemplateConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<TemplateConfigQuery, TemplateConfigQueryVariables>(TemplateConfigDocument, options);
      }
export function useTemplateConfigLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<TemplateConfigQuery, TemplateConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<TemplateConfigQuery, TemplateConfigQueryVariables>(TemplateConfigDocument, options);
        }
export function useTemplateConfigSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<TemplateConfigQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<TemplateConfigQuery, TemplateConfigQueryVariables>(TemplateConfigDocument, options);
        }
export type TemplateConfigQueryHookResult = ReturnType<typeof useTemplateConfigQuery>;
export type TemplateConfigLazyQueryHookResult = ReturnType<typeof useTemplateConfigLazyQuery>;
export type TemplateConfigSuspenseQueryHookResult = ReturnType<typeof useTemplateConfigSuspenseQuery>;
export type TemplateConfigQueryResult = ApolloReact.useQuery.Result<TemplateConfigQuery, TemplateConfigQueryVariables>;
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
export function useTemplatesQuery(baseOptions?: ApolloReact.useQuery.Options<TemplatesQuery, TemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<TemplatesQuery, TemplatesQueryVariables>(TemplatesDocument, options);
      }
export function useTemplatesLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<TemplatesQuery, TemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<TemplatesQuery, TemplatesQueryVariables>(TemplatesDocument, options);
        }
export function useTemplatesSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<TemplatesQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<TemplatesQuery, TemplatesQueryVariables>(TemplatesDocument, options);
        }
export type TemplatesQueryHookResult = ReturnType<typeof useTemplatesQuery>;
export type TemplatesLazyQueryHookResult = ReturnType<typeof useTemplatesLazyQuery>;
export type TemplatesSuspenseQueryHookResult = ReturnType<typeof useTemplatesSuspenseQuery>;
export type TemplatesQueryResult = ApolloReact.useQuery.Result<TemplatesQuery, TemplatesQueryVariables>;
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
    updatedAt
  }
}
    `;

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
export function useCreateTemplateCategoryMutation(baseOptions?: ApolloReact.useMutation.Options<CreateTemplateCategoryMutation, CreateTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<CreateTemplateCategoryMutation, CreateTemplateCategoryMutationVariables>(CreateTemplateCategoryDocument, options);
      }
export type CreateTemplateCategoryMutationHookResult = ReturnType<typeof useCreateTemplateCategoryMutation>;
export type CreateTemplateCategoryMutationResult = ApolloReact.useMutation.Result<CreateTemplateCategoryMutation>;
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
export function useDeleteTemplateCategoryMutation(baseOptions?: ApolloReact.useMutation.Options<DeleteTemplateCategoryMutation, DeleteTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<DeleteTemplateCategoryMutation, DeleteTemplateCategoryMutationVariables>(DeleteTemplateCategoryDocument, options);
      }
export type DeleteTemplateCategoryMutationHookResult = ReturnType<typeof useDeleteTemplateCategoryMutation>;
export type DeleteTemplateCategoryMutationResult = ApolloReact.useMutation.Result<DeleteTemplateCategoryMutation>;
export const UpdateTemplateCategoryDocument = gql`
    mutation updateTemplateCategory($input: UpdateTemplateCategoryInput!) {
  updateTemplateCategory(input: $input) {
    id
    name
    description
    categorySpecialType
    parentCategory {
      id
    }
    order
    createdAt
    updatedAt
  }
}
    `;

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
export function useUpdateTemplateCategoryMutation(baseOptions?: ApolloReact.useMutation.Options<UpdateTemplateCategoryMutation, UpdateTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<UpdateTemplateCategoryMutation, UpdateTemplateCategoryMutationVariables>(UpdateTemplateCategoryDocument, options);
      }
export type UpdateTemplateCategoryMutationHookResult = ReturnType<typeof useUpdateTemplateCategoryMutation>;
export type UpdateTemplateCategoryMutationResult = ApolloReact.useMutation.Result<UpdateTemplateCategoryMutation>;
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
export function useMainTemplateCategoryQuery(baseOptions?: ApolloReact.useQuery.Options<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>(MainTemplateCategoryDocument, options);
      }
export function useMainTemplateCategoryLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>(MainTemplateCategoryDocument, options);
        }
export function useMainTemplateCategorySuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<MainTemplateCategoryQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>(MainTemplateCategoryDocument, options);
        }
export type MainTemplateCategoryQueryHookResult = ReturnType<typeof useMainTemplateCategoryQuery>;
export type MainTemplateCategoryLazyQueryHookResult = ReturnType<typeof useMainTemplateCategoryLazyQuery>;
export type MainTemplateCategorySuspenseQueryHookResult = ReturnType<typeof useMainTemplateCategorySuspenseQuery>;
export type MainTemplateCategoryQueryResult = ApolloReact.useQuery.Result<MainTemplateCategoryQuery, MainTemplateCategoryQueryVariables>;
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
export function useSuspensionTemplateCategoryQuery(baseOptions?: ApolloReact.useQuery.Options<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>(SuspensionTemplateCategoryDocument, options);
      }
export function useSuspensionTemplateCategoryLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>(SuspensionTemplateCategoryDocument, options);
        }
export function useSuspensionTemplateCategorySuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<SuspensionTemplateCategoryQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>(SuspensionTemplateCategoryDocument, options);
        }
export type SuspensionTemplateCategoryQueryHookResult = ReturnType<typeof useSuspensionTemplateCategoryQuery>;
export type SuspensionTemplateCategoryLazyQueryHookResult = ReturnType<typeof useSuspensionTemplateCategoryLazyQuery>;
export type SuspensionTemplateCategorySuspenseQueryHookResult = ReturnType<typeof useSuspensionTemplateCategorySuspenseQuery>;
export type SuspensionTemplateCategoryQueryResult = ApolloReact.useQuery.Result<SuspensionTemplateCategoryQuery, SuspensionTemplateCategoryQueryVariables>;
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
export function useTemplateCategoriesQuery(baseOptions?: ApolloReact.useQuery.Options<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>(TemplateCategoriesDocument, options);
      }
export function useTemplateCategoriesLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>(TemplateCategoriesDocument, options);
        }
export function useTemplateCategoriesSuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<TemplateCategoriesQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>(TemplateCategoriesDocument, options);
        }
export type TemplateCategoriesQueryHookResult = ReturnType<typeof useTemplateCategoriesQuery>;
export type TemplateCategoriesLazyQueryHookResult = ReturnType<typeof useTemplateCategoriesLazyQuery>;
export type TemplateCategoriesSuspenseQueryHookResult = ReturnType<typeof useTemplateCategoriesSuspenseQuery>;
export type TemplateCategoriesQueryResult = ApolloReact.useQuery.Result<TemplateCategoriesQuery, TemplateCategoriesQueryVariables>;
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
export function useTemplateCategoryQuery(baseOptions: ApolloReact.useQuery.Options<TemplateCategoryQuery, TemplateCategoryQueryVariables> & ({ variables: TemplateCategoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useQuery<TemplateCategoryQuery, TemplateCategoryQueryVariables>(TemplateCategoryDocument, options);
      }
export function useTemplateCategoryLazyQuery(baseOptions?: ApolloReact.useLazyQuery.Options<TemplateCategoryQuery, TemplateCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReact.useLazyQuery<TemplateCategoryQuery, TemplateCategoryQueryVariables>(TemplateCategoryDocument, options);
        }
export function useTemplateCategorySuspenseQuery(baseOptions: ApolloReact.SkipToken | ApolloReact.useSuspenseQuery.Options<TemplateCategoryQueryVariables> ) {
          const options = baseOptions === ApolloReact.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReact.useSuspenseQuery<TemplateCategoryQuery, TemplateCategoryQueryVariables>(TemplateCategoryDocument, options);
        }
export type TemplateCategoryQueryHookResult = ReturnType<typeof useTemplateCategoryQuery>;
export type TemplateCategoryLazyQueryHookResult = ReturnType<typeof useTemplateCategoryLazyQuery>;
export type TemplateCategorySuspenseQueryHookResult = ReturnType<typeof useTemplateCategorySuspenseQuery>;
export type TemplateCategoryQueryResult = ApolloReact.useQuery.Result<TemplateCategoryQuery, TemplateCategoryQueryVariables>;
export function refetchTemplateCategoryQuery(variables: TemplateCategoryQueryVariables) {
      return { query: TemplateCategoryDocument, variables: variables }
    }
export const CreateDateTemplateVariableDocument = gql`
    mutation createDateTemplateVariable($input: CreateDateTemplateVariableInput!) {
  createDateTemplateVariable(input: $input) {
    id
    name
    description
    type
    required
    order
    minDate
    maxDate
    format
    datePreviewValue
    template {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

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
export function useCreateDateTemplateVariableMutation(baseOptions?: ApolloReact.useMutation.Options<CreateDateTemplateVariableMutation, CreateDateTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<CreateDateTemplateVariableMutation, CreateDateTemplateVariableMutationVariables>(CreateDateTemplateVariableDocument, options);
      }
export type CreateDateTemplateVariableMutationHookResult = ReturnType<typeof useCreateDateTemplateVariableMutation>;
export type CreateDateTemplateVariableMutationResult = ApolloReact.useMutation.Result<CreateDateTemplateVariableMutation>;
export const CreateNumberTemplateVariableDocument = gql`
    mutation createNumberTemplateVariable($input: CreateNumberTemplateVariableInput!) {
  createNumberTemplateVariable(input: $input) {
    id
    name
    description
    type
    required
    order
    minValue
    maxValue
    decimalPlaces
    numberPreviewValue
    template {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

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
export function useCreateNumberTemplateVariableMutation(baseOptions?: ApolloReact.useMutation.Options<CreateNumberTemplateVariableMutation, CreateNumberTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<CreateNumberTemplateVariableMutation, CreateNumberTemplateVariableMutationVariables>(CreateNumberTemplateVariableDocument, options);
      }
export type CreateNumberTemplateVariableMutationHookResult = ReturnType<typeof useCreateNumberTemplateVariableMutation>;
export type CreateNumberTemplateVariableMutationResult = ApolloReact.useMutation.Result<CreateNumberTemplateVariableMutation>;
export const CreateSelectTemplateVariableDocument = gql`
    mutation createSelectTemplateVariable($input: CreateSelectTemplateVariableInput!) {
  createSelectTemplateVariable(input: $input) {
    id
    name
    description
    type
    required
    order
    options
    multiple
    selectPreviewValue
    template {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

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
export function useCreateSelectTemplateVariableMutation(baseOptions?: ApolloReact.useMutation.Options<CreateSelectTemplateVariableMutation, CreateSelectTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<CreateSelectTemplateVariableMutation, CreateSelectTemplateVariableMutationVariables>(CreateSelectTemplateVariableDocument, options);
      }
export type CreateSelectTemplateVariableMutationHookResult = ReturnType<typeof useCreateSelectTemplateVariableMutation>;
export type CreateSelectTemplateVariableMutationResult = ApolloReact.useMutation.Result<CreateSelectTemplateVariableMutation>;
export const CreateTextTemplateVariableDocument = gql`
    mutation createTextTemplateVariable($input: CreateTextTemplateVariableInput!) {
  createTextTemplateVariable(input: $input) {
    id
    name
    description
    type
    required
    order
    minLength
    maxLength
    pattern
    textPreviewValue
    template {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

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
export function useCreateTextTemplateVariableMutation(baseOptions?: ApolloReact.useMutation.Options<CreateTextTemplateVariableMutation, CreateTextTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<CreateTextTemplateVariableMutation, CreateTextTemplateVariableMutationVariables>(CreateTextTemplateVariableDocument, options);
      }
export type CreateTextTemplateVariableMutationHookResult = ReturnType<typeof useCreateTextTemplateVariableMutation>;
export type CreateTextTemplateVariableMutationResult = ApolloReact.useMutation.Result<CreateTextTemplateVariableMutation>;
export const DeleteTemplateVariableDocument = gql`
    mutation deleteTemplateVariable($id: Int!) {
  deleteTemplateVariable(id: $id) {
    id
    name
    template {
      id
      name
    }
  }
}
    `;

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
export function useDeleteTemplateVariableMutation(baseOptions?: ApolloReact.useMutation.Options<DeleteTemplateVariableMutation, DeleteTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<DeleteTemplateVariableMutation, DeleteTemplateVariableMutationVariables>(DeleteTemplateVariableDocument, options);
      }
export type DeleteTemplateVariableMutationHookResult = ReturnType<typeof useDeleteTemplateVariableMutation>;
export type DeleteTemplateVariableMutationResult = ApolloReact.useMutation.Result<DeleteTemplateVariableMutation>;
export const UpdateDateTemplateVariableDocument = gql`
    mutation updateDateTemplateVariable($input: UpdateDateTemplateVariableInput!) {
  updateDateTemplateVariable(input: $input) {
    id
    name
    description
    type
    required
    order
    minDate
    maxDate
    format
    datePreviewValue
    template {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

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
export function useUpdateDateTemplateVariableMutation(baseOptions?: ApolloReact.useMutation.Options<UpdateDateTemplateVariableMutation, UpdateDateTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<UpdateDateTemplateVariableMutation, UpdateDateTemplateVariableMutationVariables>(UpdateDateTemplateVariableDocument, options);
      }
export type UpdateDateTemplateVariableMutationHookResult = ReturnType<typeof useUpdateDateTemplateVariableMutation>;
export type UpdateDateTemplateVariableMutationResult = ApolloReact.useMutation.Result<UpdateDateTemplateVariableMutation>;
export const UpdateNumberTemplateVariableDocument = gql`
    mutation updateNumberTemplateVariable($input: UpdateNumberTemplateVariableInput!) {
  updateNumberTemplateVariable(input: $input) {
    id
    name
    description
    type
    required
    order
    minValue
    maxValue
    decimalPlaces
    numberPreviewValue
    template {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

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
export function useUpdateNumberTemplateVariableMutation(baseOptions?: ApolloReact.useMutation.Options<UpdateNumberTemplateVariableMutation, UpdateNumberTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<UpdateNumberTemplateVariableMutation, UpdateNumberTemplateVariableMutationVariables>(UpdateNumberTemplateVariableDocument, options);
      }
export type UpdateNumberTemplateVariableMutationHookResult = ReturnType<typeof useUpdateNumberTemplateVariableMutation>;
export type UpdateNumberTemplateVariableMutationResult = ApolloReact.useMutation.Result<UpdateNumberTemplateVariableMutation>;
export const UpdateSelectTemplateVariableDocument = gql`
    mutation updateSelectTemplateVariable($input: UpdateSelectTemplateVariableInput!) {
  updateSelectTemplateVariable(input: $input) {
    id
    name
    description
    type
    required
    order
    options
    multiple
    selectPreviewValue
    template {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

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
export function useUpdateSelectTemplateVariableMutation(baseOptions?: ApolloReact.useMutation.Options<UpdateSelectTemplateVariableMutation, UpdateSelectTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<UpdateSelectTemplateVariableMutation, UpdateSelectTemplateVariableMutationVariables>(UpdateSelectTemplateVariableDocument, options);
      }
export type UpdateSelectTemplateVariableMutationHookResult = ReturnType<typeof useUpdateSelectTemplateVariableMutation>;
export type UpdateSelectTemplateVariableMutationResult = ApolloReact.useMutation.Result<UpdateSelectTemplateVariableMutation>;
export const UpdateTextTemplateVariableDocument = gql`
    mutation updateTextTemplateVariable($input: UpdateTextTemplateVariableInput!) {
  updateTextTemplateVariable(input: $input) {
    id
    name
    description
    type
    required
    order
    minLength
    maxLength
    pattern
    textPreviewValue
    template {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

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
export function useUpdateTextTemplateVariableMutation(baseOptions?: ApolloReact.useMutation.Options<UpdateTextTemplateVariableMutation, UpdateTextTemplateVariableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReact.useMutation<UpdateTextTemplateVariableMutation, UpdateTextTemplateVariableMutationVariables>(UpdateTextTemplateVariableDocument, options);
      }
export type UpdateTextTemplateVariableMutationHookResult = ReturnType<typeof useUpdateTextTemplateVariableMutation>;
export type UpdateTextTemplateVariableMutationResult = ApolloReact.useMutation.Result<UpdateTextTemplateVariableMutation>;
