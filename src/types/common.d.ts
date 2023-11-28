export type ApiResponse<T> = {
  code: number;
  msg: string;
  data?: ResponseData<T>;
};

export type ResponseData<T> = {
  count?: number;
  row?: T;
  rows?: T[];
};

export type PageParams = {
  page?: number;
  pageSize?: number;
  keyword?: string;
};
