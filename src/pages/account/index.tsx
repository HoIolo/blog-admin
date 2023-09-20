import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Table, Tag, Switch, Avatar } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getUsers } from "@/api/user.api";
import { getUserSex } from "@/utils/common.util";

interface DataType {
  key: string;
  name: string;
  sex: number;
  isAdmin: Boolean;
  address: string;
  tags: string[];
}

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
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
    render: (text) => <a href="#2">{text}</a>,
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
    render: (isAdmin) => (
      <Switch checked={isAdmin} defaultChecked onChange={onChange} />
    ),
  },
  {
    title: "当前状态",
    key: "status",
    dataIndex: "status",
    render: (status) => (
      <Tag color={"green"} key={status}>
        在线
      </Tag>
    ),
  },
  {
    title: "是否封禁",
    dataIndex: "isDenyAccess",
    key: "isDenyAccess",
    render: (isDenyAccess) => (
      <Switch checked={isDenyAccess} defaultChecked onChange={onChange} />
    ),
  },
  {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a href="#record">删除{record.key}</a>
      </Space>
    ),
  },
];

const dataHandler = (data: any): DataType[] => {
  return data.map((val: any) => {
    return {
      key: val.id,
      avatar: val.profile.avatar,
      name: val.profile.name,
      sex: getUserSex(val.profile.sex),
      isAdmin: val.role,
    };
  });
};

const Account: React.FC = () => {
  let { role } = useParams();
  const [userData, setUserData] = useState<any>();
  const [userList, setUserList] = useState<DataType[]>([]);
  useEffect(() => {
    async function fetchData() {
      const { data: res } = await getUsers();
      console.log(res);
      if (res.code === 1001) {
        setUserData(res.data);
        
        setUserList(dataHandler(res.data.rows));
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      账号管理: {role}
      <Table
        columns={columns}
        dataSource={userList}
        pagination={{ pageSize: userData?.count }}
      />
    </div>
  );
};

export default Account;
