<template>
<div class="container statistics-cont yy-cont">
  <V-Title></V-Title>

  <div class="pl-20 pr-20 pb-10 form-select">
    <el-date-picker
      v-model="form.dateTimeRange"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm"
      :default-time="['00:00:00', '23:59:59']"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间">
    </el-date-picker>
    <el-select
    	clearable
      filterable
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
      @change="outboundList(); outboundCount()"
    	v-model="form.operationType"
    	placeholder="请选择操作类型">
      <el-option v-for="item in MaBiaoObj.outOperationTypeList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <!-- <el-select
    	clearable
    	v-model="form.goodsOwner"
    	placeholder="货主">
      <el-option v-for="item in MaBiaoObj.goodsOwnerList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataName">
      </el-option>
    </el-select> -->
    <el-select
    	clearable
    	v-model="form.customer"
    	placeholder="请选择客户">
      <el-option v-for="item in customerList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select
    	clearable
      @change="outboundList(); outboundCount()"
      :disabled="operationName === '播种'"
    	v-model="form.orderType"
    	placeholder="请选择订单类型">
      <el-option v-for="item in MaBiaoObj.orderTypeList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select
    	clearable
      :disabled="operationName === '播种' || orderName === '退供出库' || orderName === '调拨出库'"
    	v-model="form.packageType"
    	placeholder="请选择包裹类型">
      <el-option v-for="item in MaBiaoObj.packageTypeList"
        :key="item.dataCode"
        :label="item.dataName"
        :value="item.dataCode">
      </el-option>
    </el-select>
    <el-select
    	clearable
      filterable
    	v-model="form.workingPeople"
    	placeholder="请输入操作人">
      <el-option v-for="item in warehouseUserList"
        :key="item.id"
        :label="item.name"
        :value="item.name">
      </el-option>
    </el-select>
  	<el-button type="primary" @click="outboundList(); outboundCount()">查询</el-button>
  	<el-button type="text" @click="handleReset">重置</el-button>
	</div>

  <div class="table-outer table-container">
    <div class="table-operation">
        <div class="title">统计列表</div>
        <div class="operation ">
            <template v-if="operationName === '拣货'">
              <div class="parcel info">
                  <i class="iconfont iconshujutongji"></i>
                  <span>拣货包裹总数：{{ ~~totalData.pickingPackageNum }}</span>
              </div>
              <div class="info">
                  <span>拣货商品总个数：{{ ~~totalData.pickingCommodityNum }}</span>
              </div>
              <div class="info">
                  <span>拣货总次数：{{ ~~totalData.pickingTimeNum }}</span>
              </div>
            </template>
            <template v-if="operationName === '播种'">
              <div class="parcel info">
                  <i class="iconfont iconshujutongji"></i>
                  <span>播种包裹总数：{{ ~~totalData.sowingPackageNum }}</span>
              </div>
              <div class="info">
                  <span>播种商品总个数：{{ ~~totalData.sowingCommodityNum }}</span>
              </div>
              <div class="info">
                  <span>播种总单数：{{ ~~totalData.sowingOrderNum }}</span>
              </div>
            </template>
            <template v-if="operationName === '打包'">
              <div class="parcel info">
                  <i class="iconfont iconshujutongji"></i>
                  <span>打包包裹总数：{{ ~~totalData.packingPackageNum }}</span>
              </div>
              <div class="info">
                  <span>打包商品总个数：{{ ~~totalData.packingCommodityNum }}</span>
              </div>
            </template>
            <template v-if="operationName === '集包'">
              <div class="parcel info">
                  <i class="iconfont iconshujutongji"></i>
                  <span>集包总袋数：{{ ~~totalData.packageBagNum }}</span>
              </div>
              <div class="info">
                  <span>集包总包裹数：{{ ~~totalData.packageNum }}</span>
              </div>
              <!-- <div class="info">
                  <span>集包总解散次数：{{ ~~totalData.packageDissolutionNum }}</span>
              </div> -->
              <div class="info">
                  <span>包裹总重量：{{ $utils.commonUtils.numDiv(~~totalData.packageTotalWeight, 1000) }}kg</span>
              </div>
            </template>
            <template v-if="operationName === '发货'">
              <div class="parcel info">
                  <i class="iconfont iconshujutongji"></i>
                  <span>发货总袋数：{{ ~~totalData.deliveryBagNum }}</span>
              </div>
              <div class="info">
                  <span>发货总包裹数：{{ ~~totalData.deliveryPackageNum }}</span>
              </div>
              <div class="info">
                  <span>发货总次数：{{ ~~totalData.deliveryTimeNum }}</span>
              </div>
              <div class="info">
                  <span>包裹总重量：{{ $utils.commonUtils.numDiv(~~totalData.packageWeightSum, 1000) }}kg</span>
              </div>
            </template>
            <div class="export" @click="handleExport">
                <i class="iconfont icondaochuexcel"></i> <span>导出Excel</span>
            </div>
        </div>
    </div>

    <V-Table
      ref="tableRef"
      :dataSource="dataSource">
    </V-Table>

    <el-pagination
      class="pt-20 pb-20"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="outboundList(); outboundCount()"
      @size-change="outboundList(); outboundCount()"
      :page-sizes="pageSizes"
      :current-page.sync="pageNum"
      :page-size.sync="pageSize"
      :total="total">
    </el-pagination>
  </div>
</div>
</template>

<script>
import { OutgoingStatistics } from '@/columns'
import { query } from '@/config'

let { colsType1, colsType2, colsType3, colsType4, colsType5 } = OutgoingStatistics

