<template>
<div class="yy-cont goods-allocation">
  <V-Title>
    <!-- <el-input
      clearable
      @clear="shelfInventoryList(true)"
      placeholder="请输入查询内容"
      class="input-select"
      @keyup.native.enter="shelfInventoryList(true)"
      v-model="form.inputValue">
      <el-select
        v-model="form.selectValue"
        slot="prepend"
        placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>9
      <el-button slot="append" icon="el-icon-search" @click="shelfInventoryList(true)"></el-button>
    </el-input> -->
  </V-Title>

  <div class="pl-20 pr-20 pb-10 form-select">
    <el-select
    	clearable
      filterable
    	v-model="form.customer"
    	placeholder="请选择客户名称">
      <el-option v-for="item in customerList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <!-- <el-select
    	clearable
    	v-model="form.shipper"
    	placeholder="请选择货主">
      <el-option v-for="item in shipperList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select> -->
    <el-select
    	clearable
    	v-model="form.warehouseCode"
      @change="warehouseChange"
    	placeholder="请选择仓库名称">
      <el-option v-for="item in warehouseList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select
    	clearable
      :disabled="!form.warehouseCode"
    	v-model="form.areaCode"
    	placeholder="请选择库区">
      <el-option v-for="item in areaList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.areaCode">
      </el-option>
    </el-select>
    <el-input
      clearable
      @clear="shelfInventoryList(true)"
      placeholder="请输入查询内容"
      class="customer input-select"
      @keyup.native.enter="shelfInventoryList(true)"
      v-model="form.inputValue">
      <el-select
        v-model="form.selectValue"
        slot="prepend"
        placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-input>
    <el-button type="primary" @click="shelfInventoryList(true)">查询</el-button>
  	<el-button type="text" @click="handleReset">重置</el-button>
	</div>
  <div class="pl-20 pr-20 table-container">
		<div class="fw6" style="line-height:34px;">货位库存列表</div>

    <V-Table
      @review="handleReview"
      @sort-change="handleSort"
      :dataSource="dataSource">
    </V-Table>

    <el-pagination
      class="pt-20 pb-20"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="shelfInventoryList()"
      @size-change="shelfInventoryList()"
      :page-sizes="pageSizes"
      :current-page.sync="pageNum"
      :page-size.sync="pageSize"
      :total="total">
    </el-pagination>
  </div>
  <el-dialog
    class="cust-dialog"
    :before-close="handleClose"
    :visible.sync="dialogVisible">
    <V-Title :title="dialogTitle">
      <!-- <div>
        <el-input
          clearable
          placeholder="请输入查询内容"
          v-model="formDialog.inputValue"
          @keyup.native.enter="pageNumDialog = 1; shelfInventoryLog();"
          class="input-select">
          <el-select
            v-model="formDialog.selectValue"
            @change="formDialog.inputValue = ''"
            slot="prepend"
            placeholder="请选择">
            <el-option
              v-for="item in optionsDialog"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="pageNumDialog = 1; shelfInventoryLog();"></el-button>
        </el-input>
      </div> -->
    </V-Title>
    <div class="pb-10 form-select">
      <el-date-picker
        v-model="formDialog.dateTimeRange"
        type="datetimerange"
        :default-time="['00:00:00', '23:59:59']"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间">
      </el-date-picker>
      <el-select
        clearable
        v-model="formDialog.changeType"
        placeholder="变动类型">
        <el-option v-for="item in MaBiaoObj.changeTypeList"
          :key="item.dataCode"
          :label="item.dataName"
          :value="item.dataName">
        </el-option>
      </el-select>
      <el-cascader
        clearable
        placeholder="业务类型"
        :options="cascaderOptions"
        @active-item-change="handleItemChange"
        v-model="formDialog.businessType"
      ></el-cascader>
      <el-input
        clearable
        placeholder="请输入查询内容"
        v-model="formDialog.inputValue"
        @keyup.native.enter="pageNumDialog = 1; shelfInventoryLog();"
        class="customer input-select">
        <el-select
          v-model="formDialog.selectValue"
          @change="formDialog.inputValue = ''"
          slot="prepend"
          placeholder="请选择">
          <el-option
            v-for="item in optionsDialog"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-button slot="append" icon="el-icon-search" @click="pageNumDialog = 1; shelfInventoryLog();"></el-button> -->
      </el-input>
      <el-button type="primary" @click="pageNumDialog = 1; shelfInventoryLog()">查询</el-button>
      <el-button type="text" style="margin-left: 0;" @click="handleResetDialog()">重置</el-button>
    </div>

    <V-Table
      :dataSource="dialogDataSource"></V-Table>
    <el-pagination
      class="pt-20 pb-20"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="shelfInventoryLog()"
      @size-change="shelfInventoryLog()"
      :page-sizes="pageSizesDialog"
      :current-page.sync="pageNumDialog"
      :page-size.sync="pageSizeDialog"
      :total="totalDialog" />

    <div>
      <el-button class="box-align-center" type="primary" @click="handleClose(); dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { GoodsAllocation as cols, GoodsAllocationLog as cols2 } from '@/columns'
