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
  offset?: number;
  keyword?: string;
  field?: string;
};

export type BaseType = {
  id: number;
  createTime: string;
  updatedTime: string;
  deleteAt: string;
};
