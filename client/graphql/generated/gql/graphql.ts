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
  /** A type representing arbitrary JSON values */
  JSON: { input: any; output: any; }
  /** A type representing a validated phone number */
  PhoneNumber: { input: any; output: any; }
  /** A map of string keys to string values (Record<string, string>) */
  StringMap: { input: any; output: any; }
};

export enum AppLanguage {
  Ar = 'ar',
  En = 'en'
}

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

export enum CalendarType {
  Gregorian = 'GREGORIAN',
  Hijri = 'HIJRI'
}

export enum CertificateDateField {
  ReleaseDate = 'RELEASE_DATE'
}

export type CertificateElement = {
  base: CertificateElementBase;
  template?: Maybe<Template>;
};

export type CertificateElementBase = {
  __typename?: 'CertificateElementBase';
  alignment: ElementAlignment;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  height: Scalars['Int']['output'];
  hidden?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  positionX: Scalars['Int']['output'];
  positionY: Scalars['Int']['output'];
  renderOrder: Scalars['Int']['output'];
  templateId: Scalars['Int']['output'];
  type: ElementType;
  updatedAt: Scalars['DateTime']['output'];
  width: Scalars['Int']['output'];
};

export type CertificateElementBaseInput = {
  alignment: ElementAlignment;
  description: Scalars['String']['input'];
  height: Scalars['Int']['input'];
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  positionX: Scalars['Int']['input'];
  positionY: Scalars['Int']['input'];
  renderOrder: Scalars['Int']['input'];
  templateId: Scalars['Int']['input'];
  width: Scalars['Int']['input'];
};

export type CertificateElementBaseUpdateInput = {
  alignment: ElementAlignment;
  description: Scalars['String']['input'];
  height: Scalars['Int']['input'];
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  positionX: Scalars['Int']['input'];
  positionY: Scalars['Int']['input'];
  renderOrder: Scalars['Int']['input'];
  width: Scalars['Int']['input'];
};

export type CertificateElementUnion = CountryElement | DateElement | GenderElement | ImageElement | NumberElement | QrCodeElement | TextElement;

export enum CertificateTextField {
  VerificationCode = 'VERIFICATION_CODE'
}

export enum CountryCode {
  Ad = 'AD',
  Ae = 'AE',
  Af = 'AF',
  Ag = 'AG',
  Ai = 'AI',
  Al = 'AL',
  Am = 'AM',
  Ao = 'AO',
  Aq = 'AQ',
  Ar = 'AR',
  As = 'AS',
  At = 'AT',
  Au = 'AU',
  Aw = 'AW',
  Ax = 'AX',
  Az = 'AZ',
  Ba = 'BA',
  Bb = 'BB',
  Bd = 'BD',
  Be = 'BE',
  Bf = 'BF',
  Bg = 'BG',
  Bh = 'BH',
  Bi = 'BI',
  Bj = 'BJ',
  Bl = 'BL',
  Bm = 'BM',
  Bn = 'BN',
  Bo = 'BO',
  Br = 'BR',
  Bs = 'BS',
  Bt = 'BT',
  Bv = 'BV',
  Bw = 'BW',
  By = 'BY',
  Bz = 'BZ',
  Ca = 'CA',
  Cc = 'CC',
  Cd = 'CD',
  Cf = 'CF',
  Cg = 'CG',
  Ch = 'CH',
  Ci = 'CI',
  Ck = 'CK',
  Cl = 'CL',
  Cm = 'CM',
  Cn = 'CN',
  Co = 'CO',
  Cr = 'CR',
  Cu = 'CU',
  Cv = 'CV',
  Cw = 'CW',
  Cx = 'CX',
  Cy = 'CY',
  Cz = 'CZ',
  De = 'DE',
  Dj = 'DJ',
  Dk = 'DK',
  Dm = 'DM',
  Do = 'DO',
  Dz = 'DZ',
  Ec = 'EC',
  Ee = 'EE',
  Eg = 'EG',
  Eh = 'EH',
  Er = 'ER',
  Es = 'ES',
  Et = 'ET',
  Fi = 'FI',
  Fj = 'FJ',
  Fk = 'FK',
  Fm = 'FM',
  Fo = 'FO',
  Fr = 'FR',
  Ga = 'GA',
  Gb = 'GB',
  Gd = 'GD',
  Ge = 'GE',
  Gf = 'GF',
  Gg = 'GG',
  Gh = 'GH',
  Gi = 'GI',
  Gl = 'GL',
  Gm = 'GM',
  Gn = 'GN',
  Gp = 'GP',
  Gq = 'GQ',
  Gr = 'GR',
  Gs = 'GS',
  Gt = 'GT',
  Gu = 'GU',
  Gw = 'GW',
  Gy = 'GY',
  Hk = 'HK',
  Hm = 'HM',
  Hn = 'HN',
  Hr = 'HR',
  Ht = 'HT',
  Hu = 'HU',
  Id = 'ID',
  Ie = 'IE',
  Im = 'IM',
  In = 'IN',
  Io = 'IO',
  Iq = 'IQ',
  Ir = 'IR',
  Is = 'IS',
  It = 'IT',
  Je = 'JE',
  Jm = 'JM',
  Jo = 'JO',
  Jp = 'JP',
  Ke = 'KE',
  Kg = 'KG',
  Kh = 'KH',
  Ki = 'KI',
  Km = 'KM',
  Kn = 'KN',
  Kp = 'KP',
  Kr = 'KR',
  Kw = 'KW',
  Ky = 'KY',
  Kz = 'KZ',
  La = 'LA',
  Lb = 'LB',
  Lc = 'LC',
  Li = 'LI',
  Lk = 'LK',
  Lr = 'LR',
  Ls = 'LS',
  Lt = 'LT',
  Lu = 'LU',
  Lv = 'LV',
  Ly = 'LY',
  Ma = 'MA',
  Mc = 'MC',
  Md = 'MD',
  Me = 'ME',
  Mf = 'MF',
  Mg = 'MG',
  Mh = 'MH',
  Mk = 'MK',
  Ml = 'ML',
  Mm = 'MM',
  Mn = 'MN',
  Mo = 'MO',
  Mp = 'MP',
  Mq = 'MQ',
  Mr = 'MR',
  Ms = 'MS',
  Mt = 'MT',
  Mu = 'MU',
  Mv = 'MV',
  Mw = 'MW',
  Mx = 'MX',
  My = 'MY',
  Mz = 'MZ',
  Na = 'NA',
  Nc = 'NC',
  Ne = 'NE',
  Nf = 'NF',
  Ng = 'NG',
  Ni = 'NI',
  Nl = 'NL',
  No = 'NO',
  Np = 'NP',
  Nr = 'NR',
  Nu = 'NU',
  Nz = 'NZ',
  Om = 'OM',
  Pa = 'PA',
  Pe = 'PE',
  Pf = 'PF',
  Pg = 'PG',
  Ph = 'PH',
  Pk = 'PK',
  Pl = 'PL',
  Pm = 'PM',
  Pn = 'PN',
  Pr = 'PR',
  Ps = 'PS',
  Pt = 'PT',
  Pw = 'PW',
  Py = 'PY',
  Qa = 'QA',
  Re = 'RE',
  Ro = 'RO',
  Rs = 'RS',
  Ru = 'RU',
  Rw = 'RW',
  Sa = 'SA',
  Sb = 'SB',
  Sc = 'SC',
  Sd = 'SD',
  Se = 'SE',
  Sg = 'SG',
  Sh = 'SH',
  Si = 'SI',
  Sj = 'SJ',
  Sk = 'SK',
  Sl = 'SL',
  Sm = 'SM',
  Sn = 'SN',
  So = 'SO',
  Sr = 'SR',
  Ss = 'SS',
  St = 'ST',
  Sv = 'SV',
  Sx = 'SX',
  Sy = 'SY',
  Sz = 'SZ',
  Tc = 'TC',
  Td = 'TD',
  Tf = 'TF',
  Tg = 'TG',
  Th = 'TH',
  Tj = 'TJ',
  Tk = 'TK',
  Tl = 'TL',
  Tm = 'TM',
  Tn = 'TN',
  To = 'TO',
  Tr = 'TR',
  Tv = 'TV',
  Tw = 'TW',
  Tz = 'TZ',
  Ua = 'UA',
  Ug = 'UG',
  Us = 'US',
  Uy = 'UY',
  Uz = 'UZ',
  Va = 'VA',
  Vc = 'VC',
  Ve = 'VE',
  Vg = 'VG',
  Vi = 'VI',
  Vn = 'VN',
  Vu = 'VU',
  Wf = 'WF',
  Ws = 'WS',
  Xk = 'XK',
  Ye = 'YE',
  Yt = 'YT',
  Za = 'ZA',
  Zm = 'ZM',
  Zw = 'ZW'
}

export type CountryElement = CertificateElement & {
  __typename?: 'CountryElement';
  base: CertificateElementBase;
  countryProps?: Maybe<CountryElementCountryProps>;
  template?: Maybe<Template>;
  textProps: TextProps;
};

export type CountryElementCountryProps = {
  __typename?: 'CountryElementCountryProps';
  representation?: Maybe<CountryRepresentation>;
};

export type CountryElementCountryPropsInput = {
  representation: CountryRepresentation;
};

export type CountryElementInput = {
  base: CertificateElementBaseInput;
  countryProps: CountryElementCountryPropsInput;
  textProps: TextPropsInput;
};

export type CountryElementSpecPropsStandaloneUpdateInput = {
  countryProps: CountryElementCountryPropsInput;
  elementId: Scalars['Int']['input'];
};

export type CountryElementSpecPropsStandaloneUpdateResponse = {
  __typename?: 'CountryElementSpecPropsStandaloneUpdateResponse';
  countryProps?: Maybe<CountryElementCountryProps>;
  elementId?: Maybe<Scalars['Int']['output']>;
};

export type CountryElementUpdateInput = {
  base: CertificateElementBaseInput;
  countryProps: CountryElementCountryPropsInput;
  id: Scalars['Int']['input'];
  textProps: TextPropsInput;
};

export enum CountryRepresentation {
  CountryName = 'COUNTRY_NAME',
  Nationality = 'NATIONALITY'
}

export type DateDataSource = DateDataSourceCertificateField | DateDataSourceStatic | DateDataSourceStudentField | DateDataSourceTemplateVariable;

export type DateDataSourceCertificateField = {
  __typename?: 'DateDataSourceCertificateField';
  certificateField?: Maybe<CertificateDateField>;
  type?: Maybe<DateDataSourceType>;
};

export type DateDataSourceCertificateFieldInput = {
  field: CertificateDateField;
};

export type DateDataSourceInput =
  { certificateField: DateDataSourceCertificateFieldInput; static?: never; studentField?: never; templateVariable?: never; }
  |  { certificateField?: never; static: DateDataSourceStaticInput; studentField?: never; templateVariable?: never; }
  |  { certificateField?: never; static?: never; studentField: DateDataSourceStudentFieldInput; templateVariable?: never; }
  |  { certificateField?: never; static?: never; studentField?: never; templateVariable: DateDataSourceTemplateVariableInput; };

export type DateDataSourceStandaloneInput = {
  dataSource: DateDataSourceInput;
  elementId: Scalars['Int']['input'];
};

export type DateDataSourceStatic = {
  __typename?: 'DateDataSourceStatic';
  type?: Maybe<DateDataSourceType>;
  value?: Maybe<Scalars['String']['output']>;
};

export type DateDataSourceStaticInput = {
  value: Scalars['String']['input'];
};

export type DateDataSourceStudentField = {
  __typename?: 'DateDataSourceStudentField';
  studentField?: Maybe<StudentDateField>;
  type?: Maybe<DateDataSourceType>;
};

export type DateDataSourceStudentFieldInput = {
  field: StudentDateField;
};

export type DateDataSourceTemplateVariable = {
  __typename?: 'DateDataSourceTemplateVariable';
  dateVariableId?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<DateDataSourceType>;
};

export type DateDataSourceTemplateVariableInput = {
  variableId: Scalars['Int']['input'];
};

export enum DateDataSourceType {
  CertificateDateField = 'CERTIFICATE_DATE_FIELD',
  Static = 'STATIC',
  StudentDateField = 'STUDENT_DATE_FIELD',
  TemplateDateVariable = 'TEMPLATE_DATE_VARIABLE'
}

export type DateDataSourceUpdateResponse = {
  __typename?: 'DateDataSourceUpdateResponse';
  dateDataSource?: Maybe<DateDataSource>;
  elementId?: Maybe<Scalars['Int']['output']>;
};

export type DateElement = CertificateElement & {
  __typename?: 'DateElement';
  base: CertificateElementBase;
  dateDataSource?: Maybe<DateDataSource>;
  dateProps?: Maybe<DateProps>;
  template?: Maybe<Template>;
  textProps: TextProps;
};

export type DateElementInput = {
  base: CertificateElementBaseInput;
  dataSource: DateDataSourceInput;
  dateProps: DateElementSpecPropsInput;
  textProps: TextPropsInput;
};

export type DateElementSpecPropsInput = {
  calendarType: CalendarType;
  format: Scalars['String']['input'];
  offsetDays?: InputMaybe<Scalars['Int']['input']>;
  transformation?: InputMaybe<DateTransformationType>;
};

export type DateElementSpecPropsStandaloneInput = {
  dateProps: DateElementSpecPropsInput;
  elementId: Scalars['Int']['input'];
};

export type DateElementSpecPropsUpdateResponse = {
  __typename?: 'DateElementSpecPropsUpdateResponse';
  dateProps?: Maybe<DateProps>;
  elementId?: Maybe<Scalars['Int']['output']>;
};

export type DateElementUpdateInput = {
  base: CertificateElementBaseInput;
  dataSource: DateDataSourceInput;
  dateProps: DateElementSpecPropsInput;
  id: Scalars['Int']['input'];
  textProps: TextPropsInput;
};

export type DateProps = {
  __typename?: 'DateProps';
  calendarType?: Maybe<CalendarType>;
  format?: Maybe<Scalars['String']['output']>;
  offsetDays?: Maybe<Scalars['Int']['output']>;
  transformation?: Maybe<DateTransformationType>;
};

export enum DateTransformationType {
  AgeCalculation = 'AGE_CALCULATION'
}

