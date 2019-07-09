const getters = {
    token: state => state.user.token,
    roles: state => state.user.roles,
    routes: state => state.user.routes
}
export default getters