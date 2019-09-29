export default [
  {
    label: '序号',
    type: 'index'
  },
  {
    label: '仓库',
    prop: 'warehouseName',
    isTemplate: true
  },
  {
    label: '拣货单号',
    prop: 'pickingNum',
    sortable: 'custom',
    width: 150
  },
  {
    label: '拣货单状态',
    prop: 'pickingStatus',
    isCodeTableFormatter: true,
    sortable: 'custom',
    width: 120
  },
  {
    label: '拣选区域',
    sortable: 'custom',
    prop: 'pickingRegion',
    width: 100
  },
  {
    label: '订单类型',
    prop: 'orderType',
    sortable: 'custom',
    isCodeTableFormatter: true,
    width: 100
  },
  {
    label: '包裹类型',
    prop: 'packageType',
    sortable: 'custom',
    isCodeTableFormatter: true,
    width: 120
  },
  {
    label: '包裹数量',
    prop: 'packageNumber'
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
    label: '差异标记',
    prop: 'differenceMark',
    isCodeTableFormatter: true,
    sortable: 'custom',
    codeTableCode: 'differential_markers',
    width: 120
  },
  {
    label: '取消标记',// 取两个字段决定的 先 判断 差异  在判断取消， 差异优先
    prop: 'cancelMark',
    isCodeTableFormatter: true,
    sortable: 'custom',
    codeTableCode: 'unmark',
    width: 120
  },
  {
    label: '创建人',
    prop: 'userName'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    sortable: 'custom',
    width: 160
  },
  {
    label: '拣货人',
    prop: 'pickingUserName'
  },
  {
    label: '拣货时间',
    prop: 'pickingTime',
    sortable: 'custom',
    width: 160
  }
]
