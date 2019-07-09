import request from '@/utils/request'

export function login(username, password) { //登录接口
    return request({
        url: '/login/webLogin',
        method: 'post',
        params: {
            'telephone': username,
            password
        }
    })
}
export function selectAdmin(token) { //获取用户信息接口
    return request({
        url: '/login/selectAdmin',
        method: 'post',
        params: {
            adminId: token.id
        }
    })
}