export type DirectoryInfo = StorageObject & {
  __typename?: 'DirectoryInfo';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  fileCount?: Maybe<Scalars['Int']['output']>;
  folderCount?: Maybe<Scalars['Int']['output']>;
  isFromBucket?: Maybe<Scalars['Boolean']['output']>;
  isProtected?: Maybe<Scalars['Boolean']['output']>;
  lastModified?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
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

export enum ElementAlignment {
  Baseline = 'BASELINE',
  Bottom = 'BOTTOM',
  Center = 'CENTER',
  End = 'END',
  Start = 'START',
  Top = 'TOP'
}

export enum ElementImageFit {
  Contain = 'CONTAIN',
  Cover = 'COVER',
  Fill = 'FILL'
}

export type ElementOrderUpdateInput = {
  id: Scalars['Int']['input'];
  renderOrder: Scalars['Int']['input'];
};

export enum ElementOverflow {
  Ellipse = 'ELLIPSE',
  ResizeDown = 'RESIZE_DOWN',
  Truncate = 'TRUNCATE',
  Wrap = 'WRAP'
}

export enum ElementType {
  Country = 'COUNTRY',
  Date = 'DATE',
  Gender = 'GENDER',
  Image = 'IMAGE',
  Number = 'NUMBER',
  QrCode = 'QR_CODE',
  Text = 'TEXT'
}

export type ElementWithTextProps = {
  __typename?: 'ElementWithTextProps';
  textProps: TextProps;
};

export type FileInfo = StorageObject & {
  __typename?: 'FileInfo';
  contentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  directoryPath?: Maybe<Scalars['String']['output']>;
  fileType?: Maybe<FileType>;
  isFromBucket?: Maybe<Scalars['Boolean']['output']>;
  isInUse?: Maybe<Scalars['Boolean']['output']>;
  isProtected?: Maybe<Scalars['Boolean']['output']>;
  isPublic?: Maybe<Scalars['Boolean']['output']>;
  lastModified?: Maybe<Scalars['DateTime']['output']>;
  md5Hash?: Maybe<Scalars['String']['output']>;
  mediaLink?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
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

export enum FileSortField {
  Created = 'CREATED',
  Modified = 'MODIFIED',
  Name = 'NAME',
  Size = 'SIZE',
  Type = 'TYPE'
}

export enum FileType {
  Archive = 'ARCHIVE',
  Audio = 'AUDIO',
  Document = 'DOCUMENT',
  Font = 'FONT',
  Image = 'IMAGE',
  Other = 'OTHER',
  Video = 'VIDEO'
}

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
  contentTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  fileType?: InputMaybe<Scalars['String']['input']>;
  fileTypes?: InputMaybe<Array<FileType>>;
  includeDirectories?: InputMaybe<Scalars['Boolean']['input']>;
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

export type Font = {
  __typename?: 'Font';
  createdAt: Scalars['DateTime']['output'];
  file?: Maybe<FileInfo>;
  id: Scalars['Int']['output'];
  locale: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type FontCreateInput = {
  locale: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  storageFilePath: Scalars['String']['input'];
};

export type FontFilterArgs = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtAfter?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtBefore?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtFrom?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTo?: InputMaybe<Scalars['DateTime']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameEndsWith?: InputMaybe<Scalars['String']['input']>;
  nameEquals?: InputMaybe<Scalars['String']['input']>;
  nameIsEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  nameIsNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  nameNotContains?: InputMaybe<Scalars['String']['input']>;
  nameNotEquals?: InputMaybe<Scalars['String']['input']>;
  nameStartsWith?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtFrom?: InputMaybe<Scalars['DateTime']['input']>;
  updatedAtTo?: InputMaybe<Scalars['DateTime']['input']>;
};

export type FontReference = FontReferenceGoogle | FontReferenceSelfHosted;

export type FontReferenceGoogle = {
  __typename?: 'FontReferenceGoogle';
  identifier?: Maybe<Scalars['String']['output']>;
  type?: Maybe<FontSource>;
};

export type FontReferenceGoogleInput = {
  identifier: Scalars['String']['input'];
};

export type FontReferenceInput =
  { google: FontReferenceGoogleInput; selfHosted?: never; }
  |  { google?: never; selfHosted: FontReferenceSelfHostedInput; };

export type FontReferenceSelfHosted = {
  __typename?: 'FontReferenceSelfHosted';
  fontId?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<FontSource>;
};

export type FontReferenceSelfHostedInput = {
  fontId: Scalars['Int']['input'];
};

export enum FontSource {
  Google = 'GOOGLE',
  SelfHosted = 'SELF_HOSTED'
}

export type FontUpdateInput = {
  id: Scalars['Int']['input'];
  locale: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  storageFilePath: Scalars['String']['input'];
};

export type FontUsageCheckResult = {
  __typename?: 'FontUsageCheckResult';
  canDelete: Scalars['Boolean']['output'];
  deleteBlockReason?: Maybe<Scalars['String']['output']>;
  isInUse: Scalars['Boolean']['output'];
  usageCount: Scalars['Int']['output'];
  usedBy: Array<FontUsageReference>;
};

export type FontUsageReference = {
  __typename?: 'FontUsageReference';
  elementId: Scalars['Int']['output'];
  elementType: Scalars['String']['output'];
  templateId?: Maybe<Scalars['Int']['output']>;
  templateName?: Maybe<Scalars['String']['output']>;
};

export type FontsOrderByClause = {
  column: FontsOrderByColumn;
  order?: InputMaybe<OrderSortDirection>;
};

export enum FontsOrderByColumn {
  CreatedAt = 'CREATED_AT',
  Id = 'ID',
  Name = 'NAME',
  UpdatedAt = 'UPDATED_AT'
}

export type FontsWithFiltersResponse = {
  __typename?: 'FontsWithFiltersResponse';
  data: Array<Font>;
  pageInfo: PageInfo;
};

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE'
}

export type GenderElement = CertificateElement & {
  __typename?: 'GenderElement';
  base: CertificateElementBase;
  template?: Maybe<Template>;
  textProps: TextProps;
};

export type GenderElementInput = {
  base: CertificateElementBaseInput;
  textProps: TextPropsInput;
};

export type GenderElementUpdateInput = {
  base: CertificateElementBaseInput;
  id: Scalars['Int']['input'];
  textProps: TextPropsInput;
};

export type ImageDataSource = ImageDataSourceStorageFile;

export type ImageDataSourceInput =
  { storageFile: ImageDataSourceStorageFileInput; };

export type ImageDataSourceStorageFile = {
  __typename?: 'ImageDataSourceStorageFile';
  storageFileId?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<ImageDataSourceType>;
};

export type ImageDataSourceStorageFileInput = {
  storageFileId: Scalars['Int']['input'];
};

export enum ImageDataSourceType {
  StorageFile = 'STORAGE_FILE'
}

export type ImageElement = CertificateElement & {
  __typename?: 'ImageElement';
  base: CertificateElementBase;
  imageDataSource?: Maybe<ImageDataSource>;
  imageProps?: Maybe<ImageElementSpecProps>;
  template?: Maybe<Template>;
};

export type ImageElementInput = {
  base: CertificateElementBaseInput;
  dataSource: ImageDataSourceInput;
  imageProps: ImageElementSpecPropsInput;
};

export type ImageElementSpecProps = {
  __typename?: 'ImageElementSpecProps';
  elementId?: Maybe<Scalars['Int']['output']>;
  fit?: Maybe<ElementImageFit>;
  storageFileId?: Maybe<Scalars['Int']['output']>;
};

export type ImageElementSpecPropsInput = {
  fit: ElementImageFit;
};

export type ImageElementSpecPropsStandaloneUpdateInput = {
  elementId: Scalars['Int']['input'];
  imageProps: ImageElementSpecPropsInput;
};

export type ImageElementSpecPropsStandaloneUpdateResponse = {
  __typename?: 'ImageElementSpecPropsStandaloneUpdateResponse';
  elementId?: Maybe<Scalars['Int']['output']>;
  imageProps?: Maybe<ImageElementSpecProps>;
};

export type ImageElementUpdateInput = {
  base: CertificateElementBaseInput;
  dataSource: ImageDataSourceInput;
  id: Scalars['Int']['input'];
  imageProps: ImageElementSpecPropsInput;
};

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
  createCountryElement?: Maybe<CountryElement>;
  createDateElement?: Maybe<DateElement>;
  createFolder?: Maybe<FileOperationResult>;
  createFont: Font;
  createGenderElement?: Maybe<GenderElement>;
  createImageElement?: Maybe<ImageElement>;
  createNumberElement?: Maybe<NumberElement>;
  createQRCodeElement?: Maybe<QrCodeElement>;
  createRecipient: TemplateRecipient;
  createRecipients: Array<TemplateRecipient>;
  createStudent?: Maybe<Student>;
  createTemplate?: Maybe<Template>;
  createTemplateCategory: TemplateCategory;
  createTemplateConfig?: Maybe<TemplateConfig>;
  createTemplateDateVariable?: Maybe<TemplateDateVariable>;
  createTemplateNumberVariable?: Maybe<TemplateNumberVariable>;
  createTemplateRecipientGroup?: Maybe<TemplateRecipientGroup>;
  createTemplateSelectVariable?: Maybe<TemplateSelectVariable>;
  createTemplateTextVariable?: Maybe<TemplateTextVariable>;
  createTextElement?: Maybe<TextElement>;
  deleteElement?: Maybe<Scalars['Boolean']['output']>;
  deleteElements?: Maybe<Scalars['Boolean']['output']>;
  deleteFile?: Maybe<FileOperationResult>;
  deleteFont: Font;
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
  /** Update variable values. Throws on validation errors. */
  setRecipientVariableValues?: Maybe<RecipientWithVariableValues>;
  setStorageItemProtection?: Maybe<FileOperationResult>;
  suspendTemplate?: Maybe<Template>;
  unsuspendTemplate?: Maybe<Template>;
  updateCountryElement?: Maybe<CountryElement>;
  updateCountryElementSpecProps?: Maybe<CountryElementSpecPropsStandaloneUpdateResponse>;
  updateDateElement?: Maybe<DateElement>;
  updateDateElementDataSource?: Maybe<DateDataSourceUpdateResponse>;
  updateDateElementSpecProps?: Maybe<DateElementSpecPropsUpdateResponse>;
  updateDirectoryPermissions?: Maybe<FileOperationResult>;
  updateElementCommonProperties?: Maybe<CertificateElementBase>;
  updateElementTextProps?: Maybe<ElementWithTextProps>;
  updateElementsRenderOrder?: Maybe<Scalars['Boolean']['output']>;
  updateFont: Font;
  updateGenderElement?: Maybe<GenderElement>;
  updateImageElement?: Maybe<ImageElement>;
  updateImageElementSpecProps?: Maybe<ImageElementSpecPropsStandaloneUpdateResponse>;
  updateNumberElement?: Maybe<NumberElement>;
  updateNumberElementDataSource?: Maybe<NumberElementDataSourceUpdateResponse>;
  updateNumberElementSpecProps?: Maybe<NumberElementSpecPropsUpdateResponse>;
  updateQRCodeElement?: Maybe<QrCodeElement>;
  updateQRCodeElementSpecProps?: Maybe<QrCodeElementSpecPropsStandaloneUpdateResponse>;
  updateTemplate?: Maybe<Template>;
  updateTemplateCategory: TemplateCategory;
  updateTemplateConfig?: Maybe<TemplateConfig>;
  updateTemplateDateVariable?: Maybe<TemplateDateVariable>;
  updateTemplateNumberVariable?: Maybe<TemplateNumberVariable>;
  updateTemplateRecipientGroup?: Maybe<TemplateRecipientGroup>;
  updateTemplateSelectVariable?: Maybe<TemplateSelectVariable>;
  updateTemplateTextVariable?: Maybe<TemplateTextVariable>;
  updateTextElement?: Maybe<TextElement>;
  updateTextElementDataSource?: Maybe<TextDataSourceUpdateResponse>;
};


export type MutationCopyStorageItemsArgs = {
  input: StorageItemsCopyInput;
};


export type MutationCreateCountryElementArgs = {
  input: CountryElementInput;
};


export type MutationCreateDateElementArgs = {
  input: DateElementInput;
};


export type MutationCreateFolderArgs = {
  input: FolderCreateInput;
};


export type MutationCreateFontArgs = {
  input: FontCreateInput;
};


export type MutationCreateGenderElementArgs = {
  input: GenderElementInput;
};


export type MutationCreateImageElementArgs = {
  input: ImageElementInput;
};


export type MutationCreateNumberElementArgs = {
  input: NumberElementInput;
};


