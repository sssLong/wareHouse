import axios from '../common/axiosHttp'
import qs from 'qs'

export default {
//后台接口2.0版本
    // 分页查询盘点详情信息用于 查询盘点计划单明细  和  查询盘点任务单明细
    pageQueryDetail(params){
        return axios.get(`/warehouse/new/inventoryDetailMesaage/pageQueryInventoryDetailMessage`,{params})
    },
//  盘点计划单
    // 分页查询盘点计划单
    AQPlanList(params){
        return axios.get(`/warehouse/new/inventoryMesaage/pageQueryInventoryMessage`,{params})
    },
    // 盘点计划单号查询详情
    PlanInventoryId(params){
        return axios.get(`/warehouse/new/inventoryMesaage/selectInventoryMessageByInventoryId`,{params})
    },
    // 盘点计划单取消
    cancelInventoryOrder(params){
        return axios.post(`/warehouse/new/inventoryMesaage/cancelInventoryOrder`,params)
    },
    
//  盘点任务单
    //  分页查询盘点任务单
    AQTaskList(params){
        return axios.get(`/warehouse/new/inventorycTaskMesaage/pageQueryInventoryTaskMessage`,{params})
    },
    //  盘点任务单号查询详情
    TaskInventoryTaskId(params){
        return axios.get(`/warehouse/new/inventorycTaskMesaage/selectInventoryTaskByInventoryTaskId`,{params})
    },
//  盘点结果
    // 分页查询盘点结果
    AQInventoryResult(params){
        return axios.get(`/warehouse/new/inventoryMesaage/selectInventoryResult`,{params})
    },
    // 分页查询盘点结果明细
    AQInventoryId(params){
        return axios.get(`/warehouse/new/inventoryDetailMesaage/selectInventoryResultDetailByInventoryId`,{params})
    },
    // 生成损溢单
    addLossSpillInfo(params){
        return axios.post(`/warehouse/lossSpill/addLossSpillInfo`,params)
    },
    



    
// 添加盘点单
    // 多条件查询盘点库存
    manyConditions(params){
        return axios.post(`/center/shelfInventory/manyConditions`,params)
    },
    // 创建盘点单
    addCondition(params){
        return axios.post(`/warehouse/new/inventoryMesaage/createInventoryOrder`,params)
    },
    // 查询库区
    AQareaCode(params){return axios.get(`/center/area/kv`,{params})},
    // 查询货列
    AQrowCode(params){return axios.get(`/center/row/kv/`+params)},
    
// 损溢管理
    // 分页查询损溢管理
    AQLossList(params){return axios.post(`/warehouse/lossSpill/getLossSpillList`,params)},
    // 损溢管理处审核
    Lossaudit(params){return axios.post(`/warehouse/lossSpill/audit`,params)},
    // 模糊带出（创建人、处理人名称）
    likePersonName(params){return axios.post(`/warehouse/lossSpill/likePersonName`,qs.stringify(params))},
    
// 异常管理
    // 分页查询异常管理
    AQExInventory(params){return axios.get(`/center/exInventory/getList`,{params})},
    // 查询异常详情
    AQExInventoryID(params){
        return axios.get(`/center/exInventory/getDetail`,{params})
    },
    // 处理异常
    errUpdateEx(params){return axios.post(`/center/exInventory/updateEx`,params)},
    // 通过SKU获取打印条码信息
    printGoodsSku(params){return axios.get(`/center/exInventory/getBarByGoodsSku?goodsSkus=`+params)},
    // 获取报损明细列表
    AQLossDetails(params){return axios.get(`/center/exInventory/getLossDetails?exIds=`+params)},
    // 提交申请报损
    updateLossDetails(params){return axios.post(`/center/exInventory/updateLossDetails`,params)}
    

    // 根据单号查询盘点明细， 计划单和任务单
    // pageQueryDetail(params){return axios.get(`warehouse/inventoryDetailMesaage/pageQueryInventoryDetailMessage`,{params})},
    
// 盘点计划单
    // 分页查询盘点计划单
    // AQPlanList(params){return axios.get(`/warehouse/inventoryMesaage/pageQueryInventoryMessage`,{params})},
    // 通过盘点单号查询计划单详情
    // PlanInventoryId(params){return axios.get(`/warehouse/inventoryMesaage/selectInventoryMessageByInventoryId`,{params})},

// 盘点任务单
    // 分页查询盘点任务单
    // AQTaskList(params){return axios.get(`/warehouse/inventorycTaskMesaage/pageQueryInventoryTaskMessage`,{params})},
    // 通过任务单号查询任务单详情
    // TaskInventoryTaskId(params){return axios.get(`/warehouse/inventorycTaskMesaage/selectInventoryTaskByInventoryTaskId`,{params})},

// 盘点单结果
    // 分页查询盘点结果
    // AQInventoryResult(params){return axios.get(`/warehouse/inventoryMesaage/selectInventoryResult`,{params})},
    // 通过盘点单号查询盘点结果明细-分页
    // AQInventoryId(params){return axios.get(`/warehouse/inventoryDetailMesaage/selectInventoryResultDetailByInventoryId`,{params})},

}