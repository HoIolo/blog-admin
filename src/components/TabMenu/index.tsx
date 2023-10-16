import {
  UserOutlined,
  BookOutlined,
  HomeOutlined,
  MessageOutlined,
  SettingOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./index.css";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <>
      <Link to="/">首页</Link>
    </>,
    "/",
    <HomeOutlined rev={undefined} />
  ),

  getItem("账号管理", "/account", <UserOutlined rev={undefined} />, [
    getItem(
      <>
        <Link to="/account/user">用户</Link>
      </>,
      "/account/user"
    ),
    getItem(
      <>
        <Link to="/account/admin">管理员</Link>
      </>,
      "/account/admin"
    ),
  ]),

  getItem("文章管理", "sub2", <BookOutlined rev={undefined} />),

  getItem(
    <>
      <Link to="/comments">评论管理</Link>
    </>,
    "/comments",
    <MessageOutlined rev={undefined} />
  ),

  getItem(
    <>
      <Link to="/setting">网站设置</Link>
    </>,
    "/setting",
    <SettingOutlined rev={undefined} />
  ),

  getItem(
    <>
      <Link to="/images">图片管理</Link>
    </>,
    "/images",
    <PictureOutlined rev={undefined} />
  ),
];

interface propsType {
  collapsed: boolean;
}

const TabMenu: React.FC<propsType> = (props: propsType) => {
  const location = useLocation();

  const setAdminTitle = (collapsed: Boolean) => {
    return collapsed ? "A" : "个人博客后台";
  };

  return (
    <div
      className="tabMenu overflow-hidden"
      style={{
        width: props.collapsed ? 80 : 200,
        minHeight: "100vh",
        transition: "width .3s cubic-bezier(0.2, 0, 0, 1) 0s",
      }}
    >
      <div
        className="logo-vertical text-center w-full h-20 p-5 select-none text-menucolor"
        style={{ backgroundColor: "#001529" }}
      >
        <h1 className="m-0 whitespace-nowrap">
          {setAdminTitle(props.collapsed)}
        </h1>
      </div>
      <Menu
        defaultOpenKeys={["/" + location.pathname.split("/")[1]]}
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
        theme="dark"
        inlineCollapsed={props.collapsed}
        items={items}
        style={{ minHeight: "calc(100vh - 2.5rem - 40px)" }}
      />
    </div>
  );
};

export default TabMenu;
