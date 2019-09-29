// 账号管理表格
export const AccountManagetable = [
    {
        label: '序号',
        // prop: 'id',
        type:'index',
        width: '50'
    },
    {
        label: '账号',
        prop: 'account',
        width: ''

    },
    {
        label: '姓名',
        prop: 'name',
        width: '100'

    },
    {
        label: '公司名称',
        prop: 'companyName',
        width: '100',
        'show-overflow-tooltip':true

    },
    {
        label: '部门名称',
        prop: 'departmentName',
        width: '100',
        'show-overflow-tooltip':true

    },
    {
        label: '职位',
        prop: 'position',
        width: '100',
        'show-overflow-tooltip':true
    },
    {
        label: '联系方式',
        prop: 'contactWay',
        width: '130',
    },
    {
        label: '角色',
        prop: 'roleList',
        width: '200',
        'show-overflow-tooltip':true
    },
    {
        label: '所属仓库',
        prop: 'warehouseNameList',
        width: '200',
        'show-overflow-tooltip':true
    },
    {
        label: '创建人',
        prop: 'createBy',
        width: '80'
    },
    {
        label: '创建时间',
        prop: 'createTime',
        width: '140',
        'show-overflow-tooltip':true
    },
    {
        label: '启用',
        prop: 'enabled',
        width: '100',
        isTemplate: true
    },
];

export const rolestable =[
    {
        label: '序号',
        // prop: 'index',
        type:'index'
    },
    {
        label: '角色名称',
        prop: 'roleName',
    },
    {
        label: '所属仓库',
        prop: 'warehouseName',
        'show-overflow-tooltip':true
    },
    {
        label: '创建人',
        prop: 'createBy',
    },
    {
        label: '创建时间',
        prop: 'createTime',
    },
]

export const ClientInfoTable =[   //客户信息表格
    {
        label: '序号',
        type:'index'
    },
    {
        label: '客户编码',
        prop: 'customerCode',
    },
    {
        label: '客户中文名',
        prop: 'chineseName',
    },
    {
        label: '客户英文名',
        prop: 'englishName',
    },
  {
        label: '客户状态',
        prop: 'status',
        isTemplate: true // 需要时设置
    },
    {
        label: '省/州',
        prop: 'provincial',
    },

    {
        label: '城市',
        prop: 'city',
    },

    {
        label: '区/县',
        prop: 'district',
    },

    {
        label: '创建人',
        prop: 'createBy',
    },

    {
        label: '创建时间',
        prop: 'createTime',
    },

    {
        label: '修改人',
        prop: 'lastUpdateBy',
    },
    {
        label: '修改时间',
        prop: 'lastUpdateTime',
    },

]

export const shipperInfoTable =[   //货主信息表格
    {
        label: '序号',
        type:'index'
    },
    {
        label: '货主编码',
        prop: 'shipperCode',
    },
    {
        label: '货主名称',
        prop: 'shipperName',
    },
    {
        label: '省',
        prop: 'provincial',
    },
    {
        label: '市',
        prop: 'city',
    },
    {
        label: '区',
        prop: 'district',
    },

    {
        label: '详细地址',
        prop: 'address',
    },

    {
        label: '联系人',
        prop: 'contacts',
    },

    {
        label: '联系方式',
        prop: 'contactWay',
    },

    {
        label: '创建人',
        prop: 'createBy',
    },

    {
        label: '创建时间',
        prop: 'createTime',
    },
    {
        label: '最后修改人',
        prop: 'lastUpdateBy',
    },
    {
        label: '修改时间',
        prop: 'lastUpdateTime',
    }
]

// 公告管理
export const NoticeManagermentCols = [
    {
      label:'标题',
      prop:'title'
    },
    {
      label:'创建人',
      prop:'createBy'
    },
    {
      label:'创建时间',
      prop:'createTime'
    },
    {
      label:'修改人',
      prop:'lastUpdateBy'
    },
    {
      label:'修改时间',
      prop:'lastUpdateTime'
    }
] 
