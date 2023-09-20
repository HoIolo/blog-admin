import {
  UserOutlined,
  BookOutlined,
  HomeOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom'
import './index.css'

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
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
  getItem(<><Link to="/">首页</Link></>, '/', <HomeOutlined rev={undefined} />),

  getItem('账号管理', '/account', <UserOutlined rev={undefined} />, [
    getItem(<><Link to='/account/user'>用户</Link></>, '/account/user'),
    getItem(<><Link to='/account/admin'>管理员</Link></>, '/account/admin'),
  ]),

  getItem('文章管理', 'sub2', <BookOutlined rev={undefined} />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),

    getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
  ]),
];

interface propsType {
  collapsed: boolean
}

const TabMenu: React.FC<propsType> = (props: propsType) => {
  const location = useLocation()

  return (
    <div className='tabMenu transition-all' style={{ width: props.collapsed ? 80 : 200, minHeight: "100vh" }}>
      <div className="logo-vertical text-center w-full h-20 p-5 select-none">
        <h1 className='m-0'>{props.collapsed ? 'A' : '个人博客后台'}</h1>
      </div>
      <Menu
        defaultOpenKeys={[location.pathname]}
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
        theme="light"
        inlineCollapsed={props.collapsed}
        items={items}
        style={{ height: "calc(100vh - 2.5rem - 40px)" }}
      />
    </div>
  );
};

export default TabMenu;