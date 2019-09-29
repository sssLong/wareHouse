// 销退收货信息
export const returnList = [
    {
        label: '序号',
        width: '50',
        type: "index"
    },
    {
        label: '销退收货单',
        prop: 'sellingBackId',
        width: '150'
    },
    {
        label: '单据状态',
        prop: 'status',
        isCodeTableFormatter: true,
        codeTableCode: 'reject_status'
    },
    {
        label: '来源单号',
        prop: 'sourceId',
        width: '150'
    },
    {
        label: '退货类型',
        prop: 'sellingBackType',
        isCodeTableFormatter: true,
        codeTableCode: 'rejected_type'
    },
    {
        label: '平台',
        prop: 'platform',
    },
    {
        label: '仓库名称',
        prop: 'warehouse',
    },
    {
        label: '运单号',
        prop: 'waybillId',
        width: '150'
    },
    {
        label: '物流商',
        prop: 'logistics',
    },
    {
        label: '接收人',
        prop: 'receiver',
    },
    {
        label: '接收时间',
        prop: 'receiveTime',
        sortable: 'custom',
        'min-width': '140px'
    },
    {
        label: '备注',
        prop: 'remark'
    }
]

export const skuList = [
    {
        label: '序号',
        width: '50',
        type: "index"
    },
    {
        label: 'SKU',
        prop: 'sku',

    },
    {
        label: '产品名称',
        prop: 'productName',
    },
    {
        label: '计划收货数',
        prop: 'plannedQuantity',
    },
    {
        label: '实际收货数',
        prop: 'deliveryQuantity',
    },
    {
        label: '差异数',
        prop: 'differQuantity',
    }
]

export const Tactics = [{
  label: '策略名称',
  prop: 'strategyName',
  "min-width": '120px'
}, {
  label: '策略规则',
  prop: 'strategyRule',
  "min-width": '120px'
}, {
  label: '适用仓库',
  prop: 'warehouse',
  "min-width": '100px',
  isTemplate: true
},
//   {
//   label: '货主',
//   prop: 'shipper',
//   isTemplate: true
// },
  {
  label: '描述',
  prop: 'comment',
  "min-width": '300px',
  "show-overflow-tooltip": true
}, {
  label: '状态',
  prop: 'status',
  width: '100px',
  isTemplate: true
}, {
  label: '操作',
  prop: 'operation',
  width: '120px',
  isTemplate: true
}]

export const ShelfDetailPutaway = [{
  label: 'SKU',
  prop: 'sku'
}, {
  label: '运单号',
  prop: 'waybillNumber'
}, {
  label: '计划上架数',
  prop: 'plannedPutawayNumber'
}, {
  label: '实际上架数',
  prop: 'actualPutawayNumber'
}, {
  label: '推荐货位',
  prop: 'recommendedLocationCode'
}, {
  label: '上架货位',
  prop: 'actualLocationCode'
}, {
  label: '上架人',
  prop: 'operator'
}, {
  label: '上架时间',
  prop: 'putawayTime'
}, {
  label: '生产日期',
  prop: 'produceTime'
}, {
  label: '有效期',
  prop: 'qualityTime'
}, {
  label: '失效日期',
  prop: 'expirationTime'
}]

export const ShelfDetailAbnormal = [{
  label: '异常箱号',
  prop: 'exceptionBoxId'
}, {
  label: 'SKU',
  prop: 'sku'
}, {
  label: '商品数',
  prop: 'amount'
}, {
  label: '生产日期',
  prop: 'produceTime'
}, {
  label: '有效期',
  prop: 'qualityTime'
}, {
  label: '失效日期',
  prop: 'expirationTime'
}, {
  label: '异常上报人',
  prop: 'creater'
}, {
  label: '异常上报时间',
  prop: 'createTime'
}, {
  label: '异常原因',
  prop: 'exceptionCause',
  isTemplate: true
}]

export const ShelfList = [{
  label: '上架单号',
  prop: 'putawayId',
  'min-width': '140px'
},{
  label: '客户名称',
  prop: 'customerName'
},{
  label: '运单号',
  prop: 'waybillNumber',
  'min-width': '100px'
},{
  label: '仓库名称',
  prop: 'warehouseCode',
  isTemplate: true
},{
  label: '容器编号',
  prop: 'boxId'
},{
  label: '单据状态',
  prop: 'putawayStatus',
  isTemplate: true
},{
  label: '来源单号',
  prop: 'sourceOrderNumber'
},{
  label: '来源类型',
  prop: 'sourceType',
  isTemplate: true
},{
  label: '创建人',
  prop: 'createrBy'
},{
  label: '创建时间',
  prop: 'createTime',
  'min-width': '140px',
  sortable: 'custom'
},{
  label: '完成时间',
  prop: 'finishedTime',
  'min-width': '140px',
  sortable: 'custom'
},{
  label: '异常标记',
  prop: 'isException',
  isTemplate: true
}]

export const QcReceiptsList = [{
  label: '质检单号',
  prop: 'qualityControlOrderNumber',
  'min-width': '140px'
}, {
  label: '来源单号',
  prop: 'sourceOrderNumber'
}, {
  label: '运单号',
  prop: 'waybillNumber',
  'min-width': '100px'
}, {
  label: '仓库名称',
  prop: 'warehouse',
  isTemplate: true
}, {
  label: '来源类型',
  prop: 'sourceType',
  isTemplate: true
}, {
  label: '客户名称',
  prop: 'customerName'
}, {
  label: '质检方式',
  prop: 'qcType',
  isTemplate: true
}, {
  label: '单据状态',
  prop: 'orderStatus',
  isTemplate: true
}, {
  label: '创建人',
  prop: 'createBy'
}, {
  label: '创建时间',
  prop: 'createTime',
  'min-width': '140px',
  sortable: 'custom'
}, {
  label: '完成时间',
  prop: 'finishTime',
  'min-width': '140px',
  sortable: 'custom'
}, {
  label: '备注',
  prop: 'remark'
}]

export const QcReceiptsDetailAbnormal = [{
  label: '异常原因',
  prop: 'exceptionCauseId',
  isTemplate: true
}, {
  label: '异常箱号',
  prop: 'exceptionBoxNumber'
}, {
  label: 'SKU',
  prop: 'sku'
}, {
  label: '商品数',
  prop: 'exceptionSkuCount'
}, {
  label: '生产日期',
  prop: 'produceTime'
}, {
  label: '有效期(天)',
  prop: 'qualityTime'
}, {
  label: '失效日期',
  prop: 'expirationTime'
}, {
  label: '异常上报人',
  prop: 'exceptionReporterBy'
}, {
  label: '异常上报时间',
  prop: 'exceptionReporterTime'
}]

export const QcReceiptsDetailCheck = [{
  label: '封箱箱号',
  prop: 'sealBoxSerialNumber',
  isTemplate: true
}, {
  label: 'SKU',
  prop: 'sku'
}, {
  label: '商品数',
  prop: 'qualityControlFinishNumber'
}, {
  label: '质检人',
  prop: 'createBy'
}, {
  label: '质检时间',
  prop: 'skuUpdateTime'
}, {
  label: '质检台号',
  prop: 'qcStationId'
}, {
  label: '有效期(天)',
  prop: 'produceTime'
}, {
  label: '失效日期',
  prop: 'expirationTime'
}]
