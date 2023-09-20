import Axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import { RESPONSE_ERROR, axiosConfig } from '@/config/axiox.config'

const axiosInstance: AxiosInstance = Axios.create({ ...axiosConfig })

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // 
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['authorization'] = 'Bearer ' + token
    }

    return config
}, (err: any) => {
    return Promise.reject(err)
})


axiosInstance.interceptors.response.use((res: AxiosResponse) => {

    return res
}, (err: any) => {
    let { message: responseMessage } = err.response.data
    let msg: String = `连接出错(${err.response?.status || 500})!`
    const responseKeys = Object.keys(RESPONSE_ERROR)

    for (let item of responseKeys) {
        let { CODE, ERROR_MSG } = (RESPONSE_ERROR as any)[item]
        if (err.response?.status === CODE) {
            msg = responseMessage || ERROR_MSG
        }
    }

    const { location } = window
    const isNotLogin = err.response?.status === RESPONSE_ERROR.Unauthorized.CODE && location.pathname !== '/login' && location.pathname !== '/register'
    // 未登录 并且不在”登陆页“和”注册页“
    if (isNotLogin) {
        setTimeout(() => {
            location.href = '/login'
        }, 1000)
    }

    message.error(msg)

    return Promise.reject(err.response)
})

export default axiosInstance