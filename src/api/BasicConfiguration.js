import axios from '../common/axiosHttp'
// import qs from 'qs' // 根据需求来确定是否需要

export default {
    // 查询SKU信息列表
    getSkuList(params) {
        return axios.post('/center/sku/list', params)
    },
    // 查询SKU详情
    getSkuInfo(params) {
        return axios.get('/center/sku/info', { params })
    },
    // 查询供应商列表
    getSupplierList(params) {
        return axios.post('/center/supplier/list', params)
    },
    // 根据货主的dataName获取相应的供应商列表
    getSupplierByName(dataName) {
        return axios.get('/center/supplier/kv?ownerOfCargo=' + dataName)
    },
    // 查询供应商货主信息
    getSupplierOwner() {
        return axios.get('/center/supplier/owner/kv')
    },
    // 查询供应商详情
    getSupplierInfo(params) {
        return axios.get('/center/supplier/info', { params })
    },
    // 查询码表值
    getDictCode(params) {
        return axios.get('/center/dict/code', { params })
    },
    // 批量查询码表值
    getDictCodes(params) {
        return axios.get('/center/dict/codes', { params })
    },
    // 查询码表信息
    getCodeList(params) {
        return axios.post('/center/dict/list', params)
    },
    // 查询码表详情
    getCodeInfo(params) {
        return axios.get('/center/dict/info', { params })
    },
    // 新增码表
    addCode(params) {
        return axios.post('/center/dict/add', params)
    },
    // 修改码表
    updateCode(params) {
        return axios.put('/center/dict/update', params)
    },
    // 添加仓库
    addWarehouse(params) {
        return axios.post(`/center/warehouse/add`, params)
    },
    // 查询仓库详情
    infoWarehouse(params) {
        return axios.get(`/center/warehouse/info`, { params })
    },
    // 查询仓库信息列表
    listWarehouse(params) {
        return axios.post(`/center/warehouse/list`, params)
    },
    // 修改仓库
    updateWarehouse(params) {
        return axios.put(`/center/warehouse/update`, params)
    },
    // 获取仓库类型信息
    getWarehouseType(params) {
        return axios.get(`/center/warehouse/getWarehouseType`, params)
    },
    //  仓库 启用/禁用
    stateWarehouse(param, param1) {
        return axios.put(`/center/warehouse/alt?state=` + param + `&id=` + param1)
    },
    //  添加库区信息
    addArea(params) {
        return axios.post(`/center/area/add`, params)
    },
    //  修改库区信息
    updateArea(params) {
        return axios.put(`/center/area/update`, params)
    },
    //  获取库区信息
    infoArea(params) {
        return axios.get(`/center/area/info`, { params })
    },
    //  获取库区键值信息
    kvArea(params) {
        return axios.get(`/center/area/kv`, { params })
    },
    //  获取库区详情信息
    detailArea(params) {
        return axios.get(`/center/area/detail`, { params })
    },
    //  查询库区列表信息
    listArea(params) {
        return axios.post(`/center/area/list`, params)
    },
    //  库区 启用/禁用
    stateArea(param, params) {
        return axios.put(`/center/area/list/state?state=` + param, params)
    },
    //  添加货列信息
    addRow(params) {
        return axios.post(`/center/row/add`, params)
    },
    //  启用/禁用货列
    useRow(param, params) {
        return axios.put(`/center/row/alt?state=` + param, params)
    },
    //  查询货列信息
    listRow(params) {
        return axios.post(`/center/row/list`, params)
    },
    //  获取货列编码
    kvRow(params) {
        return axios.get(`/center/row/kv`, { params })
    },
    //  查询新添货位页面分类信息
    goodsPositionInfo(params) {
        return axios.post(`/center/position/goodsPositionInfo`, params)
    },
    //  新增货位信息
    addPosition(params) {
        return axios.post(`/center/position/add`, params)
    },
    //  锁定/解锁货位
    lockPosition(param, params) {
        return axios.put(`/center/position/alt?state=` + param, params)
    },
    //  查询货位信息
    listPosition(params) {
        return axios.post(`/center/position/list`, params)
    },
    //  导入 容器信息
    importContainer(params, config) {
        return axios.post(`/center/container/import`, params, config)
    },
    //  启用/禁用 容器信息
    useContainer(param, params) {
        return axios.put(`/center/container/alt?state=` + param, params)
    },
    //  查询 容器信息
    listContainer(params) {
        return axios.post(`/center/container/list`, params)
    },
    //  导出 容器信息
    exportContainer(params) {
        return axios.post(`/center/container/export`, params)
    },
    //  新添工作台
    addQc(params) {
        return axios.post(`/center/qc/add`, params)
    },
    //  启用/禁用 工作台
    useQc(param, params) {
        return axios.put(`/center/qc/alt?state=` + param, params)
    },
    //  查询工作台信息
    listQc(params) {
        return axios.post(`/center/qc/list`, params)
    },
    //  导出工作台信息
    exportQc(params) {
        return axios.post(`/center/qc/export`, params)
    },
    //获取国家数据
    getcountry(params) {
        return axios.get(`/center/region/country`, { params })
    },
    //  获取省数据
    getProv(params) {
        return axios.get(`/center/region/prov`, params)
    },
    //  获取市数据
    getCity(params) {
        return axios.get(`/center/region/city`, { params })
    },
    //  获取区数据
    getArea(params) {
        return axios.get(`/center/region/area`, { params })
    },
    // 查询分类
    getCategory(params) {
        return axios.post(`/center/category/list`, params)
    },
    // 查询子分类
    childCategory(params) {
        return axios.get(`/center/category/kv`, { params })
    },
    // 新增分类
    addCategory(params) {
        return axios.post(`/center/category/add`, params)
    },
    // 修改分类
    updateCategory(params) {
        return axios.put(`/center/category/update`, params)
    },
    // 删除分类
    deleteCategory(params) {
        return axios.delete(`/center/category/delete`, { params })
    },
    // 查询所有一级分类
    kvCategory(params) {
        return axios.get(`/center/category/kv`, params)
    },
    // 查询账号姓名列表
    getAccountName(params) {
        return axios.get(`/user/user/getAccountNameListByWarehouseId`, { params })
    },
}