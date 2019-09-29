export const LogisticsAttribute = [{
    label: '物流属性编码',
    prop: 'cargoCode'
}, {
    label: '物流属性名称',
    prop: 'cargoName'
}, {
    label: '创建人',
    prop: 'createBy'
}, {
    label: '创建时间',
    prop: 'createDate',
    'min-width': '150px'
}, {
    label: '修改人',
    prop: 'updateBy'
}, {
    label: '修改时间',
    prop: 'updateDate',
    'min-width': '150px'
}, {
    label: '启用状态',
    prop: 'status',
    width: '100px',
    isTemplate: true
}]

export const PlatformInfo = [{
    label: '平台编码',
    prop: 'platformCode'
}, {
    label: '平台名称',
    prop: 'platformCn'
}, {
    label: '平台英文名称',
    prop: 'platformEn'
}, {
    label: '创建人',
    prop: 'createBy'
}, {
    label: '创建时间',
    prop: 'createDate',
    'min-width': '150px'
}, {
    label: '修改人',
    prop: 'updateBy'
}, {
    label: '修改时间',
    prop: 'updateDate',
    'min-width': '150px'
}, {
    label: '平台状态',
    prop: 'status',
    width: '100px',
    isTemplate: true
}]

export const AddressSetting = [{
    label: '地址类型',
    prop: 'type',
    isTemplate: true
}, {
    label: '地址设置名称',
    prop: 'addressName'
}, {
    label: '创建人',
    prop: 'createBy'
}, {
    label: '创建时间',
    prop: 'createDate',
    'min-width': '150px'
}, {
    label: '修改人',
    prop: 'updateBy'
}, {
    label: '修改时间',
    prop: 'updateDate',
    'min-width': '150px'
}]

export const CollectManage = [{
    label: '揽收商名称',
    prop: 'collectorName',
    'min-width': '150px'
}, {
    label: '揽收商编码',
    prop: 'collectorCode',
    'min-width': '150px'
}, {
    label: '创建时间',
    prop: 'createDate',
    'min-width': '150px'
}, {
    label: '修改时间',
    prop: 'updateDate',
    'min-width': '150px'
}, {
    label: '启用状态',
    prop: 'status',
    width: '100px',
    isTemplate: true
}]

export const LogisticsHandleFailure = [{
    label: '包裹号',
    prop: 'packageNum'
}, {
    label: '跟踪单号',
    prop: 'trackingNum'
}, {
    label: '平台',
    prop: 'salesChannels',
    isTemplate: true
}, {
    label: '订单号',
    prop: 'orderNum',
}, {
    label: '运单号',
    prop: 'waybillNum',
    'min-width': '100px'
}, {
    label: '面单信息',
    prop: 'printUrl',
    'show-overflow-tooltip': true,
    'min-width': '100px'
}, {
    label: '运输方式',
    prop: 'mailingMethod',
    'min-width': '120px'
}, {
    label: '国家',
    prop: 'destination'
}, {
    label: '配货时间',
    prop: 'distributionTime',
    'min-width': '150px'
}, {
    label: '物流商信息',
    prop: 'receiverMark',
    'show-overflow-tooltip': true,
    'min-width': '150px'
}]

export const CollectManageDetails = [{
    label: '物流商简称',
    prop: 'logisticsShortened'
}, {
    label: '运输方式代码',
    prop: 'methodCode'
}, {
    label: '运输方式名称',
    prop: 'methodCnName'
}, {
    label: '状态',
    prop: 'isValidMethod',
    isTemplate: true
}]

export const LogisticsManManage = [{
        label: '物流商简称',
        prop: 'logisticsShortened'
    },
    {
        label: '物流商编码',
        prop: 'logisticsCode'
    },
    {
        label: '面单序列号',
        prop: 'id'
    },
    {
        label: '物流商类型',
        prop: 'logisticsType',
        isTemplate: true
    },
    {
        label: '修改人',
        prop: 'updateBy'
    },
    {
        label: '修改时间',
        prop: 'updateDate'
    },
    {
        label: '启用状态',
        prop: 'isValid',
        isTemplate: true
    },

]
export const transportType = [{
        label: '运输方式名称',
        prop: 'methodCnName'
    },
    {
        label: '运输方式编码',
        prop: 'methodCode'
    },
    {
        label: '启用状态',
        prop: 'HasTrackingNumber',
        isTemplate: true
    },

]

