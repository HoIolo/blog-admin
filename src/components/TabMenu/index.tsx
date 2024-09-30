import type { MenuProps } from "antd";
import { Menu } from "antd";
import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./index.css";
import getElements from "@/router";
import MyContent from "@/content";

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
const getTabsItem = (route: any, parentPath: string, userRole: number): any => {
  if (!route || route.meta.role > userRole) return undefined;

  const linkPath = route.path.startsWith("/")
    ? route.path
    : parentPath + "/" + route.path;

  return getItem(
    route.children?.length ? (
      (route?.meta as any)?.title
    ) : (
      <>
        <Link to={linkPath}>{route.meta?.title}</Link>
      </>
    ),
    route.path,
    route.meta?.icon,
    (route.children as any)?.map((child: any) =>
      getTabsItem(child, route.path, userRole)
    ) ?? undefined
  );
};
const tabs: MenuItem[] = [];
const routes = getElements();

const initTabs = (userRole: number) => {
  if (tabs.length === 0)
    for (let route of routes) {
      if (route.hidden) continue;
      const item = getTabsItem(route, "", userRole);
      if (item) tabs.push(item);
    }
};

interface propsType {
  collapsed: boolean;
}

const TabMenu: React.FC<propsType> = (props: propsType) => {
  const location = useLocation();
  const values = useContext(MyContent);

  initTabs(values.userInfo.user.role);

  const setAdminTitle = (collapsed: Boolean) => {
    return collapsed ? "A" : "智语轩后台";
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
        items={tabs}
        style={{ minHeight: "calc(100vh - 2.5rem - 40px)" }}
      />
    </div>
  );
};

export default TabMenu;
