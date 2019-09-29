/*
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-09-11 14:19:33
 */
import axios from '../common/axiosHttp'
import qs from 'qs' // 根据需求来确定是否需要
export default {  
    //登陆 
    login(params){
        return axios.post(`/user/testLogin?${qs.stringify(params)}`)
    },
     //菜单设置Start
    // 获取所有菜单树列表
    getMenuAllTree(params) {
        return axios.get(`/user/menu/getTreeAll?flag=${params}`, )
    },
    //根据当前登录用户获取菜单列表带功能
    getRoleMenuTree(params) {
        return axios.get(`/user/menu/getTree?flag=0&id=${params}`,)   //flag:0==wms;1==PDA
    },
    getRoleMenuListTree(params){    //根据当前登录用户获取菜单列表不带功能
        return axios.get(`/user/menu/getTreeOfMenus?flag=0&id=${params}`,)
    },
    // 新增子菜单
    addChildenMenu(params,id) {
        return axios.post(`/user/menu/addSubNode?parentId=${id}`, params)
    },
    // 新增菜单
    addMenu(params) {
        return axios.post('/user/menu/addTopNode', params)
    },
    //编辑菜单
    changeMenu(params,id) {
        return axios.post(`/user/menu/updateNodeDetail?id=${id}`, params)
    },
    //删除菜单
    deleteMenu(params) {
        return axios.get(`/user/menu/deleteNode?flag=0&id=${params}`)
    },
    //菜单设置End
     //组织架构Start
     //获取组织架构表格
    getCompanyTree(params){    
        return axios.get('/user/organizationalChart/getTree', params)
    },
    //添加公司
    addCompany(params){
        return axios.post(`/user/organizationalChart/addTopNode?name=${params}`,)
    },
    //删除数据
    deleteCompany(params){
        return axios.get(`/user/organizationalChart/deleteNode?id=${params}`,)
    },
    //添加下级
    addUnderling(params){
        return axios.post(`/user/organizationalChart/addSubNode?${qs.stringify(params)}`,)
    },
    //更新数据 组织架构 公司名的下级
    updateCompany(params){
        return axios.post(`/user/organizationalChart/updateNodeDetail?${qs.stringify(params)}`,)
    },
    //组织架构End
    //角色管理Start
    //获取角色列表
    getUserList(params){
        return axios.post('/user/role/getRoleList', params)
    },
    //添加角色
    addRole(params){
        return axios.post(`/user/role/addRole?${qs.stringify(params)}`)
    },
    //修改角色
    UpdateRole(params){
        return axios.post(`/user/role/UpdateRole?${qs.stringify(params)}`)
    },
    //删除角色
    deleteRole(params){
        return axios.get(`/user/role/deleteRole?id=${params}`,)
    },
    //获取当前角色所拥有的权限
    getRolePermission(params,type){
        return axios.get(`/user/role/getPermission?id=${params}&flag=${type}`,)
    },
    // 设置权限
    addPermission(params){
        return axios.post(`/user/role/addPermission?${qs.stringify(params)}`, )
    },
    //角色管理End
    
    //账户管理Start
    //获取用户列表
    getAccountsList(params){
        return axios.post('/user/user/getUserList', params)
    },
    // 新增用户
    addUser(params){
        return axios.post('/user/user/addUser', params)
    },
    //修改用户
    updateUser(params){
        return axios.post('/user/user/UpdateUser', params)
    },
    //重置密码
    modifyPwd(params){
        return axios.get(`/user/user/reset?id=${params}`,)
    },
     // 根据所属仓库查询对应的角色列表
    getRoleListByWarehouseCode(params){
        return axios.get(`/user/role/getRoleListByWarehouseCode`,)
    },
    //绑定角色
    bindingRoles(params,wparams){
        return axios.post(`/user/user/bindingRoles?${qs.stringify(params)}`,wparams)
    },
    //账户启用
    accountEnabled(params){
        return axios.post(`/user/user/enabled?ids=${params}`)
    },
    //账户停用
    accountDisabled(params){
        return axios.post(`/user/user/disabled?ids=${params}`,)
    },
    //修改密码
    changeAccountPwd(params){
        return axios.post(`/user/user/changes?${qs.stringify(params)}`,)
    },
    //退出登录
    loginOut(params){
        return axios.post(`/user/logout`,)
    },
    //账户管理End

    //客户信息Star
    //获取客户列表
    getCustomerList(params){
      return axios.get(`/user/customer/getCustomerList?${qs.stringify(params)}`,)
    },
    //获取客户信息列表
    getCustomerDetail(params){
      return axios.get(`/user/customer/getCustomer?id=${params}`)
    },
    //添加客户信息
    addCustomer(params){
      return axios.post(`/user/customer/addCustomer`,params)
    },
    //修改客户信息
    updateCustomer(params){
        return axios.post(`/user/customer/updateCustomer`,params)
    },
    //添加货主信息
    addShipperInfo(params){
        return axios.post(`/user/customer/addShipper`,params)
    },
    //修改货主信息
    updateCargoOwnerInfo(params){
        return axios.post(`/user/customer/updateShipper`,params)
    },

    //客户信息End

    // 首页接口Start
    // 获取账号权限对应的树形菜单列表，过滤掉功能菜单和中间节点菜单
    getTreeOfMenusByUserId(params){
        return axios.get(`/user/menu/getTreeOfMenusByUserId?flag=0&id=`+params)
    },
    // 获取当前用户绑定的快捷菜单
    getShortcutMenus(){
        return axios.get(`/user/user/getShortcutMenus?flag=0`)
    },
    // 绑定快捷菜单
    bindingShortcutMenus(params){
        return axios.post(`/user/user/bindingShortcutMenus?flag=0&shortcutMenus=`+params)
    },
    // 获取账号操作数据
    getAccountData(){
        return axios.get(`/center/inventoryData/list?flag=0`)
    },
    // 首页接口End

    // 公告接口Start
    // 获取公告列表
    getMessageList(params){
        return axios.post(`/user/announcement/getAnnouncementList`,params)
    },
    // 查询公告详情信息
    getMessageDetail(params){
        return axios.get(`/user/announcement/getAnnouncementDetail?id=`+params)
    },
    // 增加公告
    addMessage(params){
        return axios.post(`/user/announcement/addAnnouncement`,params)
    },
    // 删除公告
    removeMessage(params){
        return axios.get(`/user/announcement/deleteAnnouncement?id=`+params)
    },
    // 修改公告
    putMessage(params){
        return axios.post(`/user/announcement/updateAnnouncement`,params)
    },
    // 修改公告状态-是否已读
    UserManage(params){
        return axios.get(`/user/announcement/updateIsRead?id=`+params)
    }
    // 公告接口End
}
