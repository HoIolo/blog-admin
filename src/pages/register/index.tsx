import React, { useState } from 'react'
import { LockOutlined, UserOutlined, MailOutlined, CodeOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Space, message } from 'antd';
import Lottie from 'lottie-react';
import recketAnimation from '@/assets/lottie/animation_llc6rqym.json'
import { register } from '@/api/user.api';
import { sendCheckCodeByEamil } from '@/api/common.api';
import { useNavigate } from 'react-router-dom';
import { waitTime } from '@/config/common.config';


interface registerForm {
    account: String,
    password: String,
    confirmPassword: String,
    email_code: String
}

let isClickCheckCodeBtn = true

const Register: React.FC = () => {
    const [messageApi, contentMessage] = message.useMessage()
    const navigate = useNavigate()

    const onFinish = async (values: registerForm) => {
        const { data: res } = await register(values)
        if (res.code === 1001) {
            messageApi.success(res.data.message)
            setTimeout(() => {
                navigate('/login')
            }, waitTime)
        } else {
            messageApi.error(res.message)
        }
    };

    const [checkCodeBtnStr, setCheckCodeBtnStr] = useState('发送验证码')
    const [email, setEmail] = useState('')

    const saveEmailValue = (e: any) => {
        setEmail(e.target.value)
    }


    // 发送验证码
    const sendCheckCode = async () => {
        if (!isClickCheckCodeBtn) {
            console.log("不可点击");
            return
        }
        const checkCode = await sendCheckCodeByEamil({ email })

        console.log(checkCode);

        isClickCheckCodeBtn = false
        let time = 59
        setCheckCodeBtnStr(time + 's')
        const timeTask = setInterval(() => {
            time--
            if (time < 1) {
                clearInterval(timeTask)
                setCheckCodeBtnStr('发送验证码')
                isClickCheckCodeBtn = true
            } else {
                setCheckCodeBtnStr(time + 's')
            }
        }, 1000)

    }


    return (
        <>
            {contentMessage}
            <div className='flex flex-col w-full h-screen justify-center items-center'>
                <div className='w-96 text-center'>
                    <Lottie className='w-20 m-auto' animationData={recketAnimation}></Lottie>
                    <h2>管理员注册</h2>
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
                            rules={[{ required: true, message: '请输入用户名！' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" rev={undefined} />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码！' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" rev={undefined} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入确认密码！',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致！'));
                                    },
                                }),
                            ]}
                            dependencies={['password']}
                        >
                            <Input prefix={<LockOutlined className="site-form-item-icon" rev={undefined} />} type="password" placeholder="确认密码" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: '请输入邮箱！' }]}
                        >
                            <Input
                                prefix={<MailOutlined className="site-form-item-icon" rev={undefined} />}
                                type="email"
                                placeholder="邮箱"
                                onChange={saveEmailValue}
                            />
                        </Form.Item>
                        <Form.Item extra="我们需要确认该邮箱可以正常使用！">
                            <Row gutter={8}>
                                <Col span={17}>
                                    <Form.Item
                                        name="email_code"
                                        noStyle
                                        rules={[{ required: true, message: '请输入验证码!' }]}
                                    >
                                        <Input placeholder='验证码' prefix={<CodeOutlined className="site-form-item-icon" rev={undefined} />} />
                                    </Form.Item>
                                </Col>
                                <Col span={7}>
                                    <Button className='w-full' onClick={sendCheckCode}>{checkCodeBtnStr}</Button>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Space direction="vertical" size="middle" className='w-full'>
                                <Button type="primary" htmlType="submit" className="login-form-button w-full">
                                    注册
                                </Button>
                                <div>
                                    已经有账号？去 <a href="/login">登陆</a>
                                </div>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Register