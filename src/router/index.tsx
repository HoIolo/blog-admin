import { Result, Button } from "antd";
import Home from "../pages/Home";
import Account from "../pages/account";
import Login from "../pages/login";
import Register from "@/pages/register";
import ImagesUpload from "@/pages/images/upload";
import { Link } from "react-router-dom";
import ImageList from "@/pages/images/list";

const elements = [
  {
    path: "/",
    name: "首页",
    element: <Home />,
  },
  {
    path: "/login",
    name: "登陆",
    element: <Login />,
  },
  {
    path: "/register",
    name: "注册",
    element: <Register />,
  },
  {
    path: "/account",
    name: "账号管理",
    children: [
      {
        path: "user",
        name: "用户",
        element: <Account />,
      },
      {
        path: "admin",
        name: "管理员",
        element: "",
      },
    ],
  },
  {
    path: "/images",
    name: "图片管理",
    children: [
      {
        path: "upload",
        name: "图片上传",
        element: <ImagesUpload />,
      },
      {
        path: "list",
        name: "图片列表",
        element: <ImageList />,
      },
    ],
  },
  {
    path: "*",
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

export default elements;
