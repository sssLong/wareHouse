import axios from '../common/axiosHttp'

import qs from 'qs' // 根据需求来确定是否需要
// 查询仓库列表
export default {
    //仓库列表
    getWareHouseList() {
        return axios.get(`/center/warehouse/kv`)
    },
    //用户拥有的仓库列表
    getWareHouseByUser (){
        return axios.get(`/user/user/getWarehouseDetail`)
    },
    //仓库列表->用户管理角色配置用到
    getUserWareHouseList() {
        return axios.get(`/center/warehouse/user/belong`)
    },
    //分类列表
    getCategoryList (){
        return axios.post(`/center/category/getCategory`)
    },
    //到货通知列表
    getArrivalList (params){
        return axios.get(`/inbound/receiveArrivalNotice/findAll`, {params})
    },
    //到货通知详情
    getArrivalDetail (params){
        return axios.get(`/inbound/receiveArrivalNotice/selectGoodDetails`,{params})
    },
    //确认收货
    sureArrivalList (params){
        return axios.post(`/inbound/receiveArrivalNotice/ReceiveArrivalSuccess`, params)
    },
    //扫码签到成功
    signEnter (params){
        return axios.post(`/inbound/receiveSignIn/insertReceiveSignIn`, qs.stringify(params))
    },
    //签到列表信息
    signList (params){
        return axios.get(`/inbound/receiveSignIn/signInFindAll`, {params})
    },
    //生成卡板号
    getCardBord (){
        return axios.get(`/inbound/receiveCardBoardCreate/cardBoardIdCreate`)
    },
    //运单号绑定来源单号
    bindSourceId (params){
        return axios.get(`/inbound/receiveCardBoardCreate/associationId`,{params})
    },
    //通过运单号来源单号查询商品信息
    baseOrderDetail (params){
        return axios.get(`/inbound/receiveCardBoardCreate/selectInfoById`, {params})
    },
    //包裹异常确认
    packageError (params){
        return axios.post(`/inbound/exHandle/insertExInfo`, qs.stringify(params))
    },
    //绑定卡板号
    bindBord (params){
        return axios.post(`/inbound/receiveCardBoardCreate/insertReceiveCardInfo`, params)
    },
    //质检台列表
    getQcTableList (params){
        return axios.get(`/center/qc/kv`, { params })
    },
    //根据卡板号查看货物信息
    baseCardList (params){
        return axios.post(`/inbound/qc/getWaybillInfo`, qs.stringify(params))
    },
    //QC完成
    addQcNum (params){
        return axios.post(`/inbound/qc/addWaybillInfo`, qs.stringify(params))
    },
    //异常上报
    sendError (params){
        return axios.post(`/inbound/qc/addException`, params)
    },
    //绑定容器
    bindBox (params){
        return axios.post(`/inbound/qc/sealBox`, params)
    },
    //销退接收列表
    backOrderList (params){
        return axios.get(`/inbound/sellingBack/sellingBackFindAll`, {params})
    },
    //销退接收
    backReceiver (params){
        return axios.post(`/inbound/sellingBack/sellingBackInsert`, qs.stringify(params))
    },
    //根据运单查询销退详情
    baseOrderGetBackDetail (params){
        return axios.get(`/inbound/sellingBack/selectDetailInfo`, {params})
    },
    //销退质检收货完成获取计划收货数据
    getBackDeliverData (params){
        return axios.get(`/inbound/sellingBack/quantityStatistics`, { params })
    },
    //销退确认收货
    sureBackList (params){
        return axios.post(`/inbound/sellingBack/sellingBackSuccess`, params)
    },
    //销退质检根据运单号查询数据
    backBaseYDList (params){
        return axios.post(`/inbound/qc/getSellingBack/waybillNum`, qs.stringify(params))
    },
    //销退质检根据来源单号查询数据
    backBaseLYList (params){
        return axios.post(`/inbound/qc/getSellingBack/sourceNumber`, qs.stringify(params))
    },
    //获取平台列表
    getplathformList (params){
        return axios.post(`/logistics/basic/selectPlatform`, params )
    },
    //获取物流商列表
    getlogisticsList (params){
        return axios.get(`/logistics/basic/selectLogisticsProvider`, { params })
    },
    //查询运输方式列表
    getShippingMethods(params){
        return axios.get('/logistics/centre/selectLogisticsMethod',{params})
    },
    //获取用户列表
    getUserList (params){
        return axios.post(`/user/user/getUserList`, params)
    },
     //根据仓库获取用户列表
    getUserListByWareHouse (params){
        return axios.get(`/user/user/getAccountNameListByWarehouseId`, {params})
    },
    // 获取策略规则列表
    getStrategyRule () {
      return axios.get(`center/dict/info?dictCode=strategy_rule`)
    },
    // 新增策略信息
    addStrategy (params) {
      return axios.post(`/inbound/putawayStrategy/insertInfo?${qs.stringify(params)}`)
    },
    // 切换策略启用状态
    toggleStrategyStatus(params) {
      return axios.put(`/inbound/putawayStrategy/updateStatus?${qs.stringify(params)}`)
    },
    // 删除策略管理
    delTacticsItem(id) {
      return axios.delete(`/inbound/putawayStrategy/deleteInfoById?id=${id}`)
    },
    // 获取策略列表(可用于查询该仓库是否已有策略的检测)
    getTacticList(params) {
      return axios.get(`/inbound/putawayStrategy/putawayStrategyFindAll`, {params})
    }


}
