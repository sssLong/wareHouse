// 订单池列
export const OrderPoolCols = [
{
  label: '包裹号',
  prop: 'packageNum',
  width: '150',
  sortable: true
},
{
  label: '订单号',
  prop: 'orderNum',
  width: '150',
  sortable: true

},
{
  label: '订单类型',
  prop: 'orderType',
  isCodeTableFormatter: true,
  sortable: true,
  width: '100',


},
{
  label: '包裹状态',
  prop: 'orderStatus',
  isCodeTableFormatter: true,
  codeTableCode: 'package_status',
  'min-width': '120px',
  sortable: true

},
{
  label: '包裹类型',
  prop: 'packageType',
  isCodeTableFormatter: true,
  codeTableCode: 'package_type'
},
{
  label: '买家',
  prop: 'buyer',

},
{
  label: '发货仓库',
  prop: 'warehouseName',
},
{
  label: '邮寄方式',
  prop: 'mailingMethod',
  'min-width': '150px',
},
{
  label: '目的地',
  prop: 'destination',
},
{
  label: '优先级',
  prop: 'priority',
  isTemplate: true // 需要时设置
},
{
  label: '最迟发货时间',
  prop: 'latestDeliveryTime',
  width: '160', // 需要时设置
  sortable: true

},
{
  label: '付款时间',
  prop: 'paymentTime',
  width: '160', // 需要时设置
  sortable: true

},
{
  label: '销售渠道',
  prop: 'salesChannels',
  isTemplate: true, // 需要时设置
  sortable: true,
  width: '100',


  // isCodeTableFormatter: true,
  // codeTableCode: 'sales_channel'
},
{
  label: '备注',
  prop: 'remark',
  width: '150', // 需要时设置
  // isTemplate: true // 需要时设置
},

];
// 订单池详情页列
export const OrderPoolDetailsCols = [
{
  label: 'SKU',
  prop: 'sku',
},

{
  label: '名称',
  prop: 'sName',
},

{
  label: '数量',
  prop: 'number',
},

{
  label: '单位',
  prop: 'unit',
},

{
  label: '品质',
  prop: 'quality',
},

{
  label: '品类',
  prop: 'category',
},
{
  label: '备注',
  prop: 'remark',
},

]
// 复核管理表格列
export const RecheckManageCols = [{
  label: '仓库',
  prop: 'warehouseName',
  isTemplate: true
},
{
  label: '复核单号',
  prop: 'reviewNum',
  width: '160',
  sortable: true,
},
{
  label: '来源单号',
  prop: 'sourceOrderNum',
  width: '160',
  sortable: true,
},
{
  label: '来源类型',
  prop: 'sourceOrderType',
},
{
  label: '复核单状态',
  prop: 'reviewStatus',
  isTemplate: true,
  sortable: true,
  width: 120
},
{
  label: '订单类型',
  prop: 'orderType',
  isTemplate: true
},
{
  label: '包裹类型',
  prop: 'packageType',
  isTemplate: true,
  sortable: true,
  width: 100
},
{
  label: '包裹数',
  prop: 'packageNumber',
},
{
  label: '计划商品数',
  prop: 'planProductNum',
  width: 100
},
{
  label: '实际商品数',
  prop: 'actualProductNum',
  width: 100
},
{
  label: '差异数',
  prop: 'differenceNum',
},
{
  label: '创建人',
  prop: 'userName',
},
{
  label: '创建时间',
  prop: 'createTime',
  width: '160',
  sortable: true,
},
{
  label: '差异标记',
  prop: 'differenceMark',
  isTemplate: true,
  sortable: true,
  width: 100
},
{
  label: '取消标记',
  prop: 'cancelMark',
  isTemplate: true,
  sortable: true,
  width: 100
}
]

// 复核管理详情页表格 复核任务表格列
export const ReviewTaskCols = [
  {
    label: '箱号',
    prop: 'crateNum',
    sortable: true,
  },
  {
    label: '包裹号',
    prop: 'packageNum',
    width: '150',
    sortable: true,
  },
  {
    label: '任务状态',
    prop: 'taskStatus',
    isTemplate: true,
    sortable: true,
  },
  {
    label: '包裹类型',
    prop: 'packageType',
    isTemplate: true,
    sortable: true,
  },
  {
    label: 'SKU',
    prop: 'sku'
  },
  {
    label: '商品名称',
    prop: 'sName',
    width: '150'
  },
  {
    label: '拣货数',
    prop: 'pickingNum'
  },
  {
    label: '复核数',
    prop: 'reviewNum'
  },
  {
    label: '差异数',
    prop: 'differenceNum'
  },
  {
    label: '差异标记',
    prop: 'differenceMark',
    isTemplate: true,
    sortable: true,
  },
  {
    label: '取消标记',
    prop: 'cancelMark',
    isTemplate: true,
    sortable: true,
  },
  {
    label: '复核人',
    prop: 'reviewUserName'
  },
  {
    label: '复核时间',
    prop: 'reviewTime',
    width: '160',
    sortable: true,
  }
  // {
  //   label: '异常货位',
  //   prop: 'abnormalLocation'
  // },
]

