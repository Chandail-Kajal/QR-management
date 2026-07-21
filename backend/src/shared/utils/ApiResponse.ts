export interface Pagaintation {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

type ValidationError = { field: string; error: string };

export class APIResponse<T> {
  message: string;
  statusCode: number;
  data: T;
  meta?: {
    pagination?: Pagaintation;
    stack?: string;
    errors?: ValidationError[];
  } | null;

  constructor(
    message: string,
    statusCode: number,
    data: any = null,
    meta: typeof this.meta,
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }
}
