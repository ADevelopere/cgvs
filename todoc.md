create componetn to manage students, 
the componet will work with methods from StudentManagementContext using useStudentManagement, 

the desing is a table desing where table header will have columns for student props (one that are not relations), each column header cell has icons to sort by, and to enable filtering by, the icon to enable filter will open a small menu to set the filter, in if the filter is active the icon color will be changes to know if its active or not, filtering and sorting are based on the StudentQueryParams available options,
there will be column at the end for actions like delete, 
there will be column at first to select students, 

each student row cells will be inputs, on blur or change (if not blurred, it will update the sturent, ), for simplicity implement them all now as text input
student row area will be scollable, and there will be a footer to hold pagination, 
where the header and footer  will have fixed height, and the students row area will use flex grow and is scrollable, 
and the header and rows are scrollable horizontally, but the footer isnt, 
use material mui for that, you can mock a student management context for your preview to be working but i have my own

type StudentManagementContextType = {
    // States
    students: Student[];
    selectedStudents: string[];
    paginatorInfo: PaginatorInfo | null;
    queryParams: StudentQueryParams;

    // Mutations
    createStudent: (
        variables: Graphql.CreateStudentMutationVariables,
    ) => Promise<boolean>;
    updateStudent: (
        variables: Graphql.UpdateStudentMutationVariables,
    ) => Promise<boolean>;
    deleteStudent: (id: string) => Promise<boolean>;

    // Query params methods
    setQueryParams: (params: Partial<StudentQueryParams>) => void;
    toggleStudentSelect: (studentId: string) => void;
};


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

export type CreateStudentMutationVariables = Exact<{
  input: CreateStudentInput;
}>;



export type CreateStudentInput = {
  date_of_birth?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<StudentGender>;
  name: Scalars['String']['input'];
  nationality?: InputMaybe<CountryCode>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
};

    updateStudent: (
        variables: Graphql.UpdateStudentMutationVariables,
    ) => Promise<boolean>;

    export type UpdateStudentMutationVariables = Exact<{
  input: UpdateStudentInput;
}>;

export type UpdateStudentInput = {
  date_of_birth?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<StudentGender>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<CountryCode>;
  phone_number?: InputMaybe<Scalars['String']['input']>;
};

deleteStudent: (id: string) => Promise<boolean>;

// Query params methods
    setQueryParams: (params: Partial<StudentQueryParams>) => void;

    type StudentQueryParams = {
    first?: number;
    page?: number;
    orderBy?: Array<Graphql.OrderByClause>;
};


/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String']['input'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

enum OrderByColumn {
    ID
    NAME
    EMAIL
    DATE_OF_BIRTH
    GENDER
    CREATED_AT
    UPDATED_AT
}