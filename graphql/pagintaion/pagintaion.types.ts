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
    first?: number;
    skip?: number;
    last?: number;
    page?: number;
    maxCount?: number;
};
