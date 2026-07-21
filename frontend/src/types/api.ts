export interface IPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export type ValidationError = {
  field: string;
  error: string;
};

export interface IApiMetaErrorStack {
  stack: string;
}

export interface IApiMetaPagination {
  pagination: IPagination;
}

export interface IApiMetaValidationErrors {
  errors: ValidationError[];
}

export type IApiResponse<T, M = undefined> = {
  message: string;
  statusCode: number;
  data: T;
} & (M extends undefined ? object : { meta: M });
