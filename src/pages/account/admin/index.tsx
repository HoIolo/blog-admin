import {
  Space,
  Table,
  Tag,
  Switch,
  Avatar,
  Button,
  Input,
  Select,
  Divider,
  Popconfirm,
  Modal,
  Form,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  deleteUser,
  getUsers,
  GetUsersType,
  updateUserProfile,
  updateUserRole,
  updateUserStatus,
} from "@/api/user.api";
import { getUserSex, transformUpYunPicUrl } from "@/utils/common.util";
import useTableData from "@/hooks/useTableData";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { UserType } from "@/types/user";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { uploadImage } from "@/api/image.api";
import dayjs from "dayjs";

interface DataType {
  key: number;
  name: string;
  sex: number;
  status: 0 | 1;
  isAdmin: Boolean;
  address: string;
  tags: string[];
  signDate: string;
}

type FieldType = {
  id: number;
  name?: string;
  sex?: string;
  signature?: string;
  avatar?: string;
};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const dataHandler = (data: any): DataType[] => {
  const format = "YYYY-MM-DD";
  return data.map((val: any) => {
    return {
      key: val.id,
      avatar: val.profile.avatar,
      name: val.profile.name,
      sex: getUserSex(val.profile.sex),
      isAdmin: val.role > 1,
      status: !val.status,
      signDate: dayjs(val.createTime).format(format),
    };
  });
};

