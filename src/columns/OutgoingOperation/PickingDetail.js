export default [
  {
    label: '序号',
    type: 'index',
    width: 50
  },
  {
    label: '包裹号',
    prop: 'packageNum',
    width: 120
  },
  {
    label: '订单号',
    prop: 'orderNum',
    width: 120
  },
  {
    label: '周转箱号',
    prop: 'crateNum'
  },
  {
    label: '拣选区域',
    prop: 'pickingRegion',
    sortable: true,
    width: 100
  },
  {
    label: 'SKU',
    prop: 'sku',
    width: 100
  },
  {
    label: '商品名称',
    prop: 'sName'
  },
  {
    label: '计划商品数',
    prop: 'planProductSum',
    width: 100
  },
  {
    label: '实际商品数',
    prop: 'actualProductNum',
    width: 100
  },
  {
    label: '差异数',
    prop: 'differenceNum'
  },
  {
    label: '拣货货位',
    prop: 'pickingLocation',
    width: 100
  },
  {
    label: '拣货人',
    prop: 'pickingUserName'
  },
  {
    label: '拣货时间',
    prop: 'pickingTime',
    sortable: true,
    width: 160
  },
  {
    label: '差异标记',
    prop: 'differenceMark',
    sortable: true,
    isCodeTableFormatter: true,
    codeTableCode: 'differential_markers',
    width: 100
  },
  {
    label: '取消标记',
    prop: 'cancelMark',
    sortable: true,
    isCodeTableFormatter: true,
    codeTableCode: 'unmark',
    width: 100
  },
  {
    label: '备注',
    prop: 'remark'
  }
]
