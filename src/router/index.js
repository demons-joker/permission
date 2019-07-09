import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

Vue.use(Router)

export const constantRoutes = [{ //默认路由
    path: '/login',
    component: () =>
        import ('@/views/login/index'),
    hidden: true
}]

export const asyncRoutes = [{ //预设的动态路由表（包含所有需要权限判断的路由）
    path: '/userManage',
    component: Layout,
    redirect: 'noredirect',
    name: 'userManage',
    meta: {
        title: '系统设置',
    },
    children: [{
        path: 'adminManage',
        name: 'adminManage',
        component: () =>
            import ('@/views/user/adminManage/index'),
        meta: {
            title: '管理员管理',
        }
    }]
}]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

const router = createRouter()

export default router