// 复核管理详情页表格 打包列表列
export const PackagingCols = [
  {
    label: '包裹号',
    prop: 'packageNum',
    width: '150',
    sortable: true,
  },
  {
    label: '渠道/账号',
    prop: 'channelAccount',
    width: '150',
    sortable: true,
  },
  {
    label: '运单号',
    prop: 'waybillNum',
    width: '150',
    sortable: true,
  },
  {
    label: '跟踪号',
    prop: 'trackingNum',
    width: '150',
    sortable: true,
  },
  {
    label: '包装数',
    prop: 'numberOfPackages'
  },
  {
    label: 'SKU种类数',
    prop: 'skuSum'
  },
  {
    label: '包装人',
    prop: 'packagesUserName'
  },
  {
    label: '包装时间',
    prop: 'packagesTime',
    width: '160',
    sortable: true,
  },
  {
    label: '取消标记',
    prop: 'cancelMark',
    isTemplate: true
  },
  {
    label: '邮寄方式',
    prop: 'mailingMethod'
  },
]

// 复核管理详情页表格 播种明细列
export const SowDetailCols = [
  {
    label: '周转箱号',
    prop: 'crateNum',
    sortable: true,
  },
  {
    label: '包裹号',
    prop: 'packageNum',
    width: '150',
    sortable: true,
  },
  {
    label: '运单号',
    prop: 'waybillNum',
    width: '150',
    sortable: true,
  },
  {
    label: '跟踪号',
    prop: 'trackingNum',
    width: '150',
    sortable: true,
  },
  {
    label: '播种人',
    prop: 'sowingUserName'
  },
  {
    label: '播种时间',
    prop: 'sowingTime',
    width: '160',
    sortable: true,
  },
  {
    label: '差异处理',
    prop: 'differenceMark',
    isTemplate: true,
    sortable: true,
  },
  {
    label: '取消标记',
    prop: 'cancelMark',
    isTemplate: true,
    sortable: true,
  },
  {
    label: '邮寄方式',
    prop: 'mailingMethod'
  },
]

export const DeliveryCols = [{
  label: '序号',
  type: 'index',
  width: '50'
},
{
  label: '仓库',
  prop: 'warehouseName',
  isTemplate: true
},
{
  label: '发货单号',
  prop: 'deliveryOrderNum',
  sortable: 'custom',
  width: 150
},

{
  label: '发货单状态',
  prop: 'deliveryStatus',
  isCodeTableFormatter: true,
  codeTableCode: 'send_status',
  sortable: 'custom',
  width: 120
},

{
  label: '订单类型',
  prop: 'orderType',
  sortable: 'custom',
  isCodeTableFormatter: true
},

{
  label: '揽收商',
  prop: 'receiver',
  sortable: 'custom'
},

{
  label: '总袋数',
  prop: 'bagSum',
},
{
  label: '总包裹数',
  prop: 'packageWeightSum'
},
{
  label: '总重量(kg)',
  prop: 'weightSum',
  width: 110
},
{
  label: '创建人',
  prop: 'createUserName',
},
{
  label: '创建时间',
  prop: 'createTime',
  sortable: 'custom',
  width: '160'
},
]

export const DeliveryDetailsCols = [{
  label: '序号',
  type: 'index',
  width: '50'
},
{
  label: '集包单号',
  sortable: true,
  prop: 'packageOrderNum',
},
{
  label: '邮寄方式',
  sortable: true,
  prop: 'mailingMethod',
},
{
  label: '提货方式',
  prop: 'canvasser',
},
{
  label: '包裹数',
  prop: 'packageSum',
},
{
  label: '总重量(kg)',
  prop: 'packageWeightSum',
  width: 110
},
{
  label: '集包人',
  prop: 'packageUserName',
},
{
  label: '集包开始时间',
  sortable: true,
  prop: 'packageStartTime',
},
{
  label: '集包结束时间',
  sortable: true,
  prop: 'packageEndTime',
},
]

