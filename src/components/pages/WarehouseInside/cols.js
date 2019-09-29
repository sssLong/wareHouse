/*
 * @Autor: 廖佳星
 * @LastEditors: 廖佳星
 * @LastEditTime: 2019-08-22 15:41:38
 */
// 异常管理表格数据
export const ErrManagementCols = [
    {
        label: '序号',
        type: 'index',
        width: '100'
    },
    {
        label: '异常单号',
        prop: 'exNo',
        width: '180'
    },
    {
        label: '客户名称',
        prop: 'goodsOwner',
    },
    {
        label: '来源类型',
        prop: 'zidingyi1',
        isTemplate: true // 自定义列设置
    },
    {
        label: '来源单号',
        prop: 'sourceNo',
        width: '200'
    },
    {
        label: '异常原因',
        prop: 'zidingyi2',
        isTemplate: true // 自定义列设置
    },
    {
        label: '仓库名称',
        prop: 'warehouseName',
        width: '130'
    },
    {
        label: '运单号',
        prop: 'waybillNo',
        width: '180'
    },
    {
        label: '货主名称',
        prop: 'goodsSupplier',
        width: '130'
    },
    {
        label: '异常货位',
        prop: 'positionCode',
        width: '130'
    },
    {
        label: 'SKU',
        prop: 'goodsSku',
        width: '130'
    },
    {
        label: '产品名称',
        prop: 'skuName',
        width: '130'
    },
    {
        label: '异常数量',
        prop: 'exNumber',
        width: '130'
    },
    {
        label: '处理备注',
        prop: 'handleRemark',
        width: '130'
    }, {
        label: '处理人',
        prop: 'handleBy',
        width: '130'
    },
    {
        label: '处理时间',
        prop: 'handleTime',
        width: '180'
    },
    {
        label: '处理方式',
        prop: 'zidingyi3',
        isTemplate: true // 自定义列设置
    },
    {
        label: '处理数量',
        prop: 'handleNumber',
        width: '130'
    },
    {
        label: '处理状态',
        prop: 'zidingyi4',
        isTemplate: true // 自定义列设置
    },
    // {
    //     label: '异常照片',
    //     prop: 'exPhoto',
    //     width: '130',
    //     isImagePopover: true
    // },
    {
        label: '是否申请报损',
        prop: 'zidingyi5',
        width: '150',
        isTemplate: true // 自定义列设置
    },
    {
        label: '上报人',
        prop: 'createBy',
        width: '130'
    },
    {
        label: '上报时间',
        prop: 'createTime',
        width: '180'
    },
];
// 损溢管理表格数据
export const LossManagementCols = [
    {
        label: '序号',
        type: 'index',
        width: '100'
    },
    {
        label: '客户名称',
        prop: 'customer',
        width: ''
    },
    {
        label: '损溢单号',
        prop: 'lossSpillCode',
        width: '120'
    },
    {
        label: 'SKU',
        prop: 'sku',
        width: '100'
    },
    {
        label: '来源单号',
        prop: 'sourceOrder',
        width: '180'
    },
    {
        label: '货位',
        prop: 'goodsLocation',
        width: '150'
    },
    {
        label: '损溢类型',
        prop: 'lossSpillType',
        width: '100',
        isTemplate: true // 自定义列设置
    },
    {
        label: '损溢数',
        prop: 'lossSpillCount',
        width: '100',
        isTemplate: true // 自定义列设置
    },
    {
        label: '产品名称',
        prop: 'commodityName',
        width: '130'
    },
    {
        label: '处理结果',
        prop: 'disposeResult',
        width: '130',
        isTemplate: true // 自定义列设置
    },
    {
        label: '创建时间',
        prop: 'createTime',
        width: '180'
    },
    {
        label: '创建人',
        prop: 'creator',
        width: '130'
    },
    {
        label: '处理人',
        prop: 'disposePerson',
        width: '130'
    },
    {
        label: '处理时间',
        prop: 'disposeTime',
        width: '180'
    }, {
        label: '审核备注',
        prop: 'auditRemark',
        width: '130'
    },
    {
        label: '来源类型',
        prop: 'sourceType',
        width: '130',
        isTemplate: true // 自定义列设置
    }
];
// 添加盘点单表格数据
export const TakeStockAddCols = [
    {
        label: '序号',
        type: 'index',
        width: '80'
    },
    {
        label: '客户名称',
        prop: 'customer',
        width: '100'
    },
    {
        label: '库区',
        prop: 'areaName',
        width: '100'
    },
    {
        label: '货列',
        prop: 'rowCode',
        width: '100'
    },
    {
        label: '货架',
        prop: 'shelvesCode',
        width: '100'
    },
    {
        label: '货位',
        prop: 'positionCode',
        width: '100'
    },
    {
        label: 'SPU',
        prop: 'goodsSpu',
        width: '130'
    },
    {
        label: 'SKU',
        prop: 'goodsSku',
        width: '130'
    },
    {
        label: '产品名称',
        prop: 'skuName',
    },
    {
        label: '库存数',
        prop: 'inventory',
        width: '130',
        isTemplate: true // 自定义列设置
    }
];
// 盘点计划单表格数据
export const TakeStockPlanCols = [
    {
        label: '序号',
        type: 'index',
        width: '80'
    },
    {
        label: '盘点单号',
        prop: 'inventoryId',
        width: '150'
    },
    {
        label: '客户名称',
        prop: 'customer',
        width: '100'
    },
    {
        label: '创建时间',
        prop: 'createTime',
        width: '180'
    },
    {
        label: '创建人',
        prop: 'creator',
        width: '100'
    },
    {
        label: '盘点状态',
        prop: 'inventoryStatus',
        width: '100'
    },
    {
        label: '盘点类型',
        prop: 'inventoryType',
        width: '100'
    },
    {
        label: '盘点仓库',
        prop: 'warehouse',
        width: '130'
    },
    {
        label: '盘点货位数',
        prop: 'goodsLocationCount',
        width: '130'
    },
    {
        label: '盘点SKU数',
        prop: 'totalSku',
        width: '130'
    },
    {
        label: '单据来源',
        prop: 'dataSource',
        width: '130'
    },
    {
        label: '盘点任务单数',
        prop: 'inventoryTaskCount',
        width: '130'
    },
    {
        label: '取消人',
        prop: 'cancelPerson',
        width: '130'
    },
    {
        label: '取消时间',
        prop: 'cancelTime',
        width: '180'
    },
    {
        label: '盘点人',
        prop: 'inventoryPerson',
        width: '100'
    },
    {
        label: '来源单号',
        prop: 'sourceOrder',
        width: '130'
    }
];
// 盘点计划单详情表格数据
export const TakeStockPlanDetails = [
    {
        label: '序号',
        type: 'index',
        width: '100'
    },
    {
        label: '库区',
        prop: 'warehouseAreaName',
        width: '150'
    },
    {
        label: '货位',
        prop: 'goodsPositionCode',
        width: '200'
    },
    {
        label: 'SKU',
        prop: 'sku',
        width: '200'
    },
    {
        label: '产品名称',
        prop: 'skuName',
    },
    {
        label: '库存数',
        prop: 'skuCount',
        width: '150'
    }
];

