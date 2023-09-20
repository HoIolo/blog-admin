import React, { useEffect, useState } from 'react';
import elements from './router';
import { useLocation, useRoutes } from 'react-router-dom'
import './App.css'
import TabMenu from './components/TabMenu';
import Header from './components/Header';
import MyContent from './content';
import { getUserInfo } from './api/user.api';
import { confirmWhite } from './utils/common.util';
import whiteList from './config/whiteList.config';

function App() {

  const element = useRoutes(elements)
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)
  const whitePath: Array<String> = ['/login', '/register']

  // 是否使用默认布局
  const isUseLayout = () => {
    const currentPath = location.pathname
    const currentRoutePath = element?.props.value.matches[0].route.path

    let flag = currentRoutePath === '*'

    if (flag) return flag

    for (let item of whitePath) {
      if (item === currentPath) {
        flag = true
        break
      }
    }
    return flag
  }

  const [userInfo, setUserInfo] = useState(null)
  const isInWhiteList = confirmWhite(whiteList, 'pathWhiteList', location.pathname)

  useEffect(() => {
    async function fetchData() {
      // 判断是否登陆,并且不在白名单内
      if (!isInWhiteList) {
        const { data: res } = await getUserInfo()
        setUserInfo(res.data.row)
      }
    }
    fetchData();
  }, [isInWhiteList])

  return (
    <MyContent.Provider value={{userInfo}}>
      <div className='app'>
        {isUseLayout() ? element : (<>
          <aside>
            <TabMenu collapsed={collapsed} />
          </aside>
          <div className="main">
            <Header userInfo={userInfo} collapsed={collapsed} changeCollapsed={() => setCollapsed(!collapsed)} />
            {element}
          </div></>)}
      </div>
    </MyContent.Provider>
  );
}

export default App;
