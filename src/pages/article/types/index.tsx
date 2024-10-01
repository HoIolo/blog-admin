import { Button, Col, Divider, FormInstance, Input, message, Modal, Popconfirm, Row, Space, Table } from "antd";
import AddType from "./components/addType";
import { useState } from "react";
import useTableData from "@/hooks/useTableData";
import { addArticleType, delArticleType, getArticleType, GetArticleTypeType } from "@/api/articleType.api";
import { ArticleTypeType } from "@/types/articleType";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import { CODE } from "@/constant/global";
import { useDebounce } from "@/hooks/useDebounce";

interface DataType {
    name: string;
    key: number;
}

const dataHandler = (data: Array<ArticleTypeType>): DataType[] => {
    return data.map((val: ArticleTypeType) => {
        return {
            key: val.id,
            name: val.name,
            createTime: val.createTime,
        };
    });
};

const ArticleTypes: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [showAddTypeModal, setShowAddTypeModal] = useState(false);
    const [getArticleTypePrams, setArticleTypeParams] = useState<GetArticleTypeType>({
        page: 1,
        offset: 10,
        keyword: "",
        field: "id",
    });
    const [addArticleTypeModalForm, setAddArticleTypeModalForm] = useState<FormInstance>();

    const {
        tableData,
        isloading,
        setTableData,
        fetchTableData,
        setTableParams,
        tableParams,
    } = useTableData<ArticleTypeType>({
        fetchData: () => getArticleType(getArticleTypePrams),
        dataHandler: dataHandler,
        watchData: [getArticleTypePrams],
    });

    //   确认删除分类
    const confirmDelete = async (record: DataType) => {
        const { key } = record;
        const { data: result } = await delArticleType(key);
        if (result.code === CODE.SUCCESS) {
            messageApi.success("删除成功");
            fetchTableData();
        } else {
            messageApi.success("删除失败," + result.msg);
        }
    };

    const columns: ColumnsType<DataType> = [
        {
            title: "分类名称",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
        },
        {
            title: "创建时间",
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

    const handleSearch = (args: any) => {
        setArticleTypeParams({
            ...getArticleTypePrams,
            keyword: args[0].target.value,
            field: "name",
        });
    };
    const searchDebounce = useDebounce(handleSearch, 500);

    const addArticleTypeModalOk = () => {
        setShowAddTypeModal(false);
        addArticleTypeModalForm?.submit();
    };

    // 新增标签
    const addArticleTypeSubmit = async (values: any) => {
        const { data: res } = await addArticleType(values);
        if (res.code === 1001) {
            messageApi.success("添加成功");
            addArticleTypeModalForm?.resetFields();
            fetchTableData();
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="新增分类"
                open={showAddTypeModal}
                onOk={() => addArticleTypeModalOk()}
                onCancel={() => setShowAddTypeModal(false)}
            >
                <AddType onsubmit={addArticleTypeSubmit} getForm={setAddArticleTypeModalForm}></AddType>
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
                                                placeholder="请输入需要查询的分类名称"
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
                                                onClick={() => setShowAddTypeModal(true)}
                                                type="primary"
                                            >
                                                新增分类
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
                            pagination={tableParams.pagination}
                        />
                    </div>
                </Space>
            </div>
        </>
    );
}

export default ArticleTypes;