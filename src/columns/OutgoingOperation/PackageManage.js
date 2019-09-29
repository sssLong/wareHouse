export default [
  {
    label: '序号',
    type: 'index',
    width: 50
  },
  {
    label: '仓库',
    prop: 'warehouseName',
    isTemplate: true
  },
  {
    label: '集包单号',
    prop: 'packageOrderNum',
    sortable: 'custom',
    width: 150
  },
  {
    label: '单据状态',
    prop: 'packageStatus',
    isCodeTableFormatter: true,
    codeTableCode: 'collect_package_status'
  },
  {
    label: '订单类型',
    prop: 'orderType',
    isCodeTableFormatter: true
  },
  {
    label: '揽收商',
    prop: 'receiver',
    sortable: 'custom'
  },
  {
    label: '邮寄方式',
    prop: 'mailingMethod',
    sortable: 'custom'
  },
  {
    label: '包裹数',
    prop: 'packageSum'
  },
  {
    label: '包裹重量(kg)',
    prop: 'packageWeightSum',
    width: '105'
  },
  {
    label: '集包人',
    prop: 'packageUserName'
  },
  {
    label: '集包开始时间',
    prop: 'packageStartTime',
    sortable: 'custom',
    width: 160
  },
  {
    label: '集包结束时间',
    prop: 'packageEndTime',
    sortable: 'custom',
    width: 160
  }
]
