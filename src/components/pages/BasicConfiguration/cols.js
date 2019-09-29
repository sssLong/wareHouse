/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 17:53:02
 * @LastEditTime: 2019-08-10 16:41:03
 * @LastEditors: Please set LastEditors
 */
// SKU信息
export const SKUCols = [{
            label: '序号',
            width: '80',
            type: "index"
        },
        {
            label: '产品图片',
            prop: 'productPictures',
            isImagePopover: true
                // isTemplate: true // 需要时设置
        },
        {
            label: 'SKU',
            prop: 'productSku',

        },
        {
            label: '产品名称',
            prop: 'productName',
        },
        {
            label: '属性',
            prop: 'productAttribute',
        },
        {
            label: '长/宽/高(mm)',
            prop: 'zip',
            isTemplate: true, // 需要时设置
            'min-width': '120px',
        },
        {
            label: '体积(mm³)',
            prop: 'zip1',
            isTemplate: true, // 需要时设置
            'min-width': '120px',
        },
        {
            label: '重量(g)',
            prop: 'packageWeight',
        },
        {
            label: '客户名称',
            prop: 'customerName',
        },
        {
            label: '货主',
            prop: 'shipperName',
        },
        {
            label: '创建/修改时间',
            prop: 'updateTime',
            sortable: true,
            'min-width': '160px'
        }
    ]
    // 供应商信息
export const supplierCols = [{
            label: '序号',
            width: '50',
            type: "index"
        },
        {
            label: '供应商名称',
            prop: 'supplierName',
        },
        {
            label: '供应商等级',
            prop: 'supplierLevel',

        },
        {
            label: '采购员',
            prop: 'buyer',
        },
        {
            label: '供应链专员',
            prop: 'supplyChainCoordinator',
        },
        {
            label: '所属货主',
            prop: 'ownerOfCargo',
        },
        {
            label: '联系人',
            prop: 'contactsFirst',
        },
        {
            label: '电话/手机',
            prop: 'contactsFirstPhone',
        },
        {
            label: '创建/修改时间',
            prop: 'updateTime',
            sortable: true,
            'min-width': '160px'
        }
    ]
    // 仓库管理  仓库
export const warehouseCols = [{
            label: '序号',
            width: '50',
            type: "index"
        },
        {
            label: '仓库编码',
            prop: 'warehouseCode',
        },
        {
            label: '仓库名称',
            prop: 'warehouseName',

        },
        {
            label: '仓库类型',
            prop: 'warehouseType',
        },
        {
            label: '运营类型',
            prop: 'serviceType',
        },
        {
            label: '所在国家',
            prop: 'country',
        },
        {
            label: '是否启用',
            prop: 'zip',
            isTemplate: true // 需要时设置
        },
        {
            label: '创建人/修改人',
            prop: 'updateBy',
            'min-width': '120px'
        },
        {
            label: '创建/修改时间',
            prop: 'updateTime',
            sortable: true,
            'min-width': '160px'
        },
        {
            label: '单据来源',
            prop: 'orderFrom',
        }
    ]
    // 仓库管理  库区
export const areaCols = [{
            label: '序号',
            width: '50',
            type: "index"
        },
        {
            label: '库区编码',
            prop: 'areaCode',
        },
        {
            label: '库区名称',
            prop: 'areaName',

        },
        {
            label: '仓库名称',
            prop: 'warehouseName',
        },
        {
            label: '分区功能',
            prop: 'areaFunction',
        },
        {
            label: '分区楼层',
            prop: 'areaFloor',
        },
        {
            label: '绑定分类',
            prop: 'categoryList',
            'min-width': '180px',
            'show-overflow-tooltip': true
        },
        {
            label: '库区状态',
            prop: 'zip',
            isTemplate: true // 需要时设置
        },
        {
            label: '管理员',
            // prop: 'areaManager',
            prop: 'zip1',
            isTemplate: true, // 需要时设置
            'min-width': '120px',
            'show-overflow-tooltip': true
        },
        {
            label: '创建人/修改人',
            prop: 'updateBy',
            'min-width': '120px'
        },
        {
            label: '创建/修改时间',
            prop: 'updateTime',
            sortable: true,
            'min-width': '160px'
        },
        {
            label: '描述',
            prop: 'areaRemark',
            'min-width': '180px',
            'show-overflow-tooltip': true
        }
    ]
    // 仓库管理  货列
export const shipmentCols = [{
            label: '序号',
            width: '50',
            type: "index"
        },
        {
            label: '仓库名称',
            prop: 'warehouseName',
        },
        {
            label: '库区编码',
            prop: 'areaCode',

        },
        {
            label: '库区名称',
            prop: 'areaName',
        },
        {
            label: '分区功能',
            prop: 'areaFunction',
        },
        {
            label: '分区楼层',
            prop: 'areaFloor',
        },
        {
            label: '货列编码',
            prop: 'rowCode',
        },
        {
            label: '货列状态',
            prop: 'zip',
            isTemplate: true // 需要时设置
        },
        {
            label: '创建人/修改人',
            prop: 'updateBy',
            'min-width': '120px'
        },
        {
            label: '创建/修改时间',
            prop: 'updateTime',
            sortable: true,
            'min-width': '160px'
        },
        {
            label: '描述',
            prop: 'rowRemark',
            'min-width': '180px',
            'show-overflow-tooltip': true
        }
    ]
    // 仓库管理  货位
