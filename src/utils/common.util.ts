import whiteList, { WhiteListKey } from "@/config/whiteList.config";
import { Location } from "react-router-dom";

/**
 * 确认值是否在白名单
 * @param whiteList
 * @param whiteListKey
 * @param val
 * @returns
 */
export const confirmWhite = (
  whiteList: any,
  whiteListKey: WhiteListKey,
  val: any
) => {
  let currentWhiteList = whiteList[whiteListKey];

  for (let whiteItem of currentWhiteList) {
    if (whiteItem === val) {
      // 在白名单
      return true;
    }
  }
  return false;
};

/**
 * 获取用户性别
 * @param sex
 * @returns
 */
export const getUserSex = (sex: number | string): string | number => {
  switch (sex) {
    case 0:
      return "保密";
    case 1:
      return "男";
    case 2:
      return "女";
    case "保密":
      return 0;
    case "男":
      return 1;
    case "女":
      return 2;
    default:
      return "人妖";
  }
};

/**
 * 判断是否使用布局页面
 * @param location 当前页面路径
 * @param routers 布局页面组件
 * @returns 如果返回值为true，则表示使用布局页面；否则表示不使用布局页面
 */
export const isUseLayout = (
  location: Location,
  routers: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  > | null
) => {
  const currentPath = location.pathname;
  const currentRoutePath = routers?.props.value.matches[0].route.path;

  let flag = currentRoutePath === "*";

  if (flag) return flag;

  for (let item of whiteList.pathWhiteList) {
    if (item === currentPath) {
      flag = true;
      break;
    }
  }
  return flag;
};

/**
 * 格式化字节大小
 * @param bytes - 字节大小
 * @returns 格式化后的字节大小，单位为KB、MB、GB等
 */

export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let index = 0;
  let size = bytes;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
}
type transformParam = {
  url: string;
  options: transformOptions;
};
type transformOptions = {
  width?: number;
  quality?: number;
  height?: number;
  widthAndHeight?: string;
};
/**
 * 又拍云储存服务转化图片url
 * @param url
 * @param options
 * @returns
 */
export const transformUpYunPicUrl = (params: transformParam) => {
  const domain = process.env.REACT_APP_PIC_DOMAIN || "";
  const { url, options } = params;
  function splicingParam(param: string | number | undefined, splice: string) {
    return param ? splice + param : "";
  }
  if (url.includes(domain) && !url.includes("!")) {
    return (
      url +
      `!v1/format/webp${splicingParam(options.width, "/fw/")}${splicingParam(
        options.quality,
        "/quality/"
      )}${splicingParam(options.height, "/fh/")}${splicingParam(
        options.widthAndHeight,
        "/both/"
      )}`
    );
  }
  return url;
};
