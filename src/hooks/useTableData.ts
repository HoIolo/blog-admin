import { CODE } from "@/constant/global";
import { ApiResponse, ResponseData } from "@/types/common";
import { TablePaginationConfig } from "antd";
import { FilterValue } from "antd/es/table/interface";
import { useEffect, useState } from "react";

interface TableDataOptions<T> {
  fetchData: (...args: any) => Promise<{ data: ApiResponse<T> }>;
  dataHandler: (data: T[]) => any[];
  watchData?: any[];
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

/**
 * 使用TableDataOptions参数异步获取表格数据的 Hook
 * @template T 数据类型
 * @param {TableDataOptions<T>} fetchData - 获取数据的函数
 * @param {TableDataOptions<T>} dataHandler - 处理数据的函数
 * @param {TableDataOptions<T>} watchData - 监听的数据
 * @returns {{
 *   tableData: any[] - 表格数据
 *   fetchTableData: Function - 异步获取表格数据的函数
 *   responseData: ResponseData<T> - 响应数据
 *   setResponseData: Function - 设置响应数据的函数
 *   isloading: boolean - 是否正在加载
 * }}
 */
const useTableData = <T>({
  fetchData,
  dataHandler,
  watchData = [],
}: TableDataOptions<T>) => {
  const [tableData, setTableData] = useState<any[]>();
  const [responseData, setResponseData] = useState<ResponseData<T>>();
  const [isloading, setloading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  /**
   * 异步获取表格数据
   * @param {...any[]} args - 参数
   * @returns {Promise<ResponseData<T>>}
   */
  const fetchTableData = async (...args: any[]) => {
    setloading(true);
    try {
      const { data } = await fetchData(args);
      if (data.code === CODE.SUCCESS) {
        setTableData(dataHandler(data.data?.rows || []));
        setResponseData(data.data);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.data?.count || 0,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
    setloading(false);
  };

  useEffect(() => {
    fetchTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, watchData.concat([tableParams.filters, tableParams.sortOrder, tableParams.sortField, tableParams.pagination?.current]));

  return {
    tableData,
    setTableData,
    fetchTableData,
    responseData,
    setResponseData,
    isloading,
    setTableParams,
    tableParams,
  };
};

export default useTableData;
