/**
 *
 * @param  {Array} userRouter 后台返回的用户权限json
 * @param  {Array} allRouter  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes 过滤后的路由
 */

export function recursionRouter(userRouter = [], allRouter = []) {
    var realRoutes = []
    allRouter.forEach((v, i) => {
        userRouter.forEach((item, index) => {
            if (item.tag === v.name) {
                if (v.children && v.children.length > 0) {
                    v.children = recursionRouter(userRouter, v.children)
                }
                realRoutes.push(v)
            }
        })
    })
    return realRoutes
}