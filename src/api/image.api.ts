import { AxiosProgressEvent } from "axios";
import http from "../utils/http";

const PERFIX = "/api/v1";

/**
 * 上传图片
 * @param data
 * @returns
 */
export const uploadImage = (
  data: any,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  return http({
    method: "POST",
    url: PERFIX + "/image",
    data,
    onUploadProgress,
  });
};

/**
 * 上传图片（批量）
 * @param data
 * @returns
 */
export const uploadImages = (
  data: any,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  return http({
    method: "POST",
    url: PERFIX + "/images",
    data,
    onUploadProgress,
  });
};
