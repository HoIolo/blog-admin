import React from "react";
import { AntDesignOutlined, HomeOutlined } from "@ant-design/icons";
import { Button, Avatar, Tooltip, Breadcrumb } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import "./index.css";
import { Link, useLocation } from "react-router-dom";
import elements from "@/router";

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

  return (
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
      <Breadcrumb items={breadCrumbItems} className="p-4 bg-white"></Breadcrumb>
      <div className="avatar">
        <Link to={userInfo ? "" : "/login"}>
          <Tooltip
            title={
              userInfo ? (
                <>欢迎您，{userInfo?.name}</>
              ) : (
                <>您还未登陆，请先登录</>
              )
            }
          >
            <Avatar
              size={{ xs: 24, sm: 32, md: 48, lg: 48, xl: 48 }}
              icon={<AntDesignOutlined rev={undefined} />}
              src={userInfo?.avatar}
            />
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export default Header;
