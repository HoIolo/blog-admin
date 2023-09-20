import { Result, Button } from "antd"
import Home from "../pages/Home"
import Account from "../pages/account"
import Login from "../pages/login"
import Register from "@/pages/register"
import { Link } from "react-router-dom"

const elements = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/account/:role',
    element: <Account />
  },
  {
    path: '*',
    element: <Result
      status="404"
      title="404"
      subTitle="不好意思，页面不存在(404)"
      className="w-full mt-10"
      extra={<Link to='/'><Button type="primary">返回首页</Button></Link>}
    />
  }
]

export default elements