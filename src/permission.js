import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/token' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach(async(to, from, next) => {
    if (getToken()) {
        if (to.path === '/login') {
            next({
                path: '/'
            })
        } else {
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    const { roles } = await store.dispatch('getInfo') //获取用户信息
                    if (roles && roles.length > 0) {
                        store.dispatch('generateRoutes', roles).then((res) => {
                            router.addRoutes(res instanceof Array ? res : [res])
                            next({...to, replace: true })
                        })
                    } else {
                        Message.error('未配置权限')
                        store.dispatch('FedLogOut')
                        next({
                            path: '/'
                        })
                    }
                } catch (error) {
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                }
            }
            next()
        }
    } else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
        }
    }
})
router.afterEach(() => {
    //do something
})