// 盘点单结果表格数据
export const TakeStockResultCols = [
    {
        label: '序号',
        type: 'index',
        width: '100'
    },
    {
        label: '盘点单号',
        prop: 'inventoryId',
        width: '180'
    },
    {
        label: '客户名称',
        prop: 'customer',
        width: '100'
    },
    {
        label: '创建时间',
        prop: 'createTime',
    },
    {
        label: '创建人',
        prop: 'creator',
        width: '100'
    },
    {
        label: '盘点状态',
        prop: 'inventoryStatus',
    },
    {
        label: '盘点类型',
        prop: 'inventoryType',
        width: '130'
    },
    {
        label: '盘点仓库',
        prop: 'warehouse',
        width: '130'
    },
    {
        label: '有无差异',
        prop: 'inventoryResult',
        width: '100'
    }
];

// 盘点单结果详情表格数据
export const TakeStockResultDetailsCols = [
    {
        label: '序号',
        type: 'index',
        width: '80'
    },
    {
        label: '货位',
        prop: 'goodsPositionCode',
        width: '130'
    },
    {
        label: 'SKU',
        prop: 'sku',
        width: '130'
    },
    {
        label: '库存数',
        prop: 'skuCount',
        width: '100'
    },
    {
        label: '初盘数',
        prop: 'inventoryActualCount',
    },
    {
        label: '复盘数',
        prop: 'secondInventoryActualCount',
    },
    {
        label: '盘点结果',
        prop: 'zidingyi2',
        isTemplate: true // 自定义列设置
    },
    {
        label: '差异数',
        prop: 'zidingyi1',
        isTemplate: true // 自定义列设置
    },
    {
        label: '初盘人',
        prop: 'inventoryPerson',
    },
    {
        label: '初盘开始时间',
        prop: 'inventoryBeginTime', 
        width: '180'
    },
    {
        label: '初盘结束时间',
        prop: 'inventoryEndTime', 
        width: '180'
    },
    {
        label: '复盘人',
        prop: 'secondInventoryPerson',
    },
    {
        label: '复盘开始时间',
        prop: 'secondInventoryBeginTime', 
        width: '180'
    },
    {
        label: '复盘结束时间',
        prop: 'secondInventoryEndTime', 
        width: '180'
    },
    {
        label: '任务单号',
        prop: 'inventoryTaskId',
        width: '150'
    },
    {
        label: '已转损溢',
        prop: 'zidingyi3',
        width: '80',
        isTemplate: true // 自定义列设置
    },
    {
        label: '生成损溢时间',
        prop: 'createProfitOrLossTime',
        width: '180'
    },
    {
        label: '产品名称',
        prop: 'skuName',
        width: '130'
    }
];