//复核出库  多品播种
export const MultipleSowing = [
{
  label: '拣货单号',
  prop: 'pickingNum',
},
{
  label: '包裹类型',
  prop: 'packageType',
  isCodeTableFormatter: true,
  codeTableCode: 'package_type'
},
{
  label: '作业开始时间',
  prop: 'startTime',
  width: '160'
},
{
  label: '作业人员',
  prop: 'userName',
},
{
  label: '状态',
  prop: 'pickingStatus',
  isCodeTableFormatter: true,
  codeTableCode: 'picking_status'

},
// {
//   label: '备注',
//   prop: 'remark',
// },
]
//复核出库  多品播种页面
export const MultipleSowingInfo = [{
  label: '播种位',
  prop: 'index',
},
{
  label: '包裹号',
  prop: 'packageNum',
  width: '150'
},
{
  label: '已播/未播',
  prop: 'nSow_ySow',
  isTemplate: true

},
{
  label: '运单号',
  prop: 'waybillNum',
  width: '150'
},
{
  label: '状态',
  prop: 'status',
  isTemplate: true
},
{
  label: '打印时间',
  prop: 'printTime',
  width: '160'
},
]
//复核出库  单品复核
export const singlesowing = [
{
  label: '运单号',
  prop: 'waybillNum',
  width: '150'
},
{
  label: '包裹号',
  prop: 'packageNum',
  width: '150'
},
{
  label: '商品条码',
  prop: 'sku',
},
{
  label: '商品名称',
  prop: 'sName',
  width: '150'
}, {
  label: '订购数',
  prop: 'pickingNum',
}, {
  label: '已检数',
  prop: 'reviewNum',
}, {
  label: '差异数',
  prop: 'differenceNum',
}, {
  label: '状态',
  prop: 'taskStatus',
  isCodeTableFormatter: true,
  codeTableCode: 'review_task_status'
}, {
  label: '差异标记',// 取两个字段决定的 先 判断 差异  在判断取消， 差异优先
  prop: 'differenceMark',
  isCodeTableFormatter: true,
  codeTableCode: 'differential_markers'
}, 
{
  label: '取消标记',// 取两个字段决定的 先 判断 差异  在判断取消， 差异优先
  prop: 'cancelMark',
  isCodeTableFormatter: true,
  codeTableCode: 'unmark'
},{
  label: '打印时间',// 暂取复核时间
  prop: 'reviewTime',
  width: '160'
}
]
//复核出库  复核补打印
export const replenishPrint = [
{
  label: '仓库',
  prop: 'warehouseName',
  isTemplate: true
},
{
  label: '包裹号',
  prop: 'packageNum',
  width: '150',
  sortable: true,
},
{
  label: '订单类型',
  prop: 'orderType',
  isCodeTableFormatter: true,
},
{
  label: '订单号',
  prop: 'waybillNum',
  width: '150',
  sortable: true,
},
{
  label: '邮寄方式',
  prop: 'mailingMethod',
}, {
  label: '商品数',
  prop: 'numberOfPackages',
}, {
  label: '包装人',
  prop: 'packagesUserName',
  sortable: true,
}, {
  label: '包装时间',
  prop: 'packagesTime',
  width: '160',
  sortable: true,
}
]
//  按单复核列
export const orderReviewCols = [{
  label: '图片',
  prop: 'img', // 查商品那边
  isTemplate: true

}, {
  label: 'SKU',
  prop: 'sku',
}, {
  label: '商品名称(规格)',
  prop: 'sName',
  width: '200'
}, {
  label: '订购数',
  prop: 'pickingNum',
}, {
  label: '已检数',
  prop: 'reviewNum',
}, {
  label: '未检数', // 自己算出来
  prop: 'unchenckedNumber',
  isTemplate: true

},
]
// 调拨出库列
export const adjustmentTable = [{
  label: '图片',
  prop: 'img', // 查商品那边
  isTemplate: true
  
}, {
  label: 'SKU',
  prop: 'sku',
}, {
  label: '商品名称(规格)',
  prop: 'sName',
  width: '200'
}, {
  label: '订购数',
  prop: 'pickingNum',
}, {
  label: '已检数',
  prop: 'reviewNum',
}, {
  label: '未检数', // 自己算出来
  prop: 'unchenckedNumber',
},
]

// 异常列 批量
export const AbnormalCol = [{
  label: 'SKU',
  prop: 'sku',
  width: '200px'
}, {
  label: '数量',
  prop: 'exNumber',
  isTemplate: true
}, {
  label: '异常原因',
  prop: 'exReason',
  width: '300px',
  isTemplate: true
}
]


