import React, { } from 'react';
import { AntDesignOutlined } from '@ant-design/icons';
import { Button, Avatar, Tooltip } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import './index.css'
import { Link } from 'react-router-dom';

interface propsType {
  changeCollapsed: React.MouseEventHandler<HTMLElement>
  collapsed: boolean,
  userInfo: any
}

const Header: React.FC<propsType> = (props: propsType) => {
  const { userInfo } = props

  return (
    <div className='header'>
      <div className="menu_btn">
        <Button type="primary" onClick={props.changeCollapsed}>
          {props.collapsed ? <MenuUnfoldOutlined rev={undefined} /> : <MenuFoldOutlined rev={undefined} />}
        </Button>
      </div>
      <div className="avatar">
        <Link to={userInfo ? '' : '/login'}>
          <Tooltip title={userInfo ? <>欢迎您，{userInfo?.name}</> : <>您还未登陆，请先登录</>}>
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