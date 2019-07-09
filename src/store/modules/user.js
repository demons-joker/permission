import { getToken, setToken, removeToken } from '@/utils/token'
import { login, selectAdmin } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { recursionRouter } from '@/utils/routerUtils'
import { Message } from 'element-ui'
import { asyncRoutes } from '@/router'
const user = {
    state: {
        token: getToken(),
        roles: [],
        routes: []
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_ROUTES: (state, routes) => {
            state.routes = routes
        }
    },
    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    if (response.code != "success") {
                        Message.error(response.desc)
                    }
                    const data = response.result.admin
                    setToken(data) //cookie储存token
                    commit('SET_TOKEN', data)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //获取用户信息
        getInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                const tk = state.token instanceof Object ? state.token : JSON.parse(state.token)
                selectAdmin(tk).then(response => {
                    const { result } = response
                    if (!result) {
                        reject('Verification failed, please Login again.')
                        Message.error('Verification failed, please Login again.')
                    }
                    const { page } = result
                    commit('SET_ROLES', page)
                    resolve(result)
                }).catch(error => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    reject(error)
                })
            })
        },
        //合并路由
        generateRoutes({ commit }, roles) {
            return new Promise(resolve => {
                let accessedRoutes = recursionRouter(roles, asyncRoutes)
                commit('SET_ROUTES', accessedRoutes)
                resolve(accessedRoutes)
            })
        },
        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resolve()
            })
        }
    }
}

export default user