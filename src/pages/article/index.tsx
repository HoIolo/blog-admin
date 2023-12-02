import { GetArticleType, delArticle, getArticle } from "@/api/article.api";
import ArticleDetail from "@/components/Article/articleDetail";
import { CODE } from "@/constant/global";
import { useDebounce } from "@/hooks/useDebounce";
import useTableData from "@/hooks/useTableData";
import { ArticleType } from "@/types/article";
import {
  Button,
  Col,
  Divider,
  Image,
  Input,
  Modal,
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
  pic: string;
  key: number;
  title: string;
  type: string;
  publish_date: string;
}

const dataHandler = (data: Array<ArticleType>): DataType[] => {
  return data.map((val: ArticleType) => {
    return {
      key: val.id,
      pic: val.pic,
      title: val.title,
      type: val.type,
      publish_date: val.publish_date,
    };
  });
};

const Article: React.FC = () => {
  const [viewArticleBox, setViewArticleBox] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [getArticleParams, setArticleParams] = useState<GetArticleType>({
    page: 1,
    pageSize: 10,
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
    responseData,
  } = useTableData<ArticleType>({
    fetchData: () => getArticle(getArticleParams),
    dataHandler: dataHandler,
    watchData: [getArticleParams],
  });

  const [currentArticle, setCurrentArticle] = useState<ArticleType>();

  //   确认删除文章
  const confirmDelete = async (record: DataType) => {
    const { key } = record;
    const { data: result } = await delArticle(key);
    if (result.code === CODE.SUCCESS) {
      messageApi.success("删除成功");
      fetchTableData();
    } else {
      messageApi.success("删除失败," + result.msg);
    }
  };

  // 查看文章详情
  const openArticleDetailBox = (record: DataType) => {
    const { key } = record;
    setCurrentArticle(responseData?.rows?.find((item) => item.id === key));

    setViewArticleBox(true);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "配图",
      dataIndex: "pic",
      key: "pic",
      width: 100,
      ellipsis: true,
      render: (url: any) => <Image width={80} src={url} />,
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "类型",
      dataIndex: "type",
      filters: [
        { text: "前端", value: "前端" },
        { text: "后端", value: "后端" },
        { text: "其他", value: "其他" },
      ],
      key: "type",
    },
    {
      title: "发布时间",
      dataIndex: "publish_date",
      key: "publish_date",
      sorter: true,
      render: (date: any) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record) => (
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
          <Button type="text" onClick={() => openArticleDetailBox(record)}>
            查看
          </Button>
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

    setArticleParams({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sorted: sorted as any,
      field: "type",
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
    setArticleParams({
      ...getArticleParams,
      keyword: args[0].target.value,
      field: "title",
    });
  };
  const searchDebounce = useDebounce(handleSearch, 500);

  return (
    <>
      {contextHolder}
      <Modal
        title="文章详情"
        centered
        open={viewArticleBox}
        onOk={() => setViewArticleBox(false)}
        onCancel={() => setViewArticleBox(false)}
        width={1000}
      >
        <ArticleDetail article={currentArticle}></ArticleDetail>
      </Modal>
      <div className="custom_container">
        <Space direction="vertical" style={{ width: "100%" }} size={0}>
          <div className="user_list">
            <div className="user_option bg-white p-4 flex align-middle justify-between">
              <Space.Compact block>
                <Row className="w-full">
                  <Col span={5}>
                    <Input
                      onChange={searchDebounce}
                      placeholder="请输入需要查询的文章名称"
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

export default Article;
