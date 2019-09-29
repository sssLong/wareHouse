import axios from '../common/axiosHttp'
export default {
  // 客户的下拉
  getCustomerKv () {
    return axios('/user/customer/getCustomerCodeAndName')
  },
  // 货主的下拉
  getShipperKv (dataCode) {
    return axios('/user/customer/getShipperCodeAndName' + `${dataCode ? '?customerCode=' + dataCode : '' }`)
  },
  // SKU 库存查询
  getSkuList(params) {
    return axios.post('/center/skuInventory/list',params)
  },
  // SKU 库存日志
  getSkuLog(params) {
    return axios.post('/center/skuInventory/log',params)
  },
  shelfInventoryList (data) { // 货位库存查询
    return axios.post('/center/shelfInventory/singleCondition', data)
  },
  shelfInventoryLog (data) { // 货位库存操作日志
    return axios.post('/center/shelfInventory/log', data)
  },
  getAreaKv (params) { // 获取库区键值
    return axios('/center/area/kv', { params })
  },
  // 查询入库工作量统计
  getInboundList(params) {
    return axios.post('/center/inbound/list',params)
  },
  // 查询入库工作量总数
  getInboundCount(params) {
    return axios.post('/center/inbound/count',params)
  },
  // 入库工作量导出
  inboundExport (params) { 
    return axios.get('/center/inbound/export', { params })
  },
  outboundList (data) { // 出库列表
    return axios.post('/center/outbound/list', data)
  },
  outboundCount (data) { // 出库总数查询
    return axios.post('/center/outbound/count', data)
  },
  getCategoryNode(params) {
    return axios.get(`/center/category/all/kv`)
  },
  getAccountCount(dataForm) {
    return axios.post('/center/account/count', dataForm)
  },
  getIntaccountCount(dataForm) {
    return axios.post('/center/intaccount/count', dataForm)
  }
}
