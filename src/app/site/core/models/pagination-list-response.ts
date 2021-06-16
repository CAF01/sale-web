export interface PaginationListResponse<T> {
    data: T[];
    totalRows: number;
    pageSize: number;
    totalPages: number;
}