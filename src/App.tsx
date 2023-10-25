import React, { useEffect, useState } from "react";
import elements from "./router";
import { useLocation, useRoutes } from "react-router-dom";
import "./App.css";
import TabMenu from "./components/TabMenu";
import Header from "./components/Header";
import MyContent from "./content";
import { getUserInfo } from "./api/user.api";
import { confirmWhite } from "./utils/common.util";
import whiteList from "./config/whiteList.config";
import { App } from "antd";

function AppFC() {
  const element = useRoutes(elements);
  const location = useLocation();
  const [mainPaddingLeft, setmainPaddingLeft] = useState("200px");
  const [collapsed, setCollapsed] = useState(false);
  const whitePath: Array<String> = ["/login", "/register"];

  // 是否使用默认布局
  const isUseLayout = () => {
    const currentPath = location.pathname;
    const currentRoutePath = element?.props.value.matches[0].route.path;

    let flag = currentRoutePath === "*";

    if (flag) return flag;

    for (let item of whitePath) {
      if (item === currentPath) {
        flag = true;
        break;
      }
    }
    return flag;
  };

  const [userInfo, setUserInfo] = useState(null);
  const isInWhiteList = confirmWhite(
    whiteList,
    "pathWhiteList",
    location.pathname
  );

  useEffect(() => {
    async function fetchData() {
      // 判断是否登陆,并且不在白名单内
      if (!isInWhiteList) {
        const { data: res } = await getUserInfo();
        setUserInfo(res.data.row);
      }
    }
    fetchData();
  }, [isInWhiteList]);

  return (
    <MyContent.Provider value={{ userInfo }}>
      <App>
        <div className="app">
          {isUseLayout() ? (
            element
          ) : (
            <>
              <aside style={{ position: "fixed", left: 0, top: 0, zIndex: 1 }}>
                <TabMenu collapsed={collapsed} />
              </aside>
              <div className="main" style={{ paddingLeft: mainPaddingLeft }}>
                <Header
                  userInfo={userInfo}
                  collapsed={collapsed}
                  changeCollapsed={() => {
                    setCollapsed(!collapsed);
                    setmainPaddingLeft(collapsed ? "200px" : "80px");
                  }}
                />
                {element}
              </div>
            </>
          )}
        </div>
      </App>
    </MyContent.Provider>
  );
}

export default AppFC;
