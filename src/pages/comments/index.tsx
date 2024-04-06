import { GetCommentType, delComment, getCommentList } from "@/api/comment.api";
import { CODE } from "@/constant/global";
import { useDebounce } from "@/hooks/useDebounce";
import useTableData from "@/hooks/useTableData";
import { CommentType } from "@/types/comment";
import {
  Button,
  Col,
  Divider,
  Image,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  message,
} from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useState } from "react";

interface DataType {
  content: string;
  key: number;
  publish_date: string;
  user_name: string;
  user_avatar: string;
}

const dataHandler = (data: Array<CommentType>): DataType[] => {
  return data.map((val: CommentType) => {
    return {
      key: val.id,
      content: val.content,
      publish_date: val.createTime,
      user_name: val.user?.profile?.name,
      user_avatar: val.user?.profile?.avatar,
    };
  });
};

const Comments: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [getCommentParams, setCommentParams] = useState<GetCommentType>({
    page: 1,
    offset: 10,
    keyword: "",
    field: "",
  });

  const {
    tableData,
    isloading,
    setTableData,
    fetchTableData,
    setTableParams,
    tableParams,
  } = useTableData<CommentType>({
    fetchData: () => getCommentList(getCommentParams),
    dataHandler: dataHandler,
    watchData: [getCommentParams],
  });

  //   确认删除评论
  const confirmDelete = async (record: DataType) => {
    const { key } = record;
    const { data: result } = await delComment(key);
    if (result.code === CODE.SUCCESS) {
      messageApi.success("删除成功");
      fetchTableData();
    } else {
      messageApi.success("删除失败," + result.msg);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "用户头像",
      dataIndex: "user_avatar",
      key: "user_avatar",
      width: 100,
      render: (url: string) => {
        let picSrc = url;
        let previewSrc = url;
        if (url.includes(process.env.REACT_APP_PIC_DOMAIN + "")) {
          picSrc = url + "!v1/both/60x60";
          previewSrc = url + "!v1";
        }
        return (
          <Image
            src={picSrc}
            preview={{ src: previewSrc }}
            width={60}
            height={60}
          />
        );
      },
    },
    {
      title: "用户昵称",
      dataIndex: "user_name",
      key: "user_name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "评论内容",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
    },
    {
      title: "评论时间",
      dataIndex: "publish_date",
      key: "publish_date",
      width: 200,
      sorter: true,
      render: (date: any) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            title="确认要删除吗？"
            description="请谨慎操作！"
            onConfirm={() => confirmDelete(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button danger type="text">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[]
  ) => {
    console.log(filters, sorter as SorterResult<DataType>);
    const order = (sorter as SorterResult<DataType>).order;
    let sorted: "DESC" | "ASC" = "DESC";
    switch (order) {
      case "ascend":
        sorted = "ASC";
        break;
      case "descend":
        sorted = "DESC";
        break;
      default:
        sorted = "DESC";
    }
    const { type } = filters;

    setCommentParams({
      page: pagination.current,
      offset: pagination.pageSize,
      sorted: sorted as any,
      field: "createTime",
      keyword: type?.join(","),
    });
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setTableData([]);
    }
  };

  const handleSearch = (args: any) => {
    setCommentParams({
      ...getCommentParams,
      keyword: args[0].target.value,
      field: "content",
    });
  };
  const searchDebounce = useDebounce(handleSearch, 500);

  return (
    <>
      {contextHolder}
      <div className="custom_container">
        <Space direction="vertical" style={{ width: "100%" }} size={0}>
          <div className="user_list">
            <div className="user_option bg-white p-4 flex align-middle justify-between">
              <Space.Compact block>
                <Row className="w-full">
                  <Col span={5}>
                    <Input
                      onChange={searchDebounce}
                      placeholder="请输入需要查询的评论内容"
                    ></Input>
                  </Col>
                </Row>
              </Space.Compact>
            </div>
            <Divider style={{ margin: 0 }} />
            <Table
              loading={isloading}
              columns={columns}
              dataSource={tableData}
              onChange={handleTableChange}
              pagination={tableParams.pagination}
            />
          </div>
        </Space>
      </div>
    </>
  );
};

export default Comments;
