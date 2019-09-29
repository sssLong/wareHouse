import axios from '../common/axiosHttp'
import qs from 'qs'

export default {
    // 获取物流属性列表(可用于查询当前所要新增的物流属性是否已存在)
    getCargoPropList(params) {
        return axios.post('/logistics/basic/selectCargoProp' ,params)
    },
    // 获取国家列表
    getcountryList() {
        return axios.get('/logistics/yuntu/getCountry')
    },
    // 新增或修改物流属性
    addOrEditCargoProp(data) {
        return axios.post('/logistics/basic/editCargoProp', data)
    },
    // 获取平台信息列表(可用于查询当前所要新增的平台信息是否已存在)
    getPlatformList(params) {
        return axios.post('/logistics/basic/selectPlatform' , params)
    },
    // 新增或修改平台信息
    addOrEditPlatform(data) {
        return axios.post('/logistics/basic/editPlatform', data)
    },
    // 获取地址设置列表(可用于查询当前所要新增的平台信息是否已存在)
    getAddressSettingList(params) {
        return axios.post('/logistics/basic/selectMethodAddress' , params)
    },
    // 新增或修改地址设置
    addOrEditAddressSetting(data) {
        return axios.post('/logistics/basic/editMethodAddress', data)
    },
    // 删除地址设置
    delAddressSetting(data) {
        return axios.post('', data)
    },
    // 获取国家级联数据
    getCountryCascader(id = '') {
        return axios.get('/center/region/country?id=' + id)
    },
    // 查询物流揽收商数据
    getSelectCollector(params) {
        return axios.get('/logistics/basic/selectCollector?' + qs.stringify(params))
    },
    // 新增或修改揽收商数据
    addOrEditCollector(data) {
        return axios.post('/logistics/basic/editCollector', data)
    },
    // 揽收商处理失败=>修改订单物流信息
    updateOrderLogistics(type, data) {
      return axios.post(`/outbound/order/updateOrderLogistics/${type}`, data)
    },
    // 物流商处理失败=>批量获取物流面单
    // getLogisticsLabel(data) {
    //   return axios.post('/logistics/centre/getLogisticsLabel', data)
    // },
    // 物流商处理失败=>批量获取物跟踪号
    // getLogisticsTrackingNumber(data) {
    //       return axios.post('/logistics/centre/getLogisticsTrackingNumber', data)
    // },
    // 查询物流商数据
    getLogisticsList(params) {
        return axios.get(`/logistics/basic/selectLogisticsProvider?${qs.stringify(params)}`)
    },
    //添加/修改物流商
    addlogisticsData(params) {
        return axios.post('/logistics/basic/editLogisticsProvider', params)
    },
    //新增/修改邮寄方式
    addEditMethod(params) {
        return axios.post('/logistics/basic/editMethod', params)
    },
    // 查询运输方式数据
    getSelectMethod(params) {
        return axios.get(`/logistics/basic/selectMethod?${qs.stringify(params)}`)
    },
    // 查询运输方式数据  根据id
    getSelectMethodByID(params) {
        return axios.get(`/logistics/basic/selectMethodBasicInfoByID?${qs.stringify(params)}`)
    },

    //查询运输方式列表
    getShippingMethods(params) {
        return axios.get('/logistics/yuntu/getShippingMethods', params)
    },

    //获取国家列表
    getAllCountry(params) {
        return axios.get('/center/region/country', { params })
    },

    //新增&更新运输方式数据
    operatingEditMethod(params) {
        return axios.post('/logistics/basic/editMethod', params)
    },
    //根据物流商id 查询物流方式
    getEditMethod(params) {
        return axios.get(`/logistics/basic/selectMethodListByProviderID?${qs.stringify(params)}`, )
    },
    //新增邮寄方式时效运费数据
    addShiXiaoData(params) {
        return axios.post('/logistics/basic/editMethodZone', params)
    },
    //查询物流面单规格数据
    getInvoiceSpecificationList(params) {
        return axios.get(`/logistics/basic/selectInvoiceSpecification?${qs.stringify(params)}`)
    },
    //新增、修改物流面单数据
    operatingOrder(params) {
        return axios.post(`/logistics/basic/editInvoiceSpecification`, params)
    },
    //新增国家前的判断
    addCountryBefore(params) {
        return axios.get(`/logistics/basic/selectZoneIDByMethodIDCountry?` + qs.stringify(params))
    },
    //删除国家前的判断
    remCountryBefore(params, config) {
        return axios.post(`/logistics/basic/deleteZoneCountry`, params, config)
    },
    //删除分区
    remArea(params, config) {
        return axios.post(`/logistics/basic/deleteZoneByID`, params, config)
    },
    //根据id查询时效运输列表
    basemethodIdList (params){
        return axios.get(`/logistics/basic/selectMethodZoneList?`+qs.stringify(params))
    },
    //根据分区id查询时效运输信息
    basemethodId (params){
        return axios.get(`/logistics/basic/selectZoneByID?`+qs.stringify(params))
    },
    //启用/停用邮寄方式
    enableDisableMethod(params) {
        return axios.post(`/logistics/basic/enableDisableMethod?` + qs.stringify(params))
    },
    //根据运输方式查询当前面单数据
    selectInvoiceSpecification(params){
        return axios.get(`/logistics/basic/selectInvoiceSpecification?` + qs.stringify(params))
    },
    // 集包称重物流渠道
    packageLogistics (params) {
        return axios('/logistics/internal/selectMethodByMethodCollectorRelation', { params })
    }
}
