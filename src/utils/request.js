import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/token'
import baseURL from '@/utils/globalUrl'
// 创建axios实例
const service = axios.create({
    baseURL: baseURL.serverSrc, // api 的 base_url
    timeout: 0, // 请求超时时间
    withCredentials: true, // 允许携带cookie
})

// request拦截器
service.interceptors.request.use(
    config => {
        config.headers = {
            "ClientIdentity_MT": "_PC",
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "X-Requested-With,Content-Type",
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
        }
        if (store.getters.token) {
            if (typeof store.getters.token != 'object') {
                const xinxi = JSON.parse(store.getters.token)
                config.headers['userId'] = xinxi.id // 让每个请求携带自定义token 请根据实际情况自行修改
            } else {
                config.headers['userId'] = store.getters.token.id // 让每个请求携带自定义token 请根据实际情况自行修改
            }
        }
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        console.log(response.data)
            /**
             * code为非20000是抛错 可结合自己业务进行修改
             */
        const res = response.data
        if (res.code == "logInAgain") {
            //			Message({
            //				message: res.message,
            //				type: 'error',
            //				duration: 5 * 1000
            //			})

            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            /*if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
            	MessageBox.confirm(
            		'你已被登出，可以取消继续留在该页面，或者重新登录',
            		'确定登出', {
            			confirmButtonText: '重新登录',
            			cancelButtonText: '取消',
            			type: 'warning'
            		}
            	).then(() => {
            		store.dispatch('FedLogOut').then(() => {
            			location.reload() // 为了重新实例化vue-router对象 避免bug
            		})
            	})
            }*/
            router.push('/login');
            //return Promise.reject('error')
            //return response.data
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: '请求失败',
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service