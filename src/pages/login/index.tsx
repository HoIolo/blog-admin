import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Space, message } from "antd";
import Lottie from "lottie-react";
import adminAnimation from "@/assets/lottie/animation_llc3epse.json";
import { login } from "@/api/user.api";
import { useNavigate } from "react-router-dom";
import { waitTime } from "@/config/common.config";

const Login: React.FC = () => {
  const [messageApi, contentMessage] = message.useMessage();
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoginLoading(true);
    try {
      const { data: res } = await login({ ...values, role: 2 });
      if (res.code === 1001) {
        localStorage.setItem("token", res.data.access_token);
        const successMsg = "登陆成功";
        messageApi.success(successMsg);
        setLoginLoading(false);
        setTimeout(() => {
          navigate("/");
        }, waitTime);
        return;
      }
    } catch(err: any) {
      setLoginLoading(false);
    }
  };

  return (
    <>
      {contentMessage}
      <div className="flex flex-col w-full h-screen justify-center items-center">
        <div className="w-96 text-center">
          <Lottie
            className="w-20 m-auto"
            animationData={adminAnimation}
          ></Lottie>
          <h2>管理员登陆</h2>
        </div>
        <div className="form w-96 mt-10">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="account"
              rules={[{ required: true, message: "用户名不能为空！" }]}
            >
              <Input
                prefix={
                  <UserOutlined
                    className="site-form-item-icon"
                    rev={undefined}
                  />
                }
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "密码不能为空！" }]}
            >
              <Input
                prefix={
                  <LockOutlined
                    className="site-form-item-icon"
                    rev={undefined}
                  />
                }
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住账号</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="#1">
                忘记密码
              </a>
            </Form.Item>

            <Form.Item>
              <Space direction="vertical" size="middle" className="w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button w-full"
                  loading={loginLoading}
                >
                  登陆
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
