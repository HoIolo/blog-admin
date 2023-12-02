import { useRef } from "react";

/**
 * 使用节流函数实现函数的延迟执行
 * @param fn - 需要延迟执行的函数
 * @param delay - 延迟执行的时间
 * @returns  返回一个函数，将需要延迟执行的函数作为参数传入并返回延迟执行的函数
 */
export function useDebounce(fn: Function, delay: number) {
  const refTimer = useRef<any>();

  return function f(...args: any) {
    if (refTimer.current) {
      clearTimeout(refTimer.current);
    }
    refTimer.current = setTimeout(() => {
      fn(args);
    }, delay);
  };
}
