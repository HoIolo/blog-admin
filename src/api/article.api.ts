import { PageParams } from "@/types/common";
import http from "../utils/http";

const PREFIX = "/api/v1";

export type GetArticleType = PageParams & {};
/**
 * 获取文章列表
 * @param params 
 * @returns 
 */
export const getArticle = (params?: GetArticleType) => {
  return http({
    method: "GET",
    params,
    url: `${PREFIX}/articles`,
  });
};

/**
 * 删除文章
 * @param id 
 * @returns 
 */
export const delArticle = (id: number) => {
  return http({
    method: "DELETE",
    url: `${PREFIX}/article/${id}`,
  });
};
