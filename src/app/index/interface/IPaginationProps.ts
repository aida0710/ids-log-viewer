export interface IPaginationProps {
    log_length: number;
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    onPageChange: (newPage: number) => void;
}