export type MutationCreateQrCodeElementArgs = {
  input: QrCodeElementInput;
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


export type MutationCreateTemplateConfigArgs = {
  input: TemplateConfigCreateInput;
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


export type MutationCreateTextElementArgs = {
  input: TextElementInput;
};


export type MutationDeleteElementArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteElementsArgs = {
  ids: Array<Scalars['Int']['input']>;
};


export type MutationDeleteFileArgs = {
  path: Scalars['String']['input'];
};


export type MutationDeleteFontArgs = {
  id: Scalars['Int']['input'];
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


export type MutationSetRecipientVariableValuesArgs = {
  recipientGroupItemId: Scalars['Int']['input'];
  values: Array<VariableValueInput>;
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


export type MutationUpdateCountryElementArgs = {
  input: CountryElementUpdateInput;
};


export type MutationUpdateCountryElementSpecPropsArgs = {
  input: CountryElementSpecPropsStandaloneUpdateInput;
};


export type MutationUpdateDateElementArgs = {
  input: DateElementUpdateInput;
};


export type MutationUpdateDateElementDataSourceArgs = {
  input: DateDataSourceStandaloneInput;
};


export type MutationUpdateDateElementSpecPropsArgs = {
  input: DateElementSpecPropsStandaloneInput;
};


export type MutationUpdateDirectoryPermissionsArgs = {
  input: DirectoryPermissionsUpdateInput;
};


export type MutationUpdateElementCommonPropertiesArgs = {
  input: CertificateElementBaseUpdateInput;
};


export type MutationUpdateElementTextPropsArgs = {
  input: TextPropsUpdateInput;
};


export type MutationUpdateElementsRenderOrderArgs = {
  updates: Array<ElementOrderUpdateInput>;
};


export type MutationUpdateFontArgs = {
  input: FontUpdateInput;
};


export type MutationUpdateGenderElementArgs = {
  input: GenderElementUpdateInput;
};


export type MutationUpdateImageElementArgs = {
  input: ImageElementUpdateInput;
};


export type MutationUpdateImageElementSpecPropsArgs = {
  input: ImageElementSpecPropsStandaloneUpdateInput;
};


export type MutationUpdateNumberElementArgs = {
  input: NumberElementUpdateInput;
};


export type MutationUpdateNumberElementDataSourceArgs = {
  input: NumberElementDataSourceStandaloneUpdateInput;
};


export type MutationUpdateNumberElementSpecPropsArgs = {
  input: NumberElementSpecPropsStandaloneUpdateInput;
};


export type MutationUpdateQrCodeElementArgs = {
  input: QrCodeElementUpdateInput;
};


export type MutationUpdateQrCodeElementSpecPropsArgs = {
  input: QrCodeElementSpecPropsStandaloneUpdateInput;
};


export type MutationUpdateTemplateArgs = {
  input: TemplateUpdateInput;
};


export type MutationUpdateTemplateCategoryArgs = {
  input: TemplateCategoryUpdateInput;
};


export type MutationUpdateTemplateConfigArgs = {
  input: TemplateConfigUpdateInput;
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


export type MutationUpdateTextElementArgs = {
  input: TextElementUpdateInput;
};


export type MutationUpdateTextElementDataSourceArgs = {
  input: TextDataSourceStandaloneInput;
};

export type NumberDataSource = {
  __typename?: 'NumberDataSource';
  numberVariableId?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<NumberDataSourceType>;
};

export type NumberDataSourceInput = {
  variableId: Scalars['Int']['input'];
};

export enum NumberDataSourceType {
  TemplateNumberVariable = 'TEMPLATE_NUMBER_VARIABLE'
}

export type NumberElement = CertificateElement & {
  __typename?: 'NumberElement';
  base: CertificateElementBase;
  numberDataSource?: Maybe<NumberDataSource>;
  numberProps?: Maybe<NumberProps>;
  template?: Maybe<Template>;
  textProps: TextProps;
};

export type NumberElementDataSourceStandaloneUpdateInput = {
  dataSource: NumberDataSourceInput;
  elementId: Scalars['Int']['input'];
};

export type NumberElementDataSourceUpdateResponse = {
  __typename?: 'NumberElementDataSourceUpdateResponse';
  elementId?: Maybe<Scalars['Int']['output']>;
  numberDataSource?: Maybe<NumberDataSource>;
};

export type NumberElementInput = {
  base: CertificateElementBaseInput;
  dataSource: NumberDataSourceInput;
  numberProps: NumberElementSpecPropsInput;
  textProps: TextPropsInput;
};

export type NumberElementSpecPropsInput = {
  mapping: Scalars['StringMap']['input'];
};

export type NumberElementSpecPropsStandaloneUpdateInput = {
  elementId: Scalars['Int']['input'];
  numberProps: NumberElementSpecPropsInput;
};

export type NumberElementSpecPropsUpdateResponse = {
  __typename?: 'NumberElementSpecPropsUpdateResponse';
  elementId?: Maybe<Scalars['Int']['output']>;
  numberProps?: Maybe<NumberProps>;
};

export type NumberElementUpdateInput = {
  base: CertificateElementBaseInput;
  dataSource: NumberDataSourceInput;
  id: Scalars['Int']['input'];
  numberProps: NumberElementSpecPropsInput;
  textProps: TextPropsInput;
};

export type NumberProps = {
  __typename?: 'NumberProps';
  elementId?: Maybe<Scalars['Int']['output']>;
  mapping?: Maybe<Scalars['StringMap']['output']>;
  textPropsId?: Maybe<Scalars['Int']['output']>;
  variableId?: Maybe<Scalars['Int']['output']>;
};

export enum OrderSortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

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

export type QrCodeElement = CertificateElement & {
  __typename?: 'QRCodeElement';
  base: CertificateElementBase;
  qrCodeProps: QrCodeElementSpecProps;
  template?: Maybe<Template>;
};

export type QrCodeElementInput = {
  base: CertificateElementBaseInput;
  qrCodeProps: QrCodeElementSpecPropsInput;
};

export type QrCodeElementSpecProps = {
  __typename?: 'QRCodeElementSpecProps';
  backgroundColor?: Maybe<Scalars['String']['output']>;
  elementId?: Maybe<Scalars['Int']['output']>;
  errorCorrection?: Maybe<QrCodeErrorCorrection>;
  foregroundColor?: Maybe<Scalars['String']['output']>;
};

export type QrCodeElementSpecPropsInput = {
  backgroundColor: Scalars['String']['input'];
  errorCorrection: QrCodeErrorCorrection;
  foregroundColor: Scalars['String']['input'];
};

export type QrCodeElementSpecPropsStandaloneUpdateInput = {
  elementId: Scalars['Int']['input'];
  qrCodeProps: QrCodeElementSpecPropsInput;
};

export type QrCodeElementSpecPropsStandaloneUpdateResponse = {
  __typename?: 'QRCodeElementSpecPropsStandaloneUpdateResponse';
  elementId?: Maybe<Scalars['Int']['output']>;
  qrCodeProps?: Maybe<QrCodeElementSpecProps>;
};

export type QrCodeElementUpdateInput = {
  base: CertificateElementBaseInput;
  id: Scalars['Int']['input'];
  qrCodeProps: QrCodeElementSpecPropsInput;
};

export enum QrCodeErrorCorrection {
  H = 'H',
  L = 'L',
  M = 'M',
  Q = 'Q'
}

export type Query = {
  __typename?: 'Query';
  categoryChildren: Array<TemplateCategory>;
  checkFontUsage: FontUsageCheckResult;
  directoryChildren?: Maybe<Array<DirectoryInfo>>;
  elementsByTemplateId?: Maybe<Array<CertificateElement>>;
  fileInfo?: Maybe<FileInfo>;
  fileUsage?: Maybe<FileUsageResult>;
  folderInfo?: Maybe<DirectoryInfo>;
  font?: Maybe<Font>;
  fonts: FontsWithFiltersResponse;
  listFiles?: Maybe<StorageObjectList>;
  mainTemplateCategory: TemplateCategory;
  me?: Maybe<User>;
  recipient?: Maybe<TemplateRecipient>;
  /** Get variable values for a recipient. Auto-fixes invalid data by setting to null. */
  recipientVariableValues?: Maybe<RecipientWithVariableValues>;
  /** Get all recipients with values. Auto-fixes invalid data by setting to null. Supports pagination. */
  recipientVariableValuesByGroup?: Maybe<RecipientVariableValuesGroupResult>;
  recipientsByGroupId: Array<TemplateRecipient>;
  recipientsByGroupIdFiltered: RecipientsWithFiltersResponse;
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
  templateConfig?: Maybe<TemplateConfig>;
  templateConfigByTemplateId?: Maybe<TemplateConfig>;
  templateRecipientGroupById?: Maybe<TemplateRecipientGroup>;
  templateRecipientGroupsByTemplateId?: Maybe<Array<TemplateRecipientGroup>>;
  templateVariable?: Maybe<TemplateVariable>;
  templateVariablesByTemplateId?: Maybe<Array<TemplateVariable>>;
  templates?: Maybe<PaginatedTemplatesResponse>;
  templatesByCategoryId?: Maybe<TemplatesWithFiltersResponse>;
  templatesConfigs?: Maybe<TemplatesConfigs>;
  textElementById?: Maybe<TextElement>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryCategoryChildrenArgs = {
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCheckFontUsageArgs = {
  id: Scalars['Int']['input'];
};


export type QueryDirectoryChildrenArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type QueryElementsByTemplateIdArgs = {
  templateId: Scalars['Int']['input'];
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


export type QueryFontArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFontsArgs = {
  filterArgs?: InputMaybe<FontFilterArgs>;
  orderBy?: InputMaybe<Array<FontsOrderByClause>>;
  paginationArgs?: InputMaybe<PaginationArgs>;
};


export type QueryListFilesArgs = {
  input: FilesListInput;
};


export type QueryRecipientArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRecipientVariableValuesArgs = {
  recipientGroupItemId: Scalars['Int']['input'];
};


export type QueryRecipientVariableValuesByGroupArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  recipientGroupId: Scalars['Int']['input'];
};


export type QueryRecipientsByGroupIdArgs = {
  recipientGroupId: Scalars['Int']['input'];
};


export type QueryRecipientsByGroupIdFilteredArgs = {
  filterArgs?: InputMaybe<StudentFilterArgs>;
  orderBy?: InputMaybe<Array<StudentsOrderByClause>>;
  paginationArgs?: InputMaybe<PaginationArgs>;
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


export type QueryTemplateConfigArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTemplateConfigByTemplateIdArgs = {
  templateId: Scalars['Int']['input'];
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


export type QueryTextElementByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type RecipientVariableValuesGroupResult = {
  __typename?: 'RecipientVariableValuesGroupResult';
  data?: Maybe<Array<RecipientWithVariableValues>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type RecipientWithVariableValues = {
  __typename?: 'RecipientWithVariableValues';
  recipientGroupItemId?: Maybe<Scalars['Int']['output']>;
  studentId?: Maybe<Scalars['Int']['output']>;
  studentName?: Maybe<Scalars['String']['output']>;
  /** Map of variableId to value. Use template variables query to get type/constraint info. All template variables are present (null if not set). */
  variableValues?: Maybe<Scalars['JSON']['output']>;
};

export type RecipientsWithFiltersResponse = {
  __typename?: 'RecipientsWithFiltersResponse';
  data?: Maybe<Array<TemplateRecipient>>;
  pageInfo: PageInfo;
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
  isProtected?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
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

export enum StudentDateField {
  DateOfBirth = 'DATE_OF_BIRTH'
}

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

export enum StudentTextField {
  StudentEmail = 'STUDENT_EMAIL',
  StudentName = 'STUDENT_NAME'
}

export type StudentsOrderByClause = {
  column: StudentsOrderByColumn;
  order?: InputMaybe<OrderSortDirection>;
};

export enum StudentsOrderByColumn {
  CreatedAt = 'CREATED_AT',
  DateOfBirth = 'DATE_OF_BIRTH',
  Email = 'EMAIL',
  Gender = 'GENDER',
  Id = 'ID',
  Name = 'NAME',
  UpdatedAt = 'UPDATED_AT'
}

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

export type TemplateConfig = {
  __typename?: 'TemplateConfig';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  language: AppLanguage;
  template?: Maybe<Template>;
  templateId?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  width: Scalars['Int']['output'];
};

export type TemplateConfigCreateInput = {
  height: Scalars['Int']['input'];
  language: AppLanguage;
  templateId: Scalars['Int']['input'];
  width: Scalars['Int']['input'];
};

export type TemplateConfigUpdateInput = {
  height: Scalars['Int']['input'];
  id: Scalars['Int']['input'];
  language: AppLanguage;
  width: Scalars['Int']['input'];
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
  id: Scalars['Int']['output'];
  recipientGroup?: Maybe<TemplateRecipientGroup>;
  recipientGroupId: Scalars['Int']['output'];
  student?: Maybe<Student>;
  studentId: Scalars['Int']['output'];
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
  imagePath?: InputMaybe<Scalars['String']['input']>;
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

export enum TemplateVariableType {
  Date = 'DATE',
  Number = 'NUMBER',
  Select = 'SELECT',
  Text = 'TEXT'
}

export type TemplatesConfig = {
  __typename?: 'TemplatesConfig';
  key?: Maybe<TemplatesConfigsKey>;
  value?: Maybe<Scalars['String']['output']>;
};

export type TemplatesConfigs = {
  __typename?: 'TemplatesConfigs';
  configs?: Maybe<Array<TemplatesConfig>>;
};

export enum TemplatesConfigsKey {
  AllowedFileTypes = 'ALLOWED_FILE_TYPES',
  MaxBackgroundSize = 'MAX_BACKGROUND_SIZE'
}

export type TemplatesOrderByClause = {
  column: TemplatesOrderByColumn;
  order?: InputMaybe<OrderSortDirection>;
};

export enum TemplatesOrderByColumn {
  CreatedAt = 'CREATED_AT',
  Name = 'NAME',
  Order = 'ORDER',
  UpdatedAt = 'UPDATED_AT'
}

export type TemplatesWithFiltersResponse = {
  __typename?: 'TemplatesWithFiltersResponse';
  data: Array<Template>;
  pageInfo: PageInfo;
};

export type TextDataSource = TextDataSourceCertificateField | TextDataSourceStatic | TextDataSourceStudentField | TextDataSourceTemplateSelectVariable | TextDataSourceTemplateTextVariable;

export type TextDataSourceCertificateField = {
  __typename?: 'TextDataSourceCertificateField';
  certificateField?: Maybe<CertificateTextField>;
  type?: Maybe<TextDataSourceType>;
};

export type TextDataSourceCertificateFieldInput = {
  field: CertificateTextField;
};

export type TextDataSourceInput =
  { certificateField: TextDataSourceCertificateFieldInput; static?: never; studentField?: never; templateSelectVariable?: never; templateTextVariable?: never; }
  |  { certificateField?: never; static: TextDataSourceStaticInput; studentField?: never; templateSelectVariable?: never; templateTextVariable?: never; }
  |  { certificateField?: never; static?: never; studentField: TextDataSourceStudentFieldInput; templateSelectVariable?: never; templateTextVariable?: never; }
  |  { certificateField?: never; static?: never; studentField?: never; templateSelectVariable: TextDataSourceTemplateSelectVariableInput; templateTextVariable?: never; }
  |  { certificateField?: never; static?: never; studentField?: never; templateSelectVariable?: never; templateTextVariable: TextDataSourceTemplateTextVariableInput; };

export type TextDataSourceStandaloneInput = {
  dataSource: TextDataSourceInput;
  elementId: Scalars['Int']['input'];
};

export type TextDataSourceStatic = {
  __typename?: 'TextDataSourceStatic';
  type?: Maybe<TextDataSourceType>;
  value?: Maybe<Scalars['String']['output']>;
};

export type TextDataSourceStaticInput = {
  value: Scalars['String']['input'];
};

export type TextDataSourceStudentField = {
  __typename?: 'TextDataSourceStudentField';
  studentField?: Maybe<StudentTextField>;
  type?: Maybe<TextDataSourceType>;
};

export type TextDataSourceStudentFieldInput = {
  field: StudentTextField;
};

export type TextDataSourceTemplateSelectVariable = {
  __typename?: 'TextDataSourceTemplateSelectVariable';
  selectVariableId?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<TextDataSourceType>;
};

export type TextDataSourceTemplateSelectVariableInput = {
  variableId: Scalars['Int']['input'];
};

export type TextDataSourceTemplateTextVariable = {
  __typename?: 'TextDataSourceTemplateTextVariable';
  textVariableId?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<TextDataSourceType>;
};

export type TextDataSourceTemplateTextVariableInput = {
  variableId: Scalars['Int']['input'];
};

export enum TextDataSourceType {
  CertificateTextField = 'CERTIFICATE_TEXT_FIELD',
  Static = 'STATIC',
  StudentTextField = 'STUDENT_TEXT_FIELD',
  TemplateSelectVariable = 'TEMPLATE_SELECT_VARIABLE',
  TemplateTextVariable = 'TEMPLATE_TEXT_VARIABLE'
}

export type TextDataSourceUpdateResponse = {
  __typename?: 'TextDataSourceUpdateResponse';
  elementId: Scalars['Int']['output'];
  textDataSource: TextDataSource;
  variableId?: Maybe<Scalars['Int']['output']>;
};

export type TextElement = CertificateElement & {
  __typename?: 'TextElement';
  base: CertificateElementBase;
  template?: Maybe<Template>;
  textDataSource: TextDataSource;
  textElementSpecProps: TextElementSpecProps;
  textProps: TextProps;
};

export type TextElementInput = {
  base: CertificateElementBaseInput;
  dataSource: TextDataSourceInput;
  textProps: TextPropsInput;
};

export type TextElementSpecProps = {
  __typename?: 'TextElementSpecProps';
  elementId: Scalars['Int']['output'];
  textPropsId: Scalars['Int']['output'];
  variableId?: Maybe<Scalars['Int']['output']>;
};

export type TextElementUpdateInput = {
  base: CertificateElementBaseInput;
  dataSource: TextDataSourceInput;
  id: Scalars['Int']['input'];
  textProps: TextPropsInput;
};

export type TextProps = {
  __typename?: 'TextProps';
  color: Scalars['String']['output'];
  fontRef: FontReference;
  fontSize: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  overflow: ElementOverflow;
};

export type TextPropsInput = {
  color: Scalars['String']['input'];
  fontRef: FontReferenceInput;
  fontSize: Scalars['Int']['input'];
  overflow: ElementOverflow;
};

export type TextPropsUpdateInput = {
  color: Scalars['String']['input'];
  fontRef: FontReferenceInput;
  fontSize: Scalars['Int']['input'];
  id: Scalars['Int']['input'];
  overflow: ElementOverflow;
};

export type UploadSignedUrlGenerateInput = {
  contentMd5: Scalars['String']['input'];
  contentType: Scalars['String']['input'];
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

export type VariableValueInput = {
  /** Value as string (nullable to clear values). Backend parses to correct type. For SELECT multiple: JSON array string like '["opt1","opt2"]' */
  value?: InputMaybe<Scalars['String']['input']>;
  variableId: Scalars['Int']['input'];
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

export type FontQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type FontQuery = { __typename?: 'Query', font?: { __typename?: 'Font', id: number, name: string, locale: Array<string>, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null } | null };

export type FontsQueryVariables = Exact<{
  paginationArgs?: InputMaybe<PaginationArgs>;
  orderBy?: InputMaybe<Array<FontsOrderByClause> | FontsOrderByClause>;
  filterArgs?: InputMaybe<FontFilterArgs>;
}>;


export type FontsQuery = { __typename?: 'Query', fonts: { __typename?: 'FontsWithFiltersResponse', data: Array<{ __typename?: 'Font', id: number, name: string, locale: Array<string>, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null }>, pageInfo: { __typename?: 'PageInfo', total: number, perPage: number, currentPage: number, lastPage: number, hasMorePages: boolean } } };

export type CheckFontUsageQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type CheckFontUsageQuery = { __typename?: 'Query', checkFontUsage: { __typename?: 'FontUsageCheckResult', isInUse: boolean, usageCount: number, canDelete: boolean, deleteBlockReason?: string | null, usedBy: Array<{ __typename?: 'FontUsageReference', elementId: number, elementType: string, templateId?: number | null, templateName?: string | null }> } };

export type CreateFontMutationVariables = Exact<{
  input: FontCreateInput;
}>;


export type CreateFontMutation = { __typename?: 'Mutation', createFont: { __typename?: 'Font', id: number, name: string, locale: Array<string>, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null } };

export type UpdateFontMutationVariables = Exact<{
  input: FontUpdateInput;
}>;


export type UpdateFontMutation = { __typename?: 'Mutation', updateFont: { __typename?: 'Font', id: number, name: string, locale: Array<string>, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null } };

export type DeleteFontMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteFontMutation = { __typename?: 'Mutation', deleteFont: { __typename?: 'Font', id: number, name: string, locale: Array<string>, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null } };

export type DirectoryChildrenQueryVariables = Exact<{
  path?: InputMaybe<Scalars['String']['input']>;
}>;


export type DirectoryChildrenQuery = { __typename?: 'Query', directoryChildren?: Array<{ __typename?: 'DirectoryInfo', createdAt?: any | null, fileCount?: number | null, folderCount?: number | null, isFromBucket?: boolean | null, isProtected?: boolean | null, lastModified?: any | null, name?: string | null, path: string, protectChildren?: boolean | null, totalSize?: number | null, permissions?: { __typename?: 'DirectoryPermissions', allowCreateSubDirs?: boolean | null, allowDelete?: boolean | null, allowDeleteFiles?: boolean | null, allowMove?: boolean | null, allowMoveFiles?: boolean | null, allowUploads?: boolean | null } | null }> | null };

export type FileInfoQueryVariables = Exact<{
  path: Scalars['String']['input'];
}>;


export type FileInfoQuery = { __typename?: 'Query', fileInfo?: { __typename?: 'FileInfo', contentType?: string | null, createdAt?: any | null, directoryPath?: string | null, fileType?: FileType | null, isFromBucket?: boolean | null, isInUse?: boolean | null, isProtected?: boolean | null, isPublic?: boolean | null, lastModified?: any | null, md5Hash?: string | null, mediaLink?: string | null, name?: string | null, path: string, size: number, url: string, usages?: Array<{ __typename?: 'FileUsageInfo', createdAt?: any | null, filePath?: string | null, id?: string | null, referenceId?: string | null, referenceTable?: string | null, usageType?: string | null }> | null } | null };

export type FileUsageQueryVariables = Exact<{
  input: FileUsageCheckInput;
}>;


export type FileUsageQuery = { __typename?: 'Query', fileUsage?: { __typename?: 'FileUsageResult', canDelete?: boolean | null, deleteBlockReason?: string | null, isInUse?: boolean | null, usages?: Array<{ __typename?: 'FileUsageInfo', createdAt?: any | null, filePath?: string | null, id?: string | null, referenceId?: string | null, referenceTable?: string | null, usageType?: string | null }> | null } | null };

export type FolderInfoQueryVariables = Exact<{
  path: Scalars['String']['input'];
}>;


export type FolderInfoQuery = { __typename?: 'Query', folderInfo?: { __typename?: 'DirectoryInfo', createdAt?: any | null, fileCount?: number | null, folderCount?: number | null, isFromBucket?: boolean | null, isProtected?: boolean | null, lastModified?: any | null, name?: string | null, path: string, protectChildren?: boolean | null, totalSize?: number | null, permissions?: { __typename?: 'DirectoryPermissions', allowCreateSubDirs?: boolean | null, allowDelete?: boolean | null, allowDeleteFiles?: boolean | null, allowMove?: boolean | null, allowMoveFiles?: boolean | null, allowUploads?: boolean | null } | null } | null };

export type ListFilesQueryVariables = Exact<{
  input: FilesListInput;
}>;


export type ListFilesQuery = { __typename?: 'Query', listFiles?: { __typename?: 'StorageObjectList', hasMore: boolean, limit: number, offset: number, totalCount: number, items?: Array<
      | { __typename?: 'DirectoryInfo', createdAt?: any | null, fileCount?: number | null, folderCount?: number | null, isFromBucket?: boolean | null, isProtected?: boolean | null, lastModified?: any | null, name?: string | null, path: string, protectChildren?: boolean | null, totalSize?: number | null, permissions?: { __typename?: 'DirectoryPermissions', allowCreateSubDirs?: boolean | null, allowDelete?: boolean | null, allowDeleteFiles?: boolean | null, allowMove?: boolean | null, allowMoveFiles?: boolean | null, allowUploads?: boolean | null } | null }
      | { __typename?: 'FileInfo', contentType?: string | null, createdAt?: any | null, directoryPath?: string | null, fileType?: FileType | null, isFromBucket?: boolean | null, isInUse?: boolean | null, isProtected?: boolean | null, isPublic?: boolean | null, lastModified?: any | null, md5Hash?: string | null, mediaLink?: string | null, name?: string | null, path: string, size: number, url: string, usages?: Array<{ __typename?: 'FileUsageInfo', createdAt?: any | null, filePath?: string | null, id?: string | null, referenceId?: string | null, referenceTable?: string | null, usageType?: string | null }> | null }
    > | null } | null };

export type SearchFilesQueryVariables = Exact<{
  fileType?: InputMaybe<Scalars['String']['input']>;
  folder?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  searchTerm: Scalars['String']['input'];
}>;


export type SearchFilesQuery = { __typename?: 'Query', searchFiles?: { __typename?: 'StorageObjectList', hasMore: boolean, limit: number, offset: number, totalCount: number, items?: Array<
      | { __typename?: 'DirectoryInfo', createdAt?: any | null, fileCount?: number | null, folderCount?: number | null, isFromBucket?: boolean | null, isProtected?: boolean | null, lastModified?: any | null, name?: string | null, path: string, protectChildren?: boolean | null, totalSize?: number | null, permissions?: { __typename?: 'DirectoryPermissions', allowCreateSubDirs?: boolean | null, allowDelete?: boolean | null, allowDeleteFiles?: boolean | null, allowMove?: boolean | null, allowMoveFiles?: boolean | null, allowUploads?: boolean | null } | null }
      | { __typename?: 'FileInfo', contentType?: string | null, createdAt?: any | null, directoryPath?: string | null, fileType?: FileType | null, isFromBucket?: boolean | null, isInUse?: boolean | null, isProtected?: boolean | null, isPublic?: boolean | null, lastModified?: any | null, md5Hash?: string | null, mediaLink?: string | null, name?: string | null, path: string, size: number, url: string, usages?: Array<{ __typename?: 'FileUsageInfo', createdAt?: any | null, filePath?: string | null, id?: string | null, referenceId?: string | null, referenceTable?: string | null, usageType?: string | null }> | null }
    > | null } | null };

export type StorageStatsQueryVariables = Exact<{
  path?: InputMaybe<Scalars['String']['input']>;
}>;


export type StorageStatsQuery = { __typename?: 'Query', storageStats?: { __typename?: 'StorageStats', totalFiles?: number | null, directoryCount?: number | null, totalSize?: string | null, fileTypeBreakdown?: Array<{ __typename?: 'FileTypeBreakdown', count?: number | null, type?: FileType | null }> | null } | null };

export type CopyStorageItemsMutationVariables = Exact<{
  input: StorageItemsCopyInput;
}>;


export type CopyStorageItemsMutation = { __typename?: 'Mutation', copyStorageItems?: { __typename?: 'BulkOperationResult', message?: string | null, success?: boolean | null, failureCount?: number | null, successCount?: number | null, failures?: Array<{ __typename?: 'BulkOperationFailure', error?: string | null, path?: string | null }> | null, successfulItems?: Array<
      | { __typename?: 'DirectoryInfo', isProtected?: boolean | null, name?: string | null, path: string }
      | { __typename?: 'FileInfo', isProtected?: boolean | null, name?: string | null, path: string }
    > | null } | null };

export type CreateFolderMutationVariables = Exact<{
  input: FolderCreateInput;
}>;


export type CreateFolderMutation = { __typename?: 'Mutation', createFolder?: { __typename?: 'FileOperationResult', message?: string | null, success?: boolean | null, data?:
      | { __typename?: 'DirectoryInfo', isProtected?: boolean | null, name?: string | null, path: string }
      | { __typename?: 'FileInfo', isProtected?: boolean | null, name?: string | null, path: string }
     | null } | null };

export type DeleteFileMutationVariables = Exact<{
  path: Scalars['String']['input'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile?: { __typename?: 'FileOperationResult', message?: string | null, success?: boolean | null, data?:
      | { __typename?: 'DirectoryInfo', isProtected?: boolean | null, name?: string | null, path: string }
      | { __typename?: 'FileInfo', isProtected?: boolean | null, name?: string | null, path: string }
     | null } | null };

export type DeleteStorageItemsMutationVariables = Exact<{
  input: StorageItemsDeleteInput;
}>;


export type DeleteStorageItemsMutation = { __typename?: 'Mutation', deleteStorageItems?: { __typename?: 'BulkOperationResult', message?: string | null, success?: boolean | null, failureCount?: number | null, successCount?: number | null, failures?: Array<{ __typename?: 'BulkOperationFailure', error?: string | null, path?: string | null }> | null, successfulItems?: Array<
      | { __typename?: 'DirectoryInfo', isProtected?: boolean | null, name?: string | null, path: string }
      | { __typename?: 'FileInfo', isProtected?: boolean | null, name?: string | null, path: string }
    > | null } | null };

export type GenerateUploadSignedUrlMutationVariables = Exact<{
  input: UploadSignedUrlGenerateInput;
}>;


export type GenerateUploadSignedUrlMutation = { __typename?: 'Mutation', generateUploadSignedUrl?: string | null };

export type MoveStorageItemsMutationVariables = Exact<{
  input: StorageItemsMoveInput;
}>;


export type MoveStorageItemsMutation = { __typename?: 'Mutation', moveStorageItems?: { __typename?: 'BulkOperationResult', message?: string | null, success?: boolean | null, failureCount?: number | null, successCount?: number | null, failures?: Array<{ __typename?: 'BulkOperationFailure', error?: string | null, path?: string | null }> | null, successfulItems?: Array<
      | { __typename?: 'DirectoryInfo', isProtected?: boolean | null, name?: string | null, path: string }
      | { __typename?: 'FileInfo', isProtected?: boolean | null, name?: string | null, path: string }
    > | null } | null };

export type RenameFileMutationVariables = Exact<{
  input: FileRenameInput;
}>;


export type RenameFileMutation = { __typename?: 'Mutation', renameFile?: { __typename?: 'FileOperationResult', message?: string | null, success?: boolean | null, data?:
      | { __typename?: 'DirectoryInfo', isProtected?: boolean | null, name?: string | null, path: string }
      | { __typename?: 'FileInfo', isProtected?: boolean | null, name?: string | null, path: string }
     | null } | null };

export type SetStorageItemProtectionMutationVariables = Exact<{
  input: StorageItemProtectionUpdateInput;
}>;


export type SetStorageItemProtectionMutation = { __typename?: 'Mutation', setStorageItemProtection?: { __typename?: 'FileOperationResult', message?: string | null, success?: boolean | null, data?:
      | { __typename?: 'DirectoryInfo', isProtected?: boolean | null, name?: string | null, path: string }
      | { __typename?: 'FileInfo', isProtected?: boolean | null, name?: string | null, path: string }
     | null } | null };

export type UpdateDirectoryPermissionsMutationVariables = Exact<{
  input: DirectoryPermissionsUpdateInput;
}>;


export type UpdateDirectoryPermissionsMutation = { __typename?: 'Mutation', updateDirectoryPermissions?: { __typename?: 'FileOperationResult', message?: string | null, success?: boolean | null, data?:
      | { __typename?: 'DirectoryInfo', isProtected?: boolean | null, name?: string | null, path: string }
      | { __typename?: 'FileInfo', isProtected?: boolean | null, name?: string | null, path: string }
     | null } | null };

export type StudentQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type StudentQuery = { __typename?: 'Query', student?: { __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, phoneNumber?: any | null, email?: string | null, createdAt?: any | null, updatedAt?: any | null, recipientRecords?: Array<{ __typename?: 'TemplateRecipient', id: number, studentId: number, recipientGroupId: number, createdAt?: any | null, updatedAt?: any | null }> | null } | null };

export type StudentsQueryVariables = Exact<{
  orderBy?: InputMaybe<Array<StudentsOrderByClause> | StudentsOrderByClause>;
  paginationArgs?: InputMaybe<PaginationArgs>;
  filterArgs?: InputMaybe<StudentFilterArgs>;
}>;


export type StudentsQuery = { __typename?: 'Query', students: { __typename?: 'StudentsWithFiltersResponse', data: Array<{ __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, phoneNumber?: any | null, email?: string | null, createdAt?: any | null, updatedAt?: any | null }>, pageInfo: { __typename?: 'PageInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } } };

export type StudentsInRecipientGroupQueryVariables = Exact<{
  recipientGroupId: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<StudentsOrderByClause> | StudentsOrderByClause>;
  paginationArgs?: InputMaybe<PaginationArgs>;
  filterArgs?: InputMaybe<StudentFilterArgs>;
}>;


export type StudentsInRecipientGroupQuery = { __typename?: 'Query', studentsInRecipientGroup: { __typename?: 'StudentsWithFiltersResponse', data: Array<{ __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, phoneNumber?: any | null, email?: string | null, createdAt?: any | null, updatedAt?: any | null }>, pageInfo: { __typename?: 'PageInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } } };

export type StudentsNotInRecipientGroupQueryVariables = Exact<{
  recipientGroupId: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<StudentsOrderByClause> | StudentsOrderByClause>;
  paginationArgs?: InputMaybe<PaginationArgs>;
  filterArgs?: InputMaybe<StudentFilterArgs>;
}>;


export type StudentsNotInRecipientGroupQuery = { __typename?: 'Query', studentsNotInRecipientGroup: { __typename?: 'StudentsWithFiltersResponse', data: Array<{ __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, phoneNumber?: any | null, email?: string | null, createdAt?: any | null, updatedAt?: any | null }>, pageInfo: { __typename?: 'PageInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } } };

export type CreateStudentMutationVariables = Exact<{
  input: StudentCreateInput;
}>;


export type CreateStudentMutation = { __typename?: 'Mutation', createStudent?: { __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, phoneNumber?: any | null, email?: string | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type DeleteStudentMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteStudentMutation = { __typename?: 'Mutation', deleteStudent?: { __typename?: 'Student', id: number, name: string, createdAt?: any | null, updatedAt?: any | null } | null };

export type PartiallyUpdateStudentMutationVariables = Exact<{
  input: PartialStudentUpdateInput;
}>;


export type PartiallyUpdateStudentMutation = { __typename?: 'Mutation', partiallyUpdateStudent?: { __typename?: 'Student', id: number, name: string, gender?: Gender | null, nationality?: CountryCode | null, dateOfBirth?: any | null, email?: string | null, phoneNumber?: any | null, createdAt?: any | null, updatedAt?: any | null } | null };

export type TemplateQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TemplateQuery = { __typename?: 'Query', template?: { __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type TemplatesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationArgs>;
}>;


export type TemplatesQuery = { __typename?: 'Query', templates?: { __typename?: 'PaginatedTemplatesResponse', data?: Array<{ __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null }> | null, pageInfo?: { __typename?: 'PageInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } | null } | null };

export type TemplatesConfigsQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplatesConfigsQuery = { __typename?: 'Query', templatesConfigs?: { __typename?: 'TemplatesConfigs', configs?: Array<{ __typename?: 'TemplatesConfig', key?: TemplatesConfigsKey | null, value?: string | null }> | null } | null };

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

export type UpdateTemplateMutationVariables = Exact<{
  input: TemplateUpdateInput;
}>;


export type UpdateTemplateMutation = { __typename?: 'Mutation', updateTemplate?: { __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type SuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type SuspendTemplateMutation = { __typename?: 'Mutation', suspendTemplate?: { __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type UnsuspendTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type UnsuspendTemplateMutation = { __typename?: 'Mutation', unsuspendTemplate?: { __typename?: 'Template', id: number, name?: string | null, description?: string | null, imageUrl?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, category?: { __typename?: 'TemplateCategory', id: number } | null, preSuspensionCategory?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type DeleteTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate?: { __typename?: 'Template', id: number, name?: string | null, category?: { __typename?: 'TemplateCategory', id: number } | null } | null };

export type CategoryChildrenQueryVariables = Exact<{
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CategoryChildrenQuery = { __typename?: 'Query', categoryChildren: Array<{ __typename?: 'TemplateCategory', id: number, name?: string | null, description?: string | null, specialType?: string | null, order?: number | null, createdAt?: any | null, updatedAt?: any | null, parentCategory?: { __typename?: 'TemplateCategory', id: number } | null }> };

export type SearchTemplateCategoriesQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  includeParentTree?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SearchTemplateCategoriesQuery = { __typename?: 'Query', searchTemplateCategories: Array<{ __typename?: 'TemplateCategoryWithParentTree', id: number, name?: string | null, description?: string | null, specialType?: string | null, order?: number | null, parentTree: Array<number> }> };

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

export type RecipientVariableValuesByGroupQueryVariables = Exact<{
  recipientGroupId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecipientVariableValuesByGroupQuery = { __typename?: 'Query', recipientVariableValuesByGroup?: { __typename?: 'RecipientVariableValuesGroupResult', total?: number | null, data?: Array<{ __typename?: 'RecipientWithVariableValues', recipientGroupItemId?: number | null, studentId?: number | null, studentName?: string | null, variableValues?: any | null }> | null } | null };

export type SetRecipientVariableValuesMutationVariables = Exact<{
  recipientGroupItemId: Scalars['Int']['input'];
  values: Array<VariableValueInput> | VariableValueInput;
}>;


export type SetRecipientVariableValuesMutation = { __typename?: 'Mutation', setRecipientVariableValues?: { __typename?: 'RecipientWithVariableValues', recipientGroupItemId?: number | null, studentId?: number | null, studentName?: string | null, variableValues?: any | null } | null };

export type TemplateConfigQueryVariables = Exact<{
  templateConfigId: Scalars['Int']['input'];
}>;


export type TemplateConfigQuery = { __typename?: 'Query', templateConfig?: { __typename?: 'TemplateConfig', createdAt?: any | null, height: number, id: number, language: AppLanguage, updatedAt?: any | null, width: number, templateId?: number | null } | null };

export type TemplateConfigByTemplateIdQueryVariables = Exact<{
  templateId: Scalars['Int']['input'];
}>;


export type TemplateConfigByTemplateIdQuery = { __typename?: 'Query', templateConfigByTemplateId?: { __typename?: 'TemplateConfig', createdAt?: any | null, height: number, id: number, language: AppLanguage, updatedAt?: any | null, width: number, templateId?: number | null } | null };

export type CreateTemplateConfigMutationVariables = Exact<{
  input: TemplateConfigCreateInput;
}>;


export type CreateTemplateConfigMutation = { __typename?: 'Mutation', createTemplateConfig?: { __typename?: 'TemplateConfig', createdAt?: any | null, height: number, id: number, language: AppLanguage, updatedAt?: any | null, width: number, templateId?: number | null } | null };

export type UpdateTemplateConfigMutationVariables = Exact<{
  input: TemplateConfigUpdateInput;
}>;


export type UpdateTemplateConfigMutation = { __typename?: 'Mutation', updateTemplateConfig?: { __typename?: 'TemplateConfig', createdAt?: any | null, height: number, id: number, language: AppLanguage, updatedAt?: any | null, width: number, templateId?: number | null } | null };

export type CreateCountryElementMutationVariables = Exact<{
  input: CountryElementInput;
}>;


export type CreateCountryElementMutation = { __typename?: 'Mutation', createCountryElement?: { __typename?: 'CountryElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, countryProps?: { __typename?: 'CountryElementCountryProps', representation?: CountryRepresentation | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateCountryElementMutationVariables = Exact<{
  input: CountryElementUpdateInput;
}>;


export type UpdateCountryElementMutation = { __typename?: 'Mutation', updateCountryElement?: { __typename?: 'CountryElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, countryProps?: { __typename?: 'CountryElementCountryProps', representation?: CountryRepresentation | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateCountryElementSpecPropsMutationVariables = Exact<{
  input: CountryElementSpecPropsStandaloneUpdateInput;
}>;


export type UpdateCountryElementSpecPropsMutation = { __typename?: 'Mutation', updateCountryElementSpecProps?: { __typename?: 'CountryElementSpecPropsStandaloneUpdateResponse', elementId?: number | null, countryProps?: { __typename?: 'CountryElementCountryProps', representation?: CountryRepresentation | null } | null } | null };

export type CreateDateElementMutationVariables = Exact<{
  input: DateElementInput;
}>;


export type CreateDateElementMutation = { __typename?: 'Mutation', createDateElement?: { __typename?: 'DateElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, dateDataSource?:
      | { __typename?: 'DateDataSourceCertificateField', certificateField?: CertificateDateField | null, type?: DateDataSourceType | null }
      | { __typename?: 'DateDataSourceStatic', type?: DateDataSourceType | null, value?: string | null }
      | { __typename?: 'DateDataSourceStudentField', studentField?: StudentDateField | null, type?: DateDataSourceType | null }
      | { __typename?: 'DateDataSourceTemplateVariable', dateVariableId?: number | null, type?: DateDataSourceType | null }
     | null, dateProps?: { __typename?: 'DateProps', calendarType?: CalendarType | null, format?: string | null, offsetDays?: number | null, transformation?: DateTransformationType | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateDateElementMutationVariables = Exact<{
  input: DateElementUpdateInput;
}>;


export type UpdateDateElementMutation = { __typename?: 'Mutation', updateDateElement?: { __typename?: 'DateElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, dateDataSource?:
      | { __typename?: 'DateDataSourceCertificateField', certificateField?: CertificateDateField | null, type?: DateDataSourceType | null }
      | { __typename?: 'DateDataSourceStatic', type?: DateDataSourceType | null, value?: string | null }
      | { __typename?: 'DateDataSourceStudentField', studentField?: StudentDateField | null, type?: DateDataSourceType | null }
      | { __typename?: 'DateDataSourceTemplateVariable', dateVariableId?: number | null, type?: DateDataSourceType | null }
     | null, dateProps?: { __typename?: 'DateProps', calendarType?: CalendarType | null, format?: string | null, offsetDays?: number | null, transformation?: DateTransformationType | null } | null, template?: { __typename?: 'Template', id: number } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateDateElementDataSourceMutationVariables = Exact<{
  input: DateDataSourceStandaloneInput;
}>;


export type UpdateDateElementDataSourceMutation = { __typename?: 'Mutation', updateDateElementDataSource?: { __typename?: 'DateDataSourceUpdateResponse', elementId?: number | null, dateDataSource?:
      | { __typename?: 'DateDataSourceCertificateField', certificateField?: CertificateDateField | null, type?: DateDataSourceType | null }
      | { __typename?: 'DateDataSourceStatic', type?: DateDataSourceType | null, value?: string | null }
      | { __typename?: 'DateDataSourceStudentField', studentField?: StudentDateField | null, type?: DateDataSourceType | null }
      | { __typename?: 'DateDataSourceTemplateVariable', dateVariableId?: number | null, type?: DateDataSourceType | null }
     | null } | null };

export type UpdateDateElementSpecPropsMutationVariables = Exact<{
  input: DateElementSpecPropsStandaloneInput;
}>;


export type UpdateDateElementSpecPropsMutation = { __typename?: 'Mutation', updateDateElementSpecProps?: { __typename?: 'DateElementSpecPropsUpdateResponse', elementId?: number | null, dateProps?: { __typename?: 'DateProps', calendarType?: CalendarType | null, format?: string | null, offsetDays?: number | null, transformation?: DateTransformationType | null } | null } | null };

export type ElementsByTemplateIdQueryVariables = Exact<{
  templateId: Scalars['Int']['input'];
}>;


export type ElementsByTemplateIdQuery = { __typename?: 'Query', elementsByTemplateId?: Array<
    | { __typename?: 'CountryElement', countryProps?: { __typename?: 'CountryElementCountryProps', representation?: CountryRepresentation | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
          | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
          | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
         }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'DateElement', dateDataSource?:
        | { __typename?: 'DateDataSourceCertificateField', certificateField?: CertificateDateField | null, type?: DateDataSourceType | null }
        | { __typename?: 'DateDataSourceStatic', type?: DateDataSourceType | null, value?: string | null }
        | { __typename?: 'DateDataSourceStudentField', studentField?: StudentDateField | null, type?: DateDataSourceType | null }
        | { __typename?: 'DateDataSourceTemplateVariable', dateVariableId?: number | null, type?: DateDataSourceType | null }
       | null, dateProps?: { __typename?: 'DateProps', calendarType?: CalendarType | null, format?: string | null, offsetDays?: number | null, transformation?: DateTransformationType | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
          | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
          | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
         }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'GenderElement', textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
          | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
          | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
         }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'ImageElement', imageDataSource?: { __typename?: 'ImageDataSourceStorageFile', storageFileId?: number | null, type?: ImageDataSourceType | null } | null, imageProps?: { __typename?: 'ImageElementSpecProps', elementId?: number | null, fit?: ElementImageFit | null, storageFileId?: number | null } | null, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'NumberElement', numberDataSource?: { __typename?: 'NumberDataSource', numberVariableId?: number | null, type?: NumberDataSourceType | null } | null, numberProps?: { __typename?: 'NumberProps', elementId?: number | null, mapping?: any | null, textPropsId?: number | null, variableId?: number | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
          | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
          | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
         }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'QRCodeElement', qrCodeProps: { __typename?: 'QRCodeElementSpecProps', backgroundColor?: string | null, elementId?: number | null, errorCorrection?: QrCodeErrorCorrection | null, foregroundColor?: string | null }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'TextElement', textDataSource:
        | { __typename?: 'TextDataSourceCertificateField', certificateField?: CertificateTextField | null, type?: TextDataSourceType | null }
        | { __typename?: 'TextDataSourceStatic', type?: TextDataSourceType | null, value?: string | null }
        | { __typename?: 'TextDataSourceStudentField', studentField?: StudentTextField | null, type?: TextDataSourceType | null }
        | { __typename?: 'TextDataSourceTemplateSelectVariable', selectVariableId?: number | null, type?: TextDataSourceType | null }
        | { __typename?: 'TextDataSourceTemplateTextVariable', textVariableId?: number | null, type?: TextDataSourceType | null }
      , textElementSpecProps: { __typename?: 'TextElementSpecProps', elementId: number, textPropsId: number, variableId?: number | null }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
          | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
          | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
         }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
  > | null };

type CertificateElement_CountryElement_Fragment = { __typename: 'CountryElement', base: { __typename?: 'CertificateElementBase', id: number } };

type CertificateElement_DateElement_Fragment = { __typename: 'DateElement', base: { __typename?: 'CertificateElementBase', id: number } };

type CertificateElement_GenderElement_Fragment = { __typename: 'GenderElement', base: { __typename?: 'CertificateElementBase', id: number } };

type CertificateElement_ImageElement_Fragment = { __typename: 'ImageElement', base: { __typename?: 'CertificateElementBase', id: number } };

type CertificateElement_NumberElement_Fragment = { __typename: 'NumberElement', base: { __typename?: 'CertificateElementBase', id: number } };

type CertificateElement_QrCodeElement_Fragment = { __typename: 'QRCodeElement', base: { __typename?: 'CertificateElementBase', id: number } };

type CertificateElement_TextElement_Fragment = { __typename: 'TextElement', base: { __typename?: 'CertificateElementBase', id: number } };

export type CertificateElementFragment =
  | CertificateElement_CountryElement_Fragment
  | CertificateElement_DateElement_Fragment
  | CertificateElement_GenderElement_Fragment
  | CertificateElement_ImageElement_Fragment
  | CertificateElement_NumberElement_Fragment
  | CertificateElement_QrCodeElement_Fragment
  | CertificateElement_TextElement_Fragment
;

export type UpdateElementsRenderOrderMutationVariables = Exact<{
  updates: Array<ElementOrderUpdateInput> | ElementOrderUpdateInput;
}>;


export type UpdateElementsRenderOrderMutation = { __typename?: 'Mutation', updateElementsRenderOrder?: boolean | null };

export type DeleteElementMutationVariables = Exact<{
  deleteElementId: Scalars['Int']['input'];
}>;


export type DeleteElementMutation = { __typename?: 'Mutation', deleteElement?: boolean | null };

export type DeleteElementsMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type DeleteElementsMutation = { __typename?: 'Mutation', deleteElements?: boolean | null };

export type UpdateElementCommonPropertiesMutationVariables = Exact<{
  input: CertificateElementBaseUpdateInput;
}>;


export type UpdateElementCommonPropertiesMutation = { __typename?: 'Mutation', updateElementCommonProperties?: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } | null };

export type UpdateElementTextPropsMutationVariables = Exact<{
  input: TextPropsUpdateInput;
}>;


export type UpdateElementTextPropsMutation = { __typename?: 'Mutation', updateElementTextProps?: { __typename?: 'ElementWithTextProps', textProps: { __typename?: 'TextProps', id: number, color: string, fontSize: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type CreateGenderElementMutationVariables = Exact<{
  input: GenderElementInput;
}>;


export type CreateGenderElementMutation = { __typename?: 'Mutation', createGenderElement?: { __typename?: 'GenderElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateGenderElementMutationVariables = Exact<{
  input: GenderElementUpdateInput;
}>;


export type UpdateGenderElementMutation = { __typename?: 'Mutation', updateGenderElement?: { __typename?: 'GenderElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type CreateImageElementMutationVariables = Exact<{
  input: ImageElementInput;
}>;


export type CreateImageElementMutation = { __typename?: 'Mutation', createImageElement?: { __typename?: 'ImageElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, imageDataSource?: { __typename?: 'ImageDataSourceStorageFile', storageFileId?: number | null, type?: ImageDataSourceType | null } | null, imageProps?: { __typename?: 'ImageElementSpecProps', elementId?: number | null, fit?: ElementImageFit | null, storageFileId?: number | null } | null } | null };

export type UpdateImageElementMutationVariables = Exact<{
  input: ImageElementUpdateInput;
}>;


export type UpdateImageElementMutation = { __typename?: 'Mutation', updateImageElement?: { __typename?: 'ImageElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, imageDataSource?: { __typename?: 'ImageDataSourceStorageFile', storageFileId?: number | null, type?: ImageDataSourceType | null } | null, imageProps?: { __typename?: 'ImageElementSpecProps', elementId?: number | null, fit?: ElementImageFit | null, storageFileId?: number | null } | null } | null };

export type UpdateImageElementSpecPropsMutationVariables = Exact<{
  input: ImageElementSpecPropsStandaloneUpdateInput;
}>;


export type UpdateImageElementSpecPropsMutation = { __typename?: 'Mutation', updateImageElementSpecProps?: { __typename?: 'ImageElementSpecPropsStandaloneUpdateResponse', elementId?: number | null, imageProps?: { __typename?: 'ImageElementSpecProps', elementId?: number | null, fit?: ElementImageFit | null, storageFileId?: number | null } | null } | null };

export type CreateNumberElementMutationVariables = Exact<{
  input: NumberElementInput;
}>;


export type CreateNumberElementMutation = { __typename?: 'Mutation', createNumberElement?: { __typename?: 'NumberElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, numberProps?: { __typename?: 'NumberProps', elementId?: number | null, mapping?: any | null, textPropsId?: number | null, variableId?: number | null } | null, numberDataSource?: { __typename?: 'NumberDataSource', numberVariableId?: number | null, type?: NumberDataSourceType | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateNumberElementMutationVariables = Exact<{
  input: NumberElementUpdateInput;
}>;


export type UpdateNumberElementMutation = { __typename?: 'Mutation', updateNumberElement?: { __typename?: 'NumberElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, numberDataSource?: { __typename?: 'NumberDataSource', numberVariableId?: number | null, type?: NumberDataSourceType | null } | null, numberProps?: { __typename?: 'NumberProps', elementId?: number | null, mapping?: any | null, textPropsId?: number | null, variableId?: number | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateNumberElementDataSourceMutationVariables = Exact<{
  input: NumberElementDataSourceStandaloneUpdateInput;
}>;


export type UpdateNumberElementDataSourceMutation = { __typename?: 'Mutation', updateNumberElementDataSource?: { __typename?: 'NumberElementDataSourceUpdateResponse', elementId?: number | null, numberDataSource?: { __typename?: 'NumberDataSource', numberVariableId?: number | null, type?: NumberDataSourceType | null } | null } | null };

export type UpdateNumberElementSpecPropsMutationVariables = Exact<{
  input: NumberElementSpecPropsStandaloneUpdateInput;
}>;


export type UpdateNumberElementSpecPropsMutation = { __typename?: 'Mutation', updateNumberElementSpecProps?: { __typename?: 'NumberElementSpecPropsUpdateResponse', elementId?: number | null, numberProps?: { __typename?: 'NumberProps', elementId?: number | null, mapping?: any | null, textPropsId?: number | null, variableId?: number | null } | null } | null };

export type CreateQrCodeElementMutationVariables = Exact<{
  input: QrCodeElementInput;
}>;


export type CreateQrCodeElementMutation = { __typename?: 'Mutation', createQRCodeElement?: { __typename?: 'QRCodeElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, qrCodeProps: { __typename?: 'QRCodeElementSpecProps', backgroundColor?: string | null, elementId?: number | null, errorCorrection?: QrCodeErrorCorrection | null, foregroundColor?: string | null } } | null };

export type UpdateQrCodeElementMutationVariables = Exact<{
  input: QrCodeElementUpdateInput;
}>;


export type UpdateQrCodeElementMutation = { __typename?: 'Mutation', updateQRCodeElement?: { __typename?: 'QRCodeElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number }, qrCodeProps: { __typename?: 'QRCodeElementSpecProps', backgroundColor?: string | null, elementId?: number | null, errorCorrection?: QrCodeErrorCorrection | null, foregroundColor?: string | null } } | null };

export type UpdateQrCodeElementSpecPropsMutationVariables = Exact<{
  input: QrCodeElementSpecPropsStandaloneUpdateInput;
}>;


export type UpdateQrCodeElementSpecPropsMutation = { __typename?: 'Mutation', updateQRCodeElementSpecProps?: { __typename?: 'QRCodeElementSpecPropsStandaloneUpdateResponse', elementId?: number | null, qrCodeProps?: { __typename?: 'QRCodeElementSpecProps', backgroundColor?: string | null, elementId?: number | null, errorCorrection?: QrCodeErrorCorrection | null, foregroundColor?: string | null } | null } | null };

export type TextElementByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TextElementByIdQuery = { __typename?: 'Query', textElementById?: { __typename?: 'TextElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, textDataSource:
      | { __typename?: 'TextDataSourceCertificateField', certificateField?: CertificateTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceStatic', type?: TextDataSourceType | null, value?: string | null }
      | { __typename?: 'TextDataSourceStudentField', studentField?: StudentTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateSelectVariable', selectVariableId?: number | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateTextVariable', textVariableId?: number | null, type?: TextDataSourceType | null }
    , textElementSpecProps: { __typename?: 'TextElementSpecProps', elementId: number, textPropsId: number, variableId?: number | null }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type CreateTextElementMutationVariables = Exact<{
  input: TextElementInput;
}>;


export type CreateTextElementMutation = { __typename?: 'Mutation', createTextElement?: { __typename?: 'TextElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, textDataSource:
      | { __typename?: 'TextDataSourceCertificateField', certificateField?: CertificateTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceStatic', type?: TextDataSourceType | null, value?: string | null }
      | { __typename?: 'TextDataSourceStudentField', studentField?: StudentTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateSelectVariable', selectVariableId?: number | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateTextVariable', textVariableId?: number | null, type?: TextDataSourceType | null }
    , textElementSpecProps: { __typename?: 'TextElementSpecProps', elementId: number, textPropsId: number, variableId?: number | null }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateTextElementMutationVariables = Exact<{
  input: TextElementUpdateInput;
}>;


export type UpdateTextElementMutation = { __typename?: 'Mutation', updateTextElement?: { __typename?: 'TextElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, renderOrder: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, textDataSource:
      | { __typename?: 'TextDataSourceCertificateField', certificateField?: CertificateTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceStatic', type?: TextDataSourceType | null, value?: string | null }
      | { __typename?: 'TextDataSourceStudentField', studentField?: StudentTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateSelectVariable', selectVariableId?: number | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateTextVariable', textVariableId?: number | null, type?: TextDataSourceType | null }
    , textElementSpecProps: { __typename?: 'TextElementSpecProps', elementId: number, textPropsId: number, variableId?: number | null }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', identifier?: string | null, type?: FontSource | null }
        | { __typename?: 'FontReferenceSelfHosted', fontId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateTextElementDataSourceMutationVariables = Exact<{
  input: TextDataSourceStandaloneInput;
}>;


export type UpdateTextElementDataSourceMutation = { __typename?: 'Mutation', updateTextElementDataSource?: { __typename?: 'TextDataSourceUpdateResponse', elementId: number, variableId?: number | null, textDataSource:
      | { __typename?: 'TextDataSourceCertificateField', certificateField?: CertificateTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceStatic', type?: TextDataSourceType | null, value?: string | null }
      | { __typename?: 'TextDataSourceStudentField', studentField?: StudentTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateSelectVariable', selectVariableId?: number | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateTextVariable', textVariableId?: number | null, type?: TextDataSourceType | null }
     } | null };

export type RecipientQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type RecipientQuery = { __typename?: 'Query', recipient?: { __typename?: 'TemplateRecipient', id: number, studentId: number, recipientGroupId: number, createdAt?: any | null, updatedAt?: any | null, student?: { __typename?: 'Student', id: number, name: string, email?: string | null, phoneNumber?: any | null, dateOfBirth?: any | null, nationality?: CountryCode | null, gender?: Gender | null, createdAt?: any | null, updatedAt?: any | null } | null, recipientGroup?: { __typename?: 'TemplateRecipientGroup', id?: number | null } | null } | null };

export type RecipientsByGroupIdQueryVariables = Exact<{
  recipientGroupId: Scalars['Int']['input'];
}>;


export type RecipientsByGroupIdQuery = { __typename?: 'Query', recipientsByGroupId: Array<{ __typename?: 'TemplateRecipient', id: number, studentId: number, recipientGroupId: number, createdAt?: any | null, updatedAt?: any | null, student?: { __typename?: 'Student', id: number, name: string, email?: string | null, phoneNumber?: any | null, dateOfBirth?: any | null, nationality?: CountryCode | null, gender?: Gender | null, createdAt?: any | null, updatedAt?: any | null } | null }> };

export type RecipientsByStudentIdQueryVariables = Exact<{
  studentId: Scalars['Int']['input'];
}>;


export type RecipientsByStudentIdQuery = { __typename?: 'Query', recipientsByStudentId: Array<{ __typename?: 'TemplateRecipient', id: number, studentId: number, recipientGroupId: number, createdAt?: any | null, updatedAt?: any | null, recipientGroup?: { __typename?: 'TemplateRecipientGroup', id?: number | null, template?: { __typename?: 'Template', id: number } | null } | null }> };

export type RecipientsByGroupIdFilteredQueryVariables = Exact<{
  recipientGroupId: Scalars['Int']['input'];
  paginationArgs?: InputMaybe<PaginationArgs>;
  orderBy?: InputMaybe<Array<StudentsOrderByClause> | StudentsOrderByClause>;
  filterArgs?: InputMaybe<StudentFilterArgs>;
}>;


export type RecipientsByGroupIdFilteredQuery = { __typename?: 'Query', recipientsByGroupIdFiltered: { __typename?: 'RecipientsWithFiltersResponse', data?: Array<{ __typename?: 'TemplateRecipient', id: number, studentId: number, recipientGroupId: number, createdAt?: any | null, updatedAt?: any | null, student?: { __typename?: 'Student', id: number, name: string, email?: string | null, phoneNumber?: any | null, dateOfBirth?: any | null, nationality?: CountryCode | null, gender?: Gender | null, createdAt?: any | null, updatedAt?: any | null } | null }> | null, pageInfo: { __typename?: 'PageInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number } } };

export type CreateRecipientMutationVariables = Exact<{
  input: TemplateRecipientCreateInput;
}>;


export type CreateRecipientMutation = { __typename?: 'Mutation', createRecipient: { __typename?: 'TemplateRecipient', id: number, studentId: number, recipientGroupId: number, createdAt?: any | null, updatedAt?: any | null, student?: { __typename?: 'Student', id: number, name: string } | null, recipientGroup?: { __typename?: 'TemplateRecipientGroup', id?: number | null, template?: { __typename?: 'Template', id: number } | null } | null } };

export type CreateRecipientsMutationVariables = Exact<{
  input: TemplateRecipientCreateListInput;
}>;


export type CreateRecipientsMutation = { __typename?: 'Mutation', createRecipients: Array<{ __typename?: 'TemplateRecipient', id: number, studentId: number, recipientGroupId: number, createdAt?: any | null, updatedAt?: any | null }> };

export type DeleteRecipientMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteRecipientMutation = { __typename?: 'Mutation', deleteRecipient: { __typename?: 'TemplateRecipient', id: number, studentId: number, recipientGroupId: number } };

export type DeleteRecipientsMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type DeleteRecipientsMutation = { __typename?: 'Mutation', deleteRecipients: Array<{ __typename?: 'TemplateRecipient', id: number, studentId: number, recipientGroupId: number, student?: { __typename?: 'Student', id: number } | null }> };

export type TemplateRecipientGroupByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TemplateRecipientGroupByIdQuery = { __typename?: 'Query', templateRecipientGroupById?: { __typename?: 'TemplateRecipientGroup', id?: number | null, name?: string | null, description?: string | null, date?: any | null, studentCount?: number | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number } | null } | null };

export type TemplateRecipientGroupsByTemplateIdQueryVariables = Exact<{
  templateId: Scalars['Int']['input'];
}>;


export type TemplateRecipientGroupsByTemplateIdQuery = { __typename?: 'Query', templateRecipientGroupsByTemplateId?: Array<{ __typename?: 'TemplateRecipientGroup', id?: number | null, name?: string | null, description?: string | null, date?: any | null, studentCount?: number | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number } | null }> | null };

export type CreateTemplateRecipientGroupMutationVariables = Exact<{
  input: TemplateRecipientGroupCreateInput;
}>;


export type CreateTemplateRecipientGroupMutation = { __typename?: 'Mutation', createTemplateRecipientGroup?: { __typename?: 'TemplateRecipientGroup', id?: number | null, name?: string | null, description?: string | null, date?: any | null, studentCount?: number | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number } | null } | null };

export type UpdateTemplateRecipientGroupMutationVariables = Exact<{
  input: TemplateRecipientGroupUpdateInput;
}>;


export type UpdateTemplateRecipientGroupMutation = { __typename?: 'Mutation', updateTemplateRecipientGroup?: { __typename?: 'TemplateRecipientGroup', id?: number | null, name?: string | null, description?: string | null, date?: any | null, studentCount?: number | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number } | null } | null };

export type DeleteTemplateRecipientGroupMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateRecipientGroupMutation = { __typename?: 'Mutation', deleteTemplateRecipientGroup?: { __typename?: 'TemplateRecipientGroup', id?: number | null, name?: string | null, description?: string | null, template?: { __typename?: 'Template', id: number } | null } | null };

export type TemplateVariablesByTemplateIdQueryVariables = Exact<{
  templateId: Scalars['Int']['input'];
}>;


export type TemplateVariablesByTemplateIdQuery = { __typename?: 'Query', templateVariablesByTemplateId?: Array<
    | { __typename?: 'TemplateDateVariable', createdAt?: any | null, description?: string | null, format?: string | null, id?: number | null, maxDate?: any | null, minDate?: any | null, name?: string | null, order?: number | null, previewValue?: string | null, required?: boolean | null, type?: TemplateVariableType | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number } | null }
    | { __typename?: 'TemplateNumberVariable', createdAt?: any | null, decimalPlaces?: number | null, description?: string | null, id?: number | null, maxValue?: number | null, minValue?: number | null, name?: string | null, order?: number | null, previewValue?: string | null, required?: boolean | null, type?: TemplateVariableType | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number } | null }
    | { __typename?: 'TemplateSelectVariable', createdAt?: any | null, description?: string | null, id?: number | null, multiple?: boolean | null, name?: string | null, options?: Array<string> | null, order?: number | null, previewValue?: string | null, required?: boolean | null, type?: TemplateVariableType | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number } | null }
    | { __typename?: 'TemplateTextVariable', createdAt?: any | null, description?: string | null, id?: number | null, maxLength?: number | null, minLength?: number | null, name?: string | null, order?: number | null, pattern?: string | null, previewValue?: string | null, required?: boolean | null, type?: TemplateVariableType | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number } | null }
  > | null };

export type CreateTemplateTextVariableMutationVariables = Exact<{
  input: TemplateTextVariableCreateInput;
}>;


export type CreateTemplateTextVariableMutation = { __typename?: 'Mutation', createTemplateTextVariable?: { __typename?: 'TemplateTextVariable', id?: number | null, name?: string | null, description?: string | null, type?: TemplateVariableType | null, required?: boolean | null, order?: number | null, minLength?: number | null, maxLength?: number | null, pattern?: string | null, previewValue?: string | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null } | null };

export type CreateTemplateNumberVariableMutationVariables = Exact<{
  input: TemplateNumberVariableCreateInput;
}>;


export type CreateTemplateNumberVariableMutation = { __typename?: 'Mutation', createTemplateNumberVariable?: { __typename?: 'TemplateNumberVariable', id?: number | null, name?: string | null, description?: string | null, type?: TemplateVariableType | null, required?: boolean | null, order?: number | null, minValue?: number | null, maxValue?: number | null, decimalPlaces?: number | null, previewValue?: string | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null } | null };

export type CreateTemplateDateVariableMutationVariables = Exact<{
  input: TemplateDateVariableCreateInput;
}>;


export type CreateTemplateDateVariableMutation = { __typename?: 'Mutation', createTemplateDateVariable?: { __typename?: 'TemplateDateVariable', id?: number | null, name?: string | null, description?: string | null, type?: TemplateVariableType | null, required?: boolean | null, order?: number | null, minDate?: any | null, maxDate?: any | null, format?: string | null, previewValue?: string | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null } | null };

export type CreateTemplateSelectVariableMutationVariables = Exact<{
  input: TemplateSelectVariableCreateInput;
}>;


export type CreateTemplateSelectVariableMutation = { __typename?: 'Mutation', createTemplateSelectVariable?: { __typename?: 'TemplateSelectVariable', id?: number | null, name?: string | null, description?: string | null, type?: TemplateVariableType | null, required?: boolean | null, order?: number | null, options?: Array<string> | null, multiple?: boolean | null, previewValue?: string | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null } | null };

export type UpdateTemplateTextVariableMutationVariables = Exact<{
  input: TemplateTextVariableUpdateInput;
}>;


export type UpdateTemplateTextVariableMutation = { __typename?: 'Mutation', updateTemplateTextVariable?: { __typename?: 'TemplateTextVariable', id?: number | null, name?: string | null, description?: string | null, type?: TemplateVariableType | null, required?: boolean | null, order?: number | null, minLength?: number | null, maxLength?: number | null, pattern?: string | null, previewValue?: string | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null } | null };

export type UpdateTemplateNumberVariableMutationVariables = Exact<{
  input: TemplateNumberVariableUpdateInput;
}>;


export type UpdateTemplateNumberVariableMutation = { __typename?: 'Mutation', updateTemplateNumberVariable?: { __typename?: 'TemplateNumberVariable', id?: number | null, name?: string | null, description?: string | null, type?: TemplateVariableType | null, required?: boolean | null, order?: number | null, minValue?: number | null, maxValue?: number | null, decimalPlaces?: number | null, previewValue?: string | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null } | null };

export type UpdateTemplateDateVariableMutationVariables = Exact<{
  input: TemplateDateVariableUpdateInput;
}>;


export type UpdateTemplateDateVariableMutation = { __typename?: 'Mutation', updateTemplateDateVariable?: { __typename?: 'TemplateDateVariable', id?: number | null, name?: string | null, description?: string | null, type?: TemplateVariableType | null, required?: boolean | null, order?: number | null, minDate?: any | null, maxDate?: any | null, format?: string | null, previewValue?: string | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null } | null };

export type UpdateTemplateSelectVariableMutationVariables = Exact<{
  input: TemplateSelectVariableUpdateInput;
}>;


export type UpdateTemplateSelectVariableMutation = { __typename?: 'Mutation', updateTemplateSelectVariable?: { __typename?: 'TemplateSelectVariable', id?: number | null, name?: string | null, description?: string | null, type?: TemplateVariableType | null, required?: boolean | null, order?: number | null, options?: Array<string> | null, multiple?: boolean | null, previewValue?: string | null, createdAt?: any | null, updatedAt?: any | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null } | null };

export type DeleteTemplateVariableMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTemplateVariableMutation = { __typename?: 'Mutation', deleteTemplateVariable?:
    | { __typename?: 'TemplateDateVariable', id?: number | null, name?: string | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null }
    | { __typename?: 'TemplateNumberVariable', id?: number | null, name?: string | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null }
    | { __typename?: 'TemplateSelectVariable', id?: number | null, name?: string | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null }
    | { __typename?: 'TemplateTextVariable', id?: number | null, name?: string | null, template?: { __typename?: 'Template', id: number, name?: string | null } | null }
   | null };

export const CertificateElementFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CertificateElement"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CertificateElementUnion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CountryElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GenderElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QRCodeElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CertificateElementFragment, unknown>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"user"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const FontDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"font"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"font"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FontQuery, FontQueryVariables>;
export const FontsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fonts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationArgs"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FontsOrderByClause"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FontFilterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fonts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paginationArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}}]}}]}}]}}]} as unknown as DocumentNode<FontsQuery, FontsQueryVariables>;
export const CheckFontUsageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkFontUsage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkFontUsage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isInUse"}},{"kind":"Field","name":{"kind":"Name","value":"usageCount"}},{"kind":"Field","name":{"kind":"Name","value":"usedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"elementType"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"templateName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"deleteBlockReason"}}]}}]}}]} as unknown as DocumentNode<CheckFontUsageQuery, CheckFontUsageQueryVariables>;
export const CreateFontDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createFont"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FontCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFont"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateFontMutation, CreateFontMutationVariables>;
export const UpdateFontDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateFont"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FontUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFont"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateFontMutation, UpdateFontMutationVariables>;
export const DeleteFontDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteFont"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFont"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<DeleteFontMutation, DeleteFontMutationVariables>;
export const DirectoryChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"directoryChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"directoryChildren"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"fileCount"}},{"kind":"Field","name":{"kind":"Name","value":"folderCount"}},{"kind":"Field","name":{"kind":"Name","value":"isFromBucket"}},{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowCreateSubDirs"}},{"kind":"Field","name":{"kind":"Name","value":"allowDelete"}},{"kind":"Field","name":{"kind":"Name","value":"allowDeleteFiles"}},{"kind":"Field","name":{"kind":"Name","value":"allowMove"}},{"kind":"Field","name":{"kind":"Name","value":"allowMoveFiles"}},{"kind":"Field","name":{"kind":"Name","value":"allowUploads"}}]}},{"kind":"Field","name":{"kind":"Name","value":"protectChildren"}},{"kind":"Field","name":{"kind":"Name","value":"totalSize"}}]}}]}}]} as unknown as DocumentNode<DirectoryChildrenQuery, DirectoryChildrenQueryVariables>;
export const FileInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fileInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"directoryPath"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"isFromBucket"}},{"kind":"Field","name":{"kind":"Name","value":"isInUse"}},{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"md5Hash"}},{"kind":"Field","name":{"kind":"Name","value":"mediaLink"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"usages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"filePath"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"referenceId"}},{"kind":"Field","name":{"kind":"Name","value":"referenceTable"}},{"kind":"Field","name":{"kind":"Name","value":"usageType"}}]}}]}}]}}]} as unknown as DocumentNode<FileInfoQuery, FileInfoQueryVariables>;
export const FileUsageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fileUsage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileUsageCheckInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileUsage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"deleteBlockReason"}},{"kind":"Field","name":{"kind":"Name","value":"isInUse"}},{"kind":"Field","name":{"kind":"Name","value":"usages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"filePath"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"referenceId"}},{"kind":"Field","name":{"kind":"Name","value":"referenceTable"}},{"kind":"Field","name":{"kind":"Name","value":"usageType"}}]}}]}}]}}]} as unknown as DocumentNode<FileUsageQuery, FileUsageQueryVariables>;
export const FolderInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"folderInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folderInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"fileCount"}},{"kind":"Field","name":{"kind":"Name","value":"folderCount"}},{"kind":"Field","name":{"kind":"Name","value":"isFromBucket"}},{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowCreateSubDirs"}},{"kind":"Field","name":{"kind":"Name","value":"allowDelete"}},{"kind":"Field","name":{"kind":"Name","value":"allowDeleteFiles"}},{"kind":"Field","name":{"kind":"Name","value":"allowMove"}},{"kind":"Field","name":{"kind":"Name","value":"allowMoveFiles"}},{"kind":"Field","name":{"kind":"Name","value":"allowUploads"}}]}},{"kind":"Field","name":{"kind":"Name","value":"protectChildren"}},{"kind":"Field","name":{"kind":"Name","value":"totalSize"}}]}}]}}]} as unknown as DocumentNode<FolderInfoQuery, FolderInfoQueryVariables>;
export const ListFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilesListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DirectoryInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"fileCount"}},{"kind":"Field","name":{"kind":"Name","value":"folderCount"}},{"kind":"Field","name":{"kind":"Name","value":"isFromBucket"}},{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowCreateSubDirs"}},{"kind":"Field","name":{"kind":"Name","value":"allowDelete"}},{"kind":"Field","name":{"kind":"Name","value":"allowDeleteFiles"}},{"kind":"Field","name":{"kind":"Name","value":"allowMove"}},{"kind":"Field","name":{"kind":"Name","value":"allowMoveFiles"}},{"kind":"Field","name":{"kind":"Name","value":"allowUploads"}}]}},{"kind":"Field","name":{"kind":"Name","value":"protectChildren"}},{"kind":"Field","name":{"kind":"Name","value":"totalSize"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"directoryPath"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"isFromBucket"}},{"kind":"Field","name":{"kind":"Name","value":"isInUse"}},{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"md5Hash"}},{"kind":"Field","name":{"kind":"Name","value":"mediaLink"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"usages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"filePath"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"referenceId"}},{"kind":"Field","name":{"kind":"Name","value":"referenceTable"}},{"kind":"Field","name":{"kind":"Name","value":"usageType"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<ListFilesQuery, ListFilesQueryVariables>;
export const SearchFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileType"}}},{"kind":"Argument","name":{"kind":"Name","value":"folder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folder"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DirectoryInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"fileCount"}},{"kind":"Field","name":{"kind":"Name","value":"folderCount"}},{"kind":"Field","name":{"kind":"Name","value":"isFromBucket"}},{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowCreateSubDirs"}},{"kind":"Field","name":{"kind":"Name","value":"allowDelete"}},{"kind":"Field","name":{"kind":"Name","value":"allowDeleteFiles"}},{"kind":"Field","name":{"kind":"Name","value":"allowMove"}},{"kind":"Field","name":{"kind":"Name","value":"allowMoveFiles"}},{"kind":"Field","name":{"kind":"Name","value":"allowUploads"}}]}},{"kind":"Field","name":{"kind":"Name","value":"protectChildren"}},{"kind":"Field","name":{"kind":"Name","value":"totalSize"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"directoryPath"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"isFromBucket"}},{"kind":"Field","name":{"kind":"Name","value":"isInUse"}},{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"md5Hash"}},{"kind":"Field","name":{"kind":"Name","value":"mediaLink"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"usages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"filePath"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"referenceId"}},{"kind":"Field","name":{"kind":"Name","value":"referenceTable"}},{"kind":"Field","name":{"kind":"Name","value":"usageType"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"offset"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<SearchFilesQuery, SearchFilesQueryVariables>;
export const StorageStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"storageStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileTypeBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalFiles"}},{"kind":"Field","name":{"kind":"Name","value":"directoryCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalSize"}}]}}]}}]} as unknown as DocumentNode<StorageStatsQuery, StorageStatsQueryVariables>;
export const CopyStorageItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"copyStorageItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StorageItemsCopyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"copyStorageItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureCount"}},{"kind":"Field","name":{"kind":"Name","value":"failures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"successCount"}},{"kind":"Field","name":{"kind":"Name","value":"successfulItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]} as unknown as DocumentNode<CopyStorageItemsMutation, CopyStorageItemsMutationVariables>;
export const CreateFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FolderCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<CreateFolderMutation, CreateFolderMutationVariables>;
export const DeleteFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteFileMutation, DeleteFileMutationVariables>;
export const DeleteStorageItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteStorageItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StorageItemsDeleteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStorageItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureCount"}},{"kind":"Field","name":{"kind":"Name","value":"failures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"successCount"}},{"kind":"Field","name":{"kind":"Name","value":"successfulItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteStorageItemsMutation, DeleteStorageItemsMutationVariables>;
export const GenerateUploadSignedUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"generateUploadSignedUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadSignedUrlGenerateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateUploadSignedUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<GenerateUploadSignedUrlMutation, GenerateUploadSignedUrlMutationVariables>;
export const MoveStorageItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"moveStorageItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StorageItemsMoveInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveStorageItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"failureCount"}},{"kind":"Field","name":{"kind":"Name","value":"failures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"successCount"}},{"kind":"Field","name":{"kind":"Name","value":"successfulItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]} as unknown as DocumentNode<MoveStorageItemsMutation, MoveStorageItemsMutationVariables>;
export const RenameFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"renameFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileRenameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<RenameFileMutation, RenameFileMutationVariables>;
export const SetStorageItemProtectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setStorageItemProtection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StorageItemProtectionUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setStorageItemProtection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<SetStorageItemProtectionMutation, SetStorageItemProtectionMutationVariables>;
export const UpdateDirectoryPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDirectoryPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DirectoryPermissionsUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDirectoryPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isProtected"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateDirectoryPermissionsMutation, UpdateDirectoryPermissionsMutationVariables>;
export const StudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"student"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"student"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"recipientRecords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<StudentQuery, StudentQueryVariables>;
export const StudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"students"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentsOrderByClause"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationArgs"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"students"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}},{"kind":"Field","name":{"kind":"Name","value":"lastItem"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<StudentsQuery, StudentsQueryVariables>;
export const StudentsInRecipientGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"studentsInRecipientGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentsOrderByClause"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationArgs"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentsInRecipientGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipientGroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}},{"kind":"Field","name":{"kind":"Name","value":"lastItem"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<StudentsInRecipientGroupQuery, StudentsInRecipientGroupQueryVariables>;
export const StudentsNotInRecipientGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"studentsNotInRecipientGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentsOrderByClause"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationArgs"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentsNotInRecipientGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipientGroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}},{"kind":"Field","name":{"kind":"Name","value":"lastItem"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<StudentsNotInRecipientGroupQuery, StudentsNotInRecipientGroupQueryVariables>;
export const CreateStudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createStudent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStudent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateStudentMutation, CreateStudentMutationVariables>;
export const DeleteStudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteStudent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStudent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<DeleteStudentMutation, DeleteStudentMutationVariables>;
export const PartiallyUpdateStudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"partiallyUpdateStudent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PartialStudentUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partiallyUpdateStudent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<PartiallyUpdateStudentMutation, PartiallyUpdateStudentMutationVariables>;
export const TemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"template"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"template"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TemplateQuery, TemplateQueryVariables>;
export const TemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}},{"kind":"Field","name":{"kind":"Name","value":"lastItem"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<TemplatesQuery, TemplatesQueryVariables>;
export const TemplatesConfigsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplatesConfigs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templatesConfigs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"configs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<TemplatesConfigsQuery, TemplatesConfigsQueryVariables>;
export const TemplatesByCategoryIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templatesByCategoryId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationArgs"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateFilterArgs"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplatesOrderByClause"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templatesByCategoryId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"}},{"kind":"Field","name":{"kind":"Name","value":"lastItem"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<TemplatesByCategoryIdQuery, TemplatesByCategoryIdQueryVariables>;
export const SuspendedTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"suspendedTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suspendedTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<SuspendedTemplatesQuery, SuspendedTemplatesQueryVariables>;
export const CreateTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateMutation, CreateTemplateMutationVariables>;
export const UpdateTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateMutation, UpdateTemplateMutationVariables>;
export const SuspendTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"suspendTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suspendTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SuspendTemplateMutation, SuspendTemplateMutationVariables>;
export const UnsuspendTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unsuspendTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsuspendTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"preSuspensionCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UnsuspendTemplateMutation, UnsuspendTemplateMutationVariables>;
export const DeleteTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTemplateMutation, DeleteTemplateMutationVariables>;
export const CategoryChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"categoryChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentCategoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryChildren"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"parentCategoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentCategoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CategoryChildrenQuery, CategoryChildrenQueryVariables>;
export const SearchTemplateCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchTemplateCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeParentTree"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchTemplateCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeParentTree"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeParentTree"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"parentTree"}}]}}]}}]} as unknown as DocumentNode<SearchTemplateCategoriesQuery, SearchTemplateCategoriesQueryVariables>;
export const CreateTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateCategoryCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateCategoryMutation, CreateTemplateCategoryMutationVariables>;
export const DeleteTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTemplateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTemplateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTemplateCategoryMutation, DeleteTemplateCategoryMutationVariables>;
export const UpdateTemplateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateCategoryUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"specialType"}},{"kind":"Field","name":{"kind":"Name","value":"parentCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateCategoryMutation, UpdateTemplateCategoryMutationVariables>;
export const RecipientVariableValuesByGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"recipientVariableValuesByGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipientVariableValuesByGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipientGroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipientGroupItemId"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"studentName"}},{"kind":"Field","name":{"kind":"Name","value":"variableValues"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<RecipientVariableValuesByGroupQuery, RecipientVariableValuesByGroupQueryVariables>;
export const SetRecipientVariableValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setRecipientVariableValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupItemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"values"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VariableValueInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setRecipientVariableValues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipientGroupItemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupItemId"}}},{"kind":"Argument","name":{"kind":"Name","value":"values"},"value":{"kind":"Variable","name":{"kind":"Name","value":"values"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipientGroupItemId"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"studentName"}},{"kind":"Field","name":{"kind":"Name","value":"variableValues"}}]}}]}}]} as unknown as DocumentNode<SetRecipientVariableValuesMutation, SetRecipientVariableValuesMutationVariables>;
export const TemplateConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templateConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateConfigId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templateConfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateConfigId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}}]}}]}}]} as unknown as DocumentNode<TemplateConfigQuery, TemplateConfigQueryVariables>;
export const TemplateConfigByTemplateIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TemplateConfigByTemplateId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templateConfigByTemplateId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"templateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}}]}}]}}]} as unknown as DocumentNode<TemplateConfigByTemplateIdQuery, TemplateConfigByTemplateIdQueryVariables>;
export const CreateTemplateConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTemplateConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateConfigCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplateConfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateConfigMutation, CreateTemplateConfigMutationVariables>;
export const UpdateTemplateConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplateConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateConfigUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplateConfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateConfigMutation, UpdateTemplateConfigMutationVariables>;
export const CreateCountryElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCountryElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCountryElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countryProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"representation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCountryElementMutation, CreateCountryElementMutationVariables>;
export const UpdateCountryElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCountryElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCountryElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countryProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"representation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCountryElementMutation, UpdateCountryElementMutationVariables>;
export const UpdateCountryElementSpecPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCountryElementSpecProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryElementSpecPropsStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCountryElementSpecProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countryProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"representation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}}]}}]}}]} as unknown as DocumentNode<UpdateCountryElementSpecPropsMutation, UpdateCountryElementSpecPropsMutationVariables>;
export const CreateDateElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createDateElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDateElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceTemplateVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarType"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"offsetDays"}},{"kind":"Field","name":{"kind":"Name","value":"transformation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<CreateDateElementMutation, CreateDateElementMutationVariables>;
export const UpdateDateElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDateElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDateElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceTemplateVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarType"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"offsetDays"}},{"kind":"Field","name":{"kind":"Name","value":"transformation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateDateElementMutation, UpdateDateElementMutationVariables>;
export const UpdateDateElementDataSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDateElementDataSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStandaloneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDateElementDataSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"dateDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceTemplateVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateDateElementDataSourceMutation, UpdateDateElementDataSourceMutationVariables>;
export const UpdateDateElementSpecPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDateElementSpecProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateElementSpecPropsStandaloneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDateElementSpecProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarType"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"offsetDays"}},{"kind":"Field","name":{"kind":"Name","value":"transformation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}}]}}]}}]} as unknown as DocumentNode<UpdateDateElementSpecPropsMutation, UpdateDateElementSpecPropsMutationVariables>;
export const ElementsByTemplateIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ElementsByTemplateId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementsByTemplateId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"templateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CountryElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countryProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"representation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceTemplateVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarType"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"offsetDays"}},{"kind":"Field","name":{"kind":"Name","value":"transformation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GenderElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageDataSourceStorageFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageFileId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"storageFileId"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"mapping"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QRCodeElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qrCodeProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"errorCorrection"}},{"kind":"Field","name":{"kind":"Name","value":"foregroundColor"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateSelectVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateTextVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"textElementSpecProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ElementsByTemplateIdQuery, ElementsByTemplateIdQueryVariables>;
export const UpdateElementsRenderOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateElementsRenderOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updates"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ElementOrderUpdateInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateElementsRenderOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updates"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updates"}}}]}]}}]} as unknown as DocumentNode<UpdateElementsRenderOrderMutation, UpdateElementsRenderOrderMutationVariables>;
export const DeleteElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteElementId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteElementId"}}}]}]}}]} as unknown as DocumentNode<DeleteElementMutation, DeleteElementMutationVariables>;
export const DeleteElementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteElements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteElements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<DeleteElementsMutation, DeleteElementsMutationVariables>;
export const UpdateElementCommonPropertiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateElementCommonProperties"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CertificateElementBaseUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateElementCommonProperties"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}}]}}]} as unknown as DocumentNode<UpdateElementCommonPropertiesMutation, UpdateElementCommonPropertiesMutationVariables>;
export const UpdateElementTextPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateElementTextProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropsUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateElementTextProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateElementTextPropsMutation, UpdateElementTextPropsMutationVariables>;
export const CreateGenderElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createGenderElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GenderElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGenderElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<CreateGenderElementMutation, CreateGenderElementMutationVariables>;
export const UpdateGenderElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateGenderElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GenderElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGenderElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateGenderElementMutation, UpdateGenderElementMutationVariables>;
export const CreateImageElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createImageElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createImageElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageDataSourceStorageFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageFileId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"storageFileId"}}]}}]}}]}}]} as unknown as DocumentNode<CreateImageElementMutation, CreateImageElementMutationVariables>;
export const UpdateImageElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateImageElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateImageElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageDataSourceStorageFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageFileId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"storageFileId"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateImageElementMutation, UpdateImageElementMutationVariables>;
export const UpdateImageElementSpecPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateImageElementSpecProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageElementSpecPropsStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateImageElementSpecProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"imageProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}},{"kind":"Field","name":{"kind":"Name","value":"storageFileId"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateImageElementSpecPropsMutation, UpdateImageElementSpecPropsMutationVariables>;
export const CreateNumberElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createNumberElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNumberElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"mapping"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<CreateNumberElementMutation, CreateNumberElementMutationVariables>;
export const UpdateNumberElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNumberElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNumberElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"mapping"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNumberElementMutation, UpdateNumberElementMutationVariables>;
export const UpdateNumberElementDataSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNumberElementDataSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElementDataSourceStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNumberElementDataSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"numberDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNumberElementDataSourceMutation, UpdateNumberElementDataSourceMutationVariables>;
export const UpdateNumberElementSpecPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNumberElementSpecProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElementSpecPropsStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNumberElementSpecProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"numberProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"mapping"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNumberElementSpecPropsMutation, UpdateNumberElementSpecPropsMutationVariables>;
export const CreateQrCodeElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createQRCodeElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QRCodeElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQRCodeElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qrCodeProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"errorCorrection"}},{"kind":"Field","name":{"kind":"Name","value":"foregroundColor"}}]}}]}}]}}]} as unknown as DocumentNode<CreateQrCodeElementMutation, CreateQrCodeElementMutationVariables>;
export const UpdateQrCodeElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateQRCodeElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QRCodeElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateQRCodeElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qrCodeProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"errorCorrection"}},{"kind":"Field","name":{"kind":"Name","value":"foregroundColor"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateQrCodeElementMutation, UpdateQrCodeElementMutationVariables>;
export const UpdateQrCodeElementSpecPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateQRCodeElementSpecProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QRCodeElementSpecPropsStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateQRCodeElementSpecProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"qrCodeProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"errorCorrection"}},{"kind":"Field","name":{"kind":"Name","value":"foregroundColor"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateQrCodeElementSpecPropsMutation, UpdateQrCodeElementSpecPropsMutationVariables>;
export const TextElementByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"textElementById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textElementById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateSelectVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateTextVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"textElementSpecProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<TextElementByIdQuery, TextElementByIdQueryVariables>;
export const CreateTextElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTextElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TextElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTextElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateSelectVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateTextVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"textElementSpecProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTextElementMutation, CreateTextElementMutationVariables>;
export const UpdateTextElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTextElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TextElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTextElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"renderOrder"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateSelectVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateTextVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"textElementSpecProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTextElementMutation, UpdateTextElementMutationVariables>;
export const UpdateTextElementDataSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTextElementDataSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStandaloneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTextElementDataSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}},{"kind":"Field","name":{"kind":"Name","value":"textDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateSelectVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateTextVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTextElementDataSourceMutation, UpdateTextElementDataSourceMutationVariables>;
export const RecipientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"recipient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RecipientQuery, RecipientQueryVariables>;
export const RecipientsByGroupIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"recipientsByGroupId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipientsByGroupId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipientGroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<RecipientsByGroupIdQuery, RecipientsByGroupIdQueryVariables>;
export const RecipientsByStudentIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"recipientsByStudentId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipientsByStudentId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RecipientsByStudentIdQuery, RecipientsByStudentIdQueryVariables>;
export const RecipientsByGroupIdFilteredDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"recipientsByGroupIdFiltered"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationArgs"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentsOrderByClause"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentFilterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipientsByGroupIdFiltered"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipientGroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipientGroupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paginationArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paginationArgs"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}},{"kind":"Field","name":{"kind":"Name","value":"lastItem"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]} as unknown as DocumentNode<RecipientsByGroupIdFilteredQuery, RecipientsByGroupIdFilteredQueryVariables>;
export const CreateRecipientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createRecipient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateRecipientCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRecipient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateRecipientMutation, CreateRecipientMutationVariables>;
export const CreateRecipientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createRecipients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateRecipientCreateListInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRecipients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateRecipientsMutation, CreateRecipientsMutationVariables>;
export const DeleteRecipientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteRecipient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRecipient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroupId"}}]}}]}}]} as unknown as DocumentNode<DeleteRecipientMutation, DeleteRecipientMutationVariables>;
export const DeleteRecipientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteRecipients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRecipients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"recipientGroupId"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteRecipientsMutation, DeleteRecipientsMutationVariables>;
export const TemplateRecipientGroupByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templateRecipientGroupById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templateRecipientGroupById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TemplateRecipientGroupByIdQuery, TemplateRecipientGroupByIdQueryVariables>;
export const TemplateRecipientGroupsByTemplateIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templateRecipientGroupsByTemplateId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templateRecipientGroupsByTemplateId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"templateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TemplateRecipientGroupsByTemplateIdQuery, TemplateRecipientGroupsByTemplateIdQueryVariables>;
export const CreateTemplateRecipientGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplateRecipientGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateRecipientGroupCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplateRecipientGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTemplateRecipientGroupMutation, CreateTemplateRecipientGroupMutationVariables>;
export const UpdateTemplateRecipientGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplateRecipientGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateRecipientGroupUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplateRecipientGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateRecipientGroupMutation, UpdateTemplateRecipientGroupMutationVariables>;
export const DeleteTemplateRecipientGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTemplateRecipientGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTemplateRecipientGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTemplateRecipientGroupMutation, DeleteTemplateRecipientGroupMutationVariables>;
export const TemplateVariablesByTemplateIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"templateVariablesByTemplateId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"templateVariablesByTemplateId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"templateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateDateVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"maxDate"}},{"kind":"Field","name":{"kind":"Name","value":"minDate"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateNumberVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"decimalPlaces"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"maxValue"}},{"kind":"Field","name":{"kind":"Name","value":"minValue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateSelectVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateTextVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"maxLength"}},{"kind":"Field","name":{"kind":"Name","value":"minLength"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<TemplateVariablesByTemplateIdQuery, TemplateVariablesByTemplateIdQueryVariables>;
export const CreateTemplateTextVariableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplateTextVariable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateTextVariableCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplateTextVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"minLength"}},{"kind":"Field","name":{"kind":"Name","value":"maxLength"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateTextVariableMutation, CreateTemplateTextVariableMutationVariables>;
export const CreateTemplateNumberVariableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplateNumberVariable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateNumberVariableCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplateNumberVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"minValue"}},{"kind":"Field","name":{"kind":"Name","value":"maxValue"}},{"kind":"Field","name":{"kind":"Name","value":"decimalPlaces"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateNumberVariableMutation, CreateTemplateNumberVariableMutationVariables>;
export const CreateTemplateDateVariableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplateDateVariable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateDateVariableCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplateDateVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"minDate"}},{"kind":"Field","name":{"kind":"Name","value":"maxDate"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateDateVariableMutation, CreateTemplateDateVariableMutationVariables>;
export const CreateTemplateSelectVariableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTemplateSelectVariable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateSelectVariableCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTemplateSelectVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateTemplateSelectVariableMutation, CreateTemplateSelectVariableMutationVariables>;
export const UpdateTemplateTextVariableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplateTextVariable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateTextVariableUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplateTextVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"minLength"}},{"kind":"Field","name":{"kind":"Name","value":"maxLength"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateTextVariableMutation, UpdateTemplateTextVariableMutationVariables>;
export const UpdateTemplateNumberVariableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplateNumberVariable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateNumberVariableUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplateNumberVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"minValue"}},{"kind":"Field","name":{"kind":"Name","value":"maxValue"}},{"kind":"Field","name":{"kind":"Name","value":"decimalPlaces"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateNumberVariableMutation, UpdateTemplateNumberVariableMutationVariables>;
export const UpdateTemplateDateVariableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplateDateVariable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateDateVariableUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplateDateVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"minDate"}},{"kind":"Field","name":{"kind":"Name","value":"maxDate"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateDateVariableMutation, UpdateTemplateDateVariableMutationVariables>;
export const UpdateTemplateSelectVariableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTemplateSelectVariable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TemplateSelectVariableUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTemplateSelectVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"options"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}},{"kind":"Field","name":{"kind":"Name","value":"previewValue"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateTemplateSelectVariableMutation, UpdateTemplateSelectVariableMutationVariables>;
export const DeleteTemplateVariableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTemplateVariable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTemplateVariable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTemplateVariableMutation, DeleteTemplateVariableMutationVariables>;