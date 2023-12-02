import { useEffect, useState } from "react";
import getElements from "./router";
import { useLocation, useRoutes } from "react-router-dom";
import "./App.css";
import TabMenu from "./components/TabMenu";
import Header from "./components/Header";
import MyContent from "./content";
import { getUserInfo } from "./api/user.api";
import { confirmWhite, isUseLayout } from "./utils/common.util";
import whiteList from "./config/whiteList.config";
import { App } from "antd";

function AppFC() {
  const element = getElements();
  const routers = useRoutes(element);
  const location = useLocation();
  const [mainPaddingLeft, setmainPaddingLeft] = useState("200px");
  const [collapsed, setCollapsed] = useState(false);
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

  const canrender = userInfo || isInWhiteList;

  return !canrender ? (
    <></>
  ) : (
    <MyContent.Provider value={{ userInfo }}>
      <App>
        <div className="app">
          {isUseLayout(location, routers) ? (
            routers
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
                {routers}
              </div>
            </>
          )}
        </div>
      </App>
    </MyContent.Provider>
  );
}

export default AppFC;
