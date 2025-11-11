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
  height: Scalars['Float']['output'];
  hidden?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  positionX: Scalars['Float']['output'];
  positionY: Scalars['Float']['output'];
  templateId: Scalars['Int']['output'];
  type: ElementType;
  updatedAt: Scalars['DateTime']['output'];
  width: Scalars['Float']['output'];
  zIndex: Scalars['Int']['output'];
};

export type CertificateElementBaseInput = {
  alignment: ElementAlignment;
  description?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['Float']['input'];
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  positionX: Scalars['Float']['input'];
  positionY: Scalars['Float']['input'];
  templateId: Scalars['Int']['input'];
  width: Scalars['Float']['input'];
  /** This field is only for UI state management and will not affect server-side data. */
  zIndex?: InputMaybe<Scalars['Int']['input']>;
};

export type CertificateElementBaseUpdateInput = {
  alignment: ElementAlignment;
  description?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['Float']['input'];
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  positionX: Scalars['Float']['input'];
  positionY: Scalars['Float']['input'];
  width: Scalars['Float']['input'];
  /** This field is only for UI state management and will not affect server-side data. */
  zIndex?: InputMaybe<Scalars['Int']['input']>;
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

export type DecreaseElementOrderInput = {
  elementId: Scalars['Int']['input'];
};

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
  BaselineCenter = 'BASELINE_CENTER',
  BaselineEnd = 'BASELINE_END',
  BaselineStart = 'BASELINE_START',
  BottomCenter = 'BOTTOM_CENTER',
  BottomEnd = 'BOTTOM_END',
  BottomStart = 'BOTTOM_START',
  Center = 'CENTER',
  CenterEnd = 'CENTER_END',
  CenterStart = 'CENTER_START',
  TopCenter = 'TOP_CENTER',
  TopEnd = 'TOP_END',
  TopStart = 'TOP_START'
}

export enum ElementImageFit {
  Contain = 'CONTAIN',
  Cover = 'COVER',
  Fill = 'FILL'
}

export type ElementMoveInput = {
  elementId: Scalars['Int']['input'];
  newZIndex: Scalars['Int']['input'];
};

