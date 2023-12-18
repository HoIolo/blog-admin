import { ApiResponse } from "./../types/common.d";
import { PageParams } from "@/types/common";
import http from "../utils/http";
import { CommentType } from "@/types/comment";

const PREFIX = "/api/v1";

export type GetCommentType = PageParams & {
  sorted?: string;
};

/**
 * 获取评论列表
 * @param params
 * @returns
 */
export const getCommentList = (params: GetCommentType) => {
  return http<ApiResponse<CommentType>>({
    url: `${PREFIX}/comments`,
    method: "get",
    params,
  });
};

/**
 * 删除评论
 * @param id
 * @returns
 */
export const delComment = (id: number) => {
  return http<ApiResponse<any>>({
    url: `${PREFIX}/comment/${id}`,
    method: "delete",
  });
};
