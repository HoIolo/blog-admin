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
  return http.get(PERFIX + "/users", data);
};