export type ElementOrderUpdateInput = {
  id: Scalars['Int']['input'];
  zIndex: Scalars['Int']['input'];
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

export type FontFamily = {
  __typename?: 'FontFamily';
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  locale: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variants: Array<FontVariant>;
};

export type FontFamilyCreateInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  locale: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export enum FontFamilyName {
  Abeezee = 'ABEEZEE',
  Abel = 'ABEL',
  AbhayaLibre = 'ABHAYA_LIBRE',
  Aboreto = 'ABORETO',
  AbrilFatface = 'ABRIL_FATFACE',
  AbyssinicaSil = 'ABYSSINICA_SIL',
  Aclonica = 'ACLONICA',
  Acme = 'ACME',
  Actor = 'ACTOR',
  Adamina = 'ADAMINA',
  AdlamDisplay = 'ADLAM_DISPLAY',
  AdventPro = 'ADVENT_PRO',
  Afacad = 'AFACAD',
  AfacadFlux = 'AFACAD_FLUX',
  Agbalumo = 'AGBALUMO',
  Agdasima = 'AGDASIMA',
  AguafinaScript = 'AGUAFINA_SCRIPT',
  AguDisplay = 'AGU_DISPLAY',
  Akatab = 'AKATAB',
  AkayaKanadaka = 'AKAYA_KANADAKA',
  AkayaTelivigala = 'AKAYA_TELIVIGALA',
  Akronim = 'AKRONIM',
  Akshar = 'AKSHAR',
  Aladin = 'ALADIN',
  AlanSans = 'ALAN_SANS',
  Alata = 'ALATA',
  Alatsi = 'ALATSI',
  AlbertSans = 'ALBERT_SANS',
  Aldrich = 'ALDRICH',
  Alef = 'ALEF',
  Alegreya = 'ALEGREYA',
  AlegreyaSans = 'ALEGREYA_SANS',
  AlegreyaSansSc = 'ALEGREYA_SANS_SC',
  AlegreyaSc = 'ALEGREYA_SC',
  Aleo = 'ALEO',
  Alexandria = 'ALEXANDRIA',
  AlexBrush = 'ALEX_BRUSH',
  AlfaSlabOne = 'ALFA_SLAB_ONE',
  Alice = 'ALICE',
  Alike = 'ALIKE',
  AlikeAngular = 'ALIKE_ANGULAR',
  Alkalami = 'ALKALAMI',
  Alkatra = 'ALKATRA',
  Allan = 'ALLAN',
  Allerta = 'ALLERTA',
  AllertaStencil = 'ALLERTA_STENCIL',
  Allison = 'ALLISON',
  Allura = 'ALLURA',
  Almarai = 'ALMARAI',
  Almendra = 'ALMENDRA',
  AlmendraDisplay = 'ALMENDRA_DISPLAY',
  AlmendraSc = 'ALMENDRA_SC',
  AlumniSans = 'ALUMNI_SANS',
  AlumniSansCollegiateOne = 'ALUMNI_SANS_COLLEGIATE_ONE',
  AlumniSansInlineOne = 'ALUMNI_SANS_INLINE_ONE',
  AlumniSansPinstripe = 'ALUMNI_SANS_PINSTRIPE',
  AlumniSansSc = 'ALUMNI_SANS_SC',
  Amarante = 'AMARANTE',
  Amaranth = 'AMARANTH',
  AmaticSc = 'AMATIC_SC',
  Amethysta = 'AMETHYSTA',
  Amiko = 'AMIKO',
  Amiri = 'AMIRI',
  AmiriQuran = 'AMIRI_QURAN',
  Amita = 'AMITA',
  Anaheim = 'ANAHEIM',
  AncizarSans = 'ANCIZAR_SANS',
  AncizarSerif = 'ANCIZAR_SERIF',
  AndadaPro = 'ANDADA_PRO',
  Andika = 'ANDIKA',
  AnekBangla = 'ANEK_BANGLA',
  AnekDevanagari = 'ANEK_DEVANAGARI',
  AnekGujarati = 'ANEK_GUJARATI',
  AnekGurmukhi = 'ANEK_GURMUKHI',
  AnekKannada = 'ANEK_KANNADA',
  AnekLatin = 'ANEK_LATIN',
  AnekMalayalam = 'ANEK_MALAYALAM',
  AnekOdia = 'ANEK_ODIA',
  AnekTamil = 'ANEK_TAMIL',
  AnekTelugu = 'ANEK_TELUGU',
  Angkor = 'ANGKOR',
  AnnapurnaSil = 'ANNAPURNA_SIL',
  AnnieUseYourTelescope = 'ANNIE_USE_YOUR_TELESCOPE',
  AnonymousPro = 'ANONYMOUS_PRO',
  Anta = 'ANTA',
  Antic = 'ANTIC',
  AnticDidone = 'ANTIC_DIDONE',
  AnticSlab = 'ANTIC_SLAB',
  Anton = 'ANTON',
  Antonio = 'ANTONIO',
  AntonSc = 'ANTON_SC',
  Anuphan = 'ANUPHAN',
  Anybody = 'ANYBODY',
  AoboshiOne = 'AOBOSHI_ONE',
  Arapey = 'ARAPEY',
  Arbutus = 'ARBUTUS',
  ArbutusSlab = 'ARBUTUS_SLAB',
  ArchitectsDaughter = 'ARCHITECTS_DAUGHTER',
  Archivo = 'ARCHIVO',
  ArchivoBlack = 'ARCHIVO_BLACK',
  ArchivoNarrow = 'ARCHIVO_NARROW',
  ArefRuqaa = 'AREF_RUQAA',
  ArefRuqaaInk = 'AREF_RUQAA_INK',
  AreYouSerious = 'ARE_YOU_SERIOUS',
  Arima = 'ARIMA',
  Arimo = 'ARIMO',
  Arizonia = 'ARIZONIA',
  Armata = 'ARMATA',
  Arsenal = 'ARSENAL',
  ArsenalSc = 'ARSENAL_SC',
  Artifika = 'ARTIFIKA',
  Arvo = 'ARVO',
  Arya = 'ARYA',
  ArOneSans = 'AR_ONE_SANS',
  Asap = 'ASAP',
  AsapCondensed = 'ASAP_CONDENSED',
  Asar = 'ASAR',
  Asimovian = 'ASIMOVIAN',
  Asset = 'ASSET',
  Assistant = 'ASSISTANT',
  AstaSans = 'ASTA_SANS',
  Astloch = 'ASTLOCH',
  Asul = 'ASUL',
  Athiti = 'ATHITI',
  AtkinsonHyperlegible = 'ATKINSON_HYPERLEGIBLE',
  AtkinsonHyperlegibleMono = 'ATKINSON_HYPERLEGIBLE_MONO',
  AtkinsonHyperlegibleNext = 'ATKINSON_HYPERLEGIBLE_NEXT',
  Atma = 'ATMA',
  AtomicAge = 'ATOMIC_AGE',
  Aubrey = 'AUBREY',
  Audiowide = 'AUDIOWIDE',
  AutourOne = 'AUTOUR_ONE',
  Average = 'AVERAGE',
  AverageSans = 'AVERAGE_SANS',
  AveriaGruesaLibre = 'AVERIA_GRUESA_LIBRE',
  AveriaLibre = 'AVERIA_LIBRE',
  AveriaSansLibre = 'AVERIA_SANS_LIBRE',
  AveriaSerifLibre = 'AVERIA_SERIF_LIBRE',
  AzeretMono = 'AZERET_MONO',
  B612 = 'B612',
  B612Mono = 'B612_MONO',
  Babylonica = 'BABYLONICA',
  BacasimeAntique = 'BACASIME_ANTIQUE',
  BadeenDisplay = 'BADEEN_DISPLAY',
  BadScript = 'BAD_SCRIPT',
  BagelFatOne = 'BAGEL_FAT_ONE',
  Bahiana = 'BAHIANA',
  Bahianita = 'BAHIANITA',
  BaiJamjuree = 'BAI_JAMJUREE',
  BakbakOne = 'BAKBAK_ONE',
  Ballet = 'BALLET',
  Baloo_2 = 'BALOO_2',
  BalooBhaijaan_2 = 'BALOO_BHAIJAAN_2',
  BalooBhaina_2 = 'BALOO_BHAINA_2',
  BalooBhai_2 = 'BALOO_BHAI_2',
  BalooChettan_2 = 'BALOO_CHETTAN_2',
  BalooDa_2 = 'BALOO_DA_2',
  BalooPaaji_2 = 'BALOO_PAAJI_2',
  BalooTamma_2 = 'BALOO_TAMMA_2',
  BalooTammudu_2 = 'BALOO_TAMMUDU_2',
  BalooThambi_2 = 'BALOO_THAMBI_2',
  BalsamiqSans = 'BALSAMIQ_SANS',
  Balthazar = 'BALTHAZAR',
  Bangers = 'BANGERS',
  Barlow = 'BARLOW',
  BarlowCondensed = 'BARLOW_CONDENSED',
  BarlowSemiCondensed = 'BARLOW_SEMI_CONDENSED',
  Barriecito = 'BARRIECITO',
  Barrio = 'BARRIO',
  Basic = 'BASIC',
  Baskervville = 'BASKERVVILLE',
  BaskervvilleSc = 'BASKERVVILLE_SC',
  Battambang = 'BATTAMBANG',
  Baumans = 'BAUMANS',
  Bayon = 'BAYON',
  BbhSansBartle = 'BBH_SANS_BARTLE',
  BbhSansBogle = 'BBH_SANS_BOGLE',
  BbhSansHegarty = 'BBH_SANS_HEGARTY',
  BeauRivage = 'BEAU_RIVAGE',
  BebasNeue = 'BEBAS_NEUE',
  Beiruti = 'BEIRUTI',
  Belanosima = 'BELANOSIMA',
  Belgrano = 'BELGRANO',
  Bellefair = 'BELLEFAIR',
  Belleza = 'BELLEZA',
  Bellota = 'BELLOTA',
  BellotaText = 'BELLOTA_TEXT',
  Benchnine = 'BENCHNINE',
  Benne = 'BENNE',
  Bentham = 'BENTHAM',
  BerkshireSwash = 'BERKSHIRE_SWASH',
  Besley = 'BESLEY',
  BethEllen = 'BETH_ELLEN',
  Bevan = 'BEVAN',
  BeVietnamPro = 'BE_VIETNAM_PRO',
  BhutukaExpandedOne = 'BHUTUKA_EXPANDED_ONE',
  BigelowRules = 'BIGELOW_RULES',
  BigshotOne = 'BIGSHOT_ONE',
  BigShoulders = 'BIG_SHOULDERS',
  BigShouldersInline = 'BIG_SHOULDERS_INLINE',
  BigShouldersStencil = 'BIG_SHOULDERS_STENCIL',
  Bilbo = 'BILBO',
  BilboSwashCaps = 'BILBO_SWASH_CAPS',
  Biorhyme = 'BIORHYME',
  BiorhymeExpanded = 'BIORHYME_EXPANDED',
  Birthstone = 'BIRTHSTONE',
  BirthstoneBounce = 'BIRTHSTONE_BOUNCE',
  Biryani = 'BIRYANI',
  Bitcount = 'BITCOUNT',
  BitcountGridDouble = 'BITCOUNT_GRID_DOUBLE',
  BitcountGridDoubleInk = 'BITCOUNT_GRID_DOUBLE_INK',
  BitcountGridSingle = 'BITCOUNT_GRID_SINGLE',
  BitcountGridSingleInk = 'BITCOUNT_GRID_SINGLE_INK',
  BitcountInk = 'BITCOUNT_INK',
  BitcountPropDouble = 'BITCOUNT_PROP_DOUBLE',
  BitcountPropDoubleInk = 'BITCOUNT_PROP_DOUBLE_INK',
  BitcountPropSingle = 'BITCOUNT_PROP_SINGLE',
  BitcountPropSingleInk = 'BITCOUNT_PROP_SINGLE_INK',
  BitcountSingle = 'BITCOUNT_SINGLE',
  BitcountSingleInk = 'BITCOUNT_SINGLE_INK',
  Bitter = 'BITTER',
  BizUdgothic = 'BIZ_UDGOTHIC',
  BizUdmincho = 'BIZ_UDMINCHO',
  BizUdpgothic = 'BIZ_UDPGOTHIC',
  BizUdpmincho = 'BIZ_UDPMINCHO',
  BlackAndWhitePicture = 'BLACK_AND_WHITE_PICTURE',
  BlackHanSans = 'BLACK_HAN_SANS',
  BlackOpsOne = 'BLACK_OPS_ONE',
  Blaka = 'BLAKA',
  BlakaHollow = 'BLAKA_HOLLOW',
  BlakaInk = 'BLAKA_INK',
  Blinker = 'BLINKER',
  BodoniModa = 'BODONI_MODA',
  BodoniModaSc = 'BODONI_MODA_SC',
  Bokor = 'BOKOR',
  Boldonse = 'BOLDONSE',
  BonaNova = 'BONA_NOVA',
  BonaNovaSc = 'BONA_NOVA_SC',
  Bonbon = 'BONBON',
  BonheurRoyale = 'BONHEUR_ROYALE',
  Boogaloo = 'BOOGALOO',
  Borel = 'BOREL',
  BowlbyOne = 'BOWLBY_ONE',
  BowlbyOneSc = 'BOWLBY_ONE_SC',
  BraahOne = 'BRAAH_ONE',
  Brawler = 'BRAWLER',
  BreeSerif = 'BREE_SERIF',
  BricolageGrotesque = 'BRICOLAGE_GROTESQUE',
  BrunoAce = 'BRUNO_ACE',
  BrunoAceSc = 'BRUNO_ACE_SC',
  Brygada_1918 = 'BRYGADA_1918',
  BubblegumSans = 'BUBBLEGUM_SANS',
  BubblerOne = 'BUBBLER_ONE',
  Buda = 'BUDA',
  Buenard = 'BUENARD',
  Bungee = 'BUNGEE',
  BungeeHairline = 'BUNGEE_HAIRLINE',
  BungeeInline = 'BUNGEE_INLINE',
  BungeeOutline = 'BUNGEE_OUTLINE',
  BungeeShade = 'BUNGEE_SHADE',
  BungeeSpice = 'BUNGEE_SPICE',
  BungeeTint = 'BUNGEE_TINT',
  Butcherman = 'BUTCHERMAN',
  ButterflyKids = 'BUTTERFLY_KIDS',
  Bytesized = 'BYTESIZED',
  Cabin = 'CABIN',
  CabinCondensed = 'CABIN_CONDENSED',
  CabinSketch = 'CABIN_SKETCH',
  CactusClassicalSerif = 'CACTUS_CLASSICAL_SERIF',
  CaesarDressing = 'CAESAR_DRESSING',
  Cagliostro = 'CAGLIOSTRO',
  Cairo = 'CAIRO',
  CairoPlay = 'CAIRO_PLAY',
  Caladea = 'CALADEA',
  Calistoga = 'CALISTOGA',
  Calligraffitti = 'CALLIGRAFFITTI',
  CalSans = 'CAL_SANS',
  Cambay = 'CAMBAY',
  Cambo = 'CAMBO',
  Candal = 'CANDAL',
  Cantarell = 'CANTARELL',
  CantataOne = 'CANTATA_ONE',
  CantoraOne = 'CANTORA_ONE',
  Caprasimo = 'CAPRASIMO',
  Capriola = 'CAPRIOLA',
  Caramel = 'CARAMEL',
  Carattere = 'CARATTERE',
  Cardo = 'CARDO',
  Carlito = 'CARLITO',
  Carme = 'CARME',
  CarroisGothic = 'CARROIS_GOTHIC',
  CarroisGothicSc = 'CARROIS_GOTHIC_SC',
  CarterOne = 'CARTER_ONE',
  CascadiaCode = 'CASCADIA_CODE',
  CascadiaMono = 'CASCADIA_MONO',
  Castoro = 'CASTORO',
  CastoroTitling = 'CASTORO_TITLING',
  Catamaran = 'CATAMARAN',
  Caudex = 'CAUDEX',
  Caveat = 'CAVEAT',
  CaveatBrush = 'CAVEAT_BRUSH',
  CedarvilleCursive = 'CEDARVILLE_CURSIVE',
  CevicheOne = 'CEVICHE_ONE',
  ChakraPetch = 'CHAKRA_PETCH',
  Changa = 'CHANGA',
  ChangaOne = 'CHANGA_ONE',
  Chango = 'CHANGO',
  CharisSil = 'CHARIS_SIL',
  Charm = 'CHARM',
  Charmonman = 'CHARMONMAN',
  Chathura = 'CHATHURA',
  ChauPhilomeneOne = 'CHAU_PHILOMENE_ONE',
  ChelaOne = 'CHELA_ONE',
  ChelseaMarket = 'CHELSEA_MARKET',
  Chenla = 'CHENLA',
  Cherish = 'CHERISH',
  CherryBombOne = 'CHERRY_BOMB_ONE',
  CherryCreamSoda = 'CHERRY_CREAM_SODA',
  CherrySwash = 'CHERRY_SWASH',
  Chewy = 'CHEWY',
  Chicle = 'CHICLE',
  Chilanka = 'CHILANKA',
  ChironGoroundTc = 'CHIRON_GOROUND_TC',
  ChironHeiHk = 'CHIRON_HEI_HK',
  ChironSungHk = 'CHIRON_SUNG_HK',
  Chivo = 'CHIVO',
  ChivoMono = 'CHIVO_MONO',
  ChocolateClassicalSans = 'CHOCOLATE_CLASSICAL_SANS',
  Chokokutai = 'CHOKOKUTAI',
  Chonburi = 'CHONBURI',
  Cinzel = 'CINZEL',
  CinzelDecorative = 'CINZEL_DECORATIVE',
  ClickerScript = 'CLICKER_SCRIPT',
  ClimateCrisis = 'CLIMATE_CRISIS',
  Coda = 'CODA',
  Codystar = 'CODYSTAR',
  Coiny = 'COINY',
  Combo = 'COMBO',
  Comfortaa = 'COMFORTAA',
  Comforter = 'COMFORTER',
  ComforterBrush = 'COMFORTER_BRUSH',
  ComicNeue = 'COMIC_NEUE',
  ComicRelief = 'COMIC_RELIEF',
  ComingSoon = 'COMING_SOON',
  Comme = 'COMME',
  Commissioner = 'COMMISSIONER',
  ConcertOne = 'CONCERT_ONE',
  Condiment = 'CONDIMENT',
  Content = 'CONTENT',
  ContrailOne = 'CONTRAIL_ONE',
  Convergence = 'CONVERGENCE',
  Cookie = 'COOKIE',
  Copse = 'COPSE',
  CoralPixels = 'CORAL_PIXELS',
  Corben = 'CORBEN',
  Corinthia = 'CORINTHIA',
  Cormorant = 'CORMORANT',
  CormorantGaramond = 'CORMORANT_GARAMOND',
  CormorantInfant = 'CORMORANT_INFANT',
  CormorantSc = 'CORMORANT_SC',
  CormorantUnicase = 'CORMORANT_UNICASE',
  CormorantUpright = 'CORMORANT_UPRIGHT',
  CossetteTexte = 'COSSETTE_TEXTE',
  CossetteTitre = 'COSSETTE_TITRE',
  Courgette = 'COURGETTE',
  CourierPrime = 'COURIER_PRIME',
  Cousine = 'COUSINE',
  Coustard = 'COUSTARD',
  CoveredByYourGrace = 'COVERED_BY_YOUR_GRACE',
  CraftyGirls = 'CRAFTY_GIRLS',
  Creepster = 'CREEPSTER',
  CreteRound = 'CRETE_ROUND',
  CrimsonPro = 'CRIMSON_PRO',
  CrimsonText = 'CRIMSON_TEXT',
  CroissantOne = 'CROISSANT_ONE',
  Crushed = 'CRUSHED',
  Cuprum = 'CUPRUM',
  CuteFont = 'CUTE_FONT',
  Cutive = 'CUTIVE',
  CutiveMono = 'CUTIVE_MONO',
  DaiBannaSil = 'DAI_BANNA_SIL',
  Damion = 'DAMION',
  DancingScript = 'DANCING_SCRIPT',
  Danfo = 'DANFO',
  Dangrek = 'DANGREK',
  DarkerGrotesque = 'DARKER_GROTESQUE',
  DarumadropOne = 'DARUMADROP_ONE',
  DavidLibre = 'DAVID_LIBRE',
  DawningOfANewDay = 'DAWNING_OF_A_NEW_DAY',
  DaysOne = 'DAYS_ONE',
  Dekko = 'DEKKO',
  DelaGothicOne = 'DELA_GOTHIC_ONE',
  DeliciousHandrawn = 'DELICIOUS_HANDRAWN',
  Delius = 'DELIUS',
  DeliusSwashCaps = 'DELIUS_SWASH_CAPS',
  DeliusUnicase = 'DELIUS_UNICASE',
  DellaRespira = 'DELLA_RESPIRA',
  DenkOne = 'DENK_ONE',
  Devonshire = 'DEVONSHIRE',
  Dhurjati = 'DHURJATI',
  DidactGothic = 'DIDACT_GOTHIC',
  Diphylleia = 'DIPHYLLEIA',
  Diplomata = 'DIPLOMATA',
  DiplomataSc = 'DIPLOMATA_SC',
  DmMono = 'DM_MONO',
  DmSans = 'DM_SANS',
  DmSerifDisplay = 'DM_SERIF_DISPLAY',
  DmSerifText = 'DM_SERIF_TEXT',
  Dokdo = 'DOKDO',
  Domine = 'DOMINE',
  DonegalOne = 'DONEGAL_ONE',
  Dongle = 'DONGLE',
  DoppioOne = 'DOPPIO_ONE',
  Dorsa = 'DORSA',
  Dosis = 'DOSIS',
  Dotgothic16 = 'DOTGOTHIC16',
  Doto = 'DOTO',
  DoHyeon = 'DO_HYEON',
  DrSugiyama = 'DR_SUGIYAMA',
  DuruSans = 'DURU_SANS',
  Dynalight = 'DYNALIGHT',
  Dynapuff = 'DYNAPUFF',
  EagleLake = 'EAGLE_LAKE',
  EastSeaDokdo = 'EAST_SEA_DOKDO',
  Eater = 'EATER',
  EbGaramond = 'EB_GARAMOND',
  Economica = 'ECONOMICA',
  Eczar = 'ECZAR',
  EduAuVicWaNtArrows = 'EDU_AU_VIC_WA_NT_ARROWS',
  EduAuVicWaNtDots = 'EDU_AU_VIC_WA_NT_DOTS',
  EduAuVicWaNtGuides = 'EDU_AU_VIC_WA_NT_GUIDES',
  EduAuVicWaNtHand = 'EDU_AU_VIC_WA_NT_HAND',
  EduAuVicWaNtPre = 'EDU_AU_VIC_WA_NT_PRE',
  EduNswActCursive = 'EDU_NSW_ACT_CURSIVE',
  EduNswActFoundation = 'EDU_NSW_ACT_FOUNDATION',
  EduNswActHandPre = 'EDU_NSW_ACT_HAND_PRE',
  EduQldBeginner = 'EDU_QLD_BEGINNER',
  EduQldHand = 'EDU_QLD_HAND',
  EduSaBeginner = 'EDU_SA_BEGINNER',
  EduSaHand = 'EDU_SA_HAND',
  EduTasBeginner = 'EDU_TAS_BEGINNER',
  EduVicWaNtBeginner = 'EDU_VIC_WA_NT_BEGINNER',
  EduVicWaNtHand = 'EDU_VIC_WA_NT_HAND',
  EduVicWaNtHandPre = 'EDU_VIC_WA_NT_HAND_PRE',
  Electrolize = 'ELECTROLIZE',
  ElmsSans = 'ELMS_SANS',
  Elsie = 'ELSIE',
  ElsieSwashCaps = 'ELSIE_SWASH_CAPS',
  ElMessiri = 'EL_MESSIRI',
  EmblemaOne = 'EMBLEMA_ONE',
  EmilysCandy = 'EMILYS_CANDY',
  EncodeSans = 'ENCODE_SANS',
  EncodeSansCondensed = 'ENCODE_SANS_CONDENSED',
  EncodeSansExpanded = 'ENCODE_SANS_EXPANDED',
  EncodeSansSc = 'ENCODE_SANS_SC',
  EncodeSansSemiCondensed = 'ENCODE_SANS_SEMI_CONDENSED',
  EncodeSansSemiExpanded = 'ENCODE_SANS_SEMI_EXPANDED',
  Engagement = 'ENGAGEMENT',
  Englebert = 'ENGLEBERT',
  Enriqueta = 'ENRIQUETA',
  Ephesis = 'EPHESIS',
  Epilogue = 'EPILOGUE',
  EpundaSans = 'EPUNDA_SANS',
  EpundaSlab = 'EPUNDA_SLAB',
  EricaOne = 'ERICA_ONE',
  Esteban = 'ESTEBAN',
  Estonia = 'ESTONIA',
  EuphoriaScript = 'EUPHORIA_SCRIPT',
  Ewert = 'EWERT',
  Exile = 'EXILE',
  Exo = 'EXO',
  Exo_2 = 'EXO_2',
  ExpletusSans = 'EXPLETUS_SANS',
  Explora = 'EXPLORA',
  FacultyGlyphic = 'FACULTY_GLYPHIC',
  Fahkwang = 'FAHKWANG',
  FamiljenGrotesk = 'FAMILJEN_GROTESK',
  FanwoodText = 'FANWOOD_TEXT',
  Farro = 'FARRO',
  Farsan = 'FARSAN',
  Fascinate = 'FASCINATE',
  FascinateInline = 'FASCINATE_INLINE',
  FasterOne = 'FASTER_ONE',
  Fasthand = 'FASTHAND',
  FaunaOne = 'FAUNA_ONE',
  Faustina = 'FAUSTINA',
  Federant = 'FEDERANT',
  Federo = 'FEDERO',
  Felipa = 'FELIPA',
  Fenix = 'FENIX',
  Festive = 'FESTIVE',
  Figtree = 'FIGTREE',
  FingerPaint = 'FINGER_PAINT',
  Finlandica = 'FINLANDICA',
  FiraCode = 'FIRA_CODE',
  FiraMono = 'FIRA_MONO',
  FiraSans = 'FIRA_SANS',
  FiraSansCondensed = 'FIRA_SANS_CONDENSED',
  FiraSansExtraCondensed = 'FIRA_SANS_EXTRA_CONDENSED',
  FjallaOne = 'FJALLA_ONE',
  FjordOne = 'FJORD_ONE',
  Flamenco = 'FLAMENCO',
  Flavors = 'FLAVORS',
  FleurDeLeah = 'FLEUR_DE_LEAH',
  FlowBlock = 'FLOW_BLOCK',
  FlowCircular = 'FLOW_CIRCULAR',
  FlowRounded = 'FLOW_ROUNDED',
  Foldit = 'FOLDIT',
  Fondamento = 'FONDAMENTO',
  FontdinerSwanky = 'FONTDINER_SWANKY',
  Forum = 'FORUM',
  FragmentMono = 'FRAGMENT_MONO',
  FrancoisOne = 'FRANCOIS_ONE',
  FrankRuhlLibre = 'FRANK_RUHL_LIBRE',
  Fraunces = 'FRAUNCES',
  FreckleFace = 'FRECKLE_FACE',
  FrederickaTheGreat = 'FREDERICKA_THE_GREAT',
  Fredoka = 'FREDOKA',
  Freehand = 'FREEHAND',
  Freeman = 'FREEMAN',
  Fresca = 'FRESCA',
  Frijole = 'FRIJOLE',
  Fruktur = 'FRUKTUR',
  FugazOne = 'FUGAZ_ONE',
  Fuggles = 'FUGGLES',
  FunnelDisplay = 'FUNNEL_DISPLAY',
  FunnelSans = 'FUNNEL_SANS',
  Fustat = 'FUSTAT',
  FuzzyBubbles = 'FUZZY_BUBBLES',
  Gabarito = 'GABARITO',
  Gabriela = 'GABRIELA',
  Gaegu = 'GAEGU',
  Gafata = 'GAFATA',
  GajrajOne = 'GAJRAJ_ONE',
  Galada = 'GALADA',
  Galdeano = 'GALDEANO',
  Galindo = 'GALINDO',
  GamjaFlower = 'GAMJA_FLOWER',
  Gantari = 'GANTARI',
  GasoekOne = 'GASOEK_ONE',
  Gayathri = 'GAYATHRI',
  GaMaamli = 'GA_MAAMLI',
  Geist = 'GEIST',
  GeistMono = 'GEIST_MONO',
  Gelasio = 'GELASIO',
  GemunuLibre = 'GEMUNU_LIBRE',
  Genos = 'GENOS',
  GentiumBookPlus = 'GENTIUM_BOOK_PLUS',
  GentiumPlus = 'GENTIUM_PLUS',
  Geo = 'GEO',
  Geologica = 'GEOLOGICA',
  Georama = 'GEORAMA',
  Geostar = 'GEOSTAR',
  GeostarFill = 'GEOSTAR_FILL',
  GermaniaOne = 'GERMANIA_ONE',
  GfsDidot = 'GFS_DIDOT',
  GfsNeohellenic = 'GFS_NEOHELLENIC',
  GideonRoman = 'GIDEON_ROMAN',
  Gidole = 'GIDOLE',
  Gidugu = 'GIDUGU',
  GildaDisplay = 'GILDA_DISPLAY',
  Girassol = 'GIRASSOL',
  GiveYouGlory = 'GIVE_YOU_GLORY',
  GlassAntiqua = 'GLASS_ANTIQUA',
  Glegoo = 'GLEGOO',
  Gloock = 'GLOOCK',
  GloriaHallelujah = 'GLORIA_HALLELUJAH',
  Glory = 'GLORY',
  Gluten = 'GLUTEN',
  GoblinOne = 'GOBLIN_ONE',
  GochiHand = 'GOCHI_HAND',
  Goldman = 'GOLDMAN',
  GolosText = 'GOLOS_TEXT',
  GoogleSansCode = 'GOOGLE_SANS_CODE',
  Gorditas = 'GORDITAS',
  GothicA1 = 'GOTHIC_A1',
  Gotu = 'GOTU',
  GoudyBookletter_1911 = 'GOUDY_BOOKLETTER_1911',
  GowunBatang = 'GOWUN_BATANG',
  GowunDodum = 'GOWUN_DODUM',
  Graduate = 'GRADUATE',
  GrandifloraOne = 'GRANDIFLORA_ONE',
  Grandstander = 'GRANDSTANDER',
  GrandHotel = 'GRAND_HOTEL',
  GrapeNuts = 'GRAPE_NUTS',
  GravitasOne = 'GRAVITAS_ONE',
  GreatVibes = 'GREAT_VIBES',
  GrechenFuemen = 'GRECHEN_FUEMEN',
  Grenze = 'GRENZE',
  GrenzeGotisch = 'GRENZE_GOTISCH',
  GreyQo = 'GREY_QO',
  Griffy = 'GRIFFY',
  Gruppo = 'GRUPPO',
  Gudea = 'GUDEA',
  Gugi = 'GUGI',
  Gulzar = 'GULZAR',
  Gupter = 'GUPTER',
  Gurajada = 'GURAJADA',
  Gwendolyn = 'GWENDOLYN',
  Habibi = 'HABIBI',
  HachiMaruPop = 'HACHI_MARU_POP',
  Hahmlet = 'HAHMLET',
  Halant = 'HALANT',
  HammersmithOne = 'HAMMERSMITH_ONE',
  Hanalei = 'HANALEI',
  HanaleiFill = 'HANALEI_FILL',
  Handjet = 'HANDJET',
  Handlee = 'HANDLEE',
  HankenGrotesk = 'HANKEN_GROTESK',
  Hanuman = 'HANUMAN',
  HappyMonkey = 'HAPPY_MONKEY',
  Harmattan = 'HARMATTAN',
  HeadlandOne = 'HEADLAND_ONE',
  HedvigLettersSans = 'HEDVIG_LETTERS_SANS',
  HedvigLettersSerif = 'HEDVIG_LETTERS_SERIF',
  Heebo = 'HEEBO',
  HennyPenny = 'HENNY_PENNY',
  HeptaSlab = 'HEPTA_SLAB',
  HerrVonMuellerhoff = 'HERR_VON_MUELLERHOFF',
  HinaMincho = 'HINA_MINCHO',
  Hind = 'HIND',
  HindGuntur = 'HIND_GUNTUR',
  HindMadurai = 'HIND_MADURAI',
  HindMysuru = 'HIND_MYSURU',
  HindSiliguri = 'HIND_SILIGURI',
  HindVadodara = 'HIND_VADODARA',
  HiMelody = 'HI_MELODY',
  HoltwoodOneSc = 'HOLTWOOD_ONE_SC',
  HomemadeApple = 'HOMEMADE_APPLE',
  Homenaje = 'HOMENAJE',
  Honk = 'HONK',
  HostGrotesk = 'HOST_GROTESK',
  Hubballi = 'HUBBALLI',
  HubotSans = 'HUBOT_SANS',
  Huninn = 'HUNINN',
  Hurricane = 'HURRICANE',
  Iansui = 'IANSUI',
  IbarraRealNova = 'IBARRA_REAL_NOVA',
  IbmPlexMono = 'IBM_PLEX_MONO',
  IbmPlexSans = 'IBM_PLEX_SANS',
  IbmPlexSansArabic = 'IBM_PLEX_SANS_ARABIC',
  IbmPlexSansCondensed = 'IBM_PLEX_SANS_CONDENSED',
  IbmPlexSansDevanagari = 'IBM_PLEX_SANS_DEVANAGARI',
  IbmPlexSansHebrew = 'IBM_PLEX_SANS_HEBREW',
  IbmPlexSansJp = 'IBM_PLEX_SANS_JP',
  IbmPlexSansKr = 'IBM_PLEX_SANS_KR',
  IbmPlexSansThai = 'IBM_PLEX_SANS_THAI',
  IbmPlexSansThaiLooped = 'IBM_PLEX_SANS_THAI_LOOPED',
  IbmPlexSerif = 'IBM_PLEX_SERIF',
  Iceberg = 'ICEBERG',
  Iceland = 'ICELAND',
  Imbue = 'IMBUE',
  ImperialScript = 'IMPERIAL_SCRIPT',
  Imprima = 'IMPRIMA',
  ImFellDoublePica = 'IM_FELL_DOUBLE_PICA',
  ImFellDoublePicaSc = 'IM_FELL_DOUBLE_PICA_SC',
  ImFellDwPica = 'IM_FELL_DW_PICA',
  ImFellDwPicaSc = 'IM_FELL_DW_PICA_SC',
  ImFellEnglish = 'IM_FELL_ENGLISH',
  ImFellEnglishSc = 'IM_FELL_ENGLISH_SC',
  ImFellFrenchCanon = 'IM_FELL_FRENCH_CANON',
  ImFellFrenchCanonSc = 'IM_FELL_FRENCH_CANON_SC',
  ImFellGreatPrimer = 'IM_FELL_GREAT_PRIMER',
  ImFellGreatPrimerSc = 'IM_FELL_GREAT_PRIMER_SC',
  InclusiveSans = 'INCLUSIVE_SANS',
  Inconsolata = 'INCONSOLATA',
  Inder = 'INDER',
  IndieFlower = 'INDIE_FLOWER',
  IngridDarling = 'INGRID_DARLING',
  Inika = 'INIKA',
  InknutAntiqua = 'INKNUT_ANTIQUA',
  InriaSans = 'INRIA_SANS',
  InriaSerif = 'INRIA_SERIF',
  Inspiration = 'INSPIRATION',
  InstrumentSans = 'INSTRUMENT_SANS',
  InstrumentSerif = 'INSTRUMENT_SERIF',
  IntelOneMono = 'INTEL_ONE_MONO',
  Inter = 'INTER',
  InterTight = 'INTER_TIGHT',
  IrishGrover = 'IRISH_GROVER',
  IslandMoments = 'ISLAND_MOMENTS',
  IstokWeb = 'ISTOK_WEB',
  Italiana = 'ITALIANA',
  Italianno = 'ITALIANNO',
  Itim = 'ITIM',
  JacquardaBastarda_9 = 'JACQUARDA_BASTARDA_9',
  JacquardaBastarda_9Charted = 'JACQUARDA_BASTARDA_9_CHARTED',
  Jacquard_12 = 'JACQUARD_12',
  Jacquard_12Charted = 'JACQUARD_12_CHARTED',
  Jacquard_24 = 'JACQUARD_24',
  Jacquard_24Charted = 'JACQUARD_24_CHARTED',
  JacquesFrancois = 'JACQUES_FRANCOIS',
  JacquesFrancoisShadow = 'JACQUES_FRANCOIS_SHADOW',
  Jaini = 'JAINI',
  JainiPurva = 'JAINI_PURVA',
  Jaldi = 'JALDI',
  Jaro = 'JARO',
  Jersey_10 = 'JERSEY_10',
  Jersey_10Charted = 'JERSEY_10_CHARTED',
  Jersey_15 = 'JERSEY_15',
  Jersey_15Charted = 'JERSEY_15_CHARTED',
  Jersey_20 = 'JERSEY_20',
  Jersey_20Charted = 'JERSEY_20_CHARTED',
  Jersey_25 = 'JERSEY_25',
  Jersey_25Charted = 'JERSEY_25_CHARTED',
  JetbrainsMono = 'JETBRAINS_MONO',
  JimNightshade = 'JIM_NIGHTSHADE',
  Joan = 'JOAN',
  JockeyOne = 'JOCKEY_ONE',
  JollyLodger = 'JOLLY_LODGER',
  Jomhuria = 'JOMHURIA',
  Jomolhari = 'JOMOLHARI',
  JosefinSans = 'JOSEFIN_SANS',
  JosefinSlab = 'JOSEFIN_SLAB',
  Jost = 'JOST',
  JotiOne = 'JOTI_ONE',
  Jua = 'JUA',
  Judson = 'JUDSON',
  Julee = 'JULEE',
  JuliusSansOne = 'JULIUS_SANS_ONE',
  Junge = 'JUNGE',
  Jura = 'JURA',
  JustAnotherHand = 'JUST_ANOTHER_HAND',
  JustMeAgainDownHere = 'JUST_ME_AGAIN_DOWN_HERE',
  K2D = 'K2D',
  Kablammo = 'KABLAMMO',
  Kadwa = 'KADWA',
  KaiseiDecol = 'KAISEI_DECOL',
  KaiseiHarunoumi = 'KAISEI_HARUNOUMI',
  KaiseiOpti = 'KAISEI_OPTI',
  KaiseiTokumin = 'KAISEI_TOKUMIN',
  Kalam = 'KALAM',
  Kalnia = 'KALNIA',
  KalniaGlaze = 'KALNIA_GLAZE',
  Kameron = 'KAMERON',
  Kanchenjunga = 'KANCHENJUNGA',
  Kanit = 'KANIT',
  KantumruyPro = 'KANTUMRUY_PRO',
  Kapakana = 'KAPAKANA',
  Karantina = 'KARANTINA',
  Karla = 'KARLA',
  KarlaTamilInclined = 'KARLA_TAMIL_INCLINED',
  KarlaTamilUpright = 'KARLA_TAMIL_UPRIGHT',
  Karma = 'KARMA',
  Katibeh = 'KATIBEH',
  KaushanScript = 'KAUSHAN_SCRIPT',
  Kavivanar = 'KAVIVANAR',
  Kavoon = 'KAVOON',
  KayPhoDu = 'KAY_PHO_DU',
  KdamThmorPro = 'KDAM_THMOR_PRO',
  KeaniaOne = 'KEANIA_ONE',
  KellySlab = 'KELLY_SLAB',
  Kenia = 'KENIA',
  Khand = 'KHAND',
  Khmer = 'KHMER',
  Khula = 'KHULA',
  Kings = 'KINGS',
  KirangHaerang = 'KIRANG_HAERANG',
  KiteOne = 'KITE_ONE',
  KiwiMaru = 'KIWI_MARU',
  KleeOne = 'KLEE_ONE',
  Knewave = 'KNEWAVE',
  Kodchasan = 'KODCHASAN',
  KodeMono = 'KODE_MONO',
  Koho = 'KOHO',
  KohSantepheap = 'KOH_SANTEPHEAP',
  KolkerBrush = 'KOLKER_BRUSH',
  KonkhmerSleokchher = 'KONKHMER_SLEOKCHHER',
  Kosugi = 'KOSUGI',
  KosugiMaru = 'KOSUGI_MARU',
  KottaOne = 'KOTTA_ONE',
  Koulen = 'KOULEN',
  Kranky = 'KRANKY',
  Kreon = 'KREON',
  Kristi = 'KRISTI',
  KronaOne = 'KRONA_ONE',
  Krub = 'KRUB',
  Kufam = 'KUFAM',
  KulimPark = 'KULIM_PARK',
  KumarOne = 'KUMAR_ONE',
  KumarOneOutline = 'KUMAR_ONE_OUTLINE',
  KumbhSans = 'KUMBH_SANS',
  Kurale = 'KURALE',
  Labrada = 'LABRADA',
  Lacquer = 'LACQUER',
  Laila = 'LAILA',
  LakkiReddy = 'LAKKI_REDDY',
  Lalezar = 'LALEZAR',
  Lancelot = 'LANCELOT',
  Langar = 'LANGAR',
  Lateef = 'LATEEF',
  Lato = 'LATO',
  LavishlyYours = 'LAVISHLY_YOURS',
  LaBelleAurore = 'LA_BELLE_AURORE',
  LeagueGothic = 'LEAGUE_GOTHIC',
  LeagueScript = 'LEAGUE_SCRIPT',
  LeagueSpartan = 'LEAGUE_SPARTAN',
  LeckerliOne = 'LECKERLI_ONE',
  Ledger = 'LEDGER',
  Lekton = 'LEKTON',
  Lemon = 'LEMON',
  Lemonada = 'LEMONADA',
  Lexend = 'LEXEND',
  LexendDeca = 'LEXEND_DECA',
  LexendExa = 'LEXEND_EXA',
  LexendGiga = 'LEXEND_GIGA',
  LexendMega = 'LEXEND_MEGA',
  LexendPeta = 'LEXEND_PETA',
  LexendTera = 'LEXEND_TERA',
  LexendZetta = 'LEXEND_ZETTA',
  LibertinusKeyboard = 'LIBERTINUS_KEYBOARD',
  LibertinusMath = 'LIBERTINUS_MATH',
  LibertinusMono = 'LIBERTINUS_MONO',
  LibertinusSans = 'LIBERTINUS_SANS',
  LibertinusSerif = 'LIBERTINUS_SERIF',
  LibertinusSerifDisplay = 'LIBERTINUS_SERIF_DISPLAY',
  LibreBarcode_39 = 'LIBRE_BARCODE_39',
  LibreBarcode_39Extended = 'LIBRE_BARCODE_39_EXTENDED',
  LibreBarcode_39ExtendedText = 'LIBRE_BARCODE_39_EXTENDED_TEXT',
  LibreBarcode_39Text = 'LIBRE_BARCODE_39_TEXT',
  LibreBarcode_128 = 'LIBRE_BARCODE_128',
  LibreBarcode_128Text = 'LIBRE_BARCODE_128_TEXT',
  LibreBarcodeEan13Text = 'LIBRE_BARCODE_EAN13_TEXT',
  LibreBaskerville = 'LIBRE_BASKERVILLE',
  LibreBodoni = 'LIBRE_BODONI',
  LibreCaslonDisplay = 'LIBRE_CASLON_DISPLAY',
  LibreCaslonText = 'LIBRE_CASLON_TEXT',
  LibreFranklin = 'LIBRE_FRANKLIN',
  Licorice = 'LICORICE',
  LifeSavers = 'LIFE_SAVERS',
  LilitaOne = 'LILITA_ONE',
  LilyScriptOne = 'LILY_SCRIPT_ONE',
  Limelight = 'LIMELIGHT',
  LindenHill = 'LINDEN_HILL',
  Linefont = 'LINEFONT',
  LisuBosa = 'LISU_BOSA',
  Liter = 'LITER',
  Literata = 'LITERATA',
  LiuJianMaoCao = 'LIU_JIAN_MAO_CAO',
  Livvic = 'LIVVIC',
  Lobster = 'LOBSTER',
  LobsterTwo = 'LOBSTER_TWO',
  LondrinaOutline = 'LONDRINA_OUTLINE',
  LondrinaShadow = 'LONDRINA_SHADOW',
  LondrinaSketch = 'LONDRINA_SKETCH',
  LondrinaSolid = 'LONDRINA_SOLID',
  LongCang = 'LONG_CANG',
  Lora = 'LORA',
  LovedByTheKing = 'LOVED_BY_THE_KING',
  LoversQuarrel = 'LOVERS_QUARREL',
  LoveLight = 'LOVE_LIGHT',
  LoveYaLikeASister = 'LOVE_YA_LIKE_A_SISTER',
  LuckiestGuy = 'LUCKIEST_GUY',
  Lugrasimo = 'LUGRASIMO',
  Lumanosimo = 'LUMANOSIMO',
  Lunasima = 'LUNASIMA',
  Lusitana = 'LUSITANA',
  Lustria = 'LUSTRIA',
  LuxuriousRoman = 'LUXURIOUS_ROMAN',
  LuxuriousScript = 'LUXURIOUS_SCRIPT',
  LxgwMarkerGothic = 'LXGW_MARKER_GOTHIC',
  LxgwWenkaiMonoTc = 'LXGW_WENKAI_MONO_TC',
  LxgwWenkaiTc = 'LXGW_WENKAI_TC',
  Macondo = 'MACONDO',
  MacondoSwashCaps = 'MACONDO_SWASH_CAPS',
  Mada = 'MADA',
  MadimiOne = 'MADIMI_ONE',
  Magra = 'MAGRA',
  MaidenOrange = 'MAIDEN_ORANGE',
  Maitree = 'MAITREE',
  MajorMonoDisplay = 'MAJOR_MONO_DISPLAY',
  Mako = 'MAKO',
  Mali = 'MALI',
  Mallanna = 'MALLANNA',
  Maname = 'MANAME',
  Mandali = 'MANDALI',
  Manjari = 'MANJARI',
  Manrope = 'MANROPE',
  Mansalva = 'MANSALVA',
  Manuale = 'MANUALE',
  ManufacturingConsent = 'MANUFACTURING_CONSENT',
  Marcellus = 'MARCELLUS',
  MarcellusSc = 'MARCELLUS_SC',
  MarckScript = 'MARCK_SCRIPT',
  Margarine = 'MARGARINE',
  Marhey = 'MARHEY',
  MarkaziText = 'MARKAZI_TEXT',
  MarkoOne = 'MARKO_ONE',
  Marmelad = 'MARMELAD',
  Martel = 'MARTEL',
  MartelSans = 'MARTEL_SANS',
  MartianMono = 'MARTIAN_MONO',
  Marvel = 'MARVEL',
  Matangi = 'MATANGI',
  Mate = 'MATE',
  Matemasie = 'MATEMASIE',
  MaterialIcons = 'MATERIAL_ICONS',
  MaterialIconsOutlined = 'MATERIAL_ICONS_OUTLINED',
  MaterialIconsRound = 'MATERIAL_ICONS_ROUND',
  MaterialIconsSharp = 'MATERIAL_ICONS_SHARP',
  MaterialIconsTwoTone = 'MATERIAL_ICONS_TWO_TONE',
  MaterialSymbols = 'MATERIAL_SYMBOLS',
  MaterialSymbolsOutlined = 'MATERIAL_SYMBOLS_OUTLINED',
  MaterialSymbolsRounded = 'MATERIAL_SYMBOLS_ROUNDED',
  MaterialSymbolsSharp = 'MATERIAL_SYMBOLS_SHARP',
  MateSc = 'MATE_SC',
  MavenPro = 'MAVEN_PRO',
  MaShanZheng = 'MA_SHAN_ZHENG',
  Mclaren = 'MCLAREN',
  MeaCulpa = 'MEA_CULPA',
  Meddon = 'MEDDON',
  Medievalsharp = 'MEDIEVALSHARP',
  MedulaOne = 'MEDULA_ONE',
  MeeraInimai = 'MEERA_INIMAI',
  Megrim = 'MEGRIM',
  MeieScript = 'MEIE_SCRIPT',
  Menbere = 'MENBERE',
  MeowScript = 'MEOW_SCRIPT',
  Merienda = 'MERIENDA',
  Merriweather = 'MERRIWEATHER',
  MerriweatherSans = 'MERRIWEATHER_SANS',
  Metal = 'METAL',
  MetalMania = 'METAL_MANIA',
  Metamorphous = 'METAMORPHOUS',
  Metrophobic = 'METROPHOBIC',
  Michroma = 'MICHROMA',
  Micro_5 = 'MICRO_5',
  Micro_5Charted = 'MICRO_5_CHARTED',
  Milonga = 'MILONGA',
  Miltonian = 'MILTONIAN',
  MiltonianTattoo = 'MILTONIAN_TATTOO',
  Mina = 'MINA',
  Mingzat = 'MINGZAT',
  Miniver = 'MINIVER',
  MiriamLibre = 'MIRIAM_LIBRE',
  Mirza = 'MIRZA',
  MissFajardose = 'MISS_FAJARDOSE',
  Mitr = 'MITR',
  MochiyPopOne = 'MOCHIY_POP_ONE',
  MochiyPopPOne = 'MOCHIY_POP_P_ONE',
  Modak = 'MODAK',
  ModernAntiqua = 'MODERN_ANTIQUA',
  Moderustic = 'MODERUSTIC',
  Mogra = 'MOGRA',
  Mohave = 'MOHAVE',
  MoiraiOne = 'MOIRAI_ONE',
  Molengo = 'MOLENGO',
  Molle = 'MOLLE',
  MomoSignature = 'MOMO_SIGNATURE',
  MomoTrustDisplay = 'MOMO_TRUST_DISPLAY',
  MomoTrustSans = 'MOMO_TRUST_SANS',
  MonaSans = 'MONA_SANS',
  Monda = 'MONDA',
  Monofett = 'MONOFETT',
  Monomakh = 'MONOMAKH',
  MonomaniacOne = 'MONOMANIAC_ONE',
  Monoton = 'MONOTON',
  MonsieurLaDoulaise = 'MONSIEUR_LA_DOULAISE',
  Montaga = 'MONTAGA',
  MontaguSlab = 'MONTAGU_SLAB',
  Montecarlo = 'MONTECARLO',
  Montez = 'MONTEZ',
  Montserrat = 'MONTSERRAT',
  MontserratAlternates = 'MONTSERRAT_ALTERNATES',
  MontserratUnderline = 'MONTSERRAT_UNDERLINE',
  Mooli = 'MOOLI',
  MoonDance = 'MOON_DANCE',
  MooLahLah = 'MOO_LAH_LAH',
  Moul = 'MOUL',
  Moulpali = 'MOULPALI',
  MountainsOfChristmas = 'MOUNTAINS_OF_CHRISTMAS',
  MouseMemoirs = 'MOUSE_MEMOIRS',
  MozillaHeadline = 'MOZILLA_HEADLINE',
  MozillaText = 'MOZILLA_TEXT',
  MrsSaintDelafield = 'MRS_SAINT_DELAFIELD',
  MrsSheppards = 'MRS_SHEPPARDS',
  MrBedfort = 'MR_BEDFORT',
  MrDafoe = 'MR_DAFOE',
  MrDeHaviland = 'MR_DE_HAVILAND',
  MsMadi = 'MS_MADI',
  Mukta = 'MUKTA',
  MuktaMahee = 'MUKTA_MAHEE',
  MuktaMalar = 'MUKTA_MALAR',
  MuktaVaani = 'MUKTA_VAANI',
  Mulish = 'MULISH',
  Murecho = 'MURECHO',
  Museomoderno = 'MUSEOMODERNO',
  Mynerve = 'MYNERVE',
  MysteryQuest = 'MYSTERY_QUEST',
  MySoul = 'MY_SOUL',
  MPlus_1 = 'M_PLUS_1',
  MPlus_1P = 'M_PLUS_1P',
  MPlus_1Code = 'M_PLUS_1_CODE',
  MPlus_2 = 'M_PLUS_2',
  MPlusCodeLatin = 'M_PLUS_CODE_LATIN',
  MPlusRounded_1C = 'M_PLUS_ROUNDED_1C',
  Nabla = 'NABLA',
  Namdhinggo = 'NAMDHINGGO',
  NanumBrushScript = 'NANUM_BRUSH_SCRIPT',
  NanumGothic = 'NANUM_GOTHIC',
  NanumGothicCoding = 'NANUM_GOTHIC_CODING',
  NanumMyeongjo = 'NANUM_MYEONGJO',
  NanumPenScript = 'NANUM_PEN_SCRIPT',
  Narnoor = 'NARNOOR',
  NataSans = 'NATA_SANS',
  NationalPark = 'NATIONAL_PARK',
  Neonderthaw = 'NEONDERTHAW',
  NerkoOne = 'NERKO_ONE',
  Neucha = 'NEUCHA',
  Neuton = 'NEUTON',
  Newsreader = 'NEWSREADER',
  NewsCycle = 'NEWS_CYCLE',
  NewAmsterdam = 'NEW_AMSTERDAM',
  NewRocker = 'NEW_ROCKER',
  NewTegomin = 'NEW_TEGOMIN',
  Niconne = 'NICONNE',
  Niramit = 'NIRAMIT',
  NixieOne = 'NIXIE_ONE',
  Nobile = 'NOBILE',
  Nokora = 'NOKORA',
  Norican = 'NORICAN',
  Nosifer = 'NOSIFER',
  Notable = 'NOTABLE',
  NothingYouCouldDo = 'NOTHING_YOU_COULD_DO',
  NoticiaText = 'NOTICIA_TEXT',
  NotoColorEmoji = 'NOTO_COLOR_EMOJI',
  NotoEmoji = 'NOTO_EMOJI',
  NotoKufiArabic = 'NOTO_KUFI_ARABIC',
  NotoMusic = 'NOTO_MUSIC',
  NotoNaskhArabic = 'NOTO_NASKH_ARABIC',
  NotoNastaliqUrdu = 'NOTO_NASTALIQ_URDU',
  NotoRashiHebrew = 'NOTO_RASHI_HEBREW',
  NotoSans = 'NOTO_SANS',
  NotoSansAdlam = 'NOTO_SANS_ADLAM',
  NotoSansAdlamUnjoined = 'NOTO_SANS_ADLAM_UNJOINED',
  NotoSansAnatolianHieroglyphs = 'NOTO_SANS_ANATOLIAN_HIEROGLYPHS',
  NotoSansArabic = 'NOTO_SANS_ARABIC',
  NotoSansArmenian = 'NOTO_SANS_ARMENIAN',
  NotoSansAvestan = 'NOTO_SANS_AVESTAN',
  NotoSansBalinese = 'NOTO_SANS_BALINESE',
  NotoSansBamum = 'NOTO_SANS_BAMUM',
  NotoSansBassaVah = 'NOTO_SANS_BASSA_VAH',
  NotoSansBatak = 'NOTO_SANS_BATAK',
  NotoSansBengali = 'NOTO_SANS_BENGALI',
  NotoSansBhaiksuki = 'NOTO_SANS_BHAIKSUKI',
  NotoSansBrahmi = 'NOTO_SANS_BRAHMI',
  NotoSansBuginese = 'NOTO_SANS_BUGINESE',
  NotoSansBuhid = 'NOTO_SANS_BUHID',
  NotoSansCanadianAboriginal = 'NOTO_SANS_CANADIAN_ABORIGINAL',
  NotoSansCarian = 'NOTO_SANS_CARIAN',
  NotoSansCaucasianAlbanian = 'NOTO_SANS_CAUCASIAN_ALBANIAN',
  NotoSansChakma = 'NOTO_SANS_CHAKMA',
  NotoSansCham = 'NOTO_SANS_CHAM',
  NotoSansCherokee = 'NOTO_SANS_CHEROKEE',
  NotoSansChorasmian = 'NOTO_SANS_CHORASMIAN',
  NotoSansCoptic = 'NOTO_SANS_COPTIC',
  NotoSansCuneiform = 'NOTO_SANS_CUNEIFORM',
  NotoSansCypriot = 'NOTO_SANS_CYPRIOT',
  NotoSansCyproMinoan = 'NOTO_SANS_CYPRO_MINOAN',
  NotoSansDeseret = 'NOTO_SANS_DESERET',
  NotoSansDevanagari = 'NOTO_SANS_DEVANAGARI',
  NotoSansDisplay = 'NOTO_SANS_DISPLAY',
  NotoSansDuployan = 'NOTO_SANS_DUPLOYAN',
  NotoSansEgyptianHieroglyphs = 'NOTO_SANS_EGYPTIAN_HIEROGLYPHS',
  NotoSansElbasan = 'NOTO_SANS_ELBASAN',
  NotoSansElymaic = 'NOTO_SANS_ELYMAIC',
  NotoSansEthiopic = 'NOTO_SANS_ETHIOPIC',
  NotoSansGeorgian = 'NOTO_SANS_GEORGIAN',
  NotoSansGlagolitic = 'NOTO_SANS_GLAGOLITIC',
  NotoSansGothic = 'NOTO_SANS_GOTHIC',
  NotoSansGrantha = 'NOTO_SANS_GRANTHA',
  NotoSansGujarati = 'NOTO_SANS_GUJARATI',
  NotoSansGunjalaGondi = 'NOTO_SANS_GUNJALA_GONDI',
  NotoSansGurmukhi = 'NOTO_SANS_GURMUKHI',
  NotoSansHanifiRohingya = 'NOTO_SANS_HANIFI_ROHINGYA',
  NotoSansHanunoo = 'NOTO_SANS_HANUNOO',
  NotoSansHatran = 'NOTO_SANS_HATRAN',
  NotoSansHebrew = 'NOTO_SANS_HEBREW',
  NotoSansHk = 'NOTO_SANS_HK',
  NotoSansImperialAramaic = 'NOTO_SANS_IMPERIAL_ARAMAIC',
  NotoSansIndicSiyaqNumbers = 'NOTO_SANS_INDIC_SIYAQ_NUMBERS',
  NotoSansInscriptionalPahlavi = 'NOTO_SANS_INSCRIPTIONAL_PAHLAVI',
  NotoSansInscriptionalParthian = 'NOTO_SANS_INSCRIPTIONAL_PARTHIAN',
  NotoSansJavanese = 'NOTO_SANS_JAVANESE',
  NotoSansJp = 'NOTO_SANS_JP',
  NotoSansKaithi = 'NOTO_SANS_KAITHI',
  NotoSansKannada = 'NOTO_SANS_KANNADA',
  NotoSansKawi = 'NOTO_SANS_KAWI',
  NotoSansKayahLi = 'NOTO_SANS_KAYAH_LI',
  NotoSansKharoshthi = 'NOTO_SANS_KHAROSHTHI',
  NotoSansKhmer = 'NOTO_SANS_KHMER',
  NotoSansKhojki = 'NOTO_SANS_KHOJKI',
  NotoSansKhudawadi = 'NOTO_SANS_KHUDAWADI',
  NotoSansKr = 'NOTO_SANS_KR',
  NotoSansLao = 'NOTO_SANS_LAO',
  NotoSansLaoLooped = 'NOTO_SANS_LAO_LOOPED',
  NotoSansLepcha = 'NOTO_SANS_LEPCHA',
  NotoSansLimbu = 'NOTO_SANS_LIMBU',
  NotoSansLinearA = 'NOTO_SANS_LINEAR_A',
  NotoSansLinearB = 'NOTO_SANS_LINEAR_B',
  NotoSansLisu = 'NOTO_SANS_LISU',
  NotoSansLycian = 'NOTO_SANS_LYCIAN',
  NotoSansLydian = 'NOTO_SANS_LYDIAN',
  NotoSansMahajani = 'NOTO_SANS_MAHAJANI',
  NotoSansMalayalam = 'NOTO_SANS_MALAYALAM',
  NotoSansMandaic = 'NOTO_SANS_MANDAIC',
  NotoSansManichaean = 'NOTO_SANS_MANICHAEAN',
  NotoSansMarchen = 'NOTO_SANS_MARCHEN',
  NotoSansMasaramGondi = 'NOTO_SANS_MASARAM_GONDI',
  NotoSansMath = 'NOTO_SANS_MATH',
  NotoSansMayanNumerals = 'NOTO_SANS_MAYAN_NUMERALS',
  NotoSansMedefaidrin = 'NOTO_SANS_MEDEFAIDRIN',
  NotoSansMeeteiMayek = 'NOTO_SANS_MEETEI_MAYEK',
  NotoSansMendeKikakui = 'NOTO_SANS_MENDE_KIKAKUI',
  NotoSansMeroitic = 'NOTO_SANS_MEROITIC',
  NotoSansMiao = 'NOTO_SANS_MIAO',
  NotoSansModi = 'NOTO_SANS_MODI',
  NotoSansMongolian = 'NOTO_SANS_MONGOLIAN',
  NotoSansMono = 'NOTO_SANS_MONO',
  NotoSansMro = 'NOTO_SANS_MRO',
  NotoSansMultani = 'NOTO_SANS_MULTANI',
  NotoSansMyanmar = 'NOTO_SANS_MYANMAR',
  NotoSansNabataean = 'NOTO_SANS_NABATAEAN',
  NotoSansNagMundari = 'NOTO_SANS_NAG_MUNDARI',
  NotoSansNandinagari = 'NOTO_SANS_NANDINAGARI',
  NotoSansNewa = 'NOTO_SANS_NEWA',
  NotoSansNewTaiLue = 'NOTO_SANS_NEW_TAI_LUE',
  NotoSansNko = 'NOTO_SANS_NKO',
  NotoSansNkoUnjoined = 'NOTO_SANS_NKO_UNJOINED',
  NotoSansNushu = 'NOTO_SANS_NUSHU',
  NotoSansOgham = 'NOTO_SANS_OGHAM',
  NotoSansOldHungarian = 'NOTO_SANS_OLD_HUNGARIAN',
  NotoSansOldItalic = 'NOTO_SANS_OLD_ITALIC',
  NotoSansOldNorthArabian = 'NOTO_SANS_OLD_NORTH_ARABIAN',
  NotoSansOldPermic = 'NOTO_SANS_OLD_PERMIC',
  NotoSansOldPersian = 'NOTO_SANS_OLD_PERSIAN',
  NotoSansOldSogdian = 'NOTO_SANS_OLD_SOGDIAN',
  NotoSansOldSouthArabian = 'NOTO_SANS_OLD_SOUTH_ARABIAN',
  NotoSansOldTurkic = 'NOTO_SANS_OLD_TURKIC',
  NotoSansOlChiki = 'NOTO_SANS_OL_CHIKI',
  NotoSansOriya = 'NOTO_SANS_ORIYA',
  NotoSansOsage = 'NOTO_SANS_OSAGE',
  NotoSansOsmanya = 'NOTO_SANS_OSMANYA',
  NotoSansPahawhHmong = 'NOTO_SANS_PAHAWH_HMONG',
  NotoSansPalmyrene = 'NOTO_SANS_PALMYRENE',
  NotoSansPauCinHau = 'NOTO_SANS_PAU_CIN_HAU',
  NotoSansPhagspa = 'NOTO_SANS_PHAGSPA',
  NotoSansPhoenician = 'NOTO_SANS_PHOENICIAN',
  NotoSansPsalterPahlavi = 'NOTO_SANS_PSALTER_PAHLAVI',
  NotoSansRejang = 'NOTO_SANS_REJANG',
  NotoSansRunic = 'NOTO_SANS_RUNIC',
  NotoSansSamaritan = 'NOTO_SANS_SAMARITAN',
  NotoSansSaurashtra = 'NOTO_SANS_SAURASHTRA',
  NotoSansSc = 'NOTO_SANS_SC',
  NotoSansSharada = 'NOTO_SANS_SHARADA',
  NotoSansShavian = 'NOTO_SANS_SHAVIAN',
  NotoSansSiddham = 'NOTO_SANS_SIDDHAM',
  NotoSansSignwriting = 'NOTO_SANS_SIGNWRITING',
  NotoSansSinhala = 'NOTO_SANS_SINHALA',
  NotoSansSogdian = 'NOTO_SANS_SOGDIAN',
  NotoSansSoraSompeng = 'NOTO_SANS_SORA_SOMPENG',
  NotoSansSoyombo = 'NOTO_SANS_SOYOMBO',
  NotoSansSundanese = 'NOTO_SANS_SUNDANESE',
  NotoSansSunuwar = 'NOTO_SANS_SUNUWAR',
  NotoSansSylotiNagri = 'NOTO_SANS_SYLOTI_NAGRI',
  NotoSansSymbols = 'NOTO_SANS_SYMBOLS',
  NotoSansSymbols_2 = 'NOTO_SANS_SYMBOLS_2',
  NotoSansSyriac = 'NOTO_SANS_SYRIAC',
  NotoSansSyriacEastern = 'NOTO_SANS_SYRIAC_EASTERN',
  NotoSansSyriacWestern = 'NOTO_SANS_SYRIAC_WESTERN',
  NotoSansTagalog = 'NOTO_SANS_TAGALOG',
  NotoSansTagbanwa = 'NOTO_SANS_TAGBANWA',
  NotoSansTaiLe = 'NOTO_SANS_TAI_LE',
  NotoSansTaiTham = 'NOTO_SANS_TAI_THAM',
  NotoSansTaiViet = 'NOTO_SANS_TAI_VIET',
  NotoSansTakri = 'NOTO_SANS_TAKRI',
  NotoSansTamil = 'NOTO_SANS_TAMIL',
  NotoSansTamilSupplement = 'NOTO_SANS_TAMIL_SUPPLEMENT',
  NotoSansTangsa = 'NOTO_SANS_TANGSA',
  NotoSansTc = 'NOTO_SANS_TC',
  NotoSansTelugu = 'NOTO_SANS_TELUGU',
  NotoSansThaana = 'NOTO_SANS_THAANA',
  NotoSansThai = 'NOTO_SANS_THAI',
  NotoSansThaiLooped = 'NOTO_SANS_THAI_LOOPED',
  NotoSansTifinagh = 'NOTO_SANS_TIFINAGH',
  NotoSansTirhuta = 'NOTO_SANS_TIRHUTA',
  NotoSansUgaritic = 'NOTO_SANS_UGARITIC',
  NotoSansVai = 'NOTO_SANS_VAI',
  NotoSansVithkuqi = 'NOTO_SANS_VITHKUQI',
  NotoSansWancho = 'NOTO_SANS_WANCHO',
  NotoSansWarangCiti = 'NOTO_SANS_WARANG_CITI',
  NotoSansYi = 'NOTO_SANS_YI',
  NotoSansZanabazarSquare = 'NOTO_SANS_ZANABAZAR_SQUARE',
  NotoSerif = 'NOTO_SERIF',
  NotoSerifAhom = 'NOTO_SERIF_AHOM',
  NotoSerifArmenian = 'NOTO_SERIF_ARMENIAN',
  NotoSerifBalinese = 'NOTO_SERIF_BALINESE',
  NotoSerifBengali = 'NOTO_SERIF_BENGALI',
  NotoSerifDevanagari = 'NOTO_SERIF_DEVANAGARI',
  NotoSerifDisplay = 'NOTO_SERIF_DISPLAY',
  NotoSerifDivesAkuru = 'NOTO_SERIF_DIVES_AKURU',
  NotoSerifDogra = 'NOTO_SERIF_DOGRA',
  NotoSerifEthiopic = 'NOTO_SERIF_ETHIOPIC',
  NotoSerifGeorgian = 'NOTO_SERIF_GEORGIAN',
  NotoSerifGrantha = 'NOTO_SERIF_GRANTHA',
  NotoSerifGujarati = 'NOTO_SERIF_GUJARATI',
  NotoSerifGurmukhi = 'NOTO_SERIF_GURMUKHI',
  NotoSerifHebrew = 'NOTO_SERIF_HEBREW',
  NotoSerifHentaigana = 'NOTO_SERIF_HENTAIGANA',
  NotoSerifHk = 'NOTO_SERIF_HK',
  NotoSerifJp = 'NOTO_SERIF_JP',
  NotoSerifKannada = 'NOTO_SERIF_KANNADA',
  NotoSerifKhitanSmallScript = 'NOTO_SERIF_KHITAN_SMALL_SCRIPT',
  NotoSerifKhmer = 'NOTO_SERIF_KHMER',
  NotoSerifKhojki = 'NOTO_SERIF_KHOJKI',
  NotoSerifKr = 'NOTO_SERIF_KR',
  NotoSerifLao = 'NOTO_SERIF_LAO',
  NotoSerifMakasar = 'NOTO_SERIF_MAKASAR',
  NotoSerifMalayalam = 'NOTO_SERIF_MALAYALAM',
  NotoSerifMyanmar = 'NOTO_SERIF_MYANMAR',
  NotoSerifNpHmong = 'NOTO_SERIF_NP_HMONG',
  NotoSerifOldUyghur = 'NOTO_SERIF_OLD_UYGHUR',
  NotoSerifOriya = 'NOTO_SERIF_ORIYA',
  NotoSerifOttomanSiyaq = 'NOTO_SERIF_OTTOMAN_SIYAQ',
  NotoSerifSc = 'NOTO_SERIF_SC',
  NotoSerifSinhala = 'NOTO_SERIF_SINHALA',
  NotoSerifTamil = 'NOTO_SERIF_TAMIL',
  NotoSerifTangut = 'NOTO_SERIF_TANGUT',
  NotoSerifTc = 'NOTO_SERIF_TC',
  NotoSerifTelugu = 'NOTO_SERIF_TELUGU',
  NotoSerifThai = 'NOTO_SERIF_THAI',
  NotoSerifTibetan = 'NOTO_SERIF_TIBETAN',
  NotoSerifTodhri = 'NOTO_SERIF_TODHRI',
  NotoSerifToto = 'NOTO_SERIF_TOTO',
  NotoSerifVithkuqi = 'NOTO_SERIF_VITHKUQI',
  NotoSerifYezidi = 'NOTO_SERIF_YEZIDI',
  NotoTraditionalNushu = 'NOTO_TRADITIONAL_NUSHU',
  NotoZnamennyMusicalNotation = 'NOTO_ZNAMENNY_MUSICAL_NOTATION',
  NovaCut = 'NOVA_CUT',
  NovaFlat = 'NOVA_FLAT',
  NovaMono = 'NOVA_MONO',
  NovaOval = 'NOVA_OVAL',
  NovaRound = 'NOVA_ROUND',
  NovaScript = 'NOVA_SCRIPT',
  NovaSlim = 'NOVA_SLIM',
  NovaSquare = 'NOVA_SQUARE',
  Ntr = 'NTR',
  Numans = 'NUMANS',
  Nunito = 'NUNITO',
  NunitoSans = 'NUNITO_SANS',
  NuosuSil = 'NUOSU_SIL',
  OdibeeSans = 'ODIBEE_SANS',
  OdorMeanChey = 'ODOR_MEAN_CHEY',
  Offside = 'OFFSIDE',
  Oi = 'OI',
  Ojuju = 'OJUJU',
  Oldenburg = 'OLDENBURG',
  OldStandardTt = 'OLD_STANDARD_TT',
  Ole = 'OLE',
  OleoScript = 'OLEO_SCRIPT',
  OleoScriptSwashCaps = 'OLEO_SCRIPT_SWASH_CAPS',
  Onest = 'ONEST',
  OoohBaby = 'OOOH_BABY',
  OpenSans = 'OPEN_SANS',
  Oranienbaum = 'ORANIENBAUM',
  Orbit = 'ORBIT',
  Orbitron = 'ORBITRON',
  Oregano = 'OREGANO',
  OrelegaOne = 'ORELEGA_ONE',
  Orienta = 'ORIENTA',
  OriginalSurfer = 'ORIGINAL_SURFER',
  Oswald = 'OSWALD',
  Outfit = 'OUTFIT',
  Overlock = 'OVERLOCK',
  OverlockSc = 'OVERLOCK_SC',
  Overpass = 'OVERPASS',
  OverpassMono = 'OVERPASS_MONO',
  OverTheRainbow = 'OVER_THE_RAINBOW',
  Ovo = 'OVO',
  Oxanium = 'OXANIUM',
  Oxygen = 'OXYGEN',
  OxygenMono = 'OXYGEN_MONO',
  Pacifico = 'PACIFICO',
  Padauk = 'PADAUK',
  PadyakkeExpandedOne = 'PADYAKKE_EXPANDED_ONE',
  Palanquin = 'PALANQUIN',
  PalanquinDark = 'PALANQUIN_DARK',
  PaletteMosaic = 'PALETTE_MOSAIC',
  Pangolin = 'PANGOLIN',
  Paprika = 'PAPRIKA',
  Parastoo = 'PARASTOO',
  Parisienne = 'PARISIENNE',
  Parkinsans = 'PARKINSANS',
  PasseroOne = 'PASSERO_ONE',
  PassionsConflict = 'PASSIONS_CONFLICT',
  PassionOne = 'PASSION_ONE',
  PathwayExtreme = 'PATHWAY_EXTREME',
  PathwayGothicOne = 'PATHWAY_GOTHIC_ONE',
  PatrickHand = 'PATRICK_HAND',
  PatrickHandSc = 'PATRICK_HAND_SC',
  Pattaya = 'PATTAYA',
  PatuaOne = 'PATUA_ONE',
  Pavanam = 'PAVANAM',
  PaytoneOne = 'PAYTONE_ONE',
  Peddana = 'PEDDANA',
  Peralta = 'PERALTA',
  PermanentMarker = 'PERMANENT_MARKER',
  Petemoss = 'PETEMOSS',
  PetitFormalScript = 'PETIT_FORMAL_SCRIPT',
  Petrona = 'PETRONA',
  Phetsarath = 'PHETSARATH',
  Philosopher = 'PHILOSOPHER',
  Phudu = 'PHUDU',
  Piazzolla = 'PIAZZOLLA',
  Piedra = 'PIEDRA',
  PinyonScript = 'PINYON_SCRIPT',
  PirataOne = 'PIRATA_ONE',
  PixelifySans = 'PIXELIFY_SANS',
  Plaster = 'PLASTER',
  Platypi = 'PLATYPI',
  Play = 'PLAY',
  Playball = 'PLAYBALL',
  Playfair = 'PLAYFAIR',
  PlayfairDisplay = 'PLAYFAIR_DISPLAY',
  PlayfairDisplaySc = 'PLAYFAIR_DISPLAY_SC',
  PlaypenSans = 'PLAYPEN_SANS',
  PlaypenSansArabic = 'PLAYPEN_SANS_ARABIC',
  PlaypenSansDeva = 'PLAYPEN_SANS_DEVA',
  PlaypenSansHebrew = 'PLAYPEN_SANS_HEBREW',
  PlaypenSansThai = 'PLAYPEN_SANS_THAI',
  PlaywriteAr = 'PLAYWRITE_AR',
  PlaywriteArGuides = 'PLAYWRITE_AR_GUIDES',
  PlaywriteAt = 'PLAYWRITE_AT',
  PlaywriteAtGuides = 'PLAYWRITE_AT_GUIDES',
  PlaywriteAuNsw = 'PLAYWRITE_AU_NSW',
  PlaywriteAuNswGuides = 'PLAYWRITE_AU_NSW_GUIDES',
  PlaywriteAuQld = 'PLAYWRITE_AU_QLD',
  PlaywriteAuQldGuides = 'PLAYWRITE_AU_QLD_GUIDES',
  PlaywriteAuSa = 'PLAYWRITE_AU_SA',
  PlaywriteAuSaGuides = 'PLAYWRITE_AU_SA_GUIDES',
  PlaywriteAuTas = 'PLAYWRITE_AU_TAS',
  PlaywriteAuTasGuides = 'PLAYWRITE_AU_TAS_GUIDES',
  PlaywriteAuVic = 'PLAYWRITE_AU_VIC',
  PlaywriteAuVicGuides = 'PLAYWRITE_AU_VIC_GUIDES',
  PlaywriteBeVlg = 'PLAYWRITE_BE_VLG',
  PlaywriteBeVlgGuides = 'PLAYWRITE_BE_VLG_GUIDES',
  PlaywriteBeWal = 'PLAYWRITE_BE_WAL',
  PlaywriteBeWalGuides = 'PLAYWRITE_BE_WAL_GUIDES',
  PlaywriteBr = 'PLAYWRITE_BR',
  PlaywriteBrGuides = 'PLAYWRITE_BR_GUIDES',
  PlaywriteCa = 'PLAYWRITE_CA',
  PlaywriteCaGuides = 'PLAYWRITE_CA_GUIDES',
  PlaywriteCl = 'PLAYWRITE_CL',
  PlaywriteClGuides = 'PLAYWRITE_CL_GUIDES',
  PlaywriteCo = 'PLAYWRITE_CO',
  PlaywriteCoGuides = 'PLAYWRITE_CO_GUIDES',
  PlaywriteCu = 'PLAYWRITE_CU',
  PlaywriteCuGuides = 'PLAYWRITE_CU_GUIDES',
  PlaywriteCz = 'PLAYWRITE_CZ',
  PlaywriteCzGuides = 'PLAYWRITE_CZ_GUIDES',
  PlaywriteDeGrund = 'PLAYWRITE_DE_GRUND',
  PlaywriteDeGrundGuides = 'PLAYWRITE_DE_GRUND_GUIDES',
  PlaywriteDeLa = 'PLAYWRITE_DE_LA',
  PlaywriteDeLaGuides = 'PLAYWRITE_DE_LA_GUIDES',
  PlaywriteDeSas = 'PLAYWRITE_DE_SAS',
  PlaywriteDeSasGuides = 'PLAYWRITE_DE_SAS_GUIDES',
  PlaywriteDeVa = 'PLAYWRITE_DE_VA',
  PlaywriteDeVaGuides = 'PLAYWRITE_DE_VA_GUIDES',
  PlaywriteDkLoopet = 'PLAYWRITE_DK_LOOPET',
  PlaywriteDkLoopetGuides = 'PLAYWRITE_DK_LOOPET_GUIDES',
  PlaywriteDkUloopet = 'PLAYWRITE_DK_ULOOPET',
  PlaywriteDkUloopetGuides = 'PLAYWRITE_DK_ULOOPET_GUIDES',
  PlaywriteEs = 'PLAYWRITE_ES',
  PlaywriteEsDeco = 'PLAYWRITE_ES_DECO',
  PlaywriteEsDecoGuides = 'PLAYWRITE_ES_DECO_GUIDES',
  PlaywriteEsGuides = 'PLAYWRITE_ES_GUIDES',
  PlaywriteFrModerne = 'PLAYWRITE_FR_MODERNE',
  PlaywriteFrModerneGuides = 'PLAYWRITE_FR_MODERNE_GUIDES',
  PlaywriteFrTrad = 'PLAYWRITE_FR_TRAD',
  PlaywriteFrTradGuides = 'PLAYWRITE_FR_TRAD_GUIDES',
  PlaywriteGbJ = 'PLAYWRITE_GB_J',
  PlaywriteGbJGuides = 'PLAYWRITE_GB_J_GUIDES',
  PlaywriteGbS = 'PLAYWRITE_GB_S',
  PlaywriteGbSGuides = 'PLAYWRITE_GB_S_GUIDES',
  PlaywriteHr = 'PLAYWRITE_HR',
  PlaywriteHrGuides = 'PLAYWRITE_HR_GUIDES',
  PlaywriteHrLijeva = 'PLAYWRITE_HR_LIJEVA',
  PlaywriteHrLijevaGuides = 'PLAYWRITE_HR_LIJEVA_GUIDES',
  PlaywriteHu = 'PLAYWRITE_HU',
  PlaywriteHuGuides = 'PLAYWRITE_HU_GUIDES',
  PlaywriteId = 'PLAYWRITE_ID',
  PlaywriteIdGuides = 'PLAYWRITE_ID_GUIDES',
  PlaywriteIe = 'PLAYWRITE_IE',
  PlaywriteIeGuides = 'PLAYWRITE_IE_GUIDES',
  PlaywriteIn = 'PLAYWRITE_IN',
  PlaywriteInGuides = 'PLAYWRITE_IN_GUIDES',
  PlaywriteIs = 'PLAYWRITE_IS',
  PlaywriteIsGuides = 'PLAYWRITE_IS_GUIDES',
  PlaywriteItModerna = 'PLAYWRITE_IT_MODERNA',
  PlaywriteItModernaGuides = 'PLAYWRITE_IT_MODERNA_GUIDES',
  PlaywriteItTrad = 'PLAYWRITE_IT_TRAD',
  PlaywriteItTradGuides = 'PLAYWRITE_IT_TRAD_GUIDES',
  PlaywriteMx = 'PLAYWRITE_MX',
  PlaywriteMxGuides = 'PLAYWRITE_MX_GUIDES',
  PlaywriteNgModern = 'PLAYWRITE_NG_MODERN',
  PlaywriteNgModernGuides = 'PLAYWRITE_NG_MODERN_GUIDES',
  PlaywriteNl = 'PLAYWRITE_NL',
  PlaywriteNlGuides = 'PLAYWRITE_NL_GUIDES',
  PlaywriteNo = 'PLAYWRITE_NO',
  PlaywriteNoGuides = 'PLAYWRITE_NO_GUIDES',
  PlaywriteNz = 'PLAYWRITE_NZ',
  PlaywriteNzGuides = 'PLAYWRITE_NZ_GUIDES',
  PlaywritePe = 'PLAYWRITE_PE',
  PlaywritePeGuides = 'PLAYWRITE_PE_GUIDES',
  PlaywritePl = 'PLAYWRITE_PL',
  PlaywritePlGuides = 'PLAYWRITE_PL_GUIDES',
  PlaywritePt = 'PLAYWRITE_PT',
  PlaywritePtGuides = 'PLAYWRITE_PT_GUIDES',
  PlaywriteRo = 'PLAYWRITE_RO',
  PlaywriteRoGuides = 'PLAYWRITE_RO_GUIDES',
  PlaywriteSk = 'PLAYWRITE_SK',
  PlaywriteSkGuides = 'PLAYWRITE_SK_GUIDES',
  PlaywriteTz = 'PLAYWRITE_TZ',
  PlaywriteTzGuides = 'PLAYWRITE_TZ_GUIDES',
  PlaywriteUsModern = 'PLAYWRITE_US_MODERN',
  PlaywriteUsModernGuides = 'PLAYWRITE_US_MODERN_GUIDES',
  PlaywriteUsTrad = 'PLAYWRITE_US_TRAD',
  PlaywriteUsTradGuides = 'PLAYWRITE_US_TRAD_GUIDES',
  PlaywriteVn = 'PLAYWRITE_VN',
  PlaywriteVnGuides = 'PLAYWRITE_VN_GUIDES',
  PlaywriteZa = 'PLAYWRITE_ZA',
  PlaywriteZaGuides = 'PLAYWRITE_ZA_GUIDES',
  PlusJakartaSans = 'PLUS_JAKARTA_SANS',
  Pochaevsk = 'POCHAEVSK',
  Podkova = 'PODKOVA',
  PoetsenOne = 'POETSEN_ONE',
  PoiretOne = 'POIRET_ONE',
  PollerOne = 'POLLER_ONE',
  PoltawskiNowy = 'POLTAWSKI_NOWY',
  Poly = 'POLY',
  Pompiere = 'POMPIERE',
  Ponnala = 'PONNALA',
  Ponomar = 'PONOMAR',
  PontanoSans = 'PONTANO_SANS',
  PoorStory = 'POOR_STORY',
  Poppins = 'POPPINS',
  PortLligatSans = 'PORT_LLIGAT_SANS',
  PortLligatSlab = 'PORT_LLIGAT_SLAB',
  PottaOne = 'POTTA_ONE',
  PragatiNarrow = 'PRAGATI_NARROW',
  Praise = 'PRAISE',
  Prata = 'PRATA',
  Preahvihear = 'PREAHVIHEAR',
  PressStart_2P = 'PRESS_START_2P',
  Pridi = 'PRIDI',
  PrincessSofia = 'PRINCESS_SOFIA',
  Prociono = 'PROCIONO',
  Prompt = 'PROMPT',
  ProstoOne = 'PROSTO_ONE',
  ProtestGuerrilla = 'PROTEST_GUERRILLA',
  ProtestRevolution = 'PROTEST_REVOLUTION',
  ProtestRiot = 'PROTEST_RIOT',
  ProtestStrike = 'PROTEST_STRIKE',
  ProzaLibre = 'PROZA_LIBRE',
  PtMono = 'PT_MONO',
  PtSans = 'PT_SANS',
  PtSansCaption = 'PT_SANS_CAPTION',
  PtSansNarrow = 'PT_SANS_NARROW',
  PtSerif = 'PT_SERIF',
  PtSerifCaption = 'PT_SERIF_CAPTION',
  PublicSans = 'PUBLIC_SANS',
  PuppiesPlay = 'PUPPIES_PLAY',
  Puritan = 'PURITAN',
  PurplePurse = 'PURPLE_PURSE',
  Qahiri = 'QAHIRI',
  Quando = 'QUANDO',
  Quantico = 'QUANTICO',
  Quattrocento = 'QUATTROCENTO',
  QuattrocentoSans = 'QUATTROCENTO_SANS',
  Questrial = 'QUESTRIAL',
  Quicksand = 'QUICKSAND',
  Quintessential = 'QUINTESSENTIAL',
  Qwigley = 'QWIGLEY',
  QwitcherGrypen = 'QWITCHER_GRYPEN',
  RacingSansOne = 'RACING_SANS_ONE',
  RadioCanada = 'RADIO_CANADA',
  RadioCanadaBig = 'RADIO_CANADA_BIG',
  Radley = 'RADLEY',
  Rajdhani = 'RAJDHANI',
  Rakkas = 'RAKKAS',
  Raleway = 'RALEWAY',
  RalewayDots = 'RALEWAY_DOTS',
  Ramabhadra = 'RAMABHADRA',
  Ramaraja = 'RAMARAJA',
  Rambla = 'RAMBLA',
  RammettoOne = 'RAMMETTO_ONE',
  RampartOne = 'RAMPART_ONE',
  Ranchers = 'RANCHERS',
  Rancho = 'RANCHO',
  Ranga = 'RANGA',
  Rasa = 'RASA',
  Rationale = 'RATIONALE',
  RaviPrakash = 'RAVI_PRAKASH',
  ReadexPro = 'READEX_PRO',
  Recursive = 'RECURSIVE',
  Redacted = 'REDACTED',
  RedactedScript = 'REDACTED_SCRIPT',
  RedditMono = 'REDDIT_MONO',
  RedditSans = 'REDDIT_SANS',
  RedditSansCondensed = 'REDDIT_SANS_CONDENSED',
  Redressed = 'REDRESSED',
  RedHatDisplay = 'RED_HAT_DISPLAY',
  RedHatMono = 'RED_HAT_MONO',
  RedHatText = 'RED_HAT_TEXT',
  RedRose = 'RED_ROSE',
  ReemKufi = 'REEM_KUFI',
  ReemKufiFun = 'REEM_KUFI_FUN',
  ReemKufiInk = 'REEM_KUFI_INK',
  ReenieBeanie = 'REENIE_BEANIE',
  ReggaeOne = 'REGGAE_ONE',
  Rem = 'REM',
  RethinkSans = 'RETHINK_SANS',
  Revalia = 'REVALIA',
  RhodiumLibre = 'RHODIUM_LIBRE',
  Ribeye = 'RIBEYE',
  RibeyeMarrow = 'RIBEYE_MARROW',
  Righteous = 'RIGHTEOUS',
  Risque = 'RISQUE',
  RoadRage = 'ROAD_RAGE',
  Roboto = 'ROBOTO',
  RobotoCondensed = 'ROBOTO_CONDENSED',
  RobotoFlex = 'ROBOTO_FLEX',
  RobotoMono = 'ROBOTO_MONO',
  RobotoSerif = 'ROBOTO_SERIF',
  RobotoSlab = 'ROBOTO_SLAB',
  Rochester = 'ROCHESTER',
  RocknrollOne = 'ROCKNROLL_ONE',
  Rock_3D = 'ROCK_3D',
  RockSalt = 'ROCK_SALT',
  Rokkitt = 'ROKKITT',
  Romanesco = 'ROMANESCO',
  RopaSans = 'ROPA_SANS',
  Rosario = 'ROSARIO',
  Rosarivo = 'ROSARIVO',
  RougeScript = 'ROUGE_SCRIPT',
  Rowdies = 'ROWDIES',
  RozhaOne = 'ROZHA_ONE',
  Rubik = 'RUBIK',
  Rubik_80SFade = 'RUBIK_80S_FADE',
  RubikBeastly = 'RUBIK_BEASTLY',
  RubikBrokenFax = 'RUBIK_BROKEN_FAX',
  RubikBubbles = 'RUBIK_BUBBLES',
  RubikBurned = 'RUBIK_BURNED',
  RubikDirt = 'RUBIK_DIRT',
  RubikDistressed = 'RUBIK_DISTRESSED',
  RubikDoodleShadow = 'RUBIK_DOODLE_SHADOW',
  RubikDoodleTriangles = 'RUBIK_DOODLE_TRIANGLES',
  RubikGemstones = 'RUBIK_GEMSTONES',
  RubikGlitch = 'RUBIK_GLITCH',
  RubikGlitchPop = 'RUBIK_GLITCH_POP',
  RubikIso = 'RUBIK_ISO',
  RubikLines = 'RUBIK_LINES',
  RubikMaps = 'RUBIK_MAPS',
  RubikMarkerHatch = 'RUBIK_MARKER_HATCH',
  RubikMaze = 'RUBIK_MAZE',
  RubikMicrobe = 'RUBIK_MICROBE',
  RubikMonoOne = 'RUBIK_MONO_ONE',
  RubikMoonrocks = 'RUBIK_MOONROCKS',
  RubikPixels = 'RUBIK_PIXELS',
  RubikPuddles = 'RUBIK_PUDDLES',
  RubikScribble = 'RUBIK_SCRIBBLE',
  RubikSprayPaint = 'RUBIK_SPRAY_PAINT',
  RubikStorm = 'RUBIK_STORM',
  RubikVinyl = 'RUBIK_VINYL',
  RubikWetPaint = 'RUBIK_WET_PAINT',
  Ruda = 'RUDA',
  Rufina = 'RUFINA',
  RugeBoogie = 'RUGE_BOOGIE',
  Ruluko = 'RULUKO',
  RumRaisin = 'RUM_RAISIN',
  RuslanDisplay = 'RUSLAN_DISPLAY',
  RussoOne = 'RUSSO_ONE',
  Ruthie = 'RUTHIE',
  Ruwudu = 'RUWUDU',
  Rye = 'RYE',
  Sacramento = 'SACRAMENTO',
  Sahitya = 'SAHITYA',
  Sail = 'SAIL',
  Saira = 'SAIRA',
  SairaCondensed = 'SAIRA_CONDENSED',
  SairaExtraCondensed = 'SAIRA_EXTRA_CONDENSED',
  SairaSemiCondensed = 'SAIRA_SEMI_CONDENSED',
  SairaStencilOne = 'SAIRA_STENCIL_ONE',
  Salsa = 'SALSA',
  Sanchez = 'SANCHEZ',
  Sancreek = 'SANCREEK',
  SankofaDisplay = 'SANKOFA_DISPLAY',
  Sansation = 'SANSATION',
  Sansita = 'SANSITA',
  SansitaSwashed = 'SANSITA_SWASHED',
  Sarabun = 'SARABUN',
  Sarala = 'SARALA',
  Sarina = 'SARINA',
  Sarpanch = 'SARPANCH',
  SassyFrass = 'SASSY_FRASS',
  Satisfy = 'SATISFY',
  Savate = 'SAVATE',
  SawarabiGothic = 'SAWARABI_GOTHIC',
  SawarabiMincho = 'SAWARABI_MINCHO',
  Scada = 'SCADA',
  ScheherazadeNew = 'SCHEHERAZADE_NEW',
  SchibstedGrotesk = 'SCHIBSTED_GROTESK',
  Schoolbell = 'SCHOOLBELL',
  ScopeOne = 'SCOPE_ONE',
  SeaweedScript = 'SEAWEED_SCRIPT',
  SecularOne = 'SECULAR_ONE',
  Sedan = 'SEDAN',
  SedanSc = 'SEDAN_SC',
  SedgwickAve = 'SEDGWICK_AVE',
  SedgwickAveDisplay = 'SEDGWICK_AVE_DISPLAY',
  Sen = 'SEN',
  SendFlowers = 'SEND_FLOWERS',
  Sevillana = 'SEVILLANA',
  SeymourOne = 'SEYMOUR_ONE',
  ShadowsIntoLight = 'SHADOWS_INTO_LIGHT',
  ShadowsIntoLightTwo = 'SHADOWS_INTO_LIGHT_TWO',
  Shafarik = 'SHAFARIK',
  Shalimar = 'SHALIMAR',
  ShantellSans = 'SHANTELL_SANS',
  Shanti = 'SHANTI',
  Share = 'SHARE',
  ShareTech = 'SHARE_TECH',
  ShareTechMono = 'SHARE_TECH_MONO',
  ShipporiAntique = 'SHIPPORI_ANTIQUE',
  ShipporiAntiqueB1 = 'SHIPPORI_ANTIQUE_B1',
  ShipporiMincho = 'SHIPPORI_MINCHO',
  ShipporiMinchoB1 = 'SHIPPORI_MINCHO_B1',
  Shizuru = 'SHIZURU',
  Shojumaru = 'SHOJUMARU',
  ShortStack = 'SHORT_STACK',
  Shrikhand = 'SHRIKHAND',
  Siemreap = 'SIEMREAP',
  Sigmar = 'SIGMAR',
  SigmarOne = 'SIGMAR_ONE',
  Signika = 'SIGNIKA',
  SignikaNegative = 'SIGNIKA_NEGATIVE',
  Silkscreen = 'SILKSCREEN',
  Simonetta = 'SIMONETTA',
  SingleDay = 'SINGLE_DAY',
  Sintony = 'SINTONY',
  SirinStencil = 'SIRIN_STENCIL',
  Sirivennela = 'SIRIVENNELA',
  Sixtyfour = 'SIXTYFOUR',
  SixtyfourConvergence = 'SIXTYFOUR_CONVERGENCE',
  SixCaps = 'SIX_CAPS',
  Skranji = 'SKRANJI',
  Slabo_13Px = 'SLABO_13PX',
  Slabo_27Px = 'SLABO_27PX',
  Slackey = 'SLACKEY',
  SlacksideOne = 'SLACKSIDE_ONE',
  Smokum = 'SMOKUM',
  Smooch = 'SMOOCH',
  SmoochSans = 'SMOOCH_SANS',
  Smythe = 'SMYTHE',
  Sniglet = 'SNIGLET',
  Snippet = 'SNIPPET',
  SnowburstOne = 'SNOWBURST_ONE',
  SofadiOne = 'SOFADI_ONE',
  Sofia = 'SOFIA',
  SofiaSans = 'SOFIA_SANS',
  SofiaSansCondensed = 'SOFIA_SANS_CONDENSED',
  SofiaSansExtraCondensed = 'SOFIA_SANS_EXTRA_CONDENSED',
  SofiaSansSemiCondensed = 'SOFIA_SANS_SEMI_CONDENSED',
  Solitreo = 'SOLITREO',
  Solway = 'SOLWAY',
  SometypeMono = 'SOMETYPE_MONO',
  SongMyung = 'SONG_MYUNG',
  Sono = 'SONO',
  SonsieOne = 'SONSIE_ONE',
  Sora = 'SORA',
  SortsMillGoudy = 'SORTS_MILL_GOUDY',
  SourceCodePro = 'SOURCE_CODE_PRO',
  SourceSans_3 = 'SOURCE_SANS_3',
  SourceSerif_4 = 'SOURCE_SERIF_4',
  SourGummy = 'SOUR_GUMMY',
  SpaceGrotesk = 'SPACE_GROTESK',
  SpaceMono = 'SPACE_MONO',
  SpecialElite = 'SPECIAL_ELITE',
  SpecialGothic = 'SPECIAL_GOTHIC',
  SpecialGothicCondensedOne = 'SPECIAL_GOTHIC_CONDENSED_ONE',
  SpecialGothicExpandedOne = 'SPECIAL_GOTHIC_EXPANDED_ONE',
  Spectral = 'SPECTRAL',
  SpectralSc = 'SPECTRAL_SC',
  SpicyRice = 'SPICY_RICE',
  Spinnaker = 'SPINNAKER',
  Spirax = 'SPIRAX',
  Splash = 'SPLASH',
  SplineSans = 'SPLINE_SANS',
  SplineSansMono = 'SPLINE_SANS_MONO',
  SquadaOne = 'SQUADA_ONE',
  SquarePeg = 'SQUARE_PEG',
  SreeKrushnadevaraya = 'SREE_KRUSHNADEVARAYA',
  Sriracha = 'SRIRACHA',
  Srisakdi = 'SRISAKDI',
  Staatliches = 'STAATLICHES',
  StackSansHeadline = 'STACK_SANS_HEADLINE',
  StackSansNotch = 'STACK_SANS_NOTCH',
  StackSansText = 'STACK_SANS_TEXT',
  Stalemate = 'STALEMATE',
  StalinistOne = 'STALINIST_ONE',
  StardosStencil = 'STARDOS_STENCIL',
  Stick = 'STICK',
  StickNoBills = 'STICK_NO_BILLS',
  StintUltraCondensed = 'STINT_ULTRA_CONDENSED',
  StintUltraExpanded = 'STINT_ULTRA_EXPANDED',
  StixTwoText = 'STIX_TWO_TEXT',
  Stoke = 'STOKE',
  StoryScript = 'STORY_SCRIPT',
  Strait = 'STRAIT',
  StyleScript = 'STYLE_SCRIPT',
  Stylish = 'STYLISH',
  SuezOne = 'SUEZ_ONE',
  SueEllenFrancisco = 'SUE_ELLEN_FRANCISCO',
  SulphurPoint = 'SULPHUR_POINT',
  Sumana = 'SUMANA',
  Sunflower = 'SUNFLOWER',
  Sunshiney = 'SUNSHINEY',
  SupermercadoOne = 'SUPERMERCADO_ONE',
  Sura = 'SURA',
  Suranna = 'SURANNA',
  Suravaram = 'SURAVARAM',
  Suse = 'SUSE',
  SuseMono = 'SUSE_MONO',
  Suwannaphum = 'SUWANNAPHUM',
  SwankyAndMooMoo = 'SWANKY_AND_MOO_MOO',
  Syncopate = 'SYNCOPATE',
  Syne = 'SYNE',
  SyneMono = 'SYNE_MONO',
  SyneTactile = 'SYNE_TACTILE',
  TacOne = 'TAC_ONE',
  Tagesschrift = 'TAGESSCHRIFT',
  TaiHeritagePro = 'TAI_HERITAGE_PRO',
  Tajawal = 'TAJAWAL',
  Tangerine = 'TANGERINE',
  Tapestry = 'TAPESTRY',
  Taprom = 'TAPROM',
  TasaExplorer = 'TASA_EXPLORER',
  TasaOrbiter = 'TASA_ORBITER',
  Tauri = 'TAURI',
  Taviraj = 'TAVIRAJ',
  Teachers = 'TEACHERS',
  Teko = 'TEKO',
  Tektur = 'TEKTUR',
  Telex = 'TELEX',
  TenaliRamakrishna = 'TENALI_RAMAKRISHNA',
  TenorSans = 'TENOR_SANS',
  Texturina = 'TEXTURINA',
  TextMeOne = 'TEXT_ME_ONE',
  Thasadith = 'THASADITH',
  TheGirlNextDoor = 'THE_GIRL_NEXT_DOOR',
  TheNautigal = 'THE_NAUTIGAL',
  Tienne = 'TIENNE',
  TiktokSans = 'TIKTOK_SANS',
  Tillana = 'TILLANA',
  TiltNeon = 'TILT_NEON',
  TiltPrism = 'TILT_PRISM',
  TiltWarp = 'TILT_WARP',
  Timmana = 'TIMMANA',
  Tinos = 'TINOS',
  Tiny5 = 'TINY5',
  TiroBangla = 'TIRO_BANGLA',
  TiroDevanagariHindi = 'TIRO_DEVANAGARI_HINDI',
  TiroDevanagariMarathi = 'TIRO_DEVANAGARI_MARATHI',
  TiroDevanagariSanskrit = 'TIRO_DEVANAGARI_SANSKRIT',
  TiroGurmukhi = 'TIRO_GURMUKHI',
  TiroKannada = 'TIRO_KANNADA',
  TiroTamil = 'TIRO_TAMIL',
  TiroTelugu = 'TIRO_TELUGU',
  Tirra = 'TIRRA',
  TitanOne = 'TITAN_ONE',
  TitilliumWeb = 'TITILLIUM_WEB',
  Tomorrow = 'TOMORROW',
  Tourney = 'TOURNEY',
  TradeWinds = 'TRADE_WINDS',
  TrainOne = 'TRAIN_ONE',
  Triodion = 'TRIODION',
  Trirong = 'TRIRONG',
  Trispace = 'TRISPACE',
  Trocchi = 'TROCCHI',
  Trochut = 'TROCHUT',
  Truculenta = 'TRUCULENTA',
  Trykker = 'TRYKKER',
  TsukimiRounded = 'TSUKIMI_ROUNDED',
  Tuffy = 'TUFFY',
  TulpenOne = 'TULPEN_ONE',
  TurretRoad = 'TURRET_ROAD',
  TwinkleStar = 'TWINKLE_STAR',
  Ubuntu = 'UBUNTU',
  UbuntuCondensed = 'UBUNTU_CONDENSED',
  UbuntuMono = 'UBUNTU_MONO',
  UbuntuSans = 'UBUNTU_SANS',
  UbuntuSansMono = 'UBUNTU_SANS_MONO',
  Uchen = 'UCHEN',
  Ultra = 'ULTRA',
  Unbounded = 'UNBOUNDED',
  UncialAntiqua = 'UNCIAL_ANTIQUA',
  Underdog = 'UNDERDOG',
  UnicaOne = 'UNICA_ONE',
  Unifrakturcook = 'UNIFRAKTURCOOK',
  Unifrakturmaguntia = 'UNIFRAKTURMAGUNTIA',
  Unkempt = 'UNKEMPT',
  Unlock = 'UNLOCK',
  Unna = 'UNNA',
  Uoqmunthenkhung = 'UOQMUNTHENKHUNG',
  Updock = 'UPDOCK',
  Urbanist = 'URBANIST',
  VampiroOne = 'VAMPIRO_ONE',
  Varela = 'VARELA',
  VarelaRound = 'VARELA_ROUND',
  Varta = 'VARTA',
  VastShadow = 'VAST_SHADOW',
  Vazirmatn = 'VAZIRMATN',
  VendSans = 'VEND_SANS',
  VesperLibre = 'VESPER_LIBRE',
  ViaodaLibre = 'VIAODA_LIBRE',
  Vibes = 'VIBES',
  Vibur = 'VIBUR',
  VictorMono = 'VICTOR_MONO',
  Vidaloka = 'VIDALOKA',
  Viga = 'VIGA',
  VinaSans = 'VINA_SANS',
  Voces = 'VOCES',
  Volkhov = 'VOLKHOV',
  Vollkorn = 'VOLLKORN',
  VollkornSc = 'VOLLKORN_SC',
  Voltaire = 'VOLTAIRE',
  Vt323 = 'VT323',
  VujahdayScript = 'VUJAHDAY_SCRIPT',
  WaitingForTheSunrise = 'WAITING_FOR_THE_SUNRISE',
  Wallpoet = 'WALLPOET',
  WalterTurncoat = 'WALTER_TURNCOAT',
  Warnes = 'WARNES',
  Waterfall = 'WATERFALL',
  WaterBrush = 'WATER_BRUSH',
  Wavefont = 'WAVEFONT',
  WdxlLubrifontJpN = 'WDXL_LUBRIFONT_JP_N',
  WdxlLubrifontSc = 'WDXL_LUBRIFONT_SC',
  WdxlLubrifontTc = 'WDXL_LUBRIFONT_TC',
  Wellfleet = 'WELLFLEET',
  WendyOne = 'WENDY_ONE',
  Whisper = 'WHISPER',
  Windsong = 'WINDSONG',
  WinkyRough = 'WINKY_ROUGH',
  WinkySans = 'WINKY_SANS',
  WireOne = 'WIRE_ONE',
  Wittgenstein = 'WITTGENSTEIN',
  WixMadeforDisplay = 'WIX_MADEFOR_DISPLAY',
  WixMadeforText = 'WIX_MADEFOR_TEXT',
  Workbench = 'WORKBENCH',
  WorkSans = 'WORK_SANS',
  XanhMono = 'XANH_MONO',
  Yaldevi = 'YALDEVI',
  YanoneKaffeesatz = 'YANONE_KAFFEESATZ',
  Yantramanav = 'YANTRAMANAV',
  Yarndings_12 = 'YARNDINGS_12',
  Yarndings_12Charted = 'YARNDINGS_12_CHARTED',
  Yarndings_20 = 'YARNDINGS_20',
  Yarndings_20Charted = 'YARNDINGS_20_CHARTED',
  YatraOne = 'YATRA_ONE',
  Yellowtail = 'YELLOWTAIL',
  YeonSung = 'YEON_SUNG',
  YesevaOne = 'YESEVA_ONE',
  Yesteryear = 'YESTERYEAR',
  Yomogi = 'YOMOGI',
  YoungSerif = 'YOUNG_SERIF',
  Yrsa = 'YRSA',
  Ysabeau = 'YSABEAU',
  YsabeauInfant = 'YSABEAU_INFANT',
  YsabeauOffice = 'YSABEAU_OFFICE',
  YsabeauSc = 'YSABEAU_SC',
  YujiBoku = 'YUJI_BOKU',
  YujiHentaiganaAkari = 'YUJI_HENTAIGANA_AKARI',
  YujiHentaiganaAkebono = 'YUJI_HENTAIGANA_AKEBONO',
  YujiMai = 'YUJI_MAI',
  YujiSyuku = 'YUJI_SYUKU',
  YuseiMagic = 'YUSEI_MAGIC',
  Zain = 'ZAIN',
  ZalandoSans = 'ZALANDO_SANS',
  ZalandoSansExpanded = 'ZALANDO_SANS_EXPANDED',
  ZalandoSansSemiexpanded = 'ZALANDO_SANS_SEMIEXPANDED',
  ZcoolKuaile = 'ZCOOL_KUAILE',
  ZcoolQingkeHuangyou = 'ZCOOL_QINGKE_HUANGYOU',
  ZcoolXiaowei = 'ZCOOL_XIAOWEI',
  ZenAntique = 'ZEN_ANTIQUE',
  ZenAntiqueSoft = 'ZEN_ANTIQUE_SOFT',
  ZenDots = 'ZEN_DOTS',
  ZenKakuGothicAntique = 'ZEN_KAKU_GOTHIC_ANTIQUE',
  ZenKakuGothicNew = 'ZEN_KAKU_GOTHIC_NEW',
  ZenKurenaido = 'ZEN_KURENAIDO',
  ZenLoop = 'ZEN_LOOP',
  ZenMaruGothic = 'ZEN_MARU_GOTHIC',
  ZenOldMincho = 'ZEN_OLD_MINCHO',
  ZenTokyoZoo = 'ZEN_TOKYO_ZOO',
  Zeyada = 'ZEYADA',
  ZhiMangXing = 'ZHI_MANG_XING',
  ZillaSlab = 'ZILLA_SLAB',
  ZillaSlabHighlight = 'ZILLA_SLAB_HIGHLIGHT'
}

export type FontFamilyUpdateInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  locale: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type FontReference = FontReferenceGoogle | FontReferenceSelfHosted;

export type FontReferenceGoogle = {
  __typename?: 'FontReferenceGoogle';
  family?: Maybe<FontFamilyName>;
  type?: Maybe<FontSource>;
  variant?: Maybe<Scalars['String']['output']>;
};

export type FontReferenceGoogleInput = {
  family: FontFamilyName;
  variant: Scalars['String']['input'];
};

export type FontReferenceInput =
  { google: FontReferenceGoogleInput; selfHosted?: never; }
  |  { google?: never; selfHosted: FontReferenceSelfHostedInput; };

export type FontReferenceSelfHosted = {
  __typename?: 'FontReferenceSelfHosted';
  fontVariantId?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<FontSource>;
};

export type FontReferenceSelfHostedInput = {
  fontVariantId: Scalars['Int']['input'];
};

export enum FontSource {
  Google = 'GOOGLE',
  SelfHosted = 'SELF_HOSTED'
}

export type FontVariant = {
  __typename?: 'FontVariant';
  createdAt: Scalars['DateTime']['output'];
  familyId: Scalars['Int']['output'];
  file?: Maybe<FileInfo>;
  id: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
  variant: Scalars['String']['output'];
};

export type FontVariantCreateInput = {
  familyId: Scalars['Int']['input'];
  storageFilePath: Scalars['String']['input'];
  variant: Scalars['String']['input'];
};

export type FontVariantFilterArgs = {
  createdAtFrom?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtTo?: InputMaybe<Scalars['DateTime']['input']>;
  familyId?: InputMaybe<Scalars['Int']['input']>;
  variant?: InputMaybe<Scalars['String']['input']>;
  variantContains?: InputMaybe<Scalars['String']['input']>;
};

export type FontVariantUpdateInput = {
  id: Scalars['Int']['input'];
  storageFilePath: Scalars['String']['input'];
  variant: Scalars['String']['input'];
};

export type FontVariantUsageCheckResult = {
  __typename?: 'FontVariantUsageCheckResult';
  canDelete: Scalars['Boolean']['output'];
  deleteBlockReason?: Maybe<Scalars['String']['output']>;
  isInUse: Scalars['Boolean']['output'];
  usageCount: Scalars['Int']['output'];
  usedBy: Array<FontVariantUsageReference>;
};

export type FontVariantUsageReference = {
  __typename?: 'FontVariantUsageReference';
  elementId: Scalars['Int']['output'];
  elementType: Scalars['String']['output'];
  templateId?: Maybe<Scalars['Int']['output']>;
  templateName?: Maybe<Scalars['String']['output']>;
};

export type FontVariantsOrderByClause = {
  column: FontVariantsOrderByColumn;
  order?: InputMaybe<OrderSortDirection>;
};

export enum FontVariantsOrderByColumn {
  CreatedAt = 'CREATED_AT',
  Id = 'ID',
  UpdatedAt = 'UPDATED_AT',
  Variant = 'VARIANT'
}

export type FontVariantsWithFiltersResponse = {
  __typename?: 'FontVariantsWithFiltersResponse';
  data: Array<FontVariant>;
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

export type ImageDataSourceStandaloneUpdateInput = {
  dataSource: ImageDataSourceInput;
  elementId: Scalars['Int']['input'];
};

export type ImageDataSourceStandaloneUpdateResponse = {
  __typename?: 'ImageDataSourceStandaloneUpdateResponse';
  elementId?: Maybe<Scalars['Int']['output']>;
  imageDataSource?: Maybe<ImageDataSource>;
};

export type ImageDataSourceStorageFile = {
  __typename?: 'ImageDataSourceStorageFile';
  imageUrl?: Maybe<Scalars['String']['output']>;
  storageFilePath?: Maybe<Scalars['String']['output']>;
  type?: Maybe<ImageDataSourceType>;
};

export type ImageDataSourceStorageFileInput = {
  path: Scalars['String']['input'];
  url: Scalars['String']['input'];
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

export type IncreaseElementOrderInput = {
  elementId: Scalars['Int']['input'];
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
  createFontFamily: FontFamily;
  createFontVariant: FontVariant;
  createFontWithFamily: FontVariant;
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
  decreaseElementOrder?: Maybe<Array<UpdateElementBaseResponse>>;
  deleteElement?: Maybe<Scalars['Boolean']['output']>;
  deleteElements?: Maybe<Scalars['Boolean']['output']>;
  deleteFile?: Maybe<FileOperationResult>;
  deleteFontFamily: FontFamily;
  deleteFontVariant: FontVariant;
  deleteRecipient: TemplateRecipient;
  deleteRecipients: Array<TemplateRecipient>;
  deleteStorageItems?: Maybe<BulkOperationResult>;
  deleteStudent?: Maybe<Student>;
  deleteTemplate?: Maybe<Template>;
  deleteTemplateCategory: TemplateCategory;
  deleteTemplateRecipientGroup?: Maybe<TemplateRecipientGroup>;
  deleteTemplateVariable?: Maybe<TemplateVariable>;
  increaseElementOrder?: Maybe<Array<UpdateElementBaseResponse>>;
  login?: Maybe<LoginResponse>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  moveElement?: Maybe<Array<UpdateElementBaseResponse>>;
  moveStorageItems?: Maybe<BulkOperationResult>;
  partiallyUpdateStudent?: Maybe<Student>;
  prepareUpload?: Maybe<UploadPreparation>;
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
  updateElementCommonProperties?: Maybe<UpdateElementBaseResponse>;
  updateElementTextProps?: Maybe<ElementWithTextProps>;
  updateFontFamily: FontFamily;
  updateFontVariant: FontVariant;
  updateGenderElement?: Maybe<GenderElement>;
  updateImageElement?: Maybe<ImageElement>;
  updateImageElementDataSource?: Maybe<ImageDataSourceStandaloneUpdateResponse>;
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


export type MutationCreateFontFamilyArgs = {
  input: FontFamilyCreateInput;
};


export type MutationCreateFontVariantArgs = {
  input: FontVariantCreateInput;
};


export type MutationCreateFontWithFamilyArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  familyName: Scalars['String']['input'];
  locale: Array<Scalars['String']['input']>;
  storageFilePath: Scalars['String']['input'];
  variant: Scalars['String']['input'];
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


export type MutationDecreaseElementOrderArgs = {
  input: DecreaseElementOrderInput;
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


export type MutationDeleteFontFamilyArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteFontVariantArgs = {
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


export type MutationIncreaseElementOrderArgs = {
  input: IncreaseElementOrderInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMoveElementArgs = {
  input: ElementMoveInput;
};


export type MutationMoveStorageItemsArgs = {
  input: StorageItemsMoveInput;
};


export type MutationPartiallyUpdateStudentArgs = {
  input: PartialStudentUpdateInput;
};


export type MutationPrepareUploadArgs = {
  input: UploadPreparationInput;
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


export type MutationUpdateFontFamilyArgs = {
  input: FontFamilyUpdateInput;
};


export type MutationUpdateFontVariantArgs = {
  input: FontVariantUpdateInput;
};


export type MutationUpdateGenderElementArgs = {
  input: GenderElementUpdateInput;
};


export type MutationUpdateImageElementArgs = {
  input: ImageElementUpdateInput;
};


export type MutationUpdateImageElementDataSourceArgs = {
  input: ImageDataSourceStandaloneUpdateInput;
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
  mapping?: InputMaybe<Scalars['StringMap']['input']>;
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
  checkFontVariantUsage: FontVariantUsageCheckResult;
  directoryChildren?: Maybe<Array<DirectoryInfo>>;
  elementsByTemplateId?: Maybe<Array<CertificateElement>>;
  fileInfo?: Maybe<FileInfo>;
  fileUsage?: Maybe<FileUsageResult>;
  folderInfo?: Maybe<DirectoryInfo>;
  fontFamilies: Array<FontFamily>;
  fontFamily?: Maybe<FontFamily>;
  fontVariant?: Maybe<FontVariant>;
  fontVariants: FontVariantsWithFiltersResponse;
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


export type QueryCheckFontVariantUsageArgs = {
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


export type QueryFontFamilyArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFontVariantArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFontVariantsArgs = {
  filterArgs?: InputMaybe<FontVariantFilterArgs>;
  orderBy?: InputMaybe<Array<FontVariantsOrderByClause>>;
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

export type UpdateElementBaseResponse = {
  __typename?: 'UpdateElementBaseResponse';
  base: CertificateElementBase;
};

export type UploadPreparation = {
  __typename?: 'UploadPreparation';
  id: Scalars['String']['output'];
  uploadType: UploadType;
  url: Scalars['String']['output'];
};

export type UploadPreparationInput = {
  contentMd5: Scalars['String']['input'];
  contentType: Scalars['String']['input'];
  fileSize: Scalars['Int']['input'];
  path: Scalars['String']['input'];
};

export enum UploadType {
  SignedUrl = 'SIGNED_URL',
  VercelBlobClient = 'VERCEL_BLOB_CLIENT'
}

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

export type FontFamiliesQueryVariables = Exact<{ [key: string]: never; }>;


export type FontFamiliesQuery = { __typename?: 'Query', fontFamilies: Array<{ __typename?: 'FontFamily', id: number, name: string, category?: string | null, locale: Array<string>, createdAt: any, updatedAt: any, variants: Array<{ __typename?: 'FontVariant', id: number, familyId: number, variant: string, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null }> }> };

export type FontFamilyQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type FontFamilyQuery = { __typename?: 'Query', fontFamily?: { __typename?: 'FontFamily', id: number, name: string, category?: string | null, locale: Array<string>, createdAt: any, updatedAt: any, variants: Array<{ __typename?: 'FontVariant', id: number, familyId: number, variant: string, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null }> } | null };

export type FontVariantsQueryVariables = Exact<{
  filterArgs?: InputMaybe<FontVariantFilterArgs>;
}>;


export type FontVariantsQuery = { __typename?: 'Query', fontVariants: { __typename?: 'FontVariantsWithFiltersResponse', data: Array<{ __typename?: 'FontVariant', id: number, familyId: number, variant: string, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null }>, pageInfo: { __typename?: 'PageInfo', total: number, perPage: number, currentPage: number, lastPage: number, hasMorePages: boolean } } };

export type CheckFontVariantUsageQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type CheckFontVariantUsageQuery = { __typename?: 'Query', checkFontVariantUsage: { __typename?: 'FontVariantUsageCheckResult', isInUse: boolean, usageCount: number, canDelete: boolean, deleteBlockReason?: string | null, usedBy: Array<{ __typename?: 'FontVariantUsageReference', elementId: number, elementType: string, templateId?: number | null, templateName?: string | null }> } };

export type CreateFontFamilyMutationVariables = Exact<{
  input: FontFamilyCreateInput;
}>;


export type CreateFontFamilyMutation = { __typename?: 'Mutation', createFontFamily: { __typename?: 'FontFamily', id: number, name: string, category?: string | null, locale: Array<string>, createdAt: any, updatedAt: any } };

export type UpdateFontFamilyMutationVariables = Exact<{
  input: FontFamilyUpdateInput;
}>;


export type UpdateFontFamilyMutation = { __typename?: 'Mutation', updateFontFamily: { __typename?: 'FontFamily', id: number, name: string, category?: string | null, locale: Array<string>, createdAt: any, updatedAt: any } };

export type DeleteFontFamilyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteFontFamilyMutation = { __typename?: 'Mutation', deleteFontFamily: { __typename?: 'FontFamily', id: number, name: string, category?: string | null, locale: Array<string>, createdAt: any, updatedAt: any } };

export type CreateFontVariantMutationVariables = Exact<{
  input: FontVariantCreateInput;
}>;


export type CreateFontVariantMutation = { __typename?: 'Mutation', createFontVariant: { __typename?: 'FontVariant', id: number, familyId: number, variant: string, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null } };

export type UpdateFontVariantMutationVariables = Exact<{
  input: FontVariantUpdateInput;
}>;


export type UpdateFontVariantMutation = { __typename?: 'Mutation', updateFontVariant: { __typename?: 'FontVariant', id: number, familyId: number, variant: string, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null } };

export type DeleteFontVariantMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteFontVariantMutation = { __typename?: 'Mutation', deleteFontVariant: { __typename?: 'FontVariant', id: number, familyId: number, variant: string, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null } };

export type CreateFontWithFamilyMutationVariables = Exact<{
  familyName: Scalars['String']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  locale: Array<Scalars['String']['input']> | Scalars['String']['input'];
  variant: Scalars['String']['input'];
  storageFilePath: Scalars['String']['input'];
}>;


export type CreateFontWithFamilyMutation = { __typename?: 'Mutation', createFontWithFamily: { __typename?: 'FontVariant', id: number, familyId: number, variant: string, url?: string | null, createdAt: any, updatedAt: any, file?: { __typename?: 'FileInfo', path: string, url: string, name?: string | null, size: number } | null } };

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

export type PrepareUploadMutationVariables = Exact<{
  input: UploadPreparationInput;
}>;


export type PrepareUploadMutation = { __typename?: 'Mutation', prepareUpload?: { __typename?: 'UploadPreparation', id: string, url: string, uploadType: UploadType } | null };

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


export type CreateCountryElementMutation = { __typename?: 'Mutation', createCountryElement?: { __typename?: 'CountryElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, countryProps?: { __typename?: 'CountryElementCountryProps', representation?: CountryRepresentation | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateCountryElementMutationVariables = Exact<{
  input: CountryElementUpdateInput;
}>;


export type UpdateCountryElementMutation = { __typename?: 'Mutation', updateCountryElement?: { __typename?: 'CountryElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, countryProps?: { __typename?: 'CountryElementCountryProps', representation?: CountryRepresentation | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateCountryElementSpecPropsMutationVariables = Exact<{
  input: CountryElementSpecPropsStandaloneUpdateInput;
}>;


export type UpdateCountryElementSpecPropsMutation = { __typename?: 'Mutation', updateCountryElementSpecProps?: { __typename?: 'CountryElementSpecPropsStandaloneUpdateResponse', elementId?: number | null, countryProps?: { __typename?: 'CountryElementCountryProps', representation?: CountryRepresentation | null } | null } | null };

export type CreateDateElementMutationVariables = Exact<{
  input: DateElementInput;
}>;


export type CreateDateElementMutation = { __typename?: 'Mutation', createDateElement?: { __typename?: 'DateElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, dateDataSource?:
      | { __typename?: 'DateDataSourceCertificateField', certificateField?: CertificateDateField | null, type?: DateDataSourceType | null }
      | { __typename?: 'DateDataSourceStatic', type?: DateDataSourceType | null, value?: string | null }
      | { __typename?: 'DateDataSourceStudentField', studentField?: StudentDateField | null, type?: DateDataSourceType | null }
      | { __typename?: 'DateDataSourceTemplateVariable', dateVariableId?: number | null, type?: DateDataSourceType | null }
     | null, dateProps?: { __typename?: 'DateProps', calendarType?: CalendarType | null, format?: string | null, offsetDays?: number | null, transformation?: DateTransformationType | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateDateElementMutationVariables = Exact<{
  input: DateElementUpdateInput;
}>;


export type UpdateDateElementMutation = { __typename?: 'Mutation', updateDateElement?: { __typename?: 'DateElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, dateDataSource?:
      | { __typename?: 'DateDataSourceCertificateField', certificateField?: CertificateDateField | null, type?: DateDataSourceType | null }
      | { __typename?: 'DateDataSourceStatic', type?: DateDataSourceType | null, value?: string | null }
      | { __typename?: 'DateDataSourceStudentField', studentField?: StudentDateField | null, type?: DateDataSourceType | null }
      | { __typename?: 'DateDataSourceTemplateVariable', dateVariableId?: number | null, type?: DateDataSourceType | null }
     | null, dateProps?: { __typename?: 'DateProps', calendarType?: CalendarType | null, format?: string | null, offsetDays?: number | null, transformation?: DateTransformationType | null } | null, template?: { __typename?: 'Template', id: number } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
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
          | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
          | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
         }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'DateElement', dateDataSource?:
        | { __typename?: 'DateDataSourceCertificateField', certificateField?: CertificateDateField | null, type?: DateDataSourceType | null }
        | { __typename?: 'DateDataSourceStatic', type?: DateDataSourceType | null, value?: string | null }
        | { __typename?: 'DateDataSourceStudentField', studentField?: StudentDateField | null, type?: DateDataSourceType | null }
        | { __typename?: 'DateDataSourceTemplateVariable', dateVariableId?: number | null, type?: DateDataSourceType | null }
       | null, dateProps?: { __typename?: 'DateProps', calendarType?: CalendarType | null, format?: string | null, offsetDays?: number | null, transformation?: DateTransformationType | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
          | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
          | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
         }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'GenderElement', textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
          | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
          | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
         }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'ImageElement', imageDataSource?: { __typename?: 'ImageDataSourceStorageFile', storageFilePath?: string | null, type?: ImageDataSourceType | null, imageUrl?: string | null } | null, imageProps?: { __typename?: 'ImageElementSpecProps', elementId?: number | null, fit?: ElementImageFit | null } | null, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'NumberElement', numberDataSource?: { __typename?: 'NumberDataSource', numberVariableId?: number | null, type?: NumberDataSourceType | null } | null, numberProps?: { __typename?: 'NumberProps', elementId?: number | null, mapping?: any | null, textPropsId?: number | null, variableId?: number | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
          | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
          | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
         }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'QRCodeElement', qrCodeProps: { __typename?: 'QRCodeElementSpecProps', backgroundColor?: string | null, elementId?: number | null, errorCorrection?: QrCodeErrorCorrection | null, foregroundColor?: string | null }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
    | { __typename?: 'TextElement', textDataSource:
        | { __typename?: 'TextDataSourceCertificateField', certificateField?: CertificateTextField | null, type?: TextDataSourceType | null }
        | { __typename?: 'TextDataSourceStatic', type?: TextDataSourceType | null, value?: string | null }
        | { __typename?: 'TextDataSourceStudentField', studentField?: StudentTextField | null, type?: TextDataSourceType | null }
        | { __typename?: 'TextDataSourceTemplateSelectVariable', selectVariableId?: number | null, type?: TextDataSourceType | null }
        | { __typename?: 'TextDataSourceTemplateTextVariable', textVariableId?: number | null, type?: TextDataSourceType | null }
      , textElementSpecProps: { __typename?: 'TextElementSpecProps', elementId: number, textPropsId: number, variableId?: number | null }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
          | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
          | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
         }, base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } }
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


export type UpdateElementCommonPropertiesMutation = { __typename?: 'Mutation', updateElementCommonProperties?: { __typename?: 'UpdateElementBaseResponse', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null } } | null };

export type UpdateElementTextPropsMutationVariables = Exact<{
  input: TextPropsUpdateInput;
}>;


export type UpdateElementTextPropsMutation = { __typename?: 'Mutation', updateElementTextProps?: { __typename?: 'ElementWithTextProps', textProps: { __typename?: 'TextProps', id: number, color: string, fontSize: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
       } } | null };

export type MoveElementMutationVariables = Exact<{
  input: ElementMoveInput;
}>;


export type MoveElementMutation = { __typename?: 'Mutation', moveElement?: Array<{ __typename?: 'UpdateElementBaseResponse', base: { __typename?: 'CertificateElementBase', alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, hidden?: boolean | null, id: number, name: string, positionX: number, positionY: number, zIndex: number, templateId: number, type: ElementType, updatedAt: any, width: number } }> | null };

export type IncreaseElementOrderMutationVariables = Exact<{
  input: IncreaseElementOrderInput;
}>;


export type IncreaseElementOrderMutation = { __typename?: 'Mutation', increaseElementOrder?: Array<{ __typename?: 'UpdateElementBaseResponse', base: { __typename?: 'CertificateElementBase', alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, hidden?: boolean | null, id: number, name: string, positionX: number, positionY: number, zIndex: number, templateId: number, type: ElementType, updatedAt: any, width: number } }> | null };

export type DecreaseElementOrderMutationVariables = Exact<{
  input: DecreaseElementOrderInput;
}>;


export type DecreaseElementOrderMutation = { __typename?: 'Mutation', decreaseElementOrder?: Array<{ __typename?: 'UpdateElementBaseResponse', base: { __typename?: 'CertificateElementBase', alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, hidden?: boolean | null, id: number, name: string, positionX: number, positionY: number, zIndex: number, templateId: number, type: ElementType, updatedAt: any, width: number } }> | null };

export type CreateGenderElementMutationVariables = Exact<{
  input: GenderElementInput;
}>;


export type CreateGenderElementMutation = { __typename?: 'Mutation', createGenderElement?: { __typename?: 'GenderElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateGenderElementMutationVariables = Exact<{
  input: GenderElementUpdateInput;
}>;


export type UpdateGenderElementMutation = { __typename?: 'Mutation', updateGenderElement?: { __typename?: 'GenderElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
       } } | null };

export type CreateImageElementMutationVariables = Exact<{
  input: ImageElementInput;
}>;


export type CreateImageElementMutation = { __typename?: 'Mutation', createImageElement?: { __typename?: 'ImageElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, imageDataSource?: { __typename?: 'ImageDataSourceStorageFile', storageFilePath?: string | null, type?: ImageDataSourceType | null, imageUrl?: string | null } | null, imageProps?: { __typename?: 'ImageElementSpecProps', elementId?: number | null, fit?: ElementImageFit | null } | null } | null };

export type UpdateImageElementMutationVariables = Exact<{
  input: ImageElementUpdateInput;
}>;


export type UpdateImageElementMutation = { __typename?: 'Mutation', updateImageElement?: { __typename?: 'ImageElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, imageDataSource?: { __typename?: 'ImageDataSourceStorageFile', storageFilePath?: string | null, type?: ImageDataSourceType | null, imageUrl?: string | null } | null, imageProps?: { __typename?: 'ImageElementSpecProps', elementId?: number | null, fit?: ElementImageFit | null } | null } | null };

export type UpdateImageElementSpecPropsMutationVariables = Exact<{
  input: ImageElementSpecPropsStandaloneUpdateInput;
}>;


export type UpdateImageElementSpecPropsMutation = { __typename?: 'Mutation', updateImageElementSpecProps?: { __typename?: 'ImageElementSpecPropsStandaloneUpdateResponse', elementId?: number | null, imageProps?: { __typename?: 'ImageElementSpecProps', elementId?: number | null, fit?: ElementImageFit | null } | null } | null };

export type UpdateImageElementDataSourceMutationVariables = Exact<{
  input: ImageDataSourceStandaloneUpdateInput;
}>;


export type UpdateImageElementDataSourceMutation = { __typename?: 'Mutation', updateImageElementDataSource?: { __typename?: 'ImageDataSourceStandaloneUpdateResponse', elementId?: number | null, imageDataSource?: { __typename?: 'ImageDataSourceStorageFile', storageFilePath?: string | null, type?: ImageDataSourceType | null, imageUrl?: string | null } | null } | null };

export type CreateNumberElementMutationVariables = Exact<{
  input: NumberElementInput;
}>;


export type CreateNumberElementMutation = { __typename?: 'Mutation', createNumberElement?: { __typename?: 'NumberElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, numberProps?: { __typename?: 'NumberProps', elementId?: number | null, mapping?: any | null, textPropsId?: number | null, variableId?: number | null } | null, numberDataSource?: { __typename?: 'NumberDataSource', numberVariableId?: number | null, type?: NumberDataSourceType | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateNumberElementMutationVariables = Exact<{
  input: NumberElementUpdateInput;
}>;


export type UpdateNumberElementMutation = { __typename?: 'Mutation', updateNumberElement?: { __typename?: 'NumberElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, numberDataSource?: { __typename?: 'NumberDataSource', numberVariableId?: number | null, type?: NumberDataSourceType | null } | null, numberProps?: { __typename?: 'NumberProps', elementId?: number | null, mapping?: any | null, textPropsId?: number | null, variableId?: number | null } | null, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
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


export type CreateQrCodeElementMutation = { __typename?: 'Mutation', createQRCodeElement?: { __typename?: 'QRCodeElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, qrCodeProps: { __typename?: 'QRCodeElementSpecProps', backgroundColor?: string | null, elementId?: number | null, errorCorrection?: QrCodeErrorCorrection | null, foregroundColor?: string | null } } | null };

export type UpdateQrCodeElementMutationVariables = Exact<{
  input: QrCodeElementUpdateInput;
}>;


export type UpdateQrCodeElementMutation = { __typename?: 'Mutation', updateQRCodeElement?: { __typename?: 'QRCodeElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, qrCodeProps: { __typename?: 'QRCodeElementSpecProps', backgroundColor?: string | null, elementId?: number | null, errorCorrection?: QrCodeErrorCorrection | null, foregroundColor?: string | null } } | null };

export type UpdateQrCodeElementSpecPropsMutationVariables = Exact<{
  input: QrCodeElementSpecPropsStandaloneUpdateInput;
}>;


export type UpdateQrCodeElementSpecPropsMutation = { __typename?: 'Mutation', updateQRCodeElementSpecProps?: { __typename?: 'QRCodeElementSpecPropsStandaloneUpdateResponse', elementId?: number | null, qrCodeProps?: { __typename?: 'QRCodeElementSpecProps', backgroundColor?: string | null, elementId?: number | null, errorCorrection?: QrCodeErrorCorrection | null, foregroundColor?: string | null } | null } | null };

export type TextElementByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type TextElementByIdQuery = { __typename?: 'Query', textElementById?: { __typename?: 'TextElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, textDataSource:
      | { __typename?: 'TextDataSourceCertificateField', certificateField?: CertificateTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceStatic', type?: TextDataSourceType | null, value?: string | null }
      | { __typename?: 'TextDataSourceStudentField', studentField?: StudentTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateSelectVariable', selectVariableId?: number | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateTextVariable', textVariableId?: number | null, type?: TextDataSourceType | null }
    , textElementSpecProps: { __typename?: 'TextElementSpecProps', elementId: number, textPropsId: number, variableId?: number | null }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
       } } | null };

export type CreateTextElementMutationVariables = Exact<{
  input: TextElementInput;
}>;


export type CreateTextElementMutation = { __typename?: 'Mutation', createTextElement?: { __typename?: 'TextElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, textDataSource:
      | { __typename?: 'TextDataSourceCertificateField', certificateField?: CertificateTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceStatic', type?: TextDataSourceType | null, value?: string | null }
      | { __typename?: 'TextDataSourceStudentField', studentField?: StudentTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateSelectVariable', selectVariableId?: number | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateTextVariable', textVariableId?: number | null, type?: TextDataSourceType | null }
    , textElementSpecProps: { __typename?: 'TextElementSpecProps', elementId: number, textPropsId: number, variableId?: number | null }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
       } } | null };

export type UpdateTextElementMutationVariables = Exact<{
  input: TextElementUpdateInput;
}>;


export type UpdateTextElementMutation = { __typename?: 'Mutation', updateTextElement?: { __typename?: 'TextElement', base: { __typename?: 'CertificateElementBase', id: number, templateId: number, alignment: ElementAlignment, createdAt: any, description?: string | null, height: number, name: string, positionX: number, positionY: number, zIndex: number, type: ElementType, updatedAt: any, width: number, hidden?: boolean | null }, textDataSource:
      | { __typename?: 'TextDataSourceCertificateField', certificateField?: CertificateTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceStatic', type?: TextDataSourceType | null, value?: string | null }
      | { __typename?: 'TextDataSourceStudentField', studentField?: StudentTextField | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateSelectVariable', selectVariableId?: number | null, type?: TextDataSourceType | null }
      | { __typename?: 'TextDataSourceTemplateTextVariable', textVariableId?: number | null, type?: TextDataSourceType | null }
    , textElementSpecProps: { __typename?: 'TextElementSpecProps', elementId: number, textPropsId: number, variableId?: number | null }, textProps: { __typename?: 'TextProps', color: string, fontSize: number, id: number, overflow: ElementOverflow, fontRef:
        | { __typename?: 'FontReferenceGoogle', family?: FontFamilyName | null, type?: FontSource | null, variant?: string | null }
        | { __typename?: 'FontReferenceSelfHosted', fontVariantId?: number | null, type?: FontSource | null }
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
export const FontFamiliesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fontFamilies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontFamilies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"familyId"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FontFamiliesQuery, FontFamiliesQueryVariables>;
export const FontFamilyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fontFamily"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontFamily"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"familyId"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FontFamilyQuery, FontFamilyQueryVariables>;
export const FontVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fontVariants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FontVariantFilterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filterArgs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"familyId"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}}]}}]}}]}}]} as unknown as DocumentNode<FontVariantsQuery, FontVariantsQueryVariables>;
export const CheckFontVariantUsageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkFontVariantUsage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkFontVariantUsage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isInUse"}},{"kind":"Field","name":{"kind":"Name","value":"usageCount"}},{"kind":"Field","name":{"kind":"Name","value":"usedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"elementType"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"templateName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"deleteBlockReason"}}]}}]}}]} as unknown as DocumentNode<CheckFontVariantUsageQuery, CheckFontVariantUsageQueryVariables>;
export const CreateFontFamilyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createFontFamily"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FontFamilyCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFontFamily"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateFontFamilyMutation, CreateFontFamilyMutationVariables>;
export const UpdateFontFamilyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateFontFamily"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FontFamilyUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFontFamily"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateFontFamilyMutation, UpdateFontFamilyMutationVariables>;
export const DeleteFontFamilyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteFontFamily"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFontFamily"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<DeleteFontFamilyMutation, DeleteFontFamilyMutationVariables>;
export const CreateFontVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createFontVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FontVariantCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFontVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"familyId"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateFontVariantMutation, CreateFontVariantMutationVariables>;
export const UpdateFontVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateFontVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FontVariantUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFontVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"familyId"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateFontVariantMutation, UpdateFontVariantMutationVariables>;
export const DeleteFontVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteFontVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFontVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"familyId"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<DeleteFontVariantMutation, DeleteFontVariantMutationVariables>;
export const CreateFontWithFamilyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createFontWithFamily"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"familyName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variant"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storageFilePath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFontWithFamily"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"familyName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"familyName"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"variant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variant"}}},{"kind":"Argument","name":{"kind":"Name","value":"storageFilePath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storageFilePath"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"familyId"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateFontWithFamilyMutation, CreateFontWithFamilyMutationVariables>;
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
export const PrepareUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"prepareUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadPreparationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prepareUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"uploadType"}}]}}]}}]} as unknown as DocumentNode<PrepareUploadMutation, PrepareUploadMutationVariables>;
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
export const CreateCountryElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCountryElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCountryElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countryProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"representation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCountryElementMutation, CreateCountryElementMutationVariables>;
export const UpdateCountryElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCountryElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCountryElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countryProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"representation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCountryElementMutation, UpdateCountryElementMutationVariables>;
export const UpdateCountryElementSpecPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCountryElementSpecProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryElementSpecPropsStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCountryElementSpecProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countryProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"representation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}}]}}]}}]} as unknown as DocumentNode<UpdateCountryElementSpecPropsMutation, UpdateCountryElementSpecPropsMutationVariables>;
export const CreateDateElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createDateElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDateElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceTemplateVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarType"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"offsetDays"}},{"kind":"Field","name":{"kind":"Name","value":"transformation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<CreateDateElementMutation, CreateDateElementMutationVariables>;
export const UpdateDateElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDateElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDateElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceTemplateVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarType"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"offsetDays"}},{"kind":"Field","name":{"kind":"Name","value":"transformation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"template"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateDateElementMutation, UpdateDateElementMutationVariables>;
export const UpdateDateElementDataSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDateElementDataSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStandaloneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDateElementDataSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"dateDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceTemplateVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateDateElementDataSourceMutation, UpdateDateElementDataSourceMutationVariables>;
export const UpdateDateElementSpecPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDateElementSpecProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateElementSpecPropsStandaloneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDateElementSpecProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarType"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"offsetDays"}},{"kind":"Field","name":{"kind":"Name","value":"transformation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}}]}}]}}]} as unknown as DocumentNode<UpdateDateElementSpecPropsMutation, UpdateDateElementSpecPropsMutationVariables>;
export const ElementsByTemplateIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ElementsByTemplateId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementsByTemplateId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"templateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CountryElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countryProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"representation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DateDataSourceTemplateVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarType"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"offsetDays"}},{"kind":"Field","name":{"kind":"Name","value":"transformation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GenderElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageDataSourceStorageFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageFilePath"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"mapping"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QRCodeElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qrCodeProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"errorCorrection"}},{"kind":"Field","name":{"kind":"Name","value":"foregroundColor"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextElement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateSelectVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateTextVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"textElementSpecProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ElementsByTemplateIdQuery, ElementsByTemplateIdQueryVariables>;
export const DeleteElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteElementId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteElementId"}}}]}]}}]} as unknown as DocumentNode<DeleteElementMutation, DeleteElementMutationVariables>;
export const DeleteElementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteElements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteElements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<DeleteElementsMutation, DeleteElementsMutationVariables>;
export const UpdateElementCommonPropertiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateElementCommonProperties"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CertificateElementBaseUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateElementCommonProperties"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateElementCommonPropertiesMutation, UpdateElementCommonPropertiesMutationVariables>;
export const UpdateElementTextPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateElementTextProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropsUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateElementTextProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateElementTextPropsMutation, UpdateElementTextPropsMutationVariables>;
export const MoveElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ElementMoveInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]}}]} as unknown as DocumentNode<MoveElementMutation, MoveElementMutationVariables>;
export const IncreaseElementOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"IncreaseElementOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncreaseElementOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"increaseElementOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]}}]} as unknown as DocumentNode<IncreaseElementOrderMutation, IncreaseElementOrderMutationVariables>;
export const DecreaseElementOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"decreaseElementOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DecreaseElementOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decreaseElementOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]}}]} as unknown as DocumentNode<DecreaseElementOrderMutation, DecreaseElementOrderMutationVariables>;
export const CreateGenderElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createGenderElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GenderElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGenderElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<CreateGenderElementMutation, CreateGenderElementMutationVariables>;
export const UpdateGenderElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateGenderElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GenderElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGenderElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateGenderElementMutation, UpdateGenderElementMutationVariables>;
export const CreateImageElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createImageElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createImageElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageDataSourceStorageFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageFilePath"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}}]}}]}}]}}]} as unknown as DocumentNode<CreateImageElementMutation, CreateImageElementMutationVariables>;
export const UpdateImageElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateImageElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateImageElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageDataSourceStorageFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageFilePath"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateImageElementMutation, UpdateImageElementMutationVariables>;
export const UpdateImageElementSpecPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateImageElementSpecProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageElementSpecPropsStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateImageElementSpecProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"imageProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"fit"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateImageElementSpecPropsMutation, UpdateImageElementSpecPropsMutationVariables>;
export const UpdateImageElementDataSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateImageElementDataSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageDataSourceStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateImageElementDataSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"imageDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageDataSourceStorageFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storageFilePath"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateImageElementDataSourceMutation, UpdateImageElementDataSourceMutationVariables>;
export const CreateNumberElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createNumberElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNumberElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"mapping"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<CreateNumberElementMutation, CreateNumberElementMutationVariables>;
export const UpdateNumberElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNumberElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNumberElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"mapping"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNumberElementMutation, UpdateNumberElementMutationVariables>;
export const UpdateNumberElementDataSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNumberElementDataSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElementDataSourceStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNumberElementDataSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"numberDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numberVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNumberElementDataSourceMutation, UpdateNumberElementDataSourceMutationVariables>;
export const UpdateNumberElementSpecPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNumberElementSpecProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NumberElementSpecPropsStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNumberElementSpecProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"numberProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"mapping"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNumberElementSpecPropsMutation, UpdateNumberElementSpecPropsMutationVariables>;
export const CreateQrCodeElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createQRCodeElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QRCodeElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQRCodeElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qrCodeProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"errorCorrection"}},{"kind":"Field","name":{"kind":"Name","value":"foregroundColor"}}]}}]}}]}}]} as unknown as DocumentNode<CreateQrCodeElementMutation, CreateQrCodeElementMutationVariables>;
export const UpdateQrCodeElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateQRCodeElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QRCodeElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateQRCodeElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qrCodeProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"errorCorrection"}},{"kind":"Field","name":{"kind":"Name","value":"foregroundColor"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateQrCodeElementMutation, UpdateQrCodeElementMutationVariables>;
export const UpdateQrCodeElementSpecPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateQRCodeElementSpecProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QRCodeElementSpecPropsStandaloneUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateQRCodeElementSpecProps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"qrCodeProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"errorCorrection"}},{"kind":"Field","name":{"kind":"Name","value":"foregroundColor"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateQrCodeElementSpecPropsMutation, UpdateQrCodeElementSpecPropsMutationVariables>;
export const TextElementByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"textElementById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textElementById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateSelectVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateTextVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"textElementSpecProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<TextElementByIdQuery, TextElementByIdQueryVariables>;
export const CreateTextElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTextElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TextElementInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTextElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateSelectVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateTextVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"textElementSpecProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTextElementMutation, CreateTextElementMutationVariables>;
export const UpdateTextElementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTextElement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TextElementUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTextElement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"templateId"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textDataSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceCertificateField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"certificateField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStatic"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceStudentField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentField"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateSelectVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextDataSourceTemplateTextVariable"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"textVariableId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"textElementSpecProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"elementId"}},{"kind":"Field","name":{"kind":"Name","value":"textPropsId"}},{"kind":"Field","name":{"kind":"Name","value":"variableId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"textProps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"fontRef"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceGoogle"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"variant"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FontReferenceSelfHosted"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fontVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fontSize"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"overflow"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTextElementMutation, UpdateTextElementMutationVariables>;
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