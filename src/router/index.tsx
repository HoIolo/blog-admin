import { Result, Button } from "antd";
import Home from "../pages/Home";
import Account from "../pages/account";
import Login from "../pages/login";
import Register from "@/pages/register";
import ImagesUpload from "@/pages/images/upload";
import { Link } from "react-router-dom";
import ImageList from "@/pages/images/list";
import Article from "@/pages/article";
import Comments from "@/pages/comments";
import {
  BookOutlined,
  HomeOutlined,
  MessageOutlined,
  PictureOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

const getElements = () => {
  return [
    {
      path: "/",
      name: "首页",
      meta: { title: "首页", icon: <HomeOutlined rev={undefined} /> },
      element: <Home />,
    },
    {
      path: "/login",
      name: "登陆",
      hidden: true,
      element: <Login />,
    },
    {
      path: "/register",
      name: "注册",
      hidden: true,
      element: <Register />,
    },
    {
      path: "/account",
      name: "账号管理",
      meta: { title: "账号管理", icon: <UserOutlined rev={undefined} /> },
      children: [
        {
          path: "/account/user",
          name: "用户",
          meta: { title: "用户" },
          element: <Account />,
        },
        {
          path: "/account/admin",
          name: "管理员",
          meta: { title: "管理员" },
          element: "",
        },
      ],
    },
    {
      path: "/article",
      name: "文章管理",
      meta: { title: "文章管理", icon: <BookOutlined rev={undefined} /> },
      children: [
        {
          path: "/article/list",
          name: "文章列表",
          meta: { title: "文章列表" },
          element: <Article />,
        },
      ],
    },
    {
      path: "/comments",
      name: "评论管理",
      meta: { title: "评论管理", icon: <MessageOutlined rev={undefined} /> },
      element: <Comments />,
    },
    {
      path: "/images",
      name: "图片管理",
      meta: { title: "图片管理", icon: <PictureOutlined rev={undefined} /> },
      children: [
        {
          path: "/images/upload",
          name: "图片上传",
          meta: { title: "图片上传" },
          element: <ImagesUpload />,
        },
        {
          path: "/images/list",
          name: "图片列表",
          meta: { title: "图片列表" },
          element: <ImageList />,
        },
      ],
    },
    {
      path: "/setting",
      name: "网站设置",
      meta: {
        title: "网站设置",
        icon: <SettingOutlined rev={undefined} />,
      },
      element: "",
    },
    {
      path: "*",
      hidden: true,
      element: (
        <Result
          status="404"
          title="404"
          subTitle="不好意思，页面不存在(404)"
          className="w-full mt-10"
          extra={
            <Link to="/">
              <Button type="primary">返回首页</Button>
            </Link>
          }
        />
      ),
    },
  ];
};

export default getElements;