import { query } from '@/config'

export default {
  name: 'WarehouseData_GoodsAllocation',
  data () {
    return {
      customerList: [], // 客户列表
      // shipperList: [], // 货主列表
      dialogVisible: false,
      dialogTitle: '', // 弹窗标题
      total: null, // 列表总数，默认设置null和0有区别
      pageNum: 1,
      pageSize: query.limit,
      pageSizes: [
        query.limit,
				query.limit * 2,
				query.limit * 5,
				query.limit * 10,
				query.limit * 20
      ],
      totalDialog: null, // 弹窗列表总数
      pageNumDialog: 1,
      pageSizeDialog: query.limit,
      pageSizesDialog: [
				query.limit,
				query.limit * 2,
				query.limit * 5,
				query.limit * 10,
				query.limit * 20
      ],
      options: [
        {
          label: 'SKU',
          value: 'goodsSku'
        },
        {
          label: '货位',
          value: 'positionCode'
        },
        {
          label: 'SPU',
          value: 'goodsSpu'
        },
        {
          label: '产品名称',
          value: 'skuName'
        }
      ],
      optionsDialog: [ // 弹窗的搜索
        {
          label: '操作人',
          value: 'updateBy'
        },
        {
          label: '来源单号',
          value: 'sourceOrderNumber'
        }
      ],
      cascaderOptions: [
        {
          label: '入库',
          value: 'put_type',
          children: []
        },
        {
          label: '出库',
          value: 'order_type',
          children: []
        },
        {
          label: '库内',
          value: 'inside_type',
          children: []
        }
        // {
        //   label: '处理',
        //   value: 'handle_way',
        //   children: []
        // },
        // {
        //   label: '异常',
        //   value: 'loss_sc_type',
        //   children: []
        // }
      ],
      areaList: [],
      form: {
        selectValue: 'goodsSku',
        inputValue: '',
        customer: '',
        shipper: '',
        warehouseCode: '',
        areaCode: ''
      },
      formDialog: {
        selectValue: 'updateBy',
        dateTimeRange: '',
        inputValue: '',
        businessType: [],
        changeType: ''
      },
      sortParams: {}, // 排序参数
      dataSource: {
        data: [], // 表格数据
        cols, // 表格的列数据
        isOperation: true, // 表格有操作列时设置
        operation: { // 表格有操作列时设置
            label: '操作', // 列名
            width: '100', // 根据实际情况给宽度
            data: [
                {
                    label: '操作日志', // 操作名称
                    emitType: 'review', // 触发父组件
                    permission: '货位库存操作日志', // 后期这个操作的权限，用来控制权限
                }
            ]
        }
      },
      dialogDataSource: {
        data: [], // 表格数据
        cols: cols2 // 表格的列数据
      }
    }
  },
  beforeRouteLeave (to, fromm, next) {
    this.dialogVisible = false
    next()
  },
  async created () {
    this.formDialog.dateTimeRange = [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 -1] // 0点到24点
    // this.shelfInventoryList() // 在search方法里操作
    Promise.all([
      // this.getSupplierOwner(),
      this.getWareHouse(), // 获取仓库名称
      this.getCustomerKv(),
    ])
    this.search()
  },
  computed: {
    startTime (val) {
      if (!this.formDialog.dateTimeRange) return ''
      return this.$utils.commonUtils.format(this.formDialog.dateTimeRange[0], 'YYYY-MM-DD HH:mm:ss')
    },
    endTime () {
      if (!this.formDialog.dateTimeRange) return ''
      return this.$utils.commonUtils.format(this.formDialog.dateTimeRange[1], 'YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    async shelfInventoryList (resetFlag) { // 货位库存列表
      if (resetFlag) {
        this.pageNum = 1
      }
      let { pageNum, pageSize } = this
      let { shipper, customer, warehouseCode, areaCode, selectValue, inputValue } = this.form
      let params = Object.assign({}, { pageNum, pageSize, shipper, customer, warehouseCode, areaCode, [selectValue]: inputValue }, this.sortParams)
      const { data: resData = {} } = await this.$api.WarehouseData.shelfInventoryList(params)
      const { list = [], total = null } = resData.pageInfo || {}
      this.total = total
      this.dataSource.data = list
    },
    async getCustomerKv () { // 客户的下拉
      const { data = [] } = await this.$api.WarehouseData.getCustomerKv()
      this.customerList = data
    },
    // async getShipperKv () { // 货主的下拉
    //   const { data = [] } = await this.$api.WarehouseData.getShipperKv()
    //   this.shipperList = data
    // },
    handleReview (index, row) { // 查看日志
      let { goodsSku, positionCode } = row
      this.dialogTitle = `货位(${ positionCode }) SKU(${ goodsSku })操作日志`
      this.dialogVisible = true
      this.shelfInventoryLog({ goodsSku, positionCode })
      if (!this.MaBiaoObj.changeTypeList || !this.MaBiaoObj.changeTypeList.length) { // 变动类型不存在才发请求
        this.batchMaTableList('change_type')
      }
      if (!this.cascaderOptions[0].children.length) {
        this.batchBusinessType()
      }
    },
    async batchBusinessType () { // 批量获取业务类型并塞到级联
      let paramsArr = this.cascaderOptions.map(item => item.value)
      const data = await this.batchMaTableList(paramsArr.join(','))
      this.cascaderOptions.forEach(item => {
        let key = Object.keys(data).find(it => it === item.value.toHump() + 'List')
        item.children = data[key].map(item => ({
          label: item.dataName,
          value: item.dataCode
        }))
      })
    },
    async shelfInventoryLog (params) { // 日志列表
      this.logParams = params || this.logParams
      let { pageNumDialog: pageNum, pageSizeDialog: pageSize, startTime, endTime } = this
      let { businessType, changeType, selectValue, inputValue, dateTimeRange } = this.formDialog
      let logParams = Object.assign({}, {
        pageNum, pageSize, businessType: businessType.join('/'), changeType, [selectValue]: inputValue
      }, dateTimeRange ? { startTime, endTime } : {} , this.logParams)
      const { data: resData = {} } = await this.$api.WarehouseData.shelfInventoryLog(logParams)
      const { list = [], total = null } = resData
      this.totalDialog = total
      this.dialogDataSource.data = list
    },
    handleClose (next) { // 关闭弹窗清除数据
      setTimeout(() => {
        this.dialogDataSource.data = []
        this.handleResetDialog(true)
      }, 500)
      typeof(next) === 'function' && next()
    },
    handleSort ({ prop, order }) { // 排序变化
      if (prop) { // 没有排序直接获取
        let sort = order === 'descending' ? 0 : 1 // 降序0，升序1
        this.sortParams = { sortedFlag: `${ prop }/${ sort }` }
      } else {
        this.sortParams = {}
      }
      this.shelfInventoryList()
    },
    warehouseChange (warehouseCode) { // 仓库切换
      this.form.areaCode = ''
      if (!warehouseCode) return
      this.getAreaKv(warehouseCode)
    },
    async getAreaKv (warehouseCode) { // 获取库区键值对
      let { data = [] } = await this.$api.WarehouseData.getAreaKv({ warehouseCode })
      this.areaList = data
    },
    handleReset () { // 重置
      this.form = this.$options.data().form
      // this.shelfInventoryList(true)
    },
    handleResetDialog (noHttp) { // 弹窗重置
      this.formDialog = this.$options.data().formDialog
      this.formDialog.dateTimeRange = [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 -1] // 0点到24点
      if (!noHttp) {
        // this.shelfInventoryLog()
      }
    },
    search () { // 右上角的刷新
      this.shelfInventoryList(true)
    },
    async handleItemChange (val) { // 业务类型级联
      let code = val[0]
      let index = this.cascaderOptions.findIndex(item => item.value === code)
      if (this.cascaderOptions[index].children.length) return // 有值不调接口获取
      const { data: resData = [] } = await this.$api.BasicConfiguration.getDictCodes({ dictCodes: code })
      if (resData.length) {
        let mapData = resData[0].dictData.map(item => {
          return {
            label: item.dataName,
            value: item.dataCode
          }
        })
        this.cascaderOptions[index].children = mapData
      }
    }
  }
}
</script>

<style lang='scss'>
.cust-dialog {
  .el-dialog__header {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
// .input-select /deep/ .el-input__inner {
//   width: 150px;
// }
// .goods-allocation /deep/ .el-dialog {
//   width: 960px;
// }
</style>