export const goodLocCols = [{
            label: '序号',
            width: '50',
            type: "index"
        },
        {
            label: '仓库名称',
            prop: 'warehouseName',
        },
        {
            label: '库区编码',
            prop: 'areaCode',

        },
        {
            label: '库区名称',
            prop: 'areaName',
        },
        {
            label: '分区功能',
            prop: 'areaFunction',
        },
        {
            label: '分区楼层',
            prop: 'areaFloor',
        },
        {
            label: '货列编码',
            prop: 'rowCode',
        },
        {
            label: '货架编码',
            prop: 'shelvesCode',
        },
        {
            label: '货位编码',
            prop: 'positionCode',
        },
        {
            label: '长/宽/高(mm)',
            prop: 'zip',
            'min-width': '120px',
            isTemplate: true // 需要时设置
        },
        {
            label: '体积(mm³)',
            prop: 'volume',
            'min-width': '120px',
        },
        {
            label: '分类',
            prop: 'categoryList',
            'min-width': '180px',
            'show-overflow-tooltip': true
        },
        {
            label: '是否锁定',
            prop: 'zip1',
            isTemplate: true // 需要时设置
        },
        // {
        //     label: '货位状态',
        //     prop: 'zip2',
        //     isTemplate: true // 需要时设置
        // },
        {
            label: '货位类型',
            prop: 'positionType'
        },
        {
            label: '创建人/修改人',
            prop: 'updateBy',
            'min-width': '120px',
        },
        {
            label: '创建/修改时间',
            prop: 'updateTime',
            sortable: true,
            'min-width': '180px',
        }
    ]
    // 仓库管理  分类
export const classCols = [{
            label: '序号',
            width: '50',
            type: "index"
        },
        {
            label: '仓库编码',
            prop: 'warehouseCode',
        },
        {
            label: '仓库名称',
            prop: 'warehouseName',

        },
        {
            label: '仓库类型',
            prop: 'warehouseType',
        },
        {
            label: '运营类型',
            prop: 'warehouseType',
        },
        {
            label: '所在国家',
            prop: 'country',
        },
        {
            label: '是否启用',
            prop: 'warehouseType',
        },
        {
            label: '创建人/修改人',
            prop: 'updateBy',
            'min-width': '120px'
        },
        {
            label: '创建/修改时间',
            prop: 'updateTime',
            sortable: true,
            'min-width': '160px'
        },
        {
            label: '单据来源',
            prop: 'orderFrom',
        }
    ]
    // 仓库管理  容器
export const containerCols = [{
            label: '序号',
            width: '50',
            type: "index"
        },
        {
            label: '仓库名称',
            prop: 'warehouseName',
        },
        {
            label: '容器编码',
            prop: 'containerCode',
        },
        {
            label: '容器名称',
            prop: 'containerName',
        },
        {
            label: '容器用途',
            prop: 'containerPurpose',
        },
        {
            label: '长/宽/高(mm)',
            prop: 'zip',
            'min-width': '120px',
            isTemplate: true // 需要时设置
        },
        {
            label: '体积(mm³)',
            prop: 'volume',
            'min-width': '120px',
        },
        {
            label: '重量(g)',
            prop: 'weight',
        },
        {
            label: '工作状态',
            prop: 'zip1',
            isTemplate: true // 需要时设置
        },
        {
            label: '容器状态',
            prop: 'zip2',
            isTemplate: true // 需要时设置
        },
        {
            label: '最后使用人',
            prop: 'usageBy',
            'min-width': '140px'
        },
        {
            label: '最后使用时间',
            prop: 'usageTime',
            sortable: true,
            'min-width': '160px'
        },
        {
            label: '创建人/修改人',
            prop: 'updateBy',
            'min-width': '120px'
        },
        {
            label: '创建/修改时间',
            prop: 'updateTime',
            sortable: true,
            'min-width': '160px'
        }
    ]
    // 仓库管理  质检台
export const qcStationCols = [{
            label: '序号',
            width: '50',
            type: "index"
        },
        {
            label: '仓库名称',
            prop: 'warehouseName',
        },
        {
            label: '工作台编码',
            prop: 'qcCode',
        },
        {
            label: '工作台名称',
            prop: 'qcName',

        },
        {
            label: '所属库区',
            prop: 'areaName',
        },
        {
            label: '入库类型',
            prop: 'putType',
        },
        {
            label: '工作台状态',
            prop: 'zip',
            isTemplate: true // 需要时设置
        },
        {
            label: '创建人/修改人',
            prop: 'updateBy',
            'min-width': '120px'
        },
        {
            label: '创建/修改时间',
            prop: 'updateTime',
            sortable: true,
            'min-width': '160px'
        }
    ]
    // 码表管理
export const codeCols = [{
        label: '序号',
        width: '80',
        type: "index"
    },
    {
        label: '类型编码',
        prop: 'dictCode',
        'min-width': '140px'
    },
    {
        label: '类型名称',
        prop: 'dictName',
        'min-width': '180px'
    },
    {
        label: '状态',
        prop: 'zip',
        isTemplate: true // 需要时设置
    },
    {
        label: '创建人',
        prop: 'createBy',
    },
    {
        label: '创建时间',
        prop: 'createTime',
        sortable: true,
        'min-width': '160px'
    },
    {
        label: '修改人',
        prop: 'updateBy',
        // 'min-width': '120px'
    },
    {
        label: '修改时间',
        prop: 'updateTime',
        sortable: true,
        'min-width': '160px'
    },
    {
        label: '备注',
        prop: 'dictRemark',
        'min-width': '150px',
        'show-overflow-tooltip': true
    }
]