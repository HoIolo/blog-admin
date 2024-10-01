import { PageParams } from "@/types/common";
import http from "../utils/http";

const PREFIX = "/api/v1";

export type GetArticleTypeType = PageParams & {
  sorted?: 'DESC' | 'ASC';
};

export type AddArticleTypeType = {
    name: string;
}

/**
 * 获取文章分类
 * @param params 
 * @returns 
 */
export const getArticleType = (params?: GetArticleTypeType) => {
  return http({
    method: "GET",
    params,
    url: `${PREFIX}/article/types`,
  });
};

/**
 * 删除文章分类
 * @param id
 * @returns
 * 
 */
export const delArticleType = (id: number) => {
  return http({
    method: "DELETE",
    url: `${PREFIX}/article/type/${id}`,
  });
};

/**
 * 新增文章分类
 * @param data
 * @returns
 * 
 */
export const addArticleType = (data: AddArticleTypeType) => {
  return http({
    method: "POST",
    data,
    url: `${PREFIX}/article/type`,
  });
};
