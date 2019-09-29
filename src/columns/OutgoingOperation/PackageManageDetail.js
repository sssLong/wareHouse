export default [
  {
    label: '序号',
    type: 'index',
    width: 50
  },
  {
    label: '包裹单号',
    prop: 'packageNum',
    sortable: true,
    width: 120
  },
  {
    label: '订单号',
    prop: 'orderNum',
    sortable: true,
    width: 160
  },
  {
    label: '跟踪号',
    prop: 'trackingNum',
    sortable: true,
    width: 160
  },
  {
    label: '包裹类型',
    prop: 'packageType',
    sortable: true,
    isCodeTableFormatter: true
  },
  {
    label: '邮寄方式',
    prop: 'mailingMethod'
  },
  {
    label: '包装数',
    prop: 'packageSum'
  },
  {
    label: '包裹重量(g)',
    prop: 'packageWeight',
    width: 105
  },
  {
    label: '集包人',
    prop: 'packUserName'
  },
  {
    label: '集包时间',
    prop: 'packTime',
    sortable: true,
    width: 160
  },
  {
    label: '备注',
    prop: 'remark'
  }
]
