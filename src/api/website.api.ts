import { ApiResponse, PageParams } from "@/types/common";
import { WebsiteSetting } from "@/types/website";
import http from "../utils/http";

const PERFIX = "/api/v1";

export type GetWebsiteSettingParams = PageParams & {};

export type AddWebsiteSettingData = {
  logo_text: string;
  typed_text: string;
  footer_text: string;
};

export type UpdateWebsiteSettingData = AddWebsiteSettingData & {
  id: number;
};

/**
 * 获取网站设置
 * @param params
 * @returns
 */
export const getWebsiteSetting = (params?: GetWebsiteSettingParams) => {
  return http<ApiResponse<WebsiteSetting>>({
    url: PERFIX + "/website/setting",
    method: "GET",
    params,
  });
};

/**
 * 新增网站设置
 * @param data
 * @returns
 */
export const addWebsiteSetting = (data: AddWebsiteSettingData) => {
  return http<ApiResponse<any>>({
    url: PERFIX + "/website/setting",
    method: "POST",
    data,
  });
};

/**
 * 更新网站设置
 * @param data
 * @returns
 */
export const updateWebsiteSetting = (data: UpdateWebsiteSettingData) => {
  return http<ApiResponse<any>>({
    url: PERFIX + "/website/setting/" + data.id,
    method: "PATCH",
    data,
  });
};