// 盘点任务单表格数据
export const TakeStockTaskCols = [
    {
        label: '序号',
        type: 'index',
        width: '80'
    },
    {
        label: '盘点单号',
        prop: 'inventoryId',
        width: '180'
    },
    {
        label: '任务单号',
        prop: 'inventoryTaskId',
        width: '180'
    },
    {
        label: '盘点仓库',
        prop: 'warehouse',
        width: '130'
    },
    {
        label: '客户名称',
        prop: 'customer',
        width: '130'
    },
    {
        label: '任务单状态',
        prop: 'taskStatus',
        width: '100'
    },
    {
        label: '货架数',
        prop: 'goodsShelveCount',
        width: '100'
    },
    {
        label: '货位数',
        prop: 'goodsLocationCount',
        width: '100'
    },
    {
        label: 'SKU数',
        prop: 'totalSku',
        width: '120'
    },
    {
        label: '库存数',
        prop: 'totalStock',
        width: '120'
    },
    {
        label: '创建时间',
        prop: 'createTime',
        width: '180'
    },
    {
        label: '创建人',
        prop: 'creator',
        width: '100'
    },
    {
        label: '取消人',
        prop: 'cancelPerson',
        width: '100'
    },
    {
        label: '取消时间',
        prop: 'cancelTime',
        width: '180'
    }
];

// 盘点任务单详情表格数据
export const TakeStockTaskDetails = [
    {
        label: '序号',
        type: 'index',
        width: '100'
    },
    {
        label: '库区',
        prop: 'warehouseAreaName',
        width: '150'
    },
    {
        label: '货位',
        prop: 'goodsPositionCode',
        width: '200'
    },
    {
        label: 'SKU',
        prop: 'sku',
        width: '200'
    },
    {
        label: '产品名称',
        prop: 'skuName',
    },
    {
        label: '库存数',
        prop: 'skuCount',
        width: '150'
    }
];