const Admin: React.FC = () => {
  const [refreshTable, setRefreshTable] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [getUsersParams, setUsersParams] = useState<GetUsersType>({
    page: 1,
    offset: 10,
    admin: true,
  });
  const { tableData, responseData, isloading, tableParams } =
    useTableData<UserType>({
      fetchData: () => getUsers(getUsersParams),
      dataHandler,
      watchData: [refreshTable, getUsersParams],
    });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewModalTitle, setViewModalTitle] = useState("标题");
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [getSearchForm, setSearchForm] = useState<{
    field: string;
    keyword: string;
    searchType: string;
  }>({
    field: "account",
    keyword: "",
    searchType: "=",
  });

  // 显示查看资料弹窗
  const onViewModal = (record: DataType) => {
    const currentUser = responseData?.rows?.find(
      (item) => item.id === record.key
    );
    const suffix = "的详细资料";
    setViewModalTitle(record.name + suffix);
    form.setFieldsValue({
      id: currentUser?.id,
      avatar: currentUser?.profile.avatar,
      name: currentUser?.profile.name,
      sex: currentUser?.profile.sex as number,
      signature: currentUser?.profile.signature,
    });
    setAvatarUrl(
      transformUpYunPicUrl({
        url: currentUser?.profile.avatar as string,
        options: { width: 102, quality: 100 },
      })
    );
    setIsViewModalOpen(true);
  };

  /** 修改用户角色 */
  const handleRoleChange = async (checked: boolean, record: DataType) => {
    const { data: updateResult } = await updateUserRole({
      id: record.key,
      role: checked ? 2 : 1,
    });
    if (updateResult.code === 1001) {
      const successMessage = checked ? "变更为管理员" : "变更为普通用户";
      messageApi.success(successMessage);
    } else {
      messageApi.error("系统繁忙，请稍后再试！");
    }
  };

  const handleStatusChange = async (checked: boolean, record: DataType) => {
    const { data: updateResult } = await updateUserStatus({
      id: record.key,
      isBan: checked,
    });
    if (updateResult.code === 1001) {
      const successMessage = checked ? "封禁成功" : "解禁成功";
      messageApi.success(successMessage);
    } else {
      messageApi.error("系统繁忙，请稍后再试！");
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      render: (url) => <Avatar src={url} size={32} />,
    },
    {
      title: "昵称",
      dataIndex: "name",
      key: "name",
      render: (text) => text,
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "管理员",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin, record) => (
        <Switch
          defaultChecked={isAdmin}
          onChange={(checked: boolean) => handleRoleChange(checked, record)}
        />
      ),
    },
    {
      title: "是否封禁",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          defaultChecked={status}
          onChange={(checked: boolean) => handleStatusChange(checked, record)}
        />
      ),
    },
    {
      title: "注册时间",
      dataIndex: "signDate",
      key: "signDate",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              className="text-sky-500"
              onClick={() => onViewModal(record)}
              type="text"
              icon={<EyeOutlined rev={undefined} />}
            >
              查看资料
            </Button>
            <Popconfirm
              title="您确认要删除吗？"
              description="删除后无法恢复"
              okText="确认"
              cancelText="取消"
              onConfirm={async () => {
                const { data: deleteResult } = await deleteUser(record.key);
                if (deleteResult.code === 1001) {
                  messageApi.success("删除成功");
                  setRefreshTable(!refreshTable);
                } else {
                  messageApi.error(deleteResult.msg);
                }
              }}
            >
              <Button
                danger
                type="text"
                icon={<DeleteOutlined rev={undefined} />}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // 关闭查看资料弹窗
  const handleViewModalCancel = () => {
    setIsViewModalOpen(false);
  };

  // 图片上传事件
  const handleCustomUpload = (options: any) => {
    getBase64(options.file as RcFile, (url) => {
      setAvatarUrl(url);
      form.setFieldsValue({
        avatar: options.file,
      });
    });
  };

  // 更新用户数据
  const handleViewModalOk = () => {
    form.validateFields().then(async (values) => {
      // 验证通过
      const id = form.getFieldValue("id");
      const avatar = form.getFieldValue("avatar");
      if (typeof avatar === "object") {
        // 图片为本地图片，先上传，再更新头像
        const formData = new FormData();
        formData.append("file", values.avatar);
        formData.append("local", "false");
        const { data } = await uploadImage(formData);
        if (data && data.code === 1001) {
          // 上传成功
          form.setFieldValue("avatar", data.data?.row);
          values.avatar = data.data?.row;
        } else {
          return;
        }
      }
      const { data } = await updateUserProfile({ id, ...values });
      if (data && data.code === 1001) {
        messageApi.success("修改成功");
        handleViewModalCancel();
        // 刷新数据
        setRefreshTable(!refreshTable);
      } else {
        messageApi.error("修改失败, 请稍后再试！");
      }
    });
  };

  // 用户查询
  const handleSearch = () => {
    setUsersParams({
      ...getUsersParams,
      field: getSearchForm.field,
      searchType: getSearchForm.searchType,
      keyword: getSearchForm.keyword,
    });
  };

  return (
    <div className="custom_container">
      {contextHolder}
      <Modal
        title={viewModalTitle}
        open={isViewModalOpen}
        onCancel={handleViewModalCancel}
        cancelText="取消"
        okText="保存"
        onOk={handleViewModalOk}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="头像"
            name="avatar"
            rules={[{ required: true, message: "请上传一个头像！" }]}
          >
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                showUploadList={false}
                customRequest={handleCustomUpload}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  "upload"
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item<FieldType>
            label="昵称"
            name="name"
            rules={[{ required: true, message: "请输入您的昵称！" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="性别"
            name="sex"
            rules={[{ required: true, message: "请选择一个性别！" }]}
          >
            <Select
              style={{ width: 120 }}
              options={[
                { value: 0, label: "保密" },
                { value: 1, label: "男" },
                { value: 2, label: "女" },
              ]}
            />
          </Form.Item>

          <Form.Item<FieldType> label="签名" name="signature">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Space direction="vertical" style={{ width: "100%" }} size={0}>
        <div className="user_list">
          <div className="user_option bg-white p-4">
            <Space>
              <Select
                defaultValue="account"
                className="w-24"
                options={[
                  { value: "account", label: "账号" },
                  { value: "email", label: "邮箱" },
                ]}
                onChange={(value) => {
                  setSearchForm({ ...getSearchForm, field: value });
                }}
              ></Select>
              <Input
                onChange={(e) => {
                  setSearchForm({
                    ...getSearchForm,
                    keyword: e.target.value,
                  });
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="请输入需要查询的内容"
              ></Input>
              <Button onClick={handleSearch} type="primary">
                查询
              </Button>
            </Space>
          </div>
          <Divider style={{ margin: 0 }} />
          <Table
            scroll={{ x: "max-content" }}
            loading={isloading}
            columns={columns}
            dataSource={tableData}
            pagination={tableParams.pagination}
          />
        </div>
      </Space>
    </div>
  );
};

export default Admin;
