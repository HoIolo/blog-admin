import { WhiteListKey } from "@/config/whiteList.config";

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
export const getUserSex = (sex: number): string => {
  switch (sex) {
    case 0:
      return "保密";
    case 1:
      return "男";
    case 2:
      return "女";
    default:
      return "人妖";
  }
};