export const testData = [{
        "orderType": "1",
        "pickingType": "N",
        "waybillNum": "wls72901",
        "pickWay": null,
        "destination": "CN",
        "orderNum": "order_1111",
        "orderStatus": "7",
        "shopName": "没有店名",
        "remark": "包裹备注",
        "latestDeliveryTime": "2019-07-28 18:51:20",
        "receiverCode": "1",
        "buyerId": null,
        "mailingMethod": "顺丰A1",
        "packageType": "2",
        "warehouseName": "中山仓",
        "warehouseCode": "2",
        "foundTime": "2019-07-28 18:51:20",
        "payMoney": 88,
        "warehouseID": null,
        "currency": "USD",
        "id": 62,
        "paymentTime": "2019-07-28 18:51:20",
        "packageNum": "packge_1111",
        "salesChannels": "Amazon",
        "receiver": "顺丰小哥",
        "founder": "创建人",
        "receiverMark": null,
        "mailingMethodCode": "1",
        "totalMoney": 88,
        "distributionTime": null,
        "priority": 2,
        "buyer": "买家x1",
        "trackingNum": "wlx090293",
        "createTime": "2019-07-29 10:12:29",
        "orderDetailsList": [{
            "sName": "麻瓜",
            "remark": "备注",
            "quality": "良品",
            "number": 2,
            "productSku": {
                "shipper": "a003",
                "packageWeight": 71,
                "productBrand": "好迪勿改",
                "productSize": null,
                "packageWidth": 2,
                "productUnit": "箱",
                "supplierCode": "a",
                "categoryName": null,
                "productSkuAlias": "菠萝勿改",
                "productName": "菠萝",
                "productSku": "sku103",
                "productWidth": 87,
                "productColor": null,
                "declareCustomsEn": "fruit",
                "packageLength": 5,
                "productLink": null,
                "declareCustomsCn": "水果",
                "id": 7,
                "productLength": 4,
                "productHeight": 5,
                "updateTime": "2019-07-02 17:12:45",
                "categoryCode": "3",
                "productWeight": 5,
                "productVolume": 40,
                "version": 0,
                "logisticsAttribute": "普货",
                "productAttribute": "",
                "packageHeight": 2,
                "productLwh": null,
                "packingMaterial": "纸箱",
                "productSpu": "水果勿改",
                "customsPrice": 25,
                "customer": "a101",
                "customsCode": "0111013",
                "productPictures": "zhaojiaxingTest.jpg"
            },
            "unit": "件",
            "sCode": null,
            "supplier": "麻瓜货主",
            "sEnglishName": null,
            "id": 92,
            "category": "麻瓜",
            "sku": "sku103",
            "packageNum": "packge_1111"
        }],
        "printUrl": null,
        "srList": [{
                "city": "深圳",
                "companyName": "利朗达",
                "buyerId": "mjx1",
                "sur": "王浩",
                "mobilePhone": "",
                "addressTwo": "",
                "countryCode": "CN",
                "district": "龙华",
                "isJudge": 2,
                "name": "王浩",
                "fixationPhone": "15578425445",
                "postCode": "7728",
                "countryName": "中国",
                "id": 5,
                "state": "广东",
                "addressOne": "深圳民治1970",
                "email": "88529425@163.com",
                "packageNum": "packge_1111"
            },
            {
                "city": "深圳",
                "companyName": "利朗达",
                "buyerId": "mjx1",
                "sur": "田烨",
                "mobilePhone": "",
                "addressTwo": "",
                "countryCode": "CN",
                "district": "龙华",
                "isJudge": 1,
                "name": "田烨",
                "fixationPhone": "15578425445",
                "postCode": "7728",
                "countryName": "中国",
                "id": 6,
                "state": "广东",
                "addressOne": "深圳民治1970",
                "email": "88529425@163.com",
                "packageNum": "packge_1111"
            }
        ],
        "customer": "a102"
    },
    {
        "orderType": "1",
        "pickingType": "N",
        "waybillNum": "wls72901",
        "pickWay": null,
        "destination": "CN",
        "orderNum": "order_1111",
        "orderStatus": "7",
        "shopName": "没有店名",
        "remark": "包裹备注",
        "latestDeliveryTime": "2019-07-28 18:51:20",
        "receiverCode": "1",
        "buyerId": null,
        "mailingMethod": "顺丰A1",
        "packageType": "2",
        "warehouseName": "中山仓",
        "warehouseCode": "2",
        "foundTime": "2019-07-28 18:51:20",
        "payMoney": 88,
        "warehouseID": null,
        "currency": "USD",
        "id": 62,
        "paymentTime": "2019-07-28 18:51:20",
        "packageNum": "packge_1111",
        "salesChannels": "Amazon",
        "receiver": "顺丰小哥",
        "founder": "创建人",
        "receiverMark": null,
        "mailingMethodCode": "1",
        "totalMoney": 88,
        "distributionTime": null,
        "priority": 2,
        "buyer": "买家x1",
        "trackingNum": "wlx090293",
        "createTime": "2019-07-29 10:12:29",
        "orderDetailsList": [{
            "sName": "麻瓜",
            "remark": "备注",
            "quality": "良品",
            "number": 2,
            "productSku": {
                "shipper": "a003",
                "packageWeight": 71,
                "productBrand": "好迪勿改",
                "productSize": null,
                "packageWidth": 2,
                "productUnit": "箱",
                "supplierCode": "a",
                "categoryName": null,
                "productSkuAlias": "菠萝勿改",
                "productName": "菠萝",
                "productSku": "sku103",
                "productWidth": 87,
                "productColor": null,
                "declareCustomsEn": "fruit",
                "packageLength": 5,
                "productLink": null,
                "declareCustomsCn": "水果",
                "id": 7,
                "productLength": 4,
                "productHeight": 5,
                "updateTime": "2019-07-02 17:12:45",
                "categoryCode": "3",
                "productWeight": 5,
                "productVolume": 40,
                "version": 0,
                "logisticsAttribute": "普货",
                "productAttribute": "",
                "packageHeight": 2,
                "productLwh": null,
                "packingMaterial": "纸箱",
                "productSpu": "水果勿改",
                "customsPrice": 25,
                "customer": "a101",
                "customsCode": "0111013",
                "productPictures": "zhaojiaxingTest.jpg"
            },
            "unit": "件",
            "sCode": null,
            "supplier": "麻瓜货主",
            "sEnglishName": null,
            "id": 92,
            "category": "麻瓜",
            "sku": "sku103",
            "packageNum": "packge_1111"
        }],
        "printUrl": null,
        "srList": [{
                "city": "深圳",
                "companyName": "利朗达",
                "buyerId": "mjx1",
                "sur": "王浩",
                "mobilePhone": "",
                "addressTwo": "",
                "countryCode": "CN",
                "district": "龙华",
                "isJudge": 2,
                "name": "王浩",
                "fixationPhone": "15578425445",
                "postCode": "7728",
                "countryName": "中国",
                "id": 5,
                "state": "广东",
                "addressOne": "深圳民治1970",
                "email": "88529425@163.com",
                "packageNum": "packge_1111"
            },
            {
                "city": "深圳",
                "companyName": "利朗达",
                "buyerId": "mjx1",
                "sur": "田烨",
                "mobilePhone": "",
                "addressTwo": "",
                "countryCode": "CN",
                "district": "龙华",
                "isJudge": 1,
                "name": "田烨",
                "fixationPhone": "15578425445",
                "postCode": "7728",
                "countryName": "中国",
                "id": 6,
                "state": "广东",
                "addressOne": "深圳民治1970",
                "email": "88529425@163.com",
                "packageNum": "packge_1111"
            }
        ],
        "customer": "a102"
    }
]
