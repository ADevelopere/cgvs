export type PageInfo = {
    count: number;
    currentPage: number;
    firstItem?: number | null;
    hasMorePages: boolean;
    lastItem?: number | null;
    lastPage: number;
    perPage: number;
    total: number;
};

export type PaginationArgs = {
    first?: number | null;
    skip?: number | null;
    last?: number | null;
    page?: number | null;
    maxCount?: number | null;
};
