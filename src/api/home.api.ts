import { ApiResponse } from "@/types/common";
import http from "../utils/http";
import { HomeData } from "@/types/home";

const PREFIX = "/api/v1";

export const getHomeDetail = () => {
  return http.get<ApiResponse<HomeData>>(PREFIX + "/backstage/home");
};