export default {
  name: 'WarehouseData_OutgoingStatistics',
  data () {
    return {
      form: {
        dateTimeRange: [],
        warehouseCode: '', // 仓库id
        operationType: '', // 操作类型
        // goodsOwner: '', // 货主
        customer: '', // 客户
        orderType: '', // 订单类型
        packageType: '', // 包裹类型
        workingPeople: '' // 操作人
      },
      customerList: [], // 客户列表
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
      dataSource: {
        data: [], // 表格数据
        cols: colsType1 // 表格的列数据
      },
      totalData: {} // 总数
    }
  },
  async created () {
    this.form.dateTimeRange = [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 -1] // 0点到24点
    let { data } = await this.getWareHouse() // 获取仓库名称
    // if (data && data.length) {
    //   this.form.warehouseCode = data[0].dataCode // 仓库设置为第一个
    //   this.getAccountName(this.form.warehouseCode)
    // }
    await Promise.all([
      this.batchMaTableList('out_operation_type', 'order_type', 'package_type'), // 获取货主列表
      this.getCustomerKv()
    ])
    // 操作类型选择第一个
    let outOperationTypeList = this.MaBiaoObj['outOperationTypeList']
    if (outOperationTypeList && outOperationTypeList.length) {
      this.form.operationType = outOperationTypeList[0].dataCode // 操作类型设置为第一个
    }
    this.outboundList()
    this.outboundCount()
  },
  watch: {
    'form.operationType' () { // 操作类型变动，表格列显示变化
      this.form.orderType = ''
      this.form.packageType = ''
      if (this.operationName === '拣货') {
        this.dataSource.cols = colsType1
      } else if (this.operationName === '播种') {
        this.dataSource.cols = colsType2
      } else if (this.operationName === '打包') {
        this.dataSource.cols = colsType3
      } else if (this.operationName === '集包') {
        this.dataSource.cols = colsType4
      } else if (this.operationName === '发货') {
        this.dataSource.cols = colsType5
      }
    },
    'form.orderType' () { // 订单类型变动
      let cols = this.dataSource.cols
      if (this.orderName === '退供出库' || this.orderName === '调拨出库') {
        this.dataSource.cols = this.dataSource.cols.map(item => ({
          ...item,
          invisible: item.label === '包裹类型'
        }))
      } else {
        this.dataSource.cols = this.dataSource.cols.map(item => ({
          ...item,
          invisible: false
        }))
      }
      // this.$nextTick(this.$refs.tableRef.$children[0].doLayout)
    }
  },
  computed: {
    startTime () {
      if (!this.form.dateTimeRange) return ''
      return this.$utils.commonUtils.format(this.form.dateTimeRange[0], 'YYYY-MM-DD HH:mm')
    },
    endTime () {
      if (!this.form.dateTimeRange) return ''
      return this.$utils.commonUtils.format(this.form.dateTimeRange[1], 'YYYY-MM-DD HH:mm')
    },
    operationName () { // 操作类型的中文名称
      if (!this.MaBiaoObj.outOperationTypeList || !this.form.operationType) {
        return ''
      }
      return this.MaBiaoObj.outOperationTypeList.find(item => item.dataCode === this.form.operationType).dataName
    },
    orderName () { // 订单类型的中文名称
      if (!this.MaBiaoObj.orderTypeList || !this.form.orderType) {
        return ''
      }
      return this.MaBiaoObj.orderTypeList.find(item => item.dataCode === this.form.orderType).dataName
    }
  },
  methods: {
    passHttpCheck () { // 多个接口调用都需要这个检查，单独拿出来
      let { pageNum, pageSize, startTime, endTime } = this
      if (!this.form.dateTimeRange) {
        this.$message.error('请选择时间范围')
        return false
      }
      // if (!this.form.warehouseCode) {
      //   this.$message.error('请选择仓库')
      //   return false
      // }
      if (!this.form.operationType) {
        this.$message.warning('请选择操作类型')
        return false
      }
      let formParam = {} // 去掉this.form的dateTimeRange
      for (let k in this.form) {
        if (k !== 'dateTimeRange') {
          formParam[k] = this.form[k]
        }
      }
      return Object.assign({}, { pageNum, pageSize, startTime, endTime }, formParam)
    },
    async getCustomerKv () { // 客户的下拉
      const { data = [] } = await this.$api.WarehouseData.getCustomerKv()
      this.customerList = data
    },
    async outboundList () { // 获取出库列表
      let params = this.passHttpCheck()
      if (!params) return
      const { data: resData = {} } = await this.$api.WarehouseData.outboundList(params)
      const { list = [], total } = resData
      this.total = total
      let { startTime, endTime } = this
      this.dataSource.data = list.map(item => {
        item.startTime = startTime
        item.endTime = endTime
        item.packageTotalWeight = this.$utils.commonUtils.numDiv(item.packageTotalWeight, 1000)
        item.packageWeightSum = this.$utils.commonUtils.numDiv(item.packageWeightSum, 1000)
        return item
      })
    },
    search () { // 右上角的刷新
      // 码表完了会调用search传入data，点击右上角刷新不会传入data
      this.outboundList()
      this.outboundCount()
    },
    warehouseChange (val) { // 仓库更换，操作人列表重新获取
      this.warehouseUserList = []
      this.form.workingPeople = ''
      this.getAccountName(val)
    },
    handleReset () { // 重置
      this.form = this.$options.data().form
      this.form.dateTimeRange = [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 -1] // 0点到24点
    },
    async outboundCount (params) { // 总数查询
      params = this.passHttpCheck(params)
      if (!params) return
      const { data: resData = {} } = await this.$api.WarehouseData.outboundCount(params)
      this.totalData = resData
    },
    async handleExport (params) { // 导出Excel
      params = this.passHttpCheck(params)
      if (!params) return
      let url = '/center/outbound/export'
      this.$utils.commonUtils.export('get', url, params, '出库统计导出表', '.xls')
    }
  }
}
</script>
