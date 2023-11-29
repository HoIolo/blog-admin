import React from "react";
import { AntDesignOutlined, HomeOutlined } from "@ant-design/icons";
import {
  Button,
  Avatar,
  Breadcrumb,
  Popover,
  Space,
  message,
} from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import "./index.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import elements from "@/router";
import { logout } from "@/api/user.api";

interface propsType {
  changeCollapsed: React.MouseEventHandler<HTMLElement>;
  collapsed: boolean;
  userInfo: any;
}
const breadcrumbNameMap: Record<string, string> = {};
elements.forEach((item) => {
  breadcrumbNameMap[item.path] = item.name as string;
  recursionAssign(item);
});

function recursionAssign(item: any): any {
  if (!item.children) {
    return null;
  }
  for (const child of item.children) {
    breadcrumbNameMap[item.path + "/" + child.path] = child.name as string;
    recursionAssign(child);
  }
}

const breadcrumbClick = () => {};

const Header: React.FC<propsType> = (props: propsType) => {
  const { userInfo } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
      onClick: breadcrumbClick,
    };
  });

  const breadCrumbItems = [
    {
      title: (
        <Link to={"/"}>
          <HomeOutlined rev={undefined} />
        </Link>
      ),
      onClick: breadcrumbClick,
    },
  ].concat(extraBreadcrumbItems);

  const logoutClick = () => {
    logout();
    messageApi.success("退出成功").then(() => {
      navigate("/login");
    });
  };

  const content = (
    <div>
      <Space className="w-full" direction="vertical">
        <p>用户名：{userInfo?.name}</p>
        <Button onClick={logoutClick} block>
          退出登陆
        </Button>
      </Space>
    </div>
  );

  return (
    <>
      {contextHolder}
      <div className="header">
        <div className="menu_btn">
          <Button type="primary" onClick={props.changeCollapsed}>
            {props.collapsed ? (
              <MenuUnfoldOutlined rev={undefined} />
            ) : (
              <MenuFoldOutlined rev={undefined} />
            )}
          </Button>
        </div>
        <Breadcrumb
          items={breadCrumbItems}
          className="p-4 bg-white"
        ></Breadcrumb>
        <div className="avatar">
          <Link to={userInfo ? "" : "/login"}>
            <Popover
              content={userInfo ? content : <>您还未登陆</>}
              trigger="hover"
            >
              <Avatar
                size={{ xs: 24, sm: 32, md: 48, lg: 48, xl: 48 }}
                icon={<AntDesignOutlined rev={undefined} />}
                src={userInfo?.avatar}
              />
            </Popover>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
