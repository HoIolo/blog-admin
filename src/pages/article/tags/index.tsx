import { GetTagsType, addTag, delTag, getTags } from "@/api/tag.api";
import { CODE } from "@/constant/global";
import { useDebounce } from "@/hooks/useDebounce";
import useTableData from "@/hooks/useTableData";
import { TagType } from "@/types/tag";
import {
  Button,
  Col,
  Divider,
  FormInstance,
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
import AddTag from "./components/addTag";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

interface DataType {
  tagName: string;
  key: number;
  byNum: number;
  createTime: string;
}

const dataHandler = (data: Array<TagType>): DataType[] => {
  return data.map((val: TagType) => {
    return {
      key: val.id,
      tagName: val.tagName,
      byNum: val.byNum,
      createTime: val.createTime,
    };
  });
};

const Tags: React.FC = () => {
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [getTagsParams, setTagsParams] = useState<GetTagsType>({
    page: 1,
    offset: 10,
    keyword: "",
    field: "",
  });
  const [addTagModalForm, setAddTagModalForm] = useState<FormInstance>();

  const {
    tableData,
    isloading,
    setTableData,
    fetchTableData,
    setTableParams,
    tableParams,
  } = useTableData<TagType>({
    fetchData: () => getTags(getTagsParams),
    dataHandler: dataHandler,
    watchData: [getTagsParams],
  });

  //   确认删除标签
  const confirmDelete = async (record: DataType) => {
    const { key } = record;
    const { data: result } = await delTag(key);
    if (result.code === CODE.SUCCESS) {
      messageApi.success("删除成功");
      fetchTableData();
    } else {
      messageApi.success("删除失败," + result.msg);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "标签名称",
      dataIndex: "tagName",
      key: "tagName",
      ellipsis: true,
    },
    {
      title: "引用数量",
      dataIndex: "byNum",
      key: "byNum",
    },
    {
      title: "发布时间",
      dataIndex: "createTime",
      key: "createTime",
      sorter: true,
      render: (date: any) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record) => (
        <Space size="middle">
          <Button className="text-sky-500" type="text" icon={<EyeOutlined rev={undefined} />}>查看</Button>
          <Popconfirm
            title="确认要删除吗？"
            description="请谨慎操作！"
            onConfirm={() => confirmDelete(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button danger type="text" icon={<DeleteOutlined rev={undefined} />}>
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

    setTagsParams({
      page: pagination.current,
      offset: pagination.pageSize,
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
    setTagsParams({
      ...getTagsParams,
      keyword: args[0].target.value,
      field: "tag_name",
    });
  };
  const searchDebounce = useDebounce(handleSearch, 500);

  const addTagModalOk = () => {
    setShowAddTagModal(false);
    addTagModalForm?.submit();
  };

  // 新增标签
  const addTagSubmit = async (values: any) => {
    const { data: res } = await addTag(values);
    if (res.code === 1001) {
      messageApi.success("添加成功");
      addTagModalForm?.resetFields();
      fetchTableData();
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="新增标签"
        open={showAddTagModal}
        onOk={() => addTagModalOk()}
        onCancel={() => setShowAddTagModal(false)}
      >
        <AddTag onsubmit={addTagSubmit} getForm={setAddTagModalForm}></AddTag>
      </Modal>
      <div className="custom_container">
        <Space direction="vertical" style={{ width: "100%" }} size={0}>
          <div className="user_list">
            <div className="user_option bg-white p-4 flex flex-col align-middle justify-between">
              <div className="select">
                <Space.Compact block>
                  <Row className="w-full">
                    <Col span={5}>
                      <Input
                        onChange={searchDebounce}
                        placeholder="请输入需要查询的标签名称"
                      ></Input>
                    </Col>
                  </Row>
                </Space.Compact>
              </div>
              <Divider />
              <div className="add">
                <Space.Compact block>
                  <Row className="w-full">
                    <Col span={5}>
                      <Button
                        onClick={() => setShowAddTagModal(true)}
                        type="primary"
                      >
                        新增标签
                      </Button>
                    </Col>
                  </Row>
                </Space.Compact>
              </div>
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

export default Tags;
