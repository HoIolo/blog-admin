import { ApiResponse, ResponseData } from "@/types/common";
import http from "../utils/http";

const PERFIX = "/api/v1";

/**
 * 获取当前登陆用户信息
 * @returns
 */
export const getUserInfo = () => {
  return http.get(PERFIX + "/user");
};

/**
 *  用户注册
 * @param data
 * @returns
 */
export const register = (data: any) => {
  return http.post(PERFIX + "/user", data);
};

/**
 * 用户登陆
 * @param data
 * @returns
 */
export const login = (data: any) => {
  return http.post(PERFIX + "/login", data);
};

/**
 * 获取所有用户信息
 * @param data {类型“getUsersData”与类型“AxiosRequestConfig<any>”不具有相同的属性}
 * @returns
 */
export const getUsers = (data?: any) => {
  return http.get<ApiResponse<any>>(PERFIX + "/users", data);
};

type UpdateUserProfileType = {
  id: number;
  name?: string;
  avatar?: string;
  signature?: string;
  sex?: number;
};
/**
 * 按uid更新用户信息
 * @param data
 * @returns
 */
export const updateUserProfile = (data: UpdateUserProfileType) => {
  return http.patch<ApiResponse<any>>(
    PERFIX + "/user/profile/" + data.id,
    data
  );
};

/**
 * 退出登陆
 * @returns
 */
export const logout = () => {
  return localStorage.removeItem("token");
};
