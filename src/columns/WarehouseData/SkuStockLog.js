export default [
    {
      label: '序号',
      type: 'index',
      width: 50
    },
    {
      label: '客户名称',
      prop: 'customer',
      width: '150'
    },
    {
      label: '仓库',
      prop: 'warehouseName'
    },
    {
      label: '变动类型',
      prop: 'changeType'
    },
    {
      label: '业务类型',
      prop: 'businessType'
    },
    {
      label: '改变前库存',
      prop: 'initialInventory',
      width: 110
    },
    {
      label: '变动数量',
      prop: 'changeNumbers'
    },
    {
      label: '改变后库存',
      prop: 'endingInventory',
      width: 110
    },
    {
      label: '操作时间',
      prop: 'updateTime',
      sortable: true,
      width: '160'
    },
    {
      label: '操作人',
      prop: 'updateBy'
    },
    {
      label: '来源单号',
      prop: 'sourceOrderNumber',
      width: '150'
    }
  ]
  