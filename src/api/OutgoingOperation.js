import axios from '../common/axiosHttp'

export default {
  // 根据sku获取图片信息
  getSkuImg(params) {
    return axios.get('/center/sku/skuImg', { params })
  },
  // 订单池列表查询
  getOrderList(params) {
    return axios.get('/outbound/order/findList', { params })
  },
  // 库存分配和手动分配
  manualCreate(type, params, config) {
    return axios.post('/outbound/order/manualCreate/' + `${type}`,params, config)
  },
  // 订单池详情页查询
  getOrderDetailList(id) {
    return axios.get('/outbound/order/findOrder/' + `${id}`)
  },
  // 复核管理列表查询
  getRecheckManageList(params) {
    return axios.get('/outbound/reviewOrder/findList', { params })
  },
  // 复核管理详情页 复核任务列表查询
  getRecheckTaskList(reviewNum, params) {
    return axios.get('/outbound/reviewOrder/findDetailsList/' + `${reviewNum}`, { params })
  },
  // 复核管理详情页 复核打包列表查询
  getRecheckPackingList(reviewNum, params) {
    return axios.get('/outbound/reviewOrder/findPackingList/' + `${reviewNum}`, { params })
  },
  // 根据sku 获取产品图片信息 
  getProductInfo(params) {
    return axios.get('/center/sku/skuInfo', { params })
  },
  // 复核管理详情页 复核播种明细列表查询
  getRecheckSowingList(reviewNum, params) {
    return axios.get('/outbound/reviewOrder/findSowingDetails/' + `${reviewNum}`, { params })
  },
  // 多品播种操作列表扫描拣货单 + 容器号
  getSowingList(params) {
    return axios.get('/outbound/sowing/findOperatingList', { params })
  },
  // 播种车提交更新数据!
  carSubmit(car,pickingNum) {
    return axios.put(`/outbound/sowing/updateOperatingCar/${car}/${pickingNum}`)
  },
  // 根据拣货单ID查询播种信息
  getSowingPlaceList(pickingNum,params) {
    return axios.get(`/outbound/sowing/findSowingMessage/${pickingNum}`,{ params })
  },
   // 单品复核操作列表扫描拣货单 + 容器号 
   getSingleOrderList(params) { 
    return axios.get('/outbound/reviewOrder/findSingleList', { params })
  },
  // 单品复核数据提交 & 多品复核数据提交 [包裹号 + sku] [退供 + 调拨 单品也可以使用]
  reviewSubmit(type,params) {
    return axios.put('/outbound/reviewOrder/updateSingleOrMultiple/' + `${type}`, params )
  },
  // 异常上报  弃用
  addEx(params) {
    return axios.post('/center/exInventory/addEx',  params )
  },
   // 异常上报 批量
   batchAddEx(params) {
    return axios.post('/center/exInventory/batchAddEx',  params )
  },
  // 异常上报成功 调用此接口 
  reportException(packageNum,type) {
    return axios.put('/outbound/reviewOrder/reportException/'  + `${packageNum}` + '/' + `${type}` )
  },
  //  单品复核完成
  reviewSingleComplete(pickingNum) {
    return axios.post('/outbound/reviewOrder/reviewSingleComplete/' + `${pickingNum}` )
  },
  // 多品复核完成
  reviewMultipleComplete(packageNum) {
    return axios.post('/outbound/reviewOrder/reviewMultipleComplete/' + `${packageNum}` )
  },
  // 查询多品复核单 [退供 + 调拨 也可以使用] 没查询到说明是错误
  getMultipleOrderList(params) {
    return axios.get('/outbound/reviewOrder/findMultiList', { params })
  },
  // 查询退供 + 调拨复核数据 没查询到说明是错误的
  findAllocateList(params) {
    return axios.get('/outbound/reviewOrder/findAllocateList', { params })
  },
  // 播种扫描SKU是此订单, 调用此方法修改次数,扫一次提交一次
  updateSowing(type,params) {
    return axios.put('/outbound/sowing/updateSowing/' + `${type}`, params )
  },
  // 播种差异的。全部提交 ; 没差异的不用提交!
  updateDifferencesSowing(pickingNum,params) {
    return axios.put('/outbound/sowing/updateDifferencesSowing/' + `${pickingNum}`, params )
  },
  // 获取质检台键值信息(编码,名称)
  getQualityInspectionStation(params) {
    return axios.get('/center/qc/kv',{params})
  },
  // 复核补打印列表查询
  getRePrintList(params) {
    return axios.get('/outbound/reviewOrder/findPrintList', { params })
  },
  // 获取面单信息数组数据
  getPrintData(url) {
    return axios.get(url)
  },
  // 根据仓库编码获取仓库信息 仓库名称
  getWarehoseDetail(params) {
    return axios.get('/center/warehouse/detail', { params })
  },
  // 拣货相关接口
  pickingOrderList(params) { // 拣货单列表
    return axios(`/outbound/pickingOrder/findList`, { params })
  },
  findGeneratePickingOrder (data) { // 找到要生成的拣货单
    return axios.post('/outbound/pickingOrder/findOrderCreatePicking', data)
  },
  generatePickingOrder (data) { // 生成拣货单
    return axios.post('/outbound/pickingOrder/createPickingOrder', data)
  },
  pickingOrderDetail ({ pickingNum }) { // 拣货单详情
    return axios(`/outbound/pickingOrder/findReviewOrder/${pickingNum}`)
  },
  pickingAreaList (params) { // 拣选区域
    return axios('/center/area/kv', { params })
  },
  // 集包相关接口
  findOrderDetails (params) { // 根据运单号号查询订单详情[ 主要用在集包称重 ]
    return axios(`/outbound/order/findOrderDetails/${params.waybillNum}`)
  },
  findOrderDetails2 (params) { // 根据包裹号查询订单详情
    return axios(`/outbound/order/findOrder/${params.packageNum}`)
  },
  generatePackageOrderNum (data) { // 生成集包单
    return axios.post('/outbound/packageOrder/addPackage', data)
  },
  addPackageToList (data) { // 添加订单到集包单
    return axios.post('/outbound/packageOrder/addPackageDetails', data)
  },
  finishPack ({ packageOrderNum }) { // 集包完成
    return axios.put(`/outbound/packageOrder/updatePackage/${packageOrderNum}`)
  },
  // 集包管理
  packageOrderList(params) { // 集包单查询
    return axios('/outbound/packageOrder/findList', { params })
  },
  packageDetailList(params) { // 集包单详情里列表
    return axios(`/outbound/packageOrder/findList/${params.packageOrderNum}`, { params })
  },
  packageOrderDetail({ packageOrderNum }) { // 集包单详情
    return axios(`/outbound/packageOrder/findPackageOrder/${packageOrderNum}`)
  },
  disbandPackage({ packageOrderNum }) { // 解散集包单
    return axios.post(`/outbound/packageOrder/disbandPackage/${packageOrderNum}`)
  },
  // 发货相关接口
  createDeliveryOrder (data) { // 创建发货单
    return axios.post('/outbound/packageOrder/createDeliveryOrder', data)
  },
  deliveryOrderList (params) { // 获取发货单列表
    return axios('/outbound/delivery/findList', { params })
  },
  deliveryDetail ({ deliveryOrderNum }) { // 发货单详情
    return axios(`/outbound/delivery/findDeliveryOrder/${deliveryOrderNum}`)
  },
  deliveryOver (data) { // 发货结单
    return axios.post('/outbound/delivery/billDeliveryOrder', data)
  }
}
