export default [
    {
      label: '排序',
      type: 'index',
      width: 50
    },
    {
      label: '客户名称',
      prop: 'customer',
      width: '150'
    },
    {
      label: '所属仓库',
      prop: 'warehouseName'
    },
    {
      label: '图片',
      prop: 'picture',
      isImagePopover: true
    },
    {
      label: 'SKU',
      prop: 'goodsSku',
      'min-width': '150px'
    },
    {
      label: '库内良品',
      prop: 'insideGoods',
      'min-width': '100px',
      sortable: true
    },
    {
      label: '待入库良品',
      prop: 'waitingGoods',
      'min-width': '115px',
      sortable: true
    },
    {
      label: '可发货良品',
      prop: 'deliveryGoods',
      'min-width': '115px',
      sortable: true
    },
    {
      label: '订单占用',
      prop: 'orderGoods',
      'min-width': '100px',
      sortable: true
    },
    {
      label: '异常SKU数',
      prop: 'exceptionGoods',
      'min-width': '125px',
      sortable: true
    },
    {
      label: 'SKU冻结数',
      prop: 'freezeGoods',
      'min-width': '125px',
      sortable: true
    },
    {
      label: '复核良品',
      prop: 'reviewGoods',
      'min-width': '100px',
      sortable: true
    },
    {
      label: '缺货库存',
      prop: 'stockoutGoods',
      'min-width': '100px',
      sortable: true
    },
    {
      label: '来料在途',
      prop: 'procurementGoods',
      'min-width': '100px',
      sortable: true
    },
    {
      label: '调拨在途',
      prop: 'transfersGoods',
      'min-width': '100px',
      sortable: true
    },
    {
      label: 'SPU',
      prop: 'goodsSpu',
      'min-width': '115px',
    },
    {
      label: '货主',
      prop: 'shipper'
    },
    {
      label: '产品名称',
      prop: 'skuName',
      width: '200px'
    }
  ]
  