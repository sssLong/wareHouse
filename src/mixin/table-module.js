/*
* @Author: 李涛
* @describe: 用于表格分页操作的混入
* @last update: 2019年8月1日9:28:23
*/

import axios from '../common/axiosHttp'
import qs from 'qs'
export default {
  data () {
    return {
      // 设置属性
      mixinTableModuleOptions: {
        activatedIsNeed: false,   // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListURL: '',       // 数据列表接口，API地址
        getDataListIsPage: false, // 数据列表接口，是否需要分页？
        getDataListType: 'post',  // 数据列表接口, 请求方式
        getDataListParamsType: 'data', // 在post请求时参数的形式
        getDataListIsReturn: false,// 是否不进行赋值并返回结果, 用于接口返回的数据结构不确定的情况, return 数据自行进行操作
        deleteURL: '',            // 删除接口，API地址
        deleteIsBatch: false,     // 删除接口，是否需要批量？
        deleteIsBatchKey: 'id'    // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
      },
      // 默认属性
      dataForm: {},               // 查询条件
      dataList: [],               // 数据列表
      order: 'desc',              // 排序，asc/desc
      orderField: '',             // 排序，字段
      pageNum: 1,                 // 当前页码
      pageSize: 10,               // 每页数
      total: 0,                   // 总条数
      dataListLoading: false,     // 数据列表，loading状态
      dataListSelections: [],     // 数据列表，多选项
      addOrUpdateVisible: false   // 新增／更新，弹窗visible状态
    }
  },
  activated () {
    if (this.mixinTableModuleOptions.activatedIsNeed) {
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    async getDataList () {
      this.$set(this.dataSource, 'loading', true)
      let params = {
        order: this.order,
        orderField: this.orderField,
        ...this.dataForm
      }
      /*
      * 可怕的后端连个分页参数都不能统一, 导致参数需要做一个判断
      * 如果页面中定义了 page 和 row 则使用这两个做为分页参数
      * */
      params[(this.page && this.row) ? 'page' : 'pageNum'] = this.mixinTableModuleOptions.getDataListIsPage ? this.pageNum : null
      params[(this.page && this.row) ? 'row' : 'pageSize'] = this.mixinTableModuleOptions.getDataListIsPage ? this.pageSize : null
      // 请求方法配置, 为什么有些人喜欢用 get, 有些人喜欢用 post 呢?
      let config = {
        url: `${this.mixinTableModuleOptions.getDataListURL}${this.mixinTableModuleOptions.getDataListType === 'post' ? '': ('?'+qs.stringify(params))}`,
        method: this.mixinTableModuleOptions.getDataListType
      }
      // 请求参数配置, 为什么同样是post请求方式, 而参数有些是 body 有些则是 query
      if (this.mixinTableModuleOptions.getDataListType === 'post') {
        config[this.mixinTableModuleOptions.getDataListParamsType] = params
      }
      try {
        let res = await axios(config)
        console.log('getDataList() 数据' ,res)
        this.$set(this.dataSource, 'loading', false)
        if (res.errorCode !== '100200') {
          this.dataList = []
          this.total = 0
        }
        let isPage = this.mixinTableModuleOptions.getDataListIsPage
        this.total = isPage ? res.data.pageInfo.total : 0
        // 某些情况下, 需要页面自己去赋值
        if(!this.mixinTableModuleOptions.getDataListIsReturn) {
          if (this.dataSource) {
            this.dataSource.data = isPage ? res.data.pageInfo.list : res.data
          } else {
            this.dataList = isPage ? res.data.pageInfo.list : res.data
          }
        }
        // 回调方法
        this.getDataListCallback && this.getDataListCallback(res)
        return res
      } catch(err) {
        console.error(err);
      }
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 排序
    dataListSortChangeHandle (column) {
      if (!column.order || !column.prop) {
        this.order = 'desc'
        this.orderField = ''
        return false
      }
      this.order = column.order.replace(/ending/, '')
      this.orderField = column.prop
      this.getDataList()
    },
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.pageNum = 1
      this.pageSize = val
      this.getDataList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.pageNum = val
      this.getDataList()
    },
    // 过滤未选择一项的情况下操作
    filterSelections() {
      if (this.dataListSelections.length < 1) {
        this.$message.error('请先至少选择一项再进行操作');
        return false
      }
      return true
    }
  }
}
