export default [
  {
    label: '排序',
    prop: 'd1',
    width: 50,
    type: 'index'
  },
  {
    label: '图片',
    prop: 'picture',
    isImagePopover: true
  },
  {
    // label: '货主',
    label: '客户',
    // prop: 'goodsOwner'
    prop: 'customer'
  },
  {
    label: '仓库',
    prop: 'warehouseName'
  },
  {
    label: '货区',
    prop: 'areaName',
    width: '120'
  },
  {
    label: '货位', // 货位号，还有一个是货位id
    prop: 'positionCode',
    width: '120'
  },
  {
    label: 'SKU',
    prop: 'goodsSku',
    width: '120'
  },
  {
    label: '货位良品',
    prop: 'okShelfLocation',
    sortable: 'custom',
    width: '100'
  },
  {
    label: '可分配良品',
    prop: 'distributionShelfLocation',
    sortable: 'custom',
    width: '120'
  },
  {
    label: '预上良品',
    prop: 'putawayShelfLocation',
    sortable: 'custom',
    width: '120'
  },
  {
    label: '预下良品',
    prop: 'soldoutShelfLocation',
    sortable: 'custom',
    width: '120'
  },
  {
    label: '货位冻结库存',
    prop: 'freezeShelfLocation',
    sortable: 'custom',
    width: '150'
  },
  {
    label: '异常货位库存',
    prop: 'exceptionShelfLocation',
    sortable: 'custom',
    width: '150'
  },
  {
    label: '复核货位库存',
    prop: 'reviewShelfLocation',
    sortable: 'custom',
    width: '150'
  },
  {
    label: 'SPU',
    prop: 'goodsSpu'
  },
  {
    label: '产品名称',
    prop: 'skuName',
    width: '200'
  }
]
