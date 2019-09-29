const colsType1 = [ // 拣货。播种，打包（播种时候没有订单类型和包裹类型）
  {
    label: '序号',
    width: 50,
    type: 'index'
  },
  {
    label: '仓库',
    prop: 'warehouseName'
  },
  {
    label: '客户',
    prop: 'customer'
  },
  {
    label: '操作人',
    prop: 'workingPeople'
  },
  {
    label: '订单类型',
    prop: 'orderType'
  },
  {
    label: '包裹类型',
    prop: 'packageType'
  },
  {
    label: '拣货包裹数',
    prop: 'pickingPackageNum'
  },
  {
    label: '拣货商品个数',
    prop: 'pickingCommodityNum',
    width: '105'
  },
  {
    label: '拣货次数',
    prop: 'pickingTimeNum'
  },
  {
    label: '开始时间',
    prop: 'startTime'
  },
  {
    label: '结束时间',
    prop: 'endTime'
  }
]

const colsType2 = [ // 播种
  {
    label: '序号',
    width: 50,
    type: 'index'
  },
  {
    label: '仓库',
    prop: 'warehouseName'
  },
  {
    label: '客户',
    prop: 'customer'
  },
  {
    label: '操作人',
    prop: 'workingPeople'
  },
  {
    label: '播种包裹数',
    prop: 'sowingPackageNum'
  },
  {
    label: '播种商品个数',
    prop: 'sowingCommodityNum',
    width: 110
  },
  {
    label: '播种单数',
    prop: 'sowingOrderNum'
  },
  {
    label: '开始时间',
    prop: 'startTime'
  },
  {
    label: '结束时间',
    prop: 'endTime'
  }
]

const colsType3 = [ // 打包
  {
    label: '序号',
    width: 50,
    type: 'index'
  },
  {
    label: '仓库',
    prop: 'warehouseName'
  },
  {
    label: '客户',
    prop: 'customer'
  },
  {
    label: '操作人',
    prop: 'workingPeople'
  },
  {
    label: '订单类型',
    prop: 'orderType'
  },
  {
    label: '包裹类型',
    prop: 'packageType'
  },
  {
    label: '打包包裹数',
    prop: 'packingPackageNum'
  },
  {
    label: '打包商品个数',
    prop: 'packingCommodityNum',
    width: 110
  },
  {
    label: '开始时间',
    prop: 'startTime'
  },
  {
    label: '结束时间',
    prop: 'endTime'
  }
]

const colsType4 = [ // 集包
  {
    label: '序号',
    width: 50,
    type: 'index'
  },
  {
    label: '仓库',
    prop: 'warehouseName'
  },
  {
    label: '客户',
    prop: 'customer'
  },
  {
    label: '操作人',
    prop: 'workingPeople'
  },
  {
    label: '集包袋数',
    prop: 'packageBagNum'
  },
  {
    label: '集包包裹数',
    prop: 'packageNum'
  },
  {
    label: '包裹总重量(kg)',
    prop: 'packageTotalWeight',
    width: '125'
  },
  // {
  //   label: '集包解散次数',
  //   prop: 'packageDissolutionNum'
  // },
  {
    label: '开始时间',
    prop: 'startTime'
  },
  {
    label: '结束时间',
    prop: 'endTime'
  }
]

const colsType5 = [ // 发货
  {
    label: '序号',
    width: 50,
    type: 'index'
  },
  {
    label: '仓库',
    prop: 'warehouseName'
  },
  {
    label: '客户',
    prop: 'customer'
  },
  {
    label: '操作人',
    prop: 'workingPeople'
  },
  {
    label: '发货袋数',
    prop: 'deliveryBagNum'
  },
  {
    label: '发货包裹数',
    prop: 'deliveryPackageNum'
  },
  {
    label: '发货次数',
    prop: 'deliveryTimeNum'
  },
  {
    label: '包裹总重量(kg)',
    prop: 'packageWeightSum',
    width: '125'
  },
  {
    label: '开始时间',
    prop: 'startTime'
  },
  {
    label: '结束时间',
    prop: 'endTime'
  }
]

export default {
  colsType1,
  colsType2,
  colsType3,
  colsType4,
  colsType5
}
  