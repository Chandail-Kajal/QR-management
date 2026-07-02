export interface ApiResponse<T> {
  message: string;
  error?: string;
  success: boolean;
  data: T;
}

export interface PaginatedDTO<T> {
  items: T;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface GetResourceQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
}
