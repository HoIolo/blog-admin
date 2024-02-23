import { ApiResponse, PageParams } from "@/types/common";
import http from "../utils/http";
import { TagType } from "@/types/tag";

const PREFIX = "/api/v1";

export type GetTagsType = PageParams & {
  sorted?: "DESC" | "ASC";
};
/**
 * 获取标签列表
 * @param params
 * @returns
 */
export const getTags = (params: GetTagsType) => {
  return http<ApiResponse<TagType>>({
    method: "GET",
    params,
    url: `${PREFIX}/tags`,
  });
};

export type addTagType = { tagName: string };
/**
 * 新增标签
 * @param data
 * @returns
 */
export const addTag = (data: addTagType) => {
  return http<ApiResponse<TagType>>({
    method: "POST",
    data,
    url: `${PREFIX}/tag`,
  });
};

/**
 * 删除标签
 * @param id
 * @returns
 */
export const delTag = (id: number) => {
  return http<ApiResponse<any>>({
    method: "DELETE",
    url: `${PREFIX}/tag/${id}`,
  });
};
