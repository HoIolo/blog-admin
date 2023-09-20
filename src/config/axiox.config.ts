export const axiosConfig = {
    // baseURL: 'https://blogserver-ngzs.onrender.com',
    baseURL: 'http://127.0.0.1:3000',
    timeout: 10000,
    withCredentials: true
}

type RESPONSE_ERROR_TYPE = {
    'BAD_REQUEST': ERROR_INFO,
    'Unauthorized': ERROR_INFO,
    'Forbidden': ERROR_INFO,
    'NOT_FOUND': ERROR_INFO,
    'REQUEST_TIMEOUT': ERROR_INFO,
    'INTERNAL_SERVER_ERROR': ERROR_INFO,
    'BAD_GATEWAY': ERROR_INFO,
    'GATEWAY_TIMEOUT': ERROR_INFO,
}

type ERROR_INFO = {
    CODE: Number,
    ERROR_MSG: String
}

export const RESPONSE_ERROR: RESPONSE_ERROR_TYPE = {
    'BAD_REQUEST': {
        CODE: 400,
        ERROR_MSG: '请求错误(400)'
    },
    'Unauthorized': {
        CODE: 401,
        ERROR_MSG: '未授权，请重新登录(401)'
    },
    'Forbidden': {
        CODE: 403,
        ERROR_MSG: '拒绝访问(403)'
    },
    'NOT_FOUND': {
        CODE: 404,
        ERROR_MSG: '请求出错(404)'
    },
    'REQUEST_TIMEOUT': {
        CODE: 408,
        ERROR_MSG: '请求超时(408)'
    },
    'INTERNAL_SERVER_ERROR': {
        CODE: 500,
        ERROR_MSG: '服务器错误(500)'
    },
    'BAD_GATEWAY': {
        CODE: 502,
        ERROR_MSG: '网络错误(502)'
    },
    'GATEWAY_TIMEOUT': {
        CODE: 504,
        ERROR_MSG: '网络超时(504)'
    }
}
