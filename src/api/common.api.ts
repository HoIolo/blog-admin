import http from '../utils/http'

const PREFIX = '/api/v1'

/**
 * 发送邮件
 * @returns 
 */
export const sendCheckCodeByEamil = (data: any) => {
    
    return http.post(PREFIX + '/email/send', data)
}