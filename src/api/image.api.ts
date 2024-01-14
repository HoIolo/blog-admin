import { AxiosProgressEvent } from "axios";
import http from "../utils/http";
import { Image } from "@/types/image";
import { ApiResponse, PageParams, ResponseData } from "@/types/common";

const PERFIX = "/api/v1";

/**
 * 上传图片
 * @param data
 * file 文件, local 是否存在服务器本地 = true or false
 * @returns
 */
export const uploadImage = (
  data: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  return http<ApiResponse<ResponseData<string>>>({
    method: "POST",
    url: PERFIX + "/image",
    data,
    onUploadProgress,
  });
};

/**
 * 上传图片（批量）
 * @param data
 * file 文件, local 是否存在服务器本地 = true or false
 * @returns
 */
export const uploadImages = (
  data: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  return http<ApiResponse<ResponseData<string>>>({
    method: "POST",
    url: PERFIX + "/images",
    data,
    onUploadProgress,
  });
};

export type GetImagesData = PageParams & {
  local?: "true" | "false";
};

/**
 * 获取图片列表
 * @param params
 * @returns
 */
export const getImages = (params?: GetImagesData) => {
  return http<ApiResponse<Image>>({
    method: "GET",
    url: PERFIX + "/images",
    params,
  });
};

export type delImagesData = {
  filename: string;
  local?: "true" | "false";
};

/**
 * 删除图片
 * @param data
 * @returns
 */
export const delImage = (data: delImagesData) => {
  return http<ApiResponse<any>>({
    method: "DELETE",
    url: PERFIX + `/image`,
    data,
  });
};
